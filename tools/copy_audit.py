"""Copy audit against docs/brief/08-copy.md.

Checks, across content/copy/en.json, app/ and the rendered pages of a running preview
(http://localhost:3000 by default; skipped if not reachable):
  * forbidden strings: boudaries, jorney, @streetdigs, @digs, www.digs.com / digs.com, TENCEL,
    Lorem ipsum, the PJ placeholder lines ("From a studio in London")
  * fixed lines present exactly: the two corrected BOAST lines, handle, domain, origin line
  * named CTAs present on the rendered pages: Dig in, Your Digs, Get on the list / Add to Digs,
    Hold my size, Stay dope, Check out
  * headline rule: approved BOAST lines end with a period and carry no exclamation mark
  * one or two script words per line: counts <Script> instances per heading on the rendered pages
  * lists every en.json line still marked "draft" (needs the founder's approval before launch)

Usage: python3 tools/copy_audit.py [--base http://localhost:3000]   (exit 1 on a failing check)
"""
import json
import os
import re
import sys
import urllib.error
import urllib.request
from html.parser import HTMLParser

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
BASE = "http://localhost:3000"
for i, a in enumerate(sys.argv):
    if a == "--base" and i + 1 < len(sys.argv):
        BASE = sys.argv[i + 1]

FORBIDDEN = re.compile(r"boudaries|jorney|@streetdigs|(?<![\w@])@digs\b|www\.digs\.com|(?<![a-z0-9])digs\.com|TENCEL|lorem ipsum|From a studio in London", re.I)
PAGES = ["/", "/collections/all", "/products/thermal-long-sleeve", "/products/pincord-button-down", "/products/needlecord-shirt", "/products/drawstring-pant", "/pages/manifesto", "/pages/size-guide", "/pages/shipping-returns", "/pages/faq", "/pages/contact", "/pages/accessibility", "/policies", "/account", "/cart", "/this-does-not-exist"]
fails = []
notes = []


def walk(node, path=""):
    if isinstance(node, dict):
        for k, v in node.items():
            yield from walk(v, f"{path}.{k}" if path else k)
    elif isinstance(node, list):
        for i, v in enumerate(node):
            yield from walk(v, f"{path}[{i}]")
    elif isinstance(node, str):
        yield path, node


copy = json.load(open(os.path.join(ROOT, "content", "copy", "en.json")))

# 1. forbidden strings in copy and app sources
for p, s in walk(copy):
    if p.startswith("typoFixes"):
        continue
    if FORBIDDEN.search(s):
        fails.append(f"en.json {p}: forbidden string in {s!r}")
for dirpath, dirs, files in os.walk(os.path.join(ROOT, "app")):
    for fn in files:
        if fn.endswith((".ts", ".tsx", ".css", ".json")):
            txt = open(os.path.join(dirpath, fn), encoding="utf-8").read()
            m = FORBIDDEN.search(txt)
            if m:
                fails.append(f"app/{os.path.relpath(os.path.join(dirpath, fn), os.path.join(ROOT, 'app'))}: forbidden string {m.group(0)!r}")

# 2. fixed lines
must = {
    "Designed for those who push boundaries.": copy["boastLines"],
    "Streetwear that echoes your journey.": copy["boastLines"],
}
for line, where in must.items():
    if line not in where:
        fails.append(f"missing fixed line: {line}")
if copy["brand"]["instagram"] != "@dopeisgood" or copy["brand"]["domain"] != "dopeisgood.com":
    fails.append("handle/domain changed")
if copy["product"]["origin"] != "Designed in USA. Imported.":
    fails.append("origin line changed")
for cta, want in {"enterShop": "Dig in", "addToCart": "Add to Digs", "cart": "Your Digs", "backInStock": "Hold my size", "comingSoon": "Get on the list", "newsletter": "Stay dope", "checkout": "Check out"}.items():
    if copy["cta"].get(cta) != want:
        fails.append(f"CTA {cta} is {copy['cta'].get(cta)!r}, expected {want!r}")

