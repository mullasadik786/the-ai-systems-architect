import React, { useState } from "react";
import { 
  ShieldCheck, ToggleLeft, ToggleRight, AlertTriangle, 
  CheckCircle, RefreshCw, Undo, ArrowRight, Zap, Play, Check 
} from "lucide-react";

interface SelfCorrectionConsoleProps {
  enabled: boolean;
  onToggle: () => void;
  isCorrectingLive: boolean;
}

export function SelfCorrectionConsole({ enabled, onToggle, isCorrectingLive }: SelfCorrectionConsoleProps) {
  // Configurable neuron routing reflection rules
  const [reflectionTarget, setReflectionTarget] = useState<string>("draftsman");
  const [triggerCondition, setTriggerCondition] = useState<string>("legal_audit_failed");
  const [feedbackPrompt, setFeedbackPrompt] = useState<string>(
    "Audit Alert: The previous draft violated compliance rules. Please rewrite to omit synthetic components."
  );
  
  const [simulationLogs, setSimulationLogs] = useState<string[]>([
    "System standby. Turn on the self-correction guardrails to test feedback loops."
  ]);
  const [isSimulatingReflection, setIsSimulatingReflection] = useState<boolean>(false);

  // Static demonstration logs reflecting active guardrail rounds
  const diagnosticLogs = [
    { round: 1, type: "safety", status: "passed", detail: "Prompt injection risk assessment: No threat signatures detected." },
    { round: 1, type: "verification", status: "warning", detail: "Draft lacks clear physical floor-breaking verification criteria (mem1)." },
    { round: 2, type: "recovery", status: "fixed", detail: "Automatic remediation: Added 'Floor-breaking authorization within 180 days'." },
    { round: 2, type: "final_pass", status: "passed", detail: "Verification rules matched successfully. Final output dispatched to client." }
  ];

  const handleTestReflectionLoop = () => {
    setIsSimulatingReflection(true);
    setSimulationLogs([
      "🚀 Starting routing test...",
      "🔍 Reviewing technical audit and compliance rules evaluation output...",
      "🚨 [ALERT] Regulation audit failed: 'Synthetic components discovered. Green Sneakers clause (E102) violated'."
    ]);

    setTimeout(() => {
      setSimulationLogs(prev => [
        ...prev,
        "🔄 Activating self-correction rules engine...",
        `💡 Match found: If '${triggerCondition}' then route back to '${reflectionTarget}'`
      ]);
    }, 800);

    setTimeout(() => {
      setSimulationLogs(prev => [
        ...prev,
        `📝 Reflection instruction payload assembled:`,
        `   "${feedbackPrompt}"`,
        "📥 Dispatching reflection loop backward stream... 🔄"
      ]);
    }, 1600);

    setTimeout(() => {
      setSimulationLogs(prev => [
        ...prev,
        `✔ '${reflectionTarget}' has successfully completed re-drafting at temperature 0.2!`,
        "✔ Technical audit Round 2: 100% compliant. Safe to proceed."
      ]);
      setIsSimulatingReflection(false);
    }, 2400);
  };

  return (
    <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-[#1d273a] rounded-xl p-5 shadow-xs flex flex-col gap-4 transition-colors duration-300" id="self-correction-root">
      <div className="pb-2 border-b border-slate-105 dark:border-[#1e293b] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-display">
              Self-Correction & Guardrails
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Scans intermediate outcomes and automatically rewrites anomalies under governance rules.</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
          title={enabled ? "Disable automatic correction guardrails" : "Enable automatic correction guardrails"}
        >
          {enabled ? (
            <ToggleRight className="w-9 h-9 text-indigo-600 dark:text-indigo-400" />
          ) : (
            <ToggleLeft className="w-9 h-9 text-slate-300 dark:text-slate-600" />
          )}
        </button>
      </div>

      <div className="flex items-center justify-between bg-slate-50 dark:bg-[#121824] border border-slate-150 dark:border-[#202c40] p-3 rounded text-[11px] gap-2.5">
        <div className="flex items-center gap-1.5 leading-relaxed text-slate-600 dark:text-slate-300">
          <span>🛡️</span>
          <span>
            {enabled 
              ? <span className="font-semibold text-emerald-700 dark:text-emerald-400">Automatic self-correction is ACTIVE:</span> 
              : <span className="font-semibold text-slate-500 dark:text-slate-400">Automatic self-correction is INACTIVE:</span>
            } Any compliance deviations detected during agent handshakes will trigger automated back-routing and healing logic.
          </span>
        </div>
      </div>

      {/* Neuron Routing - REFLECTION LOOP CONTROL SYSTEM */}
      <div className="mt-2 border border-slate-200/80 dark:border-[#212d44] bg-slate-50/50 dark:bg-[#0e1422] rounded-xl p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10.5px] font-bold text-slate-700 dark:text-slate-200 font-display flex items-center gap-1.5">
            <Undo className="w-3.5 h-3.5 text-amber-500" />
            Neuron Routing (Reflection Feedback Loop)
          </span>
          <span className="text-[9px] bg-amber-50 dark:bg-amber-955/60 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded font-mono border border-amber-200/50 dark:border-amber-900/50">
            Active Rule Matrix
          </span>
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed -mt-1.5">
          This system provides an automatic fallback path to feedback correction instructions back to preceding agent nodes if assertions fail.
        </p>

        {/* Dynamic Interactive Setup */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-[8px] font-bold text-slate-400 dark:text-slate-505 uppercase mb-1">Catch Routing Event</label>
            <select
              value={triggerCondition}
              onChange={(e) => setTriggerCondition(e.target.value)}
              className="w-full text-xs p-1.5 border border-slate-200 dark:border-[#212d44] bg-white dark:bg-[#121824] text-slate-800 dark:text-slate-200 rounded font-semibold focus:outline-none"
            >
              <option value="legal_audit_failed">⚠️ Technical/Legal Audit Fails</option>
              <option value="low_sentiment">📉 Sentiment Score Drops Below 0.7</option>
              <option value="missing_citations">🔗 References/Citations Empty</option>
            </select>
          </div>

          <div>
            <label className="block text-[8px] font-bold text-slate-400 dark:text-slate-505 uppercase mb-1">Route Feedback Back To</label>
            <select
              value={reflectionTarget}
              onChange={(e) => setReflectionTarget(e.target.value)}
              className="w-full text-xs p-1.5 border border-slate-200 dark:border-[#212d44] bg-white dark:bg-[#121824] text-slate-800 dark:text-slate-200 rounded font-semibold focus:outline-none"
            >
              <option value="draftsman">🖋️ Technical Content Draftsman (Draftsman)</option>
              <option value="input">📥 Workspace Intake Point (Intake)</option>
              <option value="editor">✍️ Editorial Review Editor (Editor)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[8px] font-bold text-slate-400 dark:text-slate-505 uppercase mb-1">Auto Reflection Feedback Template</label>
          <textarea
            rows={2}
            value={feedbackPrompt}
            onChange={(e) => setFeedbackPrompt(e.target.value)}
            className="w-full text-xs p-2 border border-slate-200 dark:border-[#212d44] bg-white dark:bg-[#121824] text-slate-800 dark:text-slate-200 rounded resize-none focus:outline-none focus:ring-1 focus:ring-amber-500"
            placeholder="Enter detailed instructions for the node to adjust when corrected..."
          />
        </div>

        {/* Beautiful CSS Visualizing the loop */}
        <div className="flex items-center justify-center gap-1.5 py-2.5 bg-slate-100/65 dark:bg-[#151c2d] rounded-lg border border-dashed border-slate-200 dark:border-[#223048]">
          <div className="px-2 py-1 rounded bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-850 text-[10px] font-bold text-indigo-700 dark:text-indigo-400">
            {reflectionTarget === "draftsman" ? "Content Draftsman" : reflectionTarget.toUpperCase()}
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 animate-pulse" />
          <div className="px-2 py-1 rounded bg-amber-100 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-900 text-[10px] font-bold text-amber-850 dark:text-amber-400 relative">
            Technical Auditor (Auditor)
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-transparent" />
          <div className="flex items-center gap-1 font-sans">
            <span className="text-[10px] text-red-500 dark:text-red-400 font-bold">Violated</span>
            <span className="text-xs text-slate-400">➔</span>
            <button
              onClick={handleTestReflectionLoop}
              disabled={isSimulatingReflection}
              className="px-2 py-1 bg-amber-500 hover:bg-amber-600 disabled:bg-slate-400 text-white font-bold text-[9px] rounded flex items-center gap-1 cursor-pointer transition shadow-xs"
            >
              {isSimulatingReflection ? (
                <RefreshCw className="w-2.5 h-2.5 animate-spin" />
              ) : (
                <Zap className="w-2.5 h-2.5 fill-current" />
              )}
              Run Reflection Test
            </button>
          </div>
        </div>

        {/* Simulated logs terminal */}
        {simulationLogs.length > 0 && (
          <div className="flex flex-col gap-1">
            <span className="text-[8px] font-bold text-slate-400 dark:text-slate-505 uppercase tracking-tight">Loopback Diagnostic Logs:</span>
            <div className="bg-slate-900 rounded p-2.5 max-h-[140px] overflow-auto flex flex-col gap-1 font-mono text-[9px] text-slate-300">
              {simulationLogs.map((log, idx) => {
                let colorClass = "text-indigo-300";
                if (log.startsWith("🚨") || log.startsWith("⚠️") || log.includes("[ALERT]")) colorClass = "text-rose-400";
                if (log.startsWith("✔")) colorClass = "text-emerald-400";
                if (log.startsWith("💡")) colorClass = "text-amber-300";
                return (
                  <span key={idx} className={colorClass}>
                    {log}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {isCorrectingLive ? (
        <div className="bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900 rounded-lg p-3.5 flex flex-col items-center justify-center text-center gap-2.5 animate-pulse">
          <RefreshCw className="w-6 h-6 text-indigo-600 dark:text-indigo-400 animate-spin" />
          <span className="text-[11px] font-bold text-indigo-950 dark:text-indigo-200 font-display uppercase tracking-wider">
            Running active diagnostic analysis...
          </span>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 max-w-xs">
            Evaluating outcome constraints against active graph templates and schema models.
          </p>
        </div>
      ) : enabled ? (
        <div className="flex flex-col gap-2.5 border-t border-slate-100 dark:border-[#1e293b] pt-3 animate-fadeIn">
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Guardrails Diagnostic Execution Trace:</span>
          
          <div className="flex flex-col gap-2 max-h-[160px] overflow-auto">
            {diagnosticLogs.map((log, index) => {
              let icon = <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />;
              let cardBg = "bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/40 text-slate-700 dark:text-slate-300";
              
              if (log.status === "warning") {
                icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />;
                cardBg = "bg-amber-50/35 dark:bg-amber-950/10 border-amber-100 dark:border-amber-900/40 text-slate-700 dark:text-slate-300";
              } else if (log.status === "fixed") {
                icon = <CheckCircle className="w-3.5 h-3.5 text-indigo-505 dark:text-indigo-400 shrink-0 mt-0.5" />;
                cardBg = "bg-indigo-50/20 dark:bg-indigo-950/10 border-indigo-100 dark:border-indigo-900/40 text-indigo-700 dark:text-indigo-300";
              }

              return (
                <div key={index} className={`flex gap-2 p-2 border rounded-md text-[10px] leading-relaxed ${cardBg}`}>
                  {icon}
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold tracking-wide uppercase text-[8px] text-slate-400 dark:text-slate-505 font-mono">Round {log.round} • {log.type}</span>
                    <span>{log.detail}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-6 text-slate-400 dark:text-slate-500 text-xs italic flex flex-col items-center justify-center gap-1.5">
          <span>🛡️ Automatic guardrail engine is disabled.</span>
          <span className="text-[10px] text-slate-505 text-slate-500 dark:text-slate-500 font-normal">Toggle self-correction to live-evaluate sandbox outputs against active knowledge rules.</span>
        </div>
      )}
    </div>
  );
}
