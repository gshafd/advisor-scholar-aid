import { Student } from "@/data/students";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface StudentListProps {
  students: Student[];
  onSelectStudent: (student: Student) => void;
  selectedStudentId?: string;
}

export function StudentList({ students, onSelectStudent, selectedStudentId }: StudentListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.major.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b bg-card">
        <h2 className="text-lg font-semibold mb-3 text-foreground">Students</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredStudents.map((student) => (
          <Card
            key={student.id}
            className={`p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedStudentId === student.id ? 'ring-2 ring-primary bg-accent' : ''
            }`}
            onClick={() => onSelectStudent(student)}
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">{student.name}</h3>
                  <p className="text-sm text-muted-foreground">{student.major}</p>
                </div>
                <Badge variant={student.financialNeed === "High" ? "destructive" : "secondary"} className="shrink-0">
                  {student.financialNeed} Need
                </Badge>
              </div>
              
              <div className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground">GPA: <span className="font-medium text-foreground">{student.GPA}</span></span>
                <span className="text-muted-foreground">•</span>
                <span className="text-muted-foreground">{student.nationality}</span>
              </div>
              
              <Button 
                size="sm" 
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectStudent(student);
                }}
              >
                Run Scholarship Finder
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
