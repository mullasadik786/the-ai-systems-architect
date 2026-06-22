import React, { useState, useEffect } from "react";
import { 
  Clock, CheckCircle, AlertTriangle, ShieldCheck, Play, Pause, 
  Settings, DollarSign, Activity, RefreshCw, Layers, ArrowUpRight, Check, X
} from "lucide-react";
import { SwarmArchitecture, AgentNode, SwarmSimulationResult } from "../types";

interface WorkflowAutomationCenterProps {
  activeArch: SwarmArchitecture;
  onUpdateNodes: (nodes: AgentNode[]) => void;
  simulationResult: SwarmSimulationResult | null;
  isRunning: boolean;
  onRunSimulation: () => void;
  pausedNodeId: string | null;
  onApproveNode: () => void;
  onDeclineNode: () => void;
}

export function WorkflowAutomationCenter({
  activeArch,
  onUpdateNodes,
  simulationResult,
  isRunning,
  onRunSimulation,
  pausedNodeId,
  onApproveNode,
  onDeclineNode
}: WorkflowAutomationCenterProps) {
  // Scheduling States
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduleType, setScheduleType] = useState<"hourly" | "daily" | "weekly" | "cron">("daily");
  const [cronExpression, setCronExpression] = useState("0 9 * * 1-5");
  const [timerSeconds, setTimerSeconds] = useState(120);
  const [simulatedRuns, setSimulatedRuns] = useState<{ time: string; status: string; objective: string }[]>([
    { time: "Today, 09:00 AM", status: "completed", objective: "Complete market feasibility review for EcoShoes" },
    { time: "Yesterday, 09:00 AM", status: "completed", objective: "Automatic system security and compliance sweep" }
  ]);

  // Failover Controls
  const [fallbackModel, setFallbackModel] = useState("gemini-1.5-flash");
  const [globalRetries, setGlobalRetries] = useState(2);

  // Time Effect for Simulated Timer
  useEffect(() => {
    if (!scheduleEnabled) return;
    const interval = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          // Trigger simulated schedule round!
          const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          setSimulatedRuns(prevLogs => [
            { time: `Scheduled Dispatch (${nowStr})`, status: "completed", objective: "Automatic system compliance routine" },
            ...prevLogs.slice(0, 4)
          ]);
          return 120; // reset
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [scheduleEnabled]);

  // Node Toggles
  const toggleApprovalRequirement = (nodeId: string) => {
    const updatedNodes = activeArch.nodes.map(n => {
      if (n.id === nodeId) {
        return { ...n, requireApproval: !n.requireApproval };
      }
      return n;
    });
    onUpdateNodes(updatedNodes);
  };

  const updateNodeRetries = (nodeId: string, retriesCount: number) => {
    const updatedNodes = activeArch.nodes.map(n => {
      if (n.id === nodeId) {
        return { ...n, retries: retriesCount };
      }
      return n;
    });
    onUpdateNodes(updatedNodes);
  };

  // Cost calculation based on simulation results
  const calculateExecutionStats = () => {
    if (!simulationResult) return { tokens: 0, cost: 0, latency: 0 };
    
    let totalTokens = 0;
    let totalDuration = 0;
    
    simulationResult.steps.forEach(step => {
      if (step.status === "completed") {
        totalTokens += step.tokensUsed || 120;
        totalDuration += step.durationMs || 500;
      }
    });

    // Gemini 1k input token = $0.000075, 1k output token = $0.00015
    // Averaging $0.00011 per 1000 tokens for calculation
    const calculatedCost = (totalTokens / 1000) * 0.00011;

    return {
      tokens: totalTokens,
      cost: calculatedCost,
      latency: totalDuration
    };
  };

  const stats = calculateExecutionStats();
  const pausedNode = activeArch.nodes.find(n => n.id === pausedNodeId);

  return (
    <div className="bg-slate-50 dark:bg-[#070b13] border border-slate-200 dark:border-[#1d273a] rounded-xl p-5 shadow-xs flex flex-col gap-5 transition-colors duration-300" id="automation-root">
      
      {/* HUMAN-IN-THE-LOOP ACTIVE PAUSE CONTROL BANNER */}
      {pausedNodeId && pausedNode && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border-2 border-amber-300 dark:border-amber-900 rounded-xl p-4 flex flex-col gap-3 animate-pulse shadow-sm animate-enter">
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
            <Pause className="w-5 h-5 text-amber-600 dark:text-amber-400 fill-current animate-bounce" />
            <div>
              <span className="font-bold text-xs uppercase tracking-wider block font-display">Human Approval Required</span>
              <span className="text-[11px] text-amber-750 dark:text-amber-400">Agent execution stream is temporarily paused at node: <b className="font-mono">{pausedNode.name}</b></span>
            </div>
          </div>
          <div className="bg-white/85 dark:bg-[#121824] p-3 rounded-lg border border-amber-200/60 dark:border-amber-900/40 text-xs text-slate-800 dark:text-slate-200 flex flex-col gap-2 leading-relaxed font-mono transition-colors duration-300">
            <div><span className="text-slate-450 dark:text-slate-500">Swarm Agent Role profile:</span> {pausedNode.role}</div>
            <div><span className="text-slate-450 dark:text-slate-500">Node System Directive instruction:</span> {pausedNode.systemInstruction}</div>
          </div>
          <div className="flex gap-2 font-sans mt-0.5">
            <button
              onClick={onApproveNode}
              className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Check className="w-4 h-4" /> Approve and continue execution pipeline
            </button>
            <button
              onClick={onDeclineNode}
              className="py-2 px-4 bg-slate-200 dark:bg-[#1d273a] hover:bg-slate-300 dark:hover:bg-[#121824] text-slate-750 dark:text-slate-300 font-semibold text-xs rounded transition cursor-pointer"
            >
              Bypass / Skip Node
            </button>
          </div>
        </div>
      )}

      {/* STATS & METRICS (Cost Tracking & Bottleneck Detection) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-[#1e293b] rounded-lg p-3.5 flex flex-col gap-1 shadow-xs transition-colors duration-300">
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-mono">Estimated Transaction Cost</span>
          <div className="flex items-baseline gap-1 mt-1">
            <DollarSign className="w-3.5 h-3.5 text-indigo-505 dark:text-indigo-400 shrink-0 self-center" />
            <span className="text-xl font-bold font-mono text-slate-800 dark:text-slate-100">
              {simulationResult ? stats.cost.toFixed(6) : "0.000000"}
            </span>
          </div>
          <span className="text-[9px] text-slate-450 dark:text-slate-500 font-mono mt-0.5">
            Based on {stats.tokens} parsed tokens
          </span>
        </div>

        <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-[#1e293b] rounded-lg p-3.5 flex flex-col gap-1 shadow-xs transition-colors duration-300">
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block font-mono">Execution Pipe Latency</span>
          <div className="flex items-baseline gap-1 mt-1">
            <Clock className="w-3.5 h-3.5 text-indigo-505 dark:text-indigo-400 shrink-0 self-center" />
            <span className="text-xl font-bold font-mono text-slate-800 dark:text-slate-100">
              {stats.latency}ms
            </span>
          </div>
          <span className="text-[9px] text-slate-450 dark:text-slate-500 font-mono mt-0.5">
            {simulationResult ? "Cumulative step timeline" : "SLA benchmark standby"}
          </span>
        </div>

        <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-[#1e293b] rounded-lg p-3.5 flex flex-col gap-1 shadow-xs transition-colors duration-300">
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-505 uppercase tracking-wider block font-mono">Orchestrator SLA State</span>
          <div className="flex items-center gap-1.5 mt-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">99.9% Availability Bound</span>
          </div>
          <span className="text-[9px] text-slate-450 dark:text-slate-500 mt-1 font-sans">
            Automated failover fallback enabled
          </span>
        </div>
      </div>

      {/* CRON SCHEDULER PANEL */}
      <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-[#1d273a] rounded-xl p-4.5 flex flex-col gap-3.5 shadow-xs transition-colors duration-300">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-[#212d44]">
          <div className="flex items-center gap-2">
            <Clock className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 font-display">Workflow Scheduling & Cron Dispatch</span>
              <p className="text-[9px] text-slate-450 dark:text-slate-500 font-sans mt-0.5">Automate cyclic execution intervals for collective multi-agent pipelines.</p>
            </div>
          </div>
          <button
            onClick={() => setScheduleEnabled(!scheduleEnabled)}
            className={`px-3 py-1 text-[10px] font-bold rounded-lg transition uppercase tracking-wider cursor-pointer ${
              scheduleEnabled 
                ? "bg-emerald-600 text-white" 
                : "bg-slate-100 dark:bg-[#121824] text-slate-555 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-[#1d273a]"
            }`}
          >
            {scheduleEnabled ? "● Active (ON)" : "● Disabled (OFF)"}
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {["hourly", "daily", "weekly", "cron"].map((t) => {
            const isSel = scheduleType === t;
            const labelInEnglish = t === "hourly" ? "Hourly" : t === "daily" ? "Daily" : t === "weekly" ? "Weekly" : "Cron Expr";
            return (
              <button
                key={t}
                onClick={() => setScheduleType(t as any)}
                className={`py-1.5 px-2 text-[10px] font-bold rounded-md border uppercase transition cursor-pointer text-center ${
                  isSel 
                    ? "bg-indigo-50 dark:bg-[#121824] border-indigo-200 dark:border-indigo-805 text-indigo-700 dark:text-indigo-400" 
                    : "bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-[#1c2635] text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                }`}
              >
                {labelInEnglish}
              </button>
            );
          })}
        </div>

        {scheduleType === "cron" && (
          <div>
            <label className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Standard Cron Expression Syntax</label>
            <input
              type="text"
              className="w-full text-xs font-mono p-2 border border-slate-200 dark:border-[#212d44] bg-white dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200 rounded"
              value={cronExpression}
              onChange={(e) => setCronExpression(e.target.value)}
              placeholder="e.g. */15 * * * *"
            />
          </div>
        )}

        {scheduleEnabled && (
          <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-905 rounded-lg p-3 text-[11px] leading-relaxed text-indigo-900 dark:text-indigo-300 flex items-center justify-between transition-colors duration-300">
            <div className="flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 animate-spin" />
              <span>Next automated schedule dispatch in: <b className="font-mono text-xs">{timerSeconds}s</b></span>
            </div>
            <span className="text-[9px] bg-indigo-600 text-white px-2 py-0.5 rounded font-semibold animate-pulse">AUTO</span>
          </div>
        )}

        <div className="flex flex-col gap-1.5 mt-1">
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Scheduled Dispatch Execution Logs:</span>
          <div className="bg-slate-55 dark:bg-[#121824] rounded-lg border border-slate-150 dark:border-[#1d273a] p-2 max-h-[100px] overflow-auto flex flex-col gap-1.5 transition-colors duration-300">
            {simulatedRuns.map((r, idx) => (
              <div key={idx} className="flex justify-between items-center text-[10px] text-slate-655 dark:text-slate-400">
                <span className="font-medium text-slate-800 dark:text-slate-200">{r.objective}</span>
                <div className="flex items-center gap-1.5 text-[9px]">
                  <span className="text-slate-400 dark:text-slate-500 font-mono">{r.time}</span>
                  <span className="text-emerald-600 dark:text-emerald-450 font-bold bg-emerald-50 dark:bg-emerald-950/10 px-1 rounded uppercase tracking-wider text-[8px] border border-emerald-200/40">SUCCESS</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HUMAN-IN-THE-LOOP & AUTO-RETRY NODE SETTINGS DIRECTORS */}
      <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-[#1d273a] rounded-xl p-4.5 flex flex-col gap-3 shadow-xs transition-colors duration-300">
        <div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 font-display block">Unit Agent Handshake & Governance Blueprint</span>
          <p className="text-[9px] text-slate-450 dark:text-slate-500 mt-0.5">Configure strict human-in-the-loop steps and retry count metrics on a per-node layer.</p>
        </div>

        <div className="flex flex-col gap-2.5 mt-2 max-h-[260px] overflow-auto">
          {activeArch.nodes.map((node) => {
            if (node.id === "input") return null;

            return (
              <div key={node.id} className="bg-slate-50 dark:bg-[#121824] border border-slate-200 dark:border-[#1d273a] rounded-lg p-3 flex flex-col gap-2 transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">{node.name}</span>
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-mono capitalize">{node.type} • {node.model}</span>
                  </div>
                  <button
                    onClick={() => toggleApprovalRequirement(node.id)}
                    className={`px-2 py-0.5 text-[9px] rounded-full border transition font-bold cursor-pointer ${
                      node.requireApproval 
                        ? "bg-amber-100 dark:bg-amber-950/40 text-amber-850 dark:text-amber-305 border-amber-305 dark:border-amber-900"
                        : "bg-white dark:bg-[#0b0f19] border-slate-200 dark:border-[#212d44] text-slate-405 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    }`}
                  >
                    {node.requireApproval ? "👋 HUMAN-IN-THE-LOOP" : "⚡ AUTOPILOT"}
                  </button>
                </div>

                <div className="flex items-center gap-3 border-t border-slate-200/60 dark:border-[#212d44] pt-2 text-[10px]">
                  <span className="text-slate-400 dark:text-slate-505 font-medium">Automatic Failover Retries:</span>
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((num) => (
                      <button
                        key={num}
                        onClick={() => updateNodeRetries(node.id, num)}
                        className={`w-5 h-5 rounded text-[10px] font-mono border font-bold transition flex items-center justify-center cursor-pointer ${
                          (node.retries || 0) === num
                            ? "bg-indigo-650 text-white border-indigo-650"
                            : "bg-white dark:bg-[#0b0f19] text-slate-550 dark:text-slate-400 border-slate-200 dark:border-[#212d44] hover:bg-slate-100"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AUTOMATED BOTTLENECK ANALYSIS DETECTOR */}
      {simulationResult && (
        <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-[#1d273a] rounded-xl p-4.5 flex flex-col gap-3 shadow-xs transition-colors duration-300">
          <div>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200 font-display block text-indigo-700 dark:text-indigo-400">
              📊 Analytical Cost & Bottleneck Trace
            </span>
            <p className="text-[9px] text-slate-450 dark:text-slate-500 mt-0.5">Live delay monitoring for individual agent transaction handshake points.</p>
          </div>

          <div className="flex flex-col gap-2.5 mt-1.5">
            {simulationResult.steps.map((step, idx) => {
              if (step.status !== "completed") return null;
              const duration = step.durationMs || 400;
              const percent = Math.min((duration / 1200) * 100, 100);
              const isBottleneck = duration > 750;

              return (
                <div key={idx} className="flex flex-col gap-1 text-[10px] text-slate-655 dark:text-slate-400">
                  <div className="flex justify-between font-mono">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{step.nodeName}</span>
                    <span className={isBottleneck ? "text-amber-600 font-bold" : "text-indigo-600 dark:text-indigo-400"}>
                      {duration}ms {isBottleneck && "⚠️ Potential Bottleneck Detected"}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded overflow-hidden">
                    <div 
                      className={`h-full rounded transition-all duration-500 ${
                        isBottleneck ? "bg-amber-500" : "bg-indigo-600"
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FAILOVER SETTINGS & BACKUP ENGINE RESCUES */}
      <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-[#1d273a] rounded-xl p-4.5 flex flex-col gap-3 shadow-xs transition-colors duration-300">
        <div>
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 font-display block text-slate-800 dark:text-slate-200">Global Failover Recovery & LLM Swaps</span>
          <p className="text-[9px] text-slate-450 dark:text-slate-500 mt-0.5">Configure background fallback models to swap into when processing limits or outages threaten SLA.</p>
        </div>

        <div className="grid grid-cols-2 gap-3.5 mt-1.5 font-sans">
          <div>
            <label className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">SLA Fallback Model Pair</label>
            <select
              className="w-full text-xs p-1.5 border border-slate-200 dark:border-[#212d44] bg-white dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200 rounded font-mono focus:outline-none"
              value={fallbackModel}
              onChange={(e) => setFallbackModel(e.target.value)}
            >
              <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
              <option value="gemini-2.0-flash">Gemini 2.0 Flash</option>
            </select>
          </div>

          <div>
            <label className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Global Failover Retries</label>
            <input
              type="number"
              className="w-full text-xs p-1.5 border border-slate-200 dark:border-[#212d44] bg-white dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200 rounded font-mono focus:outline-none"
              value={globalRetries}
              min={1}
              max={5}
              onChange={(e) => setGlobalRetries(parseInt(e.target.value) || 2)}
            />
          </div>
        </div>

        <div className="bg-slate-55 dark:bg-[#121824] text-slate-600 dark:text-slate-405 p-2.5 rounded text-[10px] leading-relaxed transition-colors duration-300">
          🔁 <span className="font-semibold text-indigo-700 dark:text-indigo-400">SLA Bypass Policy:</span> If an agent transaction drops with a rate limit (status 429) or latency spike, the orchestrator redirects workloads to <span className="font-mono">{fallbackModel}</span> and performs up to {globalRetries} recovery handshakes.
        </div>
      </div>
    </div>
  );
}
