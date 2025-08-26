import { useEffect, useState } from "react";
import { searchShipments } from "../services/shipmentService";
import { useShipmentStore } from "../stores/shipmentStore";
import { Link } from "react-router-dom";
import type { ShipmentStatus } from "../types/shipment";
import { useDebounce } from "../hooks/useDebouce";

export default function ShipmentsPage() {
  const { byId, bulkLoad } = useShipmentStore();

  // Filters
  const [origin, setOrigin] = useState("");
  const debouncedOrigin = useDebounce(origin, 300);
  const [status, setStatus] = useState<ShipmentStatus | "">("");
  const [page, setPage] = useState(0);
  const [size] = useState(10);

  // Loading & error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const shipments = Object.values(byId);

  // Fetch shipments whenever filters or page change
  useEffect(() => {
    async function fetchShipments() {
      try {
        setLoading(true);
        const data = await searchShipments(
          debouncedOrigin || undefined,
          status || undefined,
          page,
          size
        );

        bulkLoad(data.content);
      } catch {
        setError("Failed to load shipments");
      } finally {
        setLoading(false);
      }
    }
    fetchShipments();
  }, [debouncedOrigin, status, page, size, bulkLoad]);

  // Pagination handlers
  const handleNext = () => setPage((prev) => prev + 1);
  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 0));

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-green-700">Shipments</h1>
        <Link
          to="/shipments/add"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Shipment
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by Origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ShipmentStatus | "")}
          className="border p-2 rounded"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">PENDING</option>
          <option value="IN_TRANSIT">IN_TRANSIT</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      {/* Loading/Error */}
      {loading && <p className="text-gray-600">Loading shipments...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Table */}
      {!loading && !error && shipments.length > 0 && (
        <>
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
                <tr key={shipment.id} className="hover:bg-gray-50 transition">
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

          {/* Pagination */}
          <div className="flex justify-between mt-4">
            <button
              onClick={handlePrev}
              disabled={page === 0}
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Next
            </button>
          </div>
        </>
      )}

      {!loading && !error && shipments.length === 0 && (
        <p className="text-gray-600">No shipments found.</p>
      )}
    </div>
  );
}
