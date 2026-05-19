import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Calendar } from 'lucide-react';

interface SearchFiltersProps {
  searchName: string;
  onSearchNameChange: (value: string) => void;
  startDate: string;
  onStartDateChange: (value: string) => void;
  endDate: string;
  onEndDateChange: (value: string) => void;
}

export const SearchFilters = ({
  searchName,
  onSearchNameChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
}: SearchFiltersProps) => {
  return (
    <div className="glass-card rounded-xl p-4 animate-fade-in">
      <div className="grid gap-4 md:grid-cols-3">
        {/* Search by Name */}
        <div className="space-y-2">
          <Label htmlFor="search-name" className="text-sm font-medium text-muted-foreground">
            Buscar por nome
          </Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search-name"
              type="text"
              placeholder="Nome do cliente..."
              value={searchName}
              onChange={(e) => onSearchNameChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <Label htmlFor="start-date" className="text-sm font-medium text-muted-foreground">
            Data inicial
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => onStartDateChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <Label htmlFor="end-date" className="text-sm font-medium text-muted-foreground">
            Data final
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => onEndDateChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
