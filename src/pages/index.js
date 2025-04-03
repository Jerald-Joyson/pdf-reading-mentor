import { useState, useEffect } from 'react';
import Head from 'next/head';
import FileUpload from '../components/FileUpload';
import PDFViewer from '../components/PDFViewer';
import PlaybackControls from '../components/PlaybackControls';
import QuestionInput from '../components/QuestionInput';
import AIResponseArea from '../components/AIResponseArea';
import usePDFProcessor from '../hooks/usePDFProcessor';
import useTextToSpeech from '../hooks/useTextToSpeech';
import useAIIntegration from '../hooks/useAIIntegration';

export default function Home() {
  const {
    processPDF,
    pdfText,
    getPlainText,
    isProcessing,
    error: pdfError,
    numPages,
    currentPage,
    goToPage,
    pdfFile,
  } = usePDFProcessor();

  const {
    isReading,
    currentPosition,
    volume,
    rate,
    startReading,
    pauseReading,
    resumeReading,
    stopReading,
    changeVolume,
    changeRate,
    skipForward,
    skipBackward,
    jumpToPage,
  } = useTextToSpeech(pdfText);

  const {
    askQuestion,
    clearConversation,
    conversation,
    isLoading: aiLoading,
    error: aiError,
  } = useAIIntegration(pdfText);

  const [processingState, setProcessingState] = useState('idle');
  
  // Handle initial loading state
  useEffect(() => {
    if (isProcessing) {
      setProcessingState('processing');
    } else if (pdfText.length > 0) {
      setProcessingState('ready');
    } else {
      setProcessingState('idle');
    }
  }, [isProcessing, pdfText]);

  // Handle PDF upload
  const handleFileUpload = async (file) => {
    stopReading();
    clearConversation();
    await processPDF(file);
  };

  // Handle page navigation from playback
  useEffect(() => {
    if (currentPosition && currentPosition.pageNumber !== currentPage) {
      goToPage(currentPosition.pageNumber);
    }
  }, [currentPosition, currentPage, goToPage]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>PDF Reading Mentor</title>
        <meta name="description" content="Interactive PDF reader with AI capabilities" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">PDF Reading Mentor</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left column: PDF viewer */}
          <div className="lg:col-span-2 space-y-6">
            {/* File upload section */}
            <section aria-labelledby="upload-section">
              <FileUpload 
                onFileUpload={handleFileUpload} 
                isLoading={isProcessing} 
              />
              {pdfError && (
                <div className="mt-2 text-red-600 text-sm">{pdfError}</div>
              )}
            </section>

            {/* PDF viewer */}
            <section aria-labelledby="pdf-viewer-section" className="h-[600px]">
              <PDFViewer
                pdfFile={pdfFile}
                currentPage={currentPage}
                numPages={numPages}
                goToPage={goToPage}
                currentReadingPosition={currentPosition}
                isReading={isReading}
              />
            </section>
          </div>

          {/* Right column: Controls and AI interaction */}
          <div className="space-y-6">
            {/* Playback controls */}
            <section aria-labelledby="playback-controls-section">
              <PlaybackControls
                isReading={isReading}
                startReading={startReading}
                pauseReading={pauseReading}
                resumeReading={resumeReading}
                stopReading={stopReading}
                skipForward={skipForward}
                skipBackward={skipBackward}
                volume={volume}
                changeVolume={changeVolume}
                rate={rate}
                changeRate={changeRate}
                disabled={processingState !== 'ready'}
              />
            </section>

            {/* AI interaction section */}
            <section aria-labelledby="ai-interaction-section" className="space-y-4">
              <h2 className="text-lg font-medium">Ask the AI Mentor</h2>
              <QuestionInput
                onAskQuestion={askQuestion}
                isLoading={aiLoading}
                disabled={processingState !== 'ready'}
              />
              {aiError && (
                <div className="text-red-600 text-sm">{aiError}</div>
              )}
              <AIResponseArea
                conversation={conversation}
                isLoading={aiLoading}
              />
            </section>
          </div>
        </div>
      </main>

      <footer className="bg-white mt-12 py-6 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            PDF Reading Mentor - Interactive PDF reader with AI capabilities
          </p>
        </div>
      </footer>
    </div>
  );
}