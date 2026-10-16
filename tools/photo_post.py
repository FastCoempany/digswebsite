"""Post-process generated DIGS photography.

Steps, in order, all driven by a JSON recipe:
  1. color   - pull a garment toward its cloth swatch (Lab shift under a soft color mask)
  1b. recolor - fix small parts the generator got wrong, e.g. buttons that should be
               tone-to-tone ({"recolor": {"circles": [[x, y, r], ...]}}; see recolor_spots)
  2. logos   - composite the real digs artwork where the tech pack places it
               (embroidery, woven tag or woven patch), shaded by the fabric under it
  3. crop    - crop to the slot ratio
Image generators garble lettering, so garments are generated with logo areas blank
and the artwork from brand/logos/ is added here.

Usage:
  python3 tools/photo_post.py recipe.json [more.json ...]

Recipe (pixel coordinates refer to the input image):
{
  "input": "path/to/generated.png",
  "output": "path/to/final.jpg",
  "color": {                         # optional
    "seed": [x0, y0, x1, y1],        # box of plain garment, used to measure its color
    "region": [x0, y0, x1, y1],      # only pixels inside this box can change
    "target": "#5B6FA7",             # cloth swatch from design/tokens (cloth layer)
    "ab_tolerance": 12,              # max a*b* distance from the measured garment color
    "l_range": 30,                   # max L* distance from the measured garment color
    "l_offset": -3                   # aim slightly darker than the flat swatch (studio shading)
  },
  "logos": [                         # optional
    {"kind": "embroidery", "center": [x, y], "width": 45, "rotate": 0,
     "thread": "#24315A"},
    {"kind": "tag", "center": [x, y], "size": [w, h], "ground": "match",
     "thread": "#24315A", "rotate": 90}
  ],
  "crop": {"ratio": "4:5", "anchor": "top"}  # anchor: top, center or bottom
}
"""
import io
import json
import os
import sys

import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
WORDMARK = os.path.join(ROOT, "brand", "logos", "wordmark", "digs-wordmark-black.svg")


# ---------------------------------------------------------------- color space
def _srgb_to_lin(c):
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def _lin_to_srgb(c):
    c = np.clip(c, 0, 1)
    return np.where(c <= 0.0031308, 12.92 * c, 1.055 * np.power(c, 1 / 2.4) - 0.055)


_M = np.array([[0.4124, 0.3576, 0.1805], [0.2126, 0.7152, 0.0722], [0.0193, 0.1192, 0.9505]])
_MI = np.linalg.inv(_M)
_WHITE = np.array([0.95047, 1.0, 1.08883])


def rgb_to_lab(rgb):
    """rgb: float array (..., 3) in 0-1."""
    xyz = _srgb_to_lin(rgb) @ _M.T / _WHITE
    f = np.where(xyz > 0.008856, np.cbrt(xyz), 7.787 * xyz + 16 / 116)
    L = 116 * f[..., 1] - 16
    a = 500 * (f[..., 0] - f[..., 1])
    b = 200 * (f[..., 1] - f[..., 2])
    return np.stack([L, a, b], axis=-1)


def lab_to_rgb(lab):
    fy = (lab[..., 0] + 16) / 116
    fx = fy + lab[..., 1] / 500
    fz = fy - lab[..., 2] / 200
    f = np.stack([fx, fy, fz], axis=-1)
    xyz = np.where(f ** 3 > 0.008856, f ** 3, (f - 16 / 116) / 7.787) * _WHITE
    return _lin_to_srgb(xyz @ _MI.T)


def hex_to_rgb(h):
    h = h.lstrip("#")
    return np.array([int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)])


