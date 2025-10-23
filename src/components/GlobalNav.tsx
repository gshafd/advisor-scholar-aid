import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, ListChecks, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export function GlobalNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path);

  return (
    <header className="border-b bg-card sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div 
            className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <GraduationCap className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Scholarship Finder Agent</h1>
            <p className="text-sm text-muted-foreground">AI-powered scholarship matching</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={isActive("/students") ? "default" : "ghost"}
            onClick={() => navigate("/students")}
            className={cn(!isActive("/students") && "text-muted-foreground")}
          >
            <Users className="h-4 w-4 mr-2" />
            Students
          </Button>
          <Button
            variant={isActive("/action-plan") ? "default" : "ghost"}
            onClick={() => navigate("/action-plan")}
            className={cn(!isActive("/action-plan") && "text-muted-foreground")}
          >
            <ListChecks className="h-4 w-4 mr-2" />
            Action Plan
          </Button>
          <Button
            variant={isActive("/tracker") ? "default" : "ghost"}
            onClick={() => navigate("/tracker")}
            className={cn(!isActive("/tracker") && "text-muted-foreground")}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Tracker
          </Button>
        </div>
      </div>
    </header>
  );
}
