import { useAuth } from "@/contexts/AuthContext";
import { useOutages } from "@/hooks/useOutages";
import { OutageCard } from "@/components/OutageCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { OutageStatus, OutageType, Priority, User, Outage } from "@/types/oms";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const getToken = () => {
  const saved = localStorage.getItem("oms_user");
  return saved ? JSON.parse(saved).token : "";
};

export default function OutageListPage() {
  const { user } = useAuth();
  const {
    filterOutages,
    updateStatus,
    assignTechnician,
    setPriority: setOutagePriority,
  } = useOutages();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [type, setType] = useState<string>("all");
  const [priority, setPriority] = useState<string>("all");
  const [selectedOutage, setSelectedOutage] = useState<Outage | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedTech, setSelectedTech] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<Priority>("medium");
  const [technicians, setTechnicians] = useState<User[]>([]);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
    fetch(`${API_URL}/users/technicians`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((res) => res.json())
      .then((data) => {
        // Map MongoDB _id to frontend id
        const mappedData = data.map((t: any) => ({ ...t, id: t._id }));
        setTechnicians(mappedData);
      })
      .catch((err) => console.error("Error fetching technicians:", err));
  }, []);

  const filtered = filterOutages({
    search: search || undefined,
    status: status !== "all" ? (status as OutageStatus) : undefined,
    type: type !== "all" ? (type as OutageType) : undefined,
    priority: priority !== "all" ? (priority as Priority) : undefined,
  });

  const handleAssign = () => {
    if (selectedOutage && selectedTech) {
      const tech = technicians.find((t) => t.id === selectedTech);
      if (tech) {
        assignTechnician(selectedOutage.id, tech.id, tech.name);
        setOutagePriority(selectedOutage.id, selectedPriority);
        setAssignDialogOpen(false);
        setSelectedOutage(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">All Outages</h1>
        <p className="text-muted-foreground">
          Search and filter all reported outages.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Input
          placeholder="Search by title or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="electricity">Electricity</SelectItem>
            <SelectItem value="internet">Internet</SelectItem>
            <SelectItem value="water">Water</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="text-sm text-muted-foreground">
        {filtered.length} outage(s) found
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((o) => (
          <OutageCard
            key={o.id}
            outage={o}
            actions={
              user?.role === "admin" ? (
                <>
                  {o.status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => updateStatus(o.id, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateStatus(o.id, "rejected")}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {(o.status === "approved" || o.status === "pending") &&
                    !o.assignedTo && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedOutage(o);
                          setAssignDialogOpen(true);
                        }}
                      >
                        Assign Tech
                      </Button>
                    )}
                </>
              ) : undefined
            }
          />
        ))}
      </div>

      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Technician</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              {selectedOutage?.title}
            </p>
            <div className="space-y-2">
              <label className="text-sm font-medium">Technician</label>
              <Select value={selectedTech} onValueChange={setSelectedTech}>
                <SelectTrigger>
                  <SelectValue placeholder="Select technician" />
                </SelectTrigger>
                <SelectContent>
                  {technicians.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                      {t.specialization ? ` — ${t.specialization}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select
                value={selectedPriority}
                onValueChange={(v) => setSelectedPriority(v as Priority)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAssignDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleAssign} disabled={!selectedTech}>
              Assign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
