import {
  getCollectionPoints,
  getRouteById,
  getRoutePoints,
} from "@/lib/supabase";
import EcoTrackView from "@/components/EcoTrackView";
import { mockRoutes } from "@/lib/mockRoutes";
import type { Database } from "@/lib/database.types";

type CollectionPoint = Database["public"]["Tables"]["collection_points"]["Row"];
type DbRoute = Database["public"]["Tables"]["routes"]["Row"];
type RoutePointRow = Database["public"]["Tables"]["route_points"]["Row"];

export const dynamic = "force-dynamic";

export default async function EcoTrackPage() {
  let collectionPoints: CollectionPoint[] = [];
  let initialRoute: DbRoute | null = null;
  let routeTrail: RoutePointRow[] = [];
  let loadError: string | null = null;

  try {
    collectionPoints = (await getCollectionPoints()) ?? [];
    initialRoute = await getRouteById(mockRoutes[0].routeId);
    routeTrail = (await getRoutePoints(mockRoutes[0].routeId)) ?? [];
  } catch (error) {
    console.error("Failed to load EcoTrack data", error);
    loadError =
      "Не удалось загрузить данные из базы. Показан маршрут по последним известным данным.";
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl bg-champagne p-8">
        <h1 className="text-2xl font-bold text-codium">EcoTrack</h1>
        <p className="mt-2 text-bistre">
          Отслеживайте маршруты мусоровозов в реальном времени: от выезда до
          сортировки и переработки.
        </p>
      </div>

      <EcoTrackView
        collectionPoints={collectionPoints}
        initialRoute={initialRoute}
        routeTrail={routeTrail}
        loadError={loadError}
      />
    </div>
  );
}
