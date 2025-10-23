import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Sparkles, Target, TrendingUp } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-6">
      <div className="max-w-4xl w-full text-center space-y-8">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="h-20 w-20 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <GraduationCap className="h-12 w-12 text-primary-foreground" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-foreground">
            🎓 Scholarship Finder Agent
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AI-powered scholarship matching for advisors. Find the best opportunities for your students.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12">
          <div className="p-6 rounded-lg border bg-card space-y-3">
            <Sparkles className="h-8 w-8 text-primary mx-auto" />
            <h3 className="font-semibold text-foreground">AI-Powered Matching</h3>
            <p className="text-sm text-muted-foreground">
              Smart algorithms match students with the most relevant scholarships
            </p>
          </div>
          <div className="p-6 rounded-lg border bg-card space-y-3">
            <Target className="h-8 w-8 text-primary mx-auto" />
            <h3 className="font-semibold text-foreground">Personalized Results</h3>
            <p className="text-sm text-muted-foreground">
              Tailored recommendations based on profile, major, and need
            </p>
          </div>
          <div className="p-6 rounded-lg border bg-card space-y-3">
            <TrendingUp className="h-8 w-8 text-primary mx-auto" />
            <h3 className="font-semibold text-foreground">Track Progress</h3>
            <p className="text-sm text-muted-foreground">
              Manage applications and deadlines in one place
            </p>
          </div>
        </div>

        <Button 
          onClick={() => navigate("/students")}
          size="lg"
          className="text-lg px-8 py-6 h-auto"
        >
          Enter Agent
        </Button>
      </div>
    </div>
  );
}
