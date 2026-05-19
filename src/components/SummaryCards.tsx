import { Card, CardContent } from '@/components/ui/card';
import { Users, Clock } from 'lucide-react';

interface SummaryCardsProps {
  clientsWithPending: number;
  totalPending: number;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const SummaryCards = ({
  clientsWithPending,
  totalPending,
}: SummaryCardsProps) => {
  const cards = [
    {
      title: 'Clientes com Pendências',
      value: clientsWithPending.toString(),
      subtitle: 'clientes',
      icon: Users,
      iconColor: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Total Pendente',
      value: formatCurrency(totalPending),
      subtitle: 'A receber',
      icon: Clock,
      iconColor: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {cards.map((card, index) => (
        <Card
          key={card.title}
          className="glass-card animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-foreground">{card.value}</p>
                <p className="text-xs text-muted-foreground">{card.subtitle}</p>
              </div>
              <div className={`rounded-lg p-3 ${card.bgColor}`}>
                <card.icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
