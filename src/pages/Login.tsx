import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/Logo";
import { Users, Target, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: club, error } = await supabase
        .from("clubs")
        .select("*")
        .eq("username", username)
        .eq("password", password)
        .maybeSingle();

      if (error) throw error;

      if (!club) {
        toast.error("Invalid credentials");
        setIsLoading(false);
        return;
      }

      // Store club info in localStorage
      localStorage.setItem("clubId", club.id);
      localStorage.setItem("clubName", club.name);
      
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-clubhive p-12 flex-col justify-center items-start text-white">
        <div className="max-w-md">
          <Logo size="large" />
          
          <div className="mt-16 space-y-8">
            <h2 className="text-3xl font-bold">Unite. Lead. Achieve.</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Unite</h3>
                  <p className="text-white/90">Bring students together</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Target className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Lead</h3>
                  <p className="text-white/90">Develop leadership skills</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Trophy className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Achieve</h3>
                  <p className="text-white/90">Reach your goals together</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-5xl font-bold bg-gradient-clubhive bg-clip-text text-transparent mb-2">
              ClubHive
            </h1>
            <p className="text-muted-foreground">A Student Club Management App</p>
          </div>
          
          <Card className="p-8 shadow-lg">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
              <p className="text-muted-foreground">Sign in to your club account</p>
            </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-clubhive text-white hover:opacity-90"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/register")}
              className="text-sm"
            >
              + Register Club
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Demo credentials: any username/password
          </p>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
