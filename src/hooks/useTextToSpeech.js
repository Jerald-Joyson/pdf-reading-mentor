import { useState, useEffect, useCallback, useRef } from 'react';

const useTextToSpeech = (pdfText) => {
  const [isReading, setIsReading] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [volume, setVolume] = useState(1);
  const [rate, setRate] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  
  const synth = useRef(null);
  const utterance = useRef(null);
  const textQueue = useRef([]);
  const isMounted = useRef(true);

  // Initialize speech synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synth.current = window.speechSynthesis;
    }
    
    return () => {
      isMounted.current = false;
      if (synth.current) {
        synth.current.cancel();
      }
    };
  }, []);

  // Process PDF text into speakable chunks
  useEffect(() => {
    if (!pdfText || pdfText.length === 0) return;
    
    // Reset state when new PDF is loaded
    setCurrentPage(1);
    setCurrentTextIndex(0);
    
    // Process text into speakable chunks
    const chunks = [];
    
    pdfText.forEach(page => {
      // Group by paragraphs or meaningful sections
      let currentParagraph = '';
      let lastY = null;
      
      page.content.forEach(item => {
        // If y position changes significantly, it's likely a new paragraph
        if (lastY !== null && Math.abs(lastY - item.y) > 10) {
          if (currentParagraph.trim().length > 0) {
            chunks.push({
              text: currentParagraph.trim(),
              pageNumber: page.pageNumber
            });
          }
          currentParagraph = item.text;
        } else {
          currentParagraph += ' ' + item.text;
        }
        
        lastY = item.y;
      });
      
      // Don't forget the last paragraph
      if (currentParagraph.trim().length > 0) {
        chunks.push({
          text: currentParagraph.trim(),
          pageNumber: page.pageNumber
        });
      }
    });
    
    textQueue.current = chunks;
  }, [pdfText]);

  // Handle utterance events
  const setupUtterance = useCallback((text, pageNumber, index) => {
    if (!synth.current) return null;
    
    const newUtterance = new SpeechSynthesisUtterance(text);
    newUtterance.volume = volume;
    newUtterance.rate = rate;
    
    // Use first available voice or let the browser choose
    const voices = synth.current.getVoices();
    if (voices.length > 0) {
      newUtterance.voice = voices[0];
    }
    
    // Set up event handlers
    newUtterance.onstart = () => {
      if (isMounted.current) {
        setIsReading(true);
        setCurrentPosition({ text, pageNumber, index });
        setCurrentPage(pageNumber);
      }
    };
    
    newUtterance.onend = () => {
      if (isMounted.current) {
        // Move to next text chunk
        if (index < textQueue.current.length - 1) {
          const nextIndex = index + 1;
          const nextChunk = textQueue.current[nextIndex];
          setCurrentTextIndex(nextIndex);
          
          // Speak next chunk
          setupUtterance(nextChunk.text, nextChunk.pageNumber, nextIndex);
        } else {
          // End of document
          setIsReading(false);
          setCurrentPosition(null);
        }
      }
    };
    
    newUtterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      if (isMounted.current) {
        setIsReading(false);
      }
    };
    
    // Store the utterance
    utterance.current = newUtterance;
    
    // Speak
    synth.current.speak(newUtterance);
    
    return newUtterance;
  }, [volume, rate]);

  // Control functions
  const startReading = useCallback(() => {
    if (!synth.current || textQueue.current.length === 0) return;
    
    // Cancel any current speech
    synth.current.cancel();
    
    // Start from current position
    const chunk = textQueue.current[currentTextIndex];
    setupUtterance(chunk.text, chunk.pageNumber, currentTextIndex);
  }, [currentTextIndex, setupUtterance]);

  const pauseReading = useCallback(() => {
    if (!synth.current) return;
    synth.current.pause();
    setIsReading(false);
  }, []);

  const resumeReading = useCallback(() => {
    if (!synth.current) return;
    synth.current.resume();
    setIsReading(true);
  }, []);

  const stopReading = useCallback(() => {
    if (!synth.current) return;
    synth.current.cancel();
    setIsReading(false);
    setCurrentPosition(null);
  }, []);

  const changeVolume = useCallback((newVolume) => {
    setVolume(newVolume);
    if (utterance.current) {
      utterance.current.volume = newVolume;
    }
  }, []);

  const changeRate = useCallback((newRate) => {
    setRate(newRate);
    if (utterance.current) {
      utterance.current.rate = newRate;
    }
  }, []);

  const skipForward = useCallback(() => {
    if (!textQueue.current.length) return;
    
    // Skip to next paragraph
    const nextIndex = Math.min(currentTextIndex + 1, textQueue.current.length - 1);
    setCurrentTextIndex(nextIndex);
    
    // Stop current speech
    synth.current.cancel();
    
    // If was reading, start reading from new position
    if (isReading) {
      const chunk = textQueue.current[nextIndex];
      setupUtterance(chunk.text, chunk.pageNumber, nextIndex);
    }
  }, [currentTextIndex, isReading, setupUtterance]);

  const skipBackward = useCallback(() => {
    if (!textQueue.current.length) return;
    
    // Skip to previous paragraph
    const prevIndex = Math.max(currentTextIndex - 1, 0);
    setCurrentTextIndex(prevIndex);
    
    // Stop current speech
    synth.current.cancel();
    
    // If was reading, start reading from new position
    if (isReading) {
      const chunk = textQueue.current[prevIndex];
      setupUtterance(chunk.text, chunk.pageNumber, prevIndex);
    }
  }, [currentTextIndex, isReading, setupUtterance]);

  const jumpToPage = useCallback((pageNumber) => {
    if (!textQueue.current.length) return;
    
    // Find the first text chunk on the requested page
    const index = textQueue.current.findIndex(chunk => chunk.pageNumber === pageNumber);
    if (index !== -1) {
      setCurrentTextIndex(index);
      setCurrentPage(pageNumber);
      
      // Stop current speech
      synth.current.cancel();
      
      // If was reading, start reading from new position
      if (isReading) {
        const chunk = textQueue.current[index];
        setupUtterance(chunk.text, pageNumber, index);
      }
    }
  }, [isReading, setupUtterance]);

  return {
    isReading,
    currentPosition,
    volume,
    rate,
    currentPage,
    startReading,
    pauseReading,
    resumeReading,
    stopReading,
    changeVolume,
    changeRate,
    skipForward,
    skipBackward,
    jumpToPage
  };
};

export default useTextToSpeech;