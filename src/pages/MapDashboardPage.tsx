import { useEffect, useState } from "react";
import { getShipments } from "../services/shipmentService";
import type { Shipment, ShipmentStatus } from "../types/shipment";
import { geocodeCity } from "../utils/geocode";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useShipmentStore } from "../stores/shipmentStore";
import React from "react";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Color routes based on shipment status
const getColorForStatus = (status: ShipmentStatus): string => {
  switch (status) {
    case "PENDING":
      return "gray";
    case "IN_TRANSIT":
      return "orange";
    case "DELIVERED":
      return "green";
    case "CANCELLED":
      return "red";
    default:
      return "blue";
  }
};

export default function MapDashboardPage() {
  const { byId, bulkLoad } = useShipmentStore();
  const [loading, setLoading] = useState(true);
  const [routes, setRoutes] = useState<
    {
      shipment: Shipment;
      originCoords: [number, number];
      destinationCoords: [number, number];
    }[]
  >([]);

  useEffect(() => {
    async function fetchAndMap() {
      setLoading(true);
      let shipments = Object.values(byId);
      if (shipments.length === 0) {
        shipments = await getShipments();
        bulkLoad(shipments);
      }
      const results = [];

      for (const s of shipments) {
        const origin = await geocodeCity(s.origin);
        const dest = await geocodeCity(s.destination);

        console.log("Geocode result for mapdashboard", s.origin, ":", origin);
        console.log(
          "Geocode result for mapdashboard",
          s.destination,
          ":",
          dest
        );
        if (origin && dest) {
          results.push({
            shipment: s,
            originCoords: origin,
            destinationCoords: dest,
          });
        }
      }

      setRoutes(results);
      setLoading(false);
    }

    fetchAndMap();
  }, [byId]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-700">
        <p className="text-lg animate-pulse">Loading shipment routes...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-blue-700 mb-4">
        Shipment Routes Map
      </h1>

      <MapContainer
        center={[37.0902, -95.7129]}
        zoom={4}
        scrollWheelZoom={true}
        className="h-[600px] w-full rounded shadow"
      >
        <TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
        />

        {routes.map(({ shipment, originCoords, destinationCoords }) => (
          <React.Fragment key={shipment.id}>
            <Marker position={originCoords} key={`origin-${shipment.id}`}>
              <Popup>
                <strong>{shipment.trackingNumber}</strong> (Origin)
                <br />
                {shipment.origin}
              </Popup>
            </Marker>

            <Marker position={destinationCoords} key={`dest-${shipment.id}`}>
              <Popup>
                <strong>{shipment.trackingNumber}</strong> (Destination)
                <br />
                {shipment.destination}
              </Popup>
            </Marker>

            <Polyline
              key={`route-${shipment.id}`}
              positions={[originCoords, destinationCoords]}
              color={getColorForStatus(shipment.status)}
            >
              <Popup>
                <div className="space-y-1 text-sm">
                  <div>
                    <strong>Tracking:</strong> {shipment.trackingNumber}
                  </div>
                  <div>
                    <strong>Status:</strong> {shipment.status}
                  </div>
                  <div>
                    <strong>Priority:</strong> {shipment.priority || "N/A"}
                  </div>
                  <div>
                    <strong>Last Updated:</strong>{" "}
                    {new Date(shipment.lastUpdatedTime).toLocaleString()}
                  </div>
                </div>
              </Popup>
            </Polyline>
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
}
