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
        trackingNumber: Math.random().toString(36).substring(7).toUpperCase(),
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
    <div className="p-6 max-w-3xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-blue-700">
        Add New Shipment
      </h1>
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Origin</label>
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Destination</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
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
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="w-full border p-2 rounded"
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">
            Carrier (optional)
          </label>
          <input
            type="text"
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            {loading ? "Creating..." : "Create Shipment"}
          </button>
        </div>
      </form>
    </div>
  );
}
