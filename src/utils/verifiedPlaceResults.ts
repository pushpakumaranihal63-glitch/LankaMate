import type { LanguageCode } from '../types';

export interface VerifiedPlaceResult {
  name: string;
  category: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  address: string;
  source: string;
  mapsUrl: string;
}

export interface VerifiedPlaceSearch {
  status: 'results' | 'empty' | 'unresolved' | 'unavailable' | 'context_unavailable';
  places: VerifiedPlaceResult[];
  category?: string;
  origin?: { latitude: number; longitude: number; name?: string };
  presentation?: 'choose' | 'details';
}

const FOLLOWUP_LABELS: Record<LanguageCode, { choose: string; details: string }> = {
  en: { choose: 'Which of these verified results do you mean? Please name the place.', details: 'Only the search record below is verified. Hours, phone numbers, facilities, admissions, prices and travel times are not verified.' },
  si: { choose: 'මෙම තහවුරු කළ ප්‍රතිඵල අතරින් ඔබ අදහස් කරන්නේ කුමන ස්ථානයද? නම සඳහන් කරන්න.', details: 'පහත සෙවුම් දත්ත පමණක් තහවුරු කර ඇත. වේලාවන්, දුරකථන අංක, පහසුකම්, ඇතුළත් කිරීම්, මිල ගණන් හා ගමන් කාල තහවුරු කර නොමැත.' },
  ta: { choose: 'இந்த உறுதிப்படுத்தப்பட்ட முடிவுகளில் எது? இடத்தின் பெயரைக் குறிப்பிடவும்.', details: 'கீழுள்ள தேடல் பதிவு மட்டுமே உறுதிப்படுத்தப்பட்டது. நேரம், தொலைபேசி, வசதிகள், சேர்க்கை, விலை, பயண நேரம் உறுதிப்படுத்தப்படவில்லை.' },
  zh: { choose: '您指的是哪一个已核实的结果？请提供地点名称。', details: '仅以下搜索记录已核实。时间、电话、设施、入学、价格及行程时间未核实。' },
  ja: { choose: '確認済みのどの結果ですか？場所の名前を指定してください。', details: '確認済みなのは以下の検索記録のみです。営業時間、電話、設備、入学、料金、所要時間は未確認です。' },
  ko: { choose: '확인된 결과 중 어느 장소인가요? 이름을 알려 주세요.', details: '아래 검색 기록만 확인되었습니다. 운영시간, 전화번호, 시설, 입학, 가격 및 이동시간은 확인되지 않았습니다.' },
  de: { choose: 'Welches dieser bestätigten Ergebnisse meinen Sie? Bitte nennen Sie den Ort.', details: 'Nur der folgende Suchdatensatz ist bestätigt. Zeiten, Telefonnummern, Einrichtungen, Aufnahme, Preise und Reisezeiten sind nicht bestätigt.' },
  fr: { choose: 'Quel résultat vérifié désignez-vous ? Indiquez le nom du lieu.', details: 'Seul le résultat ci-dessous est vérifié. Horaires, téléphone, équipements, admissions, prix et temps de trajet ne sont pas vérifiés.' },
  es: { choose: '¿Cuál de estos resultados verificados quiere? Indique el nombre.', details: 'Solo el registro siguiente está verificado. Horarios, teléfono, instalaciones, admisiones, precios y tiempos de viaje no están verificados.' },
  ru: { choose: 'Какой подтверждённый результат вы имеете в виду? Назовите место.', details: 'Подтверждена только запись ниже. Часы, телефон, удобства, приём, цены и время пути не подтверждены.' },
  ar: { choose: 'أي نتيجة مؤكدة تقصد؟ يرجى ذكر اسم المكان.', details: 'السجل التالي فقط مؤكد. الساعات والهاتف والمرافق والقبول والأسعار ووقت السفر غير مؤكدة.' },
  hi: { choose: 'आप किस सत्यापित परिणाम की बात कर रहे हैं? स्थान का नाम बताएँ।', details: 'केवल नीचे का खोज रिकॉर्ड सत्यापित है। समय, फोन, सुविधाएँ, प्रवेश, कीमतें और यात्रा समय सत्यापित नहीं हैं।' },
  it: { choose: 'Quale risultato verificato intendi? Indica il nome del luogo.', details: 'Solo il record seguente è verificato. Orari, telefono, servizi, ammissioni, prezzi e tempi di viaggio non sono verificati.' },
  tr: { choose: 'Hangi doğrulanmış sonucu kastediyorsunuz? Yerin adını belirtin.', details: 'Yalnızca aşağıdaki kayıt doğrulanmıştır. Saatler, telefon, olanaklar, kabul, fiyatlar ve yolculuk süreleri doğrulanmamıştır.' },
};

