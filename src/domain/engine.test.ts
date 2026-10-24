import test from 'node:test'
import assert from 'node:assert/strict'
import { categories } from './catalogue.ts'
import { acquisitionCost, answerQuestion, createSession, deriveDecision, evaluateProduct, explainChange, matchIntent, restoreSession } from './engine.ts'
import type { Category, Session } from './types.ts'

const category = categories[0]
const all = () => { const s = createSession(category); s.constraints.price.active = false; return s }
const ids = (s: Session) => deriveDecision(category, s).eligible.map(p => p.product.id)

test('known budget overruns are excluded and every discovered product is preserved', () => {
  const decision = deriveDecision(category, createSession(category))
  assert.equal(decision.eligible.length + decision.excluded.length, category.products.length)
  assert.ok(decision.excluded.find(p => p.product.id === 'kawai-es120')?.reasons.some(r => r.factorId === 'price'))
  assert.ok(decision.excluded.find(p => p.product.id === 'roland-fp30x'), 'known subtotal already over budget must fail even if shipping is unknown')
})

test('a hard blocker excludes actual violations and disabling it restores the same options', () => {
  const session = all()
  const filtered = answerQuestion(session, 'includesStand', 'required')
  assert.equal(ids(filtered).length, 3)
  assert.deepEqual(ids(answerQuestion(filtered, 'includesStand', 'flexible')), ids(session))
  assert.equal(deriveDecision(category, filtered).excluded[0].reasons[0].factorId, 'includesStand')
})

test('price scoring is independent of the budget blocker', () => {
  const session = createSession(category)
  const before = ids(session)
  session.weights.price = 0
  assert.deepEqual(new Set(ids(session)), new Set(before))
  assert.equal(session.constraints.price.active, true)
  session.constraints.price.active = false
  assert.equal(ids(session).length, 6)
})

test('changing priorities deterministically changes rank without changing eligibility', () => {
  const session = all()
  for (const key of Object.keys(session.weights)) session.weights[key] = 0
  session.weights.performance = 5
  assert.equal(ids(session)[0], 'roland-fp30x')
  session.weights.performance = 0
  session.weights.portability = 5
  assert.equal(ids(session)[0], 'casio-cdps110')
  assert.deepEqual(ids(session), ids(structuredClone(session)))
})

test('all zero weights have no invented score and use a stable identifier tie-break', () => {
  const session = all()
  for (const key of Object.keys(session.weights)) session.weights[key] = 0
  const decision = deriveDecision(category, session)
  assert.ok(decision.eligible.every(p => p.score === null))
  assert.deepEqual(ids(session), category.products.map(p => p.id).sort())
  const explanation = explainChange(deriveDecision(category, all()), decision, 'All importance weights set to zero.')
  assert.match(explanation, /unranked/)
  assert.doesNotMatch(explanation, /remains first|moved above/)
})

test('unknown requirements remain eligible and explicitly need verification', () => {
  const session = answerQuestion(all(), 'returnDays', 'required')
  const decision = deriveDecision(category, session)
  const unknown = decision.eligible.find(p => p.product.id === 'kawai-es120')!
  assert.ok(unknown)
  assert.ok(unknown.requirements.some(r => r.factorId === 'returnDays' && r.status === 'unknown'))
  assert.ok(unknown.verification.length)
  assert.ok(decision.excluded.some(p => p.product.id === 'yamaha-p145'))
})

test('missing scores are omitted from weighted mean and weighted coverage is shown', () => {
  const session = all()
  for (const key of Object.keys(session.weights)) session.weights[key] = 0
  session.weights.performance = 3
  session.weights.returnDays = 2
  const product = category.products.find(p => p.id === 'kawai-es120')!
  const evaluated = evaluateProduct(product, category, session)
  assert.equal(evaluated.score, 94)
  assert.equal(evaluated.coverage, 0.6)
  assert.equal(evaluated.breakdown.find(p => p.factorId === 'returnDays')?.score, null)
  assert.ok(evaluated.verification.some(v => v.includes('Return window')))
})

test('owned accessories lower total and can restore budget eligibility', () => {
  const session = createSession(category)
  const product = category.products.find(p => p.id === 'kawai-es120')!
  assert.equal(acquisitionCost(product, []).known, 1034)
  session.owned = ['stand']
  assert.equal(acquisitionCost(product, session.owned).known, 914)
  assert.ok(ids(session).includes(product.id))
})

test('unknown required cost is never silently zero, optional unknown costs do not invalidate total', () => {
  const session = all()
  session.constraints.price = { active: true, value: 1400 }
  const product = category.products.find(p => p.id === 'roland-fp30x')!
  const row = evaluateProduct(product, category, session)
  assert.equal(row.total.complete, false)
  assert.equal(row.total.known, 1024)
  assert.equal(row.requirements[0].status, 'unknown')
  assert.equal(row.breakdown.find(p => p.factorId === 'price')?.score, null)
  assert.equal(acquisitionCost({ ...product, costs: [{ id: 'extra', label: 'Optional extra', amount: null, status: 'optional' }] }, []).complete, true)
})

