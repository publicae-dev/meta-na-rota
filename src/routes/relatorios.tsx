import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { AppShell, Stat } from "@/components/app/AppShell";
import { useNow } from "@/hooks/use-now";
import { brl, fmtDuration, fmtKm, signedBrl } from "@/lib/finance";
import { dayKey, summarize, weekDays } from "@/lib/selectors";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/relatorios")({
  head: () => ({
    meta: [
      { title: "Relatórios — MetaMoto" },
      { name: "description", content: "Relatórios diários e semanais com comparação Uber Moto x 99POP." },
      { property: "og:title", content: "Relatórios — MetaMoto" },
      { property: "og:description", content: "Gráficos de faturamento, meta e resultado." },
    ],
  }),
  component: Relatorios,
});

function Relatorios() {
  const st = useStore();
  const now = useNow(30000);
  const [period, setPeriod] = useState<"dia" | "semana">("semana");
  const days = period === "dia" ? [dayKey(now)] : weekDays(new Date(now));
  const s = summarize({ ...st, days, now });
  const chart = weekDays(new Date(now)).map((d) => {
    const x = summarize({ ...st, days: [d], now });
    return { dia: new Date(d + "T12:00").toLocaleDateString("pt-BR", { weekday: "short" }).slice(0, 3), Bruto: x.gross / 100, "Após comb.": x.afterFuel / 100, "Após custos": x.result / 100, Meta: x.target / 100 };
  });

  return (
    <AppShell title="Relatórios">
      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-card p-1">
        {(["dia", "semana"] as const).map((p) => (
          <button key={p} onClick={() => setPeriod(p)} className={cn("rounded-xl py-2.5 text-sm capitalize", period === p ? "bg-secondary font-medium" : "text-muted-foreground")}>{p === "dia" ? "Hoje" : "Semana (seg–dom)"}</button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Stat label="Faturamento bruto" value={brl(s.gross)} />
        <Stat label="Combustível" value={brl(s.fuel)} hint={s.incomplete ? `${s.incomplete} incompleta(s) fora do cálculo` : "estimado"} />
        <Stat label="Após combustível" value={brl(s.afterFuel)} tone="pos" />
        <Stat label="Custos fixos" value={brl(s.fixed)} />
        <Stat label="Após custos registrados" value={brl(s.result)} tone={s.result >= 0 ? "pos" : "neg"} />
        <Stat label="Saldo da meta" value={signedBrl(s.balance)} tone={s.balance >= 0 ? "pos" : "warn"} hint={`Meta ${brl(s.target)}`} />
        <Stat label="Tempo ativo" value={fmtDuration(s.active)} />
        <Stat label="Média/h ativa" value={brl(s.perHour)} />
        <Stat label="Corridas" value={String(s.count)} />
        <Stat label="Quilometragem" value={fmtKm(s.meters)} />
      </div>

      <section className="rounded-3xl bg-card p-4">
        <h2 className="mb-3 px-1 font-medium">Semana</h2>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={chart}>
              <CartesianGrid stroke="var(--border)" vertical={false} />
              <XAxis dataKey="dia" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} width={36} />
              <Tooltip contentStyle={{ background: "var(--popover)", border: "none", borderRadius: 12 }} formatter={(v: number) => brl(Math.round(v * 100))} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Bruto" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Após comb." fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Após custos" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Meta" fill="var(--muted-foreground)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-3xl bg-card p-5">
        <h2 className="mb-3 font-medium">Uber Moto × 99POP</h2>
        {(["uber", "99pop"] as const).map((p) => {
          const b = s.byPlatform[p];
          const pct = s.gross ? (b.gross / s.gross) * 100 : 0;
          return (
            <div key={p} className="mb-3">
              <div className="flex justify-between text-sm"><span>{p === "uber" ? "Uber Moto" : "99POP"} · {b.count}</span><span className="num">{brl(b.gross)}</span></div>
              <div className="mt-1 h-2 rounded-full bg-muted"><div className={cn("h-full rounded-full", p === "uber" ? "bg-uber" : "bg-pop")} style={{ width: `${pct}%` }} /></div>
              <p className="mt-1 text-[11px] text-muted-foreground">Após combustível {brl(b.gross - b.fuel)}</p>
            </div>
          );
        })}
      </section>
    </AppShell>
  );
}
