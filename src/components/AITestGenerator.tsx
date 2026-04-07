import React, { useState } from 'react';
import { BrainCircuit, Loader2, CheckCircle2, AlertCircle, Play, ArrowRight } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const AITestGenerator = () => {
  const [topic, setTopic] = useState('');
  const [examType, setExamType] = useState('UPSC');
  const [numQuestions, setNumQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(-1);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [saving, setSaving] = useState(false);

  const generateTest = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate ${numQuestions} multiple choice questions for ${examType} exam on the topic: ${topic}. 
        Include 4 options for each question and the correct answer. 
        Format as JSON array of objects with keys: question, options (array of 4 strings), correctAnswer (string matching one of the options), explanation.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctAnswer: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ["question", "options", "correctAnswer", "explanation"]
            }
          }
        }
      });

      const data = JSON.parse(response.text || '[]');
      setQuestions(data);
      setCurrentQuestionIdx(0);
      setUserAnswers({});
      setShowResult(false);
    } catch (error) {
      console.error("Error generating test:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveResult = async (score: number) => {
    if (!auth.currentUser) return;
    setSaving(true);
    const path = 'testResults';
    try {
      await addDoc(collection(db, path), {
        uid: auth.currentUser.uid,
        topic,
        examType,
        score,
        totalQuestions: questions.length,
        createdAt: serverTimestamp(),
        status: score >= questions.length / 2 ? 'Passed' : 'Failed'
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setSaving(false);
    }
  };

  const handleAnswer = (answer: string) => {
    setUserAnswers(prev => ({ ...prev, [currentQuestionIdx]: answer }));
  };

  const nextQuestion = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      const score = calculateScore();
      saveResult(score);
      setShowResult(true);
    }
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) score++;
    });
    return score;
  };

  if (showResult) {
    const score = calculateScore();
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto glass-card p-10 text-center"
      >
        <Trophy className="mx-auto text-amber-500 mb-6" size={64} />
        <h2 className="text-4xl font-bold font-serif mb-2">Test Completed!</h2>
        <p className="text-stone-500 mb-8">You've successfully completed the AI-generated test.</p>
        
        <div className="text-6xl font-bold text-stone-900 mb-4">
          {score} <span className="text-2xl text-stone-400">/ {questions.length}</span>
        </div>
        
        {saving && (
          <div className="flex items-center justify-center gap-2 text-xs text-stone-400 mb-6">
            <Loader2 className="animate-spin" size={14} />
            Saving your progress...
          </div>
        )}

        <div className="space-y-4 mb-10 text-left">
          {questions.map((q, idx) => (
            <div key={idx} className={`p-4 rounded-2xl border ${userAnswers[idx] === q.correctAnswer ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
              <div className="font-bold text-sm mb-1">Q{idx + 1}: {q.question}</div>
              <div className="text-xs text-stone-600">
                Your Answer: <span className={userAnswers[idx] === q.correctAnswer ? 'text-green-700 font-bold' : 'text-red-700 font-bold'}>{userAnswers[idx] || 'Not answered'}</span>
              </div>
              {userAnswers[idx] !== q.correctAnswer && (
                <div className="text-xs text-green-700 font-bold mt-1">Correct: {q.correctAnswer}</div>
              )}
              <div className="mt-2 text-[10px] text-stone-500 italic">{q.explanation}</div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => {
            setQuestions([]);
            setCurrentQuestionIdx(-1);
            setShowResult(false);
          }}
          className="btn-primary w-full"
        >
          Generate Another Test
        </button>
      </motion.div>
    );
  }

  if (currentQuestionIdx >= 0) {
    const q = questions[currentQuestionIdx];
    return (
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-stone-400">Question {currentQuestionIdx + 1} of {questions.length}</span>
          <div className="h-1.5 w-32 bg-stone-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500 transition-all duration-500" 
              style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <motion.div 
          key={currentQuestionIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card p-10"
        >
          <h3 className="text-2xl font-bold font-serif mb-8 leading-tight">{q.question}</h3>
          <div className="space-y-3">
            {q.options.map((opt: string, i: number) => (
              <button
                key={i}
                onClick={() => handleAnswer(opt)}
                className={`w-full text-left p-4 rounded-2xl border transition-all ${
                  userAnswers[currentQuestionIdx] === opt 
                    ? 'bg-stone-900 text-white border-stone-900 shadow-lg' 
                    : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${
                    userAnswers[currentQuestionIdx] === opt ? 'bg-white/20 border-white/40' : 'bg-stone-50 border-stone-200'
                  }`}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </div>
              </button>
            ))}
          </div>

          <button 
            disabled={!userAnswers[currentQuestionIdx]}
            onClick={nextQuestion}
            className="btn-primary w-full mt-10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {currentQuestionIdx === questions.length - 1 ? 'Finish Test' : 'Next Question'} <ArrowRight size={18} />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-10">
      <div className="text-center">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <BrainCircuit size={32} />
        </div>
        <h2 className="text-4xl font-bold font-serif mb-2">AI Test Generator</h2>
        <p className="text-stone-500">Generate high-quality practice questions tailored to your needs.</p>
      </div>

      <div className="glass-card p-10 space-y-8">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Topic or Subject</label>
          <input 
            type="text" 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Indian Polity, Modern History, Economics..."
            className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Exam Type</label>
            <select 
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-amber-500 outline-none"
            >
              <option>UPSC</option>
              <option>PSC</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Questions</label>
            <select 
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-amber-500 outline-none"
            >
              <option value={5}>5 Questions</option>
              <option value={10}>10 Questions</option>
              <option value={20}>20 Questions</option>
            </select>
          </div>
        </div>

        <button 
          onClick={generateTest}
          disabled={loading || !topic}
          className="btn-primary w-full py-5 flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Generating Questions...
            </>
          ) : (
            <>
              <Play size={20} fill="currentColor" />
              Generate Test
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: CheckCircle2, title: 'Accurate', desc: 'Based on latest patterns' },
          { icon: BrainCircuit, title: 'Smart', desc: 'AI-powered explanations' },
          { icon: Trophy, title: 'Track', desc: 'Save your test history' },
        ].map((feat, i) => (
          <div key={i} className="text-center p-6">
            <feat.icon size={24} className="mx-auto text-stone-400 mb-3" />
            <h4 className="text-sm font-bold mb-1">{feat.title}</h4>
            <p className="text-xs text-stone-500">{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Trophy = ({ className, size }: { className?: string, size?: number }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size || 24} 
    height={size || 24} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 22V18" />
    <path d="M14 22V18" />
    <path d="M18 4H6v7a6 6 0 0 0 12 0V4Z" />
  </svg>
);
