import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useShipmentStore } from "../stores/shipmentStore";
import type { Shipment } from "../types/shipment";

let stompClient: Client | null = null;

// Determine WebSocket URL
const isLocal = import.meta.env.DEV;

// Change these to your actual deployed backend URL
const RENDER_WS_URL = "https://freight-tracker.onrender.com/ws";
const LOCAL_WS_URL = "http://localhost:8080/ws";

export function connectWebSocket() {
  const endpoint = isLocal ? LOCAL_WS_URL : RENDER_WS_URL;

  stompClient = new Client({
    // In production, brokerURL is not required if you're using SockJS fallback
    webSocketFactory: () => new SockJS(endpoint),
    reconnectDelay: 5000,
    onConnect: () => {
      console.log("Connected to WebSocket");

      stompClient?.subscribe("/topic/shipments", (message) => {
        const shipment: Shipment = JSON.parse(message.body);
        useShipmentStore.getState().upsert(shipment);
      });
    },
    onStompError: (frame) => {
      console.error("WebSocket error:", frame);
    },
  });

  stompClient.activate();
}

export function disconnectWebSocket() {
  stompClient?.deactivate();
}
