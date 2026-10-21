import { activeSeconds, allocateForDay, fuelCostCents, targetCents, totalMeters, type Platform } from "./finance";
import type { Ride, Session, Settings } from "./store";
import type { FixedCost } from "./finance";

export const dayKey = (t: number) => {
  const d = new Date(t);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export function rideCalc(r: Ride, s: Settings) {
  const meters = totalMeters(r.pickupMeters, r.passengerMeters);
  const fuel = fuelCostCents(meters, s.fuelPriceCents, s.kmPerLiter);
  return { meters, fuel, afterFuel: fuel == null ? null : r.grossCents - fuel, incomplete: fuel == null };
}

export function summarize(opts: {
  rides: Ride[]; sessions: Session[]; costs: FixedCost[]; settings: Settings; days: string[]; now: number;
}) {
  const { rides, sessions, costs, settings, days, now } = opts;
  const daySet = new Set(days);
  const rs = rides.filter((r) => daySet.has(dayKey(r.completedAt)));
  const ss = sessions.filter((x) => daySet.has(dayKey(x.startedAt)));
  const operated = new Set(ss.map((x) => dayKey(x.startedAt)));
  let gross = 0, fuel = 0, meters = 0, incomplete = 0;
  const byPlatform: Record<Platform, { gross: number; fuel: number; count: number }> = {
    uber: { gross: 0, fuel: 0, count: 0 }, "99pop": { gross: 0, fuel: 0, count: 0 },
  };
  for (const r of rs) {
    const c = rideCalc(r, settings);
    gross += r.grossCents;
    byPlatform[r.platform].gross += r.grossCents;
    byPlatform[r.platform].count++;
    if (c.fuel != null) { fuel += c.fuel; meters += c.meters!; byPlatform[r.platform].fuel += c.fuel; } else incomplete++;
  }
  const active = ss.reduce((a, x) => a + activeSeconds(x.segments, now), 0);
  const fixed = days.reduce((a, d) => a + costs.reduce((b, c) => b + allocateForDay(c, d, operated.has(d)), 0), 0);
  const afterFuel = gross - fuel;
  const target = targetCents(settings.targetPerHourCents, active);
  return {
    gross, fuel, afterFuel, fixed, result: afterFuel - fixed, active, target,
    balance: afterFuel - target, count: rs.length, meters, incomplete, byPlatform,
    perHour: active > 0 ? Math.round((afterFuel * 3600) / active) : 0,
  };
}

export function weekDays(ref = new Date()) {
  const d = new Date(ref);
  const dow = (d.getDay() + 6) % 7; // monday=0
  d.setDate(d.getDate() - dow);
  return Array.from({ length: 7 }, (_, i) => {
    const x = new Date(d); x.setDate(d.getDate() + i); return dayKey(x.getTime());
  });
}
