
import React, { useState, useMemo } from 'react';
import { ProductionOrder, ProductionStatus } from '../types';
import { MoreVertical, Plus, ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';

interface GanttSchedulerProps {
  orders: ProductionOrder[];
  onAddBatch: () => void;
}

const GanttScheduler: React.FC<GanttSchedulerProps> = ({ orders, onAddBatch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const hours = Array.from({ length: 12 }, (_, i) => `${8 + i}:00`);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Shop Floor Timeline</h2>
          <p className="text-slate-500 text-sm">Real-time scheduling for Tuesday, Oct 24</p>
        </div>
        
        <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto">
          <div className="relative flex-1 lg:flex-none lg:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Filter orders..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          >
            <option value="All">All Statuses</option>
            {Object.values(ProductionStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <button 
            onClick={onAddBatch}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-indigo-700 transition-colors shrink-0 shadow-sm"
          >
            <Plus size={18} /> New Batch
          </button>
        </div>
      </div>

      <div className="overflow-x-auto gantt-scroll">
        <div className="min-w-[1200px]">
          {/* Header */}
          <div className="flex border-b border-slate-100">
            <div className="w-64 p-4 sticky left-0 bg-white border-r border-slate-100 font-bold text-xs text-slate-400 uppercase tracking-wider">Production Line / Order</div>
            {hours.map(hour => (
              <div key={hour} className="flex-1 p-4 text-center text-xs font-bold text-slate-400 border-r border-slate-50 last:border-0">{hour}</div>
            ))}
          </div>

          {/* Rows */}
          <div className="divide-y divide-slate-100">
            {filteredOrders.length > 0 ? filteredOrders.map((order, idx) => (
              <div key={order.id} className="flex group hover:bg-slate-50/50">
                <div className="w-64 p-4 sticky left-0 bg-white group-hover:bg-slate-50 transition-colors border-r border-slate-100 z-10 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{order.productName}</p>
                    <p className="text-xs text-slate-500">#{order.orderNumber} • {order.quantity} units</p>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={16} /></button>
                </div>
                <div className="flex-1 relative h-20 flex items-center">
                  {/* Grid Lines Overlay */}
                  <div className="absolute inset-0 flex">
                    {hours.map((_, i) => (
                      <div key={i} className="flex-1 border-r border-slate-50 last:border-0" />
                    ))}
                  </div>
                  
                  {/* Actual Bar */}
                  <div 
                    className={`absolute h-12 rounded-xl border-l-4 shadow-sm flex flex-col justify-center px-4 overflow-hidden transition-all hover:scale-[1.02] cursor-pointer
                      ${order.status === ProductionStatus.COMPLETED ? 'bg-emerald-50 border-emerald-500 text-emerald-700' :
                        order.status === ProductionStatus.IN_PROGRESS ? 'bg-indigo-50 border-indigo-500 text-indigo-700' :
                        order.status === ProductionStatus.DELAYED ? 'bg-rose-50 border-rose-500 text-rose-700' :
                        'bg-slate-50 border-slate-400 text-slate-600'
                      }`}
                    style={{ 
                      left: `${(idx * 4 + 2)%70}%`, 
                      width: `${Math.max(20, order.progress * 0.8)}%` 
                    }}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold whitespace-nowrap">{order.status}</span>
                      <span className="text-[10px] font-medium opacity-70">{order.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200/50 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${
                          order.status === ProductionStatus.COMPLETED ? 'bg-emerald-500' :
                          order.status === ProductionStatus.IN_PROGRESS ? 'bg-indigo-500' :
                          'bg-slate-400'
                        }`} 
                        style={{ width: `${order.progress}%` }} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="p-20 text-center text-slate-400 italic">No orders match your filters</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GanttScheduler;
