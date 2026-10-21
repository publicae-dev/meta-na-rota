// Pure, testable financial functions. Money is always integer cents.

export type Platform = "uber" | "99pop";
export type Frequency = "daily" | "weekly" | "monthly";
export type DailyRule = "calendar" | "operation";

export const costPerKmCents = (fuelPriceCents: number, kmPerLiter: number) =>
  kmPerLiter > 0 ? fuelPriceCents / kmPerLiter : 0;

export function fuelCostCents(
  totalMeters: number | null,
  fuelPriceCents: number,
  kmPerLiter: number,
): number | null {
  if (totalMeters == null || totalMeters < 0) return null;
  return Math.round((totalMeters / 1000) * costPerKmCents(fuelPriceCents, kmPerLiter));
}

export function totalMeters(pickup: number | null, passenger: number | null): number | null {
  if (pickup == null || passenger == null) return null;
  return pickup + passenger;
}

export const targetCents = (targetPerHourCents: number, activeSeconds: number) =>
  Math.round((targetPerHourCents * activeSeconds) / 3600);

export interface Segment {
  start: number;
  end: number | null;
}

export function activeSeconds(segments: Segment[], now: number): number {
  return Math.floor(
    segments.reduce((acc, s) => acc + Math.max(0, (s.end ?? now) - s.start), 0) / 1000,
  );
}

export interface FixedCost {
  id: string;
  name: string;
  amountCents: number;
  frequency: Frequency;
  dailyRule: DailyRule;
  startDate: string; // yyyy-mm-dd
  endDate: string | null;
  isActive: boolean;
  notes?: string | undefined;
}

const daysInMonth = (d: string) => {
  const [y, m] = d.split("-").map(Number);
  return new Date(y, m, 0).getDate();
};

/** Cost allocated to a single day (yyyy-mm-dd). Weekly = /7, monthly = /days in that month. */
export function allocateForDay(cost: FixedCost, day: string, operated: boolean): number {
  if (!cost.isActive) return 0;
  if (day < cost.startDate) return 0;
  if (cost.endDate && day > cost.endDate) return 0;
  if (cost.frequency === "daily") {
    if (cost.dailyRule === "operation" && !operated) return 0;
    return cost.amountCents;
  }
  if (cost.frequency === "weekly") return Math.round(cost.amountCents / 7);
  return Math.round(cost.amountCents / daysInMonth(day));
}

export const dailyEquivalent = (c: FixedCost) =>
  c.frequency === "daily" ? c.amountCents : c.frequency === "weekly" ? c.amountCents / 7 : (c.amountCents * 12) / 365;

export const brl = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const signedBrl = (cents: number) => (cents > 0 ? "+" : "") + brl(cents);

export const fmtDuration = (sec: number) => {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

export const fmtKm = (meters: number | null) =>
  meters == null ? "—" : `${(meters / 1000).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} km`;

/** Parses Brazilian numbers like "R$ 12,50", "3,2 km". */
export function parseBR(input: string): number | null {
  const cleaned = input.replace(/[^\d,.-]/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", ".");
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}
