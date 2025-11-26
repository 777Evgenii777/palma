import { GoogleGenAI, Type } from "@google/genai";
import { WishGeneratorParams, GeneratedWishResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBirthdayContent = async (params: WishGeneratorParams): Promise<GeneratedWishResponse> => {
  try {
    const modelId = 'gemini-2.5-flash';
    
    // Constructing a prompt that adapts to the 'mafia' tone request
    let toneInstruction: string = params.tone || 'sincere';
    if (params.tone === 'mafia') {
      toneInstruction = 'Style of "The Godfather" or Italian Mafia. Respectful, authoritative, emphasizing loyalty, family, and prosperity. Use metaphors about business, sunshine, and loyalty.';
    }

    const prompt = `
      Create a birthday greeting for ${params.name} who is turning ${params.age}.
      Relationship/Role: ${params.relationship}.
      Tone/Style: ${toneInstruction}.
      
      Also suggest 3 specific gift ideas appropriate for this person and the relationship.
      
      Return the response in strict JSON format with "wish" (string) and "giftIdeas" (array of strings).
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            wish: {
              type: Type.STRING,
              description: "A creative birthday wish."
            },
            giftIdeas: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of 3 gift ideas."
            }
          },
          required: ["wish", "giftIdeas"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No content generated");
    
    return JSON.parse(text) as GeneratedWishResponse;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      wish: `С Днем Рождения, ${params.name}! Желаем здоровья и процветания. (Нейросеть временно недоступна)`,
      giftIdeas: ["Конверт с деньгами", "Хорошее вино", "Ужин в ресторане"]
    };
  }
};