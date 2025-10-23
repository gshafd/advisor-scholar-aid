import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { students, Student } from "@/data/students";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, GraduationCap } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function StudentSelection() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof Student | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.major.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (!sortColumn) return 0;
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    const direction = sortDirection === "asc" ? 1 : -1;
    
    if (typeof aValue === "string" && typeof bValue === "string") {
      return aValue.localeCompare(bValue) * direction;
    }
    if (typeof aValue === "number" && typeof bValue === "number") {
      return (aValue - bValue) * direction;
    }
    return 0;
  });

  const handleSort = (column: keyof Student) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleSelectStudent = (student: Student) => {
    navigate(`/agent-search/${student.id}`);
  };

  const getFinancialNeedColor = (need: string) => {
    switch (need) {
      case "High":
        return "destructive";
      case "Medium":
        return "default";
      case "Low":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Scholarship Finder Agent</h1>
              <p className="text-sm text-muted-foreground">Select a student to begin</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6 space-y-4">
          <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search students by name or major..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="border rounded-lg bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("name")}
                >
                  Student Name {sortColumn === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("major")}
                >
                  Major {sortColumn === "major" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("GPA")}
                >
                  GPA {sortColumn === "GPA" && (sortDirection === "asc" ? "↑" : "↓")}
                </TableHead>
                <TableHead>Nationality</TableHead>
                <TableHead>Financial Need</TableHead>
                <TableHead>Tags</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedStudents.map((student) => (
                <TableRow 
                  key={student.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSelectStudent(student)}
                >
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.major}</TableCell>
                  <TableCell>{student.GPA.toFixed(2)}</TableCell>
                  <TableCell>{student.nationality}</TableCell>
                  <TableCell>
                    <Badge variant={getFinancialNeedColor(student.financialNeed)}>
                      {student.financialNeed}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {student.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
