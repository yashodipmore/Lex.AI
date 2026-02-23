import { NextRequest } from "next/server";
import groq from "@/lib/groq";
import { getUser } from "@/lib/auth";
import { getNegotiationPrompt, getNegotiationDebriefPrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { messages, clauseText, persona = "landlord", exchangeCount = 1, requestDebrief = false } = await req.json();

    if (!clauseText) {
      return new Response(JSON.stringify({ error: "Clause text is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Build conversation history string
    const conversationHistory = (messages || [])
      .map((m: { role: string; content: string }) => `${m.role === "user" ? "USER" : persona.toUpperCase()}: ${m.content}`)
      .join("\n");

    // If requesting debrief after 3 exchanges
    if (requestDebrief) {
      const debriefPrompt = getNegotiationDebriefPrompt(conversationHistory, clauseText);
      const completion = await groq.chat.completions.create({
        messages: [{ role: "user", content: debriefPrompt }],
        model: "llama-3.3-70b-versatile",
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: "json_object" },
      });

      const responseText = completion.choices[0]?.message?.content || "{}";
      return new Response(JSON.stringify({ debrief: JSON.parse(responseText) }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    const userMessage = messages?.[messages.length - 1]?.content || "";
    const prompt = getNegotiationPrompt(clauseText, persona, exchangeCount, userMessage, conversationHistory);

    // SSE Streaming
    const stream = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.75,
      max_tokens: 300,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
            }
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          console.error("Stream error:", err);
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error: unknown) {
    console.error("Negotiation chat error:", error);
    return new Response(JSON.stringify({ error: "Failed to process negotiation" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
