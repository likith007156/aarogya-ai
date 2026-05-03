"use client";

import { useState, useEffect } from "react";
import { Lock } from "lucide-react";

type TestStatus = "untested" | "pass" | "fail";

const TEST_CARDS = [
  { id: "gemini", name: "Gemini API Test", icon: "🧠" },
  { id: "twilio", name: "Twilio WhatsApp Test", icon: "📱" },
  { id: "risk", name: "Risk Calculator Test", icon: "🎯" },
  { id: "abha", name: "ABHA Generator Test", icon: "🆔" },
  { id: "phc", name: "PHC Locator Test", icon: "🗺️" },
  { id: "sarvam", name: "Sarvam TTS Test", icon: "🔊" },
];

export default function TestDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [statuses, setStatuses] = useState<Record<string, TestStatus>>({
    gemini: "untested",
    twilio: "untested",
    risk: "untested",
    abha: "untested",
    phc: "untested",
    sarvam: "untested",
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  const runTest = async (id: string) => {
    setStatuses((prev) => ({ ...prev, [id]: "untested" }));
    try {
      let res: Response | undefined;
      if (id === "gemini") {
        const lang = (document.getElementById("gemini-lang") as HTMLSelectElement)?.value || "en";
        const prompt = (document.getElementById("gemini-prompt") as HTMLTextAreaElement)?.value || "";
        res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: [{ role: "user", content: prompt }], language: lang })
        });
      } else if (id === "twilio") {
        const phone = (document.getElementById("twilio-phone") as HTMLInputElement)?.value || "+919999999999";
        const msg = (document.getElementById("twilio-msg") as HTMLInputElement)?.value || "test";
        res = await fetch("/api/whatsapp/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ Body: msg, From: phone })
        });
      } else if (id === "risk") {
        const checkboxes = document.querySelectorAll(".risk-symptom-checkbox:checked");
        const symptoms = Array.from(checkboxes).map(cb => (cb as HTMLInputElement).value);
        res = await fetch("/api/risk", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ symptoms: symptoms.length > 0 ? symptoms : ["Fever"] })
        });
      } else if (id === "abha") {
        const name = (document.getElementById("abha-name") as HTMLInputElement)?.value || "Test";
        res = await fetch("/api/abha", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, village: "Test Village", age: 30 })
        });
        if (res.ok) {
          const data = await res.json();
          const out = document.getElementById("abha-output");
          if (out) out.innerHTML = `<span class="text-sm font-bold text-primary">${data.patient?.abhaId}</span>`;
        }
      } else if (id === "phc") {
        res = await fetch("/api/phc");
      } else if (id === "sarvam") {
        const text = (document.getElementById("sarvam-text") as HTMLInputElement)?.value || "नमस्ते";
        const langCode = (document.getElementById("sarvam-lang") as HTMLSelectElement)?.value || "hi-IN";
        res = await fetch("/api/sarvam", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, target_language_code: langCode })
        });
      }
      
      setStatuses((prev) => ({ ...prev, [id]: res?.ok ? "pass" : "fail" }));
    } catch (e) {
      setStatuses((prev) => ({ ...prev, [id]: "fail" }));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-slate-900 border border-slate-800 p-8 rounded-2xl w-full max-w-md shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700">
              <Lock className="text-slate-400 w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Developer Area</h1>
            <p className="text-slate-400 text-sm">Protected environment. Enter access code.</p>
          </div>
          
          <div className="space-y-4">
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all font-mono"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p className="text-error text-sm font-medium text-center">{error}</p>}
            <button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary-container text-white rounded-xl py-3 font-semibold transition-all shadow-lg shadow-primary/20"
            >
              Access Dashboard
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-8 font-mono">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Aarogya AI Diagnostics</h1>
            <p className="text-slate-500 text-sm uppercase tracking-widest">System Health & API Status Dashboard</p>
          </div>
          <div className="flex items-center gap-3 bg-slate-900 px-4 py-2 rounded-lg border border-slate-800">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span className="text-sm font-medium text-slate-300">SYSTEM ONLINE</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* GEMINI API TEST */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-full hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🧠</span>
                <h3 className="text-lg font-semibold text-white tracking-tight">GEMINI API TEST</h3>
              </div>
              <StatusBadge status={statuses["gemini"]} />
            </div>
            
            <div className="flex-1 space-y-4 mb-6">
              <select id="gemini-lang" className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-300 focus:border-primary focus:ring-0">
                <option value="en">English (Default)</option>
                <option value="hi">Hindi</option>
                <option value="kn">Kannada</option>
                <option value="ta">Tamil</option>
                <option value="te">Telugu</option>
                <option value="mr">Marathi</option>
              </select>
              <textarea 
                id="gemini-prompt"
                className="w-full h-24 bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-300 focus:border-primary focus:ring-0 resize-none"
                placeholder="Enter test prompt..."
                defaultValue="I have a slight fever and headache since yesterday."
              ></textarea>
            </div>
            
            <button 
              onClick={() => runTest("gemini")}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-lg py-3 text-sm font-medium transition-colors border border-slate-700 flex items-center justify-center gap-2 mt-auto"
            >
              <span>{statuses["gemini"] === "untested" ? "RUN TEST" : "RE-RUN TEST"}</span>
            </button>
          </div>

          {/* TWILIO WHATSAPP TEST */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-full hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">📱</span>
                <h3 className="text-lg font-semibold text-white tracking-tight">TWILIO WHATSAPP</h3>
              </div>
              <StatusBadge status={statuses["twilio"]} />
            </div>
            
            <div className="flex-1 space-y-4 mb-6">
              <div className="flex gap-2">
                <div className="w-16 bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-center text-slate-400">+91</div>
                <input 
                  id="twilio-phone"
                  type="text" 
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-300 focus:border-primary focus:ring-0"
                  placeholder="Phone Number"
                />
              </div>
              <input 
                id="twilio-msg"
                type="text" 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-300 focus:border-primary focus:ring-0"
                placeholder="Message payload"
                defaultValue="Test message from Aarogya AI System"
              />
            </div>
            
            <button 
              onClick={() => runTest("twilio")}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-lg py-3 text-sm font-medium transition-colors border border-slate-700 flex items-center justify-center gap-2 mt-auto"
            >
              <span>{statuses["twilio"] === "untested" ? "RUN TEST" : "RE-RUN TEST"}</span>
            </button>
          </div>

          {/* RISK CALCULATOR TEST */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-full hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🎯</span>
                <h3 className="text-lg font-semibold text-white tracking-tight">RISK CALCULATOR</h3>
              </div>
              <StatusBadge status={statuses["risk"]} />
            </div>
            
            <div className="flex-1 space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-2">
                {['Fever', 'Cough', 'Fatigue', 'Headache', 'Nausea', 'Body Ache'].map((sym) => (
                  <label key={sym} className="flex items-center gap-2 p-2 bg-slate-950 rounded border border-slate-800 cursor-pointer hover:border-slate-700">
                    <input type="checkbox" value={sym} className="risk-symptom-checkbox rounded border-slate-700 bg-slate-900 text-primary focus:ring-primary focus:ring-offset-slate-950" />
                    <span className="text-xs text-slate-400">{sym}</span>
                  </label>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-slate-500 w-12">Age</span>
                <input type="range" className="flex-1 accent-primary" min="1" max="100" defaultValue="35" onChange={(e) => {
                  const span = document.getElementById('risk-age-display');
                  if (span) span.innerText = e.target.value;
                }} />
                <span id="risk-age-display" className="text-xs text-slate-300 w-6">35</span>
              </div>
            </div>
            
            <button 
              onClick={() => runTest("risk")}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-lg py-3 text-sm font-medium transition-colors border border-slate-700 flex items-center justify-center gap-2 mt-auto"
            >
              <span>{statuses["risk"] === "untested" ? "RUN TEST" : "RE-RUN TEST"}</span>
            </button>
          </div>

          {/* ABHA GENERATOR TEST */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-full hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🆔</span>
                <h3 className="text-lg font-semibold text-white tracking-tight">ABHA GENERATOR</h3>
              </div>
              <StatusBadge status={statuses["abha"]} />
            </div>
            
            <div className="flex-1 space-y-4 mb-6">
              <div className="flex gap-2">
                <input 
                  id="abha-name"
                  type="text" 
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-300 focus:border-primary focus:ring-0"
                  placeholder="Patient Name"
                  defaultValue="Ramesh Kumar"
                />
                <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg px-3 text-xs border border-slate-700">Auto</button>
              </div>
              <div id="abha-output" className="bg-slate-950 rounded-lg p-4 border border-slate-800 h-24 flex items-center justify-center border-dashed">
                <span className="text-xs text-slate-600">Generated ID will appear here</span>
              </div>
            </div>
            
            <button 
              onClick={() => runTest("abha")}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-lg py-3 text-sm font-medium transition-colors border border-slate-700 flex items-center justify-center gap-2 mt-auto"
            >
              <span>{statuses["abha"] === "untested" ? "RUN TEST" : "RE-RUN TEST"}</span>
            </button>
          </div>

          {/* PHC LOCATOR TEST */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-full hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🗺️</span>
                <h3 className="text-lg font-semibold text-white tracking-tight">PHC LOCATOR</h3>
              </div>
              <StatusBadge status={statuses["phc"]} />
            </div>
            
            <div className="flex-1 space-y-4 mb-6">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-300 focus:border-primary focus:ring-0"
                  placeholder="Lat, Lng"
                  defaultValue="12.9716, 77.5946"
                />
                <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg px-3 text-xs border border-slate-700">GPS</button>
              </div>
              <div className="bg-slate-950 rounded-lg border border-slate-800 h-24 overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('https://maps.wikimedia.org/osm-intl/12/2934/1912.png')] bg-cover opacity-30"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-tertiary rounded-full border-2 border-slate-900 shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
              </div>
            </div>
            
            <button 
              onClick={() => runTest("phc")}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-lg py-3 text-sm font-medium transition-colors border border-slate-700 flex items-center justify-center gap-2 mt-auto"
            >
              <span>{statuses["phc"] === "untested" ? "RUN TEST" : "RE-RUN TEST"}</span>
            </button>
          </div>

          {/* SARVAM API TEST */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col h-full hover:border-slate-700 transition-colors">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🔊</span>
                <h3 className="text-lg font-semibold text-white tracking-tight">SARVAM TTS</h3>
              </div>
              <StatusBadge status={statuses["sarvam"]} />
            </div>
            
            <div className="flex-1 space-y-4 mb-6">
              <div className="flex gap-2">
                <select 
                  id="sarvam-lang" 
                  className="w-24 bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-300 focus:border-primary focus:ring-0"
                  onChange={(e) => {
                    const txt = document.getElementById("sarvam-text") as HTMLInputElement;
                    if (!txt) return;
                    const langMap: Record<string, string> = {
                      "en-IN": "Hello, this is Aarogya AI.",
                      "hi-IN": "नमस्ते, यह आरोग्य AI है।",
                      "kn-IN": "ನಮಸ್ಕಾರ, ಇದು ಆರೋಗ್ಯ AI.",
                      "te-IN": "నమస్కారం, ఇది ఆరోగ్య AI.",
                      "ta-IN": "வணக்கம், இது ஆரோக்கிய AI.",
                      "ml-IN": "നമസ്കാരം, ഇത് ആരോഗ്യ AI ആണ്.",
                      "mr-IN": "नमस्कार, हे आरोग्य AI आहे.",
                      "bn-IN": "নমস্কার, এটি আরোগ্য AI।",
                      "gu-IN": "નમસ્તે, આ આરોગ્ય AI છે.",
                      "pa-IN": "ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ, ਇਹ ਆਰੋਗਿਆ AI ਹੈ।",
                      "or-IN": "ନମସ୍କାର, ଏହା ଆରୋଗ୍ୟ AI ଅଟେ।"
                    };
                    txt.value = langMap[e.target.value] || langMap["hi-IN"];
                  }}
                >
                  <option value="en-IN">EN (English)</option>
                  <option value="hi-IN">HI (Hindi)</option>
                  <option value="kn-IN">KN (Kannada)</option>
                  <option value="te-IN">TE (Telugu)</option>
                  <option value="ta-IN">TA (Tamil)</option>
                  <option value="ml-IN">ML (Malayalam)</option>
                  <option value="mr-IN">MR (Marathi)</option>
                  <option value="bn-IN">BN (Bengali)</option>
                  <option value="gu-IN">GU (Gujarati)</option>
                  <option value="pa-IN">PA (Punjabi)</option>
                  <option value="or-IN">OR (Odia)</option>
                </select>
                <input 
                  id="sarvam-text"
                  type="text" 
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-slate-300 focus:border-primary focus:ring-0"
                  placeholder="Text to speak..."
                  defaultValue="नमस्ते, यह आरोग्य AI है।"
                />
              </div>
              <div className="bg-slate-950 rounded-lg p-4 border border-slate-800 h-24 flex items-center justify-center border-dashed">
                <span className="text-xs text-slate-600">Audio payload generation</span>
              </div>
            </div>
            
            <button 
              onClick={() => runTest("sarvam")}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-lg py-3 text-sm font-medium transition-colors border border-slate-700 flex items-center justify-center gap-2 mt-auto"
            >
              <span>{statuses["sarvam"] === "untested" ? "RUN TEST" : "RE-RUN TEST"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: TestStatus }) {
  if (status === "untested") {
    return <span className="px-3 py-1 bg-slate-800 text-slate-400 rounded-full text-xs font-bold border border-slate-700 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div> UNTESTED</span>;
  }
  if (status === "pass") {
    return <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold border border-primary/20 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-primary"></div> PASS</span>;
  }
  return <span className="px-3 py-1 bg-error/10 text-error rounded-full text-xs font-bold border border-error/20 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-error"></div> FAIL</span>;
}
