import type { Category, CostTotal, Decision, Factor, Product, Question, RankedProduct, RequirementResult, Session, Value } from './types.ts'

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))
export const money = (n: number) => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n)

export function createSession(category: Category): Session {
  return {
    categoryId: category.id,
    constraints: Object.fromEntries(category.factors.map(f => [f.id, { active: f.id === 'price', value: f.id === 'price' ? category.defaultBudget : f.defaultValue }])),
    weights: Object.fromEntries(category.factors.map(f => [f.id, f.defaultWeight])),
    answers: {}, owned: [], budgetBasis: 'total', compare: [],
  }
}

export function acquisitionCost(product: Product, owned: string[]): CostTotal {
  let known = product.price
  const unknown: string[] = []
  for (const cost of product.costs) {
    if (cost.status !== 'required' || (cost.ownable && owned.includes(cost.id))) continue
    if (cost.amount === null) unknown.push(cost.label)
    else known += cost.amount
  }
  return { known, complete: !unknown.length, unknown }
}

function satisfies(value: Value, factor: Factor, required: Exclude<Value, null>): boolean | null {
  if (value === null || value === undefined) return null
  if (factor.kind === 'max') return typeof value === 'number' && typeof required === 'number' ? value <= required : null
  if (factor.kind === 'min' || factor.kind === 'ordinal') return typeof value === 'number' && typeof required === 'number' ? value >= required : null
  return value === required
}

export function checkRequirement(product: Product, factor: Factor, session: Session): RequirementResult {
  const constraint = session.constraints[factor.id]
  const total = acquisitionCost(product, session.owned)
  const isTotal = factor.id === 'price' && session.budgetBasis === 'total'
  const value = factor.id === 'price' ? isTotal ? total.known : product.price : product.attributes[factor.id]
  let result = satisfies(value, factor, constraint.value)
  // A known subtotal over budget fails even when other necessary costs are unknown.
  if (isTotal && !total.complete && result === true) result = null
  const status = result === null ? 'unknown' : result ? 'met' : 'failed'
  const formatted = factor.id === 'price' ? money(Number(value)) : `${value}${factor.unit ? ` ${factor.unit}` : ''}`
  const limit = factor.id === 'price' ? money(Number(constraint.value)) : `${constraint.value}${factor.unit ? ` ${factor.unit}` : ''}`
  const reason = result === null
    ? `This demo has no ${factor.label.toLowerCase()} value${isTotal ? ` because ${total.unknown.join(', ')} cost is unspecified` : ''}.`
    : factor.id === 'price'
      ? `${session.budgetBasis === 'total' ? 'Setup estimate' : 'Listed price'} ${formatted}${!total.complete && isTotal ? '+' : ''} ${result ? 'is within' : 'exceeds'} your ${limit} budget.`
      : factor.kind === 'boolean'
        ? `${factor.label}: ${result ? 'meets' : 'does not meet'} your requirement.`
        : `${factor.label}: ${formatted} ${result ? 'meets' : 'does not meet'} your ${factor.kind === 'max' ? 'maximum' : factor.kind === 'min' || factor.kind === 'ordinal' ? 'minimum' : 'selected'} ${limit}.`
  return { factorId: factor.id, label: factor.label, status, reason }
}

export function normalizedScore(product: Product, factor: Factor, session: Session): number | null {
  if (factor.scoring === 'curated') {
    const score = product.scores[factor.id]
    return typeof score === 'number' && Number.isFinite(score) ? clamp(score, 0, 100) : null
  }
  const total = acquisitionCost(product, session.owned)
  if (factor.id === 'price' && session.budgetBasis === 'total' && !total.complete) return null
  const value = factor.id === 'price' ? session.budgetBasis === 'total' ? total.known : product.price : product.attributes[factor.id]
  if (value === null || value === undefined) return null
  if (factor.scoring === 'match') return value === session.constraints[factor.id].value ? 100 : 0
  if (factor.scoring === 'boolean') return typeof value === 'boolean' ? value ? 100 : 0 : null
  if (typeof value !== 'number' || factor.min === undefined || factor.max === undefined || factor.min === factor.max) return null
  const proportion = clamp((value - factor.min) / (factor.max - factor.min), 0, 1)
  return 100 * (factor.scoring === 'lower' ? 1 - proportion : proportion)
}

