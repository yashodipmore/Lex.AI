import { NextRequest, NextResponse } from "next/server";
import groq from "@/lib/groq";
import { getUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Chat from "@/models/Chat";
import Activity from "@/models/Activity";

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, chatId, category } = await req.json();
    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    await connectDB();

    // Find or create chat
    let chat;
    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, userId: user.userId });
      if (!chat) {
        return NextResponse.json({ error: "Chat not found" }, { status: 404 });
      }
    } else {
      // Create new chat — auto-generate title from first message
      const title = message.length > 60 ? message.substring(0, 57) + "..." : message;
      chat = new Chat({
        userId: user.userId,
        title,
        messages: [],
        category: category || "general",
      });
    }

    // Add user message
    chat.messages.push({
      role: "user",
      content: message,
      timestamp: new Date(),
    });

    // Build conversation history for AI
    const systemPrompt = `You are LexAI, an expert Indian legal AI assistant. You help users understand Indian law, their legal rights, contracts, tenancy issues, employment disputes, consumer complaints, property matters, family law, business regulations, and more.

RULES:
- Always answer in the context of INDIAN LAW
- Cite specific Acts, Sections, and legal provisions when relevant
- Be conversational but authoritative
- If the user asks in Hindi/Hinglish, respond in the same language
- Give actionable advice — not just theory
- For complex matters, suggest consulting a qualified advocate
- Keep responses focused and practical (200-400 words unless the user needs detail)
- Use examples and real scenarios to explain concepts
- If asked about a specific clause or contract term, explain its legal implications under Indian law

KEY INDIAN LAWS YOU KNOW:
- Indian Contract Act, 1872
- Transfer of Property Act, 1882
- Consumer Protection Act, 2019
- Indian Penal Code / Bharatiya Nyaya Sanhita
- Code of Civil Procedure, 1908
- Rent Control Acts (state-specific)
- Industrial Disputes Act, 1947
- Negotiable Instruments Act, 1881
- Information Technology Act, 2000
- RERA (Real Estate Regulation Act), 2016
- Motor Vehicles Act, 1988
- Hindu Marriage Act / Special Marriage Act
- Domestic Violence Act, 2005
- Labour codes (2020)
- Companies Act, 2013
- GST Act, FEMA, and others

You are NOT a replacement for a lawyer, but you provide excellent preliminary legal guidance.`;

    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...chat.messages.slice(-20).map((m: { role: string; content: string }) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    // Stream response from Groq
    const completion = await groq.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.5,
      max_tokens: 2000,
      stream: false,
    });

    const aiResponse = completion.choices[0]?.message?.content;
    if (!aiResponse) {
      return NextResponse.json({ error: "AI returned empty response" }, { status: 502 });
    }

    // Add AI message
    chat.messages.push({
      role: "assistant",
      content: aiResponse,
      timestamp: new Date(),
    });
    chat.lastMessageAt = new Date();
    await chat.save();

    // Log activity
    await Activity.create({
      userId: user.userId,
      type: "chat_message",
      description: `Asked: ${message.substring(0, 100)}`,
      metadata: { chatId: chat._id, category: chat.category },
      date: new Date(),
    });

    return NextResponse.json({
      chatId: chat._id,
      message: aiResponse,
      title: chat.title,
    });
  } catch (error: unknown) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 });
  }
}

// GET — list all chats
export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const chats = await Chat.find({ userId: user.userId })
      .select("title category lastMessageAt messages")
      .sort({ lastMessageAt: -1 })
      .limit(50)
      .lean();

    const chatList = chats.map((c) => ({
      _id: c._id,
      title: c.title,
      category: c.category,
      lastMessageAt: c.lastMessageAt,
      messageCount: c.messages?.length || 0,
      lastMessage: c.messages?.[c.messages.length - 1]?.content?.substring(0, 80) || "",
    }));

    return NextResponse.json({ chats: chatList });
  } catch (error: unknown) {
    console.error("Chat list error:", error);
    return NextResponse.json({ error: "Failed to load chats" }, { status: 500 });
  }
}
