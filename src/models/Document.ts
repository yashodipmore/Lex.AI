import mongoose, { Schema, Document as MongoDocument } from "mongoose";

export interface IDocument extends MongoDocument {
  userId: mongoose.Types.ObjectId;
  fileName: string;
  docType: string;
  overallRisk: string;
  riskScore: number;
  illegalCount: number;
  signVerdict: string;
  blockingClauses: number[];
  signVerdictReason: string;
  parties: string[];
  keyDates: string[];
  monthlyObligations: string[];
  summaryEn: string;
  summaryHi: string;
  rawText: string;
  clauseCount: number;
  highRiskCount: number;
  createdAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    fileName: { type: String, required: true },
    docType: {
      type: String,
      enum: ["rental", "employment", "nda", "loan", "tos", "freelance", "other"],
      default: "other",
    },
    overallRisk: { type: String, enum: ["HIGH", "MEDIUM", "LOW"], default: "MEDIUM" },
    riskScore: { type: Number, min: 0, max: 100, default: 50 },
    illegalCount: { type: Number, default: 0 },
    signVerdict: {
      type: String,
      enum: ["DO_NOT_SIGN", "CONDITIONAL", "SAFE_TO_SIGN"],
      default: "CONDITIONAL",
    },
    blockingClauses: [{ type: Number }],
    signVerdictReason: { type: String, default: "" },
    parties: [{ type: String }],
    keyDates: [{ type: String }],
    monthlyObligations: [{ type: String }],
    summaryEn: { type: String, default: "" },
    summaryHi: { type: String, default: "" },
    rawText: { type: String, required: true },
    clauseCount: { type: Number, default: 0 },
    highRiskCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Document || mongoose.model<IDocument>("Document", DocumentSchema);
