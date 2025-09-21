import { useEffect, useState } from "react";
import { searchShipments } from "../services/shipmentService";
import { useShipmentStore } from "../stores/shipmentStore";
import { Link } from "react-router-dom";
import type { ShipmentStatus } from "../types/shipment";
import { useDebounce } from "../hooks/useDebouce";

// Reusable Badge Components
const StatusBadge = ({ status }: { status: ShipmentStatus }) => {
  const colors: Record<ShipmentStatus, string> = {
    PENDING: "bg-gray-100 text-gray-700",
    IN_TRANSIT: "bg-orange-100 text-orange-700",
    DELIVERED: "bg-green-100 text-green-700",
    CANCELLED: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${colors[status]}`}
    >
      {status}
    </span>
  );
};

const PriorityBadge = ({ priority }: { priority?: string }) => {
  if (!priority) return <span className="text-gray-400 text-xs">N/A</span>;
  const colorMap: Record<string, string> = {
    HIGH: "bg-red-100 text-red-700",
    MEDIUM: "bg-yellow-100 text-yellow-700",
    LOW: "bg-blue-100 text-blue-700",
  };
  return (
    <span
      className={`inline-block px-2 py-1 rounded text-xs font-semibold ${colorMap[priority]}`}
    >
      {priority}
    </span>
  );
};

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-700">Shipments</h1>
        <Link
          to="/shipments/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Shipment
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-lg p-4 shadow-sm mb-6 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search by Origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          className="border border-gray-300 p-2 rounded flex-1"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ShipmentStatus | "")}
          className="border border-gray-300 p-2 rounded w-full md:w-64"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">PENDING</option>
          <option value="IN_TRANSIT">IN_TRANSIT</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      {/* Loading/Error */}
      {loading && (
        <p className="text-center text-gray-600 animate-pulse">
          Loading shipments...
        </p>
      )}
      {error && <p className="text-center text-red-600">{error}</p>}

      {/* Table */}
      {!loading && !error && shipments.length > 0 && (
        <>
          <div className="overflow-x-auto rounded shadow border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="text-left px-4 py-2">ID</th>
                  <th className="text-left px-4 py-2">Origin</th>
                  <th className="text-left px-4 py-2">Destination</th>
                  <th className="text-left px-4 py-2">Status</th>
                  <th className="text-left px-4 py-2">Priority</th>
                  <th className="text-left px-4 py-2">Last Updated</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {shipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium">{shipment.id}</td>
                    <td className="px-4 py-2">{shipment.origin}</td>
                    <td className="px-4 py-2">{shipment.destination}</td>
                    <td className="px-4 py-2">
                      <StatusBadge status={shipment.status} />
                    </td>
                    <td className="px-4 py-2">
                      <PriorityBadge priority={shipment.priority} />
                    </td>
                    <td className="px-4 py-2 text-gray-500">
                      {new Date(shipment.lastUpdatedTime).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <Link
                        to={`/shipments/${shipment.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
        <p className="text-center text-gray-500">No shipments found.</p>
      )}
    </div>
  );
}
