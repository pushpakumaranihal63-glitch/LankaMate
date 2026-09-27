import json
import re
import os

with open('temp_destinations_dump.json', 'r', encoding='utf-8') as f:
    dests = json.load(f)

# Comprehensive category mapping
CATEGORY_MAP = {
    'Heritage': {'si': 'ඓතිහාසික උරුම', 'ta': 'பாரம்பரியம்', 'ar': 'تراث', 'tr': 'Tarihi Miras', 'en': 'Heritage'},
    'Mountain': {'si': 'කඳුකර', 'ta': 'மலைப்பகுதி', 'ar': 'جبلي', 'tr': 'Dağ', 'en': 'Mountain'},
    'Beach': {'si': 'වෙරළ', 'ta': 'கடற்கரை', 'ar': 'شاطئ', 'tr': 'Plaj', 'en': 'Beach'},
    'Wildlife': {'si': 'වනජීවී', 'ta': 'வனவிலங்கு', 'ar': 'الحياة البرية', 'tr': 'Yaban Hayatı', 'en': 'Wildlife'},
    'City': {'si': 'නාගරික', 'ta': 'நகரம்', 'ar': 'مدينة', 'tr': 'Şehir', 'en': 'City'},
    'Nature': {'si': 'ස්වභාවධර්ම', 'ta': 'இயற்கை', 'ar': 'طبيعة', 'tr': 'Doğa', 'en': 'Nature'}
}

# Comprehensive region mapping
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

# Comprehensive district mapping
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

# Clean Sinhala and Tamil names
def get_names(d):
    dest_id = d['id']
    name = d['name']
    local_name = d.get('localName', '')

    # Extract Sinhala part from local_name
    si_name = name
    si_matches = re.findall(r'[\u0D80-\u0DFF\s\.\,\-]+', local_name)
    if si_matches:
        cand = "".join(si_matches).strip()
        cand = re.sub(r'[\(\)]', '', cand).strip()
        if len(cand) > 1:
            si_name = cand

    # Extract Tamil part if present
    ta_name = name
    ta_matches = re.findall(r'[\u0B80-\u0BFF\s\.\,\-]+', local_name)
    if ta_matches:
        cand = "".join(ta_matches).strip()
        cand = re.sub(r'[\(\)]', '', cand).strip()
        if len(cand) > 1:
            ta_name = cand

    return si_name, ta_name

print("Base mappings defined.")
