type GeminiTtsLanguage = 'si' | 'ar';

let activeAudio: HTMLAudioElement | null = null;
let activeObjectUrl: string | null = null;
let activeController: AbortController | null = null;
let playbackId = 0;

export function stopGeminiTts(): void {
  playbackId += 1;
  const audio = activeAudio;
  const objectUrl = activeObjectUrl;
  const controller = activeController;
  activeAudio = null;
  activeObjectUrl = null;
  activeController = null;

  if (audio) {
    audio.pause();
    audio.removeAttribute('src');
    audio.load();
  }
  if (objectUrl) URL.revokeObjectURL(objectUrl);
  controller?.abort();
}

export async function speakWithGeminiTts(
  text: string,
  language: GeminiTtsLanguage
): Promise<void> {
  stopGeminiTts();
  const currentPlaybackId = playbackId;
  const controller = new AbortController();
  activeController = controller;

  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, language }),
      signal: controller.signal,
    });

    if (!response.ok) throw new Error('Speech request failed.');
    const blob = await response.blob();
    if (currentPlaybackId !== playbackId) throw new DOMException('Playback stopped.', 'AbortError');

    const objectUrl = URL.createObjectURL(blob);
    const audio = new Audio(objectUrl);
    activeObjectUrl = objectUrl;
    activeAudio = audio;

    await new Promise<void>((resolve, reject) => {
      const cleanup = () => {
        audio.onended = null;
        audio.onerror = null;
        controller.signal.removeEventListener('abort', onAbort);
        if (activeAudio === audio) activeAudio = null;
        if (activeObjectUrl === objectUrl) {
          URL.revokeObjectURL(objectUrl);
          activeObjectUrl = null;
        }
      };
      const onAbort = () => {
        cleanup();
        reject(new DOMException('Playback stopped.', 'AbortError'));
      };

      audio.onended = () => {
        cleanup();
        resolve();
      };
      audio.onerror = () => {
        cleanup();
        reject(new Error('Audio playback failed.'));
      };
      controller.signal.addEventListener('abort', onAbort, { once: true });
      audio.play().catch((error: unknown) => {
        cleanup();
        reject(error);
      });
    });
  } finally {
    if (activeController === controller) activeController = null;
  }
}