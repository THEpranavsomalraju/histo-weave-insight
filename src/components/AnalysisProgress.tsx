import { cn } from "@/lib/utils";

interface AnalysisProgressProps {
  progress: number;
  isVisible: boolean;
  className?: string;
}

export const AnalysisProgress = ({ progress, isVisible, className }: AnalysisProgressProps) => {
  if (!isVisible) return null;

  return (
    <div className={cn("w-full max-w-2xl", className)}>
      <div className="w-full bg-muted rounded-full h-4 overflow-hidden shadow-inner">
        <div
          className="bg-gradient-eosin h-4 transition-all duration-500 ease-out shadow-clinical"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="mt-2 text-sm text-muted-foreground text-center">
        Processing: {progress.toFixed(1)}%
      </div>
    </div>
  );
};