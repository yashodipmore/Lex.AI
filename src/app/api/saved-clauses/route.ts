import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import SavedClause from "@/models/SavedClause";
import Activity from "@/models/Activity";

// POST — save a clause
export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { clauseType, originalText, riskLevel, isIllegal, illegalLaw, explanation, counterClause, actionAdvice, docName, docType, docId, notes, tags } = body;

    if (!originalText || !clauseType) {
      return NextResponse.json({ error: "Clause text and type are required" }, { status: 400 });
    }

    await connectDB();

    const saved = await SavedClause.create({
      userId: user.userId,
      docId: docId || undefined,
      clauseType,
      originalText,
      riskLevel: riskLevel || "MEDIUM",
      isIllegal: isIllegal || false,
      illegalLaw: illegalLaw || "",
      explanation: explanation || "",
      counterClause: counterClause || "",
      actionAdvice: actionAdvice || "",
      docName: docName || "",
      docType: docType || "",
      notes: notes || "",
      tags: tags || [],
    });

    await Activity.create({
      userId: user.userId,
      type: "clause_saved",
      description: `Saved ${clauseType} clause from ${docName || "document"}`,
      metadata: { clauseId: saved._id, clauseType, riskLevel },
      date: new Date(),
    });

    return NextResponse.json({ message: "Clause saved", clause: saved });
  } catch (error: unknown) {
    console.error("Save clause error:", error);
    return NextResponse.json({ error: "Failed to save clause" }, { status: 500 });
  }
}

// GET — list saved clauses
export async function GET(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const searchParams = req.nextUrl.searchParams;
    const filter = searchParams.get("filter"); // clauseType filter
    const risk = searchParams.get("risk"); // riskLevel filter
    const search = searchParams.get("search"); // text search

    const query: Record<string, unknown> = { userId: user.userId };
    if (filter && filter !== "all") query.clauseType = filter;
    if (risk && risk !== "all") query.riskLevel = risk;
    if (search) {
      query.$or = [
        { originalText: { $regex: search, $options: "i" } },
        { explanation: { $regex: search, $options: "i" } },
        { notes: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    const clauses = await SavedClause.find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({ clauses });
  } catch (error: unknown) {
    console.error("List saved clauses error:", error);
    return NextResponse.json({ error: "Failed to load clauses" }, { status: 500 });
  }
}

// DELETE — delete a saved clause
export async function DELETE(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { clauseId } = await req.json();
    if (!clauseId) {
      return NextResponse.json({ error: "Clause ID required" }, { status: 400 });
    }

    await connectDB();
    const result = await SavedClause.deleteOne({ _id: clauseId, userId: user.userId });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Clause not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Clause deleted" });
  } catch (error: unknown) {
    console.error("Delete clause error:", error);
    return NextResponse.json({ error: "Failed to delete clause" }, { status: 500 });
  }
}
