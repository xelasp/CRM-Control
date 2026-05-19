import { Client } from '@/types/client';
import { ClientCard } from './ClientCard';
import { FileText } from 'lucide-react';

interface ClientListProps {
  clients: Client[];
  onRemove: (id: string) => void;
  onToggleInstallment: (clientId: string, installmentId: string) => void;
  onUpdateInstallmentDate: (clientId: string, installmentId: string, newDate: Date) => void;
  onUpdateClientInfo?: (clientId: string, phone?: string, cpf?: string) => void;
}

export const ClientList = ({
  clients,
  onRemove,
  onToggleInstallment,
  onUpdateInstallmentDate,
  onUpdateClientInfo,
}: ClientListProps) => {
  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground animate-fade-in">
        <FileText className="h-16 w-16 mb-4 opacity-30" />
        <p className="text-lg font-medium">Nenhum cliente cadastrado</p>
        <p className="text-sm">Adicione seu primeiro cliente usando o formulário acima</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-foreground">
        Clientes ({clients.length})
      </h2>
      <div className="space-y-4">
        {clients.map((client) => (
          <ClientCard
            key={client.id}
            client={client}
            onRemove={onRemove}
            onToggleInstallment={onToggleInstallment}
            onUpdateInstallmentDate={onUpdateInstallmentDate}
            onUpdateClientInfo={onUpdateClientInfo}
          />
        ))}
      </div>
    </div>
  );
};
