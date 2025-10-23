import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, GraduationCap, AlertCircle } from "lucide-react";
import { Scholarship } from "@/data/scholarships";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ActionPlanItem {
  scholarship: Scholarship;
  student: { id: string; name: string };
  status: "Not Started" | "In Progress" | "Submitted";
}

export default function TrackerPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<ActionPlanItem[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("all");

  useEffect(() => {
    const stored = localStorage.getItem("actionPlan");
    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, []);

  const students = Array.from(new Set(items.map(item => item.student.name)));
  
  const filteredItems = selectedStudent === "all" 
    ? items 
    : items.filter(item => item.student.name === selectedStudent);

  const notStarted = filteredItems.filter(item => item.status === "Not Started");
  const inProgress = filteredItems.filter(item => item.status === "In Progress");
  const submitted = filteredItems.filter(item => item.status === "Submitted");

  const getDaysUntilDeadline = (deadline: string) => {
    const days = Math.floor((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const StatusColumn = ({ 
    title, 
    items, 
    color 
  }: { 
    title: string; 
    items: ActionPlanItem[]; 
    color: string;
  }) => (
    <div className="flex-1">
      <div className={`p-4 rounded-t-lg border-b-4 bg-card`} style={{ borderColor: color }}>
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{items.length} scholarships</p>
      </div>
      <div className="space-y-3 p-4 bg-muted/30 rounded-b-lg min-h-[400px]">
        {items.map((item) => {
          const daysLeft = getDaysUntilDeadline(item.scholarship.deadline);
          const isUrgent = daysLeft < 14;
          
          return (
            <Card key={`${item.scholarship.id}-${item.student.id}`} className="p-4 space-y-2">
              <div className="flex items-start justify-between">
                <h4 className="font-medium text-sm">{item.scholarship.name}</h4>
                {isUrgent && <AlertCircle className="h-4 w-4 text-destructive" />}
              </div>
              <p className="text-xs text-muted-foreground">{item.student.name}</p>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {item.scholarship.amount}
                </Badge>
                <span className={`text-xs ${isUrgent ? "text-destructive font-semibold" : "text-muted-foreground"}`}>
                  {daysLeft} days left
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate("/students")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Scholarship Tracker</h1>
              <p className="text-sm text-muted-foreground">{items.length} total scholarships</p>
            </div>
          </div>
          <Button onClick={() => navigate("/action-plan")}>
            View Action Plan
          </Button>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold text-foreground">📊 Application Tracker</h2>
            {filteredItems.filter(item => getDaysUntilDeadline(item.scholarship.deadline) < 14).length > 0 && (
              <Badge variant="destructive">
                {filteredItems.filter(item => getDaysUntilDeadline(item.scholarship.deadline) < 14).length} Urgent
              </Badge>
            )}
          </div>
          
          {students.length > 0 && (
            <Select value={selectedStudent} onValueChange={setSelectedStudent}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by student" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                {students.map(student => (
                  <SelectItem key={student} value={student}>
                    {student}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {filteredItems.length === 0 ? (
          <div className="border rounded-lg bg-card p-12 text-center">
            <p className="text-muted-foreground text-lg">No scholarships to track yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Add scholarships to your action plan to track their progress
            </p>
            <Button 
              className="mt-4"
              onClick={() => navigate("/students")}
            >
              Browse Students
            </Button>
          </div>
        ) : (
          <div className="flex gap-6">
            <StatusColumn 
              title="Not Started" 
              items={notStarted}
              color="hsl(var(--muted-foreground))"
            />
            <StatusColumn 
              title="In Progress" 
              items={inProgress}
              color="hsl(var(--primary))"
            />
            <StatusColumn 
              title="Submitted" 
              items={submitted}
              color="hsl(var(--success))"
            />
          </div>
        )}
      </div>
    </div>
  );
}
