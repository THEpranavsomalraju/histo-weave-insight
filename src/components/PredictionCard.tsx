import { cn } from "@/lib/utils";

interface PredictionCardProps {
  imageUrl: string;
  fileName: string;
  confidence: number;
  className?: string;
  style?: React.CSSProperties;
}

export const PredictionCard = ({ imageUrl, fileName, confidence, className, style }: PredictionCardProps) => {
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
    <div 
      className={cn(
        "rounded-xl overflow-hidden bg-card shadow-card hover:shadow-clinical transition-all duration-300",
        "border border-border/50 hover:border-primary/30",
        className
      )}
      style={style}
    >
      <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden relative group">
        <img 
          src={imageUrl} 
          alt={fileName} 
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-4">
        <div className="text-sm font-medium text-foreground mb-3 truncate" title={fileName}>
          {fileName}
        </div>
        <div className={cn(
          "inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold",
          "border border-current/20",
          getConfidenceBg(confidence)
        )}>
          <div className={cn("w-2 h-2 rounded-full mr-2", 
            confidence >= 0.8 ? "bg-accent" : confidence >= 0.6 ? "bg-secondary" : "bg-muted-foreground"
          )} />
          <span className={getConfidenceColor(confidence)}>
            {(confidence * 100).toFixed(1)}% confidence
          </span>
        </div>
      </div>
    </div>
  );
};