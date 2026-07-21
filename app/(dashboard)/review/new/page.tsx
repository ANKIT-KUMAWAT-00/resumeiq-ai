'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Upload, Loader2, FileText, CheckCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'

export default function NewReviewPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [jobDescription, setJobDescription] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progressStep, setProgressStep] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.docx')) {
        setFile(selectedFile)
      } else {
        toast.error("Please upload a PDF or DOCX file.")
        e.target.value = ''
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return toast.error("Please select a resume file.")
    if (!jobDescription.trim()) return toast.error("Please enter a job description.")

    setIsProcessing(true)

    try {
      // Step 1: Upload and Extract Text
      setProgressStep('Extracting text from resume...')
      const formData = new FormData()
      formData.append('file', file)

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) {
        const err = await uploadRes.json()
        throw new Error(err.error || 'Failed to extract text')
      }

      const { text: resumeText, filename } = await uploadRes.json()

      // Step 2: Analyze with Gemini
      setProgressStep('AI is analyzing your fit. This usually takes 10-15 seconds...')
      const analyzeRes = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobDescription, filename })
      })

      if (!analyzeRes.ok) {
        const err = await analyzeRes.json()
        throw new Error(err.error || 'Failed to analyze resume')
      }

      const { reviewId } = await analyzeRes.json()
      
      toast.success("Analysis complete!")
      router.push(`/review/${reviewId}`)

    } catch (error: any) {
      toast.error(error.message || 'An error occurred during processing.')
      setIsProcessing(false)
      setProgressStep('')
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">New Resume Review</h2>
        <p className="text-muted-foreground">Upload your resume and the target job description to get AI-powered insights.</p>
      </div>

      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Application Details</CardTitle>
            <CardDescription>We accept PDF and DOCX formats up to 5MB.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* File Upload Area */}
            <div className="space-y-2">
              <Label htmlFor="resume">Resume File</Label>
              <div 
                className={`border-2 border-dashed rounded-lg p-8 text-center flex flex-col items-center justify-center transition-colors ${file ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:bg-muted/10'}`}
              >
                {file ? (
                  <>
                    <CheckCircle className="h-10 w-10 text-primary mb-2" />
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <Button variant="ghost" size="sm" className="mt-4" onClick={() => setFile(null)} type="button">
                      Remove File
                    </Button>
                  </>
                ) : (
                  <>
                    <Upload className="h-10 w-10 text-muted-foreground mb-4" />
                    <p className="font-medium mb-1">Click to upload or drag and drop</p>
                    <p className="text-sm text-muted-foreground mb-4">PDF or DOCX (max. 5MB)</p>
                    <Input 
                      id="resume" 
                      type="file" 
                      className="hidden" 
                      accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileChange}
                    />
                    <Button variant="secondary" onClick={() => document.getElementById('resume')?.click()} type="button">
                      Select File
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Job Description Area */}
            <div className="space-y-2">
              <Label htmlFor="jobDescription">Target Job Description</Label>
              <Textarea 
                id="jobDescription" 
                placeholder="Paste the full job description here..." 
                className="min-h-[200px]"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Copy and paste the exact text from the job board for the most accurate ATS scoring.
              </p>
            </div>

          </CardContent>
          <CardFooter className="bg-muted/20 py-4 flex flex-col items-stretch gap-4">
            <Button type="submit" size="lg" disabled={isProcessing || !file || !jobDescription.trim()} className="w-full">
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Report...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-5 w-5" />
                  Analyze Resume
                </>
              )}
            </Button>
            {isProcessing && (
              <p className="text-sm text-center text-muted-foreground animate-pulse">
                {progressStep}
              </p>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}