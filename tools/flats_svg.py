"""Extract the garment flats from the tech-pack PDFs as clean vector line art.

For the "Built like this" component (05-components.md; 09-build-plan.md phase 3). Each pack's
cover (page 1) carries the front and back flats side by side without callouts; the pincord cover is
a coloured, textured render, so that pack uses page 5 ("Exterior view") and the red leaders and
callout text are stripped instead.

Reads (never edited):
  reference/tech-packs/*.pdf              via `pdftocairo -svg` (poppler), one page per pack

Writes (generated, do not edit):
  app/assets/flats/<handle>-front.svg     tight viewBox (PDF points), strokes and dark fills in
  app/assets/flats/<handle>-back.svg      currentColor, light fills none, no text/raster/fonts/hex
  app/assets/flats/index.json             { handle: { front: {file, viewBox}, back: {...} } }
  app/assets/flats/anchors.json           hotspot anchors as % of the flat's box, keyed by handle,
                                          then builtLikeThis[] index: {view, x, y}

How a page becomes two flats
  1. pdftocairo turns the page into SVG. Text arrives as <use href="#glyph-…"> (dropped: no fonts,
     no lettering), Illustrator transparency arrives as mask/filter "compositing groups" (the
     thermal pack). Those are resolved: a mask that is one full-page rect is a uniform opacity,
     a filter that composites two groups is drawn as destination-then-source.
  2. Every remaining drawable gets a page-space bounding box. Red elements (leaders, arrowheads),
     full-page rects and anything in the header/footer bands are dropped. What is left is
     clustered by proximity; the two largest clusters are the front (left) and back (right) flats.
  3. Each flat is written as its own SVG: viewBox = cluster bounds + margin, strokes ->
     currentColor, dark fills -> currentColor, near-white fills -> none, mid greys -> currentColor
     at (1 - luminance) opacity (rib shading, inside collars). Brush stitching (hundreds of 4 x 6 pt
     thread illustrations) becomes straight dashes and satin-stitch texture is dropped, which is
     what takes the thermal from 300 KB to 30 KB; see analyze_marks. Then svgo, then ids get a
     per-file prefix so several flats can be inlined on one page.

Usage:
  python3 tools/flats_svg.py              # write everything
  python3 tools/flats_svg.py --debug      # also print per-page cluster tables
  python3 tools/flats_svg.py --sheet out.png   # also render a contact sheet (needs Playwright chromium)

Requires: python3 (stdlib), poppler's pdftocairo on PATH, node_modules/.bin/svgo. The contact sheet
additionally needs Pillow and the repo's @playwright/test chromium (tools/dev/svg2png.mjs).
"""
import argparse
import copy
import json
import math
import os
import re
import shutil
import subprocess
import tempfile
import xml.etree.ElementTree as ET

ROOT = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
PACKS_DIR = os.path.join(ROOT, "reference", "tech-packs")
OUT_DIR = os.path.join(ROOT, "app", "assets", "flats")
PRODUCTS_DIR = os.path.join(ROOT, "content", "products")
SVGO = os.path.join(ROOT, "node_modules", ".bin", "svgo")
SVGO_CONFIG = os.path.join(ROOT, "tools", "svgo.config.mjs")
SVG2PNG = os.path.join(ROOT, "tools", "dev", "svg2png.mjs")

SVG_NS = "http://www.w3.org/2000/svg"
XLINK_NS = "http://www.w3.org/1999/xlink"
NS = "{%s}" % SVG_NS
HREF = "{%s}href" % XLINK_NS
ET.register_namespace("", SVG_NS)
ET.register_namespace("xlink", XLINK_NS)

# One entry per product handle. `page` is the 1-based PDF page the flats come from.
# `bands` is (top, bottom) in PDF points: header above `top` and footer below `bottom` are ignored.
PACKS = {
    "thermal-long-sleeve": {
        "pdf": "AC-LST-001_Tech.Pack_6-15-25.pdf",
        "page": 1,
        "bands": (70, 575),
    },
    "pincord-button-down": {
        "pdf": "AC-LSS-001_Tech.Pack_Pincord_REV1_10-15-26.pdf",
        "page": 5,  # the cover is a coloured, textured render; page 5 is the line drawing
        "bands": (70, 575),
    },
    "needlecord-shirt": {
        "pdf": "AC-LSS-001_Tech.Pack_Needlecord_REV1_10-15-26.pdf",
        "page": 1,
        "bands": (70, 575),
    },
    "drawstring-pant": {
        "pdf": "AC-PNT-001_Tech.Pack_REV0_10-15-26_1.pdf",
        "page": 1,
        "bands": (70, 575),
    },
}
ID_PREFIX = {"thermal-long-sleeve": "tls", "pincord-button-down": "pbd", "needlecord-shirt": "ncs", "drawstring-pant": "dsp"}

MARGIN = 4.0          # PDF points around each flat
CLUSTER_GAP = 10.0    # elements closer than this (points) belong to the same flat
PAGE_W, PAGE_H = 792.0, 612.0

