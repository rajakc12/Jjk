import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LogIn, 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  Globe, 
  GraduationCap,
  BrainCircuit,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { 
  auth, 
  googleProvider, 
  db, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  setDoc,
  doc,
  serverTimestamp 
} from '../firebase';

interface AuthProps {
  onSuccess: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [medium, setMedium] = useState('English');
  const [exam, setExam] = useState('UPSC');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // For Google login, we might need to check if it's a new user to set medium/exam
      // But for now, we'll just update the profile
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        lastLogin: serverTimestamp()
      }, { merge: true });
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          email,
          displayName: name,
          medium,
          exam,
          createdAt: serverTimestamp(),
          lastLogin: serverTimestamp()
        });
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-main)] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-stone-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BrainCircuit className="text-amber-500 w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold font-serif tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-stone-500 text-sm mt-2">
            {isLogin ? 'Login to continue your preparation' : 'Join the elite community of aspirants'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-3 rounded-xl mb-6 flex items-center gap-2 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
              <input 
                type="text" 
                placeholder="Full Name" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              type="email" 
              placeholder="Email Address" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-amber-500 outline-none transition-all"
            />
          </div>

          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-1 flex items-center gap-1">
                  <Globe size={10} /> Medium
                </label>
                <select 
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  <option>English</option>
                  <option>Hindi</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-bold text-stone-400 ml-1 flex items-center gap-1">
                  <GraduationCap size={10} /> Exam
                </label>
                <select 
                  value={exam}
                  onChange={(e) => setExam(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl py-2.5 px-3 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  <option>UPSC</option>
                  <option>PSC</option>
                </select>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 font-bold"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? <LogIn size={20} /> : <UserPlus size={20} />)}
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-4 text-stone-400 font-medium">Or continue with</span>
          </div>
        </div>

        <button 
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full py-3.5 border border-stone-200 rounded-xl flex items-center justify-center gap-3 hover:bg-stone-50 transition-colors font-medium text-stone-700"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
          Google Account
        </button>

        <p className="mt-8 text-center text-sm text-stone-500">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-amber-600 font-bold hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};
