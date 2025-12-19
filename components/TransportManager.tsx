
import React from 'react';
import { Truck, Plus, DollarSign, ArrowUpRight } from 'lucide-react';
import { TransportEntry, ProductionOrder } from '../types';

interface TransportManagerProps {
  entries: TransportEntry[];
  orders: ProductionOrder[];
  onAdd: () => void;
}

const TransportManager: React.FC<TransportManagerProps> = ({ entries, orders, onAdd }) => {
  const getOrderNumber = (id: string) => orders.find(o => o.id === id)?.orderNumber || 'Unknown';
  
  const totalLogsCost = entries.reduce((acc, curr) => 
    acc + curr.transportCost + curr.loadingCost + curr.unloadingCost + curr.labourCharge, 0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Transport & Logistics</h2>
          <p className="text-slate-500 text-sm">Monitor and manage transportation costs and labour charges</p>
        </div>
        <button 
          onClick={onAdd}
          className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
        >
          <Plus size={20} /> Add Transport Entry
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Total Logistics Spend</p>
            <h4 className="text-2xl font-bold text-slate-800">${totalLogsCost.toLocaleString()}</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
            <Truck size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Total Shipments</p>
            <h4 className="text-2xl font-bold text-slate-800">{entries.length}</h4>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
            <ArrowUpRight size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Avg. Cost per Batch</p>
            <h4 className="text-2xl font-bold text-slate-800">
              ${entries.length ? Math.round(totalLogsCost / entries.length).toLocaleString() : 0}
            </h4>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase">Date</th>
                <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase">Transporter</th>
                <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase">Linked Order</th>
                <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase">Transport</th>
                <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase">Labour Total</th>
                <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase">Total Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {entries.map(entry => {
                const labourSum = entry.loadingCost + entry.unloadingCost + entry.labourCharge;
                const total = entry.transportCost + labourSum;
                return (
                  <tr key={entry.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-600">{entry.date}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{entry.transporterName}</td>
                    <td className="px-6 py-4 text-sm text-indigo-600 font-semibold">{getOrderNumber(entry.orderId)}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">${entry.transportCost.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800" title={`Loading: ${entry.loadingCost}, Unloading: ${entry.unloadingCost}, Extra: ${entry.labourCharge}`}>
                      ${labourSum.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold text-sm">
                        ${total.toLocaleString()}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400 italic font-medium">
                    No transport records found. Add your first shipment to start tracking costs.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransportManager;
