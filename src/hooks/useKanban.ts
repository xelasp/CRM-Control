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

export function useKanban() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    try {
      setErro(null);
      const dados = await fetchClientes();
      setClientes(dados);
    } catch (e) {
      setErro((e as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  /** Salva cliente novo ou edita existente + novas interações */
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
      if (editId) {
        await atualizarCliente(editId, payload);
        await inserirInteracoes(editId, novasInteracoes);
      } else {
        const novo = await criarCliente(payload);
        await inserirInteracoes(novo.id, novasInteracoes);
      }
      await carregar();
    },
    [carregar]
  );

  /** Move card entre colunas */
  const mover = useCallback(
    async (id: string, etapa: Etapa) => {
      // Otimistic update
      setClientes((prev) =>
        prev.map((c) => (c.id === id ? { ...c, etapa } : c))
      );
      await moverEtapa(id, etapa);
    },
    []
  );

  /** Deleta cliente */
  const deletar = useCallback(
    async (id: string) => {
      await deletarCliente(id);
      setClientes((prev) => prev.filter((c) => c.id !== id));
    },
    []
  );

  return { clientes, loading, erro, salvar, mover, deletar, recarregar: carregar };
}
