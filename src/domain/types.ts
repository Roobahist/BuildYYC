export type Value = string | number | boolean | null
export type Confidence = 'High' | 'Medium' | 'Low' | 'Unknown'

export interface Evidence {
  id: string
  claim: string
  title: string
  url?: string
  type: 'Manufacturer' | 'Retailer' | 'Independent review' | 'YouTube' | 'Reddit' | 'Customer review' | 'Demo assumption'
  date?: string
  checkedAt?: string
  confidence: Confidence
  relevance: string
  limitation: string
}

export interface Cost {
  id: string
  label: string
  amount: number | null
  status: 'required' | 'optional' | 'included'
  ownable?: boolean
}

export interface Product {
  id: string
  name: string
  maker: string
  subtitle: string
  price: number
  visual: 'portable' | 'console' | 'couch'
  color: string
  attributes: Record<string, Value>
  scores: Record<string, number | null>
  costs: Cost[]
  strengths: string[]
  tradeoff: string
  evidence: Evidence[]
  concerns: string[]
}

export interface Factor {
  id: string
  label: string
  explanation: string
  kind: 'max' | 'min' | 'boolean' | 'select' | 'ordinal'
  unit?: string
  min?: number
  max?: number
  step?: number
  defaultValue: Exclude<Value, null>
  defaultWeight: number
  scoring: 'lower' | 'higher' | 'curated' | 'boolean' | 'match'
  options?: string[]
  question?: { title: string; why: string; priority: number; yes: string; no: string; critical?: boolean }
}

export interface Category {
  id: string
  name: string
  noun: string
  description: string
  prompt: string
  defaultBudget: number
  factors: Factor[]
  products: Product[]
}

export interface Constraint { active: boolean; value: Exclude<Value, null> }
export interface Session {
  categoryId: string
  constraints: Record<string, Constraint>
  weights: Record<string, number>
  answers: Record<string, 'required' | 'flexible' | 'skipped'>
  owned: string[]
  budgetBasis: 'total' | 'listed'
  compare: string[]
}

export interface CostTotal { known: number; complete: boolean; unknown: string[] }
export interface RequirementResult { factorId: string; label: string; status: 'met' | 'failed' | 'unknown'; reason: string }
export interface ScorePart { factorId: string; label: string; weight: number; score: number | null; contribution: number | null }
export interface RankedProduct {
  product: Product
  total: CostTotal
  requirements: RequirementResult[]
  reasons: RequirementResult[]
  verification: string[]
  score: number | null
  coverage: number
  breakdown: ScorePart[]
}

export interface Question { factor: Factor; eliminates: number; uncertain: number; remains: number; priority: number }
export interface Decision {
  eligible: RankedProduct[]
  excluded: RankedProduct[]
  needsVerification: RankedProduct[]
  nextQuestion?: Question
  concerns: string[]
}
