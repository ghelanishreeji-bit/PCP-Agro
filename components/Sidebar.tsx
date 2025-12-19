
import React from 'react';
import { 
  LayoutDashboard, 
  CalendarRange, 
  Package, 
  CheckCircle2, 
  Users, 
  Settings, 
  MessageSquareCode,
  Truck,
  Factory,
  ClipboardList
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'manufacturing', label: 'Manufacturing Setup', icon: Factory },
    { id: 'scheduler', label: 'Production Scheduler', icon: CalendarRange },
    { id: 'inventory', label: 'Inventory Control', icon: Package },
    { id: 'attendance', label: 'Warehouse Attendance', icon: ClipboardList },
    { id: 'logistics', label: 'Transport & Logistics', icon: Truck },
    { id: 'quality', label: 'Quality Assurance', icon: CheckCircle2 },
    { id: 'resources', label: 'Resource Management', icon: Users },
    { id: 'ai-planner', label: 'AI Optimization', icon: MessageSquareCode },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen fixed left-0 top-0 flex flex-col z-20">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-xl">P</div>
        <h1 className="text-xl font-bold tracking-tight">ProTrack <span className="text-indigo-400">PCP</span></h1>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={() => setActiveTab('settings')}
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors"
        >
          <Settings size={20} />
          <span className="text-sm font-medium">Settings</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
