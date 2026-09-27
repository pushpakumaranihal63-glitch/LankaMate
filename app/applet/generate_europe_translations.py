import os
import re
import json
import time
import urllib.request
import urllib.parse
from concurrent.futures import ThreadPoolExecutor

CATEGORY_MAP = {
    'Heritage': {'de': 'Kulturerbe', 'fr': 'Patrimoine', 'es': 'Patrimonio'},
    'Mountain': {'de': 'Bergland', 'fr': 'Montagne', 'es': 'Montaña'},
    'Beach': {'de': 'Strand & Küste', 'fr': 'Plage & Côte', 'es': 'Playa y Costa'},
    'Wildlife': {'de': 'Tierwelt & Safari', 'fr': 'Faune & Safari', 'es': 'Vida Silvestre y Safari'},
    'City': {'de': 'Stadt & Kultur', 'fr': 'Ville & Culture', 'es': 'Ciudad y Cultura'},
    'Nature': {'de': 'Natur & Landschaften', 'fr': 'Nature & Paysages', 'es': 'Naturaleza y Paisajes'},
}

REGION_MAP = {
    'Cultural Triangle': {'de': 'Kulturelles Dreieck', 'fr': 'Triangle culturel', 'es': 'Triángulo Cultural'},
    'Hill Country': {'de': 'Bergland (Hill Country)', 'fr': 'Hautes Terres (Hill Country)', 'es': 'Tierras Altas (Hill Country)'},
    'Southern Coast': {'de': 'Südküste', 'fr': 'Côte Sud', 'es': 'Costa Sur'},
    'Wildlife & Safari': {'de': 'Tierwelt & Safari', 'fr': 'Faune & Safari', 'es': 'Vida Silvestre y Safari'},
    'Northern Peninsula': {'de': 'Nördliche Halbinsel', 'fr': 'Péninsule du Nord', 'es': 'Península Norte'},
    'Eastern Coast': {'de': 'Ostküste', 'fr': 'Côte Est', 'es': 'Costa Este'},
    'Western & Urban': {'de': 'Westküste & Urban', 'fr': 'Côte Ouest & Urbain', 'es': 'Costa Oeste y Urbano'},
    'Sabaragamuwa': {'de': 'Sabaragamuwa', 'fr': 'Sabaragamuwa', 'es': 'Sabaragamuwa'},
    'Southwest Coast': {'de': 'Südwestküste', 'fr': 'Côte Sud-Ouest', 'es': 'Costa Suroeste'},
    'Deep South Coast': {'de': 'Tiefe Südküste', 'fr': 'Extrême Côte Sud', 'es': 'Costa Sur Profunda'},
}

PRICE_PATTERN = re.compile(r'~?\s*\$\s*\d+(?:\s*-\s*\$?\s*\d+)?\s*(?:USD)?|\b\d{1,3}(?:,\d{3})*\s*LKR\b', re.IGNORECASE)

def protect(text):
    tokens = {}
    counter = [0]
    def repl(m):
        t = f"TOKENXYZ{counter[0]}XYZ"
        tokens[t] = m.group(0)
        counter[0] += 1
        return t
    p = PRICE_PATTERN.sub(repl, text)
    return p, tokens

def restore(text, tokens):
    for t, orig in tokens.items():
        text = text.replace(t, orig)
        num = t.replace("TOKENXYZ", "").replace("XYZ", "")
        text = re.sub(r'TOKEN\s*XYZ\s*' + num + r'\s*XYZ', orig, text)
    return text

def request_translate(text_to_translate, target_lang):
    if not text_to_translate or not text_to_translate.strip():
        return text_to_translate
    url = f'https://clients5.google.com/translate_a/t?client=dict-chrome-ex&sl=en&tl={target_lang}'
    data = urllib.parse.urlencode({'q': text_to_translate}).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    for attempt in range(4):
        try:
            with urllib.request.urlopen(req, timeout=12) as resp:
                res = json.loads(resp.read().decode('utf-8'))
                if res and isinstance(res, list):
                    return res[0]
        except Exception:
            time.sleep(0.3 * (attempt + 1))
    return text_to_translate

