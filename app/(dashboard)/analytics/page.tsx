import { redirect } from 'next/navigation'
import { BarChart, TrendingUp, Target, Activity, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch all user reviews to calculate aggregates
  const { data: reviews } = await supabase
    .from('resume_reviews')
    .select('ats_score, overall_score, interview_readiness_score, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  const totalReviews = reviews?.length || 0
  
  // Calculate averages
  let avgAts = 0
  let avgOverall = 0
  let avgInterview = 0

  if (totalReviews > 0 && reviews) {
    avgAts = Math.round(reviews.reduce((acc, curr) => acc + curr.ats_score, 0) / totalReviews)
    avgOverall = Math.round(reviews.reduce((acc, curr) => acc + curr.overall_score, 0) / totalReviews)
    avgInterview = Math.round(reviews.reduce((acc, curr) => acc + curr.interview_readiness_score, 0) / totalReviews)
  }

  return (
    <div className="max-w-5xl space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Performance Analytics</h2>
        <p className="text-muted-foreground">
          Track your resume quality and interview readiness over time.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Total Reviews" 
          value={totalReviews} 
          icon={<FileText className="h-4 w-4 text-muted-foreground" />} 
        />
        <MetricCard 
          title="Avg. ATS Score" 
          value={`${avgAts}%`} 
          icon={<Target className="h-4 w-4 text-muted-foreground" />} 
        />
        <MetricCard 
          title="Avg. Overall Score" 
          value={`${avgOverall}%`} 
          icon={<Activity className="h-4 w-4 text-muted-foreground" />} 
        />
        <MetricCard 
          title="Interview Readiness" 
          value={`${avgInterview}%`} 
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />} 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              Score Distribution
            </CardTitle>
            <CardDescription>Average performance across all your analyzed resumes.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">ATS Compatibility</span>
                <span className="text-muted-foreground">{avgAts}%</span>
              </div>
              <Progress value={avgAts} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Resume Quality</span>
                <span className="text-muted-foreground">{avgOverall}%</span>
              </div>
              <Progress value={avgOverall} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Interview Readiness</span>
                <span className="text-muted-foreground">{avgInterview}%</span>
              </div>
              <Progress value={avgInterview} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-muted/10 border-dashed">
          <CardHeader>
            <CardTitle>Continuous Improvement</CardTitle>
            <CardDescription>How to interpret your analytics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">ATS Score:</strong> This indicates how well your resume's keywords match the job descriptions you are targeting. Aim for 80%+ before submitting an application.
            </p>
            <p>
              <strong className="text-foreground">Overall Score:</strong> This measures the fundamental quality of your resume—formatting, grammar, brevity, and action-oriented language.
            </p>
            <p>
              <strong className="text-foreground">Pro Tip:</strong> Use the "AI Rewrites" tab in your individual review reports to instantly improve your weakest bullet points and boost these averages.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}