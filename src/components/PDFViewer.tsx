import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set worker URL
const workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  url: string | undefined;
}

export function PDFViewer({ url }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoading(false);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('Error loading PDF:', error);
    setError(`Error loading PDF: ${error.message}`);
    setLoading(false);
  };

  if (!url) {
    return <div className="flex items-center justify-center h-full">No PDF URL provided</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        loading={<div className="flex items-center justify-center h-full">Loading PDF...</div>}
        error={<div className="text-red-500">{error}</div>}
      >
        {!loading && !error && (
          <>
            <Page pageNumber={pageNumber} />
            <div className="flex items-center gap-4 mt-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                disabled={pageNumber <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="text-sm">Page {pageNumber} of {numPages}</div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}
                disabled={pageNumber >= numPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </Document>
    </div>
  );
} 