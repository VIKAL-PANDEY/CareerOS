import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { UserProfile, Project, Certificate, EmployabilityReport } from "../types";
import { 
  Sparkles, 
  Trash2, 
  Plus, 
  Globe, 
  Eye, 
  CheckCircle2, 
  Sliders, 
  Loader2, 
  FolderGit2, 
  Award, 
  ExternalLink,
  Github,
  Award as AwardIcon,
  HelpCircle,
  TrendingUp,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const PortfolioBuilder: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  
  // AI report state
  const [report, setReport] = useState<EmployabilityReport | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Modal / Add Item states
  const [showPublicModal, setShowPublicModal] = useState(false);
  const [addingProject, setAddingProject] = useState(false);
  const [addingCert, setAddingCert] = useState(false);

  // New item inputs
  const [newProj, setNewProj] = useState({ title: "", description: "", technologies: "", githubUrl: "", liveUrl: "" });
  const [newCert, setNewCert] = useState({ title: "", issuer: "", date: "", verificationUrl: "" });

  useEffect(() => {
    loadPortfolioData();
  }, []);

  const loadPortfolioData = async () => {
    try {
      setLoading(true);
      const prof = await api.getProfile();
      const projs = await api.getProjects();
      const certificates = await api.getCertificates();
      
      setProfile(prof);
      setProjects(projs);
      setCerts(certificates);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTheme = async (theme: 'slate' | 'emerald' | 'indigo' | 'violet' | 'amber') => {
    if (!profile) return;
    try {
      const updated = { ...profile, portfolioTheme: theme };
      setProfile(updated);
      await api.updateProfile({ portfolioTheme: theme });
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateSlug = async (slug: string) => {
    if (!profile) return;
    try {
      const updated = { ...profile, portfolioCustomSlug: slug };
      setProfile(updated);
      await api.updateProfile({ portfolioCustomSlug: slug });
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProj.title || !newProj.description) return;
    try {
      const techArray = newProj.technologies.split(",").map(t => t.trim()).filter(Boolean);
      const res = await api.saveProject({
        title: newProj.title,
        description: newProj.description,
        technologies: techArray,
        githubUrl: newProj.githubUrl,
        liveUrl: newProj.liveUrl
      });
      setProjects(res.projects);
      setAddingProject(false);
      setNewProj({ title: "", description: "", technologies: "", githubUrl: "", liveUrl: "" });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      const res = await api.deleteProject(id);
      setProjects(res.projects);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.title || !newCert.issuer) return;
    try {
      const res = await api.saveCertificate(newCert);
      setCerts(res.certificates);
      setAddingCert(false);
      setNewCert({ title: "", issuer: "", date: "", verificationUrl: "" });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCert = async (id: string) => {
    try {
      const res = await api.deleteCertificate(id);
      setCerts(res.certificates);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAnalyzePortfolio = async () => {
    try {
      setAnalyzing(true);
      const reportData = await api.analyzeEmployability();
      setReport(reportData);
      
      // Sync local profile score
      if (profile) {
        setProfile({ ...profile, employabilityScore: reportData.score });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  const getThemeClass = (themeName?: string) => {
    switch (themeName) {
      case "emerald": return "from-emerald-900 to-slate-950 text-emerald-400 border-emerald-500/20";
      case "indigo": return "from-indigo-950 to-slate-950 text-indigo-400 border-indigo-500/20";
      case "violet": return "from-violet-950 to-slate-950 text-violet-400 border-violet-500/20";
      case "amber": return "from-amber-950 to-slate-950 text-amber-400 border-amber-500/20";
      default: return "from-slate-900 to-slate-950 text-slate-400 border-slate-700/20";
    }
  };

  if (loading || !profile) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-1">
      {/* Left Column: Editor Control Panel */}
      <div className="lg:col-span-8 space-y-6">
        {/* Custom Slug & Themes */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm space-y-4">
          <div>
            <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white">Portfolio Public Domain</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Design your personalized public domain slug and UI style template</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Custom Profile Slug</label>
              <div className="flex">
                <span className="bg-slate-100 dark:bg-slate-950 border border-r-0 border-slate-100 dark:border-slate-850 px-3 py-2.5 rounded-l-xl text-xs text-slate-400">
                  career.os/p/
                </span>
                <input
                  type="text"
                  value={profile.portfolioCustomSlug || ""}
                  onChange={(e) => handleUpdateSlug(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-100 text-xs px-3 py-2.5 border border-slate-100 dark:border-slate-850 rounded-r-xl focus:outline-none"
                  placeholder="slug-name"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Theme Blueprint</label>
              <div className="flex gap-2 pt-1">
                {(['slate', 'emerald', 'indigo', 'violet', 'amber'] as const).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => handleUpdateTheme(theme)}
                    className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-all ${
                      profile.portfolioTheme === theme ? "border-indigo-500 scale-110 shadow-sm" : "border-transparent"
                    } ${
                      theme === 'slate' ? "bg-slate-600" :
                      theme === 'emerald' ? "bg-emerald-500" :
                      theme === 'indigo' ? "bg-indigo-500" :
                      theme === 'violet' ? "bg-violet-500" : "bg-amber-500"
                    }`}
                    title={`${theme} theme`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setShowPublicModal(true)}
              className="glow-btn bg-slate-900 hover:bg-slate-850 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white text-xs font-semibold px-4.5 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <Eye className="w-4 h-4" /> Live Public Portfolio Website
            </button>
          </div>
        </div>

        {/* Projects Registry */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <FolderGit2 className="w-4.5 h-4.5 text-indigo-500" /> Custom Project Registry
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Verified codebases and deploy records linked to recruiters telemetry</p>
            </div>
            
            <button
              onClick={() => setAddingProject(!addingProject)}
              className="p-1.5 rounded-lg border border-slate-100 dark:border-slate-850 hover:bg-slate-50 text-indigo-600 dark:text-indigo-400 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <AnimatePresence>
            {addingProject && (
              <motion.form 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleAddProject} 
                className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-xl space-y-3"
              >
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Project Title"
                    value={newProj.title}
                    onChange={(e) => setNewProj({ ...newProj, title: e.target.value })}
                    className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs px-3 py-2 border border-slate-100 dark:border-slate-850 rounded-lg focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Technologies (comma separated)"
                    value={newProj.technologies}
                    onChange={(e) => setNewProj({ ...newProj, technologies: e.target.value })}
                    className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs px-3 py-2 border border-slate-100 dark:border-slate-850 rounded-lg focus:outline-none"
                  />
                </div>
                <textarea
                  required
                  placeholder="Short, crisp description of accomplishments..."
                  value={newProj.description}
                  onChange={(e) => setNewProj({ ...newProj, description: e.target.value })}
                  className="w-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs p-3 border border-slate-100 dark:border-slate-850 rounded-lg focus:outline-none"
                  rows={3}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="url"
                    placeholder="GitHub Repo URL (Optional)"
                    value={newProj.githubUrl}
                    onChange={(e) => setNewProj({ ...newProj, githubUrl: e.target.value })}
                    className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs px-3 py-2 border border-slate-100 dark:border-slate-850 rounded-lg focus:outline-none"
                  />
                  <input
                    type="url"
                    placeholder="Active Deployment URL (Optional)"
                    value={newProj.liveUrl}
                    onChange={(e) => setNewProj({ ...newProj, liveUrl: e.target.value })}
                    className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs px-3 py-2 border border-slate-100 dark:border-slate-850 rounded-lg focus:outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button type="button" onClick={() => setAddingProject(false)} className="text-xs text-slate-400 font-semibold px-3 py-1.5 cursor-pointer">Cancel</button>
                  <button type="submit" className="bg-indigo-600 text-white text-xs font-semibold px-4 py-1.5 rounded-lg cursor-pointer">Register Project</button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 rounded-xl flex items-start justify-between">
                <div className="space-y-1.5 max-w-[90%]">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{proj.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{proj.description}</p>
                  
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {proj.technologies.map((t, idx) => (
                        <span key={idx} className="bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-[9px] font-semibold px-2 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {proj.recruiterReview && (
                    <div className="text-[10px] bg-slate-100 dark:bg-slate-950 p-2.5 rounded border-l-2 border-indigo-500 text-slate-500 dark:text-slate-400 font-medium">
                      {proj.recruiterReview}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteProject(proj.id)}
                  className="text-slate-300 hover:text-red-500 transition-colors cursor-pointer p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Award className="w-4.5 h-4.5 text-indigo-500" /> Academic & Tech Certifications
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Verifiable credentials and professional certifications</p>
            </div>
            
            <button
              onClick={() => setAddingCert(!addingCert)}
              className="p-1.5 rounded-lg border border-slate-100 dark:border-slate-850 hover:bg-slate-50 text-indigo-600 dark:text-indigo-400 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <AnimatePresence>
            {addingCert && (
              <motion.form 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleAddCert} 
                className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-xl space-y-3"
              >
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Credential Title"
                    value={newCert.title}
                    onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                    className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs px-3 py-2 border border-slate-100 dark:border-slate-850 rounded-lg focus:outline-none"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Issuer Institution"
                    value={newCert.issuer}
                    onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                    className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs px-3 py-2 border border-slate-100 dark:border-slate-850 rounded-lg focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="date"
                    value={newCert.date}
                    onChange={(e) => setNewCert({ ...newCert, date: e.target.value })}
                    className="bg-white dark:bg-slate-900 text-slate-850 dark:text-slate-100 text-xs px-3 py-2 border border-slate-100 dark:border-slate-850 rounded-lg focus:outline-none"
                  />
                  <input
                    type="url"
                    placeholder="Verification Link (Optional)"
                    value={newCert.verificationUrl}
                    onChange={(e) => setNewCert({ ...newCert, verificationUrl: e.target.value })}
                    className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-xs px-3 py-2 border border-slate-100 dark:border-slate-850 rounded-lg focus:outline-none"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button type="button" onClick={() => setAddingCert(false)} className="text-xs text-slate-400 font-semibold px-3 py-1.5 cursor-pointer">Cancel</button>
                  <button type="submit" className="bg-indigo-600 text-white text-xs font-semibold px-4 py-1.5 rounded-lg cursor-pointer">Register Cert</button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="space-y-3">
            {certs.map((cert) => (
              <div key={cert.id} className="p-3 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{cert.title}</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">{cert.issuer} — Issued {cert.date}</p>
                </div>

                <div className="flex items-center gap-2">
                  {cert.verificationUrl && (
                    <a href={cert.verificationUrl} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-500 p-1">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                  <button
                    onClick={() => handleDeleteCert(cert.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors cursor-pointer p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: AI Portfolio Auditor Report */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-white dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm space-y-5">
          <div className="space-y-1">
            <h3 className="text-xs uppercase font-bold text-slate-400 tracking-wider">AI Portfolio Audit</h3>
            <p className="text-xs text-slate-400 leading-normal">
              Gemini will verify your projects against real recruiter checklist standards.
            </p>
          </div>

          <button
            onClick={handleAnalyzePortfolio}
            disabled={analyzing}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white text-xs font-semibold py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            {analyzing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Auditing Portfolio...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" /> Audit Portfolio website
              </>
            )}
          </button>

          {/* AI Auditor Feedback panel */}
          {report ? (
            <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-850/60">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overall Score</span>
                <span className="text-2xl font-display font-bold text-indigo-600 dark:text-indigo-400">{report.score}%</span>
              </div>

              {/* Strengths */}
              <div className="space-y-1.5">
                <h5 className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Key Strengths</h5>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {report.strengths.slice(0, 2).map((s, idx) => (
                    <li key={idx}>• {s}</li>
                  ))}
                </ul>
              </div>

              {/* Recruiter feedback paragraph */}
              <div className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-xl space-y-1">
                <h5 className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Recruiter Outlook</h5>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium italic">
                  "{report.recruiterPerspective}"
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 dark:bg-slate-950/35 border border-slate-100 dark:border-slate-850 rounded-xl text-center text-xs text-slate-400">
              Awaiting portfolio analysis... Click "Audit Portfolio" to invoke Gemini.
            </div>
          )}
        </div>
      </div>

      {/* Live Public Portfolio Preview Modal */}
      <AnimatePresence>
        {showPublicModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl max-h-[85vh] bg-slate-950 text-slate-200 border border-slate-800 rounded-2xl p-6 overflow-y-auto space-y-8"
            >
              <button 
                onClick={() => setShowPublicModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Custom Theme visual banner */}
              <div className={`p-8 rounded-xl bg-gradient-to-r relative overflow-hidden border ${getThemeClass(profile.portfolioTheme)}`}>
                <div className="relative z-10 space-y-2">
                  <span className="bg-slate-900/40 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border border-white/5">
                    Portfolio Live: career.os/p/{profile.portfolioCustomSlug || "alex-rivera"}
                  </span>
                  <h2 className="text-2xl font-display font-bold text-white tracking-tight">{profile.name}</h2>
                  <p className="text-xs font-semibold uppercase tracking-wider">{profile.targetJob} Scholar</p>
                </div>
              </div>

              {/* Main Content Layout Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-2 text-left">
                {/* Details Column */}
                <div className="md:col-span-8 space-y-6">
                  {/* Summary */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 pb-1">Professional Profile</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      A motivated and rigorous Computer Science student specializing in building AI solutions, RAG pipelines, and full-stack React dashboards. Committed to writing optimal algorithms and deploying reliable codebases.
                    </p>
                  </div>

                  {/* Registered Projects */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 pb-1">Portfolio Projects</h4>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {projects.map((proj) => (
                        <div key={proj.id} className="p-4 bg-slate-900/40 border border-slate-800/60 rounded-xl space-y-3">
                          <div className="flex items-start justify-between">
                            <h5 className="text-xs font-bold text-white">{proj.title}</h5>
                            <div className="flex gap-2 text-slate-400">
                              {proj.githubUrl && <a href={proj.githubUrl} target="_blank" rel="noreferrer"><Github className="w-4 h-4 hover:text-white" /></a>}
                              {proj.liveUrl && <a href={proj.liveUrl} target="_blank" rel="noreferrer"><ExternalLink className="w-4 h-4 hover:text-white" /></a>}
                            </div>
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed">{proj.description}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {proj.technologies.map((t, idx) => (
                              <span key={idx} className="bg-slate-950 text-slate-400 text-[9px] font-semibold px-2 py-0.5 rounded border border-slate-850">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar details */}
                <div className="md:col-span-4 space-y-6">
                  {/* Verified Skills */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 pb-1">Verified Skills</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.skills.map((s, idx) => (
                        <span key={idx} className="bg-slate-900/60 text-slate-300 text-[10px] font-semibold px-2.5 py-1 rounded border border-slate-800">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Verified Credentials */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 pb-1">Credentials</h4>
                    <div className="space-y-2">
                      {certs.map((cert) => (
                        <div key={cert.id} className="p-2.5 bg-slate-900/30 border border-slate-800/40 rounded-lg space-y-1">
                          <h5 className="text-[11px] font-semibold text-white leading-tight">{cert.title}</h5>
                          <p className="text-[10px] text-slate-400">{cert.issuer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
