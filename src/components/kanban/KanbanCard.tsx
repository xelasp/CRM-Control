import { MessageSquarePlus, Pencil, Trash2, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatarData, diasDesde } from "@/lib/formatters";
import type { Cliente } from "@/types/kanban";

interface KanbanCardProps {
  cliente: Cliente;
  onEditar: (cliente: Cliente) => void;
  onDeletar: (id: string) => void;
  onInteracaoRapida: (id: string) => void;
  onDragStart: (id: string) => void;
}

export function KanbanCard({
  cliente,
  onEditar,
  onDeletar,
  onInteracaoRapida,
  onDragStart,
}: KanbanCardProps) {
  const historico = cliente.historico ?? [];
  const ultimaInteracao =
    historico.length > 0 ? historico[historico.length - 1] : null;

  const parado = diasDesde(ultimaInteracao?.criado_em) > 2;

  return (
    <div
      draggable
      onDragStart={() => onDragStart(cliente.id)}
      className={cn(
        "rounded-lg border p-3 text-sm cursor-grab active:cursor-grabbing shadow-sm",
        "transition-all duration-150 hover:shadow-md",
        parado
          ? "bg-red-50 border-red-200"
          : "bg-white border-gray-200"
      )}
    >
      {/* Header */}
      <div className="flex justify-between items-start gap-2 mb-1">
        <span className="font-semibold text-gray-800 leading-tight">
          {cliente.nome}
        </span>
        <span className="text-[10px] text-gray-400 whitespace-nowrap shrink-0">
          {formatarData(cliente.criado_em)}
        </span>
      </div>

      {/* Phone & responsible */}
      <p className="text-gray-500 text-xs">{cliente.telefone}</p>
      {cliente.responsavel && (
        <p className="text-xs text-gray-400">{cliente.responsavel}</p>
      )}

      {/* Tags */}
      {cliente.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {cliente.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Last interaction */}
      {ultimaInteracao && (
        <div className="mt-2 border-t pt-2 border-gray-100">
          <p className="text-xs text-gray-500 italic line-clamp-2">
            "{ultimaInteracao.texto}"
          </p>
          <p className="text-[10px] text-gray-400 mt-0.5">
            {formatarData(ultimaInteracao.criado_em)}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="mt-3 flex gap-1 flex-wrap">
        <Button
          size="sm"
          variant="outline"
          className="h-6 text-[10px] px-2 gap-1"
          onClick={() => onInteracaoRapida(cliente.id)}
        >
          <MessageSquarePlus className="w-3 h-3" />
          Interação
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="h-6 text-[10px] px-2 gap-1"
          onClick={() => onEditar(cliente)}
        >
          <Pencil className="w-3 h-3" />
          Editar
        </Button>
        <Button
          size="sm"
          variant="destructive"
          className="h-6 text-[10px] px-2 gap-1"
          onClick={() => onDeletar(cliente.id)}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
        <Button
          size="sm"
          className="h-6 text-[10px] px-2 gap-1 bg-green-500 hover:bg-green-600"
          onClick={() => alert("Integrar com n8n aqui")}
        >
          <MessageCircle className="w-3 h-3" />
          WA
        </Button>
      </div>
    </div>
  );
}
