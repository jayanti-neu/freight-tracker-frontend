import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ShipmentsPage from "./pages/ShipmentsPage";
import AddShipmentPage from "./pages/AddShipmentPage";
import ShipmentDetailPage from "./pages/ShipmentDetailPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/shipments" element={<ShipmentsPage />} />
        <Route path="/shipments/add" element={<AddShipmentPage />} />
        <Route path="/shipments/:id" element={<ShipmentDetailPage />} />
      </Routes>
    </Router>
  );
}
