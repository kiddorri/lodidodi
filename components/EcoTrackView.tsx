"use client";

import dynamic from "next/dynamic";
import type { Database } from "@/lib/database.types";
import { mockRoutes } from "@/lib/mockRoutes";
import RoutePanel from "./RoutePanel";

type CollectionPoint = Database["public"]["Tables"]["collection_points"]["Row"];
type DbRoute = Database["public"]["Tables"]["routes"]["Row"];
type RoutePointRow = Database["public"]["Tables"]["route_points"]["Row"];

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
  initialRoute: DbRoute | null;
  routeTrail: RoutePointRow[];
  loadError: string | null;
}

export default function EcoTrackView({
  collectionPoints,
  initialRoute,
  routeTrail,
  loadError,
}: Props) {
  const route = mockRoutes[0];

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
            <RoutePanel
              key={route.id}
              route={route}
              collectionPoints={collectionPoints}
              initialRoute={initialRoute}
              routeTrail={routeTrail}
            />
          </ul>
        </aside>
      </div>
    </div>
  );
}