# Hotspot anchors, as % of each flat's viewBox, by handle -> builtLikeThis[] index.
# Placed by eye on the rendered flats (see --sheet). `detail` and `inside` hotspots sit on the
# view where that part is visible.
ANCHORS = {
    "thermal-long-sleeve": {
        0: {"view": "back", "x": 50, "y": 12},     # L3: embroidery box, centre back below the neckband
        1: {"view": "front", "x": 50, "y": 6},     # RIB: neckband at centre front (cuffs are the same rib)
        2: {"view": "back", "x": 32, "y": 20},     # YOKE: on the yoke seam, upper back
        3: {"view": "back", "x": 50, "y": 3},      # L1: centre back neckband (label sits inside it)
        4: {"view": "front", "x": 50, "y": 96},    # HEM: bottom hem, centre front
    },
    "pincord-button-down": {
        0: {"view": "back", "x": 50, "y": 13},     # L3: embroidery box on the back yoke
        1: {"view": "front", "x": 50, "y": 89},    # L4: placket tag above the hem
        2: {"view": "front", "x": 93, "y": 72},    # CUFF: cut cuff (viewer's right)
        3: {"view": "front", "x": 61, "y": 39},    # POCKET: wearer's left chest pocket (mirrored)
        4: {"view": "back", "x": 50, "y": 25},     # PLEAT: box pleat + loop below the yoke
    },
    "needlecord-shirt": {
        0: {"view": "front", "x": 50, "y": 89},    # L3: placket tag above the hem
        1: {"view": "back", "x": 85, "y": 45},     # SLEEVE: one-piece sleeve, mid sleeve
        2: {"view": "front", "x": 92, "y": 82},    # CUFF: barrel cuff (viewer's right)
        3: {"view": "front", "x": 61, "y": 38},    # POCKET: wearer's left chest pocket
        4: {"view": "front", "x": 33, "y": 60},    # WALE: the cloth, on the body panel
    },
    "drawstring-pant": {
        0: {"view": "back", "x": 72, "y": 12.5},   # L3: patch on the wearer's right back pocket
        1: {"view": "front", "x": 80, "y": 97},    # L3: patch on the wearer's left cuff (viewer's right)
        2: {"view": "front", "x": 50, "y": 2.5},   # T1/T2: eyelets + drawstring at centre front
        3: {"view": "front", "x": 25, "y": 97},    # CUFF: turn-up cuff (viewer's left leg)
        4: {"view": "front", "x": 53, "y": 12},    # FLY: faux fly J-stitch at centre front
    },
}


# ----------------------------------------------------------------------------------------------
# Geometry helpers
# ----------------------------------------------------------------------------------------------
IDENTITY = (1.0, 0.0, 0.0, 1.0, 0.0, 0.0)
NUM = re.compile(r"[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?")


def mat_mul(a, b):
    """Matrix product a*b in SVG convention: b is applied first, then a."""
    a0, a1, a2, a3, a4, a5 = a
    b0, b1, b2, b3, b4, b5 = b
    return (
        a0 * b0 + a2 * b1,
        a1 * b0 + a3 * b1,
        a0 * b2 + a2 * b3,
        a1 * b2 + a3 * b3,
        a0 * b4 + a2 * b5 + a4,
        a1 * b4 + a3 * b5 + a5,
    )


def mat_apply(m, x, y):
    return (m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5])


def mat_scale(m):
    """Mean scale factor of the matrix (for stroke widths)."""
    return math.sqrt(abs(m[0] * m[3] - m[1] * m[2])) or 1.0


def parse_transform(s):
    m = IDENTITY
    if not s:
        return m
    for name, args in re.findall(r"(matrix|translate|scale|rotate|skewX|skewY)\s*\(([^)]*)\)", s):
        v = [float(x) for x in NUM.findall(args)]
        if name == "matrix" and len(v) == 6:
            t = tuple(v)
        elif name == "translate":
            t = (1, 0, 0, 1, v[0], v[1] if len(v) > 1 else 0.0)
        elif name == "scale":
            t = (v[0], 0, 0, v[1] if len(v) > 1 else v[0], 0, 0)
        elif name == "rotate":
            a = math.radians(v[0])
            r = (math.cos(a), math.sin(a), -math.sin(a), math.cos(a), 0, 0)
            if len(v) == 3:
                t = mat_mul(mat_mul((1, 0, 0, 1, v[1], v[2]), r), (1, 0, 0, 1, -v[1], -v[2]))
            else:
                t = r
        elif name == "skewX":
            t = (1, 0, math.tan(math.radians(v[0])), 1, 0, 0)
        else:
            t = (1, math.tan(math.radians(v[0])), 0, 1, 0, 0)
        m = mat_mul(m, t)
    return m


def path_points(d):
    """Every coordinate a path touches (end points and control points), absolute, in user units."""
    pts = []
    cx = cy = 0.0
    sx = sy = 0.0
    cmd = None
    tokens = re.findall(r"[MmLlHhVvCcSsQqTtAaZz]|" + NUM.pattern, d)
    i = 0
    nargs = {"M": 2, "L": 2, "H": 1, "V": 1, "C": 6, "S": 4, "Q": 4, "T": 2, "A": 7, "Z": 0}
    while i < len(tokens):
        t = tokens[i]
        if t.isalpha():
            cmd = t
            i += 1
            if cmd in "Zz":
                cx, cy = sx, sy
                continue
        if cmd is None:
            i += 1
            continue
        n = nargs[cmd.upper()]
        vals = [float(x) for x in tokens[i:i + n]]
        if len(vals) < n:
            break
        i += n
        rel = cmd.islower()
        u = cmd.upper()
        if u == "H":
            cx = cx + vals[0] if rel else vals[0]
            pts.append((cx, cy))
        elif u == "V":
            cy = cy + vals[0] if rel else vals[0]
            pts.append((cx, cy))
        elif u == "A":
            x, y = vals[5], vals[6]
            if rel:
                x, y = cx + x, cy + y
            pts.append((cx, cy))
            pts.append((x, y))
            cx, cy = x, y
        else:
            for k in range(0, n, 2):
                x, y = vals[k], vals[k + 1]
                if rel:
                    x, y = cx + x, cy + y
                pts.append((x, y))
            cx, cy = pts[-1]
            if u == "M":
                sx, sy = cx, cy
                cmd = "l" if rel else "L"  # implicit lineto after moveto
    return pts


