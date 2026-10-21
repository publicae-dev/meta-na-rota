import { createFileRoute } from "@tanstack/react-router";
import { Timer } from "lucide-react";
import { AppShell, Empty, Stat } from "@/components/app/AppShell";
import { SessionControls } from "@/components/app/SessionControls";
import { useNow } from "@/hooks/use-now";
import { activeSeconds, brl, fmtDuration, targetCents } from "@/lib/finance";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/jornada")({
  head: () => ({
    meta: [
      { title: "Jornada — MetaMoto" },
      { name: "description", content: "Inicie, pause, retome e encerre sua jornada de trabalho." },
      { property: "og:title", content: "Jornada — MetaMoto" },
      { property: "og:description", content: "Timer de jornada baseado em horários salvos." },
    ],
  }),
  component: Jornada,
});

const t = (ms: number) => new Date(ms).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

function Jornada() {
  const { sessions, settings } = useStore();
  const now = useNow();
  const open = sessions.find((s) => s.status !== "ended");
  const active = open ? activeSeconds(open.segments, now) : 0;
  const total = open ? Math.floor((now - open.startedAt) / 1000) : 0;
  const past = sessions.filter((s) => s.status === "ended").slice(-10).reverse();

  return (
    <AppShell title="Jornada">
      <section className="bg-hero rounded-3xl border p-6 text-center">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">Tempo ativo</p>
        <p className="num mt-2 text-6xl font-semibold">{fmtDuration(active)}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {open ? (open.status === "running" ? "Em andamento · espera conta como ativo" : "Pausada · tempo não está contando") : "Nenhuma jornada aberta"}
        </p>
        <div className="mt-6"><SessionControls session={open} /></div>
      </section>

      {open && (
        <>
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Início" value={t(open.startedAt)} />
            <Stat label="Pausado" value={fmtDuration(Math.max(0, total - active))} />
            <Stat label="Meta" value={brl(targetCents(settings.targetPerHourCents, active))} />
          </div>
          <section className="rounded-3xl bg-card p-5">
            <h2 className="mb-3 font-medium">Segmentos ativos</h2>
            <ul className="space-y-2 text-sm">
              {open.segments.map((s, i) => (
                <li key={i} className="flex justify-between">
                  <span className="text-muted-foreground">#{i + 1} · {t(s.start)} → {s.end ? t(s.end) : "agora"}</span>
                  <span className="num">{fmtDuration(Math.floor(((s.end ?? now) - s.start) / 1000))}</span>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      <h2 className="pt-2 font-medium">Jornadas anteriores</h2>
      {past.length === 0 ? (
        <Empty icon={Timer} title="Sem jornadas encerradas" text="As jornadas encerradas aparecem aqui." />
      ) : (
        <ul className="space-y-2">
          {past.map((s) => (
            <li key={s.id} className="flex justify-between rounded-2xl bg-card p-4 text-sm">
              <span>{new Date(s.startedAt).toLocaleDateString("pt-BR")} · {t(s.startedAt)}–{s.endedAt ? t(s.endedAt) : ""}</span>
              <span className="num">{fmtDuration(activeSeconds(s.segments, now))}</span>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
