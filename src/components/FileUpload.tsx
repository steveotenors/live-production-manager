import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { supabase } from '@/utils/supabase';

interface FileUploadProps {
  projectId: string;
  onUploadComplete: () => void;
}

export function FileUpload({ projectId, onUploadComplete }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${projectId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('project-files')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { error: dbError } = await supabase
          .from('files')
          .insert([{
            project_id: projectId,
            name: file.name,
            size: file.size,
            type: file.type,
            storage_path: filePath
          }]);

        if (dbError) throw dbError;
      }

      // Clear the input value to allow uploading the same file again
      event.target.value = '';
      
      // Trigger the refresh
      onUploadComplete();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <Button 
        variant="outline" 
        disabled={isUploading}
        asChild
      >
        <label className="cursor-pointer flex items-center">
          <Upload className="h-4 w-4 mr-2" />
          {isUploading ? 'Uploading...' : 'Upload Files'}
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            multiple
            disabled={isUploading}
          />
        </label>
      </Button>
    </div>
  );
}