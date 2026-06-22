import React, { useState } from 'react';
import IntegrationHub from './components/IntegrationHub';
import MemoryHub from './components/MemoryHub';
import SelfCorrectionConsole from './components/SelfCorrectionConsole';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! I am your AI Copilot Assistant. How can I help you optimize your architecture today?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    // AI Simulated Response
    setTimeout(() => {
      const aiMessage: Message = {
        id: Date.now() + 1,
        text: `I have analyzed your request. The system architecture has been optimized and sync configurations updated.`,
        sender: 'ai'
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-6">
      {/* Top Header */}
      <header className="max-w-7xl mx-auto mb-8 border-b border-slate-800 pb-4 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold text-blue-400 tracking-tight">THE AI SYSTEMS ARCHITECT</h1>
          <p className="text-slate-400 text-sm mt-1">Advanced Serverless Orchestration Platform</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 bg-emerald-500 rounded-full animate-pulse"></span>
          <span className="text-sm font-medium text-emerald-400">System Live (Render)</span>
        </div>
      </header>

      {/* Main Container Layout */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Existing Structural Hubs */}
        <div className="lg:col-span-2 space-y-6">
          <IntegrationHub />
          <MemoryHub />
          <SelfCorrectionConsole />
        </div>

        {/* Right Side: New Analytical & Interaction Features */}
        <div className="space-y-6">
          
          {/* 1. ANALYTICS DASHBOARD SECTION */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg">
            <h2 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
              📊 Analytics Dashboard
            </h2>
            <div className="space-y-4">
              {/* Progress Bar 1 */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>AI Memory Utilization</span>
                  <span className="text-amber-400">78%</span>
                </div>
                <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: '78%' }}></div>
                </div>
              </div>

              {/* Progress Bar 2 */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>API Request Efficiency</span>
                  <span className="text-emerald-400">94%</span>
                </div>
                <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: '94%' }}></div>
                </div>
              </div>

              {/* Progress Bar 3 */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span>Self-Correction Success Rate</span>
                  <span className="text-blue-400">89%</span>
                </div>
                <div className="w-full bg-slate-700 h-3 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: '89%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. AI COPILOT CHAT BOX INTERFACE */}
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-lg flex flex-col h-[400px]">
            <h2 className="text-xl font-bold text-blue-400 mb-3 flex items-center gap-2">
              💬 AI Copilot Chat
            </h2>
            
            {/* Scrollable Message Box */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4 scrollbar-thin scrollbar-thumb-slate-700">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-lg p-3 text-sm ${
                    msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-100'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Message Form */}
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask architect assistant..."
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                Send
              </button>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
