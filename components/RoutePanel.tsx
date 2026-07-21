"use client";

import { useState } from "react";
import type { Database } from "@/lib/database.types";
import {
  STATUS_COLORS,
  STATUS_LABELS,
  type MockRoute,
} from "@/lib/mockRoutes";
import { confirmRouteRecycled } from "@/lib/supabase";

type CollectionPoint = Database["public"]["Tables"]["collection_points"]["Row"];
type DbRoute = Database["public"]["Tables"]["routes"]["Row"];
type RouteStatus = Database["public"]["Tables"]["routes"]["Row"]["status"];

// HH:MM from an ISO timestamp, without a timezone lib — the wall-clock as stored.
function formatTime(iso: string | null): string {
  if (!iso) return "—";
  const m = iso.match(/T(\d{2}:\d{2})/);
  return m ? m[1] : "—";
}

interface Props {
  route: MockRoute;
  collectionPoints: CollectionPoint[];
  initialRoute: DbRoute | null;
}

export default function RoutePanel({
  route,
  collectionPoints,
  initialRoute,
}: Props) {
  const [status, setStatus] = useState<RouteStatus>(
    initialRoute?.status ?? route.status,
  );
  const [confirmedAt, setConfirmedAt] = useState<string | null>(
    initialRoute?.confirmed_at ?? null,
  );
  const [confirmationNote, setConfirmationNote] = useState<string | null>(
    initialRoute?.confirmation_note ?? null,
  );
  const [confirming, setConfirming] = useState(false);
  const [note, setNote] = useState("Принято на переработку");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const origin = collectionPoints.find((p) => p.id === route.originPointId);
  const originName = origin?.name ?? route.originName;

  async function handleConfirm() {
    setBusy(true);
    setError(null);
    try {
      const updated = await confirmRouteRecycled(
        route.routeId,
        note.trim() || "Принято на переработку",
      );
      setStatus(updated.status);
      setConfirmedAt(updated.confirmed_at);
      setConfirmationNote(updated.confirmation_note);
      setConfirming(false);
    } catch {
      setError("Не удалось подтвердить. Проверьте соединение и повторите.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <li className="rounded-lg bg-ivory p-3">
      <p className="font-medium text-codium">{route.truckPlate}</p>
      <p className="text-sm text-bistre">{route.driverName}</p>
      <span
        className="mt-2 inline-block rounded-full px-3 py-1 text-xs font-medium text-ivory"
        style={{ backgroundColor: STATUS_COLORS[status] }}
      >
        {STATUS_LABELS[status]}
      </span>

      <dl className="mt-3 space-y-0.5 text-xs text-bistre">
        <div>
          <span className="text-codium">Везёт:</span> {route.cargoType}
        </div>
        <div>
          <span className="text-codium">Откуда:</span> {originName}
        </div>
        <div>
          <span className="text-codium">Забор:</span>{" "}
          {formatTime(route.startedAt)}
        </div>
      </dl>

      {status === "recycled" && confirmedAt && (
        <div className="mt-3 rounded-md bg-champagne p-2 text-xs text-codium">
          <p className="font-medium">✓ Переработка подтверждена</p>
          <p className="text-bistre">
            {formatTime(confirmedAt)}
            {confirmationNote ? ` · ${confirmationNote}` : ""}
          </p>
        </div>
      )}

      {status !== "recycled" && (
        <div className="mt-3">
          {!confirming ? (
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="rounded-md bg-peach px-3 py-1.5 text-xs font-medium text-ivory hover:opacity-90"
            >
              Подтвердить переработку
            </button>
          ) : (
            <div className="flex flex-col gap-2">
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Доказательство (вес, № весовой…)"
                className="rounded-md border border-bistre/40 bg-ivory px-2 py-1 text-xs text-codium"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={busy}
                  className="rounded-md bg-peach px-3 py-1.5 text-xs font-medium text-ivory disabled:opacity-50"
                >
                  {busy ? "…" : "Подтвердить"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConfirming(false);
                    setError(null);
                  }}
                  className="rounded-md bg-bistre/20 px-3 py-1.5 text-xs text-codium"
                >
                  Отмена
                </button>
              </div>
              {error && <p className="text-xs text-peach">{error}</p>}
            </div>
          )}
        </div>
      )}
    </li>
  );
}
