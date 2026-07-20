import { NextRequest, NextResponse } from 'next/server'
import pdfParse from 'pdf-parse'
import * as mammoth from 'mammoth'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate Request
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Extract File
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    let extractedText = ''

    // 3. Parse based on mime type
    if (file.type === 'application/pdf') {
      const pdfData = await pdfParse(buffer)
      extractedText = pdfData.text
    } else if (
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      file.name.endsWith('.docx')
    ) {
      const result = await mammoth.extractRawText({ buffer })
      extractedText = result.value
    } else {
      return NextResponse.json({ error: 'Unsupported file type. Please upload a PDF or DOCX.' }, { status: 400 })
    }

    // Clean up excessive whitespace
    extractedText = extractedText.replace(/\s+/g, ' ').trim()

    return NextResponse.json({ text: extractedText, filename: file.name })
  } catch (error: any) {
    console.error('File parsing error:', error)
    return NextResponse.json({ error: 'Failed to parse file' }, { status: 500 })
  }
}