import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { AnalysisStepper } from "@/components/AnalysisStepper";
import { FileUploadArea } from "@/components/FileUploadArea";
import { AnalysisProgress } from "@/components/AnalysisProgress";
import { AnalysisLog } from "@/components/AnalysisLog";
import { PredictionCard } from "@/components/PredictionCard";
import { Microscope } from "lucide-react";

const STEPS = [
  { id: 0, label: "Load WSI" },
  { id: 1, label: "Auto Filter" },
  { id: 2, label: "Run Model" },
  { id: 3, label: "Predictions" }
];

const CATEGORIES = [
  { id: "1r1a", title: "1R1A", description: "Grade 1A rejection" },
  { id: "1r2", title: "1R2", description: "Grade 2 rejection" },
  { id: "healing", title: "Healing", description: "Healing tissue" },
  { id: "normal", title: "Normal", description: "Normal tissue" }
];

interface PredictionData {
  imageUrl: string;
  fileName: string;
  confidence: number;
  category: string;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [logMessages, setLogMessages] = useState<string[]>(["Waiting for input..."]);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [showFilterButton, setShowFilterButton] = useState(false);

  const addLogMessage = useCallback((message: string) => {
    setLogMessages(prev => [...prev, message]);
  }, []);

  const handleFileSelect = useCallback((files: FileList) => {
    const fileArray = Array.from(files);
    setUploadedFiles(fileArray);
    setCurrentStep(0);
    addLogMessage(`Step 1: Loaded ${fileArray.length} Whole Slide Images.`);
    setShowFilterButton(true);
  }, [addLogMessage]);

  const startAnalysis = useCallback(() => {
    setCurrentStep(1);
    addLogMessage("Step 2: Filtering irrelevant areas and tiling into regions...");
    setShowFilterButton(false);
    setShowProgress(true);
    setProgress(0);

    // Simulate progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setCurrentStep(2);
        addLogMessage("Step 3: Running segmentation model...");
        
        setTimeout(() => {
          setCurrentStep(3);
          addLogMessage("Step 4: Predictions ready.");
          setShowPredictions(true);
          
          // Generate predictions
          const newPredictions: PredictionData[] = uploadedFiles.map((file, index) => ({
            imageUrl: URL.createObjectURL(file),
            fileName: file.name,
            confidence: Math.random(),
            category: CATEGORIES[index % 4].id
          }));
          
          setPredictions(newPredictions);
        }, 2000);
      }
    }, 500);
  }, [uploadedFiles, addLogMessage]);

  const getPredictionsByCategory = (categoryId: string) => {
    return predictions.filter(pred => pred.category === categoryId);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-hematoxylin">
              <Microscope className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-hematoxylin bg-clip-text text-transparent">
              Heart Tissue Segmentation & Prediction
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            AI-powered analysis for cardiac transplant pathology assessment
          </p>
        </header>

        {/* Stepper */}
        <div className="flex justify-center mb-8">
          <AnalysisStepper currentStep={currentStep} steps={STEPS} />
        </div>

        {/* Upload Area */}
        <div className="flex justify-center mb-8">
          <FileUploadArea onFileSelect={handleFileSelect} />
        </div>

        {/* Analysis Log */}
        <div className="flex justify-center mb-6">
          <AnalysisLog messages={logMessages} />
        </div>

        {/* Progress */}
        <div className="flex justify-center mb-8">
          <AnalysisProgress progress={progress} isVisible={showProgress} />
        </div>

        {/* Filter Button */}
        {showFilterButton && (
          <div className="flex justify-center mb-8">
            <Button 
              onClick={startAnalysis}
              variant="analysis"
              size="lg"
              className="px-8 py-4 text-lg font-semibold"
            >
              Filter & Run Model
            </Button>
          </div>
        )}

        {/* Predictions */}
        {showPredictions && (
          <div className="mt-12 space-y-12">
            {CATEGORIES.map((category) => {
              const categoryPredictions = getPredictionsByCategory(category.id);
              
              if (categoryPredictions.length === 0) return null;
              
              return (
                <div key={category.id}>
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-primary mb-2">
                      {category.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {categoryPredictions.map((prediction, index) => (
                      <PredictionCard
                        key={`${prediction.category}-${index}`}
                        imageUrl={prediction.imageUrl}
                        fileName={prediction.fileName}
                        confidence={prediction.confidence}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;