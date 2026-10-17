"""Build docs/REVIEW.md: every page at 390 and 1440 in UI mode, then the wireframes, then an index
of the Storybook components, all as plain Markdown image links that render on GitHub.

Usage: python3 tools/review_md.py   (after `npm run shots:ui`, `npm run shots:wireframes`, `npm run storybook:build`)
"""
import json
import os
import re

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
DOCS = os.path.join(ROOT, "docs")
UI = os.path.join(DOCS, "ui")
WIRE = os.path.join(DOCS, "wireframes")
SB_INDEX = os.path.join(ROOT, "storybook-static", "index.json")

ORDER = [
    ("home", "Home `/`"),
    ("menu", "Menu (open)"),
    ("cart-drawer", "Cart drawer, \"Your Digs\" (open, empty)"),
    ("shop", "Shop `/collections/all`"),
    ("product-thermal-long-sleeve", "Product: Thermal Long Sleeve"),
    ("product-pincord-button-down", "Product: Pincord Button-Down"),
    ("product-needlecord-shirt", "Product: Needlecord Shirt"),
    ("product-drawstring-pant", "Product: Drawstring Pant"),
    ("size-guide-modal", "Size guide modal (on the PDP)"),
    ("manifesto", "Manifesto `/pages/manifesto`"),
    ("size-guide", "Size guide `/pages/size-guide`"),
    ("shipping-returns", "Shipping & returns"),
    ("faq", "FAQ"),
    ("contact", "Contact"),
    ("accessibility", "Accessibility statement"),
    ("policies", "Policies index"),
    ("policy-privacy", "Policy page (privacy)"),
    ("account", "Account hand-off"),
    ("cart", "Cart page (no-JS fallback)"),
    ("404", "404"),
]


def pair(folder, rel, name):
    a = f"{name}-390.png"
    b = f"{name}-1440.png"
    out = []
    if os.path.exists(os.path.join(folder, a)) or os.path.exists(os.path.join(folder, b)):
        out.append("| 390 | 1440 |\n|---|---|")
        out.append(f"| ![{name} at 390]({rel}/{a}) | ![{name} at 1440]({rel}/{b}) |")
    return "\n".join(out)


def section(title, folder, rel, intro):
    lines = [f"## {title}", "", intro, ""]
    for key, label in ORDER:
        block = pair(folder, rel, key)
        if block:
            lines += [f"### {label}", "", block, ""]
    return "\n".join(lines)


def storybook_index():
    if not os.path.exists(SB_INDEX):
        return "_Storybook not built: run `npm run storybook:build`._"
    data = json.load(open(SB_INDEX))
    groups = {}
    for e in data["entries"].values():
        if e.get("type") != "story":
            continue
        groups.setdefault(e["title"], []).append(e["name"])
    lines = ["Run `npm run storybook` and open http://localhost:6006. Toolbar: **Mode** (UI / Wireframe) and **Viewport** (390 / 768 / 1024 / 1440). Every story is checked by the a11y addon and by `npm run test:visual -- --grep @stories` (axe at both sizes in both modes).", ""]
    for section_name in ["Foundation", "Core", "DIGS", "Pages"]:
        titles = sorted(t for t in groups if t.split("/")[0] == section_name)
        if not titles:
            continue
        lines.append(f"### {section_name}")
        lines.append("")
        lines.append("| Component | Stories |")
        lines.append("|---|---|")
        for t in titles:
            short = t.split("/", 1)[1] if "/" in t else t
            names = groups[t]
            lines.append(f"| `{short}` | {len(names)}: {', '.join(names)} |")
        lines.append("")
    total = sum(len(v) for v in groups.values())
    lines.append(f"**{total} stories across {len(groups)} components/pages.**")
    return "\n".join(lines)


def main():
    parts = [
        "# digs storefront v1: review",
        "",
        "Every page at 390 and 1440 in UI mode, then the wireframes (the same build in `data-mode=\"wire\"`), then the Storybook index. Images are previews made from the tech pack. Prices read \"Price TBA\" (decision O1). Draft copy carries a small \"draft\" pill.",
        "",
        "Start the site locally with `npm install && npm run dev` (mock data, no Shopify login), or open the branch in a GitHub Codespace (`.devcontainer/`). Build notes, decisions to confirm and known gaps: `docs/build-log.md`.",
        "",
        section("UI pages", UI, "ui", "Captured by `npm run shots:ui` from the production build on the mock adapter, with the approved round-1 photography in place."),
        section("Wireframes", WIRE, "wireframes", "Captured by `npm run shots:wireframes`. Greyscale roles, media slots labelled with ratio and shot code, the scrawl in grey."),
        "## Storybook components",
        "",
        storybook_index(),
        "",
    ]
    with open(os.path.join(DOCS, "REVIEW.md"), "w") as f:
        f.write("\n".join(parts))
    print("wrote docs/REVIEW.md")


if __name__ == "__main__":
    main()
