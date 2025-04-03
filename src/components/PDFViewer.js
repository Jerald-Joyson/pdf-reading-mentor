import React, { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// Set worker source to local file
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const PDFViewer = ({ 
  pdfFile, 
  currentPage, 
  numPages, 
  goToPage, 
  currentReadingPosition,
  isReading
}) => {
  const [pageWidth, setPageWidth] = useState(600);
  const [pageHeight, setPageHeight] = useState(800);
  const containerRef = useRef(null);
  const textLayerRef = useRef(null);
  const [scale, setScale] = useState(1);
  
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        setPageWidth(width > 800 ? 800 : width - 32);
      }
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Handle highlighting of current reading position
  useEffect(() => {
    if (textLayerRef.current && currentReadingPosition) {
      // Clear previous highlights
      const prevHighlighted = textLayerRef.current.querySelectorAll('.highlighted-text');
      prevHighlighted.forEach(el => {
        el.classList.remove('highlighted-text');
      });
      
      // Find the text elements that match the current reading position
      const textElements = textLayerRef.current.querySelectorAll('.react-pdf__Page__textContent span');
      
      // This is simplified logic - in a real app, you'd need a more sophisticated 
      // approach to find and highlight the exact position
      if (currentReadingPosition && currentReadingPosition.text) {
        const textToFind = currentReadingPosition.text;
        
        textElements.forEach(element => {
          if (element.textContent.includes(textToFind)) {
            element.classList.add('highlighted-text');
            
            // Scroll into view if needed
            if (isReading) {
              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }
        });
      }
    }
  }, [currentReadingPosition, isReading, currentPage]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    console.log(`Document loaded with ${numPages} pages`);
  };

  return (
    <div 
      ref={containerRef} 
      className="pdf-container w-full overflow-auto border rounded-lg bg-gray-50 shadow-inner"
      aria-label="PDF Document Viewer"
      tabIndex="0"
    >
      {pdfFile ? (
        <Document
          file={pdfFile}
          onLoadSuccess={onDocumentLoadSuccess}
          className="flex flex-col items-center py-4"
        >
          <div className="controls mb-4 flex items-center justify-center space-x-4">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              Previous
            </button>
            
            <span className="text-sm">
              Page {currentPage} of {numPages}
            </span>
            
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage >= numPages}
              className="px-3 py-1 bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              Next
            </button>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setScale(Math.max(0.5, scale - 0.1))}
                className="px-2 py-1 bg-gray-200 rounded"
                aria-label="Zoom out"
              >
                -
              </button>
              <span className="text-sm">{Math.round(scale * 100)}%</span>
              <button
                onClick={() => setScale(Math.min(2, scale + 0.1))}
                className="px-2 py-1 bg-gray-200 rounded"
                aria-label="Zoom in"
              >
                +
              </button>
            </div>
          </div>
          
          <div ref={textLayerRef} className="relative">
            <Page 
              pageNumber={currentPage} 
              width={pageWidth * scale}
              scale={scale}
              renderTextLayer={true}
              renderAnnotationLayer={true}
            />
          </div>
        </Document>
      ) : (
        <div className="flex items-center justify-center h-64 text-gray-500">
          Please upload a PDF file
        </div>
      )}
      
      <style jsx global>{`
        .highlighted-text {
          background-color: rgba(255, 230, 0, 0.4);
          border-radius: 2px;
        }
        
        .react-pdf__Page {
          margin-bottom: 16px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
        
        .react-pdf__Page__canvas {
          margin: 0 auto;
        }
        
        .react-pdf__Page__textContent {
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default PDFViewer;