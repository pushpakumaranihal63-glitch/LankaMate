import json

with open('verified_unsplash_ids.json') as f:
    valid_ids = json.load(f)

with open('all_attractions_info.json') as f:
    items = json.load(f)

print(f"Total attractions: {len(items)}, Available verified photos: {len(valid_ids)}")
