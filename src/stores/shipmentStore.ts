import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Shipment } from "../types/shipment";

// Define store state + actions
interface ShipmentState {
  byId: Record<number, Shipment>;
  bulkLoad: (shipments: Shipment[]) => void;
  upsert: (shipment: Shipment) => void;
  remove: (id: number) => void;
  clear: () => void;
}

// Zustand store
export const useShipmentStore = create<ShipmentState>()(
  devtools((set) => ({
    // Initial state
    byId: {},

    // Bulk load multiple shipments (used on initial fetch)
    bulkLoad: (shipments) =>
      set(() => {
        const newById: Record<number, Shipment> = {};
        shipments.forEach((s) => {
          newById[s.id] = s;
        });
        return { byId: newById };
      }),

    // Add or update a single shipment
    upsert: (shipment) =>
      set((state) => ({
        byId: { ...state.byId, [shipment.id]: shipment },
      })),

    // Remove a shipment
    remove: (id) =>
      set((state) => {
        const { [id]: _, ...rest } = state.byId;
        return { byId: rest };
      }),

    // Clear all shipments
    clear: () => set({ byId: {} }),
  }))
);
