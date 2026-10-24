---
name: "Considered"
description: "A calm shopping decision workspace with transparent trade-offs."
colors:
  primary: "#214b48"
  primary-foreground: "#f5fbf5"
  background: "#f7f6f2"
  paper: "#fffefa"
  ink: "#182b2c"
  muted-text: "#566463"
  secondary: "#e2eee6"
  muted-surface: "#e9ece5"
  accent: "#d9eeea"
  accent-foreground: "#173b3c"
  cyan: "#bdecea"
  cyan-hover: "#a7dad6"
  border: "#d9ded8"
  input: "#c7cfc7"
  ring: "#3c7168"
  focus: "#347769"
  positive: "#246044"
  positive-bg: "#e7f1e9"
  caution: "#80530f"
  caution-bg: "#fff0d3"
  destructive: "#934538"
  preview-surface: "#eeeee6"
  dark-panel-text: "#eff6ef"
  dark-panel-muted: "#c6d7cf"
  dark-panel-hover: "#2e4544"
typography:
  display:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(58px,6.5vw,88px)"
    fontWeight: 500
    lineHeight: 1.04
    letterSpacing: "-.04em"
  headline:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(28px,3vw,40px)"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-.035em"
  question:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "clamp(23px,2.3vw,30px)"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-.03em"
  title:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "25px"
    fontWeight: 500
    letterSpacing: "-.035em"
  body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "12px"
    fontWeight: 500
  metadata:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "12px"
    lineHeight: 1.6
rounded:
  tag: "5px"
  sm: "6px"
  field: "7px"
  md: "8px"
  entry: "10px"
  lg: "12px"
  xl: "16px"
  pill: "9999px"
spacing:
  "4": "4px"
  "8": "8px"
  "10": "10px"
  "12": "12px"
  "14": "14px"
  "16": "16px"
  "18": "18px"
  "20": "20px"
  "22": "22px"
  "24": "24px"
  "25": "25px"
  "28": "28px"
  "30": "30px"
  "32": "32px"
  "35": "35px"
  "40": "40px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "36px"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "36px"
  button-secondary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.primary}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "36px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
    height: "36px"
  button-question:
    backgroundColor: "{colors.cyan}"
    textColor: "{colors.accent-foreground}"
    rounded: "{rounded.md}"
    height: "40px"
  button-question-hover:
    backgroundColor: "{colors.cyan-hover}"
  input-budget:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.field}"
    padding: "10px 12px"
  constraint-chip:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.primary}"
    rounded: "{rounded.tag}"
    padding: "4px 9px"
  product-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
  question-panel:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.dark-panel-text}"
    rounded: "{rounded.lg}"
    padding: "25px 28px 26px"
---

# Design System: Considered

## Overview

**Creative North Star: "A calm consumer buying notebook"**

A calm consumer buying notebook translated into a working web app: warm paper, deep green-black ink, generous typographic hierarchy, close reading of costs, and a small cyan interaction accent. Familiar buttons, switches, sheets, and comparison tables stay familiar. The signature is a live decision trail, with exclusions preserved below.

This remains the provisional identity chosen under the supplied brief’s authorization to make reasonable decisions. The Impeccable direction seed was executed (`seed:3f3d99686eab184c`); the brief’s warm-light/ink/accent direction took precedence over random alternatives. No image comp or aesthetic approval round was conducted because the user requested autonomous implementation and a working MVP. This source-derived record merges the shipped system into that direction; it does not imply user approval of a comp.

**Key Characteristics:**
- Warm paper surfaces with dark ink and restrained cyan actions.
- Familiar controls, readable costs, and compact supporting metadata.
- Visible, reversible decision history and honest uncertainty.

## Colors

The palette combines warm neutral paper with green-black ink; cyan supports the focal decision action. The frontmatter records reused source colors; incidental illustration colors are product data rather than brand tokens. Sidecar tonal ramps are synthesized, non-normative panel previews; they do not add colors to the shipped palette.

### Primary

- **Deep Green:** ordinary primary buttons, fit scores, active requirements, and links.
- **Question Cyan:** affirmative actions in the dark question panel and the entry insight illustration.
- **Soft Green / Pale Cyan:** selected or secondary controls and interactive hover surfaces.

### Neutral

- **Warm Background / Paper:** page canvas and reading surfaces.
- **Deep Ink / Muted Text:** headings and quieter explanations.
- **Fine Border / Input:** divisions and control boundaries.
- **Preview Surface:** muted product illustration and tab backing.
- **Dark Panel Text / Muted:** readable foregrounds inside ink panels.

Positive green, caution amber, and destructive rust communicate confirmed outcomes or uncertainty alongside words and icons. The defined caution background is used by storage notices; do not assume every verification label has a colored fill.

**The Useful Accent Rule.** Reserve cyan for the next meaningful question action and its dark-panel context; use deep green for ordinary primary controls.

## Typography

**Display Font:** self-hosted Space Grotesk, sans-serif fallback, with weights 500/600/700 available.
**Body Font:** self-hosted DM Sans, sans-serif fallback, with weights 400/500/600/700 available.

Space Grotesk gives headings and cost figures a distinctive, compact shape. DM Sans carries practical explanations and dense interactive controls. Font imports are in `src/main.tsx`.

### Hierarchy

- **Display:** the frontmatter display role is the desktop landing headline. Mobile uses `clamp(54px,12vw,72px)` with a 1.03 line height; the 601–850px layout uses 76px.
- **Headline:** the workspace title uses the headline role, becoming 31px at the narrow breakpoint.
- **Question:** the focal question uses the question role, becoming 26px on narrow screens.
- **Title:** dialog/sheet headings use the title role; card names use 21px desktop and 24px narrow-screen type.
- **Body:** 14px is used in entry fields and detail rows; explanatory workspace text commonly uses 13px. Browser-default base text is 16px. Paragraphs use 1.6 line height unless locally overridden.
- **Label / Metadata:** supporting copy and most workspace controls use 12px. Numeric budget fields and score rows use tabular numerals where defined.

