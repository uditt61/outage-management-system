import { useAuth } from "@/contexts/AuthContext";
import { NavLink as RouterNavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard,
  AlertTriangle,
  Plus,
  Bell,
  Users,
  Wrench,
  LogOut,
  Zap,
  ClipboardList,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  if (!user) return null;

  const customerItems = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    { title: "Report Outage", url: "/report", icon: Plus },
    { title: "My Reports", url: "/my-reports", icon: ClipboardList },
    { title: "Notifications", url: "/notifications", icon: Bell },
  ];

  const adminItems = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    { title: "All Outages", url: "/outages", icon: AlertTriangle },
    { title: "Technicians", url: "/technicians", icon: Users },
    { title: "Notifications", url: "/notifications", icon: Bell },
  ];

  const technicianItems = [
    { title: "Dashboard", url: "/", icon: LayoutDashboard },
    { title: "Assigned", url: "/assigned", icon: Wrench },
    { title: "Notifications", url: "/notifications", icon: Bell },
  ];

  const items =
    user.role === "admin" ? adminItems : user.role === "technician" ? technicianItems : customerItems;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 py-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-sidebar-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 text-sidebar-primary-foreground" />
              </div>
              {!collapsed && <span className="font-bold text-sm">OMS</span>}
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className="hover:bg-sidebar-accent/50" activeClassName="bg-sidebar-accent text-sidebar-primary font-medium">
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-3">
        {!collapsed && (
          <div className="text-xs text-sidebar-foreground/60 mb-2">
            <p className="font-medium text-sidebar-foreground">{user.name}</p>
            <p className="capitalize">{user.role}</p>
          </div>
        )}
        <Button variant="ghost" size="sm" className="w-full justify-start text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent" onClick={logout}>
          <LogOut className="h-4 w-4 mr-2" />
          {!collapsed && "Sign Out"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
