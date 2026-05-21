import { useState, useEffect, useCallback } from "react";
import type { Cliente, Etapa } from "@/types/kanban";
import {
  fetchClientes,
  criarCliente,
  atualizarCliente,
  moverEtapa,
  deletarCliente,
} from "@/services/kanbanService";
import { inserirInteracoes } from "@/services/historicoService";

export function useKanban(orgId: string | undefined) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    if (!orgId) return;
    try {
      setErro(null);
      const dados = await fetchClientes(orgId);
      setClientes(dados);
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    if (orgId) carregar();
  }, [carregar, orgId]);

  const salvar = useCallback(
    async (
      payload: {
        nome: string;
        telefone: string;
        responsavel: string;
        tags: string[];
        obs: string;
      },
      novasInteracoes: string[],
      editId?: string
    ) => {
      if (!orgId) return;
      if (editId) {
        await atualizarCliente(editId, payload);
        await inserirInteracoes(editId, novasInteracoes);
      } else {
        const novo = await criarCliente(payload, orgId);
        await inserirInteracoes(novo.id, novasInteracoes);
      }
      await carregar();
    },
    [carregar, orgId]
  );

  const mover = useCallback(async (id: string, etapa: Etapa) => {
    setClientes((prev) =>
      prev.map((c) => (c.id === id ? { ...c, etapa } : c))
    );
    await moverEtapa(id, etapa);
  }, []);

  const deletar = useCallback(async (id: string) => {
    await deletarCliente(id);
    setClientes((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return { clientes, loading, erro, salvar, mover, deletar, recarregar: carregar };
}
