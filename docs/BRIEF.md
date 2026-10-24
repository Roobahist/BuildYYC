# Codex Task: Build the First MVP of an AI Shopping Decision Assistant

## Mission

Build a polished, interactive MVP in:

https://github.com/Roobahist/BuildYYC

This is a BuildYYC startup prototype. Time is limited, and we will iterate on it step by step.

**Prioritize a compelling, genuinely functional user experience over production infrastructure.**

The product helps value-conscious shoppers make better purchasing decisions by uncovering hidden factors they might not know to consider, eliminating unsuitable products through intelligent follow-up questions, and ranking the remaining options using transparent, customizable scoring.

Our core insight:

**People don't always know what questions they should ask before buying something.**

Existing AI assistants often answer explicitly stated requirements while missing important factors such as return policies, accessory costs, physical compatibility, installation requirements, delivery deadlines, pet safety, or long-term expenses.

We want to solve that problem.

The experience should feel like a knowledgeable, unbiased shopping advisor that progressively narrows a decision until the remaining differences are largely personal preferences rather than overlooked deal-breakers.

## 1. Development Instructions

Use **Ponytail** and **Impeccable** throughout development.

- Ponytail: https://github.com/DietrichGebert/ponytail
- Impeccable: https://github.com/pbakaus/impeccable

Use their official Codex integrations or skills. If already installed, use them directly. Otherwise, install them using the official instructions.

Ponytail should guide implementation toward minimal, reusable code, avoiding unnecessary abstractions and infrastructure.

Impeccable should guide visual design, UX clarity, typography, interaction design, responsive layout, and a final design critique and polish pass.

Use **shadcn/ui** as the primary component system.

Prefer React, TypeScript, Vite, Tailwind CSS, shadcn/ui, and Lucide icons for this new frontend-only application, unless the repository already contains a suitable stack.

Before implementation, inspect the repository. Preserve any useful existing work.

Do not spend significant time on elaborate planning documents. Make reasonable implementation decisions autonomously and build the application.

No backend, database, authentication, payments, external AI API, real-time shopping API, or deployment infrastructure is required.

Use curated local mock data and deterministic logic.

The final result should run locally with simple installation and development commands.

### Engineering priorities

1. Working core interactions.
2. Correct hard-constraint filtering and scoring.
3. Intelligent, product-specific follow-up questions.
4. Clear explanations and evidence presentation.
5. Polished visual design.
6. Minimal tests for important decision logic.

Avoid unnecessary dependencies, excessive abstraction, complex state management, and overengineering.

Do not create elaborate CI pipelines. Prefer no GitHub Actions for this initial prototype. Use local build, typechecking, and a few focused unit tests.

## 2. The Core Experience

The product should not behave like a conventional product search website or merely wrap a chatbot.

Its main experience should be a **progressive decision-making workspace**.

The workflow:

**Describe the purchase → Initial shortlist → Discover hidden factors → Ask discriminating questions → Eliminate unsuitable options → Adjust preferences → Deterministic ranking → Final decision**

Users should always understand what the system is considering, why it asks a particular question, what happens when they answer, and why the final rankings change.

### Initial shopping input

Provide an elegant conversational entry point where users can describe what they want.

Examples:

- "I want a digital piano under $1,000."
- "I'm buying a couch for my apartment."
- "I need a sensor for my robot."
- "I'm buying a gift that needs to arrive before a birthday."

Because this is a demo without an LLM API, use predefined shopping scenarios and lightweight intent matching where useful.

Do not pretend arbitrary free-form requests are fully understood. Provide visible example prompts and make switching between supported demo scenarios easy.

Once the user selects a scenario, show an initial shortlist of approximately 4 to 6 products.

**Important:** Do not begin with a long questionnaire. First demonstrate that we have found plausible products, then investigate factors that could eliminate some of them.

## 3. Intelligent Hidden-Factor Discovery

This is the most important differentiator of the product.

After generating the shortlist, the assistant should proactively identify overlooked considerations relevant to the product category and user's situation.

Examples:

### Digital piano

- Does it include a stand?
- Does it include a bench?
- Are the pedals included?
- What additional accessories are needed?
- Does it support headphones?
- Can it be covered or protected from pets?
- What are the return conditions?
- How much does the complete setup actually cost?

### Couch

