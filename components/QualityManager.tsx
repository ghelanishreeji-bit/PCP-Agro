
import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  Building2, 
  Plus, 
  FileCheck, 
  UserCheck,
  Search,
  Package
} from 'lucide-react';
import { RawMaterialSample, GovProductSample, QualityStatus } from '../types';

interface QualityManagerProps {
  rawSamples: RawMaterialSample[];
  govSamples: GovProductSample[];
  onAddRawSample: (sample: RawMaterialSample) => void;
  onAddGovSample: (sample: GovProductSample) => void;
  onUpdateRawStatus: (id: string, status: QualityStatus) => void;
  onUpdateGovStatus: (id: string, status: QualityStatus) => void;
}

const QualityManager: React.FC<QualityManagerProps> = ({ 
  rawSamples, 
  govSamples, 
  onAddRawSample, 
  onAddGovSample,
  onUpdateRawStatus,
  onUpdateGovStatus
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'raw' | 'gov'>('raw');
  const [showRawForm, setShowRawForm] = useState(false);
  const [showGovForm, setShowGovForm] = useState(false);

  // Helper component to render status badges
  const StatusBadge = ({ status }: { status: QualityStatus }) => {
    switch (status) {
      case QualityStatus.PASS:
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100"><CheckCircle2 size={12}/> PASS</span>;
      case QualityStatus.FAIL:
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100"><XCircle size={12}/> FAIL</span>;
      default:
        return <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100"><Clock size={12}/> PENDING</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Quality Assurance Dashboard</h2>
          <p className="text-slate-500 text-sm">Manage inspections, lab results, and regulatory compliance</p>
        </div>
        <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
          <button 
            onClick={() => setActiveSubTab('raw')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeSubTab === 'raw' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Raw Material Batches
          </button>
          <button 
            onClick={() => setActiveSubTab('gov')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeSubTab === 'gov' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Government Samples
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600"><FileCheck size={24}/></div>
            <span className="text-xs font-bold text-slate-400">Total Inspections</span>
          </div>
          <h4 className="text-2xl font-bold text-slate-800">{rawSamples.length + govSamples.length}</h4>
          <p className="text-slate-400 text-xs mt-1">Combined QA metrics</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-emerald-50 rounded-xl text-emerald-600"><ShieldCheck size={24}/></div>
            <span className="text-xs font-bold text-slate-400">Compliance Rate</span>
          </div>
          <h4 className="text-2xl font-bold text-slate-800">98.4%</h4>
          <p className="text-emerald-500 text-xs mt-1">+0.2% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-50 rounded-xl text-amber-600"><Clock size={24}/></div>
            <span className="text-xs font-bold text-slate-400">Awaiting Results</span>
          </div>
          <h4 className="text-2xl font-bold text-slate-800">
            {rawSamples.filter(s => s.status === QualityStatus.PENDING).length + 
             govSamples.filter(s => s.status === QualityStatus.PENDING).length}
          </h4>
          <p className="text-amber-500 text-xs mt-1">Pending lab/official reports</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            {activeSubTab === 'raw' ? <><Package size={18} className="text-indigo-600"/> Incoming Raw Material Sampling</> : <><Building2 size={18} className="text-indigo-600"/> Regulatory Compliance Samples</>}
          </h3>
          <button 
            onClick={() => activeSubTab === 'raw' ? setShowRawForm(true) : setShowGovForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-sm"
          >
            <Plus size={16}/> Record New Sample
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {activeSubTab === 'raw' ? 'Material / Batch' : 'Product / Order'}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {activeSubTab === 'raw' ? 'Supplier' : 'Government Official'}
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date Collected</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {activeSubTab === 'raw' ? (
                rawSamples.map(sample => (
                  <tr key={sample.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{sample.materialName}</div>
                      <div className="text-xs text-slate-400 font-mono">#{sample.batchNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-600">{sample.supplier}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">Lab: {sample.labTechnician}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{sample.receivedDate}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={sample.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => onUpdateRawStatus(sample.id, QualityStatus.PASS)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Mark Pass"><CheckCircle2 size={16}/></button>
                        <button onClick={() => onUpdateRawStatus(sample.id, QualityStatus.FAIL)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Mark Fail"><XCircle size={16}/></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                govSamples.map(sample => (
                  <tr key={sample.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{sample.productName}</div>
                      <div className="text-xs text-slate-400 font-mono">Order: {sample.orderNumber}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-slate-600">{sample.officialName}</div>
                      <div className="text-[10px] text-slate-400 uppercase font-bold">{sample.department}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{sample.collectionDate}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={sample.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => onUpdateGovStatus(sample.id, QualityStatus.PASS)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Mark Pass"><CheckCircle2 size={16}/></button>
                        <button onClick={() => onUpdateGovStatus(sample.id, QualityStatus.FAIL)} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors" title="Mark Fail"><XCircle size={16}/></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
              {((activeSubTab === 'raw' && rawSamples.length === 0) || (activeSubTab === 'gov' && govSamples.length === 0)) && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-slate-400 italic font-medium">
                    No sampling records found for this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Simple Modals for Adding Samples */}
      {showRawForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in duration-150">
            <h3 className="text-lg font-bold mb-4">Record Raw Material Sample</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Material Name" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" id="raw-name" />
              <input type="text" placeholder="Batch Number" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" id="raw-batch" />
              <input type="text" placeholder="Supplier" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" id="raw-supplier" />
              <input type="text" placeholder="Lab Technician" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" id="raw-tech" />
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowRawForm(false)} 
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    const name = (document.getElementById('raw-name') as HTMLInputElement).value;
                    const batch = (document.getElementById('raw-batch') as HTMLInputElement).value;
                    const supplier = (document.getElementById('raw-supplier') as HTMLInputElement).value;
                    const tech = (document.getElementById('raw-tech') as HTMLInputElement).value;
                    if (name && batch) {
                      onAddRawSample({
                        id: Math.random().toString(36).substr(2, 9),
                        materialName: name,
                        batchNumber: batch,
                        supplier,
                        receivedDate: new Date().toISOString().split('T')[0],
                        status: QualityStatus.PENDING,
                        labTechnician: tech
                      });
                      setShowRawForm(false);
                    }
                  }} 
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all"
                >
                  Save Sample
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showGovForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in zoom-in duration-150">
            <h3 className="text-lg font-bold mb-4">Record Regulatory Sample</h3>
            <div className="space-y-4">
              <input type="text" placeholder="Product Name" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" id="gov-name" />
              <input type="text" placeholder="Order Number" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" id="gov-order" />
              <input type="text" placeholder="Official Name" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" id="gov-official" />
              <input type="text" placeholder="Department" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none" id="gov-dept" />
              <div className="flex gap-3 pt-2">
                <button 
                  onClick={() => setShowGovForm(false)} 
                  className="flex-1 px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    const name = (document.getElementById('gov-name') as HTMLInputElement).value;
                    const order = (document.getElementById('gov-order') as HTMLInputElement).value;
                    const official = (document.getElementById('gov-official') as HTMLInputElement).value;
                    const dept = (document.getElementById('gov-dept') as HTMLInputElement).value;
                    if (name && official) {
                      onAddGovSample({
                        id: Math.random().toString(36).substr(2, 9),
                        productName: name,
                        orderNumber: order,
                        officialName: official,
                        department: dept,
                        collectionDate: new Date().toISOString().split('T')[0],
                        status: QualityStatus.PENDING
                      });
                      setShowGovForm(false);
                    }
                  }} 
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all"
                >
                  Save Sample
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QualityManager;
