export type ShipmentStatus =
  | "PENDING"
  | "IN_TRANSIT"
  | "DELIVERED"
  | "CANCELLED";
export type Priority = "LOW" | "MEDIUM" | "HIGH";
export interface Shipment {
  id: number;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  trackingNumber: string;
  carrier?: string;
  priority?: Priority;
  lastUpdatedTime: string; // Backend sends ISO string
}
export interface ShipmentStatsDTO {
  totalShipments: number;
  statusCounts: Record<ShipmentStatus, number>;
  mostCommonOrigin: string | null;
}

export interface ShipmentUpdateMessage {
  shipmentId: number;
  trackingNumber: string;
  status: ShipmentStatus;
  lastUpdatedTime: string; // ISO string
}