def translate_tagged_items(items, target_lang):
    # items is a list of strings
    if not items:
        return []
    
    protected_items = []
    tokens_list = []
    for item in items:
        p, tok = protect(item)
        protected_items.append(p)
        tokens_list.append(tok)

    tagged_text = '\n'.join([f'<<<ITEM_{i}>>> {p}' for i, p in enumerate(protected_items)])
    raw_res = request_translate(tagged_text, target_lang)

    extracted_dict = {}
    matches = re.findall(r'<<<ITEM_(\d+)>>>(.*?)(?=(?:<<<ITEM_\d+>>>|$))', raw_res, re.DOTALL)
    for idx_str, content in matches:
        extracted_dict[int(idx_str)] = content.strip()

    results = []
    for i in range(len(items)):
        if i in extracted_dict and extracted_dict[i]:
            results.append(restore(extracted_dict[i], tokens_list[i]))
        else:
            # Fallback to individual
            indiv = request_translate(protected_items[i], target_lang)
            results.append(restore(indiv, tokens_list[i]))
            
    return results

def translate_destination(dest_id, en_data, target_lang):
    cat = CATEGORY_MAP.get(en_data.get('category', ''), {}).get(target_lang, en_data.get('category', ''))
    reg = REGION_MAP.get(en_data.get('region', ''), {}).get(target_lang, en_data.get('region', ''))
    
    dist = en_data.get('district', '')
    if target_lang == 'de':
        district = f"Distrikt {dist}" if not dist.startswith('Distrikt') else dist
    elif target_lang == 'fr':
        district = f"District de {dist}" if not dist.startswith('District') else dist
    elif target_lang == 'es':
        district = f"Distrito de {dist}" if not dist.startswith('Distrito') else dist
    else:
        district = dist

    en_name = en_data.get('name', '')
    should_trans_name = len(en_name.split()) > 1 and any(keyword in en_name.lower() for keyword in [
        'temple', 'bridge', 'palace', 'falls', 'waterfall', 'park', 'rock', 'garden',
        'beach', 'lake', 'fort', 'forest', 'museum', 'tower', 'reserve', 'farm', 'office',
        'memorial', 'shrine', 'sanctuary', 'tree', 'mines', 'cove', 'pass'
    ])

    items_to_translate = []
    if should_trans_name:
        items_to_translate.append(en_name)

    items_to_translate.append(en_data.get('tagline', ''))
    items_to_translate.append(en_data.get('description', ''))
    items_to_translate.append(en_data.get('bestTimeToVisit', ''))
    items_to_translate.append(en_data.get('entryFee', ''))
    items_to_translate.append(en_data.get('travelTimeFromColombo', ''))

    highlights = en_data.get('highlights', [])
    activities = en_data.get('activities', [])
    travelTips = en_data.get('travelTips', [])

    h_offset = len(items_to_translate)
    items_to_translate.extend(highlights)
    
    a_offset = len(items_to_translate)
    items_to_translate.extend(activities)
    
    t_offset = len(items_to_translate)
    items_to_translate.extend(travelTips)

    translated_items = translate_tagged_items(items_to_translate, target_lang)

    idx = 0
    if should_trans_name:
        name = translated_items[idx]
        idx += 1
    else:
        name = en_name

    tagline = translated_items[idx]
    idx += 1
    description = translated_items[idx]
    idx += 1
    bestTimeToVisit = translated_items[idx]
    idx += 1
    entryFee = translated_items[idx]
    idx += 1
    travelTimeFromColombo = translated_items[idx]
    idx += 1

    h_res = translated_items[h_offset:a_offset]
    a_res = translated_items[a_offset:t_offset]
    t_res = translated_items[t_offset:]

    return {
        'name': name,
        'tagline': tagline,
        'category': cat,
        'region': reg,
        'district': district,
        'description': description,
        'bestTimeToVisit': bestTimeToVisit,
        'entryFee': entryFee,
        'travelTimeFromColombo': travelTimeFromColombo,
        'highlights': h_res,
        'activities': a_res,
        'travelTips': t_res
    }

