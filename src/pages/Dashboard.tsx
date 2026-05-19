import { useMemo } from 'react';
import { useClients } from '@/hooks/useClients';
import { SummaryCards } from '@/components/SummaryCards';
import { ClientList } from '@/components/ClientList';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';

const Dashboard = () => {
  const { clients, loading, removeClient, toggleInstallmentPaid, updateInstallmentDate, updateClientInfo } =
    useClients();

  const summary = useMemo(() => {
    const totalClients = clients.length;
    const totalPending = clients.reduce(
      (sum, c) =>
        sum + c.installments.filter((i) => !i.isPaid).reduce((s, i) => s + i.value, 0),
      0
    );
    const clientsWithPending = clients.filter((c) =>
      c.installments.some((i) => !i.isPaid)
    ).length;

    return { totalClients, totalPending, clientsWithPending };
  }, [clients]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <header className="animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Visão geral dos seus clientes e recebimentos
        </p>
      </header>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="glass-card animate-fade-in">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  Clientes Cadastrados
                </p>
                <p className="text-2xl font-bold text-foreground">{summary.totalClients}</p>
                <p className="text-xs text-muted-foreground">total</p>
              </div>
              <div className="rounded-lg p-3 bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <SummaryCards
          clientsWithPending={summary.clientsWithPending}
          totalPending={summary.totalPending}
        />
      </div>

      {/* Client List */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Clientes com Pendências</h2>
        <ClientList
          clients={clients.filter(c => c.installments.some(i => !i.isPaid))}
          onRemove={removeClient}
          onToggleInstallment={toggleInstallmentPaid}
          onUpdateInstallmentDate={updateInstallmentDate}
          onUpdateClientInfo={updateClientInfo}
        />
      </div>
    </div>
  );
};

export default Dashboard;
