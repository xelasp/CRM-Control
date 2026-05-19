import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Client, Installment } from '@/types/client';
import { toast } from 'sonner';

const generateInstallments = (
  totalValue: number,
  count: number,
  startDate: Date
): Omit<Installment, 'id'>[] => {
  const installmentValue = totalValue / count;
  const installments: Omit<Installment, 'id'>[] = [];

  for (let i = 0; i < count; i++) {
    const dueDate = new Date(startDate);
    dueDate.setMonth(dueDate.getMonth() + i);

    installments.push({
      number: i + 1,
      value: installmentValue,
      dueDate,
      isPaid: false,
    });
  }

  return installments;
};

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchClients = async () => {
    if (!user) {
      setClients([]);
      setLoading(false);
      return;
    }

    try {
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (clientsError) throw clientsError;

      const { data: installmentsData, error: installmentsError } = await supabase
        .from('installments')
        .select('*');

      if (installmentsError) throw installmentsError;

      const formattedClients: Client[] = (clientsData || []).map((client) => ({
        id: client.id,
        name: client.name,
        phone: client.phone || undefined,
        cpf: client.cpf || undefined,
        totalValue: Number(client.total_value),
        installmentsCount: client.installments_count,
        startDate: new Date(client.start_date),
        installments: (installmentsData || [])
          .filter((inst) => inst.client_id === client.id)
          .map((inst) => ({
            id: inst.id,
            number: inst.number,
            value: Number(inst.value),
            dueDate: new Date(inst.due_date),
            isPaid: inst.is_paid,
          }))
          .sort((a, b) => a.number - b.number),
      }));

      setClients(formattedClients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [user]);

  const addClient = async (
    name: string,
    totalValue: number,
    installmentsCount: number,
    startDate: Date,
    phone?: string,
    cpf?: string
  ) => {
    if (!user) {
      toast.error('Você precisa estar logado para adicionar clientes');
      return;
    }

    try {
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .insert({
          name,
          phone: phone || null,
          cpf: cpf || null,
          total_value: totalValue,
          installments_count: installmentsCount,
          start_date: startDate.toISOString(),
          user_id: user.id,
        })
        .select()
        .single();

      if (clientError) throw clientError;

      const installments = generateInstallments(totalValue, installmentsCount, startDate);
      
      const { error: installmentsError } = await supabase
        .from('installments')
        .insert(
          installments.map((inst) => ({
            client_id: clientData.id,
            number: inst.number,
            value: inst.value,
            due_date: inst.dueDate.toISOString(),
            is_paid: inst.isPaid,
          }))
        );

      if (installmentsError) throw installmentsError;

      await fetchClients();
      toast.success('Cliente adicionado com sucesso');
    } catch (error) {
      console.error('Error adding client:', error);
      toast.error('Erro ao adicionar cliente');
    }
  };

  const removeClient = async (clientId: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) throw error;

      setClients((prev) => prev.filter((c) => c.id !== clientId));
      toast.success('Cliente removido com sucesso');
    } catch (error) {
      console.error('Error removing client:', error);
      toast.error('Erro ao remover cliente');
    }
  };

  const toggleInstallmentPaid = async (clientId: string, installmentId: string) => {
    try {
      const client = clients.find((c) => c.id === clientId);
      const installment = client?.installments.find((i) => i.id === installmentId);
      
      if (!installment) return;

      const { error } = await supabase
        .from('installments')
        .update({ is_paid: !installment.isPaid })
        .eq('id', installmentId);

      if (error) throw error;

      setClients((prev) =>
        prev.map((client) => {
          if (client.id !== clientId) return client;
          return {
            ...client,
            installments: client.installments.map((inst) => {
              if (inst.id !== installmentId) return inst;
              return { ...inst, isPaid: !inst.isPaid };
            }),
          };
        })
      );
    } catch (error) {
      console.error('Error toggling installment:', error);
      toast.error('Erro ao atualizar parcela');
    }
  };

  const updateInstallmentDate = async (clientId: string, installmentId: string, newDate: Date) => {
    try {
      const { error } = await supabase
        .from('installments')
        .update({ due_date: newDate.toISOString() })
        .eq('id', installmentId);

      if (error) throw error;

      setClients((prev) =>
        prev.map((client) => {
          if (client.id !== clientId) return client;
          return {
            ...client,
            installments: client.installments.map((inst) => {
              if (inst.id !== installmentId) return inst;
              return { ...inst, dueDate: newDate };
            }),
          };
        })
      );
      toast.success('Data da parcela atualizada');
    } catch (error) {
      console.error('Error updating installment date:', error);
      toast.error('Erro ao atualizar data da parcela');
    }
  };

  const getSummary = () => {
    const totalClients = clients.length;
    const totalValue = clients.reduce((sum, c) => sum + c.totalValue, 0);
    const totalPaid = clients.reduce(
      (sum, c) =>
        sum + c.installments.filter((i) => i.isPaid).reduce((s, i) => s + i.value, 0),
      0
    );
    const totalPending = totalValue - totalPaid;
    const clientsWithPending = clients.filter((c) =>
      c.installments.some((i) => !i.isPaid)
    ).length;

    return {
      totalClients,
      totalValue,
      totalPaid,
      totalPending,
      clientsWithPending,
    };
  };

  const updateClientInfo = async (clientId: string, phone?: string, cpf?: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update({ 
          phone: phone || null, 
          cpf: cpf || null 
        })
        .eq('id', clientId);

      if (error) throw error;

      setClients((prev) =>
        prev.map((client) => {
          if (client.id !== clientId) return client;
          return { ...client, phone, cpf };
        })
      );
      toast.success('Dados do cliente atualizados');
    } catch (error) {
      console.error('Error updating client info:', error);
      toast.error('Erro ao atualizar dados do cliente');
    }
  };

  return {
    clients,
    loading,
    addClient,
    removeClient,
    toggleInstallmentPaid,
    updateInstallmentDate,
    updateClientInfo,
    getSummary,
    refetch: fetchClients,
  };
};
