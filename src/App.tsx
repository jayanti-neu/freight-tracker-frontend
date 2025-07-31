import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ShipmentsPage from "./pages/ShipmentsPage";

export default function App() {
  return (
    <Router>
      <nav className="p-4 bg-gray-800 text-white flex gap-4">
        <Link to="/">Home</Link>
        <Link to="/shipments">Shipments</Link>
      </nav>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shipments" element={<ShipmentsPage />} />
      </Routes>
    </Router>
  );
}
