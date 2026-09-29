import re, json

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

def unesc(s):
    # JS single-quoted string escapes: \\ \' \n \t etc. We only have \' and \\ per our scan.
    return s.replace("\\'", "'").replace('\\\\', '\\')

en_start = find_block('en')
si_start = find_block('si')
en_entries = parse_block(en_start, si_start)

out = []
for k, v, i in en_entries:
    out.append({'line': i + 1, 'key_raw': k, 'key': unesc(k), 'value_raw': v, 'value': unesc(v)})

with open('scripts/en_keys.json', 'w', encoding='utf-8') as f:
    json.dump(out, f, ensure_ascii=False, indent=1)
print('wrote', len(out), 'keys')
