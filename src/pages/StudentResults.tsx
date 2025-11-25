import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search } from "lucide-react";
import { scholarships, Scholarship } from "@/data/scholarships";
import { scholarshipMappings } from "@/data/mappings";
import { toast } from "sonner";
import { ScholarshipDetail } from "@/components/ScholarshipDetail";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function StudentResults() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [matchedScholarships, setMatchedScholarships] = useState<Scholarship[]>([]);
  const [filteredScholarships, setFilteredScholarships] = useState<Scholarship[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedScholarship, setSelectedScholarship] = useState<Scholarship | null>(null);
  const [sortBy, setSortBy] = useState<string>("match");
  const [shortlisted, setShortlisted] = useState<string[]>([]);

  useEffect(() => {
    const storedProfile = localStorage.getItem("currentStudentProfile");
    if (storedProfile) {
      const parsedProfile = JSON.parse(storedProfile);
      setProfile(parsedProfile);
      
      // Get mapped scholarship IDs for this student
      const mappedIds = scholarshipMappings[parsedProfile.studentId] || [];
      const matched = scholarships.filter(s => mappedIds.includes(s.id));
      
      setMatchedScholarships(matched);
      setFilteredScholarships(matched);
    } else {
      navigate("/student-chat");
    }

    // Load shortlisted items
    const storedShortlist = localStorage.getItem("studentShortlist");
    if (storedShortlist) {
      setShortlisted(JSON.parse(storedShortlist));
    }
  }, [navigate]);

  useEffect(() => {
    let filtered = [...matchedScholarships];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "match":
          return (Number(b.matchScore) || 0) - (Number(a.matchScore) || 0);
        case "amount":
          return parseInt(b.amount.replace(/\D/g, "") || "0") - parseInt(a.amount.replace(/\D/g, "") || "0");
        case "deadline":
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        default:
          return 0;
      }
    });

    setFilteredScholarships(filtered);
  }, [searchTerm, sortBy, matchedScholarships]);

  const handleShortlist = (scholarship: Scholarship) => {
    const newShortlisted = shortlisted.includes(scholarship.id)
      ? shortlisted.filter(id => id !== scholarship.id)
      : [...shortlisted, scholarship.id];
    
    setShortlisted(newShortlisted);
    localStorage.setItem("studentShortlist", JSON.stringify(newShortlisted));
    
    if (newShortlisted.includes(scholarship.id)) {
      toast.success(`✓ Added '${scholarship.name}' to your Action Plan`);
    } else {
      toast.info(`Removed '${scholarship.name}' from Action Plan`);
    }
  };

  const getMatchReason = (scholarship: Scholarship) => {
    if (!profile) return "";
    
    const reasons = [];
    if (profile.gpa >= 3.5 && scholarship.tags.includes("Merit-based")) {
      reasons.push("High GPA");
    }
    if (profile.otherDetails.includes("Female") && scholarship.tags.includes("Women")) {
      reasons.push("Female applicant");
    }
    if (profile.otherDetails.includes("STEM") && scholarship.tags.includes("STEM")) {
      reasons.push("STEM field");
    }
    if (scholarship.tags.includes("International")) {
      reasons.push("International student");
    }
    
    return reasons.length > 0 ? `Matches: ${reasons.join(", ")}` : "Good fit for your profile";
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <header className="border-b bg-card p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate("/student-chat")} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Chat
          </Button>
          <div className="text-center">
            <h1 className="text-xl font-bold text-foreground">Scholarship Results for {profile.name}</h1>
            <p className="text-sm text-muted-foreground">{matchedScholarships.length} scholarships matched</p>
          </div>
          <Button onClick={() => navigate("/student-action-plan")}>
            View Action Plan ({shortlisted.length})
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Filters & Search */}
        <div className="mb-6 flex gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search scholarships by name or tags..."
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="match">Match Score</SelectItem>
              <SelectItem value="amount">Amount</SelectItem>
              <SelectItem value="deadline">Deadline</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Scholarship Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScholarships.map((scholarship) => (
            <Card key={scholarship.id} className="p-6 space-y-4 hover:border-primary/50 transition-all">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-lg text-foreground">{scholarship.name}</h3>
                  <Badge variant={scholarship.matchScore && Number(scholarship.matchScore) >= 90 ? "default" : "secondary"}>
                    {scholarship.matchScore}% Match
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground italic">{getMatchReason(scholarship)}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">{scholarship.amount}</span>
                  <span className="text-sm text-muted-foreground">Due: {scholarship.deadline}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {scholarship.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="text-xs text-muted-foreground">
                Source: {new URL(scholarship.source).hostname.replace('www.', '')}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setSelectedScholarship(scholarship)}
                >
                  Details
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  variant={shortlisted.includes(scholarship.id) ? "secondary" : "default"}
                  onClick={() => handleShortlist(scholarship)}
                >
                  {shortlisted.includes(scholarship.id) ? "✓ Shortlisted" : "Shortlist"}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {filteredScholarships.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No scholarships found matching your criteria</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <Button variant="outline" onClick={() => navigate("/")}>
            Return to Home
          </Button>
          <Button onClick={() => navigate("/student-action-plan")}>
            View My Action Plan ({shortlisted.length})
          </Button>
        </div>
      </div>

      {/* Details Modal */}
      <ScholarshipDetail
        scholarship={selectedScholarship}
        open={!!selectedScholarship}
        onOpenChange={() => setSelectedScholarship(null)}
        onShortlist={() => {
          if (selectedScholarship) {
            handleShortlist(selectedScholarship);
            setSelectedScholarship(null);
          }
        }}
      />
    </div>
  );
}