- Will it fit through the doorway?
- Can it turn through the hallway?
- Is assembly required?
- Are the legs removable?
- Is the upholstery appropriate for pets?
- What are the delivery and return costs?

### Robot sensor

- Is it compatible with the controller?
- Does it require adapters or additional hardware?
- Are cables and mounting accessories included?
- Does it require a specific operating voltage?
- What is the actual cost of getting it operational?

### Home fragrance or humidifier additive

- Is the product compatible with the device?
- Does the customer have pets?
- Are there ingredient-related safety concerns?
- Is sufficient information available to assess the risk?

### Gift shopping

- What is the delivery deadline?
- Can it arrive before that date?
- Is gift packaging available?
- Is it returnable or exchangeable?

These are examples, not a hardcoded list of questions that should appear in every situation.

Design a reusable category-driven factor system.

## 4. Ask Questions That Actually Narrow the Decision

This is critical.

**The assistant should prioritize questions whose answers could eliminate or meaningfully distinguish products already in the shortlist.**

Do not ask generic questions just to make the interface look conversational.

Imagine six digital pianos have been shortlisted.

Three include a stand and three do not.

The assistant might ask:

"Do you need the stand included, or are you willing to purchase one separately?"

Explain the relevance:

"Requiring an included stand would eliminate 3 of your 6 options."

When the user answers, immediately update the shortlist and show what happened.

Another example:

"Is easy returnability a requirement?"

If the user activates it, two products with confirmed noncompliant return policies might become excluded.

### Question selection logic

Create a deterministic question-selection engine using curated category metadata.

Questions should be prioritized based on:

- How many currently eligible products could be eliminated by different answers.
- How significantly the factor affects the purchasing decision.
- Whether the factor represents a potential hard blocker.
- Whether it relates to hidden costs, compatibility, safety, or important practical limitations.
- Whether the question has already been answered or its answer is already known.

A simple information-gain or expected-elimination heuristic is sufficient for the MVP.

Avoid asking questions for which every product has the same outcome, unless an important uncertainty or safety consideration genuinely requires clarification.

If the user indicates that a factor is irrelevant, record that preference and avoid asking it again.

Allow questions to be skipped.

As the user answers, subsequent questions should adapt to the remaining products.

When no further high-impact discriminating questions remain, communicate that the major objective constraints have been addressed and the remaining decision is primarily a matter of preference.

Do not claim complete certainty when important information is still unknown.

## 5. Hard Blockers and Flexible Preferences

Every relevant product factor should be capable of supporting one or both of these roles where appropriate:

**Hard constraint:** A requirement that determines whether a product can remain eligible.

**Scoring criterion:** A preference that affects the relative ranking of eligible products.

These roles must be independent.

### Example: Price

A user might:

- Set an absolute maximum total budget of $1,000.
- Also assign price a high importance rating so cheaper products score better.
- Or assign price zero importance after applying the budget constraint, meaning all products below $1,000 are treated equally on price.

This should be possible without awkward workarounds.

### Example: Weight

The user might:

- Require weight below 15 kg.
- Prefer lighter options, but not consider it mandatory.
- Ignore weight entirely.

### Example: Returnability

The user might:

- Require at least a 30-day return window.
- Treat return flexibility as a weighted preference.
- Ignore return policy when ranking.

### Required functionality

Each applicable factor should expose:

1. An optional hard-constraint control.
2. A constraint value when applicable.
3. An independent importance weight for scoring.
4. An explanation of what the factor means.
5. An explanation of how it affects the shortlist.

Users must be able to activate, deactivate, and edit these controls at any time.

Changing an earlier answer must correctly recalculate all subsequent product eligibility and rankings.

## 6. Factor Types and Appropriate Controls

Do not represent every preference as a text input or an identical slider.

Implement a reusable factor schema that determines which control is appropriate.

| Factor type | Example | UI control |
|---|---|---|
| Numeric maximum | Price, weight | Slider with editable number |
| Numeric minimum | Battery life, warranty | Slider or number input |
| Numeric range | Dimensions, screen size | Range controls |
| Boolean | Headphone support, included stand | Switch or checkbox |
| Single selection | Material, connection type | Radio group or select |
| Multiple selection | Required ports, supported protocols | Multi-select |
| Date | Delivery deadline | Date picker |
| Ordinal | Durability, portability | Rating scale |
| Unknown / uncertain | Unverified compatibility | Verification status |