def bbox_of_points(pts):
    xs = [p[0] for p in pts]
    ys = [p[1] for p in pts]
    return (min(xs), min(ys), max(xs), max(ys))


def bbox_union(a, b):
    if a is None:
        return b
    if b is None:
        return a
    return (min(a[0], b[0]), min(a[1], b[1]), max(a[2], b[2]), max(a[3], b[3]))


def bbox_intersect(a, b):
    return (max(a[0], b[0]), max(a[1], b[1]), min(a[2], b[2]), min(a[3], b[3]))


def bbox_gap(a, b):
    """Distance between two boxes (0 when they overlap)."""
    dx = max(0.0, max(a[0], b[0]) - min(a[2], b[2]))
    dy = max(0.0, max(a[1], b[1]) - min(a[3], b[3]))
    return math.hypot(dx, dy)


def element_local_bbox(el):
    tag = el.tag.replace(NS, "")
    if tag == "path":
        pts = path_points(el.get("d", ""))
        return bbox_of_points(pts) if pts else None
    if tag == "rect":
        x, y = float(el.get("x", 0)), float(el.get("y", 0))
        w, h = float(el.get("width", 0)), float(el.get("height", 0))
        return (x, y, x + w, y + h)
    if tag in ("circle", "ellipse"):
        cx, cy = float(el.get("cx", 0)), float(el.get("cy", 0))
        rx = float(el.get("rx", el.get("r", 0)))
        ry = float(el.get("ry", el.get("r", 0)))
        return (cx - rx, cy - ry, cx + rx, cy + ry)
    if tag == "line":
        return bbox_of_points([(float(el.get("x1", 0)), float(el.get("y1", 0))),
                               (float(el.get("x2", 0)), float(el.get("y2", 0)))])
    if tag in ("polygon", "polyline"):
        v = [float(x) for x in NUM.findall(el.get("points", ""))]
        return bbox_of_points(list(zip(v[0::2], v[1::2]))) if len(v) >= 2 else None
    return None


def transform_bbox(b, m):
    if b is None:
        return None
    corners = [mat_apply(m, b[0], b[1]), mat_apply(m, b[2], b[1]), mat_apply(m, b[0], b[3]), mat_apply(m, b[2], b[3])]
    return bbox_of_points(corners)


# ----------------------------------------------------------------------------------------------
# Colour helpers
# ----------------------------------------------------------------------------------------------
def parse_color(s):
    """'rgb(12.9%, 18.8%, 35.7%)' | '#rrggbb' | 'none' -> (r, g, b) in 0..1, or None for none."""
    if s is None:
        return None
    s = s.strip()
    if s in ("none", "transparent"):
        return None
    m = re.match(r"rgb\(\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*\)", s)
    if m:
        v = [float(x) for x in m.groups()]
        if "%" in s:
            return tuple(x / 100.0 for x in v)
        return tuple(x / 255.0 for x in v)
    m = re.match(r"#([0-9a-fA-F]{6})$", s)
    if m:
        h = m.group(1)
        return tuple(int(h[i:i + 2], 16) / 255.0 for i in (0, 2, 4))
    m = re.match(r"#([0-9a-fA-F]{3})$", s)
    if m:
        h = m.group(1)
        return tuple(int(c * 2, 16) / 255.0 for c in h)
    if s == "black":
        return (0.0, 0.0, 0.0)
    if s == "white":
        return (1.0, 1.0, 1.0)
    return (0.0, 0.0, 0.0)


def luminance(rgb):
    return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2]


def is_red(rgb):
    """Callout red (leader lines, arrowheads, revision marks)."""
    return rgb is not None and rgb[0] > 0.6 and rgb[1] < 0.4 and rgb[2] < 0.4


# ----------------------------------------------------------------------------------------------
# Step 1: pdftocairo, then resolve <use>, masks and filters into a plain tree
# ----------------------------------------------------------------------------------------------
def pdf_page_to_svg(pdf, page, out_svg):
    subprocess.run(["pdftocairo", "-svg", "-f", str(page), "-l", str(page), pdf, out_svg], check=True)


PRESENTATION = ("fill", "fill-opacity", "fill-rule", "stroke", "stroke-width", "stroke-opacity",
                "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-dasharray",
                "stroke-dashoffset", "opacity", "clip-rule")


