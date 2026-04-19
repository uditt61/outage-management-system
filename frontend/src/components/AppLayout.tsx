import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center justify-between border-b bg-card px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <h2 className="text-sm font-medium text-muted-foreground capitalize">
                {user?.role} Portal
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="relative" onClick={() => navigate("/notifications")}>
                <Bell className="h-4 w-4" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-destructive rounded-full" />
              </Button>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
