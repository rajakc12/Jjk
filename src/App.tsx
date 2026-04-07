import React, { useState, useEffect } from 'react';
import { 
  MoreVertical, 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  History, 
  CreditCard, 
  Home as HomeIcon,
  BrainCircuit,
  UserCircle,
  Map,
  Newspaper,
  Trophy,
  MessageSquare,
  Menu,
  X,
  ChevronRight,
  ArrowRight,
  LogOut,
  LogIn,
  AlertTriangle,
  PenTool
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, googleProvider, db, onAuthStateChanged, signOut, doc, getDoc, setDoc, serverTimestamp, addDoc, collection, handleFirestoreError, OperationType } from './firebase';
import { User } from 'firebase/auth';

// Components
import { Home } from './components/Home';
import { Dashboard } from './components/Dashboard';
import { AITestGenerator } from './components/AITestGenerator';
import { AIMentor } from './components/AIMentor';
import { AIMap } from './components/AIMap';
import { PYQSection } from './components/PYQSection';
import { ExamSection } from './components/ExamSection';
import { CalendarSection } from './components/CalendarSection';
import { Subscription } from './components/Subscription';
import { TestHistory } from './components/TestHistory';
import { Auth } from './components/Auth';
import { MainsSection } from './components/MainsSection';
import { Profile } from './components/Profile';
import { CurrentAffairs } from './components/CurrentAffairs';

type View = 'home' | 'dashboard' | 'ai-test' | 'ai-mentor' | 'ai-map' | 'current-affairs' | 'pyq' | 'upsc' | 'psc' | 'calendar-upsc' | 'calendar-psc' | 'subscription' | 'history' | 'mains' | 'profile';

interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  medium?: string;
  exam?: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  const fetchProfile = async (currentUser: User) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        setProfile(userDoc.data() as UserProfile);
      } else {
        const newProfile = {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          lastLogin: serverTimestamp()
        };
        await setDoc(doc(db, 'users', currentUser.uid), newProfile, { merge: true });
        setProfile(newProfile as UserProfile);
      }
    } catch (error: any) {
      console.error("Error fetching user profile:", error);
      if (error.message?.includes('offline')) {
        alert("Firebase is offline. Please ensure Firestore is enabled in your Firebase Console and you have a stable internet connection.");
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setCurrentView('home');
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackEmail || !feedbackMessage || isSubmittingFeedback) return;

    setIsSubmittingFeedback(true);
    try {
      const feedbackData: any = {
        email: feedbackEmail,
        message: feedbackMessage,
        timestamp: serverTimestamp()
      };
      
      if (user?.uid) {
        feedbackData.userId = user.uid;
      }

      await addDoc(collection(db, 'feedback'), feedbackData);
      alert('Thank you for your feedback! We will get back to you soon.');
      setFeedbackEmail('');
      setFeedbackMessage('');
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'feedback');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-main)]">
        <div className="flex flex-col items-center gap-4">
          <BrainCircuit className="text-amber-500 w-12 h-12 animate-pulse" />
          <p className="text-stone-400 font-medium animate-pulse">Initializing AI Prep Hub...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth onSuccess={() => setCurrentView('home')} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'home': return <Home setView={setCurrentView} />;
      case 'dashboard': return <Dashboard setView={setCurrentView} />;
      case 'ai-test': return <AITestGenerator />;
      case 'ai-mentor': return <AIMentor profile={profile} />;
      case 'ai-map': return <AIMap />;
      case 'pyq': return <PYQSection />;
      case 'upsc': return <ExamSection type="UPSC" />;
      case 'psc': return <ExamSection type="PSC" />;
      case 'calendar-upsc': return <CalendarSection type="UPSC" />;
      case 'calendar-psc': return <CalendarSection type="PSC" />;
      case 'subscription': return <Subscription />;
      case 'history': return <TestHistory />;
      case 'mains': return <MainsSection profile={profile} />;
      case 'current-affairs': return <CurrentAffairs />;
      case 'profile': return <Profile profile={profile} onUpdate={(p) => setProfile(p)} />;
      default: return <Home setView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)]">
        {/* Navbar */}
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200 px-6 py-4 flex items-center justify-between">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => setCurrentView('home')}
          >
            <div className="w-10 h-10 bg-stone-900 rounded-xl flex items-center justify-center">
              <BrainCircuit className="text-amber-500 w-6 h-6" />
            </div>
            <span className="text-xl font-bold tracking-tight font-serif">AI PREP HUB</span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full hover:bg-stone-100 transition-colors text-sm font-medium"
            >
              <LayoutDashboard size={18} />
              Dashboard
            </button>
            
            <div className="flex items-center gap-3 border-l border-stone-200 pl-4 ml-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setCurrentView('profile')}>
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt={user.displayName || 'User'} 
                  className="w-8 h-8 rounded-full border border-stone-200"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center">
                  <UserCircle className="text-stone-400" size={20} />
                </div>
              )}
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-stone-900 truncate max-w-[100px]">{user.displayName}</div>
                <div className="text-[10px] text-stone-400">Aspirant Profile</div>
              </div>
            </div>

            <div className="relative">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full hover:bg-stone-100 transition-colors"
              >
                <MoreVertical size={24} />
              </button>

              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-64 glass-card p-2 z-50"
                  >
                    <div className="space-y-1">
                      {[
                        { id: 'profile', label: 'My Profile', icon: UserCircle },
                        { id: 'current-affairs', label: 'Daily Current Affairs', icon: Newspaper },
                        { id: 'mains', label: 'Mains Evaluation', icon: PenTool },
                        { id: 'pyq', label: 'PYQ Section', icon: BookOpen },
                        { id: 'upsc', label: 'UPSC Section', icon: ChevronRight },
                        { id: 'psc', label: 'PSC Section', icon: ChevronRight },
                        { id: 'calendar-upsc', label: 'UPSC Calendar', icon: Calendar },
                        { id: 'calendar-psc', label: 'PSC Calendar', icon: Calendar },
                        { id: 'subscription', label: 'Subscription', icon: CreditCard },
                        { id: 'history', label: 'Test History', icon: History },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => {
                            setCurrentView(item.id as View);
                            setIsMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-stone-100 transition-colors text-sm text-left"
                        >
                          <item.icon size={18} className="text-stone-500" />
                          {item.label}
                        </button>
                      ))}
                      <div className="h-px bg-stone-100 my-2"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-50 text-red-600 transition-colors text-sm text-left"
                      >
                        <LogOut size={18} />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          {renderView()}
        </main>

        {/* Footer / Feedback Section */}
        <footer className="bg-stone-900 text-stone-400 py-12 px-6 mt-20">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <BrainCircuit className="text-amber-500 w-6 h-6" />
                <span className="text-white text-xl font-bold font-serif">AI PREP HUB</span>
              </div>
              <p className="text-sm leading-relaxed">
                Empowering UPSC and PSC aspirants with cutting-edge AI tools and comprehensive resources.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-medium mb-6">Quick Links</h4>
              <ul className="space-y-3 text-sm">
                <li><button onClick={() => setCurrentView('home')} className="hover:text-amber-500 transition-colors">Home</button></li>
                <li><button onClick={() => setCurrentView('dashboard')} className="hover:text-amber-500 transition-colors">Dashboard</button></li>
                <li><button onClick={() => setCurrentView('ai-test')} className="hover:text-amber-500 transition-colors">AI Test Generator</button></li>
                <li><button onClick={() => setCurrentView('subscription')} className="hover:text-amber-500 transition-colors">Pricing</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-medium mb-6">Feedback & Queries</h4>
              <form className="space-y-4" onSubmit={handleFeedbackSubmit}>
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  value={feedbackEmail}
                  onChange={(e) => setFeedbackEmail(e.target.value)}
                  required
                  className="w-full bg-stone-800 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500"
                />
                <textarea 
                  placeholder="Your Message" 
                  rows={3}
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                  required
                  className="w-full bg-stone-800 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-amber-500"
                ></textarea>
                <button 
                  disabled={isSubmittingFeedback}
                  className="bg-amber-500 text-stone-900 px-6 py-2 rounded-xl text-sm font-bold hover:bg-amber-400 transition-colors w-full disabled:opacity-50"
                >
                  {isSubmittingFeedback ? 'Sending...' : 'Send Feedback'}
                </button>
              </form>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-stone-800 text-center text-xs">
            © 2026 AI PREP HUB. All rights reserved.
          </div>
        </footer>
      </div>
  );
}
