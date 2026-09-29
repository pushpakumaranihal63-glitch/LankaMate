#!/usr/bin/env python3
"""Apply translations from scripts/translations.json into src/i18n/uiPhrases.ts.

Replaces English-fallback entries (key == value) in the si/ta/ar blocks with
real translations. Preserves indentation and JS escaping. Validates counts.
"""
import json
import re
import sys

SRC = 'src/i18n/uiPhrases.ts'
TRANS_FILE = 'scripts/translations.json'

with open(TRANS_FILE, encoding='utf-8') as f:
    TRANS = json.load(f)
TRANS.pop('__sentinel__', None)

with open(SRC, 'r', encoding='utf-8') as f:
    content = f.read()
lines = content.split('\n')


def find_block(name):
    for i, l in enumerate(lines):
        if re.match(r'^  ' + name + r': \{', l):
            return i
    return -1


def unesc(s):
    # JS single-quoted string escapes present in this file: \' and \\
    return s.replace("\\'", "\x00").replace('\\\\', '\\').replace("\x00", "'")


def esc(s):
    return s.replace('\\', '\\\\').replace("'", "\\'")


LINE_PAT = re.compile(r"^(\s+)'((?:[^'\\]|\\.)*)': '((?:[^'\\]|\\.)*)',?\s*$")


def parse_block(start, end):
    entries = []
    for i in range(start + 1, end):
        line = lines[i]
        if line.strip() in ('}', '},'):
            continue
        m = LINE_PAT.match(line)
        if m:
            entries.append((m.group(1), m.group(2), m.group(3), i))
    return entries


en_start = find_block('en')
si_start = find_block('si')
ta_start = find_block('ta')
ar_start = find_block('ar')
tr_start = find_block('tr')

en_entries = parse_block(en_start, si_start)
en_keys = set(unesc(k) for _, k, _, _ in en_entries)

missing = sorted(k for k in en_keys if k not in TRANS)
if missing:
    print('ERROR: %d English keys missing from translations.json:' % len(missing))
    for k in missing[:20]:
        print('  -', repr(k[:80]))
    sys.exit(1)

extra = sorted(k for k in TRANS if k not in en_keys)
if extra:
    print('WARN: %d keys in translations.json not present among new en keys (ignored):' % len(extra))
    for k in extra[:10]:
        print('  -', repr(k[:80]))

langs = [('si', si_start, ta_start), ('ta', ta_start, ar_start), ('ar', ar_start, tr_start)]

replaced = 0
skipped = 0
for lang, bstart, bend in langs:
    entries = parse_block(bstart, bend)
    for indent, rawk, rawv, i in entries:
        key = unesc(rawk)
        if key not in TRANS:
            continue
        # Only replace if currently an English fallback (raw key == raw value)
        if rawk != rawv:
            skipped += 1
            continue
        new_val = TRANS[key][lang]
        new_line = "%s'%s': '%s'," % (indent, rawk, esc(new_val))
        lines[i] = new_line
        replaced += 1

with open(SRC, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print('Replaced %d fallback entries (skipped %d already-translated).' % (replaced, skipped))
print('Expected ~%d (897 keys x 3 langs = %d).' % (len(en_keys) * 3, len(en_keys) * 3))
