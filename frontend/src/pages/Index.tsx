import { useAuth } from "@/contexts/AuthContext";
import CustomerDashboard from "@/pages/CustomerDashboard";
import AdminDashboard from "@/pages/AdminDashboard";
import TechnicianDashboard from "@/pages/TechnicianDashboard";

export default function Index() {
  const { user } = useAuth();

  if (!user) return null;

  switch (user.role) {
    case "admin":
      return <AdminDashboard />;
    case "technician":
      return <TechnicianDashboard />;
    default:
      return <CustomerDashboard />;
  }
}
