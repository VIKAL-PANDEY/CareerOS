import React, { useState, useEffect } from "react";
import { ThemeProvider, useTheme } from "./components/ThemeContext";
import { api } from "./services/api";
import { UserProfile } from "./types";
import { Dashboard } from "./components/Dashboard";
import { CareerGuidance } from "./components/CareerGuidance";
import { ResumeBuilder } from "./components/ResumeBuilder";
import { OpportunityHub } from "./components/OpportunityHub";
import { InterviewPrep } from "./components/InterviewPrep";
import { PortfolioBuilder } from "./components/PortfolioBuilder";
import { MentorChat } from "./components/MentorChat";
import { AutomationHub } from "./components/AutomationHub";
import { 
  Compass, 
  Map, 
  FileText, 
  Brain, 
  Award, 
  Zap, 
  MessageSquare, 
  LayoutDashboard, 
  Sun, 
  Moon, 
  LogOut, 
  Loader2, 
  TrendingUp, 
  Sparkles, 
  GraduationCap, 
  CheckCircle2, 
  ShieldAlert,
  Sliders,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [triggerRefresh, setTriggerRefresh] = useState(false);
  
  // Auth state
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginError, setLoginError] = useState("");

  // Mobile drawer state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Onboarding form state
  const [onboardingForm, setOnboardingForm] = useState({
    name: "Alex Rivera",
    email: "alex.rivera@university.edu",
    targetJob: "AI Engineer",
    gpa: "3.85",
    skills: "React, TypeScript, Python, PyTorch, SQL"
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const email = localStorage.getItem("student_email");
      if (!email) {
        setAuthenticated(false);
        return;
      }
      const data = await api.getProfile();
      if (data && data.name) {
        setProfile(data);
        setAuthenticated(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setLoginError("");
      const res = await api.login(loginEmail);
      if (res.success && res.profile) {
        localStorage.setItem("student_email", loginEmail.toLowerCase().trim());
        setProfile(res.profile);
        setAuthenticated(true);
        setCurrentView("dashboard");
      } else {
        setLoginError("This email isn't onboarded yet. Please click the 'Register Profile' tab above to build your custom workspace!");
      }
    } catch (err: any) {
      console.error(err);
      setLoginError(err.message || "Authentication failed. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const normalizedEmail = onboardingForm.email.toLowerCase().trim();
      localStorage.setItem("student_email", normalizedEmail);
      
      const skillsArray = onboardingForm.skills.split(",").map(s => s.trim()).filter(Boolean);
      const res = await api.updateProfile({
        name: onboardingForm.name,
        email: normalizedEmail,
        targetJob: onboardingForm.targetJob,
        gpa: parseFloat(onboardingForm.gpa) || 3.5,
        skills: skillsArray,
        employabilityScore: 72, // starting base score
        onboarded: true
      });
      
      if (res.success && res.profile) {
        setProfile(res.profile);
        setAuthenticated(true);
        setCurrentView("dashboard");
      } else {
        throw new Error("Could not initialize student profile.");
      }
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Failed to initialize student profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("student_email");
    setProfile(null);
    setAuthenticated(false);
  };

  const handleAddProjectFromGuidance = async (title: string, desc: string, tech: string[]) => {
    try {
      await api.saveProject({
        title,
        description: desc,
        technologies: tech,
        githubUrl: "https://github.com/alexrivera/project-repo",
        liveUrl: "https://project.career.os"
      });
      alert(`"${title}" has been successfully registered to your Project Workspace!`);
      setTriggerRefresh(prev => !prev);
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-slate-100">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full mb-3"
        />
        <p className="text-xs text-slate-400 font-mono">Initializing CareerOS Core Engine...</p>
      </div>
    );
  }

  // ONBOARDING LOGIN VIEW
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
        {/* Abstract background blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          {/* Mockup Marketing Sidebar */}
          <div className="lg:col-span-5 space-y-6 text-left hidden lg:block">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-ping" />
              <span className="font-mono font-bold text-xs uppercase tracking-wider text-indigo-400">CareerOS AI Workspace</span>
            </div>
            
            <h1 className="text-3xl font-display font-bold tracking-tight text-white leading-tight">
              Your AI Career <span className="text-indigo-400">Operating System</span>.
            </h1>
            
            <p className="text-xs text-slate-400 leading-relaxed">
              Don't just store student certificates. Build an active portfolio that analyzes matching scores, recommends roadmaps, simulates mock recruiter questions, and handles integrations with ViaSocket.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-800/85 rounded-xl">
                <Brain className="w-5 h-5 text-indigo-400" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Gemini LLM Analysis</h4>
                  <p className="text-[10px] text-slate-400">Continuous portfolio audit & score indices.</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-slate-900/50 border border-slate-800/85 rounded-xl">
                <Zap className="w-5 h-5 text-amber-400" />
                <div>
                  <h4 className="text-xs font-bold text-slate-200">ViaSocket Webhooks</h4>
                  <p className="text-[10px] text-slate-400">Auto-post to Discord channels, update Notion sheets.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Onboarding Panel */}
          <div className="lg:col-span-7 bg-slate-900/40 border border-slate-800 p-6 sm:p-8 rounded-3xl backdrop-blur-md shadow-2xl">
            {/* Tabs Selector */}
            <div className="flex border-b border-slate-800 mb-6">
              <button
                type="button"
                onClick={() => setAuthTab("login")}
                className={`flex-1 pb-3 text-sm font-bold tracking-tight border-b-2 transition-all cursor-pointer ${
                  authTab === "login"
                    ? "border-indigo-500 text-white"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Sign In to Dashboard
              </button>
              <button
                type="button"
                onClick={() => setAuthTab("register")}
                className={`flex-1 pb-3 text-sm font-bold tracking-tight border-b-2 transition-all cursor-pointer ${
                  authTab === "register"
                    ? "border-indigo-500 text-white"
                    : "border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                Register Student Profile
              </button>
            </div>

            {authTab === "login" ? (
              <div className="space-y-4 text-left">
                <div className="space-y-1 text-center sm:text-left pb-2">
                  <h2 className="text-xl font-display font-bold text-white tracking-tight">Welcome Back, Student!</h2>
                  <p className="text-xs text-slate-400">Enter your registered email address to access your customized CareerOS workspace</p>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. alex.rivera@university.edu"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 text-xs px-3.5 py-2.5 border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  {loginError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[11px] leading-relaxed">
                      {loginError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="glow-btn w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-indigo-500/15 pt-3.5"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Sign In to Workspace
                  </button>
                </form>

                <div className="text-center pt-4 border-t border-slate-800/40">
                  <p className="text-[10px] text-slate-500">
                    Need an account?{" "}
                    <button
                      type="button"
                      onClick={() => setAuthTab("register")}
                      className="text-indigo-400 hover:underline font-bold bg-transparent border-none cursor-pointer"
                    >
                      Onboard profile here
                    </button>
                  </p>
                </div>
              </div>
            ) : (
              // REGISTER / ONBOARDING VIEW
              <div>
                <div className="space-y-1 text-center sm:text-left pb-4 mb-2">
                  <h2 className="text-xl font-display font-bold text-white tracking-tight">Onboard Student Profile</h2>
                  <p className="text-xs text-slate-400">Configure your target career objectives to initialize specialized workspace</p>
                </div>

                <form onSubmit={handleOnboardingSubmit} className="space-y-4 text-left">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Student Name</label>
                      <input
                        type="text"
                        required
                        value={onboardingForm.name}
                        onChange={(e) => setOnboardingForm({ ...onboardingForm, name: e.target.value })}
                        className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 text-xs px-3.5 py-2.5 border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Email Address</label>
                      <input
                        type="email"
                        required
                        value={onboardingForm.email}
                        onChange={(e) => setOnboardingForm({ ...onboardingForm, email: e.target.value })}
                        className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 text-xs px-3.5 py-2.5 border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Target Career Goal</label>
                      <select
                        value={onboardingForm.targetJob}
                        onChange={(e) => setOnboardingForm({ ...onboardingForm, targetJob: e.target.value })}
                        className="w-full bg-slate-950 text-slate-100 text-xs px-3.5 py-2.5 border border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="AI Engineer">AI Engineer</option>
                        <option value="Frontend Developer">Frontend Developer</option>
                        <option value="Backend Developer">Backend Developer</option>
                        <option value="Data Scientist">Data Scientist</option>
                        <option value="DevOps Engineer">DevOps Engineer</option>
                        <option value="Cyber Security Engineer">Cyber Security Engineer</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Academic GPA (4.0 Scale)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="1.0"
                        max="4.0"
                        required
                        value={onboardingForm.gpa}
                        onChange={(e) => setOnboardingForm({ ...onboardingForm, gpa: e.target.value })}
                        className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 text-xs px-3.5 py-2.5 border border-slate-800 rounded-xl focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Current Skills (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. React, TypeScript, Python"
                      required
                      value={onboardingForm.skills}
                      onChange={(e) => setOnboardingForm({ ...onboardingForm, skills: e.target.value })}
                      className="w-full bg-slate-950 text-slate-100 placeholder-slate-500 text-xs px-3.5 py-2.5 border border-slate-800 rounded-xl focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="glow-btn w-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold py-3 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-indigo-500/15 pt-3.5"
                  >
                    <GraduationCap className="w-4 h-4" /> Initialize CareerOS Workspace
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Sidebar navigation indices
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "roadmaps", label: "Syllabus Roadmap", icon: Map },
    { id: "resumes", label: "ATS Resume Builder", icon: FileText },
    { id: "opportunities", label: "Opportunity Finder", icon: Compass },
    { id: "interview", label: "Mock Interview Coach", icon: Brain },
    { id: "mentors", label: "AI Mentor Chat", icon: MessageSquare },
    { id: "portfolio", label: "AI Portfolio Builder", icon: Award },
    { id: "automations", label: "ViaSocket Automations", icon: Zap },
  ];

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    setIsSidebarOpen(false);
  };

  const renderActiveView = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard onNavigate={handleNavigate} triggerRefresh={triggerRefresh} />;
      case "roadmaps":
        return <CareerGuidance onAddProject={handleAddProjectFromGuidance} />;
      case "resumes":
        return <ResumeBuilder />;
      case "opportunities":
        return <OpportunityHub />;
      case "interview":
        return <InterviewPrep />;
      case "mentors":
        return <MentorChat />;
      case "portfolio":
        return <PortfolioBuilder />;
      case "automations":
        return <AutomationHub />;
      default:
        return <Dashboard onNavigate={handleNavigate} triggerRefresh={triggerRefresh} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#E5E5E5] transition-colors flex p-2 lg:p-4 gap-2 lg:gap-4 h-screen overflow-hidden">
      
      {/* 1. Left Sidebar - Desktop */}
      <aside className="w-64 glass-card hidden lg:flex flex-col justify-between shrink-0 h-full p-5">
        <div className="space-y-6">
          {/* Logo brand */}
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-brand-cyan animate-pulse shadow-[0_0_10px_rgba(0,209,255,0.5)]" />
            <span className="font-display font-bold text-sm tracking-tight text-white uppercase">CareerOS <span className="text-brand-cyan">AI</span></span>
          </div>

          {/* Profile Quick Widget */}
          {profile && (
            <div className="p-3.5 bg-white/5 border border-white/10 rounded-2xl space-y-2.5 text-left">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-cyan to-indigo-600 text-white font-bold text-xs flex items-center justify-center border border-white/10">
                  {profile.name.charAt(0)}
                </span>
                <div className="space-y-0.5 truncate">
                  <h4 className="text-[11px] font-bold text-white truncate">{profile.name}</h4>
                  <p className="text-[9px] text-gray-400 font-semibold truncate">{profile.targetJob}</p>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-[8px] font-bold text-gray-400 uppercase tracking-wider">
                  <span>Score Index</span>
                  <span className="accent-text font-bold">{profile.employabilityScore}%</span>
                </div>
                <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-brand-cyan h-1 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(0,209,255,0.5)]" 
                    style={{ width: `${profile.employabilityScore}%` }} 
                  />
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1.5 text-left">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-xl cursor-pointer transition-all ${
                    isActive 
                      ? "bg-white/10 text-white shadow-sm" 
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-brand-cyan" : "text-gray-400"}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footers controls */}
        <div className="pt-5 border-t border-white/10 space-y-3.5">
          {/* Theme toggler */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold cursor-pointer text-gray-400 hover:text-white transition-colors"
          >
            <span className="flex items-center gap-2">
              {theme === 'dark' ? <Moon className="w-4 h-4 text-brand-cyan" /> : <Sun className="w-4 h-4 text-brand-cyan" />}
              {theme === 'dark' ? "Sophisticated Dark" : "Sophisticated Light"}
            </span>
            <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded uppercase text-white">Alt</span>
          </button>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-xl text-red-400 hover:bg-red-500/10 cursor-pointer transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout Account
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-xs" 
            />
            
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="relative w-64 glass-card p-5 flex flex-col justify-between h-full text-left"
            >
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-brand-cyan animate-pulse shadow-[0_0_10px_rgba(0,209,255,0.5)]" />
                  <span className="font-display font-bold text-sm text-white uppercase">CareerOS <span className="text-brand-cyan">AI</span></span>
                </div>

                <nav className="space-y-1.5 pt-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigate(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-semibold rounded-xl cursor-pointer transition-all ${
                          isActive 
                            ? "bg-white/10 text-white shadow-sm" 
                            : "text-gray-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${isActive ? "text-brand-cyan" : "text-gray-400"}`} />
                        {item.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => { toggleTheme(); setIsSidebarOpen(false); }}
                  className="w-full flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white"
                >
                  <span className="flex items-center gap-2">
                    {theme === 'dark' ? <Moon className="w-4 h-4 text-brand-cyan" /> : <Sun className="w-4 h-4 text-brand-cyan" />}
                    {theme === 'dark' ? "Sophisticated Dark" : "Sophisticated Light"}
                  </span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-xs font-semibold text-red-400 rounded-lg hover:bg-red-500/10"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Main Work Panel Layout */}
      <div className="flex-1 flex flex-col min-w-0 h-full gap-4 overflow-hidden">
        {/* Responsive Header Row */}
        <header className="glass-card p-4 sm:p-5 flex items-center justify-between relative z-10 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-1.5 rounded-lg hover:bg-white/5 lg:hidden cursor-pointer"
            >
              <Menu className="w-5 h-5 text-gray-400 hover:text-white" />
            </button>
            
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">
                System Active : Port 3000
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-[10px] font-mono font-bold text-brand-cyan flex items-center gap-1.5 uppercase">
              <GraduationCap className="w-3.5 h-3.5 text-brand-cyan" /> Goal: {profile?.targetJob}
            </div>
          </div>
        </header>

        {/* Scrollable Viewport Stage */}
        <main className="flex-1 overflow-y-auto p-1 sm:p-2 bg-transparent relative">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                {renderActiveView()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

