import React, { useState } from 'react';
import IntegrationHub from './components/IntegrationHub';
import MemoryHub from './components/MemoryHub';
import SelfCorrectionConsole from './components/SelfCorrectionConsole';
import WorkflowAutomationCenter from './components/WorkflowAutomationCenter';
import SystemsTestingSuite from './components/SystemsTestingSuite';
import TaskDecomposer from './components/TaskDecomposer';

// Import and Register Chart.js Components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

interface AgentNode {
  id: string;
  name: string;
  role: string;
  type: string;
  temp: number;
}

function App() {
  // Theme & Node Selection State
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [selectedNodeId, setSelectedNodeId] = useState<string>('1');
  const [globalTemp, setGlobalTemp] = useState<number>(0.5);

  // Simulation Terminal State
  const [payload, setPayload] = useState('Draft a corporate press release for our biodegradable running shoe, then run a regulatory risk critique and polish the marketing prose.');
  const [logs, setLogs] = useState<string[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  const [nodes, setNodes] = useState<AgentNode[]>([
    { id: '1', name: 'Input Intake', role: 'Requirement ingestion point', type: 'Intake', temp: 0.5 },
    { id: '2', name: 'Content Draftsman', role: 'Creative Copywriter', type: 'Agent', temp: 0.7 },
    { id: '3', name: 'Technical Auditor', role: 'Compliance & Risk Evaluator', type: 'Agent', temp: 0.2 },
    { id: '4', name: 'Editorial Refiner', role: 'Senior Polishing Editor', type: 'Agent', temp: 0.5 }
  ]);

  // Form Inputs for New Agents
  const [newNodeName, setNewNodeName] = useState('');
  const [newNodeRole, setNewNodeRole] = useState('');
  const [newNodeCategory, setNewNodeCategory] = useState('Strategic Core Agent (AI Agent)');
  const [newNodePrompt, setNewNodePrompt] = useState('');

  // Chat Interface State
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Welcome to the Multi-Agent Playground! I am your AI Orchestration Copilot. Describe your operational goal or system setup.", sender: 'ai' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Form Submission Handler for Creating New Agents
  const handleCreateAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeName.trim()) return;
    const newAgent: AgentNode = {
      id: Date.now().toString(),
      name: newNodeName,
      role: newNodeRole || 'Custom agent configuration',
      type: newNodeCategory.includes('AI Agent') ? 'Agent' : 'Utility',
      temp: globalTemp
    };
    setNodes([...nodes, newAgent]);
    setSelectedNodeId(newAgent.id);
    setNewNodeName('');
    setNewNodeRole('');
    setNewNodePrompt('');
    alert(`Successfully deployed [${newAgent.name}] node configuration to workspace.`);
  };

  // Chat Input Handler
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: Message = { id: Date.now(), text: chatInput, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');

    setTimeout(() => {
      const aiMsg: Message = {
        id: Date.now() + 1,
        text: `Orchestrator feedback: Request mapped successfully to topology schema. Evaluating graph token sequence.`,
        sender: 'ai'
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  // Global Temperature Tuning Trigger
  const handleOptimizeTemperature = () => {
    setGlobalTemp(0.2);
    setNodes(prev => prev.map(node => ({ ...node, temp: 0.2 })));
    alert("System optimization complete. All specialized expert nodes set to minimum variance (0.2°C) to neutralize model hallucinations.");
  };

  // Run Swarm Simulation Function
  const handleRunSimulation = () => {
    if (!payload.trim()) return;
    setIsSimulating(true);
    setLogs(["[INFO] Initializing Swarm Pipeline Simulation...", "[TRACE] Ingesting enterprise input payload at 'Input Intake' node."]);

    setTimeout(() => {
      setLogs(prev => [...prev, "[AGENT] 'Content Draftsman' activated: Processing creative text copy brief..."]);
    }, 1000);

    setTimeout(() => {
      setLogs(prev => [...prev, "[AUDIT] 'Technical Auditor' routing: Verifying regulatory risk and compliance metrics."]);
    }, 2200);

    setTimeout(() => {
      setLogs(prev => [...prev, "[POLISH] 'Editorial Refiner' completed: Senior alignment and prose optimization applied.", "[SUCCESS] Swarm trace timeline logging compiled. Status code: 200 OK."]);
      setIsSimulating(false);
    }, 3500);
  };

  const activeNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  // --- Chart.js Configurations ---
  const lineChartData = {
    labels: ['10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM'],
    datasets: [
      {
        label: 'API Request Load / min',
        data: isSimulating ? [45, 88, 120, 65, 95, 140] :,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const doughnutChartData = {
    labels: ['Success Rate', 'Idle Buffer', 'Error Anomalies'],
    datasets: [
      {
        data: globalTemp === 0.2 ? [98, 1, 1] :,
        backgroundColor: ['#10b981', '#475569', '#ef4444'],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className={`min-h-screen font-sans p-6 transition-colors duration-300 ${theme === 'dark' ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Header */}
      <header className={`max-w-7xl mx-auto mb-8 border-b pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-blue-500 tracking-tight">THE AI SYSTEMS ARCHITECT</h1>
            <span className="text-xs font-mono bg-slate-800 text-blue-400 border border-blue-900 px-2 py-0.5 rounded mt-1">Core Engine v3.5</span>
          </div>
          <p className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} text-sm mt-1`}>
            Advanced orchestration workspace to design, prototype, and monitor autonomous multi-agent systems and cognitive swarms.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-800 p-1 rounded-lg border border-slate-700">
            <button onClick={() => setTheme('light')} className={`px-3 py-1 text-xs font-semibold rounded ${theme === 'light' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>Light</button>
            <button onClick={() => setTheme('dark')} className={`px-3 py-1 text-xs font-semibold rounded ${theme === 'dark' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>Dark</button>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 bg-emerald-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-emerald-500">System Live (Render)</span>
          </div>
        </div>
      </header>

      {/* Grid Layout Body */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side (2 Columns) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Blueprints Library */}
          <div className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border rounded-xl p-5 shadow-sm`}>
            <h2 className="text-xl font-bold text-blue-500 mb-2">Enterprise Blueprints Library</h2>
            <p className="text-xs text-slate-400 mb-4">Select an enterprise-grade system layout preset to instantly configure modern multi-agent topologies.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-700 hover:border-blue-500 cursor-pointer transition-all">
                <h4 className="text-sm font-bold text-slate-200">Sequential Content Refinement Pipeline (Sequential Refiner)</h4>
                <p className="text-xs text-slate-400 mt-1">Linear expert swarm starting with a creative draft, reviewed by compliance auditors, and finalized by refiners.</p>
                <span className="inline-block bg-slate-800 text-blue-400 text-[10px] px-2 py-0.5 rounded mt-2 font-semibold">4 Nodes • 3 Integrations</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-700 hover:border-blue-500 cursor-pointer transition-all">
                <h4 className="text-sm font-bold text-slate-200">Strategic Venture Coordination (Strategy Swarm)</h4>
                <p className="text-xs text-slate-400 mt-1">Parallel collective of discrete business perspectives (Finance, Marketing, Risks) resolved and merged by Integrators.</p>
                <span className="inline-block bg-slate-800 text-blue-400 text-[10px] px-2 py-0.5 rounded mt-2 font-semibold">5 Nodes • 6 Integrations</span>
              </div>
            </div>
          </div>

          {/* Node Creator Form */}
          <div className={`${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border rounded-xl p-5 shadow-sm`}>