import React, { useState } from 'react';
import { 
  FiPlay, 
  FiPause, 
  FiSkipBack, 
  FiSkipForward, 
  FiVolume2, 
  FiVolumeX,
  FiRefreshCw
} from 'react-icons/fi';

const PlaybackControls = ({
  isReading,
  startReading,
  pauseReading,
  resumeReading,
  stopReading,
  skipForward,
  skipBackward,
  volume,
  changeVolume,
  rate,
  changeRate,
  disabled
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [previousVolume, setPreviousVolume] = useState(1);

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    changeVolume(newVolume);
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (isMuted) {
      // Unmute
      changeVolume(previousVolume > 0 ? previousVolume : 0.5);
      setIsMuted(false);
    } else {
      // Mute
      setPreviousVolume(volume);
      changeVolume(0);
      setIsMuted(true);
    }
  };

  const handleRateChange = (e) => {
    const newRate = parseFloat(e.target.value);
    changeRate(newRate);
  };

  return (
    <div className="w-full bg-gray-100 rounded-lg p-4 shadow-md" role="region" aria-label="Playback controls">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Playback Controls</h3>
      </div>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Main playback controls */}
        <div className="flex items-center justify-around space-x-4">
          <button
            onClick={skipBackward}
            disabled={disabled}
            className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Skip backward"
          >
            <FiSkipBack className="w-5 h-5" />
          </button>
          
          {isReading ? (
            <button
              onClick={pauseReading}
              disabled={disabled}
              className="p-4 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Pause reading"
            >
              <FiPause className="w-6 h-6" />
            </button>
          ) : (
            <button
              onClick={isReading ? resumeReading : startReading}
              disabled={disabled}
              className="p-4 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Start reading"
            >
              <FiPlay className="w-6 h-6" />
            </button>
          )}
          
          <button
            onClick={skipForward}
            disabled={disabled}
            className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Skip forward"
          >
            <FiSkipForward className="w-5 h-5" />
          </button>
          
          <button
            onClick={stopReading}
            disabled={disabled}
            className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Stop reading"
          >
            <FiRefreshCw className="w-5 h-5" />
          </button>
        </div>
        
        {/* Volume and rate controls */}
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleMute}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <FiVolumeX className="w-5 h-5" /> : <FiVolume2 className="w-5 h-5" />}
            </button>
            
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
              aria-label="Volume control"
            />
            
            <span className="text-sm w-8 text-right">
              {Math.round(volume * 100)}%
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <span className="text-sm">Speed:</span>
            
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={rate}
              onChange={handleRateChange}
              className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
              aria-label="Speech rate control"
            />
            
            <span className="text-sm w-8 text-right">
              {rate}x
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaybackControls;