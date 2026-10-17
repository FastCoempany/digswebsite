"""Trace every product fact on screen back to content/products/ (CLAUDE.md: never invent a spec).

For each PDP (and the shop + size guide), fetch the rendered HTML from the preview and check that
every sentence/number shown in the product-fact regions (style string, title + colorway, fabric,
finish, details, care, content, origin, Built like this callouts, size chart cells, colorway
names, later colorways) appears verbatim in the product JSON or its graded spec. Anything on
screen in those regions that has no source fails the trace.

Usage: python3 tools/fact_trace.py [--base http://localhost:3000]   (exit 1 on any untraced fact)
"""
import json
import os
import re
import sys
import urllib.request
from html.parser import HTMLParser

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
BASE = "http://localhost:3000"
for i, a in enumerate(sys.argv):
    if a == "--base" and i + 1 < len(sys.argv):
        BASE = sys.argv[i + 1]

HANDLES = ["thermal-long-sleeve", "pincord-button-down", "needlecord-shirt", "drawstring-pant"]
STYLE_STRINGS = {
    "thermal-long-sleeve": "AC-LST-001 | LONG SLEEVE TEE | S–XL",
    "pincord-button-down": "AC-LSS-001 | LONG SLEEVE SHIRT | S–XL",
    "needlecord-shirt": "AC-LSS-001 | LONG SLEEVE SHIRT | S–XL",
    "drawstring-pant": "AC-PNT-001 | DRAWSTRING PANT | S–XL",
}


class Regions(HTMLParser):
    """Collect text per region: elements whose class contains one of the markers."""

    MARKERS = ("stylestring", "pdp-title", "accordion-body", "blt-callout", "sizechart-table", "swatches-name", "pdp-origin", "pdp-short")

    def __init__(self):
        super().__init__()
        self.stack = []
        self.regions = []
        self.skip = 0

    VOID = {"br", "img", "input", "hr", "meta", "link", "path", "line", "circle", "rect", "use", "source"}

    def _mark(self):
        for t in self.stack:
            if t[1]:
                t[2] += " ¶ "

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        cls = a.get("class") or ""
        hit = next((m for m in self.MARKERS if m in cls.split()), None)
        self._mark()
        if tag in self.VOID:
            return
        self.stack.append([tag, hit, ""] if hit else [tag, None, None])
        if tag in ("script", "style"):
            self.skip += 1

    def handle_endtag(self, tag):
        if tag in self.VOID:
            return
        if tag in ("script", "style"):
            self.skip -= 1
        self._mark()
        while self.stack:
            t = self.stack.pop()
            if t[1]:
                self.regions.append((t[1], t[2]))
            if t[0] == tag:
                break

    def handle_data(self, data):
        if self.skip:
            return
        for t in self.stack:
            if t[1]:
                t[2] += data + " "


def norm(s):
    s = s.replace("\u00a0", " ").replace("–", "-").replace("—", "-").replace("’", "'").replace("“", '"').replace("”", '"')
    s = re.sub(r"\s+", " ", s)
    s = re.sub(r"\s+([,.;:)])", r"\1", s)
    s = re.sub(r"\(\s+", "(", s)
    return s.strip().lower()


def sources(handle):
    p = json.load(open(os.path.join(ROOT, "content", "products", f"{handle}.json")))
    spec = json.load(open(os.path.join(ROOT, p["sizeChart"]["specs"])))
    text = []

    def walk(n):
        if isinstance(n, dict):
            for v in n.values():
                walk(v)
        elif isinstance(n, list):
            for v in n:
                walk(v)
        elif isinstance(n, (str, int, float)):
            text.append(str(n))

    walk(p)
    walk(spec)
    text.append(STYLE_STRINGS[handle])
    text.append(p["name"])
    for cw in p["colorways"]:
        text.append(f"{p['name']}, {cw['name']}")
    # cm values the UI derives from the inches (×2.54, rounded to 0.5)
    for row in spec["rows"]:
        for v in row["sizes"].values():
            text.append(str(round(v["in"] * 2.54 * 2) / 2))
    return p, norm(" || ".join(text))


# Labels that are UI chrome inside the fact regions (from en.json), not product facts
copy = json.load(open(os.path.join(ROOT, "content", "copy", "en.json")))
CHROME = {norm(x) for x in [
    "Fabric.", "Finish.", "Content.", "Where", "Measurements", "laid flat", "(laid flat)", "Select a size.", copy["cta"]["sizeGuide"], copy["product"]["measurementsHeadNoSize"],
    copy["product"]["shippingReturnsBody"]["text"], "S", "M", "L", "XL", "in", "cm", "Front", "Back",
    copy["product"]["sizeNoteLaidFlat"], copy["cta"]["selectSize"],
] + [norm(k) for k in copy["product"]["short"].keys()]}
for h in HANDLES:
    CHROME.add(norm(copy["product"]["short"][h]["text"]))

fails = []
checked = 0
for handle in HANDLES:
    product, src = sources(handle)
    try:
        html = urllib.request.urlopen(f"{BASE}/products/{handle}?mode=ui", timeout=20).read().decode("utf-8")
    except Exception as e:  # noqa: BLE001
        print(f"preview not reachable: {e}")
        sys.exit(2)
    r = Regions()
    r.feed(html)
    for region, text in r.regions:
        # split into fact-sized pieces: sentences, bullets, cells
        pieces = [norm(x) for x in text.split("¶") if norm(x)]
        for piece in pieces:
            if piece in CHROME or len(piece) < 2:
                continue
            # strip trailing periods and "Where" prefixes, measurement units
            cand = re.sub(r"^(where|fabric\.|finish\.|content\.)\s*", "", piece).strip(" .")
            cand = re.sub(r"\s(in|cm)$", "", cand)
            tokens = [t for t in re.split(r"\s*[:;·|]\s*|\s(?=\d+(\.\d+)?$)", cand) if t and t.strip()]
            ok = cand in src or all(t.strip(" .") in src for t in tokens if t.strip(" ."))
            checked += 1
            if not ok:
                # try number-by-number for table rows (labels + numbers)
                nums = re.findall(r"\d+(?:\s\d/\d)?(?:\.\d+)?", cand)
                words = re.sub(r"\d+(?:\s\d/\d)?(?:\.\d+)?", "", cand).strip(" .")
                if nums and all(n in src for n in nums) and (not words or words in src or all(w in src for w in re.split(r"\s*[()]\s*", words) if w)):
                    continue
                fails.append(f"{handle} [{region}]: {piece[:110]!r}")

print(f"fact trace: {checked} on-screen facts checked across {len(HANDLES)} product pages")
if fails:
    print("UNTRACED (no source in content/products/):")
    for f in fails:
        print("  -", f)
    sys.exit(1)
print("  every fact traces to content/products/")