class Flattener:
    """Walks a pdftocairo SVG and emits a tree of <g>/<path>/<rect> with no use/mask/filter."""

    def __init__(self, root):
        self.root = root
        self.byid = {e.get("id"): e for e in root.iter() if e.get("id")}
        self.defs = root.find(NS + "defs")
        self.dropped_text = 0
        self.warnings = []

    def ref(self, url):
        m = re.match(r"url\(#([^)]+)\)", url or "")
        return self.byid.get(m.group(1)) if m else None

    def href(self, el):
        h = el.get(HREF) or el.get("href") or ""
        return self.byid.get(h[1:]) if h.startswith("#") else None

    def mask_opacity(self, mask_el):
        """Uniform opacity of a mask made only of full-page rects (None when it holds shapes)."""

        def walk(el, remove_color):
            # returns (luminance, alpha) of the element's composite, or None when non-uniform
            tag = el.tag.replace(NS, "")
            if tag == "rect":
                w, h = float(el.get("width", 0)), float(el.get("height", 0))
                if w < PAGE_W or h < PAGE_H:
                    return None
                rgb = parse_color(el.get("fill", "black")) or (0.0, 0.0, 0.0)
                return (1.0 if remove_color else luminance(rgb), float(el.get("fill-opacity", 1)))
            if tag == "use":
                target = self.href(el)
                return walk(target, remove_color) if target is not None else None
            if tag in ("g", "mask"):
                rc = remove_color or "remove-color" in (el.get("filter") or "")
                L, A = 0.0, 0.0
                for c in el:
                    r = walk(c, rc)
                    if r is None:
                        return None
                    l, a = r
                    A2 = a + A * (1 - a)
                    L = (l * a + L * A * (1 - a)) / A2 if A2 > 0 else 0.0
                    A = A2
                sub = self.ref(el.get("mask"))
                if sub is not None:
                    inner = self.mask_opacity(sub)
                    if inner is None:
                        return None
                    A *= inner
                return (L, A)
            return None

        r = walk(mask_el, False)
        return None if r is None else r[0] * r[1]

    def flatten(self):
        out = ET.Element(NS + "g")
        for child in self.root:
            if child is self.defs:
                continue
            self.emit(child, out, 1.0)
        return out

    def emit(self, el, parent, opacity):
        tag = el.tag.replace(NS, "")
        if tag in ("defs", "title", "desc", "metadata", "style", "image", "text", "font", "filter",
                   "mask", "clipPath", "symbol", "linearGradient", "radialGradient", "pattern"):
            if tag == "image":
                self.warnings.append("embedded raster image dropped")
            return
        if tag == "use":
            target = self.href(el)
            if target is None:
                return
            if (target.get("id") or "").startswith("glyph"):
                self.dropped_text += 1
                return
            g = ET.SubElement(parent, NS + "g")
            t = el.get("transform", "")
            x, y = el.get("x"), el.get("y")
            if x or y:
                t = (t + " translate(%s,%s)" % (x or 0, y or 0)).strip()
            if t:
                g.set("transform", t)
            self.copy_presentation(el, g)
            self.emit_children_or_self(target, g, opacity)
            return
        if tag == "g":
            g = ET.SubElement(parent, NS + "g")
            if el.get("transform"):
                g.set("transform", el.get("transform"))
            if el.get("clip-path"):
                g.set("clip-path", el.get("clip-path"))
            self.copy_presentation(el, g)
            mask = self.ref(el.get("mask"))
            if mask is not None:
                o = self.mask_opacity(mask)
                if o is None:
                    self.warnings.append("non-uniform mask %s ignored" % el.get("mask"))
                    o = 1.0
                if o < 0.999:
                    g.set("opacity", "%.3g" % (float(g.get("opacity", 1)) * o))
            filt = self.ref(el.get("filter"))
            if filt is not None:
                if "remove-color" in filt.get("id", ""):
                    pass
                else:
                    # a compositing filter: draw the backdrop (in2) then the source (in)
                    images = {fe.get("result"): self.href(fe) for fe in filt if fe.tag == NS + "feImage"}
                    order = []
                    for fe in filt:
                        if fe.tag in (NS + "feBlend", NS + "feComposite"):
                            order = [fe.get("in2"), fe.get("in")]
                    if not order:
                        order = list(images.keys())
                    for name in order:
                        target = images.get(name)
                        if target is not None:
                            self.emit_children_or_self(target, g, opacity)
                    return
            for c in el:
                self.emit(c, g, opacity)
            return
        if tag in ("path", "rect", "circle", "ellipse", "line", "polygon", "polyline"):
            if tag == "rect":
                w, h = float(el.get("width", 0)), float(el.get("height", 0))
                if w >= PAGE_W and h >= PAGE_H:
                    return  # filter placeholder / page background
            parent.append(copy.deepcopy(el))
            return
        # unknown: copy children
        for c in el:
            self.emit(c, parent, opacity)

    def emit_children_or_self(self, target, g, opacity):
        # the target keeps its own attributes (clip-path, transform, fill) on its wrapper
        self.emit(target, g, opacity)

    @staticmethod
    def copy_presentation(src, dst):
        for k in PRESENTATION:
            if src.get(k) is not None:
                dst.set(k, src.get(k))


# ----------------------------------------------------------------------------------------------
# Step 2: measure every drawable in page space
# ----------------------------------------------------------------------------------------------
class Item:
    __slots__ = ("el", "bbox", "tag", "fill", "stroke", "stroke_w", "clip_bbox", "opacity", "chain", "matrix",
                 "needs_clip")

    def __init__(self, el, bbox, tag, fill, stroke, stroke_w, clip_bbox, opacity, chain, matrix, needs_clip):
        self.el, self.bbox, self.tag = el, bbox, tag
        self.fill, self.stroke, self.stroke_w = fill, stroke, stroke_w
        self.clip_bbox, self.opacity, self.chain, self.matrix = clip_bbox, opacity, chain, matrix
        self.needs_clip = needs_clip  # False when the shape already lies inside its clip

    def key(self):
        """Identity of the drawn shape: geometry, placement and colour (for de-duplication)."""
        geo = tuple(sorted((k, v) for k, v in self.el.attrib.items() if k not in PRESENTATION))
        return (self.tag, geo, tuple(round(v, 3) for v in self.matrix), self.fill, self.stroke,
                round(self.stroke_w, 3), self.clip_bbox and tuple(round(v, 2) for v in self.clip_bbox))


