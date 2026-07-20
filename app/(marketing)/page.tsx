import Link from 'next/link'
import { ArrowRight, Bot, Target, FileSearch, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-24 md:py-32 lg:py-40 bg-muted/30">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Land More Interviews with <br className="hidden md:block" />
            <span className="text-primary">AI-Powered Resume Reviews</span>
          </h1>
          <p className="mx-auto mt-6 max-w-[700px] text-lg text-muted-foreground md:text-xl">
            Upload your resume and a job description. Our AI analyzes your fit, optimizes your keywords, and rewrites your bullet points to beat the ATS.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start for Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Everything you need to stand out</h2>
            <p className="mt-4 text-muted-foreground">Stop guessing what recruiters want. Let AI optimize your application.</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard 
              icon={<Target className="h-10 w-10 text-primary" />}
              title="ATS Scoring"
              description="Get an instant score based on how well your resume matches the specific job description."
            />
            <FeatureCard 
              icon={<Bot className="h-10 w-10 text-primary" />}
              title="AI Bullet Rewrites"
              description="Instantly rewrite weak bullet points into high-impact, results-driven achievements."
            />
            <FeatureCard 
              icon={<FileSearch className="h-10 w-10 text-primary" />}
              title="Keyword Optimization"
              description="Discover missing skills and keywords that the applicant tracking system is looking for."
            />
            <FeatureCard 
              icon={<Zap className="h-10 w-10 text-primary" />}
              title="Interview Readiness"
              description="Receive actionable feedback and potential interview questions based on your experience."
            />
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-card rounded-xl border shadow-sm">
      <div className="mb-4 rounded-full bg-primary/10 p-3">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}