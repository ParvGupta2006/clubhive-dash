import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Bell, CheckCircle, Info, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Notifications = () => {
  const notifications = [
    {
      id: 1,
      type: "info",
      title: "New member joined",
      message: "John Smith has joined the club",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      type: "success",
      title: "Meeting scheduled",
      message: "Weekly team meeting has been scheduled for tomorrow",
      time: "4 hours ago",
      read: false,
    },
    {
      id: 3,
      type: "warning",
      title: "Event reminder",
      message: "Tech Workshop starts in 2 days",
      time: "1 day ago",
      read: true,
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold">Notifications</h2>
            <p className="text-muted-foreground mt-1">Stay updated with club activities</p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {notifications.filter(n => !n.read).length} new
          </Badge>
        </div>

        <Card className="p-6">
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-colors ${
                  notification.read ? "bg-card" : "bg-accent/5 border-primary"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">{getIcon(notification.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold">{notification.title}</h4>
                      {!notification.read && (
                        <Badge variant="default" className="text-xs">New</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          <Bell className="h-4 w-4 inline mr-1" />
          You're all caught up!
        </p>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
