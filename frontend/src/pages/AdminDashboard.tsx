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
  MapPin,
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
import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Outage, Priority, User } from "@/types/oms";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const getCustomIcon = (type: string) => {
  const emoji = type === 'electricity' ? '⚡' : type === 'water' ? '💧' : '🌐';
  return L.divIcon({
    html: `<div style="font-size: 16px; background: white; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.3); border: 2px solid ${type === 'electricity' ? '#f59e0b' : type === 'water' ? '#3b82f6' : '#10b981'}">${emoji}</div>`,
    className: 'custom-leaflet-icon',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  });
};

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
  const [map, setMap] = useState<L.Map | null>(null);

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

  const mapCenter: [number, number] = useMemo(() => {
    const withLocation = outages.filter((o) => o.latitude && o.longitude);
    return withLocation.length > 0
      ? [withLocation[0].latitude!, withLocation[0].longitude!]
      : [51.505, -0.09];
  }, [outages]);

  const handleLocateMe = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const newPos: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        if (map) {
          map.flyTo(newPos, 13);
        }
      },
      () => {
        alert("Unable to retrieve your location. Please check your browser permissions.");
      }
    );
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
                  tickFormatter={(val) =>
                    new Date(val).toLocaleDateString("en-US", {
                      weekday: "short",
                      timeZone: "UTC",
                    })
                  }
                />
                <YAxis className="text-xs" />
                <Tooltip
                  labelFormatter={(val) =>
                    new Date(val).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      timeZone: "UTC",
                    })
                  }
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Live Outage Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full rounded-md overflow-hidden border z-0 relative">
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2 z-[1000] shadow-md"
              onClick={handleLocateMe}
            >
              <MapPin className="w-4 h-4 mr-2" />
              Locate Me
            </Button>
            <MapContainer
              center={mapCenter}
              zoom={11}
              style={{ height: "100%", width: "100%" }}
              ref={setMap}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {outages
                .filter((o) => o.latitude && o.longitude)
                .map((o) => (
                  <Marker 
                    key={o.id} 
                    position={[o.latitude!, o.longitude!]}
                    icon={getCustomIcon(o.type)}
                  >
                    <Popup>
                      <div className="text-sm">
                        <p className="font-semibold">{o.title}</p>
                        <p className="text-xs text-muted-foreground">{o.location}</p>
                        <div className="mt-2 flex gap-2">
                          <span className="capitalize px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">{o.type}</span>
                          <span className="capitalize px-2 py-1 bg-muted rounded-md text-xs">{o.status.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
            </MapContainer>
          </div>
        </CardContent>
      </Card>

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
