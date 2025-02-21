import UploadVideo from "../components/UploadVideo";
import "../styles/Upload.css";

const Upload = () => {
  return (
    <div className="upload-container">
      <h1>Upload a Video</h1>
      <UploadVideo />
    </div>
  );
};

export default Upload;
