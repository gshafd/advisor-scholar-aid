import { Scholarship } from "@/data/scholarships";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Info, Plus, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScholarshipCardProps {
  scholarship: Scholarship;
  onViewDetails: () => void;
  onShortlist: () => void;
  isShortlisted: boolean;
}

export function ScholarshipCard({ scholarship, onViewDetails, onShortlist, isShortlisted }: ScholarshipCardProps) {
  const matchScoreNum = parseInt(scholarship.matchScore);
  const matchClass = matchScoreNum >= 90 ? "match-high" : matchScoreNum >= 80 ? "match-medium" : "match-low";
  
  const deadlineDate = new Date(scholarship.deadline);
  const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysUntilDeadline <= 30;

  const getTagClass = (tag: string) => {
    const tagLower = tag.toLowerCase();
    if (tagLower.includes("stem")) return "tag-stem";
    if (tagLower.includes("female")) return "tag-female";
    if (tagLower.includes("international")) return "tag-international";
    if (tagLower.includes("need")) return "tag-need";
    if (tagLower.includes("veteran")) return "tag-veteran";
    if (tagLower.includes("leadership")) return "tag-leadership";
    if (tagLower.includes("arts") || tagLower.includes("creative")) return "tag-arts";
    if (tagLower.includes("tech")) return "tag-tech";
    if (tagLower.includes("sustainability")) return "tag-sustainability";
    return "bg-muted text-muted-foreground";
  };

  return (
    <Card className="p-5 scholarship-card hover:border-primary/50">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-foreground leading-tight mb-1">
              {scholarship.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Source: </span>
              <a 
                href={`https://${scholarship.source}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-1"
              >
                {scholarship.source}
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
          <Badge className={cn("text-xs px-2 py-1", matchClass)}>
            {scholarship.matchScore} Match
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-muted-foreground">Amount:</span>
            <p className="font-bold text-lg text-foreground">{scholarship.amount}</p>
          </div>
          <div>
            <span className="text-muted-foreground flex items-center gap-1">
              Deadline:
              {isUrgent && <AlertCircle className="h-3 w-3 text-destructive" />}
            </span>
            <p className={cn("font-semibold", isUrgent && "text-destructive")}>
              {new Date(scholarship.deadline).toLocaleDateString()}
            </p>
            {isUrgent && (
              <p className="text-xs text-destructive">{daysUntilDeadline} days left</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {scholarship.tags.map((tag) => (
            <Badge key={tag} className={cn("text-xs", getTagClass(tag))}>
              {tag}
            </Badge>
          ))}
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{scholarship.eligibility}</p>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onViewDetails} className="flex-1">
            <Info className="h-4 w-4 mr-1" />
            Details
          </Button>
          <Button 
            size="sm" 
            onClick={onShortlist}
            variant={isShortlisted ? "secondary" : "default"}
            className="flex-1"
          >
            <Plus className="h-4 w-4 mr-1" />
            {isShortlisted ? "Shortlisted" : "Shortlist"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