// Text search may return roads named after a hospital or school. Only returned
// OSM tags can establish the requested category; name similarity cannot.
const PLACE_TAGS: Record<string, Record<string, string[]>> = {
  hospital: { amenity: ['hospital', 'clinic', 'doctors'], healthcare: ['hospital', 'clinic', 'doctor'] },
  school: { amenity: ['school', 'kindergarten'] },
  pharmacy: { amenity: ['pharmacy'] },
  restaurant: { amenity: ['restaurant', 'cafe', 'fast_food', 'food_court'] },
  hotel: { tourism: ['hotel', 'motel', 'guest_house', 'hostel', 'chalet', 'apartment', 'resort'] },
  fuel: { amenity: ['fuel'] },
  bank: { amenity: ['bank', 'atm'] },
  supermarket: { shop: ['supermarket'] },
  car_service: { shop: ['car_repair', 'motorcycle_repair', 'tyres'], amenity: ['vehicle_inspection'] },
  attraction: { tourism: ['attraction', 'museum', 'viewpoint', 'gallery', 'zoo', 'theme_park', 'aquarium'], historic: ['*'], leisure: ['park', 'nature_reserve'], natural: ['waterfall', 'beach'], amenity: ['place_of_worship'] },
};

export function isVerifiedPlaceCategory(category: string, record: { class?: string; type?: string }): boolean {
  const allowed = PLACE_TAGS[category]?.[record.class || ''];
  return Boolean(record.type && allowed && (allowed.includes(record.type) || allowed.includes('*')));
}

