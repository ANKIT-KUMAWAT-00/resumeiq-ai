import { redirect } from 'next/navigation'
import { Check, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { UpgradeButton, ManageSubscriptionButton } from './billing-buttons'


export default async function BillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const isPro = profile?.plan === 'pro'
  const currentPeriodEnd = subscription?.current_period_end 
    ? new Date(subscription.current_period_end).toLocaleDateString()
    : null

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Billing & Plan</h2>
        <p className="text-muted-foreground">
          Manage your subscription and billing details.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardTitle>Current Plan</CardTitle>
              <Badge variant={isPro ? "default" : "secondary"}>
                {isPro ? "Pro" : "Free"} Plan
              </Badge>
            </div>
            <CardDescription>
              {isPro 
                ? "You have full access to all AI features." 
                : "You are currently on the free tier with limited daily reviews."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            {isPro && currentPeriodEnd && (
              <div className="text-sm bg-muted/30 p-4 rounded-lg border">
                <p>
                  <span className="font-semibold">Next billing date:</span> {currentPeriodEnd}
                </p>
                {subscription?.cancel_at_period_end && (
                  <p className="text-destructive mt-1">
                    Your subscription will cancel at the end of the billing period.
                  </p>
                )}
              </div>
            )}
            
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Plan Limits</h4>
              <ul className="text-sm space-y-2">
                
              </ul>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-6">
            {isPro ? <ManageSubscriptionButton /> : <UpgradeButton />}
          </CardFooter>
        </Card>

        {/* Informational Card */}
        <Card className="bg-muted/10">
          <CardHeader>
            <CardTitle className="text-lg">Need help?</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-4">
            <p>
              If you have any issues with your billing, please contact our support team. We use razorpay for secure payment processing.
            </p>
            <p>
              Upgrading to Pro gives you immediate access to all advanced AI features and bypasses the daily rate limit.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function FeatureItem({ text, active }: { text: string, active: boolean }) {
  return (
    <li className="flex items-center gap-2">
      {active ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <X className="h-4 w-4 text-muted-foreground/50" />
      )}
      <span className={active ? "text-foreground" : "text-muted-foreground"}>
        {text}
      </span>
    </li>
  )
}