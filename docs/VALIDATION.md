# MVP validation

Date: 2026-10-24. Runtime used: Node 24.19.0.

## Automated checks

- Initial 16 domain tests passed, including filtering, reversibility, independent price/budget, deterministic ranking, all-zero weights, unknown requirements/costs, weighted coverage, ownership, budget basis, question selection/skipping, earlier-answer changes, couch access, intent matching, local restore validation, and change explanations.
- A categorical upholstery-preference test was added after review of the advanced controls; final suite: 17/17 pass. The all-zero test also checks that change explanations never invent a leader.
- TypeScript strict typecheck and Vite production build passed. Final rerun is recorded in PROGRESS.md.
- No browser error/warning messages during the exercised flow.

## Browser interactions exercised

- Landing entry, scenario selection, unsupported-input explanation, and parsed $1,200 budget.
- Stand requirement: four eligible piano offers → two. Expanded exclusions show every failed requirement. Disabling stand requirement restores four.
- Price importance zero with budget still enforced. Portability 0 → 5 changes the lead between Arius and Casio in the constrained shortlist.
- Product setup-cost, scoring, evidence, and requirement tabs. Verified direct manufacturer source links are exposed with limitations.
- Owned stand restores ES120 under budget ($1,034 → $914).
- Top-two comparison, manual comparison selection controls, keyboard-accessible sliders, and factor-specific requirement labels.
- Refresh restores the saved decision. Home offers resume; choosing a scenario starts fresh.
- Budget $100 produces a recoverable empty state; $1,400 restores six piano offers.
- Couch narrow-access question: five eligible → three, with unknown access retained for verification. Disabling it restores five.
- Desktop and mobile layouts, advanced sheet, and horizontally scrollable mobile comparison. The comparison region is keyboard focusable and has a mobile scroll hint.

## Visual review

Impeccable integration installed using its official CLI. Context, craft-floor, new-work, critique, polish, and documentation guidance were read. The user's detailed brief and explicit autonomous-build instruction supplied product/design direction without a new approval workshop. Impeccable's required independent finish review is tracked in PROGRESS.md.

One source detector run returned nine repeated `overused-font` warnings for Space Grotesk and no other findings. Space Grotesk + DM Sans is intentionally retained from the brief's typography example. This is not a claim that a source scan proves accessibility.

The in-app browser ran at 110% device scale: requested desktop 1440×1000 produced observed CSS client width 1300; requested mobile 390×844 produced observed CSS client width 346. At both widths `scrollWidth == clientWidth`. Its full-page screenshot API cropped output incorrectly; complete native viewport captures plus scrolled-section captures replaced those images. The finish reviewer rejected the invalid initial captures before proceeding. No clipped capture was treated as design approval.

## Limits

Manual local browser inspection is not a comprehensive accessibility or cross-browser audit. A screen-reader user test and real mobile device test remain valuable. Product art is an illustration. No live data or delivery/fit/safety guarantees are provided. Missing scored factors can create a high provisional score with low coverage; the UI exposes that limitation rather than inventing a penalty.

## Final review disposition

The independent Impeccable finish reviewer requested three material fixes: remove winner claims when every score is null; remove redundant decorative eyebrows; and replace two Unicode icon substitutes with Lucide. All were fixed and rechecked in source and native desktop/mobile captures. The correction verdict was **ship**, with all three listed fixes resolved. This verdict covers those scored fixes, not a comprehensive whole-surface audit. Formal concept/card approval artifacts were not created; the user's explicit autonomous-build instruction and detailed brief supplied direction.
