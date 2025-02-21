import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, SkipBack, SkipForward, Upload, Settings, FileText } from 'lucide-react';
import { PDFViewer } from '@/components/PDFViewer';
import { supabase } from '@/utils/supabase';
import { getFileUrl } from '@/utils/supabase';
import { DBFile } from '@/types/supabase';

interface PracticeSessionPlayerProps {
  sessionId: string;
  sessionName: string;
}

export function PracticeSessionPlayer({ sessionId, sessionName }: PracticeSessionPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [files, setFiles] = useState<DBFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<DBFile | null>(null);

  // Fetch files for this practice session
  useEffect(() => {
    async function fetchFiles() {
      const { data: session } = await supabase
        .from('practice_sessions')
        .select('project_id')
        .eq('id', sessionId)
        .single();

      if (session && session.project_id) {
        const { data: files } = await supabase
          .from('files')
          .select('*')
          .eq('project_id', session.project_id)
          .eq('type', 'application/pdf');

        setFiles(files || []);
      }
    }

    fetchFiles();
  }, [sessionId]);

    const handleFileSelect = async (file: DBFile) => {
      console.log('File:', file); // Add this
      const { data: { publicUrl } } = supabase.storage
        .from('project-files')
        .getPublicUrl(file.storage_path);
      
      console.log('Public URL:', publicUrl); // Add this
    
      setSelectedFile({
        ...file,
        url: publicUrl
      });
    };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{sessionName}</h1>
        <div className="flex gap-2">
          {/* File Selection Dropdown */}
          <select
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm"
            onChange={(e) => {
              const file = files.find(f => f.id === e.target.value);
              if (file) handleFileSelect(file);
            }}
            value={selectedFile?.id || ''}
          >
            <option value="">Select a score</option>
            {files.map(file => (
              <option key={file.id} value={file.id}>
                {file.name}
              </option>
            ))}
          </select>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Score Display */}
        <div className="flex-1 bg-gray-50 p-4 overflow-auto">
          {selectedFile && selectedFile.url ? (
            selectedFile.type === 'application/pdf' ? (
              <PDFViewer url={selectedFile.url} />
            ) : (
              <div className="text-center text-gray-500">
                Unsupported file type
              </div>
            )
          ) : (
            <Card className="w-full h-full flex items-center justify-center text-gray-500">
              Select a score to display
            </Card>
          )}
        </div>
      </div>

      {/* Playback Controls */}
      <div className="bg-white border-t p-4">
        <div className="flex items-center justify-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => {/* Handle skip back */}}
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button 
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
            className="h-12 w-12"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>

          <Button 
            variant="outline" 
            size="icon"
            onClick={() => {/* Handle skip forward */}}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        {/* Click Track Selection */}
        <div className="mt-4 flex justify-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className={isPlaying ? 'bg-blue-50' : ''}
          >
            UREI Click
          </Button>
          <Button 
            variant="outline" 
            size="sm"
          >
            Standard Click
          </Button>
          <Button 
            variant="outline" 
            size="sm"
          >
            No Click
          </Button>
        </div>
      </div>
    </div>
  );
}