import json
import re
import os

with open('temp_destinations_dump.json', 'r', encoding='utf-8') as f:
    dests = json.load(f)

CATEGORY_MAP = {
    'Heritage': {'si': 'ඓතිහාසික උරුම', 'ta': 'பாரம்பரியம்', 'ar': 'تراث', 'tr': 'Tarihi Miras', 'en': 'Heritage'},
    'Mountain': {'si': 'කඳුකර', 'ta': 'மலைப்பகுதி', 'ar': 'جبلي', 'tr': 'Dağ', 'en': 'Mountain'},
    'Beach': {'si': 'වෙරළ', 'ta': 'கடற்கரை', 'ar': 'شاطئ', 'tr': 'Plaj', 'en': 'Beach'},
    'Wildlife': {'si': 'වනජීවී', 'ta': 'வனவிலங்கு', 'ar': 'الحياة البرية', 'tr': 'Yaban Hayatı', 'en': 'Wildlife'},
    'City': {'si': 'නාගරික', 'ta': 'நகரம்', 'ar': 'مدينة', 'tr': 'Şehir', 'en': 'City'},
    'Nature': {'si': 'ස්වභාවධර්ම', 'ta': 'இயற்கை', 'ar': 'طبيعة', 'tr': 'Doğa', 'en': 'Nature'}
}

REGION_MAP = {
    'Cultural Triangle': {'si': 'සංස්කෘතික ත්‍රිකෝණය', 'ta': 'கலாச்சார முக்கோணம்', 'ar': 'المثلث الثقافي', 'tr': 'Kültür Üçgeni', 'en': 'Cultural Triangle'},
    'Hill Country': {'si': 'මධ්‍යම කඳුකරය', 'ta': 'மத்திய மலைநாடு', 'ar': 'المرتفعات الجبلية', 'tr': 'Dağlık Bölge', 'en': 'Hill Country'},
    'Southern Coast': {'si': 'දකුණු වෙරළ', 'ta': 'தெற்கு கடற்கரை', 'ar': 'الساحل الجنوبي', 'tr': 'Güney Sahili', 'en': 'Southern Coast'},
    'Wildlife & Safari': {'si': 'වනජීවී සහ සෆාරි', 'ta': 'வனவிலங்கு மற்றும் சவாரி', 'ar': 'سفاري والحياة البرية', 'tr': 'Yaban Hayatı & Safari', 'en': 'Wildlife & Safari'},
    'Northern Peninsula': {'si': 'උතුරු අර්ධද්වීපය', 'ta': 'வடக்கு தீபகற்பம்', 'ar': 'شبه الجزيرة الشمالية', 'tr': 'Kuzey Yarımadası', 'en': 'Northern Peninsula'},
    'Eastern Coast': {'si': 'නැගෙනහිර වෙරළ', 'ta': 'கிழக்கு கடற்கரை', 'ar': 'الساحل الشرقي', 'tr': 'Doğu Sahili', 'en': 'Eastern Coast'},
    'Western & Urban': {'si': 'බස්නාහිර සහ නාගරික', 'ta': 'மேற்கு மற்றும் நகர்ப்புறம்', 'ar': 'المنطقة الغربية والحضرية', 'tr': 'Batı & Şehir', 'en': 'Western & Urban'},
    'Sabaragamuwa': {'si': 'සබරගමුව', 'ta': 'சப்ரகமுவ', 'ar': 'ساباراغاموا', 'tr': 'Sabaragamuwa', 'en': 'Sabaragamuwa'}
}

