import React, { useState } from "react";
import { Database, Search, PlusCircle, AlertCircle, Bookmark, Code, Shield } from "lucide-react";
import { MemorySegment } from "../types";

interface MemoryHubProps {
  memoryItems: MemorySegment[];
  onAddMemory: (mem: MemorySegment) => void;
  onSearchQuery: (query: string) => void;
}

export function MemoryHub({ memoryItems, onAddMemory, onSearchQuery }: MemoryHubProps) {
  const [filter, setFilter] = useState<"all" | "rule" | "compliance" | "past_project">("all");
  const [searchWord, setSearchWord] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newSnippet, setNewSnippet] = useState("");
  const [newCat, setNewCat] = useState<MemorySegment["category"]>("rule");
  const [simulatedQueryLogs, setSimulatedQueryLogs] = useState<string[]>([]);

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newSnippet.trim()) return;

    const newMem: MemorySegment = {
      id: `mem_${Date.now()}`,
      title: newTitle,
      snippet: newSnippet,
      category: newCat
    };

    onAddMemory(newMem);
    setNewTitle("");
    setNewSnippet("");
  };

  const handleRunSearch = () => {
    if (!searchWord.trim()) return;
    setSimulatedQueryLogs([
      "Similarity scan initiated across local vector cache database...",
      `Syntactic overlap matching guidelines retrieved for query: "${searchWord}"`,
      "Supplied associated guidelines into the active swarm pipeline memory hook."
    ]);
    onSearchQuery(searchWord);
  };

  const filteredItems = memoryItems.filter(item => {
    if (filter !== "all" && item.category !== filter) return false;
    if (searchWord.trim()) {
      return item.title.toLowerCase().includes(searchWord.toLowerCase()) || 
             item.snippet.toLowerCase().includes(searchWord.toLowerCase());
    }
    return true;
  });

  return (
    <div className="bg-white dark:bg-[#0b0f19] border border-slate-200 dark:border-[#1d273a] rounded-xl p-5 shadow-xs flex flex-col gap-4 transition-colors duration-300" id="memory-hub-root">
      <div className="pb-2 border-b border-slate-100 dark:border-[#212d44] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <div>
            <h3 className="font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-display">
              GraphRAG & Knowledge Memory Hub
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Inject company standards programmatically into active swarm directives using vector similarity scan.</p>
          </div>
        </div>
      </div>

      {/* Simulator Guidance */}
      <div className="bg-slate-55 dark:bg-[#121824] border border-slate-150 dark:border-[#1d273a] p-2.5 rounded text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed transition-colors duration-300">
        🌐 <span className="font-semibold text-indigo-700 dark:text-indigo-400">GraphRAG Loop:</span> When execution runs, appropriate compliance constraints and standard checklists are queried and compiled as direct instructions.
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            className="w-full pl-8 pr-2 py-1.5 text-xs border border-slate-200 dark:border-[#212d44] bg-white dark:bg-[#0b0f19] text-slate-800 dark:text-slate-150 rounded focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400"
            placeholder="Search memory cache (e.g. brand, guidelines, tone)..."
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
          />
        </div>
        <button
          onClick={handleRunSearch}
          className="py-1 px-3 bg-slate-900 dark:bg-[#1d273a] hover:bg-slate-800 dark:hover:bg-[#121824] text-white font-bold text-xs rounded transition cursor-pointer"
        >
          Check Similarity
        </button>
      </div>

      {simulatedQueryLogs.length > 0 && (
        <div className="bg-indigo-950/90 text-indigo-200 p-2 rounded text-[10px] font-mono leading-relaxed flex flex-col gap-0.5 border border-indigo-900/60">
          {simulatedQueryLogs.map((log, index) => (
            <span key={index}>✔ {log}</span>
          ))}
        </div>
      )}

      {/* Categories Pills */}
      <div className="flex gap-1.5 border-b border-slate-100 dark:border-[#212d44] pb-2 overflow-auto">
        {(["all", "rule", "compliance", "past_project"] as const).map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-2.5 py-1 text-[10px] font-bold rounded-full border transition cursor-pointer shrink-0 uppercase tracking-tight ${
              filter === cat
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white dark:bg-[#121824] border-slate-200 dark:border-[#152033] text-slate-505 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            {cat === "all" ? "ALL" : cat === "rule" ? "RULE / GUIDELINE" : cat === "compliance" ? "COMPLIANCE SHIELD" : "RUN HISTORY"}
          </button>
        ))}
      </div>

      {/* Memory Items List */}
      <div className="max-h-[180px] overflow-auto flex flex-col gap-2">
        {filteredItems.map(item => {
          let catIcon = <Bookmark className="w-3.5 h-3.5 text-slate-500" />;
          if (item.category === "compliance") catIcon = <Shield className="w-3.5 h-3.5 text-rose-500" />;
          if (item.category === "rule") catIcon = <Code className="w-3.5 h-3.5 text-emerald-500" />;

          return (
            <div key={item.id} className="bg-slate-50 dark:bg-[#121824] hover:bg-slate-100 dark:hover:bg-[#1e293b] border border-slate-150 dark:border-[#1d273a] rounded p-3 flex flex-col gap-1.5 transition duration-200">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  {catIcon}
                  <span className="font-semibold text-[11px] text-slate-800 dark:text-slate-200 font-display">{item.title}</span>
                </div>
                <span className="text-[8px] bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold border border-indigo-200 dark:border-indigo-900 px-1.5 py-0.2 rounded-full uppercase">
                  {item.category === "rule" ? "STANDARD" : item.category === "compliance" ? "GUARDRAIL" : "SWARM LOG"}
                </span>
              </div>
              <p className="text-[10px] text-slate-555 dark:text-slate-400 leading-relaxed font-mono whitespace-pre-wrap">
                {item.snippet}
              </p>
            </div>
          );
        })}
      </div>

      {/* Sprout New Segment Form */}
      <form onSubmit={handleAddMemory} className="border-t border-slate-100 dark:border-[#212d44] pt-3.5 flex flex-col gap-2.5">
        <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1 font-mono">
          <PlusCircle className="w-3.5 h-3.5 text-indigo-600" /> Insert New GraphRAG Guideline
        </span>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 font-mono">Guideline Title</label>
            <input
              type="text"
              required
              className="w-full text-xs p-1.5 border border-slate-200 dark:border-[#212d44] bg-white dark:bg-[#0b0f19] text-slate-800 dark:text-slate-100 rounded transition-colors duration-300"
              placeholder="e.g. Tone constraints"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase mb-1 font-mono">Category Classification</label>
            <select
              className="w-full text-xs p-1.5 border border-slate-200 dark:border-[#212d44] bg-white dark:bg-[#0b0f19] text-slate-850 dark:text-slate-200 rounded focus:outline-none"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value as MemorySegment["category"])}
            >
              <option value="rule">Strict Standard / Guideline (Rule)</option>
              <option value="compliance">Compliance Guardrail (Compliance)</option>
              <option value="past_project">Past Swarm Experience (History)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[8px] font-bold text-slate-400 dark:text-slate-555 uppercase mb-1 font-mono">Compliance Guideline Text or Restrictions (Snippet)</label>
          <textarea
            required
            rows={2}
            className="w-full text-xs p-1.5 border border-slate-200 dark:border-[#212d44] bg-white dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200 rounded resize-none transition-colors duration-300 focus:outline-none"
            placeholder="Describe specific rules or strict restrictions for agents to follow..."
            value={newSnippet}
            onChange={(e) => setNewSnippet(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded transition cursor-pointer"
        >
          Store Memory Segments
        </button>
      </form>
    </div>
  );
}
