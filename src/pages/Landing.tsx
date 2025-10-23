import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Database, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { scholarshipSources } from "@/data/sources";

export default function Landing() {
  const navigate = useNavigate();
  const [showSources, setShowSources] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-6">
      <div className="max-w-5xl mx-auto pt-20">
        <div className="text-center space-y-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-20 w-20 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
              <GraduationCap className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-foreground">
              🎓 Scholarship Finder Agent
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              AI-powered scholarship matching for advisors. Find the best opportunities for your students.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/students")} className="text-lg px-8 py-6">
              Enter Agent
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => setShowSources(!showSources)} 
              className="text-lg px-8 py-6"
            >
              <Database className="h-5 w-5 mr-2" />
              View Sources
              {showSources ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </div>

        {showSources && (
          <div className="mt-12 animate-fade-in">
            <div className="bg-card border rounded-lg p-6">
              <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Database className="h-6 w-6 text-primary" />
                Connected Scholarship Sources
              </h3>
              <p className="text-muted-foreground mb-6">
                Our agent searches across {scholarshipSources.length} trusted scholarship databases to find the best matches for your students.
              </p>
              
              <div className="grid gap-4 md:grid-cols-2">
                {scholarshipSources.map((source) => (
                  <Card key={source.id} className="p-4 hover:border-primary/50 transition-colors">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground flex items-center gap-2">
                            {source.name}
                            <a 
                              href={source.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {source.description}
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Fields of Scholarship:</p>
                        <div className="flex flex-wrap gap-1">
                          {source.fields.map((field) => (
                            <Badge key={field} variant="secondary" className="text-xs">
                              {field}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