Hard-constraint values and preference weights should not be conflated.

For scoring, provide a consistent, easy-to-understand importance control, such as a compact 0 to 5 scale.

The interface should make it obvious that:

- Zero means the factor does not influence ranking.
- Higher values increase its influence.
- A hard requirement remains enforced regardless of the scoring weight.

## 7. Deterministic Weighted Ranking

The ranking must not be an arbitrary AI-generated score.

Build a deterministic, explainable scoring engine.

Each product has normalized scores for relevant factors, on a 0 to 100 scale.

For example:

- Value for money: 85
- Performance: 92
- Portability: 65
- Durability: 80
- Return flexibility: 70

The assistant provides sensible initial importance weights for the selected category and shopping context.

The customer can modify them freely.

Use a weighted mean:

`Overall score = Σ(factor score × factor importance) / Σ(active factor importance)`

Multiply or format as needed to display a final score out of 100.

### Important requirements

- Hard blockers are evaluated before scoring.
- Only eligible products participate in the main ranking.
- Factors with zero importance do not influence the score.
- The same inputs must always produce the same result.
- Scores must update immediately when weights change.
- Show the important contributors to each product's score.
- Clearly identify subjective or illustrative scores.
- Use sensible normalization and scoring direction for each factor.
- Do not silently assign zero or an invented neutral value to unknown information.
- Show missing-data or scoring-coverage information where relevant.
- Use stable tie-breaking.

For this demo, curated base factor scores are acceptable, provided they are consistently applied and clearly identified as illustrative.

### Explain ranking changes

When a customer changes a weight or constraint, explain the change in plain language.

For example:

"Model B moved above Model A because you increased the importance of portability."

Or:

"Model C is no longer eligible because it exceeds your maximum total budget."

Allow users to inspect a simple scoring breakdown.

The scoring system should be implemented as pure reusable TypeScript functions, separate from React components.

## 8. Preserve Eliminated Products

**Never permanently remove a discovered product from the visible decision history.**

Instead, maintain two groups:

- Eligible products.
- Excluded products.

Eligible products remain prominent and are ranked by their scores.

Excluded products appear in a visually subdued, collapsible section.

For example:

"3 products excluded by your requirements"

An excluded product must clearly display the reason or reasons it was removed:

- Exceeds budget.
- Does not include a required accessory.
- Confirmed incompatibility.
- Does not meet return requirements.
- Cannot meet the selected delivery deadline.

Users should be able to expand the excluded products and inspect them.

They should also be able to modify or disable the responsible constraint and see the product return to the eligible shortlist.

### Unknown information

Distinguish three states:

- Meets the requirement.
- Confirmed to violate the requirement.
- Cannot be verified from available information.

A product with unknown compatibility or an unknown return policy must not be presented as confidently compliant.

For the MVP, provide a clear "Needs verification" state for such cases.

Avoid treating unverified information as proof of either compliance or noncompliance.

## 9. Evidence, Sources, and Confidence

Our ideal customers want recommendations supported by evidence.

The product must show **why a claim was made and what evidence supports it**.

Create a reusable evidence model that can hold:

- Claim.
- Source title.
- Source URL.
- Source type.
- Date, when known.
- Evidence confidence.
- Brief explanation of relevance.
- Limitations of the source.

Supported source types might include:

- Official manufacturer documentation.
- Retailer product specifications and policies.
- Independent reviews.
- YouTube product reviews.
- Reddit discussions.
- Amazon customer reviews.
- Other reputable sources.

### Evidence presentation

On product cards, hidden-factor explanations, and comparison details, provide an unobtrusive way to inspect the evidence.

For example:

"Stand sold separately"

"Source: manufacturer product page"

Or:

"Users report difficulty moving this couch through narrow doorways."

"Evidence: limited, based on a small number of anecdotal reports."

Where genuine links are available, users should be able to open the original source directly.

### Confidence handling

Do not treat every source as equally trustworthy.

Consider:

- Whether the source is primary or secondary.
- Whether it directly supports the specific claim.
- Number of independent sources.
- Agreement or disagreement between sources.
- Publication date and current relevance.
- Whether the evidence is subjective or measurable.
- Whether the content might be promotional, manipulated, or incentivized.

One anonymous Reddit comment must not outweigh documented manufacturer specifications.

