import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Send, X, ExternalLink } from "lucide-react";
import { scholarships, Scholarship } from "@/data/scholarships";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ActionItem {
  scholarship: Scholarship;
  status: "Not Started" | "In Progress" | "Submitted";
}

export default function StudentActionPlan() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);

  useEffect(() => {
    const storedProfile = localStorage.getItem("currentStudentProfile");
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }

    const shortlisted = JSON.parse(localStorage.getItem("studentShortlist") || "[]");
    const items: ActionItem[] = shortlisted.map((id: string) => {
      const scholarship = scholarships.find(s => s.id === id);
      return {
        scholarship: scholarship!,
        status: "Not Started" as const
      };
    }).filter((item: ActionItem) => item.scholarship);

    setActionItems(items);
  }, []);

  const handleUpdateStatus = (scholarshipId: string, status: ActionItem["status"]) => {
    setActionItems(prev =>
      prev.map(item =>
        item.scholarship.id === scholarshipId ? { ...item, status } : item
      )
    );
    toast.success(`Status updated to ${status}`);
  };

  const handleRemove = (scholarshipId: string) => {
    setActionItems(prev => prev.filter(item => item.scholarship.id !== scholarshipId));
    
    // Update localStorage
    const shortlisted = JSON.parse(localStorage.getItem("studentShortlist") || "[]");
    const updated = shortlisted.filter((id: string) => id !== scholarshipId);
    localStorage.setItem("studentShortlist", JSON.stringify(updated));
    
    toast.success("Removed from Action Plan");
  };

  const handleSendToAdmin = () => {
    if (!profile) return;

    // Get existing admin action plan
    const adminPlan = JSON.parse(localStorage.getItem("actionPlan") || "[]");
    
    // Add student items to admin plan
    const newItems = actionItems.map(item => ({
      scholarship: item.scholarship,
      student: {
        id: profile.studentId,
        name: profile.name
      },
      status: item.status
    }));

    const updated = [...adminPlan, ...newItems];
    localStorage.setItem("actionPlan", JSON.stringify(updated));
    
    toast.success("✓ Action Plan sent to advisor portal!");
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <header className="border-b bg-card p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/student-results")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Results
          </Button>
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground">My Action Plan</h1>
            <p className="text-sm text-muted-foreground">{profile.name} • {actionItems.length} scholarships</p>
          </div>
          <Button onClick={() => navigate("/")} variant="outline">
            Return Home
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Student Info Card */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">{profile.name}</h2>
              <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                <span>ID: {profile.studentId}</span>
                <span>GPA: {profile.gpa}</span>
                <span>Major: {profile.stream}</span>
              </div>
            </div>
            {actionItems.length > 0 && (
              <Button onClick={handleSendToAdmin}>
                <Send className="h-4 w-4 mr-2" />
                Send to Advisor
              </Button>
            )}
          </div>
        </Card>

        {actionItems.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground text-lg">No scholarships in your action plan yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Go back to results and shortlist scholarships you're interested in
            </p>
            <Button className="mt-4" onClick={() => navigate("/student-results")}>
              Browse Scholarships
            </Button>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scholarship Name</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Required Docs</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {actionItems.map((item) => (
                  <TableRow key={item.scholarship.id}>
                    <TableCell className="font-medium">{item.scholarship.name}</TableCell>
                    <TableCell>{item.scholarship.amount}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {item.scholarship.deadline}
                        {new Date(item.scholarship.deadline).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000 && (
                          <span className="text-destructive">⚠️</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={item.status}
                        onValueChange={(value) =>
                          handleUpdateStatus(item.scholarship.id, value as ActionItem["status"])
                        }
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Not Started">Not Started</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Submitted">Submitted</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-muted-foreground">
                        Transcript, Essay, LORs
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => window.open(item.scholarship.source, "_blank")}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemove(item.scholarship.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            💡 Tip: Send your action plan to your advisor to get help with applications
          </p>
        </div>
      </div>
    </div>
  );
}
