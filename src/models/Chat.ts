import mongoose, { Schema, Document as MongoDocument } from "mongoose";

export interface IChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface IChat extends MongoDocument {
  userId: mongoose.Types.ObjectId;
  title: string;
  messages: IChatMessage[];
  category: string;
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ChatMessageSchema = new Schema<IChatMessage>(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ChatSchema = new Schema<IChat>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, default: "New Chat" },
    messages: [ChatMessageSchema],
    category: {
      type: String,
      enum: ["general", "tenant", "employment", "consumer", "criminal", "family", "property", "business", "other"],
      default: "general",
    },
    lastMessageAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ChatSchema.index({ userId: 1, lastMessageAt: -1 });

export default mongoose.models.Chat || mongoose.model<IChat>("Chat", ChatSchema);
