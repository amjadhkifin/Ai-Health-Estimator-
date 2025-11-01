import { GoogleGenAI, Type } from "@google/genai";
import { Answers, HealthResult } from '../types';

// FIX: Removed 'as string' to align with API guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const estimateHealth = async (answers: Answers): Promise<HealthResult> => {
  const prompt = `
    Based on the following self-reported lifestyle information, please provide a health estimation.
    User answers: ${JSON.stringify(answers, null, 2)}

    Your response must be a JSON object that conforms to the provided schema.
    For 'positivePoints' and 'areasForImprovement', provide a 'point' (the text) and a 'category' that matches one of the question IDs from the user answers.
    The valid categories are: 'exercise', 'diet', 'nutrition', 'sleep', 'stress', 'mental', 'smoking', 'alcohol', 'social'.
    Analyze the data to generate a score, a summary, positive points, areas for improvement, and actionable health tips for each area of improvement.
    The tone should be encouraging and supportive, not alarming.
    Always include the provided disclaimer verbatim.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: {
              type: Type.INTEGER,
              description: "A score from 0 to 100 representing the user's overall health based on their answers. Higher is better."
            },
            summary: {
              type: Type.STRING,
              description: "A brief, one-paragraph summary of the user's health condition in an encouraging tone."
            },
            positivePoints: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  point: {
                    type: Type.STRING,
                    description: "The text of the positive point."
                  },
                  category: {
                    type: Type.STRING,
                    description: "The category this point relates to. Must be one of: 'exercise', 'diet', 'nutrition', 'sleep', 'stress', 'mental', 'smoking', 'alcohol', 'social'."
                  }
                },
                required: ["point", "category"]
              },
              description: "A list of 2-3 positive aspects of the user's lifestyle based on their answers, each with a corresponding category."
            },
            areasForImprovement: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  point: {
                    type: Type.STRING,
                    description: "The text of the area for improvement."
                  },
                  category: {
                    type: Type.STRING,
                    description: "The category this point relates to. Must be one of: 'exercise', 'diet', 'nutrition', 'sleep', 'stress', 'mental', 'smoking', 'alcohol', 'social'."
                  }
                },
                required: ["point", "category"]
              },
              description: "A list of 2-3 actionable suggestions for improvement, phrased constructively, each with a corresponding category."
            },
            healthTips: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: {
                    type: Type.STRING,
                    description: "The area of improvement this tip relates to (e.g., 'Diet', 'Stress Management')."
                  },
                  tip: {
                    type: Type.STRING,
                    description: "A concise, actionable health tip related to the category."
                  }
                },
                required: ["category", "tip"]
              },
              description: "A list of health tips, each corresponding to an identified area for improvement."
            },
            disclaimer: {
              type: Type.STRING,
              description: "The mandatory disclaimer: 'This is an AI-generated estimation and not a substitute for professional medical advice. Consult a healthcare provider for any health concerns.'"
            }
          },
          required: ["overallScore", "summary", "positivePoints", "areasForImprovement", "healthTips", "disclaimer"]
        }
      }
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    // Basic validation
    if (
      typeof result.overallScore !== 'number' ||
      typeof result.summary !== 'string' ||
      !Array.isArray(result.positivePoints) ||
      !result.positivePoints.every((p: any) => typeof p.point === 'string' && typeof p.category === 'string') ||
      !Array.isArray(result.areasForImprovement) ||
      !result.areasForImprovement.every((a: any) => typeof a.point === 'string' && typeof a.category === 'string') ||
      !Array.isArray(result.healthTips) ||
      !result.healthTips.every((t: any) => typeof t.category === 'string' && typeof t.tip === 'string') ||
      typeof result.disclaimer !== 'string'
    ) {
      throw new Error("Invalid response format from API");
    }

    return result as HealthResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get health estimation from AI. Please try again later.");
  }
};
