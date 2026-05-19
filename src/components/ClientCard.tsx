import { useState } from 'react';
import { Client, Installment } from '@/types/client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Trash2, Check, X, Calendar as CalendarIcon, Banknote, Pencil, Phone, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface ClientCardProps {
  client: Client;
  onRemove: (id: string) => void;
  onToggleInstallment: (clientId: string, installmentId: string) => void;
  onUpdateInstallmentDate: (clientId: string, installmentId: string, newDate: Date) => void;
  onUpdateClientInfo?: (clientId: string, phone?: string, cpf?: string) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const InstallmentDateEditor = ({
  installment,
  clientId,
  onUpdateDate,
}: {
  installment: Installment;
  clientId: string;
  onUpdateDate: (clientId: string, installmentId: string, newDate: Date) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date>(installment.dueDate);

  const handleSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      onUpdateDate(clientId, installment.id, newDate);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors group">
          {format(installment.dueDate, "dd/MM/yyyy", { locale: ptBR })}
          <Pencil className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          locale={ptBR}
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
};

const formatPhoneNumber = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 2) return numbers;
  if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  if (numbers.length <= 11) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

const formatCPF = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
};

export const ClientCard = ({
  client,
  onRemove,
  onToggleInstallment,
  onUpdateInstallmentDate,
  onUpdateClientInfo,
}: ClientCardProps) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editPhone, setEditPhone] = useState(client.phone || '');
  const [editCpf, setEditCpf] = useState(client.cpf || '');

  const paidCount = client.installments.filter((i) => i.isPaid).length;
  const totalPaid = client.installments
    .filter((i) => i.isPaid)
    .reduce((sum, i) => sum + i.value, 0);
  const progressPercent = (paidCount / client.installmentsCount) * 100;

  const handleSaveClientInfo = () => {
    if (onUpdateClientInfo) {
      onUpdateClientInfo(client.id, editPhone || undefined, editCpf || undefined);
    }
    setIsEditOpen(false);
  };

  const handleOpenEdit = () => {
    setEditPhone(client.phone || '');
    setEditCpf(client.cpf || '');
    setIsEditOpen(true);
  };

  return (
    <Card className="glass-card animate-scale-in overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-foreground">{client.name}</h3>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              {client.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {client.phone}
                </span>
              )}
              {client.cpf && (
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {client.cpf}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Banknote className="h-4 w-4" />
                {formatCurrency(client.totalValue)}
              </span>
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                {format(client.startDate, "dd/MM/yyyy", { locale: ptBR })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={paidCount === client.installmentsCount ? 'default' : 'secondary'}
              className={
                paidCount === client.installmentsCount
                  ? 'bg-success text-success-foreground'
                  : 'bg-warning/20 text-warning-foreground'
              }
            >
              {paidCount}/{client.installmentsCount} pagas
            </Badge>
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                  onClick={handleOpenEdit}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[400px]">
                <DialogHeader>
                  <DialogTitle>Editar dados do cliente</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Telefone</label>
                    <Input
                      placeholder="(00) 00000-0000"
                      value={editPhone}
                      onChange={(e) => setEditPhone(formatPhoneNumber(e.target.value))}
                      maxLength={15}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">CPF</label>
                    <Input
                      placeholder="000.000.000-00"
                      value={editCpf}
                      onChange={(e) => setEditCpf(formatCPF(e.target.value))}
                      maxLength={14}
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1" onClick={() => setIsEditOpen(false)}>
                      Cancelar
                    </Button>
                    <Button className="flex-1" onClick={handleSaveClientInfo}>
                      Salvar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button
              variant="ghost"
              size="icon"
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={() => onRemove(client.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progresso</span>
            <span>{progressPercent.toFixed(0)}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Recebido: {formatCurrency(totalPaid)}</span>
            <span>Restante: {formatCurrency(client.totalValue - totalPaid)}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {client.installments.map((installment) => (
            <div
              key={installment.id}
              className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
                installment.isPaid
                  ? 'border-success/30 bg-success/5'
                  : 'border-warning/30 bg-warning/5'
              }`}
            >
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">
                  Parcela {installment.number}
                </p>
                <InstallmentDateEditor
                  installment={installment}
                  clientId={client.id}
                  onUpdateDate={onUpdateInstallmentDate}
                />
                <p className="text-sm font-semibold text-foreground">
                  {formatCurrency(installment.value)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className={
                  installment.isPaid
                    ? 'text-success hover:bg-destructive/10 hover:text-destructive'
                    : 'text-muted-foreground hover:bg-success/10 hover:text-success'
                }
                onClick={() => onToggleInstallment(client.id, installment.id)}
              >
                {installment.isPaid ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Check className="h-5 w-5" />
                )}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
