"use client";

import { useState } from "react";
import { Send, Menu, Phone, Video, MoreVertical, Mic } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  time: string;
};

export default function WhatsAppSimulator() {
  const t = useTranslations();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Welcome to Aarogya AI WhatsApp Bot. Type 'hi' to start.",
      sender: "bot",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Send to webhook simulator (mocking the Twilio Webhook)
      const res = await fetch("/api/whatsapp/mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Body: userMsg.text, From: "whatsapp:+1234567890" })
      });
      
      const data = await res.json();
      
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        sender: "bot",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e5ddd5] flex items-center justify-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-4xl flex flex-col md:flex-row gap-8 items-center justify-center">
        
        {/* Left Side Info */}
        <div className="flex-1 max-w-md hidden md:flex flex-col gap-6">
          <div className="bg-white p-8 rounded-3xl shadow-xl">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Aarogya AI WhatsApp Bot</h2>
            <p className="text-slate-600 mb-6">
              This is a simulator for our real Twilio WhatsApp integration. 
              The bot supports 6 native languages and uses Gemini 2.0 Flash to detect and respond in the same language.
            </p>
            <div className="bg-green-50 border border-green-200 p-4 rounded-xl mb-6">
              <h3 className="font-bold text-green-800 mb-2">Try these commands:</h3>
              <ul className="list-disc list-inside text-green-700 space-y-1 text-sm">
                <li><span className="font-mono">hi</span> / <span className="font-mono">namaste</span></li>
                <li><span className="font-mono">मुझे बुखार है</span> (Hindi)</li>
                <li><span className="font-mono">ನನಗೆ ಜ್ವರ ಇದೆ</span> (Kannada)</li>
                <li><span className="font-mono">book phc</span></li>
              </ul>
            </div>
            <a 
              href="https://wa.me/14155238886?text=join%20team-member" 
              target="_blank" 
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-4 rounded-xl transition-colors shadow-lg"
            >
              Open in Real WhatsApp
            </a>
          </div>
        </div>

        {/* WhatsApp Phone Mockup */}
        <div className="w-[360px] h-[700px] bg-black rounded-[40px] border-[8px] border-slate-800 p-3 relative flex flex-col shadow-2xl shrink-0">
          <div className="w-24 h-6 bg-black absolute top-0 left-1/2 -translate-x-1/2 rounded-b-2xl z-20"></div>
          
          <div className="flex-1 bg-[#efeae2] rounded-3xl overflow-hidden flex flex-col relative z-10" style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundSize: "cover" }}>
            
            {/* Header */}
            <div className="bg-[#075E54] text-white p-3 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <Menu className="w-5 h-5 opacity-0" /> {/* Spacer */}
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-xl">🩺</span>
                </div>
                <div>
                  <h1 className="font-bold text-[15px]">Aarogya AI</h1>
                  <p className="text-[11px] text-white/80">bot • online</p>
                </div>
              </div>
              <div className="flex gap-4 opacity-80">
                <Video className="w-5 h-5" />
                <Phone className="w-5 h-5" />
                <MoreVertical className="w-5 h-5" />
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-2">
              <div className="bg-[#e1f3fb] text-center self-center text-xs text-slate-600 px-3 py-1 rounded-lg mb-2 shadow-sm">
                Today
              </div>
              
              {messages.map((m) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={m.id} 
                  className={`max-w-[80%] rounded-lg p-2 shadow-sm relative ${
                    m.sender === "user" ? "bg-[#dcf8c6] self-end rounded-tr-sm" : "bg-white self-start rounded-tl-sm"
                  }`}
                >
                  <p className="text-[14px] text-slate-800 whitespace-pre-wrap pr-12">{m.text}</p>
                  <span className="text-[10px] text-slate-500 absolute bottom-1 right-2 flex items-center gap-1">
                    {m.time}
                    {m.sender === "user" && <span className="text-blue-500 text-xs">✓✓</span>}
                  </span>
                </motion.div>
              ))}
              {isTyping && (
                <div className="bg-white self-start rounded-lg rounded-tl-sm p-3 shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-2 bg-transparent flex items-end gap-2 pb-6">
              <div className="flex-1 bg-white rounded-full flex items-center px-4 py-3 shadow-sm">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Message"
                  className="flex-1 outline-none text-[15px]"
                />
              </div>
              <button 
                onClick={input.trim() ? handleSend : undefined}
                className="w-12 h-12 bg-[#128C7E] rounded-full flex items-center justify-center text-white shrink-0 shadow-sm"
              >
                {input.trim() ? <Send className="w-5 h-5 ml-1" /> : <Mic className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
