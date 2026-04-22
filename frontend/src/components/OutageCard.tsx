import { Outage } from "@/types/oms";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  StatusBadge,
  PriorityBadge,
  TypeBadge,
} from "@/components/StatusBadge";
import { MapPin, Clock, User } from "lucide-react";
import { motion } from "framer-motion";

interface OutageCardProps {
  outage: Outage;
  onClick?: () => void;
  actions?: React.ReactNode;
}

export function OutageCard({ outage, onClick, actions }: OutageCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="h-full"
    >
      <Card
        className="shadow-sm hover:shadow-lg transition-all cursor-pointer h-full flex flex-col"
        onClick={onClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base font-semibold leading-tight">
              {outage.title}
            </CardTitle>
            <StatusBadge status={outage.status} />
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            <TypeBadge type={outage.type} />
            <PriorityBadge priority={outage.priority} />
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-sm flex-1 flex flex-col">
          <p className="text-muted-foreground line-clamp-2">
            {outage.description}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground text-xs mt-auto pt-2">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {outage.location}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {outage.reportedByName}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {new Date(outage.createdAt).toLocaleDateString()}
            </span>
          </div>
          {outage.assignedToName && (
            <p className="text-xs text-primary font-medium mt-1">
              Assigned to: {outage.assignedToName}
            </p>
          )}
          {actions && (
            <div
              className="pt-3 mt-auto flex gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              {actions}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
