
import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { ReferencingStyle } from '../types';

if (!process.env.API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this context, we assume the key is present.
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
const model = 'gemini-2.5-flash';

export const checkPlagiarism = async (text: string): Promise<string> => {
  try {
    const prompt = `
      Analyze the following text for potential plagiarism. 
      Identify sentences or phrases that are very similar to existing sources and provide the likely source if possible.
      Format your response clearly. If no issues are found, state that clearly.

      Text to check:
      ---
      ${text}
      ---
    `;
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error in checkPlagiarism:", error);
    return "An error occurred while checking for plagiarism. Please try again.";
  }
};

export const generateCitation = async (style: ReferencingStyle, sourceType: string, details: string): Promise<string> => {
  try {
    const prompt = `
      Generate a citation in ${style} style for the following source.
      Source Type: ${sourceType}
      Details: ${details}
      
      Provide only the formatted citation.
    `;
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error in generateCitation:", error);
    return "An error occurred while generating the citation.";
  }
};

export const generateEssayStructure = async (topic: string, type: 'Essay' | 'Report'): Promise<string> => {
  try {
    const prompt = `
      Create a detailed structure and format for a ${type} on the topic: "${topic}".
      Include sections like Introduction, Body Paragraphs (with suggested themes), and Conclusion.
      This is for assistance purposes, so provide a clear, actionable outline.
    `;
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error in generateEssayStructure:", error);
    return "An error occurred while generating the structure.";
  }
};

export const generateFlashcards = async (subject: string): Promise<{question: string, answer: string}[]> => {
  try {
    const prompt = `Generate 10 flashcards for the subject: "${subject}". Each flashcard should have a question and a concise answer.`;
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              answer: { type: Type.STRING },
            },
            required: ["question", "answer"],
          },
        },
      },
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Error in generateFlashcards:", error);
    return [];
  }
};
