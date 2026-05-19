/**
 * Formata uma string de data ISO (sem 'Z') ou um objeto Date
 * para o fuso horário de São Paulo.
 */
export function formatarData(data?: string | Date | null): string {
  if (!data) return "-";

  const d =
    data instanceof Date
      ? data
      : new Date(typeof data === "string" ? data + "Z" : data);

  if (isNaN(d.getTime())) return "-";

  return d.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Retorna quantos dias se passaram desde a data informada.
 */
export function diasDesde(data?: string | null): number {
  if (!data) return 999;
  const d = new Date(data.replace(" ", "T"));
  return (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24);
}
