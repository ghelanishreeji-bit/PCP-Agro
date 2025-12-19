
import React, { useState } from 'react';
import { X, Truck, DollarSign } from 'lucide-react';
import { TransportEntry, ProductionOrder } from '../types';

interface AddTransportModalProps {
  onClose: () => void;
  onAdd: (entry: TransportEntry) => void;
  orders: ProductionOrder[];
}

const AddTransportModal: React.FC<AddTransportModalProps> = ({ onClose, onAdd, orders }) => {
  const [transporterName, setTransporterName] = useState('');
  const [orderId, setOrderId] = useState(orders[0]?.id || '');
  const [transportCost, setTransportCost] = useState(0);
  const [loadingCost, setLoadingCost] = useState(0);
  const [unloadingCost, setUnloadingCost] = useState(0);
  const [labourCharge, setLabourCharge] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: TransportEntry = {
      id: Math.random().toString(36).substr(2, 9),
      orderId,
      transporterName,
      transportCost,
      loadingCost,
      unloadingCost,
      labourCharge,
      date
    };
    onAdd(newEntry);
    onClose();
  };

  const total = transportCost + loadingCost + unloadingCost + labourCharge;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Truck size={20} />
            </div>
            <h2 className="text-xl font-bold">Add Transport Record</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-1">Transporter Name</label>
              <input 
                required
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={transporterName}
                onChange={(e) => setTransporterName(e.target.value)}
                placeholder="e.g. Swift Logistics Co."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Link to Order</label>
              <select 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {orders.map(o => (
                  <option key={o.id} value={o.id}>{o.orderNumber} - {o.productName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
              <input 
                type="date"
                required
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-indigo-50/50 p-4 rounded-2xl space-y-4">
            <h3 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Cost Breakdown</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Transport Cost</label>
                <div className="relative">
                  <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="number"
                    className="w-full pl-8 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={transportCost}
                    onChange={(e) => setTransportCost(Number(e.target.value))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Labour Charge</label>
                <div className="relative">
                  <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="number"
                    className="w-full pl-8 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={labourCharge}
                    onChange={(e) => setLabourCharge(Number(e.target.value))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Loading Cost</label>
                <div className="relative">
                  <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="number"
                    className="w-full pl-8 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={loadingCost}
                    onChange={(e) => setLoadingCost(Number(e.target.value))}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Unloading Cost</label>
                <div className="relative">
                  <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input 
                    type="number"
                    className="w-full pl-8 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={unloadingCost}
                    onChange={(e) => setUnloadingCost(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-2 border-t border-indigo-100 flex justify-between items-center">
              <span className="font-bold text-slate-700">Total Logistics Cost:</span>
              <span className="text-xl font-bold text-indigo-600">${total.toLocaleString()}</span>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
          >
            <Truck size={18} /> Save Transport Record
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransportModal;
