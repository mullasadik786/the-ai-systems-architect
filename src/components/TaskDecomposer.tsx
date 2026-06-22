import React, { useState } from "react";
import { ListChecks, AlertCircle, RefreshCw, Zap, Sparkles, UserCheck, CheckCircle, Plus } from "lucide-react";
import { DecomposedStep, SwarmArchitecture, AgentNode, Connection } from "../types";

interface TaskDecomposerProps {
  taskInput: string;
  setTaskInput: (task: string) => void;
  onSproutGeneratedSwarm: (customSwarm: SwarmArchitecture) => void;
}

export function TaskDecomposer({ taskInput, setTaskInput, onSproutGeneratedSwarm }: TaskDecomposerProps) {
  const [isDecomposing, setIsDecomposing] = useState(false);
  const [steps, setSteps] = useState<DecomposedStep[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedDecomposedStep, setSelectedDecomposedStep] = useState<string | null>(null);

  const handleDecompose = async () => {
    if (!taskInput.trim()) return;
    setIsDecomposing(true);
    setSteps([]);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/decompose-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: taskInput }),
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || "The decomposition task failed with an error.");
      }

      const data = await response.json();
      if (data && data.decomposedSteps) {
        setSteps(data.decomposedSteps);
        if (data.decomposedSteps.length > 0) {
          setSelectedDecomposedStep(data.decomposedSteps[0].stepId);
        }
      } else {
        throw new Error("Invalid output received from the analyzer.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to decompose task objectives. Please verify back-end API configuration.");
    } finally {
      setIsDecomposing(false);
    }
  };

  const handleSproutSwarm = () => {
    if (steps.length === 0) return;

    // Turn steps into specialized Swarm nodes
    const generatedNodes: AgentNode[] = [
      {
        id: "input",
        name: "Input Intake",
        type: "input",
        role: "Workspace Trigger Ingestion",
        systemInstruction: `Assigned objective: ${taskInput}`,
        promptTemplate: "{{input}}",
        model: "gemini-3.5-flash",
        temperature: 0.5,
        position: { x: 50, y: 220 }
      }
    ];

    const generatedConnections: Connection[] = [];

    // Layout step-nodes in progressive staggered horizontal layout
    steps.forEach((step, idx) => {
      const isCritic = step.stepName.toLowerCase().includes("audit") || step.stepName.toLowerCase().includes("review") || step.stepName.toLowerCase().includes("critic");
      const isMerger = idx === steps.length - 1;
      const type = isCritic ? "critic" : (isMerger ? "merger" : "agent");

      const nodeId = `step_node_${idx + 1}`;
      const prevNodeId = idx === 0 ? "input" : `step_node_${idx}`;

      generatedNodes.push({
        id: nodeId,
        name: step.suggestedAgentName || step.stepName,
        type,
        role: step.suggestedRole || "Specialized Swarm Agent Node",
        systemInstruction: `You are the ${step.suggestedRole}. Primary responsibility: ${step.description}. Verification safety criteria bounds: ${step.criteria.join(", ")}. Assert 100% adherence to guidelines!`,
        promptTemplate: `Here is the current workspace sequence. Complete your assigned task instructions:\n\n{{input}}`,
        model: "gemini-3.5-flash",
        temperature: 0.5,
        position: { x: 200 + (idx * 210), y: 150 + (idx % 2 * 120) }
      });

      generatedConnections.push({
        id: `step_conn_${idx + 1}`,
        fromId: prevNodeId,
        toId: nodeId,
        condition: `Assert passed: ${step.criteria.slice(0, 1).join("")}`
      });
    });

    const newSwarm: SwarmArchitecture = {
      id: `decomposed-${Date.now()}`,
      name: `Self-Decomposed: ${taskInput.slice(0, 24)}...`,
      description: `Generated autonomous multi-agent pipeline: "${taskInput.slice(0, 80)}"`,
      nodes: generatedNodes,
      connections: generatedConnections
    };

    onSproutGeneratedSwarm(newSwarm);
  };

  const currentStep = steps.find(s => s.stepId === selectedDecomposedStep);

  return (
    <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-[#1d273a] rounded-xl p-5 shadow-xs flex flex-col gap-4 transition-colors duration-300" id="task-decomposer-root">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-[#212d44]">
        <div className="flex items-center gap-2">
          <ListChecks className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-display">
              Autonomous Cognitive Task Decomposer
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Breaks down vague, ambiguous human prompts into structured multi-agent pipelines.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 p-2.5 rounded text-[11px] text-amber-900 dark:text-amber-300 leading-relaxed">
          💡 <span className="font-semibold">Task-Driven Auto-Architect:</span> Instead of building agent nodes manually, write your primary target goals below to programmatically map appropriate team behaviors.
        </div>

        <textarea
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          rows={3}
          className="w-full text-xs p-2.5 border border-slate-200 dark:border-[#212d44] rounded bg-slate-55 dark:bg-[#121824] focus:bg-white dark:focus:bg-[#070b13] resize-none font-mono text-slate-800 dark:text-slate-200 leading-relaxed focus:ring-1 focus:ring-indigo-500 transition-colors duration-300"
          placeholder="e.g. Write a comprehensive advertising copy for green running sneakers, audit the draft against standard restrictions, and polish the final document."
        />

        <div className="flex gap-2">
          <button
            onClick={handleDecompose}
            disabled={isDecomposing || !taskInput.trim()}
            className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-350 dark:disabled:bg-slate-850 disabled:cursor-not-allowed text-white font-semibold text-xs rounded transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            {isDecomposing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Analyzing Objective...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                Decompose Goal
              </>
            )}
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-800 dark:text-red-300 rounded p-2.5 text-[11px] flex gap-1.5 items-start">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {steps.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-slate-100 dark:border-[#212d44] pt-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Decomposed Sub-steps:</span>
              <button
                onClick={handleSproutSwarm}
                className="py-1 px-2.5 bg-indigo-50 dark:bg-[#1d273a] hover:bg-indigo-105 dark:hover:bg-[#121824] border border-indigo-200 dark:border-[#212d44] text-indigo-700 dark:text-indigo-400 text-[10px] font-bold rounded flex items-center gap-1 cursor-pointer transition"
                title="Populate the canvas automatically with this structure"
              >
                <Zap className="w-3 h-3 text-indigo-600 fill-current" />
                Render Swarm on Canvas
              </button>
            </div>

            <div className="grid grid-cols-4 gap-1 bg-slate-50 dark:bg-[#121824] p-1 rounded-md border border-slate-150 dark:border-[#1d273a]">
              {steps.map((st, idx) => {
                const isSelected = selectedDecomposedStep === st.stepId;
                return (
                  <button
                    key={st.stepId}
                    onClick={() => setSelectedDecomposedStep(st.stepId)}
                    className={`py-1.5 text-[11px] font-bold rounded text-center transition cursor-pointer ${
                      isSelected 
                        ? "bg-white dark:bg-[#1d273a] text-indigo-700 dark:text-indigo-300 shadow-xs border border-slate-200 dark:border-[#212d44]" 
                        : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    Step {idx + 1}
                  </button>
                );
              })}
            </div>

            {currentStep && (
              <div className="bg-slate-50 dark:bg-[#121824] border border-slate-200 dark:border-[#1d273a] rounded-lg p-3.5 flex flex-col gap-2.5 transition-colors duration-300">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-800 dark:text-slate-100 font-display">
                    {currentStep.stepName}
                  </span>
                  <span className="bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-[#212d44] font-mono text-[9px] px-1.5 py-0.2 rounded font-bold">
                    {currentStep.suggestedAgentName}
                  </span>
                </div>

                <p className="text-slate-655 dark:text-slate-300 text-[11px] leading-relaxed">
                  {currentStep.description}
                </p>

                <div className="bg-white dark:bg-[#0b0f19] rounded border border-slate-150 dark:border-[#212d44] p-2 text-[11px] flex flex-col gap-1.5 transition-colors duration-300">
                  <span className="font-bold text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <UserCheck className="w-3 h-3 text-slate-505" /> Suggested Expert Profile:
                  </span>
                  <div className="text-slate-700 dark:text-slate-300 font-sans">
                    <span className="font-semibold text-indigo-700 dark:text-indigo-400">{currentStep.suggestedRole}</span>: system directive instructions attached.
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="font-bold text-[9px] text-slate-455 dark:text-slate-500 uppercase tracking-wider">Self-Correction Guardrail Criteria:</span>
                  <div className="flex flex-col gap-1 mt-1">
                    {currentStep.criteria.map((cr, idx) => (
                      <div key={idx} className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 text-[10px]">
                        <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span>{cr}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
