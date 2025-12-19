
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie 
} from 'recharts';
import { TrendingUp, AlertCircle, Clock, CheckCircle } from 'lucide-react';

const data = [
  { name: '08:00', oee: 65, yield: 92 },
  { name: '10:00', oee: 72, yield: 90 },
  { name: '12:00', oee: 85, yield: 95 },
  { name: '14:00', oee: 78, yield: 93 },
  { name: '16:00', oee: 82, yield: 94 },
  { name: '18:00', oee: 90, yield: 96 },
];

const efficiencyData = [
  { name: 'Line A', val: 85 },
  { name: 'Line B', val: 72 },
  { name: 'Line C', val: 94 },
  { name: 'Line D', val: 68 },
];

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="OEE" value="84.2%" trend="+2.4%" icon={<TrendingUp className="text-emerald-500" />} />
        <StatCard title="Active Jobs" value="12" trend="Normal" icon={<Clock className="text-indigo-500" />} />
        <StatCard title="Quality Yield" value="99.1%" trend="+0.3%" icon={<CheckCircle className="text-blue-500" />} />
        <StatCard title="Critical Alerts" value="2" trend="-1" icon={<AlertCircle className="text-rose-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            Production Performance (OEE vs Yield)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="oee" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="yield" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold mb-6">Line Utilization</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={efficiencyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                   cursor={{ fill: '#f8fafc' }}
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="val" fill="#818cf8" radius={[6, 6, 0, 0]}>
                  {efficiencyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.val > 80 ? '#6366f1' : '#94a3b8'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-lg font-bold">Latest Order Alerts</h3>
          <button className="text-indigo-600 text-sm font-semibold hover:underline">View All</button>
        </div>
        <div className="divide-y divide-slate-50">
          <AlertItem 
            title="Batch #4492 - Delay Risk" 
            desc="Material shortage detected in Bin C-4. Expected impact: 2h."
            type="warning"
          />
          <AlertItem 
            title="Machine L-2 Maintenance" 
            desc="Scheduled maintenance window approaching in 45 minutes."
            type="info"
          />
          <AlertItem 
            title="Batch #4489 - Quality Warning" 
            desc="Slight variance in tolerance detected. Adjusting calibration..."
            type="danger"
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, trend, icon }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-50 rounded-xl">{icon}</div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : trend === 'Normal' ? 'bg-slate-50 text-slate-600' : 'bg-rose-50 text-rose-600'}`}>
        {trend}
      </span>
    </div>
    <p className="text-slate-500 text-sm font-medium">{title}</p>
    <h4 className="text-2xl font-bold mt-1 text-slate-800">{value}</h4>
  </div>
);

const AlertItem = ({ title, desc, type }: any) => {
  const colors = {
    warning: 'bg-amber-500',
    info: 'bg-blue-500',
    danger: 'bg-rose-500'
  };
  return (
    <div className="p-6 flex items-start gap-4 hover:bg-slate-50 transition-colors">
      <div className={`w-2 h-2 mt-2 rounded-full ${colors[type as keyof typeof colors]}`} />
      <div>
        <h5 className="font-semibold text-slate-800">{title}</h5>
        <p className="text-slate-500 text-sm mt-1">{desc}</p>
      </div>
    </div>
  );
};

export default Dashboard;
