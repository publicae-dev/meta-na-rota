import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Camera, ImagePlus, PencilLine, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { brl, fuelCostCents, parseBR, totalMeters, type Platform } from "@/lib/finance";
import { actions, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/registrar")({
  validateSearch: z.object({ modo: z.enum(["print", "manual"]).optional(), id: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Registrar corrida — MetaMoto" },
      { name: "description", content: "Registre corridas da Uber Moto e 99POP por print ou manualmente." },
      { property: "og:title", content: "Registrar corrida — MetaMoto" },
      { property: "og:description", content: "Registro rápido de corridas com prévia de combustível." },
    ],
  }),
  component: Registrar,
});

function Registrar() {
  const { modo = "manual", id } = Route.useSearch();
  const st = useStore();
  const nav = useNavigate();
  const editing = id ? st.rides.find((r) => r.id === id) : undefined;
  const toStr = (n: number | null | undefined, div: number) => (n == null ? "" : String(n / div).replace(".", ","));

  const [mode, setMode] = useState(modo);
  const [platform, setPlatform] = useState<Platform>(editing?.platform ?? "uber");
  const [gross, setGross] = useState(toStr(editing?.grossCents, 100));
  const [pickup, setPickup] = useState(toStr(editing?.pickupMeters, 1000));
  const [passenger, setPassenger] = useState(toStr(editing?.passengerMeters, 1000));
  const [duration, setDuration] = useState(editing?.durationSec ? String(editing.durationSec / 60) : "");
  const [notes, setNotes] = useState(editing?.notes ?? "");
  const [image, setImage] = useState<string | undefined>(editing?.imageDataUrl);

  const grossC = gross ? Math.round((parseBR(gross) ?? NaN) * 100) : NaN;
  const pM = pickup ? Math.round((parseBR(pickup) ?? NaN) * 1000) : null;
  const sM = passenger ? Math.round((parseBR(passenger) ?? NaN) * 1000) : null;
  const meters = totalMeters(pM, sM);
  const fuel = fuelCostCents(meters, st.settings.fuelPriceCents, st.settings.kmPerLiter);
  const valid = Number.isFinite(grossC) && grossC > 0 && (pM == null || pM >= 0) && (sM == null || sM >= 0) && (meters == null || meters < 300_000);

  const onFile = (f?: File) => {
    if (!f) return;
    const r = new FileReader();
    r.onload = () => { setImage(String(r.result)); toast("Print carregado. Revise e preencha os campos."); };
    r.readAsDataURL(f);
  };

  const save = () => {
    if (!valid) return toast.error("Verifique o valor e as distâncias.");
    const open = st.sessions.find((s) => s.status !== "ended");
    actions.saveRide({
      id: editing?.id, sessionId: editing?.sessionId ?? open?.id ?? null, platform, grossCents: grossC,
      pickupMeters: pM, passengerMeters: sM, completedAt: editing?.completedAt ?? Date.now(),
      durationSec: duration ? Math.round(Number(duration.replace(",", ".")) * 60) : null,
      notes: notes.trim().slice(0, 500) || undefined, source: image ? "print" : "manual", imageDataUrl: image,
    });
    toast.success(editing ? "Corrida atualizada" : "Corrida registrada");
    nav({ to: editing ? "/historico" : "/" });
  };

  return (
    <AppShell title={editing ? "Editar corrida" : "Nova corrida"}>
      {!editing && (
        <div className="grid grid-cols-2 gap-1 rounded-2xl bg-card p-1">
          {(["print", "manual"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} className={cn("flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm", mode === m ? "bg-secondary font-medium" : "text-muted-foreground")}>
              {m === "print" ? <Camera className="size-4" /> : <PencilLine className="size-4" />}{m === "print" ? "Print" : "Manual"}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        {(["uber", "99pop"] as const).filter((p) => (p === "uber" ? st.settings.uberEnabled : st.settings.popEnabled)).map((p) => (
          <button key={p} onClick={() => setPlatform(p)} className={cn("rounded-2xl border-2 p-4 text-left transition", platform === p ? "border-primary bg-card" : "border-transparent bg-card/60")}>
            <p className="font-semibold">{p === "uber" ? "Uber Moto" : "99POP"}</p>
          </button>
        ))}
      </div>

      {mode === "print" && (
        <label className="flex cursor-pointer flex-col items-center gap-2 rounded-3xl border border-dashed bg-card p-6 text-center">
          {image ? <img src={image} alt="Print da corrida" className="max-h-64 rounded-xl" /> : <ImagePlus className="size-8 text-primary" />}
          <span className="text-sm font-medium">{image ? "Trocar print" : "Selecionar print da galeria"}</span>
          <span className="text-xs text-muted-foreground">A leitura automática (OCR) chega na próxima etapa. Por ora, revise e preencha.</span>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        </label>
      )}

      <section className="space-y-4 rounded-3xl bg-card p-5">
        <Field label="Valor bruto (R$)" value={gross} onChange={setGross} placeholder="15,00" big />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Até o passageiro (km)" value={pickup} onChange={setPickup} placeholder="2,0" />
          <Field label="Com passageiro (km)" value={passenger} onChange={setPassenger} placeholder="8,0" />
        </div>
        <Field label="Duração (min, opcional)" value={duration} onChange={setDuration} placeholder="18" />
        <div className="space-y-1.5">
          <Label>Observações</Label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={500} rows={2} />
        </div>
      </section>

      <section className="rounded-3xl bg-card p-5 text-sm">
        <h2 className="mb-3 font-medium">Prévia</h2>
        <Row k="Faturamento bruto" v={Number.isFinite(grossC) ? brl(grossC) : "—"} />
        <Row k="Distância total" v={meters == null ? "—" : `${(meters / 1000).toLocaleString("pt-BR")} km`} />
        <Row k="Combustível estimado" v={fuel == null ? "—" : brl(fuel)} />
        <Row k="Ganho após combustível" v={fuel == null || !Number.isFinite(grossC) ? "—" : brl(grossC - fuel)} strong />
        {meters == null && (
          <p className="mt-3 flex items-start gap-2 text-xs text-warning"><AlertTriangle className="size-4 shrink-0" />Sem as duas distâncias, a corrida fica marcada como incompleta e não recebe custo de combustível.</p>
        )}
      </section>

      <Button size="lg" className="h-14 w-full rounded-2xl text-base" disabled={!valid} onClick={save}>
        {editing ? "Salvar alterações" : "Confirmar corrida"}
      </Button>
    </AppShell>
  );
}

function Field({ label, value, onChange, placeholder, big }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; big?: boolean }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input inputMode="decimal" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={cn("num h-12 rounded-xl bg-surface", big && "h-14 text-2xl")} />
    </div>
  );
}
const Row = ({ k, v, strong }: { k: string; v: string; strong?: boolean }) => (
  <div className="flex justify-between py-1"><span className="text-muted-foreground">{k}</span><span className={cn("num", strong && "font-semibold text-positive")}>{v}</span></div>
);
