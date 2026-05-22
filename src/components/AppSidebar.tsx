import { LayoutDashboard, UserPlus, KanbanSquare, Receipt, Shield, Users } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useOrganization } from '@/contexts/OrganizationContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const financeiroItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Cadastro Cliente', url: '/cadastro', icon: UserPlus },
];

const crmItems = [
  { title: 'CRM Kanban', url: '/kanban', icon: KanbanSquare },
];

const adminItems = [
  { title: 'Painel Admin', url: '/admin', icon: Users },
];

const superAdminItems = [
  { title: 'Super Admin', url: '/super-admin', icon: Shield },
];

function NavItems({ items, collapsed }: { items: { title: string; url: string; icon: React.ElementType }[]; collapsed: boolean }) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild tooltip={item.title}>
            <NavLink
              to={item.url}
              end
              className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-sidebar-accent"
              activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { organization, isSuperAdmin } = useOrganization();
  const { user, signOut } = useAuth();

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-white">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2 shrink-0">
            <Receipt className="h-6 w-6 text-primary" />
          </div>
          {!collapsed && (
            <div className="flex flex-col overflow-hidden">
              <span className="font-semibold text-sidebar-foreground truncate">
                {organization?.name ?? 'CRM GESTOR'}
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Financeiro */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase text-xs tracking-widest px-3 pb-1">
              Financeiro
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <NavItems items={financeiroItems} collapsed={collapsed} />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* CRM */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase text-xs tracking-widest px-3 pb-1">
              CRM
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <NavItems items={crmItems} collapsed={collapsed} />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Admin da organização */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase text-xs tracking-widest px-3 pb-1">
              Organização
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <NavItems items={adminItems} collapsed={collapsed} />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Super Admin — visível só para super admin */}
        {isSuperAdmin && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              {!collapsed && (
                <SidebarGroupLabel className="text-yellow-400/80 uppercase text-[10px] tracking-widest px-3 pb-1">
                  Super Admin
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <NavItems items={superAdminItems} collapsed={collapsed} />
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="p-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground"
          onClick={signOut}
        >
          <Avatar className="h-5 w-5">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="text-[10px]">
              {user?.email?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {!collapsed && <span className="text-xs truncate">Sair</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
