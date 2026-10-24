import type { Category, Evidence, Factor, Product } from './types.ts'
import { images } from './images.ts'

// The named laptop families are real; configurations, prices, performance ratings,
// return terms and accessory costs below are invented for the interactive demo.
const demoSource: Evidence = {
  id: 'laptop-demo-assumptions',
  claim: 'Laptop configurations, practical attributes, prices and scores are curated demonstration inputs.',
  title: 'Considered laptop demonstration',
  type: 'Demo assumption',
  confidence: 'Unknown',
  relevance: 'Allows differences in OS, ports, memory, mobility and total costs to drive decisions.',
  limitation: 'These are not live product listings or verified specifications. Photos represent the model family only.',
}

const factors: Factor[] = [
  {
    id: 'price', label: 'Price', kind: 'max', scoring: 'lower',
    min: 0, max: 2500, step: 25, defaultValue: 1800, defaultWeight: 3, unit: 'CAD',
    explanation: 'The hard budget and relative price importance are independent. Setup total includes a required adapter if the demo profile needs it.',
  },
  {
    id: 'os', label: 'Operating system', kind: 'select', scoring: 'match',
    options: ['Windows', 'macOS'], defaultValue: 'Windows', defaultWeight: 0,
    explanation: 'An application can require a specific OS. Match exact compatibility first, then compare preferences.',
    question: {
      title: 'Do you need Windows-only applications?',
      why: 'An OS incompatibility is a deal-breaker, not a small preference. Requiring Windows removes the macOS option.',
      yes: 'Yes, Windows is required', no: 'Either OS works', priority: 13,
    },
  },
  {
    id: 'memoryGb', label: 'Installed memory', kind: 'min', scoring: 'higher',
    unit: 'GB', min: 8, max: 64, step: 8, defaultValue: 32, defaultWeight: 2,
    explanation: 'Memory can matter for large workloads. Demo configurations reflect specific assumed variants, not every available model.',
    question: {
      title: 'Will 16 GB become a limitation?',
      why: 'Demanding 32 GB now can remove attractive lower-memory options before you compare screens and prices.',
      yes: 'Require at least 32 GB', no: '16 GB can work', priority: 12,
    },
  },
  {
    id: 'usbA', label: 'Built-in USB-A port', kind: 'boolean', scoring: 'boolean',
    defaultValue: true, defaultWeight: 0,
    explanation: 'A USB-A adapter can add cost, but an adapter does not meet a hard requirement for a built-in port.',
    question: {
      title: 'Need a USB-A port without a dongle?',
      why: 'Some thin laptops need adapters for existing devices. Requiring a built-in port rules those out.',
      yes: 'Must have USB-A built in', no: 'An adapter is fine', priority: 9,
    },
  },
  {
    id: 'convertible', label: '2-in-1 convertible', kind: 'boolean', scoring: 'boolean',
    defaultValue: true, defaultWeight: 0,
    explanation: 'Only require tablet/pen-style 2-in-1 use if it is essential. The catalogue contains ordinary clamshells too.',
    question: {
      title: 'Would you actually use it as a tablet?',
      why: 'A 360-degree hinge eliminates ordinary laptops; avoid paying for it if you never need it.',
      yes: 'A 2-in-1 is essential', no: 'A normal laptop is fine', priority: 7,
    },
  },
  {
    id: 'weightKg', label: 'Carry weight', kind: 'max', scoring: 'lower',
    unit: 'kg', min: 0.5, max: 3, step: 0.05, defaultValue: 1.45, defaultWeight: 2,
    explanation: 'Illustrative laptop-only weights. Charger and case add to everyday carry weight.',
    question: {
      title: 'Will you carry it every day?',
      why: 'A 1.45 kg limit can eliminate heavier devices while leaving several portable alternatives.',
      yes: 'Maximum 1.45 kg', no: 'Weight is flexible', priority: 8,
    },
  },
  {
    id: 'batteryHours', label: 'Battery life', kind: 'min', scoring: 'higher',
    unit: 'hours', min: 0, max: 20, step: 1, defaultValue: 10, defaultWeight: 3,
    explanation: 'Hours are illustrative comparisons under an unspecified workload, not independent battery benchmarks.',
    question: {
      title: 'Do you need long stretches without charging?',
      why: 'A 10-hour minimum can exclude laptops optimized for other priorities.',
      yes: 'Require at least 10 hours', no: 'I can charge often', priority: 10,
    },
  },
  {
    id: 'performance', label: 'Workload performance', kind: 'ordinal', scoring: 'curated',
    min: 0, max: 100, step: 5, defaultValue: 70, defaultWeight: 4, unit: '/100',
    explanation: 'A curated relative illustration, not a measured CPU/GPU benchmark.',
  },
  {
    id: 'display', label: 'Display experience', kind: 'ordinal', scoring: 'curated',
    min: 0, max: 100, step: 5, defaultValue: 70, defaultWeight: 3, unit: '/100',
    explanation: 'Subjective demo score representing brightness, contrast and viewing comfort.',
  },
  {
    id: 'returnDays', label: 'Return window', kind: 'min', scoring: 'higher',
    min: 0, max: 90, step: 1, unit: 'days', defaultValue: 30, defaultWeight: 1,
    explanation: 'Simulated return periods. A real return policy also includes exclusions, condition requirements and shipping fees.',
    question: {
      title: 'Need at least 30 days to try it?',
      why: 'The demo offers have different return windows. A strict minimum removes the shorter ones.',
      yes: 'Require 30-day returns', no: 'Shorter returns are okay', priority: 5,
    },
  },
]

