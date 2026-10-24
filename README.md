# Considered

A functional BuildYYC shopping-decision prototype: discover overlooked requirements, reversibly exclude unsuitable offers, and rank the remaining products using priorities you can inspect and change.

## Run locally

Use **Node 24** (see `.nvmrc`; minimum Node 22.18). No API keys or environment variables are needed.

```sh
npm install
npm run dev
```

Open the local address printed by Vite, normally http://127.0.0.1:5173.

```sh
npm test
npm run typecheck
npm run build
npm run preview
```

Tests use Node's built-in test runner and native TypeScript stripping, with no test framework. An older Node installation will fail; switch to Node 24 first.

## Try the core journey

1. Choose **Digital pianos**. Six offers are discovered; four are initially within the illustrative $1,000 setup budget.
2. Require an included stand. Two options become excluded; expand the excluded group to inspect every reason.
3. Disable the stand requirement using its chip or an excluded product. The options return.
4. Set price importance to **0**. The budget filter remains enabled. Set portability importance to **0**, then **5**, to inspect how priorities change the order.
5. Open **Why this piano?** for setup costs, the exact weighted calculation, source confidence, and requirement results.
6. Open **All considerations**. Mark a stand already owned: the ES120 setup estimate drops from $1,034 to $914 and returns under budget.
7. Choose up to three eligible products to compare, or compare the top two directly. Unknown values and remaining trade-offs stay visible.
8. Switch to **Couches** and require a narrow-access delivery plan. Two offers fail; one remains explicitly unverified. No option is guaranteed to fit a doorway or hallway.

Requests mentioning pianos/keyboards or couches/sofas/apartments can start the corresponding demo, including simple dollar budgets. Unsupported requests get an honest explanation rather than simulated understanding.

## What works

- Two typed catalogues: six piano offers and five illustrative IKEA-model couch offers.
- Pure eligibility, acquisition-cost, normalization, weighted scoring, stable tie-breaking, adaptive questions, and change explanations.
- Independently editable hard requirements and 0–5 importance weights. Upholstery can be a weighted preference or a mandatory selection.
- Reversible exclusions, question skipping, editable earlier answers, owned accessories, listed-price versus setup-cost budgets, missing-score coverage, and explicit unknowns.
- Working evidence/details dialogs, responsive comparison, keyboard sliders, native inputs, accessible sheets, and empty-state recovery.
- One shopping session saved in this browser. Returning home preserves it; selecting a scenario starts a fresh decision for that category.

## What is simulated

All prices are illustrative CAD, before tax. Bundle contents, accessory estimates, return windows, shipping, subjective scores, and couch attributes are curated examples. Piano model names are real, but the sample offers are not retailer listings. Product cards reference credited third-party model photos, with CSS illustration fallback when images fail. All offer prices and scores remain fictional.

Three checked manufacturer references support **only their specific claims**: Roland FP-10 headphone output/optional stand, FP-30X headphone outputs/optional stand, and Kawai ES120 action/overview weight. Checked dates and limitations are visible. No customer quotes, review counts, review consensus, fake citations, or statistical confidence percentages are used.

There is no LLM, scraping, live product search, checkout, backend, login, deployment, or CI.

## Decision rules

Confirmed violations are excluded before ranking; unknown requirements remain eligible with verification concerns. Unknown required costs make the setup estimate a lower bound. A known subtotal already over budget still fails.

`score = sum(known factor score × importance) / sum(importance of known scored factors)`

Zero weights do not contribute. Missing values are omitted and weighted data coverage is displayed, rather than substituting zero. An incomplete-data leader is labelled provisional. If every active score is missing or all weights are zero, the score is unranked and product identifiers break ties deterministically. Numeric normalization uses fixed category bounds, not the changing shortlist; upholstery scores match the preferred selection independently of whether the requirement is enabled.

## Small code map

- `src/domain/types.ts`: shared catalogue/session/evidence schema.
- `src/domain/catalogue.ts`: category factors, questions, offers, costs, and checked references.
- `src/domain/engine.ts`: pure decision selector and supporting functions.
- `src/domain/engine.test.ts`: focused invariant and interaction tests.
- `src/App.tsx`: local session orchestration, entry, question flow, and change notices.
- `src/components/Preferences.tsx`: independent requirements and importance controls.
- `src/components/ProductView.tsx`: shortlist, details, evidence, exclusions, comparison.
- `src/components/ui/`: official shadcn/ui primitives, customized through shared tokens.

## Resume and next iteration

**Read `PROGRESS.md` first.** It records completed steps, exact checks, known limits, and the next useful work. The original supplied specification is preserved in `docs/BRIEF.md`.

The most valuable next iteration is a small observed usability test of the piano flow, followed by verified Canadian seller offers and accessory/return evidence. Replace local catalogue data behind the same pure selector when real sources are available. Robot sensors, delivery-date constraints, and pet safety remain deferred; do not imply they work.

Ponytail guided scope and architecture. The official project-local Impeccable Codex skill and hooks are installed under `.agents/` and `.codex/`; engine binaries and review captures are intentionally untracked. The detector's only initial findings were repeated Space Grotesk font warnings; that pairing follows the brief's example. No detector suite is added to CI. See `docs/VALIDATION.md` for final review evidence.

## Visual refresh

The `feat/comparr-inspired-redesign` branch adds a neutral, photo-led shopping UI in `src/redesign.css`, and sourced imagery in `src/domain/images.ts`. No decision logic or new infrastructure was introduced. Images are remotely hosted for demo purposes only; source links are in the Evidence tab. Replace remote images with licensed local assets before a public release. See `PROGRESS.md` for unverified work.
