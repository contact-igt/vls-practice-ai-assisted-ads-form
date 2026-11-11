 // -------------------------------------------------------------------------
// VLS LAW ACADEMY \u2014 DECODING OF PRACTICE
// Central Program Configuration \u2014 Single Source of Truth
// All dates, fees, modes and operational details must live HERE only.
// -------------------------------------------------------------------------

/** @type {"announced" | "tba"} */
const SESSION_STATUS = "announced"; // Change to "tba" when a real date is not confirmed

export const programConfig = {
  name: "Decoding of Practice",
  descriptor: "Now AI-Assisted",
  category: "AI-Assisted Legal Practice Masterclass",
  sessionStatus: SESSION_STATUS,
  // Set these only when SESSION_STATUS is "announced" and a real date is confirmed:
  date: "Sunday, 15 November 2026",
  time: "",
  classStartAt: "2026-11-15T18:00:00+05:30",
  duration: "3 Hours",
  mode: "Live on Google Meet (Interactive Q&A)",
  language: "English / Tamil",
  fee: 1, // INR — single source for checkout amount
  recordingProvided: false,
  certificateProvided: true, // only to attendees who complete 80%+ of the session
  whatsapp: "+919500025216",
  phone1: "+919500207811",
  phone2: "+919500025216",
};

