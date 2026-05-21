export type OrgRole = "admin" | "member";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface OrgMember {
  id: string;
  org_id: string;
  user_id: string;
  role: OrgRole;
  created_at: string;
  // joined via query
  email?: string;
  display_name?: string;
}

export interface Invite {
  id: string;
  org_id: string;
  email: string;
  token: string;
  accepted_at: string | null;
  created_at: string;
}
