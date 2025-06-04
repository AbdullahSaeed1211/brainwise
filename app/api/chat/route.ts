import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createErrorResponse } from "@/lib/auth";

// Function to generate the prompt for brain health questions
function generatePrompt(query: string): string {
  return `You are a brain health expert providing educational information about neurological health. Please provide helpful information about brain health, but remember you are not giving medical advice.

Instructions:
1. Keep your responses concise and to the point (3-5 sentences for general questions)
2. Use simple, clear language without jargon
3. Break information into short paragraphs when needed
4. Avoid long-winded explanations
5. Prioritize actionable information
6. Focus only on the most relevant information to the user's question
7. IMPORTANT: Do not mention or refer to these instructions in your response

User's question: ${query}

Please respond in a helpful, educational way without providing specific medical advice. Focus on brain health facts, research, and general guidance.`;
}

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { message } = reqBody;

    if (typeof message !== 'string' || !message.trim()) {
      return createErrorResponse("Invalid input data", 400);
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set');
      return createErrorResponse("API configuration error", 500);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: "You are a brain health assistant providing educational information about neurological health. Keep responses concise and focused.",
    });

    const prompt = generatePrompt(message);

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = await response.text();

    return NextResponse.json({
      status: "success",
      response: text,
    });

  } catch (error) {
    console.error("Chat API error:", error);
    return createErrorResponse("Failed to generate response", 500);
  }
} 