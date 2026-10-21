import { describe, it, expect } from "vitest";
import {
  costPerKmCents, fuelCostCents, targetCents, activeSeconds, allocateForDay, totalMeters, parseBR,
  type FixedCost,
} from "./finance";

describe("finance", () => {
  it("R$6,70 / 50 km/L = R$0,134/km", () => expect(costPerKmCents(670, 50)).toBeCloseTo(13.4));
  it("10 km costs R$1,34", () => expect(fuelCostCents(10000, 670, 50)).toBe(134));
  it("R$15 - R$1,34 = R$13,66", () => expect(1500 - fuelCostCents(totalMeters(2000, 8000), 670, 50)!).toBe(1366));
  it("missing distance yields no fuel cost", () => expect(fuelCostCents(totalMeters(null, 8000), 670, 50)).toBeNull());
  it.each([[1800, 1500], [3600, 3000], [5400, 4500], [7200, 6000]])("target for %is = %i", (s, c) =>
    expect(targetCents(3000, s)).toBe(c));
  it("surplus not duplicated", () => {
    expect(3800 - targetCents(3000, 3600)).toBe(800);
    expect(6300 - targetCents(3000, 7200)).toBe(300);
  });
  it("paused periods don't count", () => {
    const segs = [{ start: 0, end: 1800_000 }, { start: 3600_000, end: 5400_000 }];
    expect(activeSeconds(segs, 9_999_999)).toBe(3600);
  });
  it("open segment rebuilt from timestamps", () => expect(activeSeconds([{ start: 0, end: null }], 60_000)).toBe(60));

  const rent: FixedCost = { id: "1", name: "Aluguel", amountCents: 2750, frequency: "daily", dailyRule: "calendar", startDate: "2026-01-01", endDate: null, isActive: true };
  it("daily calendar rule charges every day", () => expect(allocateForDay(rent, "2026-02-01", false)).toBe(2750));
  it("daily operation rule only on operated days", () => {
    const r = { ...rent, dailyRule: "operation" as const };
    expect(allocateForDay(r, "2026-02-01", false)).toBe(0);
    expect(allocateForDay(r, "2026-02-01", true)).toBe(2750);
  });
  it("not charged before start", () => expect(allocateForDay(rent, "2025-12-31", true)).toBe(0));
  it("inactive not charged", () => expect(allocateForDay({ ...rent, isActive: false }, "2026-02-01", true)).toBe(0));
  it("weekly divided by 7", () => expect(allocateForDay({ ...rent, frequency: "weekly", amountCents: 7000 }, "2026-02-01", true)).toBe(1000));
  it("financial result example", () => expect(18000 - 2010 - 2750 - 500).toBe(12740));
  it("parses BR numbers", () => {
    expect(parseBR("R$ 12,50")).toBe(12.5);
    expect(parseBR("3,2 km")).toBe(3.2);
  });
});
