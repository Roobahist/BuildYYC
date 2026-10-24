import { useState } from 'react'
import { ArrowUpRight, BookOpen, CheckCircle2, Eye, Scale } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { comparisonFields } from '@/domain/comparison'
import type { Category, RankedProduct, Session } from '@/domain/types'

export function Comparison({
  rows, category, session, open, onOpenChange,
}: {
  rows: RankedProduct[]
  category: Category
  session: Session
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [differencesOnly, setDifferencesOnly] = useState(true)
  const leader = rows[0]
  const fields = comparisonFields(category, rows, session)
  const differences = fields.filter(field => field.differs)
  const displayed = differencesOnly && differences.length ? differences : fields
  const keyDifferences = differences.slice(0, 3)

  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="comparison-dialog comparison-dialog-wide">
      <DialogHeader>
        <div className="comparison-titleline">
          <span className="comparison-eyebrow"><Scale size={16} /> {rows.length} remaining {rows.length === 1 ? 'option' : 'options'}</span>
          <span className="comparison-difference-count">{differences.length} distinguishing factors</span>
        </div>
        <DialogTitle>See exactly what sets them apart.</DialogTitle>
        <DialogDescription>All displayed options are included in this comparison. Simulated offer details and scores are used consistently; external references are linked where available.</DialogDescription>
      </DialogHeader>

      {leader && <div className="comparison-lead">
        <CheckCircle2 size={20} />
        <span>{leader.score === null
          ? 'No option is ranked yet. Set at least one scoring priority.'
          : <><strong>{leader.product.maker} {leader.product.name}</strong> ranks first among these options for your current weights{leader.coverage < 1 ? ', using partial scored data' : ''}. Change your priorities to see the trade-offs move.</>}</span>
      </div>}

      {keyDifferences.length > 0 && <section className="comparison-spotlight" aria-labelledby="comparison-spotlight-title">
        <h3 id="comparison-spotlight-title">Biggest differences</h3>
        <div className="comparison-difference-cards">
          {keyDifferences.map(field => <article className="comparison-difference-card" key={field.id}>
            <h4>{field.label}</h4>
            <div className="comparison-difference-values">
              {rows.map((row, i) => <div key={row.product.id}>
                <span>{row.product.maker} {row.product.name}</span>
                <strong>{field.values[i]}</strong>
              </div>)}
            </div>
          </article>)}
        </div>
      </section>}

      <section className="comparison-table-section" aria-labelledby="comparison-table-title">
        <div className="comparison-table-heading">
          <div><h3 id="comparison-table-title">Side-by-side details</h3><p>{differencesOnly ? 'Showing what changes between these choices.' : 'Showing shared and different factors.'}</p></div>
          <Button variant="outline" size="sm" aria-pressed={differencesOnly} onClick={() => setDifferencesOnly(!differencesOnly)}>
            <Eye size={15} />{differencesOnly ? 'Show all factors' : 'Show differences only'}
          </Button>
        </div>
        <p className="comparison-scroll-help">Scroll horizontally to see all {rows.length} products. The factor column stays visible.</p>
        <div className="comparison-scroll" tabIndex={0} role="region" aria-label="Scrollable side-by-side comparison of all displayed products">
          <table className="comparison-table comparison-table-emphasis" style={{ minWidth: Math.max(720, 190 + rows.length * 210) }}>
            <caption className="sr-only">Comparison of all displayed products, with differences highlighted</caption>
            <thead><tr><th scope="col">Factor</th>{rows.map((row, index) => <th scope="col" key={row.product.id}>
              <span className="comparison-col-index">#{index + 1} under your priorities</span>
              <strong>{row.product.maker} {row.product.name}</strong>
              <span className="comparison-col-score">{row.score === null ? 'Unranked' : `${row.score.toFixed(0)} / 100 fit`}</span>
            </th>)}</tr></thead>
            <tbody>
              {displayed.map(field => <tr key={field.id} className={field.differs ? 'compare-row-different' : 'compare-row-same'}>
                <th scope="row"><strong>{field.label}</strong>{field.differs && <span className="comparison-changed-tag">Different</span>}
                  <small>Importance {field.id === 'setup' || field.id === 'listed' ? session.weights.price : field.importance}/5</small>
                </th>
                {field.values.map((value, i) => <td key={rows[i].product.id}><span className={value === 'Not specified' ? 'comparison-missing' : 'comparison-value'}>{value}</span></td>)}
              </tr>)}
              <tr className="comparison-evidence-row"><th scope="row"><strong>Evidence</strong><small>Direct sources or demo inputs</small></th>
                {rows.map(row => {
                  const sources = row.product.evidence.filter(source => source.url)
                  return <td key={row.product.id}>
                    {sources.length ? sources.map(source => <a href={source.url} className="comparison-evidence-link" key={source.id} target="_blank" rel="noreferrer"><BookOpen size={14} />{source.title}<ArrowUpRight size={13} /></a>)
                    : <span className="comparison-muted">Curated demo profile</span>}
                    <span className="comparison-source-footnote">Sample offer data</span>
                  </td>
                })}
              </tr>
              <tr><th scope="row"><strong>Main trade-off</strong></th>{rows.map(row => <td key={row.product.id}>{row.product.tradeoff}</td>)}</tr>
              <tr><th scope="row"><strong>Missing demo inputs</strong></th>{rows.map(row => <td key={row.product.id}>{row.verification.length ? row.verification.join(' ') : 'None in active scoring'}</td>)}</tr>
            </tbody>
          </table>
        </div>
      </section>
      <p className="comparison-disclaimer">Scores describe fit under your priorities, not a measured product rating. Prices and seller terms are demo assumptions, not current offers.</p>
    </DialogContent>
  </Dialog>
}
