import { cn } from "@/lib/utils";

interface Step {
  id: number;
  label: string;
}

interface AnalysisStepperProps {
  currentStep: number;
  steps: Step[];
}

export const AnalysisStepper = ({ currentStep, steps }: AnalysisStepperProps) => {
  return (
    <div className="flex gap-6 mb-8">
      {steps.map((step) => (
        <div
          key={step.id}
          className={cn(
            "flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 border",
            "shadow-card hover:shadow-clinical min-w-[160px]",
            currentStep === step.id
              ? "bg-gradient-hematoxylin text-primary-foreground border-primary shadow-clinical scale-105"
              : currentStep > step.id
              ? "bg-gradient-clinical text-accent-foreground border-accent"
              : "bg-card text-muted-foreground border-border"
          )}
        >
          <div className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg transition-all duration-300",
            currentStep === step.id
              ? "bg-primary-foreground/20 text-primary-foreground ring-2 ring-primary-foreground/30"
              : currentStep > step.id
              ? "bg-accent-foreground/20 text-accent-foreground"
              : "bg-muted text-muted-foreground"
          )}>
            {step.id + 1}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Step {step.id + 1}</span>
            <span className={cn(
              "text-xs",
              currentStep === step.id ? "text-primary-foreground/90" :
              currentStep > step.id ? "text-accent-foreground/90" :
              "text-muted-foreground"
            )}>
              {step.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};