DISTRICT_MAP = {
    'Matale': {'si': 'මාතලේ', 'ta': 'மாத்தளை', 'ar': 'ماتالي', 'tr': 'Matale', 'en': 'Matale'},
    'Badulla': {'si': 'බදුල්ල', 'ta': 'பதுளை', 'ar': 'بادولا', 'tr': 'Badulla', 'en': 'Badulla'},
    'Kandy': {'si': 'මහනුවර', 'ta': 'கண்டி', 'ar': 'كاندي', 'tr': 'Kandy', 'en': 'Kandy'},
    'Galle': {'si': 'ගාල්ල', 'ta': 'காலி', 'ar': 'غالي', 'tr': 'Galle', 'en': 'Galle'},
    'Hambantota': {'si': 'හම්බන්තොට', 'ta': 'அம்பாந்தோட்டை', 'ar': 'هامبانتوتا', 'tr': 'Hambantota', 'en': 'Hambantota'},
    'Matara': {'si': 'මාතර', 'ta': 'மாத்தறை', 'ar': 'மاتارا', 'tr': 'Matara', 'en': 'Matara'},
    'Nuwara Eliya': {'si': 'නුවරඑළිය', 'ta': 'நுவரெலியா', 'ar': 'نوارا إليا', 'tr': 'Nuwara Eliya', 'en': 'Nuwara Eliya'},
    'Jaffna': {'si': 'යාපනය', 'ta': 'யாழ்ப்பாணம்', 'ar': 'جافنا', 'tr': 'Jaffna', 'en': 'Jaffna'},
    'Anuradhapura': {'si': 'අනුරාධපුරය', 'ta': 'அனுராதபுரம்', 'ar': 'أنورادهابورا', 'tr': 'Anuradhapura', 'en': 'Anuradhapura'},
    'Trincomalee': {'si': 'ත්‍රිකුණාමලය', 'ta': 'திருகோணமலை', 'ar': 'ترينكومالي', 'tr': 'Trincomalee', 'en': 'Trincomalee'},
    'Colombo': {'si': 'කොළඹ', 'ta': 'கொழும்பு', 'ar': 'كولومبو', 'tr': 'Colombo', 'en': 'Colombo'},
    'Gampaha': {'si': 'ගම්පහ', 'ta': 'கம்பஹா', 'ar': 'غامباها', 'tr': 'Gampaha', 'en': 'Gampaha'},
    'Kalutara': {'si': 'කළුතර', 'ta': 'களுத்துறை', 'ar': 'كالووتارا', 'tr': 'Kalutara', 'en': 'Kalutara'},
    'Kurunegala': {'si': 'කුරුණෑගල', 'ta': 'குருணாகல்', 'ar': 'كورونيغالا', 'tr': 'Kurunegala', 'en': 'Kurunegala'},
    'Puttalam': {'si': 'පුත්තලම', 'ta': 'புத்தளம்', 'ar': 'بوتالام', 'tr': 'Puttalam', 'en': 'Puttalam'},
    'Polonnaruwa': {'si': 'පොළොන්නරුව', 'ta': 'பொலன்னறுவை', 'ar': 'بولوناروا', 'tr': 'Polonnaruwa', 'en': 'Polonnaruwa'},
    'Monaragala': {'si': 'මොනරාගල', 'ta': 'மொனராகலை', 'ar': 'موناراغالا', 'tr': 'Monaragala', 'en': 'Monaragala'},
    'Ratnapura': {'si': 'රත්නපුර', 'ta': 'இரத்தினபுரி', 'ar': 'راتنابورا', 'tr': 'Ratnapura', 'en': 'Ratnapura'},
    'Kegalle': {'si': 'කෑගල්ල', 'ta': 'கேகாலை', 'ar': 'كيغالي', 'tr': 'Kegalle', 'en': 'Kegalle'},
    'Kilinochchi': {'si': 'කිලිනොච්චිය', 'ta': 'கிளிநொச்சி', 'ar': 'كيلينوتشتشي', 'tr': 'Kilinochchi', 'en': 'Kilinochchi'},
    'Mannar': {'si': 'මන්නාරම', 'ta': 'மன்னார்', 'ar': 'مانار', 'tr': 'Mannar', 'en': 'Mannar'},
    'Mullaitivu': {'si': 'මුලතිව්', 'ta': 'முல்லைத்தீவு', 'ar': 'مولايتيفو', 'tr': 'Mullaitivu', 'en': 'Mullaitivu'},
    'Vavuniya': {'si': 'වවුනියාව', 'ta': 'வவுனியா', 'ar': 'فافونيا', 'tr': 'Vavuniya', 'en': 'Vavuniya'},
    'Batticaloa': {'si': 'මඩකලපුව', 'ta': 'மட்டக்களப்பு', 'ar': 'باتيكالوا', 'tr': 'Batticaloa', 'en': 'Batticaloa'},
    'Ampara': {'si': 'අම්පාර', 'ta': 'அம்பாறை', 'ar': 'أمبارا', 'tr': 'Ampara', 'en': 'Ampara'}
}

