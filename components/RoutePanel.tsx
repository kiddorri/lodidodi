"use client";

import { useEffect, useState } from "react";
import type { Database } from "@/lib/database.types";
import {
  STATUS_COLORS,
  STATUS_LABELS,
  type MockRoute,
} from "@/lib/mockRoutes";
import { confirmRouteRecycled, supabase } from "@/lib/supabase";
import { formatTime } from "@/lib/format";
import RoutePassport, { type TrailPoint } from "./RoutePassport";

type CollectionPoint = Database["public"]["Tables"]["collection_points"]["Row"];
type DbRoute = Database["public"]["Tables"]["routes"]["Row"];
type RoutePointRow = Database["public"]["Tables"]["route_points"]["Row"];
type RouteStatus = Database["public"]["Tables"]["routes"]["Row"]["status"];

// The confirm button + its little form, split out so RoutePanel only has to
// track "what is this route's status", not also "is the form open / typing /
// saving". Owns its own state; tells the parent the result via onConfirm.
function ConfirmRecyclingButton({
  onConfirm,
}: {
  onConfirm: (note: string) => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("Принято на переработку");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      await onConfirm(note.trim() || "Принято на переработку");
      setOpen(false);
    } catch {
      setError("Не удалось подтвердить. Проверьте соединение и повторите.");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-md bg-peach px-3 py-1.5 text-xs font-medium text-ivory hover:opacity-90"
      >
        Подтвердить переработку
      </button>
    );
  }

  return (
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
          onClick={submit}
          disabled={busy}
          className="rounded-md bg-peach px-3 py-1.5 text-xs font-medium text-ivory disabled:opacity-50"
        >
          {busy ? "…" : "Подтвердить"}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
          className="rounded-md bg-bistre/20 px-3 py-1.5 text-xs text-codium"
        >
          Отмена
        </button>
      </div>
      {error && <p className="text-xs text-peach">{error}</p>}
    </div>
  );
}

interface Props {
  route: MockRoute;
  collectionPoints: CollectionPoint[];
  initialRoute: DbRoute | null;
  routeTrail: RoutePointRow[];
}

export default function RoutePanel({
  route,
  collectionPoints,
  initialRoute,
  routeTrail,
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
  const [passportOpen, setPassportOpen] = useState(false);
  const [live, setLive] = useState(false);

  // Subscribe to this route's row: status/confirmation changes (from the
  // operator here or elsewhere) push in over Supabase Realtime and update the
  // card and passport with no page reload. The same channel will carry live
  // GPS once route_points streaming is wired up.
  useEffect(() => {
    const channel = supabase
      .channel(`route-${route.routeId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "routes",
          filter: `id=eq.${route.routeId}`,
        },
        (payload) => {
          const r = payload.new as DbRoute;
          setStatus(r.status);
          setConfirmedAt(r.confirmed_at);
          setConfirmationNote(r.confirmation_note);
        },
      )
      .subscribe((s) => setLive(s === "SUBSCRIBED"));

    return () => {
      supabase.removeChannel(channel);
    };
  }, [route.routeId]);

  const origin = collectionPoints.find((p) => p.id === route.originPointId);
  const originName = origin?.name ?? route.originName;
  const destination = collectionPoints.find(
    (p) => p.id === route.destinationPointId,
  );
  const destinationName = destination?.name ?? route.destinationName;

  // Prefer the real GPS trail from route_points; fall back to the mock
  // geometry (no timestamps) when the DB has none yet.
  const trail: TrailPoint[] =
    routeTrail.length > 0
      ? routeTrail.map((p) => ({ lat: p.lat, lng: p.lng, ts: p.ts }))
      : route.points.map((p) => ({ lat: p.lat, lng: p.lng, ts: null }));

  async function handleConfirm(note: string) {
    const updated = await confirmRouteRecycled(route.routeId, note);
    setStatus(updated.status);
    setConfirmedAt(updated.confirmed_at);
    setConfirmationNote(updated.confirmation_note);
  }

  return (
    <li className="rounded-lg bg-ivory p-3">
      <div className="flex items-start justify-between">
        <p className="font-medium text-codium">{route.truckPlate}</p>
        {live && (
          <span
            className="flex items-center gap-1 text-[10px] font-medium text-bistre"
            title="Обновляется в реальном времени"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-peach" />
            онлайн
          </span>
        )}
      </div>
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
          <ConfirmRecyclingButton onConfirm={handleConfirm} />
        </div>
      )}

      <button
        type="button"
        onClick={() => setPassportOpen(true)}
        className="mt-3 text-xs font-medium text-bistre underline hover:text-codium"
      >
        Цифровой паспорт →
      </button>

      {passportOpen && (
        <RoutePassport
          truckPlate={route.truckPlate}
          cargoType={route.cargoType}
          originName={originName}
          destinationName={destinationName}
          startedAt={route.startedAt}
          status={status}
          confirmedAt={confirmedAt}
          confirmationNote={confirmationNote}
          trail={trail}
          onClose={() => setPassportOpen(false)}
        />
      )}
    </li>
  );
}
