import { supabaseCRM } from "@/lib/supabaseCRM";
import type { Cliente, ClientePayload, Etapa } from "@/types/kanban";

/** Carrega todos os clientes da organização com histórico */
export async function fetchClientes(orgId: string): Promise<Cliente[]> {
  const { data, error } = await supabaseCRM
    .from("clientes")
    .select("*, historico (*)")
    .eq("org_id", orgId);

  if (error) throw new Error(error.message);
  return (data as Cliente[]) ?? [];
}

/** Cria novo cliente na etapa Lead */
export async function criarCliente(
  payload: Omit<ClientePayload, "etapa">,
  orgId: string
): Promise<Cliente> {
  const { data, error } = await supabaseCRM
    .from("clientes")
    .insert([{ ...payload, etapa: "Lead", org_id: orgId }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Cliente;
}

/** Atualiza dados de um cliente existente */
export async function atualizarCliente(
  id: string,
  payload: Partial<ClientePayload>
): Promise<void> {
  const { error } = await supabaseCRM
    .from("clientes")
    .update(payload)
    .eq("id", id);

  if (error) throw new Error(error.message);
}

/** Move cliente para outra etapa (drag & drop) */
export async function moverEtapa(id: string, etapa: Etapa): Promise<void> {
  const { error } = await supabaseCRM
    .from("clientes")
    .update({ etapa })
    .eq("id", id);

  if (error) throw new Error(error.message);
}

/** Remove um cliente */
export async function deletarCliente(id: string): Promise<void> {
  const { error } = await supabaseCRM
    .from("clientes")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}
