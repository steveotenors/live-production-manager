"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  Music, 
  File, 
  ZoomIn, 
  ZoomOut, 
  Pencil, 
  Eraser, 
  Undo, 
  Redo, 
  Save,
  Download,
  Upload,
  Share2,
  BookOpen,
  Hand,
  ArrowLeft,
  ArrowRight,
  X,
  Plus,
  Layers,
  Layout,
  Play,
  Pause
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Types for annotations and score data
interface Annotation {
  id: string;
  type: 'highlight' | 'note' | 'drawing';
  x: number;
  y: number;
  width?: number;
  height?: number;
  color: string;
  content?: string;
  pageNumber: number;
  drawingPath?: { x: number; y: number }[];
}

interface ScorePage {
  id: string;
  pageNumber: number;
  imageUrl: string;
}

interface ScoreData {
  id: string;
  title: string;
  composer: string;
  parts: string[];
  pages: ScorePage[];
}

interface ScoreViewerProps {
  initialScore?: ScoreData;
  onSaveAnnotations?: (annotations: Annotation[]) => void;
  className?: string;
}

export function ScoreViewer({
  initialScore,
  onSaveAnnotations,
  className
}: ScoreViewerProps) {
  // Demo score data if no initial score is provided
  const demoScore: ScoreData = {
    id: 'score-1',
    title: 'Symphony No. 9',
    composer: 'Ludwig van Beethoven',
    parts: ['Full Score', 'Strings', 'Woodwinds', 'Brass', 'Percussion', 'Vocal'],
    pages: Array.from({ length: 12 }, (_, i) => ({
      id: `page-${i + 1}`,
      pageNumber: i + 1,
      imageUrl: `/scores/demo-score-${i + 1}.jpg`
    }))
  };
  
  // State
  const [score, setScore] = useState<ScoreData>(initialScore || demoScore);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [tool, setTool] = useState<'pan' | 'highlight' | 'note' | 'draw' | 'erase'>('pan');
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentDrawingPath, setCurrentDrawingPath] = useState<{ x: number; y: number }[]>([]);
  const [drawingColor, setDrawingColor] = useState('#FF6B6B');
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedPart, setSelectedPart] = useState<string>('Full Score');
  
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scoreContainerRef = useRef<HTMLDivElement>(null);
  
  // Draw annotations on the canvas
  const drawAnnotations = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw only the annotations for the current page
    const pageAnnotations = annotations.filter(a => a.pageNumber === currentPage);
    
    pageAnnotations.forEach(annotation => {
      ctx.strokeStyle = annotation.color;
      ctx.fillStyle = annotation.color + '40'; // Add transparency
      ctx.lineWidth = 2;
      
      if (annotation.type === 'highlight' && annotation.width && annotation.height) {
        ctx.fillRect(annotation.x, annotation.y, annotation.width, annotation.height);
        ctx.strokeRect(annotation.x, annotation.y, annotation.width, annotation.height);
      } else if (annotation.type === 'note' && annotation.content) {
        // Draw note indicator
        ctx.beginPath();
        ctx.arc(annotation.x, annotation.y, 10, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        
        // Draw note content
        ctx.font = '12px Arial';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(annotation.content.substring(0, 1), annotation.x - 4, annotation.y + 4);
        
        // Note tooltip would be handled with HTML overlay in a real implementation
      } else if (annotation.type === 'drawing' && annotation.drawingPath && annotation.drawingPath.length > 0) {
        ctx.beginPath();
        ctx.moveTo(annotation.drawingPath[0].x, annotation.drawingPath[0].y);
        
        for (let i = 1; i < annotation.drawingPath.length; i++) {
          ctx.lineTo(annotation.drawingPath[i].x, annotation.drawingPath[i].y);
        }
        
        ctx.stroke();
      }
    });
    
    // Draw current drawing path
    if (isDrawing && tool === 'draw' && currentDrawingPath.length > 0) {
      ctx.strokeStyle = drawingColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(currentDrawingPath[0].x, currentDrawingPath[0].y);
      
      for (let i = 1; i < currentDrawingPath.length; i++) {
        ctx.lineTo(currentDrawingPath[i].x, currentDrawingPath[i].y);
      }
      
      ctx.stroke();
    }
  };
  
  // Handle mouse events for drawing
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === 'draw') {
      setIsDrawing(true);
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setCurrentDrawingPath([{ x, y }]);
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDrawing && tool === 'draw') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setCurrentDrawingPath(prev => [...prev, { x, y }]);
    }
  };
  
  const handleMouseUp = () => {
    if (isDrawing && tool === 'draw' && currentDrawingPath.length > 0) {
      const newAnnotation: Annotation = {
        id: `annotation-${Date.now()}`,
        type: 'drawing',
        x: currentDrawingPath[0].x,
        y: currentDrawingPath[0].y,
        color: drawingColor,
        pageNumber: currentPage,
        drawingPath: [...currentDrawingPath]
      };
      
      setAnnotations(prev => [...prev, newAnnotation]);
      setCurrentDrawingPath([]);
      setIsDrawing(false);
    }
  };
  
  // Handle saving annotations
  const handleSaveAnnotations = () => {
    if (onSaveAnnotations) {
      onSaveAnnotations(annotations);
    }
    
    // In a real implementation, you would save to a database or API
    console.log('Saving annotations:', annotations);
  };
  
  // Handle changing the page
  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= score.pages.length) {
      setCurrentPage(pageNumber);
    }
  };
  
  // Add note annotation at a specific position
  const addNoteAnnotation = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (tool === 'note') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const noteContent = window.prompt('Enter your note:');
      if (noteContent) {
        const newAnnotation: Annotation = {
          id: `annotation-${Date.now()}`,
          type: 'note',
          x,
          y,
          color: drawingColor,
          content: noteContent,
          pageNumber: currentPage
        };
        
        setAnnotations(prev => [...prev, newAnnotation]);
      }
    }
  };
  
  // Handle tool selection
  const handleToolChange = (newTool: 'pan' | 'highlight' | 'note' | 'draw' | 'erase') => {
    setTool(newTool);
  };
  
  // Update canvas when annotations or page changes
  useEffect(() => {
    drawAnnotations();
  }, [annotations, currentPage, currentDrawingPath, isDrawing, tool]);
  
  // Resize canvas when window or zoom changes
  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const container = scoreContainerRef.current;
      if (!canvas || !container) return;
      
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      
      drawAnnotations();
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [zoom]);
  
  // Simulate playing the score
  useEffect(() => {
    let playTimer: NodeJS.Timeout;
    
    if (isPlaying) {
      playTimer = setTimeout(() => {
        if (currentPage < score.pages.length) {
          setCurrentPage(prevPage => prevPage + 1);
        } else {
          setIsPlaying(false);
        }
      }, 5000); // Auto-advance every 5 seconds for the demo
    }
    
    return () => {
      if (playTimer) clearTimeout(playTimer);
    };
  }, [isPlaying, currentPage, score.pages.length]);
  
  return (
    <Card className={`glass obsidian-reflection shadow-gold-glow ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="premium-gradient-text flex items-center">
            <Music className="mr-2 h-5 w-5" />
            Score Viewer
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium mr-1">{score.title}</span>
            <Badge variant="outline" className="bg-primary/10">
              {score.composer}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="flex flex-col h-[calc(100vh-20rem)] min-h-[500px]">
          {/* Top toolbar */}
          <div className="flex justify-between items-center p-4 border-b border-primary/10">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`h-8 w-8 p-0 ${tool === 'pan' ? 'bg-primary/20 text-primary' : ''}`}
                onClick={() => handleToolChange('pan')}
              >
                <Hand className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`h-8 w-8 p-0 ${tool === 'draw' ? 'bg-primary/20 text-primary' : ''}`}
                onClick={() => handleToolChange('draw')}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`h-8 w-8 p-0 ${tool === 'erase' ? 'bg-primary/20 text-primary' : ''}`}
                onClick={() => handleToolChange('erase')}
              >
                <Eraser className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`h-8 w-8 p-0 ${tool === 'note' ? 'bg-primary/20 text-primary' : ''}`}
                onClick={() => handleToolChange('note')}
              >
                <Plus className="h-4 w-4" />
              </Button>
              
              <div className="h-6 w-px bg-primary/10 mx-1"></div>
              
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => setZoom(prev => Math.max(prev - 10, 50))}
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-xs w-12 text-center">{zoom}%</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => setZoom(prev => Math.min(prev + 10, 200))}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="h-6 w-px bg-primary/10 mx-1"></div>
              
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 p-0 px-2 text-xs"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  Prev
                </Button>
                
                <div className="flex items-center">
                  <Input
                    type="number"
                    className="w-12 h-7 text-center p-0"
                    min={1}
                    max={score.pages.length}
                    value={currentPage}
                    onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                  />
                  <span className="text-xs mx-1">of {score.pages.length}</span>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 p-0 px-2 text-xs"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage >= score.pages.length}
                >
                  Next
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    <Layers className="h-4 w-4 mr-1" />
                    <span>{selectedPart}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {score.parts.map(part => (
                    <DropdownMenuItem 
                      key={part} 
                      onClick={() => setSelectedPart(part)}
                      className={selectedPart === part ? 'bg-primary/10' : ''}
                    >
                      {part}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button 
                variant={isPlaying ? 'default' : 'outline'} 
                size="sm" 
                className="h-8"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-4 w-4 mr-1" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-1" />
                    Play
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8"
                onClick={handleSaveAnnotations}
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          </div>
          
          {/* Score viewer */}
          <div 
            className="flex-1 relative overflow-auto bg-black/10 backdrop-blur-sm" 
            ref={scoreContainerRef}
            style={{ 
              backgroundImage: `url(/scores/demo-score-${currentPage}.jpg)`, 
              backgroundSize: `${zoom}%`,
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <canvas 
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onClick={tool === 'note' ? addNoteAnnotation : undefined}
            />
          </div>
          
          {/* Color picker for drawing */}
          {tool === 'draw' && (
            <div className="p-2 flex items-center justify-center gap-2 border-t border-primary/10">
              {['#FF6B6B', '#4ECDC4', '#FFD166', '#6A0572', '#FFFFFF'].map(color => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded-full border ${drawingColor === color ? 'ring-2 ring-primary' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setDrawingColor(color)}
                />
              ))}
              <div className="h-6 w-px bg-primary/10 mx-1"></div>
              <div className="text-xs text-muted-foreground">Line thickness:</div>
              <Slider 
                defaultValue={[2]}
                max={10}
                min={1}
                step={1}
                className="w-24"
              />
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between border-t border-primary/10 py-3">
        <div className="text-xs text-muted-foreground">
          {annotations.filter(a => a.pageNumber === currentPage).length} annotations on this page
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <Download className="h-3.5 w-3.5 mr-1" />
            Export
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-xs">
            <Share2 className="h-3.5 w-3.5 mr-1" />
            Share
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

export default ScoreViewer; 