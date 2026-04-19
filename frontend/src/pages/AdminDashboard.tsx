import { useOutages } from "@/hooks/useOutages";
import { StatsCard } from "@/components/StatsCard";
import { OutageCard } from "@/components/OutageCard";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  Zap,
  Users,
  TrendingUp,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDashboardStats, useRecentTrend } from "@/hooks/useDashboardStats";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Outage, Priority, User } from "@/types/oms";

const PIE_COLORS = [
  "hsl(217, 91%, 60%)",
  "hsl(142, 76%, 36%)",
  "hsl(199, 89%, 48%)",
];
const PRIORITY_COLORS = [
  "hsl(142, 76%, 36%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 84%, 60%)",
];

const getToken = () => {
  const saved = localStorage.getItem("oms_user");
  return saved ? JSON.parse(saved).token : "";
};

export default function AdminDashboard() {
  const { outages, updateStatus, setPriority, assignTechnician } = useOutages();
  const { data: stats, isLoading } = useDashboardStats();
  const { data: trendData } = useRecentTrend();
  const [selectedOutage, setSelectedOutage] = useState<Outage | null>(null);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedTech, setSelectedTech] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<Priority>("medium");
  const [technicians, setTechnicians] = useState<User[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/users/technicians", {
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

  const pending = outages.filter((o) => o.status === "pending").length;
  const inProgress = outages.filter((o) => o.status === "in_progress").length;
  const resolved = outages.filter((o) => o.status === "resolved").length;

  const handleAssign = () => {
    if (selectedOutage && selectedTech) {
      const tech = technicians.find((t) => t.id === selectedTech);
      if (tech) {
        assignTechnician(selectedOutage.id, tech.id, tech.name);
        setPriority(selectedOutage.id, selectedPriority);
        setAssignDialogOpen(false);
        setSelectedOutage(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of all outage reports and system health.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Outages"
          value={outages.length}
          icon={AlertTriangle}
        />
        <StatsCard
          title="Pending Review"
          value={pending}
          icon={Clock}
          description="Needs attention"
        />
        <StatsCard title="In Progress" value={inProgress} icon={Zap} />
        <StatsCard title="Resolved" value={resolved} icon={CheckCircle} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Reports Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={trendData || []}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-border"
                />
                <XAxis 
                  dataKey="date" 
                  className="text-xs" 
                  tickFormatter={(val) => new Date(val).toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" })}
                />
                <YAxis className="text-xs" />
                <Tooltip 
                  labelFormatter={(val) => new Date(val).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })}
                />
                <Bar
                  dataKey="count"
                  fill="hsl(217, 91%, 60%)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">By Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={stats?.byPriority || []}
                  dataKey="count"
                  nameKey="priority"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {(stats?.byPriority || []).map((_, i) => (
                    <Cell
                      key={i}
                      fill={PRIORITY_COLORS[i % PRIORITY_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => {
                    const total = stats?.totalOutages || 1;
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${percentage}%`;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">All Outage Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {outages.map((o) => (
            <OutageCard
              key={o.id}
              outage={o}
              actions={
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
              }
            />
          ))}
        </div>
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
