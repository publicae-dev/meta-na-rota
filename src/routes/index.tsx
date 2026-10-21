import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera, PencilLine } from "lucide-react";
import { AppShell, Stat } from "@/components/app/AppShell";
import { SessionControls } from "@/components/app/SessionControls";
import { useNow } from "@/hooks/use-now";
import { brl, fmtDuration, fmtKm, signedBrl, dailyEquivalent } from "@/lib/finance";
import { dayKey, summarize } from "@/lib/selectors";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Painel — MetaMoto" },
      { name: "description", content: "Painel de metas por hora para motoristas Uber Moto e 99POP." },
      { property: "og:title", content: "MetaMoto — Painel" },
      { property: "og:description", content: "Faturamento, combustível, meta por hora e custos fixos." },
    ],
  }),
  component: Dashboard,
});

const statusLabel = { running: "Em andamento", paused: "Pausada", ended: "Encerrada" } as const;

function Dashboard() {
  const st = useStore();
  const now = useNow();
  const open = st.sessions.find((s) => s.status !== "ended");
  const last = open ?? st.sessions.at(-1);
  const sum = summarize({ ...st, days: [dayKey(now)], now });
  const metaPct = sum.target > 0 ? Math.min(100, (sum.afterFuel / sum.target) * 100) : 0;
  const activeCosts = st.costs.filter((c) => c.isActive);

  return (
    <AppShell title="Painel">
      <section className="bg-hero rounded-3xl border p-5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Faturamento bruto hoje</span>
          <span className={cn("rounded-full px-2 py-0.5 font-medium", !last ? "bg-muted text-muted-foreground" : last.status === "running" ? "bg-positive/15 text-positive" : last.status === "paused" ? "bg-warning/15 text-warning" : "bg-muted text-muted-foreground")}>
            {last ? statusLabel[last.status] : "Não iniciada"}
          </span>
        </div>
        <p className="num mt-2 text-5xl font-semibold">{brl(sum.gross)}</p>
        <div className="mt-4 flex gap-4 text-sm text-muted-foreground">
          <span><b className="num text-foreground">{fmtDuration(sum.active)}</b> ativo</span>
          <span><b className="num text-foreground">{sum.count}</b> corridas</span>
          <span><b className="num text-foreground">{fmtKm(sum.meters)}</b></span>
        </div>
        <div className="mt-5">
          <SessionControls session={open} />
        </div>
      </section>

      <section className="rounded-3xl bg-card p-5">
        <div className="flex items-baseline justify-between">
          <h2 className="font-medium">Meta operacional</h2>
          <span className="text-xs text-muted-foreground">{brl(st.settings.targetPerHourCents)}/h após combustível</span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div><p className="text-xs text-muted-foreground">Ganho após combustível</p><p className="num text-xl font-semibold">{brl(sum.afterFuel)}</p></div>
          <div><p className="text-xs text-muted-foreground">Meta acumulada</p><p className="num text-xl font-semibold">{brl(sum.target)}</p></div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
          <div className={cn("h-full rounded-full transition-all", sum.balance >= 0 ? "bg-positive" : "bg-warning")} style={{ width: `${sum.target ? metaPct : 0}%` }} />
        </div>
        <p className={cn("num mt-3 text-sm font-medium", sum.balance >= 0 ? "text-positive" : "text-warning")}>
          {sum.balance >= 0 ? "▲ Acima da meta " : "▼ Faltam "}{sum.balance >= 0 ? signedBrl(sum.balance) : brl(-sum.balance)}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">Média: <span className="num">{brl(sum.perHour)}</span>/h ativa</p>
      </section>

      <div className="grid grid-cols-2 gap-3">
        <Link to="/registrar" search={{ modo: "print" }} className="flex items-center gap-3 rounded-2xl bg-card p-4"><Camera className="size-5 text-primary" /><span className="text-sm font-medium">Por print</span></Link>
        <Link to="/registrar" search={{ modo: "manual" }} className="flex items-center gap-3 rounded-2xl bg-card p-4"><PencilLine className="size-5 text-primary" /><span className="text-sm font-medium">Manual</span></Link>
      </div>

      <section className="grid grid-cols-2 gap-3">
        <Stat label="Combustível estimado" value={brl(sum.fuel)} hint={sum.incomplete ? `${sum.incomplete} corrida(s) sem distância` : undefined} tone={sum.incomplete ? "warn" : undefined} />
        <Stat label="Custos fixos do dia" value={brl(sum.fixed)} hint={`${activeCosts.length} ativos · ${brl(Math.round(activeCosts.reduce((a, c) => a + dailyEquivalent(c), 0)))}/dia`} />
      </section>

      <section className="rounded-3xl bg-card p-5">
        <p className="text-xs text-muted-foreground">Resultado após os custos registrados</p>
        <p className={cn("num mt-1 text-3xl font-semibold", sum.result >= 0 ? "text-positive" : "text-destructive")}>{brl(sum.result)}</p>
        <p className="mt-1 text-xs text-muted-foreground">Bruto − combustível − custos fixos apropriados. Pode haver despesas não cadastradas.</p>
      </section>

      <section className="grid grid-cols-2 gap-3">
        {(["uber", "99pop"] as const).map((p) => (
          <div key={p} className="rounded-2xl bg-card p-4">
            <p className="text-xs text-muted-foreground">{p === "uber" ? "Uber Moto" : "99POP"}</p>
            <p className="num mt-1 text-lg font-semibold">{brl(sum.byPlatform[p].gross)}</p>
            <p className="text-[11px] text-muted-foreground">{sum.byPlatform[p].count} corridas · comb. {brl(sum.byPlatform[p].fuel)}</p>
          </div>
        ))}
      </section>
    </AppShell>
  );
}
