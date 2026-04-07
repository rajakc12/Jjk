import React from 'react';
import { Check, CreditCard, Zap, Shield, Star } from 'lucide-react';

export const Subscription = () => {
  const plans = [
    {
      name: 'Aspirant Free',
      price: '0',
      desc: 'Basic access for beginners',
      features: ['Daily Current Affairs', 'Limited AI Tests (3/mo)', 'PYQ Archive Access', 'Community Forum'],
      button: 'Current Plan',
      current: true
    },
    {
      name: 'Pro Scholar',
      price: '499',
      desc: 'Advanced tools for serious prep',
      features: ['Unlimited AI Tests', 'AI Mentor Access', 'Mains Answer Evaluation', 'Interactive AI Maps', 'No Ads'],
      button: 'Upgrade to Pro',
      current: false,
      featured: true
    },
    {
      name: 'Elite Ranker',
      price: '999',
      desc: 'Complete package with personal touch',
      features: ['Everything in Pro', '1-on-1 AI Strategy', 'Custom Study Planner', 'Priority Support', 'Exclusive Webinars'],
      button: 'Go Elite',
      current: false
    }
  ];

  return (
    <div className="space-y-16">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-5xl font-bold font-serif mb-6">Choose Your Path to Success</h2>
        <p className="text-stone-500">Unlock premium AI tools and expert resources to accelerate your UPSC/PSC preparation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, i) => (
          <div 
            key={i} 
            className={`glass-card p-10 flex flex-col relative ${
              plan.featured ? 'border-amber-500 shadow-xl scale-105 z-10' : ''
            }`}
          >
            {plan.featured && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-amber-500 text-stone-900 text-[10px] font-bold uppercase tracking-widest px-4 py-1.5 rounded-full">
                Most Popular
              </div>
            )}
            
            <div className="mb-8">
              <h3 className="text-xl font-bold font-serif mb-2">{plan.name}</h3>
              <p className="text-xs text-stone-500">{plan.desc}</p>
            </div>

            <div className="mb-10 flex items-baseline gap-1">
              <span className="text-4xl font-bold text-stone-900">₹{plan.price}</span>
              <span className="text-stone-400 text-sm">/ month</span>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
              {plan.features.map((feat, j) => (
                <li key={j} className="flex items-start gap-3 text-sm text-stone-600">
                  <Check size={16} className="text-amber-500 mt-0.5 shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>

            <button className={`w-full py-4 rounded-2xl font-bold text-sm transition-all ${
              plan.current 
                ? 'bg-stone-100 text-stone-400 cursor-default' 
                : plan.featured 
                  ? 'bg-amber-500 text-stone-900 hover:bg-amber-400' 
                  : 'bg-stone-900 text-white hover:bg-stone-800'
            }`}>
              {plan.button}
            </button>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-10 border-t border-stone-200">
        {[
          { icon: Shield, title: 'Secure Payment', desc: 'Encrypted transactions via top gateways.' },
          { icon: Zap, title: 'Instant Access', desc: 'Get pro features immediately after upgrade.' },
          { icon: Star, title: 'Cancel Anytime', desc: 'No long-term contracts or hidden fees.' },
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mb-4">
              <item.icon size={24} className="text-stone-600" />
            </div>
            <h4 className="font-bold mb-2">{item.title}</h4>
            <p className="text-xs text-stone-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
