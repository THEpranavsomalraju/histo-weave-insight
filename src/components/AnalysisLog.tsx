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
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: scrollContainer.scrollHeight,
          behavior: 'smooth'
        });
      }
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
        return <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />;
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
        <ScrollArea className="h-48" ref={scrollAreaRef}>
          <div className="space-y-3 pr-2">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className="flex items-start gap-3 animate-in slide-in-from-bottom-2 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {getMessageIcon(message.type || "info")}
                <div className="flex-1 min-w-0">
                  <div className={cn("text-sm leading-relaxed", getMessageStyle(message.type || "info"))}>
                    {message.text}
                  </div>
                  <div className="text-xs text-muted-foreground/60 mt-1 font-mono">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Auto-scroll trigger element */}
            <div ref={scrollRef} className="h-1" />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};