def process_part(part_name, input_json_file, output_ts_file, var_name):
    if os.path.exists(output_ts_file) and os.path.getsize(output_ts_file) > 10000:
        print(f"Skipping {part_name}, {output_ts_file} already exists and is complete!", flush=True)
        return

    print(f"\n==========================================", flush=True)
    print(f"Processing {part_name} -> {output_ts_file}", flush=True)
    print(f"==========================================", flush=True)
    
    with open(input_json_file, 'r', encoding='utf-8') as f:
        destinations = json.load(f)

    results = {}
    dest_items = list(destinations.items())

    for idx, (dest_id, en_data) in enumerate(dest_items):
        t0 = time.time()
        # Concurrently translate into de, fr, es
        with ThreadPoolExecutor(max_workers=3) as executor:
            fut_de = executor.submit(translate_destination, dest_id, en_data, 'de')
            fut_fr = executor.submit(translate_destination, dest_id, en_data, 'fr')
            fut_es = executor.submit(translate_destination, dest_id, en_data, 'es')
            
            res_de = fut_de.result()
            res_fr = fut_fr.result()
            res_es = fut_es.result()

        results[dest_id] = {
            'de': res_de,
            'fr': res_fr,
            'es': res_es
        }
        print(f"[{idx+1}/{len(dest_items)}] {dest_id} completed in {time.time()-t0:.2f}s", flush=True)

    lines = [
        "import { LanguageCode } from '../../types';",
        "import { LocalizedDestinationFields } from '../translatedDestinations';",
        "",
        f"export const {var_name}: Record<string, Partial<Record<LanguageCode, LocalizedDestinationFields>>> = {json.dumps(results, ensure_ascii=False, indent=2)};",
        ""
    ]

    with open(output_ts_file, 'w', encoding='utf-8') as f:
        f.write("\n".join(lines))

    print(f"Successfully wrote {output_ts_file} ({len(results)} items)!", flush=True)

def process_beaches():
    print(f"\n==========================================", flush=True)
    print(f"Processing beaches for BEACH_TRANSLATIONS", flush=True)
    print(f"==========================================", flush=True)
    
    with open('en_destinations_beaches.json', 'r', encoding='utf-8') as f:
        beaches = json.load(f)

    beach_europe_records = {}

    for b_id, b_data in beaches.items():
        beach_europe_records[b_id] = {}
        for lang in ['de', 'fr', 'es']:
            reg = REGION_MAP.get(b_data.get('region', ''), {}).get(lang, b_data.get('region', ''))
            dist = b_data.get('district', '')
            if lang == 'de':
                loc = f"{dist}, Südküste" if 'South' in b_data.get('region', '') else f"{dist}, Sri Lanka"
            elif lang == 'fr':
                loc = f"{dist}, Côte Sud" if 'South' in b_data.get('region', '') else f"{dist}, Sri Lanka"
            else:
                loc = f"{dist}, Costa Sur" if 'South' in b_data.get('region', '') else f"{dist}, Sri Lanka"

            items_to_send = [
                b_data.get('name', ''),
                b_data.get('description', ''),
                b_data.get('bestTimeToVisit', ''),
                b_data.get('tagline', ''),
            ]
            highlights = b_data.get('highlights', [])
            items_to_send.extend(highlights)

            trans = translate_tagged_items(items_to_send, lang)

            beach_europe_records[b_id][lang] = {
                'name': trans[0],
                'location': loc,
                'region': reg,
                'description': trans[1],
                'bestSeason': trans[2],
                'vibe': trans[3],
                'highlights': trans[4:]
            }
        print(f"Beach {b_id} completed!", flush=True)

    with open('beaches_europe_trans.json', 'w', encoding='utf-8') as f:
        json.dump(beach_europe_records, f, ensure_ascii=False, indent=2)
    print("Saved beaches_europe_trans.json!", flush=True)

if __name__ == '__main__':
    t_start = time.time()
    process_part("Part 1", "en_destinations_part1.json", "src/data/translations/destinationsEuropePart1.ts", "destinationsEuropePart1")
    process_part("Part 2", "en_destinations_part2.json", "src/data/translations/destinationsEuropePart2.ts", "destinationsEuropePart2")
    process_part("Part 3", "en_destinations_part3.json", "src/data/translations/destinationsEuropePart3.ts", "destinationsEuropePart3")
    process_part("Part 4", "en_destinations_part4.json", "src/data/translations/destinationsEuropePart4.ts", "destinationsEuropePart4")
    process_part("Beaches", "en_destinations_beaches.json", "src/data/translations/destinationsEuropeBeaches.ts", "destinationsEuropeBeaches")
    process_beaches()
    print(f"\nAll Europe translations completed in {time.time() - t_start:.2f} seconds!", flush=True)
