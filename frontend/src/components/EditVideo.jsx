import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditVideo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/videos/${id}`
        );
        setTitle(response.data.title);
        setDescription(response.data.description);
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };

    fetchVideo();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (file) formData.append("file", file); // ✅ Fixed

    console.log("Sending update request with ID:", id);
    console.log("Form Data:", Object.fromEntries(formData.entries()));

    try {
      const response = await axios.put(
        `http://localhost:5000/api/videos/${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Update response:", response.data);
      navigate("/videos");
    } catch (error) {
      console.error("Error updating video:", error);
    }
  };

  return (
    <div>
      <h2>Edit Video</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>Replace Video (optional):</label>
        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button type="submit">Update Video</button>
        <button className="back-button" onClick={() => navigate("/videos")}>
          ⬅️ View Videos
        </button>
      </form>
    </div>
  );
};

export default EditVideo;
