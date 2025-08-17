
/**
 * Extracts text from a PDF file.
 * The pdf.js library is expected to be loaded and configured globally in index.tsx.
 * @param file The PDF file to process.
 * @returns A promise that resolves with the extracted text content.
 */
export const extractTextFromPdf = async (file: File): Promise<string> => {
  // Direct access to the window property, which is guaranteed to exist by the app's entry point.
  const pdfjsLib = (window as any).pdfjsLib;

  if (!pdfjsLib) {
    // This is a fallback check. The app's entry point should prevent this from happening.
    throw new Error('pdf.js library is not loaded. Please check your internet connection and script tags.');
  }

  const arrayBuffer = await file.arrayBuffer();
  // The `getDocument` call now uses the globally configured worker.
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  const numPages = pdf.numPages;
  let fullText = '';

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    // The text content items are objects with a 'str' property containing the text.
    const pageText = textContent.items.map((item: any) => item.str).join(' ');
    fullText += pageText + '\n\n';
  }

  return fullText;
};
