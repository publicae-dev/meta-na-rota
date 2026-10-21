// Temporary local store (visual phase). Will be replaced by Lovable Cloud persistence.
import { useSyncExternalStore } from "react";
import type { FixedCost, Platform, Segment } from "./finance";

export interface Settings {
  targetPerHourCents: number;
  kmPerLiter: number;
  fuelPriceCents: number;
  uberEnabled: boolean;
  popEnabled: boolean;
}
export interface Session {
  id: string;
  segments: Segment[];
  status: "running" | "paused" | "ended";
  startedAt: number;
  endedAt: number | null;
}
export interface Ride {
  id: string;
  sessionId: string | null;
  platform: Platform;
  grossCents: number;
  pickupMeters: number | null;
  passengerMeters: number | null;
  completedAt: number;
  durationSec: number | null;
  notes?: string;
  source: "manual" | "print";
  imageDataUrl?: string;
}
interface State {
  settings: Settings;
  sessions: Session[];
  rides: Ride[];
  costs: FixedCost[];
}

const KEY = "metamoto-v1";
const today = () => new Date().toISOString().slice(0, 10);
const initial = (): State => ({
  settings: { targetPerHourCents: 3000, kmPerLiter: 50, fuelPriceCents: 670, uberEnabled: true, popEnabled: true },
  sessions: [],
  rides: [],
  costs: [
    { id: crypto.randomUUID(), name: "Aluguel da moto", amountCents: 2750, frequency: "daily", dailyRule: "calendar", startDate: today(), endDate: null, isActive: true },
  ],
});

let state: State | null = null;
const listeners = new Set<() => void>();
const SERVER: State = { settings: { targetPerHourCents: 3000, kmPerLiter: 50, fuelPriceCents: 670, uberEnabled: true, popEnabled: true }, sessions: [], rides: [], costs: [] };

function load(): State {
  if (state) return state;
  try {
    const raw = localStorage.getItem(KEY);
    state = raw ? JSON.parse(raw) : initial();
  } catch {
    state = initial();
  }
  return state!;
}
function set(fn: (s: State) => State) {
  state = fn(load());
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((l) => l());
}

export function useStore() {
  return useSyncExternalStore(
    (l) => (listeners.add(l), () => listeners.delete(l)),
    load,
    () => SERVER,
  );
}

const now = () => Date.now();
export const actions = {
  startSession() {
    set((s) => {
      if (s.sessions.some((x) => x.status !== "ended")) return s;
      const t = now();
      return { ...s, sessions: [...s.sessions, { id: crypto.randomUUID(), segments: [{ start: t, end: null }], status: "running", startedAt: t, endedAt: null }] };
    });
  },
  pause() {
    set((s) => ({ ...s, sessions: s.sessions.map((x) => x.status === "running" ? { ...x, status: "paused", segments: x.segments.map((g) => g.end == null ? { ...g, end: now() } : g) } : x) }));
  },
  resume() {
    set((s) => ({ ...s, sessions: s.sessions.map((x) => x.status === "paused" ? { ...x, status: "running", segments: [...x.segments, { start: now(), end: null }] } : x) }));
  },
  end() {
    set((s) => ({ ...s, sessions: s.sessions.map((x) => x.status !== "ended" ? { ...x, status: "ended", endedAt: now(), segments: x.segments.map((g) => g.end == null ? { ...g, end: now() } : g) } : x) }));
  },
  saveRide(r: Omit<Ride, "id"> & { id?: string }) {
    set((s) => r.id
      ? { ...s, rides: s.rides.map((x) => (x.id === r.id ? { ...x, ...r, id: x.id } : x)) }
      : { ...s, rides: [...s.rides, { ...r, id: crypto.randomUUID() }] });
  },
  deleteRide(id: string) { set((s) => ({ ...s, rides: s.rides.filter((r) => r.id !== id) })); },
  saveCost(c: FixedCost) {
    set((s) => ({ ...s, costs: s.costs.some((x) => x.id === c.id) ? s.costs.map((x) => (x.id === c.id ? c : x)) : [...s.costs, c] }));
  },
  deleteCost(id: string) { set((s) => ({ ...s, costs: s.costs.filter((c) => c.id !== id) })); },
  updateSettings(p: Partial<Settings>) { set((s) => ({ ...s, settings: { ...s.settings, ...p } })); },
  exportJson() { return JSON.stringify(load(), null, 2); },
  reset() { set(() => initial()); },
};
