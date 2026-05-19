import type { Client } from "@/types/client";

function downloadCSV(content: string, filename: string) {
  const BOM = "\uFEFF"; // UTF-8 BOM para Excel reconhecer acentos
  const blob = new Blob([BOM + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR");
}

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Exporta lista resumida de clientes */
export function exportClientsToCSV(clients: Client[]): void {
  const headers = [
    "Nome",
    "Telefone",
    "CPF",
    "Valor Total",
    "Parcelas",
    "Início",
    "Pago",
    "Pendente",
  ];

  const rows = clients.map((c) => {
    const pago = c.installments
      .filter((i) => i.isPaid)
      .reduce((sum, i) => sum + i.value, 0);
    const pendente = c.totalValue - pago;

    return [
      c.name,
      c.phone ?? "",
      c.cpf ?? "",
      formatCurrency(c.totalValue),
      String(c.installmentsCount),
      formatDate(c.startDate),
      formatCurrency(pago),
      formatCurrency(pendente),
    ].join(";");
  });

  const csv = [headers.join(";"), ...rows].join("\n");
  downloadCSV(csv, "clientes.csv");
}

/** Exporta todas as parcelas de todos os clientes */
export function exportInstallmentsToCSV(clients: Client[]): void {
  const headers = [
    "Cliente",
    "Parcela",
    "Valor",
    "Vencimento",
    "Status",
  ];

  const rows: string[] = [];

  clients.forEach((c) => {
    c.installments.forEach((i) => {
      rows.push(
        [
          c.name,
          `${i.number}/${c.installmentsCount}`,
          formatCurrency(i.value),
          formatDate(i.dueDate),
          i.isPaid ? "Pago" : "Pendente",
        ].join(";")
      );
    });
  });

  const csv = [headers.join(";"), ...rows].join("\n");
  downloadCSV(csv, "parcelas.csv");
}

/** Exporta somente parcelas pendentes */
export function exportPendingInstallmentsToCSV(clients: Client[]): void {
  const headers = [
    "Cliente",
    "Telefone",
    "Parcela",
    "Valor",
    "Vencimento",
  ];

  const rows: string[] = [];

  clients.forEach((c) => {
    c.installments
      .filter((i) => !i.isPaid)
      .forEach((i) => {
        rows.push(
          [
            c.name,
            c.phone ?? "",
            `${i.number}/${c.installmentsCount}`,
            formatCurrency(i.value),
            formatDate(i.dueDate),
          ].join(";")
        );
      });
  });

  const csv = [headers.join(";"), ...rows].join("\n");
  downloadCSV(csv, "parcelas-pendentes.csv");
}
