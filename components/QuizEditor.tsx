import React, { useState } from 'react';
import { Quiz, Question, QuestionType } from '../types';
import { CsvIcon } from './icons/CsvIcon';
import { PdfIcon } from './icons/PdfIcon';

interface QuizEditorProps {
  quiz: Quiz;
  fileName: string;
  onQuizUpdate: (updatedQuestions: Question[]) => void;
  onExportPdf: () => void;
  onExportCsv: () => void;
  onStartOver: () => void;
}

const QuizEditor: React.FC<QuizEditorProps> = ({
  quiz,
  fileName,
  onExportPdf,
  onExportCsv,
  onStartOver,
}) => {
  // State to track which answers are visible using a Set of question IDs
  const [visibleAnswers, setVisibleAnswers] = useState<Set<string>>(new Set());

  // Toggles the visibility of a single question's answer
  const toggleAnswerVisibility = (questionId: string) => {
    setVisibleAnswers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(questionId)) {
        newSet.delete(questionId);
      } else {
        newSet.add(questionId);
      }
      return newSet;
    });
  };

  const primaryButtonClasses = "flex items-center bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-glow";

  return (
    <div className="w-full bg-surface rounded-lg shadow-xl p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Quiz Questions</h2>
          <p className="text-on-surface mt-1">Generated from: <span className="font-semibold text-primary">{fileName}</span></p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <button onClick={onExportPdf} className={primaryButtonClasses}>
            <PdfIcon className="w-5 h-5 mr-2" /> Export PDF
          </button>
          <button onClick={onExportCsv} className={primaryButtonClasses}>
            <CsvIcon className="w-5 h-5 mr-2" /> Export CSV
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {quiz.questions.map((q, qIndex) => (
          <div key={q.id} className="bg-surface/80 p-6 rounded-xl border border-gray-900/50 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-bold text-primary bg-primary/20 px-3 py-1 rounded-full">
                {qIndex + 1}. {q.type === QuestionType.MCQ ? 'Multiple Choice' : 'True/False'}
              </span>
              <button
                onClick={() => toggleAnswerVisibility(q.id)}
                className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors duration-200"
              >
                {visibleAnswers.has(q.id) ? 'Hide Answer' : 'Show Answer'}
              </button>
            </div>
            <div className="w-full bg-background border border-gray-800 rounded-md p-4 text-on-surface shadow-inner">
              <p className="text-base leading-relaxed">{q.question}</p>
            </div>
            <div className="mt-4 space-y-3">
              {q.type === QuestionType.MCQ && q.options?.map((option, oIndex) => {
                  const isAnswerVisible = visibleAnswers.has(q.id);
                  const isCorrect = q.correctAnswer === option;
                  return (
                    <div key={oIndex} className="flex items-center pl-7">
                      <span className={`
                        ${isAnswerVisible && isCorrect ? 'text-primary font-bold' : 'text-on-surface'}
                         transition-colors duration-300 text-sm
                      `}>
                         {String.fromCharCode(97 + oIndex)}) {option}
                      </span>
                    </div>
                  );
              })}
              {q.type === QuestionType.TF && ['True', 'False'].map(option => {
                  const isAnswerVisible = visibleAnswers.has(q.id);
                  const isCorrect = q.correctAnswer === option;
                  return (
                    <div key={option} className="flex items-center pl-7">
                      <span className={`
                        ${isAnswerVisible && isCorrect ? 'text-primary font-bold' : 'text-on-surface'}
                         transition-colors duration-300 text-sm
                      `}>
                        {option}
                      </span>
                    </div>
                  );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-800 flex justify-end">
        <button onClick={onStartOver} className="bg-transparent border border-gray-700 hover:bg-surface hover:border-primary text-on-surface font-bold py-2 px-4 rounded-md transition-all duration-300">
            Start Over
        </button>
      </div>
    </div>
  );
};

export default QuizEditor;
