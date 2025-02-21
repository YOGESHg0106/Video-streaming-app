import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import VideoPlayer from "./VideoPlayer"; // ✅ Reusing VideoPlayer
import "../styles/VideoView.css";

const VideoView = () => {
  const { filename } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/videos/videos`)
      .then((res) => {
        const foundVideo = res.data.find((v) => v.filename === filename);
        if (foundVideo) {
          setVideo(foundVideo);
          setTitle(foundVideo.title);
          setDescription(foundVideo.description);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filename]);

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    try {
      await axios.put(
        `http://localhost:5000/api/videos/update/${filename}`,
        formData
      );
      alert("Video details updated successfully!");
      navigate("/videos");
    } catch (error) {
      alert("Failed to update video.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this video?")) {
      try {
        await axios.delete(
          `http://localhost:5000/api/videos/delete/${filename}`
        );
        alert("Video deleted successfully!");
        navigate("/videos");
      } catch (error) {
        alert("Failed to delete video.");
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!video) return <p>Video not found.</p>;

  return (
    <div className="video-view-container">
      <h2>Edit Video</h2>
      <VideoPlayer filename={filename} />

      <label>Title:</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label>Description:</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <label>Replace Video:</label>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setSelectedFile(e.target.files[0])}
      />

      <button onClick={handleUpdate}>Update</button>
      <button onClick={handleDelete} className="delete-btn">
        Delete
      </button>
      <button onClick={() => navigate("/videos")}>⬅️ Back</button>
    </div>
  );
};

export default VideoView;
