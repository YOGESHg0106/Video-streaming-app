import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import VideoList from "./components/VideoList";
import VideoView from "./components/VideoView";
import EditVideo from "./components/EditVideo"; // ✅ Import the Edit component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/videos" element={<VideoList />} />
        <Route path="/videos/:filename" element={<VideoView />} />
        <Route path="/edit/:id" element={<EditVideo />} /> {/* ✅ Add this */}
      </Routes>
    </Router>
  );
};

export default App;
