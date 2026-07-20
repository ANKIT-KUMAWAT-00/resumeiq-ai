import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus, ArrowRight, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PlanBadge } from '@/components/dashboard/plan-badge'
import { UsageCounter } from '@/components/dashboard/usage-counter'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // 1. Authenticate
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // 2. Fetch Profile (Plan status)
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, plan')
    .eq('id', user.id)
    .single()

  const userPlan = profile?.plan || 'free'

  // 3. Fetch Today's Usage
  const today = new Date().toISOString().split('T')[0]
  const { data: usage } = await supabase
    .from('usage_logs')
    .select('count')
    .eq('user_id', user.id)
    .eq('action', 'resume_review')
    .eq('usage_date', today)
    .single()

  const todayCount = usage?.count || 0
  const FREE_DAILY_LIMIT = 3

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}
          </h2>
          <p className="text-muted-foreground mt-1">
            Here is an overview of your resume reviews and account status.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <PlanBadge plan={userPlan as 'free' | 'pro'} />
          <Link href="/review/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Review
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats / Quick Actions Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <UsageCounter 
          count={todayCount} 
          limit={FREE_DAILY_LIMIT} 
          plan={userPlan as 'free' | 'pro'} 
        />
        
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link href="/review/new" className="flex-1">
              <Button variant="outline" className="w-full h-24 flex flex-col gap-2 bg-muted/20">
                <Plus className="h-6 w-6 text-primary" />
                Upload New Resume
              </Button>
            </Link>
            <Link href="/history" className="flex-1">
              <Button variant="outline" className="w-full h-24 flex flex-col gap-2 bg-muted/20">
                <FileText className="h-6 w-6 text-muted-foreground" />
                View Past Reviews
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Skeleton (Placeholder for actual data) */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reviews</CardTitle>
          <CardDescription>Your most recently analyzed resumes will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed rounded-lg bg-muted/10">
            <div className="bg-primary/10 p-3 rounded-full mb-4">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-1">No reviews yet</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              Upload your resume and a job description to get your first AI-powered analysis.
            </p>
            <Link href="/review/new">
              <Button size="sm">
                Start First Review
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}