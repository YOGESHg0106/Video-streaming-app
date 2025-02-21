import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/UploadVideo.css";

const UploadVideo = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setMessage("");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title || !description) {
      return setMessage("❌ Please fill in all fields!");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);

    setIsUploading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/videos/upload",
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },
        }
      );

      if (response.status === 201) {
        setMessage("✅ Video uploaded successfully!");
        setFile(null);
        setTitle("");
        setDescription("");
        setProgress(0);
      }
    } catch (error) {
      setMessage("❌ Upload failed. Please try again.");
    }

    setIsUploading(false);
  };

  return (
    <div className="upload-container">
      <h2>Upload Video</h2>

      <input
        type="text"
        placeholder="Enter Video Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Enter Video Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label className="custom-file-upload">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          hidden
        />
        📂 {file ? file.name : "Choose a Video File"}
      </label>

      <button onClick={handleUpload} disabled={!file || isUploading}>
        {isUploading ? "Uploading..." : "Upload"}
      </button>

      {progress > 0 && (
        <div className="progress-bar">
          <div style={{ width: `${progress}%` }}></div>
        </div>
      )}

      {message && <p className="message">{message}</p>}

      <button className="back-button" onClick={() => navigate("/videos")}>
        ⬅️ View Videos
      </button>
      <button className="back-button" onClick={() => navigate("/")}>
        ⬅️ Back to Home
      </button>
    </div>
  );
};

export default UploadVideo;
