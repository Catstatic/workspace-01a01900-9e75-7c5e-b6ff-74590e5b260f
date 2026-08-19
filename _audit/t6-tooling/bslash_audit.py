import re, sys
from collections import Counter
pat = re.compile(r"(?<!\\)\\(?!\\)[a-zA-Z\x27]")
bad = 0
files = sys.argv[1:]
for p in files:
    s = open(p).read()
    hits = pat.findall(s)
    # filter legit apostrophe-escapes \' (followed by s/t/re/d/ll/ve/m etc is still \' which is legal JS)
    hits = [h for h in hits if h != "\\'"]
    if hits:
        bad += 1
        print(p, dict(Counter(hits)))
print("files with TRUE single-backslash macros:", bad, "of", len(files))
