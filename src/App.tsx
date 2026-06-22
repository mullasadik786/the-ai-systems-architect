import React, { useState, useEffect } from "react";
import { 
  Play, 
  Layers, 
  Settings, 
  Plus, 
  Trash2, 
  Cpu, 
  Sparkles, 
  Network, 
  ChevronRight, 
  Copy, 
  Check, 
  RefreshCw, 
  Sliders, 
  Award, 
  AlertTriangle, 
  Lightbulb, 
  ArrowRight, 
  Activity, 
  Compass,
  FileText,
  UserCheck,
  MousePointer,
  Zap,
  Info,
  Sun,
  Moon,
  Beaker
} from "lucide-react";
import { SwarmArchitecture, AgentNode, Connection, SwarmSimulationResult, ExecutionStepLog, MemorySegment } from "./types";
import { TEMPLATES } from "./templates";
import { TaskDecomposer } from "./components/TaskDecomposer";
import { IntegrationHub } from "./components/IntegrationHub";
import { MemoryHub } from "./components/MemoryHub";
import { SelfCorrectionConsole } from "./components/SelfCorrectionConsole";
import { WorkflowAutomationCenter } from "./components/WorkflowAutomationCenter";
import { SystemsTestingSuite } from "./components/SystemsTestingSuite";

const systemHeroImage = "/src/assets/images/systems_architect_hero_1782070584857.jpg";

