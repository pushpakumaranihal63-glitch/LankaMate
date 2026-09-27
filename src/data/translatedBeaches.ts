import { BeachItem } from './beachesData';
import { LanguageCode } from '../types';
import { beachesEurope } from './translations/beachesEurope';

export interface LocalizedBeachFields {
  name?: string;
  location?: string;
  region?: string;
  description?: string;
  bestSeason?: string;
  vibe?: string;
  highlights?: string[];
}

const RAW_BEACH_TRANSLATIONS: Record<string, Partial<Record<LanguageCode, LocalizedBeachFields>>> = {
  'beach-mirissa': {
    si: {
      name: 'මිරිස්ස වෙරළ',
      location: 'මිරිස්ස, දකුණු පළාත',
      region: 'දකුණු වෙරළ තීරය',
      description: 'පොල් ගස් කන්ද (Coconut Tree Hill), නිල් තල්මසුන් සහ ඩොල්ෆින් නැරඹීමේ සෆාරි සහ හිරු බැසයන විට රන්වන් වෙරළේ විදුලි බුබුළු එළියෙන් බැබළෙන මුහුදු ආහාර ආපනශාලා සඳහා ප්‍රකට පාරාදීසයකි.',
      bestSeason: 'නොවැම්බර් සිට අප්‍රේල් දක්වා (සන්සුන් මුහුද සහ තල්මසුන් නැරඹීම)',
      vibe: 'පොල් උයන් සහ සාගර සෆාරි',
      highlights: [
        'දර්ශනීය Coconut Tree Hill නැරඹුම් ස්ථානය',
        'නිල් තල්මසුන් සහ ඩොල්ෆින් නැරඹීමේ උදෑසන බෝට්ටු චාරිකා',
        'පැරට් රොක් (Parrot Rock) දූපත',
        'සන්ධ්‍යාවේ නැවුම් මුහුදු ආහාර රසවිඳීම',
      ],
    },
    ta: {
      name: 'மிரிஸ்ஸ கடற்கரை',
      location: 'மிரிஸ்ஸ, தென் மாகாணம்',
      region: 'தெற்கு கடற்கரை',
      description: 'தென்னந்தோப்பு குன்று (Coconut Tree Hill), நீலத்திமிங்கல சவாரி மற்றும் மாலையில் தங்க மணற்பரப்பில் கடல் உணவு அருந்தும் சூழலுக்கு உலகப் புகழ்பெற்றது.',
      bestSeason: 'நவம்பர் முதல் ஏப்ரல் வரை (அமைதியான கடல் மற்றும் திமிங்கலப் பார்வை)',
      vibe: 'தென்னந்தோப்புகள் மற்றும் கடல் சவாரி',
      highlights: [
        'பிரபலமான Coconut Tree Hill காட்சி முனை',
        'நீலத்திமிங்கலங்கள் மற்றும் டால்பின்கள் காணும் படகு சவாரி',
        'பறவை பாறை (Parrot Rock) தீவு',
        'மாலையில் சுவையான புதிய கடல் உணவு',
      ],
    },
    ar: {
      name: 'شاطئ ميريسا',
      location: 'ميريسا، المقاطعة الجنوبية',
      region: 'الساحل الجنوبي',
      description: 'شاطئ هلالي خلاب يشتهر بتل أشجار جوز الهند ورحلات سفاري الحيتان الزرقاء ومطاعم المأكولات البحرية على الرمال الذهبية عند الغروب.',
      bestSeason: 'نوفمبر إلى أبريل (مياه هادئة ومشاهدة الحيتان)',
      vibe: 'واحات جوز الهند وسفاري بحرية',
      highlights: [
        'إطلالة تل أشجار جوز الهند الشهيرة',
        'رحلات صباحية بالقوارب لمشاهدة الحيتان الزرقاء والدلافين',
        'صخرة الببغاء بإطلالة بانورامية ساحرة',
        'مأكولات بحرية مشوية طازجة على الشاطئ',
      ],
    },
    tr: {
      name: 'Mirissa Plajı',
      location: 'Mirissa, Güney Eyaleti',
      region: 'Güney Sahili',
      description: 'Coconut Tree Hill tepesi, mavi balina okyanus safarileri ve gün batımında kumsala kurulan taze deniz ürünleri sofralarıyla ünlü büyüleyici hilal koy.',
      bestSeason: 'Kasım - Nisan (Sakin sular ve balina gözlemi)',
      vibe: 'Hindistan Cevizi Koruları ve Deniz Safarileri',
      highlights: [
        'İkonik Coconut Tree Hill manzara noktası',
        'Mavi balina ve yunus gözlemi tekne turları',
        'Panoramik körfez manzaralı Parrot Rock adacığı',
        'Sahilde dalga sesleri eşliğinde ızgara deniz ürünleri',
      ],
    },
  },
  'beach-unawatuna': {
    si: {
      name: 'උනවටුන වෙරළ',
      location: 'උනවටුන, ගාල්ල, දකුණු පළාත',
      region: 'දකුණු වෙරළ තීරය',
      description: 'කොරල් පර මඟින් ආරක්ෂිත, නිස්කලංක නිල්වන් දිය රැලි සහිත අර්ධ චන්ද්‍රාකාර වෙරළ තීරයකි. මුහුදේ පිහිනීමට සහ නිස්කලංකව විවේක ගැනීමට කදිම ස්ථානයකි.',
      bestSeason: 'නොවැම්බර් සිට අප්‍රේල් දක්වා (පැහැදිලි සන්සුන් මුහුදු ජලය)',
      vibe: 'ආරක්ෂිත පිහිනුම් සහ වෙරළ ආපනශාලා',
      highlights: [
        'ආරක්ෂිත සහ සන්සුන් කොරල් මුහුදු කලාපය',
        'ජංගල් බීච් (Jungle Beach) සහ රූමස්සල අභයභූමිය',
        'ජපන් සාම චෛත්‍යයේ සිට හිරු බැසයාම නැරඹීම',
        'ඓතිහාසික ගාලු කොටුවේ සිට විනාඩි 10ක දුර',
      ],
    },
    ta: {
      name: 'உனவட்டுன கடற்கரை',
      location: 'உனவட்டுன, காலி, தென் மாகாணம்',
      region: 'தெற்கு கடற்கரை',
      description: 'பவளப்பாறைகளால் பாதுகாக்கப்பட்ட அமைதியான நீலக்கடல் விரிகுடா, நீந்துவதற்கும் கடலோர உணவகங்களில் இளைப்பாறுவதற்கும் ஏற்றது.',
      bestSeason: 'நவம்பர் முதல் ஏப்ரல் வரை (தெளிவான நீர் & அமைதியான கடல்)',
      vibe: 'பாதுகாப்பான நீச்சல் & கடற்கரை உணவகங்கள்',
      highlights: [
        'பாதுகாப்பான பவளப்பாறை நீச்சல் பகுதி',
        'ஜங்கிள் கடற்கரை மற்றும் ருமஸல சரணாலயம்',
        'ஜப்பானிய அமைதி பகோடாவிலிருந்து சூரிய அஸ்தமனக் காட்சி',
        'காலி டச்சு கோட்டையிலிருந்து 10 நிமிட தொலைவு',
      ],
    },
    ar: {
      name: 'شاطئ أوناوتونا',
      location: 'أوناوتونا، غالي، المقاطعة الجنوبية',
      region: 'الساحل الجنوبي',
      description: 'خليج هلالي متلألئ تحميه الشعاب المرجانية، يوفر مياهاً فيروزية هادئة للسباحة ومقاهي شاطئية ممتعة وقريب من معبد السلام الياباني.',
      bestSeason: 'نوفمبر إلى أبريل (مياه نقية وهادئة للسباحة)',
      vibe: 'سباحة آمنة ومقاهي شاطئية',
      highlights: [
        'مياه سباحة آمنة ومحمية بالشعاب المرجانية',
        'مسار قصير إلى شاطئ الغابة ومحمية روماسالا',
        'مشهد الغروب من معبد السلام الياباني',
        'يبعد 10 دقائق فقط عن قلعة غالي التاريخية',
      ],
    },
    tr: {
      name: 'Unawatuna Plajı',
      location: 'Unawatuna, Galle, Güney Eyaleti',
      region: 'Güney Sahili',
      description: 'Mercan resifleriyle korunan sakin turkuaz suları, palmiye salıncaklı sahil kafeleri ve Japon Barış Pagodası ile ünlü at nalı şeklinde ışıltılı koy.',
      bestSeason: 'Kasım - Nisan (Berrak sular ve sakin deniz)',
      vibe: 'Korumalı Yüzme ve Sahil Kafeleri',
      highlights: [
        'Mercanlarla korunaklı, güvenli yüzme alanı',
        'Jungle Beach ve Rumassala koruma alanına yürüyüş',
        'Japon Barış Pagodası’ndan gün batımı manzarası',
        'Tarihi UNESCO Galle Hollanda Kalesi’ne 10 dakika',
      ],
    },
  },
  'beach-bentota': {
    si: {
      name: 'බෙන්තොට වෙරළ',
      location: 'බෙන්තොට, දකුණු පළාත',
      region: 'නිරිතදිග වෙරළ තීරය',
      description: 'එක් පසෙකින් ඉන්දියන් සාගරයත් අනෙක් පසින් නිසල බෙන්තර ගංගාවත් මායිම් වූ රන්වන් වැලි තීරය. ජල ක්‍රීඩා සහ සුඛෝපභෝගී හෝටල් නිකේතන සඳහා ප්‍රකටය.',
      bestSeason: 'නොවැම්බර් සිට අප්‍රේල් දක්වා (හිරු එළිය සහ නිසල කලපුව)',
      vibe: 'ජල ක්‍රීඩා සහ ගංගා පරිසර පද්ධතිය',
      highlights: [
        'ජෙට් ස්කී, වේක්බෝඩින් ඇතුළු විනෝදජනක ජල ක්‍රීඩා',
        'මාදු ගඟේ කඩොලාන වනාන්තර ඔස්සේ බෝට්ටු සවාරි',
        'ජෙෆ්රි බාවාගේ ලුණුගඟ (Lunuganga) උද්‍යාන නැරඹීම',
        'කොස්ගොඩ මුහුදු කැස්බෑ සංරක්ෂණ මධ්‍යස්ථානය',
      ],
    },
    ta: {
      name: 'பெந்தோட்டை கடற்கரை',
      location: 'பெந்தோட்டை, தென் மாகாணம்',
      region: 'தென்மேற்கு கடற்கரை',
      description: 'ஒருபுறம் இந்தியப் பெருங்கடலும் மறுபுறம் அமைதியான பெந்தோட்டை நதியும் சூழ்ந்த தங்க மணல் தீபகற்பம். நீர் விளையாட்டுகளுக்கு பெயர் பெற்றது.',
      bestSeason: 'நவம்பர் முதல் ஏப்ரல் வரை (சூரிய ஒளி & அமைதியான நீர்)',
      vibe: 'நீர் விளையாட்டுகள் & நதிக்கரை அமைதி',
      highlights: [
        'ஜெட் ஸ்கை, வேக் போர்டிங் போன்ற நீர் விளையாட்டுகள்',
        'மாது கங்கா அலையாத்தி காடுகள் படகு சவாரி',
        'ஜெப்ரி பாவாவின் லுணுகங்கா தோட்டம்',
        'கொஸ்கொட கடல் ஆமை பாதுகாப்பு மையம்',
      ],
    },
    ar: {
      name: 'شاطئ بينتوتا',
      location: 'بينتوتا، المقاطعة الجنوبية',
      region: 'الساحل الجنوبي الغربي',
      description: 'شبه جزيرة رملية ذهبية واسعة يحدها المحيط الهندي من جهة ونهر بينتوتا الهادئ من جهة أخرى، وتعتبر عاصمة الرياضات المائية والمنتجعات الفاخرة.',
      bestSeason: 'نوفمبر إلى أبريل (أيام مشمسة ومياه هادئة)',
      vibe: 'رياضات مائية وأشجار المانغروف النهرية',
      highlights: [
        'التزلج على الماء وركوب الأمواج في مياه النهر الهادئة',
        'رحلة سفاري بالقارب في نهر مادو عبر غابات المانغروف',
        'زيارة عقار لونوجانغا للراحل جيفري باوا',
        'مشروع حماية السلاحف البحرية في كوسغودا',
      ],
    },
    tr: {
      name: 'Bentota Plajı',
      location: 'Bentota, Güney Eyaleti',
      region: 'Güneybatı Sahili',
      description: 'Bir yanında Hint Okyanusu, diğer yanında sakin Bentota Nehri bulunan, su sporları ve lüks tatil köyleriyle ünlü geniş altın kumlu yarımada.',
      bestSeason: 'Kasım - Nisan (Güneşli günler ve ayna gibi lagünler)',
      vibe: 'Su Sporları ve Nehir Mangrovları',
      highlights: [
        'Nehir sularında jet ski, wakeboard ve su sporları',
        'Madu Ganga nehrinde mangrov tünelleri tekne safarisi',
        'Mimar Geoffrey Bawa’nın Lunuganga malikanesi',
        'Kosgoda deniz kaplumbağaları koruma merkezi',
      ],
    },
  },
  'beach-weligama': {
    si: {
      name: 'වැලිගම වෙරළ',
      location: 'වැලිගම, මාතර, දකුණු පළාත',
      region: 'දකුණු වෙරළ තීරය',
      description: 'මුහුදු රළ මත ලිස්සා යාම (Surfing) ආරම්භකයින්ට ඉගෙන ගැනීමට කදිම වැලි පත්ල සහිත මුහුදු බොක්කකි. රිටිපන්න ධීවරයින්ගේ දසුන මෙහි විශේෂත්වයකි.',
      bestSeason: 'ඔක්තෝබර් සිට අප්‍රේල් දක්වා (ආරම්භක සර්ෆින් රළ)',
      vibe: 'සර්ෆින් කඳවුරු සහ රිටිපන්න ධීවරයින්',
      highlights: [
        'ආරම්භකයින්ට සහ ලෝන්ග්බෝඩ් ක්‍රීඩකයින්ට සුදුසු මෘදු රළ',
        'උදෑසන හා සන්ධ්‍යාවේ සම්ප්‍රදායික රිටිපන්න ධීවරයින්',
        'ටැප්‍රොබේන් (Taprobane) පෞද්ගලික කුඩා දූපත',
        'සර්ෆ් පුවරු කුලියට ගැනීම සහ වෙරළ ආපනශාලා',
      ],
    },
    ta: {
      name: 'வெலிகம கடற்கரை',
      location: 'வெலிகம, மாத்தறை, தென் மாகாணம்',
      region: 'தெற்கு கடற்கரை',
      description: 'அலைச்சறுக்கு (Surfing) கற்றுக்கொள்ள ஏற்ற பரந்த மணல் விரிகுடா மற்றும் பாரம்பரிய தடி மீன்பிடி (Stilt Fishing) முறைகளுக்கு பிரபலமானது.',
      bestSeason: 'அக்டோபர் முதல் ஏப்ரல் வரை (அலைச்சறுக்குக்கு உகந்தது)',
      vibe: 'சர்பிங் முகாம்கள் & தடி மீன்பிடி',
      highlights: [
        'ஆரம்பநிலையாளர்களுக்கான மென்மையான அலைகள்',
        'பாரம்பரிய தடி மீன்பிடி கலைஞர்களின் காட்சி',
        'தப்ரோபேன் (Taprobane) தனித்தீவு',
        'அலைச்சறுக்கு பலகை வாடகை மற்றும் கடலோர கஃபேக்கள்',
      ],
    },
    ar: {
      name: 'شاطئ ويليغاما',
      location: 'ويليغاما، ماتارا، المقاطعة الجنوبية',
      region: 'الساحل الجنوبي',
      description: 'خليج رملي واسع ذو أمواج شاطئية لطيفة تجعله الوجهة الأولى لتعلم ركوب الأمواج في سريلانكا، مع قوارب الكاتاماران والصيادين على الركائز.',
      bestSeason: 'أكتوبر إلى أبريل (أمواج مثالية للمبتدئين)',
      vibe: 'معسكرات ركوب الأمواج والصيادون على الركائز',
      highlights: [
        'أمواج لطيفة فوق قاع رملي مثالية للمبتدئين',
        'مشاهدة الصيادين التقليديين على الركائز الخشبية',
        'جزيرة تابروبين الخاصة الخلابة',
        'استئجار ألواح التزلج وعصائر الشاطئ الطازجة',
      ],
    },
    tr: {
      name: 'Weligama Plajı',
      location: 'Weligama, Matara, Güney Eyaleti',
      region: 'Güney Sahili',
      description: 'Yumuşak dalgalarıyla sörf öğrenmek için Sri Lanka’nın bir numaralı merkezi olan, geleneksel sırık balıkçıları ve renkli teknelerle süslü geniş körfez.',
      bestSeason: 'Ekim - Nisan (Yeni başlayanlar için ideal dalgalar)',
      vibe: 'Sörf Kampları ve Sırık Balıkçıları',
      highlights: [
        'Yeni başlayanlar için kum tabanlı yumuşak dalgalar',
        'Gündoğumu ve günbatımında geleneksel sırık balıkçıları',
        'Körfezdeki özel Taprobane Adası manzarası',
        'Sörf tahtası kiralama ve sahil kafeleri',
      ],
    },
  },
  'beach-tangalle': {
    si: {
      name: 'තංගල්ල වෙරළ',
      location: 'තංගල්ල, දකුණු පළාත',
      region: 'ගැඹුරු දකුණු වෙරළ තීරය',
      description: 'නිහඬ ගල්පර සහිත සුන්දර ගොයන්බොක්ක වෙරළ, නිල්වන් සාගරය සහ යෝධ මුහුදු කැස්බෑවන් බිත්තර දැමීමට පැමිණෙන රෙකව වෙරළ මෙහි පිහිටා ඇත.',
      bestSeason: 'නොවැම්බර් සිට අප්‍රේල් දක්වා (වියළි සෞම්‍ය කාලගුණය)',
      vibe: 'නිස්කලංක සැඟවුණු වෙරළ හා නිදහස',
      highlights: [
        'ගොයන්බොක්ක සහ සයිලන්ට් බීච් (Silent Beach) රහස් බොක්කවල්',
        'රෙකව වෙරළේ රාත්‍රී මුහුදු කැස්බෑ නිරීක්ෂණ චාරිකා',
        'හූමනාය ස්වාභාවික මුහුදු පිඹින කුහරය (Blowhole)',
        'මාවැල්ල කලපුවේ මනරම් කයාක් ඔරු සවාරි',
      ],
    },
    ta: {
      name: 'தங்கல்ல கடற்கரை',
      location: 'தங்கல்ல, தென் மாகாணம்',
      region: 'ஆழ்ந்த தெற்கு கடற்கரை',
      description: 'அமைதியான பாறை விரிகுடாக்கள் மற்றும் இரவில் ராட்சத கடல் ஆமைகள் முட்டையிட வரும் ரேகவ கடற்கரையைக் கொண்ட அழகிய கடற்கரை.',
      bestSeason: 'நவம்பர் முதல் ஏப்ரல் வரை (இதமான வெப்பம் & அமைதி)',
      vibe: 'அமைதியான சூழல் & இயற்கை மணல்',
      highlights: [
        'கோயம்பொக்க மற்றும் சைலண்ட் கடற்கரைகள்',
        'ரேகவ கடற்கரையில் இரவு நேர ஆமை நோக்கல்',
        'ஹும்மானாய இயற்கை கடல் நீரூற்று (Blowhole)',
        'மாவெல்ல லகூனில் கயாக் படகு சவாரி',
      ],
    },
    ar: {
      name: 'شاطئ تانغالي',
      location: 'تانغالي، المقاطعة الجنوبية',
      region: 'ساحل أقصى الجنوب',
      description: 'امتدادات واسعة من الرمال الذهبية البكر وخلجان صخرية سرية مثل غويامبوكا، وشاطئ ريكاوا حيث تعشش السلاحف البحرية العملاقة تحت ضوء القمر.',
      bestSeason: 'نوفمبر إلى أبريل (دفء استوائي وخلجان هادئة)',
      vibe: 'ملاذات منعزلة وشواطئ بكر',
      highlights: [
        'خلجان غويامبوكا وسايلنت بيتش المنعزلة',
        'جولات ليلية لمشاهدة تعشيش السلاحف في شاطئ ريكاوا',
        'نافورة هومانايا البحرية الطبيعية',
        'جولات التجديف بقوارب الكاياك في بحيرة ماويلا',
      ],
    },
    tr: {
      name: 'Tangalle Plajı',
      location: 'Tangalle, Güney Eyaleti',
      region: 'Derin Güney Sahili',
      description: 'Goyambokka gibi gizli kayalık koylar, turkuaz dalgalar ve dev deniz kaplumbağalarının ay ışığında yumurtladığı Rekawa Plajı ile el değmemiş altın kumsallar.',
      bestSeason: 'Kasım - Nisan (Sıcak tropikal hava ve sakin koylar)',
      vibe: 'İzole Cennetler ve Vahşi Kumsallar',
      highlights: [
        'Goyambokka ve Silent Beach gizli lagünleri',
        'Rekawa plajında gece deniz kaplumbağası gözlemi',
        'Dünyanın en büyük ikinci doğal deniz bacası Hummanaya',
        'Mawella Lagünü boyunca kano turları',
      ],
    },
  },
  'beach-arugambay': {
    si: {
      name: 'ආරුගම් බේ වෙරළ',
      location: 'පොතුවිල්, නැගෙනහිර පළාත',
      region: 'නැගෙනහිර වෙරළ තීරය',
      description: 'ලෝකයේ හොඳම සර්ෆින් ස්ථාන 10 අතරට ගැනෙන ආරුගම් බේ, සුන්දර මුහුදු රළ, නිදහස් වෙරළ ආපනශාලා සහ වන අලින් ගැවසෙන කලපු පරිසරයකින් සමන්විතය.',
      bestSeason: 'මැයි සිට ඔක්තෝබර් දක්වා (උච්ච සර්ෆින් කාලය සහ හිරු එළිය)',
      vibe: 'ලෝක සර්ෆින් පාරාදීසය සහ බොහීමියන් සුවය',
      highlights: [
        'මේන් පොයින්ට් (Main Point) හි ලෝක ප්‍රකට දකුණට නැමෙන රළ',
        'එලිෆන්ට් රොක් (Elephant Rock) මුදුනට නැග හිරු බැසයාම නැරඹීම',
        'පොතුවිල් කඩොලාන කලපුවේ ඔරු සවාරිය',
        'කුමන ජාතික වනෝද්‍යානයේ පක්ෂීන් සහ වනජීවී චාරිකා',
      ],
    },
    ta: {
      name: 'ஆறுகம் குடா',
      location: 'பொத்துவில், கிழக்கு மாகாணம்',
      region: 'கிழக்கு கடற்கரை',
      description: 'உலகின் முதல் 10 அலைச்சறுக்கு இடங்களில் ஒன்றான ஆறுகம் குடா, சர்வதேச அலைச்சறுக்கு வீரர்கள் கூடும் புகழ்பெற்ற தளமாகும்.',
      bestSeason: 'மே முதல் அக்டோபர் வரை (உச்ச அலைச்சறுக்கு பருவம்)',
      vibe: 'சர்வதேச அலைச்சறுக்கு சொர்க்கம்',
      highlights: [
        'மெயின் பாயிண்ட் உலகப் புகழ்பெற்ற அலைகள்',
        'எலிபன்ட் ராக் பாறையிலிருந்து சூரிய அஸ்தமனக் காட்சி',
        'பொத்துவில் அலையாத்தி காட்டுப் படகு சவாரி',
        'குமண தேசிய பூங்காவில் பறவைகள் நோக்கல்',
      ],
    },
    ar: {
      name: 'خليج أروغام',
      location: 'بوتوفيل، المقاطعة الشرقية',
      region: 'الساحل الشرقي',
      description: 'يصنف ضمن أفضل 10 نقاط لركوب الأمواج في العالم، ويتميز بأمواج استثنائية ومقاهي شاطئية نابضة وبحيرات طبيعية تتجول فيها الفيلة البرية.',
      bestSeason: 'مايو إلى أكتوبر (موسم الذروة لركوب الأمواج والأجواء المشمسة)',
      vibe: 'جنة ركوب الأمواج العالمية وطاقة بوهيمية',
      highlights: [
        'أمواج شاطئية عالمية في نقطة مين بوينت وويسكي بوينت',
        'مشهد الغروب الرائع من أعلى صخرة الفيل',
        'سفاري بالقوارب الخشبية في بحيرة مانغروف بوتوفيل',
        'زيارة برية لمنتزه كومانا الوطني القريب',
      ],
    },
    tr: {
      name: 'Arugam Bay',
      location: 'Pottuvil, Doğu Eyaleti',
      region: 'Doğu Sahili',
      description: 'Dünyanın en iyi 10 sörf noktasından biri kabul edilen, kusursuz sağ yönlü dalgaları, bohem kafeleri ve çevresinde vahşi fillerin dolaştığı efsanevi koy.',
      bestSeason: 'Mayıs - Ekim (Dünya standartlarında sörf ve güneşli günler)',
      vibe: 'Dünya Sörf Cenneti ve Bohem Ruh',
      highlights: [
        'Main Point ve Whiskey Point noktalarında dünyaca ünlü dalgalar',
        'Elephant Rock tepesinden gün batımı manzarası',
        'Pottuvil mangrov lagününde sakin kano safarisi',
        'Yakındaki Kumana Milli Parkı’nda el değmemiş yaban hayatı',
      ],
    },
  },
  'beach-nilaveli': {
    si: {
      name: 'නිලාවෙලි වෙරළ',
      location: 'නිලාවෙලි, ත්‍රිකුණාමලය, නැගෙනහිර පළාත',
      region: 'නැගෙනහිර වෙරළ තීරය',
      description: 'පිරිසිදු සුදු වැලි තලාව සහ වීදුරුවක් මෙන් පැහැදිලි නිල්වන් සාගරය. පරෙවි දූපත (Pigeon Island) ජාතික වනෝද්‍යානයේ කොරල් සහ මත්ස්‍යයින් නැරඹීමට ප්‍රධාන පිවිසුමයි.',
      bestSeason: 'මාර්තු සිට ඔක්තෝබර් දක්වා (නිසල මුහුද සහ පැහැදිලි ජලය)',
      vibe: 'සුදු කොරල් වැලි සහ සාගර අභයභූමිය',
      highlights: [
        'පරෙවි දූපත (Pigeon Island) වෙත වේග බෝට්ටු චාරිකා',
        'අහිංසක කොරල් මෝරුන් සහ කැස්බෑවන් සමඟ පිහිනීම (Snorkeling)',
        'ඓතිහාසික කෝනේශ්වරම් කෝවිල සහ ස්වාමි පර්වතය',
        'නිදහසේ ඇවිද යාමට සුදුසු දිගු නිහඬ වෙරළ තීරය',
      ],
    },
    ta: {
      name: 'நிலாவெளி கடற்கரை',
      location: 'நிலாவெளி, திருகோணமலை, கிழக்கு மாகாணம்',
      region: 'கிழக்கு கடற்கரை',
      description: 'வெள்ளை மணல் மற்றும் படிகம்போன்ற தெளிவான கடல் நீர். புறாத்தீவு (Pigeon Island) கடல் தேசிய பூங்காவிற்கு செல்வதற்கான முக்கிய தளம்.',
      bestSeason: 'மார்ச் முதல் அக்டோபர் வரை (தெளிவான நீர் & அமைதி)',
      vibe: 'வெள்ளை மணல் & கடல்வாழ் சரணாலயம்',
      highlights: [
        'புறாத்தீவு கடல் தேசிய பூங்காவிற்கு வேகப்படகு சவாரி',
        'பாதுகாப்பான சுறாக்கள் மற்றும் ஆமைகளுடன் ஸ்நோர்கெலிங்',
        'வரலாற்று சிறப்புமிக்க திருகோணமலை கோணேஸ்வரம் கோவில்',
        'அமைதியான காலை நடைப்பயிற்சிக்கான நீண்ட கடற்கரை',
      ],
    },
    ar: {
      name: 'شاطئ نيلافيلي',
      location: 'نيلافيلي، ترينكومالي، المقاطعة الشرقية',
      region: 'الساحل الشرقي',
      description: 'أميال من الرمال البيضاء النقية والمياه الفيروزية الصافية، وتعد نقطة الانطلاق الرئيسية إلى حديقة بيجون آيلاند البحرية للغطس بين الشعاب المرجانية.',
      bestSeason: 'مارس إلى أكتوبر (بحر هادئ كالمرآة ورؤية ممتازة تحت الماء)',
      vibe: 'رمال بيضاء ناصعة ومحمية بحرية',
      highlights: [
        'رحلات بالقوارب السريعة إلى حديقة جزيرة الحمام البحرية',
        'الغطس بجانب أسماك قرش الشعاب المرجانية غير الضارة والسلاحف',
        'معبد كونيشفارام الهندوسي التاريخي على جرف صخرة سوامي',
        'شاطئ واسع هادئ للمشي الصباحي المنعش',
      ],
    },
    tr: {
      name: 'Nilaveli Plajı',
      location: 'Nilaveli, Trincomalee, Doğu Eyaleti',
      region: 'Doğu Sahili',
      description: 'Bembeyaz yumuşak kumları ve kristal berraklığındaki suları ile ünlü, şnorkelle dalış için Pigeon Island Deniz Milli Parkı’na açılan ana kapı.',
      bestSeason: 'Mart - Ekim (Cam gibi deniz ve yüksek sualtı görüşü)',
      vibe: 'Beyaz Mercan Kumları ve Deniz Koruma Alanı',
      highlights: [
        'Pigeon Island Deniz Milli Parkı’na sürat teknesi turları',
        'Zararsız resif köpekbalıkları ve deniz kaplumbağalarıyla yüzme',
        'Swami Rock üzerindeki tarihi Koneswaram Hindu Tapınağı',
        'Uzun sahil yürüyüşleri için sakin ve el değmemiş kumsal',
      ],
    },
  },
  'beach-pasikuda': {
    si: {
      name: 'පාසිකුඩා වෙරළ',
      location: 'පාසිකුඩා, මඩකලපුව, නැගෙනහිර පළාත',
      region: 'නැගෙනහිර වෙරළ තීරය',
      description: 'දිය රැලි නොමැති, නොගැඹුරු පැහැදිලි නිල්වන් ජලය සහිත මුහුදු බොක්කකි. මුහුද දෙසට මීටර් සිය ගණනක් ආරක්ෂිතව ඇවිද යා හැකි ලොව දුර්ලභ වෙරළකි.',
      bestSeason: 'මාර්තු සිට ඔක්තෝබර් දක්වා (නිසල උණුසුම් කලපුව)',
      vibe: 'නොගැඹුරු මුහුද සහ සුඛෝපභෝගී පවුලේ විවේකය',
      highlights: [
        'මුහුද තුළට මීටර් 300කට වඩා ආරක්ෂිතව පයින් ඇවිද යා හැකි වීම',
        'දරුවන්ට සහ පවුල් වලට පිහිනීමට ඉතාමත් ආරක්ෂිත වීම',
        'පැඩල් බෝට්ටු, කයාක් සහ ජල ක්‍රීඩා',
        'හරිත උද්‍යාන සහිත සුඛෝපභෝගී වෙරළ හෝටල්',
      ],
    },
    ta: {
      name: 'பாசிக்குடா கடற்கரை',
      location: 'பாசிக்குடா, மட்டக்களப்பு, கிழக்கு மாகாணம்',
      region: 'கிழக்கு கடற்கரை',
      description: 'நீரோட்டமற்ற ஆழமற்ற அமைதியான கடல் விரிகுடா. கடலுக்குள் நூற்றுக்கணக்கான மீட்டர்கள் பாதுகாப்பாக நடந்து செல்லக்கூடிய தனித்துவமான தளம்.',
      bestSeason: 'மார்ச் முதல் அக்டோபர் வரை (அமைதியான நீர்நிலை)',
      vibe: 'ஆழமற்ற கடல் & குடும்ப சுற்றுலா',
      highlights: [
        'கடலுக்குள் 300+ மீட்டர்கள் வரை பாதுகாப்பாக நடத்தல்',
        'குழந்தைகள் மற்றும் குடும்பத்தினர் நீந்துவதற்கு மிகவும் பாதுகாப்பானது',
        'துடுப்பு படகு மற்றும் கயாக் நீர் விளையாட்டுகள்',
        'உயர்தர கடற்கரை தங்குமிடங்கள்',
      ],
    },
    ar: {
      name: 'شاطئ باسيكودا',
      location: 'باسيكودا، باتيكالوا، المقاطعة الشرقية',
      region: 'الساحل الشرقي',
      description: 'يشتهر بخليج الشعاب المرجانية الضحل للغاية حيث يمكن للزوار السير مئات الأمتار داخل المياه الدافئة الصافية بأمان تام وبدون تيارات.',
      bestSeason: 'مارس إلى أكتوبر (مياه دافئة وهادئة كالمرآة)',
      vibe: 'مياه ضحلة وملاذ عائلي فاخر',
      highlights: [
        'المشي لمسافة تزيد عن 300 متر داخل البحر على رمال ناعمة',
        'مثالي للعائلات والأطفال والسباحة المريحة',
        'التجديف بالكاياك وركوب الألواح الشراعية',
        'منتجعات شاطئية فاخرة ذات حدائق استوائية خصبة',
      ],
    },
    tr: {
      name: 'Pasikuda Plajı',
      location: 'Pasikuda, Batticaloa, Doğu Eyaleti',
      region: 'Doğu Sahili',
      description: 'Sıfır akıntılı, sığ ve ılık turkuaz sularında yüzlerce metre güvenle yürünebilen, aileler için ideal eşsiz bir mercan koyu.',
      bestSeason: 'Mart - Ekim (Ilık lagün ve ayna gibi durgun deniz)',
      vibe: 'Sığ Sular ve Lüks Aile Tatilleri',
      highlights: [
        'Yumuşak kumlar üzerinde denizin içine doğru 300+ metre yürüyebilme',
        'Çocuklar ve aileler için son derece güvenli yüzme ortamı',
        'Kürek sörfü, kano ve rüzgar sörfü aktiviteleri',
        'Geniş bahçelere sahip lüks sahil tatil köyleri',
      ],
    },
  },
  'beach-hikkaduwa': {
    si: {
      name: 'හික්කඩුව වෙරළ',
      location: 'හික්කඩුව, දකුණු පළාත',
      region: 'දකුණු වෙරළ තීරය',
      description: 'ජාතික කොරල් උද්‍යානය, වෙරළ අසලටම පිහිනා එන වනජීවී යෝධ මුහුදු කැස්බෑවන්, සර්ෆින් ක්‍රීඩාව සහ විචිත්‍රවත් රාත්‍රී වෙරළ දිවිය සඳහා ප්‍රසිද්ධය.',
      bestSeason: 'නොවැම්බර් සිට අප්‍රේල් දක්වා (සර්ෆින්, කොරල් සහ විනෝදය)',
      vibe: 'මුහුදු කැස්බෑවන් සහ කොරල් පර පාරාදීසය',
      highlights: [
        'වෙරළට පැමිණෙන යෝධ මුහුදු කැස්බෑවන්ට ආහාර ලබා දීම',
        'වීදුරු පත්ල සහිත බෝට්ටු මඟින් හික්කඩුව කොරල් පර නැරඹීම',
        'මේන් රීෆ් (Main Reef) හි ජනප්‍රිය සර්ෆින් රළ',
        'සජීවී සංගීතය සහ වෙරළබඩ මුහුදු ආහාර බාබකියු',
      ],
    },
    ta: {
      name: 'ஹிக்கடுவ கடற்கரை',
      location: 'ஹிக்கடுவ, தென் மாகாணம்',
      region: 'தெற்கு கடற்கரை',
      description: 'பவளப்பாறை தேசிய பூங்கா, கடற்கரைக்கு வரும் காட்டு கடல் ஆமைகள், மற்றும் சுறுசுறுப்பான இரவு வாழ்க்கைக்கு புகழ்பெற்றது.',
      bestSeason: 'நவம்பர் முதல் ஏப்ரல் வரை (அலைச்சறுக்கு & தெளிவான பவளப்பாறைகள்)',
      vibe: 'கடல் ஆமைகள் & பவளப்பாறை மையம்',
      highlights: [
        'கரையில் வரும் ராட்சத பச்சை கடல் ஆமைகளுக்கு உணவளித்தல்',
        'கண்ணாடி அடிப்பகுதி படகில் பவளப்பாறைகளை பார்வையிடுதல்',
        'பிரபலமான அலைச்சறுக்கு தளங்கள்',
        'சுவையான கடல் உணவு மற்றும் இரவு நேர கஃபேக்கள்',
      ],
    },
    ar: {
      name: 'شاطئ هيكادوا',
      location: 'هيكادوا، المقاطعة الجنوبية',
      region: 'الساحل الجنوبي',
      description: 'مدينة ساحلية أسطورية تشتهر بمنتزه المرجان البحري الوطني والسلاحف البحرية البرية الودودة وأمواج ركوب الأمواج والمطاعم الشاطئية الحيوية.',
      bestSeason: 'نوفمبر إلى أبريل (ركوب أمواج رائع وشعاب مرجانية نقية)',
      vibe: 'سلاحف بحرية ومركز للشعاب المرجانية',
      highlights: [
        'إطعام السلاحف الخضراء العملاقة بيدك عند الشاطئ',
        'جولات بالقوارب ذات القاع الزجاجي لمشاهدة المرجان',
        'ركوب الأمواج الممتع عند حاجز الشعاب المرجانية',
        'حفلات شواء بحرية ومقاهي موسيقية حية على الشاطئ',
      ],
    },
    tr: {
      name: 'Hikkaduwa Plajı',
      location: 'Hikkaduwa, Güney Eyaleti',
      region: 'Güney Sahili',
      description: 'Mercan milli parkı, kıyıya kadar yüzen dev yeşil kaplumbağaları, resif sörfü ve enerjik sahil mekanlarıyla ünlü efsanevi sahil kasabası.',
      bestSeason: 'Kasım - Nisan (Harika sörf dalgaları ve berrak resifler)',
      vibe: 'Vahşi Kaplumbağalar ve Mercan Resifleri',
      highlights: [
        'Kıyıda dev yeşil deniz kaplumbağalarını ellerinizle besleme',
        'Cam tabanlı teknelerle Hikkaduwa mercan resifleri turu',
        'Main Reef ve Benny’s noktalarında resif dalgası sörfü',
        'Canlı müzik, deniz ürünleri barbeküleri ve sahil kafeleri',
      ],
    },
  },
  'beach-hiriketiya': {
    si: {
      name: 'හිරිකැටිය වෙරළ',
      location: 'දික්වැල්ල, දකුණු පළාත',
      region: 'දකුණු වෙරළ තීරය',
      description: 'ඝන නිවර්තන වනාන්තරයෙන් වටවූ අශ්ව ලාඩමක හැඩැති මනරම් නිල්වන් බොක්කකි. සර්ෆින් ක්‍රීඩාව සහ නිදහස් කලාත්මක ආපනශාලා සංස්කෘතියට ප්‍රකටය.',
      bestSeason: 'වසර පුරාම (උච්ච රළ නොවැම්බර් සිට අප්‍රේල් දක්වා)',
      vibe: 'නිවර්තන වනගත බොක්ක සහ බොහීමියන් සර්ෆින්',
      highlights: [
        'වසර පුරා සක්‍රීය අශ්ව ලාඩම් හැඩැති වම් අත සර්ෆින් රළ',
        'පොල් ගස් සෙවණේ පිහිටි ආකර්ෂණීය වෙරළ ආපනශාලා',
        'උදෑසන වෙරළ යෝගා සහ රසවත් එස්ප්‍රෙසෝ කෝපි',
        'දික්වැල්ල ස්වාභාවික මුහුදු පිඹින කුහරය වෙත කෙටි දුර',
      ],
    },
    ta: {
      name: 'ஹிரிகெட்டிய கடற்கரை',
      location: 'திக்வெல்ல, தென் மாகாணம்',
      region: 'தெற்கு கடற்கரை',
      description: 'பசுமையான காடுகளால் சூழப்பட்ட குதிரைலாட வடிவிலான அழகிய விரிகுடா. அமைதியான சூழல் மற்றும் அலைச்சறுக்குக்கு பிரபலமானது.',
      bestSeason: 'ஆண்டு முழுவதும் (உச்ச அலைகள் நவம்பர் முதல் ஏப்ரல்)',
      vibe: 'காட்டு விரிகுடா & அமைதியான அலைச்சறுக்கு',
      highlights: [
        'தொடர்ச்சியான குதிரைலாட அலைச்சறுக்கு அலைகள்',
        'தென்னை மரங்களின் கீழ் அமைந்த கவர்ச்சியான கஃபேக்கள்',
        'காலை நேர யோகா மற்றும் புத்துணர்ச்சி பானங்கள்',
        'திக்வெல்ல கடல் ஊற்று பாறைக்கு குறுகிய நடைப்பயணம்',
      ],
    },
    ar: {
      name: 'شاطئ هيريكيتيا',
      location: 'ديكويلا، المقاطعة الجنوبية',
      region: 'الساحل الجنوبي',
      description: 'خليج هادئ زمردي على شكل حدوة حصان محاط بأشجار النخيل والغابات، ويشتهر بثقافة المقاهي البوهيمية وأمواج ركوب الأمواج طوال العام.',
      bestSeason: 'على مدار العام (ذروة الأمواج من نوفمبر إلى أبريل)',
      vibe: 'خليج استوائي وملاذ عشاق ركوب الأمواج',
      highlights: [
        'أمواج شاطئية يسارية متسقة على مدار العام',
        'مقاهي شاطئية ساحرة وسط أشجار جوز الهند الباسقة',
        'جلسات يوغا صباحية على الشاطئ ومشروبات فاخرة',
        'نزهة قصيرة إلى نافورة ديكويلا الصخرية الطبيعية',
      ],
    },
    tr: {
      name: 'Hiriketiya Plajı',
      location: 'Dikwella, Güney Eyaleti',
      region: 'Güney Sahili',
      description: 'Yemyeşil tropikal ormanlarla çevrili, zümrüt yeşili at nalı şeklinde gizli bir koy. Bohem kafe kültürü ve yıl boyu süren sörf dalgalarıyla ünlü.',
      bestSeason: 'Yıl boyu (Kasım - Nisan arası en iyi dalgalar)',
      vibe: 'Tropikal Koy ve Bohem Sörf Cenneti',
      highlights: [
        'Yıl boyunca kırılan sol yönlü at nalı dalgası',
        'Hindistan cevizi ağaçları altında büyüleyici sahil kafeleri',
        'Sabah sahil yogası ve kaliteli kahve durakları',
        'Dikwella doğal deniz bacasına kısa yürüyüş mesafesi',
      ],
    },
  },
};