// Translate only fixed interface text. Returned names, addresses, distances and
// navigation targets never pass through a generative model or translation API.
type Labels = { title: string; notice: string; empty: string; unresolved: string; unavailable: string; maps: string };
export const VERIFIED_PLACE_LABELS: Record<LanguageCode, Labels> = {
  en: { title: 'Nearby search results', notice: 'OSM records; coverage and current status are not guaranteed. Straight-line distances from the search origin.', empty: 'No verified nearby result was found. Try another category or area.', unresolved: 'I couldn’t verify that named location in Sri Lanka. Please provide a clearer Sri Lankan city, town, or area.', unavailable: 'The nearby search could not be completed. Please check your location permission or connection and try again.', maps: 'Directions in Google Maps' },
  si: { title: 'ආසන්න ස්ථාන සෙවුම් ප්‍රතිඵල', notice: 'OSM දත්ත; සියලු ස්ථාන හෝ වත්මන් තත්ත්වය සහතික නොවේ. දුර සෙවුම් ස්ථානයේ සිට සරල රේඛාවකින් ගණනය කර ඇත.', empty: 'තහවුරු කළ ආසන්න ප්‍රතිඵලයක් හමු නොවීය. වෙනත් වර්ගයක් හෝ ප්‍රදේශයක් උත්සාහ කරන්න.', unresolved: 'එම ස්ථානය ශ්‍රී ලංකාවේ බව තහවුරු කළ නොහැකි විය. වඩා පැහැදිලි නගරයක් හෝ ප්‍රදේශයක් සඳහන් කරන්න.', unavailable: 'ආසන්න සෙවීම සම්පූර්ණ කළ නොහැකි විය. ස්ථාන අවසරය හෝ සම්බන්ධතාව පරීක්ෂා කර නැවත උත්සාහ කරන්න.', maps: 'Google Maps මාර්ග උපදෙස්' },
  ta: { title: 'அருகிலுள்ள தேடல் முடிவுகள்', notice: 'OSM பதிவுகள்; முழுமையும் தற்போதைய நிலையும் உறுதியில்லை. தேடல் இடத்திலிருந்து நேர்கோட்டுத் தூரங்கள்.', empty: 'உறுதிப்படுத்தப்பட்ட அருகிலுள்ள முடிவு கிடைக்கவில்லை. வேறு வகை அல்லது பகுதியை முயற்சிக்கவும்.', unresolved: 'இலங்கையில் அந்த இடத்தை உறுதிப்படுத்த முடியவில்லை. தெளிவான நகரம் அல்லது பகுதியைக் குறிப்பிடவும்.', unavailable: 'தேடலை முடிக்க முடியவில்லை. இருப்பிட அனுமதி அல்லது இணைப்பைச் சரிபார்த்து மீண்டும் முயற்சிக்கவும்.', maps: 'Google Maps வழிகாட்டுதல்' },
  zh: { title: '附近搜索结果', notice: 'OSM记录；覆盖范围和当前状态不保证。距离为搜索位置起算的直线距离。', empty: '未找到经核实的附近结果。请尝试其他类别或地区。', unresolved: '无法核实该地点位于斯里兰卡。请提供更明确的城市或地区。', unavailable: '无法完成附近搜索。请检查位置权限或网络连接后重试。', maps: 'Google Maps路线' },
  ja: { title: '周辺の検索結果', notice: 'OSMの記録です。網羅性や現在の状態は保証されません。距離は検索地点からの直線距離です。', empty: '確認できる周辺の結果がありません。別の種類や地域をお試しください。', unresolved: 'スリランカの地点として確認できませんでした。都市や地域をより明確に指定してください。', unavailable: '周辺検索を完了できませんでした。位置情報の許可や接続を確認して再試行してください。', maps: 'Google Mapsで経路を表示' },
  ko: { title: '주변 검색 결과', notice: 'OSM 기록이며 전체 범위와 현재 상태는 보장되지 않습니다. 거리는 검색 지점에서의 직선거리입니다.', empty: '확인된 주변 결과가 없습니다. 다른 종류나 지역을 검색해 보세요.', unresolved: '스리랑카의 해당 위치를 확인하지 못했습니다. 도시나 지역을 더 명확하게 알려 주세요.', unavailable: '주변 검색을 완료하지 못했습니다. 위치 권한이나 연결을 확인하고 다시 시도하세요.', maps: 'Google Maps 길찾기' },
  de: { title: 'Suchergebnisse in der Nähe', notice: 'OSM-Daten; Vollständigkeit und aktueller Status sind nicht garantiert. Entfernungen als Luftlinie vom Suchort.', empty: 'Keine bestätigten Ergebnisse in der Nähe gefunden. Versuchen Sie eine andere Kategorie oder Gegend.', unresolved: 'Der genannte Ort konnte in Sri Lanka nicht bestätigt werden. Bitte nennen Sie eine genauere Stadt oder Gegend.', unavailable: 'Die Suche konnte nicht abgeschlossen werden. Prüfen Sie Standortberechtigung oder Verbindung und versuchen Sie es erneut.', maps: 'Route in Google Maps' },
  fr: { title: 'Résultats à proximité', notice: 'Données OSM ; couverture et état actuel non garantis. Distances à vol d’oiseau depuis le lieu de recherche.', empty: 'Aucun résultat vérifié à proximité. Essayez une autre catégorie ou zone.', unresolved: 'Ce lieu n’a pas pu être confirmé au Sri Lanka. Précisez la ville ou la zone.', unavailable: 'La recherche n’a pas pu être terminée. Vérifiez l’autorisation de localisation ou la connexion et réessayez.', maps: 'Itinéraire dans Google Maps' },
  es: { title: 'Resultados cercanos', notice: 'Datos OSM; cobertura y estado actual no garantizados. Distancias en línea recta desde el lugar de búsqueda.', empty: 'No se encontraron resultados cercanos verificados. Pruebe otra categoría o zona.', unresolved: 'No se pudo confirmar ese lugar en Sri Lanka. Indique una ciudad o zona más precisa.', unavailable: 'No se pudo completar la búsqueda. Compruebe el permiso de ubicación o la conexión e inténtelo de nuevo.', maps: 'Indicaciones en Google Maps' },
  ru: { title: 'Результаты поблизости', notice: 'Данные OSM; полнота и актуальность не гарантированы. Расстояния по прямой от точки поиска.', empty: 'Подтверждённых результатов поблизости нет. Попробуйте другую категорию или район.', unresolved: 'Не удалось подтвердить этот населённый пункт в Шри-Ланке. Уточните город или район.', unavailable: 'Не удалось завершить поиск. Проверьте разрешение геолокации или соединение и повторите попытку.', maps: 'Маршрут в Google Maps' },
  ar: { title: 'نتائج البحث القريبة', notice: 'سجلات OSM؛ لا يُضمن شمولها أو حالتها الحالية. المسافات بخط مستقيم من موقع البحث.', empty: 'لم يتم العثور على نتيجة قريبة مؤكدة. جرّب فئة أو منطقة أخرى.', unresolved: 'تعذر التحقق من هذا الموقع في سريلانكا. يرجى تحديد مدينة أو منطقة أوضح.', unavailable: 'تعذر إكمال البحث. تحقق من إذن الموقع أو الاتصال وحاول مجددًا.', maps: 'الاتجاهات في Google Maps' },
  hi: { title: 'आसपास के खोज परिणाम', notice: 'OSM रिकॉर्ड; पूर्ण कवरेज और वर्तमान स्थिति की गारंटी नहीं है। दूरियाँ खोज स्थान से सीधी रेखा में हैं।', empty: 'कोई सत्यापित नज़दीकी परिणाम नहीं मिला। दूसरी श्रेणी या क्षेत्र आज़माएँ।', unresolved: 'श्रीलंका में उस स्थान की पुष्टि नहीं हो सकी। अधिक स्पष्ट शहर या क्षेत्र बताएँ।', unavailable: 'खोज पूरी नहीं हो सकी। स्थान अनुमति या कनेक्शन जाँचकर फिर प्रयास करें।', maps: 'Google Maps में रास्ता' },
  it: { title: 'Risultati nelle vicinanze', notice: 'Dati OSM; copertura e stato attuale non garantiti. Distanze in linea retta dal luogo di ricerca.', empty: 'Nessun risultato verificato nelle vicinanze. Prova un’altra categoria o zona.', unresolved: 'Non è stato possibile verificare quel luogo in Sri Lanka. Specifica una città o zona più precisa.', unavailable: 'Impossibile completare la ricerca. Controlla il permesso di posizione o la connessione e riprova.', maps: 'Indicazioni in Google Maps' },
  tr: { title: 'Yakındaki arama sonuçları', notice: 'OSM kayıtları; kapsam ve güncel durum garanti edilmez. Mesafeler arama noktasından kuş uçuşudur.', empty: 'Yakında doğrulanmış sonuç bulunamadı. Başka bir kategori veya bölge deneyin.', unresolved: 'Bu konum Sri Lanka içinde doğrulanamadı. Daha açık bir şehir veya bölge belirtin.', unavailable: 'Arama tamamlanamadı. Konum iznini veya bağlantıyı kontrol edip tekrar deneyin.', maps: 'Google Maps yol tarifi' },
};

