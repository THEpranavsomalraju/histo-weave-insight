import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { AnalysisStepper } from "@/components/AnalysisStepper";
import { FileUploadArea } from "@/components/FileUploadArea";
import { AnalysisProgress } from "@/components/AnalysisProgress";
import { AnalysisLog } from "@/components/AnalysisLog";
import { PredictionCard } from "@/components/PredictionCard";
import { Microscope, Upload, FileText, ZoomIn, Activity, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  { id: "quilty", title: "Quilty", description: "Quilty effect patterns" }
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
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showResultsDialog, setShowResultsDialog] = useState(false);
  const [showLogDialog, setShowLogDialog] = useState(false);

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
    setShowUploadDialog(false);
    setShowResultsDialog(false);
    setShowLogDialog(false);
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
    setShowUploadDialog(false);
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
        setShowResultsDialog(true);
        
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
        <header className="mb-8 pb-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-1">
                AI Cardiac Pathology Analysis
              </h1>
              <p className="text-muted-foreground text-sm">
                Automated tissue segmentation and rejection classification system
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-md border">
              <Microscope className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">v2.1.4</span>
            </div>
          </div>
        </header>

        {/* Main Control Panel */}
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Stepper */}
          <div className="flex justify-center">
            <AnalysisStepper currentStep={currentStep} steps={STEPS} />
          </div>

          {/* Compact Control Panel */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Upload Panel */}
            <div className="p-6 bg-card border rounded-xl shadow-sm">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Load WSI Files</h3>
                  <p className="text-muted-foreground text-sm">Upload whole slide images</p>
                </div>
                <Button 
                  onClick={() => setShowUploadDialog(true)}
                  variant="outline"
                  className="w-full"
                >
                  {uploadedFiles.length > 0 ? `${uploadedFiles.length} Files Loaded` : 'Select Files'}
                </Button>
              </div>
            </div>

            {/* Analysis Panel */}
            <div className="p-6 bg-card border rounded-xl shadow-sm">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center">
                  <Microscope className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">AI Analysis</h3>
                  <p className="text-muted-foreground text-sm">Process tissue samples</p>
                </div>
                {showFilterButton ? (
                  <Button 
                    onClick={startAnalysis}
                    variant="analysis"
                    className="w-full"
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Start Analysis'}
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full" disabled>
                    Load Files First
                  </Button>
                )}
              </div>
            </div>

            {/* Results Panel */}
            <div className="p-6 bg-card border rounded-xl shadow-sm">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center">
                  <Grid3X3 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Results</h3>
                  <p className="text-muted-foreground text-sm">View classifications</p>
                </div>
                {showPredictions ? (
                  <Button 
                    onClick={() => setShowResultsDialog(true)}
                    variant="outline"
                    className="w-full"
                  >
                    View Results ({predictions.length})
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full" disabled>
                    No Results Yet
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Compact Progress and Log Area */}
          {(showProgress || logMessages.length > 1) && (
            <div className="bg-card border rounded-xl p-6 space-y-4">
              {showProgress && (
                <AnalysisProgress progress={progress} isVisible={showProgress} />
              )}
              
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Analysis Log</h3>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowLogDialog(true)}
                  className="text-muted-foreground"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  View Full Log
                </Button>
              </div>
              
              {/* Show last 3 log messages */}
              <div className="space-y-2 max-h-32 overflow-hidden">
                {logMessages.slice(-3).map((message, index) => (
                  <div key={index} className="text-sm p-2 bg-muted/50 rounded">
                    <span className="text-muted-foreground text-xs">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                    <span className="ml-2">{message.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {(currentStep >= 0 || showPredictions) && (
            <div className="flex justify-center">
              <Button 
                onClick={handleRestart}
                variant="outline"
                size="lg"
                className="px-8 py-4"
              >
                Restart Analysis
              </Button>
            </div>
          )}
        </div>

        {/* Upload Dialog */}
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Upload className="w-6 h-6 text-primary" />
                Upload Whole Slide Images
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <FileUploadArea onFileSelect={handleFileSelect} />
            </div>
          </DialogContent>
        </Dialog>

        {/* Results Dialog */}
        <Dialog open={showResultsDialog} onOpenChange={setShowResultsDialog}>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Grid3X3 className="w-6 h-6 text-primary" />
                Tissue Classification Results
              </DialogTitle>
            </DialogHeader>
            
            <div className="mt-4">
              <Tabs defaultValue={CATEGORIES[0].id} className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  {CATEGORIES.map((category) => {
                    const categoryPredictions = getPredictionsByCategory(category.id);
                    return (
                      <TabsTrigger 
                        key={category.id} 
                        value={category.id}
                        className="flex flex-col items-center gap-1 py-3 px-2"
                      >
                        <span className="font-medium">{category.title}</span>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          categoryPredictions.length > 0 
                            ? "bg-primary/20 text-primary" 
                            : "bg-muted text-muted-foreground"
                        )}>
                          {categoryPredictions.length}
                        </span>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
                
                {CATEGORIES.map((category) => {
                  const categoryPredictions = getPredictionsByCategory(category.id);
                  
                  return (
                    <TabsContent 
                      key={category.id} 
                      value={category.id}
                      className="overflow-y-auto max-h-[60vh] space-y-4"
                    >
                      {/* Category Header */}
                      <div className="p-4 bg-gradient-to-r from-card to-card/50 rounded-xl border">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="w-3 h-3 rounded-full bg-gradient-hematoxylin" />
                          <h3 className="text-xl font-bold text-primary">
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
                        <p className="text-muted-foreground ml-7">
                          {category.description}
                        </p>
                      </div>
                      
                      {/* Predictions Grid */}
                      {categoryPredictions.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                          {categoryPredictions.map((prediction, index) => (
                            <PredictionCard
                              key={`${prediction.category}-${index}`}
                              imageUrl={prediction.imageUrl}
                              fileName={prediction.fileName}
                              confidence={prediction.confidence}
                              className="cursor-pointer hover-scale"
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
                    </TabsContent>
                  );
                })}
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>

        {/* Log Dialog */}
        <Dialog open={showLogDialog} onOpenChange={setShowLogDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-primary" />
                Full Analysis Log
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4 max-h-[70vh] overflow-y-auto">
              <AnalysisLog messages={logMessages} isProcessing={isProcessing} />
            </div>
          </DialogContent>
        </Dialog>

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