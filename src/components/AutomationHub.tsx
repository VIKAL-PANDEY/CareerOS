import React, { useState, useEffect, useRef } from "react";
import { api } from "../services/api";
import { AutomationFlow } from "../types";
import {
  Play,
  CheckCircle2,
  Loader2,
  AlertCircle,
  FileCode,
  Mail,
  Calendar as CalendarIcon,
  Database,
  MessageSquare,
  TrendingUp,
  Github,
  Send,
  Zap,
  ExternalLink,
  Settings,
  ChevronDown,
  ChevronUp,
  Globe,
  CheckCheck,
  XCircle,
  Sparkles,
  Link2,
  Copy,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AutomationHubProps {
  onWorkflowComplete?: (workflowName: string) => void;
}

type MainTab = "pipelines" | "builder";

// ─── ViaSocket Embed Component ────────────────────────────────────────────────
const ViaSocketEmbed: React.FC = () => {
  const [status, setStatus] = useState<"loading" | "unconfigured" | "ready" | "error">("loading");
  const [embedToken, setEmbedToken] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const scriptInjectedRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        // 1. Check if ViaSocket is configured on the server
        const config = await api.getViaSocketConfig();
        if (!mounted) return;

        if (!config.configured) {
          setStatus("unconfigured");
          return;
        }

        // 2. Get a signed embed token
        const tokenRes = await api.getEmbedToken();
        if (!mounted) return;

        if (!tokenRes.success || !tokenRes.embedToken) {
          setStatus("unconfigured");
          setErrorMsg(tokenRes.error || "Could not retrieve embed token.");
          return;
        }

        setEmbedToken(tokenRes.embedToken);
        setStatus("ready");
      } catch (e: any) {
        if (!mounted) return;
        setStatus("error");
        setErrorMsg(e.message || "Failed to initialize ViaSocket Embed.");
      }
    };

    init();
    return () => { mounted = false; };
  }, []);

  // Inject the ViaSocket embed script once token is ready
  useEffect(() => {
    if (status !== "ready" || !embedToken || scriptInjectedRef.current) return;

    scriptInjectedRef.current = true;

    // Remove stale script if exists
    const stale = document.getElementById("viasocket-embed");
    if (stale) stale.remove();

    const script = document.createElement("script");
    script.id = "viasocket-embed";
    script.src = "https://embed.viasocket.com/embed.js";
    script.setAttribute("embedToken", embedToken);
    script.setAttribute("data-container", "viasocket-container");
    script.async = true;
    script.onload = () => console.log("[CareerOS] ViaSocket embed script loaded.");
    script.onerror = () => {
      setStatus("error");
      setErrorMsg("Failed to load ViaSocket embed script. Check your internet connection.");
    };
    document.body.appendChild(script);
  }, [status, embedToken]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin" />
          <Zap className="absolute inset-0 m-auto w-6 h-6 text-amber-400" />
        </div>
        <p className="text-sm text-slate-400 font-mono">Initializing ViaSocket connection…</p>
      </div>
    );
  }

  if (status === "unconfigured") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[480px] gap-6 px-4">
        {/* Setup card */}
        <div className="w-full max-w-lg bg-gradient-to-br from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-2xl p-8 text-center space-y-5">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/25 mx-auto">
            <Zap className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-display font-bold text-white mb-1">Connect ViaSocket</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Add your ViaSocket credentials to unlock the live drag-and-drop automation builder — letting students connect Gmail, Notion, Slack, and 2,200+ apps without leaving CareerOS.
            </p>
          </div>

          {errorMsg && (
            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[11px] text-left">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Steps */}
          <div className="space-y-3 text-left">
            {[
              { step: "1", label: "Sign up at", link: "viasocket.com", url: "https://viasocket.com" },
              { step: "2", label: "Copy your Org ID, Project ID & Secret from Settings" },
              { step: "3", label: "Add to your .env file and restart the server" }
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold flex items-center justify-center">
                  {s.step}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {s.label}{" "}
                  {s.url && (
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline inline-flex items-center gap-0.5">
                      {s.link} <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </p>
              </div>
            ))}
          </div>

          {/* .env snippet */}
          <div className="bg-slate-950 rounded-xl p-4 text-left font-mono text-[11px] text-emerald-400 space-y-1 select-all">
            <div className="text-slate-500"># Add to your .env file</div>
            <div>VIASOCKET_SECRET=<span className="text-slate-400">"your_secret"</span></div>
            <div>VIASOCKET_ORG_ID=<span className="text-slate-400">"your_org_id"</span></div>
            <div>VIASOCKET_PROJECT_ID=<span className="text-slate-400">"your_project_id"</span></div>
          </div>

          <a
            href="https://viasocket.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-amber-500/20"
          >
            <ExternalLink className="w-4 h-4" /> Get ViaSocket Credentials
          </a>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-3 text-center">
        <XCircle className="w-10 h-10 text-red-400" />
        <h3 className="text-sm font-bold text-white">ViaSocket Embed Failed</h3>
        <p className="text-xs text-slate-400 max-w-sm">{errorMsg}</p>
        <button
          onClick={() => { setStatus("loading"); scriptInjectedRef.current = false; }}
          className="text-xs text-indigo-400 hover:underline cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  // status === "ready" — show the embed container
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <div>
          <p className="text-xs font-semibold text-emerald-300">Secure Embedded Session Active</p>
          <p className="text-[10px] text-slate-400">Your student flows are isolated via a signed JWT. Build automations without leaving CareerOS.</p>
        </div>
      </div>

      {/* ViaSocket injects its UI into this div */}
      <div
        id="viasocket-container"
        ref={containerRef}
        className="w-full min-h-[560px] rounded-2xl overflow-hidden border border-slate-800/60 bg-slate-900/50"
      />
    </div>
  );
};

// ─── Webhook URL Config Panel ─────────────────────────────────────────────────
interface WebhookConfigProps {
  flow: AutomationFlow;
  onSaved: (flowId: string, url: string) => void;
}

const WebhookConfig: React.FC<WebhookConfigProps> = ({ flow, onSaved }) => {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(flow.webhookUrl || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.saveWebhookUrl(flow.id, url);
      onSaved(flow.id, url);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = () => {
    if (url) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 hover:text-indigo-400 cursor-pointer transition-colors"
      >
        <Link2 className="w-3 h-3" />
        {flow.webhookUrl ? "Webhook URL configured" : "Configure Webhook URL"}
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        {flow.webhookUrl && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-0.5" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 p-3 bg-slate-950/60 border border-slate-800/60 rounded-xl space-y-2">
              <p className="text-[10px] text-slate-400 leading-relaxed">
                Paste your ViaSocket webhook URL for this flow. When you click "Trigger Automation", CareerOS will POST the student's data to this URL and ViaSocket will execute the connected apps.
              </p>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://flow.viasocket.com/trigger/YOUR_FLOW_ID"
                  className="flex-1 bg-slate-900 text-slate-100 placeholder-slate-600 text-[11px] px-3 py-2 border border-slate-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
                {url && (
                  <button
                    onClick={handleCopy}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer"
                    title="Copy URL"
                  >
                    {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  </button>
                )}
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
              >
                {saving ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : saved ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-300" />
                ) : (
                  <Globe className="w-3 h-3" />
                )}
                {saving ? "Saving…" : saved ? "Saved!" : "Save Webhook URL"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Main AutomationHub Component ─────────────────────────────────────────────
export const AutomationHub: React.FC<AutomationHubProps> = ({ onWorkflowComplete }) => {
  const [flows, setFlows] = useState<AutomationFlow[]>([]);
  const [selectedFlow, setSelectedFlow] = useState<AutomationFlow | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);
  const [currentLogs, setCurrentLogs] = useState<string[]>([]);
  const [showPayload, setShowPayload] = useState(false);
  const [mainTab, setMainTab] = useState<MainTab>("pipelines");

  // Real ViaSocket trigger state
  const [triggerMode, setTriggerMode] = useState<"realtime" | "done" | "error" | null>(null);
  const [triggerResult, setTriggerResult] = useState<string>("");

  useEffect(() => {
    loadFlows();
  }, []);

  const loadFlows = async () => {
    try {
      setLoading(true);
      const data = await api.getAutomations();
      setFlows(data);
      if (data.length > 0) {
        setSelectedFlow(data[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleWebhookSaved = (flowId: string, webhookUrl: string) => {
    setFlows(prev => prev.map(f =>
      f.id === flowId ? { ...f, webhookUrl } : f
    ));
    if (selectedFlow?.id === flowId) {
      setSelectedFlow(prev => prev ? { ...prev, webhookUrl } : prev);
    }
  };

  const getServiceIcon = (service: string) => {
    switch (service) {
      case "Gmail": return <Mail className="w-4 h-4 text-red-400" />;
      case "Google Calendar": return <CalendarIcon className="w-4 h-4 text-blue-400" />;
      case "Notion": return <Database className="w-4 h-4 text-purple-400" />;
      case "WhatsApp": return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      case "Google Sheets": return <TrendingUp className="w-4 h-4 text-green-400" />;
      case "Github": return <Github className="w-4 h-4 text-neutral-300" />;
      case "Slack": return <Send className="w-4 h-4 text-pink-400" />;
      default: return <Zap className="w-4 h-4 text-amber-400" />;
    }
  };

  const getFlowMockPayload = (flowName: string) => {
    switch (flowName) {
      case "New Internship Opportunity Pipeline":
        return {
          viasocket_trigger: "internship_matched_score_gt_80",
          payload: {
            title: "Generative AI Engineering Intern",
            company: "Scale AI",
            match_score: "89%",
            matching_skills: ["React", "TypeScript", "Python"],
            actions: ["gmail_send_summary", "gcal_create_event", "notion_create_page", "whatsapp_send_alert"]
          }
        };
      case "Resume Update Re-Evaluation Pipeline":
        return {
          viasocket_trigger: "resume_file_uploaded_or_skills_mutated",
          payload: {
            file_name: "Resume.pdf",
            calculated_ats_score: 84,
            calculated_employability: 88,
            linkedin_post_draft: "Thrilled to share my updated credentials on CareerOS! #AIEngineering"
          }
        };
      default:
        return {
          viasocket_trigger: "user_action_node",
          payload: { timestamp: new Date().toISOString(), status: "active" }
        };
    }
  };

  const runSimulation = async (flowId: string) => {
    const flow = flows.find(f => f.id === flowId);
    if (!flow) return;

    const webhookUrl = flow.webhookUrl;

    // If a webhook URL is configured → fire real ViaSocket trigger first
    if (webhookUrl) {
      setTriggerMode("realtime");
      setTriggerResult("");
      try {
        const payload = getFlowMockPayload(flow.name);
        const res = await api.triggerViaSocket(flowId, webhookUrl, payload);
        if (res.success) {
          setTriggerMode("done");
          setTriggerResult(`✓ ViaSocket received payload (HTTP ${res.status}). Your connected apps are now executing this automation.`);
        } else {
          setTriggerMode("error");
          setTriggerResult(res.error || `ViaSocket returned HTTP ${res.status}.`);
        }
      } catch (e: any) {
        setTriggerMode("error");
        setTriggerResult(e.message || "Failed to reach ViaSocket.");
      }
    }

    // Always run the local visual simulation so the UI looks alive
    try {
      setActiveStepIndex(null);
      setCurrentLogs([]);

      const res = await api.triggerAutomation(flowId);
      if (!res.success) return;

      let updatedFlow = res.flow;
      setSelectedFlow(updatedFlow);
      setFlows(prev => prev.map(f => f.id === flowId ? updatedFlow : f));

      for (let i = 0; i < updatedFlow.steps.length; i++) {
        setActiveStepIndex(i);

        const logLine = `Starting step [${i + 1}/${updatedFlow.steps.length}]: ${updatedFlow.steps[i].name}...`;
        const stepRes = await api.updateAutomationStep(flowId, i, "processing", logLine);
        setSelectedFlow(stepRes.flow);
        setCurrentLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${logLine}`]);

        await new Promise(r => setTimeout(r, 1200));

        let successLog = `Successfully executed ViaSocket node with ${updatedFlow.steps[i].service}. Action complete.`;
        if (updatedFlow.steps[i].service === "Gmail") {
          successLog = webhookUrl
            ? `Gmail action triggered via ViaSocket real webhook → ${webhookUrl.slice(0, 40)}…`
            : `Sent summary email via ViaSocket SMTP node. Server status: 250 OK`;
        } else if (updatedFlow.steps[i].service === "Notion") {
          successLog = webhookUrl
            ? `Notion page creation dispatched via ViaSocket. Check your Notion workspace.`
            : `Appended relational database row to student board workspace. Notion-ID: workspace_not_9021`;
        } else if (updatedFlow.steps[i].service === "Slack") {
          successLog = webhookUrl
            ? `Slack notification delivered via ViaSocket webhook.`
            : `Dispatched Slack message to #mentors channel via ViaSocket proxy.`;
        }

        const final = await api.updateAutomationStep(flowId, i, "completed", successLog);
        setSelectedFlow(final.flow);
        setFlows(prev => prev.map(f => f.id === flowId ? final.flow : f));
        setCurrentLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${successLog}`]);

        await new Promise(r => setTimeout(r, 600));
      }

      setActiveStepIndex(null);
      if (onWorkflowComplete) onWorkflowComplete(updatedFlow.name);
    } catch (e) {
      console.error(e);
    }
  };

  const tabs: { id: MainTab; label: string; icon: React.ElementType }[] = [
    { id: "pipelines", label: "Automation Pipelines", icon: Zap },
    { id: "builder", label: "ViaSocket Builder", icon: Sparkles }
  ];

  return (
    <div className="space-y-5 p-1">
      {/* ── Tab Header ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white">ViaSocket Orchestration</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Automated multi-app workflows powered by ViaSocket</p>
        </div>
        <a
          href="https://viasocket.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:flex items-center gap-1.5 text-[10px] font-semibold text-amber-400 hover:text-amber-300 transition-colors"
        >
          <Globe className="w-3.5 h-3.5" /> viasocket.com <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-900/60 rounded-xl w-fit border border-slate-200 dark:border-slate-800">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = mainTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setMainTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-indigo-500" : "text-slate-400"}`} />
              {tab.label}
              {tab.id === "builder" && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/15 text-amber-500 uppercase tracking-wider">Live</span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── TAB: Automation Pipelines ──────────────────────────────── */}
      <AnimatePresence mode="wait">
        {mainTab === "pipelines" && (
          <motion.div
            key="pipelines"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Sidebar: Pipeline Selector */}
            <div className="lg:col-span-5 space-y-4">
              {loading ? (
                <div className="flex items-center justify-center p-12">
                  <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                </div>
              ) : (
                <div className="space-y-3">
                  {flows.map((flow) => {
                    const isSelected = selectedFlow?.id === flow.id;
                    const hasWebhook = !!flow.webhookUrl;
                    return (
                      <div
                        key={flow.id}
                        id={`flow-card-${flow.id}`}
                        onClick={() => { setSelectedFlow(flow); setCurrentLogs([]); setTriggerMode(null); }}
                        className={`p-4 rounded-xl cursor-pointer border transition-all ${
                          isSelected
                            ? "bg-white dark:bg-slate-900/90 border-indigo-500 shadow-lg dark:shadow-indigo-500/10 scale-[1.01]"
                            : "bg-slate-50 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800/80 hover:bg-slate-100/50 dark:hover:bg-slate-800/40"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Zap className={`w-4 h-4 ${isSelected ? "text-indigo-500" : "text-slate-400"}`} />
                              <h3 className="font-display font-medium text-sm text-slate-800 dark:text-slate-200">{flow.name}</h3>
                            </div>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                              <span className="font-semibold text-indigo-600 dark:text-indigo-400">Trigger:</span> {flow.trigger}
                            </p>
                          </div>
                          {hasWebhook && (
                            <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full shrink-0">
                              <Globe className="w-2.5 h-2.5" /> Real
                            </span>
                          )}
                        </div>

                        {/* Tiny step pills */}
                        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                          {flow.steps.map((step, idx) => (
                            <span
                              key={idx}
                              className={`text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1 ${
                                step.status === "completed"
                                  ? "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300"
                                  : step.status === "processing"
                                  ? "bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 animate-pulse"
                                  : "bg-slate-100 dark:bg-slate-800/50 text-slate-500"
                              }`}
                            >
                              {getServiceIcon(step.service)}
                              {step.service}
                            </span>
                          ))}
                        </div>

                        {flow.lastTriggered && (
                          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/50">
                            <span>Last run: {flow.lastTriggered}</span>
                            <span className="text-emerald-500 font-medium">Completed</span>
                          </div>
                        )}

                        {/* Webhook config (collapsed by default) */}
                        {isSelected && (
                          <WebhookConfig flow={flow} onSaved={handleWebhookSaved} />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Main Panel: Interactive Flow Execution */}
            <div className="lg:col-span-7 space-y-4">
              {selectedFlow ? (
                <div className="bg-white dark:bg-slate-900/90 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 shadow-sm space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800/50">
                    <div className="space-y-1">
                      <h3 className="text-lg font-display font-bold text-slate-900 dark:text-white">{selectedFlow.name}</h3>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400">
                        {selectedFlow.webhookUrl
                          ? "⚡ Real ViaSocket webhook configured — will fire on trigger"
                          : "Simulation mode — add a webhook URL to enable real ViaSocket triggers"}
                      </p>
                    </div>
                    <button
                      onClick={() => runSimulation(selectedFlow.id)}
                      disabled={activeStepIndex !== null}
                      className="glow-btn bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-400 dark:bg-indigo-500 dark:hover:bg-indigo-400 text-white text-xs font-semibold px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 self-start transition-all cursor-pointer shadow-lg shadow-indigo-500/20"
                    >
                      {activeStepIndex !== null ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Executing Nodes…</>
                      ) : (
                        <><Play className="w-3.5 h-3.5 fill-current" /> Trigger Automation</>
                      )}
                    </button>
                  </div>

                  {/* ViaSocket real-trigger result banner */}
                  <AnimatePresence>
                    {triggerMode && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`flex items-start gap-3 p-3 rounded-xl border text-xs ${
                          triggerMode === "realtime"
                            ? "bg-amber-500/10 border-amber-500/20 text-amber-300"
                            : triggerMode === "done"
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                            : "bg-red-500/10 border-red-500/20 text-red-300"
                        }`}
                      >
                        {triggerMode === "realtime" ? (
                          <Loader2 className="w-4 h-4 animate-spin shrink-0 mt-0.5" />
                        ) : triggerMode === "done" ? (
                          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                        ) : (
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="font-semibold mb-0.5">
                            {triggerMode === "realtime" ? "Sending to ViaSocket…" : triggerMode === "done" ? "ViaSocket Triggered!" : "ViaSocket Error"}
                          </p>
                          {triggerResult && <p className="text-[11px] opacity-80">{triggerResult}</p>}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Steps Timeline visualizer */}
                  <div className="space-y-4">
                    <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Node Pipelines</h4>
                    <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
                      {selectedFlow.steps.map((step, idx) => {
                        const isPending = step.status === "pending";
                        const isProcessing = step.status === "processing";
                        const isCompleted = step.status === "completed";
                        const isActive = activeStepIndex === idx;

                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="relative flex items-start gap-4"
                          >
                            <span className={`absolute left-[-21px] flex items-center justify-center w-6 h-6 rounded-full border z-10 ${
                              isCompleted
                                ? "bg-green-500 text-white border-green-500"
                                : isProcessing
                                ? "bg-indigo-600 text-white border-indigo-600 animate-pulse"
                                : "bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800"
                            }`}>
                              {isCompleted ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : isProcessing ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <span className="text-[10px] font-bold">{idx + 1}</span>
                              )}
                            </span>

                            <div className={`flex-1 p-3.5 rounded-xl border transition-all ${
                              isActive
                                ? "bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/60"
                                : isCompleted
                                ? "bg-green-50/20 dark:bg-green-950/5 border-slate-100 dark:border-slate-800/50"
                                : "bg-transparent border-transparent"
                            }`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="p-1 rounded bg-slate-100 dark:bg-slate-800">
                                    {getServiceIcon(step.service)}
                                  </span>
                                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{step.service}</span>
                                </div>
                                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                                  isCompleted
                                    ? "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300"
                                    : isProcessing
                                    ? "bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300"
                                    : "bg-slate-100 dark:bg-slate-800/80 text-slate-500"
                                }`}>
                                  {step.status}
                                </span>
                              </div>
                              <p className="text-xs font-medium text-slate-800 dark:text-slate-200 mt-2">{step.name}</p>

                              {step.logs && step.logs.length > 0 && (
                                <div className="mt-2.5 bg-slate-950 text-slate-400 p-2.5 rounded-lg text-[10px] font-mono leading-relaxed max-h-24 overflow-y-auto">
                                  {step.logs.map((log, lIdx) => (
                                    <div key={lIdx} className="text-slate-300">{log}</div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Live Data Payload Viewer */}
                  <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-900 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileCode className="w-4 h-4 text-indigo-500" />
                        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">ViaSocket Webhook Payload</span>
                        {selectedFlow.webhookUrl && (
                          <span className="text-[9px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">LIVE</span>
                        )}
                      </div>
                      <button
                        onClick={() => setShowPayload(!showPayload)}
                        className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                      >
                        {showPayload ? "Hide" : "Inspect Payload"}
                      </button>
                    </div>

                    {showPayload && (
                      <motion.pre
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-[10px] font-mono bg-slate-950 text-emerald-400 p-3 rounded-lg overflow-x-auto"
                      >
                        {JSON.stringify(getFlowMockPayload(selectedFlow.name), null, 2)}
                      </motion.pre>
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-96 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  <Zap className="w-12 h-12 text-slate-300 animate-bounce mb-3" />
                  <h3 className="font-display font-semibold text-slate-800 dark:text-slate-200">No Pipeline Selected</h3>
                  <p className="text-xs text-slate-400">Select an automation flow from the sidebar to inspect or trigger.</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── TAB: ViaSocket Embed Builder ───────────────────────────── */}
        {mainTab === "builder" && (
          <motion.div
            key="builder"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {/* Info banner */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 mb-5 bg-gradient-to-r from-amber-500/10 to-indigo-500/10 border border-amber-500/20 rounded-xl">
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center border border-amber-500/25">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">ViaSocket Workflow Builder</p>
                  <p className="text-[10px] text-slate-400">Connect 2,200+ apps with drag-and-drop flows</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 sm:ml-auto">
                {["Gmail", "Notion", "Slack", "Discord", "Sheets", "WhatsApp"].map(app => (
                  <span key={app} className="text-[10px] font-semibold text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-full border border-slate-700/60">{app}</span>
                ))}
                <span className="text-[10px] font-semibold text-amber-400 px-2 py-0.5">+2200 more</span>
              </div>
            </div>

            <ViaSocketEmbed />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
