import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { UserProfile, Project, Certificate } from "../types";
import { 
  TrendingUp, 
  Award, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  Zap, 
  Sparkles, 
  Brain, 
  PlusCircle, 
  FileText, 
  Users, 
  ArrowUpRight,
  ShieldAlert,
  Sliders,
  LogOut,
  Target
} from "lucide-react";
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip 
} from "recharts";
import { motion } from "motion/react";

interface DashboardProps {
  onNavigate: (view: string) => void;
  triggerRefresh: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate, triggerRefresh }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [triggerRefresh]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const profData = await api.getProfile();
      const projData = await api.getProjects();
      const certData = await api.getCertificates();
      
      setProfile(profData);
      setProjects(projData);
      setCerts(certData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  // Calculate composite metrics
  const resumeScore = profile.atsScore || 65;
  const projectsScore = Math.min(100, 40 + (projects.length * 20));
  const certificationsScore = Math.min(100, 30 + (certs.length * 25));
  const skillsScore = Math.min(100, 35 + (profile.skills.length * 8));
  
  // Custom Recharts Chart Data
  const readinessData = [
    { subject: "Resume ATS", value: resumeScore, fullMark: 100 },
    { subject: "Projects", value: projectsScore, fullMark: 100 },
    { subject: "Certificates", value: certificationsScore, fullMark: 100 },
    { subject: "Skills Base", value: skillsScore, fullMark: 100 },
    { subject: "Interview Ready", value: 65, fullMark: 100 }
  ];

  const skillTimelineData = [
    { name: "Mon", score: 68 },
    { name: "Tue", score: 70 },
    { name: "Wed", score: 70 },
    { name: "Thu", score: 72 },
    { name: "Fri", score: 75 },
    { name: "Sat", score: 75 },
    { name: "Sun", score: 78 }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="relative bg-gradient-to-r from-neutral-950 to-slate-900 p-6 sm:p-8 rounded-2xl overflow-hidden border border-white/10 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,209,255,0.12),transparent_40%)]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Student Account
              </span>
              <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" /> Verified Profile
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight">
              Welcome back, {profile.name}
            </h1>
            <p className="text-sm text-gray-300 leading-relaxed">
              Your target career goal is set to <span className="font-semibold text-brand-cyan">{profile.targetJob}</span>. 
              We analyzed your updated skills and projects; your overall score is currently up by <span className="text-emerald-400 font-bold">+4%</span> this week.
            </p>
          </div>
          <button 
            onClick={() => onNavigate("roadmaps")}
            className="glow-btn bg-brand-cyan text-black hover:bg-opacity-90 text-xs font-semibold px-4.5 py-3 rounded-xl flex items-center justify-center gap-2 transition-all self-start md:self-auto cursor-pointer shadow-lg shadow-brand-cyan/20"
          >
            <Sparkles className="w-4 h-4 text-black" />
            Resume AI Recommendations
          </button>
        </div>
      </div>

      {/* Grid: Big Bento Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric Card: Employability */}
        <div className="glass-card p-5 relative overflow-hidden flex items-center justify-between">
          <div className="space-y-1 relative z-10">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Employability Score</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-display font-bold accent-text">{profile.employabilityScore}%</span>
              <span className="text-[10px] font-bold text-emerald-400 flex items-center">
                <TrendingUp className="w-3 h-3 mr-0.5" /> +1.2%
              </span>
            </div>
            <p className="text-[11px] text-gray-400">Target Grade: A+ (Selective companies)</p>
          </div>
          <div className="p-3 bg-brand-cyan/10 border border-brand-cyan/20 rounded-xl relative z-10">
            <Brain className="w-6 h-6 text-brand-cyan" />
          </div>
          <div className="absolute -right-4 -bottom-4 w-24 h-24 score-gradient rounded-full opacity-10"></div>
        </div>

        {/* Metric Card: Skills */}
        <div className="glass-card p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Tech Skills</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-display font-bold text-white">{profile.skills.length}</span>
              <span className="text-[10px] font-semibold text-gray-500">Target: 12</span>
            </div>
            <p className="text-[11px] text-gray-400 truncate max-w-[150px]">{profile.skills.slice(0, 3).join(", ")}...</p>
          </div>
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
            <Zap className="w-6 h-6 text-indigo-400" />
          </div>
        </div>

        {/* Metric Card: Projects */}
        <div className="glass-card p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Verified Projects</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-display font-bold text-white">{projects.length}</span>
              <span className="text-[10px] font-bold text-emerald-400">100% review</span>
            </div>
            <p className="text-[11px] text-gray-400">AI checked & optimized</p>
          </div>
          <div className="p-3 bg-brand-purple/10 border border-brand-purple/20 rounded-xl">
            <Award className="w-6 h-6 text-brand-purple" />
          </div>
        </div>

        {/* Metric Card: Active Applications */}
        <div className="glass-card p-5 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Upcoming Deadlines</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-display font-bold text-white">4</span>
              <span className="text-[10px] font-bold text-amber-400">2 priority</span>
            </div>
            <p className="text-[11px] text-gray-400">First deadline in 12 days</p>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl">
            <Calendar className="w-6 h-6 text-amber-400" />
          </div>
        </div>
      </div>

      {/* Grid: Charts & Analytics Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visual AI Rating radar chart */}
        <div className="lg:col-span-7 glass-card p-6 space-y-4">
          <div>
            <h3 className="font-display font-bold text-base text-white">AI Employability Profile Rating</h3>
            <p className="text-xs text-gray-400">Continuous Gemini evaluation based on project density and skill indices</p>
          </div>

          <div className="h-64 sm:h-80 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={readinessData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b' }} />
                <Radar
                  name="Alex Rivera"
                  dataKey="value"
                  stroke="#00D1FF"
                  fill="#00D1FF"
                  fillOpacity={0.12}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Mini Roadmaps & Learning Index */}
        <div className="lg:col-span-5 glass-card p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-white">Active Learning Timeline</h3>
              <span className="text-[10px] font-mono font-bold text-brand-cyan bg-brand-cyan/10 border border-brand-cyan/20 px-2 py-0.5 rounded">
                Weekly progress
              </span>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillTimelineData}>
                  <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 10 }} domain={[50, 100]} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'rgba(0, 209, 255, 0.05)' }} contentStyle={{ backgroundColor: '#0c0c0c', borderColor: 'rgba(255,255,255,0.08)', borderRadius: '8px' }} />
                  <Bar dataKey="score" fill="#00D1FF" radius={[4, 4, 0, 0]} barSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2.5 pt-2">
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Recommended Milestones</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-brand-cyan shadow-[0_0_8px_rgba(0,209,255,0.5)]" />
                    <div>
                      <p className="text-xs font-semibold text-white">RAG Semantic Search Pipeline</p>
                      <p className="text-[10px] text-gray-400">Week 5 - 8 learning target</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => onNavigate("roadmaps")}
                    className="text-brand-cyan hover:underline p-1 cursor-pointer"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Quick Actions, AI Insights Feed & Automation Alert */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: Quick Actions */}
        <div className="glass-card p-5 space-y-4">
          <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-brand-cyan" /> Quick Actions
          </h3>
          <div className="grid grid-cols-1 gap-2.5">
            <button 
              onClick={() => onNavigate("resumes")}
              className="flex items-center justify-between p-3 rounded-xl border border-white/10 hover:bg-white/5 text-left cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-white/5">
                  <FileText className="w-4 h-4 text-brand-cyan" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Optimize Resume with AI</h4>
                  <p className="text-[10px] text-gray-400">Increase ATS ranking score</p>
                </div>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
            </button>

            <button 
              onClick={() => onNavigate("interview")}
              className="flex items-center justify-between p-3 rounded-xl border border-white/10 hover:bg-white/5 text-left cursor-pointer transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-white/5">
                  <Brain className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-white">Simulate Mock Interview</h4>
                  <p className="text-[10px] text-gray-400">AI voice and text coaching</p>
                </div>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Column 2: Recent AI Suggestions */}
        <div className="glass-card p-5 space-y-4">
          <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-cyan" /> Active AI Insights
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-brand-cyan/5 border border-brand-cyan/20 rounded-xl space-y-1">
              <span className="text-[9px] uppercase font-bold tracking-wider text-brand-cyan">Resume Strategy</span>
              <p className="text-xs font-medium text-white leading-tight">Quantify your impact bullet points.</p>
              <p className="text-[10px] text-gray-400 leading-normal">
                Rephrase "Created developer tools" to state how many developers used it. That single shift drives double ATS response rates.
              </p>
            </div>
          </div>
        </div>

        {/* Column 3: ViaSocket Automation Highlight */}
        <div className="glass-card p-5 space-y-4">
          <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-purple" /> Active Automations
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="p-2 viasocket-tag rounded-lg shrink-0 mt-0.5">
                <Zap className="w-4 h-4 text-brand-purple" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-white">Internship Scraper Node</h4>
                <p className="text-[10px] text-gray-300 leading-relaxed">
                  Triggers dynamically when opportunities matching &gt;80% are scraped. Automates custom Notion Workspace creation.
                </p>
                <button 
                  onClick={() => onNavigate("automations")}
                  className="text-[10px] font-bold text-brand-cyan hover:underline flex items-center gap-1 cursor-pointer"
                >
                  Configure via ViaSocket <ArrowRight className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

