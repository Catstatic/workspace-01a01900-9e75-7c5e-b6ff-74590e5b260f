#!/usr/bin/env python3
"""PAPERFORGE S1 — parse the 3 user-supplied fiziks GATE PDFs (2020/2024/2025)
into structured per-year question banks (JSON). Emits QA stats to stdout.
Only facts present in the PDFs are extracted; nothing is invented:
  - 2020: question paper only, NO answer keys present  -> keyStatus='unkeyed'
  - 2024/2025: fiziks solved keys inline              -> keyStatus='fiziks-solved'
"""
import re, json, sys, os

BASE = "/home/user/_audit/paperforge"

JUNK_PATTERNS = [
    r"^===== PAGE \d+ =====\s*$",
    r"^fiziks\s*$",
    r"^Institute for NET/JRF",
    r"^H\.No\.",
    r"^\s*H\.No\.",
    r"Phone:",
    r"Website:",
    r"^GATE Physics Question Paper-2025\s*$",
    r"^GATE Physics-2024\s*$",
    r"^GATE 2020\s*$",
    r"^Solution-[A-Za-z ]+$",
    r"^Physics by fiziks\s*$",
    r"^Learn Physics in Right Way\s*$",
    r"^Be Part of Disciplined Learning\s*$",
    r"^\s*\d{1,3}\s*$",  # bare page numbers
]
JUNK_RE = [re.compile(p) for p in JUNK_PATTERNS]

def clean_lines(text):
    text = text.replace("\r", " ")
    out = []
    for ln in text.split("\n"):
        s = ln.strip()
        if not s:
            out.append("")
            continue
        if any(r.search(s) for r in JUNK_RE):
            continue
        out.append(ln.rstrip())
    return out

CARRY_RE = re.compile(r"^\s*Q\.?\s*\d{1,2}\s*[.\-–]?\s*[Q\-–]", re.I)
def is_carry_header(ln):
    s = ln.strip()
    return bool(re.search(r"carry\s+(one|two)\s+marks?", s, re.I))

MARK_RE = re.compile(r"^\s*Q\.?\s*(\d{1,2})\s*[.)](?:[ \t]+(.*))?$")
SOL_CUT_RE = re.compile(r"(?im)^\s*Solution\s*[:.\-].*$")

def split_questions(lines):
    """Return list of (n, [lines]) using line-start Q markers. Skips carry headers."""
    items, cur_n, cur = [], None, []
    for ln in lines:
        if is_carry_header(ln):
            continue
        m = MARK_RE.match(ln)
        if m:
            n = int(m.group(1))
            if cur_n is not None:
                items.append((cur_n, cur))
            cur_n, cur = n, [(m.group(2) or "")]
        else:
            if cur_n is not None:
                cur.append(ln)
    if cur_n is not None:
        items.append((cur_n, cur))
    return items

OPT_RE = re.compile(r"[(（]\s*([A-Da-d])\s*[)）]")
ANS_RE = re.compile(r"(?im)^\s*Ans\.?\s*:s?\s*(.+?)\s*$")
ANS_RE2 = re.compile(r"(?im)^\s*Ans\.??\s*:\s*(.+?)\s*$")

def parse_body(lines):
    """Split question text into stem/opts + raw answer string.
    Returns (stem, opts, ans_raw, marker_count); marker_count counts every
    (x)-style option glyph seen, incl. figure-option ones with empty bodies."""
    txt = "\n".join(lines).strip()
    cut = SOL_CUT_RE.search(txt)
    if cut:  # drop the entire worked-solution tail (2024 solution blocks)
        txt = txt[:cut.start()]
    txt = re.sub(r"[ \t]+", " ", txt)
    txt = re.sub(r"\n{3,}", "\n\n", txt)
    ans_raw = None
    m = ANS_RE2.search(txt)
    if m:
        ans_raw = m.group(1).strip()
        txt = (txt[:m.start()] + "\n" + txt[m.end():]).strip()
    om = list(OPT_RE.finditer(txt))
    if not om:
        return txt.strip(), [], ans_raw, 0
    # option-body split; drop empty bodies; if >4 survive the real options are
    # the LAST 4 contiguous markers (stray "(a)"-style glyphs live in math)
    parts = []
    for i, mm in enumerate(om):
        s = mm.end()
        e = om[i + 1].start() if i + 1 < len(om) else len(txt)
        parts.append((mm, txt[s:e].strip()))
    kept = [(mm, body) for mm, body in parts if body != ""]
    if not kept:  # figure-only options (e.g. GA sequence puzzles)
        return txt[:om[0].start()].strip(), [], ans_raw, len(om)
    if len(kept) > 4:
        kept = kept[-4:]
    stem = txt[:kept[0][0].start()].strip()
    opts = [body for _, body in kept]
    return stem, opts, ans_raw, len(om)