test('listed-price budget and total budget produce different valid eligibility', () => {
  const session = createSession(category)
  assert.ok(!ids(session).includes('kawai-es120'))
  session.budgetBasis = 'listed'
  assert.ok(ids(session).includes('kawai-es120'))
})

test('question selection adapts, avoids homogeneous outcomes, and records skips', () => {
  const session = all()
  assert.equal(deriveDecision(category, session).nextQuestion?.factor.id, 'includesStand')
  const answered = answerQuestion(session, 'includesStand', 'required')
  assert.notEqual(deriveDecision(category, answered).nextQuestion?.factor.id, 'includesStand')
  const skipped = answerQuestion(session, 'includesStand', 'skipped')
  assert.equal(ids(skipped).length, 6)
  assert.notEqual(deriveDecision(category, skipped).nextQuestion?.factor.id, 'includesStand')
  const uniform: Category = { ...category, products: category.products.map(p => ({ ...p, attributes: { ...p.attributes, includesStand: true } })) }
  assert.notEqual(deriveDecision(uniform, session).nextQuestion?.factor.id, 'includesStand')
})

test('changing an earlier answer recomputes later exclusions without mutating the catalogue', () => {
  const initial = all()
  const first = answerQuestion(initial, 'includesStand', 'required')
  const second = answerQuestion(first, 'returnDays', 'required')
  const revised = answerQuestion(second, 'includesStand', 'flexible')
  assert.ok(ids(revised).includes('roland-fp10'))
  assert.ok(!ids(revised).includes('yamaha-p145'))
  assert.equal(initial.constraints.includesStand.active, false)
  assert.equal(category.products.length, 6)
})

test('couch access uncertainty remains visible and never guarantees hallway fit', () => {
  const couches = categories[1]
  const session = answerQuestion(createSession(couches), 'narrowAccess', 'required')
  const decision = deriveDecision(couches, session)
  assert.ok(decision.excluded.some(p => p.product.id === 'forma'))
  assert.ok(decision.eligible.some(p => p.product.id === 'sunday'))
  assert.ok(decision.eligible.every(p => p.product.concerns.some(v => v.includes('Fit is not verified'))))
})

test('intent matching handles supported requests and explicitly rejects unsupported ones', () => {
  assert.equal(matchIntent('digital piano under $1,000', categories).budget, 1000)
  assert.equal(matchIntent('A sofa for my apartment', categories).category?.id, 'couches')
  assert.equal(matchIntent('A robot sensor', categories).category, undefined)
})

test('a categorical preference can rank matches without making them mandatory', () => {
  const couches = categories[1]
  const session = createSession(couches)
  for (const id of Object.keys(session.weights)) session.weights[id] = 0
  session.weights.material = 5
  session.constraints.material.value = 'Leather'
  const decision = deriveDecision(couches, session)
  assert.equal(decision.eligible.length, 5)
  assert.equal(decision.eligible[0].product.id, 'arc')
  session.constraints.material.active = true
  assert.equal(deriveDecision(couches, session).eligible.length, 1)
})

test('restore rejects invalid local data while retaining valid choices', () => {
  assert.equal(restoreSession(null, categories), null)
  assert.equal(restoreSession({ categoryId: 'made-up' }, categories), null)
  const session = all()
  session.weights.price = 0
  assert.deepEqual(restoreSession(JSON.parse(JSON.stringify(session)), categories), session)
  const restored = restoreSession({ categoryId: 'pianos', weights: { price: Infinity }, constraints: { price: { active: true, value: -42 } }, owned: [7, 'made-up', 'stand'] }, categories)!
  assert.equal(restored.constraints.price.value, 1000)
  assert.equal(restored.weights.price, 3)
  assert.deepEqual(restored.owned, ['stand'])
})

test('change explanations name products returning and new leaders', () => {
  const session = all()
  const constrained = answerQuestion(session, 'includesStand', 'required')
  const explanation = explainChange(deriveDecision(category, constrained), deriveDecision(category, session), 'Stand requirement disabled.')
  assert.match(explanation, /returned to your shortlist/)
})


test('every displayed demo model has credited photo metadata', () => {
  for (const group of categories) for (const product of group.products) {
    assert.ok(product.image, `Missing image for ${product.id}`)
    assert.ok(product.image.src.startsWith('https://'))
    assert.ok(product.image.sourceUrl.startsWith('https://'))
    assert.ok(product.image.credit.length > 0)
  }
})

test('general demo guidance is not counted as missing product data', () => {
  const couches = categories[1]
  const decision = deriveDecision(couches, createSession(couches))
  const complete = decision.eligible.find(row => row.product.id === 'cove')!
  const incomplete = decision.eligible.find(row => row.product.id === 'sunday')!
  assert.deepEqual(complete.verification, [])
  assert.ok(complete.product.concerns.length > 0)
  assert.ok(!decision.needsVerification.some(row => row.product.id === 'cove'))
  assert.ok(incomplete.verification.some(note => note.includes('costs') || note.includes('demo score')))
  assert.ok(decision.needsVerification.some(row => row.product.id === 'sunday'))
})