Manufacturer specifications can be strong evidence for dimensions and included accessories, but are not necessarily unbiased evidence for subjective quality.

Use descriptive confidence levels such as High, Medium, Low, and Unknown, with a brief explanation.

Do not invent statistically meaningful confidence percentages.

### Important demo integrity requirement

Because the product uses mock data:

- Label illustrative product prices, scores, and assumptions clearly.
- Never fabricate customer quotes, review counts, review consensus, or source URLs.
- Use genuine direct source URLs only when they have actually been checked and support the relevant claim.
- Where possible, manually include a few verified manufacturer, YouTube, Reddit, or retailer review links for the curated demonstration products.
- Do not misrepresent search-result URLs as direct evidence.
- When evidence is unavailable, show that transparently.
- You may provide clearly labelled "Find supporting reviews" search links, but those are discovery links, not citations.

A convincing transparent interface with a few strong real references is better than a large fake evidence database.

## 10. Hidden and Total Costs

Show users that the listed product price is not necessarily the complete purchase cost.

For example:

Digital piano: $750

- Required stand: $120
- Bench: $75
- Shipping: $40
- Estimated complete setup: $985

All these figures may be illustrative for the demo and must be labelled appropriately.

Model cost components individually, including whether they are required, optional, already included, or unknown.

For eligible categories, compute a total estimated acquisition cost.

If the user already owns an accessory, allow that to affect the relevant requirements or total cost.

If a cost is unknown, do not silently assume zero.

Use estimated total acquisition cost when evaluating budget constraints if that is the selected budget definition.

Make hidden costs a meaningful part of the comparison, not just a decorative footnote.

## 11. Avoid Overwhelming the User

Some product categories may have dozens of relevant factors.

Do not show all of them simultaneously.

Use progressive disclosure and meaningful grouping.

Potential groups:

- Price and total cost
- Essential capabilities
- Compatibility
- Practical constraints
- Delivery and returns
- Safety
- Long-term ownership
- Personal preferences

The assistant should proactively surface the most important overlooked factors first.

Show the rest in an expandable "All considerations" or "Fine-tune preferences" section.

Display a manageable number of follow-up questions, preferably one prominent question at a time.

Provide subtle progress indicators, such as:

"6 options → 4 eligible → 2 strong matches"

The point is to make the decision feel increasingly simple, not to turn the product into an enormous settings dashboard.

Allow advanced users to open a complete preferences panel whenever they want.

Preserve all answered questions and previous choices in an editable summary.

## 12. Product Interface and Layout

Create a polished application, not a generic landing page with a chatbot attached.

A suggested layout:

### Initial screen

A distinctive brand identity, concise value proposition, elegant shopping input, and curated demo scenarios.

Example headline:

**Know what you're really buying.**

Supporting copy:

"Discover the hidden costs, deal-breakers, and trade-offs before you decide."

Provide a prominent way to start a sample purchasing journey.

### Decision workspace

After choosing a scenario, transition to an interactive workspace.

The layout should provide:

**Shopping context**

A compact overview of what the customer is buying, budget, and active requirements.

**Intelligent questions**

A prominent panel that identifies important missing information and asks the next useful question.

**Product shortlist**

Visually rich product cards showing prices, total costs, strengths, weaknesses, scores, and eligibility.

**Preference controls**

A structured, editable panel with hard blockers and scoring weights.

**Evidence and explanation**

Expandable details showing how recommendations are justified.

**Excluded products**

A subdued but accessible section showing products removed by constraints.

**Final comparison**

Once critical questions have been resolved, provide a clear side-by-side comparison emphasizing the remaining trade-offs.

The final recommendation should not imply a single objectively correct choice when multiple products meet the hard requirements.

Instead, communicate which option scores highest under the currently selected priorities and why.

## 13. Visual Direction and Branding

Use shadcn/ui as the design-system foundation, but customize it substantially.

The design should look like a thoughtful, high-quality consumer decision product, not an admin dashboard or generic AI SaaS template.

Create a coherent provisional brand, including:

- Product name and wordmark.
- Memorable but restrained identity.
- Consistent typography.
- Semantic color system.
- Thoughtful iconography.
- Clear visual hierarchy.
- Polished hover, focus, selection, transition, and empty states.

### Inspiration from the BuildYYC workshop presentations

The supplied presentations combine several useful design qualities:

- Strong typographic hierarchy.
- Dark, high-contrast panels.
- Bright cyan, violet, and occasional green accents.
- A warm off-white background with near-black text in the GTM deck.
- Limited orange accents used to direct attention.
- Distinctive, deliberate use of color rather than excessive decoration.

Use these as creative inspiration, not as a template to reproduce.

A potentially strong direction is a warm light primary interface with deep charcoal/ink panels and selective electric cyan, violet, and orange accents.

The site does not need to be entirely dark.

### Typography

Do not use the browser's default font or automatically default to Inter.

Choose a purposeful font pairing appropriate for a modern consumer product.

For example:

- Space Grotesk or another distinctive display font for headings.
- DM Sans or another highly readable font for the main interface.
- A restrained monospaced font for technical scores or evidence metadata.

Choose what looks best together and apply it consistently.

### Color semantics

Use color meaningfully:

- Positive or verified status.
- Caution and unresolved questions.
- Confirmed blockers.
- Interactive emphasis.
- Brand accents.

Do not use random colors for every product card or factor.

Make the distinction between eligible, excluded, and uncertain products visually obvious without relying only on color.

### Design quality

Avoid:

- Generic purple-gradient AI landing pages.
- Excessive nested cards.
- Oversized rounded corners everywhere.
- Unnecessary glassmorphism.
- Decorative UI without functional meaning.
- Walls of text.
- Too many simultaneously prominent controls.
- Low-contrast metadata.
- Huge amounts of empty space that make the application cumbersome.

Aim for a refined, modern, approachable, information-dense-but-readable design.

Use Impeccable to critique and polish the finished screens.

Test desktop and mobile layouts.

## 14. Mock Data and Demo Scenarios

Use sufficiently rich local datasets for the interaction to feel convincing.

Do not hardcode individual product logic inside components.

Build reusable category, factor, question, product, evidence, and scoring data structures.

Suggested scenarios:

### Primary demo: Digital pianos

Approximately 5 to 7 sample products with meaningful variation in:

- Price.
- Accessory completeness.
- Key action.
- Sound and features.
- Portability.
- Headphone support.
- Warranty and returns.
- Estimated total cost.

Make this the most polished scenario.

### Second demo: Couches

Approximately 4 to 6 products varying in:

- Dimensions.
- Packaging dimensions.
- Assembly requirements.
- Upholstery.
- Removable components.
- Return conditions.
- Delivery costs.
- Physical access constraints.

Include a meaningful hallway or doorway question.

Do not claim a couch will definitely fit merely by comparing one dimension. Treat uncertain turning clearance as requiring verification.

### Third demo: Robot sensors

Approximately 4 to 6 sample products varying in:

- Interface.
- Voltage.
- Compatibility.
- Included accessories.
- Mounting requirements.
- Performance.
- Total setup cost.

Include a question that can eliminate technically incompatible products.

### Additional context-driven demonstrations

If practical, support a simple gift-delivery constraint and a pet-related safety consideration.

For safety-sensitive factors, show unresolved risk or a recommendation to verify, rather than inventing safety clearance.

**Implementation priority:** Two deeply functional scenarios with reusable category logic are preferable to five attractive but nonfunctional scenarios. Add further scenarios only after the primary experience works.

## 15. Architecture

Keep the architecture small and extensible.

A reasonable structure is:

- Typed mock data.
- Category and factor definitions.
- Pure eligibility/filtering logic.
- Pure scoring logic.
- Question selection logic.
- Small centralized shopping-session state.
- Reusable React UI components.
- Shared design tokens and shadcn primitives.

Separate domain logic from presentation.

Use dependency injection where it actually improves reusability, particularly for supplying catalogue data, factor definitions, and question strategies.

Prefer one clear orchestration function or selector that derives the current decision state from:

- Available products.
- Category metadata.
- User answers.
- Active hard constraints.
- Scoring weights.

That function should produce:

- Eligible products.
- Excluded products with reasons.
- Products needing verification.
- Weighted rankings.
- Score breakdowns.
- Recommended next question.
- Remaining unresolved concerns.

Do not introduce unnecessary design patterns, application frameworks, or extensive service layers.

A simple React context, reducer, or lightweight store is sufficient.

For demo convenience, consider preserving session state in localStorage, but do not let persistence become a major implementation task.

## 16. Required Functional Interactions