def measure(tree, byid):
    """Yield Item for each shape: bbox in page points (incl. stroke, cut to clip), effective style."""
    items = []

    def clip_bbox_of(url, m):
        cp = byid.get((re.match(r"url\(#([^)]+)\)", url or "") or [None, None])[1]) if url else None
        if cp is None:
            return None
        b = None
        for c in cp:
            b = bbox_union(b, transform_bbox(element_local_bbox(c), m))
        return b

    def walk(el, m, style, clip, opacity, chain):
        tag = el.tag.replace(NS, "")
        m2 = mat_mul(m, parse_transform(el.get("transform"))) if el.get("transform") else m
        style2 = dict(style)
        for k in PRESENTATION:
            if el.get(k) is not None and k != "opacity":
                style2[k] = el.get(k)
        op = opacity * float(el.get("opacity", 1))
        clip2 = clip
        if el.get("clip-path"):
            cb = clip_bbox_of(el.get("clip-path"), m2)
            if cb is not None:
                clip2 = cb if clip2 is None else bbox_intersect(clip2, cb)
        if tag == "g":
            for c in el:
                walk(c, m2, style2, clip2, op, chain + [el])
            return
        lb = element_local_bbox(el)
        if lb is None:
            return
        b = transform_bbox(lb, m2)
        fill = parse_color(style2.get("fill", "black"))
        stroke = parse_color(style2.get("stroke", "none"))
        sw = float(style2.get("stroke-width", 1)) * mat_scale(m2) if stroke is not None else 0.0
        if sw:
            b = (b[0] - sw / 2, b[1] - sw / 2, b[2] + sw / 2, b[3] + sw / 2)
        needs_clip = False
        if clip2 is not None:
            tol = 0.05
            needs_clip = not (b[0] >= clip2[0] - tol and b[1] >= clip2[1] - tol
                              and b[2] <= clip2[2] + tol and b[3] <= clip2[3] + tol)
            b = bbox_intersect(b, clip2)
            if b[2] <= b[0] or b[3] <= b[1]:
                return  # fully clipped away
        items.append(Item(el, b, tag, fill, stroke, sw, clip2, op, chain + [el], m2, needs_clip))

    walk(tree, IDENTITY, {}, None, 1.0, [])
    return items


def cluster(items, gap):
    """Greedy union of bounding boxes closer than `gap`. Returns list of (bbox, [items])."""
    parent = list(range(len(items)))

    def find(i):
        while parent[i] != i:
            parent[i] = parent[parent[i]]
            i = parent[i]
        return i

    boxes = [it.bbox for it in items]
    # sort by x to limit comparisons
    order = sorted(range(len(items)), key=lambda i: boxes[i][0])
    for a in range(len(order)):
        i = order[a]
        for b in range(a + 1, len(order)):
            j = order[b]
            if boxes[j][0] - boxes[i][2] > gap:
                break
            if bbox_gap(boxes[i], boxes[j]) <= gap:
                parent[find(i)] = find(j)
    groups = {}
    for i in range(len(items)):
        groups.setdefault(find(i), []).append(items[i])
    out = []
    for members in groups.values():
        b = None
        for it in members:
            b = bbox_union(b, it.bbox)
        out.append((b, members))
    out.sort(key=lambda g: -((g[0][2] - g[0][0]) * (g[0][3] - g[0][1])))
    return out


# ----------------------------------------------------------------------------------------------
# Step 3: restyle and write one flat
# ----------------------------------------------------------------------------------------------
def ink_opacity(rgb, opacity):
    """Map a paint colour onto currentColor: dark -> solid, mid grey -> a tint, near-white -> None."""
    lum = luminance(rgb)
    if lum >= 0.9:
        return None
    if lum >= 0.45:
        opacity *= (1.0 - lum)  # mid grey: a tint of the ink, not a solid
    return opacity


HEAVY_MARK = 300   # path-data length above which a fill-only shape counts as "heavy"
SMALL_MARK = 8.0   # points: a heavy mark no bigger than this can be a brush stitch
NOISE_MARK = 1.6   # points: heavy marks this small are stitch texture (satin dots) and are dropped
REPEAT_MARK = 6    # a heavy small mark drawn this many times is a brush, not a detail
BRUSH_COMMANDS = 40  # a heavy small mark with this many path commands is a thread illustration
DASH_WIDTH = (0.4, 0.9)  # points: dash stroke width is the mark's minor extent, clamped to this


def principal_axis(pts):
    """Mean, unit major axis and (major, minor) extents of a point cloud (2-D PCA)."""
    n = float(len(pts))
    mx = sum(p[0] for p in pts) / n
    my = sum(p[1] for p in pts) / n
    sxx = sum((p[0] - mx) ** 2 for p in pts) / n
    syy = sum((p[1] - my) ** 2 for p in pts) / n
    sxy = sum((p[0] - mx) * (p[1] - my) for p in pts) / n
    theta = 0.5 * math.atan2(2 * sxy, sxx - syy)
    ux, uy = math.cos(theta), math.sin(theta)
    pu = [(p[0] - mx) * ux + (p[1] - my) * uy for p in pts]
    pv = [-(p[0] - mx) * uy + (p[1] - my) * ux for p in pts]
    return (mx, my), (ux, uy), (min(pu), max(pu)), (min(pv), max(pv))


