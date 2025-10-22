import { Scholarship } from "@/data/scholarships";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, FileText, Send, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ScholarshipDetailProps {
  scholarship: Scholarship | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShortlist: () => void;
}

export function ScholarshipDetail({ scholarship, open, onOpenChange, onShortlist }: ScholarshipDetailProps) {
  if (!scholarship) return null;

  const matchScoreNum = parseInt(scholarship.matchScore);
  const matchClass = matchScoreNum >= 90 ? "match-high" : matchScoreNum >= 80 ? "match-medium" : "match-low";

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

  const handleSendToStudent = () => {
    toast.success("Scholarship details sent to student portal");
  };

  const requiredDocuments = [
    "Official Academic Transcript",
    "Personal Statement / Essay",
    "Letter of Recommendation",
    "Proof of Enrollment",
    "Financial Need Documentation (if applicable)"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{scholarship.name}</DialogTitle>
              <DialogDescription>
                <a 
                  href={`https://${scholarship.source}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1 w-fit"
                >
                  Visit {scholarship.source}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </DialogDescription>
            </div>
            <Badge className={cn("text-sm px-3 py-1", matchClass)}>
              {scholarship.matchScore} Match
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-accent p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Award Amount</p>
              <p className="text-2xl font-bold text-foreground">{scholarship.amount}</p>
            </div>
            <div className="bg-accent p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Application Deadline</p>
              <p className="text-xl font-semibold text-foreground">
                {new Date(scholarship.deadline).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-foreground">Eligibility Criteria</h4>
            <p className="text-muted-foreground">{scholarship.eligibility}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-foreground">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {scholarship.tags.map((tag) => (
                <Badge key={tag} className={cn("text-sm", getTagClass(tag))}>
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2 text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Required Documents
            </h4>
            <ul className="space-y-2">
              {requiredDocuments.map((doc, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary mt-1">•</span>
                  {doc}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={onShortlist}
            >
              <Bookmark className="h-4 w-4 mr-2" />
              Save to Action Plan
            </Button>
            <Button 
              variant="default" 
              className="flex-1"
              onClick={handleSendToStudent}
            >
              <Send className="h-4 w-4 mr-2" />
              Send to Student
            </Button>
            <Button
              className="flex-1"
              onClick={() => window.open(`https://${scholarship.source}`, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in Browser
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
