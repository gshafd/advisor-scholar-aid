import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { students } from "@/data/students";
import { scholarships, Scholarship } from "@/data/scholarships";
import { scholarshipMappings } from "@/data/mappings";
import { ScholarshipResults as ScholarshipResultsComponent } from "@/components/ScholarshipResults";
import { ScholarshipDetail } from "@/components/ScholarshipDetail";
import { Button } from "@/components/ui/button";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { toast } from "sonner";

export default function ScholarshipResults() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  const student = students.find((s) => s.id === studentId);
  
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);

  if (!student) {
    return <div>Student not found</div>;
  }

  const scholarshipIds = scholarshipMappings[student.id] || [];
  const matchedScholarships = scholarships.filter(s => scholarshipIds.includes(s.id));

  const handleShortlist = (scholarship: Scholarship) => {
    if (shortlistedIds.includes(scholarship.id)) {
      toast.info("Scholarship already shortlisted");
      return;
    }

    setShortlistedIds(prev => [...prev, scholarship.id]);
    
    // Store in localStorage with student info
    const existingPlan = JSON.parse(localStorage.getItem("actionPlan") || "[]");
    existingPlan.push({
      scholarship,
      student: { id: student.id, name: student.name },
      status: "Not Started"
    });
    localStorage.setItem("actionPlan", JSON.stringify(existingPlan));
    
    toast.success("Added to Action Plan");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => navigate(`/agent-search/${student.id}`)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Scholarship Results</h1>
              <p className="text-sm text-muted-foreground">{student.name} - {matchedScholarships.length} matches found</p>
            </div>
          </div>
          <Button onClick={() => navigate("/action-plan")}>
            View Action Plan
          </Button>
        </div>
      </header>

      <div className="p-6 max-w-6xl mx-auto">
        <ScholarshipResultsComponent
          scholarships={matchedScholarships}
          onViewDetails={setSelectedScholarship}
          onShortlist={handleShortlist}
          shortlistedIds={shortlistedIds}
        />
      </div>

      <ScholarshipDetail
        scholarship={selectedScholarship}
        open={selectedScholarship !== null}
        onOpenChange={(open) => !open && setSelectedScholarship(null)}
        onShortlist={() => selectedScholarship && handleShortlist(selectedScholarship)}
      />
    </div>
  );
}
