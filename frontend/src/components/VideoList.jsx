import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/VideoList.css";

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/videos/videos")
      .then((res) => {
        setVideos(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("❌ Failed to load videos. Try again later.");
        console.error("Error fetching videos:", err);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/videos/delete/${videoId}`);
      setVideos(videos.filter((video) => video._id !== videoId));
    } catch (error) {
      console.error("Error deleting video:", error);
      alert("Failed to delete video");
    }
  };

  return (
    <div className="video-list-container">
      <h2>🎥 Available Videos</h2>

      {loading && <p className="loading">⏳ Loading videos...</p>}
      {error && <p className="error">{error}</p>}
      {videos.length === 0 && !loading && !error && (
        <p className="no-videos">⚠️ No videos available.</p>
      )}

      {/* ✅ Video List */}
      <div className="video-grid">
        {videos.map((video) => (
          <div key={video._id} className="video-card">
            <video
              controls
              className="video-player"
              src={`http://localhost:5000/api/videos/stream/${video.filename}`}
            />

            <div className="video-details">
              <h3 className="video-title">{video.title || "Untitled Video"}</h3>
              <p className="video-description">
                {video.description || "No description"}
              </p>

              <div className="video-actions">
                <button
                  className="edit-button"
                  onClick={() => navigate(`/edit/${video._id}`)}
                >
                  ✏️ Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(video._id)}
                >
                  ❌ Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Back Button */}
      <button className="back-button" onClick={() => navigate("/")}>
        ⬅️ Back to Home
      </button>
    </div>
  );
};

export default VideoList;
