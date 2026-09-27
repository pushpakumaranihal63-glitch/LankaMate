import { LanguageCode } from '../../types';
import { LocalizedDestinationFields } from '../translatedDestinations';
import { BEACH_TRANSLATIONS } from '../translatedBeaches';
import { beachesData } from '../beachesData';

export const destinationsBeaches: Record<string, Partial<Record<LanguageCode, LocalizedDestinationFields>>> = {};

interface BeachTravelMeta {
  travelTime: Partial<Record<LanguageCode, string>>;
  activities: Partial<Record<LanguageCode, string[]>>;
  travelTips: Partial<Record<LanguageCode, string[]>>;
}

const BEACH_META: Record<string, BeachTravelMeta> = {
  'beach-mirissa': {
    travelTime: {
      en: '2.5 hours via Southern Expressway (E01)',
      si: 'දක්ෂිණ අධිවේගී මාර්ගය (E01) ඔස්සේ පැය 2.5ක් පමණ',
      ta: 'தெற்கு அதிவேக நெடுஞ்சாலை (E01) வழியாக 2.5 மணிநேரம்',
      ar: 'ساعتان ونصف عبر الطريق السريع الجنوبي (E01)',
      tr: 'Güney Otoyolu (E01) üzerinden yaklaşık 2.5 saat',
    },
    activities: {
      en: ['Blue whale watching safari', 'Sunset at Coconut Tree Hill', 'Surfing at Mirissa point', 'Seafood dinner on the beach'],
      si: ['නිල් තල්මසුන් නැරඹීමේ සෆාරි චාරිකා', 'පොල් ගස් කන්දෙන් (Coconut Tree Hill) හිරු බැසයාම නැරඹීම', 'මිරිස්ස පොයින්ට් හි සර්ෆින් ක්‍රීඩාව', 'වෙරළේ නැවුම් මුහුදු ආහාර රසවිඳීම'],
      ta: ['நீலத்திமிங்கலக் கண்காணிப்பு சவாரி', 'தென்னந்தோப்புக் குன்றில் சூரிய அஸ்தமனம் பார்த்தல்', 'மிரிஸ்ஸ முனையில் அலைச்சறுக்கு', 'கடற்கரையில் கடல் உணவு அருந்துதல்'],
      ar: ['رحلات سفاري لمشاهدة الحيتان الزرقاء', 'مشاهدة الغروب من تلة أشجار جوز الهند', 'ركوب الأمواج عند نقطة ميريسا', 'تناول المأكولات البحرية الطازجة على الشاطئ'],
      tr: ['Mavi balina gözlem safarisi', 'Coconut Tree Hill tepesinde gün batımı', 'Mirissa noktasında sörf', 'Kumsalda taze deniz ürünleri akşam yemeği'],
    },
    travelTips: {
      en: ['Whale watching boats depart at 6:30 AM; book ahead during peak season.', 'Climb Coconut Tree Hill early morning for uncrowded photos.'],
      si: ['තල්මසුන් නැරඹුම් බෝට්ටු උදෑසන 6:30ට පිටත් වේ; උච්ච කාලවලදී කලින් වෙන්කරවා ගන්න.', 'ජනකායක් නොමැතිව ඡායාරූප ගැනීමට උදෑසනම පොල් ගස් කන්ද වෙත යන්න.'],
      ta: ['திமிங்கலப் படகுகள் காலை 6:30 மணிக்கு புறப்படும்; முன்பதிவு செய்வது நன்று.', 'கூட்டம் இல்லாமல் புகைப்படம் எடுக்க காலையிலேயே தென்னங்குன்றுக்கு செல்லுங்கள்.'],
      ar: ['تنطلق قوارب مشاهدة الحيتان الساعة 6:30 صباحاً؛ يُنصح بالحجز المسبق.', 'اصعد تلة أشجار جوز الهند في الصباح الباكر لتجنب الزحام والتقاط صور رائعة.'],
      tr: ['Balina izleme tekneleri sabah 06:30\'da kalkar; yoğun sezonda önceden rezervasyon yapın.', 'Kalabalıktan uzak fotoğraflar için Coconut Tree Hill\'e sabah erken çıkın.'],
    },
  },
  'beach-unawatuna': {
    travelTime: {
      en: '2 hours via Southern Expressway (E01)',
      si: 'දක්ෂිණ අධිවේගී මාර්ගය ඔස්සේ පැය 2ක් පමණ',
      ta: 'தெற்கு அதிவேக நெடுஞ்சாலை வழியாக 2 மணிநேரம்',
      ar: 'ساعتان عبر الطريق السريع الجنوبي',
      tr: 'Güney Otoyolu üzerinden yaklaşık 2 saat',
    },
    activities: {
      en: ['Safe bay swimming & snorkeling', 'Visit Japanese Peace Pagoda', 'Jungle Beach coastal hike', 'Beachfront cafe relaxation'],
      si: ['ආරක්ෂිත බොක්කේ පිහිනීම සහ ස්නෝකලිං', 'ජපන් සාම චෛත්‍යය වැඳපුදා ගැනීම', 'ජංගල් බීච් වෙරළ පාගමන', 'වෙරළබඩ ආපනශාලාවල විවේකීව ගතකිරීම'],
      ta: ['பாதுகாப்பான வளைகுடாவில் நீந்துதல் மற்றும் ஸ்நோர்கெலிங்', 'ஜப்பானிய அமைதி பகோடாவை பார்வையிடுதல்', 'ஜங்கிள் கடற்கரை வன நடைப்பயணம்', 'கடற்கரையோர சிற்றுண்டிச்சாலைகளில் ஓய்வெடுத்தல்'],
      ar: ['السباحة الآمنة في الخليج والغطس السطحي', 'زيارة معبد السلام الياباني (باغودا)', 'المشي الساحلي إلى شاطئ الغابة (جانغل بيتش)', 'الاسترخاء في المقاهي الشاطئية'],
      tr: ['Güvenli koyda yüzme ve şnorkelli yüzüş', 'Japon Barış Pagodasını ziyaret', 'Jungle Beach kıyı yürüyüşü', 'Sahil kafelerinde dinlenme'],
    },
    travelTips: {
      en: ['The horseshoe bay offers the safest swimming on the southern coast year-round.', 'Take a short boat or tuk-tuk ride to secluded Jungle Beach.'],
      si: ['අශ්ව ලාඩම් හැඩැති මෙම බොක්ක වසර පුරාම දකුණු වෙරළේ පිහිනීම සඳහා වඩාත්ම ආරක්ෂිත ස්ථානයකි.', 'නිස්කලංක ජංගල් බීච් වෙත යාමට කෙටි ටුක්-ටුක් හෝ බෝට්ටු සවාරියක් යොදාගන්න.'],
      ta: ['குதிரை லாட வடிவ வளைகுடா ஆண்டு முழுவதும் தெற்கில் நீந்த மிகவும் பாதுகாப்பானது.', 'அமைதியான ஜங்கிள் கடற்கரைக்கு செல்ல ஆட்டோ அல்லது படகுப் பயணம் மேற்கொள்ளுங்கள்.'],
      ar: ['يوفر هذا الخليج الهادئ أفضل وأسلم مياه للسباحة على مدار العام.', 'استقل توك توك أو قارباً صغيراً للوصول إلى شاطئ الغابة الهادئ المنعزل.'],
      tr: ['Bu hilal şeklindeki koy yıl boyunca güney kıyısında en güvenli yüzme ortamını sunar.', 'Sakin Jungle Beach\'e gitmek için kısa bir tuk-tuk veya tekne turu yapın.'],
    },
  },
  'beach-bentota': {
    travelTime: {
      en: '1.5 hours via Southern Expressway (E01)',
      si: 'දක්ෂිණ අධිවේගී මාර්ගය ඔස්සේ පැය 1.5ක් පමණ',
      ta: 'தெற்கு அதிவேக நெடுஞ்சாலை வழியாக 1.5 மணிநேரம்',
      ar: 'ساعة ونصف عبر الطريق السريع الجنوبي',
      tr: 'Güney Otoyolu üzerinden yaklaşık 1.5 saat',
    },
    activities: {
      en: ['Jet skiing & watersports on Bentota River', 'Madu Ganga mangrove river safari', 'Visit Brief Garden by Bevis Bawa', 'Sea turtle hatchery visit in Kosgoda'],
      si: ['බෙන්තොට ගඟේ ජෙට් ස්කී සහ ජල ක්‍රීඩා', 'මාදු ගඟේ කඩොලාන බෝට්ටු සෆාරි', 'බෙවිස් බාවාගේ බ්‍රීෆ් උද්‍යානය නැරඹීම', 'කොස්ගොඩ මුහුදු කැස්බෑ සංරක්ෂණාගාරය නැරඹීම'],
      ta: ['பெந்தோட்டை ஆற்றில் ஜெட் ஸ்கை மற்றும் நீர் விளையாட்டுகள்', 'மாது கங்கை சதுப்புநில படகு சவாரி', 'பீவிஸ் பாவாவின் பிரீஃப் கார்டன் பார்வை', 'கொஸ்கொட ஆமை பண்ணை விஜயம்'],
      ar: ['ركوب الدبابات المائية والرياضات النهرية في نهر بينتوتا', 'رحلة سفاري نهرية في غابات القرم (نهر مادو)', 'زيارة حديقة بريف باي بيفيس باوا', 'زيارة مركز حماية السلاحف البحرية في كوسغودا'],
      tr: ['Bentota Nehri\'nde jet ski ve su sporları', 'Madu Ganga mangrov nehri tekne safarisi', 'Bevis Bawa\'nın Brief Bahçesi\'ni ziyaret', 'Kosgoda deniz kaplumbağası merkezini ziyaret'],
    },
    travelTips: {
      en: ['Combine river safaris in the morning with beach relaxation in late afternoon.', 'Certified watersports centers line the Bentota Lagoon sand spit.'],
      si: ['උදෑසන ගංගා සෆාරි සහ සවස් කාලයේ වෙරළේ විවේකය එකට සැලසුම් කරන්න.', 'බෙන්තොට කලපු තුඩුව දිගේ සහතිකලත් ජල ක්‍රීඩා මධ්‍යස්ථාන පිහිටා ඇත.'],
      ta: ['காலை நதி சவாரியையும் மாலை கடற்கரை ஓய்வையும் இணைத்து திட்டமிடுங்கள்.', 'பெந்தோட்டை மணற்பரப்பில் அங்கீகரிக்கப்பட்ட நீர் விளையாட்டு மையங்கள் உள்ளன.'],
      ar: ['اجمع بين رحلات السفاري النهرية صباحاً والاسترخاء الشاطئي بعد الظهر.', 'تنتشر مراكز الرياضات المائية المرخصة على طول شريط بينتوتا الرملي.'],
      tr: ['Sabah nehir safarisini ikindi vakti plaj keyfiyle birleştirin.', 'Bentota lagünü kum şeridinde lisanslı su sporları merkezleri mevcuttur.'],
    },
  },
  'beach-weligama': {
    travelTime: {
      en: '2.5 hours via Southern Expressway (E01)',
      si: 'දක්ෂිණ අධිවේගී මාර්ගය ඔස්සේ පැය 2.5ක් පමණ',
      ta: 'தெற்கு அதிவேக நெடுஞ்சாலை வழியாக 2.5 மணிநேரம்',
      ar: 'ساعتان ونصف عبر الطريق السريع الجنوبي',
      tr: 'Güney Otoyolu üzerinden yaklaşık 2.5 saat',
    },
    activities: {
      en: ['Beginner surf lessons', 'Witness traditional stilt fishermen', 'Visit Taprobane private island viewpoint', 'Yoga and wellness sessions'],
      si: ['ආරම්භක සර්ෆින් පුහුණු පාඨමාලා', 'සාම්ප්‍රදායික රිටි පන්න ධීවරයින් නැරඹීම', 'ටැප්‍රොබේන් පෞද්ගලික දූපත් නැරඹුම් ස්ථානය', 'යෝගා සහ සුවතා අභ්‍යාස'],
      ta: ['தொடக்கநிலை அலைச்சறுக்கு பயிற்சிகள்', 'பாரம்பரிய தடி மீனவர்களைப் பார்த்தல்', 'டாப்ரோபேன் தீவு பார்வை', 'யோகா மற்றும் நல்வாழ்வுப் பயிற்சிகள்'],
      ar: ['دروس ركوب الأمواج للمبتدئين', 'مشاهدة صيادي العصي التقليديين', 'الإطلالة على جزيرة تابروبان الخاصة', 'جلسات اليوغا والاستجمام'],
      tr: ['Yeni başlayanlar için sörf dersleri', 'Geleneksel ayaklık üstü balıkçıları izleme', 'Taprobane özel ada manzarasını seyretme', 'Yoga ve sağlıklı yaşam seansları'],
    },
    travelTips: {
      en: ['The sandy seabed and gentle breaking beach-break make it the best learn-to-surf spot in Asia.', 'Respect local stilt fishermen when taking photos.'],
      si: ['වැලි සහිත මුහුදු පතුල සහ මෘදු රළ පහර හේතුවෙන් මෙය ආසියාවේ සර්ෆින් ඉගෙනුමට සුදුසුම ස්ථානයයි.', 'රිටි පන්න ධීවරයින් ඡායාරූප ගැනීමේදී ඔවුන්ගේ ජීවනෝපායට ගරු කරන්න.'],
      ta: ['மணற்பாங்கான தரைப்பகுதி ஆசியாவிலேயே அலைச்சறுக்கு கற்றுக்கொள்ள சிறந்த இடமாக அமைகிறது.', 'தடி மீனவர்களை புகைப்படம் எடுக்கும் போது அவர்களுக்கு மரியாதை அளியுங்கள்.'],
      ar: ['القاع الرملي والأمواج اللطيفة تجعل هذا الشاطئ الأفضل في آسيا لتعلم ركوب الأمواج.', 'احترم صيادي العصي التقليديين عند التقاط الصور التذكارية.'],
      tr: ['Kumlu deniz tabanı ve yumuşak dalgalar burayı Asya\'nın en iyi sörf öğrenme noktası yapar.', 'Fotoğraf çekerken geleneksel balıkçılara saygı gösterin.'],
    },
  },
  'beach-tangalle': {
    travelTime: {
      en: '3.5 hours via Southern Expressway extension',
      si: 'දක්ෂිණ අධිවේගී මාර්ග දිගුව ඔස්සේ පැය 3.5ක් පමණ',
      ta: 'தெற்கு அதிவேக நெடுஞ்சாலை வழியாக 3.5 மணிநேரம்',
      ar: '3.5 ساعات عبر امتداد الطريق السريع الجنوبي',
      tr: 'Güney Otoyolu uzantısı üzerinden yaklaşık 3.5 saat',
    },
    activities: {
      en: ['Kalametiya bird sanctuary boat tour', 'Rekawa night sea turtle watching', 'Hummanaya natural blowhole excursion', 'Goyambokka quiet cove exploration'],
      si: ['කලමැටිය පක්ෂි අභයභූමි බෝට්ටු සවාරිය', 'රේකව රාත්‍රී මුහුදු කැස්බෑ නිරීක්ෂණය', 'හුම්මානය ස්වාභාවික කිවුල් හෝල නැරඹීම', 'ගොයම්බොක්ක නිස්කලංක බොක්ක ගවේෂණය'],
      ta: ['கலமெட்டிய பறவைகள் சரணாலய படகு சவாரி', 'ரேகாவா இரவு கடல் ஆமை கண்காணிப்பு', 'ஹும்மானய இயற்கை கடல் நீரூற்று பார்வை', 'கோயம்பொக்க அமைதியான விரிகுடா உலா'],
      ar: ['جولة بالقارب في محمية كلاميتيا للطيور', 'مراقبة السلاحف البحرية ليلاً في ريكاوا', 'مشاهدة ظاهرة نافورة المياه الطبيعية (هومانايا)', 'استكشاف خليج غويامبوكا الهادئ'],
      tr: ['Kalametiya kuş cenneti tekne turu', 'Rekawa gece kaplumbağa gözlemi', 'Hummanaya doğal fışkırtma deliği gezisi', 'Goyambokka sakin koyunda yürüyüş'],
    },
    travelTips: {
      en: ['Tangalle beaches have stronger waves; Goyambokka and Silent Beach offer the safest swimming.', 'Visit Rekawa between April and July for peak turtle nesting season.'],
      si: ['තංගල්ල වෙරළේ ප්‍රබල රළ පවතින බැවින් ගොයම්බොක්ක සහ සයිලන්ට් බීච් පිහිනීමට වඩාත් සුදුසුය.', 'කැස්බෑ බිත්තර දැමීම දැකගැනීමට අප්‍රේල් සිට ජූලි දක්වා රේකව වෙත යන්න.'],
      ta: ['தங்கல்ல கடற்கரையில் அதிக அலைகள் உள்ளதால், கோயம்பொக்க மற்றும் சைலண்ட் கடற்கரைகளில் நீந்துவது பாதுகாப்பானது.', 'ஆமைகள் முட்டையிடுவதைக் காண ஏப்ரல் முதல் ஜூலை வரை ரேகாவா செல்லுங்கள்.'],
      ar: ['شواطئ تانغالي ذات أمواج قوية؛ يعتبر شاطئ غويامبوكا والشاطئ الصامت الأكثر أماناً للسباحة.', 'تعتبر الفترة من أبريل إلى يوليو الأفضل لمراقبة تعشيش السلاحف في ريكاوا.'],
      tr: ['Tangalle dalgaları kuvvetlidir; Goyambokka ve Silent Beach yüzmek için en güvenli koylardır.', 'Kaplumbağaların yumurtlama dönemini izlemek için Nisan - Temmuz arası Rekawa\'yı ziyaret edin.'],
    },
  },
  'beach-arugambay': {
    travelTime: {
      en: '6.5 hours drive via Monaragala & Wellawaya',
      si: 'මොනරාගල සහ වැල්ලවාය හරහා පැය 6.5ක් පමණ',
      ta: 'மொனராகலை மற்றும் வெல்லவாய வழியாக 6.5 மணிநேரம்',
      ar: '6.5 ساعات بالسيارة عبر موناراغالا وويلاوايا',
      tr: 'Monaragala ve Wellawaya üzerinden yaklaşık 6.5 saat',
    },
    activities: {
      en: ['World-class point break surfing', 'Kumana National Park leopard & bird safari', 'Kudumbigala Monastery panoramic hike', 'Lagoon sunset canoe safari'],
      si: ['ලෝක ප්‍රකට පොයින්ට් බ්‍රේක් සර්ෆින්', 'කුමන ජාතික වනෝද්‍යානයේ දිවියන් සහ පක්ෂි සෆාරි', 'කුඩුම්බිගල ආරණ්‍ය සේනාසන පාගමන', 'කලපුවේ හිරු බැසයන ඔරු සවාරිය'],
      ta: ['உலகத்தரம் வாய்ந்த அலைச்சறுக்கு சாகசம்', 'குமண தேசிய பூங்கா சிறுத்தை & பறவை சவாரி', 'குடும்பிகல ஆசிரம உச்சி நடைப்பயணம்', 'களப்பு சூரிய அஸ்தமன படகு சவாரி'],
      ar: ['ركوب أمواج عالمي المستوى', 'رحلات سفاري في حديقة كومانا الوطنية لمشاهدة النمور والطيور', 'المشي إلى دير كودومبيغالا الصخري البانورامي', 'جولة بالكانو في البحيرة الشاطئية وقت الغروب'],
      tr: ['Dünya standartlarında sörf', 'Kumana Milli Parkı leopar ve kuş safarisi', 'Kudumbigala Manastırı panoramik tırmanışı', 'Lagünde gün batımı kano turu'],
    },
    travelTips: {
      en: ['May to October brings consistent 3 to 6 foot swell on the right-hand point breaks.', 'Combine surfing with early morning wildlife safaris into nearby Kumana.'],
      si: ['මැයි සිට ඔක්තෝබර් දක්වා දකුණු දිශානුගත පොයින්ට් බ්‍රේක් සඳහා විශිෂ්ට රළ ලැබේ.', 'සර්ෆින් ක්‍රීඩාව සමඟ කුමන වනෝද්‍යානයේ උදෑසන සෆාරි චාරිකාවක් එක්කරගන්න.'],
      ta: ['மே முதல் அக்டோபர் வரை அலைச்சறுக்குக்கு சிறந்த அலைகள் உருவாகின்றன.', 'அலைச்சறுக்குடன் அருகிலுள்ள குமண பூங்கா சவாரியையும் திட்டமிடுங்கள்.'],
      ar: ['تصل الأمواج إلى ذروتها المثالية لركوب الأمواج من مايو إلى أكتوبر.', 'اجمع بين ركوب الأمواج ورحلات السفاري الصباحية في حديقة كومانا القريبة.'],
      tr: ['Mayıs - Ekim ayları arası sağ yönlü dalgalar sörf için mükemmeldir.', 'Sörfün yanı sıra sabah erken saatte yakınlardaki Kumana safarisine katılın.'],
    },
  },
  'beach-nilaveli': {
    travelTime: {
      en: '5.5 hours drive via Kurunegala & Habarana',
      si: 'කුරුණෑගල සහ හබරණ හරහා පැය 5.5ක් පමණ',
      ta: 'குருநாகல் மற்றும் ஹபரணை வழியாக 5.5 மணிநேரம்',
      ar: '5.5 ساعات بالسيارة عبر كورونيغالا وهابارانا',
      tr: 'Kurunegala ve Habarana üzerinden yaklaşık 5.5 saat',
    },
    activities: {
      en: ['Pigeon Island marine national park snorkeling', 'Swim in crystal clear calm lagoon waters', 'Koneswaram Temple clifftop visit', 'Trincomalee natural hot springs'],
      si: ['පරවි දූපත (Pigeon Island) සාගර උද්‍යානයේ ස්නෝකලිං', 'පැහැදිලි නිසල මුහුදේ පිහිනීම', 'කොණේෂ්වරම් කෝවිල නැරඹීම', 'ත්‍රිකුණාමලය කන්නියා උණුදිය උල්පත්'],
      ta: ['புறாத்தீவு கடல் தேசிய பூங்காவில் ஸ்நோர்கெலிங்', 'தெளிவான அமைதியான கடலில் நீந்துதல்', 'திருக்கோணேஸ்வரம் கோயில் தரிசனம்', 'கண்ணியா வெந்நீர் ஊற்று விஜயம்'],
      ar: ['الغطس السطحي في محمية جزيرة الحمام (بيجون آيلاند)', 'السباحة في مياه البحر الكريستالية الهادئة', 'زيارة معبد كونيشفارام على الجرف الصخري', 'الينابيع الحارة الطبيعية في ترينكومالي'],
      tr: ['Pigeon Island deniz milli parkında şnorkelle yüzme', 'Kristal berraklığındaki sakin denizde yüzme', 'Koneswaram Tapınağı uçurum ziyareti', 'Trincomalee sıcak su kaplıcaları'],
    },
    travelTips: {
      en: ['Book a registered boat to Pigeon Island directly from the beach; reef sharks and turtles are commonly seen.', 'Best calm conditions are between March and October.'],
      si: ['වෙරළේ සිට සෘජුවම පරවි දූපතට බෝට්ටු පහසුකම් ඇත; කොරල් මෝරුන් සහ කැස්බෑවන් සුලභව දැකගත හැක.', 'මාර්තු සිට ඔක්තෝබර් දක්වා මුහුද ඉතා සන්සුන්ය.'],
      ta: ['புறாத்தீவுக்கு கடற்கரையிலிருந்தே பதிவுசெய்யப்பட்ட படகுகள் உள்ளன; சுறாக்கள் மற்றும் ஆமைகளை எளிதில் காணலாம்.', 'மார்ச் முதல் அக்டோபர் வரை கடல் மிகவும் அமைதியாக இருக்கும்.'],
      ar: ['احجز قارباً مرخصاً إلى جزيرة الحمام من الشاطئ؛ رؤية أسماك القرش الصغيرة والسلاحف شائعة جداً.', 'أفضل أجواء بحرية هادئة تمتد من مارس إلى أكتوبر.'],
      tr: ['Pigeon Island için kumsaldan lisanslı tekne ayarlayın; resif köpekbalıkları ve kaplumbağalar yaygındır.', 'Mart ile Ekim arası deniz en sakin ve berrak halindedir.'],
    },
  },
  'beach-pasikuda': {
    travelTime: {
      en: '6 hours drive via Polonnaruwa',
      si: 'පොළොන්නරුව හරහා පැය 6ක් පමණ',
      ta: 'பொலன்னறுவை வழியாக 6 மணிநேரம்',
      ar: '6 ساعات بالسيارة عبر بولوناروا',
      tr: 'Polonnaruwa üzerinden yaklaşık 6 saat',
    },
    activities: {
      en: ['Walk hundreds of meters out into the shallow reef lagoon', 'Windsurfing and kayak rentals', 'Luxury beach resort relaxation', 'Batticaloa Dutch Fort day trip'],
      si: ['ගැඹුරු නොවන නිසල මුහුදේ මීටර් සිය ගණනක් ඈතට ඇවිද යාම', 'වින්ඩ්සර්ෆින් සහ කයාක් ඔරු පැදීම', 'සුඛෝපභෝගී වෙරළ නිකේතනවල විවේකය', 'මඩකලපුව ලන්දේසි බලකොටුව නැරඹීම'],
      ta: ['ஆழமற்ற அமைதியான கடல் பாறையில் நூற்றுக்கணக்கான மீட்டர்கள் நடந்து செல்லுதல்', 'விண்ட்சர்ஃபிங் மற்றும் கயாக் படகு சவாரி', 'ஆடம்பர கடற்கரை ஓய்வு விடுதிகளில் தங்குதல்', 'மட்டக்களப்பு டச்சு கோட்டை பயணம்'],
      ar: ['المشي مئات الأمتار في المياه الضحلة الهادئة داخل الحاجز المرجاني', 'ركوب الأمواج الشراعي واستئجار قوارب الكاياك', 'الاسترخاء في المنتجعات الشاطئية الفاخرة', 'رحلة ليوم واحد إلى قلعة باتيكالوا الهولندية'],
      tr: ['Sığ ve sakin resif lagününde yüzlerce metre açığa yürüme', 'Rüzgar sörfü ve kano kiralama', 'Lüks sahil tatil köylerinde dinlenme', 'Batticaloa Hollanda Kalesi gezisi'],
    },
    travelTips: {
      en: ['One of the longest stretches of shallow coastline in the world; extraordinarily safe for families and children.', 'March to October offers mirror-flat warm turquoise waters.'],
      si: ['ලොව දිගම නොගැඹුරු වෙරළ තීරයන්ගෙන් එකක් වන අතර දරුවන් සහ පවුලේ සැමට අතිශයින් ආරක්ෂිතය.', 'මාර්තු සිට ඔක්තෝබර් දක්වා නිල්වන් නිසල මුහුදු ජලය පවතී.'],
      ta: ['உலகின் மிக நீளமான ஆழமற்ற கடற்கரைகளில் ஒன்றாகும்; குழந்தைகள் மற்றும் குடும்பங்களுக்கு மிகவும் பாதுகாப்பானது.', 'மார்ச் முதல் அக்டோபர் வரை நீர் கண்ணாடி போல் அமைதியாக இருக்கும்.'],
      ar: ['أحد أطول الشواطئ الضحلة في العالم؛ آمن بشكل استثنائي للأطفال والعائلات.', 'من مارس إلى أكتوبر تكون المياه دافئة وهادئة تماماً كالمرآة.'],
      tr: ['Dünyanın en uzun sığ kıyı şeritlerinden biri; çocuklu aileler için son derece güvenlidir.', 'Mart - Ekim arası turkuaz sular ayna gibi durgundur.'],
    },
  },
  'beach-hikkaduwa': {
    travelTime: {
      en: '1.5 to 2 hours via Southern Expressway (E01)',
      si: 'දක්ෂිණ අධිවේගී මාර්ගය ඔස්සේ පැය 1.5 සිට 2 දක්වා',
      ta: 'தெற்கு அதிවේக நெடுஞ்சாலை வழியாக 1.5 முதல் 2 மணிநேரம்',
      ar: 'من 1.5 إلى ساعتين عبر الطريق السريع الجنوبي',
      tr: 'Güney Otoyolu üzerinden 1.5 - 2 saat',
    },
    activities: {
      en: ['Snorkeling with wild giant green turtles at the shore', 'Hikkaduwa Coral Sanctuary glass-bottom boat tour', 'Beachfront nightlife and live music', 'Scuba diving sunken shipwrecks'],
      si: ['වෙරළ ආසන්නයේ සිටින යෝධ මුහුදු කැස්බෑවන් සමඟ ස්නෝකලිං', 'හික්කඩුව කොරල් අභයභූමියේ වීදුරු පතුල් බෝට්ටු සවාරි', 'වෙරළබඩ රාත්‍රී සංගීතය සහ විනෝදය', 'මුහුදුබත් වූ නැව් සුන්බුන් කිමිදීම (Scuba Diving)'],
      ta: ['கடற்கரையோரம் ராட்சத பச்சை ஆமைகளுடன் ஸ்நோர்கெலிங்', 'ஹிக்கடுவ பவள சரணாலய கண்ணாடி படகு சவாரி', 'கடற்கரை இரவு வாழ்க்கை மற்றும் நேரடி இசை', 'மூழ்கிய கப்பல்களை ஸ்கூபா டைவிங் செய்து பார்த்தல்'],
      ar: ['الغطس السطحي بجانب السلاحف الخضراء العملاقة قرب الشاطئ', 'جولة بالقارب ذي القاع الزجاجي في محمية حديقة المرجان', 'الحياة الليلية والموسيقى الحية على الشاطئ', 'الغوص الاستكشافي لحطام السفن الغارقة'],
      tr: ['Kıyıda dev yeşil kaplumbağalarla şnorkelle yüzme', 'Hikkaduwa Mercan Koruma Alanında cam tabanlı tekne turu', 'Sahil kenarı gece hayatı ve canlı müzik', 'Batık gemilere tüplü dalış'],
    },
    travelTips: {
      en: ['Wild giant turtles feed in knee-deep water right outside Hikka Tranz hotel every morning.', 'Do not touch or stand on living coral reefs while snorkeling.'],
      si: ['හික්කඩුව හෝටල් ඉදිරිපිට නොගැඹුරු මුහුදේ උදෑසන කාලයේ යෝධ කැස්බෑවන් ආහාර සොයමින් සැරිසරයි.', 'ස්නෝකලිං කිරීමේදී ජීවී කොරල්පර මත පා තැබීමෙන් හෝ ඇල්ලීමෙන් වළකින්න.'],
      ta: ['காலை வேளையில் ஆழமற்ற கடலில் ராட்சத ஆமைகள் எளிதாக உணவருந்த வருகின்றன.', 'ஸ்நோர்கெலிங் செய்யும் போது பவளப்பாறைகளைத் தொடவோ மிதிக்கவோ வேண்டாம்.'],
      ar: ['تأتي السلاحف العملاقة كل صباح للسباحة في المياه الضحلة قرب الفنادق الشاطئية.', 'يرجى عدم لمس الشعب المرجانية الحية أو الوقوف عليها أثناء الغطس.'],
      tr: ['Dev kaplumbağalar her sabah kıyıdaki sığ sularda beslenir.', 'Şnorkelle yüzerken canlı mercanlara basmayın veya dokunmayın.'],
    },
  },
  'beach-hiriketiya': {
    travelTime: {
      en: '3 hours via Southern Expressway (E01)',
      si: 'දක්ෂිණ අධිවේගී මාර්ගය ඔස්සේ පැය 3ක් පමණ',
      ta: 'தெற்கு அதிවේக நெடுஞ்சாலை வழியாக 3 மணிநேரம்',
      ar: '3 ساعات عبر الطريق السريع الجنوبي',
      tr: 'Güney Otoyolu üzerinden yaklaşık 3 saat',
    },
    activities: {
      en: ['Horseshoe bay surfing for all levels', 'Boutique beachfront artisan cafes', 'Yoga retreats nestled under coastal palm groves', 'Sunset ocean swimming'],
      si: ['සියලු මට්ටම් සඳහා අශ්ව ලාඩම් හැඩැති බොක්කේ සර්ෆින්', 'සුන්දර වෙරළබඩ කෝපිහල් සහ කැෆේ', 'පොල් උයන් සෙවණේ යෝගා අභ්‍යාස', 'හිරු බැසයන සන්ධ්‍යාවේ මුහුදේ පිහිනීම'],
      ta: ['குதிரை லாட விரிகுடாவில் அனைத்து நிலை அலைச்சறுக்கு', 'அழகிய கடற்கரையோர கஃபேக்கள்', 'தென்னந்தோப்புகளில் யோகா பயிற்சிகள்', 'சூரிய அஸ்தமனக் கடல் நீச்சல்'],
      ar: ['ركوب الأمواج في الخليج الصغير لجميع المستويات', 'المقاهي الشاطئية العصرية والمطاعم المتميزة', 'جلسات اليوغا بين بساتين النخيل الساحلية', 'السباحة في المحيط وقت الغروب'],
      tr: ['Her seviyeye uygun hilal koyunda sörf', 'Butik sahil kafeleri ve mekanlar', 'Kıyı palmiyeleri altında yoga seansları', 'Gün batımında okyanusta yüzme'],
    },
    travelTips: {
      en: ['The compact horseshoe shape protects the bay from heavy open-ocean currents.', 'Great vibe with co-working cafes and surf schools right on the sand.'],
      si: ['සංයුක්ත අශ්ව ලාඩම් හැඩය නිසා ප්‍රචණ්ඩ සාගර රළ පහරින් මෙම බොක්ක ආරක්ෂා වී ඇත.', 'වැලි තලාව මතම පිහිටි සර්ෆින් පාසල් සහ ආපනශාලා නිසා ඉතා විනෝදජනක වාතාවරණයක් ඇත.'],
      ta: ['குதிரை லாட வடிவம் கடுமையான கடல் அலைகளிலிருந்து விரிகுடாவைப் பாதுகாக்கிறது.', 'மணலில் அமைந்துள்ள கஃபேக்கள் மற்றும் அலைச்சறுக்கு பள்ளிகளுடன் அருமையான சூழல்.'],
      ar: ['يحمي الشكل الهلالي المغلق هذا الخليج من التيارات البحرية القوية المفتوحة.', 'أجواء استثنائية مع مقاهي العمل المشترك ومدارس ركوب الأمواج على الرمال مباشرة.'],
      tr: ['Kompakt hilal yapısı koyu sert açık deniz akıntılarından korur.', 'Kumsalın üzerindeki sörf okulları ve kafeleriyle harika bir atmosfere sahiptir.'],
    },
  },
};

