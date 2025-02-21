import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/VideoView.css";

const VideoView = () => {
  const { filename } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);

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
    await axios.put(`http://localhost:5000/api/videos/update/${filename}`, {
      title,
      description,
    });
    alert("Video details updated successfully!");
  };

  const handleDelete = async () => {
    await axios.delete(`http://localhost:5000/api/videos/delete/${filename}`);
    alert("Video deleted successfully!");
    navigate("/videos");
  };

  if (loading) return <p>Loading...</p>;
  if (!video) return <p>Video not found.</p>;

  return (
    <div className="video-view-container">
      <video controls>
        <source
          src={`http://localhost:5000/api/videos/stream/${filename}`}
          type="video/mp4"
        />
      </video>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={handleUpdate}>Update</button>
      <button onClick={handleDelete} className="delete-btn">
        Delete
      </button>
      <button onClick={() => navigate("/videos")}>Back</button>
    </div>
  );
};

export default VideoView;
