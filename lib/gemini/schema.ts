import { z } from 'zod'

export const reviewReportSchema = z.object({
  atsScore: z.number().min(0).max(100),
  overallScore: z.number().min(0).max(100),
  interviewReadinessScore: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  missingSkills: z.array(z.string()),
  formattingIssues: z.array(z.string()),
  grammarSuggestions: z.array(z.string()),
  sectionScores: z.object({
    impact: z.number().min(0).max(100),
    brevity: z.number().min(0).max(100),
    style: z.number().min(0).max(100),
    skills: z.number().min(0).max(100),
  }),
  recommendedImprovements: z.array(z.string()),
  improvedSummary: z.string(),
  improvedBullets: z.array(z.object({
    original: z.string(),
    improved: z.string(),
    explanation: z.string()
  })),
  suggestedProjects: z.array(z.string()),
  suggestedSkills: z.array(z.string()),
  overallRecommendation: z.string(),
})

export type ReviewReport = z.infer<typeof reviewReportSchema>