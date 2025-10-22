import { Scholarship } from "@/data/scholarships";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Bell, Send, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ActionPlanItem {
  scholarship: Scholarship;
  status: "Not Started" | "In Progress" | "Submitted";
}

interface ActionPlanProps {
  items: ActionPlanItem[];
  onRemove: (scholarshipId: string) => void;
  onUpdateStatus: (scholarshipId: string, status: ActionPlanItem["status"]) => void;
}

export function ActionPlan({ items, onRemove, onUpdateStatus }: ActionPlanProps) {
  const handleSendPlan = () => {
    toast.success("Action plan successfully sent to student portal", {
      description: "The student will receive a notification with all scholarship details."
    });
  };

  const getStatusColor = (status: ActionPlanItem["status"]) => {
    switch (status) {
      case "Submitted": return "bg-secondary text-secondary-foreground";
      case "In Progress": return "bg-primary/10 text-primary";
      case "Not Started": return "bg-muted text-muted-foreground";
    }
  };

  const getDaysUntilDeadline = (deadline: string) => {
    return Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          📋 Scholarship Action Plan
          <Badge variant="secondary">{items.length}</Badge>
        </h3>
        {items.length > 0 && (
          <Button onClick={handleSendPlan} size="sm">
            <Send className="h-4 w-4 mr-2" />
            Send to Student
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg mb-2">No scholarships in action plan</p>
          <p className="text-sm">Click "Shortlist" on any scholarship to add it here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const daysLeft = getDaysUntilDeadline(item.scholarship.deadline);
            const isUrgent = daysLeft <= 30;
            
            return (
              <div
                key={item.scholarship.id}
                className="border rounded-lg p-4 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">
                      {item.scholarship.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">{item.scholarship.amount}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemove(item.scholarship.id)}
                    className="shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Deadline</p>
                    <div className="flex items-center gap-1">
                      <p className={`text-sm font-medium ${isUrgent ? 'text-destructive' : 'text-foreground'}`}>
                        {new Date(item.scholarship.deadline).toLocaleDateString()}
                      </p>
                      {isUrgent && <AlertCircle className="h-3 w-3 text-destructive" />}
                    </div>
                    {isUrgent && (
                      <p className="text-xs text-destructive">{daysLeft} days left</p>
                    )}
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <Select
                      value={item.status}
                      onValueChange={(value) => onUpdateStatus(item.scholarship.id, value as ActionPlanItem["status"])}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Not Started">Not Started</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Submitted">Submitted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end justify-end">
                    <Button variant="ghost" size="icon" title="Set Reminder">
                      <Bell className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
