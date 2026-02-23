import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getUser } from "@/lib/auth";
import DocumentModel from "@/models/Document";
import ClauseModel from "@/models/Clause";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const documents = await DocumentModel.find({ userId: user.userId })
      .sort({ createdAt: -1 })
      .select("-rawText")
      .lean();

    return NextResponse.json({ documents });
  } catch (error: unknown) {
    console.error("Get documents error:", error);
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const docId = searchParams.get("id");

    if (!docId) {
      return NextResponse.json({ error: "Document ID required" }, { status: 400 });
    }

    await connectDB();

    const doc = await DocumentModel.findOne({ _id: docId, userId: user.userId });
    if (!doc) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    await ClauseModel.deleteMany({ docId: doc._id });
    await DocumentModel.deleteOne({ _id: doc._id });

    return NextResponse.json({ message: "Document deleted" });
  } catch (error: unknown) {
    console.error("Delete document error:", error);
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
  }
}
