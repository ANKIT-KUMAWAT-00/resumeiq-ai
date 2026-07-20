import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download, FileText, Target, Zap } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { ReviewReport } from '@/lib/gemini/schema'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { ScoreCircle } from '@/components/review/score-circle'
import { KeywordChips } from '@/components/review/keyword-chips'
import { BulletRewrite } from '@/components/review/bullet-rewrite'

export default async function ReviewReportPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // In Next.js 15, params is a Promise that must be awaited
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: review, error } = await supabase
    .from('resume_reviews')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error || !review) notFound()

  // Typecast the JSONB column to our expected schema
  const report = review.report as ReviewReport
  const reviewDate = new Date(review.created_at).toLocaleDateString()

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b pb-6">
        <div>
          <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
          <h2 className="text-3xl font-bold tracking-tight flex items-center">
            <FileText className="mr-3 h-8 w-8 text-primary" />
            Analysis Report
          </h2>
          <p className="text-muted-foreground mt-1">
            {review.resume_filename} • Analyzed on {reviewDate}
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
      </div>

      {/* Top Scores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="flex items-center justify-center p-6">
          <ScoreCircle 
            score={report.atsScore} 
            label="ATS Match" 
            size="lg"
            description="How well your resume matches the job description keywords." 
          />
        </Card>
        <Card className="flex items-center justify-center p-6">
          <ScoreCircle 
            score={report.overallScore} 
            label="Overall Quality" 
            size="lg"
            description="Based on impact, brevity, grammar, and formatting." 
          />
        </Card>
        <Card className="flex items-center justify-center p-6">
          <ScoreCircle 
            score={report.interviewReadinessScore} 
            label="Interview Readiness" 
            size="lg"
            description="Your likelihood of securing an interview with this resume." 
          />
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 h-auto md:h-10 mb-8">
          <TabsTrigger value="overview" className="py-2 md:py-1">Overview & Summary</TabsTrigger>
          <TabsTrigger value="keywords" className="py-2 md:py-1">Keywords & Skills</TabsTrigger>
          <TabsTrigger value="bullets" className="py-2 md:py-1">AI Rewrites</TabsTrigger>
          <TabsTrigger value="action" className="py-2 md:py-1">Action Plan</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 animate-in fade-in-50">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-xl">
                <Target className="mr-2 h-5 w-5 text-primary" />
                Executive Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2 text-muted-foreground uppercase tracking-wider">The Verdict</h4>
                  <p className="leading-relaxed">{report.overallRecommendation}</p>
                </div>
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 mt-4">
                  <h4 className="font-semibold text-sm mb-2 text-primary uppercase tracking-wider">Suggested Profile Summary</h4>
                  <p className="leading-relaxed font-medium">{report.improvedSummary}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-green-500">Core Strengths</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  {report.strengths.map((str, i) => (
                    <li key={i} className="text-sm">{str}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-red-500">Critical Weaknesses</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  {report.weaknesses.map((weak, i) => (
                    <li key={i} className="text-sm">{weak}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="keywords" className="space-y-6 animate-in fade-in-50">
          <Card>
            <CardHeader>
              <CardTitle>ATS Keyword Analysis</CardTitle>
              <CardDescription>Missing these keywords could cause auto-rejection from the Applicant Tracking System.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div>
                <h4 className="text-sm font-semibold mb-3">Missing Hard Skills</h4>
                <KeywordChips keywords={report.missingSkills} type="missing" />
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-3">Missing Job Description Keywords</h4>
                <KeywordChips keywords={report.missingKeywords} type="missing" />
              </div>
              <div>
                <h4 className="text-sm font-semibold mb-3">Skills to Emphasize More</h4>
                <KeywordChips keywords={report.suggestedSkills} type="suggested" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bullets" className="animate-in fade-in-50">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5 text-yellow-500" />
                High-Impact Bullet Rewrites
              </CardTitle>
              <CardDescription>
                We applied the XYZ formula (Accomplished [X] as measured by [Y], by doing [Z]) to your weakest bullet points.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BulletRewrite bullets={report.improvedBullets} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="action" className="space-y-6 animate-in fade-in-50">
          <Card>
            <CardHeader>
              <CardTitle>Formatting & Grammar</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase">Formatting Issues</h4>
                <ul className="list-disc pl-5 space-y-2">
                  {report.formattingIssues.map((issue, i) => (
                    <li key={i} className="text-sm">{issue}</li>
                  ))}
                  {report.formattingIssues.length === 0 && <li className="text-sm text-green-500">No formatting issues detected!</li>}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase">Grammar & Tone</h4>
                <ul className="list-disc pl-5 space-y-2">
                  {report.grammarSuggestions.map((sug, i) => (
                    <li key={i} className="text-sm">{sug}</li>
                  ))}
                  {report.grammarSuggestions.length === 0 && <li className="text-sm text-green-500">Grammar looks perfect!</li>}
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps & Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {report.recommendedImprovements.map((rec, i) => (
                  <li key={i} className="flex gap-3 bg-muted/20 p-4 rounded-lg border">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {i + 1}
                    </span>
                    <p className="text-sm leading-relaxed pt-0.5">{rec}</p>
                  </li>
                ))}
              </ul>
              
              {report.suggestedProjects.length > 0 && (
                <div className="mt-8">
                  <h4 className="font-semibold mb-4">Recommended Portfolio Projects</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    {report.suggestedProjects.map((proj, i) => (
                      <li key={i} className="text-sm">{proj}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}