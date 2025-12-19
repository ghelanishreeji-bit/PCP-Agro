
import { GoogleGenAI, Type } from "@google/genai";
import { ProductionOrder, Resource, InventoryItem } from "../types";

// Always use a named parameter and direct process.env.API_KEY access as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getPlanningOptimizations = async (
  orders: ProductionOrder[],
  resources: Resource[],
  inventory: InventoryItem[]
) => {
  // Use gemini-3-pro-preview for complex reasoning and optimization tasks.
  // Use await directly on the generateContent call.
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `
      Analyze current production state and suggest optimizations.
      Orders: ${JSON.stringify(orders)}
      Resources: ${JSON.stringify(resources)}
      Inventory: ${JSON.stringify(inventory)}
    `,
    config: {
      systemInstruction: "You are an expert Production Planning & Control (PCP) consultant. Analyze the provided manufacturing data and provide actionable optimizations in JSON format. Focus on bottlenecks, inventory risks, and scheduling efficiency.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          criticalRisks: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "High priority issues found in current setup."
          },
          optimizations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                impact: { type: Type.STRING, description: 'The impact level: High, Medium, or Low.' }
              },
              required: ["title", "description", "impact"]
            }
          },
          suggestedPriority: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Suggested order of execution for orders."
          }
        },
        required: ["criticalRisks", "optimizations", "suggestedPriority"]
      }
    }
  });

  // response.text is a property, not a method.
  return JSON.parse(response.text || '{}');
};

export const predictProductionTime = async (
  productName: string,
  quantity: number,
  history: ProductionOrder[]
) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `
      Predict production timeline for ${quantity} units of ${productName}.
      Reference historical data: ${JSON.stringify(history.slice(-5))}
    `,
    config: {
      systemInstruction: "You are a production scheduler. Based on product name and quantity, suggest a start and end date. Current date is 2023-10-24. Respond in JSON format.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          startDate: { type: Type.STRING, description: "Suggested start date (YYYY-MM-DD)" },
          endDate: { type: Type.STRING, description: "Suggested end date (YYYY-MM-DD)" },
          rationale: { type: Type.STRING, description: "Short explanation for this estimate" }
        },
        required: ["startDate", "endDate", "rationale"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const chatWithPlanner = async (history: { role: string, content: string }[], message: string) => {
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are the ProTrack PCP Virtual Assistant. Help the user manage production schedules, quality logs, and resource allocation. Be professional, data-driven, and concise."
    }
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};