def analyze_marks(items):
    """Find the brush marks among the items.

    The packs draw stitching with Illustrator brushes: every overlock loop is a 2-3 KB thread
    illustration 4 x 6 pt across, repeated hundreds of times along the seams, and the embroidery
    carries hundreds of sub-point satin dots on top of solid letters. At any size the site shows a
    flat those read as a dashed line or as nothing, so that is what they become. A heavy small shape
    is a brush mark when it is painted semi-transparent (thread over cloth), when it is drawn with
    40+ path commands (a letter on a woven label has 10-20, a button fewer) or when the same drawing
    repeats; anything else keeps its exact geometry.

    Returns {id(item): "drop" | (center, axis, (u0, u1), (v0, v1))} for the marks to change."""
    cand = {}
    signatures = {}
    for it in items:
        if it.tag != "path":
            continue
        dark_fill = it.fill is not None and luminance(it.fill) < 0.9
        dark_stroke = it.stroke is not None and luminance(it.stroke) < 0.9
        if not (dark_fill or dark_stroke):
            continue
        d = it.el.get("d", "")
        if len(d) <= HEAVY_MARK:
            continue
        pts = path_points(d)
        if len(pts) < 3:
            continue
        scale = mat_scale(it.matrix)
        center, axis, (u0, u1), (v0, v1) = principal_axis(pts)
        major, minor = (u1 - u0) * scale, (v1 - v0) * scale
        if max(major, minor) > SMALL_MARK:
            continue
        # the same brush glyph, wherever it sits and however it is rotated, has the same command
        # sequence; two different letters never do
        sig = re.sub(r"[^A-Za-z]", "", d)
        cand[id(it)] = (sig, major, minor, (center, axis, (u0, u1), (v0, v1)), it.opacity)
        signatures[sig] = signatures.get(sig, 0) + 1
    out = {}
    for key, (sig, major, minor, pca, opacity) in cand.items():
        if major <= NOISE_MARK and minor <= NOISE_MARK:
            out[key] = "drop"
        elif opacity < 0.999 or len(sig) >= BRUSH_COMMANDS or signatures[sig] >= REPEAT_MARK:
            out[key] = pca
    return out


def dash_for(shape, style, item, pca):
    """Turn a brush mark into a straight dash along its principal axis (same group, same units)."""
    scale = mat_scale(item.matrix)
    (mx, my), (ux, uy), (u0, u1), (v0, v1) = pca
    w = min(max((v1 - v0) * scale, DASH_WIDTH[0]), DASH_WIDTH[1]) / scale
    mid = (u0 + u1) / 2
    half = max((u1 - u0) / 2 - w / 2, 0.05)
    x1, y1 = mx + ux * (mid - half), my + uy * (mid - half)
    x2, y2 = mx + ux * (mid + half), my + uy * (mid + half)
    shape.set("d", "M%s %sL%s %s" % (fmt(x1), fmt(y1), fmt(x2), fmt(y2)))
    if item.stroke is None or luminance(item.stroke) >= 0.9:
        style["stroke"] = style.get("fill", "black")
        style["stroke-opacity"] = style.get("fill-opacity", "1")
    style["stroke-width"] = fmt(w)
    style["stroke-linecap"] = "round"
    style["fill"] = "none"
    style.pop("fill-opacity", None)
    for k in ("stroke-dasharray", "stroke-dashoffset", "stroke-linejoin", "stroke-miterlimit"):
        style.pop(k, None)


def restyle(el, style):
    """Rewrite colours on one shape. Returns False when the shape has nothing left to draw."""
    fill = parse_color(style.get("fill", "black"))
    stroke = parse_color(style.get("stroke", "none"))
    if is_red(fill) or is_red(stroke):
        return False
    for k in PRESENTATION:
        if k in el.attrib:
            del el.attrib[k]
    drawn = False
    so = None if stroke is None else ink_opacity(stroke, float(style.get("stroke-opacity", 1)))
    if so is not None:
        el.set("stroke", "currentColor")
        el.set("stroke-width", style.get("stroke-width", "1"))
        for k in ("stroke-linecap", "stroke-linejoin", "stroke-dasharray", "stroke-dashoffset", "stroke-miterlimit"):
            if style.get(k) and not (k == "stroke-miterlimit" and style.get(k) in ("4", "10")):
                el.set(k, style[k])
        if so < 0.999:
            el.set("stroke-opacity", "%.2g" % so)
        drawn = True
    fo = None if fill is None else ink_opacity(fill, float(style.get("fill-opacity", 1)))
    if fo is None:
        el.set("fill", "none")
    else:
        el.set("fill", "currentColor")
        if fo < 0.999:
            el.set("fill-opacity", "%.2g" % fo)
        if style.get("fill-rule") == "evenodd":
            el.set("fill-rule", "evenodd")
        drawn = True
    return drawn


def effective_style(chain):
    style = {}
    for el in chain:
        for k in PRESENTATION:
            if el.get(k) is not None and k != "opacity":
                style[k] = el.get(k)
    return style


