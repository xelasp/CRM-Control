import { useState } from "react";
import { Search, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KanbanColumn } from "./KanbanColumn";
import { ClienteModal } from "./ClienteModal";
import { useKanban } from "@/hooks/useKanban";
import { useOrganization } from "@/contexts/OrganizationContext";
import { inserirInteracao } from "@/services/historicoService";
import { ETAPAS } from "@/types/kanban";
import type { Cliente, Etapa } from "@/types/kanban";

export function KanbanBoard() {
  const { organization } = useOrganization();
  const { clientes, loading, erro, salvar, mover, deletar, recarregar } =
    useKanban(organization?.id);

  const [busca, setBusca] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  function abrirNovo() {
    setClienteEditando(null);
    setModalOpen(true);
  }

  function abrirEditar(cliente: Cliente) {
    setClienteEditando(cliente);
    setModalOpen(true);
  }

  async function handleDeletar(id: string) {
    if (!confirm("Deseja excluir este cliente?")) return;
    await deletar(id);
  }

  async function handleInteracaoRapida(id: string) {
    const texto = prompt("Digite a interação:");
    if (!texto?.trim()) return;
    await inserirInteracao(id, texto.trim());
    await recarregar();
  }

  async function handleDrop(etapa: Etapa) {
    if (!draggedId) return;
    await mover(draggedId, etapa);
    setDraggedId(null);
  }

  const clientesFiltrados = clientes.filter((c) =>
    c.nome.toLowerCase().includes(busca.toLowerCase())
  );

  if (!organization) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground text-sm">
        Nenhuma organização encontrada.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        Carregando...
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Erro: {erro}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Button onClick={abrirNovo} className="gap-2 shrink-0">
          <PlusCircle className="w-4 h-4" />
          Novo Cliente
        </Button>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar cliente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4">
        {ETAPAS.map((etapa) => (
          <KanbanColumn
            key={etapa}
            etapa={etapa}
            clientes={clientesFiltrados.filter((c) => c.etapa === etapa)}
            onEditar={abrirEditar}
            onDeletar={handleDeletar}
            onInteracaoRapida={handleInteracaoRapida}
            onDragStart={(id) => setDraggedId(id)}
            onDrop={handleDrop}
          />
        ))}
      </div>

      <ClienteModal
        open={modalOpen}
        cliente={clienteEditando}
        onClose={() => setModalOpen(false)}
        onSalvar={salvar}
      />
    </div>
  );
}
