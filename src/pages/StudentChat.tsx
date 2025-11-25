import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Edit2, CheckCircle } from "lucide-react";
import { students, Student } from "@/data/students";
import { toast } from "sonner";

interface ChatMessage {
  role: "assistant" | "user";
  content: string;
  timestamp: Date;
  buttons?: { label: string; action: string }[];
}

interface StudentProfile {
  name: string;
  studentId: string;
  gpa: number;
  nationality: string;
  stream: string;
  parentalIncome: string;
  otherDetails: string;
  university?: string;
}

export default function StudentChat() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [profile, setProfile] = useState<Partial<StudentProfile>>({});
  const [currentStep, setCurrentStep] = useState<string>("welcome");
  const [isCollecting, setIsCollecting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Welcome message
    addMessage("assistant", "Hi! I'm the Scholarship Assistant 👋 — I can help you find scholarships tailored for you. Would you like me to ask a few quick questions or fetch your profile from your college portal?", [
      { label: "Ask me", action: "ask_me" },
      { label: "Fetch from portal", action: "fetch_portal" }
    ]);
  }, []);

  const addMessage = (role: "assistant" | "user", content: string, buttons?: { label: string; action: string }[]) => {
    setMessages(prev => [...prev, { role, content, timestamp: new Date(), buttons }]);
  };

  const handleButtonClick = (action: string) => {
    if (action === "ask_me") {
      setIsCollecting(true);
      setCurrentStep("name");
      addMessage("assistant", "Great! Let's start. What's your name?");
    } else if (action === "fetch_portal") {
      setCurrentStep("fetch_id");
      addMessage("assistant", "Please enter your Student ID to fetch your profile.");
    } else if (action === "search_now") {
      handleSearchScholarships();
    } else if (action === "edit_profile") {
      setCurrentStep("name");
      setIsCollecting(true);
      addMessage("assistant", "Sure! Let's update your profile. What's your name?");
    }
  };

  const fetchProfile = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      const fetchedProfile: StudentProfile = {
        name: student.name,
        studentId: student.id,
        gpa: student.GPA,
        nationality: student.nationality,
        stream: student.major,
        parentalIncome: student.financialNeed === "High" ? "< $25k" : student.financialNeed === "Medium" ? "$25k - $50k" : "$50k - $100k",
        otherDetails: student.tags.join(", "),
        university: "Demo University"
      };
      setProfile(fetchedProfile);
      
      toast.success("✓ Profile fetched from college portal");
      
      addMessage("assistant", `Profile fetched successfully! Here's what I found:\n\n• Name: ${fetchedProfile.name}\n• Student ID: ${fetchedProfile.studentId}\n• GPA: ${fetchedProfile.gpa}\n• Nationality: ${fetchedProfile.nationality}\n• Stream: ${fetchedProfile.stream}\n• Parental Income: ${fetchedProfile.parentalIncome}\n• Other details: ${fetchedProfile.otherDetails}\n• University: ${fetchedProfile.university}\n\nWould you like to update any of these? (Edit inline on the right or type 'edit' to change)`, [
        { label: "Search Now", action: "search_now" },
        { label: "Edit Profile", action: "edit_profile" }
      ]);
      setCurrentStep("ready");
    } else {
      toast.error("No profile found");
      addMessage("assistant", "❌ No profile found — please enter your details manually. Let's start with your name:");
      setCurrentStep("name");
      setIsCollecting(true);
    }
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    addMessage("user", userMessage);
    setInput("");

    if (currentStep === "fetch_id") {
      fetchProfile(userMessage);
      return;
    }

    if (isCollecting) {
      processCollectionStep(userMessage);
    }
  };

  const processCollectionStep = (value: string) => {
    switch (currentStep) {
      case "name":
        setProfile(prev => ({ ...prev, name: value }));
        addMessage("assistant", `✔️ Noted: Name = ${value}. What's your Student ID?`);
        setCurrentStep("studentId");
        break;
      
      case "studentId":
        setProfile(prev => ({ ...prev, studentId: value }));
        addMessage("assistant", `✔️ Noted: Student ID = ${value}. What's your GPA? (0.0 - 4.0)`);
        setCurrentStep("gpa");
        break;
      
      case "gpa":
        const gpa = parseFloat(value);
        if (isNaN(gpa) || gpa < 0 || gpa > 4.0) {
          addMessage("assistant", "Please enter a valid GPA between 0.0 and 4.0:");
          return;
        }
        setProfile(prev => ({ ...prev, gpa }));
        addMessage("assistant", `✔️ Noted: GPA = ${gpa}. What's your nationality?`);
        setCurrentStep("nationality");
        break;
      
      case "nationality":
        setProfile(prev => ({ ...prev, nationality: value }));
        addMessage("assistant", `✔️ Noted: Nationality = ${value}. What's your stream of study? (e.g., Computer Science, Mechanical Engineering)`);
        setCurrentStep("stream");
        break;
      
      case "stream":
        setProfile(prev => ({ ...prev, stream: value }));
        addMessage("assistant", `✔️ Noted: Stream = ${value}. What's your parental income range?`, [
          { label: "< $25k", action: "income_low" },
          { label: "$25k - $50k", action: "income_medium" },
          { label: "$50k - $100k", action: "income_high" },
          { label: "> $100k", action: "income_very_high" }
        ]);
        setCurrentStep("parentalIncome");
        break;
      
      case "parentalIncome":
        setProfile(prev => ({ ...prev, parentalIncome: value }));
        addMessage("assistant", `✔️ Noted: Parental Income = ${value}. Tell me about other relevant details (e.g., First-gen, Veteran, Female in STEM)`);
        setCurrentStep("otherDetails");
        break;
      
      case "otherDetails":
        setProfile(prev => ({ ...prev, otherDetails: value }));
        addMessage("assistant", `✔️ Noted: Other details = ${value}. University name? (Optional - press Enter to skip)`);
        setCurrentStep("university");
        break;
      
      case "university":
        setProfile(prev => ({ ...prev, university: value || "Not specified" }));
        setIsCollecting(false);
        addMessage("assistant", "Thanks — I've got your profile. Would you like me to search for scholarships now?", [
          { label: "Search Now", action: "search_now" },
          { label: "Edit Profile", action: "edit_profile" }
        ]);
        setCurrentStep("ready");
        break;
    }
  };

  const handleSearchScholarships = () => {
    // Validate required fields
    if (!profile.name || !profile.studentId || !profile.gpa || !profile.nationality || !profile.stream || !profile.parentalIncome || !profile.otherDetails) {
      toast.error("Please complete all required fields");
      return;
    }

    // Store student profile in session
    localStorage.setItem("currentStudentProfile", JSON.stringify(profile));
    
    addMessage("assistant", "🔍 Searching for scholarships...\n\nSearching FastWeb... ✓\nSearching ScholarshipOwl... ✓\nSearching UN.org... ✓\nSearching Fastweb India... ✓\n\nFiltering 300+ scholarships → Finding your best matches...");
    
    // Navigate to results after animation
    setTimeout(() => {
      navigate("/student-results");
    }, 3000);
  };

  const updateProfileField = (field: keyof StudentProfile, value: string | number) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    addMessage("assistant", `✔️ Updated: ${field} = ${value}`);
  };

  const handleIncomeButton = (action: string) => {
    const incomeMap: Record<string, string> = {
      income_low: "< $25k",
      income_medium: "$25k - $50k",
      income_high: "$50k - $100k",
      income_very_high: "> $100k"
    };
    
    const income = incomeMap[action];
    addMessage("user", income);
    processCollectionStep(income);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <header className="border-b bg-card p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground">Scholarship Assistant — Student Portal</h1>
          </div>
          <div className="w-32" />
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Chat Column */}
          <div className="md:col-span-2">
            <Card className="p-6 h-[calc(100vh-200px)] flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] p-4 rounded-lg ${
                      msg.role === "user" 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-foreground"
                    }`}>
                      <p className="whitespace-pre-line">{msg.content}</p>
                      {msg.buttons && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {msg.buttons.map((btn, btnIdx) => (
                            <Button
                              key={btnIdx}
                              size="sm"
                              variant={msg.role === "user" ? "secondary" : "outline"}
                              onClick={() => {
                                if (btn.action.startsWith("income_")) {
                                  handleIncomeButton(btn.action);
                                } else {
                                  handleButtonClick(btn.action);
                                }
                              }}
                            >
                              {btn.label}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="border-t pt-4">
                <p className="text-xs text-muted-foreground mb-2">
                  🔒 Your data stays local for this demo. Edit any field on the profile card.
                </p>
                <div className="flex gap-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Profile Summary Card */}
          <div className="md:col-span-1">
            <Card className="p-6 sticky top-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Profile Summary</h3>
              <div className="space-y-3">
                {[
                  { label: "Name", field: "name" as keyof StudentProfile },
                  { label: "Student ID", field: "studentId" as keyof StudentProfile },
                  { label: "GPA", field: "gpa" as keyof StudentProfile },
                  { label: "Nationality", field: "nationality" as keyof StudentProfile },
                  { label: "Stream", field: "stream" as keyof StudentProfile },
                  { label: "Parental Income", field: "parentalIncome" as keyof StudentProfile },
                  { label: "Other Details", field: "otherDetails" as keyof StudentProfile },
                  { label: "University", field: "university" as keyof StudentProfile }
                ].map(({ label, field }) => (
                  <div key={field} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-muted-foreground">{label}</label>
                      {profile[field] && <CheckCircle className="h-3 w-3 text-success" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        value={profile[field] || ""}
                        onChange={(e) => updateProfileField(field, e.target.value)}
                        placeholder={`Enter ${label.toLowerCase()}`}
                        className="text-sm"
                      />
                      <Edit2 className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
