import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Video } from '@/types';

interface VideoUploaderProps {
  onUploadComplete: (video: Video) => void;
  onCancel: () => void;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({
  onUploadComplete,
  onCancel,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileSelect(file);
    }
  };

  const simulateUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        const increment = Math.floor(Math.random() * 10) + 1;
        const newProgress = Math.min(prev + increment, 100);
        
        if (newProgress === 100) {
          clearInterval(interval);
          // Create a new video object
          const newVideo: Video = {
            id: `video-${Date.now()}`,
            title: file.name.replace(/\.[^/.]+$/, ""),
            description: 'Newly uploaded video',
            fileSize: file.size,
            duration: 0,
            url: URL.createObjectURL(file),
            thumbnailUrl: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'processing',
            format: file.type.split('/')[1],
            progress: 100,
          };
          
          setTimeout(() => {
            onUploadComplete(newVideo);
          }, 500);
        }
        
        return newProgress;
      });
    }, 300);

    return () => clearInterval(interval);
  };

  const handleFileSelect = (file: File) => {
    // Check if file is a video
    if (!file.type.startsWith('video/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select a video file.',
        variant: 'destructive',
      });
      return;
    }

    // Check file size (500MB max)
    const maxSize = 500 * 1024 * 1024; // 500MB in bytes
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: 'Maximum file size is 500MB.',
        variant: 'destructive',
      });
      return;
    }

    setSelectedFile(file);
    simulateUpload(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="relative">
      <div
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragging ? 'border-primary bg-primary/5' : 'border-border'
        } ${isUploading ? 'pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={isUploading ? undefined : triggerFileInput}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="video/*"
          onChange={handleFileInputChange}
        />
        
        <div className="flex flex-col cursor-pointer items-center justify-center py-8 text-center">
          {!isUploading ? (
            <>
              <div className="mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Upload a video</h3>
              <p className="mb-4 text-muted-foreground">
                Drag and drop a video file here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Maximum file size: 500MB
              </p>
            </>
          ) : (
            <div className="w-full">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium">
                  {selectedFile?.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {uploadProgress}% • {formatFileSize(selectedFile?.size || 0)}
                </div>
              </div>
              
              <Progress
                className="h-2 w-full mb-4"
                value={uploadProgress}
              />
              
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoUploader;
