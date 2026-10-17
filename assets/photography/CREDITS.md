# Photography credits

All 15 images in this folder (one row each in `MANIFEST.csv`) are **original generated previews**, made with the pipeline in `docs/brief/07-photography.md`:

- **Generated** with Figma `generate_image` (model `gpt-image-2.5-sunburst`) from text prompts and the model bible for the cast, an original generated person. Round 1, Oct 16 2026; raw frames in `reference/photo-tests/round-1/raw/`.
- **Post-processed** with `tools/photo_post.py` from the recipes in `reference/photo-tests/round-1/recipes/` (the `prompt_id` column names the recipe): garment colors pulled to the tech-pack swatches, the cobalt seamless pulled to Digs Blue, tone-to-tone buttons, off-spec details cloned out, the real digs artwork from `brand/logos/` composited at the tech-pack placement, crop to ratio.

What they are not:

- **No stock photography and no third-party photos.** No BOAST placeholder photos, no other brand's product photos, no free stock environment plates (if a plate is ever used, its URL and license go here, per pipeline step 8).
- **No real person's likeness.** The model is an original generated person who does not resemble any real individual. No photo of a real person was uploaded to a generator.
- **No generated lettering.** Every logo in frame is the real digs artwork, composited in post.

Status: **previews**. They stand in until photography of production samples replaces them, and until then the site carries the line "Images are previews made from the tech pack." Approved for the site by the founder on Oct 16 2026 (round 1).

The site serves optimized copies written by `python3 tools/photo_sync.py` into `public/photography/`; those copies are committed, so the app runs without a build step.
