import Link from "next/link";
import { getWasteItems } from "@/lib/supabase";
import AnalyticsChart, {
  type CategorySlice,
} from "@/components/AnalyticsChart";
import type { Database } from "@/lib/database.types";

type WasteItem = Database["public"]["Tables"]["waste_items"]["Row"];

export const dynamic = "force-dynamic";

function groupByCategory(items: WasteItem[]): CategorySlice[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    const name = item.category?.trim() || "Прочее";
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return Array.from(counts, ([name, value]) => ({ name, value })).sort(
    (a, b) => b.value - a.value,
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-champagne p-6 text-codium">
      <p className="text-sm text-bistre">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}

export default async function AnalyticsPage() {
  let items: WasteItem[] = [];
  let loadError: string | null = null;

  try {
    items = (await getWasteItems()) ?? [];
  } catch (error) {
    console.error("Failed to load waste items", error);
    loadError =
      "Не удалось загрузить данные из базы. Аналитика временно недоступна.";
  }

  const total = items.length;
  const recyclableCount = items.filter((i) => i.recyclable === true).length;
  const recyclablePct = total > 0 ? Math.round((recyclableCount / total) * 100) : 0;

  const confidences = items
    .map((i) => i.confidence)
    .filter((c): c is number => typeof c === "number");
  const avgConfidencePct =
    confidences.length > 0
      ? Math.round(
          (confidences.reduce((sum, c) => sum + c, 0) / confidences.length) * 100,
        )
      : null;

  const categoryData = groupByCategory(items);

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-xl bg-champagne p-8">
        <h1 className="text-2xl font-bold text-codium">Analytics</h1>
        <p className="mt-2 text-bistre">
          Сводная статистика по распознанным отходам за всё время.
        </p>
      </div>

      {loadError && (
        <div className="rounded-xl border border-peach bg-champagne p-4 text-codium">
          {loadError}
        </div>
      )}

      {!loadError && total === 0 && (
        <div className="rounded-xl bg-champagne p-8 text-center text-codium">
          <p className="text-lg font-medium">Пока нет данных</p>
          <p className="mt-1 text-bistre">
            Попробуйте{" "}
            <Link href="/ai-sort" className="font-medium text-peach underline">
              AI Sort
            </Link>{" "}
            — распознайте первый предмет, и он появится здесь.
          </p>
        </div>
      )}

      {!loadError && total > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              label="Всего проанализировано"
              value={`${total} предметов`}
            />
            <StatCard label="Можно переработать" value={`${recyclablePct}%`} />
            <StatCard
              label="Средняя уверенность ИИ"
              value={avgConfidencePct !== null ? `${avgConfidencePct}%` : "—"}
            />
          </div>

          <div className="rounded-xl bg-champagne p-6">
            <h2 className="mb-2 text-lg font-bold text-codium">
              Распределение по категориям
            </h2>
            <AnalyticsChart data={categoryData} />
          </div>
        </>
      )}
    </div>
  );
}
