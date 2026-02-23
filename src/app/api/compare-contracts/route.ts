import { NextRequest, NextResponse } from "next/server";
import groq from "@/lib/groq";
import { getUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Activity from "@/models/Activity";
import { getCompareContractsPrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { oldText, newText, userRole = "tenant" } = await req.json();

    if (!oldText || !newText) {
      return NextResponse.json({ error: "Both old and new contract texts are required" }, { status: 400 });
    }

    const prompt = getCompareContractsPrompt(oldText, newText, userRole);

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      max_tokens: 4000,
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

    // Log activity
    await connectDB();
    await Activity.create({
      userId: user.userId,
      type: "comparison_done",
      description: "Compared two contract versions",
    });

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Compare contracts error:", error);
    return NextResponse.json({ error: "Failed to compare contracts" }, { status: 500 });
  }
}
