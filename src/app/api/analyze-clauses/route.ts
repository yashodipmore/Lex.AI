import { NextRequest, NextResponse } from "next/server";
import groq from "@/lib/groq";
import { connectDB } from "@/lib/mongodb";
import { getUser } from "@/lib/auth";
import DocumentModel from "@/models/Document";
import ClauseModel from "@/models/Clause";
import Activity from "@/models/Activity";
import { getMasterAnalysisPrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { rawText, docType = "other", language = "en", fileName = "Untitled Document" } = await req.json();

    if (!rawText || rawText.trim().length < 50) {
      return NextResponse.json(
        { error: "Document text is too short to analyze" },
        { status: 400 }
      );
    }

    const prompt = getMasterAnalysisPrompt(rawText, docType, language);

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.15,
      max_tokens: 6000,
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0]?.message?.content;

    if (!responseText) {
      return NextResponse.json({ error: "AI returned empty response" }, { status: 502 });
    }

    let analysis;
    try {
      analysis = JSON.parse(responseText);
    } catch {
      console.error("Failed to parse AI response:", responseText);
      return NextResponse.json({ error: "AI returned invalid JSON" }, { status: 502 });
    }

    // Save to MongoDB
    await connectDB();

    const doc = await DocumentModel.create({
      userId: user.userId,
      fileName,
      docType: analysis.document?.doc_type || docType,
      overallRisk: analysis.document?.overall_risk || "MEDIUM",
      riskScore: analysis.document?.risk_score || 50,
      illegalCount: analysis.document?.illegal_count || 0,
      signVerdict: analysis.document?.sign_verdict || "CONDITIONAL",
      blockingClauses: analysis.document?.blocking_clauses || [],
      signVerdictReason: analysis.document?.sign_verdict_reason || "",
      parties: analysis.document?.parties || [],
      keyDates: analysis.document?.key_dates || [],
      monthlyObligations: analysis.document?.monthly_obligations || [],
      summaryEn: analysis.document?.summary_en || "",
      summaryHi: analysis.document?.summary_hi || "",
      rawText,
      clauseCount: analysis.document?.clause_count || 0,
      highRiskCount: analysis.document?.high_risk_count || 0,
    });

    // Save clauses
    if (analysis.clauses && Array.isArray(analysis.clauses)) {
      const clauseDocs = analysis.clauses.map((c: Record<string, unknown>) => ({
        docId: doc._id,
        clauseNumber: c.clause_number || 0,
        clauseType: c.clause_type || "other",
        originalText: c.original_text || "",
        riskLevel: c.risk_level || "LOW",
        isIllegal: c.is_illegal || false,
        illegalLaw: c.illegal_law || "",
        riskReason: c.risk_reason || "",
        explanationEn: c.explanation_en || "",
        explanationHi: c.explanation_hi || "",
        counterClause: c.counter_clause || "",
        actionAdvice: c.action_advice || "",
        benchmarkLabel: c.benchmark_label || "",
        benchmarkNote: c.benchmark_note || "",
        isBlocking: c.is_blocking || false,
        timelineMonth: c.timeline_month || 0,
        timelineEvent: c.timeline_event || "",
        startChar: c.start_char || 0,
        endChar: c.end_char || 0,
      }));

      await ClauseModel.insertMany(clauseDocs);
    }

    // Log activity
    await Activity.create({
      userId: user.userId,
      type: "document_analyzed",
      description: `Analyzed "${fileName}" — ${analysis.document?.clause_count || 0} clauses, risk ${analysis.document?.overall_risk || "MEDIUM"}`,
      metadata: { docId: doc._id, fileName, riskScore: analysis.document?.risk_score },
    });

    return NextResponse.json({
      documentId: doc._id,
      analysis,
    });
  } catch (error: unknown) {
    console.error("Analyze clauses error:", error);
    return NextResponse.json({ error: "Failed to analyze document" }, { status: 500 });
  }
}
