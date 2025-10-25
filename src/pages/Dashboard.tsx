import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Users, Calendar, CalendarDays, Megaphone, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    upcomingMeetings: 0,
    activeEvents: 0,
    announcements: 0,
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [meetings, setMeetings] = useState<any[]>([]);
  const clubId = localStorage.getItem("clubId");

  useEffect(() => {
    if (!clubId) return;

    const fetchData = async () => {
      const [membersRes, meetingsRes, eventsRes, announcementsRes, activitiesRes] = await Promise.all([
        supabase.from("members").select("*", { count: "exact" }).eq("club_id", clubId),
        supabase.from("meetings").select("*", { count: "exact" }).eq("club_id", clubId).eq("status", "upcoming"),
        supabase.from("events").select("*", { count: "exact" }).eq("club_id", clubId).eq("status", "upcoming"),
        supabase.from("announcements").select("*", { count: "exact" }).eq("club_id", clubId),
        supabase.from("activities").select("*").eq("club_id", clubId).order("created_at", { ascending: false }).limit(4),
      ]);

      setStats({
        totalMembers: membersRes.count || 0,
        upcomingMeetings: meetingsRes.count || 0,
        activeEvents: eventsRes.count || 0,
        announcements: announcementsRes.count || 0,
      });

      setActivities(activitiesRes.data || []);
      
      const upcomingMeetings = await supabase
        .from("meetings")
        .select("*")
        .eq("club_id", clubId)
        .eq("status", "upcoming")
        .order("date", { ascending: true })
        .limit(3);
      
      setMeetings(upcomingMeetings.data || []);
    };

    fetchData();
  }, [clubId]);

  const statCards = [
    { title: "Total Members", value: stats.totalMembers, change: "+5 this week", icon: Users, color: "bg-blue-500" },
    { title: "Upcoming Meetings", value: stats.upcomingMeetings, change: "+1 this week", icon: Calendar, color: "bg-purple-500" },
    { title: "Active Events", value: stats.activeEvents, change: "0 this week", icon: CalendarDays, color: "bg-blue-500" },
    { title: "Announcements", value: stats.announcements, change: "+2 this week", icon: Megaphone, color: "bg-purple-500" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <Card className="bg-gradient-clubhive text-white p-8 rounded-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">Welcome back, Club! 👋</h2>
              <p className="text-white/90">Ready to manage your club today?</p>
            </div>
            <Button className="bg-accent hover:bg-accent/90">
              Quick Actions
            </Button>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => (
            <Card key={stat.title} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  <p className="text-sm text-accent mt-2">{stat.change}</p>
                </div>
                <div className={`p-3 ${stat.color} rounded-xl`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Recent Activities</h3>
              <Button variant="link" className="text-primary">View All</Button>
            </div>
            <div className="space-y-4">
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(activity.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No recent activities</p>
              )}
            </div>
          </Card>

          {/* Upcoming Meetings */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">Upcoming Meetings</h3>
              <Link to="/meetings">
                <Button variant="link" className="text-primary">+ Schedule</Button>
              </Link>
            </div>
            <div className="space-y-4">
              {meetings.length > 0 ? (
                meetings.map((meeting) => (
                  <div key={meeting.id} className="border-l-4 border-primary pl-4 py-2">
                    <h4 className="font-semibold">{meeting.title}</h4>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>📅 {new Date(meeting.date).toLocaleDateString()}</span>
                      <span>🕐 {meeting.time}</span>
                    </div>
                    <p className="text-sm mt-1">📍 {meeting.location}</p>
                    <p className="text-sm mt-1">👥 {meeting.expected_attendees} expected attendees</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">No upcoming meetings</p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