export const HomePage = {
  hero_banner: {
    heading: {
      titlebold: "Decoding of Practice",
      descriptor: "Now AI-Assisted",
      hook: "Real Legal Practice. Now Assisted by AI.",
      desc: "From the first client conversation to case analysis, drafting, filing and courtroom preparation \u2014 learn a practical legal workflow enhanced by responsible AI assistance.",
      coreTagline: "AI Assists. The Advocate Decides.",
    },

    benefits: [
      {
        id: 1,
        desc: "Understand end-to-end legal practice workflow",
      },
      {
        id: 2,
        desc: "Learn reusable structures for common legal drafts",
      },
      {
        id: 3,
        desc: "Prepare case strategy with greater clarity",
      },
      {
        id: 4,
        desc: "Use AI responsibly without surrendering professional judgment",
      },
    ],

    // kept for backward compatibility with FastFact component
    points: [
      {
        id: 1,
        desc: "Understand end-to-end legal practice workflow",
      },
      {
        id: 2,
        desc: "Learn reusable structures for common legal drafts",
      },
      {
        id: 3,
        desc: "Prepare case strategy with greater clarity",
      },
      {
        id: 4,
        desc: "Use AI responsibly without surrendering professional judgment",
      },
    ],
  },

  fast_fact: [
    {
      id: 1,
      value:
        SESSION_STATUS === "announced" && programConfig.date
          ? programConfig.date
          : "Next live session \u2014 date to be announced",
      icon: "calendar-clock",
    },
    {
      id: 2,
      value: programConfig.mode,
      icon: "video",
    },
    {
      id: 3,
      value:
        "Final-year & fresh LLBs, 0-3 yr advocates, judiciary aspirants, returning professionals",
      icon: "user",
    },
    {
      id: 4,
      value: `Certificate provided to attendees who complete the full session (80%+ attendance required)`,
      icon: "shield-check",
    },
    {
      id: 5,
      value: `${programConfig.duration} Live Masterclass`,
      icon: "hand-coins",
    },
    {
      id: 6,
      value: "Recording not provided \u2014 attend live",
      icon: "mic",
    },
  ],

  practice_gap: {
    label: "THE PRACTICE GAP",
    heading: "The degree taught you law. Practice demands a workflow.",
    cards: [
      {
        id: 1,
        question: "Your first client is sitting in front of you. Do you know what to ask next?",
        answer:
          "Understand client intake, material facts, required documents, remedies and immediate next actions.",
        icon: "user-round",
      },
      {
        id: 2,
        question: "Still staring at a blank legal document?",
        answer:
          "Learn how to move from facts and legal issues to a structured working draft.",
        icon: "file-text",
      },
      {
        id: 3,
        question:
          "Do filing, procedure and courtroom workflow still feel unclear?",
        answer:
          "Understand practical steps, common documents, filing processes and courtroom preparation.",
        icon: "scale",
      },
      {
        id: 4,
        question: "AI can draft fast. But can you trust what it drafts?",
        answer:
          "Learn to verify facts, provisions, judgments, citations and procedural requirements.",
        icon: "bot",
      },
    ],
  },

  workflow: {
    label: "THE PRACTICAL METHOD",
    heading: "Real legal practice \u2014 structured, demonstrated and now AI-assisted.",
    steps: [
      { id: 1, label: "Client Narrative" },
      { id: 2, label: "Material Facts" },
      { id: 3, label: "Legal Issues" },
      { id: 4, label: "Case Strategy" },
      { id: 5, label: "Drafting" },
      { id: 6, label: "Filing Preparation" },
      { id: 7, label: "Professional Verification" },
      { id: 8, label: "Advocate Decision" },
    ],
  },

  ai_vs_advocate: {
    heading: "Use AI for assistance. Keep legal judgment with the advocate.",
    ai_can: [
      "Organising client narratives",
      "Summarising case information",
      "Identifying possible issues for review",
      "Creating litigation checklists",
      "Preparing working draft structures",
      "Improving drafting efficiency",
      "Generating further research questions",
    ],
    advocate_must: [
      "Accuracy of material facts",
      "Applicable law and procedure",
      "Verification of provisions and judgments",
      "Limitation, jurisdiction and maintainability",
      "Client confidentiality",
      "Final advice and strategy",
      "Every document used, shared or filed",
    ],
    disclaimer:
      "AI-generated work is a starting point. Professional review is the standard.",
  },

  modules: [
    {
      id: 1,
      title: "Understanding Actual Legal Practice",
      topics: [
        "Civil and criminal practice workflow",
        "Courtroom flow and professional conduct",
        "Filing and registration procedures",
        "e-Courts and practical checklists",
        "Common procedural mistakes",
        "Independent-practice mindset",
      ],
      outcome:
        "Understand how a matter moves from consultation to court preparation.",
    },
    {
      id: 2,
      title: "Client Intake and Case Analysis",
      topics: [
        "Conducting the first client interaction",
        "Asking structured questions",
        "Identifying material facts and documents",
        "Framing legal issues and remedies",
        "Using AI to organise information responsibly",
      ],
      outcome:
        "Convert an unstructured narrative into a clear working framework.",
    },
    {
      id: 3,
      title: "Litigation Strategy and Drafting",
      topics: [
        "Maintainability, jurisdiction and limitation",
        "Appropriate forum and necessary parties",
        "Plaint, written statement, legal notice",
        "Affidavit, petition, bail application",
        "Vakalat, memo and complaint basics",
      ],
      outcome:
        "Move from a blank page to a structured first draft and case roadmap.",
    },
    {
      id: 4,
      title: "Verification and Responsible AI Use",
      topics: [
        "Verifying provisions, judgments and citations",
        "Detecting invented facts or authorities",
        "Protecting client confidentiality",
        "Avoiding blind AI dependence",
        "Finalising work under advocate supervision",
      ],
      outcome:
        "Use AI efficiently while retaining professional responsibility.",
    },
  ],

  promise: {
    desc: "You studied the law. But when it comes to drafting, filings, or handling your first client \u2014 do you feel unsure where to start?",
    problem: [
      "Theories, case laws, and exams.",
      "Zero practical exposure.",
      "No guidance on drafting, filing, or court prep.",
      "No clarity on client handling or professional workflow.",
    ],
    promise: [
      "A clear roadmap for actual legal work",
      "Step-by-step checklists for court procedures",
      "Reusable drafting frameworks and structures",
      "How to handle your first client interaction",
      "A responsible AI-assisted workflow for legal practice",
    ],
  },

  what_learn: [
    "Drafting: Plaints, Notices, Written Statements \u2014 with AI-assisted structuring",
    "Legal Documents: Vakalat, Memos, Affidavits, Petitions",
    "Criminal Practice: FIR, Bail, Complaints",
    "Filing & Registration Procedures and e-Courts",
    "Real Client Interaction and Case Analysis",
    "Courtroom Observation & Presentation",
    "AI Verification: Checking provisions, judgments and citations",
    "Practical Thinking for Independent Legal Practice",
  ],

  outcomes: [
    "A roadmap for beginning legal practice",
    "A structured first-client intake method",
    "Reusable drafting frameworks",
    "Filing and courtroom-preparation checklists",
    "A litigation-strategy checklist",
    "A responsible AI-assisted workflow",
    "A verification checklist",
    "A 30-day practice-development action plan",
  ],

  whyvls: [
    "Located in Chennai with direct court exposure",
    "Faculty includes High Court Practitioners",
    "100% practice-focused legal training",
    "Access to real-time courtroom procedures",
    "Trusted by hundreds of young lawyers & students",
    "Structured guidance for independent legal practice",
  ],

  who_join: [
    "Fresh LLB graduates who want a practical start",
    "Final-year students preparing for practice",
    "0-3 year advocates needing clarity & structure",
    "Judiciary aspirants seeking hands-on exposure",
    "Returning professionals restarting their law career",
    "International LLB students learning Indian procedures",
  ],

  speaker: {
    image: "/assets/owner/mr-siva-kumar-backdrop.svg",
    name: "Dr. Sivakumar",
    Education: "B.Sc., M.L., Ph.D (Law)",
    position: "Lawyer, Chennai High Court",
    about:
      "Dr. Sivakumar has successfully trained over 250 aspirants for Tamil Nadu Judicial Services and over 1200 candidates for Tamil Nadu Civil Services. He has guided IAS, IPS, and IFS candidates, with many achieving top ranks. He has mentored candidates in law, economy, and public administration subjects for UPSC and TNPSC exams since 2003.",
  },

  faqs: [
    {
      id: 1,
      question: "Is this an AI course?",
      answer:
        "No. Decoding of Practice is a practical legal training masterclass. AI is a supporting tool within the legal workflow \u2014 not the subject of study. No programming knowledge is required.",
    },
    {
      id: 2,
      question: "Do I need technical or programming knowledge?",
      answer:
        "None at all. The session focuses on legal practice. AI tools are demonstrated as practical aids \u2014 no coding or technical background is needed.",
    },
    {
      id: 3,
      question: "Will AI replace the advocate?",
      answer:
        "No. AI Assists. The Advocate Decides. AI can help organise information and prepare drafts \u2014 but legal accuracy, strategy, verification and professional judgment remain entirely the advocate's responsibility.",
    },
    {
      id: 4,
      question: "Can AI-generated drafts be filed directly in court?",
      answer:
        "No. AI-generated legal work is a starting point. It must be professionally reviewed, verified and approved by the advocate before any use, filing or reliance.",
    },
    {
      id: 5,
      question: "Can AI-generated citations be trusted?",
      answer:
        "Not without verification. The session specifically covers how to check judgments, provisions and citations \u2014 and how to detect invented or incorrect AI outputs.",
    },
    {
      id: 6,
      question: "Will the program cover practical drafting and filing?",
      answer:
        "Yes. The session covers drafting structures, filing procedures, e-Courts, and courtroom preparation \u2014 all demonstrated with practical examples.",
    },
    {
      id: 7,
      question: "Who should attend?",
      answer:
        "Final-year law students, fresh LLB graduates, junior advocates (0-3 years), judiciary aspirants, returning legal professionals and international LLB students learning Indian procedures.",
    },
    {
      id: 8,
      question: "What is the language of instruction?",
      answer: "English & Tamil \u2014 for clarity and accessibility.",
    },
    {
      id: 9,
      question: "Is the session online?",
      answer:
        "Yes. It is a live session on Google Meet with interactive Q&A. You can attend from anywhere.",
    },
    {
      id: 10,
      question: "Is a recording provided?",
      answer:
        "No. There is no recording. Please attend the live session.",
    },
    {
      id: 11,
      question: "Is a certificate provided?",
      answer:
        "Yes \u2014 certificates are provided to attendees who complete the full session and maintain at least 80% attendance.",
    },
    {
      id: 12,
      question: "When is the next session?",
      answer: `The next live session is on ${programConfig.date}.`,
    },
  ],

  razorpay: {
    title: "Decoding of Practice \u2014 AI-Assisted Legal Practice Masterclass",
    amount: programConfig.fee,
  },
};
