import pypdf, os

root = "/home/user/uploads"
jobs = {
    "y2020": "GATE 2020 Question Paper (1).pdf",
    "y2024": "GATE-Solution-2024_compressed (1).pdf",
    "y2025": "GATE-Physics-2025_Question-Paper (1) (1).pdf",
}
for tag, fn in jobs.items():
    p = os.path.join(root, fn)
    r = pypdf.PdfReader(p)
    txt = []
    for i, pg in enumerate(r.pages):
        try:
            t = pg.extract_text() or ""
        except Exception as e:
            t = "[EXTRACT-ERR p%d: %s]" % (i + 1, e)
        txt.append("\n===== PAGE %d =====\n%s" % (i + 1, t))
    full = "".join(txt)
    out = "/home/user/_audit/paperforge/%s_raw.txt" % tag
    open(out, "w").write(full)
    print(tag, "| pages:", len(r.pages), "| chars:", len(full))
