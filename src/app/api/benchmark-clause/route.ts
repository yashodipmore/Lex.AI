import { NextRequest, NextResponse } from "next/server";
import groq from "@/lib/groq";
import { connectDB } from "@/lib/mongodb";
import { getUser } from "@/lib/auth";
import BenchmarkClause from "@/models/BenchmarkClause";
import { getBenchmarkPrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { clauseType, docType, value } = await req.json();

    if (!clauseType || !value) {
      return NextResponse.json({ error: "Clause type and value are required" }, { status: 400 });
    }

    await connectDB();

    // Check MongoDB benchmarks first
    const benchmarks = await BenchmarkClause.find({
      clauseType: { $regex: new RegExp(clauseType, "i") },
      docType: { $regex: new RegExp(docType || "", "i") },
    }).lean();

    let dbContext = "";
    if (benchmarks.length > 0) {
      dbContext = `\n\nREAL MARKET DATA FROM DATABASE:\n${benchmarks
        .map(
          (b) =>
            `- ${b.value}: ${b.marketPercentile}% of market (${b.isFavorableToUser ? "favorable" : "unfavorable"} to user). ${b.note}`
        )
        .join("\n")}`;
    }

    const prompt = getBenchmarkPrompt(clauseType, value, docType || "other") + dbContext;

    const completion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.2,
      max_tokens: 500,
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
    return NextResponse.json({ ...result, dbBenchmarks: benchmarks });
  } catch (error: unknown) {
    console.error("Benchmark clause error:", error);
    return NextResponse.json({ error: "Failed to benchmark clause" }, { status: 500 });
  }
}
