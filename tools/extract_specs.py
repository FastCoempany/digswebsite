"""Pull the graded spec tables out of the tech pack PDFs into JSON.

The PDFs in reference/tech-packs are the source of truth. This reads the
GRADED SPEC page of each pack with pdftotext and writes
content/products/specs/<handle>.json with every POM row (inches, after wash).

Usage: python3 tools/extract_specs.py
Needs poppler's pdftotext on PATH.
"""
import json
import os
import re
import subprocess
from fractions import Fraction

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
TP = os.path.join(ROOT, "reference", "tech-packs")
OUT = os.path.join(ROOT, "content", "products", "specs")

PACKS = {
    # handle: (file, graded-spec page, layout)
    "thermal-long-sleeve": ("AC-LST-001_Tech.Pack_6-15-25.pdf", 10, "values-first"),
    "pincord-button-down": ("AC-LSS-001_Tech.Pack_Pincord_REV1_10-15-26.pdf", 13, "row"),
    "needlecord-shirt": ("AC-LSS-001_Tech.Pack_Needlecord_REV1_10-15-26.pdf", 11, "row"),
    "drawstring-pant": ("AC-PNT-001_Tech.Pack_REV0_10-15-26_1.pdf", 11, "row"),
}
SIZES = ["S", "M", "L", "XL"]
NUM = re.compile(r"^\d+$")
FRAC = re.compile(r"^\d+/\d+$")


def page_text(pdf, page):
    return subprocess.run(["pdftotext", "-f", str(page), "-l", str(page), "-layout", pdf, "-"],
                          capture_output=True, text=True, check=True).stdout


def take_numbers_from_right(tokens, count):
    """Parse `count` mixed numbers (e.g. '23 1/2', '7/8', '30') off the end of tokens."""
    vals = []
    i = len(tokens) - 1
    while len(vals) < count and i >= 0:
        t = tokens[i]
        if FRAC.match(t):
            if i - 1 >= 0 and NUM.match(tokens[i - 1]) and not FRAC.match(tokens[i - 1]):
                # an integer before a fraction belongs to it only if that keeps enough numbers left
                vals.append(Fraction(int(tokens[i - 1])) + Fraction(t))
                i -= 2
            else:
                vals.append(Fraction(t))
                i -= 1
        elif NUM.match(t) or t == "N/A":
            vals.append(None if t == "N/A" else Fraction(int(t)))
            i -= 1
        else:
            break
    return list(reversed(vals)), tokens[: i + 1]


def fmt(v):
    if v is None:
        return None
    whole, rem = divmod(v.numerator, v.denominator)
    return {"in": float(v), "label": (f"{whole} {Fraction(rem, v.denominator)}" if whole and rem else
                                       f"{Fraction(rem, v.denominator)}" if rem else f"{whole}")}


def parse_row_layout(text):
    rows = []
    for line in text.splitlines():
        line = line.strip()
        m = re.match(r"^([A-Z]\d?)\s+(.+)$", line)
        if not m:
            continue
        code, rest = m.group(1), m.group(2)
        toks = rest.split()
        # Greedy right-to-left parsing can glue "1/8 3/4" wrongly only when an integer precedes
        # a fraction; sizes S..XL plus tolerance are 5 mixed numbers.
        vals, desc_toks = take_numbers_from_right(toks, 5)
        if len(vals) != 5 or not desc_toks:
            continue
        tol, sizes = vals[0], vals[1:]
        rows.append({"pom": code, "description": " ".join(desc_toks), "tolerance": fmt(tol),
                     "sizes": {s: fmt(v) for s, v in zip(SIZES, sizes)}})
    return rows


def parse_values_first(text):
    """AC-LST-001 lays each row out as 'tol S M L XL' on one line and 'CODE DESCRIPTION' on the next."""
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    rows = []
    for a, b in zip(lines, lines[1:]):
        m = re.match(r"^([A-Z])\s+([A-Z0-9 /\-\"'.]+)$", b)
        if not m:
            continue
        vals, rest = take_numbers_from_right(a.split(), 5)
        if len(vals) != 5 or rest:
            continue
        rows.append({"pom": m.group(1), "description": m.group(2).strip(), "tolerance": fmt(vals[0]),
                     "sizes": {s: fmt(v) for s, v in zip(SIZES, vals[1:])}})
    return rows


def main():
    os.makedirs(OUT, exist_ok=True)
    for handle, (fname, page, layout) in PACKS.items():
        text = page_text(os.path.join(TP, fname), page)
        rows = parse_values_first(text) if layout == "values-first" else parse_row_layout(text)
        data = {"handle": handle, "source": f"reference/tech-packs/{fname}, page {page} (GRADED SPEC)",
                "units": "inches, after garment wash", "sample_size": "M", "rows": rows}
        with open(os.path.join(OUT, f"{handle}.json"), "w") as f:
            json.dump(data, f, indent=2)
        print(handle, len(rows), "POMs:", " ".join(r["pom"] for r in rows))


if __name__ == "__main__":
    main()
