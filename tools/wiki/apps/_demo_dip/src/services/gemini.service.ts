import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env['API_KEY'] });
  }

  async askAssistant(question: string, context: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `
          You are an expert technical writer and developer advocate for the "K12 MyPortal IDP".
          
          Context about the platform:
          ${context}

          User Question: ${question}

          Answer concisely and helpful using markdown formatting.
        `,
      });
      return response.text || 'Sorry, I could not generate a response.';
    } catch (e) {
      console.error('Gemini API Error:', e);
      return 'Error connecting to AI Assistant.';
    }
  }
}