export type Etapa = "Lead" | "Contato" | "Proposta" | "Fechado" | "Perdido";

export const ETAPAS: Etapa[] = [
  "Lead",
  "Contato",
  "Proposta",
  "Fechado",
  "Perdido",
];

export interface Historico {
  id: string;
  cliente_id: string;
  texto: string;
  criado_em: string;
}

export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  responsavel?: string;
  tags: string[];
  obs?: string;
  etapa: Etapa;
  criado_em: string;
  historico?: Historico[];
}

export type ClientePayload = Omit<Cliente, "id" | "criado_em" | "historico">;
