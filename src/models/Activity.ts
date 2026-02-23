import mongoose, { Schema, Document as MongoDocument } from "mongoose";

export interface IActivity extends MongoDocument {
  userId: mongoose.Types.ObjectId;
  type: string;
  description: string;
  metadata: Record<string, unknown>;
  date: Date;
  createdAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      enum: [
        "document_analyzed",
        "chat_message",
        "clause_saved",
        "dispute_generated",
        "comparison_done",
        "negotiation_done",
        "counter_clause",
        "login",
      ],
      required: true,
    },
    description: { type: String, default: "" },
    metadata: { type: Schema.Types.Mixed, default: {} },
    date: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

ActivitySchema.index({ userId: 1, date: -1 });
ActivitySchema.index({ userId: 1, type: 1, date: -1 });

export default mongoose.models.Activity || mongoose.model<IActivity>("Activity", ActivitySchema);
