import React, { useEffect, useState } from 'react';
import { History, CheckCircle2, XCircle, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '../firebase';
import { collection, query, where, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';

interface TestResult {
  id: string;
  topic: string;
  createdAt: Timestamp;
  score: number;
  totalQuestions: number;
  status: string;
}

export const TestHistory = () => {
  const [history, setHistory] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const path = 'testResults';
    const q = query(
      collection(db, path),
      where('uid', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results: TestResult[] = [];
      snapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as TestResult);
      });
      setHistory(results);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, path);
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (timestamp: Timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate();
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const calculateAverageAccuracy = () => {
    if (history.length === 0) return 0;
    const totalScore = history.reduce((acc, curr) => acc + (curr.score / curr.totalQuestions), 0);
    return Math.round((totalScore / history.length) * 100);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="animate-spin text-amber-500" size={32} />
        <p className="text-stone-400 text-sm">Loading your history...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold font-serif mb-2">Test History</h2>
          <p className="text-stone-500">Review your past performance and improve.</p>
        </div>
        <div className="w-12 h-12 bg-stone-100 text-stone-600 rounded-2xl flex items-center justify-center">
          <History size={24} />
        </div>
      </div>

      {history.length === 0 ? (
        <div className="glass-card p-20 text-center">
          <History className="mx-auto text-stone-200 mb-6" size={64} />
          <h3 className="text-xl font-bold mb-2">No tests taken yet</h3>
          <p className="text-stone-500 text-sm">Start your first AI-generated test to see your history here.</p>
        </div>
      ) : (
        <>
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200">
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-stone-400 font-bold">Test Topic</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-stone-400 font-bold">Date</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-stone-400 font-bold">Score</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-stone-400 font-bold">Status</th>
                    <th className="px-6 py-4 text-[10px] uppercase tracking-widest text-stone-400 font-bold"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {history.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50 transition-colors group">
                      <td className="px-6 py-5 font-bold text-stone-800">{item.topic}</td>
                      <td className="px-6 py-5 text-sm text-stone-500">{formatDate(item.createdAt)}</td>
                      <td className="px-6 py-5 font-mono font-bold text-stone-900">{item.score}/{item.totalQuestions}</td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          item.status === 'Passed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {item.status === 'Passed' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="p-2 text-stone-300 hover:text-amber-600 transition-colors group-hover:translate-x-1">
                          <ArrowRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                <div className="text-2xl font-bold text-amber-600">{calculateAverageAccuracy()}%</div>
              </div>
              <div>
                <h4 className="font-bold text-stone-900">Average Accuracy</h4>
                <p className="text-sm text-stone-600">Based on your last {history.length} tests.</p>
              </div>
            </div>
            <button className="btn-primary">View Detailed Analytics</button>
          </div>
        </>
      )}
    </div>
  );
};
