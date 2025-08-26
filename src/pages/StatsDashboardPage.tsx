import { useEffect, useState } from "react";
import { getShipmentStats } from "../services/shipmentService";
import type { ShipmentStatus } from "../types/shipment";
import type { ShipmentStatsDTO } from "../types/shipment";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { Link } from "react-router-dom";

export default function StatsDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<ShipmentStatsDTO | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getShipmentStats();
        setStats(data);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <p className="p-6">Loading stats...</p>;
  if (!stats) return <p className="p-6 text-red-600">Failed to load stats.</p>;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-blue-700">Shipment Statistics</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600">Total Shipments</p>
          <h2 className="text-3xl font-bold">{stats.totalShipments}</h2>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600">Most Common Origin</p>
          <h2 className="text-xl font-semibold">
            {stats.mostCommonOrigin ?? "N/A"}
          </h2>
        </div>

        {(
          [
            "PENDING",
            "IN_TRANSIT",
            "DELIVERED",
            "CANCELLED",
          ] as ShipmentStatus[]
        ).map((status) => (
          <div key={status} className="bg-white p-4 rounded shadow border-t-4">
            <p className="text-gray-600">{status}</p>
            <h2 className="text-2xl font-bold">
              {stats.statusCounts[status] ?? 0}
            </h2>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold mt-8 text-gray-700">
        Shipment Status Breakdown
      </h2>

      <div className="h-64 bg-white p-4 rounded shadow">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={Object.entries(stats.statusCounts).map(([status, count]) => ({
              status,
              count,
            }))}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#3b82f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <Link
        to="/shipments"
        className="inline-block mt-4 text-blue-600 hover:underline"
      >
        ← Back to shipments
      </Link>
    </div>
  );
}
