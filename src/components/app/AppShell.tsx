import { Link, useLocation } from "@tanstack/react-router";
import { BarChart3, Gauge, History, Plus, Timer, Settings, Wallet } from "lucide-react";
import type { ReactNode } from "react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Painel", icon: Gauge },
  { to: "/jornada", label: "Jornada", icon: Timer },
  { to: "/registrar", label: "Corrida", icon: Plus, main: true },
  { to: "/historico", label: "Histórico", icon: History },
  { to: "/relatorios", label: "Relatórios", icon: BarChart3 },
] as const;

export function AppShell({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  const { pathname } = useLocation();
  const { sessions } = useStore();
  const open = sessions.find((s) => s.status !== "ended");
  return (
    <div className="mx-auto min-h-screen max-w-xl pb-32">
      <header className="pt-safe sticky top-0 z-20 flex items-center justify-between bg-background/85 px-5 pb-3 backdrop-blur-xl">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">MetaMoto</p>
          <h1 className="text-2xl font-semibold">{title}</h1>
        </div>
        <div className="flex items-center gap-2">
          {action}
          <Link to="/custos" aria-label="Custos fixos" className="grid size-10 place-items-center rounded-full bg-card text-muted-foreground"><Wallet className="size-5" /></Link>
          <Link to="/configuracoes" aria-label="Configurações" className="grid size-10 place-items-center rounded-full bg-card text-muted-foreground"><Settings className="size-5" /></Link>
        </div>
      </header>
      <main className="space-y-4 px-5">{children}</main>
      <nav className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t bg-background/90 backdrop-blur-xl">
        <ul className="mx-auto grid max-w-xl grid-cols-5 px-2 pt-2">
          {items.map(({ to, label, icon: Icon, ...rest }) => {
            const active = pathname === to;
            const main = "main" in rest;
            return (
              <li key={to}>
                <Link to={to} className={cn("flex flex-col items-center gap-1 py-1 text-[11px]", active ? "text-foreground" : "text-muted-foreground")}>
                  {main ? (
                    <span className="-mt-6 grid size-14 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20"><Icon className="size-7" /></span>
                  ) : (
                    <span className="relative">
                      <Icon className="size-6" />
                      {to === "/jornada" && open && (
                        <span className={cn("absolute -right-1 -top-1 size-2.5 rounded-full", open.status === "running" ? "bg-positive animate-pulse" : "bg-warning")} />
                      )}
                    </span>
                  )}
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export function Stat({ label, value, tone, hint }: { label: string; value: string; tone?: "pos" | "neg" | "warn" | undefined; hint?: string | undefined }) {
  return (
    <div className="rounded-2xl bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn("num mt-1 text-lg font-semibold", tone === "pos" && "text-positive", tone === "neg" && "text-destructive", tone === "warn" && "text-warning")}>{value}</p>
      {hint && <p className="mt-0.5 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function Empty({ icon: Icon, title, text, children }: { icon: typeof Gauge; title: string; text: string; children?: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed p-8 text-center">
      <Icon className="mx-auto size-8 text-muted-foreground" />
      <p className="mt-3 font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{text}</p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

export const PlatformBadge = ({ p }: { p: "uber" | "99pop" }) => (
  <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase", p === "uber" ? "bg-uber text-background" : "bg-pop text-background")}>
    {p === "uber" ? "Uber" : "99"}
  </span>
);
