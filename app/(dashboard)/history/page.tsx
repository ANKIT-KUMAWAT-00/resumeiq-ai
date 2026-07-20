import Link from 'next/link'
import { redirect } from 'next/navigation'
import { FileText, Calendar, ArrowRight, Plus } from 'lucide-react'

import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DeleteReviewButton } from '@/components/dashboard/delete-review-button'

export default async function HistoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: reviews } = await supabase
    .from('resume_reviews')
    .select('id, resume_filename, ats_score, overall_score, created_at, job_description')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Review History</h2>
          <p className="text-muted-foreground">
            Access and manage all your past AI resume analyses.
          </p>
        </div>
        <Link href="/review/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Review
          </Button>
        </Link>
      </div>

      {!reviews || reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-lg bg-muted/10">
          <FileText className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">No reviews found</h3>
          <p className="text-muted-foreground max-w-sm mb-6">
            You haven&apos;t analyzed any resumes yet. Start your first review to see insights here.
          </p>
          <Link href="/review/new">
            <Button>Upload Resume</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => {
            const date = new Date(review.created_at).toLocaleDateString(undefined, {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })
            
            // Truncate job description for preview
            const jdPreview = review.job_description.length > 80 
              ? review.job_description.substring(0, 80) + '...' 
              : review.job_description

            return (
              <Card key={review.id} className="flex flex-col">
                <CardHeader className="pb-3 flex flex-row items-start justify-between space-y-0">
                  <div className="space-y-1 pr-4 truncate">
                    <CardTitle className="text-base truncate" title={review.resume_filename}>
                      {review.resume_filename}
                    </CardTitle>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="mr-1 h-3 w-3" />
                      {date}
                    </div>
                  </div>
                  <DeleteReviewButton id={review.id} />
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant={review.ats_score >= 80 ? 'default' : review.ats_score >= 60 ? 'secondary' : 'destructive'}>
                      ATS: {review.ats_score}
                    </Badge>
                    <Badge variant="outline">
                      Overall: {review.overall_score}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground line-clamp-2 italic">
                    &quot;{jdPreview}&quot;
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t">
                  <Link href={`/review/${review.id}`} className="w-full">
                    <Button variant="ghost" className="w-full justify-between">
                      View Full Report
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}