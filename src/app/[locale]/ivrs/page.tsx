"use client";

import { useState } from "react";
import { Phone, PhoneOff, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function IVRSPage() {
  const [callState, setCallState] = useState<"IDLE" | "CALLING" | "CONNECTED" | "ENDED">("IDLE");
  const [transcript, setTranscript] = useState<string[]>([]);

  const startCall = () => {
    setCallState("CALLING");
    setTimeout(() => {
      setCallState("CONNECTED");
      playIVRSFlow();
    }, 2000);
  };

  const endCall = () => {
    setCallState("ENDED");
  };

  const playIVRSFlow = () => {
    const script = [
      { speaker: "IVR", text: "Press 1 for Hindi, 2 for English, 3 for Tamil.", delay: 1000 },
      { speaker: "USER", text: "1", delay: 4000 },
      { speaker: "IVR", text: "Aapko bukhar hai? 1 dabayein haan ke liye, 2 nahi ke liye.", delay: 6000 },
      { speaker: "USER", text: "1", delay: 9000 },
      { speaker: "IVR", text: "Kya aapko khasi bhi hai? 1 haan, 2 nahi.", delay: 11000 },
      { speaker: "USER", text: "1", delay: 14000 },
      { speaker: "IVR", text: "Aapka risk score HIGH hai. Kripya nazdiki PHC visit karein. Call katne ke baad aapko SMS aa jayega.", delay: 16000 },
      { speaker: "SYS", text: "Call Ended.", delay: 22000 }
    ];

    script.forEach((step) => {
      setTimeout(() => {
        if (step.speaker === "SYS") {
          setCallState("ENDED");
        } else {
          setTranscript(prev => [...prev, `${step.speaker}: ${step.text}`]);
          if (step.speaker === "IVR") {
            speak(step.text);
          }
        }
      }, step.delay);
    });
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "hi-IN";
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-transparent font-sans p-4">
      <div className="w-[320px] h-[640px] bg-black rounded-[40px] border-[8px] border-slate-800 p-4 relative flex flex-col shadow-2xl">
        <div className="w-24 h-6 bg-black absolute top-0 left-1/2 -translate-x-1/2 rounded-b-2xl"></div>
        
        {/* Screen */}
        <div className="flex-1 bg-slate-800 rounded-2xl overflow-hidden flex flex-col relative mt-2">
          
          {callState === "IDLE" && (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-slate-400 text-sm mb-4">Aarogya AI Toll-Free</div>
              <div className="text-white text-3xl font-light mb-12">1800-111-2222</div>
              <Button onClick={startCall} className="rounded-full w-16 h-16 bg-green-500 hover:bg-green-600 shadow-lg">
                <Phone className="w-8 h-8 text-white fill-current" />
              </Button>
            </div>
          )}

          {callState === "CALLING" && (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-white text-2xl font-light mb-2">Calling...</div>
              <div className="text-slate-400 text-sm mb-12">Aarogya AI Toll-Free</div>
              <Button onClick={endCall} className="rounded-full w-16 h-16 bg-red-500 hover:bg-red-600 shadow-lg">
                <PhoneOff className="w-8 h-8 text-white" />
              </Button>
            </div>
          )}

          {callState === "CONNECTED" && (
            <div className="flex-1 flex flex-col relative">
              <div className="p-4 bg-slate-900/50 flex justify-between items-center text-xs text-slate-300">
                <span>00:14</span>
                <span className="flex gap-1 items-center text-green-400">
                  <Mic className="w-3 h-3" /> Connected
                </span>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {transcript.map((line, i) => (
                  <div key={i} className={`text-sm ${line.startsWith('USER') ? 'text-blue-300 text-right' : 'text-slate-300'}`}>
                    {line}
                  </div>
                ))}
              </div>

              <div className="p-4 bg-slate-900 pb-8 flex justify-center">
                <Button onClick={endCall} className="rounded-full w-16 h-16 bg-red-500 hover:bg-red-600 shadow-lg">
                  <PhoneOff className="w-8 h-8 text-white" />
                </Button>
              </div>
            </div>
          )}

          {callState === "ENDED" && (
            <div className="flex-1 flex flex-col items-center justify-center bg-slate-800">
              <div className="text-white text-xl mb-6">Call Ended</div>
              
              <div className="bg-slate-700 w-full p-4 mx-4 rounded-xl border border-slate-600 max-w-[280px]">
                <div className="text-xs text-slate-400 mb-1">New SMS from AAROGYA</div>
                <div className="text-sm text-white">
                  Aapka risk score: HIGH. Kripya nazdiki PHC (Hospital) visit karein. ABHA ID banane ke liye link par click karein.
                </div>
              </div>

              <Button onClick={() => { setCallState("IDLE"); setTranscript([]); }} variant="ghost" className="mt-8 text-blue-400">
                Back to Dialer
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
