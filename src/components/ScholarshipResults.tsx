import { Scholarship } from "@/data/scholarships";
import { ScholarshipCard } from "./ScholarshipCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Filter, SortAsc } from "lucide-react";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface ScholarshipResultsProps {
  scholarships: Scholarship[];
  onViewDetails: (scholarship: Scholarship) => void;
  onShortlist: (scholarship: Scholarship) => void;
  shortlistedIds: string[];
}

export function ScholarshipResults({ scholarships, onViewDetails, onShortlist, shortlistedIds }: ScholarshipResultsProps) {
  const [sortBy, setSortBy] = useState<"match" | "deadline" | "amount">("match");
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Get all unique tags
  const allTags = Array.from(new Set(scholarships.flatMap(s => s.tags)));

  const toggleTag = (tag: string) => {
    setFilterTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // Filter scholarships by tags
  const filteredScholarships = filterTags.length === 0
    ? scholarships
    : scholarships.filter(s => filterTags.some(tag => s.tags.includes(tag)));

  // Sort scholarships
  const sortedScholarships = [...filteredScholarships].sort((a, b) => {
    switch (sortBy) {
      case "match":
        return parseInt(b.matchScore) - parseInt(a.matchScore);
      case "deadline":
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      case "amount":
        return parseInt(b.amount.replace(/\D/g, "")) - parseInt(a.amount.replace(/\D/g, ""));
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            Scholarship Results ({sortedScholarships.length})
          </h3>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <SortAsc className="h-4 w-4 text-muted-foreground" />
              <Select value={sortBy} onValueChange={(value: typeof sortBy) => setSortBy(value)}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Match Score</SelectItem>
                  <SelectItem value="deadline">Deadline</SelectItem>
                  <SelectItem value="amount">Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Collapsible open={filtersOpen} onOpenChange={setFiltersOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full">
              <Filter className="h-4 w-4 mr-2" />
              Filter by Tags {filterTags.length > 0 && `(${filterTags.length})`}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {allTags.map((tag) => (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox
                    id={tag}
                    checked={filterTags.includes(tag)}
                    onCheckedChange={() => toggleTag(tag)}
                  />
                  <Label htmlFor={tag} className="text-sm cursor-pointer">
                    {tag}
                  </Label>
                </div>
              ))}
            </div>
            {filterTags.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilterTags([])}
                className="mt-3"
              >
                Clear Filters
              </Button>
            )}
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {sortedScholarships.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">No scholarships match the current filters</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sortedScholarships.map((scholarship) => (
            <ScholarshipCard
              key={scholarship.id}
              scholarship={scholarship}
              onViewDetails={() => onViewDetails(scholarship)}
              onShortlist={() => onShortlist(scholarship)}
              isShortlisted={shortlistedIds.includes(scholarship.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
