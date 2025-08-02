import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold text-blue-600">
        Welcome to Freight Tracker
      </h1>
      <p className="mt-2 text-gray-700">Your logistics at a glance.</p>

      <Link
        to="/shipments"
        className="mt-4 inline-block rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        View Shipments
      </Link>
    </div>
  );
}
