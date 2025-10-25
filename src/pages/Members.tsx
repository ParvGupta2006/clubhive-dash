import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const Members = () => {
  const [members, setMembers] = useState<any[]>([]);
  const [formData, setFormData] = useState({ name: "", email: "", role: "" });
  const [isLoading, setIsLoading] = useState(false);
  const clubId = localStorage.getItem("clubId");

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    if (!clubId) return;
    
    const { data } = await supabase
      .from("members")
      .select("*")
      .eq("club_id", clubId)
      .order("joined_at", { ascending: false });
    
    setMembers(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clubId) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase.from("members").insert([
        { ...formData, club_id: clubId }
      ]);

      if (error) throw error;

      // Add activity
      await supabase.from("activities").insert([
        { club_id: clubId, description: `${formData.name} joined the club`, icon_type: "user" }
      ]);

      toast.success("Member added successfully!");
      setFormData({ name: "", email: "", role: "" });
      fetchMembers();
    } catch (error) {
      toast.error("Failed to add member");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    
    const { error } = await supabase.from("members").delete().eq("id", id);
    
    if (error) {
      toast.error("Failed to remove member");
    } else {
      toast.success("Member removed");
      fetchMembers();
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold">Manage Members</h2>
          <p className="text-muted-foreground mt-1">Add and manage club members</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Member Form */}
          <Card className="p-6 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Plus className="h-5 w-5 text-accent" />
              <h3 className="text-xl font-bold">Add New Member</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="Member name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="member@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input
                  id="role"
                  placeholder="e.g., President, Member"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-clubhive"
                disabled={isLoading}
              >
                {isLoading ? "Adding..." : "Add Member"}
              </Button>
            </form>
          </Card>

          {/* Members List */}
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-xl font-bold mb-6">All Members ({members.length})</h3>

            {members.length === 0 ? (
              <p className="text-center text-muted-foreground py-12">
                No members yet. Add your first member!
              </p>
            ) : (
              <div className="space-y-3">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/5 transition-colors">
                    <div>
                      <h4 className="font-semibold">{member.name}</h4>
                      <p className="text-sm text-muted-foreground">{member.email || "No email"}</p>
                      <p className="text-sm text-muted-foreground">{member.role || "Member"}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Joined: {new Date(member.joined_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(member.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Members;
