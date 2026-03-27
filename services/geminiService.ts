
import { GoogleGenAI, Type } from "@google/genai";
import { ParsedIntent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parseVoiceIntent = async (text: string): Promise<ParsedIntent> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the following business command (Multilingual: English, Hindi, Gujarati, Punjabi, Hinglish) and extract the intent in JSON format.
    Command: "${text}"
    Example inputs:
    - "Add 10kg sugar to stock" -> { "action": "ADD_STOCK", "item": "sugar", "quantity": 10, "unit": "kg" }
    - "रामू को 200 रुपये दिए" -> { "action": "RECORD_PAYMENT", "entity": "Ramu", "amount": 200, "category": "Salary/Labor" }
    - "Sold milk for 50 rupees" -> { "action": "RECORD_SALE", "item": "milk", "amount": 50 }
    - "Change business name to Gupta General Store" -> { "action": "UPDATE_PROFILE", "businessName": "Gupta General Store" }
    - "Set owner name as Rajesh Kumar" -> { "action": "UPDATE_PROFILE", "ownerName": "Rajesh Kumar" }
    - "૧૦ કિલો ખાંડ ઉમેરો" -> { "action": "ADD_STOCK", "item": "sugar", "quantity": 10, "unit": "kg" }
    - "ਰਾਮੂ ਨੂੰ ੫੦੦ ਰੁਪਏ ਦਿੱਤੇ" -> { "action": "RECORD_PAYMENT", "entity": "Ramu", "amount": 500, "category": "Salary/Labor" }`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          action: { type: Type.STRING, enum: ["ADD_STOCK", "REMOVE_STOCK", "RECORD_SALE", "RECORD_PAYMENT", "UPDATE_PROFILE", "UNKNOWN"] },
          item: { type: Type.STRING },
          amount: { type: Type.NUMBER },
          quantity: { type: Type.NUMBER },
          unit: { type: Type.STRING },
          entity: { type: Type.STRING },
          category: { type: Type.STRING },
          businessName: { type: Type.STRING },
          ownerName: { type: Type.STRING },
        },
        required: ["action"],
      },
    },
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse intent", e);
    return { action: "UNKNOWN" };
  }
};

export const parseBillImage = async (base64Image: string): Promise<any[]> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
        { text: "Extract line items from this bill as a JSON array of objects with keys: item, quantity, unit, price, total." }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            item: { type: Type.STRING },
            quantity: { type: Type.NUMBER },
            unit: { type: Type.STRING },
            price: { type: Type.NUMBER },
            total: { type: Type.NUMBER },
          },
          required: ["item", "total"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    console.error("Failed to parse bill", e);
    return [];
  }
};
