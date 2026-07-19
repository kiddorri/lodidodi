import { getCollectionPoints } from "@/lib/supabase";
import EcoTrackView from "@/components/EcoTrackView";
import type { Database } from "@/lib/database.types";

type CollectionPoint = Database["public"]["Tables"]["collection_points"]["Row"];

export const dynamic = "force-dynamic";

export default async function EcoTrackPage() {
  let collectionPoints: CollectionPoint[] = [];
  let loadError: string | null = null;

  try {
    collectionPoints = (await getCollectionPoints()) ?? [];
  } catch (error) {
    console.error("Failed to load collection points", error);
    loadError =
      "Не удалось загрузить точки сдачи из базы данных. На карте показан только маршрут.";
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

      <EcoTrackView collectionPoints={collectionPoints} loadError={loadError} />
    </div>
  );
}
