import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, Plus, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const Events = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    max_attendees: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const clubId = localStorage.getItem("clubId");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    if (!clubId) return;
    
    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("club_id", clubId)
      .order("date", { ascending: true });
    
    setEvents(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubId) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase.from("events").insert([
        { ...formData, club_id: clubId }
      ]);

      if (error) throw error;

      toast.success("Event created successfully!");
      setFormData({
        name: "",
        description: "",
        date: "",
        time: "",
        venue: "",
        max_attendees: 0,
      });
      fetchEvents();
    } catch (error) {
      toast.error("Failed to create event");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "outline"> = {
      upcoming: "default",
      completed: "secondary",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Events</h2>
          <p className="text-muted-foreground mt-1">Create and manage club events</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Create Event Form */}
          <Card className="p-6 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Plus className="h-5 w-5 text-accent" />
              <h3 className="text-xl font-bold">Create New Event</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Event Name</Label>
                <Input
                  id="name"
                  placeholder="Enter event name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Event description"
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
                <Label htmlFor="venue">Venue</Label>
                <Input
                  id="venue"
                  placeholder="Event venue"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max_attendees">Max Attendees</Label>
                <Input
                  id="max_attendees"
                  type="number"
                  min="0"
                  placeholder="Maximum number of attendees"
                  value={formData.max_attendees}
                  onChange={(e) => setFormData({ ...formData, max_attendees: parseInt(e.target.value) || 0 })}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-clubhive"
                disabled={isLoading}
              >
                <CalendarDays className="h-4 w-4 mr-2" />
                {isLoading ? "Creating..." : "Create Event"}
              </Button>
            </form>
          </Card>

          {/* Events List */}
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-xl font-bold mb-6">All Events</h3>

            {events.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">
                No events yet. Create your first event!
              </p>
            ) : (
              <div className="space-y-4">
                {events.map((event) => {
                  const progress = event.max_attendees > 0 
                    ? (event.current_attendees / event.max_attendees) * 100 
                    : 0;

                  return (
                    <Card key={event.id} className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-lg">{event.name}</h4>
                            {getStatusBadge(event.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {event.description}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="text-primary">
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                        <div className="flex items-center gap-2">
                          <span>📅</span>
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>🕐</span>
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>📍</span>
                          <span>{event.venue || "TBD"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>👥</span>
                          <span>{event.current_attendees}/{event.max_attendees || "∞"} attendees</span>
                        </div>
                      </div>

                      {event.max_attendees > 0 && (
                        <div className="space-y-1">
                          <Progress value={progress} className="h-2" />
                          <p className="text-xs text-muted-foreground text-right">
                            {Math.round(progress)}% capacity
                          </p>
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Events;