Every major visible control should work.

At minimum, demonstrate:

1. Choose a purchasing scenario.
2. See an initial product shortlist.
3. Receive a relevant hidden-factor follow-up question.
4. Answer the question.
5. See products excluded or retained based on the answer.
6. Understand why each product was excluded.
7. Disable or modify a hard constraint.
8. See previously excluded products return.
9. Change a scoring weight.
10. See the eligible products deterministically reorder.
11. Include or exclude price from the weighted score independently of its budget constraint.
12. Inspect an individual product's score breakdown.
13. Inspect evidence and confidence indicators.
14. Expand the excluded-products section.
15. See estimated hidden costs.
16. Reach a final comparison state with remaining trade-offs.

These must not be static mockups where buttons are visually present but do nothing.

If a functionality cannot be implemented in time, omit the control rather than leaving an inert element.

## 17. Tests and Validation

Keep tests minimal but meaningful.

Prioritize focused tests for:

- Hard-constraint filtering.
- Reversible exclusions.
- Price used independently as blocker and scoring factor.
- Weighted ranking changes.
- Stable deterministic scoring.
- Unknown or missing information handling.
- Question selection among products with different attributes.
- Correct recalculation after user changes an earlier answer.

No elaborate end-to-end test infrastructure is required.

Ensure the project builds and typechecks.

If browser inspection or screenshot tools are available, visually verify the key states:

- Initial screen.
- Initial shortlist.
- Follow-up question with elimination preview.
- Shortlist after applying a blocker.
- Updated ranking after changing weights.
- Expanded evidence details.
- Mobile layout.

Use Impeccable for a targeted design critique and polish pass.

Avoid adding Impeccable's full detector suite to CI unless trivial to configure. Local design review is sufficient.

## 18. What Not to Build Yet

Do not spend time on:

- Real LLM integrations.
- Product scraping or external shopping APIs.
- Backend services.
- Databases.
- Authentication.
- User profiles.
- Payment systems.
- Affiliate tracking.
- Production deployment.
- Heavy CI/CD.
- Comprehensive analytics.
- Real-time inventory or delivery integrations.
- A complex multi-agent architecture.
- Large amounts of documentation.
- Excessive animations.

The prototype should demonstrate the **decision-making experience**, not production readiness.

## 19. Acceptance Criteria

The result is successful if I can demonstrate the following to someone unfamiliar with the product:

I start by looking for a digital piano.

The application shows a reasonable shortlist.

It proactively asks something I might not have considered, such as whether I need an included stand and bench.

I answer, and some products become ineligible.

The application explains exactly why those products were removed.

I change the constraint, and the products return.

I then indicate that portability is very important and price is moderately important.

The rankings update deterministically, and I can inspect why.

I decide price should only act as a maximum budget, not influence the ranking among affordable products.

I set the price scoring weight to zero while keeping the budget filter enabled.

The rankings update correctly.

I inspect a shortlisted product and discover that its listed price excludes required accessories.

The assistant shows the additional costs and how they affect my budget.

I can inspect the sources or see transparently that some information is illustrative or unverified.

Eventually, I am left with a small number of viable products whose remaining differences mostly reflect my personal priorities.

The interface feels polished, understandable, trustworthy, and pleasant to use.

That is the MVP.

## 20. Execution Approach

Implement this directly in the BuildYYC repository.

Work in this order:

1. Inspect the repository and initialize the minimal frontend if necessary.
2. Establish the brand direction and shadcn design foundation.
3. Create typed sample data and factor definitions.
4. Implement filtering, scoring, and question-selection logic.
5. Build the initial shopping interface.
6. Build the interactive decision workspace.
7. Connect the controls to the real deterministic domain logic.
8. Add explanations, hidden costs, evidence, and excluded-product visibility.
9. Test important interactions and fix issues.
10. Apply an Impeccable design review and polish the result.

Do not stop after producing a plan. Implement the first working version.

Keep the code structured enough that later iterations can replace mock data with real product APIs or AI reasoning without rewriting the UI and decision engine.

At the end, provide:

- A concise summary of the implemented experience.
- What actually works.
- What is simulated.
- Local run commands.
- Any important limitations.
- The most valuable next iteration.

**Final priority:** If time or complexity forces trade-offs, preserve the interactive discovery → elimination → weighted ranking experience above everything else. This is our core product advantage.