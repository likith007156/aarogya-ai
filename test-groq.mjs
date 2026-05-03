import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || "",
  baseURL: "https://api.groq.com/openai/v1",
});

async function main() {
  try {
    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: "Say hello in JSON format like: {\"message\": \"hello\"}" }],
      response_format: { type: "json_object" },
    });
    console.log("SUCCESS:", response.choices[0].message.content);
  } catch (err) {
    console.error("ERROR:", err.message || err);
  }
}
main();

