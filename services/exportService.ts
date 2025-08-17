
import { Quiz, Question, QuestionType } from '../types';

// Declare the global jsPDF object provided by the CDN script
declare const jspdf: any;

/**
 * Creates a Blob from a string and triggers a download.
 * @param content The string content of the file.
 * @param fileName The name of the file to be downloaded.
 * @param mimeType The MIME type of the file.
 */
const downloadFile = (content: string, fileName: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

/**
 * Exports the quiz to a CSV file.
 * @param quiz The quiz data to export.
 * @param baseFileName The base name for the file (without extension).
 */
export const exportQuizToCsv = (quiz: Quiz, baseFileName: string) => {
  let csvContent = 'Question Number,Type,Question,Option 1,Option 2,Option 3,Option 4,Correct Answer\n';

  quiz.questions.forEach((q, index) => {
    const questionNumber = index + 1;
    const type = q.type;
    const question = `"${q.question.replace(/"/g, '""')}"`;
    const correctAnswer = `"${q.correctAnswer.replace(/"/g, '""')}"`;

    let options = ['', '', '', ''];
    if (q.type === QuestionType.MCQ && q.options) {
      q.options.forEach((opt, i) => {
        if (i < 4) {
          options[i] = `"${opt.replace(/"/g, '""')}"`;
        }
      });
    }
    
    csvContent += `${questionNumber},${type},${question},${options.join(',')},${correctAnswer}\n`;
  });

  downloadFile(csvContent, `${baseFileName}_quiz.csv`, 'text/csv;charset=utf-8;');
};

/**
 * Exports the quiz to a formatted PDF file, including an answer key.
 * @param quiz The quiz data to export.
 * @param baseFileName The base name for the file (without extension).
 */
export const exportQuizToPdf = (quiz: Quiz, baseFileName: string) => {
  const { jsPDF } = jspdf;
  const doc = new jsPDF();

  // --- Quiz Questions Page ---
  doc.setFontSize(18);
  doc.text(`${baseFileName} Quiz`, 14, 22);
  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text('Name: _________________________', 14, 30);
  doc.text('Date: _________________________', 130, 30);
  
  let y = 45;
  const checkY = (neededSpace: number = 20) => {
      if (y > 270) {
          doc.addPage();
          y = 20;
      }
  };

  quiz.questions.forEach((q, index) => {
    checkY();
    doc.setFontSize(12);
    doc.setTextColor(0);
    const questionText = doc.splitTextToSize(`${index + 1}. ${q.question}`, 180);
    doc.text(questionText, 14, y);
    y += questionText.length * 5 + 2;

    doc.setFontSize(10);
    if (q.type === QuestionType.MCQ && q.options) {
      q.options.forEach((opt, optIndex) => {
        checkY(10);
        const optionLabel = String.fromCharCode(97 + optIndex); // a, b, c, d
        doc.text(`${optionLabel}) ${opt}`, 20, y);
        y += 7;
      });
    } else if (q.type === QuestionType.TF) {
        checkY(10);
        doc.text('a) True', 20, y);
        y += 7;
        doc.text('b) False', 20, y);
        y += 7;
    }
    y += 5; // Extra space between questions
  });

  // --- Answer Key Page ---
  doc.addPage();
  doc.setFontSize(16);
  doc.text('Answer Key', 14, 22);
  y = 35;
  
  const keyData = quiz.questions.map((q, index) => {
      let answer = q.correctAnswer;
      if (q.type === QuestionType.MCQ && q.options) {
        const correctIndex = q.options.indexOf(q.correctAnswer);
        answer = `${String.fromCharCode(97 + correctIndex)}) ${q.correctAnswer}`;
      }
      return [`${index + 1}`, q.question.substring(0, 50) + '...', answer];
  });
  
  (doc as any).autoTable({
      startY: y,
      head: [['#', 'Question', 'Correct Answer']],
      body: keyData,
      theme: 'grid'
  });

  doc.save(`${baseFileName}_quiz.pdf`);
};
