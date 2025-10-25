import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Register = () => {
  const [formData, setFormData] = useState({
    clubName: "",
    username: "",
    password: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("clubs")
        .insert([
          {
            name: formData.clubName,
            username: formData.username,
            password: formData.password,
            description: formData.description,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success("Club registered successfully!");
      navigate("/");
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.code === "23505") {
        toast.error("Username already exists");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="mb-8">
          <Logo size="default" />
          <h2 className="text-2xl font-bold mt-6 mb-2">Register Your Club</h2>
          <p className="text-muted-foreground">Create a new club account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="clubName">Club Name</Label>
            <Input
              id="clubName"
              placeholder="Enter club name"
              value={formData.clubName}
              onChange={(e) => setFormData({ ...formData, clubName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              placeholder="Choose a username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Choose a password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Describe your club"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-clubhive text-white hover:opacity-90"
            disabled={isLoading}
          >
            {isLoading ? "Registering..." : "Register Club"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Button variant="ghost" onClick={() => navigate("/")} className="text-sm">
            Already have an account? Sign in
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Register;
