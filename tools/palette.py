"""DIGS palette builder: extends the BOAST triad into a UI palette.

Brand core stays exactly as BOAST specifies. Every derived color is hue-locked
to Digs Blue in OKLCH, so the whole system reads as one blue family. Writes
tokens.json (W3C design-token format), tokens.css and a contrast report.

Usage: python3 -I palette.py <out_dir>
"""
import json
import math
import os
import sys

# ---------------------------------------------------------------- color math
def srgb_to_lin(c):
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def lin_to_srgb(c):
    return 12.92 * c if c <= 0.0031308 else 1.055 * (c ** (1 / 2.4)) - 0.055


def hex_to_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) / 255 for i in (0, 2, 4))


def rgb_to_hex(rgb):
    return "#" + "".join(f"{round(max(0, min(1, c)) * 255):02X}" for c in rgb)


def rgb_to_oklch(rgb):
    r, g, b = (srgb_to_lin(c) for c in rgb)
    l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
    m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
    s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b
    l_, m_, s_ = (math.copysign(abs(v) ** (1 / 3), v) for v in (l, m, s))
    L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_
    a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_
    bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
    C = math.hypot(a, bb)
    H = math.degrees(math.atan2(bb, a)) % 360
    return L, C, H


def oklch_to_rgb(L, C, H):
    a = C * math.cos(math.radians(H))
    b = C * math.sin(math.radians(H))
    l_ = L + 0.3963377774 * a + 0.2158037573 * b
    m_ = L - 0.1055613458 * a - 0.0638541728 * b
    s_ = L - 0.0894841775 * a - 1.2914855480 * b
    l, m, s = l_ ** 3, m_ ** 3, s_ ** 3
    r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
    g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
    bl = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
    return tuple(lin_to_srgb(v) for v in (r, g, bl))


def in_gamut(rgb, eps=1e-4):
    return all(-eps <= c <= 1 + eps for c in rgb)


def oklch_clamped(L, C, H):
    """Reduce chroma until the color fits in sRGB (keeps L and H)."""
    lo, hi = 0.0, C
    if in_gamut(oklch_to_rgb(L, C, H)):
        return rgb_to_hex(oklch_to_rgb(L, C, H))
    for _ in range(40):
        mid = (lo + hi) / 2
        if in_gamut(oklch_to_rgb(L, mid, H)):
            lo = mid
        else:
            hi = mid
    return rgb_to_hex(oklch_to_rgb(L, lo, H))


