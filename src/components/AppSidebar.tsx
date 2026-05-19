import { LayoutDashboard, UserPlus, KanbanSquare, Receipt } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
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
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';

const financeiroItems = [
  { title: 'Dashboard', url: '/', icon: LayoutDashboard },
  { title: 'Cadastro Cliente', url: '/cadastro', icon: UserPlus },
];

const crmItems = [
  { title: 'CRM Kanban', url: '/kanban', icon: KanbanSquare },
];

function NavItems({ items, collapsed }: { items: typeof financeiroItems; collapsed: boolean }) {
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
              <item.icon className="h-5 w-5" />
              {!collapsed && <span>{item.title}</span>}
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

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Receipt className="h-6 w-6 text-primary" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-semibold text-sidebar-foreground">Lexsan</span>
              <span className="font-semibold text-sidebar-foreground">Soluções</span>
              
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Módulo Financeiro */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase text-[12px] tracking-widest px-3 pb-1">
              Financeiro
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <NavItems items={financeiroItems} collapsed={collapsed} />
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Módulo CRM */}
        <SidebarGroup>
          {!collapsed && (
            <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase text-[12px] tracking-widest px-3 pb-1">
              CRM
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <NavItems items={crmItems} collapsed={collapsed} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
