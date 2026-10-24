import type { Category, Cost, Evidence, Factor, Product } from './types.ts'

const checked = '2026-10-24'
const assumptions: Evidence = {
  id: 'illustrative', claim: 'Prices, bundle contents, returns, delivery fees, and preference scores are curated demo assumptions.',
  title: 'Considered demonstration catalogue', type: 'Demo assumption', confidence: 'Unknown',
  relevance: 'Makes the decision flow testable without live shopping data.', limitation: 'Not a retailer offer, review, or evidence of current availability. Verify every purchase detail with the seller.',
}
const fp10: Evidence = {
  id: 'fp10-official', claim: 'The FP-10 has a headphone output; its dedicated stand is sold separately.',
  title: 'Roland FP-10 — specifications and accessories', url: 'https://www.roland.com/us/products/fp-10/',
  type: 'Manufacturer', checkedAt: checked, confidence: 'High',
  relevance: 'Supports quiet-practice capability and the need to check stand costs.',
  limitation: 'Applies to the base instrument, not retailer bundles, local prices, or return policies. Manufacturer claims do not establish subjective quality.',
}
const fp30: Evidence = {
  id: 'fp30-official', claim: 'The base FP-30X has two headphone outputs. Its KSC-70 stand is optional.',
  title: 'Roland FP-30X — specifications', url: 'https://www.roland.com/us/products/fp-30x/',
  type: 'Manufacturer', checkedAt: checked, confidence: 'High',
  relevance: 'Supports headphone capability; our complete bundle is an illustrative seller configuration.',
  limitation: 'Does not validate this demo bundle, its price, delivery, or returns. Accessories must be checked with the seller.',
}
const kawai: Evidence = {
  id: 'kawai-official', claim: 'The ES120 product overview lists Responsive Hammer Compact action and a 12.5 kg body.',
  title: 'Kawai ES120 — product overview', url: 'https://www.kawai-global.com/en/products/digitalpianos/es/es120/',
  type: 'Manufacturer', checkedAt: checked, confidence: 'Medium',
  relevance: 'Provides a primary reference for its action and portable design.',
  limitation: 'The same page also mentions 12 kg in another section. Confirm the exact model weight; prices and this demo offer are illustrative.',
}

const pianoCosts = (bundled: boolean, shipping: number | null): Cost[] => [
  { id: 'stand', label: 'Stable stand', amount: bundled ? 0 : 120, status: bundled ? 'included' : 'required', ownable: true },
  { id: 'bench', label: 'Piano bench', amount: bundled ? 0 : 75, status: bundled ? 'included' : 'required', ownable: true },
  { id: 'pedal', label: 'Sustain pedal', amount: 0, status: 'included' },
  { id: 'shipping', label: 'Delivery', amount: shipping, status: 'required' },
  { id: 'headphones', label: 'Headphones', amount: 45, status: 'optional', ownable: true },
]

const price: Factor = { id: 'price', label: 'Price', explanation: 'A maximum budget is a hard limit. Price importance independently rewards lower costs. Changing the budget basis also changes which cost is scored.', kind: 'max', min: 0, max: 2000, step: 25, defaultValue: 1000, defaultWeight: 3, scoring: 'lower', unit: 'CAD' }
const returns: Factor = {
  id: 'returnDays', label: 'Return window', explanation: 'Illustrative return windows only. Restocking fees, return shipping, and retailer-specific conditions need verification. Unknown policies never count as confirmed compliance.',
  kind: 'min', min: 0, max: 90, step: 1, unit: 'days', defaultValue: 30, defaultWeight: 1, scoring: 'higher',
  question: { title: 'Do you need at least 30 days to decide?', why: 'Trying a product at home can change your mind. A return window is only useful if the conditions work for you.', priority: 6, yes: 'Require 30-day returns', no: 'Keep returns flexible', critical: true },
}