MONTHS = {
    'January': ('ජනවාරි', 'ஜனவரி', 'يناير', 'Ocak'),
    'February': ('පෙබරවාරි', 'பிப்ரவரி', 'فبراير', 'Şubat'),
    'March': ('මාර්තු', 'மார்ச்', 'مارس', 'Mart'),
    'April': ('අප්‍රේල්', 'ஏப்ரல்', 'أبريل', 'Nisan'),
    'May': ('මැයි', 'மே', 'مايو', 'Mayıs'),
    'June': ('ජූනි', 'ஜூன்', 'يونيو', 'Haziran'),
    'July': ('ජූලි', 'ஜூலை', 'يوليو', 'Temmuz'),
    'August': ('අගෝස්තු', 'ஆகஸ்ட்', 'أغسطس', 'Ağustos'),
    'September': ('සැප්තැම්බර්', 'செப்டம்பர்', 'سبتمبر', 'Eylül'),
    'October': ('ඔක්තෝබර්', 'அக்டோபர்', 'أكتوبر', 'Ekim'),
    'November': ('නොවැම්බර්', 'நவம்பர்', 'நவம்பர்', 'Kasım'),
    'December': ('දෙසැම්බර්', 'டிசம்பர்', 'ديسمبر', 'Aralık'),
}