def luminance(h):
    r, g, b = (srgb_to_lin(c) for c in hex_to_rgb(h))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast(a, b):
    la, lb = sorted((luminance(a), luminance(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)


# ---------------------------------------------------------------- the system
CORE = {
    "ink": "#000000",        # BOAST: Black  RGB 0-0-0      CMYK 75-68-67-90
    "digs-blue": "#0042E5",  # BOAST: Blue   RGB 0-66-229   CMYK 87-73-0-0
    "ice": "#F0F5FF",        # BOAST: Light blue RGB 240-245-255 CMYK 4-2-0-0
}

BL, BC, BH = rgb_to_oklch(hex_to_rgb(CORE["digs-blue"]))

# Tonal blue ramp. Digs Blue is pinned at 600 exactly; the rest are hue-locked
# to it and chroma-clamped to sRGB.
BLUE_STEPS = {
    "50": 0.970, "100": 0.935, "200": 0.875, "300": 0.785, "400": 0.665,
    "500": 0.540, "600": None, "700": 0.390, "800": 0.320, "900": 0.250, "950": 0.185,
}
blue = {}
for step, L in BLUE_STEPS.items():
    if L is None:
        blue[step] = CORE["digs-blue"]
    else:
        # taper chroma toward the light end so tints stay clean, not lavender
        C = BC * (0.10 if L > 0.95 else 0.22 if L > 0.92 else 0.42 if L > 0.86 else 0.7 if L > 0.75 else 1.0)
        blue[step] = oklch_clamped(L, C, BH)

# Ink neutrals: cool, blue-tinted greys between ice and black (never pure grey).
INK_STEPS = {
    "50": (0.975, 0.008), "100": (0.945, 0.012), "200": (0.895, 0.016), "300": (0.820, 0.020),
    "400": (0.700, 0.024), "500": (0.570, 0.026), "600": (0.470, 0.026), "700": (0.380, 0.024),
    "800": (0.290, 0.020), "900": (0.205, 0.014), "950": (0.145, 0.010),
}
ink = {k: oklch_clamped(L, C, BH) for k, (L, C) in INK_STEPS.items()}

# Signal colors: state only, never decoration, never on a brand mark.
SIGNAL = {
    "sale": "#C8102E",        # sale price, error text, destructive
    "sale-tint": "#FDE7EA",
    "success": "#0B7A4B",     # in stock, added, confirmed
    "success-tint": "#E2F4EC",
    "low-stock": "#8A4B00",   # "only 3 left" text
    "low-stock-tint": "#FFF1D6",
}

# Cloth: product colorway swatches. Values sampled from the tech pack colorway
# chips on screen; the physical lab dip / Pantone is the standard.
CLOTH = {
    "thermal-off-white": {"hex": "#F4EEE8", "source": "AC-LST-001 Tech Pack 6-15-25 p12, colorway #1 OFF WHITE (chip sampled)"},
    "thermal-sand-blue": {"hex": "#5B6FA7", "source": "AC-LST-001 Tech Pack 6-15-25 p12, colorway #2 SAND BLUE (chip sampled)"},
    "pincord-mustard": {"hex": "#E2AF3F", "source": "AC-LSS-001 Pincord REV1 10-15-26 p15, colorway #1 MUSTARD, ref #E2AF3F"},
    "needlecord-light-grey": {"hex": "#D0CCCC", "source": "AC-LSS-001 Needlecord REV1 10-15-26 p13, colorway #1 LIGHT GREY, ref #D0CCCC"},
    "pant-salmon": {"hex": "#CAA28C", "source": "AC-PNT-001 REV0 10-15-26 p13, colorway #1 SALMON, ref #CAA28C"},
    "embroidery-bellwether-blue": {"hex": "#21305A", "source": "PANTONE 19-3943 TCX Bellwether Blue (all packs: embroidery, logo tag, logo patch)"},
}

PAPER = "#FFFFFF"  # raised surfaces on the ice ground (drawers, cards, product image wells)


# ---------------------------------------------------------------- semantic roles
ROLES = {
    "surface/page": CORE["ice"],
    "surface/raised": PAPER,
    "surface/sunken": ink["100"],
    "surface/inverse": CORE["ink"],
    "surface/brand": CORE["digs-blue"],
    "text/primary": CORE["ink"],
    "text/secondary": ink["700"],
    "text/muted": ink["600"],
    "text/on-inverse": CORE["ice"],
    "text/on-brand": CORE["ice"],
    "text/link": CORE["digs-blue"],
    "text/sale": SIGNAL["sale"],
    "text/success": SIGNAL["success"],
    "text/low-stock": SIGNAL["low-stock"],
    "text/sale-on-inverse": SIGNAL["sale-tint"],
    "text/success-on-inverse": SIGNAL["success-tint"],
    "border/hairline": ink["200"],
    "border/control": ink["500"],
    "border/strong": CORE["ink"],
    "action/primary": CORE["digs-blue"],
    "action/primary-hover": blue["700"],
    "action/primary-pressed": blue["800"],
    "action/primary-text": CORE["ice"],
    "action/secondary": CORE["ink"],
    "action/secondary-hover": ink["900"],
    "action/secondary-text": CORE["ice"],
    "action/disabled": ink["200"],
    "action/disabled-text": ink["500"],
    "focus/ring": CORE["digs-blue"],
    "focus/ring-on-dark": CORE["ice"],
    "brand/scrawl": CORE["digs-blue"],
    "brand/tint": blue["100"],
}

# Pairs the UI will actually render, with the WCAG bar each has to clear.
CHECKS = [
    ("text/primary on surface/page", ROLES["text/primary"], ROLES["surface/page"], 4.5),
    ("text/secondary on surface/page", ROLES["text/secondary"], ROLES["surface/page"], 4.5),
    ("text/muted on surface/page", ROLES["text/muted"], ROLES["surface/page"], 4.5),
    ("text/secondary on surface/raised", ROLES["text/secondary"], ROLES["surface/raised"], 4.5),
    ("text/muted on surface/sunken", ROLES["text/muted"], ROLES["surface/sunken"], 4.5),
    ("text/link on surface/page", ROLES["text/link"], ROLES["surface/page"], 4.5),
    ("text/link on surface/raised", ROLES["text/link"], ROLES["surface/raised"], 4.5),
    ("text/on-brand on surface/brand", ROLES["text/on-brand"], ROLES["surface/brand"], 4.5),
    ("text/on-inverse on surface/inverse", ROLES["text/on-inverse"], ROLES["surface/inverse"], 4.5),
    ("action/primary-text on action/primary", ROLES["action/primary-text"], ROLES["action/primary"], 4.5),
    ("action/primary-text on action/primary-hover", ROLES["action/primary-text"], ROLES["action/primary-hover"], 4.5),
    ("action/primary-text on action/primary-pressed", ROLES["action/primary-text"], ROLES["action/primary-pressed"], 4.5),
    ("action/secondary-text on action/secondary", ROLES["action/secondary-text"], ROLES["action/secondary"], 4.5),
    ("text/sale on surface/page", ROLES["text/sale"], ROLES["surface/page"], 4.5),
    ("text/sale on surface/raised", ROLES["text/sale"], ROLES["surface/raised"], 4.5),
    ("text/success on surface/page", ROLES["text/success"], ROLES["surface/page"], 4.5),
    ("text/low-stock on surface/page", ROLES["text/low-stock"], ROLES["surface/page"], 4.5),
    ("text/sale-on-inverse on surface/inverse", ROLES["text/sale-on-inverse"], ROLES["surface/inverse"], 4.5),
    ("text/success-on-inverse on surface/inverse", ROLES["text/success-on-inverse"], ROLES["surface/inverse"], 4.5),
    ("text/sale on sale-tint", SIGNAL["sale"], SIGNAL["sale-tint"], 4.5),
    ("text/success on success-tint", SIGNAL["success"], SIGNAL["success-tint"], 4.5),
    ("text/low-stock on low-stock-tint", SIGNAL["low-stock"], SIGNAL["low-stock-tint"], 4.5),
    ("border/control vs surface/page (WCAG 1.4.11)", ROLES["border/control"], ROLES["surface/page"], 3.0),
    ("border/control vs surface/raised (WCAG 1.4.11)", ROLES["border/control"], ROLES["surface/raised"], 3.0),
    ("focus/ring vs surface/page", ROLES["focus/ring"], ROLES["surface/page"], 3.0),
    ("focus/ring-on-dark vs surface/brand", ROLES["focus/ring-on-dark"], ROLES["surface/brand"], 3.0),
    ("focus/ring-on-dark vs surface/inverse", ROLES["focus/ring-on-dark"], ROLES["surface/inverse"], 3.0),
    ("brand/tint chip text (ink on blue-100)", CORE["ink"], blue["100"], 4.5),
    ("digs-blue on blue-100 (tag text)", CORE["digs-blue"], blue["100"], 4.5),
]

# Pairs that must NEVER carry text (documented, expected to fail).
FORBIDDEN = [
    ("ink text on digs-blue", CORE["ink"], CORE["digs-blue"]),
    ("digs-blue text on ink", CORE["digs-blue"], CORE["ink"]),
    ("thermal-off-white swatch on ice (needs keyline)", CLOTH["thermal-off-white"]["hex"], CORE["ice"]),
    ("needlecord-light-grey swatch on ice (needs keyline)", CLOTH["needlecord-light-grey"]["hex"], CORE["ice"]),
    ("pincord-mustard swatch on ice (needs keyline)", CLOTH["pincord-mustard"]["hex"], CORE["ice"]),
    ("pant-salmon swatch on ice (needs keyline)", CLOTH["pant-salmon"]["hex"], CORE["ice"]),
]


def main(out):
    os.makedirs(out, exist_ok=True)
    rows, fails = [], []
    for name, fg, bg, bar in CHECKS:
        r = contrast(fg, bg)
        ok = r >= bar
        rows.append((name, fg, bg, r, bar, ok))
        if not ok:
            fails.append(name)
    forb = [(n, a, b, contrast(a, b)) for n, a, b in FORBIDDEN]

    tokens = {
        "$description": "DIGS design tokens. Brand core is BOAST's triad, unchanged; everything else is derived from it.",
        "color": {
            "core": {k: {"$type": "color", "$value": v} for k, v in CORE.items()},
            "paper": {"$type": "color", "$value": PAPER},
            "blue": {k: {"$type": "color", "$value": v} for k, v in blue.items()},
            "ink": {k: {"$type": "color", "$value": v} for k, v in ink.items()},
            "signal": {k: {"$type": "color", "$value": v} for k, v in SIGNAL.items()},
            "cloth": {k: {"$type": "color", "$value": v["hex"] or "TBC", "$description": v["source"]} for k, v in CLOTH.items()},
            "role": {k.replace("/", "-"): {"$type": "color", "$value": v} for k, v in ROLES.items()},
        },
    }
    with open(os.path.join(out, "tokens.color.json"), "w") as f:
        json.dump(tokens, f, indent=2)

    css = [":root {", "  /* Brand core: BOAST triad, never altered */"]
    css += [f"  --color-{k}: {v};" for k, v in CORE.items()]
    css += [f"  --color-paper: {PAPER};", "", "  /* Tonal blue, hue-locked to Digs Blue (600) */"]
    css += [f"  --color-blue-{k}: {v};" for k, v in blue.items()]
    css += ["", "  /* Ink neutrals, blue-tinted */"]
    css += [f"  --color-ink-{k}: {v};" for k, v in ink.items()]
    css += ["", "  /* Signal: state only */"]
    css += [f"  --color-signal-{k}: {v};" for k, v in SIGNAL.items()]
    css += ["", "  /* Cloth: product colorways (sampled from tech packs; lab dip is the standard) */"]
    css += [f"  --color-cloth-{k}: {v['hex']};" for k, v in CLOTH.items() if v["hex"]]
    css += ["", "  /* Semantic roles: components use these, never raw values */"]
    css += [f"  --{k.replace('/', '-')}: {v};" for k, v in ROLES.items()]
    css += ["}"]
    with open(os.path.join(out, "tokens.color.css"), "w") as f:
        f.write("\n".join(css) + "\n")

    rep = ["# Contrast report", "", "Generated by palette.py. WCAG 2.2: 4.5:1 text, 3:1 UI boundaries and focus.", "",
           "| Pair | FG | BG | Ratio | Bar | Pass |", "|---|---|---|---|---|---|"]
    rep += [f"| {n} | `{fg}` | `{bg}` | {r:.2f}:1 | {bar}:1 | {'yes' if ok else '**NO**'} |" for n, fg, bg, r, bar, ok in rows]
    rep += ["", "## Pairs that never carry text", "", "| Pair | Ratio | Rule |", "|---|---|---|"]
    rep += [f"| {n} | {r:.2f}:1 | graphic only / keyline required |" for n, a, b, r in forb]
    with open(os.path.join(out, "contrast-report.md"), "w") as f:
        f.write("\n".join(rep) + "\n")

    print("blue:", blue)
    print("ink:", ink)
    for n, fg, bg, r, bar, ok in rows:
        print(f"{'PASS' if ok else 'FAIL'} {r:5.2f} (bar {bar}) {n}")
    for n, a, b, r in forb:
        print(f"NEVER-TEXT {r:5.2f} {n}")
    print("FAILS:", fails)


if __name__ == "__main__":
    main(sys.argv[1])
