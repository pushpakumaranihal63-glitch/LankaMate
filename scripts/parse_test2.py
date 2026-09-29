import re

with open('src/i18n/uiPhrases.ts', 'r', encoding='utf-8') as f:
    content = f.read()
lines = content.split('\n')

def find_block(name):
    for i, l in enumerate(lines):
        if re.match(r'^  ' + name + r': \{', l):
            return i
    return -1

def parse_block(start, end):
    entries = []
    pat = re.compile(r"^\s+'((?:[^'\\]|\\.)*)': '((?:[^'\\]|\\.)*)',?\s*$")
    for i in range(start + 1, end):
        line = lines[i]
        if line.strip() == '}' or line.strip() == '},':
            continue
        m = pat.match(line)
        if m:
            entries.append((m.group(1), m.group(2), i))
    return entries

en_start = find_block('en')
si_start = find_block('si')
ta_start = find_block('ta')
ar_start = find_block('ar')
tr_start = find_block('tr')

en_entries = parse_block(en_start, si_start)
si_entries = parse_block(si_start, ta_start)
ta_entries = parse_block(ta_start, ar_start)
ar_entries = parse_block(ar_start, tr_start)

print('en', len(en_entries), 'si', len(si_entries), 'ta', len(ta_entries), 'ar', len(ar_entries))

en_keys = set(k for k, v, _ in en_entries)
# In si, which keys have value==key (English fallback, assuming key is English)
si_fallback = [(k, v, i) for k, v, i in si_entries if k == v and k in en_keys]
print('si fallback (value==key & in en):', len(si_fallback))
ta_fallback = [(k, v, i) for k, v, i in ta_entries if k == v and k in en_keys]
print('ta fallback:', len(ta_fallback))
ar_fallback = [(k, v, i) for k, v, i in ar_entries if k == v and k in en_keys]
print('ar fallback:', len(ar_fallback))

# Check overlap: are the fallback keys the same across si/ta/ar?
si_fk = set(k for k, v, i in si_fallback)
ta_fk = set(k for k, v, i in ta_fallback)
ar_fk = set(k for k, v, i in ar_fallback)
print('si==ta==ar fallback keys:', len(si_fk & ta_fk & ar_fk))
print('si_fk == en_keys?', si_fk == en_keys)

# Show a few si fallback
for k, v, i in si_fallback[:5]:
    print('SI FB', repr(k[:60]), 'line', i+1)