def translate_best_time(text):
    if not text:
        return {
            'si': 'වසර පුරා සංචාරයට සුදුසුය',
            'ta': 'ஆண்டு முழுவதும் வருகை தர ஏற்றது',
            'ar': 'مناسب للزيارة طوال العام',
            'tr': 'Tüm yıl ziyaret için uygundur'
        }
    found_months = [m for m in MONTHS if m.lower() in text.lower()]
    is_year_round = 'year-round' in text.lower() or 'year round' in text.lower()
    is_morning = 'morning' in text.lower() or 'dawn' in text.lower() or '6:' in text or '7:' in text
    is_mist = 'mist' in text.lower() or 'cloud' in text.lower()
    is_surf = 'surf' in text.lower()
    is_calm = 'calm' in text.lower() or 'whale' in text.lower()
    
    if len(found_months) >= 2:
        m1, m2 = found_months[0], found_months[1]
        si_m1, ta_m1, ar_m1, tr_m1 = MONTHS[m1]
        si_m2, ta_m2, ar_m2, tr_m2 = MONTHS[m2]
        
        si_note, ta_note, ar_note, tr_note = "", "", "", ""
        if is_mist:
            si_note = " (මීදුම පැතිරීමට පෙර උදෑසන)"
            ta_note = " (பனிமூட்டம் சூழ்வதற்கு முன் அதிகாலை)"
            ar_note = " (في الصباح الباكر قبل تشكل الضباب)"
            tr_note = " (sis çökmeden önce sabah saatleri)"
        elif is_surf:
            si_note = " (සර්ෆින් ක්‍රීඩා සමය)"
            ta_note = " (அலைச்சறுக்கு பருவம்)"
            ar_note = " (موسم ركوب الأمواج)"
            tr_note = " (sörf sezonu)"
        elif is_calm:
            si_note = " (සන්සුන් මුහුදු සමය)"
            ta_note = " (அமைதியான கடல் பருவம்)"
            ar_note = " (موسم البحر الهادئ)"
            tr_note = " (sakin deniz sezonu)"
        elif is_morning:
            si_note = " (උදෑසන කාලය සුදුසුය)"
            ta_note = " (காலை வேளை சிறந்தது)"
            ar_note = " (الفترة الصباحية هي الأفضل)"
            tr_note = " (sabah saatleri tavsiye edilir)"
            
        si = f"{si_m1} සිට {si_m2} දක්වා{si_note}"
        ta = f"{ta_m1} முதல் {ta_m2} வரை{ta_note}"
        ar = f"من {ar_m1} إلى {ar_m2}{ar_note}"
        tr = f"{tr_m1} - {tr_m2} arası{tr_note}"
    elif is_year_round:
        si = "වසර පුරා සංචාරය කළ හැක (උදෑසන කාලය වඩාත් සුදුසුය)" if is_morning else "වසර පුරා සංචාරය කළ හැක"
        ta = "ஆண்டு முழுவதும் பார்வையிடலாம் (காலை வேளை சிறந்தது)" if is_morning else "ஆண்டு முழுவதும் பார்வையிடலாம்"
        ar = "مناسب للزيارة طوال العام (يفضل الصباح الباكر)" if is_morning else "مناسب للزيارة طوال العام"
        tr = "Tüm yıl ziyaret edilebilir (sabah saatleri tavsiye edilir)" if is_morning else "Tüm yıl ziyaret edilebilir"
    elif found_months:
        m = found_months[0]
        si_m, ta_m, ar_m, tr_m = MONTHS[m]
        si = f"{si_m} ආශ්‍රිත කාලය වඩාත් සුදුසුය"
        ta = f"{ta_m} மாதமளவில் வருகை தருவது சிறந்தது"
        ar = f"أفضل وقت للزيارة حول شهر {ar_m}"
        tr = f"En uygun zaman {tr_m} civarıdır"
    else:
        si = "පැහැදිලි උදෑසන කාලය සංචාරය සඳහා වඩාත් සුදුසුය"
        ta = "தெளிவான காலை வேளை வருகை தர மிகவும் சிறந்தது"
        ar = "الصباح الباكر هو أفضل وقت للزيارة"
        tr = "Sabahın erken saatleri ziyaret için en uygundur"
        
    return {'si': si, 'ta': ta, 'ar': ar, 'tr': tr}

