import { useState, useMemo } from 'react';
import { useClients } from '@/hooks/useClients';
import { ClientForm } from '@/components/ClientForm';
import { ClientList } from '@/components/ClientList';
import { SearchFilters } from '@/components/SearchFilters';
import { ExportButtons } from '@/components/ExportButtons';

const Cadastro = () => {
  const { clients, loading, addClient, removeClient, toggleInstallmentPaid, updateInstallmentDate, updateClientInfo } =
    useClients();

  const [searchName, setSearchName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      if (searchName && !client.name.toLowerCase().includes(searchName.toLowerCase())) {
        return false;
      }

      if (startDate) {
        const start = new Date(startDate);
        if (client.startDate < start) return false;
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        if (client.startDate > end) return false;
      }

      return true;
    });
  }, [clients, searchName, startDate, endDate]);

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
      <header className="flex items-center justify-between gap-4 animate-fade-in flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Cadastro de Clientes
          </h1>
          <p className="text-muted-foreground">
            Cadastre novos clientes e gerencie os existentes
          </p>
        </div>
        <ExportButtons clients={filteredClients} />
      </header>

      {/* Client Form */}
      <ClientForm onAddClient={addClient} />

      {/* Search Filters */}
      <SearchFilters
        searchName={searchName}
        onSearchNameChange={setSearchName}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
      />

      {/* Client List */}
      <ClientList
        clients={filteredClients}
        onRemove={removeClient}
        onToggleInstallment={toggleInstallmentPaid}
        onUpdateInstallmentDate={updateInstallmentDate}
        onUpdateClientInfo={updateClientInfo}
      />
    </div>
  );
};

export default Cadastro;
