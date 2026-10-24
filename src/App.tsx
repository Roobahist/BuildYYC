import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronRight, CircleHelp, Compass, CornerDownRight, HeartHandshake, LockKeyhole, Piano, RotateCcw, Scale, ShieldCheck, Sofa, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { categories } from '@/domain/catalogue'
import { answerQuestion, createSession, deriveDecision, explainChange, matchIntent, money, restoreSession } from '@/domain/engine'
import type { Category, Session } from '@/domain/types'
import { Preferences, type UpdateSession } from '@/components/Preferences'
import { Comparison, ExcludedProducts, ProductArt, ProductCard } from '@/components/ProductView'

const STORAGE_KEY = 'considered-session-v1'
function loadSession() {
  try { return restoreSession(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null'), categories) }
  catch { return null }
}

function Wordmark({ onClick }: { onClick: () => void }) {
  return <button className="wordmark" aria-label="Considered home" onClick={onClick}><span className="brand-symbol"><Check size={20} strokeWidth={2.4} /></span>considered<span className="wordmark-period">.</span></button>
}

function HowItWorks() {
  return <Dialog><DialogTrigger asChild><Button variant="ghost" className="how-button">How it works<ArrowUpRight size={14} /></Button></DialogTrigger><DialogContent className="help-dialog"><DialogHeader><DialogTitle>A clearer way to choose.</DialogTitle><DialogDescription>This is a functional BuildYYC prototype, with curated local products and deterministic logic.</DialogDescription></DialogHeader><ol className="how-steps"><li><strong>Start with plausible options.</strong><p>Choose pianos or couches. Simple intent matching recognizes those categories and a stated budget.</p></li><li><strong>Find the question you missed.</strong><p>Questions are selected from actual differences in your remaining products. Answers can add a reversible hard requirement.</p></li><li><strong>Make the trade-offs yours.</strong><p>Change independent importance weights. Inspect costs, evidence, and the exact weighted mean behind each score.</p></li></ol><p className="small muted">No LLM, live product search, sponsorship, or checkout. Illustrative data is not a purchase recommendation. State is saved only in this browser when storage is available.</p></DialogContent></Dialog>
}

function Landing({ start, resume, hasSession }: { start: (category: Category, budget?: number) => void; resume: () => void; hasSession: boolean }) {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const match = matchIntent(input, categories)
    if (!match.category) { setError('This demo supports digital pianos and couches. Try one of the examples below.'); return }
    setError(''); start(match.category, match.budget)
  }
  return <main id="main" className="landing">
    <section className="landing-hero">
      <div className="hero-copy"><h1>Find the right product for you.</h1><p className="hero-description">A better shortlist starts with the questions you didn’t know to ask.</p><p className="hero-support">Compare what matters, eliminate deal-breakers, and see the full cost.</p>
        <form className="shopping-form" onSubmit={submit}><label htmlFor="shopping-request">What are you considering?</label><div className={`shopping-input ${error ? 'has-error' : ''}`}><input id="shopping-request" value={input} onChange={e => { setInput(e.target.value); setError('') }} placeholder="A digital piano under $1,000…" aria-describedby={error ? 'request-error' : 'supported-scenarios'} /><Button type="submit" size="icon" aria-label="Find my shortlist"><ArrowRight size={20} /></Button></div>{error && <p id="request-error" className="form-error" role="alert">{error}</p>}<p id="supported-scenarios" className="small muted">Local demo · Digital pianos and couches · No live search</p></form>
        {hasSession && <Button variant="link" className="resume-button" onClick={resume}>Pick up your last decision<ArrowRight size={15} /></Button>}
      </div>
      <div className="hero-preview" aria-label="Example of discovering hidden piano costs">
        <div className="preview-product"><ProductArt product={categories[0].products[0]} large /><div className="preview-product-name"><div><p className="maker">Roland</p><h2>FP-10</h2></div><span className="preview-price">$599<small>illustrative price</small></span></div><div className="preview-cost"><span>The piano</span><span>$599</span></div><div className="preview-cost"><span>Stand + bench + delivery</span><span>+$230</span></div><div className="preview-cost preview-total"><strong>The whole setup</strong><strong>$829</strong></div></div>
        <div className="preview-insight"><span className="insight-icon"><Sparkles size={20} /></span><div><p>“Will you need a stand included?”</p><span>One question. A more useful shortlist.</span></div><CornerDownRight size={23} className="insight-arrow" /></div>
        <div className="preview-footnote"><ShieldCheck size={14} />You see the reasoning. You make the call.</div>
      </div>
    </section>
    <section className="scenario-section" aria-labelledby="scenario-title"><div className="section-intro"><h2 id="scenario-title">Take a decision for a test drive.</h2><p className="muted">A real interaction. Illustrative products and prices.</p></div><div className="scenario-options">{categories.map(category => <button className="scenario-option" key={category.id} onClick={() => start(category)}><span className="scenario-number"><ProductArt product={category.products[0]} />{category.id === 'pianos' ? <Piano size={25} /> : <Sofa size={25} />}</span><div><h3>{category.name}</h3><p>{category.description}</p><span>{category.products.length} options to think through</span></div><ArrowUpRight size={21} /></button>)}</div></section>
    <footer className="landing-footer"><span>For the decisions that deserve a second thought.</span><span className="buildyyc-credit">Built for BuildYYC <ArrowUpRight size={12} aria-hidden="true" /></span></footer>
  </main>
}

export default function App() {
  const [session, setSession] = useState<Session | null>(loadSession)
  const [view, setView] = useState<'home' | 'workspace'>(() => session ? 'workspace' : 'home')
  const [notice, setNotice] = useState('Your initial shortlist is ready. Let’s look at what the listed price might leave out.')
  const [storageNotice, setStorageNotice] = useState('')
  const [comparisonOpen, setComparisonOpen] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const category = categories.find(c => c.id === session?.categoryId) ?? categories[0]
  const decision = useMemo(() => session ? deriveDecision(category, session) : null, [category, session])
  useEffect(() => {
    if (!session) return
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(session)) }
    catch { setStorageNotice('Browser storage is unavailable. This decision will last for this tab only.') }
  }, [session])
  useEffect(() => { if (view === 'workspace') heading.current?.focus(); window.scrollTo(0, 0) }, [view, category.id])

  const start = (nextCategory: Category, budget?: number) => {
    const next = createSession(nextCategory)
    if (budget !== undefined) next.constraints.price.value = budget
    setSession(next); setView('workspace'); setComparisonOpen(false)
    setNotice(`Your ${nextCategory.products.length} discovered options are ready. Budget applies to the whole setup, including estimated essentials.`)
  }
  const update: UpdateSession = (next, cause) => {
    if (!decision) return
    const nextDecision = deriveDecision(category, next)
    setNotice(explainChange(decision, nextDecision, cause))
    setSession({ ...next, compare: next.compare.filter(id => nextDecision.eligible.some(row => row.product.id === id)) })
  }
  const disable = (factorId: string) => {
    if (!session) return
    const label = category.factors.find(f => f.id === factorId)!.label
    update({ ...session, constraints: { ...session.constraints, [factorId]: { ...session.constraints[factorId], active: false } }, answers: { ...session.answers, [factorId]: 'flexible' } }, `${label} requirement disabled.`)
  }
  const comparisonRows = decision && session ? (session.compare.length ? decision.eligible.filter(row => session.compare.includes(row.product.id)) : decision.eligible.slice(0, 2)) : []
  const question = decision?.nextQuestion
  const selectedEligibleCount = session && decision ? session.compare.filter(id => decision.eligible.some(row => row.product.id === id)).length : 0
  return <div className="app-shell">
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><Wordmark onClick={() => setView('home')} /><nav aria-label="Main"><HowItWorks /><Badge variant="outline" className="demo-badge"><span className="status-dot" />BuildYYC demo</Badge></nav></header>
    {view === 'home' || !session || !decision ? <Landing start={start} hasSession={!!session} resume={() => setView('workspace')} /> : <main id="main" className="workspace">
      <div className="workspace-topline"><button className="back-link" onClick={() => setView('home')}><ArrowLeft size={15} />Back to start</button><label className="category-select"><span className="sr-only">Shopping scenario</span><select value={category.id} onChange={e => start(categories.find(c => c.id === e.target.value)!)}>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></label></div>
      <div className="workspace-title"><div><h1 tabIndex={-1} ref={heading}>Let’s find your {category.noun}.</h1><p>The right choice starts with the right questions.</p></div><div className="decision-trail" aria-label={`${category.products.length} discovered, ${decision.eligible.length} eligible, ${decision.excluded.length} excluded`}><span><strong>{category.products.length}</strong> discovered</span><ChevronRight size={15} /><span className="trail-current"><strong>{decision.eligible.length}</strong> eligible</span><ChevronRight size={15} /><span><strong>{decision.excluded.length}</strong> excluded</span></div></div>
      <div className="context-strip"><span><LockKeyhole size={14} />{session.constraints.price.active ? `Up to ${money(Number(session.constraints.price.value))} ${session.budgetBasis === 'total' ? 'setup' : 'listed'}` : 'Budget flexible'}</span>{category.factors.filter(f => f.id !== 'price' && session.constraints[f.id].active).map(f => <button className="constraint-chip" key={f.id} aria-label={`Disable ${f.label.toLowerCase()} requirement`} onClick={() => disable(f.id)}>{f.label}<X size={12} aria-hidden="true" /></button>)}<span className="context-disclaimer">Simulated offers · CAD before tax</span></div>
      {storageNotice && <p className="storage-notice" role="status">{storageNotice}</p>}
      <div className="workspace-grid"><div className="decision-main">
        <section className="question-panel" aria-labelledby="question-heading"><div className="question-identity"><span className="question-step">{Object.keys(session.answers).length} considerations answered or skipped</span></div>
          {question ? <><h2 id="question-heading">{question.factor.question!.title}</h2><p>{question.factor.question!.why}</p><div className="elimination-preview"><span className="preview-dot" /><span>{question.eliminates > 0 ? <><strong>{question.eliminates} of {decision.eligible.length}</strong> current options would be excluded.</> : 'No confirmed exclusions, but an important unknown to consider.'}{question.uncertain > 0 && <> {question.uncertain} would have an unspecified demo value.</>}</span></div><div className="question-actions"><Button className="question-yes" onClick={() => update(answerQuestion(session, question.factor.id, 'required'), `${question.factor.label} is now a hard requirement.`)}><Check size={16} />{question.factor.question!.yes}</Button><Button variant="outline" className="question-no" onClick={() => update(answerQuestion(session, question.factor.id, 'flexible'), `${question.factor.label} is flexible. No products excluded by this factor.`)}>{question.factor.question!.no}</Button><Button variant="ghost" className="question-skip" onClick={() => update(answerQuestion(session, question.factor.id, 'skipped'), `${question.factor.label} question skipped. The requirement stays off; you can edit it under All considerations.`)}>Skip for now<ArrowRight size={14} /></Button></div></>
            : <><h2 id="question-heading">{decision.eligible.length ? 'Now it comes down to your priorities.' : 'Let’s loosen a requirement.'}</h2><p>{decision.eligible.length ? 'No more high-impact questions distinguish these options right now. Adjust what matters, then compare the remaining trade-offs.' : 'Every option conflicts with at least one active requirement. Your excluded products are still below, with a way to bring them back.'}</p>{decision.needsVerification.length > 0 && <p className="question-caution"><CircleHelp size={15} />{decision.needsVerification.length} {decision.needsVerification.length === 1 ? 'option has' : 'options have'} missing demo inputs. These stay visible instead of being treated as confirmed matches.</p>}<Button className="question-yes" disabled={!decision.eligible.length} onClick={() => setComparisonOpen(true)}><Scale size={16} />Compare the remaining trade-offs</Button></>}
        </section>
        <div className="change-notice" role="status" aria-live="polite" aria-atomic="true"><CornerDownRight size={16} /><span>{notice}</span></div>
        <section aria-labelledby="shortlist-heading"><div className="shortlist-heading"><div><h2 id="shortlist-heading">Your shortlist<span>{decision.eligible.length}</span></h2><p>{decision.eligible[0]?.score === null ? 'Unranked. Choose a priority with known data to rank these options.' : 'Ranked by your priorities. Every trade-off in the open.'}</p></div><Button variant="outline" size="sm" disabled={!decision.eligible.length} onClick={() => setComparisonOpen(true)}><Scale size={15} />{selectedEligibleCount ? `Compare (${selectedEligibleCount})` : decision.eligible[0]?.score === null ? 'Compare options' : 'Compare top picks'}</Button></div>
          {!decision.eligible.length ? <div className="empty-shortlist"><Compass size={30} /><h3>No match under these requirements.</h3><p>Disable a requirement below, increase your budget, or start fresh.</p><Button variant="outline" onClick={() => start(category)}><RotateCcw size={15} />Reset this scenario</Button></div> : <div className="product-grid">{decision.eligible.map((row, i) => <ProductCard key={row.product.id} row={row} rank={i + 1} category={category} session={session} onCompare={() => {
            const selected = session.compare.includes(row.product.id)
            setSession({ ...session, compare: selected ? session.compare.filter(id => id !== row.product.id) : [...session.compare, row.product.id].slice(0, 3) })
          }} />)}</div>}
        </section>
        <ExcludedProducts rows={decision.excluded} category={category} session={session} disable={disable} />
        {!!Object.keys(session.answers).length && <details className="decision-notes"><summary>Your decision notes <span>{Object.keys(session.answers).length} considered <ArrowDown size={14} /></span></summary><div>{category.factors.filter(f => session.answers[f.id]).map(f => <div className="decision-note-row" key={f.id}><span>{f.label}</span><span>{session.constraints[f.id].active ? 'Required' : session.answers[f.id] === 'skipped' ? 'Skipped · not required' : 'Flexible'}</span><Button size="sm" variant="ghost" onClick={() => { const answers = { ...session.answers }; delete answers[f.id]; update({ ...session, answers, constraints: { ...session.constraints, [f.id]: { ...session.constraints[f.id], active: false } } }, `${f.label} reopened for consideration.`) }}>Reconsider</Button></div>)}</div></details>}
        <div className="final-prompt"><HeartHandshake size={25} /><div><h2>A good choice is one you understand.</h2><p>{question ? 'You can keep answering, or compare the trade-offs now.' : 'Review the highest-ranked options and the trade-offs that separate them.'}</p></div><Button disabled={!comparisonRows.length} onClick={() => setComparisonOpen(true)}>Compare finalists<ArrowRight size={16} /></Button></div>
      </div><Preferences category={category} session={session} update={update} reset={() => start(category)} /></div>
      <footer className="workspace-footer"><span><ShieldCheck size={14} />A transparent prototype. You stay in charge.</span><span>{storageNotice ? 'Session not saved' : 'Decision saved in this browser'} · No live search</span></footer>
      <Comparison rows={comparisonRows} category={category} session={session} open={comparisonOpen} onOpenChange={setComparisonOpen} />
    </main>}
  </div>
}
