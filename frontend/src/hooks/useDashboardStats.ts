import { useQuery } from "@tanstack/react-query";
import { DashboardStats } from "@/types/oms";

const getToken = () => {
  const saved = localStorage.getItem("oms_user");
  return saved ? JSON.parse(saved).token : "";
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ["dashboardStats"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/stats`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (!res.ok) throw new Error("Failed to fetch dashboard stats");
      return res.json();
    },
    // Poll every 5 seconds so the dashboard updates live without refreshing!
    refetchInterval: 5000, 
  });
}

export function useRecentTrend() {
  return useQuery<{ date: string; count: number }[]>({
    queryKey: ["recentTrend"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/stats/trend`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      if (!res.ok) throw new Error("Failed to fetch recent trend");
      return res.json();
    },
    refetchInterval: 5000, 
  });
}