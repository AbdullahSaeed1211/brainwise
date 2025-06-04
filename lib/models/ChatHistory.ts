import mongoose, { Schema, models } from "mongoose";

const ChatHistorySchema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  message: {
    type: String,
    required: true
  },
  response: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ChatHistory = models.ChatHistory || mongoose.model("ChatHistory", ChatHistorySchema);

export default ChatHistory; 