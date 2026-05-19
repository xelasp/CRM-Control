import { useState } from "react";
import { cn } from "@/lib/utils";
import { KanbanCard } from "./KanbanCard";
import type { Cliente, Etapa } from "@/types/kanban";

const ETAPA_COLORS: Record<Etapa, string> = {
  Lead: "border-t-blue-400",
  Contato: "border-t-yellow-400",
  Proposta: "border-t-purple-400",
  Fechado: "border-t-green-500",
  Perdido: "border-t-red-400",
};

interface KanbanColumnProps {
  etapa: Etapa;
  clientes: Cliente[];
  onEditar: (cliente: Cliente) => void;
  onDeletar: (id: string) => void;
  onInteracaoRapida: (id: string) => void;
  onDragStart: (id: string) => void;
  onDrop: (etapa: Etapa) => void;
}

export function KanbanColumn({
  etapa,
  clientes,
  onEditar,
  onDeletar,
  onInteracaoRapida,
  onDragStart,
  onDrop,
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <div
      className={cn(
        "bg-gray-50 rounded-xl border-t-4 p-3 min-w-[240px] w-[260px] flex flex-col gap-2",
        "transition-all duration-150",
        ETAPA_COLORS[etapa],
        isDragOver && "ring-2 ring-primary ring-offset-2 bg-blue-50"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={() => {
        setIsDragOver(false);
        onDrop(etapa);
      }}
    >
      {/* Column header */}
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-semibold text-sm text-gray-700">{etapa}</h2>
        <span className="text-xs bg-gray-200 text-gray-600 rounded-full px-2 py-0.5">
          {clientes.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2 flex-1 min-h-[60px]">
        {clientes.map((c) => (
          <KanbanCard
            key={c.id}
            cliente={c}
            onEditar={onEditar}
            onDeletar={onDeletar}
            onInteracaoRapida={onInteracaoRapida}
            onDragStart={onDragStart}
          />
        ))}

        {clientes.length === 0 && (
          <div className="text-xs text-gray-400 text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
            Solte aqui
          </div>
        )}
      </div>
    </div>
  );
}
