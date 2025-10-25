import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Plus } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const Meetings = () => {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    expected_attendees: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const clubId = localStorage.getItem("clubId");

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    if (!clubId) return;
    
    const { data } = await supabase
      .from("meetings")
      .select("*")
      .eq("club_id", clubId)
      .order("date", { ascending: true });
    
    setMeetings(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubId) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase.from("meetings").insert([
        { ...formData, club_id: clubId }
      ]);

      if (error) throw error;

      // Add activity
      await supabase.from("activities").insert([
        { club_id: clubId, description: `Weekly meeting scheduled for tomorrow`, icon_type: "calendar" }
      ]);

      toast.success("Meeting scheduled successfully!");
      setFormData({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        expected_attendees: 0,
      });
      fetchMeetings();
    } catch (error) {
      toast.error("Failed to schedule meeting");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Schedule Meetings</h2>
          <p className="text-muted-foreground mt-1">Schedule and manage club meetings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Schedule Form */}
          <Card className="p-6 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Plus className="h-5 w-5 text-accent" />
              <h3 className="text-xl font-bold">Schedule New Meeting</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Meeting Title</Label>
                <Input
                  id="title"
                  placeholder="Enter meeting title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Meeting description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Meeting location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="attendees">Expected Attendees</Label>
                <Input
                  id="attendees"
                  type="number"
                  min="0"
                  value={formData.expected_attendees}
                  onChange={(e) => setFormData({ ...formData, expected_attendees: parseInt(e.target.value) || 0 })}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-clubhive"
                disabled={isLoading}
              >
                <Calendar className="h-4 w-4 mr-2" />
                {isLoading ? "Scheduling..." : "Schedule Meeting"}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground mt-4 flex items-start gap-2">
              <span>ℹ️</span>
              <span>All club members will be automatically notified when you schedule a meeting.</span>
            </p>
          </Card>

          {/* Meetings List */}
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-xl font-bold mb-6">Upcoming Meetings</h3>

            {meetings.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">
                No meetings scheduled yet. Create your first meeting!
              </p>
            ) : (
              <div className="space-y-4">
                {meetings.map((meeting) => (
                  <Card key={meeting.id} className="p-4 border-l-4 border-primary">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-lg">{meeting.title}</h4>
                          <Badge variant="secondary">{meeting.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {meeting.description}
                        </p>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center gap-2">
                            <span>📅</span>
                            <span>{new Date(meeting.date).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>🕐</span>
                            <span>{meeting.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>📍</span>
                            <span>{meeting.location || "TBD"}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>👥</span>
                            <span>{meeting.expected_attendees} expected attendees</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Meetings;