const DEFAULT_BEACH_META: BeachTravelMeta = {
  travelTime: {
    en: '2.5 to 3 hours via Southern Expressway (E01)',
    si: 'දක්ෂිණ අධිවේගී මාර්ගය ඔස්සේ පැය 2.5 සිට 3 දක්වා',
    ta: 'தெற்கு அதிவேக நெடுஞ்சாலை வழியாக 2.5 முதல் 3 மணிநேரம்',
    ar: 'من ساعتين ونصف إلى 3 ساعات عبر الطريق السريع الجنوبي',
    tr: 'Güney Otoyolu üzerinden yaklaşık 2.5 - 3 saat',
  },
  activities: {
    en: ['Ocean swimming & sunbathing', 'Coastal sunset walks', 'Beach volleyball & watersports'],
    si: ['මුහුදේ පිහිනීම සහ හිරු තැපීම', 'වෙරළ තීරයේ සන්ධ්‍යා ඇවිදීම', 'වෙරළ වොලිබෝල් සහ ජල ක්‍රීඩා'],
    ta: ['கடலில் நீந்துதல் மற்றும் சூரியக் குளியல்', 'கடற்கரையோர மாலை நடைப்பயணம்', 'கடற்கரை கைப்பந்து மற்றும் நீர் விளையாட்டுகள்'],
    ar: ['السباحة في المحيط والاسترخاء تحت أشعة الشمس', 'المشي على الشاطئ وقت الغروب', 'كرة الطائرة الشاطئية والرياضات المائية'],
    tr: ['Okyanusta yüzme ve güneşlenme', 'Kumsalda gün batımı yürüyüşü', 'Plaj voleybolu ve su sporları'],
  },
  travelTips: {
    en: ['Swim only in designated calm zones and apply sunscreen regularly.', 'Keep the beach clean and do not disturb marine life.'],
    si: ['ආරක්ෂිත සහ සන්සුන් කලාපවල පමණක් පිහිනන්න, හිරු ආවරණ ආලේපන භාවිත කරන්න.', 'වෙරළ පිරිසිදුව තබාගන්න සහ සාගර ජීවීන්ට බාධා නොකරන්න.'],
    ta: ['பாதுகாப்பான அமைதியான பகுதிகளில் மட்டுமே நீந்தவும், சன்ஸ்கிரீன் பயன்படுத்தவும்.', 'கடற்கரையை சுத்தமாக வைத்திருக்கவும், கடல் உயிரினங்களுக்கு தொந்தரவு செய்யாதீர்கள்.'],
    ar: ['اسبح فقط في المناطق الآمنة والمحددة واستخدم واقي الشمس بانتظام.', 'حافظ على نظافة الشاطئ وتجنب إزعاج الكائنات البحرية.'],
    tr: ['Yalnızca belirlenmiş sakin bölgelerde yüzün ve düzenli güneş kremi sürün.', 'Plajı temiz tutun ve deniz canlılarını rahatsız etmeyin.'],
  },
};

