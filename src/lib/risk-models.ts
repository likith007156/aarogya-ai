export type RiskScore = {
  disease: string;
  probability: number;
  level: "HIGH" | "MEDIUM" | "LOW";
  reasons: string[];
};

export function calculateRisk(symptoms: string[]): RiskScore[] {
  const scores: Record<string, { score: number; reasons: string[] }> = {
    TB: { score: 0, reasons: [] },
    Diabetes: { score: 0, reasons: [] },
    Anemia: { score: 0, reasons: [] },
    Hypertension: { score: 0, reasons: [] },
  };

  const text = symptoms.join(" ").toLowerCase();

  // TB
  if (text.includes("cough") && text.includes("2 weeks")) { scores.TB.score += 40; scores.TB.reasons.push("Cough > 2 weeks"); }
  else if (text.includes("cough")) { scores.TB.score += 20; scores.TB.reasons.push("Cough"); }
  if (text.includes("fever") || text.includes("bukhar")) { scores.TB.score += 20; scores.TB.reasons.push("Fever"); }
  if (text.includes("weight loss")) { scores.TB.score += 20; scores.TB.reasons.push("Weight loss"); }
  if (text.includes("sweat")) { scores.TB.score += 20; scores.TB.reasons.push("Night sweats"); }

  // Diabetes
  if (text.includes("thirst")) { scores.Diabetes.score += 25; scores.Diabetes.reasons.push("Excessive thirst"); }
  if (text.includes("urination") || text.includes("pee")) { scores.Diabetes.score += 25; scores.Diabetes.reasons.push("Frequent urination"); }
  if (text.includes("fatigue") || text.includes("tired")) { scores.Diabetes.score += 15; scores.Diabetes.reasons.push("Fatigue"); }
  if (text.includes("family") && text.includes("diabetes")) { scores.Diabetes.score += 35; scores.Diabetes.reasons.push("Family history"); }

  // Anemia
  if (text.includes("fatigue") || text.includes("tired")) { scores.Anemia.score += 30; scores.Anemia.reasons.push("Fatigue"); }
  if (text.includes("pale")) { scores.Anemia.score += 30; scores.Anemia.reasons.push("Pale skin"); }
  if (text.includes("dizzy") || text.includes("dizziness") || text.includes("chakkar")) { scores.Anemia.score += 20; scores.Anemia.reasons.push("Dizziness"); }
  if (text.includes("breath")) { scores.Anemia.score += 20; scores.Anemia.reasons.push("Breathlessness"); }

  // Hypertension
  if (text.includes("headache") || text.includes("sir dard")) { scores.Hypertension.score += 25; scores.Hypertension.reasons.push("Headache"); }
  if (text.includes("dizzy") || text.includes("chakkar")) { scores.Hypertension.score += 25; scores.Hypertension.reasons.push("Dizziness"); }
  if (text.includes("age") && (text.includes("40") || text.includes("50") || text.includes("60"))) { scores.Hypertension.score += 25; scores.Hypertension.reasons.push("Age > 40"); }
  if (text.includes("family") && text.includes("bp")) { scores.Hypertension.score += 25; scores.Hypertension.reasons.push("Family history"); }

  return Object.entries(scores).map(([disease, data]) => {
    let probability = Math.min(data.score, 99);
    if (probability === 0) probability = Math.floor(Math.random() * 15) + 5; // Base probability

    let level: "HIGH" | "MEDIUM" | "LOW" = "LOW";
    if (probability >= 70) level = "HIGH";
    else if (probability >= 40) level = "MEDIUM";

    return {
      disease,
      probability,
      level,
      reasons: data.reasons.length > 0 ? data.reasons : ["No specific risk factors identified from conversation"],
    };
  }).sort((a, b) => b.probability - a.probability);
}
