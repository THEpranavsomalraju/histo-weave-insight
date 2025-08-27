import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { Clock, Loader2 } from "lucide-react";

interface LogMessage {
  text: string;
  timestamp: Date;
  type?: "info" | "processing" | "success" | "error";
}

interface AnalysisLogProps {
  messages: LogMessage[];
  isProcessing?: boolean;
  className?: string;
}

export const AnalysisLog = ({ messages, isProcessing = false, className }: AnalysisLogProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case "processing":
        return <Loader2 className="w-3 h-3 animate-spin text-secondary" />;
      case "success":
        return <div className="w-3 h-3 rounded-full bg-accent" />;
      case "error":
        return <div className="w-3 h-3 rounded-full bg-destructive" />;
      default:
        return <Clock className="w-3 h-3 text-muted-foreground" />;
    }
  };

  const getMessageStyle = (type: string) => {
    switch (type) {
      case "processing":
        return "text-secondary animate-pulse";
      case "success":
        return "text-accent font-medium";
      case "error":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className={cn(
      "w-full max-w-2xl bg-card rounded-xl border shadow-card overflow-hidden",
      className
    )}>
      <div className="bg-gradient-hematoxylin text-primary-foreground px-4 py-3 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary-foreground animate-pulse" />
        <span className="font-medium">Analysis Log</span>
        {isProcessing && (
          <div className="ml-auto flex items-center gap-2 text-xs">
            <Loader2 className="w-3 h-3 animate-spin" />
            Processing...
          </div>
        )}
      </div>
      <div className="p-4">
        <ScrollArea className="h-40" ref={scrollRef}>
          <div className="space-y-3">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className="flex items-start gap-3 animate-in slide-in-from-bottom-2 duration-300"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {getMessageIcon(message.type || "info")}
                <div className="flex-1 min-w-0">
                  <div className={cn("text-sm", getMessageStyle(message.type || "info"))}>
                    {message.text}
                  </div>
                  <div className="text-xs text-muted-foreground/70 mt-1">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};