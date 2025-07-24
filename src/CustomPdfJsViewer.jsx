import React from 'react';

function CustomPdfJsViewer({ fileUrl }) {
  // Pass the PDF file URL as a query param to the viewer
  const viewerUrl = `/web/viewer.html?file=${encodeURIComponent(fileUrl)}`;
  return (
    <iframe
      src={viewerUrl}
      title="PDF.js Viewer"
      width="100%"
      height="800"
      style={{ border: 'none' }}
    />
  );
}

export default CustomPdfJsViewer;