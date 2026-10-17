"""Sync approved photography into the app (07-photography.md, pipeline step 7).

Reads assets/photography/MANIFEST.csv and, for every row:
  * writes public/photography/<stem>.jpg         the original re-encoded as a quality-82
                                                  progressive JPEG with metadata stripped
  * writes public/photography/<stem>-<w>.webp    quality-80 WebP copies 480 and 960 px wide,
                                                  plus 1440 for the 16:9 hero; never upscaled
then writes app/lib/mock/photos.generated.json, the list that app/lib/mock/photos.ts reads:
  {code, file, colorway, width, height, alt, widths, ratio}
`file` is the JPEG name under public/photography/, `widths` the WebP widths actually written,
`colorway` null when the manifest cell is empty. H-01 appears twice (ratio 9:16 and 16:9) so
the UI can pick the crop.

Checks first: the manifest header, that every file exists, that width/height and ratio match
the file, that product and colorway names are the ones in content/products/*.json, and that
no (code, colorway, ratio) repeats. Any problem stops the run before anything is written.

Idempotent: every output is compared byte for byte and only rewritten when it differs, and
files under public/photography/ that no manifest row produces are removed. The optimized
copies are committed (Codespaces runs without a build step), so rerun after any manifest change.

Usage:
  python3 tools/photo_sync.py            # sync, then print a summary table
  python3 tools/photo_sync.py --check    # write nothing; exit 1 if anything would change
"""
import csv
import glob
import io
import json
import os
import sys

from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), ".."))
SRC_DIR = os.path.join(ROOT, "assets", "photography")
MANIFEST = os.path.join(SRC_DIR, "MANIFEST.csv")
OUT_DIR = os.path.join(ROOT, "public", "photography")
JSON_OUT = os.path.join(ROOT, "app", "lib", "mock", "photos.generated.json")
PRODUCTS_DIR = os.path.join(ROOT, "content", "products")

COLUMNS = ["file", "code", "product", "colorway", "look", "scene", "ratio", "width", "height",
           "prompt_id", "checked_by", "date", "alt"]
REQUIRED = ["file", "code", "ratio", "width", "height", "prompt_id", "checked_by", "date", "alt"]
WEBP_WIDTHS = (480, 960)
HERO_WIDE_WIDTH = 1440  # the 16:9 hero only
JPEG_QUALITY = 82
WEBP_QUALITY = 80
RATIO_TOLERANCE = 0.01  # relative; a 960x1200 frame is 4:5 exactly, 720x1280 is 9:16 exactly
OUTPUT_EXT = (".jpg", ".jpeg", ".webp")


def fail(message):
    print("photo_sync: " + message, file=sys.stderr)
    sys.exit(1)


def rel(path):
    return os.path.relpath(path, ROOT)


def load_products():
    """{product name: {colorway names}} from content/products/*.json, the only source of product facts."""
    products = {}
    for path in sorted(glob.glob(os.path.join(PRODUCTS_DIR, "*.json"))):
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
        products[data["name"]] = {c["name"] for c in data.get("colorways", [])}
    return products


def read_manifest():
    if not os.path.isfile(MANIFEST):
        fail(f"{rel(MANIFEST)} not found")
    with open(MANIFEST, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        if reader.fieldnames != COLUMNS:
            fail(f"{rel(MANIFEST)} header must be exactly: {','.join(COLUMNS)}")
        rows = [{k: (v or "").strip() for k, v in row.items() if k is not None} for row in reader]
    if not rows:
        fail(f"{rel(MANIFEST)} has no rows")
    return rows


def parse_ratio(text):
    parts = text.split(":")
    if len(parts) != 2 or not all(p.isdigit() and int(p) > 0 for p in parts):
        return None
    return int(parts[0]), int(parts[1])


def validate(rows, products):
    errors = []
    seen = set()
    for n, row in enumerate(rows, 2):
        where = f"{rel(MANIFEST)}:{n} ({row['file'] or '?'})"
        for col in REQUIRED:
            if not row[col]:
                errors.append(f"{where}: {col} is empty")
        if len(row) != len(COLUMNS):
            errors.append(f"{where}: {len(row)} cells, expected {len(COLUMNS)}")
        src = os.path.join(SRC_DIR, row["file"])
        if not os.path.isfile(src):
            errors.append(f"{where}: file not found in {rel(SRC_DIR)}")
            continue
        with Image.open(src) as im:
            w, h = im.size
        if (row["width"], row["height"]) != (str(w), str(h)):
            errors.append(f"{where}: width,height is {row['width']},{row['height']} but the file is {w},{h}")
        ratio = parse_ratio(row["ratio"])
        if ratio is None:
            errors.append(f"{where}: ratio {row['ratio']!r} is not W:H")
        else:
            want = ratio[0] / ratio[1]
            if abs(w / h - want) > RATIO_TOLERANCE * want:
                errors.append(f"{where}: ratio {row['ratio']} does not match {w}x{h}")
        if row["product"]:
            if row["product"] not in products:
                errors.append(f"{where}: product {row['product']!r} is not in {rel(PRODUCTS_DIR)}")
            elif row["colorway"] and row["colorway"] not in products[row["product"]]:
                known = ", ".join(sorted(products[row["product"]]))
                errors.append(f"{where}: colorway {row['colorway']!r} is not a {row['product']} colorway ({known})")
        elif row["colorway"]:
            errors.append(f"{where}: colorway given without a product")
        key = (row["code"], row["colorway"], row["ratio"])
        if key in seen:
            errors.append(f"{where}: duplicate code/colorway/ratio {key}")
        seen.add(key)
    if errors:
        fail("MANIFEST.csv has problems:\n  " + "\n  ".join(errors))


def encode_jpeg(im):
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=JPEG_QUALITY, progressive=True, optimize=True, exif=b"", icc_profile=None)
    return buf.getvalue()