def translate_entry_fee(text):
    if not text:
        return {
            'si': 'නොමිලේ ප්‍රවේශ විය හැක',
            'ta': 'இலவச அனுமதி',
            'ar': 'الدخول مجاني',
            'tr': 'Giriş ücretsizdir'
        }
    text_lower = text.lower()
    is_free = 'free' in text_lower
    has_safari = 'safari' in text_lower or 'jeep' in text_lower
    has_donation = 'donation' in text_lower
    
    usd_match = re.search(r'(\~?\$[\d]+(?:[–\-][\d]+)?\s*(?:USD)?)', text, re.IGNORECASE)
    usd_val = usd_match.group(1) if usd_match else None
    if usd_val and 'usd' not in usd_val.lower():
        usd_val += " USD"
        
    lkr_match = re.search(r'(\~?[\d,]+\s*LKR)', text, re.IGNORECASE)
    lkr_val = lkr_match.group(1) if lkr_match else None
    
    if usd_val and is_free:
        si = f"විදේශිකයින් සඳහා {usd_val} පමණ; දේශීය අයට නොමිලේ"
        ta = f"வெளிநாட்டினருக்கு {usd_val}; உள்நாட்டவர்களுக்கு இலவசம்"
        ar = f"للأجانب حوالي {usd_val}؛ ومجاني للمواطنين"
        tr = f"Yabancılar için yaklaşık {usd_val}; yerel halk için ücretsiz"
    elif usd_val and has_safari:
        si = f"විදේශික ප්‍රවේශපත්‍රය {usd_val} + ජීප් රථ කුලිය"
        ta = f"வெளிநாட்டு நுழைவுக்கட்டணம் {usd_val} + ஜீப் வாடகை"
        ar = f"تذكرة الدخول للأجانب {usd_val} + استئجار سيارة جيب"
        tr = f"Yabancı giriş bileti {usd_val} + safari cip kiralama"
    elif usd_val:
        si = f"විදේශීය වැඩිහිටියෙකු සඳහා {usd_val} පමණ"
        ta = f"வெளிநாட்டுப் பயணியருக்கு {usd_val}"
        ar = f"حوالي {usd_val} للزوار الأجانب"
        tr = f"Yabancı ziyaretçiler için yaklaşık {usd_val}"
    elif lkr_val and is_free:
        si = f"දේශීය අයට නොමිලේ; විශේෂ පිවිසුම් සඳහා {lkr_val}"
        ta = f"உள்நாட்டவர்களுக்கு இலவசம்; சிறப்பு நுழைவுக்கு {lkr_val}"
        ar = f"مجاني للمحليين؛ ورسوم {lkr_val} للمرافق الخاصة"
        tr = f"Yerel halk için ücretsiz; özel giriş için {lkr_val}"
    elif lkr_val:
        si = f"ප්‍රවේශ ගාස්තුව {lkr_val} පමණ"
        ta = f"நுழைவுக் கட்டணம் {lkr_val}"
        ar = f"رسوم الدخول حوالي {lkr_val}"
        tr = f"Giriş ücreti yaklaşık {lkr_val}"
    elif is_free and has_donation:
        si = "නොමිලේ ප්‍රවේශය (කැමැත්තෙන් ආධාර කළ හැක)"
        ta = "இலவச அனுமதி (விருப்பக் காணிக்கை அளிக்கலாம்)"
        ar = "الدخول مجاني (تقبل التبرعات الطوعية)"
        tr = "Ücretsiz giriş (isteğe bağlı bağış yapılabilir)"
    elif is_free:
        si = "නොමිලේ ප්‍රවේශ විය හැක (පොදු ස්ථානයකි)"
        ta = "இலவச பொது அனுமதி"
        ar = "الدخول مجاني للجميع"
        tr = "Giriş ücretsizdir (halka açık alan)"
    else:
        si = "සුළු ප්‍රවේශ ගාස්තුවක් අයකෙරේ"
        ta = "சிறிய நுழைவுக் கட்டணம் உண்டு"
        ar = "رسوم دخول رمزية"
        tr = "Cüzi bir giriş ücreti uygulanır"
        
    return {'si': si, 'ta': ta, 'ar': ar, 'tr': tr}