function mergeBeachTranslations(
  base: Record<string, Partial<Record<LanguageCode, LocalizedBeachFields>>>,
  extra: Record<string, Partial<Record<LanguageCode, LocalizedBeachFields>>>
): Record<string, Partial<Record<LanguageCode, LocalizedBeachFields>>> {
  const result: Record<string, Partial<Record<LanguageCode, LocalizedBeachFields>>> = {};
  for (const [id, langs] of Object.entries(base)) {
    result[id] = { ...langs };
  }
  for (const [id, langs] of Object.entries(extra)) {
    if (!result[id]) result[id] = {};
    Object.assign(result[id], langs);
  }
  return result;
}

export const BEACH_TRANSLATIONS: Record<string, Partial<Record<LanguageCode, LocalizedBeachFields>>> = mergeBeachTranslations(
  RAW_BEACH_TRANSLATIONS,
  beachesEurope
);

export function getLocalizedBeach(beach: BeachItem, language: LanguageCode): BeachItem {
  if (!beach || language === 'en') {
    return beach;
  }

  const translated = BEACH_TRANSLATIONS[beach.id]?.[language];
  if (!translated) {
    return beach;
  }

  return {
    ...beach,
    name: translated.name || beach.name,
    location: translated.location || beach.location,
    region: translated.region || beach.region,
    description: translated.description || beach.description,
    bestSeason: translated.bestSeason || beach.bestSeason,
    vibe: translated.vibe || beach.vibe,
    highlights: translated.highlights && translated.highlights.length > 0 ? translated.highlights : beach.highlights,
  };
}

export function getLocalizedBeaches(beaches: BeachItem[], language: LanguageCode): BeachItem[] {
  if (!beaches) return [];
  if (language === 'en') return beaches;
  return beaches.map((b) => getLocalizedBeach(b, language));
}
