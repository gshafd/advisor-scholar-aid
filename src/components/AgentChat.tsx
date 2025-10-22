import { Card } from "@/components/ui/card";
import { Bot, Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";

export interface ChatMessage {
  role: "agent" | "system";
  content: string;
  timestamp: Date;
}

interface AgentChatProps {
  messages: ChatMessage[];
  isLoading?: boolean;
}

export function AgentChat({ messages, isLoading }: AgentChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Card className="p-4 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b">
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
          <Bot className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Scholarship Finder Agent</h3>
          <p className="text-xs text-muted-foreground">Your AI-powered assistant</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`animate-fade-in ${message.role === 'system' ? 'text-center' : ''}`}
          >
            <div className={`inline-block max-w-full ${
              message.role === 'agent' 
                ? 'bg-accent text-accent-foreground rounded-lg p-3' 
                : 'bg-muted text-muted-foreground rounded-md px-3 py-2 text-sm'
            }`}>
              {message.content}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Thinking...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </Card>
  );
}
