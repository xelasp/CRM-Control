-- ============================================
-- MULTI-TENANT — CRM SaaS
-- Execute este script no Supabase SQL Editor
-- ============================================

-- 1. ORGANIZAÇÕES
create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  created_at timestamp default now()
);

-- 2. MEMBROS DA ORGANIZAÇÃO
create table if not exists organization_members (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('admin', 'member')),
  created_at timestamp default now(),
  unique(org_id, user_id)
);

-- 3. CONVITES
create table if not exists invites (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references organizations(id) on delete cascade,
  email text not null,
  token text not null unique default gen_random_uuid()::text,
  accepted_at timestamp,
  created_at timestamp default now()
);

-- 4. ADICIONA org_id NAS TABELAS EXISTENTES
alter table clientes add column if not exists org_id uuid references organizations(id) on delete cascade;
alter table historico add column if not exists org_id uuid references organizations(id) on delete cascade;

-- 5. SUPER ADMIN — define seu user_id aqui após primeiro login
-- (preencher depois com seu user_id do Supabase Auth)
create table if not exists super_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- ============================================
-- RLS — Row Level Security
-- ============================================

-- Habilita RLS em todas as tabelas
alter table organizations enable row level security;
alter table organization_members enable row level security;
alter table invites enable row level security;
alter table clientes enable row level security;
alter table historico enable row level security;

-- ORGANIZATIONS: membro vê só a sua organização
create policy "members view own org" on organizations
  for select using (
    id in (
      select org_id from organization_members
      where user_id = auth.uid()
    )
  );

-- ORGANIZATIONS: super admin vê tudo
create policy "super admin view all orgs" on organizations
  for all using (
    auth.uid() in (select user_id from super_admins)
  );

-- ORGANIZATION_MEMBERS: membro vê membros da sua org
create policy "view own org members" on organization_members
  for select using (
    org_id in (
      select org_id from organization_members
      where user_id = auth.uid()
    )
  );

-- ORGANIZATION_MEMBERS: admin gerencia membros da sua org
create policy "admin manage members" on organization_members
  for all using (
    org_id in (
      select org_id from organization_members
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- INVITES: admin da org gerencia convites
create policy "admin manage invites" on invites
  for all using (
    org_id in (
      select org_id from organization_members
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- CLIENTES: isolado por org_id
create policy "view own org clientes" on clientes
  for select using (
    org_id in (
      select org_id from organization_members
      where user_id = auth.uid()
    )
  );

create policy "manage own org clientes" on clientes
  for all using (
    org_id in (
      select org_id from organization_members
      where user_id = auth.uid()
    )
  );

-- HISTORICO: isolado por org_id
create policy "view own org historico" on historico
  for select using (
    org_id in (
      select org_id from organization_members
      where user_id = auth.uid()
    )
  );

create policy "manage own org historico" on historico
  for all using (
    org_id in (
      select org_id from organization_members
      where user_id = auth.uid()
    )
  );

-- ============================================
-- FUNÇÕES AUXILIARES
-- ============================================

-- Retorna o org_id do usuário logado
create or replace function get_user_org_id()
returns uuid as $$
  select org_id from organization_members
  where user_id = auth.uid()
  limit 1;
$$ language sql security definer;

-- Verifica se usuário é admin da sua org
create or replace function is_org_admin()
returns boolean as $$
  select exists (
    select 1 from organization_members
    where user_id = auth.uid() and role = 'admin'
  );
$$ language sql security definer;

-- Verifica se usuário é super admin
create or replace function is_super_admin()
returns boolean as $$
  select exists (
    select 1 from super_admins
    where user_id = auth.uid()
  );
$$ language sql security definer;
