import type { Database } from "./database.types";

type CollectionPoint = Database["public"]["Tables"]["collection_points"]["Row"];

// City center of Uralsk (Oral), Kazakhstan — used as the default "device
// location" until the app captures a real GPS position from the browser.
export const DEFAULT_LOCATION = { lat: 51.2333, lng: 51.3667 };

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

export function haversineDistanceKm(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
) {
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(from.lat)) *
      Math.cos(toRadians(to.lat)) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

export function findNearestCollectionPoint(
  points: CollectionPoint[],
  from: { lat: number; lng: number } = DEFAULT_LOCATION,
) {
  if (points.length === 0) return null;

  let nearest = points[0];
  let nearestDistance = haversineDistanceKm(from, points[0]);

  for (const point of points.slice(1)) {
    const distance = haversineDistanceKm(from, point);
    if (distance < nearestDistance) {
      nearest = point;
      nearestDistance = distance;
    }
  }

  return { point: nearest, distanceKm: nearestDistance };
}
