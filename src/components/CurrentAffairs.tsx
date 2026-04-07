import React, { useState, useEffect } from 'react';
import { Newspaper, Loader2, Calendar, Search, ExternalLink, BookOpen, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface NewsItem {
  title: string;
  summary: string;
  relevance: string;
  category: string;
  sourceUrl?: string;
}

export const CurrentAffairs = () => {
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [date] = useState(new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }));
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'National', 'International', 'Economy', 'Polity', 'Science & Tech', 'Environment'];

  const fetchCurrentAffairs = async () => {
    setLoading(true);
    try {
      // 1. Fetch real news from our proxy
      const newsResponse = await fetch(`/api/news?category=${selectedCategory === 'All' ? 'general' : selectedCategory.toLowerCase()}`);
      
      if (!newsResponse.ok) {
        const errorData = await newsResponse.json().catch(() => ({}));
        throw new Error(`News API error: ${newsResponse.status} ${errorData.error || ''} ${errorData.details || ''}`);
      }

      const newsData = await newsResponse.json();

      if (!newsData.articles || newsData.articles.length === 0) {
        throw new Error("No articles found in GNews response");
      }

      // 2. Use Gemini to analyze these news items for UPSC relevance
      const prompt = `Analyze the following news articles for UPSC and PSC aspirants. 
      For each article, provide:
      1. A concise title (you can refine the original).
      2. A 2-3 sentence summary focusing on administrative and socio-economic impact.
      3. Why it is relevant for UPSC/PSC (e.g., GS Paper I, II, III).
      4. The category it belongs to.
      
      News Articles:
      ${newsData.articles.slice(0, 5).map((a: any, i: number) => `Article ${i+1}: ${a.title}. Description: ${a.description}`).join('\n')}
      
      Format the response as a JSON array of objects with keys: title, summary, relevance, category.`;

      const aiResponse = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const processedNews = JSON.parse(aiResponse.text || '[]');
      // Add source URLs back
      const finalNews = processedNews.map((item: any, idx: number) => ({
        ...item,
        sourceUrl: newsData.articles[idx]?.url
      }));

      setNews(finalNews);
    } catch (error) {
      console.error("Error fetching current affairs from GNews:", error);
      // Fallback to pure Gemini search if GNews fails
      try {
        const prompt = `Provide a summary of the most important current affairs for today (${new Date().toISOString().split('T')[0]}) specifically relevant for UPSC and PSC aspirants in India. 
        Focus on National, International, Economy, Polity, Science & Tech, and Environment.
        For each item, provide:
        1. A concise title.
        2. A 2-3 sentence summary.
        3. Why it is relevant for UPSC/PSC (e.g., GS Paper I, II, III).
        4. The category it belongs to.
        
        Format the response as a JSON array of objects with keys: title, summary, relevance, category.`;

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: prompt,
          config: {
            tools: [{ googleSearch: {} }],
            responseMimeType: "application/json",
          },
        });
        setNews(JSON.parse(response.text || '[]'));
      } catch (fallbackError) {
        console.error("Fallback error:", fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentAffairs();
  }, []);

  const filteredNews = selectedCategory === 'All' 
    ? news 
    : news.filter(item => item.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
              <Newspaper size={24} />
            </div>
            <h1 className="text-4xl font-bold font-serif">Daily Current Affairs</h1>
          </div>
          <p className="text-stone-500 flex items-center gap-2">
            <Calendar size={16} /> {date} • Curated for UPSC & PSC Aspirants
          </p>
        </div>
        <button 
          onClick={fetchCurrentAffairs}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-stone-900 text-white rounded-2xl hover:bg-stone-800 transition-all disabled:opacity-50"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Refresh News
        </button>
      </header>

      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${
              selectedCategory === cat 
                ? 'bg-amber-500 text-stone-900 border-amber-500 shadow-md' 
                : 'bg-white text-stone-400 border-stone-200 hover:border-stone-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20 gap-4"
          >
            <Loader2 className="animate-spin text-amber-500" size={48} />
            <p className="text-stone-500 font-serif italic text-lg">AI is scanning the news for you...</p>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 gap-6"
          >
            {filteredNews.length > 0 ? (
              filteredNews.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card p-8 group hover:border-amber-200 transition-all"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <h3 className="text-2xl font-bold font-serif text-stone-900 group-hover:text-amber-700 transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    <button 
                      onClick={() => item.sourceUrl && window.open(item.sourceUrl, '_blank')}
                      className="flex items-center gap-2 text-xs font-bold text-stone-400 hover:text-stone-900 transition-colors"
                    >
                      <ExternalLink size={14} /> Source
                    </button>
                  </div>

                  <div className="prose prose-stone max-w-none mb-6">
                    <p className="text-stone-600 leading-relaxed">{item.summary}</p>
                  </div>

                  <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">
                      <BookOpen size={14} /> Exam Relevance
                    </div>
                    <p className="text-sm text-stone-700 italic">{item.relevance}</p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 glass-card">
                <Search className="mx-auto text-stone-200 mb-4" size={48} />
                <p className="text-stone-500">No news found for this category.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <section className="glass-card p-10 bg-stone-900 text-stone-100 overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold font-serif mb-4">Why Current Affairs Matter?</h3>
          <p className="text-stone-400 text-sm leading-relaxed max-w-2xl mb-8">
            Current affairs form the backbone of UPSC and PSC examinations. They are not just about facts but about understanding the evolving socio-economic and political landscape of India and the world.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="text-amber-500 font-bold">GS Paper II</div>
              <p className="text-xs text-stone-500">Governance, Constitution, Polity, Social Justice and International relations.</p>
            </div>
            <div className="space-y-2">
              <div className="text-amber-500 font-bold">GS Paper III</div>
              <p className="text-xs text-stone-500">Technology, Economic Development, Bio-diversity, Environment, Security and Disaster Management.</p>
            </div>
            <div className="space-y-2">
              <div className="text-amber-500 font-bold">Interview</div>
              <p className="text-xs text-stone-500">Developing an opinion on national and international issues is crucial for the personality test.</p>
            </div>
          </div>
        </div>
        <Newspaper className="absolute -right-10 -bottom-10 text-white/5 w-64 h-64 rotate-12" />
      </section>
    </div>
  );
};
