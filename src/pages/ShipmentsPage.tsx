import { useEffect, useState } from "react";
import { getShipments } from "../services/shipmentService";
import { useShipmentStore } from "../stores/shipmentStore";
import { Link } from "react-router-dom";

export default function ShipmentsPage() {
  const { byId, bulkLoad } = useShipmentStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const shipments = Object.values(byId);

  useEffect(() => {
    async function fetchShipments() {
      try {
        setLoading(true);
        const data = await getShipments();
        bulkLoad(data);
      } catch (err) {
        setError("Failed to load shipments");
      } finally {
        setLoading(false);
      }
    }
    fetchShipments();
  }, []);

  if (loading) return <p className="p-6 text-gray-600">Loading shipments...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-green-700">Shipments</h1>
        <Link
          to="/shipments/add"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Shipment
        </Link>
      </div>

      {shipments.length === 0 ? (
        <p className="text-gray-600">No shipments found.</p>
      ) : (
        <table className="w-full border border-gray-300 shadow-sm rounded">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Origin</th>
              <th className="p-2 border">Destination</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Priority</th>
              <th className="p-2 border">Last Updated</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {shipments.map((shipment) => (
              <tr
                key={shipment.id}
                className="hover:bg-gray-50 transition cursor-pointer"
              >
                <td className="p-2 border">{shipment.id}</td>
                <td className="p-2 border">{shipment.origin}</td>
                <td className="p-2 border">{shipment.destination}</td>
                <td className="p-2 border">{shipment.status}</td>
                <td className="p-2 border">{shipment.priority ?? "N/A"}</td>
                <td className="p-2 border">
                  {new Date(shipment.lastUpdatedTime).toLocaleString()}
                </td>
                <td className="p-2 border">
                  <Link
                    to={`/shipments/${shipment.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
