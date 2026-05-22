import { supabase } from "@/integrations/supabase/client";
import type { Organization, OrgMember, Invite } from "@/types/organization";

/** Busca a organização do usuário logado */
export async function fetchMyOrganization(): Promise<Organization | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from("organization_members")
    .select("org_id, organizations(*)")
    .eq("user_id", user.id)
    .single()

  if (error || !data) return null
  return data.organizations as unknown as Organization
}

/** Cria uma nova organização e define o criador como admin */
export async function criarOrganizacao(
  name: string,
  userId: string
): Promise<Organization> {
  const slug = name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 40);

  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .insert([{ name, slug: `${slug}-${Date.now()}` }])
    .select()
    .single();

  if (orgError) throw new Error(orgError.message);

  const { error: memberError } = await supabase
    .from("organization_members")
    .insert([{ org_id: org.id, user_id: userId, role: "admin" }]);

  if (memberError) throw new Error(memberError.message);

  return org as Organization;
}

/** Lista membros da organização */
export async function fetchMembers(orgId: string): Promise<OrgMember[]> {
  const { data, error } = await supabase
    .from("organization_members")
    .select("*")
    .eq("org_id", orgId);

  if (error) throw new Error(error.message);
  return (data as OrgMember[]) ?? [];
}

/** Remove membro da organização */
export async function removerMembro(memberId: string): Promise<void> {
  const { error } = await supabase
    .from("organization_members")
    .delete()
    .eq("id", memberId);

  if (error) throw new Error(error.message);
}

/** Atualiza role do membro */
export async function atualizarRole(
  memberId: string,
  role: "admin" | "member"
): Promise<void> {
  const { error } = await supabase
    .from("organization_members")
    .update({ role })
    .eq("id", memberId);

  if (error) throw new Error(error.message);
}

/** Lista convites pendentes da organização */
export async function fetchInvites(orgId: string): Promise<Invite[]> {
  const { data, error } = await supabase
    .from("invites")
    .select("*")
    .eq("org_id", orgId)
    .is("accepted_at", null)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as Invite[]) ?? [];
}

/** Cria convite e envia email via Supabase */
export async function convidarMembro(
  orgId: string,
  email: string,
  orgName: string
): Promise<void> {
  // Salva convite no banco
  const { data: invite, error } = await supabase
    .from("invites")
    .insert([{ org_id: orgId, email }])
    .select()
    .single();

  if (error) throw new Error(error.message);

  // Envia magic link via Supabase Auth
  const redirectUrl = `${window.location.origin}/aceitar-convite?token=${invite.token}`;

  const { error: emailError } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: redirectUrl,
      data: {
        invite_token: invite.token,
        org_name: orgName,
      },
    },
  });

  if (emailError) throw new Error(emailError.message);
}

/** Cancela convite pendente */
export async function cancelarConvite(inviteId: string): Promise<void> {
  const { error } = await supabase
    .from("invites")
    .delete()
    .eq("id", inviteId);

  if (error) throw new Error(error.message);
}

/** Aceita convite pelo token e adiciona à organização */
export async function aceitarConvite(token: string): Promise<void> {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Usuário não autenticado");

  const { data: invite, error: inviteError } = await supabase
    .from("invites")
    .select("*")
    .eq("token", token)
    .is("accepted_at", null)
    .single();

  if (inviteError || !invite) throw new Error("Convite inválido ou já utilizado");

  const { error: memberError } = await supabase
    .from("organization_members")
    .insert([{ org_id: invite.org_id, user_id: user.id, role: "member" }]);

  if (memberError) throw new Error(memberError.message);

  await supabase
    .from("invites")
    .update({ accepted_at: new Date().toISOString() })
    .eq("id", invite.id);
}

// ── SUPER ADMIN ──────────────────────────────────

/** Lista todas as organizações (super admin only) */
export async function fetchAllOrganizations(): Promise<
  (Organization & { member_count: number })[]
> {
  const { data, error } = await supabase
    .from("organizations")
    .select("*, organization_members(count)")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data as (Organization & { member_count: number })[];
}

/** Verifica se usuário logado é super admin */
export async function isSuperAdmin(): Promise<boolean> {
  const { data } = await supabase.rpc("is_super_admin");
  return data === true;
}

/** Deleta organização (super admin only) */
export async function deletarOrganizacao(orgId: string): Promise<void> {
  const { error } = await supabase
    .from("organizations")
    .delete()
    .eq("id", orgId);

  if (error) throw new Error(error.message);
}
