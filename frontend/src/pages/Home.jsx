import { Link } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  return (
    <div className="home-container">
      <nav className="navbar">
        <h1>Video Streaming App</h1>
        <div className="nav-links">
          <Link to="/" className="nav-button">
            Home
          </Link>
          <Link to="/upload" className="nav-button">
            Upload Video
          </Link>
          <Link to="/videos" className="nav-button">
            View Videos
          </Link>
        </div>
      </nav>
      <div className="home-content">
        <h2>Welcome to the Video Streaming App</h2>
        <p>Upload and watch videos easily with a seamless experience.</p>
      </div>
    </div>
  );
};

export default Home;
