import React, { useState, useEffect, useRef } from "react";
import { api } from "../services/api";
import { Mentor, Message } from "../types";
import { 
  Send, 
  Sparkles, 
  Loader2, 
  Check, 
  MessageSquare, 
  Plus,
  Users,
  Compass,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const MentorChat: React.FC = () => {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMentors();
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMentors = async () => {
    try {
      setLoading(true);
      // Simulate/load mentors customized with deep prompt guidelines
      const list: Mentor[] = [
        {
          id: "m_1",
          name: "Dr. Aris",
          role: "Academic Coordinator",
          company: "State University AI Lab",
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
          bio: "Specializes in structuring learning schedules, AI academic curriculum alignment, and graduate school research paths.",
          promptGuideline: "You are Dr. Aris, a seasoned AI Academic Coordinator. Give deep, precise syllabus advice, structured textbook recommendations, and timeline goals."
        },
        {
          id: "m_2",
          name: "Sarah Lin",
          role: "Staff Software Engineer",
          company: "Scale AI",
          avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80",
          bio: "Ex-Google Staff Engineer. Expert in production machine learning platforms, LLM evaluation pipelines, and portfolio critiques.",
          promptGuideline: "You are Sarah Lin, a Silicon Valley Staff Software Engineer. Focus on performance optimizations, coding patterns, code review notes, and production architectures."
        },
        {
          id: "m_3",
          name: "Marcus K.",
          role: "Behavioral Recruiter Coach",
          company: "Handshake",
          avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
          bio: "Specialize in behavioral interviews, leadership scenarios, STAR communication models, and recruiter confidence boosters.",
          promptGuideline: "You are Marcus, a high-level Recruiter Coach. Give motivational advice, detailed STAR-method feedback, and confidence-building communication tricks."
        }
      ];
      setMentors(list);
      if (list.length > 0) {
        setSelectedMentor(list[0]);
        // Load initial welcome message
        setMessages([
          {
            id: "wel_1",
            sender: "mentor",
            text: `Greetings! I am Dr. Aris. I am delighted to support your AI preparation roadmap. Ask me any conceptual questions regarding neural network architectures, RAG systems, or structured learning milestones.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMentor = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    // Setup introductory greeting based on their role
    setMessages([
      {
        id: `wel_${mentor.id}`,
        sender: "mentor",
        text: mentor.id === "m_1" 
          ? `Greetings! I am Dr. Aris. I am delighted to support your AI preparation roadmap. Ask me any conceptual questions regarding neural network architectures, RAG systems, or structured learning milestones.`
          : mentor.id === "m_2"
          ? `Hey there! Sarah here. Let's talk about production systems. Need help debugging modular pipelines or designing clean full-stack schemas? Ask away!`
          : `Hello! I'm Marcus. I'm here to ensure you tell your project stories elegantly. Let's practice behavioral STAR bullet points or recruiter follow-ups. What scenario are we tackling?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedMentor) return;

    const userMsg: Message = {
      id: `usr_${Date.now()}`,
      sender: "user",
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setSending(true);

    try {
      // Package full context history + specific System Persona prompt guidance
      const historyContext = messages.map(m => ({
        id: m.id,
        sender: m.sender,
        text: m.text,
        timestamp: m.timestamp
      }));

      const systemGuideline = `${selectedMentor.promptGuideline} Keep responses clear, professional, highly actionable, and around 150 words maximum.`;

      const response = await fetch("/api/ai/mentor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...historyContext, userMsg],
          systemInstruction: systemGuideline
        })
      });

      const data = await response.json();

      const mentorMsg: Message = {
        id: `men_${Date.now()}`,
        sender: "mentor",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, mentorMsg]);
    } catch (e) {
      console.error(e);
      // Fallback
      const fallbackMsg: Message = {
        id: `men_fallback_${Date.now()}`,
        sender: "mentor",
        text: `Fabulous question! When building production machine learning systems, modular pipeline layers are critical. Focus on establishing clear input/output schemas and decoupling ingestion from fine-tuning modules.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-1 h-[78vh]">
      {/* Mentors Selection Panel */}
      <div className="lg:col-span-4 glass-card p-5 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-display font-bold text-white">Active AI Mentors</h2>
            <p className="text-xs text-gray-400 font-medium">Select a specialist persona to align advisory feedback</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center p-12">
              <Loader2 className="w-6 h-6 animate-spin text-brand-cyan" />
            </div>
          ) : (
            <div className="space-y-3">
              {mentors.map((mentor) => {
                const isSelected = selectedMentor?.id === mentor.id;
                return (
                  <div
                    key={mentor.id}
                    onClick={() => handleSelectMentor(mentor)}
                    className={`p-3.5 rounded-xl cursor-pointer border transition-all text-left flex gap-3 ${
                      isSelected 
                        ? "bg-white/10 border-brand-cyan shadow-[0_0_15px_rgba(0,209,255,0.15)]" 
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    <img 
                      src={mentor.avatarUrl} 
                      alt={mentor.name} 
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-white/10 shrink-0" 
                    />
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-white">{mentor.name}</h4>
                      <p className="text-[10px] text-brand-cyan font-semibold">{mentor.role} at {mentor.company}</p>
                      <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed pt-0.5">{mentor.bio}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Conversation Interface */}
      <div className="lg:col-span-8 glass-card flex flex-col justify-between h-full overflow-hidden">
        {selectedMentor && (
          <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <img 
                src={selectedMentor.avatarUrl} 
                alt={selectedMentor.name} 
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover border border-white/10"
              />
              <div>
                <h3 className="text-xs font-bold text-white">{selectedMentor.name}</h3>
                <p className="text-[9px] text-brand-cyan font-semibold uppercase tracking-wider">{selectedMentor.role}</p>
              </div>
            </div>

            <span className="bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Gemini Co-Pilot Live
            </span>
          </div>
        )}

        {/* Message Logs */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 text-left">
          {messages.map((m) => {
            const isUser = m.sender === "user";
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-[80%] ${isUser ? "ml-auto flex-row-reverse" : "mr-auto"}`}
              >
                {!isUser && selectedMentor && (
                  <img 
                    src={selectedMentor.avatarUrl} 
                    alt={selectedMentor.name} 
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover border border-white/10 self-end"
                  />
                )}

                <div className="space-y-1">
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    isUser 
                      ? "bg-brand-cyan text-black rounded-br-none font-semibold shadow-[0_0_12px_rgba(0,209,255,0.25)]" 
                      : "bg-white/5 text-gray-200 rounded-bl-none border border-white/10 font-medium"
                  }`}>
                    {m.text}
                  </div>
                  <p className={`text-[9px] text-gray-500 font-mono ${isUser ? "text-right" : "text-left"}`}>{m.timestamp}</p>
                </div>
              </div>
            );
          })}

          {sending && (
            <div className="flex gap-3 max-w-[80%] mr-auto">
              {selectedMentor && (
                <img 
                  src={selectedMentor.avatarUrl} 
                  alt={selectedMentor.name} 
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover border border-white/10 self-end"
                />
              )}
              <div className="bg-white/5 p-3 rounded-2xl rounded-bl-none border border-white/10 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-cyan" />
                <span className="text-xs text-gray-400">Gemini is formulating response...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Text Form */}
        <form onSubmit={handleSendMessage} className="p-4 bg-white/5 border-t border-white/10 shrink-0 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask your mentor anything..."
            className="flex-1 bg-black/40 text-white placeholder-gray-500 text-xs px-4 py-3 border border-white/10 rounded-xl focus:outline-none focus:border-brand-cyan/40"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || sending}
            className="bg-brand-cyan hover:bg-opacity-90 disabled:bg-gray-700 disabled:text-gray-400 text-black text-xs font-bold p-3 rounded-xl transition-all flex items-center justify-center shrink-0 cursor-pointer shadow-[0_0_12px_rgba(0,209,255,0.2)]"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
