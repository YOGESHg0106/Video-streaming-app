import mongoose from "mongoose";

const VideoSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  contentType: String,
  uploadDate: { type: Date, default: Date.now },
  title: { type: String, required: true }, // Added title
  description: { type: String, required: true }, // Added description
});

export default mongoose.model("Video", VideoSchema);