def translate_travel_time(text):
    if not text:
        return {
            'si': 'කොළඹ සිට පැය 3 සිට 4 දක්වා',
            'ta': 'கொழும்பிலிருந்து 3 முதல் 4 மணிநேரம்',
            'ar': 'من 3 إلى 4 ساعات من كولومبو',
            'tr': 'Kolombo’dan yaklaşık 3 - 4 saat'
        }
    text_lower = text.lower()
    hours_match = re.search(r'([\d]+(?:\.[\d]+)?(?:\s*(?:to|–|-)\s*[\d]+(?:\.[\d]+)?)?)\s*(?:hours|hrs|hour)', text_lower)
    minutes_match = re.search(r'([\d]+)\s*(?:minutes|mins|min)', text_lower)
    
    has_train = 'train' in text_lower or 'rail' in text_lower
    has_expressway = 'expressway' in text_lower or 'e01' in text_lower or 'highway' in text_lower
    in_colombo = 'colombo fort' in text_lower or 'located right' in text_lower or 'within colombo' in text_lower
    
    has_nuwara_eliya = 'nuwara eliya' in text_lower
    has_ella = 'ella' in text_lower
    
    h_val = hours_match.group(1) if hours_match else None
    m_val = minutes_match.group(1) if minutes_match else None
    
    if in_colombo and (not h_val or float(h_val.split('-')[0].split('to')[0].strip()) <= 1) and not m_val:
        si = "කොළඹ නගර මධ්‍යයේ පිහිටා ඇත (විනාඩි 10 - 20)"
        ta = "கொழும்பு நகர மையத்தில் அமைந்துள்ளது (10 - 20 நிமிடங்கள்)"
        ar = "يقع في قلب مدينة كولومبو (10 - 20 دقيقة)"
        tr = "Kolombo şehir merkezinde yer alır (10 - 20 dakika)"
    elif m_val:
        si = f"කොළඹ සිට විනාඩි {m_val}ක ධාවනය"
        ta = f"கொழும்பிலிருந்து {m_val} நிமிட பயண தூரம்"
        ar = f"حوالي {m_val} دقيقة بالسيارة من كولومبو"
        tr = f"Kolombo’dan araçla yaklaşık {m_val} dakika"
    elif h_val and has_expressway:
        si = f"දක්ෂිණ අධිවේගී මාර්ගය හරහා පැය {h_val}ක්"
        ta = f"தெற்கு அதிவேக நெடுஞ்சாலை வழியாக {h_val} மணிநேரம்"
        ar = f"حوالي {h_val} ساعات عبر الطريق السريع"
        tr = f"Otoyol üzerinden yaklaşık {h_val} saat"
    elif h_val and has_train:
        si = f"දුම්රිය හෝ මහාමාර්ගය මඟින් පැය {h_val}ක්"
        ta = f"ரயில் அல்லது கார் மூலம் {h_val} மணிநேரம்"
        ar = f"حوالي {h_val} ساعات بالقطار أو السيارة"
        tr = f"Tren veya araçla yaklaşık {h_val} saat"
    elif h_val and has_nuwara_eliya:
        si = f"කොළඹ සිට පැය {h_val}ක් (නුවරඑළියේ සිට පැය 1ක්)"
        ta = f"கொழும்பிலிருந்து {h_val} மணிநேரம் (நுவரெலியாவிலிருந்து 1 மணிநேரம்)"
        ar = f"حوالي {h_val} ساعات من كولومبو (وساعة من نوارا إليا)"
        tr = f"Kolombo’dan {h_val} saat (Nuwara Eliya’dan 1 saat)"
    elif h_val and has_ella:
        si = f"කොළඹ සිට පැය {h_val}ක් (ඇල්ල සිට විනාඩි 45ක්)"
        ta = f"கொழும்பிலிருந்து {h_val} மணிநேரம் (எல்லாவிலிருந்து 45 நிமிடங்கள்)"
        ar = f"حوالي {h_val} ساعات من كولومبو (و45 دقيقة من إيلا)"
        tr = f"Kolombo’dan {h_val} saat (Ella’dan 45 dakika)"
    elif h_val:
        si = f"කොළඹ සිට මෝටර් රථයෙන් පැය {h_val}ක ධාවනය"
        ta = f"கொழும்பிலிருந்து காரில் {h_val} மணிநேரப் பயணம்"
        ar = f"حوالي {h_val} ساعات بالسيارة من كولومبو"
        tr = f"Kolombo’dan araçla yaklaşık {h_val} saat"
    else:
        si = "කොළඹ සිට පැය 3 සිට 4 දක්වා ගමන් කාලය"
        ta = "கொழும்பிலிருந்து 3 முதல் 4 மணிநேரப் பயணம்"
        ar = "من 3 إلى 4 ساعات من كولومبو"
        tr = "Kolombo’dan yaklaşık 3 - 4 saatlik yolculuk"
        
    return {'si': si, 'ta': ta, 'ar': ar, 'tr': tr}

print("Specs translator functions defined.")
