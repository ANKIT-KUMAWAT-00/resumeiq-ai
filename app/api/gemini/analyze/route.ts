import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'
import { reviewReportSchema } from '@/lib/gemini/schema'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-2.0-flash' })

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { resumeText, jobDescription, filename } = await request.json()
    if (!resumeText || !jobDescription) {
      return NextResponse.json({ error: 'Missing resume text or job description' }, { status: 400 })
    }

    // 1. Check Limits & Gating
    const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single()
    const isPro = profile?.plan === 'pro'
    const today = new Date().toISOString().split('T')[0]

    if (!isPro) {
      const { data: usage } = await supabase
        .from('usage_logs')
        .select('count')
        .eq('user_id', user.id)
        .eq('action', 'resume_review')
        .eq('usage_date', today)
        .single()

      if (usage && usage.count >= 3) {
        return NextResponse.json({ error: 'Daily free limit reached. Please upgrade to Pro.' }, { status: 429 })
      }
    }

    // 2. Build Prompt
    const systemPrompt = `
      You are an expert ATS (Applicant Tracking System) software and a Senior Tech Recruiter.
      Analyze the provided Resume against the provided Job Description.
      You MUST respond ONLY with a valid JSON object matching the exact schema below. No markdown formatting outside the JSON block, no conversational text.
      
      Schema:
      {
        "atsScore": number (0-100),
        "overallScore": number (0-100),
        "interviewReadinessScore": number (0-100),
        "strengths": string[],
        "weaknesses": string[],
        "missingKeywords": string[],
        "missingSkills": string[],
        "formattingIssues": string[],
        "grammarSuggestions": string[],
        "sectionScores": { "impact": number, "brevity": number, "style": number, "skills": number },
        "recommendedImprovements": string[],
        "improvedSummary": string,
        "improvedBullets": [{ "original": string, "improved": string, "explanation": string }],
        "suggestedProjects": string[],
        "suggestedSkills": string[],
        "overallRecommendation": string
      }
    `
    const userPrompt = `Job Description:\n${jobDescription}\n\nResume:\n${resumeText}`

    // 3. Call Gemini
    const result = await model.generateContent([systemPrompt, userPrompt])
    let responseText = result.response.text()
    
    // Clean potential markdown blocks
    responseText = responseText.replace(/```json\n?|\n?```/g, '').trim()
    let parsedJson = {}

    // 4. Validate & Retry Logic
    try {
      parsedJson = JSON.parse(responseText)
      reviewReportSchema.parse(parsedJson)
    } catch (parseError) {
      console.warn("Gemini output failed validation, triggering retry...", parseError)
      // Automatic Error-Correction Retry
      const retryPrompt = `Your previous response failed JSON schema validation. Fix the errors and return ONLY valid JSON matching the exact schema requested. Previous output: ${responseText}`
      const retryResult = await model.generateContent([systemPrompt, userPrompt, retryPrompt])
      let retryText = retryResult.response.text().replace(/```json\n?|\n?```/g, '').trim()
      
      try {
        parsedJson = JSON.parse(retryText)
        reviewReportSchema.parse(parsedJson)
      } catch (fatalError) {
        return NextResponse.json({ error: 'AI failed to generate a valid report. Please try again.' }, { status: 500 })
      }
    }

    const finalReport = parsedJson as any

    // 5. Persist to DB
    const { data: review, error: dbError } = await supabase.from('resume_reviews').insert({
      user_id: user.id,
      resume_filename: filename || 'resume.pdf',
      resume_text: resumeText,
      job_description: jobDescription,
      ats_score: finalReport.atsScore,
      overall_score: finalReport.overallScore,
      interview_readiness_score: finalReport.interviewReadinessScore,
      report: finalReport
    }).select('id').single()

    if (dbError) throw dbError

    // 6. Increment Usage Log (Upsert)
    if (!isPro) {
      const { data: existingUsage } = await supabase
        .from('usage_logs')
        .select('count')
        .eq('user_id', user.id)
        .eq('action', 'resume_review')
        .eq('usage_date', today)
        .single()

      if (existingUsage) {
        await supabase.from('usage_logs').update({ count: existingUsage.count + 1 }).eq('user_id', user.id).eq('action', 'resume_review').eq('usage_date', today)
      } else {
        await supabase.from('usage_logs').insert({ user_id: user.id, action: 'resume_review', usage_date: today, count: 1 })
      }
    }

    return NextResponse.json({ reviewId: review.id })
  } catch (error: any) {
    console.error('Gemini Analyze API Error:', error)
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
  }
}