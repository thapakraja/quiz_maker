import React, { useCallback, useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface FileUploadProps {
  onFileUpload: (file: File, questionCount: number) => void;
  onTextSubmit: (text: string, questionCount: number) => void;
  error: string | null;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload, onTextSubmit, error }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [inputMode, setInputMode] = useState<'pdf' | 'text'>('pdf');
  const [textInput, setTextInput] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onFileUpload(file, questionCount);
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'application/pdf') {
      onFileUpload(file, questionCount);
    } else {
      alert('Please upload a valid PDF file.');
    }
  }, [onFileUpload, questionCount]);

  const handleTextSubmit = () => {
    if (textInput.trim()) {
      onTextSubmit(textInput.trim(), questionCount);
    } else {
      alert('Please enter some text to generate quiz questions.');
    }
  };

  const dropzoneClasses = `
    w-full max-w-2xl bg-surface/50 border rounded-xl p-12 text-center cursor-pointer
    transition-all duration-300 ease-in-out
    ${isDragging ? 'border-primary shadow-glow-strong scale-105' : 'border-gray-800 hover:border-primary hover:shadow-glow'}
  `;

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {error && (
        <div className="bg-primary/20 border border-primary text-white p-4 rounded-lg mb-6 w-full max-w-2xl">
          <p className="font-bold">An Error Occurred</p>
          <p>{error}</p>
        </div>
      )}

      {/* Tab Interface */}
      <div className="w-full max-w-2xl mb-6">
        <div className="flex border-b border-gray-800">
          <button
            onClick={() => setInputMode('pdf')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 ${
              inputMode === 'pdf'
                ? 'text-primary border-b-2 border-primary bg-surface/30'
                : 'text-text-muted hover:text-on-surface hover:bg-surface/20'
            }`}
          >
            📄 Upload PDF
          </button>
          <button
            onClick={() => setInputMode('text')}
            className={`flex-1 py-3 px-4 text-center font-medium transition-all duration-200 ${
              inputMode === 'text'
                ? 'text-primary border-b-2 border-primary bg-surface/30'
                : 'text-text-muted hover:text-on-surface hover:bg-surface/20'
            }`}
          >
            ✏️ Enter Text
          </button>
        </div>
      </div>
      {inputMode === 'pdf' ? (
        <div
          className={dropzoneClasses}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <input
            type="file"
            id="file-upload"
            className="hidden"
            accept=".pdf"
            onChange={handleFileChange}
          />
          <div className="flex flex-col items-center text-on-surface">
              <UploadIcon className="w-16 h-16 mb-4 text-gray-400" />
              <p className="text-xl font-semibold">Drag & drop your PDF here</p>
              <p className="text-text-muted mt-1">or click to browse</p>

              <div className="mt-6 w-full max-w-xs">
                <label htmlFor="question-count-pdf" className="block text-sm font-medium text-text-muted mb-2">
                  Number of Questions
                </label>
                <select
                  id="question-count-pdf"
                  name="question-count-pdf"
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full bg-surface border border-gray-700 rounded-md py-2 px-3 text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                  <option value="25">25</option>
                  <option value="30">30</option>
                  <option value="35">35</option>
                  <option value="40">40</option>
                </select>
              </div>

              <p className="text-sm text-text-muted mt-6">Max file size: 50MB</p>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl bg-surface/50 border border-gray-800 rounded-xl p-8 transition-all duration-300 ease-in-out hover:border-primary hover:shadow-glow">
          <div className="flex flex-col items-center text-on-surface">
            <div className="w-16 h-16 mb-4 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-primary text-2xl">✏️</span>
            </div>
            <p className="text-xl font-semibold mb-2">Enter Your Text</p>
            <p className="text-text-muted mb-6 text-center">Paste or type the content you want to generate quiz questions from</p>

            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste or type your text here..."
              className="w-full h-48 bg-background border border-gray-700 rounded-md p-4 text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition resize-none"
              maxLength={50000}
            />

            <div className="flex items-center justify-between w-full mt-4">
              <span className="text-sm text-text-muted">
                {textInput.length} / 50,000 characters
              </span>
              <div className="flex items-center space-x-4">
                <div className="flex flex-col">
                  <label htmlFor="question-count-text" className="block text-sm font-medium text-text-muted mb-1">
                    Questions
                  </label>
                  <select
                    id="question-count-text"
                    value={questionCount}
                    onChange={(e) => setQuestionCount(Number(e.target.value))}
                    className="bg-surface border border-gray-700 rounded-md py-2 px-3 text-on-surface focus:ring-2 focus:ring-primary focus:border-primary transition"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                    <option value="25">25</option>
                    <option value="30">30</option>
                    <option value="35">35</option>
                    <option value="40">40</option>
                  </select>
                </div>
                <button
                  onClick={handleTextSubmit}
                  disabled={!textInput.trim()}
                  className="bg-primary hover:bg-secondary disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-glow disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  Generate Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
