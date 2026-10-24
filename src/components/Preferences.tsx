import { LockKeyhole, RotateCcw, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { money } from '@/domain/engine'
import type { Category, Factor, Session } from '@/domain/types'

export type UpdateSession = (next: Session, cause: string) => void

function Weight({ factor, session, update }: { factor: Factor; session: Session; update: UpdateSession }) {
  const value = session.weights[factor.id]
  return <div className="weight-control">
    <div className="control-label"><span>{factor.label}</span><span className="weight-value">{value === 0 ? 'Off' : `${value} / 5`}</span></div>
    <Slider aria-label={`${factor.label} importance`} min={0} max={5} step={1} value={[value]} onValueChange={([weight]) => update({ ...session, weights: { ...session.weights, [factor.id]: weight } }, `${factor.label} importance changed from ${value} to ${weight}${weight === 0 ? '; it no longer influences ranking' : ''}.`)} />
    <div className="range-ends"><span>Ignore</span><span>Very important</span></div>
  </div>
}

export function Preferences({ category, session, update, reset }: { category: Category; session: Session; update: UpdateSession; reset: () => void }) {
  const budget = session.constraints.price
  const quick = category.id === 'pianos' ? ['price', 'performance', 'portability'] : category.id === 'laptops' ? ['price', 'performance', 'batteryHours'] : ['price', 'comfort', 'care']
  const setBudget = (value: number) => update({ ...session, constraints: { ...session.constraints, price: { ...budget, value } } }, `Maximum ${session.budgetBasis === 'total' ? 'setup' : 'listed-price'} budget changed to ${money(value)}.`)
  const setRequirement = (factor: Factor, active: boolean, value = session.constraints[factor.id].value) => update({
    ...session,
    constraints: { ...session.constraints, [factor.id]: { active, value } },
    answers: { ...session.answers, [factor.id]: active ? 'required' : 'flexible' },
  }, `${factor.label} requirement ${active ? 'enabled or updated' : 'disabled'}.`)
  return <aside className="preferences">
    <div className="panel-heading"><h2>Your priorities</h2><SlidersHorizontal size={17} aria-hidden="true" /></div>
    <p className="muted small">Your call. The shortlist follows.</p>
    <div className="budget-control">
      <div className="control-label"><label htmlFor="budget-input">Maximum budget <span className="small">(CAD)</span></label><Switch id="budget-enabled" aria-label="Enforce maximum budget" checked={budget.active} onCheckedChange={active => setRequirement(category.factors[0], active)} /></div>
      <div className="budget-input"><span>$</span><input id="budget-input" type="number" min={0} max={100000} step={25} value={Number(budget.value)} onChange={e => { const n = e.target.valueAsNumber; if (Number.isFinite(n) && n >= 0 && n <= 100000) setBudget(n) }} /><LockKeyhole size={16} aria-hidden="true" /></div>
      <label className="select-label" htmlFor="budget-basis">Budget and price score use</label>
      <select id="budget-basis" value={session.budgetBasis} onChange={e => update({ ...session, budgetBasis: e.target.value as Session['budgetBasis'] }, `Budget and price scoring now use ${e.target.value === 'total' ? 'estimated setup cost' : 'listed product price'}.`)}><option value="total">Setup total</option><option value="listed">Product price</option></select>
      <p className="small muted">{budget.active ? 'Hard limit stays on even at zero price importance.' : 'Budget limit is off. Price can still affect ranking.'}</p>
    </div>
    <div className="quick-weights">{category.factors.filter(f => quick.includes(f.id)).map(f => <Weight key={f.id} factor={f} session={session} update={update} />)}</div>
    <p className="small muted score-note">Scores are illustrative. A weight of 0 removes that factor from ranking.</p>
    <Sheet>
      <SheetTrigger asChild><Button variant="outline" className="w-full"><SlidersHorizontal size={15} />All considerations</Button></SheetTrigger>
      <SheetContent className="considerations-sheet">
        <SheetHeader><SheetTitle>Make it your decision.</SheetTitle><SheetDescription>Hard requirements decide eligibility. Importance decides ranking. You can change either at any time.</SheetDescription></SheetHeader>
        <div className="sheet-scroll">
          {category.id === 'pianos' && <section className="owned-section"><h3>Already in your setup?</h3><p className="small muted">Owned accessories are removed from estimated extra costs. Included-accessory requirements still refer to the offer.</p>{['stand', 'bench'].map(id => <label className="check-line" key={id}><input type="checkbox" checked={session.owned.includes(id)} onChange={e => update({ ...session, owned: e.target.checked ? [...session.owned, id] : session.owned.filter(x => x !== id) }, `You ${e.target.checked ? 'already own' : 'still need'} a ${id}; setup costs recalculated.`)} />I already own a {id}</label>)}</section>}
          {category.factors.map(factor => <section className="factor-editor" key={factor.id}>
            <div className="control-label"><h3>{factor.label}</h3><span className="answered-state">{session.answers[factor.id] ?? 'Not answered'}</span></div>
            <p className="small muted">{factor.explanation}</p>
            <div className="requirement-row"><label htmlFor={`require-${factor.id}`}><LockKeyhole size={14} aria-hidden="true" />Hard requirement</label><Switch id={`require-${factor.id}`} aria-label={`${factor.label} hard requirement`} checked={session.constraints[factor.id].active} onCheckedChange={active => setRequirement(factor, active)} /></div>
            {factor.kind !== 'boolean' && <div className="constraint-value"><label htmlFor={`limit-${factor.id}`}>{factor.kind === 'max' ? 'Maximum' : factor.kind === 'select' ? 'Preferred / required option' : 'Minimum'} {factor.unit ? `(${factor.unit})` : ''}</label>{factor.kind === 'select'
              ? <select id={`limit-${factor.id}`} value={String(session.constraints[factor.id].value)} onChange={e => setRequirement(factor, session.constraints[factor.id].active, e.target.value)}>{factor.options?.map(option => <option key={option}>{option}</option>)}</select>
              : <input id={`limit-${factor.id}`} type="number" min={factor.min} max={factor.id === 'price' ? 100000 : factor.max} step={factor.step} value={Number(session.constraints[factor.id].value)} onChange={e => { const n = e.target.valueAsNumber; if (Number.isFinite(n) && n >= (factor.min ?? 0) && n <= (factor.id === 'price' ? 100000 : factor.max ?? 100000)) setRequirement(factor, session.constraints[factor.id].active, n) }} />}</div>}
            <Weight factor={factor} session={session} update={update} />
          </section>)}
          <Button variant="outline" className="w-full" onClick={reset}><RotateCcw size={15} />Reset this scenario</Button>
        </div>
      </SheetContent>
    </Sheet>
    <div className="integrity-note"><span className="status-dot" /><span>No sponsored rankings.{' '}<br />No live prices. No hidden logic.</span></div>
  </aside>
}
