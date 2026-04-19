import { useAuth } from "@/contexts/AuthContext";
import { useOutages } from "@/hooks/useOutages";
import { OutageCard } from "@/components/OutageCard";

export default function MyReportsPage() {
  const { user } = useAuth();
  const { outages } = useOutages();
  const myOutages = outages.filter((o) => o.reportedBy === user?.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Reports</h1>
        <p className="text-muted-foreground">All outages you have reported.</p>
      </div>
      {myOutages.length === 0 ? (
        <p className="text-muted-foreground">You haven't reported any outages yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {myOutages.map((o) => (
            <OutageCard key={o.id} outage={o} />
          ))}
        </div>
      )}
    </div>
  );
}