def encode_webp(im, width):
    height = round(width * im.height / im.width)
    small = im if width == im.width else im.resize((width, height), Image.Resampling.LANCZOS)
    buf = io.BytesIO()
    small.save(buf, "WEBP", quality=WEBP_QUALITY, method=6, exif=b"", icc_profile=None)
    return buf.getvalue()


def put(path, data, check):
    """Write data to path only if it differs. Returns 'written' or 'unchanged'."""
    try:
        with open(path, "rb") as f:
            if f.read() == data:
                return "unchanged"
    except FileNotFoundError:
        pass
    if not check:
        with open(path, "wb") as f:
            f.write(data)
    return "written"


def print_table(header, rows):
    widths = [max(len(str(c)) for c in col) for col in zip(header, *rows)]
    line = "  ".join(str(c).ljust(w) for c, w in zip(header, widths))
    print(line.rstrip())
    print("  ".join("-" * w for w in widths))
    for row in rows:
        print("  ".join(str(c).ljust(w) for c, w in zip(row, widths)).rstrip())


def sync(check=False):
    rows = read_manifest()
    validate(rows, load_products())
    if not check:
        os.makedirs(OUT_DIR, exist_ok=True)

    expected = set()
    entries = []
    table = []
    changed = 0
    for row in rows:
        stem = os.path.splitext(row["file"])[0]
        with Image.open(os.path.join(SRC_DIR, row["file"])) as src:
            im = src.convert("RGB")  # a fresh image: no EXIF, no ICC profile carried over
        im.info.clear()

        jpg_name = stem + ".jpg"
        jpg = encode_jpeg(im)
        statuses = {put(os.path.join(OUT_DIR, jpg_name), jpg, check)}
        expected.add(jpg_name)
        total = len(jpg)

        targets = list(WEBP_WIDTHS)
        if row["code"].startswith("H-") and row["ratio"] == "16:9":
            targets.append(HERO_WIDE_WIDTH)
        widths = []
        for width in targets:
            if width > im.width:
                continue  # never upscale
            data = encode_webp(im, width)
            name = f"{stem}-{width}.webp"
            statuses.add(put(os.path.join(OUT_DIR, name), data, check))
            expected.add(name)
            widths.append(width)
            total += len(data)

        entries.append({
            "code": row["code"],
            "file": jpg_name,
            "colorway": row["colorway"] or None,
            "width": int(row["width"]),
            "height": int(row["height"]),
            "alt": row["alt"],
            "widths": widths,
            "ratio": row["ratio"],
        })
        status = "written" if "written" in statuses else "unchanged"
        changed += status == "written"
        table.append((jpg_name, row["code"], row["colorway"] or "-", row["ratio"], f"{im.width}x{im.height}",
                      f"{len(jpg) / 1024:.0f}", ",".join(map(str, widths)), f"{total / 1024:.0f}", status))

    removed = []
    if os.path.isdir(OUT_DIR):
        for name in sorted(os.listdir(OUT_DIR)):
            if name.lower().endswith(OUTPUT_EXT) and name not in expected:
                removed.append(name)
                if not check:
                    os.remove(os.path.join(OUT_DIR, name))

    payload = (json.dumps(entries, indent=2, ensure_ascii=False) + "\n").encode("utf-8")
    json_status = put(JSON_OUT, payload, check)

    print_table(("file", "code", "colorway", "ratio", "px", "jpg KB", "webp widths", "all KB", "status"), table)
    print()
    for name in removed:
        print(f"{'would remove' if check else 'removed'} stale {rel(os.path.join(OUT_DIR, name))}")
    on_disk = 0
    if os.path.isdir(OUT_DIR):
        on_disk = sum(os.path.getsize(os.path.join(OUT_DIR, n)) for n in os.listdir(OUT_DIR)
                      if n.lower().endswith(OUTPUT_EXT))
    print(f"{len(rows)} photos, {len(expected)} files in {rel(OUT_DIR)}/ ({on_disk / 1024:.0f} KB on disk), "
          f"{changed} photo(s) {'out of date' if check else 'written'}")
    print(f"{rel(JSON_OUT)}: {len(entries)} entries, {json_status}")

    if check and (changed or removed or json_status == "written"):
        print("photo_sync --check: outputs are out of date; run python3 tools/photo_sync.py", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    args = sys.argv[1:]
    if args not in ([], ["--check"]):
        print(__doc__.strip().splitlines()[-2].strip() + "\n" + __doc__.strip().splitlines()[-1].strip())
        sys.exit(2)
    sync(check=bool(args))
