"""CI brand check (09-build-plan.md, phase 0).

Fails when any of these appear in app/ (and, for the private font, in public/ and build output):
  * a hex color literal (components use semantic tokens only; CLAUDE.md)
  * a Puff Junction color value: D6FD4A, A5E4FF, FF8FF1, FEF200
  * the strings boudaries, jorney, @streetdigs, digs.com (BOAST's retired handle/domain), TENCEL
  * any reference to brand/fonts/_private-the-old-falcons, the TheOldFalcons.otf file, an .otf
    file at all, or a `font-family: The Old Falcons` declaration, in app/, public/, dist/, build/,
    storybook-static/; plus a binary scan of every served font file for the face's name
    (the script face is never served; prose mentions of its name in comments and copy are fine)

Exemptions: a line ending in the comment  brand-check: allow  (used only for things like
`#root` ids that look like hex). Generated path data is checked too.

Usage: python3 tools/check_brand.py   (exit 1 on any finding)
"""
import os
import re
import sys

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
APP_DIRS = ["app"]
FONT_DIRS = ["app", "public", "dist", "build", "storybook-static", ".storybook"]
TEXT_EXT = {".ts", ".tsx", ".js", ".jsx", ".mjs", ".css", ".json", ".svg", ".html", ".md", ".mdx", ".txt", ".map"}
HEX = re.compile(r"(?<![\w&])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b")
PJ = re.compile(r"D6FD4A|A5E4FF|FF8FF1|FEF200", re.I)
STRINGS = re.compile(r"boudaries|jorney|@streetdigs|(?<![a-z0-9])digs\.com|TENCEL", re.I)
FONT = re.compile(r"_private-the-old-falcons|TheOldFalcons|font-family:\s*['\"]?The Old Falcons|\.otf\b", re.I)
FONT_BIN = re.compile(rb"The Old Falcons|TheOldFalcons", re.I)

findings = []


def walk(dirs):
    for d in dirs:
        base = os.path.join(ROOT, d)
        if not os.path.isdir(base):
            continue
        for dirpath, dirnames, filenames in os.walk(base):
            dirnames[:] = [x for x in dirnames if x not in ("node_modules", ".cache")]
            for fn in filenames:
                yield os.path.join(dirpath, fn)


def check_text(path, pattern, label, exempt_ok=True):
    try:
        with open(path, encoding="utf-8") as f:
            for n, line in enumerate(f, 1):
                if exempt_ok and "brand-check: allow" in line:
                    continue
                m = pattern.search(line)
                if m:
                    findings.append(f"{os.path.relpath(path, ROOT)}:{n}: {label}: {m.group(0)!r}")
    except UnicodeDecodeError:
        pass


for path in walk(APP_DIRS):
    ext = os.path.splitext(path)[1]
    if ext in TEXT_EXT:
        check_text(path, HEX, "hex color")
        check_text(path, PJ, "Puff Junction color", exempt_ok=False)
        check_text(path, STRINGS, "forbidden string", exempt_ok=False)

for path in walk(FONT_DIRS):
    ext = os.path.splitext(path)[1]
    if ext in (".otf", ".ttf", ".woff", ".woff2"):
        with open(path, "rb") as f:
            data = f.read()
        if FONT_BIN.search(data):
            findings.append(f"{os.path.relpath(path, ROOT)}: The Old Falcons font file is being served")
        continue
    if ext in TEXT_EXT:
        check_text(path, FONT, "private font reference", exempt_ok=False)

if findings:
    print("brand check FAILED:")
    for f in findings:
        print("  " + f)
    sys.exit(1)
print("brand check passed")
