import React from 'react';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  BookOpen, 
  Map, 
  Newspaper, 
  UserCircle,
  History,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { motion } from 'motion/react';

export const Dashboard = ({ setView }: { setView: (v: any) => void }) => {
  const tools = [
    { id: 'upsc', title: 'UPSC Section', icon: BookOpen, desc: 'Pre & Mains preparation' },
    { id: 'psc', title: 'PSC Section', icon: BookOpen, desc: 'State-specific prep' },
    { id: 'mains', title: 'Mains Evaluation', icon: BookOpen, desc: 'AI Answer Writing Feedback' },
    { id: 'pyq', title: 'PYQ Archive', icon: History, desc: 'Previous year questions' },
    { id: 'ai-test', title: 'AI Test Gen', icon: BrainCircuit, desc: 'Generate custom tests' },
    { id: 'ai-mentor', title: 'AI Mentor', icon: UserCircle, desc: 'Personalized guidance' },
    { id: 'ai-map', title: 'AI Map Study', icon: Map, desc: 'Geography visualization' },
    { id: 'current-affairs', title: 'Current Affairs', icon: Newspaper, desc: 'Daily news & analysis' },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold font-serif mb-2">Dashboard</h1>
          <p className="text-stone-500">Welcome back, Aspirant. Your progress is looking good.</p>
        </div>
        <div className="flex gap-3">
          <div className="glass-card px-6 py-3 flex flex-col items-center">
            <span className="text-xs uppercase tracking-widest text-stone-400 font-bold">Streak</span>
            <span className="text-xl font-bold text-amber-600">12 Days</span>
          </div>
          <div className="glass-card px-6 py-3 flex flex-col items-center">
            <span className="text-xs uppercase tracking-widest text-stone-400 font-bold">Rank</span>
            <span className="text-xl font-bold text-stone-900">#42</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool, idx) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => setView(tool.id as any)}
            className="glass-card p-6 cursor-pointer group hover:border-amber-200 transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-stone-100 rounded-xl flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                <tool.icon size={24} className="text-stone-600 group-hover:text-amber-600" />
              </div>
              <ArrowRight size={20} className="text-stone-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-lg font-bold mb-1 font-serif">{tool.title}</h3>
            <p className="text-stone-500 text-xs">{tool.desc}</p>
          </motion.div>
        ))}
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8">
          <h3 className="text-xl font-bold mb-6 font-serif">Recent Activity</h3>
          <div className="space-y-6">
            {[
              { title: 'History Mock Test', time: '2 hours ago', score: '85/100' },
              { title: 'Geography AI Map Session', time: 'Yesterday', score: 'Completed' },
              { title: 'Current Affairs Quiz', time: '2 days ago', score: '18/20' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between border-b border-stone-100 pb-4 last:border-0 last:pb-0">
                <div>
                  <div className="font-medium text-stone-900">{activity.title}</div>
                  <div className="text-xs text-stone-400">{activity.time}</div>
                </div>
                <div className="font-mono font-bold text-amber-600">{activity.score}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-8 bg-stone-900 text-stone-100">
          <h3 className="text-xl font-bold mb-6 font-serif">AI Mentor Tip</h3>
          <p className="text-stone-400 text-sm leading-relaxed mb-6 italic">
            "Focus on the 'Why' behind historical events rather than just the 'When'. UPSC often tests your analytical understanding of administrative shifts during the colonial era."
          </p>
          <button 
            onClick={() => setView('ai-mentor')}
            className="text-amber-500 font-bold text-sm flex items-center gap-2 hover:text-amber-400 transition-colors"
          >
            Talk to Mentor <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </div>
  );
};
