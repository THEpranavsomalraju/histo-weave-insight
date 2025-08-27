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
    <div className="flex gap-3 mb-8">
      {steps.map((step) => (
        <div
          key={step.id}
          className={cn(
            "px-5 py-3 rounded-xl font-medium text-sm transition-all duration-300 border",
            "shadow-card hover:shadow-clinical",
            currentStep === step.id
              ? "bg-gradient-hematoxylin text-primary-foreground border-primary shadow-clinical"
              : currentStep > step.id
              ? "bg-gradient-clinical text-accent-foreground border-accent"
              : "bg-card text-muted-foreground border-border"
          )}
        >
          <span className="font-semibold">{step.id + 1}.</span> {step.label}
        </div>
      ))}
    </div>
  );
};