**The Reading Hierarchy Rule.** Use Space Grotesk for headings and prominent numbers, and DM Sans for explanations, labels, and controls. Keep supporting text at the implemented 12px minimum.

## Layout

The centered app shell caps at 1600px. Desktop page insets are 5.5%; the landing hero uses two columns (1.08fr / 1fr), while the workspace pairs flexible decision content with a 260px priorities column and 32px gap. Product cards form a two-column grid with 20px gaps. The priorities column sticks 28px from the top.

At 1450px and above, the priorities column becomes 280px with a 45px gap. At 1100px and below it becomes 230px with a 23px gap. At 850px and below, content stacks as question, change notice, priorities, then products; priorities stop sticking. At 600px and below, product cards become a single column, question actions stack, and primary question actions are at least 44px tall. The landing stacks at 850px; narrow page insets use 5–6%. The body supports a 320px minimum width.

Spacing is a practical rhythm of small within-group gaps and larger panel separations, not a strict single-unit scale. Reused values are captured in the frontmatter. Comparison tables retain a 580px minimum width in a focusable horizontal scroll region; the scroll hint appears at 700px and below.

## Elevation & Depth

Workspace cards are flat at rest, with subtle border changes on hover. The entry preview pairs two slightly rotated surfaces with diffuse shadows. Depth elsewhere is restrained: field shadow (`0 4px 15px #182b2c05`), entry insight shadow (`0 14px 28px #182b2c14`), and priority slider-thumb shadow (`0 1px 4px #182b2c25`). Dialogs and sheets retain the shadcn overlay and shadow behavior.

**The Flat Surface Rule.** Use borders and tonal surfaces to organize the workspace; reserve diffuse depth for the entry illustration, fields, controls, and overlays.

Control color, border, and shadow changes use 180ms ease transitions; product borders use 200ms. Sheets use 500ms opening and 300ms closing; dialogs use 200ms. Reduced-motion preference reduces transitions and animations to .01ms, one iteration, with automatic scrolling.

## Shapes

Product cards, the focal question, and entry preview surfaces use gently curved 12px corners. Standard buttons use 8px; budget/select fields use 7px; constraint chips and rank labels use 5px. The entry input enclosure uses 10px. Rounded-full shapes belong to badges, switches, slider thumbs, status dots, and the circular brand symbol. Thin borders and dividers organize reading surfaces.

## Components

### Buttons

Familiar, compact controls pair words with Lucide icons. The source library provides primary, outline, secondary, ghost, link, and destructive variants; the shipped flows chiefly use the first five. Default buttons are 36px tall, with 32px small and 40px large variants. Product actions override this to 35px desktop and at least 40px mobile. Primary hover uses 90% primary color; outline/ghost hover uses the pale accent. Disabled buttons reduce opacity to 50% and suppress pointer actions. Visible focus uses the source ring and border treatments.

### Chips

Active requirement chips are removable, soft-green rectangles with 5px corners, a text label, and a Lucide close icon. Their hover background is `#cbded0`. Rank labels share the compact silhouette; the top scored match uses deep green, while Unranked retains the neutral style.

### Cards / Containers

Paper product cards use a fine border, clipped illustration region, and 18px body padding on desktop. Body padding becomes 20px on narrow screens and 22px on large screens. Every illustration is explicitly labelled abstract; cost, trade-off, verification, and actions stay separate readable rows. Needs-verification is an amber text/icon treatment.

### Inputs / Fields

Entry and budget inputs sit in bordered paper enclosures with a green focus-within outline and 2px offset. The entry enclosure shows destructive rust when validation fails; the associated error is visible text. Native selects, number fields, checkboxes, shadcn switches, and sliders retain familiar behavior. Hard requirements and importance weights remain independently controlled.

### Navigation

The header pairs the Space Grotesk wordmark with the How it works action and demo badge. The badge hides at the narrow breakpoint. The workspace adds a back action and native scenario selector. The decision trail communicates discovered, eligible, and excluded counts with text and chevrons; it is status rather than a tab bar.

### Decision panel and disclosures

The ink question panel pairs a large question with supporting explanation, potential exclusions, and cyan affirmative action; secondary and skip controls remain quieter. Change feedback appears immediately below in a polite status region. Native details preserve excluded options and decision notes. Product detail dialogs, comparison dialogs, and the considerations sheet use Radix/shadcn focus protection; the source bounds their height and scrolls long content.

## Do's and Don'ts

### Do:
- **Do** preserve excluded products in a subdued, inspectable disclosure with explicit reasons and a reversible action.
- **Do** distinguish a hard requirement from its independent scoring importance.
- **Do** label abstract product illustrations, illustrative scores, and needs-verification states in text.
- **Do** show Unranked when a score is unavailable and avoid a highest-fit claim for those options.
- **Do** use Lucide SVG icons beside meaningful labels and preserve visible keyboard focus.

### Don't:
- **Don’t** present fit scores as evidence confidence or unknown facts as confirmed compliance.
- **Don’t** turn the landing illustration’s slight rotation into a workspace card treatment.
- **Don’t** add redundant category kickers or eyebrows above headings.
- **Don’t** use glyph characters as interface icons.

<!-- Source record: src/index.css, src/main.tsx, src/App.tsx, src/components/Preferences.tsx, src/components/ProductView.tsx, and src/components/ui/*.tsx. Not canonized: unused legacy eyebrow selectors do not establish a component; nine source-detector font warnings were intentionally retained because the supplied brief names Space Grotesk. The detector was not rerun during documentation. -->
