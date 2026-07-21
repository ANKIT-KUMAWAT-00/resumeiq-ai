import { NextRequest, NextResponse } from "next/server";
import * as mammoth from "mammoth";
import PDFParser from "pdf2json";
import { createClient } from "@/lib/supabase/server";

function extractPdfText(buffer: Buffer): Promise<string> {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", (err: any) => {
      reject(err.parserError);
    });

    pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
      let text = "";

      for (const page of pdfData.Pages) {
        for (const txt of page.Texts) {
          for (const run of txt.R) {
            text += decodeURIComponent(run.T) + " ";
          }
        }
        text += "\n";
      }

      resolve(text);
    });

    pdfParser.parseBuffer(buffer);
  });
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    let extractedText = "";

    if (
      file.type === "application/pdf" ||
      file.name.toLowerCase().endsWith(".pdf")
    ) {
      extractedText = await extractPdfText(buffer);
    } else if (
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.name.toLowerCase().endsWith(".docx")
    ) {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else {
      return NextResponse.json(
        {
          error: "Only PDF and DOCX files are supported.",
        },
        { status: 400 }
      );
    }

    extractedText = extractedText.replace(/\s+/g, " ").trim();

    return NextResponse.json({
      filename: file.name,
      text: extractedText,
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        error: error.message || "Failed to parse file",
      },
      { status: 500 }
    );
  }
}