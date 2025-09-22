import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getShipmentById,
  updateShipment,
  deleteShipment,
} from "../services/shipmentService";
import { useShipmentStore } from "../stores/shipmentStore";
import type { ShipmentStatus, Priority, Shipment } from "../types/shipment";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import { geocodeCity } from "../utils/geocode";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet icon fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function ShipmentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { upsert, remove } = useShipmentStore();

  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [originCoords, setOriginCoords] = useState<[number, number] | null>(
    null
  );
  const [destinationCoords, setDestinationCoords] = useState<
    [number, number] | null
  >(null);

  // Editable fields
  const [status, setStatus] = useState<ShipmentStatus>("PENDING");
  const [priority, setPriority] = useState<Priority>("LOW");

  useEffect(() => {
    async function fetchShipment() {
      try {
        setLoading(true);
        const data = await getShipmentById(Number(id));
        setShipment(data);
        setStatus(data.status);
        setPriority(data.priority ?? "LOW");
        const originResult = await geocodeCity(data.origin);
        const destResult = await geocodeCity(data.destination);
        setOriginCoords(originResult);
        setDestinationCoords(destResult);
        upsert(data);
      } catch {
        setError("Failed to load shipments. Navigating to shipments...");
        setTimeout(() => navigate("/shipments"), 1500);
      } finally {
        setLoading(false);
      }
    }
    fetchShipment();
  }, [id]);

  const handleUpdate = async () => {
    if (!id) return;
    try {
      const updated = await updateShipment(Number(id), { status, priority });
      upsert(updated);
      setShipment(updated);
      alert("Shipment updated!");
    } catch {
      alert("Failed to update shipment");
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this shipment?")) return;
    try {
      await deleteShipment(Number(id));
      remove(Number(id));
      navigate("/shipments");
    } catch {
      alert("Failed to delete shipment");
    }
  };

  if (loading) return <p className="p-6 text-gray-600">Loading shipment...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!shipment) return <p className="p-6">Shipment not found.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">
        Shipment #{shipment.id} Details
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600">Tracking Number</p>
          <p className="font-medium text-gray-800">{shipment.trackingNumber}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Carrier</p>
          <p className="font-medium text-gray-800">
            {shipment.carrier || "N/A"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Origin</p>
          <p className="font-medium text-gray-800">{shipment.origin}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Destination</p>
          <p className="font-medium text-gray-800">{shipment.destination}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ShipmentStatus)}
            className="w-full border border-gray-300 p-2 rounded"
          >
            <option value="PENDING">PENDING</option>
            <option value="IN_TRANSIT">IN_TRANSIT</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="w-full border border-gray-300 p-2 rounded"
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={handleUpdate}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Update
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Delete
        </button>
      </div>

      {originCoords && destinationCoords && (
        <div className="">
          <h2 className="text-lg font-semibold text-blue-700 mb-2">
            Shipment Route Map
          </h2>
          <MapContainer
            center={originCoords}
            zoom={4}
            scrollWheelZoom={true}
            className="h-[400px] w-full rounded shadow"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={originCoords}>
              <Popup>Origin: {shipment?.origin}</Popup>
            </Marker>
            <Marker position={destinationCoords}>
              <Popup>Destination: {shipment?.destination}</Popup>
            </Marker>
            <Polyline
              positions={[originCoords, destinationCoords]}
              color="blue"
            />
          </MapContainer>
        </div>
      )}
    </div>
  );
}
