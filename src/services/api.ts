import { 
  UserProfile, 
  Project, 
  Certificate, 
  EmployabilityReport, 
  CareerRoadmap, 
  SkillGapAnalysis, 
  ProjectRecommendation, 
  Opportunity, 
  MockQuestion, 
  ChatMessage, 
  AutomationFlow 
} from "../types";

const fetchJson = async (url: string, options?: RequestInit) => {
  const email = localStorage.getItem("student_email") || "";
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      "x-user-email": email,
      ...(options?.headers || {})
    },
    ...options
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error ${response.status}`);
  }
  return response.json();
};

export const api = {
  // Authentication
  login: async (email: string): Promise<{ success: boolean; profile?: UserProfile; error?: string }> => {
    return fetchJson("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email })
    });
  },
  // Config & Secrets
  getConfig: async (): Promise<{ hasGeminiKey: boolean; userEmail: string; appUrl: string }> => {
    return fetchJson("/api/config");
  },

  // Profile
  getProfile: async (): Promise<UserProfile> => {
    return fetchJson("/api/profile");
  },

  updateProfile: async (profile: Partial<UserProfile>): Promise<{ success: boolean; profile: UserProfile }> => {
    return fetchJson("/api/profile", {
      method: "POST",
      body: JSON.stringify(profile)
    });
  },

  // Projects
  getProjects: async (): Promise<Project[]> => {
    return fetchJson("/api/projects");
  },

  saveProject: async (project: Partial<Project>): Promise<{ success: boolean; projects: Project[] }> => {
    return fetchJson("/api/projects", {
      method: "POST",
      body: JSON.stringify(project)
    });
  },

  deleteProject: async (id: string): Promise<{ success: boolean; projects: Project[] }> => {
    return fetchJson(`/api/projects/${id}`, {
      method: "DELETE"
    });
  },

  // Certificates
  getCertificates: async (): Promise<Certificate[]> => {
    return fetchJson("/api/certificates");
  },

  saveCertificate: async (certificate: Partial<Certificate>): Promise<{ success: boolean; certificates: Certificate[] }> => {
    return fetchJson("/api/certificates", {
      method: "POST",
      body: JSON.stringify(certificate)
    });
  },

  deleteCertificate: async (id: string): Promise<{ success: boolean; certificates: Certificate[] }> => {
    return fetchJson(`/api/certificates/${id}`, {
      method: "DELETE"
    });
  },

  // AI Employability Scoring & Audit
  analyzeEmployability: async (): Promise<EmployabilityReport> => {
    return fetchJson("/api/ai/analyze-employability", {
      method: "POST"
    });
  },

  // AI Career Guidance Roadmaps
  generateRoadmap: async (targetJob: string): Promise<CareerRoadmap> => {
    return fetchJson("/api/ai/generate-roadmap", {
      method: "POST",
      body: JSON.stringify({ targetJob })
    });
  },

  // AI Skill Gap Auditor
  analyzeSkillGap: async (targetJob: string): Promise<SkillGapAnalysis> => {
    return fetchJson("/api/ai/skillgap", {
      method: "POST",
      body: JSON.stringify({ targetJob })
    });
  },

  // Project Recommendation Engine
  recommendProjects: async (): Promise<ProjectRecommendation[]> => {
    return fetchJson("/api/ai/recommend-projects", {
      method: "POST"
    });
  },

  // Interview Mock Preparation
  getInterviewQuestions: async (): Promise<MockQuestion[]> => {
    return fetchJson("/api/ai/interview-questions", {
      method: "POST"
    });
  },

  submitInterviewAnswer: async (question: string, answer: string): Promise<{ score: number; feedback: string; suggestedAnswer: string }> => {
    return fetchJson("/api/ai/interview-submit", {
      method: "POST",
      body: JSON.stringify({ question, answer })
    });
  },

  // AI Mentor Chat (Context-Aware)
  sendMentorMessage: async (messages: ChatMessage[]): Promise<ChatMessage> => {
    return fetchJson("/api/ai/mentor-chat", {
      method: "POST",
      body: JSON.stringify({ messages })
    });
  },

  // ViaSocket Automations Simulator
  getAutomations: async (): Promise<AutomationFlow[]> => {
    return fetchJson("/api/automations");
  },

  triggerAutomation: async (id: string): Promise<{ success: boolean; flow: AutomationFlow }> => {
    return fetchJson(`/api/automations/${id}/trigger`, {
      method: "POST"
    });
  },

  updateAutomationStep: async (
    id: string, 
    stepIndex: number, 
    status: 'pending' | 'processing' | 'completed' | 'failed', 
    logLine?: string
  ): Promise<{ success: boolean; flow: AutomationFlow }> => {
    return fetchJson(`/api/automations/${id}/step`, {
      method: "POST",
      body: JSON.stringify({ stepIndex, status, logLine })
    });
  },

  // Recruiter Portal - Search and candidate ranking matching keywords using Gemini
  searchCandidates: async (query: string): Promise<any[]> => {
    return fetchJson("/api/recruiter/search", {
      method: "POST",
      body: JSON.stringify({ query })
    });
  },

  // Mentor Portal - List students and tracking analytics
  getMentorStudents: async (): Promise<any[]> => {
    return fetchJson("/api/mentor/students");
  },

  // ── ViaSocket Integration ────────────────────────────────────────────────

  /** Check whether ViaSocket credentials are configured on the server */
  getViaSocketConfig: async (): Promise<{
    configured: boolean;
    hasSecret: boolean;
    hasOrgId: boolean;
    hasProjectId: boolean;
    embedScriptUrl: string;
  }> => {
    return fetchJson("/api/viasocket/config");
  },

  /** Generate a signed embed JWT for the ViaSocket workflow builder */
  getEmbedToken: async (): Promise<{ success: boolean; embedToken?: string; configured: boolean; error?: string }> => {
    return fetchJson("/api/viasocket/embed-token", { method: "POST" });
  },

  /** Forward an event payload to a real ViaSocket webhook URL */
  triggerViaSocket: async (
    flowId: string,
    webhookUrl: string,
    payload: Record<string, unknown>
  ): Promise<{ success: boolean; status?: number; viaSocketResponse?: string; payload?: unknown; error?: string }> => {
    return fetchJson("/api/viasocket/trigger", {
      method: "POST",
      body: JSON.stringify({ flowId, webhookUrl, payload })
    });
  },

  /** Save a webhook URL for a specific automation flow */
  saveWebhookUrl: async (
    flowId: string,
    webhookUrl: string
  ): Promise<{ success: boolean; flowId: string; webhookUrl: string }> => {
    return fetchJson("/api/viasocket/webhook-url", {
      method: "PATCH",
      body: JSON.stringify({ flowId, webhookUrl })
    });
  }
};

