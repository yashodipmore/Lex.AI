import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getUser } from "@/lib/auth";
import DocumentModel from "@/models/Document";
import ClauseModel from "@/models/Clause";

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

    const document = await DocumentModel.findOne({
      _id: id,
      userId: user.userId,
    }).lean();

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const clauses = await ClauseModel.find({ docId: id })
      .sort({ clauseNumber: 1 })
      .lean();

    return NextResponse.json({ document, clauses });
  } catch (error: unknown) {
    console.error("Get document error:", error);
    return NextResponse.json({ error: "Failed to fetch document" }, { status: 500 });
  }
}
