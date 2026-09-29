import re

with open('src/i18n/uiPhrases.ts', 'r', encoding='utf-8') as f:
    content = f.read()
lines = content.split('\n')

def find_block(name):
    for i, l in enumerate(lines):
        if re.match(r'^  ' + name + r': \{', l):
            return i
    return -1

en_start = find_block('en')
si_start = find_block('si')
print('en_start', en_start, 'si_start', si_start)

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
        else:
            if line.strip() and not line.strip().startswith('//'):
                print('UNPARSED line', i + 1, repr(line[:120]))
    return entries

en_entries = parse_block(en_start, si_start)
print('en entries:', len(en_entries))
same = sum(1 for k, v, _ in en_entries if k == v)
print('en value==key:', same)

ta_start = find_block('ta')
si_entries = parse_block(si_start, ta_start)
print('si entries:', len(si_entries))
si_keys = set(k for k, v, _ in si_entries)
new_in_en = [(k, v) for k, v, _ in en_entries if k not in si_keys]
print('en keys not in si:', len(new_in_en))
new_same = sum(1 for k, v in new_in_en if k == v)
print('of those, value==key:', new_same)
