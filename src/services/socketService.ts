import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useShipmentStore } from "../stores/shipmentStore";
import type { Shipment } from "../types/shipment";

// Initialize STOMP client
let stompClient: Client | null = null;

export function connectWebSocket() {
  stompClient = new Client({
    brokerURL: "ws://localhost:8080/ws", // Fallback to SockJS
    webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
    reconnectDelay: 5000, // auto-reconnect
    onConnect: () => {
      console.log("Connected to WebSocket");

      // Subscribe to topic where backend broadcasts
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
