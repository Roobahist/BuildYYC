import { useState, type CSSProperties } from 'react'
import { ArrowUpRight, Check, CheckCircle2, CircleHelp, Info, Plus, Scale, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { money } from '@/domain/engine'
import type { Category, Product, RankedProduct, Session } from '@/domain/types'

export function ProductArt({ product, large = false }: { product: Product; large?: boolean }) {
  const [imageFailed, setImageFailed] = useState(false)
  const hasPhoto = Boolean(product.image?.src && !imageFailed)
  return <div className={`product-art ${product.visual} ${large ? 'art-large' : ''}`} style={{ '--product-color': product.color } as CSSProperties}
    role={hasPhoto ? undefined : 'img'} aria-label={hasPhoto ? undefined : 'Abstract product illustration, not a manufacturer photo'}>
    {hasPhoto ? <img className="product-photo" src={product.image!.src}
      alt={`${product.maker} ${product.name} product photo`} loading={large ? 'eager' : 'lazy'} decoding="async"
      onError={() => setImageFailed(true)} />
    : product.visual === 'couch' ? <div className="sofa-shape"><div className="sofa-back" /><div className="sofa-seat" /><div className="sofa-arm arm-left" /><div className="sofa-arm arm-right" /><div className="sofa-leg leg-left" /><div className="sofa-leg leg-right" /></div>
    : <div className="piano-shape"><div className="music-rest" /><div className="piano-body"><span className="piano-mark">{product.maker}</span><div className="piano-controls"><i /><i /><i /></div><div className="keyboard">{Array.from({ length: 28 }, (_, i) => <span className={`key ${[0, 1, 3, 4, 5].includes(i % 7) ? 'has-black' : ''}`} key={i} />)}</div></div>{product.visual === 'console' && <div className="piano-legs"><span /><span /><i /></div>}</div>}
    {!hasPhoto && <span className="art-caption">Illustration</span>}
  </div>
}

function CostDetails({ row, session }: { row: RankedProduct; session: Session }) {
  return <div className="cost-details">
    <p className="muted small">Illustrative CAD estimates, before tax. Required extras are included in the setup estimate. Optional extras are shown separately.</p>
    <div className="cost-line"><span>Listed product price</span><strong>{money(row.product.price)}</strong></div>
    {row.product.costs.map(cost => {
      const owned = cost.ownable && session.owned.includes(cost.id) && cost.status !== 'included'
      return <div className="cost-line" key={cost.id}><span>{cost.label}<small>{owned ? 'Already owned' : cost.status === 'included' ? 'Included in offer' : cost.status === 'optional' ? 'Optional · not in estimate' : 'Required extra'}</small></span><span>{owned || cost.status === 'included' ? <Check size={16} aria-label={owned ? 'Already owned' : 'Included'} /> : cost.amount === null ? 'Unknown' : money(cost.amount)}</span></div>
    })}
    <div className="cost-line cost-total"><span>{row.total.complete ? 'Estimated setup' : 'Known subtotal'}</span><strong>{money(row.total.known)}{!row.total.complete && '+'}</strong></div>
    {!row.total.complete && <p className="caution-text"><CircleHelp size={15} />{row.total.unknown.join(', ')} still needs a quote. This is not a complete total.</p>}
  </div>
}

function ScoreDetails({ row, session }: { row: RankedProduct; session: Session }) {
  return <div className="score-details"><p className="small muted">Weighted mean of known active factor scores. Missing values are omitted, never scored as zero. Price uses {session.budgetBasis === 'total' ? 'estimated setup cost' : 'listed product price'}; numeric scores use fixed catalogue bounds.</p>
    <div className="breakdown-header"><span>Factor</span><span>Weight</span><span>Score</span><span>Points</span></div>
    {row.breakdown.map(part => <div className={`breakdown-row ${part.weight === 0 ? 'inactive-factor' : ''}`} key={part.factorId}><span>{part.label}</span><span>{part.weight}/5</span><span>{part.score === null ? 'Unknown' : `${part.score.toFixed(0)}`}</span><span>{part.weight === 0 ? 'Off' : part.contribution === null ? 'Omitted' : part.contribution.toFixed(1)}</span></div>)}
    <div className="cost-line cost-total"><span>Illustrative fit score</span><strong>{row.score === null ? 'Unranked' : `${row.score.toFixed(1)} / 100`}</strong></div>
    <p className="small muted">Weighted data coverage: {(row.coverage * 100).toFixed(0)}%. This describes available scoring data, not confidence in the product. Subjective scores are curated examples.</p>
  </div>
}

function EvidenceDetails({ row }: { row: RankedProduct }) {
  return <div className="evidence-details">{row.product.evidence.map(source => <article className="source-entry" key={source.id}>
    <div className="source-meta"><Badge variant="outline">{source.type}</Badge><span>{source.confidence} confidence</span></div><h4>{source.claim}</h4>
    <p>{source.relevance}</p><p className="small muted">{source.limitation}</p>
    {source.url ? <a className="source-link" href={source.url} target="_blank" rel="noreferrer">{source.title}<ArrowUpRight size={14} /></a> : <span className="small muted">No external citation. Illustrative assumption.</span>}
    {source.checkedAt && <small className="source-date">Link and claim checked {source.checkedAt}{source.date ? ` · Published ${source.date}` : ' · Publication date not provided'}</small>}
  </article>)}{row.product.image && <p className="photo-source small muted">Photo: <a href={row.product.image.sourceUrl} target="_blank" rel="noreferrer">{row.product.image.credit} <ArrowUpRight size={12} className="inline" /></a>. This image is not evidence of sample pricing, delivery, or bundle terms.</p>}<p className="small muted">Manufacturer documentation supports specifications, not unbiased quality judgments. No customer reviews, quotes, or review consensus are simulated.</p></div>
}

export function ProductDetails({ row, category, session, children }: { row: RankedProduct; category: Category; session: Session; children: React.ReactNode }) {
  return <Dialog><DialogTrigger asChild>{children}</DialogTrigger><DialogContent className="product-dialog">
    <DialogHeader><DialogTitle>{row.product.maker} {row.product.name}</DialogTitle><DialogDescription>{row.product.subtitle}. Prices, scores, and offer assumptions are illustrative.</DialogDescription></DialogHeader>
    <Tabs defaultValue="costs"><TabsList className="details-tabs"><TabsTrigger value="costs">Setup cost</TabsTrigger><TabsTrigger value="score">Score breakdown</TabsTrigger><TabsTrigger value="evidence">Evidence</TabsTrigger><TabsTrigger value="requirements">Requirements</TabsTrigger></TabsList>
      <TabsContent value="costs"><CostDetails row={row} session={session} /></TabsContent>
      <TabsContent value="score"><ScoreDetails row={row} session={session} /></TabsContent>
      <TabsContent value="evidence"><EvidenceDetails row={row} /></TabsContent>
      <TabsContent value="requirements"><div className="requirements-details">
        {!row.requirements.length && <p>No hard requirements are enabled.</p>}
        {row.requirements.map(requirement => <p className={`requirement-result ${requirement.status}`} key={requirement.factorId}>{requirement.status === 'met' ? <CheckCircle2 size={17} /> : requirement.status === 'failed' ? <X size={17} /> : <CircleHelp size={17} />}<span>{requirement.reason}</span></p>)}
        {row.verification.map((concern, i) => <p className="caution-text" key={i}><CircleHelp size={16} />{concern}</p>)}
        {row.product.concerns.length > 0 && <section className="scenario-notes"><h4>Practical considerations</h4>{row.product.concerns.map((note, i) => <p key={i}>{note}</p>)}</section>}
        {category.id === 'couches' && <dl className="dimension-list"><dt>Illustrative dimensions</dt><dd>{String(row.product.attributes.dimensions)}</dd><dt>Illustrative packaging</dt><dd>{String(row.product.attributes.packing)}</dd></dl>}
        <p className="small muted">A satisfied requirement here means it matches this demo catalogue. Verify actual retailer conditions before a purchase.</p>
      </div></TabsContent>
    </Tabs>
  </DialogContent></Dialog>
}

export function ProductCard({ row, rank, category, session, onCompare }: { row: RankedProduct; rank: number; category: Category; session: Session; onCompare: () => void }) {
  const selected = session.compare.includes(row.product.id)
  const extra = row.total.known - row.product.price
  return <article className={`product-card ${rank === 1 ? 'top-pick' : ''}`}>
    <div className="card-art-wrap"><ProductArt product={row.product} /><Badge className={`rank-badge ${rank === 1 && row.score !== null ? 'rank-first' : ''}`}>{row.score === null ? 'Unranked' : rank === 1 ? row.coverage < 1 ? 'Top fit · partial data' : 'Top demo fit' : `#${rank} match`}</Badge></div>
    <div className="product-card-body"><div className="product-title"><div><p className="maker">{row.product.maker}</p><h3>{row.product.name}</h3></div><div className="fit-score"><strong>{row.score === null ? '—' : row.score.toFixed(0)}</strong><span>fit / 100</span></div></div>
      <p className="product-subtitle">{row.product.subtitle}</p>
      <div className="price-row"><span><strong>{money(row.product.price)}</strong> listed</span><span>{money(row.total.known)}{!row.total.complete && '+'} setup</span></div>
      <p className="hidden-cost-note">{extra > 0 ? `+${money(extra)} in estimated essentials` : 'Essentials included in estimate'}{!row.total.complete ? ' · cost incomplete' : ''}</p>
      <div className="strengths">{row.product.strengths.map(strength => <span key={strength}><Check size={13} />{strength}</span>)}</div>
      <p className="tradeoff"><Info size={14} /><span>{row.product.tradeoff}</span></p>
      {row.verification.length > 0
        ? <div className="verification-badge"><CircleHelp size={16} />Missing demo data{row.coverage < 1 && <span> · {(row.coverage * 100).toFixed(0)}% scored</span>}</div>
        : <div className="eligibility-status"><CheckCircle2 size={16} />Matches active demo requirements</div>}
      <div className="card-actions"><ProductDetails row={row} category={category} session={session}><Button variant="outline" size="sm">Why this {category.noun}?<ArrowUpRight size={14} /></Button></ProductDetails><Button variant={selected ? 'secondary' : 'ghost'} size="sm" aria-label={`${selected ? 'Remove' : 'Add'} ${row.product.name} ${selected ? 'from' : 'to'} comparison`} aria-pressed={selected} disabled={!selected && session.compare.length >= 3} onClick={onCompare}>{selected ? <Check size={15} /> : <Plus size={15} />}Compare</Button></div>
    </div>
  </article>
}

export function ExcludedProducts({ rows, category, session, disable }: { rows: RankedProduct[]; category: Category; session: Session; disable: (factorId: string) => void }) {
  return <details className="excluded-section"><summary><span className="excluded-count"><X size={16} />{rows.length} {rows.length === 1 ? 'option' : 'options'} excluded by your requirements</span><span className="small">Still here if things change <Plus size={14} /></span></summary>
    <div className="excluded-list">{rows.map(row => <article className="excluded-product" key={row.product.id}><div><h3>{row.product.maker} {row.product.name}</h3><p className="small muted">{money(row.total.known)}{!row.total.complete && '+'} estimated setup</p>{row.reasons.map(reason => <div key={reason.factorId} className="excluded-reason"><p>{reason.reason}</p><Button size="sm" variant="ghost" onClick={() => disable(reason.factorId)}>Disable {reason.label.toLowerCase()} requirement</Button></div>)}</div><ProductDetails row={row} category={category} session={session}><Button variant="outline" size="sm">Inspect<ArrowUpRight size={13} /></Button></ProductDetails></article>)}{!rows.length && <p className="small muted">All discovered products are currently eligible.</p>}</div>
  </details>
}

export function Comparison({ rows, category, session, open, onOpenChange }: { rows: RankedProduct[]; category: Category; session: Session; open: boolean; onOpenChange: (open: boolean) => void }) {
  const leader = rows[0]
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="comparison-dialog"><DialogHeader><DialogTitle>Different strengths. Your decision.</DialogTitle><DialogDescription>Rankings follow your blockers and importance ratings using this demo catalogue. Missing fields are identified where they affect the comparison.</DialogDescription></DialogHeader>
    {leader && <p className="comparison-lead"><Scale size={18} /><span>{leader.score === null ? 'These options are unranked. Choose at least one priority with known data to rank them.' : <><strong>{leader.product.name}</strong> scores highest among these options under your current priorities{leader.coverage < 1 ? ', with incomplete scoring data' : ''}.</>}</span></p>}
    <p className="comparison-hint small muted">Scroll sideways to compare every option. You can also focus the table and use the arrow keys.</p>
    <div className="comparison-scroll" tabIndex={0} role="region" aria-label="Product comparison; scroll horizontally for more options"><table className="comparison-table"><caption className="sr-only">Side by side comparison using illustrative prices and scores</caption><thead><tr><th scope="col">Consideration</th>{rows.map(row => <th scope="col" key={row.product.id}><span className="small muted">{row.product.maker}</span><strong>{row.product.name}</strong></th>)}</tr></thead><tbody>
      <tr><th scope="row">Illustrative fit</th>{rows.map(row => <td key={row.product.id}><strong>{row.score?.toFixed(1) ?? 'Unranked'}</strong>{row.score !== null && ' / 100'}<small>{(row.coverage * 100).toFixed(0)}% weighted data coverage</small></td>)}</tr>
      <tr><th scope="row">Listed price</th>{rows.map(row => <td key={row.product.id}>{money(row.product.price)}</td>)}</tr>
      <tr><th scope="row">Setup estimate</th>{rows.map(row => <td key={row.product.id}>{money(row.total.known)}{!row.total.complete && '+ — incomplete'}</td>)}</tr>
      {category.factors.filter(f => f.id !== 'price').map(factor => <tr key={factor.id}><th scope="row">{factor.label}<small>Importance {session.weights[factor.id]}/5</small></th>{rows.map(row => { const value = row.product.attributes[factor.id]; return <td key={row.product.id}>{value === null || value === undefined ? 'Not specified in demo' : typeof value === 'boolean' ? value ? 'Yes' : 'No' : `${value}${factor.unit ? ` ${factor.unit}` : ''}`}</td> })}</tr>)}
      <tr><th scope="row">Main trade-off</th>{rows.map(row => <td key={row.product.id}>{row.product.tradeoff}</td>)}</tr>
      <tr><th scope="row">Demo data gaps</th>{rows.map(row => <td key={row.product.id}>{row.verification.length ? row.verification.join(' ') : 'No missing active inputs in this demo.'}</td>)}</tr>
    </tbody></table></div><p className="small muted">Scores describe fit to your priorities, not evidence confidence. All estimates exclude tax. {rows.length < 2 ? 'Only one option is eligible; relax a requirement to compare alternatives.' : 'Keep exploring if these trade-offs do not suit you.'}</p>
  </DialogContent></Dialog>
}
