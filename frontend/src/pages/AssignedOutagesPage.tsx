import { useAuth } from "@/contexts/AuthContext";
import { useOutages } from "@/hooks/useOutages";
import { OutageCard } from "@/components/OutageCard";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useState } from "react";
import { Outage } from "@/types/oms";

export default function AssignedOutagesPage() {
  const { user } = useAuth();
  const { outages, updateStatus, addResolutionNotes } = useOutages();
  const assigned = outages.filter((o) => o.assignedTo === user?.id);

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
        <h1 className="text-2xl font-bold">Assigned Outages</h1>
        <p className="text-muted-foreground">Outages assigned to you for resolution.</p>
      </div>
      {assigned.length === 0 ? (
        <p className="text-muted-foreground">No outages assigned to you.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assigned.map((o) => (
            <OutageCard
              key={o.id}
              outage={o}
              actions={
                o.status !== "resolved" ? (
                  <>
                    {o.status !== "in_progress" && (
                      <Button size="sm" onClick={() => updateStatus(o.id, "in_progress")}>Start Work</Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => { setSelectedOutage(o); setResolveDialog(true); }}>
                      Resolve
                    </Button>
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground italic">✓ {o.resolutionNotes}</p>
                )
              }
            />
          ))}
        </div>
      )}

      <Dialog open={resolveDialog} onOpenChange={setResolveDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Resolve Outage</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm font-medium">{selectedOutage?.title}</p>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Resolution notes..." rows={4} />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResolveDialog(false)}>Cancel</Button>
            <Button onClick={handleResolve} disabled={!notes.trim()}>Resolve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
