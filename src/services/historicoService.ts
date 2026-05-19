import { supabaseCRM } from "@/lib/supabaseCRM";
import type { Historico } from "@/types/kanban";

/** Insere uma nova interação no histórico */
export async function inserirInteracao(
  clienteId: string,
  texto: string
): Promise<Historico> {
  const { data, error } = await supabaseCRM
    .from("historico")
    .insert([{ cliente_id: clienteId, texto }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Historico;
}

/** Insere múltiplas interações em batch */
export async function inserirInteracoes(
  clienteId: string,
  textos: string[]
): Promise<void> {
  if (textos.length === 0) return;

  const rows = textos.map((texto) => ({ cliente_id: clienteId, texto }));

  const { error } = await supabaseCRM.from("historico").insert(rows);

  if (error) throw new Error(error.message);
}
