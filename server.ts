import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// File path for persistence
const DATA_STORE_PATH = path.join(process.cwd(), "data-store.json");

// Default initial state
const INITIAL_DATA = {
  profile: {
    id: "stud_101",
    name: "Alex Rivera",
    email: "vpand301@gmail.com",
    role: "student",
    onboarded: true,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
    targetJob: "AI Engineer",
    skills: ["React", "TypeScript", "Python", "JavaScript", "SQL"],
    githubUrl: "https://github.com/alexrivera",
    linkedinUrl: "https://linkedin.com/in/alexrivera",
    portfolioUrl: "alexrivera.career.os",
    resumeText: `ALEX RIVERA
Email: alexrivera@gmail.com | Phone: +1-555-0199
GitHub: github.com/alexrivera | LinkedIn: linkedin.com/in/alexrivera

SUMMARY
Motivated engineering student passionate about building AI-driven solutions and robust web applications. Proficient in React, Python, and TypeScript. Looking for a Summer 2026 AI/Software Engineering internship.

EDUCATION
B.S. in Computer Science | State University (Expected Grad: May 2027)
GPA: 3.82/4.00

PROJECTS
- AI Flashcards Generator: Built a web tool using Node.js and OpenAI API that converts notes into flashcards. Saved users 5+ study hours weekly.
- DevConnect: Created a developer community platform using React and Supabase. Features real-time messaging and project sharing.

SKILLS
Programming: Python, JavaScript, TypeScript, SQL, HTML/CSS
Frameworks: React, Node.js, Express, Tailwind CSS
Tools: Git, VS Code, Postman, Supabase`,
    resumeFileName: "Alex_Rivera_Resume.pdf",
    atsScore: 68,
    employabilityScore: 72,
    portfolioTheme: "slate",
    portfolioDarkMode: true,
    portfolioCustomSlug: "alex-rivera-ai-eng",
    assignedMentorId: "mentor_01"
  },
  projects: [
    {
      id: "proj_1",
      title: "AI Flashcard Generator",
      description: "A full-stack web application that leverages LLMs to generate high-yield study flashcards from uploaded PDFs or raw text notes.",
      technologies: ["React", "Node.js", "Express", "Tailwind CSS"],
      githubUrl: "https://github.com/alexrivera/ai-flashcards",
      liveUrl: "https://ai-flashcards.demo",
      recruiterReview: "Good layout. High commercial potential. Consider adding an offline caching system to increase speed."
    },
    {
      id: "proj_2",
      title: "DevConnect Developer Forum",
      description: "A beautiful, real-time developer community platform with interactive profiles, upvoting, tag filtering, and markdown posts.",
      technologies: ["React", "TypeScript", "Tailwind CSS"],
      githubUrl: "https://github.com/alexrivera/dev-connect",
      liveUrl: "https://devconnect.demo",
      recruiterReview: "Strong React structure. Responsive on mobile. Code could benefit from typescript strict null checks."
    }
  ],
  certificates: [
    {
      id: "cert_1",
      title: "Deep Learning Specialization",
      issuer: "DeepLearning.AI (Coursera)",
      date: "2025-11-12",
      verificationUrl: "https://coursera.org/verify/dl-specialization"
    },
    {
      id: "cert_2",
      title: "React Web Developer Professional Certificate",
      issuer: "Meta (Coursera)",
      date: "2025-05-30",
      verificationUrl: "https://coursera.org/verify/react-meta"
    }
  ],
  employabilityReport: {
    score: 72,
    strengths: [
      "Solid core in modern front-end frameworks (React, TypeScript).",
      "Practical experience building AI-adjacent toolings (Flashcards project).",
      "Excellent GPA and academic pedigree in Computer Science."
    ],
    weaknesses: [
      "Lack of production-grade Cloud architecture (AWS, Docker, CI/CD).",
      "No specialized deep learning frameworks implemented in main projects (TensorFlow, PyTorch).",
      "No internships recorded on resume to show industrial collaboration."
    ],
    improvementAreas: [
      { item: "Deploy a project using Docker & Cloud infrastructure", priority: "High", action: "Containerize the AI Flashcard Generator, set up CI/CD GitHub action, and deploy to AWS or GCP." },
      { item: "Implement PyTorch / PyTorch-Lightning script", priority: "Medium", action: "Add a mini Jupyter notebook repo implementing a transformer from scratch to demonstrate deeper AI fundamentals." },
      { item: "ATS Keywords refinement", priority: "High", action: "Add cloud terms (Docker, REST APIs, CI/CD) and state management libraries (Redux, Zustand) to resume." }
    ],
    recruiterPerspective: "Alex shows high raw aptitude. To stand out for Tier-1 AI Engineering roles, Alex needs to bridge the gap between building toy local scripts and managing scalable cloud pipelines. Adding direct deployment links and system diagrams in their portfolio will double call-back rates."
  },
  careerRoadmap: {
    goal: "AI Engineer",
    milestones: [
      {
        title: "Advanced Machine Learning Fundamentals",
        duration: "Weeks 1 - 4",
        topics: ["Linear Algebra & Calculus", "Supervised/Unsupervised Learning", "Neural Network architectures from scratch", "Feature Engineering"],
        suggestedProjects: ["Linear Regression Engine in NumPy", "MNIST Hand-written Classifier in Raw PyTorch"]
      },
      {
        title: "SaaS LLM Engineering & System Design",
        duration: "Weeks 5 - 8",
        topics: ["Vector Databases (Chroma, Pinecone)", "RAG (Retrieval Augmented Generation) Pipelines", "Prompt Engineering & Evaluation", "API Proxy Security"],
        suggestedProjects: ["Semantic Document Search Engine with Pinecone", "Personal Multi-Agent Coding Assistant"]
      },
      {
        title: "MLOps & Cloud Deployment",
        duration: "Weeks 9 - 12",
        topics: ["Docker containerization", "CI/CD pipelines with GitHub Actions", "Cloud deployment (AWS ECS or GCP Cloud Run)", "API Rate Limiting & Monitoring"],
        suggestedProjects: ["FastAPI Model Service containerized and deployed to GCP with automatic health-checks"]
      }
    ],
    requiredSkills: ["PyTorch", "FastAPI", "Vector DBs (Pinecone)", "Docker", "GCP/AWS", "LangChain/LlamaIndex"],
    certifications: ["AWS Certified Machine Learning - Specialty", "TensorFlow Developer Certificate"],
    interviewPrepFocus: ["Machine Learning system design questions", "Data structures (Trees, Graphs, Dynamic Programming)", "System architectures for low-latency embeddings"]
  },
  skillGapAnalysis: {
    missingSkills: ["PyTorch", "Docker", "Vector DB (Pinecone)", "FastAPI", "AWS/GCP"],
    weakSkills: ["SQL", "TypeScript Systems"],
    prerequisites: ["Linear Algebra", "Python Object Oriented Programming"],
    industryTrends: ["Multi-Agent Orchestration", "Edge Device Quantized Models", "Real-time AI Audio Streaming"],
    learningPriority: [
      { skill: "PyTorch Basics", priority: "Immediate", resource: "Official PyTorch 60-Minute Blitz & DeepLearning.AI ML Specialization" },
      { skill: "Docker Containerization", priority: "Immediate", resource: "Docker Core Essentials (TechWorld with Nana)" },
      { skill: "FastAPI Development", priority: "Soon", resource: "Building APIs with FastAPI - Python Course" }
    ]
  },
  mockOpportunities: [
    {
      id: "opp_1",
      title: "Generative AI Engineering Intern",
      company: "Scale AI",
      type: "internship",
      location: "San Francisco, CA (Hybrid)",
      deadline: "2026-09-15",
      matchScore: 89,
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
  ],
  mentorChatHistory: [
    { id: "msg_1", sender: "system", text: "Welcome to CareerOS AI Mentor. I have reviewed your portfolio, resume, and career goals. Let me know how I can guide you today!", timestamp: "00:30" }
  ],
  automations: [
    {
      id: "auto_1",
      name: "New Internship Opportunity Pipeline",
      trigger: "New internship matches target profile score > 80%",
      isTriggered: false,
      steps: [
        { name: "Scrape Opportunity & Rank", service: "System", status: "pending", logs: [] },
        { name: "Send Rich Gmail Summary", service: "Gmail", status: "pending", logs: [] },
        { name: "Create Google Calendar deadline task", service: "Google Calendar", status: "pending", logs: [] },
        { name: "Generate custom application workspace inside Notion", service: "Notion", status: "pending", logs: [] },
        { name: "Ping student WhatsApp with priority badge", service: "WhatsApp", status: "pending", logs: [] },
        { name: "Update active tracker in Google Sheets", service: "Google Sheets", status: "pending", logs: [] }
      ]
    },
    {
      id: "auto_2",
      name: "Resume Update Re-Evaluation Pipeline",
      trigger: "Resume file or skills updated inside portfolio builder",
      isTriggered: false,
      steps: [
        { name: "Run OCR & ATS parsing engine", service: "System", status: "pending", logs: [] },
        { name: "Call Gemini AI to update Employability Score", service: "System", status: "pending", logs: [] },
        { name: "Ping active mentor on Slack with PDF & Score change", service: "Slack", status: "pending", logs: [] },
        { name: "Draft highly-engaging LinkedIn update post using Gemini", service: "System", status: "pending", logs: [] }
      ]
    },
    {
      id: "auto_3",
      name: "GitHub Repository Auto-Sync Pipeline",
      trigger: "New GitHub repository added or pinned in portfolio",
      isTriggered: false,
      steps: [
        { name: "Fetch repository details & code tree", service: "System", status: "pending", logs: [] },
        { name: "Generate interactive project summary cards", service: "System", status: "pending", logs: [] },
        { name: "Update public Portfolio website", service: "System", status: "pending", logs: [] },
        { name: "Dispatch email update to shortlisted recruiters", service: "Gmail", status: "pending", logs: [] }
      ]
    },
    {
      id: "auto_4",
      name: "Interview Scheduling & Mock Prep Pipeline",
      trigger: "Interview task marked 'Scheduled' in opportunity hub",
      isTriggered: false,
      steps: [
        { name: "Add interview details to Google Calendar", service: "Google Calendar", status: "pending", logs: [] },
        { name: "Generate customized preparation checklist & target terms", service: "System", status: "pending", logs: [] },
        { name: "Deploy dynamic mock interview simulation module", service: "System", status: "pending", logs: [] },
        { name: "Send reminder SMS with checklist link", service: "WhatsApp", status: "pending", logs: [] }
      ]
    }
  ]
};

// Helper to read data
function getData(req?: express.Request) {
  let allData: any = {};
  try {
    if (fs.existsSync(DATA_STORE_PATH)) {
      const content = fs.readFileSync(DATA_STORE_PATH, "utf-8");
      allData = JSON.parse(content);
    } else {
      allData = { users: {} };
    }
  } catch (error) {
    console.error("Error reading data store file:", error);
    allData = { users: {} };
  }

  // Ensure 'users' exists
  if (!allData.users) {
    allData.users = {};
  }

  // Backward compatibility migration:
  // If there's top-level profile/projects/etc, migrate to a user
  if (allData.profile && !allData.users["vpand301@gmail.com"]) {
    allData.users["vpand301@gmail.com"] = {
      profile: allData.profile,
      projects: allData.projects || [],
      certificates: allData.certificates || [],
      employabilityReport: allData.employabilityReport || {},
      careerRoadmap: allData.careerRoadmap || {},
      skillGapAnalysis: allData.skillGapAnalysis || {},
      mockOpportunities: allData.mockOpportunities || [],
      mentorChatHistory: allData.mentorChatHistory || [],
      automations: allData.automations || []
    };
    // Delete old keys to keep store clean
    delete allData.profile;
    delete allData.projects;
    delete allData.certificates;
    delete allData.employabilityReport;
    delete allData.careerRoadmap;
    delete allData.skillGapAnalysis;
    delete allData.mockOpportunities;
    delete allData.mentorChatHistory;
    delete allData.automations;
    
    // Save migrated data
    try {
      fs.writeFileSync(DATA_STORE_PATH, JSON.stringify(allData, null, 2), "utf-8");
    } catch (e) {
      console.error(e);
    }
  }

  // If no req is passed, we return allData (used for global operations or when we want the whole JSON)
  if (!req) {
    return allData;
  }

  // Extract student email
  const emailHeader = req.headers["x-user-email"];
  let email = "vpand301@gmail.com"; // default fallback
  if (emailHeader && typeof emailHeader === "string") {
    email = emailHeader.toLowerCase().trim();
  }

  // If student doesn't exist yet, clone INITIAL_DATA to create them
  if (!allData.users[email]) {
    const newStudent = JSON.parse(JSON.stringify(INITIAL_DATA));
    newStudent.profile.email = email;
    newStudent.profile.id = `stud_${Date.now()}`;
    // Guess name from email
    const namePart = email.split("@")[0];
    newStudent.profile.name = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    newStudent.profile.onboarded = false; // flag so frontend knows they must onboard
    
    allData.users[email] = newStudent;
    
    // Write new user to file immediately
    try {
      fs.writeFileSync(DATA_STORE_PATH, JSON.stringify(allData, null, 2), "utf-8");
    } catch (e) {
      console.error(e);
    }
  }

  return allData.users[email];
}

// Helper to write data
function writeData(data: any, req?: express.Request) {
  try {
    let allData: any = {};
    if (fs.existsSync(DATA_STORE_PATH)) {
      const content = fs.readFileSync(DATA_STORE_PATH, "utf-8");
      allData = JSON.parse(content);
    }
    
    if (!allData.users) {
      allData.users = {};
    }

    if (req) {
      // We are writing a specific student's subset
      const emailHeader = req.headers["x-user-email"];
      let email = "vpand301@gmail.com";
      if (emailHeader && typeof emailHeader === "string") {
        email = emailHeader.toLowerCase().trim();
      }
      allData.users[email] = data;
    } else {
      // We are writing the entire store (legacy fallback or global)
      allData = data;
    }

    fs.writeFileSync(DATA_STORE_PATH, JSON.stringify(allData, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing to data store file:", error);
  }
}

// Lazy Gemini API Client Initializer
let geminiAi: any = null;
function getGemini() {
  if (!geminiAi) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not defined. Using offline high-fidelity mock calculations.");
      return null;
    }
    geminiAi = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return geminiAi;
}

// Ensure database file is initialized on boot
getData();

// ==========================================
// API ENDPOINTS
// ==========================================

// 1. Health & Config status
app.get("/api/config", (req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY;
  res.json({
    hasGeminiKey: hasKey,
    userEmail: process.env.USER_EMAIL || "student@college.edu",
    appUrl: process.env.APP_URL || "http://localhost:3000"
  });
});

app.post("/api/auth/login", (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  const normalizedEmail = email.toLowerCase().trim();
  const allData = getData(); // legacy-free read of all users
  const userExists = !!(allData.users && allData.users[normalizedEmail]);
  
  if (userExists) {
    const studentData = allData.users[normalizedEmail];
    res.json({ success: true, profile: studentData.profile, onboarded: studentData.profile.onboarded !== false });
  } else {
    res.json({ success: false, error: "not_found" });
  }
});

// 2. Profile GET / POST
app.get("/api/profile", (req, res) => {
  const data = getData(req);
  res.json(data.profile);
});

app.post("/api/profile", (req, res) => {
  const data = getData(req);
  data.profile = { ...data.profile, ...req.body };
  writeData(data, req);
  res.json({ success: true, profile: data.profile });
});

// 3. Projects GET / POST
app.get("/api/projects", (req, res) => {
  const data = getData(req);
  res.json(data.projects);
});

app.post("/api/projects", (req, res) => {
  const data = getData(req);
  const newProject = {
    id: req.body.id || `proj_${Date.now()}`,
    title: req.body.title,
    description: req.body.description,
    technologies: req.body.technologies || [],
    githubUrl: req.body.githubUrl || "",
    liveUrl: req.body.liveUrl || "",
    recruiterReview: req.body.recruiterReview || "Awaiting review... Click 'Review Portfolio' to generate AI recruiter insights."
  };
  
  const existingIndex = data.projects.findIndex((p: any) => p.id === newProject.id);
  if (existingIndex > -1) {
    data.projects[existingIndex] = newProject;
  } else {
    data.projects.push(newProject);
  }
  
  writeData(data, req);
  res.json({ success: true, projects: data.projects });
});

// Delete Project
app.delete("/api/projects/:id", (req, res) => {
  const data = getData(req);
  data.projects = data.projects.filter((p: any) => p.id !== req.params.id);
  writeData(data, req);
  res.json({ success: true, projects: data.projects });
});

// 4. Certificates GET / POST
app.get("/api/certificates", (req, res) => {
  const data = getData(req);
  res.json(data.certificates);
});

app.post("/api/certificates", (req, res) => {
  const data = getData(req);
  const newCert = {
    id: req.body.id || `cert_${Date.now()}`,
    title: req.body.title,
    issuer: req.body.issuer,
    date: req.body.date,
    verificationUrl: req.body.verificationUrl || ""
  };
  data.certificates.push(newCert);
  writeData(data, req);
  res.json({ success: true, certificates: data.certificates });
});

// Delete Certificate
app.delete("/api/certificates/:id", (req, res) => {
  const data = getData(req);
  data.certificates = data.certificates.filter((c: any) => c.id !== req.params.id);
  writeData(data, req);
  res.json({ success: true, certificates: data.certificates });
});

// 5. AI Employability Analyzer
app.post("/api/ai/analyze-employability", async (req, res) => {
  const data = getData(req);
  const profile = data.profile;
  const projects = data.projects;
  const certificates = data.certificates;
  const ai = getGemini();

  if (!ai) {
    // Offline simulation mode
    const baselineScore = profile.resumeText ? 75 : 45;
    const finalScore = Math.min(98, baselineScore + (projects.length * 5) + (certificates.length * 3));
    
    const simReport = {
      score: finalScore,
      strengths: [
        `Solid proficiency in ${profile.targetJob} foundations.`,
        `Demonstrates proactive builder mindset with ${projects.length} completed projects in stack.`,
        "Well-formatted resume showcasing engineering alignment."
      ],
      weaknesses: [
        projects.length < 3 ? "Thin project portfolio. Suggest adding at least 3 advanced projects." : "Need to demonstrate more cloud-native scaling.",
        "Missing standard industry cloud certifications (AWS, GCP, or Azure).",
        "Resume could benefit from more quantitative bullet points (e.g., '% improvement', 'reduced load by X%')."
      ],
      improvementAreas: [
        { item: "Add quantitative metrics in resume", priority: "High", action: "Rephrase achievements in Resume Builder to state exactly how many users or what performance improvement was made." },
        { item: "Incorporate Vector Database / RAG pattern", priority: "Medium", action: "Integrate ChromaDB or Pinecone into one of your Node.js or Python projects to showcase AI expertise." },
        { item: "Configure automatic CI/CD deployment", priority: "High", action: "Deploy existing projects with Docker and render active URL in the portfolio builder." }
      ],
      recruiterPerspective: `From a recruiter's view, Alex shows strong core competence. The GPA and current skills match entry-level ${profile.targetJob} requisites. To secure Tier-1 product company calls, Alex needs to feature actual production-ready deployment links rather than local localhost scripts. Highly recommend optimizing the ATS score beyond 80%.`
    };

    data.profile.employabilityScore = finalScore;
    data.employabilityReport = simReport;
    writeData(data, req);
    return res.json(simReport);
  }

  try {
    const prompt = `
      You are an elite, highly demanding Tech Recruiter and resume rating system.
      Review the student's profile, resume, projects, and certifications below.
      Evaluate their "Employability" for their target job: "${profile.targetJob}".

      [STUDENT PROFILE]
      Name: ${profile.name}
      Target Job: ${profile.targetJob}
      Current Skills: ${JSON.stringify(profile.skills)}
      
      [RESUME TEXT]
      ${profile.resumeText || "No resume text uploaded yet."}

      [PROJECTS]
      ${JSON.stringify(projects.map(p => ({ title: p.title, desc: p.description, tech: p.technologies })))}

      [CERTIFICATIONS]
      ${JSON.stringify(certificates.map(c => c.title))}

      Generate a detailed, objective JSON report matching this EXACT schema:
      {
        "score": number (0 to 100 representing readiness for a selective tech company),
        "strengths": string[],
        "weaknesses": string[],
        "improvementAreas": [
          { "item": "short description of weakness", "priority": "High" | "Medium" | "Low", "action": "concrete step to resolve" }
        ],
        "recruiterPerspective": "paragraph outlining what recruiters think of this profile and how to immediately stand out"
      }
      Do NOT include any extra text. Return ONLY the valid JSON structure.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            improvementAreas: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  item: { type: Type.STRING },
                  priority: { type: Type.STRING, enum: ["High", "Medium", "Low"] },
                  action: { type: Type.STRING }
                },
                required: ["item", "priority", "action"]
              }
            },
            recruiterPerspective: { type: Type.STRING }
          },
          required: ["score", "strengths", "weaknesses", "improvementAreas", "recruiterPerspective"]
        }
      }
    });

    const parsedReport = JSON.parse(response.text.trim());
    data.profile.employabilityScore = parsedReport.score;
    data.employabilityReport = parsedReport;
    
    // Auto-update projects with recruiter comments
    for (let i = 0; i < data.projects.length; i++) {
      if (data.projects[i].recruiterReview && data.projects[i].recruiterReview.startsWith("Awaiting")) {
        data.projects[i].recruiterReview = `AI Recruiter: Strong stack usage. Recommend showcasing performance metrics in the README file.`;
      }
    }
    
    writeData(data, req);
    res.json(parsedReport);
  } catch (error) {
    console.error("Gemini Employability evaluation failed:", error);
    res.status(500).json({ error: "Failed to evaluate employability score via Gemini. Please try again." });
  }
});

// 6. AI Career Roadmap Generator
app.post("/api/ai/generate-roadmap", async (req, res) => {
  const data = getData(req);
  const profile = data.profile;
  const targetJob = req.body.targetJob || profile.targetJob;
  const ai = getGemini();

  if (!ai) {
    // Return high quality pre-populated roadmap
    const simRoadmap = {
      goal: targetJob,
      milestones: [
        {
          title: `Foundations of ${targetJob} Architecture`,
          duration: "Weeks 1 - 4",
          topics: ["Advanced data structures", "API system designs", "Relational schema management", "Asynchronous runtimes"],
          suggestedProjects: ["Modular high-concurrency API service", "Custom cache store middleware"]
        },
        {
          title: "Production Infrastructure & Scaling",
          duration: "Weeks 5 - 8",
          topics: ["Docker & Kubernetes setups", "Global state caching (Redis)", "Secure JSON web token auth architecture"],
          suggestedProjects: ["Microservices container orchestration", "Full OAuth authentication proxy system"]
        },
        {
          title: "Production CI/CD & Testing Suite",
          duration: "Weeks 9 - 12",
          topics: ["Unit testing with Jest/PyTest", "Continuous integration pipelines", "Cloud performance monitoring"],
          suggestedProjects: ["Fully automated deployment pipeline with system telemetry metrics dashboard"]
        }
      ],
      requiredSkills: ["TypeScript", "Docker", "REST APIs", "System Architecture", "PostgreSQL"],
      certifications: [`Google Cloud Associate Engineer`, `Certified Kubernetes Administrator`],
      interviewPrepFocus: ["Algorithm design patterns (DP, Graph structures)", "Scalability constraints", "Live coding challenges"]
    };

    data.profile.targetJob = targetJob;
    data.careerRoadmap = simRoadmap;
    writeData(data, req);
    return res.json(simRoadmap);
  }

  try {
    const prompt = `
      You are an elite career development AI coach.
      Create a highly structured 12-week roadmap for a student transitioning to a "${targetJob}" role.
      Their current skills are: ${JSON.stringify(profile.skills)}.

      Provide a customized roadmap matching this EXACT schema:
      {
        "goal": "${targetJob}",
        "milestones": [
          {
            "title": "milestone theme or phase name",
            "duration": "e.g., Weeks 1-4",
            "topics": string[],
            "suggestedProjects": string[]
          }
        ],
        "requiredSkills": string[] (list of top 5-6 core technical tools or skills they must master),
        "certifications": string[] (2 top tier certifications of high industry values),
        "interviewPrepFocus": string[] (key topics recruiters ask during interview loops for this specific role)
      }
      Do NOT include markdown markers or extra text. Return ONLY valid JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            goal: { type: Type.STRING },
            milestones: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  duration: { type: Type.STRING },
                  topics: { type: Type.ARRAY, items: { type: Type.STRING } },
                  suggestedProjects: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["title", "duration", "topics", "suggestedProjects"]
              }
            },
            requiredSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            certifications: { type: Type.ARRAY, items: { type: Type.STRING } },
            interviewPrepFocus: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["goal", "milestones", "requiredSkills", "certifications", "interviewPrepFocus"]
        }
      }
    });

    const parsed = JSON.parse(response.text.trim());
    data.profile.targetJob = targetJob;
    data.careerRoadmap = parsed;
    writeData(data, req);
    res.json(parsed);
  } catch (error) {
    console.error("Gemini Career Roadmap Generation failed:", error);
    res.status(500).json({ error: "Failed to generate Career Roadmap. Please try again." });
  }
});

