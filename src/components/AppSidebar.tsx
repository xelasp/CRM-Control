import { LayoutDashboard, UserPlus, KanbanSquare, Receipt, Shield, Users } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
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
import { cn } from '@/lib/utils';

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

function NavItems({
  items,
  collapsed,
}: {
  items: { title: string; url: string; icon: React.ElementType }[];
  collapsed: boolean;
}) {
  const { pathname } = useLocation();

  return (
    <SidebarMenu>
      {items.map((item) => {
        const isActive = item.url === '/'
          ? pathname === '/'
          : pathname.startsWith(item.url);

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              isActive={isActive}
              tooltip={item.title}
              className={cn(
                "transition-colors",
                isActive
                  ? "bg-sidebar-accent !text-white font-medium"
                  : "hover:bg-sidebar-accent/20 text-sidebar-foreground"
              )}
            >
              <Link to={item.url} className="flex items-center gap-3">
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { organization, isSuperAdmin } = useOrganization();
  const { user, signOut } = useAuth();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
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
            <SidebarGroupLabel className="text-sidebar-foreground/70 uppercase text-[12px] font-semibold tracking-widest px-3 pb-1">
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
            <SidebarGroupLabel className="text-sidebar-foreground/70 uppercase text-[12px] font-semibold tracking-widest px-3 pb-1">
              CRM
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <NavItems items={crmItems} collapsed={collapsed} />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Organização */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-sidebar-foreground/70 uppercase text-[12px] font-semibold tracking-widest px-3 pb-1">
              Organização
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <NavItems items={adminItems} collapsed={collapsed} />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Super Admin */}
        {isSuperAdmin && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              {!collapsed && (
                <SidebarGroupLabel className="text-yellow-600 uppercase text-[10px] font-semibold tracking-widest px-3 pb-1">
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
          className="w-full justify-start gap-2 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/20"
          onClick={signOut}
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="text-[12px]">
              {user?.email?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {!collapsed && <span className="text-sm truncate">Sair</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
