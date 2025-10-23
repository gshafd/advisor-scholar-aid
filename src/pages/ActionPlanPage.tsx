import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Send, X } from "lucide-react";
import { toast } from "sonner";
import { GlobalNav } from "@/components/GlobalNav";
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
import { Scholarship } from "@/data/scholarships";

interface ActionPlanItem {
  scholarship: Scholarship;
  student: { id: string; name: string };
  status: "Not Started" | "In Progress" | "Submitted";
}

export default function ActionPlanPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<ActionPlanItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("actionPlan");
    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, []);

  const handleUpdateStatus = (scholarshipId: string, status: ActionPlanItem["status"]) => {
    const updated = items.map(item =>
      item.scholarship.id === scholarshipId ? { ...item, status } : item
    );
    setItems(updated);
    localStorage.setItem("actionPlan", JSON.stringify(updated));
    toast.success(`Status updated to ${status}`);
  };

  const handleRemove = (scholarshipId: string) => {
    const updated = items.filter(item => item.scholarship.id !== scholarshipId);
    setItems(updated);
    localStorage.setItem("actionPlan", JSON.stringify(updated));
    toast.success("Removed from Action Plan");
  };

  const handleSendPlan = () => {
    toast.success("Action plan sent to student portal!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Not Started":
        return "secondary";
      case "In Progress":
        return "default";
      case "Submitted":
        return "success";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />

      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-foreground">📋 Scholarship Action Plan</h2>
          {items.length > 0 && (
            <Button onClick={handleSendPlan}>
              <Send className="h-4 w-4 mr-2" />
              Send Action Plan to Student
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="border rounded-lg bg-card p-12 text-center">
            <p className="text-muted-foreground text-lg">No scholarships in action plan yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Search for scholarships and shortlist them to add them here
            </p>
            <Button 
              className="mt-4"
              onClick={() => navigate("/students")}
            >
              Browse Students
            </Button>
          </div>
        ) : (
          <div className="border rounded-lg bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Scholarship Name</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={`${item.scholarship.id}-${item.student.id}`}>
                    <TableCell className="font-medium">{item.scholarship.name}</TableCell>
                    <TableCell>{item.student.name}</TableCell>
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
                        onValueChange={(value) => handleUpdateStatus(item.scholarship.id, value as ActionPlanItem["status"])}
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
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemove(item.scholarship.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
