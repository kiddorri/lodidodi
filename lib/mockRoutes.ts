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
// to the actual city landfill ("Полигон ТБО и МСК «ICM Recycling»") — the
// real destination for a collection truck, not a sorting facility. Follows
// a plausible route out of the city (ул. Достык → объездная автодорога →
// трасса в сторону пос. Каменка → подъезд к полигону). Real GPS points
// from the driver's phone will replace this.
export const mockRoutes: MockRoute[] = [
  {
    id: "mock-route-1",
    truckPlate: "911 ABC 07",
    driverName: "Ержан Сапаров",
    status: "in_progress",
    points: [
      { lat: 51.2333, lng: 51.3667 }, // старт: ул. Достык
      { lat: 51.2295, lng: 51.349 }, // выезд на объездную автодорогу
      { lat: 51.2255, lng: 51.331 }, // объездная дорога на запад
      { lat: 51.2205, lng: 51.311 }, // трасса в сторону пос. Каменка
      { lat: 51.215, lng: 51.292 }, // трасса, продолжение
      { lat: 51.209, lng: 51.273 }, // поворот к грунтовой дороге на полигон
      { lat: 51.203, lng: 51.254 }, // грунтовая дорога
      { lat: 51.1965, lng: 51.236 }, // подъезд к полигону
      { lat: 51.1899056, lng: 51.219866 }, // финиш: Полигон ТБО и МСК «ICM Recycling»
    ],
  },
];
