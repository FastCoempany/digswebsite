"""Build the self-hosted web font from the BOAST font package.

Input:  brand/fonts/alexandria/Alexandria-VariableFont_wght.ttf  (OFL 1.1, free to self-host)
Output: public/fonts/alexandria-var.woff2                         (Latin subset, wght axis kept)

The Old Falcons is NEVER converted or copied: script words ship as SVG (tools/script_svg.py).

Usage: python3 tools/build_fonts.py
"""
import os
import sys

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
SRC = os.path.join(ROOT, "brand", "fonts", "alexandria", "Alexandria-VariableFont_wght.ttf")
OUT_DIR = os.path.join(ROOT, "public", "fonts")
OUT = os.path.join(OUT_DIR, "alexandria-var.woff2")

# Basic Latin, Latin-1 Supplement, Latin Extended-A, general punctuation,
# currency, letterlike (™ ©), arrows used in UI, fractions.
UNICODES = "U+0000-00FF,U+0100-017F,U+2000-206F,U+20A0-20CF,U+2122,U+2190-2199,U+2212,U+2215,U+00BC-00BE,U+2153-215E,U+FEFF,U+FFFD"


def main():
    if not os.path.exists(SRC):
        sys.exit(f"missing {SRC}")
    os.makedirs(OUT_DIR, exist_ok=True)
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["*"]
    options.name_IDs = ["*"]
    options.notdef_outline = True
    options.recalc_bounds = True
    options.drop_tables += ["DSIG"]
    font = TTFont(SRC)
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=subset.parse_unicodes(UNICODES))
    subsetter.subset(font)
    font.flavor = "woff2"
    font.save(OUT)
    axes = [a.axisTag for a in font["fvar"].axes] if "fvar" in font else []
    print(f"wrote {os.path.relpath(OUT, ROOT)} ({os.path.getsize(OUT)//1024} KB, axes={axes})")


if __name__ == "__main__":
    main()
