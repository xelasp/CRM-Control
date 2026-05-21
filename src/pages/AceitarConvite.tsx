import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { aceitarConvite } from "@/services/organizationService";
import { useOrganization } from "@/contexts/OrganizationContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AceitarConvite() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { recarregar } = useOrganization();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [erro, setErro] = useState("");

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setErro("Token de convite não encontrado.");
      setStatus("error");
      return;
    }

    aceitarConvite(token)
      .then(async () => {
        await recarregar();
        setStatus("success");
        setTimeout(() => navigate("/"), 2000);
      })
      .catch((e) => {
        setErro((e as Error).message);
        setStatus("error");
      });
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle>Convite de Organização</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === "loading" && (
            <div className="flex flex-col items-center gap-3 py-4">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
              <p className="text-muted-foreground">Processando convite...</p>
            </div>
          )}
          {status === "success" && (
            <div className="flex flex-col items-center gap-3 py-4">
              <CheckCircle className="h-10 w-10 text-green-500" />
              <p className="font-medium">Convite aceito com sucesso!</p>
              <p className="text-sm text-muted-foreground">Redirecionando...</p>
            </div>
          )}
          {status === "error" && (
            <div className="flex flex-col items-center gap-3 py-4">
              <XCircle className="h-10 w-10 text-destructive" />
              <p className="font-medium">Erro ao aceitar convite</p>
              <p className="text-sm text-muted-foreground">{erro}</p>
              <Button variant="outline" onClick={() => navigate("/")}>
                Ir para o início
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
