import { useAuth } from "@/contexts/AuthContext";
import { useOutages } from "@/hooks/useOutages";
import { StatsCard } from "@/components/StatsCard";
import { OutageCard } from "@/components/OutageCard";
import { AlertTriangle, Clock, CheckCircle, Zap } from "lucide-react";
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
import { useDashboardStats, useRecentTrend } from "@/hooks/useDashboardStats";
import { motion, Variants } from "framer-motion";

const PIE_COLORS = [
  "hsl(217, 91%, 60%)",
  "hsl(142, 76%, 36%)",
  "hsl(199, 89%, 48%)",
];

export default function CustomerDashboard() {
  const { user } = useAuth();
  const { outages } = useOutages();
  const { data: stats } = useDashboardStats();
  const { data: trendData } = useRecentTrend();
  const myOutages = outages.filter((o) => o.reportedBy === user?.id);
  const pending = myOutages.filter((o) => o.status === "pending").length;
  const inProgress = myOutages.filter((o) => o.status === "in_progress").length;
  const resolved = myOutages.filter((o) => o.status === "resolved").length;

  // Framer motion variants for the staggered entry effect
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Delays each child animation by 0.1s
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.name?.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">
          Track your reported outages and their status.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={itemVariants}>
          <StatsCard
            title="Total Reports"
            value={myOutages.length}
            icon={AlertTriangle}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatsCard title="Pending" value={pending} icon={Clock} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatsCard title="In Progress" value={inProgress} icon={Zap} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatsCard title="Resolved" value={resolved} icon={CheckCircle} />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">
                Outage Trend (Last 7 days)
              </CardTitle>
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
                  <YAxis className="text-xs" allowDecimals={false} />
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
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Outages by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={stats?.byType || []}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {(stats?.byType || []).map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
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
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <h2 className="text-lg font-semibold mb-3">Your Recent Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myOutages.length > 0 ? (
            myOutages
              .slice(0, 4)
              .map((o) => <OutageCard key={o.id} outage={o} />)
          ) : (
            <p className="text-muted-foreground col-span-2">
              No outage reports yet. Report one to get started.
            </p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
