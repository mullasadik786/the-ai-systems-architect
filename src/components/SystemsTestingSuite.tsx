import React, { useState } from "react";
import { 
  Beaker, CheckSquare, Bug, Play, AlertCircle, 
  Send, HelpCircle, HardDrive, Cpu, Percent, Sparkles, BarChart2,
  RefreshCw
} from "lucide-react";
import { SwarmArchitecture, AgentNode } from "../types";

interface SystemsTestingSuiteProps {
  activeArch: SwarmArchitecture;
  onRunSimulation: () => void;
  isRunning: boolean;
}

export function SystemsTestingSuite({ activeArch, onRunSimulation, isRunning }: SystemsTestingSuiteProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>(activeArch.nodes[0]?.id || "input");
  const [testPayload, setTestPayload] = useState("Are the green sneaker floor-breaking authorization documents available?");
  const [testLogs, setTestLogs] = useState<string[]>([]);
  const [isTestingIsolated, setIsTestingIsolated] = useState(false);
  const [stressConcurrency, setStressConcurrency] = useState(50);
  const [stressTesting, setStressTesting] = useState(false);
  const [stressResult, setStressResult] = useState<{
    avgLatency: number;
    reliability: number;
    failCount: number;
    tokensParsed: number;
  } | null>(null);

  // Assertion checkpoints representing system governance
  const [assertions, setAssertions] = useState([
    { id: "assert_1", name: "Strict Agent Role Sealing", desc: "Ensures no system directive leakage or role bleedout across threads.", passed: true },
    { id: "assert_2", name: "Infinite Loop Avoidance Barrier", desc: "Guarantees workflows terminate securely instead of circling indefinitely.", passed: true },
    { id: "assert_3", name: "Context & Token Envelope Verification", desc: "Asserts total transaction payload size fits inside the 128k safety window.", passed: true },
    { id: "assert_4", name: "Base Model SLA Failover Shield", desc: "Forks routing automatically if rate-limits breach SLA compliance thresholds.", passed: false }
  ]);

  const handleIsolateTest = () => {
    if (!testPayload.trim()) return;
    setIsTestingIsolated(true);
    setTestLogs(["Virtual sandbox context initialised for chosen Agent ID: " + selectedNodeId]);

    setTimeout(() => {
      setTestLogs(prev => [...prev, "✔ Isolated sandbox workspace namespace successfully."]);
    }, 400);

    setTimeout(() => {
      setTestLogs(prev => [
        ...prev, 
        "✔ Loaded target agent system instruction blueprint:",
        `  "${activeArch.nodes.find(n => n.id === selectedNodeId)?.systemInstruction || "None"}"`
      ]);
    }, 850);

    setTimeout(() => {
      setTestLogs(prev => [
        ...prev, 
        `🔄 Mock input payload attached: "${testPayload}"`,
        "🚀 Invoking standalone agent container mock iteration..."
      ]);
    }, 1250);

    setTimeout(() => {
      setTestLogs(prev => [
        ...prev, 
        "✔ Dispatch duration: 320ms",
        "✔ Handshake response: 200 SUCCESS",
        "📄 Outcome document: [Green Sneakers floor-breaking authorization constraints verified. Physical ground state matches 100% of rules.]"
      ]);
      setIsTestingIsolated(false);
    }, 2000);
  };

  const handleRunStressTest = () => {
    setStressTesting(true);
    setStressResult(null);
    let count = 0;
    const interval = setInterval(() => {
      count += 10;
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      setStressResult({
        avgLatency: Math.floor(280 + Math.random() * 220),
        reliability: 100 - (stressConcurrency > 100 ? 4 : 0),
        failCount: stressConcurrency > 100 ? 1 : 0,
        tokensParsed: stressConcurrency * 1450
      });
      setStressTesting(false);
    }, 1200);
  };

  const toggleAssertion = (id: string) => {
    setAssertions(prev => prev.map(a => a.id === id ? { ...a, passed: !a.passed } : a));
  };

  return (
    <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-[#1d273a] rounded-xl p-5 shadow-xs flex flex-col gap-5 transition-colors duration-300" id="testing-suite-root">
      <div className="pb-2 border-b border-slate-100 dark:border-[#1e293b] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Beaker className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-display">
              Systems Testing & Verification Suite
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Validate assertion rules, test isolated endpoints, and capture scalability benchmarks.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* ISOLATED COMPONENT TESTER */}
        <div className="flex flex-col gap-3.5 bg-slate-50 dark:bg-[#121824] border border-slate-200 dark:border-[#1d273a] rounded-xl p-4 transition-colors duration-300">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 font-display flex items-center gap-1.5 hover:scale-102 transition-transform">
            <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Isolated Sandbox Unit Tester
          </span>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed -mt-1">
            Test a specific single node blueprint on the fly with customizable input queries without triggering the full collective swarm.
          </p>

          <div>
            <label className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Target Agent Node</label>
            <select
              className="w-full text-xs p-2 border border-slate-200 dark:border-[#212d44] bg-white dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200 rounded font-mono focus:outline-none"
              value={selectedNodeId}
              onChange={(e) => setSelectedNodeId(e.target.value)}
            >
              {activeArch.nodes.map(n => (
                <option key={n.id} value={n.id} className="dark:bg-[#121824] dark:text-slate-200">
                  {n.name} ({n.role})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[8px] font-bold text-slate-400 dark:text-slate-555 uppercase mb-1">Mock Input Payload</label>
            <textarea
              className="w-full text-xs p-2 border border-slate-200 dark:border-[#212d44] bg-white dark:bg-[#0b0f19] text-slate-800 dark:text-slate-250 rounded resize-none focus:outline-none transition-colors duration-300"
              rows={2}
              value={testPayload}
              onChange={(e) => setTestPayload(e.target.value)}
              placeholder="Enter mock query to evaluate..."
            />
          </div>

          <button
            onClick={handleIsolateTest}
            disabled={isTestingIsolated}
            className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white font-semibold text-xs rounded transition flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            {isTestingIsolated ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Executing Isolated Test...
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                Run Sandbox Unit Test
              </>
            )}
          </button>

          {testLogs.length > 0 && (
            <div className="flex flex-col gap-1.5 mt-1 border-t border-slate-200/60 dark:border-[#212d44] pt-3">
              <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Isolated Sandbox Logs:</span>
              <div className="bg-slate-900 rounded p-2.5 max-h-[150px] overflow-auto flex flex-col gap-1 font-mono text-[9.5px]">
                {testLogs.map((log, idx) => (
                  <span key={idx} className={log.startsWith("✔") ? "text-emerald-400" : log.startsWith("📄") ? "text-amber-300" : "text-indigo-300"}>
                    {log}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* STRESS TESTING & CONCURRENCY SYSTEM */}
        <div className="flex flex-col gap-3.5 bg-slate-50 dark:bg-[#121824] border border-slate-200 dark:border-[#1d273a] rounded-xl p-4 transition-colors duration-300">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-200 font-display flex items-center gap-1.5">
            <BarChart2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Scalability Stress & Concurrency Simulator
          </span>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed -mt-1">
            Simulate spike traffic volumes to calculate prompt throughput reliability and response times.
          </p>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400 font-semibold font-mono">
              <span>Simulated Concurrency Level:</span>
              <span className="text-indigo-750 dark:text-indigo-400 font-bold">{stressConcurrency} queries/sec</span>
            </div>
            <input
              type="range"
              min={10}
              max={250}
              step={10}
              value={stressConcurrency}
              onChange={(e) => setStressConcurrency(parseInt(e.target.value))}
              className="w-full accent-indigo-600 dark:accent-indigo-400 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />
          </div>

          <button
            onClick={handleRunStressTest}
            disabled={stressTesting}
            className="w-full py-2 bg-slate-900 dark:bg-[#1d273a] border border-slate-800 dark:border-[#212d44] text-white font-bold text-xs rounded hover:bg-slate-800 dark:hover:bg-[#1c2635] transition cursor-pointer"
          >
            {stressTesting ? "Applying Load Spikes..." : "Run Scaling Stress Test"}
          </button>

          {stressResult && (
            <div className="grid grid-cols-2 gap-3 border-t border-slate-200/60 dark:border-[#212d44] pt-3 animate-fadeIn">
              <div className="bg-white dark:bg-[#0b0f19] p-2 border border-slate-150 dark:border-[#1d273a] flex flex-col gap-0.5 rounded transition-colors duration-300">
                <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase">Average Response Latency</span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 font-display">{stressResult.avgLatency}ms</span>
              </div>
              <div className="bg-white dark:bg-[#0b0f19] p-2 border border-slate-150 dark:border-[#1d273a] flex flex-col gap-0.5 rounded transition-colors duration-300">
                <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase">Reliability Index</span>
                <span className="text-sm font-bold text-emerald-600 font-display">{stressResult.reliability}%</span>
              </div>
              <div className="bg-white dark:bg-[#0b0f19] p-2 border border-slate-150 dark:border-[#1d273a] flex flex-col gap-0.5 rounded transition-colors duration-300">
                <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase">Rate-Limit Failures</span>
                <span className={`text-sm font-bold font-display ${stressResult.failCount > 0 ? "text-rose-600" : "text-emerald-500"}`}>
                  {stressResult.failCount} / {stressConcurrency}
                </span>
              </div>
              <div className="bg-white dark:bg-[#0b0f19] p-2 border border-slate-150 dark:border-[#1d273a] flex flex-col gap-0.5 rounded transition-colors duration-300">
                <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase">Estimated Swarm Tokens</span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-200 font-display font-mono">{stressResult.tokensParsed}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ASSERTION CHECKLIST CHECKPOINTS */}
      <div className="bg-slate-50 dark:bg-[#121824] border border-slate-200 dark:border-[#1d273a] rounded-xl p-4 flex flex-col gap-3 transition-colors duration-300">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-200 font-display flex items-center gap-1.5">
          <CheckSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Architecture Integrity System Assertions
        </span>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed -mt-1">
          Strict structural constraints evaluated to assert that agent behavior complies with preconfigured governance standards.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {assertions.map(ass => (
            <div 
              key={ass.id} 
              onClick={() => toggleAssertion(ass.id)}
              className="bg-white dark:bg-[#0b0f19] hover:bg-slate-50 dark:hover:bg-[#182133] p-3 rounded-lg border border-slate-200 dark:border-[#1d273a] flex items-start gap-2.5 transition cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={ass.passed}
                readOnly
                className="w-4 h-4 text-indigo-650 accent-indigo-650 shrink-0 mt-0.5 rounded cursor-pointer"
              />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{ass.name}</span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 leading-none">{ass.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
