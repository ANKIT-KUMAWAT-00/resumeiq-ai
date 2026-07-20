export const FREE_DAILY_LIMIT = 3

export type Feature = 'unlimitedReviews' | 'advancedATS' | 'aiRewrite' | 'keywordOptimization' | 'pdfExport' | 'priorityAI'

const proFeatures: Record<Feature, boolean> = {
  unlimitedReviews: true,
  advancedATS: true,
  aiRewrite: true,
  keywordOptimization: true,
  pdfExport: true,
  priorityAI: true,
}

const freeFeatures: Record<Feature, boolean> = {
  unlimitedReviews: false,
  advancedATS: false,
  aiRewrite: false,
  keywordOptimization: false,
  pdfExport: false,
  priorityAI: false,
}

export function hasFeature(plan: 'free' | 'pro', feature: Feature): boolean {
  if (plan === 'pro') return proFeatures[feature]
  return freeFeatures[feature]
}