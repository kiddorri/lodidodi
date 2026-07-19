"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import type { Database } from "@/lib/database.types";
import { DEFAULT_LOCATION } from "@/lib/geo";
import { STATUS_COLORS, STATUS_LABELS, type MockRoute } from "@/lib/mockRoutes";

type CollectionPoint = Database["public"]["Tables"]["collection_points"]["Row"];

const POINT_TYPE_COLORS: Record<string, string> = {
  collection: "#837534", // bistre
  sorting: "#DB918F", // peach
  recycling: "#4F5127", // codium
};

const POINT_TYPE_EMOJI: Record<string, string> = {
  collection: "🗑️",
  sorting: "🏭",
  recycling: "♻️",
};

const POINT_TYPE_LABELS: Record<string, string> = {
  collection: "Сбор",
  sorting: "Сортировка",
  recycling: "Переработка",
};

function circleIcon(color: string, emoji: string, size: number) {
  return L.divIcon({
    className: "",
    html: `<div style="background:${color};width:${size}px;height:${size}px;border-radius:9999px;display:flex;align-items:center;justify-content:center;border:2px solid #F9EAD2;box-shadow:0 1px 4px rgba(0,0,0,0.35);font-size:${
      size * 0.5
    }px;line-height:1;">${emoji}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

interface Props {
  collectionPoints: CollectionPoint[];
  route: MockRoute;
}

export default function EcoTrackMap({ collectionPoints, route }: Props) {
  const truckPosition = route.points[route.points.length - 1];
  const truckIcon = circleIcon(STATUS_COLORS[route.status], "🚛", 32);

  return (
    <MapContainer
      center={[DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng]}
      zoom={13}
      scrollWheelZoom
      className="h-[500px] w-full rounded-xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {collectionPoints.map((point) => {
        const type = point.type ?? "collection";
        return (
          <Marker
            key={point.id}
            position={[point.lat, point.lng]}
            icon={circleIcon(
              POINT_TYPE_COLORS[type] ?? POINT_TYPE_COLORS.collection,
              POINT_TYPE_EMOJI[type] ?? POINT_TYPE_EMOJI.collection,
              26,
            )}
          >
            <Popup>
              <p className="font-medium">{point.name}</p>
              <p className="text-sm">
                {POINT_TYPE_LABELS[type] ?? POINT_TYPE_LABELS.collection}
              </p>
            </Popup>
          </Marker>
        );
      })}

      <Polyline
        positions={route.points.map((p) => [p.lat, p.lng])}
        pathOptions={{ color: "#DB918F", weight: 4 }}
      />

      <Marker position={[truckPosition.lat, truckPosition.lng]} icon={truckIcon}>
        <Popup>
          <p className="font-medium">{route.truckPlate}</p>
          <p className="text-sm">{route.driverName}</p>
          <p className="text-sm">{STATUS_LABELS[route.status]}</p>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
