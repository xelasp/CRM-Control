import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileSpreadsheet, Users, AlertCircle } from 'lucide-react';
import { Client } from '@/types/client';
import { exportClientsToCSV, exportInstallmentsToCSV, exportPendingInstallmentsToCSV } from '@/utils/csvExport';
import { toast } from 'sonner';

interface ExportButtonsProps {
  clients: Client[];
}

export const ExportButtons = ({ clients }: ExportButtonsProps) => {
  const handleExportClients = () => {
    if (clients.length === 0) {
      toast.error('Não há clientes para exportar');
      return;
    }
    exportClientsToCSV(clients);
    toast.success('Lista de clientes exportada com sucesso!');
  };

  const handleExportInstallments = () => {
    if (clients.length === 0) {
      toast.error('Não há parcelas para exportar');
      return;
    }
    exportInstallmentsToCSV(clients);
    toast.success('Relatório de parcelas exportado com sucesso!');
  };

  const handleExportPending = () => {
    const hasPending = clients.some(c => c.installments.some(i => !i.isPaid));
    if (!hasPending) {
      toast.error('Não há parcelas pendentes para exportar');
      return;
    }
    exportPendingInstallmentsToCSV(clients);
    toast.success('Parcelas pendentes exportadas com sucesso!');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleExportClients} className="gap-2 cursor-pointer">
          <Users className="h-4 w-4" />
          Lista de Clientes
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportInstallments} className="gap-2 cursor-pointer">
          <FileSpreadsheet className="h-4 w-4" />
          Todas as Parcelas
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportPending} className="gap-2 cursor-pointer">
          <AlertCircle className="h-4 w-4" />
          Parcelas Pendentes
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
