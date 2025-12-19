
import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, CheckCircle2, AlertTriangle, Zap, MessageSquare } from 'lucide-react';
import { getPlanningOptimizations, chatWithPlanner } from '../services/geminiService';
import { ProductionOrder, Resource, InventoryItem } from '../types';

interface AIPlannerProps {
  orders: ProductionOrder[];
  resources: Resource[];
  inventory: InventoryItem[];
}

const AIPlanner: React.FC<AIPlannerProps> = ({ orders, resources, inventory }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: string, content: string }[]>([]);

  const runOptimization = async () => {
    setLoading(true);
    try {
      const data = await getPlanningOptimizations(orders, resources, inventory);
      setResults(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = { role: 'user', content: chatMessage };
    setChatHistory(prev => [...prev, userMsg]);
    setChatMessage('');

    try {
      const response = await chatWithPlanner(chatHistory, chatMessage);
      setChatHistory(prev => [...prev, { role: 'assistant', content: response || 'No response' }]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="text-indigo-200" />
              <h2 className="text-2xl font-bold">ProTrack AI Planner</h2>
            </div>
            <p className="text-indigo-100 mb-8 max-w-lg">
              Analyze your current production line setup, inventory levels, and orders to get optimized sequencing and risk mitigation strategies.
            </p>
            <button 
              onClick={runOptimization}
              disabled={loading}
              className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-50 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
              Generate Optimization Plan
            </button>
          </div>
          <Sparkles className="absolute -right-8 -bottom-8 w-64 h-64 text-indigo-500 opacity-20 pointer-events-none" />
        </div>

        {results && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <AlertTriangle className="text-amber-500" size={16} /> Critical Risks
                </h3>
                <ul className="space-y-3">
                  {results.criticalRisks.map((risk: string, i: number) => (
                    <li key={i} className="flex gap-3 text-slate-700 text-sm font-medium">
                      <span className="text-amber-500 shrink-0">•</span>
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <CheckCircle2 className="text-emerald-500" size={16} /> Optimized Sequence
                </h3>
                <div className="space-y-2">
                  {results.suggestedPriority.map((item: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">{i+1}</span>
                      <span className="text-sm font-semibold text-slate-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold mb-4">Strategic Optimizations</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {results.optimizations.map((opt: any, i: number) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-100 bg-slate-50 relative overflow-hidden">
                    <div className={`absolute top-0 right-0 px-2 py-0.5 text-[10px] font-bold uppercase rounded-bl-lg text-white ${
                      opt.impact === 'High' ? 'bg-indigo-600' : 'bg-slate-400'
                    }`}>
                      {opt.impact} Impact
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1 mt-2">{opt.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{opt.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col h-[calc(100vh-12rem)] sticky top-24">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex-1 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-indigo-50/30">
            <MessageSquare size={18} className="text-indigo-600" />
            <h3 className="font-bold text-slate-800">Planner Assistant</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatHistory.length === 0 && (
              <div className="text-center py-10 px-4">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Sparkles size={24} />
                </div>
                <p className="text-sm font-medium text-slate-700">Ask me anything about your production flow</p>
                <p className="text-xs text-slate-400 mt-2 italic">"What's the best sequence for Batch 44?"</p>
              </div>
            )}
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-slate-100 text-slate-700 rounded-bl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleChat} className="p-4 border-t border-slate-100 bg-white">
            <div className="relative">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask your assistant..."
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <button 
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Zap size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AIPlanner;
