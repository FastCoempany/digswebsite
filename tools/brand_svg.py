"""Turn the BOAST logo files and the script-word SVGs into app assets.

Reads (never edited):
  brand/logos/wordmark/digs-wordmark-blue.svg
  brand/logos/brandmark/digs-brandmark-blue.svg
  brand/logos/lockup/lockup-inline-black-wordmark-blue-scrawl.svg
  brand/logos/lockup/lockup-stacked-black-wordmark-blue-scrawl.svg
  brand/script/*.svg

Writes (generated, do not edit):
  app/components/digs/marks/paths.generated.ts   inline path data for the Wordmark (small)
  app/assets/marks/brandmark.svg                  the DD mark, fill="currentColor" (CSS mask)
  public/favicon.svg                              the DD mark in Digs Blue
  app/assets/marks/lockup-{inline,stacked}-{wordmark,scrawl}.svg  the two layers of each lockup,
                                                   same viewBox, fill="currentColor" (used as CSS masks)
  app/assets/script/*.svg                         script words, fill="currentColor", svgo-optimized

Colors are stripped: everything is drawn with currentColor, so the components pick the color pair
per surface (01-brand-system.md section 2) and no hex ever lands in app/. The lockups are heavy
(the scrawl is one long marker path), so they ship as static SVG layers, not JS.

Usage: python3 tools/brand_svg.py
"""
import glob
import json
import os
import re
import shutil
import subprocess
import xml.etree.ElementTree as ET

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
LOGOS = os.path.join(ROOT, "brand", "logos")
SCRIPT_SRC = os.path.join(ROOT, "brand", "script")
SCRIPT_OUT = os.path.join(ROOT, "app", "assets", "script")
MARKS_SVG_OUT = os.path.join(ROOT, "app", "assets", "marks")
MARKS_OUT = os.path.join(ROOT, "app", "components", "digs", "marks", "paths.generated.ts")

NS = {"svg": "http://www.w3.org/2000/svg"}
BLUE = "0042e5"


def svgo(path):
    """Optimize in place with svgo (precision 1: 0.1 unit on a ~800-1300 unit viewBox)."""
    svgo_bin = os.path.join(ROOT, "node_modules", ".bin", "svgo")
    if not os.path.exists(svgo_bin):
        print("  svgo not installed yet; skipping optimization for", os.path.basename(path))
        return
    subprocess.run(
        [svgo_bin, "--multipass", "-p", "1", "--quiet", path,
         "--config", os.path.join(ROOT, "tools", "svgo.config.mjs")],
        check=True,
    )


def paths_of(svg_path):
    """Return (viewBox, [(fill_hex, d), ...]) from an Illustrator export (style attrs or classes)."""
    tree = ET.parse(svg_path)
    root = tree.getroot()
    view_box = root.get("viewBox")
    classes = {}
    style = root.find(".//svg:style", NS)
    if style is not None and style.text:
        for m in re.finditer(r"\.([\w-]+)\s*\{\s*fill:\s*#([0-9a-fA-F]{3,6})", style.text):
            classes[m.group(1)] = m.group(2).lower()
    out = []
    for el in root.iter():
        tag = el.tag.split("}")[-1]
        if tag != "path":
            continue
        fill = None
        st = el.get("style") or ""
        m = re.search(r"fill:\s*#([0-9a-fA-F]{3,6})", st)
        if m:
            fill = m.group(1).lower()
        elif el.get("class") in classes:
            fill = classes[el.get("class")]
        elif el.get("fill"):
            fill = el.get("fill").lstrip("#").lower()
        d = re.sub(r"\s+", " ", el.get("d", "")).strip()
        out.append((fill, d))
    return view_box, out


def compact(d):
    """Round path numbers to 2 decimals and drop needless zeros."""
    def rnd(m):
        v = float(m.group(0))
        s = f"{v:.2f}".rstrip("0").rstrip(".")
        return "0" if s in ("-0", "") else s
    d = re.sub(r"-?\d*\.?\d+(?:e-?\d+)?", rnd, d)
    d = re.sub(r"\s*([MmLlHhVvCcSsQqTtAaZz])\s*", r"\1", d)
    d = re.sub(r"\s+", " ", d)
    d = re.sub(r" -", "-", d)
    d = re.sub(r",", " ", d)
    return d.strip()


