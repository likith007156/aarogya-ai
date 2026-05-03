import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateChatResponse(messages: { role: string; content: string }[], language: string) {
  const systemPrompt = `You are Aarogya AI, a compassionate health assistant for rural India. 
Respond to the user in the language they used. If they haven't spoken yet, use ${language}.
Ask one symptom question at a time. Keep it brief. 
Be culturally sensitive. Never diagnose definitively, but guide them to the nearest PHC if risk is high.

=== KNOWLEDGE BASE (Use this to answer user questions about schemes/protocols) ===
1. PM-JAY (Ayushman Bharat): Free health insurance scheme providing up to ₹5 lakhs per family per year for secondary and tertiary care.
2. JSY (Janani Suraksha Yojana): Provides cash assistance to pregnant women for institutional delivery to reduce maternal mortality.
3. TB Protocol: If cough persists for >2 weeks, immediate sputum test at the nearest PHC is required. Free treatment under NTEP.
4. Malaria/Dengue Protocol: Fever >3 days with chills/joint pain requires immediate blood smear test.
=============================================================================

Always return your response in JSON format.
If you are still gathering symptoms or answering a database question, return:
{ "content": "your conversational response or answer", "detectedLanguage": "language name" }

If you have enough symptoms to assess risk (usually after 3-4 questions, or if the user explicitly mentions severe symptoms), return:
{ 
  "content": "your conversational response advising them to visit a clinic", 
  "detectedLanguage": "language name",
  "riskScores": [
    { "disease": "TB", "probability": 85, "level": "HIGH", "reasons": ["Cough > 2 weeks", "Fever"] }
  ]
}
Supported detectedLanguages: "Hindi", "English", "Tamil", "Telugu", "Kannada", "Marathi".`;

  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    systemInstruction: systemPrompt
  });



  const rawHistory = messages.slice(0, -1).filter(m => m.role !== 'system');
  
  // Gemini requires strictly alternating 'user' and 'model' messages starting with 'user'.
  const validHistory = [];
  let expectedRole = 'user';
  for (const m of rawHistory) {
    const role = m.role === 'user' ? 'user' : 'model';
    if (role === expectedRole && m.content) {
      validHistory.push({ role, parts: [{ text: String(m.content) }] });
      expectedRole = expectedRole === 'user' ? 'model' : 'user';
    }
  }

  // CRITICAL FIX: The history array passed to startChat MUST end with a 'model' message, 
  // because chat.sendMessage() will automatically append a 'user' message next.
  // If it ends with a 'user' message, Gemini throws a 400 Alternating sequence error!
  if (validHistory.length > 0 && validHistory[validHistory.length - 1].role === 'user') {
    validHistory.pop();
  }

  const chat = model.startChat({
    history: validHistory,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1000,
      responseMimeType: "application/json",
    },
  });

  const lastUserMessage = messages[messages.length - 1];
  const msg = lastUserMessage?.content || "Hello";

  let text = "";
  try {
    const result = await chat.sendMessage(msg);
    text = result.response.text();
  } catch (apiError) {
    console.error("Gemini API Error:", apiError);
    // Graceful fallback to prevent frontend crash
    text = JSON.stringify({
      content: "I'm analyzing your symptoms, please give me a moment. Are there any other details?",
      detectedLanguage: language
    });
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    try {
      // Robust fallback: extract anything that looks like a JSON object
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (fallbackError) {
      console.error("JSON Extraction failed:", fallbackError);
    }
    // Only return raw text if we completely failed to find JSON
    return { content: text.replace("Here is the JSON requested:", "").trim(), detectedLanguage: language };
  }
}
