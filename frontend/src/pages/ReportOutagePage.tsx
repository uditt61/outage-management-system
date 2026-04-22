import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useOutages } from "@/hooks/useOutages";
import { OutageType } from "@/types/oms";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import LocationPicker from "@/components/LocationPicker";

export default function ReportOutagePage() {
  const { user } = useAuth();
  const { addOutage } = useOutages();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<OutageType>("electricity");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [position, setPosition] = useState<[number, number] | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !location.trim() || !position) {
      toast({
        title: "Please fill all fields and pinpoint the location on the map",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addOutage({
        title,
        description,
        location,
        type,
        reportedBy: user!.id,
        reportedByName: user!.name,
        latitude: position[0],
        longitude: position[1],
      });
      toast({ title: "Outage reported successfully!" });
      navigate("/my-reports");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-destructive/10 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <CardTitle>Report an Outage</CardTitle>
              <CardDescription>
                Fill in the details below to submit an outage report.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Power outage on Main Street"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Outage Type</Label>
              <Select
                value={type}
                onValueChange={(v) => setType(v as OutageType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="electricity">⚡ Electricity</SelectItem>
                  <SelectItem value="internet">🌐 Internet</SelectItem>
                  <SelectItem value="water">💧 Water</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. 123 Main St, Downtown"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Pinpoint on Map</Label>
              <LocationPicker position={position} setPosition={setPosition} />
              {position && (
                <p className="text-xs text-muted-foreground">
                  Selected: {position[0].toFixed(4)}, {position[1].toFixed(4)}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide details about the outage..."
                rows={4}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Report"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