const pianoFactors: Factor[] = [
  price,
  { id: 'includesStand', label: 'Stand included', explanation: 'Requires the stand to be part of the offer. A separate stand still contributes to setup cost unless you already own one. Bundle contents are illustrative.', kind: 'boolean', defaultValue: true, defaultWeight: 1, scoring: 'boolean',
    question: { title: 'Will you need a stand included?', why: 'A piano on its own is not a complete setup. Some offers include a stand; others add a separate purchase.', priority: 10, yes: 'Yes, include a stand', no: 'I can buy one separately' } },
  { id: 'includesBench', label: 'Bench included', explanation: 'Requires a bench in the offer. A separate bench costs an illustrative $75 unless already owned.', kind: 'boolean', defaultValue: true, defaultWeight: 0, scoring: 'boolean',
    question: { title: 'Should a bench come with it, too?', why: 'A comfortable playing height matters. A bench can be an overlooked extra expense.', priority: 7, yes: 'Require an included bench', no: 'A separate bench is fine' } },
  { id: 'performance', label: 'Playing experience', explanation: 'An illustrative 0–100 assessment of action, sound, and practice features; not an independent review or measured benchmark.', kind: 'ordinal', min: 0, max: 100, step: 5, defaultValue: 70, defaultWeight: 4, scoring: 'curated', unit: '/100' },
  { id: 'portability', label: 'Portability', explanation: 'Illustrative 0–100 score for easy storage and moving. Use the separate weight requirement for an absolute carrying limit.', kind: 'ordinal', min: 0, max: 100, step: 5, defaultValue: 70, defaultWeight: 2, scoring: 'curated', unit: '/100' },
  { id: 'weightKg', label: 'Instrument weight', explanation: 'Instrument body weight, not the entire setup. Most values are illustrative; exact weights and safe carrying need checking.', kind: 'max', min: 0, max: 50, step: 0.5, defaultValue: 15, defaultWeight: 0, scoring: 'lower', unit: 'kg',
    question: { title: 'Will you be moving it regularly?', why: 'Console-style pianos can be a very different moving job. A 15 kg instrument limit can narrow the options.', priority: 5, yes: 'Keep it at 15 kg or less', no: 'It will stay in one place' } },
  returns,
  { id: 'headphones', label: 'Headphone support', explanation: 'Confirms a wired headphone connection for quiet practice. Bluetooth MIDI does not mean Bluetooth headphone audio.', kind: 'boolean', defaultValue: true, defaultWeight: 0, scoring: 'boolean',
    question: { title: 'Is quiet practice essential?', why: 'A headphone connection helps with shared spaces. Unchecked specifications still need verification.', priority: 4, yes: 'Require headphone support', no: 'Not a requirement', critical: true } },
]

function piano(p: {
  id: string; name: string; maker: string; subtitle: string; price: number; bundled: boolean; bench?: boolean; weight: number; performance: number; portability: number; returns: number | null; shipping: number | null; color: string; visual?: 'portable' | 'console'; strengths: string[]; tradeoff: string; evidence?: Evidence[]; headphones?: boolean | null
}): Product {
  const bench = p.bench ?? p.bundled
  const costs = pianoCosts(p.bundled, p.shipping).map(c => c.id === 'bench' ? { ...c, amount: bench ? 0 : 75, status: bench ? 'included' as const : 'required' as const } : c)
  return {
    id: p.id, name: p.name, maker: p.maker, subtitle: p.subtitle, price: p.price, color: p.color, visual: p.visual ?? 'portable',
    attributes: { includesStand: p.bundled, includesBench: bench, weightKg: p.weight, performance: p.performance, portability: p.portability, returnDays: p.returns, headphones: p.headphones === undefined ? true : p.headphones },
    scores: { performance: p.performance, portability: p.portability }, costs, strengths: p.strengths, tradeoff: p.tradeoff,
    evidence: [...(p.evidence ?? []), assumptions], concerns: [],
  }
}

