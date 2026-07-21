import Link from "next/link";

const modules = [
  {
    label: "AI Sort",
    title: "Сфотографируйте мусор",
    description:
      "ИИ определит категорию, материал и подскажет, куда его нести — за секунды.",
    href: "/ai-sort",
  },
  {
    label: "EcoTrack",
    title: "Проследите за мусоровозом",
    description:
      "Карта в реальном времени: от контейнерной площадки до полигона.",
    href: "/eco-track",
  },
  {
    label: "Analytics",
    title: "Проверьте цифры",
    description:
      "Сколько переработано и сколько CO₂ удалось избежать — без прикрас.",
    href: "/analytics",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-2xl bg-champagne p-8 sm:p-12">
        <span className="inline-block rounded-full bg-peach/25 px-3 py-1 text-xs font-medium uppercase tracking-wide text-bistre">
          Уральск · пилот
        </span>

        <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-codium sm:text-5xl">
          Рассортировали — а дальше?
        </h1>

        <p className="mt-4 max-w-2xl text-lg text-bistre">
          Вы моете банки и раскладываете мусор по пакетам — а машина увозит
          всё в одном кузове. Без данных о маршруте нельзя проверить, доехал
          ли отсортированный мусор до переработки или оказался на том же
          полигоне, что и остальное.
        </p>

        <p className="mt-3 max-w-2xl text-lg font-medium text-codium">
          Loom делает этот путь видимым: от фото в телефоне до подтверждения
          на полигоне.
        </p>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/ai-sort"
            className="rounded-lg bg-peach px-6 py-3 font-medium text-ivory shadow-sm transition-opacity hover:opacity-90"
          >
            Отсортировать отходы
          </Link>
          <Link
            href="/eco-track"
            className="rounded-lg border-2 border-bistre/30 px-6 py-3 font-medium text-codium transition-colors hover:bg-ivory"
          >
            Посмотреть демо
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {modules.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="group rounded-xl bg-champagne p-6 transition-colors hover:bg-ivory"
          >
            <span className="text-xs font-medium uppercase tracking-wide text-bistre">
              {m.label}
            </span>
            <p className="mt-2 text-lg font-semibold text-codium">
              {m.title}
            </p>
            <p className="mt-1 text-sm text-bistre">{m.description}</p>
            <span className="mt-3 inline-block text-sm font-medium text-peach group-hover:underline">
              Открыть →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
