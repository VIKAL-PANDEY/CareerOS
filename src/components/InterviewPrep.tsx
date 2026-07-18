import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { MockQuestion } from "../types";
import { 
  Brain, 
  Sparkles, 
  Mic, 
  MicOff, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  Send,
  HelpCircle,
  TrendingUp,
  Volume2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const InterviewPrep: React.FC = () => {
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [sessionActive, setSessionActive] = useState(false);
  
  // Audio recording mock states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  
  // Results
  const [feedback, setFeedback] = useState<{ score: number; feedback: string; suggestedAnswer: string } | null>(null);
  const [completedSessions, setCompletedSessions] = useState<{ question: string; score: number }[]>([]);

  const handleStartSession = async () => {
    try {
      setLoading(true);
      setFeedback(null);
      setUserAnswer("");
      setCurrentIndex(0);
      
      const qData = await api.getInterviewQuestions();
      setQuestions(qData);
      setSessionActive(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleMicToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      setUserAnswer(prev => prev + " Actually, in my last project, I utilized TypeScript interfaces and constructed modular state managers using custom React hooks to prevent re-renders, resulting in 24% lower UI latency.");
    } else {
      setIsRecording(true);
      setRecordingSeconds(0);
    }
  };

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return;
    try {
      setSubmitting(true);
      const activeQ = questions[currentIndex];
      
      const res = await api.submitInterviewAnswer(activeQ.question, userAnswer);
      setFeedback(res);
      setCompletedSessions(prev => [...prev, { question: activeQ.question, score: res.score }]);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    setFeedback(null);
    setUserAnswer("");
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setSessionActive(false);
      alert("Fabulous job! You've successfully completed your full AI Mock Interview prep round. Results updated in your mentor feed.");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-1">
      {/* Left Column: Interview Canvas */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-white dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">AI Interview Coach</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Speak or write your response and receive instant analytical grades</p>
            </div>
            
            <span className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5" /> Mic Ready
            </span>
          </div>

          {!sessionActive ? (
            <div className="h-80 flex flex-col items-center justify-center text-center p-6 space-y-4">
              <Brain className="w-12 h-12 text-indigo-500 animate-pulse" />
              <div className="space-y-1">
                <h3 className="font-display font-bold text-slate-800 dark:text-slate-200">Interactive AI Mock Simulator</h3>
                <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                  We generate customized Technical, Behavioral, and HR questions based on your active resume and target career goal.
                </p>
              </div>
              <button
                onClick={handleStartSession}
                disabled={loading}
                className="glow-btn bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white text-xs font-semibold px-6 py-3 rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-500/10 flex items-center gap-1.5"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Start AI Mock Interview
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Active Question Box */}
              {questions.length > 0 && (
                <div className="p-5 bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400">
                      Question {currentIndex + 1} of {questions.length} — {questions[currentIndex].type}
                    </span>
                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                      Expected Keywords match
                    </span>
                  </div>
                  
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white leading-relaxed">
                    {questions[currentIndex].question}
                  </h3>
                </div>
              )}

              {/* Text answer input & Mic simulation */}
              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    rows={6}
                    placeholder="Enter your response here or click the microphone to simulate continuous speech input..."
                    className="w-full text-xs bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 p-4 border border-slate-100 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                  />
                  
                  {isRecording && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full" />
                      REC {recordingSeconds}s
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <button
                    onClick={handleMicToggle}
                    className={`p-3 rounded-xl border flex items-center justify-center gap-1.5 transition-all cursor-pointer text-xs font-semibold ${
                      isRecording 
                        ? "bg-red-500 border-red-500 text-white animate-bounce shadow-md" 
                        : "bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="w-4 h-4 text-white" /> Stop & Insert Transcribe
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 text-indigo-500 animate-pulse" /> Simulate Speech Practice
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleSubmitAnswer}
                    disabled={submitting || !userAnswer.trim()}
                    className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white text-xs font-semibold px-5 py-3 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" /> Grading response...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" /> Submit Response
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Gemini Grading Feedback */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl space-y-4"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/60">
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">AI Recruiter Score</span>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Critique & Improvement Areas</h4>
                      </div>
                      
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-display font-bold text-indigo-600 dark:text-indigo-400">{feedback.score}</span>
                        <span className="text-[11px] text-slate-400">/100</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <h5 className="text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                        <Volume2 className="w-3.5 h-3.5" /> Constructive Critique
                      </h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                        {feedback.feedback}
                      </p>
                    </div>

                    <div className="p-3.5 bg-indigo-50/40 dark:bg-indigo-950/10 border border-indigo-500/5 rounded-xl space-y-1.5 pt-2.5">
                      <h5 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Exemplar Standard Response (STAR)</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">
                        {feedback.suggestedAnswer}
                      </p>
                    </div>

                    <button
                      onClick={handleNextQuestion}
                      className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      Next Question <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Scorecard & Keywords Checklist */}
      <div className="lg:col-span-4 space-y-6">
        {/* Completed Session Stats */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-indigo-500" /> Interview Scorecard
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">Your active performance records from this prep run:</p>

          <div className="space-y-2.5">
            {completedSessions.length === 0 ? (
              <div className="p-4 bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-800 rounded-xl text-center text-[11px] text-slate-400">
                Awaiting first question response...
              </div>
            ) : (
              completedSessions.map((sess, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900">
                  <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
                    {sess.question}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    sess.score >= 80 ? "bg-green-100 text-green-700" : "bg-indigo-100 text-indigo-700"
                  }`}>
                    {sess.score}%
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Dynamic Keywords Expectations checklists */}
        {sessionActive && questions[currentIndex] && (
          <div className="bg-white dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm space-y-4">
            <div>
              <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">Keywords expectations</h3>
              <p className="text-xs text-slate-400">Tech recruiters expect to hear these conceptual terms in your verbal answer:</p>
            </div>

            <div className="space-y-2">
              {questions[currentIndex].expectedKeywords.map((word, idx) => {
                const hitsWord = userAnswer.toLowerCase().includes(word.toLowerCase());
                return (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900">
                    <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300">{word}</span>
                    {hitsWord ? (
                      <span className="text-[9px] uppercase font-bold text-green-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Hit
                      </span>
                    ) : (
                      <span className="text-[9px] uppercase font-bold text-slate-400">Not hit yet</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