export function evaluateProduct(product: Product, category: Category, session: Session): RankedProduct {
  const requirements = category.factors.filter(f => session.constraints[f.id]?.active).map(f => checkRequirement(product, f, session))
  const breakdown = category.factors.map(f => {
    const weight = clamp(session.weights[f.id] ?? 0, 0, 5)
    return { factorId: f.id, label: f.label, weight, score: normalizedScore(product, f, session), contribution: null as number | null }
  })
  const totalWeight = breakdown.reduce((n, p) => n + p.weight, 0)
  const knownWeight = breakdown.reduce((n, p) => n + (p.score === null ? 0 : p.weight), 0)
  const score = knownWeight ? breakdown.reduce((n, p) => n + (p.score ?? 0) * p.weight, 0) / knownWeight : null
  for (const part of breakdown) part.contribution = part.score !== null && knownWeight > 0 ? part.score * part.weight / knownWeight : null
  const total = acquisitionCost(product, session.owned)
  const verification = [
    ...requirements.filter(r => r.status === 'unknown').map(r => r.reason),
    ...breakdown.filter(p => p.weight > 0 && p.score === null).map(p => `${p.label}: no demo score available.`),
    ...(!total.complete ? [`Unknown costs: ${total.unknown.join(', ')}. Total is a lower bound.`] : []),
    // General scenario advice belongs in details, not in the missing-data count.
  ]
  return { product, total, requirements, reasons: requirements.filter(r => r.status === 'failed'), verification, score, coverage: totalWeight ? knownWeight / totalWeight : 0, breakdown }
}

export function selectQuestion(category: Category, session: Session, eligible: RankedProduct[]): Question | undefined {
  if (!eligible.length) return undefined
  return category.factors.flatMap(factor => {
    if (!factor.question || session.answers[factor.id] || session.constraints[factor.id]?.active) return []
    const testSession = { ...session, constraints: { ...session.constraints, [factor.id]: { active: true, value: session.constraints[factor.id]?.value ?? factor.defaultValue } } }
    const results = eligible.map(row => checkRequirement(row.product, factor, testSession).status)
    const eliminates = results.filter(s => s === 'failed').length
    const uncertain = results.filter(s => s === 'unknown').length
    const remains = eligible.length - eliminates
    const discriminates = eliminates > 0 && remains > 0
    if (!discriminates && !(factor.question.critical && uncertain > 0)) return []
    // ponytail: curated priority plus a balanced-split heuristic; replace strategy when real catalogue research exists.
    const priority = factor.question.priority + eliminates * remains / eligible.length + (uncertain ? 0.2 : 0)
    return [{ factor, eliminates, uncertain, remains, priority }]
  }).sort((a, b) => b.priority - a.priority || a.factor.id.localeCompare(b.factor.id))[0]
}

export function deriveDecision(category: Category, session: Session): Decision {
  const rows = category.products.map(p => evaluateProduct(p, category, session))
  const eligible = rows.filter(p => !p.reasons.length).sort((a, b) => {
    if (a.score === null && b.score !== null) return 1
    if (b.score === null && a.score !== null) return -1
    return (b.score ?? 0) - (a.score ?? 0) || a.product.id.localeCompare(b.product.id)
  })
  const excluded = rows.filter(p => p.reasons.length).sort((a, b) => a.product.id.localeCompare(b.product.id))
  const needsVerification = eligible.filter(p => p.verification.length || p.coverage < 1)
  return { eligible, excluded, needsVerification, nextQuestion: selectQuestion(category, session, eligible), concerns: [...new Set(needsVerification.flatMap(p => p.verification))] }
}