def main():
    os.makedirs(SCRIPT_OUT, exist_ok=True)
    os.makedirs(os.path.dirname(MARKS_OUT), exist_ok=True)

    marks = {}
    vb, paths = paths_of(os.path.join(LOGOS, "wordmark", "digs-wordmark-blue.svg"))
    marks["wordmark"] = {"viewBox": vb, "paths": [compact(d) for _, d in paths]}
    vb, paths = paths_of(os.path.join(LOGOS, "brandmark", "digs-brandmark-blue.svg"))
    os.makedirs(MARKS_SVG_OUT, exist_ok=True)
    dst = os.path.join(MARKS_SVG_OUT, "brandmark.svg")
    with open(dst, "w") as f:
        f.write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" aria-hidden="true">')
        for _, d in paths:
            f.write(f'<path fill="currentColor" d="{compact(d)}"/>')
        f.write("</svg>\n")
    svgo(dst)
    marks["brandmark_viewBox"] = vb
    print(f"  brandmark.svg: {os.path.getsize(dst)//1024} KB")
    # Favicon: the brandmark in Digs Blue, straight from the BOAST file (public/ may carry the brand hex).
    fav = os.path.join(ROOT, "public", "favicon.svg")
    shutil.copyfile(os.path.join(LOGOS, "brandmark", "digs-brandmark-blue.svg"), fav)
    svgo(fav)
    os.makedirs(MARKS_SVG_OUT, exist_ok=True)
    lockups = {}
    for layout in ("inline", "stacked"):
        vb, paths = paths_of(os.path.join(LOGOS, "lockup", f"lockup-{layout}-black-wordmark-blue-scrawl.svg"))
        layers = {
            "wordmark": [compact(d) for f, d in paths if f != BLUE],
            "scrawl": [compact(d) for f, d in paths if f == BLUE],
        }
        assert layers["scrawl"], f"no scrawl paths found in {layout} lockup"
        lockups[layout] = vb
        for layer, ds in layers.items():
            dst = os.path.join(MARKS_SVG_OUT, f"lockup-{layout}-{layer}.svg")
            with open(dst, "w") as f:
                f.write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" aria-hidden="true">')
                for d in ds:
                    f.write(f'<path fill="currentColor" d="{d}"/>')
                f.write("</svg>\n")
            svgo(dst)
            print(f"  lockup-{layout}-{layer}.svg: {os.path.getsize(dst)//1024} KB")

    with open(MARKS_OUT, "w") as f:
        f.write("/* GENERATED by tools/brand_svg.py from brand/logos. Do not edit. */\n")
        f.write("export type MarkPaths = {viewBox: string; paths: string[]};\n\n")
        f.write(f"export const WORDMARK: MarkPaths = {json.dumps(marks['wordmark'])};\n\n")
        f.write(f"export const BRANDMARK_VIEWBOX = {json.dumps(marks['brandmark_viewBox'])};\n\n")
        f.write("/** viewBox of each lockup layout; the layers live in app/assets/marks/. */\n")
        f.write(f"export const LOCKUP_VIEWBOX = {json.dumps(lockups)} as const;\n")
    print(f"wrote {os.path.relpath(MARKS_OUT, ROOT)} ({os.path.getsize(MARKS_OUT)//1024} KB)")

    # Script words: copy, assert currentColor, optimize.
    index = {}
    for src in sorted(glob.glob(os.path.join(SCRIPT_SRC, "script-*.svg"))):
        name = os.path.basename(src)
        dst = os.path.join(SCRIPT_OUT, name)
        shutil.copyfile(src, dst)
        svgo(dst)
        with open(dst) as f:
            txt = f.read()
        assert "currentColor" in txt, f"{name} must use fill=currentColor"
        assert not re.search(r"#[0-9a-fA-F]{3,8}\b", txt), f"{name} contains a hex color"
        m = re.search(r'viewBox="([^"]+)"', txt)
        word = re.search(r'aria-label="([^"]+)"', txt)
        index[name[len("script-"):-4]] = {"viewBox": m.group(1), "word": word.group(1) if word else ""}
        print(f"  {name}: {os.path.getsize(src)//1024} KB -> {os.path.getsize(dst)//1024} KB")
    with open(os.path.join(SCRIPT_OUT, "index.json"), "w") as f:
        json.dump(index, f, indent=1)
    print(f"wrote {len(index)} script words to app/assets/script/")


if __name__ == "__main__":
    main()
