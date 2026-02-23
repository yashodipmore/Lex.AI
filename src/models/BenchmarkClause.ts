import mongoose, { Schema, Document as MongoDocument } from "mongoose";

export interface IBenchmarkClause extends MongoDocument {
  clauseType: string;
  docType: string;
  industry: string;
  value: string;
  marketPercentile: number;
  standardValue: string;
  isFavorableToUser: boolean;
  note: string;
}

const BenchmarkClauseSchema = new Schema<IBenchmarkClause>({
  clauseType: { type: String, required: true, index: true },
  docType: { type: String, required: true, index: true },
  industry: { type: String, default: "general" },
  value: { type: String, required: true },
  marketPercentile: { type: Number, required: true },
  standardValue: { type: String, required: true },
  isFavorableToUser: { type: Boolean, default: false },
  note: { type: String, default: "" },
});

BenchmarkClauseSchema.index({ clauseType: 1, docType: 1 });

export default mongoose.models.BenchmarkClause ||
  mongoose.model<IBenchmarkClause>("BenchmarkClause", BenchmarkClauseSchema);
