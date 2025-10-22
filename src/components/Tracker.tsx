import { Scholarship } from "@/data/scholarships";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrackerItem {
  scholarship: Scholarship;
  status: "Not Started" | "In Progress" | "Submitted";
}

interface TrackerProps {
  items: TrackerItem[];
}

export function Tracker({ items }: TrackerProps) {
  const notStarted = items.filter(i => i.status === "Not Started");
  const inProgress = items.filter(i => i.status === "In Progress");
  const submitted = items.filter(i => i.status === "Submitted");

  const getDaysUntilDeadline = (deadline: string) => {
    return Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  };

  const StatusColumn = ({ 
    title, 
    items, 
    icon: Icon, 
    colorClass 
  }: { 
    title: string; 
    items: TrackerItem[]; 
    icon: any; 
    colorClass: string;
  }) => (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Icon className={cn("h-5 w-5", colorClass)} />
        <h3 className="font-semibold text-foreground">{title}</h3>
        <Badge variant="secondary">{items.length}</Badge>
      </div>
      
      <div className="space-y-3">
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No scholarships
          </p>
        ) : (
          items.map((item) => {
            const daysLeft = getDaysUntilDeadline(item.scholarship.deadline);
            const isUrgent = daysLeft <= 30 && item.status !== "Submitted";
            
            return (
              <div
                key={item.scholarship.id}
                className={cn(
                  "p-3 rounded-lg border bg-card hover:border-primary/50 transition-colors",
                  isUrgent && "border-destructive/50"
                )}
              >
                <h4 className="font-medium text-sm text-foreground mb-2">
                  {item.scholarship.name}
                </h4>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {item.scholarship.amount}
                  </span>
                  <div className="flex items-center gap-1">
                    {isUrgent && <AlertCircle className="h-3 w-3 text-destructive" />}
                    <span className={cn(
                      "font-medium",
                      isUrgent ? "text-destructive" : "text-muted-foreground"
                    )}>
                      {new Date(item.scholarship.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {isUrgent && (
                  <p className="text-xs text-destructive mt-1">
                    {daysLeft} days left!
                  </p>
                )}
              </div>
            );
          })
        )}
      </div>
    </Card>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Scholarship Tracker</h2>
        <div className="flex gap-2">
          <Badge variant="outline" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            {items.filter(i => getDaysUntilDeadline(i.scholarship.deadline) <= 30 && i.status !== "Submitted").length} Urgent
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatusColumn
          title="Not Started"
          items={notStarted}
          icon={Clock}
          colorClass="text-muted-foreground"
        />
        <StatusColumn
          title="In Progress"
          items={inProgress}
          icon={AlertCircle}
          colorClass="text-primary"
        />
        <StatusColumn
          title="Submitted"
          items={submitted}
          icon={CheckCircle2}
          colorClass="text-secondary"
        />
      </div>
    </div>
  );
}