// 7. AI Skill Gap Analyzer
app.post("/api/ai/skillgap", async (req, res) => {
  const data = getData(req);
  const profile = data.profile;
  const targetJob = req.body.targetJob || profile.targetJob;
  const ai = getGemini();

  if (!ai) {
    const simGap = {
      missingSkills: ["PyTorch", "Docker", "Vector DB (Pinecone)", "FastAPI", "GCP Core"],
      weakSkills: ["SQL Database Optimization", "Advanced TypeScript"],
      prerequisites: ["Data Structures & Algorithms", "Python Object Oriented Foundations"],
      industryTrends: ["Multi-Agent Architectures", "Low-Latency Embeddings", "Retrieval-Augmented Generation"],
      learningPriority: [
        { skill: "PyTorch Deep Learning Core", priority: "Immediate", resource: "Fast.ai Practical Deep Learning for Coders" },
        { skill: "Docker Containerization", priority: "Immediate", resource: "Docker Core Crash Course" },
        { skill: "Vector Database setup (Chroma/Pinecone)", priority: "Soon", resource: "Pinecone Engineering University" }
      ]
    };
    data.skillGapAnalysis = simGap;
    writeData(data, req);
    return res.json(simGap);
  }

  try {
    const prompt = `
      You are an expert tech skills auditor.
      Compare the student's current skills against the requirements for their target job: "${targetJob}".
      Current Student Skills: ${JSON.stringify(profile.skills)}

      Generate a comprehensive Skill Gap analysis matching this EXACT schema:
      {
        "missingSkills": string[],
        "weakSkills": string[],
        "prerequisites": string[] (fundamental theory or core building blocks required),
        "industryTrends": string[] (3 modern trending technologies/frameworks relevant to this exact job role),
        "learningPriority": [
          { "skill": "skill name", "priority": "Immediate" | "Soon" | "Secondary", "resource": "suggested high quality learning course or docs" }
        ]
      }
      Do NOT write extra markdown or sentences. Return ONLY the valid JSON structure.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            weakSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
            prerequisites: { type: Type.ARRAY, items: { type: Type.STRING } },
            industryTrends: { type: Type.ARRAY, items: { type: Type.STRING } },
            learningPriority: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  skill: { type: Type.STRING },
                  priority: { type: Type.STRING, enum: ["Immediate", "Soon", "Secondary"] },
                  resource: { type: Type.STRING }
                },
                required: ["skill", "priority", "resource"]
              }
            }
          },
          required: ["missingSkills", "weakSkills", "prerequisites", "industryTrends", "learningPriority"]
        }
      }
    });

    const parsed = JSON.parse(response.text.trim());
    data.skillGapAnalysis = parsed;
    writeData(data, req);
    res.json(parsed);
  } catch (error) {
    console.error("Gemini Skill Gap Analysis failed:", error);
    res.status(500).json({ error: "Failed to generate skill gap analytics." });
  }
});

// 8. Project Recommendation Engine
app.post("/api/ai/recommend-projects", async (req, res) => {
  const data = getData(req);
  const profile = data.profile;
  const ai = getGemini();

  if (!ai) {
    const simRecs = [
      {
        id: "rec_1",
        title: "Retrieval-Augmented Generation (RAG) Document QA",
        description: "Develop a secure workspace where users upload custom course PDFs, vectorizes the chunks using local embedding vectors, and answers study questions with precise citations.",
        skillsAcquired: ["Python", "FastAPI", "Pinecone", "Gemini API", "ChromaDB"],
        difficulty: "Intermediate",
        marketDemand: "High",
        implementationTips: ["Leverage recursive text splitters for cleaner context chunks.", "Provide a beautiful side-by-side view showing the PDF page alongside AI answers."]
      },
      {
        id: "rec_2",
        title: "Dockerized Distributed Event Queue Logger",
        description: "Build a production-grade asynchronous pipeline logging and routing tech events using an Express broker service, Docker compose routing, and Redis storage caching.",
        skillsAcquired: ["Docker", "Redis", "TypeScript", "Microservices", "System Telemetry"],
        difficulty: "Advanced",
        marketDemand: "Trending",
        implementationTips: ["Ensure all network containers boot smoothly inside a unified Docker compose yaml file.", "Expose high-precision Prometheus-style latency logs on a /metrics route."]
      }
    ];
    return res.json(simRecs);
  }

  try {
    const prompt = `
      You are an elite product architect. Recommend 2 major portfolio projects customized for this student.
      Career Goal: ${profile.targetJob}
      Current Skills: ${JSON.stringify(profile.skills)}
      
      Provide your recommendations matching this EXACT schema:
      [
        {
          "id": "string (unique code)",
          "title": "Compelling Project Name",
          "description": "Short paragraphs describing what they build and its business or tech value",
          "skillsAcquired": string[],
          "difficulty": "Beginner" | "Intermediate" | "Advanced",
          "marketDemand": "High" | "Medium" | "Trending",
          "implementationTips": string[]
        }
      ]
      Do NOT write any text wrappers. Return ONLY JSON array.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              skillsAcquired: { type: Type.ARRAY, items: { type: Type.STRING } },
              difficulty: { type: Type.STRING, enum: ["Beginner", "Intermediate", "Advanced"] },
              marketDemand: { type: Type.STRING, enum: ["High", "Medium", "Trending"] },
              implementationTips: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["id", "title", "description", "skillsAcquired", "difficulty", "marketDemand", "implementationTips"]
          }
        }
      }
    });

    const parsed = JSON.parse(response.text.trim());
    res.json(parsed);
  } catch (error) {
    console.error("Gemini Project Recommendations failed:", error);
    res.status(500).json({ error: "Failed to load project suggestions." });
  }
});

