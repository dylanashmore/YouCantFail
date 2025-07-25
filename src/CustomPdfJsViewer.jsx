import React from 'react';

function CustomPdfJsViewer({ fileUrl }) {
  const viewerUrl = `/web/viewer.html?file=${encodeURIComponent(fileUrl)}`;
  return (
    <iframe
      src={viewerUrl}
      title="PDF.js Viewer"
      width="100%"
      height = "100%"
      style={{ border: 'none', height: '100vh' }} // This is the crucial part for the iframe to fill its parent
    />
  );
}

export default CustomPdfJsViewer;