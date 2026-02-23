import mongoose, { Schema, Document as MongoDocument } from "mongoose";

export interface ISavedClause extends MongoDocument {
  userId: mongoose.Types.ObjectId;
  docId?: mongoose.Types.ObjectId;
  clauseType: string;
  originalText: string;
  riskLevel: string;
  isIllegal: boolean;
  illegalLaw: string;
  explanation: string;
  counterClause: string;
  actionAdvice: string;
  docName: string;
  docType: string;
  notes: string;
  tags: string[];
  createdAt: Date;
}

const SavedClauseSchema = new Schema<ISavedClause>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    docId: { type: Schema.Types.ObjectId, ref: "Document" },
    clauseType: { type: String, required: true },
    originalText: { type: String, required: true },
    riskLevel: { type: String, enum: ["HIGH", "MEDIUM", "LOW"], default: "MEDIUM" },
    isIllegal: { type: Boolean, default: false },
    illegalLaw: { type: String, default: "" },
    explanation: { type: String, default: "" },
    counterClause: { type: String, default: "" },
    actionAdvice: { type: String, default: "" },
    docName: { type: String, default: "" },
    docType: { type: String, default: "" },
    notes: { type: String, default: "" },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

SavedClauseSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.SavedClause || mongoose.model<ISavedClause>("SavedClause", SavedClauseSchema);
