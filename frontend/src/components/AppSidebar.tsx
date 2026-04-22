import { useAuth } from "@/contexts/AuthContext";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AppSidebar() {
  const { user, logout } = useAuth();
  const { setOpen, isMobile, state } = useSidebar();
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    if (!isMobile) {
      setOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setOpen(false);
    }
  };

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
    user.role === "admin"
      ? adminItems
      : user.role === "technician"
        ? technicianItems
        : customerItems;

  const collapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <Zap className="w-4 h-4 text-sidebar-primary-foreground" />
          </div>
          <span className="font-bold text-sm transition-opacity duration-200 group-data-[collapsible=icon]:opacity-0">
            OMS
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="px-4 py-2">
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <NavLink
                  to={item.url}
                  end
                  className="hover:bg-sidebar-accent/50"
                  activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  <span className="truncate transition-opacity duration-200 group-data-[collapsible=icon]:opacity-0">
                    {item.title}
                  </span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <div className="overflow-hidden whitespace-nowrap transition-all duration-200 group-data-[collapsible=icon]:h-0 group-data-[collapsible=icon]:opacity-0">
          <div className="text-xs text-sidebar-foreground/60 mb-2 whitespace-nowrap">
            <p className="font-medium text-sidebar-foreground">{user.name}</p>
            <p className="capitalize">{user.role}</p>
          </div>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 p-2 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent overflow-hidden group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span className="truncate transition-opacity duration-200 group-data-[collapsible=icon]:opacity-0">
                Sign Out
              </span>
            </Button>
          </TooltipTrigger>
          {collapsed && !isMobile && (
            <TooltipContent side="right" align="center">
              Sign Out
            </TooltipContent>
          )}
        </Tooltip>
      </SidebarFooter>
    </Sidebar>
  );
}