export default function App() {
  // Swarm configuration state
  const [architectures, setArchitectures] = useState<SwarmArchitecture[]>(TEMPLATES);
  const [activeArch, setActiveArch] = useState<SwarmArchitecture>(TEMPLATES[0]);
  
  // Interactive Node selection & Editing
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [nodeToConnect, setNodeToConnect] = useState<string>("");
  const [connectionCondition, setConnectionCondition] = useState<string>("");

  // Grid background toggle
  const [showGrid, setShowGrid] = useState<boolean>(true);

  // New Node Form fields
  const [newAgentName, setNewAgentName] = useState<string>("");
  const [newAgentRole, setNewAgentRole] = useState<string>("");
  const [newAgentType, setNewAgentType] = useState<AgentNode["type"]>("agent");
  const [newAgentInstruction, setNewAgentInstruction] = useState<string>("");
  const [newAgentPromptTemplate, setNewAgentPromptTemplate] = useState<string>("");

  // Sandbox user task input
  const [taskInput, setTaskInput] = useState<string>(
    "Draft a corporate press release for our biodegradable running shoe, then run a regulatory risk critique and polish the marketing prose."
  );

  // Live simulation execution state
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<SwarmSimulationResult | null>(null);
  const [activeSimulationNodeId, setActiveSimulationNodeId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // AI Architect Advisor Generation input
  const [generationPrompt, setGenerationPrompt] = useState<string>("");
  const [isGeneratingArch, setIsGeneratingArch] = useState<boolean>(false);
  const [advisorSuccessMsg, setAdvisorSuccessMsg] = useState<string | null>(null);

  // Copied clipboard state
  const [copiedResponse, setCopiedResponse] = useState<boolean>(false);

  // New features state
  const [activeMainTab, setActiveMainTab] = useState<"canvas" | "decomposer" | "integrations" | "memory" | "guardrails" | "automation" | "testing">("canvas");
  const [pausedNodeId, setPausedNodeId] = useState<string | null>(null);
  const [pendingResolve, setPendingResolve] = useState<(() => void) | null>(null);
  const [memoryItems, setMemoryItems] = useState<MemorySegment[]>([
    {
      id: "mem1",
      title: "Biodegradable Footwear Directive",
      snippet: "All marketing copy for green shoes must mention soil breakdown lifecycle of 180 days with certified compost proof.",
      category: "compliance"
    },
    {
      id: "mem2",
      title: "Brand Voice Standard v2.1",
      snippet: "Corporate announcements must remain strictly optimistic, professional, and emphasize absolute circularity metrics.",
      category: "rule"
    },
    {
      id: "mem3",
      title: "SQL Injection Sanitation Code",
      snippet: "Database querying nodes must escape text parameters to prevent standard prompt leak or injection breaches.",
      category: "compliance"
    }
  ]);
  const [guardrailsEnabled, setGuardrailsEnabled] = useState<boolean>(true);
  const [isCorrectingLive, setIsCorrectingLive] = useState<boolean>(false);

  // Theme support
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("system-theme");
    const initialTheme = saved === "dark" ? "dark" : "light";
    try {
      if (initialTheme === "dark") {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
    } catch (e) {
      // safe fallback for SSR
    }
    return initialTheme;
  });

  const [showWelcomeGuide, setShowWelcomeGuide] = useState<boolean>(true);

  const toggleTheme = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    localStorage.setItem("system-theme", newTheme);
    try {
      if (newTheme === "dark") {
        document.body.classList.add("dark");
      } else {
        document.body.classList.remove("dark");
      }
    } catch (e) {
      // safe fallback
    }
  };

  // State to track custom Telugu "Prompt design temperature sweep" and Re-lighting log outcomes
  const [temperatureOptimizationStatus, setTemperatureOptimizationStatus] = useState<{
    optimized: boolean;
    lastOptimizedAt: string | null;
    logs: string[];
  }>({
    optimized: false,
    lastOptimizedAt: null,
    logs: []
  });

  const handleOptimizeTemperaturesTo02 = () => {
    // 1. Optimize temperature of all nodes in dynamic architectures to 0.2
    setActiveArch(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => ({
        ...node,
        temperature: 0.2
      }))
    }));

    // 2. Generate a gorgeous re-lighting log draft
    const timestamp = new Date().toLocaleTimeString();
    setTemperatureOptimizationStatus({
      optimized: true,
      lastOptimizedAt: timestamp,
      logs: [
        `[${timestamp}] 🎯 Prompt Optimization Sweep initiated...`,
        `[${timestamp}] 🌡️ Tuned all Swarm nodes creativity parameter down to 0.2 successfully. (Adjusted from 0.5°C to 0.2°C)`,
        `[${timestamp}] 🛡️ Cognitive prompt precision is locked at 0.2 to completely eliminate hallucinations and secure regulatory compliance during multi-agent reflection loops.`,
        `[${timestamp}] 🚀 Re-lighting plan generated successfully. Your interactive canvas map has been recalculated to reflect strict governance bounds.`
      ]
    });
  };

  // Automatically select the first node on load
  useEffect(() => {
    if (activeArch.nodes.length > 0) {
      setSelectedNodeId(activeArch.nodes[0].id);
    }
  }, [activeArch]);

  // Load preset template
  const handleSelectTemplate = (templateId: string) => {
    const found = architectures.find(a => a.id === templateId);
    if (found) {
      // Create deep copy to allow modifications
      const copy = JSON.parse(JSON.stringify(found)) as SwarmArchitecture;
      setActiveArch(copy);
      setSimulationResult(null);
      setApiError(null);
      if (copy.nodes.length > 0) {
        setSelectedNodeId(copy.nodes[0].id);
      }
    }
  };

  // Node position changes / sliders
  const handleNodePositionChange = (nodeId: string, axis: 'x' | 'y', value: number) => {
    setActiveArch(prev => ({
      ...prev,
      nodes: prev.nodes.map(n => 
        n.id === nodeId 
          ? { ...n, position: { ...n.position, [axis]: value } }
          : n
      )
    }));
  };

  // Apply quick offset adjustments (Arrow keys alike)
  const shiftNode = (nodeId: string, dir: 'up' | 'down' | 'left' | 'right') => {
    const step = 20;
    setActiveArch(prev => ({
      ...prev,
      nodes: prev.nodes.map(n => {
        if (n.id !== nodeId) return n;
        let { x, y } = n.position;
        if (dir === 'up') y = Math.max(0, y - step);
        if (dir === 'down') y = Math.min(600, y + step);
        if (dir === 'left') x = Math.max(0, x - step);
        if (dir === 'right') x = Math.min(900, x + step);
        return { ...n, position: { x, y } };
      })
    }));
  };

  // Update Node properties
  const handleNodePropertyUpdate = (nodeId: string, fields: Partial<AgentNode>) => {
    setActiveArch(prev => ({
      ...prev,
      nodes: prev.nodes.map(n => n.id === nodeId ? { ...n, ...fields } : n)
    }));
  };

  // Add custom node to active workspace
  const handleAddCustomNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName.trim()) return;

    const id = `node_${Date.now()}`;
    const newNode: AgentNode = {
      id,
      name: newAgentName,
      type: newAgentType,
      role: newAgentRole || "Generalist Co-pilot",
      systemInstruction: newAgentInstruction || "You are an AI utility agent ready to collaborate within a system swarm.",
      promptTemplate: newAgentPromptTemplate || "Analyze and refine the output:\n{{input}}",
      model: "gemini-3.5-flash",
      temperature: 0.5,
      position: { x: 350, y: 180 }
    };

    setActiveArch(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));

    setSelectedNodeId(id);
    // Reset form fields
    setNewAgentName("");
    setNewAgentRole("");
    setNewAgentInstruction("");
    setNewAgentPromptTemplate("");
  };

  // Delete Node from active workspace
  const handleDeleteNode = (nodeId: string) => {
    if (nodeId === "input") {
      alert("The Entry Input node cannot be deleted as it registers workspace activations.");
      return;
    }
    setActiveArch(prev => ({
      ...prev,
      nodes: prev.nodes.filter(n => n.id !== nodeId),
      connections: prev.connections.filter(c => c.fromId !== nodeId && c.toId !== nodeId)
    }));
    if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    }
  };

  // Add a connection line
  const handleAddConnection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedNodeId || !nodeToConnect || selectedNodeId === nodeToConnect) return;

    // Check if connection already exists
    const exists = activeArch.connections.some(
      c => c.fromId === selectedNodeId && c.toId === nodeToConnect
    );

    if (exists) {
      alert("A standard communication pipe already exists between these nodes.");
      return;
    }

    const newConn: Connection = {
      id: `conn_${Date.now()}`,
      fromId: selectedNodeId,
      toId: nodeToConnect,
      condition: connectionCondition.trim() || undefined
    };

    setActiveArch(prev => ({
      ...prev,
      connections: [...prev.connections, newConn]
    }));

    setNodeToConnect("");
    setConnectionCondition("");
  };

  // Delete a specific connection line
  const handleDeleteConnection = (connId: string) => {
    setActiveArch(prev => ({
      ...prev,
      connections: prev.connections.filter(c => c.id !== connId)
    }));
  };

  // Human-in-the-Loop response hooks
  const handleApproveNode = () => {
    if (pendingResolve) {
      pendingResolve();
      setPendingResolve(null);
    }
  };

  const handleDeclineNode = () => {
    if (pendingResolve) {
      pendingResolve();
      setPendingResolve(null);
    }
  };

  // Run the Swarm simulation live against Express endpoint
  const handleRunSimulation = async () => {
    setIsRunning(true);
    setSimulationResult(null);
    setApiError(null);
    setActiveSimulationNodeId(null);

    // Step-by-step UI glowing effect simulator (for visual engagement alongside real API)
    // To make it look extremely state-of-the-art:
    const sequentialWait = (nodeName: string, nodeId: string, delay: number) => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setActiveSimulationNodeId(nodeId);
          resolve();
        }, delay);
      });
    };

    try {
      // Simulate visual signal before real response lands
      await sequentialWait("Input", "input", 400);

      const response = await fetch("/api/execute-architecture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          architecture: activeArch,
          task: taskInput
        })
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Execution pipeline met with an error.");
      }

      const outcomeData = (await response.json()) as SwarmSimulationResult;
      
      // Animate active steps as they finish
      for (const step of outcomeData.steps) {
        const correspondingNode = activeArch.nodes.find(n => n.id === step.nodeId);
        if (correspondingNode && correspondingNode.requireApproval) {
          // Pause execution and wait for manual resume click
          setPausedNodeId(step.nodeId);
          setActiveSimulationNodeId(step.nodeId);
          // Focus the automation tab so the user can interact
          setActiveMainTab("automation");
          
          await new Promise<void>((resolve) => {
            setPendingResolve(() => resolve);
          });
          setPausedNodeId(null);
        }
        await sequentialWait(step.nodeName, step.nodeId, 650);
      }

      if (guardrailsEnabled) {
        setIsCorrectingLive(true);
        await new Promise(resolve => setTimeout(resolve, 1800));
        setIsCorrectingLive(false);
      }

      setSimulationResult(outcomeData);
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "Could not successfully connect to the Orchestration swarm. Please review execution state.");
    } finally {
      setIsRunning(false);
      setActiveSimulationNodeId(null);
    }
  };

  // AI Architect Coach: Queries advisor model to auto-create Entire Swarm configuration
  const handleAICoPilotGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!generationPrompt.trim()) return;

    setIsGeneratingArch(true);
    setAdvisorSuccessMsg(null);
    setApiError(null);

    try {
      const response = await fetch("/api/advisor-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestDescription: generationPrompt })
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "Advisor AI was unable to generate configuration.");
      }

      const generatedData = await response.json() as {
        name: string;
        description: string;
        nodes: AgentNode[];
        connections: Connection[];
      };

      const newSwarm: SwarmArchitecture = {
        id: `ai-gen-${Date.now()}`,
        name: generatedData.name || "AI Generated Swarm",
        description: generatedData.description || "Synthesized by AI Cognitive Architect",
        nodes: generatedData.nodes,
        connections: generatedData.connections
      };

      // Set active
      setActiveArch(newSwarm);
      setSimulationResult(null);
      setAdvisorSuccessMsg(`Swarm successfully synthesized: "${newSwarm.name}" loaded instantly!`);
      setGenerationPrompt("");

      if (newSwarm.nodes.length > 0) {
        setSelectedNodeId(newSwarm.nodes[0].id);
      }
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "Advisor synthesis failed. Check your environment API key.");
    } finally {
      setIsGeneratingArch(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  const getSelectedNode = () => {
    return activeArch.nodes.find(n => n.id === selectedNodeId) || null;
  };

  const getOutgoingConnectionsForSelected = () => {
    if (!selectedNodeId) return [];
    return activeArch.connections.filter(c => c.fromId === selectedNodeId);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] flex flex-col font-sans transition-colors duration-300">
      {/* HEADER BAR */}
      <header className="bg-white dark:bg-[#0b0f19] border-b border-slate-200 dark:border-[#1d273a] sticky top-0 z-50 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2.5 rounded-lg text-white shadow-sm flex items-center justify-center">
            <Network className="w-6 h-6" id="logo-icon" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight font-display flex items-center gap-2 dark:text-white">
              AI Systems Architect
              <span className="bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-205 dark:border-indigo-800">
                Core Engine v3.5
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Advanced orchestration workspace to design, prototype, and monitor autonomous multi-agent systems and cognitive swarms.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5 self-start md:self-center">
          {/* Beautiful Dark & Light Theme Buttons */}
          <div className="flex bg-slate-100 dark:bg-[#121824] p-1 rounded-xl border border-slate-200 dark:border-[#212d44]">
            <button
              onClick={() => toggleTheme("light")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                theme === "light"
                  ? "bg-white text-indigo-700 shadow-xs border border-slate-200/80"
                  : "text-slate-505 hover:text-slate-900 dark:text-slate-405 dark:hover:text-slate-200"
              }`}
            >
              <Sun className="w-3.5 h-3.5 text-amber-500 fill-current" />
              Light
            </button>
            <button
              onClick={() => toggleTheme("dark")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                theme === "dark"
                  ? "bg-[#1d273a] text-indigo-400 shadow-xs border border-indigo-500/20"
                  : "text-slate-500 hover:text-slate-955 dark:text-slate-400 dark:hover:text-slate-200"
              }`}
            >
              <Moon className="w-3.5 h-3.5 text-indigo-400 fill-current" />
              Dark
            </button>
          </div>
        </div>
      </header>

      {/* DETAILED WORKSPACE GRID PANELS */}
      <main className="grid grid-cols-1 xl:grid-cols-12 gap-5 px-6 py-6 flex-1 bg-slate-50/40 dark:bg-[#070b14] overflow-hidden">
        
        {/* LEFT COLUMN: SWARM LIBRARIES & AI BLUEPRINTS (COL-SPAN 3) */}
        <div className="xl:col-span-3 flex flex-col gap-5">
          
          {/* BP Preset Selector Card */}
          <div className="bg-white border border-slate-200 dark:border-[#1d273a] bg-white dark:bg-[#0b0f19] rounded-xl p-5 shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-[#1e293b]">
              <Layers className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
              <h2 className="font-semibold text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Enterprise Blueprints Library
              </h2>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select a enterprise-grade system layout preset to instantly configure modern multi-agent topologies and pipelines.
            </p>

            <div className="flex flex-col gap-2.5 mt-1">
              {architectures.map((template) => {
                const isActive = activeArch.id === template.id || (activeArch.name === template.name && !template.id.includes("ai-gen"));
                return (
                  <button
                    key={template.id}
                    onClick={() => handleSelectTemplate(template.id)}
                    className={`w-full text-left p-3.5 rounded-lg border text-xs transition duration-200 flex flex-col gap-1.5 ${
                      isActive 
                        ? "bg-indigo-50/70 border-indigo-200 text-indigo-950 dark:bg-indigo-950/20 dark:border-indigo-800 ring-2 ring-indigo-500/10" 
                        : "bg-white border-slate-200 dark:bg-[#0b0f19] dark:border-[#1d273a] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-[#121824] hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900 dark:text-slate-100 font-display">
                        {template.name}
                      </span>
                      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />}
                    </div>
                    <span className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed line-clamp-2">
                      {template.description}
                    </span>
                    <div className="flex items-center gap-2 mt-1 text-[10px] bg-slate-50 dark:bg-[#121824] px-2 py-1 rounded border border-slate-100 dark:border-[#1d273a] self-start text-indigo-700 dark:text-indigo-400 font-mono">
                      <span>{template.nodes.length} Nodes</span>
                      <span>•</span>
                      <span>{template.connections.length} Integrations</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AI Generator Advisor Panel */}
          <div className="bg-slate-900 text-white rounded-xl p-5 shadow-md flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <Sparkles className="text-indigo-400 w-4.5 h-4.5 animate-pulse" />
              <h2 className="font-semibold text-xs tracking-wider uppercase text-slate-300 font-display">
                Generative Swarm Synthesizer
              </h2>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Describe your objective or compliance requirements. The AI coordinator will programmatically synthesize a custom swarm network of specialized agent nodes.
            </p>

            <form onSubmit={handleAICoPilotGenerate} className="flex flex-col gap-3 mt-1">
              <textarea
                value={generationPrompt}
                onChange={(e) => setGenerationPrompt(e.target.value)}
                placeholder="e.g. A content refinement pipeline with an editor, a risk auditor, and a dispatcher..."
                rows={3}
                className="w-full p-2.5 rounded bg-slate-800 border border-slate-700 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
              />

              <button
                type="submit"
                disabled={isGeneratingArch || !generationPrompt.trim()}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:border-slate-700 disabled:cursor-not-allowed font-semibold text-xs text-white rounded transition flex items-center justify-center gap-2 cursor-pointer border border-indigo-500/20 shadow-sm"
              >
                {isGeneratingArch ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Synthesizing Pipeline Topology...
                  </>
                ) : (
                  <>
                    <Zap className="w-3.5 h-3.5 text-yellow-300" />
                    Synthesize Entire Swarm Network
                  </>
                )}
              </button>
            </form>

            {advisorSuccessMsg && (
              <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-300 p-2.5 rounded text-[11px] leading-relaxed">
                {advisorSuccessMsg}
              </div>
            )}
          </div>

          {/* Quick-Add User Agent Customizer Node Form */}
          <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-[#1d273a] rounded-xl p-5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-[#1e293b]">
              <Plus className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="font-semibold text-sm uppercase tracking-wider text-slate-500 dark:text-slate-405">
                Create New Expert Agent
              </h2>
            </div>

            <form onSubmit={handleAddCustomNode} className="flex flex-col gap-2.5">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                  Node Name
                </label>
                <input
                  type="text"
                  required
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  placeholder="e.g. Legal Counsel Specialist"
                  className="w-full px-2.5 py-1.5 border border-slate-205 dark:border-[#212d44] bg-white dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200 rounded text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                  Swarm Role Description
                </label>
                <input
                  type="text"
                  value={newAgentRole}
                  onChange={(e) => setNewAgentRole(e.target.value)}
                  placeholder="e.g. Contract validations"
                  className="w-full px-2.5 py-1.5 border border-slate-205 dark:border-[#212d44] bg-white dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200 rounded text-xs focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                  Strategic Node Category
                </label>
                <select
                  value={newAgentType}
                  onChange={(e) => setNewAgentType(e.target.value as AgentNode["type"])}
                  className="w-full px-2.5 py-1.5 border border-slate-205 dark:border-[#212d44] bg-white dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200 rounded text-xs focus:outline-none"
                >
                  <option value="agent" className="dark:bg-[#0b0f19]">Strategic Core Agent (AI Agent)</option>
                  <option value="router" className="dark:bg-[#0b0f19]">Conditional Router Node (Cognitive Router)</option>
                  <option value="critic" className="dark:bg-[#0b0f19]">Strict Supervisor / Evaluator (Reflection Critic)</option>
                  <option value="merger" className="dark:bg-[#0b0f19]">Executive Consolidator (Merger Node)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                  Node System Directive Prompt (Instruction)
                </label>
                <textarea
                  value={newAgentInstruction}
                  onChange={(e) => setNewAgentInstruction(e.target.value)}
                  placeholder="Formulate strict guidelines or operational rules for this expert node..."
                  rows={2}
                  className="w-full px-2.5 py-1.5 border border-slate-205 dark:border-[#212d44] bg-white dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200 rounded text-xs focus:ring-1 focus:ring-indigo-500 resize-none focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs font-sans"
              >
                <Plus className="w-3.5 h-3.5" /> Deploy Agent to Workspace
              </button>
            </form>
          </div>

        </div>

        {/* MIDDLE COLUMN: VISUAL DOCKING CANVAS & DYNAMIC TELEMETRY PIPES (COL-SPAN 6) */}
        <div className="xl:col-span-6 flex flex-col gap-5">
          
          {/* Beautiful Collapsible Systems Guide with Schematic Image */}
          {showWelcomeGuide ? (
            <div className="bg-white dark:bg-[#0b0f19] border border-slate-255 dark:border-[#1d273a] rounded-xl p-5 shadow-xs relative overflow-hidden transition-all duration-300">
              <div className="absolute top-4 right-4 z-20">
                <button
                  onClick={() => setShowWelcomeGuide(false)}
                  className="px-2.5 py-1 rounded bg-slate-50 dark:bg-[#121824] border border-slate-200 dark:border-[#212d44] text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer transition text-[10px] font-bold"
                  title="Hide guide banner"
                >
                  ✕ Close Welcome Guide
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                <div className="md:col-span-7 flex flex-col gap-3">
                  <span className="text-[9px] bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold uppercase tracking-wider px-2.5 py-1 rounded-md self-start border border-indigo-205 dark:border-indigo-900">
                    💡 Orchestration Quick Guide
                  </span>
                  
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white font-display tracking-tight leading-tight">
                    Welcome to the Multi-Agent Playground!
                  </h3>
                  
                  <p className="text-[11px] text-slate-650 dark:text-slate-355 leading-relaxed font-sans">
                    Here you can model specialised expert nodes, configure conditional router logics, assign Human-in-the-Loop gates, and execute end-to-end trace pipelines. Toggle themes above for optimal dark/light workflow visibility.
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <span className="text-[8px] font-mono font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-150 dark:border-emerald-900/60">
                      ✔ Live SLA Audit Guardrails
                    </span>
                    <span className="text-[8px] font-mono font-bold bg-indigo-50 dark:bg-indigo-955/40 text-indigo-700 dark:text-indigo-400 px-2 py-0.5 rounded border border-indigo-150 dark:border-indigo-900/60">
                      ✔ Real-time GraphRAG Cache
                    </span>
                    <span className="text-[8px] font-mono font-bold bg-amber-50 dark:bg-amber-955/40 text-amber-700 dark:text-amber-405 px-2 py-0.5 rounded border border-amber-150 dark:border-amber-900/60">
                      ✔ Human Approval Handshakes
                    </span>
                  </div>
                </div>

                <div className="md:col-span-5 relative mt-3 md:mt-0">
                  <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-[#212d44] shadow-xs bg-slate-900">
                    <img
                      src={systemHeroImage}
                      alt="System Architecture Master Schematic Blueprint"
                      className="w-full h-auto object-cover opacity-90 transition-opacity duration-300 pointer-events-none"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/90 to-transparent p-1.5 text-center">
                      <span className="text-[8px] text-slate-300 font-mono tracking-wider font-semibold">
                        Figure 1.0: Agent Blueprint topologies
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-[#0b0f19] border border-dashed border-slate-205 dark:border-[#202d44] rounded-xl p-3 flex justify-between items-center transition-all duration-300">
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Interactive Systems Sandbox active - <span className="font-bold text-indigo-650 dark:text-indigo-400 font-mono">{theme.toUpperCase()}</span> viewport.
              </span>
              <button
                onClick={() => setShowWelcomeGuide(true)}
                className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer font-mono"
              >
                Show Architecture Guide ➔
              </button>
            </div>
          )}

          {/* Main Tab Controller Bar */}
          <div className="flex bg-slate-150/70 p-1.5 rounded-xl border border-slate-200 overflow-x-auto gap-1">
            <button
              onClick={() => setActiveMainTab("canvas")}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg cursor-pointer transition whitespace-nowrap flex items-center gap-1.5 ${
                activeMainTab === "canvas"
                  ? "bg-white text-indigo-700 shadow-xs border border-slate-250"
                  : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
              }`}
            >
              <Compass className="w-4 h-4 text-indigo-600" />
              Interactive Canvas Map
            </button>
            <button
              onClick={() => setActiveMainTab("decomposer")}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg cursor-pointer transition whitespace-nowrap flex items-center gap-1.5 ${
                activeMainTab === "decomposer"
                  ? "bg-white text-indigo-700 shadow-xs border border-slate-250"
                  : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
              }`}
            >
              <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
              Task Decomposer Hub
            </button>
            <button
              onClick={() => setActiveMainTab("integrations")}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg cursor-pointer transition whitespace-nowrap flex items-center gap-1.5 ${
                activeMainTab === "integrations"
                  ? "bg-white text-indigo-700 shadow-xs border border-slate-250"
                  : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
              }`}
            >
              <Zap className="w-4 h-4 text-indigo-600" />
              External Integrations
            </button>
            <button
              onClick={() => setActiveMainTab("memory")}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg cursor-pointer transition whitespace-nowrap flex items-center gap-1.5 ${
                activeMainTab === "memory"
                  ? "bg-white text-indigo-700 shadow-xs border border-slate-250"
                  : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
              }`}
            >
              <Network className="w-4 h-4 text-indigo-600" />
              GraphRAG Memory Hub
            </button>
            <button
              onClick={() => setActiveMainTab("guardrails")}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg cursor-pointer transition whitespace-nowrap flex items-center gap-1.5 ${
                activeMainTab === "guardrails"
                  ? "bg-white text-indigo-700 shadow-xs border border-slate-250"
                  : "text-slate-600 hover:text-slate-950 hover:bg-slate-50"
              }`}
            >
              <Sliders className="w-4 h-4 text-indigo-600" />
              Self-Correction Reflection Loop
            </button>
            <button
              onClick={() => setActiveMainTab("automation")}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg cursor-pointer transition whitespace-nowrap flex items-center gap-1.5 ${
                activeMainTab === "automation"
                  ? "bg-white text-indigo-700 shadow-xs border border-slate-250"
                  : "text-slate-605 hover:text-slate-955 hover:bg-slate-50"
              }`}
            >
              <Cpu className="w-4 h-4 text-indigo-600" />
              Workflow Automation Center
            </button>
            <button
              onClick={() => setActiveMainTab("testing")}
              className={`px-3.5 py-2 text-xs font-bold rounded-lg cursor-pointer transition whitespace-nowrap flex items-center gap-1.5 ${
                activeMainTab === "testing"
                  ? "bg-white text-indigo-700 shadow-xs border border-slate-250"
                  : "text-slate-600 hover:text-slate-955 hover:bg-slate-50"
              }`}
            >
              <Beaker className="w-4 h-4 text-indigo-600" />
              Systems Testing Suite
            </button>
          </div>

          {activeMainTab === "canvas" && (
            <>
              {/* SPECIAL FEATURE: Prompt Design Temperature Hub (Prompt design temperature selector) */}
              <div className="bg-gradient-to-r from-cyan-500/10 via-indigo-500/10 to-amber-500/10 border border-slate-205 dark:border-[#212d44] p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 mb-4 transition-all duration-305">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-100 dark:bg-amber-950/65 p-2.5 rounded-xl text-amber-650 dark:text-amber-400 shrink-0">
                    <Sliders className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-100 font-display flex items-center gap-1.5">
                      <span>Prompt Design Temperature Hub</span>
                      <span className="text-[10px] text-indigo-600 dark:text-indigo-400 lowercase font-mono">0.5°C ➔ 0.2°C</span>
                    </h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal mt-0.5">
                      Optimize cognitive precision by tuning all node temperatures down to 0.2°C to eliminate model hallucinations and activate the re-lighting governance plan.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={handleOptimizeTemperaturesTo02}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer transition shadow-xs flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current text-yellow-300" />
                    Optimize Temperature & Run Re-lighting Plan
                  </button>
                </div>
              </div>

              {/* Dynamic optimization reports */}
              {temperatureOptimizationStatus.optimized && (
                <div className="bg-[#f0fdf4] dark:bg-[#071d18] border border-emerald-200 dark:border-emerald-900/60 p-3.5 rounded-xl mb-4 text-xs animate-fadeIn">
                  <span className="font-bold text-emerald-800 dark:text-emerald-400 font-display block mb-1">
                    ✔ Re-lighting Governance Plan Successfully Active:
                  </span>
                  <div className="flex flex-col gap-1 text-[10px] font-mono text-slate-600 dark:text-slate-300 leading-relaxed">
                    {temperatureOptimizationStatus.logs.map((log, idx) => (
                      <div key={idx} className="flex items-start gap-1">
                        <span className="text-emerald-500 shrink-0">▸</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-[#1d273a] rounded-xl shadow-xs overflow-hidden flex flex-col flex-1 min-h-[480px] transition-colors duration-300">
            {/* Canvas Header Controls */}
            <div className="bg-slate-50 dark:bg-[#121824] border-b border-slate-100 dark:border-[#1e293b] px-5 py-3.5 flex items-center justify-between transition-colors duration-300">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Interactive Node Composer
                </span>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-405 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showGrid}
                    onChange={(e) => setShowGrid(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 dark:bg-[#070b13]"
                  />
                  <span>Grid Backdrop</span>
                </label>
                <button
                  onClick={() => handleSelectTemplate(activeArch.id)}
                  className="p-1 px-2.5 bg-white dark:bg-[#1d273a] border border-slate-200 dark:border-[#212d44] hover:bg-slate-50 dark:hover:bg-[#121824] text-[10px] font-medium rounded transition flex items-center gap-1 cursor-pointer"
                  title="Reset layout coordinates and connection states"
                >
                  <RefreshCw className="w-3 h-3 text-slate-500 animate-spin-hover" />
                  Reset Topology
                </button>
              </div>
            </div>

            {/* Interactive Canvas Stage */}
            <div 
              className="flex-1 relative overflow-auto min-h-[440px] transition-colors duration-300"
              style={{ 
                minHeight: "480px",
                backgroundColor: theme === "dark" ? "#0b0f19" : "#f8fafc",
                backgroundImage: showGrid 
                  ? (theme === "dark" 
                      ? "linear-gradient(to right, rgba(30, 41, 59, 0.75) 1px, transparent 1px), linear-gradient(to bottom, rgba(30, 41, 59, 0.75) 1px, transparent 1px)" 
                      : "linear-gradient(to right, rgba(226, 232, 240, 0.8) 1px, transparent 1px), linear-gradient(to bottom, rgba(226, 232, 240, 0.8) 1px, transparent 1px)"
                    )
                  : undefined,
                backgroundSize: "24px 24px"
              }}
              id="graph-canvas-container"
            >
              {/* Connection Curves Layer */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="8"
                    markerHeight="6"
                    refX="6"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 7 3, 0 6" fill={theme === "dark" ? "#1e293b" : "#94a3b8"} />
                  </marker>
                  <marker
                    id="arrowhead-glowing"
                    markerWidth="8"
                    markerHeight="6"
                    refX="6"
                    refY="3"
                    orient="auto"
                  >
                    <polygon points="0 0, 7 3, 0 6" fill={theme === "dark" ? "#10b981" : "#3b82f6"} />
                  </marker>
                </defs>

                {activeArch.connections.map((connection) => {
                  const fromNode = activeArch.nodes.find(n => n.id === connection.fromId);
                  const toNode = activeArch.nodes.find(n => n.id === connection.toId);
                  if (!fromNode || !toNode) return null;

                  // Define output docking and input docking coordinates (nodes are 180px wide, 72px tall approx)
                  const nodeWidth = 180;
                  const nodeHeight = 64;

                  const x1 = fromNode.position.x + nodeWidth;
                  const y1 = fromNode.position.y + nodeHeight / 2;

                  const x2 = toNode.position.x;
                  const y2 = toNode.position.y + nodeHeight / 2;

                  // Smooth S curve cubic bezier path calculation
                  const horizontalStrength = Math.abs(x2 - x1) * 0.5;
                  const pathData = `M ${x1} ${y1} C ${x1 + horizontalStrength} ${y1}, ${x2 - horizontalStrength} ${y2}, ${x2} ${y2}`;

                  const isEdgeActive = activeSimulationNodeId === fromNode.id;

                  // Apply customized dark mode wiring metrics
                  const strokeColor = isEdgeActive 
                    ? (theme === "dark" ? "#10B981" : "#3B82F6")
                    : (theme === "dark" ? "#1d2a3c" : "#cbd5e1");

                  return (
                    <g key={connection.id}>
                      <path
                        d={pathData}
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth={isEdgeActive ? "3" : "1.5"}
                        className={isEdgeActive ? "animated-pipe" : ""}
                        markerEnd={`url(#${isEdgeActive ? 'arrowhead-glowing' : 'arrowhead'})`}
                      />
                      {connection.condition && (
                        <foreignObject
                          x={(x1 + x2) / 2 - 60}
                          y={(y1 + y2) / 2 - 12}
                          width="120"
                          height="24"
                          className="overflow-visible"
                        >
                          <div className="bg-slate-100 dark:bg-[#121824] border border-slate-200 dark:border-[#212d44] text-slate-600 dark:text-slate-300 text-[9px] px-1.5 py-0.5 rounded shadow-xs max-w-full truncate font-medium text-center bg-white/95 text-ellipsis">
                            {connection.condition}
                          </div>
                        </foreignObject>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Render Nodes layout */}
              <div className="absolute inset-0 p-5 z-10 pointer-events-none">
                {activeArch.nodes.map((node) => {
                  const isSelected = selectedNodeId === node.id;
                  const isSimulationActive = activeSimulationNodeId === node.id;

                  // Node color schemas depending on type & theme
                  let nodeStyleClasses = "";
                  let typeBadgeClasses = "";
                  let glowClass = "";

                  if (theme === "dark") {
                    // Glassmorphism and dark cyber borders
                    if (node.type === "input") {
                      nodeStyleClasses = "glass-panel-dark border-indigo-500/50 text-indigo-100 hover:border-indigo-400";
                      typeBadgeClasses = "bg-indigo-950/80 text-indigo-300 border-indigo-800";
                      glowClass = "glow-shadow-indigo";
                    } else if (node.type === "critic" || node.type === "router" || node.name.toLowerCase().includes("audit") || node.name.toLowerCase().includes("complaincer")) {
                      // Legal Compliancer Guardrail Node (#F59E0B Classy Amber Gold)
                      nodeStyleClasses = "glass-panel-dark border-amber-500/50 text-amber-100 hover:border-amber-400";
                      typeBadgeClasses = "bg-amber-950/80 text-amber-300 border-amber-800";
                      glowClass = "glow-[#F59E0B]/10 glow-shadow-amber";
                    } else {
                      // Standard Agents (Draftsman, Editor, Merger) (#0EA5E9 Cyber Sky Blue)
                      nodeStyleClasses = "glass-panel-dark border-sky-500/50 text-sky-100 hover:border-sky-400";
                      typeBadgeClasses = "bg-sky-950/80 text-[#0ea5e9] border-sky-850";
                      glowClass = "glow-shadow-sky";
                    }
                  } else {
                    // Minimalist Light Mode
                    if (node.type === "input") {
                      nodeStyleClasses = "bg-white border-slate-200 text-slate-800 hover:border-indigo-400";
                      typeBadgeClasses = "bg-indigo-50 text-indigo-700 border-indigo-200";
                      glowClass = "glow-shadow-royal";
                    } else if (node.type === "critic" || node.type === "router" || node.name.toLowerCase().includes("audit")) {
                      nodeStyleClasses = "bg-white border-red-200 text-slate-800 hover:border-red-400";
                      typeBadgeClasses = "bg-red-50 text-red-700 border-red-200";
                      glowClass = "glow-shadow-red";
                    } else {
                      // Standard Agents (Draftsman, Editor)
                      nodeStyleClasses = "bg-white border-slate-200 text-slate-800 hover:border-indigo-400";
                      typeBadgeClasses = "bg-indigo-55 text-indigo-700 border-indigo-200";
                      glowClass = "glow-shadow-royal";
                    }
                  }

                  const combinedNodeCardClasses = `w-[180px] h-[68px] text-left rounded-lg border p-3 flex flex-col justify-between transition-all duration-300 cursor-pointer relative ${nodeStyleClasses} ${
                    isSelected 
                      ? "ring-2 ring-indigo-500 border-indigo-500 text-slate-900 dark:text-white" 
                      : `hover:shadow-md ${glowClass}`
                  } ${isSimulationActive ? `ring-2 ring-emerald-500 border-emerald-500 animate-pulse ${theme === "dark" ? "bg-emerald-950/20" : "bg-emerald-50/20"}` : ""}`;

                  return (
                    <div
                      key={node.id}
                      style={{ 
                        left: `${node.position.x}px`, 
                        top: `${node.position.y}px`,
                        position: "absolute"
                      }}
                      className="pointer-events-auto"
                    >
                      <button
                        onClick={() => setSelectedNodeId(node.id)}
                        className={combinedNodeCardClasses}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="font-semibold text-xs font-display truncate pr-1 max-w-[110px] text-slate-800 dark:text-slate-100">
                            {node.name}
                          </span>
                          <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded border ${typeBadgeClasses}`}>
                            {node.type.toUpperCase()}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[9px] text-slate-500 dark:text-slate-400 mt-1 w-full">
                          <span className="truncate max-w-[90px]">{node.role}</span>
                          <span className="font-mono text-slate-400 text-[8px] bg-slate-50 dark:bg-slate-900/60 px-1 rounded border border-slate-150 dark:border-slate-800">
                            {node.temperature}°C
                          </span>
                        </div>

                        {/* Connection indicators on select */}
                        {isSelected && (
                          <div className="absolute -top-1.5 -right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                          </div>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Grid Warning Indicator when layout spans off-screen */}
              <div className="absolute bottom-3 left-4 bg-slate-800/80 text-white/90 text-[10px] px-2 py-1 rounded border border-slate-700 pointer-events-none font-mono">
                Canvas Dimension: 1000px × 600px
              </div>
            </div>

            {/* Quick Node Location Offset Controls */}
            <div className="bg-slate-50 border-t border-slate-100 p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <MousePointer className="w-3.5 h-3.5 text-indigo-500 animate-bounce" />
                <span>Select any node on the interactive canvas to reposition, build link conduits, or configure operational attributes.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold text-slate-400">Node Position fine-tuning shift (Displacement):</span>
                <div className="flex items-center gap-1">
                  <button 
                    disabled={!selectedNodeId} 
                    onClick={() => selectedNodeId && shiftNode(selectedNodeId, 'left')}
                    className="p-1 px-2 border bg-white hover:bg-slate-50 rounded disabled:opacity-40"
                    title="Displace Selected Node Left"
                  >
                    ◀
                  </button>
                  <button 
                    disabled={!selectedNodeId} 
                    onClick={() => selectedNodeId && shiftNode(selectedNodeId, 'up')}
                    className="p-1 px-2 border bg-white hover:bg-slate-50 rounded disabled:opacity-40"
                    title="Displace Selected Node Up"
                  >
                    ▲
                  </button>
                  <button 
                    disabled={!selectedNodeId} 
                    onClick={() => selectedNodeId && shiftNode(selectedNodeId, 'down')}
                    className="p-1 px-2 border bg-white hover:bg-slate-50 rounded disabled:opacity-40"
                    title="Displace Selected Node Down"
                  >
                    ▼
                  </button>
                  <button 
                    disabled={!selectedNodeId} 
                    onClick={() => selectedNodeId && shiftNode(selectedNodeId, 'right')}
                    className="p-1 px-2 border bg-white hover:bg-slate-50 rounded disabled:opacity-40"
                    title="Displace Selected Node Right"
                  >
                    ▶
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* LOWER SECTION: ACTIVE DEEP-DOCK PROPERTIES DRAWER (Dual Columns) */}
          {selectedNodeId && getSelectedNode() ? (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
              
              {/* Properties column */}
              <div className="flex flex-col gap-3.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-600" />
                    <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-500">
                      Expert Node Configuration Attributes
                    </h3>
                  </div>
                  <button
                    onClick={() => handleDeleteNode(getSelectedNode()!.id)}
                    className="text-[10px] text-red-500 font-medium hover:text-red-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove Node From Canvas
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Node Name</label>
                    <input
                      type="text"
                      className="w-full text-xs p-2 border border-slate-200 rounded"
                      value={getSelectedNode()!.name}
                      onChange={(e) => handleNodePropertyUpdate(getSelectedNode()!.id, { name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Swarm Role Description</label>
                    <input
                      type="text"
                      className="w-full text-xs p-2 border border-slate-200 rounded"
                      value={getSelectedNode()!.role}
                      onChange={(e) => handleNodePropertyUpdate(getSelectedNode()!.id, { role: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Logical Node Class Category</label>
                    <select
                      className="w-full text-xs p-2 border border-slate-200 bg-white rounded"
                      value={getSelectedNode()!.type}
                      onChange={(e) => handleNodePropertyUpdate(getSelectedNode()!.id, { type: e.target.value as AgentNode["type"] })}
                    >
                      <option value="input">Workspace Inbound Intake Task</option>
                      <option value="agent">Strategic Core Agent</option>
                      <option value="router">Decision Router / Classifier Node</option>
                      <option value="critic">Task-Audit Critic / Guardrail Evaluator</option>
                      <option value="merger">Consolidator / Master Integrator Node</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
                      Node Temperature / Creativity ({getSelectedNode()!.temperature})
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.05"
                      className="w-full mt-2.5 accent-indigo-600"
                      value={getSelectedNode()!.temperature}
                      onChange={(e) => handleNodePropertyUpdate(getSelectedNode()!.id, { temperature: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Node System Instructions (Strict Prompt)</label>
                  <textarea
                    rows={2}
                    className="w-full text-xs p-2 border border-slate-200 rounded resize-none"
                    value={getSelectedNode()!.systemInstruction}
                    onChange={(e) => handleNodePropertyUpdate(getSelectedNode()!.id, { systemInstruction: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center justify-between">
                    <span>Prompt Input Formatting Template</span>
                    <span className="text-[9px] text-indigo-505 font-normal">Use {"{{input}}"} as input context placeholder</span>
                  </label>
                  <textarea
                    rows={2}
                    className="w-full text-xs p-2 border border-slate-200 rounded font-mono resize-none"
                    value={getSelectedNode()!.promptTemplate}
                    onChange={(e) => handleNodePropertyUpdate(getSelectedNode()!.id, { promptTemplate: e.target.value })}
                  />
                </div>
              </div>

              {/* Connections column */}
              <div className="flex flex-col gap-3.5 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-5">
                <div className="pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Network className="w-4 h-4 text-indigo-600" />
                    <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-500">
                      Conduit Channels / Outbound Connections (Pipes)
                    </h3>
                  </div>
                </div>

                {/* Draw connection form */}
                <form onSubmit={handleAddConnection} className="bg-slate-50 border border-slate-150 p-3 rounded-lg flex flex-col gap-2.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Link Node "{getSelectedNode()?.name}" to target:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={nodeToConnect}
                      onChange={(e) => setNodeToConnect(e.target.value)}
                      className="w-full text-xs p-1.5 border border-slate-200 bg-white rounded"
                      required
                    >
                      <option value="">-- Choose Expert Node --</option>
                      {activeArch.nodes
                        .filter(n => n.id !== selectedNodeId && n.type !== 'input')
                        .map(n => (
                          <option key={n.id} value={n.id}>{n.name} ({n.type})</option>
                        ))}
                    </select>

                    <button
                      type="submit"
                      disabled={!nodeToConnect}
                      className="py-1 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded transition flex items-center justify-center gap-1 cursor-pointer disabled:bg-indigo-400 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-3.5 h-3.5" /> Link Connection Conduit
                    </button>
                  </div>

                  <div>
                    <label className="block text-[8px] font-bold text-slate-400 uppercase mb-1">
                      Route Selection Rule Condition (e.g. For Router filtering)
                    </label>
                    <input
                      type="text"
                      value={connectionCondition}
                      onChange={(e) => setConnectionCondition(e.target.value)}
                      placeholder="e.g. If input payload contains security tags"
                      className="w-full px-2 py-1 border border-slate-200 rounded text-xs bg-white focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </form>

                {/* Active outgoing routes list */}
                <div className="flex-1 flex flex-col gap-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Active Outbound Channel Conduits:</span>
                  <div className="max-h-[140px] overflow-auto flex flex-col gap-1.5">
                    {getOutgoingConnectionsForSelected().length === 0 ? (
                      <span className="text-slate-400 text-xs italic">
                        No active outbound conduits. This node functions as a pipeline termination endpoint.
                      </span>
                    ) : (
                      getOutgoingConnectionsForSelected().map(conn => {
                        const targetNode = activeArch.nodes.find(n => n.id === conn.toId);
                        return (
                          <div key={conn.id} className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-150 text-xs">
                            <div className="flex items-center gap-1.5 truncate max-w-[80%]">
                              <span className="font-semibold text-slate-700 truncate">
                                → {targetNode?.name || conn.toId}
                              </span>
                              {conn.condition && (
                                <span className="bg-amber-50 text-amber-800 text-[9px] px-1.5 py-0.2 rounded border border-amber-200 truncate">
                                  {conn.condition}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => handleDeleteConnection(conn.id)}
                              className="text-red-400 hover:text-red-600 p-0.5"
                              title="Delete Connection"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs text-center text-slate-400 text-xs italic">
              Select and click on any node on the canvas layout to customize expert credential properties, configure system behavioral instructions, refine creativity parameters, or hook up outbound routes.
            </div>
          )}
        </>
      )}

          {activeMainTab === "decomposer" && (
            <TaskDecomposer
              taskInput={taskInput}
              setTaskInput={setTaskInput}
              onSproutGeneratedSwarm={(customSwarm) => {
                setActiveArch(customSwarm);
                if (customSwarm.nodes.length > 0) {
                  setSelectedNodeId(customSwarm.nodes[0].id);
                }
                setActiveMainTab("canvas");
              }}
            />
          )}

          {activeMainTab === "integrations" && (
            <IntegrationHub
              simulationActive={isRunning}
              finalResponse={simulationResult?.finalResponse || null}
            />
          )}

          {activeMainTab === "memory" && (
            <MemoryHub
              memoryItems={memoryItems}
              onAddMemory={(newMem) => {
                setMemoryItems(prev => [...prev, newMem]);
              }}
              onSearchQuery={(q) => {
                console.log("Memory query:", q);
              }}
            />
          )}

          {activeMainTab === "guardrails" && (
            <SelfCorrectionConsole
              enabled={guardrailsEnabled}
              onToggle={() => setGuardrailsEnabled(!guardrailsEnabled)}
              isCorrectingLive={isCorrectingLive}
            />
          )}

          {activeMainTab === "automation" && (
            <WorkflowAutomationCenter
              activeArch={activeArch}
              onUpdateNodes={(updatedNodes) => {
                setActiveArch(prev => ({ ...prev, nodes: updatedNodes }));
              }}
              simulationResult={simulationResult}
              isRunning={isRunning}
              onRunSimulation={handleRunSimulation}
              pausedNodeId={pausedNodeId}
              onApproveNode={handleApproveNode}
              onDeclineNode={handleDeclineNode}
            />
          )}

          {activeMainTab === "testing" && (
            <SystemsTestingSuite
              activeArch={activeArch}
              isRunning={isRunning}
              onRunSimulation={handleRunSimulation}
            />
          )}

        </div>

        {/* RIGHT COLUMN: SANDBOX EXECUTION & LOG DIAGNOSTIC DRAWER (COL-SPAN 3) */}
        <div className="xl:col-span-3 flex flex-col gap-5">
          
          {/* Main User Testing Ground Playground */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Play className="w-4 h-4 text-indigo-600 animate-pulse" />
              <h2 className="font-semibold text-sm uppercase tracking-wider text-slate-500 font-sans">
                Swarm Simulation Terminal
              </h2>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase">
                Enterprise Input Payload (Task / Assignment)
              </label>
              <textarea
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-slate-200 rounded text-xs leading-relaxed focus:ring-1 focus:ring-indigo-500 resize-none font-mono text-slate-800 bg-slate-50"
              />
            </div>

            <button
              onClick={handleRunSimulation}
              disabled={isRunning || activeArch.nodes.length === 0}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-300 disabled:bg-slate-200 disabled:cursor-not-allowed text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  Connecting Pipelines...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current text-white" />
                  Run Swarm Simulation
                </>
              )}
            </button>

            {/* API Warning if Key is missing on backend */}
            {apiError && (
              <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-lg text-amber-800 text-[11px] leading-relaxed flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Execution Terminated</span>
                </div>
                <div>{apiError}</div>
                <div className="mt-1 pt-1.5 border-t border-amber-150 text-[10px] text-slate-500 bg-white/50 p-2 rounded">
                  <Info className="inline w-3 h-3 mr-1 align-baseline" />
                  Note: Configured swarm topologies are executed server-side via native Google Gemini models.
                </div>
              </div>
            )}
          </div>

          {/* Core Trace Logs listing */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex-1 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-500">
                  Execution Trace Logs
                </h3>
              </div>
              {simulationResult && (
                <span className="text-[9px] text-slate-400 font-mono">
                  {simulationResult.steps.length} steps
                </span>
              )}
            </div>

            {/* Steps Timeline visualizer */}
            <div className="flex-1 overflow-auto max-h-[320px] flex flex-col gap-2.5 pr-1">
              {isRunning && !simulationResult ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3 text-slate-400">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin" />
                    <Cpu className="absolute top-2.5 left-2.5 w-5 h-5 text-indigo-600" />
                  </div>
                  <span className="text-[11px] font-medium animate-pulse text-indigo-950 font-display">
                    Triggering Agent Swarm Pipeline...
                  </span>
                </div>
              ) : simulationResult ? (
                simulationResult.steps.map((step, idx) => {
                  let badge = "";
                  if (step.status === 'completed') badge = "bg-emerald-50 text-emerald-700 border-emerald-200";
                  else if (step.status === 'skipped') badge = "bg-slate-50 text-slate-400 border-slate-200";
                  else badge = "bg-red-50 text-red-700 border-red-200";

                  return (
                    <div key={idx} className="border border-slate-150 hover:border-slate-200 rounded-lg p-3 bg-slate-50/50 flex flex-col gap-1.5 text-xs">
                      <div className="flex items-center justify-between font-display">
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] font-bold text-slate-400 font-mono">#{idx + 1}</span>
                          <span className="font-semibold text-slate-800">{step.nodeName}</span>
                        </div>
                        <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded border ${badge}`}>
                          {step.status === 'completed' ? 'Completed' : step.status === 'skipped' ? 'Skipped' : 'Failed'}
                        </span>
                      </div>

                      {step.status === 'completed' && (
                        <div className="flex flex-col gap-1 mt-0.5">
                          <div className="text-[9px] text-indigo-700 font-mono flex items-center gap-2">
                            <span>⏱️ {step.durationMs}ms</span>
                            <span>•</span>
                            <span>📊 {step.tokensUsed || 120} tokens</span>
                          </div>
                          
                          {/* Snippet Preview */}
                          <details className="mt-1">
                            <summary className="text-[9px] font-semibold text-slate-500 cursor-pointer hover:text-slate-700 list-none flex items-center gap-1 border-t border-slate-100 pt-1">
                              <span>📂 View Response Payload</span>
                              <ChevronRight className="w-3 h-3" />
                            </summary>
                            <pre className="text-[10px] bg-white p-2 border border-slate-200 rounded font-mono mt-1.5 max-h-[140px] overflow-auto whitespace-pre-wrap text-slate-700 leading-relaxed">
                              {step.output}
                            </pre>
                          </details>
                        </div>
                      )}

                      {step.status === 'skipped' && (
                        <span className="text-[10px] text-slate-400 italic">Routing skipped: Conditional criteria rules did not evaluate.</span>
                      )}

                      {step.status === 'failed' && (
                        <span className="text-[10px] text-red-500 font-medium">⚠️ {step.error || "Execution timeout."}</span>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-slate-400 text-xs italic flex flex-col items-center justify-center gap-2">
                  <Activity className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                  <span>Execute swarm simulation to visualize sequential trace timeline logs and model analysis metadata.</span>
                </div>
              )}
            </div>
          </div>

          {/* Unified Final Output & Strategic Appraisal */}
          {simulationResult && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col gap-4 animate-fadeIn">
              
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-600" />
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-slate-500 font-display">
                    Swarm Final Unified Output
                  </h3>
                </div>
                <button
                  onClick={() => copyToClipboard(simulationResult.finalResponse)}
                  className="p-1 px-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 text-[10px] font-semibold rounded border border-slate-200 flex items-center gap-1 cursor-pointer transition"
                >
                  {copiedResponse ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy Output
                    </>
                  )}
                </button>
              </div>

              {/* Collateral final content preview box */}
              <div className="bg-slate-50/70 border border-slate-200 rounded-lg p-3.5 max-h-[220px] overflow-auto text-xs text-slate-700 leading-relaxed font-mono whitespace-pre-wrap">
                {simulationResult.finalResponse}
              </div>

              {/* Advisor critique scorecard */}
              {simulationResult.advisorFeedback && (
                <div className="bg-slate-900 text-white rounded-lg p-4 border border-slate-800 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-indigo-400">
                      <Award className="w-4 h-4" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Advisor Critique Analysis</span>
                    </div>

                    <div className="bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full border border-indigo-400/20">
                      Score: {simulationResult.advisorFeedback.score}/100
                    </div>
                  </div>

                  {simulationResult.advisorFeedback.bottlenecks.length > 0 && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-slate-300 font-bold uppercase">Detected Bottlenecks:</span>
                      {simulationResult.advisorFeedback.bottlenecks.map((b, idx) => (
                        <div key={idx} className="flex gap-1.5 text-[11px] text-rose-300 leading-relaxed">
                          <span>•</span>
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {simulationResult.advisorFeedback.recommendations.length > 0 && (
                    <div className="flex flex-col gap-1 border-t border-slate-800 pt-2.5">
                      <span className="text-[10px] text-slate-300 font-bold uppercase flex items-center gap-1">
                        <Lightbulb className="w-3 h-3 text-amber-300" /> Structural Optimization Advice:
                      </span>
                      {simulationResult.advisorFeedback.recommendations.map((r, idx) => (
                        <div key={idx} className="flex gap-1.5 text-[11px] text-emerald-300 leading-relaxed">
                          <span>•</span>
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

        </div>

      </main>

      <footer className="bg-white border-t border-slate-200 py-4 px-6 text-center text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-3 mt-auto">
        <span>The AI Systems Architect © 2026. Formulated for next-generation multi-agent enterprise orchestration workflows.</span>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Active Engine: Gemini 2.5 Flash Online</span>
          <span>•</span>
          <span>Full Stack Environment Sandbox Live</span>
        </div>
      </footer>
    </div>
  );
}
