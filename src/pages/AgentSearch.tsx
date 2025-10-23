import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { students, Student } from "@/data/students";
import { StudentProfile } from "@/components/StudentProfile";
import { AgentChat, ChatMessage } from "@/components/AgentChat";
import { Button } from "@/components/ui/button";
import { ArrowLeft, GraduationCap } from "lucide-react";
import { scholarshipMappings } from "@/data/mappings";

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

    await new Promise(resolve => setTimeout(resolve, 1500));

    setChatMessages(prev => [...prev, {
      role: "system",
      content: "🔍 Searching FastWeb...",
      timestamp: new Date()
    }]);

    await new Promise(resolve => setTimeout(resolve, 800));

    setChatMessages(prev => [...prev, {
      role: "system",
      content: "🔍 Searching ScholarshipOwl...",
      timestamp: new Date()
    }]);

    await new Promise(resolve => setTimeout(resolve, 800));

    setChatMessages(prev => [...prev, {
      role: "system",
      content: "📊 Filtering 300+ scholarships...",
      timestamp: new Date()
    }]);

    await new Promise(resolve => setTimeout(resolve, 1000));

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
              <h1 className="text-2xl font-bold text-foreground">Agent Search</h1>
              <p className="text-sm text-muted-foreground">{student.name} - {student.major}</p>
            </div>
          </div>
        </div>
      </header>

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