// Populate from beachesData and BEACH_TRANSLATIONS with fully tailored metadata
beachesData.forEach((b) => {
  const trans = BEACH_TRANSLATIONS[b.id] || {};
  const meta = BEACH_META[b.id] || DEFAULT_BEACH_META;

  destinationsBeaches[b.id] = {
    en: {
      name: b.name,
      tagline: b.vibe || b.name,
      category: 'Beach',
      region: b.region,
      district: b.location.split(',')[0]?.trim() || '',
      description: b.description,
      bestTimeToVisit: b.bestSeason,
      entryFee: 'Free public access',
      travelTimeFromColombo: meta.travelTime.en || '2.5 to 3 hours',
      highlights: b.highlights || [],
      activities: meta.activities.en || [],
      travelTips: meta.travelTips.en || [],
    },
    si: {
      name: trans.si?.name || b.localName || b.name,
      tagline: trans.si?.vibe || trans.si?.name || b.name,
      category: 'වෙරළ',
      region: trans.si?.region || 'දකුණු වෙරළ තීරය',
      district: trans.si?.location?.split(',')[0]?.trim() || '',
      description: trans.si?.description || b.description,
      bestTimeToVisit: trans.si?.bestSeason || b.bestSeason,
      entryFee: 'නොමිලේ ප්‍රවේශය (පොදු වෙරළ)',
      travelTimeFromColombo: meta.travelTime.si || meta.travelTime.en || 'පැය 2.5ක් පමණ',
      highlights: trans.si?.highlights || b.highlights || [],
      activities: meta.activities.si || meta.activities.en || [],
      travelTips: meta.travelTips.si || meta.travelTips.en || [],
    },
    ta: {
      name: trans.ta?.name || b.name,
      tagline: trans.ta?.vibe || trans.ta?.name || b.name,
      category: 'கடற்கரை',
      region: trans.ta?.region || 'தெற்கு கடற்கரை',
      district: trans.ta?.location?.split(',')[0]?.trim() || '',
      description: trans.ta?.description || b.description,
      bestTimeToVisit: trans.ta?.bestSeason || b.bestSeason,
      entryFee: 'இலவச அனுமதி (பொதுக் கடற்கரை)',
      travelTimeFromColombo: meta.travelTime.ta || meta.travelTime.en || '2.5 மணிநேரம்',
      highlights: trans.ta?.highlights || b.highlights || [],
      activities: meta.activities.ta || meta.activities.en || [],
      travelTips: meta.travelTips.ta || meta.travelTips.en || [],
    },
    ar: {
      name: trans.ar?.name || b.name,
      tagline: trans.ar?.vibe || trans.ar?.name || b.name,
      category: 'شاطئ',
      region: trans.ar?.region || 'الساحل الجنوبي',
      district: trans.ar?.location?.split(',')[0]?.trim() || '',
      description: trans.ar?.description || b.description,
      bestTimeToVisit: trans.ar?.bestSeason || b.bestSeason,
      entryFee: 'دخول مجاني (شاطئ عام)',
      travelTimeFromColombo: meta.travelTime.ar || meta.travelTime.en || 'ساعتان ونصف',
      highlights: trans.ar?.highlights || b.highlights || [],
      activities: meta.activities.ar || meta.activities.en || [],
      travelTips: meta.travelTips.ar || meta.travelTips.en || [],
    },
    tr: {
      name: trans.tr?.name || b.name,
      tagline: trans.tr?.vibe || trans.tr?.name || b.name,
      category: 'Plaj',
      region: trans.tr?.region || 'Güney Sahili',
      district: trans.tr?.location?.split(',')[0]?.trim() || '',
      description: trans.tr?.description || b.description,
      bestTimeToVisit: trans.tr?.bestSeason || b.bestSeason,
      entryFee: 'Ücretsiz halka açık plaj',
      travelTimeFromColombo: meta.travelTime.tr || meta.travelTime.en || '2.5 saat',
      highlights: trans.tr?.highlights || b.highlights || [],
      activities: meta.activities.tr || meta.activities.en || [],
      travelTips: meta.travelTips.tr || meta.travelTips.en || [],
    },
  };
});
