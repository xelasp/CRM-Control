export interface Installment {
  id: string;
  number: number;
  value: number;
  dueDate: Date;
  isPaid: boolean;
}

export interface Client {
  id: string;
  name: string;
  phone?: string;
  cpf?: string;
  totalValue: number;
  installmentsCount: number;
  startDate: Date;
  installments: Installment[];
}
