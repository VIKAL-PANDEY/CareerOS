import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { Opportunity } from "../types";
import { 
  Search, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Bookmark, 
  Sparkles, 
  ArrowRight,
  Filter,
  Loader2,
  Calendar,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const OpportunityHub: React.FC = () => {
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'internship' | 'job' | 'hackathon' | 'scholarship'>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);

  useEffect(() => {
    loadOpportunities();
  }, []);

  const loadOpportunities = async () => {
    try {
      setLoading(true);
      // Fetch default list from backend
      const data = await api.getProfile();
      
      // Load current simulated matching opportunities from Express
      const res = await fetch("/api/profile");
      const currentProfile = await res.json();
      
      // Dynamic calculations based on score
      const list: Opportunity[] = [
        {
          id: "opp_1",
          title: "Generative AI Engineering Intern",
          company: "Scale AI",
          type: "internship",
          location: "San Francisco, CA (Hybrid)",
          deadline: "2026-09-15",
          matchScore: currentProfile.employabilityScore ? Math.min(99, currentProfile.employabilityScore + 12) : 89,
          bestMatchReason: "Your experience with React frontend + Gemini API integration perfectly aligns with their internal tooling unit requests.",
          applicationTips: ["Highlight your AI Flashcard project in detail.", "Emphasize your 3.82 CS GPA.", "Explain your experience managing large context sizes."]
        },
        {
          id: "opp_2",
          title: "Junior Software Engineer (Cloud Core)",
          company: "HashiCorp",
          type: "job",
          location: "Remote (USA)",
          deadline: "2026-08-30",
          matchScore: 74,
          bestMatchReason: "Matches your React and TypeScript engineering stack, though they prefer stronger knowledge of Docker and infrastructure-as-code.",
          applicationTips: ["Draw emphasis to your DevConnect forum platform backend setup.", "Review fundamental Terraform concepts before applying."]
        },
        {
          id: "opp_3",
          title: "Global Generative AI Hackathon 2026",
          company: "Google Cloud",
          type: "hackathon",
          location: "Online",
          deadline: "2026-08-10",
          matchScore: 95,
          bestMatchReason: "An ideal arena to build out your recommended GCP-deployed FastAPI agent. High focus on Gemini model integrations.",
          applicationTips: ["Form a team with a strong python backend engineer.", "Utilize Gemini-3.5-flash for lightning fast conversational latency."]
        },
        {
          id: "opp_4",
          title: "AI Pioneers Scholarship 2026",
          company: "NVIDIA Foundation",
          type: "scholarship",
          location: "Global",
          deadline: "2026-10-01",
          matchScore: 85,
          bestMatchReason: "Honors high-achieving Computer Science juniors demonstrating practical projects in deep learning or cognitive applications.",
          applicationTips: ["Submit a stellar portfolio link via CareerOS.", "Attach academic recommendation letters emphasizing CS GPA."]
        }
      ];

      setOpps(list);
      if (list.length > 0) {
        setSelectedOpp(list[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleBookmark = (id: string) => {
    setOpps(prev => prev.map(o => {
      if (o.id === id) {
        const updated = { ...o, isBookmarked: !o.isBookmarked };
        if (selectedOpp && selectedOpp.id === id) {
          setSelectedOpp(updated);
        }
        return updated;
      }
      return o;
    }));
  };

  const filteredOpps = opps.filter(o => {
    const matchesFilter = activeFilter === 'all' || o.type === activeFilter;
    const matchesSearch = o.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          o.company.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-1">
      {/* Sidebar filter list */}
      <div className="lg:col-span-5 space-y-4">
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies or titles..."
              className="w-full bg-white dark:bg-slate-900/90 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs pl-10 pr-4 py-3 border border-slate-100 dark:border-slate-800/80 rounded-xl focus:outline-none"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex gap-1.5 flex-wrap">
            {['all', 'internship', 'job', 'hackathon', 'scholarship'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter as any)}
                className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border cursor-pointer transition-all ${
                  activeFilter === filter 
                    ? "bg-indigo-600 dark:bg-indigo-500 text-white border-indigo-600" 
                    : "bg-white dark:bg-slate-900/50 border-slate-100 dark:border-slate-800/60 text-slate-500 hover:bg-slate-50"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOpps.map((opp) => {
              const isSelected = selectedOpp?.id === opp.id;
              return (
                <div
                  key={opp.id}
                  onClick={() => setSelectedOpp(opp)}
                  className={`p-4 rounded-xl cursor-pointer border transition-all ${
                    isSelected 
                      ? "bg-white dark:bg-slate-900/90 border-indigo-500 shadow-md dark:shadow-indigo-500/5 scale-[1.01]" 
                      : "bg-slate-50 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800/80 hover:bg-slate-100/50"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-semibold text-sm text-slate-800 dark:text-slate-200">{opp.title}</h3>
                        <span className={`text-[8px] uppercase font-bold px-1.5 py-0.5 rounded ${
                          opp.type === "internship" 
                            ? "bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400" 
                            : opp.type === "job"
                            ? "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400"
                            : "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400"
                        }`}>
                          {opp.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-semibold">{opp.company}</p>
                    </div>

                    <button
                      onClick={(e) => { e.stopPropagation(); handleToggleBookmark(opp.id); }}
                      className="text-slate-300 hover:text-indigo-500 transition-colors p-1 cursor-pointer"
                    >
                      <Bookmark className={`w-4 h-4 ${opp.isBookmarked ? "fill-indigo-500 text-indigo-500" : ""}`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/40">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {opp.location}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-indigo-500 dark:text-indigo-400">
                      Match: {opp.matchScore}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Panel: Details & Gemini Analysis */}
      <div className="lg:col-span-7">
        {selectedOpp ? (
          <div className="bg-white dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800/50">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">{selectedOpp.title}</h3>
                  <span className="bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300 text-[9px] font-bold px-2 py-0.5 rounded uppercase">
                    MATCHING
                  </span>
                </div>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold">{selectedOpp.company} — {selectedOpp.location}</p>
              </div>

              <span className="text-3xl font-display font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                {selectedOpp.matchScore}%
              </span>
            </div>

            {/* Quick specifications */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-xl space-y-1">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Application Deadline</span>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" /> {selectedOpp.deadline}
                </p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-xl space-y-1">
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Suitability Grading</span>
                <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Tier-1 Highly Compatible
                </p>
              </div>
            </div>

            {/* Gemini Matching Verdict */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-500" /> Gemini Matching Verdict
              </h4>
              <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/50 dark:border-indigo-900/40 rounded-xl">
                <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {selectedOpp.bestMatchReason}
                </p>
              </div>
            </div>

            {/* Application Tips */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">AI Tailored Application Tips</h4>
              <div className="space-y-2">
                {selectedOpp.applicationTips.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    <span className="w-5 h-5 rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="pt-0.5">{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Apply Button */}
            <button
              onClick={() => { alert(`Setting up custom Notion application tracker via ViaSocket... Application logs updated!`); }}
              className="w-full bg-indigo-600 hover:bg-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white text-xs font-semibold py-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-indigo-500/10"
            >
              Apply via CareerOS (Automates Sheets & notion Sync) <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="h-96 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <AlertCircle className="w-12 h-12 text-slate-300 mb-3 animate-pulse" />
            <h3 className="font-display font-semibold text-slate-800 dark:text-slate-200">No Opportunity Selected</h3>
            <p className="text-xs text-slate-400">Select an internship or hackathon to analyze suitability tips.</p>
          </div>
        )}
      </div>
    </div>
  );
};

