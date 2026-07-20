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
  // Fixed collection_point ids from supabase/seed.sql — resolved to names via
  // the collection_points loaded from Supabase. originName is a fallback shown
  // when the DB hasn't been re-seeded with these fixed ids yet.
  originPointId: string;
  originName: string;
  destinationPointId: string;
  cargoType: string;
  startedAt: string; // ISO timestamp
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

// How far along the route the truck sits, as a fraction of the path, per
// status. With real GPS the position is an actual coordinate; for the mock we
// derive it from status so the marker is meaningful: just collected → near the
// start, sorting → mid-route, recycled → arrived at the landfill.
const STATUS_PROGRESS: Record<RouteStatus, number> = {
  in_progress: 0.15,
  at_sorting: 0.65,
  recycled: 1,
};

export function truckPositionIndex(route: MockRoute): number {
  const lastIndex = route.points.length - 1;
  if (lastIndex <= 0) return 0;
  return Math.round(STATUS_PROGRESS[route.status] * lastIndex);
}

// Real driving path from the "Контейнерная площадка, ул. Достык" collection
// point to the city landfill ("Полигон ТБО и МСК «ICM Recycling»"), routed
// along actual streets via the public OSRM demo API and down-sampled from
// ~270 points to a lightweight subset that keeps the road shape. Real GPS
// points from the driver's phone will replace this.
export const mockRoutes: MockRoute[] = [
  {
    id: "mock-route-1",
    truckPlate: "911 ABC 07",
    driverName: "Ержан Сапаров",
    status: "in_progress",
    originPointId: "11111111-1111-1111-1111-111111111106", // Контейнерная площадка, ул. Достык
    originName: "Контейнерная площадка, ул. Достык",
    destinationPointId: "11111111-1111-1111-1111-111111111101", // Полигон ТБО и МСК «ICM Recycling»
    cargoType: "Смешанные ТБО",
    startedAt: "2026-07-20T08:15:00+05:00",
    points: [
      { lat: 51.232954, lng: 51.366801 }, // старт: ул. Достык
      { lat: 51.232713, lng: 51.361371 },
      { lat: 51.234265, lng: 51.360022 },
      { lat: 51.23734, lng: 51.346115 },
      { lat: 51.237918, lng: 51.341025 },
      { lat: 51.241716, lng: 51.335257 },
      { lat: 51.243949, lng: 51.331496 },
      { lat: 51.24545, lng: 51.32121 },
      { lat: 51.247306, lng: 51.314645 },
      { lat: 51.249452, lng: 51.309722 },
      { lat: 51.249379, lng: 51.302141 },
      { lat: 51.24704, lng: 51.297771 },
      { lat: 51.239395, lng: 51.296419 },
      { lat: 51.227899, lng: 51.288104 },
      { lat: 51.214774, lng: 51.275349 },
      { lat: 51.195294, lng: 51.265188 },
      { lat: 51.18819, lng: 51.220366 },
      { lat: 51.19003, lng: 51.219808 }, // финиш: Полигон ТБО и МСК «ICM Recycling»
    ],
  },
];
