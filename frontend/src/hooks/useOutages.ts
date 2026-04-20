import { useCallback } from "react";
import { Outage, OutageStatus, Priority, OutageType } from "@/types/oms";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const getToken = () => {
  const saved = localStorage.getItem("oms_user");
  return saved ? JSON.parse(saved).token : "";
};

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Custom hook for managing outage data with CRUD operations.
 */
export function useOutages() {
  const queryClient = useQueryClient();

  // Fetch all outages (React Query handles caching and live background refetching)
  const { data: outages = [] } = useQuery<Outage[]>({
    queryKey: ["outages"],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/outages`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to fetch outages");
      const data = await res.json();
      return data.map((item: any) => ({
        ...item,
        id: item._id,
        priority: item.priority || "medium",
      }));
    },
    refetchInterval: 5000, // Poll every 5 seconds for "live" database updates!
  });

  const addMutation = useMutation({
    mutationFn: async (outage: Omit<Outage, "id" | "createdAt" | "updatedAt" | "status" | "priority">) => {
      const res = await fetch(`${API_URL}/outages`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(outage),
      });
      let newOutage = await res.json();
      return { ...newOutage, id: newOutage._id, priority: newOutage.priority || "medium" };
    },
    // Instantly refresh the data across the whole app when a new report is added
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outages"] }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Outage> }) => {
      const res = await fetch(`${API_URL}/outages/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(updates),
      });
      const updated = await res.json();
      return { ...updated, id: updated._id };
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["outages"] }),
  });

  const addOutage = useCallback((outage: Omit<Outage, "id" | "createdAt" | "updatedAt" | "status" | "priority">) => {
    return addMutation.mutateAsync(outage);
  }, [addMutation]);

  const updateStatus = useCallback((id: string, status: OutageStatus) => {
    return updateMutation.mutateAsync({ id, updates: { status } });
  }, [updateMutation]);

  const setPriority = useCallback((id: string, priority: Priority) => {
    return updateMutation.mutateAsync({ id, updates: { priority } });
  }, [updateMutation]);

  const assignTechnician = useCallback((id: string, techId: string, techName: string) => {
    return updateMutation.mutateAsync({ id, updates: { assignedTo: techId, assignedToName: techName, status: "in_progress" } });
  }, [updateMutation]);

  const addResolutionNotes = useCallback((id: string, notes: string) => {
    return updateMutation.mutateAsync({ id, updates: { resolutionNotes: notes, status: "resolved" } });
  }, [updateMutation]);

  const filterOutages = useCallback(
    (filters: { status?: OutageStatus; type?: OutageType; priority?: Priority; search?: string }) => {
      return outages.filter((o: Outage) => {
        if (filters.status && o.status !== filters.status) return false;
        if (filters.type && o.type !== filters.type) return false;
        if (filters.priority && o.priority !== filters.priority) return false;
        if (filters.search) {
          const s = filters.search.toLowerCase();
          return o.title.toLowerCase().includes(s) || o.location.toLowerCase().includes(s);
        }
        return true;
      });
    },
    [outages]
  );

  return { outages, addOutage, updateStatus, setPriority, assignTechnician, addResolutionNotes, filterOutages };
}