# ---------------------------------------------------------------- steps
def match_color(img, spec):
    rgb = np.asarray(img, dtype=np.float64) / 255
    lab = rgb_to_lab(rgb)
    x0, y0, x1, y1 = spec["seed"]
    seed = lab[y0:y1, x0:x1].reshape(-1, 3).mean(axis=0)
    target = rgb_to_lab(hex_to_rgb(spec["target"])[None, None, :])[0, 0]
    target[0] += spec.get("l_offset", -3)

    tol = spec.get("ab_tolerance", 12)
    lr = spec.get("l_range", 30)
    d_ab = np.hypot(lab[..., 1] - seed[1], lab[..., 2] - seed[2])
    d_l = np.abs(lab[..., 0] - seed[0])
    soft = np.clip((tol - d_ab) / (tol * 0.35), 0, 1) * np.clip((lr - d_l) / (lr * 0.3), 0, 1)
    region = np.zeros(soft.shape)
    rx0, ry0, rx1, ry1 = spec.get("region", [0, 0, soft.shape[1], soft.shape[0]])
    region[ry0:ry1, rx0:rx1] = 1
    mask = Image.fromarray((soft * region * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(2))
    m = np.asarray(mask, dtype=np.float64)[..., None] / 255

    shifted = lab + (target - seed)
    out = lab_to_rgb(shifted) * m + rgb * (1 - m)
    report = {"measured": "#%02X%02X%02X" % tuple(np.round(lab_to_rgb(seed[None, None, :])[0, 0] * 255).astype(int)),
              "target": spec["target"], "mask_coverage": float(m.mean())}
    return Image.fromarray(np.round(out * 255).astype(np.uint8)), report


def recolor_spots(img, spec):
    """Recolor small parts (buttons, eyelets) that the generator got wrong.

    spec = {"circles": [[x, y, r], ...], "offset_lab": [-10, 0, -6], "ab_tolerance": 10}
    Inside each circle, pixels that differ from the surrounding fabric are moved so their
    average lands at the fabric color plus offset_lab (tone-to-tone by default); shading,
    holes and highlights are kept.
    """
    rgb = np.asarray(img, dtype=np.float64) / 255
    lab = rgb_to_lab(rgb)
    out = lab.copy()
    weight = np.zeros(lab.shape[:2])
    H, W = weight.shape
    yy, xx = np.mgrid[0:H, 0:W]
    tol = spec.get("ab_tolerance", 10)
    offset = np.array(spec.get("offset_lab", [-10, 0, -6]), dtype=np.float64)
    for x, y, r in spec["circles"]:
        dist = np.hypot(xx - x, yy - y)
        ring = (dist > r + 1) & (dist <= r + 4)
        fabric = np.median(lab[ring], axis=0)
        inside = np.clip((r + 1 - dist) / 2, 0, 1)
        d_ab = np.hypot(lab[..., 1] - fabric[1], lab[..., 2] - fabric[2])
        part = np.clip((d_ab - tol * 0.5) / (tol * 0.5), 0, 1) * inside
        if part.sum() < 4:
            continue
        mean = (lab * part[..., None]).sum(axis=(0, 1)) / part.sum()
        shifted = lab + (fabric + offset - mean)
        sel = part > weight
        out[sel] = shifted[sel]
        weight = np.maximum(weight, part)
    m = weight[..., None]
    res = lab_to_rgb(out) * m + rgb * (1 - m)
    return Image.fromarray(np.round(res * 255).astype(np.uint8))


def _wordmark_alpha(width):
    import cairosvg
    png = cairosvg.svg2png(url=WORDMARK, output_width=int(width * 4))  # supersample, then shrink
    im = Image.open(io.BytesIO(png)).convert("RGBA")
    im = im.resize((int(width), max(1, round(im.height * width / im.width))), Image.LANCZOS)
    return im.split()[-1]


SS = 4  # supersampling factor for drawing artwork


def _lighting_map(img, box, size):
    """The fabric's light and shadow under a placement, as a multiplier around 1.0."""
    lum = img.convert("L").crop(box).filter(ImageFilter.GaussianBlur(2)).resize(size, Image.BILINEAR)
    arr = np.asarray(lum, dtype=np.float64)
    return np.clip(arr / max(arr.mean(), 1), 0.8, 1.15)[..., None]


def _fabric_color(img, box, pad=6):
    """Median color of the fabric in a ring around a placement (for dye-to-match grounds)."""
    x0, y0, x1, y1 = box
    arr = np.asarray(img.crop((x0 - pad, y0 - pad, x1 + pad, y1 + pad)), dtype=np.float64)
    ring = np.concatenate([arr[:pad].reshape(-1, 3), arr[-pad:].reshape(-1, 3),
                           arr[:, :pad].reshape(-1, 3), arr[:, -pad:].reshape(-1, 3)])
    return np.median(ring, axis=0) / 255


def _place(img, art, box, shadow_alpha=90, shadow_blur=1.0):
    """Light the artwork with the fabric under it, drop a soft shadow, composite."""
    rgb = np.asarray(art, dtype=np.float64)
    rgb[..., :3] = np.clip(rgb[..., :3] * _lighting_map(img, box, art.size), 0, 255)
    art = Image.fromarray(rgb.astype(np.uint8), "RGBA")
    layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    layer.paste(Image.new("RGBA", art.size, (0, 0, 0, shadow_alpha)), (box[0] + 1, box[1] + 1), art.split()[-1])
    layer = layer.filter(ImageFilter.GaussianBlur(shadow_blur))
    layer.alpha_composite(art, (box[0], box[1]))
    return Image.alpha_composite(img.convert("RGBA"), layer.filter(ImageFilter.GaussianBlur(0.3))).convert("RGB")


def composite_logo(img, spec):
    img = img.convert("RGB")
    kind = spec["kind"]
    cx, cy = spec["center"]
    thread = np.array(hex_to_rgb(spec.get("thread", "#24315A")))  # Pantone 19-3943 TCX Bellwether Blue

    if kind == "embroidery":
        # Satin-stitch wordmark: thread color, fine diagonal stitch sheen, a zigzag-edge outline.
        alpha = _wordmark_alpha(spec["width"] * SS)
        W, H = alpha.size
        a = np.asarray(alpha, dtype=np.float64) / 255
        yy, xx = np.mgrid[0:H, 0:W]
        sheen = 1 + 0.18 * (((xx + yy) // SS) % 2)                    # alternating stitch rows
        rgb = np.clip(thread[None, None, :] * 255 * sheen[..., None], 0, 255)
        edge = np.asarray(alpha.filter(ImageFilter.FIND_EDGES), dtype=np.float64) / 255
        rgb = rgb * (1 - 0.35 * edge[..., None])                         # darker outline stitch
        art = Image.fromarray(np.dstack([rgb, a * 255]).astype(np.uint8), "RGBA")
        art = art.resize((W // SS, H // SS), Image.LANCZOS)
        w, h = art.size
        box = (int(cx - w / 2), int(cy - h / 2), int(cx - w / 2) + w, int(cy - h / 2) + h)
        return _place(img, art, box, shadow_alpha=120, shadow_blur=0.8)

    if kind in ("tag", "patch"):
        # Woven damask label, ground dyed to match the fabric, logo per the tech-pack artwork page.
        tw, th = spec["size"]                                            # on-image size, after rotation
        rot = spec.get("rotate", 0)
        lw, lh = (th, tw) if rot in (90, 270) else (tw, th)              # label drawn unrotated, long side across
        box = (int(cx - tw / 2), int(cy - th / 2), int(cx - tw / 2) + tw, int(cy - th / 2) + th)
        ground = _fabric_color(img, box) if spec.get("ground", "match") == "match" else hex_to_rgb(spec["ground"])
        ground = np.clip(ground * 1.03, 0, 1)                            # damask reads a touch brighter than cord
        W, H = lw * SS, lh * SS
        yy, xx = np.mgrid[0:H, 0:W]
        weft = 1 - 0.05 * ((yy // 2) % 2)                                # fine horizontal weft
        rgb = ground[None, None, :] * 255 * weft[..., None]
        # logo: length and width as a fraction of the label (tech pack: 1 3/16 x 3/4 in on a 3 x 1 in tag)
        logo_w = int(W * spec.get("logo_length_ratio", 1.1875 / 3))
        la = np.asarray(_wordmark_alpha(logo_w), dtype=np.float64) / 255
        ox, oy = (W - la.shape[1]) // 2, (H - la.shape[0]) // 2
        sub = rgb[oy:oy + la.shape[0], ox:ox + la.shape[1]]
        rgb[oy:oy + la.shape[0], ox:ox + la.shape[1]] = sub * (1 - la[..., None]) + thread * 255 * la[..., None]
        # 1/16 in edgestitch in thread dyed to match, just inside the edge
        inset = max(2, int(min(W, H) * 0.06))
        dark = ground * 255 * 0.82
        rgb[inset, inset:W - inset] = dark
        rgb[H - inset - 1, inset:W - inset] = dark
        rgb[inset:H - inset, inset] = dark
        rgb[inset:H - inset, W - inset - 1] = dark
        art = Image.fromarray(np.dstack([np.clip(rgb, 0, 255), np.full((H, W), 255.0)]).astype(np.uint8), "RGBA")
        art = art.resize((lw, lh), Image.LANCZOS)
        if rot:
            art = art.rotate(rot, expand=True, resample=Image.BICUBIC)
        return _place(img, art, box, shadow_alpha=80, shadow_blur=1.2)

    raise ValueError(f"unknown logo kind {kind!r}")


def crop_ratio(img, spec):
    rw, rh = (int(v) for v in spec["ratio"].split(":"))
    w, h = img.size
    if w / h > rw / rh:          # too wide: trim sides, centered
        nw = round(h * rw / rh)
        x0 = (w - nw) // 2
        return img.crop((x0, 0, x0 + nw, h))
    nh = round(w * rh / rw)      # too tall: trim top/bottom per anchor
    anchor = spec.get("anchor", "center")
    y0 = 0 if anchor == "top" else (h - nh if anchor == "bottom" else (h - nh) // 2)
    return img.crop((0, y0, w, y0 + nh))


def run(recipe_path):
    with open(recipe_path) as f:
        r = json.load(f)
    base = os.path.dirname(os.path.abspath(recipe_path))
    path = lambda p: p if os.path.isabs(p) else os.path.normpath(os.path.join(ROOT, p))
    img = Image.open(path(r["input"])).convert("RGB")
    report = {}
    if "color" in r:
        img, report["color"] = match_color(img, r["color"])
    if "recolor" in r:
        img = recolor_spots(img, r["recolor"])
    for spec in r.get("logos", []):
        img = composite_logo(img, spec)
    if "crop" in r:
        img = crop_ratio(img, r["crop"])
    out = path(r["output"])
    os.makedirs(os.path.dirname(out), exist_ok=True)
    img.save(out, "JPEG", quality=92, optimize=True, progressive=True)
    report["output"] = os.path.relpath(out, ROOT)
    report["size"] = img.size
    print(json.dumps(report))
    return report


if __name__ == "__main__":
    for p in sys.argv[1:]:
        run(p)
