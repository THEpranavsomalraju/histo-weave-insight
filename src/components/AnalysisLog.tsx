import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface AnalysisLogProps {
  messages: string[];
  className?: string;
}

export const AnalysisLog = ({ messages, className }: AnalysisLogProps) => {
  return (
    <div className={cn(
      "w-full max-w-2xl bg-card rounded-xl border shadow-card p-4",
      className
    )}>
      <div className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        Analysis Log
      </div>
      <ScrollArea className="h-32">
        <div className="text-sm space-y-1">
          {messages.map((message, index) => (
            <div key={index} className="text-muted-foreground">
              {message}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};