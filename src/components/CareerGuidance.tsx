import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { CareerRoadmap, SkillGapAnalysis, ProjectRecommendation } from "../types";
import { 
  Sparkles, 
  MapPin, 
  Briefcase, 
  Target, 
  ChevronRight, 
  Loader2, 
  Award, 
  TrendingUp, 
  BookOpen, 
  FileCode,
  ShieldAlert,
  Compass,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CareerGuidanceProps {
  onAddProject?: (title: string, desc: string, tech: string[]) => void;
}

export const CareerGuidance: React.FC<CareerGuidanceProps> = ({ onAddProject }) => {
  const [targetJob, setTargetJob] = useState("AI Engineer");
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState<CareerRoadmap | null>(null);
  const [skillGap, setSkillGap] = useState<SkillGapAnalysis | null>(null);
  const [recs, setRecs] = useState<ProjectRecommendation[]>([]);
  const [activeTab, setActiveTab] = useState<'roadmap' | 'skillgap' | 'recs'>('roadmap');

  const jobSuggestions = [
    "AI Engineer",
    "Frontend Developer",
    "Backend Developer",
    "Data Scientist",
    "DevOps Engineer",
    "Cyber Security Engineer"
  ];

  useEffect(() => {
    // Initial fetch of default roadmap
    loadCurrentRoadmaps();
  }, []);

  const loadCurrentRoadmaps = async () => {
    try {
      setLoading(true);
      const profile = await api.getProfile();
      if (profile.targetJob) {
        setTargetJob(profile.targetJob);
      }
      
      const roadmapData = await api.generateRoadmap(profile.targetJob || "AI Engineer");
      const gapData = await api.analyzeSkillGap(profile.targetJob || "AI Engineer");
      const recsData = await api.recommendProjects();

      setRoadmap(roadmapData);
      setSkillGap(gapData);
      setRecs(recsData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async (jobTitle: string) => {
    try {
      setLoading(true);
      setTargetJob(jobTitle);
      
      // Update profile
      await api.updateProfile({ targetJob: jobTitle });
      
      // Call concurrent AI analysis
      const [roadmapData, gapData, recsData] = await Promise.all([
        api.generateRoadmap(jobTitle),
        api.analyzeSkillGap(jobTitle),
        api.recommendProjects()
      ]);

      setRoadmap(roadmapData);
      setSkillGap(gapData);
      setRecs(recsData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Input and Goal Selection */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm space-y-4">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">AI Career Co-Pilot</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Define your objective and let Gemini construct a structured syllabus & skill gap report</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Compass className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={targetJob}
              onChange={(e) => setTargetJob(e.target.value)}
              placeholder="e.g., Cloud Architect, Full Stack Developer..."
              className="w-full bg-slate-50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-xs pl-10 pr-4 py-3 border border-slate-100 dark:border-slate-850 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={() => handleGenerate(targetJob)}
            disabled={loading}
            className="glow-btn bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white text-xs font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-indigo-500/10 shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Constructing AI Roadmaps...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Roadmaps
              </>
            )}
          </button>
        </div>

        {/* Suggestion Chips */}
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Quick Select:</span>
          {jobSuggestions.map((job) => (
            <button
              key={job}
              onClick={() => handleGenerate(job)}
              disabled={loading}
              className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                targetJob.toLowerCase() === job.toLowerCase()
                  ? "bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                  : "bg-transparent border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-500 dark:text-slate-400"
              }`}
            >
              {job}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex border-b border-slate-100 dark:border-slate-800/80 gap-6">
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider relative cursor-pointer ${
            activeTab === 'roadmap' ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Syllabus Roadmap
          {activeTab === 'roadmap' && (
            <motion.div layoutId="activeTabG" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('skillgap')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider relative cursor-pointer ${
            activeTab === 'skillgap' ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          Skill Gap Audit
          {activeTab === 'skillgap' && (
            <motion.div layoutId="activeTabG" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('recs')}
          className={`pb-3 text-xs font-bold uppercase tracking-wider relative cursor-pointer ${
            activeTab === 'recs' ? "text-indigo-600 dark:text-indigo-400 font-bold" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          AI Project Ideas
          {activeTab === 'recs' && (
            <motion.div layoutId="activeTabG" className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />
          )}
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {loading ? (
          <div className="flex flex-col items-center justify-center p-16 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            <p className="text-xs text-slate-400">Gemini is structuring your career curriculum...</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {/* Roadmap Tab */}
            {activeTab === 'roadmap' && roadmap && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                {/* Milestones Vertical List */}
                <div className="lg:col-span-8 bg-white dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm space-y-6">
                  <div>
                    <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Curriculum Schedule</h3>
                    <p className="text-xs text-slate-400">Structured 12-week preparation milestones leading up to recruiters readiness</p>
                  </div>

                  <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
                    {roadmap.milestones.map((milestone, idx) => (
                      <div key={idx} className="relative">
                        <span className="absolute left-[-21px] flex items-center justify-center w-6 h-6 rounded-full bg-indigo-600 text-white border border-indigo-600 text-[10px] font-bold z-10">
                          {idx + 1}
                        </span>

                        <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 rounded-xl">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-slate-100 dark:border-slate-800/50">
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{milestone.title}</h4>
                            <span className="bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider self-start sm:self-auto">
                              {milestone.duration}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                            {/* Topics */}
                            <div className="space-y-1.5">
                              <h5 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Topics to master</h5>
                              <ul className="space-y-1">
                                {milestone.topics.map((topic, tIdx) => (
                                  <li key={tIdx} className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                                    <ChevronRight className="w-3 h-3 text-indigo-400 shrink-0" /> {topic}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Suggested Projects */}
                            <div className="space-y-1.5">
                              <h5 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Milestone Project</h5>
                              <ul className="space-y-1">
                                {milestone.suggestedProjects.map((proj, pIdx) => (
                                  <li key={pIdx} className="text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                                    <FileCode className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> {proj}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Summary Column */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Key Skills */}
                  <div className="bg-white dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm space-y-4">
                    <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2">
                      <Target className="w-4 h-4 text-indigo-500" /> Must-Have Skillsets
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {roadmap.requiredSkills.map((skill, sIdx) => (
                        <span key={sIdx} className="bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-[10px] font-semibold px-2.5 py-1 rounded border border-slate-100 dark:border-slate-850">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Certifications Focus */}
                  <div className="bg-white dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm space-y-4">
                    <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2">
                      <Award className="w-4 h-4 text-indigo-500" /> Key Certifications
                    </h4>
                    <div className="space-y-2.5">
                      {roadmap.certifications.map((cert, cIdx) => (
                        <div key={cIdx} className="flex items-center gap-2.5">
                          <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                          <span className="text-[11px] text-slate-700 dark:text-slate-300 font-medium leading-tight">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interview Preparation Focus */}
                  <div className="bg-white dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm space-y-4">
                    <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-indigo-500" /> Recruiter Interview focus
                    </h4>
                    <div className="space-y-2 text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
                      {roadmap.interviewPrepFocus.map((focus, fIdx) => (
                        <div key={fIdx} className="p-2 bg-indigo-50/10 dark:bg-indigo-950/10 border border-indigo-500/5 rounded-lg">
                          {focus}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Skill Gap Tab */}
            {activeTab === 'skillgap' && skillGap && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                {/* Main Skill Gap Analysis */}
                <div className="lg:col-span-8 bg-white dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm space-y-6">
                  <div>
                    <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">Skill Gaps Report</h3>
                    <p className="text-xs text-slate-400">Gemini audited your skills index compared to modern {targetJob} expectations</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Missing Skills */}
                    <div className="space-y-3 p-4 bg-red-500/[0.02] border border-red-500/10 rounded-xl">
                      <h4 className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4" /> Missing Stack
                      </h4>
                      <p className="text-[10px] text-slate-400">Technologies or tools required that were not found in your portfolio profile:</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {skillGap.missingSkills.map((s, idx) => (
                          <span key={idx} className="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-[10px] font-semibold px-2 py-0.5 rounded border border-red-100 dark:border-red-900/30">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Weak Skills */}
                    <div className="space-y-3 p-4 bg-amber-500/[0.02] border border-amber-500/10 rounded-xl">
                      <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" /> Improvement Areas
                      </h4>
                      <p className="text-[10px] text-slate-400">Skills you list, but require more production proofing (e.g. advanced features):</p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {skillGap.weakSkills.map((s, idx) => (
                          <span key={idx} className="bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 text-[10px] font-semibold px-2 py-0.5 rounded border border-amber-100 dark:border-amber-900/30">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Prerequisites & Industry Trends */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Core Prerequisites</h4>
                      <ul className="space-y-2">
                        {skillGap.prerequisites.map((p, idx) => (
                          <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full" /> {p}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">Modern Industry Trends</h4>
                      <ul className="space-y-2">
                        {skillGap.industryTrends.map((t, idx) => (
                          <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping shrink-0" /> {t}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Learn Priorities Sidebar */}
                <div className="lg:col-span-4 bg-white dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl shadow-sm space-y-4">
                  <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">Weekly Learning Priority</h3>
                  <p className="text-xs text-slate-400">Gemini's recommended strategy focus order:</p>

                  <div className="space-y-3">
                    {skillGap.learningPriority.map((priority, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-xl space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{priority.skill}</span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            priority.priority === "Immediate" 
                              ? "bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400" 
                              : priority.priority === "Soon" 
                              ? "bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400" 
                              : "bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400"
                          }`}>
                            {priority.priority}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium leading-snug">
                          <span className="font-bold text-indigo-500">Resource:</span> {priority.resource}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* AI Projects Recommended Tab */}
            {activeTab === 'recs' && recs && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <h3 className="font-display font-bold text-base text-slate-900 dark:text-white">AI Portfolio Recommendations</h3>
                    <p className="text-xs text-slate-400">High-yield project proposals dynamically tailored to stand out to recruiters in {targetJob}</p>
                  </div>
                  <span className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold px-3 py-1 rounded">
                    2 Custom Recommendations Deployed
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recs.map((rec) => (
                    <div key={rec.id} className="bg-white dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800/80 p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                            rec.difficulty === "Beginner" 
                              ? "bg-green-100 dark:bg-green-950 text-green-700" 
                              : rec.difficulty === "Intermediate" 
                              ? "bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300" 
                              : "bg-red-100 dark:bg-red-950 text-red-700"
                          }`}>
                            {rec.difficulty}
                          </span>
                          <span className="bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded">
                            {rec.marketDemand} Demand
                          </span>
                        </div>

                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{rec.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{rec.description}</p>

                        {/* Tech tags */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {rec.skillsAcquired.map((skill, idx) => (
                            <span key={idx} className="bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-100 dark:border-slate-900">
                              {skill}
                            </span>
                          ))}
                        </div>

                        {/* Tips */}
                        <div className="space-y-1 pt-2">
                          <h5 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Implementation guidelines</h5>
                          <ul className="space-y-1">
                            {rec.implementationTips.map((tip, idx) => (
                              <li key={idx} className="text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-1.5">
                                <span className="text-indigo-500 font-bold shrink-0">•</span> {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {onAddProject && (
                        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">Save this prompt to project workspace</span>
                          <button
                            onClick={() => onAddProject(rec.title, rec.description, rec.skillsAcquired)}
                            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            Add to My Projects <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
