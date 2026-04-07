import React, { useState } from 'react';
import { History, Download, Eye, Search, Filter, BookOpen, Lock } from 'lucide-react';
import { auth } from '../firebase';

export const PYQSection = () => {
  const [filter, setFilter] = useState('All');
  const user = auth.currentUser;

  const pyqs = [
    { year: 2024, exam: 'UPSC', stage: 'Pre', subject: 'General Studies I', status: 'Available', url: 'https://drive.google.com/file/d/1uT3HnNjFmuR5aoROQT-a1kCRQuv3xYTN/view?usp=drivesdk' },
    { year: 2023, exam: 'UPSC', stage: 'Mains', subject: 'Ethics (GS IV)', status: 'Available', url: 'https://drive.google.com/file/d/1tQHr-rTqQONpnoaX9b4vHgXhMv9gK6u0/view?usp=drivesdk' },
    { year: 2024, exam: 'MPPSC', stage: 'Pre', subject: 'General Studies', status: 'Available', url: 'https://drive.google.com/file/d/1j4RgrcXlGPCzzHlVo33F9FkpRaDIFoFH/view?usp=drivesdk' },
    { year: 2022, exam: 'UPSC', stage: 'Pre', subject: 'CSAT', status: 'Available', url: 'https://drive.google.com/file/d/1QlhNYPNRTLJ1K-G43dkOuP_804ZO52HO/view?usp=drivesdk' },
    { year: 2023, exam: 'UPPSC', stage: 'Mains', subject: 'Hindi', status: 'Available', url: 'https://drive.google.com/file/d/1QkAoRufqnFUIrbYDSuFpsqMbHgSbOexH/view?usp=drivesdk' },
    { year: 2021, exam: 'UPSC', stage: 'Mains', subject: 'History Optional', status: 'Available', url: 'https://drive.google.com/file/d/1S6X8QsxtnBuUFxwQi2xyMSZJ4WIo0GFT/view?usp=drivesdk' },
  ];

  const filteredPyqs = filter === 'All' ? pyqs : pyqs.filter(p => p.exam === filter);

  const handleOpenLink = (url?: string) => {
    if (!user) {
      alert('Please login to access these resources.');
      return;
    }
    
    if (url) {
      window.open(url, '_blank');
    } else {
      alert('This paper will be available soon!');
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-bold font-serif mb-2">PYQ Archive</h2>
          <p className="text-stone-500">Previous Year Questions for UPSC and State PSCs.</p>
        </div>
        <div className="flex gap-4">
          <div className="flex bg-stone-100 p-1 rounded-full">
            {['All', 'UPSC', 'MPPSC', 'UPPSC'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${
                  filter === f ? 'bg-white text-stone-900 shadow-sm' : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPyqs.map((pyq, i) => (
          <div key={i} className="glass-card p-8 group hover:border-amber-200 transition-all">
            <div className="flex items-center justify-between mb-6">
              <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-widest rounded-full">
                {pyq.exam} {pyq.year}
              </span>
              <History size={20} className="text-stone-300 group-hover:text-amber-500 transition-colors" />
            </div>
            
            <h3 className="text-xl font-bold font-serif mb-2">{pyq.subject}</h3>
            <p className="text-stone-500 text-xs mb-8">{pyq.stage} Examination</p>
            
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => handleOpenLink(pyq.url)}
                className="flex items-center justify-center gap-2 py-3 bg-stone-900 text-white rounded-xl text-xs font-bold hover:bg-stone-800 transition-colors"
              >
                {pyq.url && <Lock size={12} className="text-amber-500" />}
                <Eye size={14} /> View
              </button>
              <button 
                onClick={() => handleOpenLink(pyq.url)}
                className="flex items-center justify-center gap-2 py-3 border border-stone-200 text-stone-900 rounded-xl text-xs font-bold hover:bg-stone-50 transition-colors"
              >
                {pyq.url && <Lock size={12} className="text-amber-500" />}
                <Download size={14} /> PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-10 bg-stone-50 border-dashed border-2 border-stone-200 text-center">
        <BookOpen size={40} className="mx-auto text-stone-300 mb-4" />
        <h3 className="text-xl font-bold mb-2">Missing a paper?</h3>
        <p className="text-sm text-stone-500 mb-6">We are constantly updating our archive. Let us know which year or exam you need.</p>
        <button className="text-amber-600 font-bold text-sm hover:underline">Request a Paper</button>
      </div>
    </div>
  );
};
