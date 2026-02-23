import { NextRequest, NextResponse } from "next/server";
import groq from "@/lib/groq";
import { getUser } from "@/lib/auth";
import { getCounterClausePrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { clauseText, clauseType, docType } = await req.json();

    if (!clauseText) {
      return NextResponse.json({ error: "Clause text is required" }, { status: 400 });
    }

    const prompt = getCounterClausePrompt(clauseText, clauseType || "other", docType || "other");

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 600,
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      return NextResponse.json({ error: "AI returned empty response" }, { status: 502 });
    }

    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      return NextResponse.json({ error: "AI returned invalid JSON" }, { status: 502 });
    }
    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Counter clause error:", error);
    return NextResponse.json({ error: "Failed to generate counter clause" }, { status: 500 });
  }
}