def build_flat(items, byid, view_box, prefix):
    """Rebuild a minimal tree with just these items, keeping transforms and clip paths."""
    svg = ET.Element(NS + "svg", {"xmlns": SVG_NS})
    x0, y0, x1, y1 = view_box
    svg.set("viewBox", "%s %s %s %s" % (fmt(x0), fmt(y0), fmt(x1 - x0), fmt(y1 - y0)))
    svg.set("fill", "none")
    svg.set("stroke", "none")
    defs = ET.SubElement(svg, NS + "defs")
    body = ET.SubElement(svg, NS + "g")
    used_clips = {}

    # Re-create the group chain for each item, but only the attributes that matter for geometry
    # (transform, clip-path, opacity); colours are resolved onto the shape itself.
    cache = {}

    def group_for(chain, with_clips):
        key = (tuple(id(e) for e in chain), with_clips)
        if key in cache:
            return cache[key]
        if not chain:
            return body
        parent = group_for(chain[:-1], with_clips)
        el = chain[-1]
        attrs = {}
        if el.get("transform"):
            attrs["transform"] = el.get("transform")
        if el.get("clip-path") and with_clips:
            m = re.match(r"url\(#([^)]+)\)", el.get("clip-path"))
            cid = m.group(1)
            new_id = used_clips.get(cid)
            if new_id is None:
                new_id = "%s-c%d" % (prefix, len(used_clips))
                used_clips[cid] = new_id
                cp = copy.deepcopy(byid[cid])
                cp.set("id", new_id)
                for c in cp:
                    for k in list(c.attrib):
                        if k not in ("d", "x", "y", "width", "height", "transform", "clip-rule"):
                            del c.attrib[k]
                defs.append(cp)
            attrs["clip-path"] = "url(#%s)" % new_id
        if float(el.get("opacity", 1)) < 0.999:
            attrs["opacity"] = el.get("opacity")
        if not attrs:
            cache[key] = parent
            return parent
        g = ET.SubElement(parent, NS + "g", attrs)
        cache[key] = g
        return g

    kept = 0
    stats = {"dashes": 0, "dropped": 0}
    marks = analyze_marks(items)
    for it in items:
        style = effective_style(it.chain)
        shape = copy.deepcopy(it.el)
        mark = marks.get(id(it))
        if mark == "drop":
            stats["dropped"] += 1
            continue
        if mark is not None:
            dash_for(shape, style, it, mark)
            stats["dashes"] += 1
        if not restyle(shape, style):
            continue
        for k in list(shape.attrib):
            if k not in ("d", "x", "y", "width", "height", "cx", "cy", "r", "rx", "ry", "x1", "y1", "x2", "y2",
                         "points", "transform") and k not in PRESENTATION:
                del shape.attrib[k]
        group_for(it.chain[:-1], it.needs_clip).append(shape)
        kept += 1
    if not len(defs):
        svg.remove(defs)
    return svg, kept, stats


def fmt(v):
    s = ("%.2f" % v).rstrip("0").rstrip(".")
    return s if s not in ("", "-0") else "0"


def svgo(path):
    if not os.path.exists(SVGO):
        print("  svgo not installed; skipping optimization for", os.path.basename(path))
        return
    subprocess.run([SVGO, "--multipass", "-p", "2", "--quiet", path, "--config", SVGO_CONFIG], check=True)


def prefix_ids(path, prefix):
    """svgo minifies ids to a, b, c...; give them a per-file prefix so flats can be inlined together
    (and so no id ever looks like a hex colour to tools/check_brand.py)."""
    with open(path, encoding="utf-8") as f:
        s = f.read()
    ids = re.findall(r'\bid="([^"]+)"', s)
    for i in ids:
        if i.startswith(prefix + "-"):
            continue
        new = "%s-%s" % (prefix, i)
        s = re.sub(r'\bid="%s"' % re.escape(i), 'id="%s"' % new, s)
        s = re.sub(r'url\(#%s\)' % re.escape(i), "url(#%s)" % new, s)
        s = re.sub(r'href="#%s"' % re.escape(i), 'href="#%s"' % new, s)
    with open(path, "w", encoding="utf-8") as f:
        f.write(s if s.endswith("\n") else s + "\n")


HEX = re.compile(r"(?<![\w&])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b")


def verify(path):
    with open(path, encoding="utf-8") as f:
        s = f.read()
    problems = []
    if HEX.search(s):
        problems.append("hex colour")
    for bad in ("<image", "<text", "<font", "@font-face", "<use", "<mask", "<filter", "rgb("):
        if bad in s:
            problems.append(bad)
    return problems


# ----------------------------------------------------------------------------------------------
# Pipeline
# ----------------------------------------------------------------------------------------------
def extract_pack(handle, spec, work, debug=False):
    pdf = os.path.join(PACKS_DIR, spec["pdf"])
    raw = os.path.join(work, "%s-p%d.svg" % (handle, spec["page"]))
    pdf_page_to_svg(pdf, spec["page"], raw)
    root = ET.parse(raw).getroot()
    fl = Flattener(root)
    tree = fl.flatten()
    items = measure(tree, fl.byid)

    top, bottom = spec["bands"]
    body = []
    seen = set()
    for it in items:
        k = it.key()
        if k in seen:
            continue  # the same shape drawn twice by a compositing filter
        seen.add(k)
        cx = (it.bbox[0] + it.bbox[2]) / 2
        cy = (it.bbox[1] + it.bbox[3]) / 2
        if cy < top or cy > bottom:
            continue  # header / footer furniture
        if is_red(it.fill) or is_red(it.stroke):
            continue  # callout leaders and arrowheads
        if (it.bbox[2] - it.bbox[0]) > PAGE_W * 0.8:
            continue  # rules spanning the page
        if it.opacity < 0.2:
            continue  # 10% "shine" shading streaks: rendering, not construction
        body.append(it)
    groups = cluster(body, CLUSTER_GAP)
    if debug:
        print("  %s: %d shapes after flatten, %d text runs dropped, %d candidates" % (handle, len(items), fl.dropped_text, len(body)))
        for w in sorted(set(fl.warnings)):
            print("    warning:", w)
        for b, members in groups[:8]:
            print("    cluster  x %6.1f..%6.1f  y %6.1f..%6.1f  n=%d" % (b[0], b[2], b[1], b[3], len(members)))
    if len(groups) < 2:
        raise SystemExit("%s: expected two flats, found %d clusters" % (handle, len(groups)))
    two = sorted(groups[:2], key=lambda g: g[0][0])  # left = front, right = back
    flats = {}
    for view, (b, members) in zip(("front", "back"), two):
        vb = (b[0] - MARGIN, b[1] - MARGIN, b[2] + MARGIN, b[3] + MARGIN)
        prefix = "%s-%s" % (ID_PREFIX[handle], view[0])
        svg, kept, stats = build_flat(members, fl.byid, vb, prefix)
        out = os.path.join(OUT_DIR, "%s-%s.svg" % (handle, view))
        ET.ElementTree(svg).write(out, encoding="unicode", xml_declaration=False)
        svgo(out)
        prefix_ids(out, prefix)
        problems = verify(out)
        if problems:
            raise SystemExit("%s: output still contains %s" % (out, ", ".join(problems)))
        flats[view] = {"file": os.path.basename(out), "viewBox": svg.get("viewBox")}
        size = os.path.getsize(out)
        print("  %-20s %-5s p%d  viewBox %-26s %4d shapes (%d marks -> dashes, %d texture dots dropped)  %6.1f KB"
              % (handle, view, spec["page"], svg.get("viewBox"), kept, stats["dashes"], stats["dropped"], size / 1024))
    return flats


