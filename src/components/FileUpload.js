import React, { useState, useRef } from 'react';
import { FiFile, FiCheckCircle } from 'react-icons/fi';

const FileUpload = ({ onFileUpload, isLoading }) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0] && e.dataTransfer.files[0].type === 'application/pdf') {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    setFileName(file.name);
    setFileUploaded(true);
    onFileUpload(file);
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  return (
    <div className="w-full max-w-xl mx-auto mb-8">
      <div 
        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg transition-colors p-6
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'}
          ${fileUploaded ? 'bg-green-50 border-green-300' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          onChange={handleChange}
          className="hidden"
          id="file-upload"
          aria-label="Upload PDF file"
        />

        {fileUploaded ? (
          <div className="flex flex-col items-center justify-center text-center">
            <FiCheckCircle className="w-12 h-12 mb-3 text-green-500" />
            <p className="mb-2 text-sm text-gray-700">
              <span className="font-semibold">{fileName}</span> uploaded successfully
            </p>
            <button
              onClick={onButtonClick}
              className="text-sm text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
              disabled={isLoading}
            >
              Upload a different file
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <FiFile className="w-12 h-12 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">PDF files only</p>

            <button
              type="button"
              onClick={onButtonClick}
              className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Select PDF'}
            </button>
          </div>
        )}
      </div>
      
      {/* Accessibility label */}
      <p id="file-upload-desc" className="sr-only">
        Upload a PDF document to have the AI mentor read it and answer questions about it.
      </p>
    </div>
  );
};

export default FileUpload;