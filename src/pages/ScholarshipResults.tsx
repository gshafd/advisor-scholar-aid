import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { students } from "@/data/students";
import { scholarships, Scholarship } from "@/data/scholarships";
import { scholarshipMappings } from "@/data/mappings";
import { ScholarshipResults as ScholarshipResultsComponent } from "@/components/ScholarshipResults";
import { ScholarshipDetail } from "@/components/ScholarshipDetail";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { GlobalNav } from "@/components/GlobalNav";

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
      <GlobalNav />
      
      <div className="border-b bg-card px-6 py-3">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate(`/agent-search/${student.id}`)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Agent Search
        </Button>
        <div className="mt-2">
          <h2 className="text-xl font-bold text-foreground">Scholarship Results: {student.name}</h2>
          <p className="text-sm text-muted-foreground">{matchedScholarships.length} matches found</p>
        </div>
      </div>

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
