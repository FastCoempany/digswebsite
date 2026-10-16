"""Render DIGS script words (The Old Falcons) to standalone SVG outlines.

The script face is set as artwork, never served as a web font: this tool
shapes the word with HarfBuzz (so the font's ligatures and alternates apply),
converts the glyph outlines to SVG paths and writes one SVG per word with a
tight viewBox and fill="currentColor", so the site colors it with tokens.

Usage:
  python3 tools/script_svg.py --out brand/script "dope" "good" "story"
  python3 tools/script_svg.py --out brand/script --features salt,swsh --skew -9 "Actually Dope"

Options:
  --font PATH      default: brand/fonts/_private-the-old-falcons/TheOldFalcons.otf
  --features LIST  comma-separated OpenType features to switch on (liga is on by default)
  --skew DEG       rotate the word (BOAST sets the scrawl at about -8 to -10 deg); default 0
  --name NAME      file name stem (single word only); default: slug of the text
"""
import argparse
import math
import os
import re

import uharfbuzz as hb
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_FONT = os.path.join(HERE, "..", "brand", "fonts", "_private-the-old-falcons", "TheOldFalcons.otf")


def slug(text):
    """File-name stem. Keeps capitalization distinct on case-insensitive disks:
    "dope" -> dope, "Dope" -> dope-cap, "DOPE" -> dope-caps."""
    base = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    letters = [c for c in text if c.isalpha()]
    if letters and all(c.isupper() for c in letters) and len(letters) > 1:
        return base + "-caps"
    if letters and letters[0].isupper():
        return base + "-cap"
    return base


def shape(font_path, text, features):
    blob = hb.Blob.from_file_path(font_path)
    face = hb.Face(blob)
    font = hb.Font(face)
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    feats = {"liga": True, "kern": True}
    for f in features:
        feats[f] = True
    hb.shape(font, buf, feats)
    return buf.glyph_infos, buf.glyph_positions


def render(font_path, text, features=(), skew=0.0):
    tt = TTFont(font_path)
    glyph_set = tt.getGlyphSet()
    order = tt.getGlyphOrder()
    infos, positions = shape(font_path, text, features)

    # Integer font units (1000/em) are far below visible precision; keeps files small.
    pen = SVGPathPen(glyph_set, ntos=lambda v: "%d" % round(v))
    bpen = BoundsPen(glyph_set)
    x = 0
    theta = math.radians(skew)
    cos, sin = math.cos(theta), math.sin(theta)
    for info, pos in zip(infos, positions):
        name = order[info.codepoint]
        # Glyph point (gx, gy) in font units, y up. Flip to SVG (y down), then
        # rotate by the skew angle in screen space:
        #   x' = cos*gx + sin*gy + e,   y' = sin*gx - cos*gy + f
        dx, dy = x + pos.x_offset, pos.y_offset
        e = dx * cos + dy * sin
        f = dx * sin - dy * cos
        m = (cos, sin, sin, -cos, e, f)  # fontTools order: xx, xy, yx, yy, dx, dy
        glyph_set[name].draw(TransformPen(pen, m))
        glyph_set[name].draw(TransformPen(bpen, m))
        x += pos.x_advance
    if bpen.bounds is None:
        raise SystemExit(f"nothing drawn for {text!r}")
    xmin, ymin, xmax, ymax = bpen.bounds
    pad = 8
    vb = (xmin - pad, ymin - pad, (xmax - xmin) + 2 * pad, (ymax - ymin) + 2 * pad)
    d = pen.getCommands()
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb[0]:.0f} {vb[1]:.0f} {vb[2]:.0f} {vb[3]:.0f}" '
        f'role="img" aria-label="{text}"><title>{text}</title>'
        f'<path fill="currentColor" d="{d}"/></svg>\n'
    )


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("words", nargs="+")
    ap.add_argument("--out", required=True)
    ap.add_argument("--font", default=DEFAULT_FONT)
    ap.add_argument("--features", default="")
    ap.add_argument("--skew", type=float, default=0.0)
    ap.add_argument("--name", default=None)
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    feats = [f for f in a.features.split(",") if f]
    for w in a.words:
        svg = render(a.font, w, feats, a.skew)
        stem = a.name if (a.name and len(a.words) == 1) else slug(w)
        suffix = ("-" + "-".join(feats)) if feats else ""
        path = os.path.join(a.out, f"script-{stem}{suffix}.svg")
        with open(path, "w") as fh:
            fh.write(svg)
        print(path, len(svg))


if __name__ == "__main__":
    main()
