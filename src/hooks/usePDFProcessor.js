import { useState, useCallback } from 'react';
import * as pdfjs from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist';

// Configure the worker properly for Next.js environment
if (typeof window !== 'undefined') {
  // Only load the worker in browser environment
  GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
}
// Ensure PDF.js worker is available
// const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
// pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const usePDFProcessor = () => {
  const [pdfText, setPdfText] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const processPDF = useCallback(async (file) => {
    setIsProcessing(true);
    setError(null);
    setPdfFile(file);

    try {
      const fileReader = new FileReader();
      
      fileReader.onload = async function() {
        const typedArray = new Uint8Array(this.result);
        
        try {
          const pdf = await pdfjs.getDocument({ data: typedArray }).promise;
          setNumPages(pdf.numPages);
          
          const allPages = [];
          
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            
            // Process text items and maintain some structure
            const pageText = textContent.items.map(item => {
              return {
                text: item.str,
                x: item.transform[4], // x-coordinate
                y: item.transform[5], // y-coordinate
                fontSize: item.transform[0], // Font size approximation
                pageNumber: i
              };
            });
            
            // Sort by y-coordinate (top to bottom) then x-coordinate (left to right)
            pageText.sort((a, b) => {
              // Group items into lines based on y-coordinate proximity
              const yDiff = Math.abs(a.y - b.y);
              if (yDiff < 5) { // Items on the same line (adjust threshold as needed)
                return a.x - b.x; // Sort left to right
              }
              return b.y - a.y; // Sort top to bottom
            });
            
            allPages.push({
              pageNumber: i,
              content: pageText
            });
          }
          
          setPdfText(allPages);
          setIsProcessing(false);
        } catch (err) {
          console.error('Error processing PDF:', err);
          setError('Failed to process the PDF. Please try another file.');
          setIsProcessing(false);
        }
      };
      
      fileReader.onerror = () => {
        setError('Error reading file');
        setIsProcessing(false);
      };
      
      fileReader.readAsArrayBuffer(file);
    } catch (err) {
      setError('Error processing the file');
      setIsProcessing(false);
    }
  }, []);

  // Get plain text representation (for AI processing)
  const getPlainText = useCallback(() => {
    return pdfText.map(page => {
      const pageContent = page.content.map(item => item.text).join(' ');
      return `[Page ${page.pageNumber}] ${pageContent}`;
    }).join('\n\n');
  }, [pdfText]);
  
  // Navigate to a specific page
  const goToPage = useCallback((pageNum) => {
    if (pageNum >= 1 && pageNum <= numPages) {
      setCurrentPage(pageNum);
    }
  }, [numPages]);

  return {
    processPDF,
    pdfText,
    getPlainText,
    isProcessing,
    error,
    numPages,
    currentPage,
    goToPage,
    pdfFile
  };
};

export default usePDFProcessor;