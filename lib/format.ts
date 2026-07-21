// HH:MM from an ISO timestamp without pulling in a timezone lib — takes the
// wall-clock time as stored.
export function formatTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const m = iso.match(/T(\d{2}:\d{2})/);
  return m ? m[1] : "—";
}
