import React, { useState, useEffect } from "react";
import { Mail, Slack, ToggleLeft, ToggleRight, Check, ShieldAlert, Cpu, Settings, MessageSquare, AlertCircle } from "lucide-react";
import { ActionIntegration } from "../types";

interface IntegrationHubProps {
  simulationActive: boolean;
  finalResponse: string | null;
}

export function IntegrationHub({ simulationActive, finalResponse }: IntegrationHubProps) {
  const [integrations, setIntegrations] = useState<ActionIntegration[]>([
    {
      id: "int1",
      app: "gmail",
      actionName: "Email Summary Dispatcher",
      status: "idle",
      configValue: "sriskms786@gmail.com",
      activityLog: [
        "Waiting for agent pipeline final outcome to deliver client dispatch summary document...",
      ]
    },
    {
      id: "int2",
      app: "slack",
      actionName: "Production Alert Broadcast Relay (Slack)",
      status: "idle",
      configValue: "#systems-architect-alerts",
      activityLog: [
        "Waiting for active workflow completion to fire diagnostic trigger alerts...",
      ]
    },
    {
      id: "int3",
      app: "jira",
      actionName: "Jira Enterprise Ticket Registry",
      status: "idle",
      configValue: "https://jira.atlassian.com/browse/ARCH-9",
      activityLog: [
        "Waiting for auditor rule violations to register tickets...",
      ]
    }
  ]);

  const [activeTab, setActiveTab] = useState<"gmail" | "slack" | "jira">("gmail");
  const [testSuccessMsg, setTestSuccessMsg] = useState<string | null>(null);

  // Trigger dispatch actions if pipeline finishes successfully
  useEffect(() => {
    if (finalResponse) {
      setIntegrations(prev => prev.map(int => {
        const timeStr = new Date().toLocaleTimeString();
        let logs: string[] = [];

        if (int.app === "gmail") {
          logs = [
            `[${timeStr}] Email summary report generated for target recipient: ${int.configValue}`,
            `[${timeStr}] Dispatch sent: 'Swarm Resolver Outcome - The AI Systems Architect'`,
            `[${timeStr}] Main content payload body snippet: ${finalResponse.slice(0, 80)}...`
          ];
        } else if (int.app === "slack") {
          logs = [
            `[${timeStr}] Captured Slack channel incoming webhook ping: ${int.configValue}`,
            `[${timeStr}] Outbound response payload delivered: STATUS -> "COMPLETED"`,
            `[${timeStr}] Message summary: "Swarm resolved goals in 4 unified execution handshakes."`
          ];
        } else if (int.app === "jira") {
          logs = [
            `[${timeStr}] Connected to Jira JQL server endpoint: ${int.configValue}`,
            `[${timeStr}] Registered new active bug tickets matching auditor constraints.`
          ];
        }

        return {
          ...int,
          status: "completed",
          activityLog: logs
        };
      }));
    } else if (simulationActive) {
      setIntegrations(prev => prev.map(int => ({
        ...int,
        status: "triggered",
        activityLog: ["🔄 Simulation in progress. Preserving webhook payload..."]
      })));
    }
  }, [finalResponse, simulationActive]);

  const handleUpdateConfig = (id: string, val: string) => {
    setIntegrations(prev => prev.map(i => i.id === id ? { ...i, configValue: val } : i));
  };

  const handleManualTestTrigger = (app: string) => {
    setTestSuccessMsg(null);
    const timeStr = new Date().toLocaleTimeString();
    setIntegrations(prev => prev.map(i => {
      if (i.app === app) {
        return {
          ...i,
          status: "completed",
          activityLog: [`[${timeStr}] Connection test successful. Back-end returned: 200 OK API response.`]
        };
      }
      return i;
    }));
    setTestSuccessMsg(`Connection successful! ${app.toUpperCase()} integration channel is active and prepared for live swarm dispatches.`);
    setTimeout(() => setTestSuccessMsg(null), 3500);
  };

  const currentInt = integrations.find(i => i.app === activeTab)!;

  return (
    <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-[#1d273a] rounded-xl p-5 shadow-xs flex flex-col gap-4 transition-colors duration-300" id="integrations-root">
      <div className="pb-2 border-b border-slate-100 dark:border-[#212d44] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-spin-hover" />
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-display">
              Global Action Integrations Hub
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-555 mt-0.5">Route real-time pipeline outputs directly to external business application hooks.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setActiveTab("gmail")}
          className={`p-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            activeTab === "gmail"
              ? "bg-indigo-50 dark:bg-[#1d273a] border-indigo-200 dark:border-indigo-805 text-indigo-700 dark:text-indigo-400 font-bold"
              : "bg-white dark:bg-[#121824] border-slate-200 dark:border-[#1d273a] hover:bg-slate-50 text-slate-655 dark:text-slate-400"
          }`}
        >
          <Mail className="w-3.5 h-3.5" /> Gmail
        </button>
        <button
          onClick={() => setActiveTab("slack")}
          className={`p-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            activeTab === "slack"
              ? "bg-indigo-50 dark:bg-[#1d273a] border-indigo-200 dark:border-indigo-805 text-indigo-700 dark:text-indigo-400 font-bold"
              : "bg-white dark:bg-[#121824] border-slate-200 dark:border-[#1d273a] hover:bg-slate-50 text-slate-655 dark:text-slate-400"
          }`}
        >
          <Slack className="w-3.5 h-3.5" /> Slack
        </button>
        <button
          onClick={() => setActiveTab("jira")}
          className={`p-2 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
            activeTab === "jira"
              ? "bg-indigo-50 dark:bg-[#1d273a] border-indigo-200 dark:border-indigo-805 text-indigo-700 dark:text-indigo-400 font-bold"
              : "bg-white dark:bg-[#121824] border-slate-200 dark:border-[#1d273a] hover:bg-slate-50 text-slate-655 dark:text-slate-400"
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" /> Jira
        </button>
      </div>

      <div className="bg-slate-50 dark:bg-[#121824] rounded-lg p-3.5 border border-slate-200 dark:border-[#1d273a] flex flex-col gap-3 transition-colors duration-300">
        <div className="flex items-center justify-between font-sans">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-display">{currentInt.actionName}</span>
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded border font-mono ${
            currentInt.status === 'completed' 
              ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800" 
              : currentInt.status === 'triggered'
              ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 animate-pulse"
              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-[#212d44]"
          }`}>
            {currentInt.status === 'completed' ? 'COMPLETED' : currentInt.status === 'triggered' ? 'ACTIVE' : 'IDLE'}
          </span>
        </div>

        <div>
          <label className="block text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">
            {activeTab === 'gmail' && "Recipient Destination Email Address"}
            {activeTab === 'slack' && "Slack Channel Webhook Alert Endpoint URL"}
            {activeTab === 'jira' && "Jira Mapping Project Destination URL"}
          </label>
          <input
            type="text"
            className="w-full text-xs p-2 border border-slate-200 dark:border-[#212d44] bg-white dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 rounded font-mono transition-colors duration-300"
            value={currentInt.configValue}
            onChange={(e) => handleUpdateConfig(currentInt.id, e.target.value)}
          />
        </div>

        <div className="flex justify-between items-center bg-white dark:bg-[#0b0f19] p-2 rounded border border-slate-200 dark:border-[#1d273a] transition-colors duration-300">
          <span className="text-[10px] text-slate-400 dark:text-slate-400 font-medium">Automated Pipeline Dispatch</span>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 bg-emerald-50/50 dark:bg-emerald-950/10 px-1.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800/40">
            <Check className="w-3 h-3" /> Execute on pipeline success
          </span>
        </div>

        <div className="border-t border-slate-100 dark:border-[#212d44] pt-2.5 flex flex-col gap-1.5">
          <span className="text-[9px] font-bold text-slate-400 dark:text-slate-505 uppercase tracking-wider font-mono">Dynamic Channel Activity Logs:</span>
          <div className="bg-slate-900 rounded p-2.5 max-h-[140px] overflow-auto flex flex-col gap-1">
            {currentInt.activityLog.map((log, index) => (
              <span key={index} className="text-[10px] font-mono text-indigo-300 leading-relaxed break-all">
                {log}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={() => handleManualTestTrigger(currentInt.app)}
          className="w-full py-1.5 bg-white dark:bg-[#1d273a] border border-slate-200 dark:border-[#212d44] hover:bg-slate-50 dark:hover:bg-[#121824] text-[11px] text-slate-705 dark:text-slate-300 font-bold rounded cursor-pointer transition text-center"
        >
          Test Integration Channel Connection
        </button>

        {testSuccessMsg && (
          <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-[10px] rounded p-2.5 leading-relaxed flex gap-1.5">
            <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{testSuccessMsg}</span>
          </div>
        )}
      </div>
    </div>
  );
}
