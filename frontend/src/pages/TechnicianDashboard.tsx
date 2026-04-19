import { useAuth } from "@/contexts/AuthContext";
import { useOutages } from "@/hooks/useOutages";
import { StatsCard } from "@/components/StatsCard";
import { OutageCard } from "@/components/OutageCard";
import { Wrench, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Outage } from "@/types/oms";

export default function TechnicianDashboard() {
  const { user } = useAuth();
  const { outages, updateStatus, addResolutionNotes } = useOutages();
  const myAssigned = outages.filter((o) => o.assignedTo === user?.id);
  const inProgress = myAssigned.filter(
    (o) => o.status === "in_progress",
  ).length;
  const resolved = myAssigned.filter((o) => o.status === "resolved").length;

  const [resolveDialog, setResolveDialog] = useState(false);
  const [selectedOutage, setSelectedOutage] = useState<Outage | null>(null);
  const [notes, setNotes] = useState("");

  const handleResolve = () => {
    if (selectedOutage && notes.trim()) {
      addResolutionNotes(selectedOutage.id, notes);
      setResolveDialog(false);
      setNotes("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Technician Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your assigned outages and update their status.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard title="Assigned" value={myAssigned.length} icon={Wrench} />
        <StatsCard title="In Progress" value={inProgress} icon={Clock} />
        <StatsCard title="Resolved" value={resolved} icon={CheckCircle} />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-3">Assigned Outages</h2>
        {myAssigned.length === 0 ? (
          <p className="text-muted-foreground">
            No outages assigned to you yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myAssigned.map((o) => (
              <OutageCard
                key={o.id}
                outage={o}
                actions={
                  o.status === "resolved" ? (
                    <p className="text-xs text-muted-foreground italic">
                      Resolution: {o.resolutionNotes}
                    </p>
                  ) : (
                    <>
                      {o.status === "approved" && (
                        <Button
                          size="sm"
                          onClick={() => updateStatus(o.id, "in_progress")}
                        >
                          Start Work
                        </Button>
                      )}
                      {o.status === "in_progress" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedOutage(o);
                            setResolveDialog(true);
                          }}
                        >
                          Mark Resolved
                        </Button>
                      )}
                    </>
                  )
                }
              />
            ))}
          </div>
        )}
      </div>

      <Dialog open={resolveDialog} onOpenChange={setResolveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve Outage</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm font-medium">{selectedOutage?.title}</p>
            <div className="space-y-2">
              <label className="text-sm font-medium">Resolution Notes</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe what was done to resolve this outage..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResolveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleResolve} disabled={!notes.trim()}>
              Mark as Resolved
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
