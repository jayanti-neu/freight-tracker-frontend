// src/components/Navbar.tsx
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Home", path: "/" },
  { label: "All Shipments", path: "/shipments" },
  { label: "Add Shipment", path: "/shipments/add" },
  { label: "Map Dashboard", path: "/shipments/map" },
  { label: "Stats", path: "/shipments/stats" },
];

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <NavLink to="/" className="text-xl font-bold text-blue-600">
          Freight Tracker
        </NavLink>
        <div className="flex space-x-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end // <- only highlight exact path match
              className={({ isActive }) =>
                `text-sm font-medium px-3 py-2 rounded transition duration-200 hover:bg-blue-100 ${
                  isActive ? "bg-blue-200 text-blue-900" : "text-gray-600"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
