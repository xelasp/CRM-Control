import { useEffect, useState } from "react";
import { useOrganization } from "@/contexts/OrganizationContext";
import {
  fetchMembers,
  fetchInvites,
  convidarMembro,
  cancelarConvite,
  removerMembro,
  atualizarRole,
} from "@/services/organizationService";
import type { OrgMember, Invite } from "@/types/organization";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { UserPlus, Trash2, Shield, User, X } from "lucide-react";
import { toast } from "sonner";
import { formatarData } from "@/lib/formatters";

export default function AdminPanel() {
  const { organization } = useOrganization();
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [email, setEmail] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    if (!organization) return;
    setLoading(true);
    try {
      const [m, i] = await Promise.all([
        fetchMembers(organization.id),
        fetchInvites(organization.id),
      ]);
      setMembers(m);
      setInvites(i);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { carregar(); }, [organization]);

  async function handleConvidar() {
    if (!email.trim() || !organization) return;
    setEnviando(true);
    try {
      await convidarMembro(organization.id, email.trim(), organization.name);
      toast.success(`Convite enviado para ${email}`);
      setEmail("");
      await carregar();
    } catch (e) {
      toast.error("Erro ao enviar convite: " + (e as Error).message);
    } finally {
      setEnviando(false);
    }
  }

  async function handleRemover(memberId: string) {
    if (!confirm("Remover este membro?")) return;
    await removerMembro(memberId);
    toast.success("Membro removido");
    await carregar();
  }

  async function handleRole(memberId: string, role: "admin" | "member") {
    await atualizarRole(memberId, role);
    toast.success("Permissão atualizada");
    await carregar();
  }

  async function handleCancelarConvite(inviteId: string) {
    await cancelarConvite(inviteId);
    toast.success("Convite cancelado");
    await carregar();
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Painel Admin</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {organization?.name}
        </p>
      </div>

      {/* Convidar membro */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Convidar membro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="email@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleConvidar()}
              className="max-w-sm"
            />
            <Button onClick={handleConvidar} disabled={enviando || !email.trim()}>
              {enviando ? "Enviando..." : "Convidar"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Membros */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Membros ({members.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Carregando...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Permissão</TableHead>
                  <TableHead>Desde</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="text-sm font-mono text-muted-foreground">
                      {m.user_id.slice(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <Badge variant={m.role === "admin" ? "default" : "secondary"}>
                        {m.role === "admin" ? (
                          <><Shield className="h-3 w-3 mr-1" />Admin</>
                        ) : (
                          <><User className="h-3 w-3 mr-1" />Membro</>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatarData(m.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-xs"
                          onClick={() =>
                            handleRole(m.id, m.role === "admin" ? "member" : "admin")
                          }
                        >
                          {m.role === "admin" ? "→ Membro" : "→ Admin"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 text-destructive hover:text-destructive"
                          onClick={() => handleRemover(m.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Convites pendentes */}
      {invites.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Convites pendentes ({invites.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Enviado em</TableHead>
                  <TableHead className="w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invites.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell>{inv.email}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatarData(inv.created_at)}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-destructive hover:text-destructive"
                        onClick={() => handleCancelarConvite(inv.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
