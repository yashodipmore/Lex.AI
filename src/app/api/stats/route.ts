import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Document from "@/models/Document";
import Clause from "@/models/Clause";
import Chat from "@/models/Chat";
import SavedClause from "@/models/SavedClause";
import Activity from "@/models/Activity";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const userId = user.userId;

    // Parallel queries for speed
    const [
      documents,
      totalClauses,
      highRiskClauses,
      illegalClauses,
      savedClauseCount,
      chatCount,
      recentActivities,
    ] = await Promise.all([
      Document.find({ userId }).select("docType overallRisk riskScore illegalCount signVerdict clauseCount highRiskCount createdAt fileName keyDates").lean(),
      Clause.countDocuments({ docId: { $in: await Document.find({ userId }).distinct("_id") } }),
      Clause.countDocuments({ docId: { $in: await Document.find({ userId }).distinct("_id") }, riskLevel: "HIGH" }),
      Clause.countDocuments({ docId: { $in: await Document.find({ userId }).distinct("_id") }, isIllegal: true }),
      SavedClause.countDocuments({ userId }),
      Chat.countDocuments({ userId }),
      Activity.find({ userId }).sort({ date: -1 }).limit(20).lean(),
    ]);

    // Aggregate stats
    const totalDocs = documents.length;
    const avgRiskScore = totalDocs > 0
      ? Math.round(documents.reduce((sum, d) => sum + (d.riskScore || 0), 0) / totalDocs)
      : 0;

    // Risk distribution
    const riskDistribution = {
      HIGH: documents.filter((d) => d.overallRisk === "HIGH").length,
      MEDIUM: documents.filter((d) => d.overallRisk === "MEDIUM").length,
      LOW: documents.filter((d) => d.overallRisk === "LOW").length,
    };

    // Verdict distribution
    const verdictDistribution = {
      DO_NOT_SIGN: documents.filter((d) => d.signVerdict === "DO_NOT_SIGN").length,
      CONDITIONAL: documents.filter((d) => d.signVerdict === "CONDITIONAL").length,
      SAFE_TO_SIGN: documents.filter((d) => d.signVerdict === "SAFE_TO_SIGN").length,
    };

    // Doc type distribution
    const docTypeMap: Record<string, number> = {};
    documents.forEach((d) => {
      const t = d.docType || "other";
      docTypeMap[t] = (docTypeMap[t] || 0) + 1;
    });

    // Activity over last 30 days (for chart)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const dailyActivity = await Activity.aggregate([
      { $match: { userId: user.userId, date: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Streak calculation
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streak = 0;
    let checkDate = new Date(today);

    for (let i = 0; i < 365; i++) {
      const dayStart = new Date(checkDate);
      const dayEnd = new Date(checkDate);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const hasActivity = await Activity.exists({
        userId,
        date: { $gte: dayStart, $lt: dayEnd },
      });

      if (hasActivity) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Upcoming deadlines from key dates
    const upcomingDeadlines: { date: string; description: string; docName: string }[] = [];
    const dateRegex = /(\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}|\d{4}[\/-]\d{1,2}[\/-]\d{1,2}|(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\w*\s+\d{1,2},?\s*\d{4})/i;

    for (const doc of documents) {
      if (doc.keyDates && doc.keyDates.length > 0) {
        for (const kd of doc.keyDates) {
          const match = kd.match(dateRegex);
          if (match) {
            try {
              const parsed = new Date(match[1]);
              if (!isNaN(parsed.getTime()) && parsed > new Date()) {
                upcomingDeadlines.push({
                  date: parsed.toISOString(),
                  description: kd,
                  docName: doc.fileName,
                });
              }
            } catch { /* skip unparseable */ }
          }
          // Even if no date parseable, include as reminder text
          if (!match) {
            upcomingDeadlines.push({
              date: "",
              description: kd,
              docName: doc.fileName,
            });
          }
        }
      }
    }

    // Risk score trend (last N documents)
    const riskTrend = documents
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .slice(-10)
      .map((d) => ({
        name: d.fileName.length > 15 ? d.fileName.substring(0, 12) + "..." : d.fileName,
        score: d.riskScore || 0,
        date: d.createdAt,
      }));

    return NextResponse.json({
      stats: {
        totalDocuments: totalDocs,
        totalClauses,
        highRiskClauses,
        illegalClauses,
        savedClauses: savedClauseCount,
        totalChats: chatCount,
        avgRiskScore,
        streak,
      },
      riskDistribution,
      verdictDistribution,
      docTypeDistribution: docTypeMap,
      dailyActivity,
      riskTrend,
      upcomingDeadlines: upcomingDeadlines.slice(0, 10),
      recentActivities: recentActivities.map((a) => ({
        type: a.type,
        description: a.description,
        date: a.date,
      })),
    });
  } catch (error: unknown) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
