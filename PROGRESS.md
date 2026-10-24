# Considered MVP — execution checklist

Updated: 2026-10-24. Repository: https://github.com/Roobahist/BuildYYC

## Resume here

Checkout: `/Users/Roobahist/Documents/Codex/2026-10-24/https-github-com-roobahist-buildyyc-https/work/BuildYYC`

Read this file, `README.md`, and `docs/BRIEF.md` before continuing. Checkboxes mean completed and verified; unchecked tasks remain. Update this file after each meaningful milestone. Never mark unrun checks as passed.

## Plan

- [x] 1. Read the supplied brief and inspect repository: confirmed empty remote and cloned locally.
- [x] 2. Initialize Vite, React, TypeScript, Tailwind, shadcn/ui, and project-local Impeccable.
- [x] 3. Establish brand, accessible tokens, typography, and product/design context.
- [x] 4. Define reusable category, factor, cost, question, product, and evidence data; curate two scenarios.
- [x] 5. Implement pure eligibility, total-cost, deterministic scoring, adaptive questions, and decision selectors.
- [x] 6. Build initial scenario selection and lightweight intent matching.
- [x] 7. Build decision workspace with working questions, editable requirements, weights, and reversible exclusions.
- [x] 8. Add product details, evidence/confidence, hidden costs, ranking explanations, and final comparison.
- [x] 9. Test core domain behavior; run typecheck and production build; fix failures.
- [x] 10. Inspect desktop/mobile and key interactions; apply Impeccable critique and polish.
- [ ] 11. Finalize README, limitations, handoff, and portable repository checkpoint.

## Current work

Implementation and validation are complete. Finalizing the source-backed design record, README, GitHub checkpoint, and source archive. Next required action is step 11 only; application code does not need more work for this checkpoint.

## Decisions and known limits

- Prioritize two deeply functional categories: six digital pianos, five couches. Robot sensors are deferred until the core experience is verified.
- Curated prices, subjective scores, accessory/return/delivery assumptions must be labelled illustrative.
- Only checked direct sources may support factual claims; no fabricated reviews or confidence percentages.
- Unknown requirements remain eligible with explicit verification concerns; never silently pass/fail them.
- Missing scored factors are omitted from the weighted mean, and weighted coverage is displayed.
- Budget and price weight are independent. Costs distinguish included, required, optional, owned, and unknown.
- Implementation was kept in one thread. The installed Impeccable workflow explicitly required independent finish-review and documentation agents; they were used only for those bounded tasks.

## Validation log

- `npm test`: **17/17 passed** under Node 24.19.0. Includes filtering, reversible exclusions, independent price scoring/budget, priority-based order changes, stable ties, unknown data/costs, weighted coverage, ownership, question selection, earlier-answer changes, couch uncertainty, intent parsing, restored-state validation, categorical preferences, and unranked explanations.
- `npm run typecheck`: passed. `npm run build`: passed; build also runs strict typecheck.
- Browser: stand requirement 4 → 2 eligible; disabling it restores 4; price weight 0 leaves budget on; portability changes the leader; ownership restores ES120 at $914; details/evidence/comparison work; refresh restores state; unsupported intent explains supported categories; empty budget recovers; couch access 5 → 3 → 5 with unknown access preserved.
- All-zero browser check: all 8 weights set to 0, all cards say Unranked, comparison requests a usable priority and makes no highest-score claim.
- Desktop/mobile layouts inspected, including advanced requirements and mobile comparison. In-app observed CSS client widths 1300 and 346, plus current user viewport 381; no page horizontal overflow at inspected widths.
- Impeccable source detector: one run, only 9 repeated Space Grotesk warnings; retained the brief's suggested pairing. No detector added to CI.
- Independent Impeccable finish review: source/render review requested three fixes (unranked winner language, redundant eyebrows, icon consistency). All fixed. Verdict pass: **ship**, all three scored fixes resolved. This is a bounded correction verdict, not a claim of comprehensive cross-browser/accessibility certification.
- Capture limitation: IAB full-page screenshots cropped incorrectly at 110% device scale. Replaced them with complete native viewports and scrolled-section captures before accepting review evidence.
- Host default Node is 20.18.0. Use **Node 24** (`.nvmrc`) for installation/build/tests. Actual checks used the existing Node 24.19.0 installation.

## Next action

Finish step 11: validate design metadata, create and push the repository checkpoint, and write a portable source archive and handoff. Then the first MVP is complete.

## Next iteration (not part of this MVP)

- [ ] Observe a few users demonstrating the piano discovery → elimination → weighting flow; revise only the friction they encounter.
- [ ] Replace the primary scenario's illustrative offers with a small set of verified Canadian retailer prices, bundles, and return conditions.
- [ ] Expand the typed catalogue with robot sensors and controller/voltage incompatibility only after validating the core experience.
- [ ] Add delivery-date and pet-related safety concerns only with honest evidence and unresolved-risk states.
- [ ] Run a screen-reader/cross-browser/real-device accessibility pass before broader distribution.
