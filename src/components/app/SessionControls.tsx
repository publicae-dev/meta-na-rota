import { Pause, Play, Square } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { actions, type Session } from "@/lib/store";

export function SessionControls({ session }: { session?: Session }) {
  if (!session)
    return (
      <Button size="lg" className="h-14 w-full rounded-2xl text-base" onClick={() => { actions.startSession(); toast.success("Jornada iniciada"); }}>
        <Play className="size-5" /> Iniciar jornada
      </Button>
    );
  return (
    <div className="grid grid-cols-2 gap-3">
      {session.status === "running" ? (
        <Button size="lg" variant="secondary" className="h-14 rounded-2xl" onClick={() => { actions.pause(); toast("Jornada pausada"); }}>
          <Pause className="size-5" /> Pausar
        </Button>
      ) : (
        <Button size="lg" className="h-14 rounded-2xl" onClick={() => { actions.resume(); toast.success("Jornada retomada"); }}>
          <Play className="size-5" /> Retomar
        </Button>
      )}
      <Button size="lg" variant="destructive" className="h-14 rounded-2xl" onClick={() => { if (confirm("Encerrar a jornada?")) { actions.end(); toast("Jornada encerrada"); } }}>
        <Square className="size-5" /> Encerrar
      </Button>
    </div>
  );
}
