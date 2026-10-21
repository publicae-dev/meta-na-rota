import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle, Copy, History, Pencil, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AppShell, Empty, PlatformBadge } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { brl, fmtKm } from "@/lib/finance";
import { dayKey, rideCalc } from "@/lib/selectors";
import { actions, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/historico")({
  head: () => ({
    meta: [
      { title: "Histórico — MetaMoto" },
      { name: "description", content: "Histórico de corridas com filtros, edição e detecção de duplicidades." },
      { property: "og:title", content: "Histórico — MetaMoto" },
      { property: "og:description", content: "Consulte e edite suas corridas." },
    ],
  }),
  component: Historico,
});

function Historico() {
  const st = useStore();
  const [plat, setPlat] = useState<"all" | "uber" | "99pop">("all");
  const [state, setState] = useState<"all" | "incomplete">("all");
  const rides = useMemo(() => [...st.rides].sort((a, b) => b.completedAt - a.completedAt)
    .filter((r) => plat === "all" || r.platform === plat)
    .filter((r) => state === "all" || rideCalc(r, st.settings).incomplete), [st, plat, state]);

  const dupes = new Set<string>();
  st.rides.forEach((a) => st.rides.forEach((b) => {
    if (a.id < b.id && a.platform === b.platform && a.grossCents === b.grossCents && Math.abs(a.completedAt - b.completedAt) < 10 * 60_000) { dupes.add(a.id); dupes.add(b.id); }
  }));

  const groups = rides.reduce<Record<string, typeof rides>>((g, r) => ((g[dayKey(r.completedAt)] ??= []).push(r), g), {});

  return (
    <AppShell title="Histórico">
      <div className="flex gap-2 overflow-x-auto">
        {([["all", "Todas"], ["uber", "Uber"], ["99pop", "99POP"]] as const).map(([v, l]) => (
          <Chip key={v} active={plat === v} onClick={() => setPlat(v)}>{l}</Chip>
        ))}
        <Chip active={state === "incomplete"} onClick={() => setState(state === "all" ? "incomplete" : "all")}>Incompletas</Chip>
      </div>

      {rides.length === 0 ? (
        <Empty icon={History} title="Nenhuma corrida" text="Registre sua primeira corrida para vê-la aqui.">
          <Button asChild><Link to="/registrar">Registrar corrida</Link></Button>
        </Empty>
      ) : Object.entries(groups).map(([day, list]) => (
        <section key={day}>
          <p className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">{new Date(day + "T12:00").toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "short" })}</p>
          <ul className="space-y-2">
            {list.map((r) => {
              const c = rideCalc(r, st.settings);
              return (
                <li key={r.id} className="rounded-2xl bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PlatformBadge p={r.platform} />
                      <span className="text-sm text-muted-foreground">{new Date(r.completedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
                      {c.incomplete && <span className="flex items-center gap-1 text-[11px] text-warning"><AlertTriangle className="size-3" />Incompleta</span>}
                      {dupes.has(r.id) && <span className="flex items-center gap-1 text-[11px] text-warning"><Copy className="size-3" />Possível duplicada</span>}
                    </div>
                    <span className="num font-semibold">{brl(r.grossCents)}</span>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] text-muted-foreground">
                    <span>Total <b className="num text-foreground">{fmtKm(c.meters)}</b></span>
                    <span>Comb. <b className="num text-foreground">{c.fuel == null ? "—" : brl(c.fuel)}</b></span>
                    <span>Líq. <b className="num text-positive">{c.afterFuel == null ? "—" : brl(c.afterFuel)}</b></span>
                  </div>
                  <div className="mt-3 flex justify-end gap-2">
                    <Button asChild size="sm" variant="secondary"><Link to="/registrar" search={{ id: r.id }}><Pencil className="size-3.5" />{c.incomplete ? "Completar" : "Editar"}</Link></Button>
                    <Button size="sm" variant="ghost" aria-label="Excluir" onClick={() => { if (confirm("Excluir esta corrida?")) { actions.deleteRide(r.id); toast("Corrida excluída"); } }}><Trash2 className="size-3.5" /></Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </AppShell>
  );
}

const Chip = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button onClick={onClick} className={cn("shrink-0 rounded-full px-4 py-2 text-sm", active ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground")}>{children}</button>
);
