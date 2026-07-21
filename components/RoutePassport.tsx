"use client";

import type { Database } from "@/lib/database.types";
import { formatTime } from "@/lib/format";

type RouteStatus = Database["public"]["Tables"]["routes"]["Row"]["status"];

export interface TrailPoint {
  lat: number;
  lng: number;
  ts: string | null;
}

interface Props {
  truckPlate: string;
  cargoType: string;
  originName: string;
  destinationName: string;
  startedAt: string;
  status: RouteStatus;
  confirmedAt: string | null;
  confirmationNote: string | null;
  trail: TrailPoint[];
  onClose: () => void;
}

function Step({
  done,
  title,
  detail,
}: {
  done: boolean;
  title: string;
  detail?: string;
}) {
  return (
    <li className="flex gap-3">
      <span
        className={`mt-1 h-3 w-3 shrink-0 rounded-full border-2 ${
          done ? "border-peach bg-peach" : "border-bistre bg-transparent"
        }`}
      />
      <div>
        <p className="text-sm font-medium text-codium">{title}</p>
        {detail && <p className="text-xs text-bistre">{detail}</p>}
      </div>
    </li>
  );
}

export default function RoutePassport({
  truckPlate,
  cargoType,
  originName,
  destinationName,
  startedAt,
  status,
  confirmedAt,
  confirmationNote,
  trail,
  onClose,
}: Props) {
  const withTs = trail.filter((p) => p.ts);
  const firstTs = withTs[0]?.ts ?? null;
  const lastTs = withTs[withTs.length - 1]?.ts ?? null;
  const trailDetail =
    trail.length === 0
      ? "Точки маршрута ещё не зафиксированы"
      : withTs.length > 0
        ? `${trail.length} точек GPS · ${formatTime(firstTs)}–${formatTime(lastTs)}`
        : `${trail.length} точек маршрута`;

  const recycled = status === "recycled";

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-codium/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-ivory p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-codium">Цифровой паспорт</h2>
            <p className="text-sm text-bistre">
              {truckPlate} · {cargoType}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="rounded-full bg-champagne px-3 py-1 text-codium hover:opacity-90"
          >
            ✕
          </button>
        </div>

        <ol className="mt-5 flex flex-col gap-4">
          <Step
            done
            title={`Забор — ${formatTime(startedAt)}`}
            detail={originName}
          />
          <Step done={trail.length > 0} title="В пути" detail={trailDetail} />
          <Step
            done={recycled}
            title={`Доставка — ${destinationName}`}
            detail={recycled ? "Груз доставлен" : "В процессе доставки"}
          />
          <Step
            done={recycled}
            title="Переработка"
            detail={
              recycled && confirmedAt
                ? `Подтверждена ${formatTime(confirmedAt)}${
                    confirmationNote ? ` · ${confirmationNote}` : ""
                  }`
                : "Ожидает подтверждения оператора"
            }
          />
        </ol>
      </div>
    </div>
  );
}
