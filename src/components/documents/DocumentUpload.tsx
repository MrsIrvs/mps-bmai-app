import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface FileUpload {
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'complete' | 'error';
  error?: string;
}

export function DocumentUpload() {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<FileUpload[]>([]);
  const [docType, setDocType] = useState<string>('om_manual');
  const [isDragging, setIsDragging] = useState(false);
  const { selectedBuilding, refreshBuildings } = useApp();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files).filter(
      (f) => f.type === 'application/pdf'
    );
    
    setFiles((prev) => [
      ...prev,
      ...droppedFiles.map((file) => ({ file, progress: 0, status: 'pending' as const })),
    ]);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [
        ...prev,
        ...selectedFiles.map((file) => ({ file, progress: 0, status: 'pending' as const })),
      ]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadDocuments = async () => {
    if (!selectedBuilding) {
      toast({
        title: 'No building selected',
        description: 'Please select a building before uploading documents.',
        variant: 'destructive',
      });
      return;
    }

    if (!user) {
      toast({
        title: 'Not authenticated',
        description: 'You must be logged in to upload documents.',
        variant: 'destructive',
      });
      return;
    }

    let successCount = 0;
    let errorCount = 0;

    // Upload each file
    for (let index = 0; index < files.length; index++) {
      const fileUpload = files[index];

      // Skip already completed or currently uploading files
      if (fileUpload.status === 'complete' || fileUpload.status === 'uploading') {
        continue;
      }

      try {
        // Update status to uploading
        setFiles((prev) =>
          prev.map((f, i) => (i === index ? { ...f, status: 'uploading', progress: 10 } : f))
        );

        const file = fileUpload.file;
        const fileExt = file.name.split('.').pop();
        const fileName = `${selectedBuilding.id}/${Date.now()}_${file.name}`;

        // Upload to Supabase Storage
        const { data: storageData, error: storageError } = await supabase.storage
          .from('manuals')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (storageError) {
          throw new Error(`Storage upload failed: ${storageError.message}`);
        }

        // Update progress
        setFiles((prev) =>
          prev.map((f, i) => (i === index ? { ...f, progress: 60 } : f))
        );

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('manuals')
          .getPublicUrl(fileName);

        // Insert metadata into manuals table
        const { error: dbError } = await supabase.from('manuals').insert({
          building_id: selectedBuilding.id,
          manual_name: file.name,
          equipment_type: docType,
          file_url: publicUrl,
          file_size_bytes: file.size,
          processing_status: 'pending',
          is_active: true,
        });

        if (dbError) {
          // Clean up uploaded file if database insert fails
          await supabase.storage.from('manuals').remove([fileName]);
          throw new Error(`Database insert failed: ${dbError.message}`);
        }

        // Success!
        setFiles((prev) =>
          prev.map((f, i) => (i === index ? { ...f, progress: 100, status: 'complete' } : f))
        );
        successCount++;
      } catch (error) {
        console.error('Upload error:', error);
        setFiles((prev) =>
          prev.map((f, i) =>
            i === index
              ? {
                  ...f,
                  status: 'error',
                  error: error instanceof Error ? error.message : 'Upload failed',
                }
              : f
          )
        );
        errorCount++;
      }
    }

    // Show summary toast
    if (successCount > 0) {
      toast({
        title: 'Upload complete',
        description: `Successfully uploaded ${successCount} document${successCount > 1 ? 's' : ''}.`,
      });

      // Refresh buildings to update document counts
      await refreshBuildings();

      // Close dialog after a short delay
      setTimeout(() => {
        setIsOpen(false);
        setFiles([]);
        setDocType('om_manual');
      }, 1500);
    }

    if (errorCount > 0) {
      toast({
        title: 'Upload errors',
        description: `${errorCount} document${errorCount > 1 ? 's' : ''} failed to upload. Check the error messages.`,
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-accent hover:bg-accent/90 shadow-accent">
          <Upload className="h-4 w-4" />
          Upload Documents
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload Building Documents</DialogTitle>
          <DialogDescription>
            Upload O&M manuals, compliance docs, or system descriptions. PDF format only.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Document Type */}
          <div className="space-y-2">
            <Label>Document Type</Label>
            <Select value={docType} onValueChange={setDocType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="om_manual">O&M Manual</SelectItem>
                <SelectItem value="compliance">Compliance Document</SelectItem>
                <SelectItem value="system_description">System Description</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={cn(
              'border-2 border-dashed rounded-xl p-8 text-center transition-colors',
              isDragging ? 'border-accent bg-accent/5' : 'border-border hover:border-accent/50'
            )}
          >
            <input
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10">
                  <Upload className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="font-medium">Drop files here or click to browse</p>
                  <p className="text-sm text-muted-foreground mt-1">PDF files up to 50MB each</p>
                </div>
              </div>
            </label>
          </div>

          {/* File List */}
          <AnimatePresence>
            {files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2"
              >
                {files.map((upload, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg"
                  >
                    <FileText className="h-5 w-5 text-accent shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{upload.file.name}</p>
                      {upload.status === 'uploading' && (
                        <Progress value={upload.progress} className="h-1.5 mt-2" />
                      )}
                      {upload.status === 'error' && upload.error && (
                        <p className="text-xs text-destructive mt-1">{upload.error}</p>
                      )}
                    </div>
                    {upload.status === 'complete' ? (
                      <CheckCircle className="h-5 w-5 text-success shrink-0" />
                    ) : upload.status === 'error' ? (
                      <AlertCircle className="h-5 w-5 text-destructive shrink-0" />
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 shrink-0"
                        onClick={() => removeFile(index)}
                        disabled={upload.status === 'uploading'}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={files.some((f) => f.status === 'uploading')}>
            Cancel
          </Button>
          <Button
            onClick={uploadDocuments}
            disabled={files.length === 0 || files.every((f) => f.status === 'complete' || f.status === 'uploading')}
            className="bg-accent hover:bg-accent/90"
          >
            Upload {files.length > 0 && `(${files.length})`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
