
import React, { useState } from 'react';
import { Factory, Plus, Trash2, Package, Beaker, Archive } from 'lucide-react';
import { ProductionProcess, InventoryItem, MaterialRequirement } from '../types';

interface ManufacturingManagerProps {
  processes: ProductionProcess[];
  inventory: InventoryItem[];
  onAddProcess: (process: ProductionProcess) => void;
  onDeleteProcess: (id: string) => void;
}

const ManufacturingManager: React.FC<ManufacturingManagerProps> = ({ processes, inventory, onAddProcess, onDeleteProcess }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [rawReqs, setRawReqs] = useState<MaterialRequirement[]>([]);
  const [packReqs, setPackReqs] = useState<MaterialRequirement[]>([]);

  const addRequirement = (type: 'raw' | 'pack') => {
    const newReq = { inventoryItemId: inventory[0]?.id || '', quantityPerUnit: 1 };
    if (type === 'raw') setRawReqs([...rawReqs, newReq]);
    else setPackReqs([...packReqs, newReq]);
  };

  const updateRequirement = (type: 'raw' | 'pack', index: number, field: keyof MaterialRequirement, value: any) => {
    const list = type === 'raw' ? [...rawReqs] : [...packReqs];
    list[index] = { ...list[index], [field]: value };
    if (type === 'raw') setRawReqs(list);
    else setPackReqs(list);
  };

  const removeRequirement = (type: 'raw' | 'pack', index: number) => {
    const list = type === 'raw' ? [...rawReqs] : [...packReqs];
    list.splice(index, 1);
    if (type === 'raw') setRawReqs(list);
    else setPackReqs(list);
  };

  const handleSave = () => {
    if (!newProductName) return;
    onAddProcess({
      id: Math.random().toString(36).substr(2, 9),
      productName: newProductName,
      rawMaterials: rawReqs,
      packingMaterials: packReqs
    });
    setIsAdding(false);
    setNewProductName('');
    setRawReqs([]);
    setPackReqs([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Manufacturing Processes</h2>
          <p className="text-slate-500 text-sm">Define Bill of Materials (BOM) for automated inventory deduction</p>
        </div>
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <Plus size={20} /> Define New Process
          </button>
        )}
      </div>

      {isAdding && (
        <div className="bg-white rounded-2xl shadow-sm border-2 border-indigo-100 p-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Package className="text-indigo-600" /> Production Recipe Builder
            </h3>
            <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">Cancel</button>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Final Product Name</label>
              <input 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="e.g. Circuit Board A1"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Raw Materials */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-700 flex items-center gap-2">
                    <Beaker size={18} className="text-indigo-500" /> Raw Materials
                  </h4>
                  <button onClick={() => addRequirement('raw')} className="text-xs font-bold text-indigo-600 hover:underline">Add Item</button>
                </div>
                <div className="space-y-2">
                  {rawReqs.map((req, i) => (
                    <div key={i} className="flex gap-2">
                      <select 
                        value={req.inventoryItemId}
                        onChange={(e) => updateRequirement('raw', i, 'inventoryItemId', e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-sm outline-none"
                      >
                        {inventory.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                      </select>
                      <input 
                        type="number"
                        placeholder="Qty"
                        className="w-20 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-sm outline-none"
                        value={req.quantityPerUnit}
                        onChange={(e) => updateRequirement('raw', i, 'quantityPerUnit', Number(e.target.value))}
                      />
                      <button onClick={() => removeRequirement('raw', i)} className="text-rose-400 hover:text-rose-600 p-1"><Trash2 size={16} /></button>
                    </div>
                  ))}
                  {rawReqs.length === 0 && <p className="text-xs text-slate-400 italic">No raw materials added</p>}
                </div>
              </div>

              {/* Packing Materials */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-700 flex items-center gap-2">
                    <Archive size={18} className="text-amber-500" /> Packing Materials
                  </h4>
                  <button onClick={() => addRequirement('pack')} className="text-xs font-bold text-indigo-600 hover:underline">Add Item</button>
                </div>
                <div className="space-y-2">
                  {packReqs.map((req, i) => (
                    <div key={i} className="flex gap-2">
                      <select 
                        value={req.inventoryItemId}
                        onChange={(e) => updateRequirement('pack', i, 'inventoryItemId', e.target.value)}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-sm outline-none"
                      >
                        {inventory.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
                      </select>
                      <input 
                        type="number"
                        placeholder="Qty"
                        className="w-20 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-sm outline-none"
                        value={req.quantityPerUnit}
                        onChange={(e) => updateRequirement('pack', i, 'quantityPerUnit', Number(e.target.value))}
                      />
                      <button onClick={() => removeRequirement('pack', i)} className="text-rose-400 hover:text-rose-600 p-1"><Trash2 size={16} /></button>
                    </div>
                  ))}
                  {packReqs.length === 0 && <p className="text-xs text-slate-400 italic">No packing materials added</p>}
                </div>
              </div>
            </div>

            <button 
              onClick={handleSave}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
            >
              Save Production Process
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {processes.map(process => (
          <div key={process.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:border-indigo-200 transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                <Factory size={24} />
              </div>
              <button onClick={() => onDeleteProcess(process.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">{process.productName}</h3>
            
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Raw Materials</p>
                <div className="flex flex-wrap gap-2">
                  {process.rawMaterials.map((req, idx) => (
                    <span key={idx} className="bg-slate-50 text-slate-600 px-2 py-1 rounded-lg text-xs font-medium">
                      {inventory.find(i => i.id === req.inventoryItemId)?.name} ({req.quantityPerUnit})
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Packing Materials</p>
                <div className="flex flex-wrap gap-2">
                  {process.packingMaterials.map((req, idx) => (
                    <span key={idx} className="bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-xs font-medium">
                      {inventory.find(i => i.id === req.inventoryItemId)?.name} ({req.quantityPerUnit})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
        {processes.length === 0 && !isAdding && (
          <div className="col-span-full py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
            <Factory size={48} className="mb-4 opacity-20" />
            <p className="font-medium">No production processes defined yet</p>
            <p className="text-sm">Add one to enable automatic inventory deductions</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManufacturingManager;
