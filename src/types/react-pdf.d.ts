declare module 'react-pdf' {
  interface DocumentProps {
    file: string;
    onLoadSuccess: (data: { numPages: number }) => void;
    onLoadError?: (error: Error) => void;
    loading?: React.ReactNode;
    error?: React.ReactNode;
    className?: string;
    children?: React.ReactNode;
  }

  interface PageProps {
    pageNumber: number;
    renderTextLayer?: boolean;
    renderAnnotationLayer?: boolean;
  }

  export const Document: React.FC<DocumentProps>;
  export const Page: React.FC<PageProps>;
  export const pdfjs: {
    GlobalWorkerOptions: {
      workerSrc: string;
    };
    version: string;
  };
}

declare module 'pdfjs-dist/build/pdf.worker.min' {
  const content: any;
  export default content;
} 