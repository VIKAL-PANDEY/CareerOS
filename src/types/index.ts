/**
 * CareerOS AI - Shared TypeScript Interfaces
 */

export type Role = 'student' | 'mentor' | 'recruiter' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  onboarded: boolean;
  avatarUrl?: string;
  
  // Student specific
  targetJob: string;
  skills: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resumeText?: string;
  resumeFileName?: string;
  atsScore?: number;
  employabilityScore?: number;
  gpa?: number;
  
  // Custom public portfolio options
  portfolioTheme?: 'slate' | 'emerald' | 'indigo' | 'violet' | 'amber';
  portfolioDarkMode?: boolean;
  portfolioCustomSlug?: string;
  
  // Mentorship details
  assignedMentorId?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  recruiterReview?: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  verificationUrl?: string;
}

export interface EmployabilityReport {
  score: number;
  strengths: string[];
  weaknesses: string[];
  improvementAreas: { item: string; priority: 'High' | 'Medium' | 'Low'; action: string }[];
  recruiterPerspective: string;
}

export interface RoadmapMilestone {
  title: string;
  duration: string;
  topics: string[];
  suggestedProjects: string[];
}

export interface CareerRoadmap {
  goal: string;
  milestones: RoadmapMilestone[];
  requiredSkills: string[];
  certifications: string[];
  interviewPrepFocus: string[];
}

export interface SkillGapAnalysis {
  missingSkills: string[];
  weakSkills: string[];
  prerequisites: string[];
  industryTrends: string[];
  learningPriority: { skill: string; priority: 'Immediate' | 'Soon' | 'Secondary'; resource: string }[];
}

export interface ProjectRecommendation {
  id: string;
  title: string;
  description: string;
  skillsAcquired: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  marketDemand: 'High' | 'Medium' | 'Trending';
  implementationTips: string[];
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  type: 'internship' | 'job' | 'hackathon' | 'scholarship' | 'competition' | 'opensource';
  location: string;
  deadline: string;
  matchScore: number;
  bestMatchReason: string;
  applicationTips: string[];
  isBookmarked?: boolean;
}

export interface MockQuestion {
  id: string;
  question: string;
  type: 'HR' | 'Technical' | 'Behavioral';
  expectedKeywords: string[];
}

export interface InterviewSession {
  id: string;
  status: 'idle' | 'recording' | 'submitting' | 'feedback_ready';
  currentQuestionIndex: number;
  questions: MockQuestion[];
  answers: { [questionId: string]: string };
  feedbacks: {
    [questionId: string]: {
      score: number;
      feedback: string;
      suggestedAnswer: string;
    };
  };
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'mentor' | 'system';
  text: string;
  timestamp: string;
}

export type Message = ChatMessage;

export interface Mentor {
  id: string;
  name: string;
  role: string;
  company: string;
  avatarUrl: string;
  bio: string;
  promptGuideline: string;
}

export interface AutomationStep {
  name: string;
  service: 'Gmail' | 'Google Calendar' | 'Notion' | 'WhatsApp' | 'Google Sheets' | 'Slack' | 'System';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  logs: string[];
}

export interface AutomationFlow {
  id: string;
  name: string;
  trigger: string;
  steps: AutomationStep[];
  isTriggered: boolean;
  lastTriggered?: string;
  webhookUrl?: string;
}

