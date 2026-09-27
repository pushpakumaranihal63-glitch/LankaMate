import re, json

with open('assign_images.py') as f:
    text = f.read()

# Load EXPLICIT_IMAGE_MAP
exec(text)

# Apply the 3 fixes
EXPLICIT_IMAGE_MAP['colombo-mount-lavinia-beach'] = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
EXPLICIT_IMAGE_MAP['wijaya-beach'] = 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80'
EXPLICIT_IMAGE_MAP['kumana-national-park'] = 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?auto=format&fit=crop&w=1200&q=80'

# 1. Update destinationsData.ts
with open('src/data/destinationsData.ts', 'r', encoding='utf-8') as f:
    dest_data_code = f.read()

INITIAL_GALLERIES = {
    'sigiriya': ["/images/destinations/sigiriya.jpg", "https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80"],
    'ella': ["/images/destinations/ella.jpg", "https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&w=1200&q=80"],
    'kandy': ["/images/destinations/kandy.jpg", "https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&w=1200&q=80"],
    'galle': ["/images/destinations/galle.jpg", "https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=1200&q=80"],
    'mirissa': ["/images/destinations/mirissa.jpg", "https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1200&q=80"],
    'yala': ["/images/destinations/yala.jpg", "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&w=1200&q=80"],
    'nuwara-eliya': ["/images/destinations/nuwara-eliya.jpg", "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80"],
    'jaffna': ["/images/destinations/jaffna.jpg", "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80"],
    'anuradhapura': ["/images/destinations/anuradhapura.jpg", "https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&w=1200&q=80"],
    'trincomalee': ["https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80"],
    'colombo': ["/images/destinations/colombo.jpg", "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80"],
    'dambulla': ["/images/destinations/dambulla.jpg", "https://images.unsplash.com/photo-1576085898323-218337e3e43c?auto=format&fit=crop&w=1200&q=80"],
    'polonnaruwa': ["/images/destinations/polonnaruwa.jpg", "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80"],
    'horton-plains': ["/images/destinations/horton-plains.jpg", "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?auto=format&fit=crop&w=1200&q=80"],
    'bentota': ["https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80"],
    'arugam-bay': ["https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80"],
    'udawalawe': ["https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1200&q=80"]
}

# Update trincomalee, bentota, arugam-bay, udawalawe heroImage
for target_id in ['trincomalee', 'bentota', 'arugam-bay', 'udawalawe']:
    img = EXPLICIT_IMAGE_MAP[target_id]
    # Replace heroImage
    pattern = rf"(id:\s*['\"]{target_id}['\"].*?heroImage:\s*['\"])([^'\"]+)(['\"])"
    dest_data_code = re.sub(pattern, rf"\g<1>{img}\g<3>", dest_data_code, flags=re.DOTALL)

# Update all 17 galleries
for target_id, gallery_urls in INITIAL_GALLERIES.items():
    formatted_gallery = "[\n      " + ",\n      ".join(f"'{u}'" for u in gallery_urls) + ",\n    ]"
    pattern = rf"(id:\s*['\"]{target_id}['\"].*?gallery:\s*\[)(.*?)(\])"
    dest_data_code = re.sub(pattern, rf"\g<1>\n      " + ",\n      ".join(f"'{u}'" for u in gallery_urls) + ",\n    \g<3>", dest_data_code, flags=re.DOTALL)

with open('src/data/destinationsData.ts', 'w', encoding='utf-8') as f:
    f.write(dest_data_code)
print("Updated destinationsData.ts successfully.")

# 2. Function to update attractions files
def update_attractions_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        code = f.read()

    count = 0
    # Process each destination block
    # Match id: '...' up to coordinates
    dest_blocks = re.findall(r"id:\s*['\"]([a-zA-Z0-9_-]+)['\"]", code)
    for aid in dest_blocks:
        if aid in EXPLICIT_IMAGE_MAP:
            new_img = EXPLICIT_IMAGE_MAP[aid]
            # Replace heroImage: '...'
            hero_pattern = rf"(id:\s*['\"]{aid}['\"].*?heroImage:\s*['\"])([^'\"]+)(['\"])"
            code = re.sub(hero_pattern, rf"\g<1>{new_img}\g<3>", code, flags=re.DOTALL)
            # Replace gallery: [...]
            gallery_pattern = rf"(id:\s*['\"]{aid}['\"].*?gallery:\s*\[)(.*?)(\])"
            new_gallery = f"\n      '{new_img}',\n    "
            code = re.sub(gallery_pattern, rf"\g<1>{new_gallery}\g<3>", code, flags=re.DOTALL)
            count += 1

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(code)
    print(f"Updated {count} attractions in {filepath}")

update_attractions_file('src/data/attractionsCentralHighlands.ts')
update_attractions_file('src/data/attractionsWesternSouthern.ts')
update_attractions_file('src/data/attractionsNorthEastCentral.ts')
