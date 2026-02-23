import { NextRequest, NextResponse } from "next/server";
import { geminiModel } from "@/lib/gemini";
import { getUser } from "@/lib/auth";
import { PDFParse } from "pdf-parse";

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const rawTextInput = formData.get("rawText") as string | null;

    if (!file && !rawTextInput) {
      return NextResponse.json({ error: "Please upload a file or paste text" }, { status: 400 });
    }

    // If raw text is provided directly, return it
    if (rawTextInput && rawTextInput.trim().length > 0) {
      return NextResponse.json({ rawText: rawTextInput.trim() });
    }

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/webp",
      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Unsupported file type. Upload PDF, image, or text file." },
        { status: 400 }
      );
    }

    // Text file — read directly
    if (file.type === "text/plain") {
      const text = await file.text();
      return NextResponse.json({ rawText: text });
    }

    const bytes = await file.arrayBuffer();

    // PDF — use pdf-parse for reliable local extraction
    if (file.type === "application/pdf") {
      try {
        const pdfBuffer = Buffer.from(bytes);
        const parser = new PDFParse({ data: new Uint8Array(pdfBuffer) });
        const pdfData = await parser.getText();
        const rawText = pdfData.text;

        if (!rawText || rawText.trim().length === 0) {
          // Fallback: scanned PDF without text layer — try Gemini OCR
          const base64 = pdfBuffer.toString("base64");
          const result = await geminiModel.generateContent([
            {
              inlineData: {
                mimeType: "application/pdf" as const,
                data: base64,
              },
            },
            {
              text: `Extract ALL text from this scanned PDF document. Preserve the structure, headings, numbered clauses, and formatting. Extract every single clause verbatim. Return ONLY the extracted text.`,
            },
          ]);
          const ocrText = result.response.text();
          if (!ocrText || ocrText.trim().length === 0) {
            return NextResponse.json(
              { error: "Could not extract text from this PDF. It may be empty or corrupted." },
              { status: 422 }
            );
          }
          return NextResponse.json({ rawText: ocrText.trim() });
        }

        return NextResponse.json({ rawText: rawText.trim() });
      } catch (pdfError) {
        console.error("PDF parse error:", pdfError);
        return NextResponse.json(
          { error: "Failed to parse PDF. The file may be corrupted or password-protected." },
          { status: 422 }
        );
      }
    }

    // Image — use Gemini Vision OCR
    const base64 = Buffer.from(bytes).toString("base64");
    const mimeType = file.type as "image/png" | "image/jpeg" | "image/webp";

    const result = await geminiModel.generateContent([
      {
        inlineData: {
          mimeType,
          data: base64,
        },
      },
      {
        text: `Extract ALL text from this image. Preserve the structure, headings, numbered clauses, and formatting as closely as possible. 
        
If it's a legal document (contract, agreement, lease, offer letter, NDA), extract every single clause, term, and condition. 
Do not summarize — extract the COMPLETE text verbatim.
If there are tables, preserve the table structure.
If text is in Hindi or regional language, extract in the original language.

Return ONLY the extracted text, nothing else.`,
      },
    ]);

    const rawText = result.response.text();

    if (!rawText || rawText.trim().length === 0) {
      return NextResponse.json(
        { error: "Could not extract text from this image. Try a clearer image." },
        { status: 422 }
      );
    }

    return NextResponse.json({ rawText: rawText.trim() });
  } catch (error: unknown) {
    console.error("Parse document error:", error);
    return NextResponse.json({ error: "Failed to parse document" }, { status: 500 });
  }
}
