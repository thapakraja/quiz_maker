import React, { useState, useCallback } from 'react';
import { AppState, Quiz, Question } from './types';
import FileUpload from './components/FileUpload';
import Loader from './components/Loader';
import QuizEditor from './components/QuizEditor';
import { extractTextFromPdf } from './services/pdfProcessor';
import { generateQuizFromText } from './services/geminiService';
import { exportQuizToPdf, exportQuizToCsv } from './services/exportService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.UPLOAD);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const handleFileUpload = useCallback(async (file: File, questionCount: number) => {
    setAppState(AppState.LOADING);
    setError(null);
    setFileName(file.name);

    try {
      setLoadingMessage('Extracting text from PDF...');
      const text = await extractTextFromPdf(file);

      setLoadingMessage('Generating quiz with Gemini AI...');
      const generatedQuiz = await generateQuizFromText(text, questionCount);

      setQuiz(generatedQuiz);
      setAppState(AppState.EDITING);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate quiz. ${errorMessage}`);
      setAppState(AppState.UPLOAD);
    } finally {
        setLoadingMessage('');
    }
  }, []);

  const handleTextSubmit = useCallback(async (text: string, questionCount: number) => {
    setAppState(AppState.LOADING);
    setError(null);
    setFileName('Custom Text Input');

    try {
      setLoadingMessage('Generating quiz with Gemini AI...');
      const generatedQuiz = await generateQuizFromText(text, questionCount);

      setQuiz(generatedQuiz);
      setAppState(AppState.EDITING);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate quiz. ${errorMessage}`);
      setAppState(AppState.UPLOAD);
    } finally {
        setLoadingMessage('');
    }
  }, []);

  const handleExportPdf = () => {
    if (quiz) {
      exportQuizToPdf(quiz, fileName.replace('.pdf', ''));
    }
  };

  const handleExportCsv = () => {
    if (quiz) {
      exportQuizToCsv(quiz, fileName.replace('.pdf', ''));
    }
  };
  
  const handleStartOver = () => {
    setQuiz(null);
    setError(null);
    setFileName('');
    setAppState(AppState.UPLOAD);
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.LOADING:
        return <Loader message={loadingMessage} />;
      case AppState.EDITING:
        if (quiz) {
          return (
            <QuizEditor
              quiz={quiz}
              onExportPdf={handleExportPdf}
              onExportCsv={handleExportCsv}
              onStartOver={handleStartOver}
              fileName={fileName}
            />
          );
        }
        return null; // Should not happen
      case AppState.UPLOAD:
      default:
        return <FileUpload onFileUpload={handleFileUpload} onTextSubmit={handleTextSubmit} error={error} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-6 lg:p-8">
       <header className="w-full max-w-5xl mb-8 text-center">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent pb-2">
                QuizBolt
            </h1>
            <p className="mt-2 text-lg text-on-surface/80">
                Instantly create quizzes from your PDF documents.
            </p>
        </header>
      <main className="w-full max-w-5xl flex-grow flex items-center justify-center">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
