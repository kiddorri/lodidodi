import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-codium">WasteFlow</h1>
      <p className="text-bistre">
        Платформа цифрового управления отходами: сортировка мусора с помощью
        ИИ и прозрачный трекинг вывоза.
      </p>
      <div className="flex gap-4">
        <Link
          href="/ai-sort"
          className="rounded-lg bg-peach px-5 py-3 font-medium text-codium hover:opacity-90"
        >
          AI Sort
        </Link>
        <Link
          href="/eco-track"
          className="rounded-lg bg-champagne px-5 py-3 font-medium text-codium hover:opacity-90"
        >
          EcoTrack
        </Link>
        <Link
          href="/analytics"
          className="rounded-lg bg-champagne px-5 py-3 font-medium text-codium hover:opacity-90"
        >
          Analytics
        </Link>
      </div>
    </div>
  );
}