const pianos: Product[] = [
  piano({ id: 'roland-fp10', name: 'FP-10', maker: 'Roland', subtitle: 'The focused beginner', price: 599, bundled: false, weight: 12.6, performance: 88, portability: 78, returns: 30, shipping: 35, color: '#414b4c', strengths: ['Expressive key action', 'Headphone practice'], tradeoff: 'Stand and bench are separate purchases.', evidence: [fp10] }),
  piano({ id: 'yamaha-p145', name: 'P-145', maker: 'Yamaha', subtitle: 'A simple place to start', price: 549, bundled: false, weight: 11.1, performance: 80, portability: 89, returns: 14, shipping: 25, color: '#c0b49e', strengths: ['Lightweight setup', 'Lower starting price'], tradeoff: 'Short demo return window; accessories add $195.' }),
  piano({ id: 'casio-cdps110', name: 'CDP-S110 starter set', maker: 'Casio', subtitle: 'Small space, complete setup', price: 649, bundled: true, weight: 10.5, performance: 73, portability: 94, returns: 30, shipping: 30, color: '#586f66', strengths: ['Stand and bench in demo offer', 'Easy to move'], tradeoff: 'Illustrative playing-experience score trails the others.' }),
  piano({ id: 'kawai-es120', name: 'ES120', maker: 'Kawai', subtitle: 'Room to grow', price: 799, bundled: false, weight: 12.5, performance: 94, portability: 81, returns: null, shipping: 40, color: '#adb5b9', strengths: ['Hammer-action keyboard', 'Portable design'], tradeoff: 'Stand and bench are separate; return policy is unverified.', evidence: [kawai] }),
  piano({ id: 'yamaha-arius', name: 'Arius home set', maker: 'Yamaha', subtitle: 'A permanent spot for practice', price: 899, bundled: true, weight: 38, performance: 91, portability: 20, returns: 14, shipping: 75, color: '#a58264', visual: 'console', strengths: ['Furniture-style setup', 'Stand and bench in demo offer'], tradeoff: 'Heavy to move and a shorter demo return window.' }),
  piano({ id: 'roland-fp30x', name: 'FP-30X home set', maker: 'Roland', subtitle: 'More possibilities, more questions', price: 949, bundled: true, bench: false, weight: 14.8, performance: 96, portability: 65, returns: null, shipping: null, color: '#545d6b', strengths: ['Two headphone outputs', 'Stand in demo bundle'], tradeoff: 'Bench adds $75; delivery and return policy unknown.', evidence: [fp30] }),
]

const couchFactors: Factor[] = [
  { ...price, max: 3000, defaultValue: 1500 },
  { id: 'narrowAccess', label: 'Narrow-access delivery plan', explanation: 'Requires an illustrative delivery plan suitable for narrow access. This is not proof of fit. Measure the entire route and verify turning clearance with the seller.', kind: 'boolean', defaultValue: true, defaultWeight: 1, scoring: 'boolean',
    question: { title: 'Any tight doorways or hallway turns?', why: 'A couch that fits the room may not reach it. Modular and boxed options can help, but turning clearance still needs checking.', priority: 10, yes: 'Require a narrow-access plan', no: 'Access is straightforward', critical: true } },
  { id: 'assemblyFree', label: 'No assembly required', explanation: 'Requires no customer assembly in the illustrative offer. Modular products may need several pieces connected.', kind: 'boolean', defaultValue: true, defaultWeight: 0, scoring: 'boolean',
    question: { title: 'Would you rather skip the assembly?', why: 'Delivery does not always include assembly. This is a practical difference between these offers.', priority: 5, yes: 'No assembly, please', no: 'I can assemble it' } },
  { id: 'material', label: 'Upholstery', explanation: 'Select your preferred material. Importance rewards that match; the independent hard requirement makes it mandatory. Material alone cannot establish pet safety or durability.', kind: 'select', options: ['Fabric', 'Velvet', 'Leather'], defaultValue: 'Fabric', defaultWeight: 0, scoring: 'match' },
  { id: 'comfort', label: 'Comfort', explanation: 'An illustrative 0–100 preference score, not real customer consensus. Try a sofa before buying when possible.', kind: 'ordinal', min: 0, max: 100, step: 5, defaultValue: 70, defaultWeight: 4, scoring: 'curated', unit: '/100' },
  { id: 'care', label: 'Easy care', explanation: 'Illustrative maintenance score reflecting removable covers and assumed cleaning convenience. Not a pet safety rating.', kind: 'ordinal', min: 0, max: 100, step: 5, defaultValue: 70, defaultWeight: 2, scoring: 'curated', unit: '/100' },
  returns,
]

