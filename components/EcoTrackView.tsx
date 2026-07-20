"use client";

import dynamic from "next/dynamic";
import type { Database } from "@/lib/database.types";
import { mockRoutes, STATUS_COLORS, STATUS_LABELS } from "@/lib/mockRoutes";

type CollectionPoint = Database["public"]["Tables"]["collection_points"]["Row"];

// Extract HH:MM from an ISO timestamp without pulling in a timezone lib —
// takes the wall-clock time as stored.
function formatPickupTime(iso: string): string {
  const match = iso.match(/T(\d{2}:\d{2})/);
  return match ? match[1] : "—";
}

const EcoTrackMap = dynamic(() => import("./EcoTrackMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[500px] w-full items-center justify-center rounded-xl bg-champagne text-codium">
      Загружаем карту…
    </div>
  ),
});

interface Props {
  collectionPoints: CollectionPoint[];
  loadError: string | null;
}

export default function EcoTrackView({ collectionPoints, loadError }: Props) {
  const route = mockRoutes[0];

  const pointsById = new Map(collectionPoints.map((p) => [p.id, p]));

  return (
    <div className="flex flex-col gap-4">
      {loadError && (
        <div className="rounded-xl border border-peach bg-champagne p-4 text-codium">
          {loadError}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EcoTrackMap collectionPoints={collectionPoints} route={route} />
        </div>

        <aside className="rounded-xl bg-champagne p-4">
          <h2 className="text-lg font-bold text-codium">Активные маршруты</h2>
          <ul className="mt-3 flex flex-col gap-3">
            {mockRoutes.map((r) => {
              const origin = pointsById.get(r.originPointId);
              return (
                <li key={r.id} className="rounded-lg bg-ivory p-3">
                  <p className="font-medium text-codium">{r.truckPlate}</p>
                  <p className="text-sm text-bistre">{r.driverName}</p>
                  <span
                    className="mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium text-ivory"
                    style={{ backgroundColor: STATUS_COLORS[r.status] }}
                  >
                    {STATUS_LABELS[r.status]}
                  </span>
                  <dl className="mt-3 space-y-0.5 text-xs text-bistre">
                    <div>
                      <span className="text-codium">Везёт:</span> {r.cargoType}
                    </div>
                    <div>
                      <span className="text-codium">Откуда:</span>{" "}
                      {origin?.name ?? r.originName}
                    </div>
                    <div>
                      <span className="text-codium">Забор:</span>{" "}
                      {formatPickupTime(r.startedAt)}
                    </div>
                  </dl>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </div>
  );
}
