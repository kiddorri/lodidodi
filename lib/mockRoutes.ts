import type { RouteStatus } from "./database.types";

export interface MockRoutePoint {
  lat: number;
  lng: number;
}

export interface MockRoute {
  id: string;
  truckPlate: string;
  driverName: string;
  status: RouteStatus;
  points: MockRoutePoint[];
}

export const STATUS_LABELS: Record<RouteStatus, string> = {
  in_progress: "Collected",
  at_sorting: "Sorting",
  recycled: "Recycling",
};

export const STATUS_COLORS: Record<RouteStatus, string> = {
  in_progress: "#837534", // bistre
  at_sorting: "#DB918F", // peach
  recycled: "#4F5127", // codium
};

// Mock path from the "Контейнерная площадка, ул. Достык" collection point
// to "Мусоросортировочная станция «Уральск»", following a plausible route
// through the city grid (ул. Достык → ул. Чапаева → просп. Н. Назарбаева →
// ул. Момышулы). Real GPS points from the driver's phone will replace this.
export const mockRoutes: MockRoute[] = [
  {
    id: "mock-route-1",
    truckPlate: "911 ABC 07",
    driverName: "Ержан Сапаров",
    status: "at_sorting",
    points: [
      { lat: 51.2333, lng: 51.3667 }, // старт: ул. Достык
      { lat: 51.2328, lng: 51.3684 }, // поворот на ул. Чапаева
      { lat: 51.2311, lng: 51.3698 }, // ул. Чапаева
      { lat: 51.2296, lng: 51.3712 }, // пересечение с просп. Н. Назарбаева
      { lat: 51.2278, lng: 51.3721 }, // просп. Н. Назарбаева
      { lat: 51.2262, lng: 51.3736 }, // поворот на ул. Момышулы
      { lat: 51.2245, lng: 51.3752 }, // ул. Момышулы
      { lat: 51.2222, lng: 51.3771 }, // подъезд к станции
      { lat: 51.22, lng: 51.38 }, // финиш: Мусоросортировочная станция «Уральск»
    ],
  },
];