interface LaptopOffer {
  id: string; maker: string; name: string; subtitle: string; price: number
  os: 'Windows' | 'macOS'; memoryGb: number; weightKg: number; usbA: boolean
  convertible: boolean; batteryHours: number; performance: number; display: number
  returnDays: number; delivery: number; color: string
  strengths: string[]; tradeoff: string
}

function laptop(p: LaptopOffer): Product {
  return {
    id: p.id, maker: p.maker, name: p.name, subtitle: p.subtitle,
    price: p.price, visual: 'laptop', color: p.color, image: images[p.id],
    attributes: {
      os: p.os, memoryGb: p.memoryGb, weightKg: p.weightKg,
      usbA: p.usbA, convertible: p.convertible, batteryHours: p.batteryHours,
      performance: p.performance, display: p.display, returnDays: p.returnDays,
    },
    scores: { performance: p.performance, display: p.display },
    costs: [
      { id: 'usbAdapter', label: 'USB-A adapter', amount: 45, status: p.usbA ? 'optional' : 'required', ownable: true },
      { id: 'delivery', label: 'Delivery', amount: p.delivery, status: 'required' },
      { id: 'sleeve', label: 'Protective sleeve', amount: 35, status: 'optional', ownable: true },
    ],
    strengths: p.strengths, tradeoff: p.tradeoff,
    evidence: [demoSource],
    concerns: ['Sample specifications and prices are simulated. Check the exact seller configuration for real purchases.'],
  }
}

export const laptopCategory: Category = {
  id: 'laptops',
  name: 'Laptops',
  noun: 'laptop',
  description: 'Compatibility first. Then performance, battery, ports and price.',
  prompt: 'I need a laptop under $1,800.',
  defaultBudget: 1800,
  factors,
  products: [
    laptop({
      id: 'macbook-air-m4', maker: 'Apple', name: 'MacBook Air 13 M4',
      subtitle: 'Thin, light and long-lasting', price: 1399, os: 'macOS',
      memoryGb: 16, weightKg: 1.24, usbA: false, convertible: false,
      batteryHours: 14, performance: 86, display: 86, returnDays: 14, delivery: 0,
      color: '#95a8c4', strengths: ['Portable', 'Long demo battery life'],
      tradeoff: 'No built-in USB-A. Windows-only software is a blocker.',
    }),
    laptop({
      id: 'dell-inspiron14', maker: 'Dell', name: 'Inspiron 14',
      subtitle: 'Everyday value with familiar ports', price: 949, os: 'Windows',
      memoryGb: 16, weightKg: 1.57, usbA: true, convertible: false,
      batteryHours: 8, performance: 72, display: 70, returnDays: 30, delivery: 25,
      color: '#9eabb5', strengths: ['Lower price', 'Built-in USB-A'],
      tradeoff: 'Heavier and shorter illustrative battery life.',
    }),
    laptop({
      id: 'asus-zenbook14', maker: 'ASUS', name: 'Zenbook 14 OLED',
      subtitle: 'Vivid display in a light chassis', price: 1299, os: 'Windows',
      memoryGb: 16, weightKg: 1.28, usbA: true, convertible: false,
      batteryHours: 11, performance: 85, display: 97, returnDays: 14, delivery: 0,
      color: '#c2cbd3', strengths: ['High display score', 'Portable'],
      tradeoff: '16 GB demo configuration, not a convertible.',
    }),
    laptop({
      id: 'lenovo-yoga7i', maker: 'Lenovo', name: 'Yoga 7i 14 2-in-1',
      subtitle: 'Touch and pen-style flexibility', price: 1449, os: 'Windows',
      memoryGb: 32, weightKg: 1.41, usbA: true, convertible: true,
      batteryHours: 11, performance: 86, display: 90, returnDays: 30, delivery: 0,
      color: '#868998', strengths: ['2-in-1 flexibility', '32 GB in demo'],
      tradeoff: 'Costs more than the clamshell value option.',
    }),
    laptop({
      id: 'thinkpad-e14', maker: 'Lenovo', name: 'ThinkPad E14 Gen 6',
      subtitle: 'Connectivity and practical memory', price: 1199, os: 'Windows',
      memoryGb: 32, weightKg: 1.45, usbA: true, convertible: false,
      batteryHours: 9, performance: 83, display: 72, returnDays: 30, delivery: 20,
      color: '#414853', strengths: ['32 GB in demo', 'Practical ports'],
      tradeoff: 'The illustrative screen score and battery trail lighter rivals.',
    }),
    laptop({
      id: 'hp-envy-x360', maker: 'HP', name: 'Envy x360 15',
      subtitle: 'Roomy convertible for desk use', price: 1599, os: 'Windows',
      memoryGb: 32, weightKg: 1.78, usbA: true, convertible: true,
      batteryHours: 9, performance: 84, display: 86, returnDays: 14, delivery: 0,
      color: '#515967', strengths: ['Large convertible design', '32 GB in demo'],
      tradeoff: 'Heaviest demo option; not ideal for all-day carrying.',
    }),
  ],
}
