import { detectPlaceSearchCategory, extractNamedSearchLocation } from './placeSearchIntent';
import type { VerifiedPlaceResult } from './verifiedPlaceResults';

export interface PlaceFollowup { kind: 'location' | 'details'; selectedIndex?: number }
const normalize = (value: string) => value.normalize('NFKC').toLocaleLowerCase().trim();
// Narrow phrase/word aliases, not fuzzy matching. Includes all 14 UI languages.
const LOCATION = /(?:ලොකේශන්|ලොකේෂන්|ලොකේශන|location|\bmap\b|\bdirections\b|මේක කොහෙද|එතනට යන්නේ|how do i get there|where is (?:it|this)|அந்த இடம்|வரைபடம்|எப்படி செல்வது|位置|地图|怎么去|場所|地図|行き方|위치|지도|가는 방법|standort|\bkarte\b|wegbeschreibung|emplacement|\bcarte\b|itinéraire|ubicación|\bmapa\b|cómo llego|местоположени|\bкарт|как добраться|الموقع|خريطة|كيف أصل|स्थान|नक्शा|कैसे पहुँच|posizione|mappa|indicazioni|konum|harita|nasıl gider)/iu;
const DETAILS = /(?:තව කියන්න|ගැන කියන්න|වේලාව|දුරකථන|පහසුකම්|ඇතුළත්|tell me more|more about|hours|phone|facilities|admission|price|travel time|மேலும்|நேரம்|வசதிகள்|更多|开放时间|设施|詳しく|営業時間|設備|더 알려|운영시간|시설|mehr über|öffnungszeit|einrichtung|plus sur|horaires|équipements|más sobre|horario|instalaciones|подробнее|час[ыа]|удобств|المزيد|ساعات|مرافق|और बताओ|समय|सुविधा|di più|orari|servizi|daha fazla|saat|olanak)/iu;
const REFERENCE = /(?:මේ|එතන|එහි|ඒක|ඒ |\bthis\b|\bthat\b|\bits?\b|\btheir\b|அந்த|இந்த|这个|那里|この|そこ|이 |그 |거기|dies|dort|ce lieu|cet|cette|este|ese|allí|эт|там|هذا|هناك|इस|वहाँ|quest|lì|bu |oraya)/iu;
const CORRECTION = /(?:නැ|නෑ|ඇහුවෙ|ඇහුවේ|i meant|no,? i|je voulais|ich meinte|quería decir|я имел|قصدت|मेरा मतलब|intendo|demek istedim|கேட்டது|我的意思|という意味|말한)/iu;

// Without stored results, accept result requests, not general map/location topics.
const RESULT_LOCATION_REQUEST = /^(?:(?:please\s+)?(?:show me|give me|send me)(?:\s+the)?\s+(?:location|map|directions)|(?:location|map|directions)(?:\s+එක)?\s+දෙන්න|(?:මට\s+)?(?:ලොකේශන්|ලොකේෂන්)(?:\s+එක)?\s+දෙන්න(?:\s+පුලුවන්ද)?|මේක කොහෙද|එතනට යන්නේ(?: කොහොමද)?|how do i get there|where is (?:it|this)|அந்த இடம்|வரைபடம்|எப்படி செல்வது|显示地图|位置|地图|怎么去|地図を見せて|場所|地図|行き方|지도 보여줘|위치|지도|가는 방법|standort zeigen|standort|karte|wegbeschreibung|donne la carte|emplacement|carte|itinéraire|dame el mapa|ubicación|mapa|cómo llego|местоположение|карта|как добраться|الموقع|خريطة|كيف أصل|नक्शा दिखाओ|स्थान|नक्शा|कैसे पहुँच|mostra la mappa|posizione|mappa|indicazioni|konum göster|konum|harita|nasıl gider)[?!.]*$/iu;
const ORDINAL = /(?:දෙවැනි|දෙවෙනි|පළමු|තුන්වැනි|\b(?:first|second|third)\b)/iu;

export function detectPlaceFollowup(message: string, places: VerifiedPlaceResult[]): PlaceFollowup | null {
  const query = normalize(message);
  // A fresh search with an explicit area always wins over conversational context.
  if (detectPlaceSearchCategory(query) && extractNamedSearchLocation(query)) return null;
  if (detectPlaceSearchCategory(query) && !REFERENCE.test(query) && !CORRECTION.test(query)) return null;
  const named = places.map((place, index) => ({ name: normalize(place.name), index }))
    .filter((place) => place.name.length >= 3 && query.includes(place.name));
  const category = detectPlaceSearchCategory(query, false);
  const details = DETAILS.test(query);
  const bareDetails = /^(?:what (?:are|is) (?:the )?)?(?:opening hours|phone(?: number)?|facilities|admissions?(?: availability)?|prices?|travel time)[?!.]*$/iu.test(query);
  const correction = CORRECTION.test(query) && category !== null;
  const location = (LOCATION.test(query) && (RESULT_LOCATION_REQUEST.test(query) || (category !== null && ORDINAL.test(query) && /(?:දෙන්න|\b(?:show|give|send)\b)/iu.test(query)))) || (REFERENCE.test(query) && category !== null && /(?:කොහෙද|where|எங்கே|在哪里|どこ|어디|wo|où|dónde|где|أين|कहाँ|dove|nerede)/iu.test(query));
  if (!location && !named.length && !(details && (REFERENCE.test(query) || category || bareDetails)) && !correction &&
      !/^(?:the )?(?:first|second|third)(?: one| result)?[.!?]*$/iu.test(query)) return null;
  const selectedIndex = named.length === 1 ? named[0].index :
    /(?:දෙවැනි|දෙවෙනි|\bsecond\b|2(?:nd)?\b)/iu.test(query) ? 1 :
    /(?:පළමු|\bfirst\b|1st\b)/iu.test(query) ? 0 : /(?:තුන්වැනි|\bthird\b|3rd\b)/iu.test(query) ? 2 : undefined;
  return { kind: details ? 'details' : 'location', ...(selectedIndex !== undefined ? { selectedIndex } : {}) };
}