// 9. AI Mock Interview & Feedback Endpoints
app.post("/api/ai/interview-questions", async (req, res) => {
  const data = getData(req);
  const profile = data.profile;
  const ai = getGemini();

  if (!ai) {
    const simQuestions = [
      { id: "q_1", question: "Can you explain the main difference between TypeScript interfaces and type aliases, and when you'd prefer one over the other?", type: "Technical", expectedKeywords: ["interface", "type alias", "extending", "union types"] },
      { id: "q_2", question: "Tell me about a time you encountered a challenging bug in a frontend framework. What was your systematic debugging process?", type: "Behavioral", expectedKeywords: ["debugging", "Chrome DevTools", "React lifecycle", "performance", "solution"] },
      { id: "q_3", question: "Why do you want to join our engineering team as an junior AI Engineer, and how does your project history demonstrate readiness?", type: "HR", expectedKeywords: ["alignment", "growth", "builder mindset", "scaling"] }
    ];
    return res.json(simQuestions);
  }

  try {
    const prompt = `
      You are an expert technical interviewer for elite Silicon Valley product companies.
      Generate 3 highly realistic interview questions (1 Technical, 1 Behavioral, 1 HR) for a candidate applying as a "${profile.targetJob}".
      Their skills: ${JSON.stringify(profile.skills)}

      Generate the questions matching this EXACT schema:
      [
        {
          "id": "q_1",
          "question": "The interview question",
          "type": "Technical" | "Behavioral" | "HR",
          "expectedKeywords": string[] (3-4 essential terms or concepts the recruiter expects in their verbal response)
        }
      ]
      Do NOT write extra paragraphs. Return ONLY JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              type: { type: Type.STRING, enum: ["Technical", "Behavioral", "HR"] },
              expectedKeywords: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["id", "question", "type", "expectedKeywords"]
          }
        }
      }
    });

    res.json(JSON.parse(response.text.trim()));
  } catch (error) {
    console.error("Gemini interview questions generation failed:", error);
    res.status(500).json({ error: "Failed to generate interview questions." });
  }
});

app.post("/api/ai/interview-submit", async (req, res) => {
  const { question, answer } = req.body;
  const ai = getGemini();

  if (!ai) {
    const simFeedback = {
      score: answer.length > 50 ? 82 : 45,
      feedback: answer.length > 50 
        ? "Excellent structured answer. You hit key conceptual pillars. To make it stand out, explicitly mention quantitative results or speed optimizations."
        : "Answer is too short or lacking technical depth. Real interview panels expect a comprehensive response using the STAR (Situation, Task, Action, Result) method.",
      suggestedAnswer: "An optimal response should state: 'In my latest project, I optimized our React states reducing load by 24%. I leverage TypeScript interfaces for custom props typing since they offer automatic declaration merging...'"
    };
    return res.json(simFeedback);
  }

  try {
    const prompt = `
      You are an expert tech interviewer grading a candidate's answer.
      
      [QUESTION]
      ${question}

      [CANDIDATE ANSWER]
      ${answer}

      Analyze their response, grade its technical accuracy, structure, and communication delivery, and return a JSON feedback matching this EXACT schema:
      {
        "score": number (0 to 100),
        "feedback": "constructive breakdown of what they did well, what was missing, and delivery feedback",
        "suggestedAnswer": "an exemplar standard response demonstrating how to ace this exact question using STAR style"
      }
      Do NOT write extra wrapping text. Return ONLY JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            feedback: { type: Type.STRING },
            suggestedAnswer: { type: Type.STRING }
          },
          required: ["score", "feedback", "suggestedAnswer"]
        }
      }
    });

    res.json(JSON.parse(response.text.trim()));
  } catch (error) {
    console.error("Gemini Interview Grading failed:", error);
    res.status(500).json({ error: "Failed to grade answer." });
  }
});

