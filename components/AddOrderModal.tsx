
import React, { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import { predictProductionTime } from '../services/geminiService';
import { ProductionOrder, ProductionStatus } from '../types';

interface AddOrderModalProps {
  onClose: () => void;
  onAdd: (order: ProductionOrder) => void;
  history: ProductionOrder[];
}

const AddOrderModal: React.FC<AddOrderModalProps> = ({ onClose, onAdd, history }) => {
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState(100);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  const handleAISuggest = async () => {
    if (!productName) return;
    setLoadingAI(true);
    try {
      const suggestion = await predictProductionTime(productName, quantity, history);
      setStartDate(suggestion.startDate);
      setEndDate(suggestion.endDate);
    } catch (error) {
      console.error("AI suggestion failed", error);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder: ProductionOrder = {
      id: Math.random().toString(36).substr(2, 9),
      orderNumber: `ORD-${Date.now().toString().slice(-4)}`,
      productName,
      quantity,
      startDate,
      endDate,
      status: ProductionStatus.QUEUED,
      priority: 'Medium',
      progress: 0
    };
    onAdd(newOrder);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-bold">New Production Batch</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Product Name</label>
            <input 
              required
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Lithium Battery Pack"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Target Quantity</label>
            <input 
              type="number"
              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </div>
          
          <div className="pt-2">
             <button 
              type="button"
              onClick={handleAISuggest}
              disabled={loadingAI || !productName}
              className="w-full py-2 px-4 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:bg-indigo-100 transition-colors disabled:opacity-50"
            >
              {loadingAI ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              Auto-generate Schedule with AI
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Start Date</label>
              <input 
                type="date"
                required
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">End Date</label>
              <input 
                type="date"
                required
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-4">
            <button 
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
            >
              Confirm Production Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrderModal;
