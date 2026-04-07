import React from 'react';
import { 
  ArrowRight, 
  BrainCircuit, 
  Map as MapIcon, 
  Newspaper, 
  Trophy,
  BookOpen,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { motion } from 'motion/react';

const quotes = [
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The only way to do great work is to love what you do.",
  "Your time is limited, don't waste it living someone else's life.",
  "The future depends on what you do today."
];

export const Home = ({ setView }: { setView: (v: any) => void }) => {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section - Editorial Style */}
      <section className="relative min-h-[80vh] flex flex-col justify-center">
        <div className="absolute top-0 right-0 -z-10 opacity-5 select-none">
          <BrainCircuit size={600} className="text-stone-900" />
        </div>
        
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-widest mb-8"
          >
            The Future of Civil Services Prep
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl md:text-9xl font-serif font-bold leading-[0.85] tracking-tighter mb-10"
          >
            MASTER <br />
            <span className="text-amber-600">UPSC</span> WITH <br />
            INTELLIGENCE.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl text-stone-500 max-w-2xl mb-12 font-serif italic leading-relaxed"
          >
            "{randomQuote}"
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-6"
          >
            <button 
              onClick={() => setView('dashboard')}
              className="px-10 py-4 bg-stone-900 text-white rounded-2xl font-bold text-lg hover:bg-stone-800 transition-all flex items-center gap-3 group"
            >
              Get Started <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => setView('ai-mentor')}
              className="px-10 py-4 bg-white border-2 border-stone-200 text-stone-900 rounded-2xl font-bold text-lg hover:border-amber-500 transition-all"
            >
              Talk to AI Mentor
            </button>
          </motion.div>
        </div>
      </section>

      {/* Features Section - Systematic Grid */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold font-serif mb-4">Systematic AI Ecosystem</h2>
          <p className="text-stone-500">Everything you need to crack the toughest exams, organized in one powerful platform.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              id: 'ai-test', 
              title: 'AI Test Engine', 
              desc: 'Generate custom MCQs based on specific topics and difficulty levels.', 
              icon: BrainCircuit,
              color: 'text-amber-600'
            },
            { 
              id: 'mains', 
              title: 'Mains Evaluation', 
              desc: 'Get instant AI feedback on your answer writing with model answers.', 
              icon: BookOpen,
              color: 'text-blue-600'
            },
            { 
              id: 'ai-map', 
              title: 'Map Visualization', 
              desc: 'Learn Geography through interactive AI-powered map study sessions.', 
              icon: MapIcon,
              color: 'text-emerald-600'
            },
            { 
              id: 'ai-mentor', 
              title: '24/7 AI Mentor', 
              desc: 'Personalized guidance and doubt clearing in your preferred medium.', 
              icon: MessageSquare,
              color: 'text-purple-600'
            },
            { 
              id: 'current-affairs', 
              title: 'Daily Current Affairs', 
              desc: 'Stay updated with AI-curated news relevant for UPSC & PSC.', 
              icon: Newspaper,
              color: 'text-red-600'
            },
          ].map((item, idx) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setView(item.id as any)}
              className="glass-card p-8 cursor-pointer group hover:border-amber-200 transition-all"
            >
              <div className={`w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-50 transition-colors`}>
                <item.icon size={28} className={item.color} />
              </div>
              <h3 className="text-xl font-bold mb-3 font-serif">{item.title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed mb-6">{item.desc}</p>
              <div className="flex items-center text-stone-900 font-bold text-xs uppercase tracking-widest">
                Launch <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it Works - Visual Timeline */}
      <section className="bg-stone-900 rounded-[40px] p-12 md:p-20 text-white overflow-hidden relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl font-bold font-serif mb-8 leading-tight">Your Path to <br /><span className="text-amber-500">LBSNAA</span> Starts Here.</h2>
            <div className="space-y-10">
              {[
                { step: '01', title: 'Set Your Profile', desc: 'Choose your exam (UPSC/PSC) and medium (Hindi/English).' },
                { step: '02', title: 'Practice with AI', desc: 'Generate tests and get your mains answers evaluated instantly.' },
                { step: '03', title: 'Track Progress', desc: 'Monitor your performance with detailed analytics and global ranking.' },
              ].map((item) => (
                <div key={item.step} className="flex gap-6">
                  <span className="text-4xl font-serif font-bold text-amber-500/30">{item.step}</span>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                    <p className="text-stone-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="glass-card bg-white/5 border-white/10 p-8 backdrop-blur-xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                  <Trophy className="text-stone-900" size={24} />
                </div>
                <div>
                  <div className="text-lg font-bold">Aspirant Success Rate</div>
                  <div className="text-xs text-stone-400">Powered by AI Analytics</div>
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '85%' }}
                    className="h-full bg-amber-500"
                  ></motion.div>
                </div>
                <p className="text-sm text-stone-300 italic">
                  "The AI evaluation for my Mains answers was a game-changer. It pointed out exactly where I was losing marks in GS Paper II."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-stone-800 rounded-full"></div>
                  <div>
                    <div className="text-sm font-bold">Anil Mahor</div>
                    <div className="text-[10px] text-stone-500 uppercase tracking-widest">Rank #1 (Mock Test)</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Leaderboard Section - Refined */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 glass-card p-10">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold font-serif mb-2">Global Leaderboard</h2>
              <p className="text-stone-500 text-sm">Top performers across all exams</p>
            </div>
            <div className="px-4 py-2 bg-stone-100 rounded-xl text-xs font-bold text-stone-600">WEEKLY</div>
          </div>

          <div className="space-y-2">
            {[
              { rank: 1, name: 'Anil Mahor', score: 985, tests: 42, trend: 'up' },
              { rank: 2, name: 'Priya Sharma', score: 942, tests: 38, trend: 'up' },
              { rank: 3, name: 'Rahul Verma', score: 910, tests: 35, trend: 'down' },
              { rank: 4, name: 'Sneha Gupta', score: 885, tests: 31, trend: 'up' },
              { rank: 5, name: 'Vikram Singh', score: 850, tests: 28, trend: 'stable' },
            ].map((user) => (
              <div key={user.rank} className="flex items-center justify-between p-5 rounded-2xl hover:bg-stone-50 transition-all border border-transparent hover:border-stone-100 group">
                <div className="flex items-center gap-6">
                  <span className={`text-2xl font-serif font-bold ${user.rank === 1 ? 'text-amber-500' : 'text-stone-300'}`}>
                    {user.rank.toString().padStart(2, '0')}
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-stone-200 rounded-full"></div>
                    <div>
                      <div className="font-bold text-stone-900 group-hover:text-amber-600 transition-colors">{user.name}</div>
                      <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">{user.tests} tests taken</div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-stone-900 text-lg">{user.score}</div>
                  <div className="text-[10px] uppercase tracking-wider text-stone-400 font-bold">Hub Points</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-10 bg-amber-50 border-amber-100 flex flex-col justify-center text-center">
          <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg shadow-amber-200">
            <Trophy className="text-stone-900" size={32} />
          </div>
          <h3 className="text-2xl font-bold font-serif mb-4">Ready to Join?</h3>
          <p className="text-stone-600 text-sm leading-relaxed mb-8">
            Compete with thousands of aspirants and see where you stand in the global competition.
          </p>
          <button 
            onClick={() => setView('dashboard')}
            className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold hover:bg-stone-800 transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      </section>
      {/* Community Comments Section */}
      <section className="glass-card p-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center">
            <MessageSquare className="text-stone-900" size={20} />
          </div>
          <div>
            <h2 className="text-3xl font-bold font-serif">Aspirant Community</h2>
            <p className="text-stone-500 text-sm">Share your thoughts and connect with fellow aspirants.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-stone-200 rounded-full shrink-0"></div>
            <div className="flex-1 space-y-3">
              <textarea 
                placeholder="Write a comment..."
                className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                rows={2}
              ></textarea>
              <button className="px-6 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-all">
                Post Comment
              </button>
            </div>
          </div>

          <div className="h-px bg-stone-100 my-8"></div>

          <div className="space-y-8">
            {[
              { name: 'Anil Mahor', time: '2 hours ago', text: 'The AI evaluation for Mains is really helpful! It helped me structure my answers better.' },
              { name: 'Priya Sharma', time: '5 hours ago', text: 'Does anyone have tips for GS Paper III? The AI mentor suggested focusing on internal security.' },
              { name: 'Rahul Verma', time: '1 day ago', text: 'The interactive maps are great for Geography. Highly recommended!' }
            ].map((comment, idx) => (
              <div key={idx} className="flex gap-4 group">
                <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center font-bold text-stone-400">
                  {comment.name[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-stone-900">{comment.name}</span>
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider">{comment.time}</span>
                  </div>
                  <p className="text-sm text-stone-600 leading-relaxed">{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
