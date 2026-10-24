import { money } from './engine.ts'
import type { Category, RankedProduct, Session, Value } from './types.ts'

export interface ComparisonField {
  id: string
  label: string
  values: string[]
  differs: boolean
  importance: number
}

function formatFactor(value: Value | undefined, unit?: string): string {
  if (value === undefined || value === null) return 'Not specified'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  return String(value) + (unit ? ` ${unit}` : '')
}

/** Generate a stable, preference-aware comparison without dropping unselected finalists. */
export function comparisonFields(category: Category, rows: RankedProduct[], session: Session): ComparisonField[] {
  const candidates = [
    {
      id: 'setup', label: 'Estimated total setup',
      values: rows.map(row => `${money(row.total.known)}${row.total.complete ? '' : ' + unknown extras'}`),
      importance: (session.weights.price ?? 0) + 1,
    },
    {
      id: 'listed', label: 'Listed demo price',
      values: rows.map(row => money(row.product.price)),
      importance: session.weights.price ?? 0,
    },
    ...category.factors.filter(f => f.id !== 'price').map(factor => ({
      id: factor.id, label: factor.label,
      values: rows.map(row => formatFactor(row.product.attributes[factor.id], factor.unit)),
      importance: session.weights[factor.id] ?? 0,
    })),
  ]
  return candidates.map(field => ({
    ...field,
    differs: new Set(field.values).size > 1,
  })).sort((a, b) =>
    Number(b.differs) - Number(a.differs) ||
    b.importance - a.importance ||
    a.label.localeCompare(b.label))
}

export type ComparisonMode = 'all' | 'selected'

/** All remaining products are the default. A focused subset is opt-in only. */
export function selectComparisonRows(eligible: RankedProduct[], selectedIds: string[], mode: ComparisonMode): RankedProduct[] {
  if (mode !== 'selected') return eligible
  const selected = eligible.filter(row => selectedIds.includes(row.product.id))
  return selected.length >= 2 ? selected : eligible
}
