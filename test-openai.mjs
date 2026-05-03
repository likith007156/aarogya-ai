import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

async function main() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: "I have a fever." }],
      temperature: 0.7,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "health_response",
          strict: true,
          schema: {
            type: "object",
            properties: {
              content: {
                type: "string",
                description: "Your conversational response or answer to the user."
              },
              detectedLanguage: {
                type: "string",
                description: "The language you are responding in."
              },
              riskScores: {
                type: ["array", "null"],
                description: "If you have enough symptoms to assess risk (usually after 3-4 questions), provide the risk scores. Otherwise, return null.",
                items: {
                  type: "object",
                  properties: {
                    disease: { type: "string" },
                    probability: { type: "number" },
                    level: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
                    reasons: { type: "array", items: { type: "string" } }
                  },
                  required: ["disease", "probability", "level", "reasons"],
                  additionalProperties: false
                }
              }
            },
            required: ["content", "detectedLanguage", "riskScores"],
            additionalProperties: false
          }
        }
      }
    });
    console.log("SUCCESS:", response.choices[0].message.content);
  } catch (err) {
    console.error("ERROR:", err.message);
  }
}
main();
