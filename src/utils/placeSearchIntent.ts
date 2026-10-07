export type PlaceSearchCategory =
  | 'fuel' | 'hotel' | 'bank' | 'restaurant' | 'hospital' | 'school'
  | 'pharmacy' | 'supermarket' | 'car_service' | 'attraction';

const CATEGORY_TERMS: Record<PlaceSearchCategory, string[]> = {
  hospital: ['hospital', 'clinic', 'රෝහල', 'හොස්පිටල්', 'மருத்துவமனை', '医院', '病院', '병원', 'Krankenhaus', 'hôpital', 'больница', 'مستشفى', 'अस्पताल', 'ospedale', 'hastane'],
  // Sinhala stems also match the conversational suffix: පාසලක් / පසලක්.
  school: ['school', 'පාසල', 'පසල', 'පාසක්', 'பள்ளி', '学校', '학교', 'Schule', 'école', 'escuela', 'школа', 'مدرسة', 'स्कूल', 'scuola', 'okul'],
  restaurant: ['restaurant', 'cafe', 'café', 'ආපනශාලා', 'අවන්හල', 'உணவகம்', '餐厅', 'レストラン', '식당', 'Gaststätte', 'restaurante', 'ресторан', 'مطعم', 'रेस्तरां', 'ristorante', 'lokanta'],
  hotel: ['hotel', 'accommodation', 'guest house', 'resort', 'හෝටල', 'விடுதி', '酒店', 'ホテル', '호텔', 'hôtel', 'отель', 'فندق', 'होटल', 'albergo', 'otel'],
  fuel: ['fuel station', 'petrol station', 'gas station', 'filling station', 'ඉන්ධන පිරවුම්හල', 'எரிபொருள் நிலையம்', '加油站', 'ガソリンスタンド', '주유소', 'Tankstelle', 'station-service', 'gasolinera', 'заправка', 'محطة وقود', 'पेट्रोल पंप', 'stazione di servizio', 'benzin istasyonu'],
  bank: ['bank', 'atm', 'cash machine', 'බැංකුව', 'வங்கி', '银行', '銀行', '은행', 'Geldautomat', 'banque', 'banco', 'банк', 'بنك', 'बैंक', 'banca', 'banka'],
  pharmacy: ['pharmacy', 'chemist', 'drugstore', 'ඖෂධසාලාව', 'ෆාමසි', 'மருந்தகம்', '药店', '薬局', '약국', 'Apotheke', 'pharmacie', 'farmacia', 'аптека', 'صيدلية', 'फ़ार्मेसी', 'eczane'],
  supermarket: ['supermarket', 'grocery', 'සුපිරි වෙළඳසැල', 'பல்பொருள் அங்காடி', '超市', 'スーパーマーケット', '슈퍼마켓', 'Supermarkt', 'supermarché', 'supermercado', 'супермаркет', 'سوبر ماركت', 'सुपरमार्केट', 'supermercato', 'süpermarket'],
  car_service: ['car service', 'garage', 'mechanic', 'auto repair', 'ගරාජ්', 'கார் பழுது', '修车厂', '整備工場', '자동차 정비', 'Autowerkstatt', 'taller mecánico', 'автосервис', 'ورشة سيارات', 'कार मरम्मत', 'officina', 'oto servis'],
  attraction: ['attraction', 'tourist place', 'viewpoint', 'waterfall', 'temple', 'සංචාරක ස්ථානය', 'சுற்றுலா இடம்', '景点', '観光地', '관광 명소', 'Sehenswürdigkeit', 'attraction touristique', 'atracción turística', 'достопримечательность', 'معلم سياحي', 'पर्यटन स्थल', 'attrazione turistica', 'turistik yer'],
};

const PLACE_SEARCH_INTENT_TERMS = [
  'nearest', 'closest', 'near me', 'nearby', 'near ', 'find', 'search for', 'look for', 'where is',
  'ළඟම', 'ලඟම', 'ලගම', 'ආසන්න', 'අසල', 'සොයන්න', 'සොයා දෙන්න', 'කොහෙද',
  'அருகிலுள்ள', 'அருகில்', 'தேடு', 'கண்டுபிடி', 'எங்கே',
  '最近', '附近', '离我最近', '找', '搜索', '在哪里',
  '最寄り', '近く', '近所', '探して', '検索', 'どこ',
  '가장 가까운', '가까운', '근처', '주변', '찾아', '검색', '어디',
  'nächste', 'nächst', 'in der nähe', 'suche', 'finde', 'wo',
  'plus proche', 'près de', 'à proximité', 'chercher', 'trouver', 'où',
  'más cercano', 'más próxima', 'cerca de', 'buscar', 'encuentra', 'dónde',
  'ближайш', 'рядом', 'поблизости', 'найти', 'ищу', 'где',
  'الأقرب', 'أقرب', 'بالقرب من', 'ابحث', 'أين',
  'निकटतम', 'नज़दीक', 'पास में', 'आसपास', 'खोज', 'ढूंढ', 'कहाँ',
  'più vicino', 'più vicina', 'nelle vicinanze', 'cerca', 'trova', 'dove',
  'en yakın', 'yakınımda', 'yakınında', 'ara', 'bul', 'nerede',
].map((term) => term.normalize('NFKC').toLocaleLowerCase());

