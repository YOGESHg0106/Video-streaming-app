import express from "express";
import {
  uploadVideo,
  getVideos,
  streamVideo,
  updateVideo,
  deleteVideo,
  getVideoById,
} from "../controllers/videoController.js";
import multer from "multer";

const router = express.Router();

// ✅ Use Multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Routes
router.get("/videos", getVideos);
router.post("/upload", upload.single("file"), uploadVideo);
router.get("/stream/:filename", streamVideo);
router.get("/:id", getVideoById);
router.put("/update/:id", upload.single("file"), updateVideo);
router.put("/:id", upload.single("video"), updateVideo);
router.delete("/delete/:id", deleteVideo);

export default router;
