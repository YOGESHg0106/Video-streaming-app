import multer from "multer";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Video from "../models/VideoModel.js";

dotenv.config();

const mongoURI = process.env.MONGO_URI;
const conn = mongoose.createConnection(mongoURI, {});

let gfs, gridFSBucket;
conn.once("open", () => {
  gridFSBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "uploads",
  });
  gfs = conn.db.collection("uploads.files");
});

// ✅ Multer with memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

const uploadFile = async (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = gridFSBucket.openUploadStream(file.originalname, {
      contentType: file.mimetype,
    });

    uploadStream.end(file.buffer);

    uploadStream.on("finish", () => resolve(file.originalname));
    uploadStream.on("error", (err) => reject(err));
  });
};

// ✅ Upload Video
export const uploadVideo = async (req, res) => {
  try {
    if (!req.file || !req.body.title || !req.body.description) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const filename = await uploadFile(req.file);

    const newVideo = new Video({
      filename,
      contentType: req.file.mimetype,
      title: req.body.title,
      description: req.body.description,
    });

    await newVideo.save();
    res.status(201).json({ message: "Video uploaded successfully" });
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).json({ error: "Failed to upload video" });
  }
};

// ✅ Get All Videos
export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find();
    if (!videos.length) {
      return res.status(404).json({ message: "No videos found" });
    }
    res.json(videos);
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ error: "Failed to fetch videos" });
  }
};

// ✅ Stream Video
export const streamVideo = async (req, res) => {
  try {
    const fileArray = await gfs
      .find({ filename: req.params.filename })
      .toArray();
    if (fileArray.length === 0) {
      return res.status(404).json({ message: "Video not found" });
    }

    const file = fileArray[0];

    res.set("Content-Type", file.contentType);
    const readStream = gridFSBucket.openDownloadStreamByName(file.filename);
    readStream.pipe(res);
  } catch (error) {
    console.error("Error streaming video:", error);
    res.status(500).json({ error: "Failed to stream video" });
  }
};

// ✅ Update Video
export const updateVideo = async (req, res) => {
  try {
    console.log("Received update request for video ID:", req.params.id);
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);

    const { title, description } = req.body;
    const videoId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
      return res.status(400).json({ error: "Invalid video ID format" });
    }

    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    if (req.file) {
      console.log("Replacing video file...");

      // ✅ Find file in GridFS and delete it
      const fileArray = await gfs.find({ filename: video.filename }).toArray();
      if (fileArray.length > 0) {
        await gridFSBucket.delete(fileArray[0]._id);
      }

      // ✅ Upload new video file
      const uploadStream = gridFSBucket.openUploadStream(
        req.file.originalname,
        {
          contentType: req.file.mimetype,
        }
      );
      uploadStream.end(req.file.buffer);

      video.filename = req.file.originalname;
      video.contentType = req.file.mimetype;
    }

    if (title) video.title = title;
    if (description) video.description = description;

    await video.save();
    res.json({ message: "Video updated successfully" });
  } catch (error) {
    console.error("Error updating video:", error);
    res.status(500).json({ error: "Failed to update video" });
  }
};

// ✅ Delete Video
export const deleteVideo = async (req, res) => {
  try {
    const videoId = req.params.id;
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    // Remove from GridFS
    const fileArray = await gfs.find({ filename: video.filename }).toArray();
    if (fileArray.length > 0) {
      await gridFSBucket.delete(fileArray[0]._id);
    }

    // Remove from MongoDB
    await Video.findByIdAndDelete(videoId);

    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    console.error("Error deleting video:", error);
    res.status(500).json({ error: "Failed to delete video" });
  }
};

export const getVideoById = async (req, res) => {
  try {
    const videoId = req.params.id;
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ error: "Video not found" });
    }

    res.json(video);
  } catch (error) {
    console.error("Error fetching video:", error);
    res.status(500).json({ error: "Failed to fetch video" });
  }
};
