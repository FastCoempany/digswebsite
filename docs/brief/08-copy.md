# 08 · Copy and voice

All site copy lives in **`content/copy/en.json`**. Components read from it; nothing is typed straight into a component. Lines marked `"status": "draft"` need the founder's approval before launch.

## Voice

BOAST tone: **confident, authentic, ambitious, supportive, unapologetically bold.** Tier two keeps it in check: grounded, humble, inclusive. More warm than cheeky. More millennial than Gen Z. Proud of success, never hiding it.

The founder's own register sharpens it: specific over abstract, *quiet effectiveness*, *rough refinement*. When in doubt, cut the adjective and say the fact. "100% cotton, 215 gsm, garment washed" beats "premium luxurious comfort".

Mechanics:
- The brand name in running text is **digs** (lowercase), matching the wordmark. Sentence starts are fine lowercase too ("digs is…"). In legal text, "digs" or "DIGS" as required.
- **One or two script words per line, maximum** (The Old Falcons, as SVG). The script word is the payoff: "Wear your *story*.", "Dope is *good*."
- Headlines are short, declarative and end with a period. No exclamation marks; the `d!gs` dot is the only exclamation.
- Product facts come from the tech packs, word for word where it's a spec.

## Fixed

- **Typos corrected everywhere:** "Designed for those who push **boundaries**." and "Streetwear that echoes your **journey**." BOAST's outlined artwork has the wrong spellings baked in, so **never reuse those artwork files**; re-set the lines from `en.json`.
- **Handle `@dopeisgood`, domain `dopeisgood.com`.** BOAST's `@streetdigs`, `@digs` and `www.digs.com` don't appear anywhere.
- **Pant fabric is "lyocell"**, not TENCEL™, until a Lenzing licence exists.
- **Origin line:** "Designed in USA. Imported."

## Named CTAs (the PJ attitude, in DIGS words)

| Action | Label | Why it works |
|---|---|---|
| Enter the shop | **Dig in** | The name as a verb |
| Add to cart | **Add to Digs** | "Your digs" = your place; the cart becomes yours |
| Cart | **Your Digs** | Same idea; "Digs (2)" in tight spaces |
| Back in stock | **Hold my size** | Says exactly what happens |
| Coming soon / pre-launch | **Get on the list** | Drop culture, plainly |
| Newsletter | **Stay dope** | BOAST line ("Stay dope, stay ambitious.") |
| Checkout | Check out | Money steps stay plain |

Accessible names include the visible label (WCAG "label in name"). Don't hide "Add to Digs" behind an `aria-label` of "Add to cart".

## Where the BOAST lines go

| Place | Line(s) |
|---|---|
| Home hero sub | Redefining what it means to be dope. |
| Manifesto head | Dope is *good*. |
| Blue frame | Wear your *story*. |
| Tagline band (rotates) | Built for those who chase excellence. · Crafted for the journey ahead. · Streetwear that echoes your *journey*. · Designed for those who push *boundaries*. · Wear your ambition. |
| Poster wall | Actually Dope. · Dope Is Good · Wear your ambition. · Elevate the everyday grind. · Innovative designs for ambitious lives. · Where ambition meets style. · Stay dope, stay ambitious. |
| Footer sign-up | Stay dope. |
| 404 | This page doesn't exist. The capsule does. |

## Microcopy

All in `en.json`: price TBA, pre-order with date, low stock with count, sold out, added toast, "Hold my size" confirmation, list confirmation, empty cart ("Your Digs are empty."), size-not-selected error, newsletter success and error, cart tax note.
