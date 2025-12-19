
import React, { useState, useEffect, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import GanttScheduler from './components/GanttScheduler';
import AIPlanner from './components/AIPlanner';
import AddOrderModal from './components/AddOrderModal';
import AddTransportModal from './components/AddTransportModal';
import TransportManager from './components/TransportManager';
import ManufacturingManager from './components/ManufacturingManager';
import QualityManager from './components/QualityManager';
import Settings from './components/Settings';
import WarehouseAttendance from './components/WarehouseAttendance';
import { 
  ProductionOrder, 
  ProductionStatus, 
  Resource, 
  InventoryItem, 
  TransportEntry, 
  ProductionProcess, 
  RawMaterialSample, 
  GovProductSample, 
  QualityStatus,
  Warehouse,
  AttendanceRecord,
  AttendanceStatus
} from './types';
import { Search, Bell, User, LayoutGrid, AlertTriangle, Layers } from 'lucide-react';

const INITIAL_ORDERS: ProductionOrder[] = [
  { id: '1', orderNumber: 'ORD-2023-001', productName: 'Circuit Board A1', quantity: 500, startDate: '2023-10-24', endDate: '2023-10-25', status: ProductionStatus.IN_PROGRESS, priority: 'High', progress: 65 },
  { id: '2', orderNumber: 'ORD-2023-002', productName: 'Power Module T-5', quantity: 200, startDate: '2023-10-24', endDate: '2023-10-26', status: ProductionStatus.DELAYED, priority: 'Medium', progress: 12 },
  { id: '3', orderNumber: 'ORD-2023-003', productName: 'Display Panel 14"', quantity: 150, startDate: '2023-10-25', endDate: '2023-10-25', status: ProductionStatus.PLANNING, priority: 'High', progress: 0 },
  { id: '4', orderNumber: 'ORD-2023-004', productName: 'Casing Unit SL', quantity: 1000, startDate: '2023-10-24', endDate: '2023-10-24', status: ProductionStatus.COMPLETED, priority: 'Low', progress: 100 },
];

const INITIAL_RESOURCES: Resource[] = [
  { id: 'r1', name: 'Assembly Line A', type: 'Station', utilization: 85, status: 'Online' },
  { id: 'r2', name: 'SMT Machine 01', type: 'Machine', utilization: 92, status: 'Online' },
  { id: 'r3', name: 'Quality Lab', type: 'Station', utilization: 45, status: 'Maintenance' },
];

const INITIAL_INVENTORY: InventoryItem[] = [
  { id: 'i1', name: 'Resistor 10k', sku: 'E-001', group: 'Raw Material', quantity: 15000, unit: 'pcs', reorderLevel: 5000, status: 'In Stock' },
  { id: 'i2', name: 'Alu Chassis', sku: 'M-552', group: 'Raw Material', quantity: 45, unit: 'units', reorderLevel: 100, status: 'In Stock' },
  { id: 'i3', name: 'Packing Box Small', sku: 'P-101', group: 'Packing Material', quantity: 2000, unit: 'pcs', reorderLevel: 500, status: 'In Stock' },
  { id: 'i4', name: 'Capacitor 47uF', sku: 'E-002', group: 'Raw Material', quantity: 12000, unit: 'pcs', reorderLevel: 3000, status: 'In Stock' },
];

const INITIAL_PROCESSES: ProductionProcess[] = [
  {
    id: 'p1',
    productName: 'Circuit Board A1',
    rawMaterials: [
      { inventoryItemId: 'i1', quantityPerUnit: 10 },
      { inventoryItemId: 'i4', quantityPerUnit: 5 }
    ],
    packingMaterials: [
      { inventoryItemId: 'i3', quantityPerUnit: 1 }
    ]
  }
];

const INITIAL_TRANSPORT: TransportEntry[] = [
  { id: 't1', orderId: '4', transporterName: 'FastTrack Freight', transportCost: 450, loadingCost: 50, unloadingCost: 50, labourCharge: 30, date: '2023-10-24' }
];

const INITIAL_RAW_SAMPLES: RawMaterialSample[] = [
  { id: 'rs1', materialName: 'Liquid Resin B', batchNumber: 'BAT-992-X', supplier: 'ChemicalSolutions Ltd', receivedDate: '2023-10-20', status: QualityStatus.PASS, labTechnician: 'Sarah Miller' },
  { id: 'rs2', materialName: 'Copper Foil 0.2mm', batchNumber: 'CF-5582', supplier: 'Global Metal Co', receivedDate: '2023-10-23', status: QualityStatus.PENDING, labTechnician: 'Sarah Miller' },
];

const INITIAL_GOV_SAMPLES: GovProductSample[] = [
  { id: 'gs1', productName: 'Power Module T-5', orderNumber: 'ORD-2023-002', officialName: 'Inspecter Thompson', department: 'Bureau of Electronics Standard', collectionDate: '2023-10-22', status: QualityStatus.PENDING },
];

const INITIAL_WAREHOUSES: Warehouse[] = [
  { id: 'wh1', name: 'Main Central Hub', location: 'Section A, Industrial District', workerCount: 24 },
  { id: 'wh2', name: 'West Dock Storage', location: 'Section F, Harbor View', workerCount: 12 },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [orders, setOrders] = useState<ProductionOrder[]>(INITIAL_ORDERS);
  const [resources] = useState<Resource[]>(INITIAL_RESOURCES);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [processes, setProcesses] = useState<ProductionProcess[]>(INITIAL_PROCESSES);
  const [transportEntries, setTransportEntries] = useState<TransportEntry[]>(INITIAL_TRANSPORT);
  const [rawSamples, setRawSamples] = useState<RawMaterialSample[]>(INITIAL_RAW_SAMPLES);
  const [govSamples, setGovSamples] = useState<GovProductSample[]>(INITIAL_GOV_SAMPLES);
  const [warehouses, setWarehouses] = useState<Warehouse[]>(INITIAL_WAREHOUSES);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isTransportModalOpen, setIsTransportModalOpen] = useState(false);

  // Computed Alerts
  const lowStockItems = useMemo(() => {
    return inventory.filter(item => item.quantity <= item.reorderLevel);
  }, [inventory]);

  // Mock real-time data simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(currentOrders => 
        currentOrders.map(order => {
          if (order.status === ProductionStatus.IN_PROGRESS && order.progress < 100) {
            const increment = Math.floor(Math.random() * 3) + 1;
            const newProgress = Math.min(100, order.progress + increment);
            return { 
              ...order, 
              progress: newProgress,
              status: newProgress === 100 ? ProductionStatus.COMPLETED : order.status
            };
          }
          return order;
        })
      );
    }, 5000); 

    return () => clearInterval(interval);
  }, []);

  const handleAddOrder = (newOrder: ProductionOrder) => {
    const matchingProcess = processes.find(p => p.productName.toLowerCase() === newOrder.productName.toLowerCase());
    
    if (matchingProcess) {
      setInventory(currentInventory => {
        const nextInventory = [...currentInventory];
        matchingProcess.rawMaterials.forEach(req => {
          const itemIdx = nextInventory.findIndex(item => item.id === req.inventoryItemId);
          if (itemIdx !== -1) {
            nextInventory[itemIdx].quantity -= (req.quantityPerUnit * newOrder.quantity);
            // Re-identify status after deduction
            nextInventory[itemIdx].status = nextInventory[itemIdx].quantity > 0 ? 'In Stock' : 'Out of Stock';
          }
        });
        matchingProcess.packingMaterials.forEach(req => {
          const itemIdx = nextInventory.findIndex(item => item.id === req.inventoryItemId);
          if (itemIdx !== -1) {
            nextInventory[itemIdx].quantity -= (req.quantityPerUnit * newOrder.quantity);
            // Re-identify status after deduction
            nextInventory[itemIdx].status = nextInventory[itemIdx].quantity > 0 ? 'In Stock' : 'Out of Stock';
          }
        });
        return nextInventory;
      });
    }
    setOrders(prev => [newOrder, ...prev]);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'manufacturing':
        return (
          <ManufacturingManager 
            processes={processes} 
            inventory={inventory}
            onAddProcess={(p) => setProcesses([...processes, p])}
            onDeleteProcess={(id) => setProcesses(processes.filter(p => p.id !== id))}
          />
        );
      case 'scheduler':
        return <GanttScheduler orders={orders} onAddBatch={() => setIsOrderModalOpen(true)} />;
      case 'inventory':
        return (
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Inventory Control Center</h2>
                <p className="text-sm text-slate-500">Live stock levels for Raw and Packing Materials</p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-xl border border-indigo-100">
                <Layers size={18} className="text-indigo-600" />
                <span className="text-xs font-bold text-indigo-700">{inventory.length} Total SKUs</span>
              </div>
            </div>
            
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-6 py-4 font-bold text-slate-400 text-xs uppercase">Item Name</th>
                    <th className="px-6 py-4 font-bold text-slate-400 text-xs uppercase">Product Group</th>
                    <th className="px-6 py-4 font-bold text-slate-400 text-xs uppercase">SKU / Batch</th>
                    <th className="px-6 py-4 font-bold text-slate-400 text-xs uppercase text-right">Quantity</th>
                    <th className="px-6 py-4 font-bold text-slate-400 text-xs uppercase text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {inventory.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">{item.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                          <Layers size={14} className="text-indigo-400" />
                          {item.group}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-mono text-xs">{item.sku}</td>
                      <td className="px-6 py-4 text-right text-slate-800 font-bold">
                        {item.quantity.toLocaleString()} <span className="text-[10px] text-slate-400 uppercase font-medium">{item.unit}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-tight ${
                          item.quantity <= 0 
                            ? 'bg-rose-50 text-rose-600 border-rose-100' 
                            : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}>
                          {item.quantity <= 0 ? 'OUT OF STOCK' : (item.quantity <= item.reorderLevel ? 'LOW STOCK' : 'IN STOCK')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'attendance':
        return (
          <WarehouseAttendance 
            warehouses={warehouses} 
            attendance={attendance}
            onAddWarehouse={(w) => setWarehouses([...warehouses, w])}
            onAddAttendance={(recs) => setAttendance([...recs, ...attendance])}
          />
        );
      case 'logistics':
        return (
          <TransportManager 
            entries={transportEntries} 
            orders={orders} 
            onAdd={() => setIsTransportModalOpen(true)} 
          />
        );
      case 'quality':
        return (
          <QualityManager 
            rawSamples={rawSamples} 
            govSamples={govSamples}
            onAddRawSample={(s) => setRawSamples([s, ...rawSamples])}
            onAddGovSample={(s) => setGovSamples([s, ...govSamples])}
            onUpdateRawStatus={(id, status) => setRawSamples(rawSamples.map(s => s.id === id ? { ...s, status } : s))}
            onUpdateGovStatus={(id, status) => setGovSamples(govSamples.map(s => s.id === id ? { ...s, status } : s))}
          />
        );
      case 'ai-planner':
        return <AIPlanner orders={orders} resources={resources} inventory={inventory} />;
      case 'settings':
        return (
          <Settings 
            inventory={inventory} 
            onUpdateInventory={setInventory} 
            onAddItem={(item) => setInventory([...inventory, item])}
            onDeleteItem={(id) => setInventory(inventory.filter(i => i.id !== id))}
          />
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <LayoutGrid size={48} className="mb-4 opacity-20" />
            <p className="font-medium">Module coming soon</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8 bg-white/50 backdrop-blur-md sticky top-0 py-4 -mt-4 z-20 border-b border-slate-200/30">
          <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm w-96">
            <Search className="text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search global dashboard..." 
              className="bg-transparent border-none focus:outline-none text-sm w-full"
            />
          </div>
          
          <div className="flex items-center gap-4">
            {lowStockItems.length > 0 && (
              <div 
                onClick={() => setActiveTab('settings')}
                className="flex items-center gap-2 bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-xl cursor-pointer hover:bg-rose-100 transition-colors"
              >
                <AlertTriangle size={16} className="text-rose-600 animate-pulse" />
                <span className="text-[10px] font-bold text-rose-700 uppercase">{lowStockItems.length} Materials Low</span>
              </div>
            )}
            
            <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-all">
              <Bell size={20} />
              {lowStockItems.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full"></span>
              )}
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800">Operational Manager</p>
                <p className="text-[10px] text-slate-500 font-medium">Shift A • Line Manager</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 border border-indigo-200 overflow-hidden">
                <User size={24} />
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>

      {isOrderModalOpen && (
        <AddOrderModal 
          onClose={() => setIsOrderModalOpen(false)} 
          onAdd={handleAddOrder} 
          history={orders}
        />
      )}

      {isTransportModalOpen && (
        <AddTransportModal 
          onClose={() => setIsTransportModalOpen(false)} 
          onAdd={(e) => setTransportEntries([e, ...transportEntries])} 
          orders={orders}
        />
      )}
    </div>
  );
};

export default App;
