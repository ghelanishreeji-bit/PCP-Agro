
import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Check, 
  FileSpreadsheet, 
  Loader2, 
  Edit3, 
  Trash2, 
  Plus,
  X,
  Package,
  Layers,
  Info,
  Download
} from 'lucide-react';
import { InventoryItem } from '../types';

interface SettingsProps {
  inventory: InventoryItem[];
  onUpdateInventory: (updatedItems: InventoryItem[]) => void;
  onAddItem: (item: InventoryItem) => void;
  onDeleteItem: (id: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ inventory, onUpdateInventory, onAddItem, onDeleteItem }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const calculateStatus = (qty: number): 'In Stock' | 'Out of Stock' => {
    return qty > 0 ? 'In Stock' : 'Out of Stock';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      
      setTimeout(() => {
        setIsUploading(false);
        setShowSuccess(true);
        
        const erpUpdates = inventory.map(item => {
          const newQty = Math.max(0, Math.floor(item.quantity + (Math.random() * 500 - 100)));
          return {
            ...item,
            quantity: newQty,
            status: calculateStatus(newQty)
          };
        });
        
        onUpdateInventory(erpUpdates);
        setTimeout(() => setShowSuccess(false), 3000);
      }, 2000);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleUpdateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      const updatedItem = {
        ...editingItem,
        status: calculateStatus(editingItem.quantity)
      };
      const updated = inventory.map(item => item.id === updatedItem.id ? updatedItem : item);
      onUpdateInventory(updated);
      setEditingItem(null);
    }
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const qty = Number(formData.get('quantity'));
    const newItem: InventoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      sku: formData.get('sku') as string,
      group: formData.get('group') as 'Raw Material' | 'Packing Material',
      quantity: qty,
      unit: formData.get('unit') as string,
      reorderLevel: Number(formData.get('reorderLevel')),
      status: calculateStatus(qty)
    };
    
    onAddItem(newItem);
    setIsAddingNew(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      {/* ERP Sync Section */}
      <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">ERP Data Synchronization</h2>
              <p className="text-sm text-slate-500">Upload Excel extracts to sync Master and Control lists</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
             <Info size={14} className="text-slate-400" />
             <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Status is auto-calculated based on quantity</span>
          </div>
        </div>

        <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-2">
              <Download size={12} /> REQUIRED EXCEL TEMPLATE HEADERS
            </span>
          </div>
          <div className="grid grid-cols-6 gap-1">
            {['Name', 'SKU', 'Group', 'Quantity', 'Unit', 'Reorder Level'].map(header => (
              <div key={header} className="bg-white px-2 py-1.5 rounded-lg border border-slate-200 text-center text-[10px] font-mono font-bold text-indigo-600 truncate shadow-sm">
                {header}
              </div>
            ))}
          </div>
          <p className="text-[9px] text-slate-400 mt-2 italic">Note: Status column is no longer required as it is identified automatically.</p>
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept=".xlsx, .xls, .csv" 
        />

        <div 
          className={`border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer
            ${isUploading ? 'bg-slate-50 border-indigo-200 cursor-wait' : 'bg-slate-50/50 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30'}
          `}
          onClick={triggerFileUpload}
        >
          {isUploading ? (
            <>
              <Loader2 size={48} className="text-indigo-600 animate-spin mb-4" />
              <p className="font-bold text-slate-700">Mapping Excel Columns...</p>
              <p className="text-sm text-slate-400">Verifying headers and processing rows</p>
            </>
          ) : showSuccess ? (
            <>
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <Check size={32} />
              </div>
              <p className="font-bold text-emerald-700">Sync Complete!</p>
              <p className="text-sm text-emerald-600">All Master & Control inventory records updated</p>
            </>
          ) : (
            <>
              <Upload size={48} className="text-slate-300 mb-4" />
              <p className="font-bold text-slate-700">Select Excel from Computer</p>
              <p className="text-sm text-slate-400 mt-2">Syncing your local data with the ProTrack cloud</p>
            </>
          )}
        </div>
      </section>

      {/* Inventory Master Management */}
      <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Package size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Inventory Master List</h2>
              <p className="text-sm text-slate-500">Edit material profiles and SKUs. Status updates automatically.</p>
            </div>
          </div>
          <button 
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <Plus size={18} /> Add Material
          </button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Product / Material</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Group</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">SKU / Batch #</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Quantity</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {inventory.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{item.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      <Layers size={14} className="text-indigo-400" />
                      {item.group}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{item.sku}</td>
                  <td className="px-6 py-4 text-center font-medium text-slate-700">{item.quantity} <span className="text-[10px] text-slate-400 uppercase">{item.unit}</span></td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                      item.quantity > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {item.quantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setEditingItem(item)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      >
                        <Edit3 size={16} />
                      </button>
                      <button 
                        onClick={() => { if(window.confirm(`Delete ${item.name}?`)) onDeleteItem(item.id); }}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Edit Material Record</h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleUpdateItem} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Product Name</label>
                <input 
                  type="text" 
                  value={editingItem.name}
                  onChange={e => setEditingItem({...editingItem, name: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Product Group</label>
                  <select 
                    value={editingItem.group}
                    onChange={e => setEditingItem({...editingItem, group: e.target.value as any})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Raw Material">Raw Material</option>
                    <option value="Packing Material">Packing Material</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">SKU / Batch #</label>
                  <input 
                    type="text" 
                    value={editingItem.sku}
                    onChange={e => setEditingItem({...editingItem, sku: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Quantity</label>
                  <input 
                    type="number" 
                    value={editingItem.quantity}
                    onChange={e => setEditingItem({...editingItem, quantity: Number(e.target.value)})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Reorder Level</label>
                  <input 
                    type="number" 
                    value={editingItem.reorderLevel}
                    onChange={e => setEditingItem({...editingItem, reorderLevel: Number(e.target.value)})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">PREVIEW STATUS</span>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${editingItem.quantity > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                  {editingItem.quantity > 0 ? 'IN STOCK' : 'OUT OF STOCK'}
                </span>
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add New Modal */}
      {isAddingNew && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">Add New Material</h3>
              <button onClick={() => setIsAddingNew(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddNewItem} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Product Name</label>
                <input name="name" required type="text" placeholder="e.g. Copper Foil" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Product Group</label>
                  <select name="group" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="Raw Material">Raw Material</option>
                    <option value="Packing Material">Packing Material</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">SKU / Batch #</label>
                  <input name="sku" required type="text" placeholder="SKU-000" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Initial Quantity</label>
                  <input name="quantity" required type="number" defaultValue="0" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Unit</label>
                  <input name="unit" required type="text" placeholder="pcs / kg" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Reorder Level</label>
                <input name="reorderLevel" required type="number" defaultValue="10" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                <p className="text-[10px] text-indigo-600 font-bold uppercase">Pro-Tip</p>
                <p className="text-[11px] text-indigo-500 mt-1 italic">Stock status is determined by quantity automatically. 0 = Out of Stock, >0 = In Stock.</p>
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                Create Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
