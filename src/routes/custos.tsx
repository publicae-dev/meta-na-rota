import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, Trash2, Wallet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { AppShell, Empty, Stat } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { brl, dailyEquivalent, parseBR, type FixedCost, type Frequency } from "@/lib/finance";
import { actions, useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/custos")({
  head: () => ({
    meta: [
      { title: "Custos fixos — MetaMoto" },
      { name: "description", content: "Cadastre aluguel da moto, internet e outros custos fixos." },
      { property: "og:title", content: "Custos fixos — MetaMoto" },
      { property: "og:description", content: "Gerencie custos fixos com frequência e vigência." },
    ],
  }),
  component: Custos,
});

const freqLabel: Record<Frequency, string> = { daily: "Diária", weekly: "Semanal", monthly: "Mensal" };
const schema = z.object({ name: z.string().trim().min(1, "Informe o nome").max(80), amountCents: z.number().int().positive("Valor inválido") });

function Custos() {
  const { costs } = useStore();
  const [q, setQ] = useState("");
  const [freq, setFreq] = useState<Frequency | "all">("all");
  const [editing, setEditing] = useState<FixedCost | null>(null);
  const list = costs.filter((c) => c.name.toLowerCase().includes(q.toLowerCase()) && (freq === "all" || c.frequency === freq));
  const daily = costs.filter((c) => c.isActive).reduce((a, c) => a + dailyEquivalent(c), 0);

  const blank = (): FixedCost => ({ id: crypto.randomUUID(), name: "", amountCents: 0, frequency: "monthly", dailyRule: "calendar", startDate: new Date().toISOString().slice(0, 10), endDate: null, isActive: true });

  return (
    <AppShell title="Custos fixos" action={<Button size="icon" className="rounded-full" aria-label="Adicionar custo" onClick={() => setEditing(blank())}><Plus /></Button>}>
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Por dia" value={brl(Math.round(daily))} />
        <Stat label="Por semana" value={brl(Math.round(daily * 7))} />
        <Stat label="Por mês" value={brl(Math.round((daily * 365) / 12))} />
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-3.5 size-4 text-muted-foreground" />
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Pesquisar despesa" className="h-11 rounded-xl bg-card pl-9" />
      </div>
      <div className="flex gap-2 overflow-x-auto">
        {(["all", "daily", "weekly", "monthly"] as const).map((f) => (
          <button key={f} onClick={() => setFreq(f)} className={cn("shrink-0 rounded-full px-4 py-2 text-sm", freq === f ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground")}>{f === "all" ? "Todas" : freqLabel[f]}</button>
        ))}
      </div>

      {list.length === 0 ? <Empty icon={Wallet} title="Nenhum custo" text="Adicione custos como aluguel, internet ou plano de celular." /> : (
        <ul className="space-y-2">
          {list.map((c) => (
            <li key={c.id} className={cn("flex items-center gap-3 rounded-2xl bg-card p-4", !c.isActive && "opacity-55")}>
              <button className="flex-1 text-left" onClick={() => setEditing(c)}>
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-muted-foreground">{freqLabel[c.frequency]}{c.frequency === "daily" && ` · ${c.dailyRule === "calendar" ? "dia corrido" : "dia de operação"}`} · desde {new Date(c.startDate + "T12:00").toLocaleDateString("pt-BR")}</p>
              </button>
              <span className="num font-semibold">{brl(c.amountCents)}</span>
              <Switch checked={c.isActive} aria-label="Ativo" onCheckedChange={(v) => actions.saveCost({ ...c, isActive: v })} />
            </li>
          ))}
        </ul>
      )}

      <CostDialog cost={editing} onClose={() => setEditing(null)} isNew={!!editing && !costs.some((c) => c.id === editing.id)} />
    </AppShell>
  );
}

function CostDialog({ cost, onClose, isNew }: { cost: FixedCost | null; onClose: () => void; isNew: boolean }) {
  const [form, setForm] = useState<FixedCost | null>(null);
  const [amount, setAmount] = useState("");
  const f = form?.id === cost?.id ? form : cost;
  if (cost && form?.id !== cost.id) { setForm(cost); setAmount(cost.amountCents ? String(cost.amountCents / 100).replace(".", ",") : ""); }
  if (!f) return null;
  const up = (p: Partial<FixedCost>) => setForm({ ...f, ...p });

  const save = () => {
    const amountCents = Math.round((parseBR(amount) ?? 0) * 100);
    const r = schema.safeParse({ name: f.name, amountCents });
    if (!r.success) { toast.error(r.error.issues[0]?.message ?? "Inválido"); return; }
    if (f.endDate && f.endDate < f.startDate) { toast.error("Data final antes do início"); return; }
    actions.saveCost({ ...f, name: r.data.name, amountCents });
    toast.success("Custo salvo"); onClose();
  };

  return (
    <Dialog open={!!cost} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="rounded-3xl">
        <DialogHeader><DialogTitle>{isNew ? "Novo custo" : "Editar custo"}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5"><Label>Nome</Label><Input value={f.name} maxLength={80} onChange={(e) => up({ name: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Valor (R$)</Label><Input inputMode="decimal" className="num" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
          <div className="space-y-1.5">
            <Label>Frequência</Label>
            <div className="grid grid-cols-3 gap-2">
              {(["daily", "weekly", "monthly"] as const).map((x) => (
                <button key={x} onClick={() => up({ frequency: x })} className={cn("rounded-xl py-2 text-sm", f.frequency === x ? "bg-primary text-primary-foreground" : "bg-secondary")}>{freqLabel[x]}</button>
              ))}
            </div>
          </div>
          {f.frequency === "daily" && (
            <div className="space-y-1.5">
              <Label>Cobrança</Label>
              <div className="grid grid-cols-2 gap-2">
                {(["calendar", "operation"] as const).map((x) => (
                  <button key={x} onClick={() => up({ dailyRule: x })} className={cn("rounded-xl py-2 text-sm", f.dailyRule === x ? "bg-primary text-primary-foreground" : "bg-secondary")}>{x === "calendar" ? "Todo dia corrido" : "Só dia trabalhado"}</button>
                ))}
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Início</Label><Input type="date" value={f.startDate} onChange={(e) => up({ startDate: e.target.value })} /></div>
            <div className="space-y-1.5"><Label>Fim (opcional)</Label><Input type="date" value={f.endDate ?? ""} onChange={(e) => up({ endDate: e.target.value || null })} /></div>
          </div>
          <div className="flex gap-2 pt-2">
            {!isNew && <Button variant="ghost" aria-label="Excluir" onClick={() => { if (confirm("Excluir este custo?")) { actions.deleteCost(f.id); onClose(); } }}><Trash2 /></Button>}
            <Button className="flex-1" onClick={save}>Salvar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