export function answerQuestion(session: Session, factorId: string, answer: 'required' | 'flexible' | 'skipped'): Session {
  return {
    ...session,
    answers: { ...session.answers, [factorId]: answer },
    constraints: { ...session.constraints, [factorId]: { ...session.constraints[factorId], active: answer === 'required' } },
  }
}

export function explainChange(previous: Decision, next: Decision, cause: string): string {
  const eliminated = previous.eligible.filter(a => next.excluded.some(b => b.product.id === a.product.id))
  const returned = previous.excluded.filter(a => next.eligible.some(b => b.product.id === a.product.id))
  const changes = [cause]
  if (eliminated.length) changes.push(`${eliminated.map(p => p.product.name).join(', ')} ${eliminated.length === 1 ? 'is' : 'are'} now excluded.`)
  if (returned.length) changes.push(`${returned.map(p => p.product.name).join(', ')} returned to your shortlist.`)
  const oldTop = previous.eligible[0], newTop = next.eligible[0]
  if (newTop?.score === null) changes.push('These options are unranked. Choose at least one priority with known data to rank them.')
  else if (oldTop && newTop && oldTop.product.id !== newTop.product.id) changes.push(`${newTop.product.name} moved above ${oldTop.product.name} under these priorities.`)
  else if (newTop) changes.push(`${newTop.product.name} remains first under these priorities.`)
  if (!next.eligible.length) changes.push('No options meet all active requirements. Relax a requirement to bring products back.')
  return changes.join(' ')
}

export function matchIntent(text: string, categories: Category[]): { category?: Category; budget?: number } {
  const input = text.toLowerCase()
  const id = /piano|keyboard/.test(input) ? 'pianos' : /couch|sofa|apartment/.test(input) ? 'couches' : undefined
  const match = input.match(/(?:under|budget|maximum|max|up to)\s*(?:ca\$|cad\s*|\$)?\s*([\d,]+(?:\.\d+)?)/i) ?? input.match(/\$\s*([\d,]+(?:\.\d+)?)/)
  const amount = match ? Number(match[1].replaceAll(',', '')) : undefined
  return { category: categories.find(c => c.id === id), budget: amount && Number.isFinite(amount) && amount <= 100000 ? amount : undefined }
}

// localStorage is an untrusted boundary: restore only known fields with the right shape.
export function restoreSession(value: unknown, categories: Category[]): Session | null {
  if (!value || typeof value !== 'object') return null
  const saved = value as Partial<Session>
  const category = categories.find(c => c.id === saved.categoryId)
  if (!category) return null
  const session = createSession(category)
  if (saved.budgetBasis === 'listed') session.budgetBasis = 'listed'
  for (const factor of category.factors) {
    const constraint = saved.constraints?.[factor.id]
    if (constraint && typeof constraint.active === 'boolean' && typeof constraint.value === typeof factor.defaultValue) {
      if (typeof constraint.value !== 'number' || Number.isFinite(constraint.value) && constraint.value >= (factor.min ?? 0) && constraint.value <= (factor.id === 'price' ? 100000 : factor.max ?? 100000)) {
        if (factor.kind !== 'select' || factor.options?.includes(String(constraint.value))) session.constraints[factor.id] = constraint
      }
    }
    const weight = saved.weights?.[factor.id]
    if (typeof weight === 'number' && Number.isFinite(weight)) session.weights[factor.id] = clamp(Math.round(weight), 0, 5)
    const answer = saved.answers?.[factor.id]
    if (answer === 'required' || answer === 'flexible' || answer === 'skipped') session.answers[factor.id] = answer
  }
  const ownable = category.products.flatMap(p => p.costs.filter(c => c.ownable).map(c => c.id))
  if (Array.isArray(saved.owned)) session.owned = [...new Set(saved.owned.filter(id => typeof id === 'string' && ownable.includes(id)))]
  if (Array.isArray(saved.compare)) session.compare = [...new Set(saved.compare.filter(id => category.products.some(p => p.id === id)))].slice(0, 3)
  return session
}
