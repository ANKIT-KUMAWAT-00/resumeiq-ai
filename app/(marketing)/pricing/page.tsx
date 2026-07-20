import Link from 'next/link'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function PricingPage() {
  return (
    <div className="w-full py-20 md:py-32">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Simple, transparent pricing</h1>
          <p className="mt-4 text-xl text-muted-foreground">Choose the plan that fits your job search needs.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <CardDescription>Perfect for casual job seekers.</CardDescription>
              <div className="mt-4 text-4xl font-bold">$0<span className="text-xl font-normal text-muted-foreground">/mo</span></div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                <PricingFeature text="3 Resume Reviews per day" />
                <PricingFeature text="Basic ATS Score Report" />
                <PricingFeature text="Review History" />
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/signup" className="w-full">
                <Button variant="outline" className="w-full">Get Started</Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Pro Plan */}
          <Card className="flex flex-col border-primary shadow-lg relative">
            <div className="absolute top-0 right-0 -mt-3 mr-4 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
              Most Popular
            </div>
            <CardHeader>
              <CardTitle className="text-2xl">Pro</CardTitle>
              <CardDescription>For serious candidates who want to win.</CardDescription>
              <div className="mt-4 text-4xl font-bold">$15<span className="text-xl font-normal text-muted-foreground">/mo</span></div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-3">
                <PricingFeature text="Unlimited Resume Reviews" />
                <PricingFeature text="Advanced ATS Breakdown" />
                <PricingFeature text="AI Resume Rewriting" />
                <PricingFeature text="Keyword Optimization" />
                <PricingFeature text="Export to PDF" />
                <PricingFeature text="Priority AI Processing" />
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/signup" className="w-full">
                <Button className="w-full">Upgrade to Pro</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

function PricingFeature({ text }: { text: string }) {
  return (
    <li className="flex items-center">
      <Check className="mr-2 h-4 w-4 text-primary" />
      <span>{text}</span>
    </li>
  )
}