// Unicode token boundaries also exclude Sinhala vowel signs and joiners.
// Unlike includes('ලග'), this cannot match inside another word.
const SINHALA_NEAR_TOKEN = /(?:^|[^\p{L}\p{M}\p{N}_\u200c\u200d])ලග(?=$|[^\p{L}\p{M}\p{N}_\u200c\u200d])/u;

export function detectPlaceSearchCategory(message: string, requireSearchIntent = true): PlaceSearchCategory | null {
  const query = message.normalize('NFKC').toLocaleLowerCase();
  if (requireSearchIntent && !PLACE_SEARCH_INTENT_TERMS.some((term) => query.includes(term)) && !SINHALA_NEAR_TOKEN.test(query)) return null;
  let earliestMatch: { category: PlaceSearchCategory; index: number } | null = null;
  for (const [category, terms] of Object.entries(CATEGORY_TERMS) as Array<[PlaceSearchCategory, string[]]>) {
    for (const term of terms) {
      const index = query.indexOf(term.normalize('NFKC').toLocaleLowerCase());
      if (index !== -1 && (earliestMatch === null || index < earliestMatch.index)) earliestMatch = { category, index };
    }
  }
  return earliestMatch?.category ?? null;
}

/** Extract an explicitly stated area, never a default city or device location.
 * Grammar markers rather than a city whitelist allow unfamiliar towns to be searched.
 * Both client and server use this function so named areas bypass the GPS prompt.
 */
export function extractNamedSearchLocation(message: string): string | null {
  if (!detectPlaceSearchCategory(message)) return null;
  const query = message.normalize('NFKC').trim();
  const categoryTerms = Object.values(CATEGORY_TERMS).flat().sort((a, b) => b.length - a.length);
  const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const categoryPattern = new RegExp(categoryTerms.map(escape).join('|'), 'iu');
  const categoryIndex = query.search(categoryPattern);
  const beforeCategory = query.slice(0, categoryIndex);
  const afterCategory = query.slice(categoryIndex).replace(categoryPattern, '');
  const clean = (value: string): string | null => {
    const result = value.replace(/^[\s,!?。؟:;]+|[\s,!?。؟:;]+$/gu, '')
      .replace(/\s+(?:please|කරුණාකර|s'il vous plaît|bitte|por favor)$/iu, '').trim();
    // These describe the device/current position, not a named area.
    if (!result || /^(?:me|my location|here|my current location|මට|මා|මගේ අසල|அருகில்|எனக்கு|私|我|나|내 주변|mir|moi|mí|mi|меня|мне|مني|मेरे|मेरे पास|bana|benim|qui|ici|hier|aquí|здесь|هنا|இங்கே|මෙතන)$/iu.test(result)) return null;
    return result.slice(0, 160);
  };

  // Sinhala case endings: කතරගමට, ගාල්ලේ, යාපනයේ, වවුනියාවේ.
  const nearToken = SINHALA_NEAR_TOKEN.exec(beforeCategory);
  const sinhalaPrefix = beforeCategory.match(/^(.*?)(?:ළඟම|ලඟම|ලගම|ආසන්න|අසල)/u)?.[1]
    ?? (nearToken ? beforeCategory.slice(0, nearToken.index) : undefined);
  if (sinhalaPrefix !== undefined) {
    const rawArea = sinhalaPrefix.replace(/^මම\s+/u, '')
      .replace(/\s+(?:ඉන්නේ|ඉන්නෙ|සිටිනවා).*$/u, '')
      .replace(/\s+මට\s*$/u, '').trim();
    if (!clean(rawArea)) return null;
    const area = rawArea.replace(/ට$/u, '').replace(/ේ$/u, '');
    return clean(area);
  }

  // Preposition-led locations work before or after the requested category.
  // Includes each existing LankaMate language (postpositions handled below).
  const markers = /(?:\b(?:in|near|around|at|in der nähe von|près de|à proximité de|cerca de|en|dans|à|bei|vicino a|a|yakınında)\s+|(?:^|[^\p{L}])(?:в|около|рядом с)\s+|(?:بالقرب من|في|قرب)\s+)/giu;
  for (const fragment of [afterCategory, beforeCategory]) {
    const matches = [...fragment.matchAll(markers)];
    if (matches.length) {
      const match = matches[matches.length - 1];
      const area = clean(fragment.slice(match.index! + match[0].length)
        .replace(/\s+(?:nearest|closest|nearby|find|search|nächste\S*|plus proche|más cercan\S*|ближайш\S*|en yakın).*$/iu, ''));
      if (area) return area;
    }
  }
  const postposition = beforeCategory.match(/^(?:我在|在|搜索|找|私は\s*|저는\s*)?(.+?)(?:附近|周围|の近く|近く|で|근처|에서|அருகிலுள்ள|அருகில்|இல்|के पास|में|yakınında|の最寄り)[的の\s]*$/u);
  if (postposition) return clean(postposition[1]);
  // "Ella near fuel station" and equivalent location-first requests.
  const leading = beforeCategory.match(/^(.+?)\s+(?:near|nearby|nearest|closest|en yakın|附近|最寄り|근처)\s*$/iu);
  if (leading) return clean(leading[1]);
  return null;
}
