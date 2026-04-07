import React from 'react';
import { Calendar, Bell, Clock, ArrowRight } from 'lucide-react';

export const CalendarSection = ({ type }: { type: 'UPSC' | 'PSC' }) => {
  const events = type === 'UPSC' 
    ? [
        { date: 'Feb 14, 2026', event: 'Notification Release', status: 'Completed' },
        { date: 'Mar 05, 2026', event: 'Last Date to Apply', status: 'Completed' },
        { date: 'May 25, 2026', event: 'Preliminary Examination', status: 'Upcoming' },
        { date: 'Aug 10, 2026', event: 'Pre Results Declaration', status: 'Upcoming' },
        { date: 'Sep 20, 2026', event: 'Mains Examination Start', status: 'Upcoming' },
      ]
    : [
        { date: 'Jan 10, 2026', event: 'State PSC Notification', status: 'Completed' },
        { date: 'Apr 12, 2026', event: 'Preliminary Exam', status: 'Upcoming' },
        { date: 'Jun 15, 2026', event: 'Mains Application Start', status: 'Upcoming' },
        { date: 'Oct 05, 2026', event: 'Mains Examination', status: 'Upcoming' },
      ];

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="text-center">
        <div className="w-16 h-16 bg-stone-100 text-stone-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Calendar size={32} />
        </div>
        <h2 className="text-4xl font-bold font-serif mb-2">{type} Exam Calendar 2026</h2>
        <p className="text-stone-500">Stay updated with important dates and deadlines.</p>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="bg-stone-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock size={20} className="text-amber-500" />
            <span className="font-bold">Important Timelines</span>
          </div>
          <button className="text-xs font-bold bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors">
            Sync with Google Calendar
          </button>
        </div>
        
        <div className="divide-y divide-stone-100">
          {events.map((ev, i) => (
            <div key={i} className="p-6 flex items-center justify-between hover:bg-stone-50 transition-colors">
              <div className="flex items-center gap-6">
                <div className="text-center min-w-[80px]">
                  <div className="text-xs font-bold text-stone-400 uppercase tracking-widest">{ev.date.split(',')[1].trim()}</div>
                  <div className="text-xl font-bold text-stone-900">{ev.date.split(',')[0]}</div>
                </div>
                <div className="h-10 w-px bg-stone-200"></div>
                <div>
                  <div className="font-bold text-stone-800">{ev.event}</div>
                  <div className={`text-[10px] font-bold uppercase tracking-widest ${ev.status === 'Completed' ? 'text-green-600' : 'text-amber-600'}`}>
                    {ev.status}
                  </div>
                </div>
              </div>
              <button className="p-2 text-stone-300 hover:text-stone-900 transition-colors">
                <Bell size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-8 flex items-center gap-6">
          <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
            <Bell size={24} />
          </div>
          <div>
            <h4 className="font-bold mb-1">Push Notifications</h4>
            <p className="text-xs text-stone-500">Get instant alerts for result declarations and new notifications.</p>
          </div>
        </div>
        <div className="glass-card p-8 flex items-center gap-6">
          <div className="w-12 h-12 bg-stone-100 text-stone-600 rounded-2xl flex items-center justify-center shrink-0">
            <ArrowRight size={24} />
          </div>
          <div>
            <h4 className="font-bold mb-1">Detailed Syllabus</h4>
            <p className="text-xs text-stone-500">Download the complete official syllabus for {type} 2026.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
