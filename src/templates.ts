import { SwarmArchitecture } from "./types";

export const TEMPLATES: SwarmArchitecture[] = [
  {
    id: "sequential-refinement",
    name: "Sequential Content Refinement Pipeline (Sequential Refiner)",
    description: "A linear expert swarm starting with a creative draft, reviewed by a strict compliance auditor, and finalized by a senior editorial polishing refiner.",
    nodes: [
      {
        id: "input",
        name: "Input Intake",
        type: "input",
        role: "Requirement ingestion point",
        systemInstruction: "Directly receives corporate briefs or user-specified assignment requests.",
        promptTemplate: "{{input}}",
        model: "gemini-3.5-flash",
        temperature: 0.5,
        position: { x: 50, y: 150 }
      },
      {
        id: "draftsman",
        name: "Content Draftsman",
        role: "Creative Copywriter",
        type: "agent",
        systemInstruction: "You are the primary creative copywriter. Your job is to transform raw guidelines into a brilliant, engaging, and comprehensive initial copy. Format nicely with structured headings.",
        promptTemplate: "Please draft a comprehensive and creative document answering the following criteria:\n\n{{input}}",
        model: "gemini-3.5-flash",
        temperature: 0.7,
        position: { x: 260, y: 150 }
      },
      {
        id: "auditor",
        name: "Technical Auditor",
        role: "Compliance & Risk Evaluator",
        type: "agent",
        systemInstruction: "You are the Lead Systems Auditor. Inspect the generated draft carefully for technical inaccuracies, compliance violations, or structural loopholes. Draft a rigorous advisory report detailing points of weakness.",
        promptTemplate: "Evaluate this draft for compliance hazards, technical flaws, or risk issues, and specify actionable correction criteria:\n\n{{input}}",
        model: "gemini-3.5-flash",
        temperature: 0.2,
        position: { x: 480, y: 150 }
      },
      {
        id: "editor",
        name: "Editorial Refiner",
        role: "Senior Polishing Editor",
        type: "agent",
        systemInstruction: "You are the Senior Polishing Editor. Synthesize the findings of the auditor together with the original draft. Polish, refine, remove unnecessary fluff, and compile the final production-ready output document.",
        promptTemplate: "Review the original draft and combine it with the auditor's suggestions to assemble a masterpiece final version:\n\n{{input}}",
        model: "gemini-3.5-flash",
        temperature: 0.5,
        position: { x: 700, y: 150 }
      }
    ],
    connections: [
      { id: "c1", fromId: "input", toId: "draftsman" },
      { id: "c2", fromId: "draftsman", toId: "auditor" },
      { id: "c3", fromId: "auditor", toId: "editor" }
    ]
  },
  {
    id: "swarm-consensus",
    name: "Strategic Venture Coordination (Strategy Swarm)",
    description: "An parallel collective of discrete business perspectives (Finance, Marketing, Security Risks) analyzed, resolved, and merged by an Executive Integrator.",
    nodes: [
      {
        id: "input",
        name: "Corporate Goal Ingest",
        type: "input",
        role: "Initial intent host",
        systemInstruction: "Hosts the main strategic venture target described by the enterprise or client.",
        promptTemplate: "{{input}}",
        model: "gemini-3.5-flash",
        temperature: 0.5,
        position: { x: 50, y: 220 }
      },
      {
        id: "finance_skeptic",
        name: "Financial Analyst",
        role: "Cost-benefit and ROI Auditor",
        type: "agent",
        systemInstruction: "You are the Finance Analyst. Evaluate the proposal strictly through a financial lens. Outline capital requirements, project margin risks, hidden costs, and budget optimizations.",
        promptTemplate: "Critically evaluate the fiscal risks, capital constraints, and ROI timelines for this initiative:\n\n{{input}}",
        model: "gemini-3.5-flash",
        temperature: 0.3,
        position: { x: 300, y: 70 }
      },
      {
        id: "marketer",
        name: "Growth Marketer",
        role: "Public brand & growth strategist",
        type: "agent",
        systemInstruction: "You are the Lead Growth Strategist. Review the requirements and brainstorm innovative ways to distribute the proposal, secure market reach, and optimize consumer conversions.",
        promptTemplate: "Outline viral distribution, brand marketing opportunities, and conversion optimization strategies for:\n\n{{input}}",
        model: "gemini-3.5-flash",
        temperature: 0.8,
        position: { x: 300, y: 220 }
      },
      {
        id: "security",
        name: "Security & Risk Analyst",
        role: "Data compliance and security auditor",
        type: "agent",
        systemInstruction: "You are the Compliance Risk Specialist. Analyze privacy, user trust, governance, legal hazards, scaling challenges, and environmental constraints.",
        promptTemplate: "Perform a severe risk assessment focusing on security gaps, legal concerns, or operational vulnerabilities for:\n\n{{input}}",
        model: "gemini-3.5-flash",
        temperature: 0.2,
        position: { x: 300, y: 370 }
      },
      {
        id: "merger",
        name: "Executive Integrator",
        role: "Master strategy consolidator",
        type: "agent",
        systemInstruction: "You are the Executive Consolidator. Gather the individual evaluations from Finance, Marketing, and Risk Security. Synthesize the overlapping themes, resolve trade-offs, and draft one single cohesive, master corporate roadmap.",
        promptTemplate: "Merge all individual analyst perspectives into one polished, unified master venture strategy:\n\n{{input}}",
        model: "gemini-3.5-flash",
        temperature: 0.6,
        position: { x: 650, y: 220 }
      }
    ],
    connections: [
      { id: "sc1", fromId: "input", toId: "finance_skeptic" },
      { id: "sc2", fromId: "input", toId: "marketer" },
      { id: "sc3", fromId: "input", toId: "security" },
      { id: "sc4", fromId: "finance_skeptic", toId: "merger" },
      { id: "sc5", fromId: "marketer", toId: "merger" },
      { id: "sc6", fromId: "security", toId: "merger" }
    ]
  },
  {
    id: "router-experts",
    name: "Cognitive Router & Specialist Duo (Sensing Router)",
    description: "A smart classification network that evaluates task intent and instantly forks pipelines to either a technical software engineer or commercial executives.",
    nodes: [
      {
        id: "input",
        name: "Inbound Ticket",
        type: "input",
        role: "Intake queue handler",
        systemInstruction: "Hosts individual raw support requests or software problem formulations.",
        promptTemplate: "{{input}}",
        model: "gemini-3.5-flash",
        temperature: 0.5,
        position: { x: 50, y: 200 }
      },
      {
        id: "router",
        name: "Sensing Router",
        role: "Cognitive fork classifier",
        type: "router",
        systemInstruction: "Analyze the incoming query. If the task requires programming, database schemas, API architecture, scripts or heavy mathematical calculations, route exclusively to the Technical Engineer. If the query focuses on business negotiations, marketing copy, commercial sales, or enterprise growth, route exclusively to the Commercial Executive.",
        promptTemplate: "{{input}}",
        model: "gemini-3.5-flash",
        temperature: 0.1,
        position: { x: 260, y: 200 }
      },
      {
        id: "tech_expert",
        name: "Technical Engineer",
        role: "Lead Systems Architect & Coder",
        type: "agent",
        systemInstruction: "You are the Staff Software Architect. Solve the incoming technical ticket, provide clean code blocks, highlight corner cases, suggest schema optimizations, and keep responses efficient.",
        promptTemplate: "Analyze the technical task and draft a step-by-step programming solution:\n\n{{input}}",
        model: "gemini-3.5-flash",
        temperature: 0.3,
        position: { x: 560, y: 100 }
      },
      {
        id: "business_expert",
        name: "Commercial Executive",
        role: "Enterprise Growth Adviser",
        type: "agent",
        systemInstruction: "You are the Staff Commerce Strategist. Guide the client on how to negotiate, expand, market, or run business operations to overcome the given problem.",
        promptTemplate: "Evaluate the scenario through a commercial business model lens and define a strategic response:\n\n{{input}}",
        model: "gemini-3.5-flash",
        temperature: 0.5,
        position: { x: 560, y: 300 }
      }
    ],
    connections: [
      { id: "rc1", fromId: "input", toId: "router" },
      { id: "rc2", fromId: "router", toId: "tech_expert", condition: "if task is technical, programming, or database-related" },
      { id: "rc3", fromId: "router", toId: "business_expert", condition: "if task is enterprise marketing, business operations, or commercial sales" }
    ]
  },
  {
    id: "critic-reflection",
    name: "Generator-Critic Reflection Loop",
    description: "An iterative feedback pair of creative content generator and strict compliance critic, refining outputs over sequential critique rounds.",
    nodes: [
      {
        id: "input",
        name: "Brief Requirements",
        type: "input",
        role: "Task criteria provider",
        systemInstruction: "Defines the specific article topic, essay criteria, or code requirements.",
        promptTemplate: "{{input}}",
        model: "gemini-3.5-flash",
        temperature: 0.5,
        position: { x: 50, y: 150 }
      },
      {
        id: "generator",
        name: "Drafting Engine",
        role: "Primary copy writer",
        type: "agent",
        systemInstruction: "You are the Content Generator drafting agent. Formulate a rich, comprehensive first copy covering all stated brief parameters with high clarity.",
        promptTemplate: "Create a detailed first draft for the requested topic:\n\n{{input}}",
        model: "gemini-3.5-flash",
        temperature: 0.6,
        position: { x: 280, y: 150 }
      },
      {
        id: "critic",
        name: "Pristine Critic",
        role: "Severe critique auditor & editor",
        type: "critic",
        systemInstruction: "You are the Strict Critic. Inspect the content generator's output, compile structural weaknesses, find flaws, and then output a polished, completely corrected final revision.",
        promptTemplate: "Analyze the generated draft, issue a severe constructive critique list, and deliver the final refined copy:\n\n{{input}}",
        model: "gemini-3.5-flash",
        temperature: 0.4,
        position: { x: 560, y: 150 }
      }
    ],
    connections: [
      { id: "cl1", fromId: "input", toId: "generator" },
      { id: "cl2", fromId: "generator", toId: "critic" }
    ]
  }
];