const CONTEXT_UNAVAILABLE_LABELS: Record<LanguageCode, string> = {
  en: 'The previously verified place result is no longer available. Please search for the place again.',
  si: 'කලින් සෙවූ තහවුරු කළ ස්ථාන තොරතුරු දැන් ලබාගත නොහැක. කරුණාකර ස්ථානය නැවත සොයන්න.',
  ta: 'முன்பு உறுதிப்படுத்தப்பட்ட இடத் தகவல் இப்போது கிடைக்கவில்லை. இடத்தை மீண்டும் தேடவும்.',
  zh: '之前核实的地点结果已不可用。请重新搜索该地点。',
  ja: '以前確認した場所の結果は現在利用できません。もう一度検索してください。',
  ko: '이전에 확인된 장소 결과를 더 이상 사용할 수 없습니다. 장소를 다시 검색해 주세요.',
  de: 'Das zuvor bestätigte Suchergebnis ist nicht mehr verfügbar. Bitte suchen Sie den Ort erneut.',
  fr: 'Le résultat précédemment vérifié n’est plus disponible. Veuillez rechercher le lieu à nouveau.',
  es: 'El resultado verificado anteriormente ya no está disponible. Busque el lugar de nuevo.',
  ru: 'Ранее подтверждённый результат больше недоступен. Найдите место заново.',
  ar: 'لم تعد نتيجة المكان التي تم التحقق منها متاحة. يرجى البحث عن المكان مرة أخرى.',
  hi: 'पहले सत्यापित स्थान का परिणाम अब उपलब्ध नहीं है। कृपया स्थान को फिर से खोजें।',
  it: 'Il risultato verificato in precedenza non è più disponibile. Cerca nuovamente il luogo.',
  tr: 'Önceden doğrulanmış yer sonucu artık kullanılamıyor. Lütfen yeri yeniden arayın.',
};

export function formatVerifiedPlaceSearch(search: VerifiedPlaceSearch, language: LanguageCode, includePlaces = true): string {
  if (search.status === 'context_unavailable') return CONTEXT_UNAVAILABLE_LABELS[language] || CONTEXT_UNAVAILABLE_LABELS.en;
  const labels = VERIFIED_PLACE_LABELS[language] || VERIFIED_PLACE_LABELS.en;
  if (search.status !== 'results') return labels[search.status];
  const followup = FOLLOWUP_LABELS[language] || FOLLOWUP_LABELS.en;
  const heading = `${search.presentation ? followup[search.presentation] : labels.title}\n\n${labels.notice}`;
  if (!includePlaces) return heading;
  return `${heading}\n\n${search.places.map((place) => `${place.name} — ${place.distanceKm.toFixed(1)} km\n${place.address}\n${labels.maps}: ${place.mapsUrl}`).join('\n\n')}`;
}
