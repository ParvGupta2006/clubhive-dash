import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-start">
        {/* Left side - Branding */}
        <div className="space-y-8">
          {/* Logo and title */}
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-clubhive flex items-center justify-center shadow-lg flex-shrink-0">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">
                Club<span className="bg-gradient-clubhive bg-clip-text text-transparent">Hive</span>
              </h1>
              <p className="text-gray-600 text-sm mt-1">Student Club Management System</p>
            </div>
          </div>

          {/* Features card */}
          <Card className="p-8 bg-white shadow-md">
            <h2 className="text-2xl font-bold mb-8">Unite. Lead. Achieve.</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-full flex-shrink-0">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Unite</h3>
                  <p className="text-gray-600">Bring students together</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-teal-100 rounded-full flex-shrink-0">
                  <Target className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Lead</h3>
                  <p className="text-gray-600">Develop leadership skills</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-100 rounded-full flex-shrink-0">
                  <Trophy className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Achieve</h3>
                  <p className="text-gray-600">Reach your goals together</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right side - Login form */}
        <Card className="p-8 bg-white shadow-md">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to your club account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-gradient-clubhive text-white hover:opacity-90 text-base"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => navigate("/register")}
              className="text-gray-700"
            >
              + Register Club
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-500">
            Demo credentials: any username/password
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Login;
