import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Wrench } from "lucide-react";
import { User } from "@/types/oms";

const getToken = () => {
  const saved = localStorage.getItem("oms_user");
  return saved ? JSON.parse(saved).token : "";
};

export default function TechniciansPage() {
  const [technicians, setTechnicians] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/users/technicians", {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((res) => res.json())
      .then((data) => {
        // Map MongoDB _id to frontend id
        const mappedData = data.map((t: any) => ({ ...t, id: t._id }));
        setTechnicians(mappedData);
        setLoading(false);
      })
      .catch((err) => console.error("Error fetching technicians:", err));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Technicians</h1>
        <p className="text-muted-foreground">
          Manage and view all registered technicians.
        </p>
      </div>
      {loading ? (
        <p className="text-muted-foreground">Loading technicians...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {technicians.map((t) => (
            <Card key={t.id}>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{t.name}</p>
                    <p className="text-sm text-muted-foreground">{t.email}</p>
                    {t.specialization && (
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {t.specialization}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
