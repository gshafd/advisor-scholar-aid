import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { students, Student } from "@/data/students";
import { StudentProfile } from "@/components/StudentProfile";
import { AgentChat, ChatMessage } from "@/components/AgentChat";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { scholarshipMappings } from "@/data/mappings";
import { GlobalNav } from "@/components/GlobalNav";

export default function AgentSearch() {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  
  const student = students.find((s) => s.id === studentId);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: "agent",
      content: `Hi 👋, I'm your Scholarship Finder Agent. I'll find the best external scholarships for ${student?.name}.`,
      timestamp: new Date()
    }
  ]);
  const [isSearching, setIsSearching] = useState(false);

  if (!student) {
    return <div>Student not found</div>;
  }

  const handleRunSearch = async () => {
    setIsSearching(true);
    setChatMessages(prev => [...prev, {
      role: "agent",
      content: "Searching trusted sources like FastWeb, ScholarshipOwl, and UN.org...",
      timestamp: new Date()
    }]);

    await new Promise(resolve => setTimeout(resolve, 2000));

    setChatMessages(prev => [...prev, {
      role: "system",
      content: "🔍 Searching ScholarshipOwl...",
      timestamp: new Date()
    }]);

    await new Promise(resolve => setTimeout(resolve, 1500));

    setChatMessages(prev => [...prev, {
      role: "system",
      content: "🔍 Searching FastWeb...",
      timestamp: new Date()
    }]);

    await new Promise(resolve => setTimeout(resolve, 1500));

    setChatMessages(prev => [...prev, {
      role: "system",
      content: "📊 Filtering 300+ scholarships by eligibility...",
      timestamp: new Date()
    }]);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const scholarshipIds = scholarshipMappings[student.id] || [];
    
    setChatMessages(prev => [...prev, {
      role: "agent",
      content: `25 potential matches found. Filtering by eligibility... Here are the top ${scholarshipIds.length} scholarships that match ${student.name}'s profile.`,
      timestamp: new Date()
    }]);

    setIsSearching(false);
    
    // Navigate to results page with student ID
    setTimeout(() => {
      navigate(`/scholarship-results/${student.id}`);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />
      
      <div className="border-b bg-card px-6 py-3">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate("/students")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Students
        </Button>
        <div className="mt-2">
          <h2 className="text-xl font-bold text-foreground">Agent Search: {student.name}</h2>
          <p className="text-sm text-muted-foreground">{student.major} - GPA: {student.GPA}</p>
        </div>
      </div>

      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <StudentProfile
          student={student}
          onRunSearch={handleRunSearch}
          isSearching={isSearching}
        />
        
        <div className="h-96">
          <AgentChat messages={chatMessages} isLoading={isSearching} />
        </div>
      </div>
    </div>
  );
}
