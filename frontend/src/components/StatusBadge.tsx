import { OutageStatus, Priority, OutageType } from "@/types/oms";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusConfig: Record<OutageStatus, { label: string; className: string }> = {
  pending: { label: "Pending", className: "status-pending" },
  approved: { label: "Approved", className: "status-approved" },
  in_progress: { label: "In Progress", className: "status-in-progress" },
  resolved: { label: "Resolved", className: "status-resolved" },
  rejected: { label: "Rejected", className: "status-rejected" },
};

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  low: { label: "Low", className: "priority-low" },
  medium: { label: "Medium", className: "priority-medium" },
  high: { label: "High", className: "priority-high" },
};

const typeConfig: Record<OutageType, { label: string; icon: string }> = {
  electricity: { label: "Electricity", icon: "⚡" },
  internet: { label: "Internet", icon: "🌐" },
  water: { label: "Water", icon: "💧" },
};

export function StatusBadge({ status }: { status: OutageStatus }) {
  const c = statusConfig[status];
  return <Badge variant="outline" className={cn("font-medium border-0", c.className)}>{c.label}</Badge>;
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const c = priorityConfig[priority];
  return <Badge variant="outline" className={cn("font-medium border-0", c.className)}>{c.label}</Badge>;
}

export function TypeBadge({ type }: { type: OutageType }) {
  const c = typeConfig[type];
  return (
    <Badge variant="secondary" className="font-medium">
      {c.icon} {c.label}
    </Badge>
  );
}
