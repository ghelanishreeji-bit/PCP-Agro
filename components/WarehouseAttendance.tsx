
import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Plus, 
  Upload, 
  FileSpreadsheet, 
  ClipboardCheck, 
  ChevronRight, 
  Search, 
  X,
  UserPlus,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { Warehouse, AttendanceRecord, AttendanceStatus } from '../types';

interface WarehouseAttendanceProps {
  warehouses: Warehouse[];
  attendance: AttendanceRecord[];
  onAddWarehouse: (w: Warehouse) => void;
  onAddAttendance: (a: AttendanceRecord[]) => void;
}

const WarehouseAttendance: React.FC<WarehouseAttendanceProps> = ({ 
  warehouses, 
  attendance, 
  onAddWarehouse, 
  onAddAttendance 
}) => {
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(null);
  const [isAddingWarehouse, setIsAddingWarehouse] = useState(false);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [isUploadingExcel, setIsUploadingExcel] = useState(false);
  const [showSyncSuccess, setShowSyncSuccess] = useState(false);

  // Form States
  const [newWhName, setNewWhName] = useState('');
  const [newWhLocation, setNewWhLocation] = useState('');

  const [manualWorker, setManualWorker] = useState('');
  const [manualStatus, setManualStatus] = useState<AttendanceStatus>(AttendanceStatus.PRESENT);
  const [manualShift, setManualShift] = useState<'Morning' | 'Evening' | 'Night'>('Morning');
  const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);

  const activeWarehouse = warehouses.find(w => w.id === selectedWarehouseId);
  const activeAttendance = attendance.filter(a => a.warehouseId === selectedWarehouseId);

  const handleAddWarehouse = () => {
    if (!newWhName) return;
    onAddWarehouse({
      id: Math.random().toString(36).substr(2, 9),
      name: newWhName,
      location: newWhLocation,
      workerCount: 0
    });
    setNewWhName('');
    setNewWhLocation('');
    setIsAddingWarehouse(false);
  };

  const handleManualEntry = () => {
    if (!manualWorker || !selectedWarehouseId) return;
    const record: AttendanceRecord = {
      id: Math.random().toString(36).substr(2, 9),
      warehouseId: selectedWarehouseId,
      workerName: manualWorker,
      status: manualStatus,
      shift: manualShift,
      date: manualDate
    };
    onAddAttendance([record]);
    setManualWorker('');
    setIsManualEntry(false);
  };

  const handleExcelUpload = () => {
    if (!selectedWarehouseId) return;
    setIsUploadingExcel(true);
    // Simulate parsing
    setTimeout(() => {
      const simulatedRecords: AttendanceRecord[] = [
        { id: Math.random().toString(), warehouseId: selectedWarehouseId, workerName: 'John Doe', status: AttendanceStatus.PRESENT, shift: 'Morning', date: manualDate },
        { id: Math.random().toString(), warehouseId: selectedWarehouseId, workerName: 'Jane Smith', status: AttendanceStatus.HALF_DAY, shift: 'Morning', date: manualDate },
        { id: Math.random().toString(), warehouseId: selectedWarehouseId, workerName: 'Robert Brown', status: AttendanceStatus.ABSENT, shift: 'Morning', date: manualDate },
      ];
      onAddAttendance(simulatedRecords);
      setIsUploadingExcel(false);
      setShowSyncSuccess(true);
      setTimeout(() => setShowSyncSuccess(false), 3000);
    }, 1500);
  };

  const getStatusStyle = (status: AttendanceStatus) => {
    switch (status) {
      case AttendanceStatus.PRESENT: return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case AttendanceStatus.ABSENT: return 'bg-rose-50 text-rose-600 border-rose-100';
      case AttendanceStatus.HALF_DAY: return 'bg-amber-50 text-amber-600 border-amber-100';
      case AttendanceStatus.LEAVE: return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Warehouse Attendance</h2>
          <p className="text-slate-500 text-sm">Monitor staff presence and shifts across multiple hubs</p>
        </div>
        {!selectedWarehouseId && (
          <button 
            onClick={() => setIsAddingWarehouse(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <Plus size={20} /> Add Warehouse
          </button>
        )}
        {selectedWarehouseId && (
          <button 
            onClick={() => setSelectedWarehouseId(null)}
            className="text-slate-500 font-bold hover:text-slate-800 flex items-center gap-2 px-4 py-2 hover:bg-slate-100 rounded-xl transition-all"
          >
            <ChevronRight className="rotate-180" size={20} /> Back to Warehouses
          </button>
        )}
      </div>

      {!selectedWarehouseId ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {warehouses.map(wh => (
            <div 
              key={wh.id}
              onClick={() => setSelectedWarehouseId(wh.id)}
              className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <Building2 size={24} />
                </div>
                <ChevronRight className="text-slate-300 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" size={20} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-1">{wh.name}</h3>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider mb-4">{wh.location || 'Central Location'}</p>
              
              <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-500 overflow-hidden">
                      <Users size={12} />
                    </div>
                  ))}
                </div>
                <span className="text-sm font-bold text-slate-500">{wh.workerCount || 0} Registered Workers</span>
              </div>
            </div>
          ))}

          {warehouses.length === 0 && (
            <div className="col-span-full py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
              <Building2 size={48} className="mb-4 opacity-20" />
              <p className="font-medium">No warehouses registered</p>
              <p className="text-sm">Click the button above to start managing your staff locations.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <Building2 size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-800">{activeWarehouse?.name}</h3>
                <p className="text-slate-500 font-medium">{activeWarehouse?.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsUploadingExcel(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-all"
              >
                <FileSpreadsheet size={18} /> Excel Upload
              </button>
              <button 
                onClick={() => setIsManualEntry(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all"
              >
                <UserPlus size={18} /> Manual Entry
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row justify-between items-center gap-4">
               <h4 className="font-bold text-slate-800 flex items-center gap-2">
                 <ClipboardCheck size={20} className="text-indigo-600" /> Attendance Ledger
               </h4>
               <div className="flex items-center gap-3 w-full sm:w-auto">
                 <div className="relative flex-1 sm:w-64">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                   <input 
                    type="text" 
                    placeholder="Search staff name..."
                    className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                   />
                 </div>
                 <input 
                  type="date"
                  value={manualDate}
                  onChange={(e) => setManualDate(e.target.value)}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                 />
               </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Worker Name</th>
                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Shift</th>
                    <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {activeAttendance.map(entry => (
                    <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-4">
                        <span className="font-bold text-slate-700">{entry.workerName}</span>
                      </td>
                      <td className="px-8 py-4 text-sm text-slate-500 font-medium">{entry.date}</td>
                      <td className="px-8 py-4">
                        <span className="text-xs font-bold px-2 py-1 bg-slate-100 text-slate-600 rounded-lg">{entry.shift}</span>
                      </td>
                      <td className="px-8 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-tight ${getStatusStyle(entry.status)}`}>
                          {entry.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {activeAttendance.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center text-slate-400 italic">
                        No attendance records found for this location and date.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Warehouse Modal */}
      {isAddingWarehouse && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">New Warehouse</h3>
              <button onClick={() => setIsAddingWarehouse(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Warehouse Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. North Logistix Center"
                  value={newWhName}
                  onChange={(e) => setNewWhName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Location / Area</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="e.g. Zone B, Industrial Ave"
                  value={newWhLocation}
                  onChange={(e) => setNewWhLocation(e.target.value)}
                />
              </div>
              <button 
                onClick={handleAddWarehouse}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 mt-4"
              >
                Register Warehouse
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Entry Modal */}
      {isManualEntry && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Manual Attendance</h3>
              <button onClick={() => setIsManualEntry(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Worker Name</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Full name of worker"
                  value={manualWorker}
                  onChange={(e) => setManualWorker(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                  <select 
                    value={manualStatus}
                    onChange={(e) => setManualStatus(e.target.value as AttendanceStatus)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {Object.values(AttendanceStatus).map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Shift</label>
                  <select 
                    value={manualShift}
                    onChange={(e) => setManualShift(e.target.value as any)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </select>
                </div>
              </div>
              <button 
                onClick={handleManualEntry}
                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 mt-4"
              >
                Log Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Excel Upload Modal */}
      {isUploadingExcel && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-10 flex flex-col items-center justify-center animate-in zoom-in duration-200">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mb-6 animate-pulse">
              <FileSpreadsheet size={40} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Process Excel Data</h3>
            <p className="text-slate-500 text-center text-sm mb-8 leading-relaxed">
              Drop your attendance sheet from the external biometrics system to sync with ProTrack.
            </p>
            <div className="w-full flex gap-3">
              <button 
                onClick={() => setIsUploadingExcel(false)}
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={handleExcelUpload}
                className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
              >
                Upload & Sync
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sync Success Overlay */}
      {showSyncSuccess && (
        <div className="fixed bottom-8 right-8 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-300 z-50">
          <CheckCircle2 size={24} />
          <span className="font-bold">Staff attendance synced successfully!</span>
        </div>
      )}
    </div>
  );
};

export default WarehouseAttendance;
