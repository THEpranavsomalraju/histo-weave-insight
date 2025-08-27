import { cn } from "@/lib/utils";

interface PredictionCardProps {
  imageUrl: string;
  fileName: string;
  confidence: number;
  className?: string;
}

export const PredictionCard = ({ imageUrl, fileName, confidence, className }: PredictionCardProps) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-accent";
    if (confidence >= 0.6) return "text-secondary";
    return "text-muted-foreground";
  };

  const getConfidenceBg = (confidence: number) => {
    if (confidence >= 0.8) return "bg-accent/10";
    if (confidence >= 0.6) return "bg-secondary/10";
    return "bg-muted/50";
  };

  return (
    <div className={cn("rounded-xl overflow-hidden bg-card shadow-card hover:shadow-clinical transition-all duration-300", className)}>
      <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
        <img 
          src={imageUrl} 
          alt={fileName} 
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300" 
        />
      </div>
      <div className="p-4">
        <div className="text-sm font-medium text-foreground mb-2 truncate" title={fileName}>
          {fileName}
        </div>
        <div className={cn(
          "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
          getConfidenceBg(confidence)
        )}>
          <span className={getConfidenceColor(confidence)}>
            Confidence: {(confidence * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};