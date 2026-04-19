import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Notification } from "@/types/oms";

const getToken = () => {
  const saved = localStorage.getItem("oms_user");
  return saved ? JSON.parse(saved).token : "";
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Fetch real notifications from the backend
  useEffect(() => {
    if (user?.id) {
      fetch(`http://localhost:5000/api/notifications/${user.id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      })
        .then((res) => res.json())
        .then((data) => setNotifications(data))
        .catch((err) => console.error("Error fetching notifications:", err));
    }
  }, [user?.id]);

  const markRead = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const markAllRead = async () => {
    if (!user?.id) return;
    try {
      await fetch(
        `http://localhost:5000/api/notifications/user/${user.id}/read-all`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${getToken()}` },
        },
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">
            Stay updated on your outage reports.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={markAllRead}>
          Mark all read
        </Button>
      </div>

      {notifications.length === 0 ? (
        <p className="text-muted-foreground">No notifications yet.</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <Card key={n.id} className={n.read ? "opacity-60" : ""}>
              <CardContent className="p-4 flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${n.read ? "bg-muted" : "bg-primary/10"}`}
                >
                  <Bell
                    className={`w-4 h-4 ${n.read ? "text-muted-foreground" : "text-primary"}`}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{n.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </p>
                </div>
                {!n.read && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => markRead(n.id)}
                  >
                    <Check className="w-3 h-3" />
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
