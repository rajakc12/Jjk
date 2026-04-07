import React, { useState, useRef, useEffect } from 'react';
import { UserCircle, Send, Loader2, BrainCircuit, ArrowLeft } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface Profile {
  medium?: string;
  exam?: string;
  displayName?: string | null;
}

export const AIMentor: React.FC<{ profile: Profile | null }> = ({ profile }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: `Hello ${profile?.displayName || 'Aspirant'}! I am your AI Mentor for ${profile?.exam || 'UPSC/PSC'} preparation. I will guide you in ${profile?.medium || 'English'}. How can I help you today?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          { role: 'user', parts: [{ text: `You are an expert ${profile?.exam || 'UPSC/PSC'} mentor. Provide helpful, accurate, and motivational guidance to a student. Respond in ${profile?.medium || 'English'}. Student asks: ${userMsg}` }] }
        ],
        config: {
          systemInstruction: `You are a professional mentor for ${profile?.exam || 'UPSC/PSC'} exams. Your tone is encouraging, authoritative, and clear. Help students with strategy, content, and motivation. Always respond in ${profile?.medium || 'English'}.`
        }
      });

      const aiMsg = response.text || "I'm sorry, I couldn't process that. Could you try rephrasing?";
      setMessages(prev => [...prev, { role: 'model', text: aiMsg }]);
    } catch (error) {
      console.error("Mentor Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "I'm having some trouble connecting right now. Please try again in a moment." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[70vh] flex flex-col glass-card overflow-hidden">
      <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
            <UserCircle size={24} />
          </div>
          <div>
            <h3 className="font-bold font-serif">AI Mentor</h3>
            <p className="text-[10px] uppercase tracking-widest text-green-600 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
            </p>
          </div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 bg-stone-50/50"
      >
        {messages.map((msg, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-stone-900 text-white rounded-tr-none' 
                : 'bg-white border border-stone-200 text-stone-800 rounded-tl-none shadow-sm'
            }`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-stone-200 p-4 rounded-2xl rounded-tl-none flex gap-2">
              <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-stone-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-white border-t border-stone-200">
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask your mentor anything..."
            className="w-full bg-stone-100 border-none rounded-2xl px-6 py-4 pr-16 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="absolute right-2 top-2 bottom-2 px-4 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
