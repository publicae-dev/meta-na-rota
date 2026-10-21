import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { brl, costPerKmCents, parseBR } from "@/lib/finance";
import { actions, useStore } from "@/lib/store";

export const Route = createFileRoute("/configuracoes")({
  head: () => ({
    meta: [
      { title: "Configurações — MetaMoto" },
      { name: "description", content: "Ajuste meta por hora, consumo da moto, preço da gasolina e plataformas." },
      { property: "og:title", content: "Configurações — MetaMoto" },
      { property: "og:description", content: "Parâmetros editáveis do app." },
    ],
  }),
  component: Config,
});

function Config() {
  const { settings } = useStore();
  const [target, setTarget] = useState(String(settings.targetPerHourCents / 100).replace(".", ","));
  const [kml, setKml] = useState(String(settings.kmPerLiter).replace(".", ","));
  const [fuel, setFuel] = useState(String(settings.fuelPriceCents / 100).replace(".", ","));
  const t = parseBR(target), k = parseBR(kml), f = parseBR(fuel);
  const ok = t != null && t > 0 && k != null && k > 0 && k < 200 && f != null && f > 0 && f < 50;

  const save = () => {
    if (!ok) { toast.error("Valores inválidos"); return; }
    actions.updateSettings({ targetPerHourCents: Math.round(t! * 100), kmPerLiter: k!, fuelPriceCents: Math.round(f! * 100) });
    toast.success("Configurações salvas");
  };
  const exportData = () => {
    const blob = new Blob([actions.exportJson()], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "metamoto-historico.json"; a.click();
  };

  return (
    <AppShell title="Configurações">
      <Group title="Meta">
        <F label="Meta por hora após combustível (R$)" v={target} on={setTarget} />
      </Group>
      <Group title="Veículo e combustível">
        <div className="grid grid-cols-2 gap-3">
          <F label="Consumo (km/L)" v={kml} on={setKml} />
          <F label="Gasolina (R$/L)" v={fuel} on={setFuel} />
        </div>
        <p className="text-sm text-muted-foreground">Custo por km: <span className="num text-foreground">{ok ? `R$ ${(costPerKmCents(f! * 100, k!) / 100).toFixed(3).replace(".", ",")}` : "—"}</span></p>
      </Group>
      <Button size="lg" className="h-12 w-full rounded-2xl" disabled={!ok} onClick={save}>Salvar parâmetros</Button>

      <Group title="Plataformas">
        <div className="flex items-center justify-between"><span>Uber Moto</span><Switch checked={settings.uberEnabled} onCheckedChange={(v) => actions.updateSettings({ uberEnabled: v })} /></div>
        <div className="flex items-center justify-between"><span>99POP</span><Switch checked={settings.popEnabled} onCheckedChange={(v) => actions.updateSettings({ popEnabled: v })} /></div>
      </Group>

      <Group title="Custos">
        <Link to="/custos" className="flex items-center justify-between"><span>Gerenciar custos fixos</span><ChevronRight className="size-4 text-muted-foreground" /></Link>
      </Group>

      <Group title="Dados e privacidade">
        <button onClick={exportData} className="flex w-full items-center justify-between"><span>Exportar histórico</span><Download className="size-4 text-muted-foreground" /></button>
        <button onClick={() => { if (confirm("Apagar todos os dados deste aparelho?")) { actions.reset(); toast("Dados apagados"); } }} className="w-full text-left text-destructive">Apagar dados deste aparelho</button>
        <p className="text-xs text-muted-foreground">Nesta etapa os dados ficam salvos apenas neste aparelho. Meta atual: {brl(settings.targetPerHourCents)}/h.</p>
      </Group>
    </AppShell>
  );
}

const Group = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-3 rounded-3xl bg-card p-5"><h2 className="text-xs uppercase tracking-wider text-muted-foreground">{title}</h2>{children}</section>
);
const F = ({ label, v, on }: { label: string; v: string; on: (s: string) => void }) => (
  <div className="space-y-1.5"><Label className="text-xs">{label}</Label><Input inputMode="decimal" className="num h-12 rounded-xl bg-surface" value={v} onChange={(e) => on(e.target.value)} /></div>
);
