import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ShipmentsPage from "./pages/ShipmentsPage";
import AddShipmentPage from "./pages/AddShipmentPage";
import ShipmentDetailPage from "./pages/ShipmentDetailPage";
import StatsDashboardPage from "./pages/StatsDashboardPage";
import MapDashboardPage from "./pages/MapDashboardPage";
import Layout from "./components/Layout";
import { useEffect } from "react";
import {
  connectWebSocket,
  disconnectWebSocket,
} from "./services/socketService";

export default function App() {
  useEffect(() => {
    connectWebSocket();
    return () => disconnectWebSocket();
  }, []);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shipments" element={<ShipmentsPage />} />
          <Route path="/shipments/add" element={<AddShipmentPage />} />
          <Route path="/shipments/:id" element={<ShipmentDetailPage />} />
          <Route path="/shipments/stats" element={<StatsDashboardPage />} />
          <Route path="/shipments/map" element={<MapDashboardPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}
