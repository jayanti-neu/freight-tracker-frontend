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
      } catch {
        setError("Failed to load shipment");
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

  if (loading) return <p className="p-6">Loading shipment...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (!shipment) return <p className="p-6">Shipment not found.</p>;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">
        Shipment #{shipment.id}
      </h1>
      <p className="mb-2">
        Origin: <strong>{shipment.origin}</strong>
      </p>
      <p className="mb-2">
        Destination: <strong>{shipment.destination}</strong>
      </p>
      <p className="mb-2">
        Tracking #: <strong>{shipment.trackingNumber}</strong>
      </p>

      {/* Editable fields */}
      <div className="mt-4 space-y-4">
        <div>
          <label className="block font-medium mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ShipmentStatus)}
            className="border p-2 rounded w-full"
          >
            <option value="PENDING">PENDING</option>
            <option value="IN_TRANSIT">IN_TRANSIT</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="border p-2 rounded w-full"
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleUpdate}
            className="flex-1 bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Update
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>

      {originCoords && destinationCoords && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-blue-600 mb-2">
            Shipment Route Map
          </h2>

          <MapContainer
            center={originCoords}
            zoom={4}
            scrollWheelZoom={true}
            className="h-[400px] w-full rounded shadow"
          >
            <TileLayer
              attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
              url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
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
