import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { AnalysisStepper } from "@/components/AnalysisStepper";
import { FileUploadArea } from "@/components/FileUploadArea";
import { AnalysisProgress } from "@/components/AnalysisProgress";
import { AnalysisLog } from "@/components/AnalysisLog";
import { PredictionCard } from "@/components/PredictionCard";
import { Microscope, Sparkles, X, ZoomIn, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

interface LogMessage {
  text: string;
  timestamp: Date;
  type?: "info" | "processing" | "success" | "error";
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [logMessages, setLogMessages] = useState<LogMessage[]>([
    { text: "System initialized. Waiting for input...", timestamp: new Date(), type: "info" }
  ]);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [showFilterButton, setShowFilterButton] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPrediction, setSelectedPrediction] = useState<PredictionData | null>(null);

  const addLogMessage = useCallback((message: string, type: LogMessage["type"] = "info") => {
    setLogMessages(prev => [...prev, { text: message, timestamp: new Date(), type }]);
  }, []);

  const handleRestart = useCallback(() => {
    setCurrentStep(-1);
    setUploadedFiles([]);
    setLogMessages([{ text: "System initialized. Waiting for input...", timestamp: new Date(), type: "info" }]);
    setProgress(0);
    setShowProgress(false);
    setPredictions([]);
    setShowPredictions(false);
    setShowFilterButton(false);
    setIsProcessing(false);
    setSelectedPrediction(null);
    // Clear file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }, []);

  const handlePredictionClick = useCallback((prediction: PredictionData) => {
    setSelectedPrediction(prediction);
  }, []);

  const handleFileSelect = useCallback((files: FileList) => {
    const fileArray = Array.from(files);
    setUploadedFiles(fileArray);
    setCurrentStep(0);
    addLogMessage(`Successfully loaded ${fileArray.length} Whole Slide Images`, "success");
    addLogMessage("Files validated and ready for processing", "info");
    setShowFilterButton(true);
  }, [addLogMessage]);

  const startAnalysis = useCallback(() => {
    setCurrentStep(1);
    setIsProcessing(true);
    addLogMessage("Initializing tissue analysis pipeline...", "processing");
    setShowFilterButton(false);
    setShowProgress(true);
    setProgress(0);

    // Simulate detailed analysis process
    const analysisSteps = [
      { progress: 15, message: "Scanning image metadata and headers...", type: "processing" as const },
      { progress: 30, message: "Applying tissue detection filters...", type: "processing" as const },
      { progress: 45, message: "Identifying regions of interest...", type: "processing" as const },
      { progress: 60, message: "Segmenting cardiac tissue structures...", type: "processing" as const },
      { progress: 75, message: "Loading deep learning model weights...", type: "processing" as const },
      { progress: 85, message: "Running inference on tissue regions...", type: "processing" as const },
      { progress: 95, message: "Calculating prediction confidences...", type: "processing" as const },
      { progress: 100, message: "Analysis complete!", type: "success" as const }
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < analysisSteps.length) {
        const step = analysisSteps[stepIndex];
        setProgress(step.progress);
        addLogMessage(step.message, step.type);
        
        if (step.progress === 60) {
          setCurrentStep(2);
        }
        
        stepIndex++;
      } else {
        clearInterval(interval);
        setCurrentStep(3);
        setIsProcessing(false);
        addLogMessage("Generating tissue classification results...", "success");
        setShowPredictions(true);
        
        // Generate predictions - create 0-8 images per category
        const newPredictions: PredictionData[] = [];
        
        CATEGORIES.forEach((category) => {
          // Random number of images per category (0-8)
          const numImagesForCategory = Math.floor(Math.random() * 9); // 0-8
          
          for (let i = 0; i < numImagesForCategory; i++) {
            // Use a random uploaded file
            const randomFileIndex = Math.floor(Math.random() * uploadedFiles.length);
            const file = uploadedFiles[randomFileIndex];
            
            newPredictions.push({
              imageUrl: URL.createObjectURL(file),
              fileName: `${file.name} - ${category.title} Region ${i + 1}`,
              confidence: 0.55 + Math.random() * 0.4, // 55-95% confidence
              category: category.id
            });
          }
        });
        
        setPredictions(newPredictions);
        addLogMessage(`Generated ${newPredictions.length} tissue predictions across ${CATEGORIES.length} pathological categories`, "success");
        addLogMessage("Analysis pipeline completed successfully", "info");
      }
    }, 800);
  }, [uploadedFiles, addLogMessage]);

  const getPredictionsByCategory = (categoryId: string) => {
    return predictions.filter(pred => pred.category === categoryId);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-hematoxylin opacity-10 blur-3xl rounded-full" />
            <div className="relative inline-flex items-center gap-4 mb-6 p-6 bg-card/50 backdrop-blur-sm rounded-2xl shadow-clinical border">
              <div className="relative">
                <div className="p-4 rounded-full bg-gradient-hematoxylin shadow-clinical">
                  <Microscope className="w-10 h-10 text-primary-foreground" />
                </div>
                <div className="absolute -top-1 -right-1 p-1 rounded-full bg-gradient-eosin">
                  <Sparkles className="w-4 h-4 text-secondary-foreground" />
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold bg-gradient-hematoxylin bg-clip-text text-transparent mb-2">
                  AI Cardiac Pathology Suite
                </h1>
                <p className="text-muted-foreground text-lg">
                  Advanced tissue segmentation & rejection prediction for transplant assessment
                </p>
              </div>
            </div>
          </div>
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
          <AnalysisLog messages={logMessages} isProcessing={isProcessing} />
        </div>

        {/* Progress */}
        <div className="flex justify-center mb-8">
          <AnalysisProgress progress={progress} isVisible={showProgress} />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          {showFilterButton && (
            <Button 
              onClick={startAnalysis}
              variant="analysis"
              size="lg"
              className="px-10 py-6 text-lg font-semibold rounded-xl shadow-clinical hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <Microscope className="w-5 h-5 mr-2" />
              Start AI Analysis
            </Button>
          )}
          
          {(currentStep >= 0 || showPredictions) && (
            <Button 
              onClick={handleRestart}
              variant="outline"
              size="lg"
              className="px-10 py-6 text-lg font-semibold rounded-xl border-2 hover:bg-muted/50 transition-all duration-300"
            >
              Restart Analysis
            </Button>
          )}
        </div>

        {/* Predictions */}
        {showPredictions && (
          <div className="mt-16 space-y-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold bg-gradient-clinical bg-clip-text text-transparent mb-4">
                Tissue Classification Results
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                AI-powered analysis has identified and classified cardiac tissue regions across multiple pathological categories
              </p>
            </div>
            
            {CATEGORIES.map((category) => {
              const categoryPredictions = getPredictionsByCategory(category.id);
              
              return (
                <div key={category.id} className="animate-in slide-in-from-bottom-4 duration-700">
                  <div className="mb-8 p-6 bg-gradient-to-r from-card to-card/50 rounded-xl border shadow-card">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-3 h-3 rounded-full bg-gradient-hematoxylin" />
                      <h3 className="text-2xl font-bold text-primary">
                        {category.title}
                      </h3>
                      <span className={cn(
                        "ml-auto px-3 py-1 rounded-full text-sm font-medium",
                        categoryPredictions.length > 0 
                          ? "bg-primary/10 text-primary" 
                          : "bg-muted/50 text-muted-foreground"
                      )}>
                        {categoryPredictions.length > 0 
                          ? `${categoryPredictions.length} regions detected`
                          : "No regions detected"
                        }
                      </span>
                    </div>
                    <p className="text-muted-foreground text-lg ml-7">
                      {category.description}
                    </p>
                  </div>
                  
                  {categoryPredictions.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                      {categoryPredictions.map((prediction, index) => (
                        <PredictionCard
                          key={`${prediction.category}-${index}`}
                          imageUrl={prediction.imageUrl}
                          fileName={prediction.fileName}
                          confidence={prediction.confidence}
                          className="animate-in scale-in duration-500 hover-scale cursor-pointer"
                          style={{ animationDelay: `${index * 100}ms` }}
                          onClick={() => handlePredictionClick(prediction)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 px-6 bg-muted/30 rounded-xl border-2 border-dashed border-muted">
                      <div className="text-muted-foreground text-lg">
                        No tissue regions classified in this category
                      </div>
                      <div className="text-muted-foreground/70 text-sm mt-2">
                        The AI model did not detect any {category.title.toLowerCase()} patterns in the analyzed tissue samples
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Prediction Detail Modal */}
        <Dialog open={!!selectedPrediction} onOpenChange={() => setSelectedPrediction(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
            {selectedPrediction && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-3 text-xl">
                    <Activity className="w-6 h-6 text-primary" />
                    Tissue Analysis Details
                  </DialogTitle>
                </DialogHeader>
                
                <div className="grid md:grid-cols-2 gap-6 mt-4">
                  {/* Image Section */}
                  <div className="relative group">
                    <div className="aspect-square rounded-xl overflow-hidden bg-muted border-2 border-border shadow-clinical">
                      <img 
                        src={selectedPrediction.imageUrl} 
                        alt={selectedPrediction.fileName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                        <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Details Section */}
                  <div className="space-y-6">
                    <div className="p-4 bg-gradient-to-r from-card to-card/50 rounded-xl border">
                      <h3 className="font-semibold text-lg mb-2 text-primary">Tissue Classification</h3>
                      <p className="text-muted-foreground mb-3">{selectedPrediction.fileName}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Category:</span>
                        <span className={cn(
                          "px-3 py-1 rounded-full text-sm font-medium",
                          "bg-gradient-hematoxylin text-primary-foreground"
                        )}>
                          {CATEGORIES.find(cat => cat.id === selectedPrediction.category)?.title}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-card to-card/50 rounded-xl border">
                      <h3 className="font-semibold text-lg mb-3 text-primary">Confidence Analysis</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">AI Confidence</span>
                          <span className={cn(
                            "px-2 py-1 rounded text-sm font-semibold",
                            selectedPrediction.confidence >= 0.8 ? "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30" :
                            selectedPrediction.confidence >= 0.6 ? "text-amber-600 bg-amber-100 dark:bg-amber-900/30" :
                            "text-red-600 bg-red-100 dark:bg-red-900/30"
                          )}>
                            {(selectedPrediction.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                          <div 
                            className={cn(
                              "h-2 rounded-full transition-all duration-500",
                              selectedPrediction.confidence >= 0.8 ? "bg-emerald-500" :
                              selectedPrediction.confidence >= 0.6 ? "bg-amber-500" :
                              "bg-red-500"
                            )}
                            style={{ width: `${selectedPrediction.confidence * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-card to-card/50 rounded-xl border">
                      <h3 className="font-semibold text-lg mb-2 text-primary">Clinical Notes</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {CATEGORIES.find(cat => cat.id === selectedPrediction.category)?.description}
                        {selectedPrediction.confidence >= 0.8 
                          ? " High confidence prediction suggests clear pathological features."
                          : selectedPrediction.confidence >= 0.6
                          ? " Moderate confidence - recommend additional review."
                          : " Low confidence - manual verification strongly recommended."
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;