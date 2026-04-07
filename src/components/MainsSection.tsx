import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PenTool, 
  Send, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen,
  Trophy,
  MessageCircle,
  Camera,
  Upload,
  X,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface Profile {
  medium?: string;
  exam?: string;
}

export const MainsSection: React.FC<{ profile: Profile | null }> = ({ profile }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [marks, setMarks] = useState('10');
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if file is at least 10KB (to avoid empty files) and under 10MB
      if (file.size < 10 * 1024) {
        alert("File is too small. Please upload a clear photo of your answer.");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert("File size too large. Please upload an image under 10MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleEvaluate = async () => {
    if (!question.trim() || (!answer.trim() && !selectedImage) || loading) return;

    setLoading(true);
    try {
      let parts: any[] = [];
      
      const prompt = `
        You are an expert UPSC/PSC examiner. Evaluate the following answer based on UPSC standards.
        
        Student Profile:
        - Exam: ${profile?.exam || 'UPSC'}
        - Medium: ${profile?.medium || 'English'}
        
        Question (${marks} Marks):
        ${question}
        
        ${answer ? `Student's Typed Answer:\n${answer}` : ''}
        ${selectedImage ? `Student has also provided a photo of their handwritten answer. Please analyze the text in the image and evaluate it.` : ''}
        
        Please provide:
        1. Marks Awarded (out of ${marks}).
        2. Detailed Feedback:
           - Use "> [GOOD]" for things that are correct or strengths (Sahi Hai). These will be shown in Green.
           - Use "> [BAD]" for things that are missing or need improvement (Kami). These will be shown in Red.
           - For each "BAD" point, provide a specific suggestion on "How to write it better" (Esa likho).
        3. Model Answer (How it should have been written).
        
        Response should be in ${profile?.medium || 'English'}.
        Use clear headings and bullet points.
      `;

      parts.push({ text: prompt });

      if (selectedImage) {
        const base64Data = selectedImage.split(',')[1];
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: imageFile?.type || 'image/jpeg'
          }
        });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: 'user', parts }],
      });

      setEvaluation(response.text || "Evaluation failed. Please try again.");
    } catch (error) {
      console.error("Evaluation Error:", error);
      setEvaluation("Error evaluating answer. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-stone-900 rounded-2xl flex items-center justify-center">
          <PenTool className="text-amber-500 w-6 h-6" />
        </div>
        <div>
          <h1 className="text-3xl font-bold font-serif">Mains Answer Evaluation</h1>
          <p className="text-stone-500">Get instant feedback on your descriptive answers from our AI Expert.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="glass-card p-6 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Question</label>
              <textarea 
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Paste the UPSC/PSC question here..."
                rows={3}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Your Answer</label>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-stone-400 uppercase">Weightage:</span>
                  <select 
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
                    className="bg-stone-100 border-none rounded-lg px-2 py-1 text-xs font-bold outline-none"
                  >
                    <option value="10">10 Marks</option>
                    <option value="15">15 Marks</option>
                    <option value="20">20 Marks</option>
                    <option value="25">25 Marks</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                <button 
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-stone-100 rounded-xl text-xs font-bold hover:bg-stone-200 transition-colors"
                >
                  <Camera size={16} /> Take Photo
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-stone-100 rounded-xl text-xs font-bold hover:bg-stone-200 transition-colors"
                >
                  <Upload size={16} /> Upload JPG/PDF
                </button>
                <input 
                  type="file" 
                  ref={cameraInputRef} 
                  accept="image/*" 
                  capture="environment" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*,application/pdf" 
                  className="hidden" 
                  onChange={handleFileChange}
                />
              </div>

              {selectedImage && (
                <div className="relative mb-4 rounded-xl overflow-hidden border border-stone-200 bg-stone-50 p-2">
                  <button 
                    onClick={removeImage}
                    className="absolute top-4 right-4 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 z-10"
                  >
                    <X size={14} />
                  </button>
                  {imageFile?.type === 'application/pdf' ? (
                    <div className="flex items-center gap-3 p-4">
                      <FileText className="text-red-500" size={32} />
                      <div>
                        <div className="text-sm font-bold truncate max-w-[200px]">{imageFile.name}</div>
                        <div className="text-[10px] text-stone-400">PDF Document</div>
                      </div>
                    </div>
                  ) : selectedImage ? (
                    <img src={selectedImage} alt="Answer Preview" className="w-full h-48 object-contain rounded-lg" />
                  ) : null}
                </div>
              )}

              <textarea 
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Or write your detailed answer here..."
                rows={selectedImage ? 6 : 12}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm font-serif leading-relaxed"
              />
            </div>

            <button 
              onClick={handleEvaluate}
              disabled={!question.trim() || (!answer.trim() && !selectedImage) || loading}
              className="btn-primary w-full py-4 flex items-center justify-center gap-3 font-bold"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
              Evaluate Answer
            </button>
          </div>
        </div>

        {/* Evaluation Section */}
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {evaluation ? (
              <motion.div 
                key="evaluation"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card p-8 h-full overflow-y-auto max-h-[80vh] relative"
              >
                <div className="prose prose-stone max-w-none">
                  <div className="markdown-body">
                    <Markdown
                      components={{
                        blockquote: ({ children }) => {
                          const content = React.Children.toArray(children);
                          const firstChild = content[0] as any;
                          const text = firstChild?.props?.children?.[0] || firstChild?.props?.children || "";
                          
                          if (typeof text === 'string') {
                            if (text.includes('[GOOD]')) {
                              return (
                                <div className="bg-green-50 border-l-4 border-green-500 p-4 my-4 rounded-r-xl">
                                  <div className="flex items-center gap-2 mb-1">
                                    <CheckCircle2 size={16} className="text-green-600" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-green-700">Sahi Hai (Correct)</span>
                                  </div>
                                  <div className="text-green-800 text-sm">
                                    {React.Children.map(children, child => {
                                      if (React.isValidElement(child) && typeof (child.props as any).children === 'string') {
                                        return (child.props as any).children.replace('[GOOD]', '');
                                      }
                                      return child;
                                    })}
                                  </div>
                                </div>
                              );
                            }
                            if (text.includes('[BAD]')) {
                              return (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4 rounded-r-xl">
                                  <div className="flex items-center gap-2 mb-1">
                                    <AlertCircle size={16} className="text-red-600" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-red-700">Kami (Improvement)</span>
                                  </div>
                                  <div className="text-red-800 text-sm">
                                    {React.Children.map(children, child => {
                                      if (React.isValidElement(child) && typeof (child.props as any).children === 'string') {
                                        return (child.props as any).children.replace('[BAD]', '');
                                      }
                                      return child;
                                    })}
                                  </div>
                                </div>
                              );
                            }
                          }
                          return <blockquote className="border-l-4 border-stone-200 pl-4 italic my-4">{children}</blockquote>;
                        }
                      }}
                    >
                      {evaluation}
                    </Markdown>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-12 h-full flex flex-col items-center justify-center text-center text-stone-400 border-dashed border-2"
              >
                <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-6">
                  <BookOpen size={32} />
                </div>
                <h3 className="text-lg font-bold text-stone-600 mb-2">Ready for Evaluation</h3>
                <p className="text-sm max-w-xs mx-auto">
                  Submit your answer (typed or photo) to receive UPSC-standard marks, feedback, and a model answer.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