# 3. headline rule
for line in copy["taglineBand"] + [copy["home"]["manifestoHead"], copy["home"]["blueFrameHead"], copy["manifestoPage"]["head"], copy["notFound"]["head"]]:
    if "!" in line:
        fails.append(f"exclamation mark in headline: {line!r}")
    if not line.endswith("."):
        fails.append(f"headline without a period: {line!r}")

# 4. drafts
drafts = [p for p, s in walk(copy) if p.endswith(".status") and s == "draft"]
notes.append(f"{len(drafts)} draft lines awaiting approval: " + ", ".join(d[: -len('.status')] for d in drafts))


# 5. rendered pages
class Text(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []
        self.skip = 0
        self.heads = []
        self.cur = None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag in ("script", "style"):
            self.skip += 1
        if tag in ("h1", "h2", "h3", "p") and self.cur is None:
            self.cur = {"tag": tag, "scripts": 0, "text": ""}
        if self.cur is not None and "script" in (a.get("class") or "").split():
            self.cur["scripts"] += 1

    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self.skip -= 1
        if self.cur and tag == self.cur["tag"]:
            self.heads.append(self.cur)
            self.cur = None

    def handle_data(self, data):
        if not self.skip:
            self.parts.append(data)
            if self.cur is not None:
                self.cur["text"] += data


rendered = {}
try:
    urllib.request.urlopen(BASE + "/", timeout=5)
    for p in PAGES:
        try:
            with urllib.request.urlopen(BASE + p + "?mode=ui", timeout=20) as r:
                html = r.read().decode("utf-8")
        except urllib.error.HTTPError as err:  # the 404 page still renders copy
            html = err.read().decode("utf-8")
        t = Text()
        t.feed(html)
        rendered[p] = (" ".join(t.parts), t.heads, html)
except Exception as e:  # noqa: BLE001
    notes.append(f"preview not reachable at {BASE} ({e}); rendered-page checks skipped")

if rendered:
    alltext = " ".join(v[0] for v in rendered.values())
    allhtml = " ".join(v[2] for v in rendered.values())
    for p, (text, heads, html) in rendered.items():
        m = FORBIDDEN.search(text)
        if m:
            fails.append(f"{p}: forbidden string {m.group(0)!r} on the page")
        for h in heads:
            if h["scripts"] > 2:
                fails.append(f"{p}: {h['scripts']} script words in one line: {h['text'].strip()[:60]!r}")
    # CTAs reachable in the default state (all four products are coming soon, cart empty).
    for cta in ["Dig in", "Your Digs", "Get on the list", "Stay dope", "Size guide", "Read the manifesto"]:
        if cta not in alltext:
            fails.append(f"CTA not found on any page: {cta!r}")
    # State-only CTAs (sold-out size, filled cart, available product) live in the stories.
    notes.append("state-only CTAs checked in en.json and Storybook, not on default pages: Add to Digs, Hold my size, Check out")
    for s in ["@dopeisgood", "dopeisgood.com", "Designed in USA. Imported.", "Images are previews made from the tech pack.", "Price TBA", "lyocell"]:
        if s not in alltext:
            fails.append(f"required line not found on any page: {s!r}")
    if "Dope is" not in alltext:
        fails.append("ethos line missing")
    if re.search(r"\bTencel\b", alltext, re.I):
        fails.append("TENCEL on a page")
    # The wordmark is always lowercase digs: a capitalised 'Digs' only appears inside the CTA names
    stray = sorted({alltext[max(0, m.start() - 12): m.end() + 10].strip() for m in re.finditer(r"(?<![\w])Digs(?![\w])", alltext) if not re.search(r"(Your|your|to) Digs", alltext[max(0, m.start() - 8): m.end()])})
    if stray:
        notes.append(f"capitalised 'Digs' outside the CTA names (check): {stray}")
    notes.append(f"rendered {len(rendered)} pages")

print("copy audit")
for n in notes:
    print("  note:", n)
if fails:
    print("FAILED:")
    for f in fails:
        print("  -", f)
    sys.exit(1)
print("  all checks passed")
