import { useEffect, useState } from "react";
import {
  fetchAllOrganizations,
  deletarOrganizacao,
} from "@/services/organizationService";
import type { Organization } from "@/types/organization";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building2, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { formatarData } from "@/lib/formatters";

type OrgWithCount = Organization & { organization_members: { count: number }[] };

export default function SuperAdmin() {
  const [orgs, setOrgs] = useState<OrgWithCount[]>([]);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    setLoading(true);
    try {
      const data = await fetchAllOrganizations();
      setOrgs(data as OrgWithCount[]);
    } catch (e) {
      toast.error("Erro ao carregar organizações");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, []);

  async function handleDeletar(orgId: string, nome: string) {
    if (!confirm(`Deletar "${nome}" e todos os seus dados? Esta ação é irreversível.`)) return;
    try {
      await deletarOrganizacao(orgId);
      toast.success("Organização deletada");
      await carregar();
    } catch (e) {
      toast.error("Erro ao deletar: " + (e as Error).message);
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2">
          <Building2 className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Super Admin</h1>
          <p className="text-sm text-muted-foreground">
            Todas as organizações do sistema
          </p>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm text-muted-foreground">Total de Organizações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{orgs.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm text-muted-foreground">Total de Membros</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {orgs.reduce((sum, o) => sum + (o.organization_members?.[0]?.count ?? 0), 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-1">
            <CardTitle className="text-sm text-muted-foreground">Última org criada</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-medium">
              {orgs[0]?.name ?? "—"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de organizações */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Organizações</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Membros</TableHead>
                  <TableHead>Criada em</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orgs.map((org) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-medium">{org.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono text-xs">
                        {org.slug}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-sm">
                        <Users className="h-3 w-3" />
                        {org.organization_members?.[0]?.count ?? 0}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatarData(org.created_at)}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-destructive hover:text-destructive"
                        onClick={() => handleDeletar(org.id, org.name)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
