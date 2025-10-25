import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Logo } from "@/components/Logo";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  CalendarDays, 
  Megaphone, 
  Bell, 
  LogOut,
  Moon,
  Sun
} from "lucide-react";
import { NavLink } from "react-router-dom";

const navItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { title: "Manage Members", icon: Users, href: "/members" },
  { title: "Schedule Meetings", icon: Calendar, href: "/meetings" },
  { title: "Events", icon: CalendarDays, href: "/events" },
  { title: "Announcements", icon: Megaphone, href: "/announcements" },
  { title: "Notifications", icon: Bell, href: "/notifications" },
];

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [clubName, setClubName] = useState("");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const clubId = localStorage.getItem("clubId");
    const name = localStorage.getItem("clubName");
    
    if (!clubId) {
      navigate("/");
      return;
    }
    
    setClubName(name || "Club Admin");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("clubId");
    localStorage.removeItem("clubName");
    navigate("/");
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r">
          <SidebarContent className="flex flex-col h-full">
            <div className="p-6 border-b">
              <Logo />
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? "bg-gradient-clubhive text-white shadow-md"
                        : "hover:bg-sidebar-accent text-sidebar-foreground"
                    }`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.title}</span>
                </NavLink>
              ))}
            </nav>

            <div className="p-4 border-t">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Logout
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b bg-card flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-bold">ClubHive Admin</h1>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full"></span>
              </Button>

              <div className="flex items-center gap-2">
                <Avatar className="h-9 w-9">
                  <AvatarFallback className="bg-gradient-clubhive text-white">
                    {clubName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm">
                  <p className="font-medium">{clubName}</p>
                  <p className="text-muted-foreground text-xs">Club Administrator</p>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 overflow-auto bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
