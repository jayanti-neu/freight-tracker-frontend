import axios from "axios";
import type {
  ShipmentStatus,
  Priority,
  Shipment,
  ShipmentStatsDTO,
} from "../types/shipment";

// Base API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL;

// ---- CREATE a new shipment ----
export const createShipment = async (
  shipmentData: Omit<Shipment, "id" | "lastUpdatedTime">
) => {
  const response = await axios.post(`${API_URL}/shipments`, shipmentData);
  return response.data;
};

// ---- GET all shipments ----
export const getShipments = async () => {
  const response = await axios.get<Shipment[]>(`${API_URL}/shipments`);
  return response.data;
};

// ---- GET shipment by ID ----
export const getShipmentById = async (id: number) => {
  const response = await axios.get<Shipment>(`${API_URL}/shipments/${id}`);
  return response.data;
};

// ---- UPDATE shipment ----
export const updateShipment = async (
  id: number,
  shipmentData: Partial<Shipment>
) => {
  const response = await axios.put(`${API_URL}/shipments/${id}`, shipmentData);
  return response.data;
};

// ---- DELETE shipment ----
export const deleteShipment = async (id: number) => {
  await axios.delete(`${API_URL}/shipments/${id}`);
};

// ---- SEARCH shipments with optional filters ----
export const searchShipments = async (
  origin?: string,
  status?: ShipmentStatus,
  page: number = 0,
  size: number = 10
) => {
  const params = new URLSearchParams();

  if (origin) params.append("origin", origin);
  if (status) params.append("status", status);
  params.append("page", page.toString());
  params.append("size", size.toString());

  const response = await axios.get(
    `${API_URL}/shipments/search?${params.toString()}`
  );
  return response.data; // This will be a paginated response
};

// ---- GET shipment statistics ----
export const getShipmentStats = async () => {
  const response = await axios.get<ShipmentStatsDTO>(
    `${API_URL}/shipments/stats`
  );
  return response.data;
};
