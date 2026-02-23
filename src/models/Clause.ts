import mongoose, { Schema, Document as MongoDocument } from "mongoose";

export interface IClause extends MongoDocument {
  docId: mongoose.Types.ObjectId;
  clauseNumber: number;
  clauseType: string;
  originalText: string;
  riskLevel: string;
  isIllegal: boolean;
  illegalLaw: string;
  riskReason: string;
  explanationEn: string;
  explanationHi: string;
  counterClause: string;
  actionAdvice: string;
  benchmarkLabel: string;
  benchmarkNote: string;
  isBlocking: boolean;
  timelineMonth: number;
  timelineEvent: string;
  startChar: number;
  endChar: number;
}

const ClauseSchema = new Schema<IClause>(
  {
    docId: { type: Schema.Types.ObjectId, ref: "Document", required: true, index: true },
    clauseNumber: { type: Number, required: true },
    clauseType: {
      type: String,
      enum: [
        "indemnity", "non-compete", "termination", "payment",
        "data-rights", "liability", "ip", "arbitration",
        "notice-period", "renewal", "confidentiality", "other",
      ],
      default: "other",
    },
    originalText: { type: String, required: true },
    riskLevel: { type: String, enum: ["HIGH", "MEDIUM", "LOW"], required: true },
    isIllegal: { type: Boolean, default: false },
    illegalLaw: { type: String, default: "" },
    riskReason: { type: String, default: "" },
    explanationEn: { type: String, default: "" },
    explanationHi: { type: String, default: "" },
    counterClause: { type: String, default: "" },
    actionAdvice: { type: String, default: "" },
    benchmarkLabel: {
      type: String,
      enum: ["standard", "above_market", "below_market", "unusual", ""],
      default: "",
    },
    benchmarkNote: { type: String, default: "" },
    isBlocking: { type: Boolean, default: false },
    timelineMonth: { type: Number, default: 0 },
    timelineEvent: { type: String, default: "" },
    startChar: { type: Number, default: 0 },
    endChar: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Clause || mongoose.model<IClause>("Clause", ClauseSchema);
