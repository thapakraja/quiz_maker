import { GoogleGenAI, Type } from "@google/genai";
import { Quiz, QuestionType } from '../types';

const MAX_TEXT_LENGTH = 100000; // A reasonable character limit to avoid overly large requests

const quizSchema = {
    type: Type.OBJECT,
    properties: {
      questions: {
        type: Type.ARRAY,
        description: "An array of quiz questions based on the provided text.",
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING, description: "A unique identifier for the question, e.g., a UUID." },
            type: { type: Type.STRING, description: `The type of question, must be one of: ${Object.values(QuestionType).join(', ')}.` },
            question: { type: Type.STRING, description: "The question text." },
            options: {
              type: Type.ARRAY,
              description: "For Multiple Choice (MCQ) questions, this is an array of 4 strings representing the options. This field MUST be omitted for True/False (TF) questions.",
              items: { type: Type.STRING }
            },
            correctAnswer: { type: Type.STRING, description: "The correct answer. For MCQ, it must be one of the option strings. For TF, it must be 'True' or 'False'." }
          },
          required: ["id", "type", "question", "correctAnswer"]
        }
      }
    },
    required: ["questions"]
};

/**
 * Generates a quiz from a given text using the Gemini API.
 * @param text The text content to generate the quiz from.
 * @param questionCount The number of questions to generate.
 * @returns A promise that resolves with the structured Quiz object.
 */
export const generateQuizFromText = async (text: string, questionCount: number): Promise<Quiz> => {
    const apiKey = import.meta.env.VITE_API_KEY;
    console.log("Debug: API Key loaded:", apiKey ? "Present" : "Missing", "Length:", apiKey?.length || 0);

    if (!apiKey) {
      throw new Error("VITE_API_KEY environment variable not set. Please create a .env.local file with VITE_API_KEY=your_api_key_here. Get your API key from https://makersuite.google.com/app/apikey");
    }

    if (apiKey === 'your_gemini_api_key_here' || apiKey === 'undefined') {
      throw new Error("Invalid API Key. Please replace 'your_gemini_api_key_here' in your .env.local file with your actual Gemini API key from https://makersuite.google.com/app/apikey");
    }

    const ai = new GoogleGenAI({ apiKey });

    // Truncate text if it's too long to prevent API errors
    const truncatedText = text.length > MAX_TEXT_LENGTH ? text.substring(0, MAX_TEXT_LENGTH) : text;

    const prompt = `
    Based on the following text, please generate a quiz with exactly ${questionCount} questions, with a mix of multiple-choice and true/false questions.
    - For Multiple Choice (MCQ) questions, provide exactly 4 options.
    - Ensure the 'correctAnswer' for multiple-choice questions exactly matches one of the provided options.
    - For True/False (TF) questions, the 'correctAnswer' must be either 'True' or 'False'.
    - For True/False (TF) questions, OMIT the 'options' field entirely.
    - Generate a unique string ID for each question.

    Text:
    ---
    ${truncatedText}
    ---
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: quizSchema,
                temperature: 0.7,
            },
        });
        
        const jsonText = response.text.trim();
        console.log("Raw API response:", jsonText); // Debug log
        
        let parsedQuiz: Quiz;
        try {
            parsedQuiz = JSON.parse(jsonText) as Quiz;
        } catch (parseError) {
            console.error("JSON parsing error:", parseError);
            console.error("Raw response that failed to parse:", jsonText);
            throw new Error("Invalid JSON response from AI model. The response could not be parsed.");
        }

        // Validate the structure
        if (!parsedQuiz || !Array.isArray(parsedQuiz.questions)) {
            console.error("Invalid quiz structure:", parsedQuiz);
            throw new Error("Invalid quiz structure received from API. Expected 'questions' array.");
        }
        
        // Validate each question
        for (let i = 0; i < parsedQuiz.questions.length; i++) {
            const question = parsedQuiz.questions[i];
            if (!question.id || !question.type || !question.question || !question.correctAnswer) {
                console.error(`Invalid question at index ${i}:`, question);
                throw new Error(`Invalid question structure at index ${i}. Missing required fields.`);
            }
            
            if (question.type === QuestionType.MCQ) {
                if (!question.options || !Array.isArray(question.options) || question.options.length !== 4) {
                    console.error(`Invalid MCQ question at index ${i}:`, question);
                    throw new Error(`Invalid MCQ question at index ${i}. Must have exactly 4 options.`);
                }
                if (!question.options.includes(question.correctAnswer)) {
                    console.error(`Invalid MCQ question at index ${i}: correct answer not in options`, question);
                    throw new Error(`Invalid MCQ question at index ${i}. Correct answer must be one of the provided options.`);
                }
            } else if (question.type === QuestionType.TF) {
                if (question.correctAnswer !== 'True' && question.correctAnswer !== 'False') {
                    console.error(`Invalid TF question at index ${i}:`, question);
                    throw new Error(`Invalid TF question at index ${i}. Correct answer must be 'True' or 'False'.`);
                }
            } else {
                console.error(`Invalid question type at index ${i}:`, question);
                throw new Error(`Invalid question type at index ${i}. Must be 'MCQ' or 'TF'.`);
            }
        }
        
        return parsedQuiz;

    } catch (error: any) {
        console.error("Error calling Gemini API:", error);
        
        const errorMessage = error.toString();
        // Check for the specific API key error message from the Gemini API response
        if (errorMessage.includes("API_KEY_INVALID") || errorMessage.includes("API key not valid")) {
            throw new Error("Invalid API Key. Please ensure the API_KEY is correctly configured in your environment's secrets.");
        }
        
        // If it's already our custom error, re-throw it
        if (error.message && (error.message.includes("Invalid JSON") || error.message.includes("Invalid quiz structure") || error.message.includes("Invalid question"))) {
            throw error;
        }
        
        // Fallback for other errors
        throw new Error("Failed to generate quiz from the AI model. The model may have returned an invalid format.");
    }
};
