"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Settings, Eye, Type, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function GlobalPolish() {
  const router = useRouter();
  const [keys, setKeys] = useState("");
  const [highContrast, setHighContrast] = useState(false);
  const [largeFont, setLargeFont] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Easter eggs listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys((prev) => {
        const newKeys = (prev + e.key).toLowerCase().slice(-10);
        if (newKeys.includes("demo")) {
          router.push("/en-IN/chat?demo=true");
          return "";
        }
        if (newKeys.includes("stats")) {
          router.push("/en-IN/analytics");
          return "";
        }
        return newKeys;
      });
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  // Apply accessibility classes
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
    
    if (largeFont) {
      document.documentElement.classList.add("large-text");
    } else {
      document.documentElement.classList.remove("large-text");
    }

    if (muted) {
      document.documentElement.classList.add("audio-muted");
    } else {
      document.documentElement.classList.remove("audio-muted");
    }
  }, [highContrast, largeFont, muted]);

  return (
    <>
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="bg-white/80 backdrop-blur-md p-1.5 md:p-2 rounded-full shadow-lg border border-white/60 text-slate-700 hover:text-slate-900 transition-colors"
          aria-label="Accessibility Settings"
        >
          <Settings className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>

      <AnimatePresence>
        {showSettings && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -10 }}
            className="fixed top-16 right-4 z-50 bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-white/60 flex flex-col gap-3 min-w-[200px]"
          >
            <h3 className="text-sm font-bold text-slate-800 border-b pb-2 mb-1">Accessibility</h3>
            
            <button 
              onClick={() => setHighContrast(!highContrast)}
              className={`flex items-center gap-3 text-sm p-2 rounded-lg transition-colors ${highContrast ? 'bg-blue-100 text-blue-800 font-bold' : 'hover:bg-slate-100 text-slate-700'}`}
            >
              <Eye className="w-4 h-4" /> High Contrast
            </button>
            
            <button 
              onClick={() => setLargeFont(!largeFont)}
              className={`flex items-center gap-3 text-sm p-2 rounded-lg transition-colors ${largeFont ? 'bg-blue-100 text-blue-800 font-bold' : 'hover:bg-slate-100 text-slate-700'}`}
            >
              <Type className="w-4 h-4" /> Large Text
            </button>
            
            <button 
              onClick={() => setMuted(!muted)}
              className={`flex items-center gap-3 text-sm p-2 rounded-lg transition-colors ${muted ? 'bg-red-100 text-red-800 font-bold' : 'hover:bg-slate-100 text-slate-700'}`}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />} 
              {muted ? "Audio Muted" : "Audio Enabled"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
