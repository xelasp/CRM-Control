import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ClientFormProps {
  onAddClient: (
    name: string,
    totalValue: number,
    installmentsCount: number,
    startDate: Date,
    phone?: string,
    cpf?: string
  ) => void;
}

export const ClientForm = ({ onAddClient }: ClientFormProps) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [installmentsCount, setInstallmentsCount] = useState('');
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/^(\d{2})/, '($1) ')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .trim();
    }
    return value.slice(0, 15);
  };

  const formatCpf = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return value.slice(0, 14);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: 'Erro',
        description: 'Informe o nome do cliente',
        variant: 'destructive',
      });
      return;
    }

    const value = parseFloat(totalValue);
    if (isNaN(value) || value <= 0) {
      toast({
        title: 'Erro',
        description: 'Informe um valor válido',
        variant: 'destructive',
      });
      return;
    }

    const count = parseInt(installmentsCount);
    if (isNaN(count) || count <= 0) {
      toast({
        title: 'Erro',
        description: 'Informe um número válido de parcelas',
        variant: 'destructive',
      });
      return;
    }

    onAddClient(
      name.trim(),
      value,
      count,
      new Date(startDate),
      phone.trim() || undefined,
      cpf.trim() || undefined
    );

    setName('');
    setPhone('');
    setCpf('');
    setTotalValue('');
    setInstallmentsCount('');
    setStartDate(new Date().toISOString().split('T')[0]);

    toast({
      title: 'Cliente adicionado',
      description: `${name} foi cadastrado com sucesso!`,
    });
  };

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <UserPlus className="h-5 w-5 text-primary" />
          Novo Cliente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Cliente</Label>
            <Input
              id="name"
              placeholder="Ex: João Silva"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              placeholder="(00) 00000-0000"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => setCpf(formatCpf(e.target.value))}
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="totalValue">Valor Total (R$)</Label>
            <Input
              id="totalValue"
              type="number"
              step="0.01"
              min="0"
              placeholder="Ex: 1200,00"
              value={totalValue}
              onChange={(e) => setTotalValue(e.target.value)}
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="installments">Nº de Parcelas</Label>
            <Input
              id="installments"
              type="number"
              min="1"
              placeholder="Ex: 12"
              value={installmentsCount}
              onChange={(e) => setInstallmentsCount(e.target.value)}
              className="bg-background"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate">Data de Início</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-background"
            />
          </div>
          <div className="flex items-end lg:col-span-2">
            <Button type="submit" className="w-full">
              Adicionar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};