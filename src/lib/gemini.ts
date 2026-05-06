import { GoogleGenerativeAI } from "@google/generative-ai";
import { calculateRisk, type RiskScore } from "@/lib/risk-models";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

type ClinicalReport = {
  summary: string;
  immediateActions: string[];
  requiredTests: { test: string; reason: string; cost: string }[];
  prescriptionGuidance: { medication: string; dosage: string; notes: string }[];
  governmentSchemes: { scheme: string; benefit: string; contact: string }[];
  phcContact: { instructions: string; nationalHelpline: string; emergencyNumber: string };
  doNotDo: string[];
};

type ChatResponse = {
  content: string;
  detectedLanguage: string;
  riskScores?: RiskScore[];
  report?: ClinicalReport;
};

const severeSymptomPattern = /\b(chest pain|breathless|shortness of breath|blood|unconscious|seizure|severe|emergency|2 weeks|two weeks)\b/i;

function fallbackContent(language: string, hasSymptoms: boolean) {
  const responses: Record<string, { ask: string; report: string }> = {
    Hindi: {
      ask: "\u092e\u0948\u0902 \u0906\u092a\u0915\u0940 \u092c\u093e\u0924 \u0938\u092e\u091d \u0930\u0939\u093e \u0939\u0942\u0902\u0964 \u0915\u0943\u092a\u092f\u093e \u092c\u0924\u093e\u090f\u0902: \u092f\u0939 \u0924\u0915\u0932\u0940\u092b \u0915\u092c \u0938\u0947 \u0939\u0948, \u0914\u0930 \u0915\u094d\u092f\u093e \u092c\u0941\u0916\u093e\u0930, \u0916\u093e\u0902\u0938\u0940 \u092f\u093e \u0915\u092e\u091c\u094b\u0930\u0940 \u092d\u0940 \u0939\u0948?",
      report: "\u0906\u092a\u0915\u0947 \u0932\u0915\u094d\u0937\u0923\u094b\u0902 \u0915\u0947 \u0906\u0927\u093e\u0930 \u092a\u0930 \u092a\u094d\u0930\u093e\u0925\u092e\u093f\u0915 \u091c\u094b\u0916\u093f\u092e \u0906\u0915\u0932\u0928 \u0924\u0948\u092f\u093e\u0930 \u0939\u0948\u0964 \u0915\u0943\u092a\u092f\u093e \u0928\u091c\u0926\u0940\u0915\u0940 PHC \u092f\u093e \u0921\u0949\u0915\u094d\u091f\u0930 \u0938\u0947 \u091c\u093e\u0902\u091a \u0915\u0930\u093e\u090f\u0902\u0964",
    },
    English: {
      ask: "I understand. Please tell me how long this has been happening, and whether you also have fever, cough, weakness, dizziness, or breathing trouble.",
      report: "Based on the symptoms shared, I have prepared an initial risk assessment. Please visit the nearest PHC or doctor for confirmation.",
    },
  };

  const selected = responses[language] || responses.English;
  return hasSymptoms ? selected.report : selected.ask;
}

function buildFallbackReport(messages: { role: string; content: string }[], language: string): ChatResponse {
  const symptoms = messages.filter((m) => m.role === "user").map((m) => m.content);
  const riskScores = calculateRisk(symptoms);
  const topRisk = riskScores[0];

  return {
    content: fallbackContent(language, true),
    detectedLanguage: language,
    riskScores,
    report: {
      summary: `Initial screening suggests ${topRisk.disease} needs attention based on the conversation. This is not a diagnosis.`,
      immediateActions: [
        "Visit the nearest PHC for clinical examination.",
        "Call 108 immediately if there is severe breathing trouble, chest pain, fainting, or bleeding.",
      ],
      requiredTests: [
        { test: "Doctor consultation", reason: "Confirm symptoms and vital signs", cost: "Free/low cost at PHC" },
        { test: "Basic screening tests", reason: "PHC staff can choose tests based on examination", cost: "As per government facility" },
      ],
      prescriptionGuidance: [
        { medication: "No self-medication", dosage: "Doctor to decide", notes: "Avoid antibiotics or steroids unless prescribed." },
      ],
      governmentSchemes: [
        { scheme: "Ayushman Bharat PM-JAY", benefit: "Eligible families can receive covered hospital care.", contact: "104" },
      ],
      phcContact: {
        instructions: "Take this summary to your nearest Primary Health Centre for follow-up.",
        nationalHelpline: "104",
        emergencyNumber: "108",
      },
      doNotDo: [
        "Do not delay care if symptoms are severe or worsening.",
        "Do not share prescription medicines with others.",
      ],
    },
  };
}

function normalizeModelResponse(parsed: unknown, fallbackLanguage: string): ChatResponse | null {
  if (parsed && typeof parsed === "object" && "content" in parsed) {
    const response = parsed as Partial<ChatResponse>;
    if (typeof response.content === "string" && response.content.trim()) {
      return {
        ...response,
        content: response.content.trim(),
        detectedLanguage: typeof response.detectedLanguage === "string" ? response.detectedLanguage : fallbackLanguage,
      };
    }
  }

  if (typeof parsed === "string" && parsed.trim()) {
    return {
      content: parsed.trim(),
      detectedLanguage: fallbackLanguage,
    };
  }

  return null;
}

function parseModelText(text: string, fallbackLanguage: string): ChatResponse | null {
  try {
    return normalizeModelResponse(JSON.parse(text), fallbackLanguage);
  } catch {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return normalizeModelResponse(text, fallbackLanguage);

    try {
      return normalizeModelResponse(JSON.parse(jsonMatch[0]), fallbackLanguage);
    } catch (fallbackError) {
      console.error("JSON Extraction failed:", fallbackError);
      return normalizeModelResponse(text, fallbackLanguage);
    }
  }
}

export async function generateChatResponse(messages: { role: string; content: string }[], language: string) {
  const systemPrompt = `You are Aarogya AI, a compassionate health assistant for rural India. 
CRITICAL RULE: ALWAYS detect the language of the user message and respond in that EXACT same language. If the user writes in English, respond in English. If they write in Hindi, respond in Hindi. Never respond in a different language than what the user wrote in.
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
  const userMessageCount = messages.filter((m) => m.role === "user").length;
  const shouldAssessLocally = userMessageCount >= 3 || severeSymptomPattern.test(messages.map((m) => m.content).join(" "));

  let text = "";
  try {
    const result = await chat.sendMessage(msg);
    text = result.response.text();
  } catch (apiError) {
    console.error("Gemini API Error:", apiError);
    return shouldAssessLocally
      ? buildFallbackReport(messages, language)
      : { content: fallbackContent(language, false), detectedLanguage: language };
  }

  const parsed = parseModelText(text.replace("Here is the JSON requested:", "").trim(), language);
  if (parsed) return parsed;

  return shouldAssessLocally
    ? buildFallbackReport(messages, language)
    : { content: fallbackContent(language, false), detectedLanguage: language };
}
