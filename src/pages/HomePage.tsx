import { Link } from "react-router-dom";
import { FaMapMarkedAlt, FaPlus, FaChartBar, FaBoxes } from "react-icons/fa";

export default function HomePage() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-2">
        Welcome to Freight Tracker
      </h1>
      <p className="text-lg text-gray-700 mb-8">
        Your logistics, visualized and optimized.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Link
          to="/shipments"
          className="bg-white shadow-md hover:shadow-lg transition rounded-xl p-6 border border-gray-200 text-left"
        >
          <div className="flex items-center space-x-4">
            <FaBoxes className="text-blue-500 text-3xl" />
            <div>
              <h2 className="text-xl font-semibold">View Shipments</h2>
              <p className="text-gray-600 text-sm">
                Browse and manage your shipment records.
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/shipments/add"
          className="bg-white shadow-md hover:shadow-lg transition rounded-xl p-6 border border-gray-200 text-left"
        >
          <div className="flex items-center space-x-4">
            <FaPlus className="text-green-500 text-3xl" />
            <div>
              <h2 className="text-xl font-semibold">Add Shipment</h2>
              <p className="text-gray-600 text-sm">
                Enter a new shipment into the system.
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/shipments/map"
          className="bg-white shadow-md hover:shadow-lg transition rounded-xl p-6 border border-gray-200 text-left"
        >
          <div className="flex items-center space-x-4">
            <FaMapMarkedAlt className="text-purple-500 text-3xl" />
            <div>
              <h2 className="text-xl font-semibold">Map Dashboard</h2>
              <p className="text-gray-600 text-sm">
                Visualize shipments and routes on a map.
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/shipments/stats"
          className="bg-white shadow-md hover:shadow-lg transition rounded-xl p-6 border border-gray-200 text-left"
        >
          <div className="flex items-center space-x-4">
            <FaChartBar className="text-yellow-500 text-3xl" />
            <div>
              <h2 className="text-xl font-semibold">Stats Dashboard</h2>
              <p className="text-gray-600 text-sm">
                Get insights into shipment performance.
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
