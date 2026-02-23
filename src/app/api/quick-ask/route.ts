import { NextRequest, NextResponse } from "next/server";
import groq from "@/lib/groq";
import { getUser } from "@/lib/auth";
import Activity from "@/models/Activity";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { question } = await req.json();
    if (!question || question.trim().length === 0) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    const systemPrompt = `You are LexAI Quick Answer — a fast Indian legal expert. Give concise, accurate answers to legal questions in 2-4 sentences. Cite specific Indian law sections when relevant. If the question is in Hindi, answer in Hindi. Be direct and actionable. End with one practical tip if applicable.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: question },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
      max_tokens: 500,
    });

    const answer = completion.choices[0]?.message?.content;
    if (!answer) {
      return NextResponse.json({ error: "AI returned empty response" }, { status: 502 });
    }

    // Log activity
    await connectDB();
    await Activity.create({
      userId: user.userId,
      type: "chat_message",
      description: `Quick Ask: ${question.substring(0, 80)}`,
      metadata: { quickAsk: true },
      date: new Date(),
    });

    return NextResponse.json({ answer });
  } catch (error: unknown) {
    console.error("Quick ask error:", error);
    return NextResponse.json({ error: "Failed to answer" }, { status: 500 });
  }
}
