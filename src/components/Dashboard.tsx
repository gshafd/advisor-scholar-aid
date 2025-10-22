import { useState } from "react";
import { students, Student } from "@/data/students";
import { scholarships, Scholarship } from "@/data/scholarships";
import { scholarshipMappings } from "@/data/mappings";
import { StudentList } from "./StudentList";
import { StudentProfile } from "./StudentProfile";
import { AgentChat, ChatMessage } from "./AgentChat";
import { ScholarshipResults } from "./ScholarshipResults";
import { ScholarshipDetail } from "./ScholarshipDetail";
import { ActionPlan } from "./ActionPlan";
import { Tracker } from "./Tracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, LayoutDashboard, ListChecks } from "lucide-react";
import { toast } from "sonner";

interface ActionPlanItem {
  scholarship: Scholarship;
  status: "Not Started" | "In Progress" | "Submitted";
}

export function Dashboard() {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [matchedScholarships, setMatchedScholarships] = useState<Scholarship[]>([]);
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [actionPlanItems, setActionPlanItems] = useState<ActionPlanItem[]>([]);
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    setMatchedScholarships([]);
    setChatMessages([{
      role: "agent",
      content: `Hi 👋, I'm your Scholarship Finder Agent. I'll find the best external scholarships for ${student.name}.`,
      timestamp: new Date()
    }]);
    setActiveTab("dashboard");
  };

  const handleRunSearch = async () => {
    if (!selectedStudent) return;

    setIsSearching(true);
    setChatMessages(prev => [...prev, {
      role: "agent",
      content: "Searching trusted sources like FastWeb, ScholarshipOwl, and UN.org...",
      timestamp: new Date()
    }]);

    // Simulate search delay
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

    // Get matched scholarships from mapping
    const scholarshipIds = scholarshipMappings[selectedStudent.id] || [];
    const matched = scholarships.filter(s => scholarshipIds.includes(s.id));
    setMatchedScholarships(matched);

    setChatMessages(prev => [...prev, {
      role: "agent",
      content: `25 potential matches found. Filtering by eligibility... Here are the top ${matched.length} scholarships that match ${selectedStudent.name}'s profile.`,
      timestamp: new Date()
    }]);

    setIsSearching(false);
    toast.success(`Found ${matched.length} matching scholarships!`);
  };

  const handleShortlist = (scholarship: Scholarship) => {
    const exists = actionPlanItems.some(item => item.scholarship.id === scholarship.id);
    
    if (exists) {
      toast.info("Scholarship already in action plan");
      return;
    }

    setActionPlanItems(prev => [...prev, {
      scholarship,
      status: "Not Started"
    }]);

    setChatMessages(prev => [...prev, {
      role: "agent",
      content: `Added '${scholarship.name}' to ${selectedStudent?.name}'s Action Plan.`,
      timestamp: new Date()
    }]);

    toast.success("Added to Action Plan");
  };

  const handleRemoveFromPlan = (scholarshipId: string) => {
    setActionPlanItems(prev => prev.filter(item => item.scholarship.id !== scholarshipId));
    toast.success("Removed from Action Plan");
  };

  const handleUpdateStatus = (scholarshipId: string, status: ActionPlanItem["status"]) => {
    setActionPlanItems(prev => prev.map(item =>
      item.scholarship.id === scholarshipId ? { ...item, status } : item
    ));
    toast.success(`Status updated to ${status}`);
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Scholarship Finder Agent</h1>
              <p className="text-sm text-muted-foreground">AI-powered scholarship matching for advisors</p>
            </div>
          </div>
          
          <TabsList>
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="tracker" className="gap-2">
              <ListChecks className="h-4 w-4" />
              Tracker
            </TabsTrigger>
          </TabsList>
        </div>
      </header>

      <TabsContent value="dashboard" className="m-0">
        <div className="grid grid-cols-12 gap-6 p-6 h-[calc(100vh-88px)]">
          {/* Left Panel - Student List */}
          <div className="col-span-3 h-full overflow-hidden">
            <div className="h-full border rounded-lg bg-card">
              <StudentList
                students={students}
                onSelectStudent={handleSelectStudent}
                selectedStudentId={selectedStudent?.id}
              />
            </div>
          </div>

          {/* Center Panel - Agent Console */}
          <div className="col-span-5 h-full overflow-y-auto space-y-4">
            {selectedStudent ? (
              <>
                <StudentProfile
                  student={selectedStudent}
                  onRunSearch={handleRunSearch}
                  isSearching={isSearching}
                />
                <div className="h-96">
                  <AgentChat messages={chatMessages} isLoading={isSearching} />
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center border rounded-lg bg-card">
                <div className="text-center text-muted-foreground">
                  <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Select a student to begin</p>
                  <p className="text-sm">Choose a student from the list to start finding scholarships</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Scholarships & Action Plan */}
          <div className="col-span-4 h-full overflow-y-auto space-y-4">
            {matchedScholarships.length > 0 ? (
              <>
                <ScholarshipResults
                  scholarships={matchedScholarships}
                  onViewDetails={setSelectedScholarship}
                  onShortlist={handleShortlist}
                  shortlistedIds={actionPlanItems.map(item => item.scholarship.id)}
                />
                <ActionPlan
                  items={actionPlanItems}
                  onRemove={handleRemoveFromPlan}
                  onUpdateStatus={handleUpdateStatus}
                />
              </>
            ) : (
              <div className="h-full flex items-center justify-center border rounded-lg bg-card">
                <div className="text-center text-muted-foreground p-8">
                  <p className="text-lg mb-2">No search results yet</p>
                  <p className="text-sm">Run the scholarship finder to see matching opportunities</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </TabsContent>

      <TabsContent value="tracker" className="m-0">
        <div className="p-6">
          <Tracker items={actionPlanItems} />
        </div>
      </TabsContent>

      <ScholarshipDetail
        scholarship={selectedScholarship}
        open={selectedScholarship !== null}
        onOpenChange={(open) => !open && setSelectedScholarship(null)}
        onShortlist={() => selectedScholarship && handleShortlist(selectedScholarship)}
      />
    </Tabs>
  );
}
