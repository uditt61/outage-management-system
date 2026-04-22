import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import AppLayout from "@/components/AppLayout";
import LoginPage from "@/pages/LoginPage";
import LandingPage from "@/pages/LandingPage";
import Index from "@/pages/Index";
import ReportOutagePage from "@/pages/ReportOutagePage";
import MyReportsPage from "@/pages/MyReportsPage";
import OutageListPage from "@/pages/OutageListPage";
import NotificationsPage from "@/pages/NotificationsPage";
import TechniciansPage from "@/pages/TechniciansPage";
import AssignedOutagesPage from "@/pages/AssignedOutagesPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <AppLayout>{children}</AppLayout>;
}

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          ) : (
            <LandingPage />
          )
        }
      />
      <Route
        path="/report"
        element={
          <ProtectedRoute>
            <ReportOutagePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-reports"
        element={
          <ProtectedRoute>
            <MyReportsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/outages"
        element={
          <ProtectedRoute>
            <OutageListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/technicians"
        element={
          <ProtectedRoute>
            <TechniciansPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assigned"
        element={
          <ProtectedRoute>
            <AssignedOutagesPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <ThemeProvider defaultTheme="system" storageKey="oms-ui-theme">
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </ThemeProvider>
        </AuthProvider>
      </TooltipProvider>
    </GoogleOAuthProvider>
  </QueryClientProvider>
);

export default App;
