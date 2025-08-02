import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createShipment } from "../services/shipmentService";
import { useShipmentStore } from "../stores/shipmentStore";
import type { ShipmentStatus, Priority } from "../types/shipment";

export default function AddShipmentPage() {
  const navigate = useNavigate();
  const upsert = useShipmentStore((state) => state.upsert);

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [status, setStatus] = useState<ShipmentStatus>("PENDING");
  const [priority, setPriority] = useState<Priority>("LOW");
  const [carrier, setCarrier] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const newShipment = await createShipment({
        origin,
        destination,
        status,
        trackingNumber: Math.random().toString(36).substring(7).toUpperCase(), // temporary
        priority,
        carrier,
      });
      upsert(newShipment);
      navigate("/shipments");
    } catch {
      setError("Failed to create shipment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Add Shipment</h1>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ShipmentStatus)}
          className="w-full border p-2 rounded"
        >
          <option value="PENDING">PENDING</option>
          <option value="IN_TRANSIT">IN_TRANSIT</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="w-full border p-2 rounded"
        >
          <option value="LOW">LOW</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="HIGH">HIGH</option>
        </select>

        <input
          type="text"
          placeholder="Carrier (optional)"
          value={carrier}
          onChange={(e) => setCarrier(e.target.value)}
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          {loading ? "Creating..." : "Create Shipment"}
        </button>
      </form>
    </div>
  );
}