def norm_ans(ans_raw, opts, year, marker_count=None):
    """Return (type, ans, note). types: MCQ/MSQ/NAT."""
    if ans_raw is None:
        # 2020: no key in pdf. MCQ if 4 option glyphs seen, else NAT
        # (MSQ did not exist in GATE 2020; figure-options count as glyphs)
        n = marker_count if marker_count is not None else len(opts)
        return ("MCQ" if n >= 4 else "NAT", None, "no-key-in-pdf")
    ar = ans_raw.strip()
    if re.fullmatch(r"(?i)MTA", ar):
        return ("MCQ" if len(opts) >= 4 else "NAT", "MTA", "marks-to-all")
    letters = re.findall(r"[(（]\s*([A-Da-d])\s*[)）]", ar)
    if letters:
        letters = [l.upper() for l in letters]
        seen = []
        for l in letters:
            if l not in seen:
                seen.append(l)
        if len(seen) >= 2:
            return ("MSQ", seen, None)
        return ("MCQ", seen[0], None)
    # numeric / range
    num = re.sub(r"\s+", " ", ar)
    return ("NAT", num, None)

def marks_for(year, gate_n):
    if 1 <= gate_n <= 5: return 1
    if 6 <= gate_n <= 10: return 2
    if 11 <= gate_n <= 35: return 1
    if 36 <= gate_n <= 65: return 2
    return None

def build(year):
    src = open(os.path.join(BASE, "y%d_raw.txt" % year)).read()
    lines = clean_lines(src)
    qs = {}

    if year == 2020:
        # fiziks numbering: GA Q1-10, then PHYS restarts Q1-55
        split_idx = next(i for i, ln in enumerate(lines)
                         if re.search(r"Q1\s*[–-]\s*Q25", ln))
        ga_items = split_questions(lines[:split_idx])
        ph_items = split_questions(lines[split_idx:])
        for n, body in ga_items:
            if 1 <= n <= 10 and n not in qs:
                stem, opts, ans, mc = parse_body(body)
                typ, a, note = norm_ans(ans, opts, year, mc)
                qs[n] = dict(n=n, part="GA", marks=marks_for(year, n),
                             type=typ, stem=stem, opts=opts, ans=a, note=note)
        dup = set()
        for n, body in ph_items:
            gn = n + 10
            if not (11 <= gn <= 65):
                continue
            if gn in qs:
                dup.add(gn); continue
            stem, opts, ans, mc = parse_body(body)
            typ, a, note = norm_ans(ans, opts, year, mc)
            qs[gn] = dict(n=gn, part="PH", marks=marks_for(year, gn),
                          type=typ, stem=stem, opts=opts, ans=a, note=note)
        if dup:
            print("  [warn] 2020 dup gate numbers:", sorted(dup))
    else:
        items = split_questions(lines)
        seen, dup = set(), set()
        for n, body in items:
            if not (1 <= n <= 65):
                continue
            if n in seen:
                dup.add(n); continue
            seen.add(n)
            stem, opts, ans, mc = parse_body(body)
            typ, a, note = norm_ans(ans, opts, year, mc)
            qs[n] = dict(n=n, part="GA" if n <= 10 else "PH",
                         marks=marks_for(year, n),
                         type=typ, stem=stem, opts=opts, ans=a, note=note)
        if dup:
            print("  [warn] %d duplicate question numbers kept-first:" % year, sorted(dup))

    # figure-dependent MCQs: options live in the PDF figure (image), not text
    for q in qs.values():
        if q["type"] in ("MCQ", "MSQ") and len(q["opts"]) != 4:
            q["note"] = "figure-dependent-options"

    key_status = "unkeyed" if year == 2020 else "fiziks-solved"
    bank = {
        "id": "gate%d" % year,
        "label": "GATE %d Physics" % year,
        "source": "user-supplied fiziks PDF",
        "keyStatus": key_status,
        "totalQ": len(qs),
        "questions": [qs[k] for k in sorted(qs)],
    }
    out = os.path.join(BASE, "gate%d.json" % year)
    json.dump(bank, open(out, "w"), ensure_ascii=False, indent=1)

    # ---- QA stats ----
    ga = [q for q in qs.values() if q["part"] == "GA"]
    ph = [q for q in qs.values() if q["part"] == "PH"]
    types = {}
    for q in qs.values():
        types[q["type"]] = types.get(q["type"], 0) + 1
    marks_sum = sum(q["marks"] or 0 for q in qs.values())
    keyed = sum(1 for q in qs.values() if q["ans"] is not None)
    short = [q["n"] for q in qs.values() if len(q["stem"]) < 10]
    badopts = [q["n"] for q in qs.values() if q["type"] == "MCQ" and len(q["opts"]) != 4]
    missing = [n for n in range(1, 66) if n not in qs]
    print("GATE %d | total=%d (GA %d, PH %d) | marks-sum=%d | keyed=%d"
          % (year, len(qs), len(ga), len(ph), marks_sum, keyed))
    print("   types:", types, "| missing:", missing or "none",
          "| short-stem:", short or "none", "| mcq!=4opts:", badopts or "none")
    return bank

if __name__ == "__main__":
    for y in (2020, 2024, 2025):
        build(y)