// 10. AI Mentor Chat (Context-Aware)
app.post("/api/ai/mentor-chat", async (req, res) => {
  const { messages } = req.body;
  const data = getData(req);
  const profile = data.profile;
  const projects = data.projects;
  const ai = getGemini();

  const userMsg = messages[messages.length - 1]?.text || "";

  if (!ai) {
    // Quality offline simulation
    let simReply = "I have noted that. To achieve your target of becoming an AI Engineer, the absolute next logical priority is completing your Advanced PyTorch foundations. Let me know if you want to outline a study schedule for this week!";
    if (userMsg.toLowerCase().includes("resume")) {
      simReply = `I've analyzed your resume text. Your current score is ${profile.atsScore}%. The main gap is quantitative metrics. For instance, rewrite "built React frontend" to "Constructed highly modular React dashboard with 12 reusable components, reducing dashboard latency by 30%." Would you like me to rewrite a specific section for you?`;
    } else if (userMsg.toLowerCase().includes("project")) {
      simReply = `Looking at your existing projects: ${projects.map(p => p.title).join(", ")}. They demonstrate excellent web engineering! To target a prime tech company, let's inject AI components: e.g. integrating semantic vectors or real-time model streaming. Do you want to review project ideas?`;
    }
    
    const replyObj = {
      id: `msg_${Date.now()}`,
      sender: "mentor",
      text: simReply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    data.mentorChatHistory.push({ id: `msg_u_${Date.now()}`, sender: "user", text: userMsg, timestamp: "Now" });
    data.mentorChatHistory.push(replyObj);
    writeData(data, req);
    
    return res.json(replyObj);
  }

  try {
    const systemInstruction = `
      You are "Dr. Evelyn Vance", an elite engineering mentor and career strategist assigned to this student on CareerOS AI.
      You are highly supportive, incredibly knowledgeable, and brief (max 3-4 sentences per response to keep the UI elegant).
      You are fully context-aware of their goals and records:
      - Student Name: ${profile.name}
      - Target Job: ${profile.targetJob}
      - Core Skills: ${profile.skills.join(", ")}
      - Resume: ${profile.resumeText ? "Uploaded (Rating: " + profile.atsScore + "%)" : "Not uploaded yet."}
      - Current Projects: ${projects.map(p => p.title).join(", ")}

      Provide direct, ultra-actionable guidance. Suggest specific libraries, structural project edits, or networking hacks.
      Do NOT speak generically. Be a real mentor who codes!
    `;

    // Convert messages format for Gemini generateContent
    const contents = messages.map((m: any) => ({
      role: m.sender === "user" ? "user" : "model",
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7
      }
    });

    const replyObj = {
      id: `msg_${Date.now()}`,
      sender: "mentor",
      text: response.text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    data.mentorChatHistory.push({ id: `msg_u_${Date.now()}`, sender: "user", text: userMsg, timestamp: "Now" });
    data.mentorChatHistory.push(replyObj);
    writeData(data, req);

    res.json(replyObj);
  } catch (error) {
    console.error("Gemini Mentor Chat failed:", error);
    res.status(500).json({ error: "Failed to connect with AI Mentor." });
  }
});

// 11. ViaSocket Interactive Automations
app.get("/api/automations", (req, res) => {
  const data = getData(req);
  res.json(data.automations);
});

// Trigger ViaSocket workflow simulation live!
app.post("/api/automations/:id/trigger", async (req, res) => {
  const data = getData(req);
  const flowId = req.params.id;
  const flow = data.automations.find((a: any) => a.id === flowId);

  if (!flow) {
    return res.status(404).json({ error: "Automation pipeline not found" });
  }

  // Set as triggered
  flow.isTriggered = true;
  flow.lastTriggered = new Date().toLocaleString();
  
  // Reset steps to pending and clear logs
  flow.steps = flow.steps.map((step: any) => ({
    ...step,
    status: "pending",
    logs: []
  }));
  
  writeData(data, req);

  // Return the flow immediately. The client will simulate processing or poll
  res.json({ success: true, flow });
});

// Get Live Simulator execution step updates (for realistic WebSockets-like response)
app.post("/api/automations/:id/step", (req, res) => {
  const data = getData(req);
  const flowId = req.params.id;
  const { stepIndex, status, logLine } = req.body;
  const flow = data.automations.find((a: any) => a.id === flowId);

  if (!flow || !flow.steps[stepIndex]) {
    return res.status(404).json({ error: "Flow step not found" });
  }

  flow.steps[stepIndex].status = status;
  if (logLine) {
    flow.steps[stepIndex].logs.push(`[${new Date().toLocaleTimeString()}] ${logLine}`);
  }

  // If final step completed, mark triggered complete
  const allComplete = flow.steps.every((s: any, idx: number) => 
    idx === stepIndex ? status === "completed" : s.status === "completed"
  );
  if (allComplete) {
    // Keep it active or done
  }

  writeData(data, req);
  res.json({ success: true, flow });
});

// ==========================================
// 12. ViaSocket REAL Integration Endpoints
// ==========================================

// 12a. ViaSocket config status — tells frontend if credentials are configured
app.get("/api/viasocket/config", (req, res) => {
  const hasSecret = !!process.env.VIASOCKET_SECRET;
  const hasOrgId = !!process.env.VIASOCKET_ORG_ID;
  const hasProjectId = !!process.env.VIASOCKET_PROJECT_ID;
  res.json({
    configured: hasSecret && hasOrgId && hasProjectId,
    hasSecret,
    hasOrgId,
    hasProjectId,
    embedScriptUrl: "https://embed.viasocket.com/embed.js"
  });
});

// 12b. Generate a per-user ViaSocket Embed JWT token
// The ViaSocket Embed SDK requires a signed JWT: { org_id, project_id, unique_identifier }
app.post("/api/viasocket/embed-token", (req, res) => {
  const secret = process.env.VIASOCKET_SECRET;
  const orgId = process.env.VIASOCKET_ORG_ID;
  const projectId = process.env.VIASOCKET_PROJECT_ID;

  if (!secret || !orgId || !projectId) {
    return res.status(503).json({
      error: "ViaSocket credentials not configured. Add VIASOCKET_SECRET, VIASOCKET_ORG_ID, and VIASOCKET_PROJECT_ID to your .env file.",
      configured: false
    });
  }

  // Identify this specific student so their ViaSocket flows are isolated
  const emailHeader = req.headers["x-user-email"];
  const userEmail = (typeof emailHeader === "string" ? emailHeader : "anonymous").toLowerCase().trim();

  const payload = {
    org_id: orgId,
    project_id: projectId,
    unique_identifier: userEmail   // isolates each student's flows in ViaSocket
  };

  try {
    const token = jwt.sign(payload, secret, { expiresIn: "2h" });
    res.json({ success: true, embedToken: token, configured: true });
  } catch (err: any) {
    console.error("Failed to sign ViaSocket embed token:", err);
    res.status(500).json({ error: "Failed to generate embed token.", configured: false });
  }
});

// 12c. Forward an automation event payload to a real ViaSocket webhook URL
// Body: { flowId, webhookUrl, payload }
app.post("/api/viasocket/trigger", async (req, res) => {
  const { flowId, webhookUrl, payload } = req.body;

  if (!webhookUrl) {
    return res.status(400).json({ error: "webhookUrl is required. Configure it per-flow in ViaSocket Automations settings." });
  }

  // Build the enriched payload CareerOS sends to ViaSocket
  const data = getData(req);
  const enrichedPayload = {
    source: "careeros_ai",
    flow_id: flowId,
    student: {
      name: data.profile?.name,
      email: data.profile?.email,
      targetJob: data.profile?.targetJob,
      employabilityScore: data.profile?.employabilityScore
    },
    event_data: payload || {},
    triggered_at: new Date().toISOString()
  };

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(enrichedPayload)
    });

    const responseText = await response.text();
    console.log(`ViaSocket webhook triggered for flow ${flowId}: status ${response.status}`);

    res.json({
      success: response.ok,
      status: response.status,
      viaSocketResponse: responseText,
      payload: enrichedPayload
    });
  } catch (err: any) {
    console.error("ViaSocket webhook trigger failed:", err);
    res.status(500).json({ error: `Failed to reach ViaSocket webhook: ${err.message}` });
  }
});

