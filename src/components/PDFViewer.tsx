interface PDFViewerProps {
  url: string | undefined;
}

export function PDFViewer({ url }: PDFViewerProps) {
  if (!url) {
    return <div className="flex items-center justify-center h-full">No PDF URL provided</div>;
  }

  return (
    <div className="w-full h-full">
      <iframe
        src={`${url}#view=FitH`}
        className="w-full h-full border-0"
        title="PDF Viewer"
      />
    </div>
  );
}