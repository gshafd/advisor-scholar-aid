import { Student } from "@/data/students";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StudentProfileProps {
  student: Student;
  onRunSearch: () => void;
  isSearching: boolean;
}

export function StudentProfile({ student, onRunSearch, isSearching }: StudentProfileProps) {
  const [editedStudent, setEditedStudent] = useState(student);
  const [newTag, setNewTag] = useState("");

  const addTag = () => {
    if (newTag.trim() && !editedStudent.tags.includes(newTag.trim())) {
      setEditedStudent({
        ...editedStudent,
        tags: [...editedStudent.tags, newTag.trim()]
      });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditedStudent({
      ...editedStudent,
      tags: editedStudent.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-4 text-foreground">Student Profile</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={editedStudent.name} disabled className="mt-1" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="major">Major</Label>
            <Input id="major" value={editedStudent.major} disabled className="mt-1" />
          </div>
          <div>
            <Label htmlFor="nationality">Nationality</Label>
            <Input id="nationality" value={editedStudent.nationality} disabled className="mt-1" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="gpa">GPA</Label>
            <Input
              id="gpa"
              type="number"
              step="0.01"
              min="0"
              max="4"
              value={editedStudent.GPA}
              onChange={(e) => setEditedStudent({ ...editedStudent, GPA: parseFloat(e.target.value) })}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="need">Financial Need</Label>
            <Select
              value={editedStudent.financialNeed}
              onValueChange={(value: "High" | "Medium" | "Low") => 
                setEditedStudent({ ...editedStudent, financialNeed: value })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2 mt-2 mb-2">
            {editedStudent.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                <X 
                  className="h-3 w-3 cursor-pointer hover:text-destructive" 
                  onClick={() => removeTag(tag)}
                />
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add new tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTag()}
            />
            <Button size="icon" variant="outline" onClick={addTag}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button 
          className="w-full" 
          size="lg"
          onClick={onRunSearch}
          disabled={isSearching}
        >
          {isSearching ? "Searching..." : "Confirm & Run Search"}
        </Button>
      </div>
    </Card>
  );
}
