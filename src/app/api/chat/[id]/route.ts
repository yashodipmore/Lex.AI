import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Chat from "@/models/Chat";

// GET single chat with full messages
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const chat = await Chat.findOne({ _id: id, userId: user.userId }).lean();
    if (!chat) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json({ chat });
  } catch (error: unknown) {
    console.error("Chat detail error:", error);
    return NextResponse.json({ error: "Failed to load chat" }, { status: 500 });
  }
}

// DELETE chat
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();
    const result = await Chat.deleteOne({ _id: id, userId: user.userId });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Chat deleted" });
  } catch (error: unknown) {
    console.error("Chat delete error:", error);
    return NextResponse.json({ error: "Failed to delete chat" }, { status: 500 });
  }
}
