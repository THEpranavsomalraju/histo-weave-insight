import { Upload, FileImage } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadAreaProps {
  onFileSelect: (files: FileList) => void;
  className?: string;
}

export const FileUploadArea = ({ onFileSelect, className }: FileUploadAreaProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelect(e.target.files);
    }
  };

  return (
    <label
      className={cn(
        "w-full max-w-2xl border-2 border-dashed border-primary/30 rounded-2xl p-12",
        "text-center cursor-pointer transition-all duration-300",
        "hover:border-primary/50 hover:bg-primary/5 hover:shadow-clinical",
        "bg-card shadow-card",
        className
      )}
      htmlFor="fileInput"
    >
      <input
        id="fileInput"
        type="file"
        accept="image/png,image/jpeg,image/tiff,.svs,.ndpi"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
      <div className="flex flex-col items-center gap-4">
        <div className="p-4 rounded-full bg-gradient-hematoxylin">
          <Upload className="w-8 h-8 text-primary-foreground" />
        </div>
        <div>
          <div className="text-lg font-semibold text-foreground mb-2">
            Upload Whole Slide Images
          </div>
          <div className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <FileImage className="w-4 h-4" />
            Click or drag WSI files (PNG, JPEG, TIFF, SVS, NDPI)
          </div>
        </div>
      </div>
    </label>
  );
};