// 12d. Save/update a webhook URL for a specific automation flow
// Body: { flowId, webhookUrl }
app.patch("/api/viasocket/webhook-url", (req, res) => {
  const { flowId, webhookUrl } = req.body;
  if (!flowId) {
    return res.status(400).json({ error: "flowId is required" });
  }

  const data = getData(req);
  const flow = data.automations?.find((a: any) => a.id === flowId);
  if (!flow) {
    return res.status(404).json({ error: "Automation flow not found" });
  }

  flow.webhookUrl = webhookUrl || "";
  writeData(data, req);
  res.json({ success: true, flowId, webhookUrl: flow.webhookUrl });
});

// 13. Recruiter Portal - Search and candidate ranking matching keywords using Gemini
app.post("/api/recruiter/search", async (req, res) => {
  const { query } = req.body;
  const allData = getData();
  const ai = getGemini();

  // Dynamically build candidate list from all registered students!
  const mockCandidates: any[] = [];
  if (allData.users) {
    Object.keys(allData.users).forEach((email) => {
      const student = allData.users[email];
      if (student.profile) {
        mockCandidates.push({
          id: student.profile.id || `stud_${Date.now()}`,
          name: student.profile.name,
          email: student.profile.email,
          targetJob: student.profile.targetJob,
          skills: student.profile.skills || [],
          portfolioUrl: student.profile.portfolioUrl || `${student.profile.name.toLowerCase().replace(/\s+/g, "")}.career.os`,
          score: student.profile.employabilityScore || 72,
          projects: student.projects || [],
          matchReason: ""
        });
      }
    });
  }

  // Fallback if empty
  if (mockCandidates.length === 0) {
    mockCandidates.push({
      id: "cand_1",
      name: "Alex Rivera",
      email: "vpand301@gmail.com",
      targetJob: "AI Engineer",
      skills: ["React", "TypeScript", "Python", "JavaScript", "SQL"],
      portfolioUrl: "alexrivera.career.os",
      score: 72,
      projects: [],
      matchReason: ""
    });
  }

  if (!ai || !query) {
    // Simulation match grading
    const queryLower = (query || "").toLowerCase();
    const graded = mockCandidates.map(c => {
      let scoreBoost = 0;
      let reasons: string[] = [];
      
      c.skills.forEach((s: string) => {
        if (queryLower.includes(s.toLowerCase())) {
          scoreBoost += 15;
          reasons.push(`Strong keyword match: ${s}`);
        }
      });

      if (queryLower.includes(c.targetJob.toLowerCase())) {
        scoreBoost += 25;
        reasons.push(`Direct alignment with target job title: ${c.targetJob}`);
      }

      const finalMatch = Math.min(100, Math.max(40, 50 + scoreBoost));
      return {
        ...c,
        matchScore: finalMatch,
        matchReason: reasons.join(". ") || "General developer showing high aptitude in modern web/software engineering standards."
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    return res.json(graded);
  }

  try {
    const prompt = `
      You are an expert AI recruiting filter. Match candidates against the recruiter query: "${query}".
      Candidates list:
      ${JSON.stringify(mockCandidates.map(c => ({ id: c.id, name: c.name, target: c.targetJob, skills: c.skills })))}

      Evaluate each candidate's match percentage (0 to 100) and draft a crisp 1-sentence reason outlining why they match or mismatch.
      Generate your evaluation matching this EXACT schema:
      [
        {
          "id": "string (candidate id)",
          "matchScore": number,
          "matchReason": "1-sentence description highlighting alignment of skills and experience"
        }
      ]
      Do NOT include markdown. Return ONLY valid JSON.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              matchScore: { type: Type.INTEGER },
              matchReason: { type: Type.STRING }
            },
            required: ["id", "matchScore", "matchReason"]
          }
        }
      }
    });

    const evaluations = JSON.parse(response.text.trim());
    const graded = mockCandidates.map(c => {
      const evalItem = evaluations.find((ev: any) => ev.id === c.id);
      return {
        ...c,
        matchScore: evalItem ? evalItem.matchScore : 50,
        matchReason: evalItem ? evalItem.matchReason : "General skill compatibility."
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    res.json(graded);
  } catch (error) {
    console.error("Gemini candidate matching failed:", error);
    res.status(500).json({ error: "Failed to execute candidate matching." });
  }
});

// 13. Mentor Dashboard Student Analytics
app.get("/api/mentor/students", (req, res) => {
  const allData = getData();
  const studentsList: any[] = [];
  
  if (allData.users) {
    Object.keys(allData.users).forEach((email) => {
      const student = allData.users[email];
      if (student.profile) {
        studentsList.push({
          id: student.profile.id || `stud_${Date.now()}`,
          name: student.profile.name || email.split("@")[0],
          email: student.profile.email || email,
          targetJob: student.profile.targetJob || "AI Engineer",
          skills: student.profile.skills || [],
          employabilityScore: student.profile.employabilityScore || 72,
          lastActive: student.profile.lastActive || "Today",
          progressRate: "78%",
          skillGaps: student.skillGapAnalysis?.missingSkills?.length || 0,
          recentNotes: `Actively building and optimizing portfolio for ${student.profile.targetJob || 'Software Engineering'}.`
        });
      }
    });
  }
  
  // Fallback to initial mock candidates if list is too small
  if (studentsList.length === 0) {
    studentsList.push({
      id: "stud_101",
      name: "Alex Rivera",
      email: "vpand301@gmail.com",
      targetJob: "AI Engineer",
      skills: ["React", "TypeScript", "Python", "JavaScript", "SQL"],
      employabilityScore: 72,
      lastActive: "Today, 10:14 AM",
      progressRate: "78%",
      skillGaps: 5,
      recentNotes: "Alex is highly responsive. We are working together on implementing an AWS containerized build next week."
    });
  }
  
  res.json(studentsList);
});

// ==========================================
// STATIC VITE MIDDLEWARE SETUP
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite Development Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving static production assets...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CareerOS AI Server successfully running on http://localhost:${PORT}`);
  });
}

startServer();