def write_anchors():
    """Cross-check ANCHORS against content/products/*.json and write anchors.json."""
    out = {}
    for handle in PACKS:
        with open(os.path.join(PRODUCTS_DIR, handle + ".json"), encoding="utf-8") as f:
            product = json.load(f)
        hotspots = product.get("builtLikeThis", [])
        table = ANCHORS.get(handle, {})
        entry = {}
        for i, h in enumerate(hotspots):
            a = table.get(i)
            if a is None:
                print("  warning: no anchor for %s builtLikeThis[%d] (%s)" % (handle, i, h.get("code")))
                continue
            entry[str(i)] = {"code": h.get("code"), "label": h.get("label"), "view": a["view"],
                             "x": a["x"], "y": a["y"]}
        out[handle] = entry
    path = os.path.join(OUT_DIR, "anchors.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2)
        f.write("\n")
    return out


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--debug", action="store_true", help="print cluster tables per page")
    ap.add_argument("--sheet", metavar="PNG", help="also render a contact sheet of all flats with anchors")
    ap.add_argument("--only", metavar="HANDLE", help="process one pack only")
    args = ap.parse_args()

    if shutil.which("pdftocairo") is None:
        raise SystemExit("pdftocairo (poppler-utils) is required")
    os.makedirs(OUT_DIR, exist_ok=True)
    index = {}
    with tempfile.TemporaryDirectory() as work:
        for handle, spec in PACKS.items():
            if args.only and handle != args.only:
                continue
            index[handle] = extract_pack(handle, spec, work, debug=args.debug)
    if not args.only:
        with open(os.path.join(OUT_DIR, "index.json"), "w", encoding="utf-8") as f:
            json.dump(index, f, indent=2)
            f.write("\n")
        anchors = write_anchors()
        print("  wrote index.json and anchors.json")
    if args.sheet:
        if args.only:
            raise SystemExit("--sheet needs all four packs (drop --only)")
        contact_sheet(index, anchors, args.sheet)


# ----------------------------------------------------------------------------------------------
# Contact sheet (dev check only): all eight flats in black on white with the anchors marked
# ----------------------------------------------------------------------------------------------
def contact_sheet(index, anchors, out_png, cell_w=360, cell_h=400):
    from PIL import Image, ImageDraw  # Pillow is a dev dependency of the tools, not of the app

    handles = list(index)
    pad, label_h = 16, 22
    sheet = Image.new("RGB", (2 * (cell_w + pad) + pad, len(handles) * (cell_h + label_h + pad) + pad), "white")
    draw = ImageDraw.Draw(sheet)
    with tempfile.TemporaryDirectory() as work:
        for row, handle in enumerate(handles):
            for col, view in enumerate(("front", "back")):
                svg_path = os.path.join(OUT_DIR, index[handle][view]["file"])
                vb = [float(v) for v in index[handle][view]["viewBox"].split()]
                scale = min(cell_w / vb[2], cell_h / vb[3])
                w, h = int(round(vb[2] * scale)), int(round(vb[3] * scale))
                png = os.path.join(work, "%s-%s.png" % (handle, view))
                subprocess.run(["node", SVG2PNG, svg_path, png, str(w), "black", "white"], check=True,
                               stdout=subprocess.DEVNULL)
                im = Image.open(png).convert("RGB")
                if im.size != (w, h):
                    im = im.resize((w, h))
                x0 = pad + col * (cell_w + pad) + (cell_w - w) // 2
                y0 = pad + row * (cell_h + label_h + pad) + label_h
                sheet.paste(im, (x0, y0))
                draw.rectangle([x0 - 1, y0 - 1, x0 + w, y0 + h], outline=(200, 200, 200))
                draw.text((pad + col * (cell_w + pad), y0 - label_h + 4),
                          "%s / %s  %s" % (handle, view, index[handle][view]["viewBox"]), fill=(60, 60, 60))
                for i, a in anchors.get(handle, {}).items():
                    if a["view"] != view:
                        continue
                    ax, ay = x0 + a["x"] / 100.0 * w, y0 + a["y"] / 100.0 * h
                    r = 7
                    draw.ellipse([ax - r, ay - r, ax + r, ay + r], outline=(0, 66, 229), width=2)
                    draw.ellipse([ax - 1.5, ay - 1.5, ax + 1.5, ay + 1.5], fill=(0, 66, 229))
                    draw.text((ax + r + 2, ay - 6), "%s %s" % (i, a["code"]), fill=(0, 66, 229))
    sheet.save(out_png)
    print("  wrote contact sheet", out_png)


if __name__ == "__main__":
    main()
