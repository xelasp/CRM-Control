import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useOrganization } from "@/contexts/OrganizationContext";
import { criarOrganizacao } from "@/services/organizationService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { toast } from "sonner";

export default function Onboarding() {
  const { user } = useAuth();
  const { recarregar } = useOrganization();
  const navigate = useNavigate();
  const [nome, setNome] = useState("");
  const [salvando, setSalvando] = useState(false);

  async function handleCriar() {
    if (!nome.trim() || !user) return;
    setSalvando(true);
    try {
      await criarOrganizacao(nome.trim(), user.id);
      await recarregar();
      toast.success("Organização criada com sucesso!");
      navigate("/");
    } catch (e) {
      toast.error("Erro ao criar organização: " + (e as Error).message);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-6 animate-fade-in">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="rounded-xl bg-primary/10 p-4">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Bem-vindo!</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Crie sua organização para começar
            </p>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Nova Organização</CardTitle>
            <CardDescription>
              Este será o espaço da sua empresa no sistema.
              Você poderá convidar membros depois.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-1">
              <Label>Nome da empresa</Label>
              <Input
                placeholder="Ex: Empresa X Ltda"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCriar()}
                autoFocus
              />
            </div>
            <Button
              className="w-full"
              onClick={handleCriar}
              disabled={salvando || !nome.trim()}
            >
              {salvando ? "Criando..." : "Criar organização"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