function couch(id: string, name: string, subtitle: string, price: number, color: string, access: boolean | null, assemblyFree: boolean, material: string, comfort: number, care: number | null, returnDays: number | null, shipping: number | null, dimensions: string, packing: string, tradeoff: string): Product {
  return {
    id, name, maker: 'Considered demo', subtitle, price, color, visual: 'couch',
    attributes: { narrowAccess: access, assemblyFree, material, comfort, care, returnDays, dimensions, packing },
    scores: { comfort, care, material: null },
    costs: [{ id: 'delivery', label: 'Delivery', amount: shipping, status: 'required' }, { id: 'assembly', label: 'Optional assembly service', amount: assemblyFree ? 0 : 90, status: assemblyFree ? 'included' : 'optional' }],
    strengths: [assemblyFree ? 'Arrives assembled' : 'Modular / boxed delivery', material === 'Fabric' ? 'Fabric upholstery' : `${material} upholstery`],
    tradeoff, evidence: [assumptions],
    concerns: ['Fit is not verified. Check package dimensions, door opening, stairs, and hallway turning clearance with your delivery team.'],
  }
}

export const categories: Category[] = [
  { id: 'pianos', name: 'Digital pianos', noun: 'piano', description: 'Find the right keys. Count the whole setup.', prompt: 'I want a digital piano under $1,000.', defaultBudget: 1000, factors: pianoFactors, products: pianos },
  { id: 'couches', name: 'Couches', noun: 'couch', description: 'Love it in the room. Get it through the door.', prompt: "I'm buying a couch for my apartment.", defaultBudget: 1500, factors: couchFactors, products: [
    couch('cove', 'Cove modular', 'Made for the apartment shuffle', 999, '#829383', true, false, 'Fabric', 84, 92, 30, 99, '210 × 88 × 78 cm', 'Largest box: 92 × 72 × 55 cm', 'Assembly required; measure every box and hallway turn.'),
    couch('forma', 'Forma three-seat', 'A little more room to stretch', 1199, '#c9af85', false, true, 'Fabric', 95, 66, 14, 149, '235 × 99 × 85 cm', 'Single pack: 240 × 103 × 90 cm', 'Illustrative delivery plan rules out narrow access.'),
    couch('milo', 'Milo loveseat', 'Smaller footprint, softer landing', 799, '#c8a09a', true, false, 'Velvet', 78, 48, 30, 79, '168 × 82 × 77 cm', 'Largest box: 88 × 78 × 54 cm', 'Velvet care takes more attention; capacity is smaller.'),
    couch('sunday', 'Sunday lounge', 'The deep-seat contender', 1399, '#9eaaa6', null, true, 'Fabric', 97, null, null, null, '225 × 112 × 82 cm', 'Packaging dimensions unknown', 'Delivery cost, access, care score, and return policy need checking.'),
    couch('arc', 'Arc leather sofa', 'Easy to wipe, harder to move', 1249, '#9c6c4e', false, true, 'Leather', 88, 82, 7, 129, '212 × 94 × 84 cm', 'Single pack: 217 × 99 × 89 cm', 'Short demo return window and no narrow-access plan.'),
  ] },
]
