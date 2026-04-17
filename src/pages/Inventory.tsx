import { useState, useRef, useEffect } from 'react';
import { 
  Search, Download, Filter, MoreHorizontal, ChevronLeft, ChevronRight, 
  Plus, Package, Edit, Trash2, Wrench, X, Check, Minus 
} from 'lucide-react';
import { useApp } from '../AppContext';
import TopBar from '../components/layout/TopBar';
import Modal from '../components/ui/Modal';
import { Asset } from '../types';
import { fuzzySearch } from '../lib/search';

export default function Inventory() {
  const { assets, addAsset, deleteAsset, updateAsset, adjustQuantity, locations } = useApp();
  const [localSearch, setLocalSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addFormData, setAddFormData] = useState({
    name: '',
    category: 'Hardware',
    serialNumber: '',
    location: 'Main Store',
    status: 'Available' as any,
    quantity: 1,
    uom: 'PCS'
  });

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAsset(addFormData);
    setIsAddModalOpen(false);
    setAddFormData({ name: '', category: 'Hardware', serialNumber: '', location: 'Main Store', status: 'Available', quantity: 1, uom: 'PCS' });
  };

  const filteredAssets = assets.filter(asset => {
    const matchesCategory = categoryFilter === 'All Categories' || asset.category === categoryFilter;
    const matchesStatus = statusFilter === 'All Statuses' || asset.status === statusFilter;
    return matchesCategory && matchesStatus;
  });

  const searchedAssets = fuzzySearch(filteredAssets, localSearch, ['name', 'category', 'serialNumber']);

  const categories = ['All Categories', ...new Set(assets.map(a => a.category))];
  const statuses = ['All Statuses', 'Available', 'In Use', 'Maintenance', 'Operational', 'Audit Required'];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <TopBar 
        title="Global Inventory" 
        subtitle={`Main Supply Store • ${searchedAssets.length} Matching line items`} 
        action={
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="primary-gradient text-on-primary rounded-xl py-3 px-6 flex items-center justify-center gap-2 ambient-shadow hover:scale-[1.02] transition-all font-bold text-sm"
          >
            <Plus size={18} fill="currentColor" />
            New Asset
          </button>
        }
      />
      
      <main className="flex-1 min-h-0 overflow-hidden p-6 flex flex-col gap-4 max-w-7xl mx-auto w-full">
        {/* Utility Bar - Consistent Design */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-end mb-2">
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search inventory..." 
              className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl py-2.5 pl-11 pr-4 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all ambient-shadow"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative min-w-[140px]">
              <select 
                className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/10 text-on-surface text-[10px] font-black py-2.5 pl-5 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ambient-shadow cursor-pointer uppercase tracking-wider"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <Filter size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
            </div>
            
            <div className="relative min-w-[140px]">
              <select 
                className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/10 text-on-surface text-[10px] font-black py-2.5 pl-5 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ambient-shadow cursor-pointer uppercase tracking-wider"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {statuses.map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
              <Filter size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
            </div>
            
            <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-surface-container-lowest border border-outline-variant/10 text-on-surface rounded-xl text-[10px] font-black hover:bg-surface-container-high transition-all ambient-shadow uppercase tracking-wider whitespace-nowrap">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Inventory Table Container */}
        <div className="flex-1 min-h-0 bg-surface-container-lowest rounded-2xl ambient-shadow overflow-hidden flex flex-col border border-outline-variant/10">
          <div className="flex-1 overflow-auto scrollbar-thin">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="sticky top-0 z-20 bg-surface-container-lowest">
                <tr className="bg-surface-container-low/80 backdrop-blur-md border-b border-outline-variant/10">
                  <th className="px-4 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant">SN</th>
                  <th className="px-4 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Item Name</th>
                  <th className="px-4 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Category</th>
                  <th className="px-4 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Serial Number</th>
                  <th className="px-4 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant text-center">Quantity</th>
                  <th className="px-4 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant text-center">UOM</th>
                  <th className="px-4 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Stock Level</th>
                  <th className="px-4 py-3 text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {searchedAssets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-on-surface-variant">
                        <Package size={32} className="opacity-20" />
                        <p className="font-bold text-base">No assets matching criteria</p>
                        <button 
                          onClick={() => { setLocalSearch(''); setCategoryFilter('All Categories'); setStatusFilter('All Statuses'); }}
                          className="text-primary font-black text-[10px] uppercase tracking-widest hover:underline"
                        >
                          Reset Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  searchedAssets.map((asset, idx) => (
                    <tr 
                      key={asset.id} 
                      className={`group transition-all duration-200 hover:bg-surface-container-low/50 ${idx % 2 !== 0 ? 'bg-surface-container-low/5' : ''}`}
                    >
                      <td className="px-4 py-2 text-on-surface-variant font-bold text-[10px]">{idx + 1}</td>
                      <td className="px-4 py-2">
                        <div className="font-bold text-on-surface text-sm group-hover:text-primary transition-colors">{asset.name}</div>
                        <div className="text-[10px] text-on-surface-variant font-bold mt-0.5 tracking-wider uppercase opacity-70">
                          {asset.location}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-container/50 text-on-secondary-container text-[9px] font-black tracking-widest uppercase">
                          {asset.category}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-on-surface-variant font-mono text-[10px] font-bold tracking-tight">{asset.serialNumber}</td>
                      <td className="px-4 py-2 text-center">
                        <span className={`text-sm font-black ${asset.quantity === 0 ? 'text-tertiary' : 'text-on-surface'}`}>
                          {asset.quantity.toFixed(1)}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <span className="text-[9px] text-on-surface-variant font-black uppercase tracking-widest bg-surface-container-high px-2 py-0.5 rounded-md">{asset.uom}</span>
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest">
                            <span className={asset.quantity > 10 ? 'text-emerald-500' : asset.quantity > 0 ? 'text-amber-500' : 'text-tertiary'}>
                              {asset.quantity === 0 ? 'Empty' : asset.quantity < 5 ? 'Low' : 'OK'}
                            </span>
                            <span className="text-on-surface-variant opacity-40">50.0</span>
                          </div>
                          <div className="w-24 h-1.5 bg-surface-container rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                asset.quantity > 20 ? 'bg-emerald-500' : 
                                asset.quantity > 5 ? 'bg-primary' : 
                                asset.quantity > 0 ? 'bg-amber-500' : 'bg-tertiary'
                              }`} 
                              style={{ width: `${Math.min((asset.quantity / 50) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-right">
                        <div className="flex justify-end gap-1 relative">
                          <button 
                            onClick={() => adjustQuantity(asset.id, 1)}
                            className="p-1.5 hover:bg-surface-container-high rounded-md text-primary transition-colors opacity-0 group-hover:opacity-100"
                            title="Add 1"
                          >
                            <Plus size={14} />
                          </button>
                          
                          <div className="relative">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(activeMenuId === asset.id ? null : asset.id);
                              }}
                              className={`p-1.5 hover:bg-surface-container-high rounded-md transition-colors ${activeMenuId === asset.id ? 'bg-surface-container-high text-primary' : 'text-on-surface-variant'}`}
                            >
                              <MoreHorizontal size={14} />
                            </button>

                            {activeMenuId === asset.id && (
                              <div 
                                ref={menuRef}
                                className="absolute right-0 top-full mt-2 w-56 bg-surface-container-lowest rounded-2xl ambient-shadow border border-outline-variant/10 z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-200"
                              >
                                <button 
                                  onClick={() => { setEditingAsset(asset); setActiveMenuId(null); }}
                                  className="w-full px-6 py-3 text-left hover:bg-surface-container-low flex items-center gap-3 text-sm font-black text-on-surface transition-colors"
                                >
                                  <Edit size={16} className="text-primary" />
                                  Edit Details
                                </button>
                                <button 
                                  onClick={() => { adjustQuantity(asset.id, -1); setActiveMenuId(null); }}
                                  className="w-full px-6 py-3 text-left hover:bg-surface-container-low flex items-center gap-3 text-sm font-black text-on-surface transition-colors"
                                >
                                  <Minus size={16} className="text-amber-500" />
                                  Subtract stock
                                </button>
                                <button 
                                  onClick={() => { 
                                    updateAsset(asset.id, { status: asset.status === 'Maintenance' ? 'Operational' : 'Maintenance' }); 
                                    setActiveMenuId(null); 
                                  }}
                                  className="w-full px-6 py-3 text-left hover:bg-surface-container-low flex items-center gap-3 text-sm font-black text-on-surface transition-colors"
                                >
                                  <Wrench size={16} className={asset.status === 'Maintenance' ? 'text-emerald-500' : 'text-primary'} />
                                  {asset.status === 'Maintenance' ? 'Mark Operational' : 'Mark Maintenance'}
                                </button>
                                <div className="h-px bg-outline-variant/10 my-1 mx-4" />
                                <button 
                                  onClick={() => { 
                                    if(confirm(`Are you sure you want to delete ${asset.name}?`)) {
                                      deleteAsset(asset.id);
                                    }
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full px-6 py-3 text-left hover:bg-tertiary-container/30 flex items-center gap-3 text-sm font-black text-tertiary transition-colors"
                                >
                                  <Trash2 size={16} />
                                  Delete Asset
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex-shrink-0 bg-surface-container-low/50 px-6 py-3 flex items-center justify-between border-t border-outline-variant/10">
            <div className="text-[10px] text-on-surface-variant font-bold tracking-tight uppercase">
              Page <span className="text-on-surface font-black">1</span> / <span className="text-on-surface font-black">12</span> • <span className="text-on-surface font-black">{filteredAssets.length}</span> results
            </div>
            
            <div className="flex gap-1">
              <button 
                className="p-1 rounded-md text-on-surface-variant/50 hover:bg-surface-container-high hover:text-on-surface transition-all disabled:opacity-30" 
                disabled
              >
                <ChevronLeft size={16} />
              </button>
              <button className="px-3 py-1 rounded-md bg-surface-container-lowest text-primary text-[10px] font-black ambient-shadow">1</button>
              <button className="px-3 py-1 rounded-md hover:bg-surface-container-high text-on-surface-variant text-[10px] font-black transition-all">2</button>
              <button className="px-3 py-1 rounded-md hover:bg-surface-container-high text-on-surface-variant text-[10px] font-black transition-all">3</button>
              <span className="px-1 py-1 text-on-surface-variant text-[10px] font-black">...</span>
              <button className="p-1 rounded-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Register New Asset">
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-on-surface-variant">Asset Name</label>
            <input 
              required
              type="text" 
              className="w-full bg-surface-container-high rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/40 outline-none font-bold"
              value={addFormData.name}
              onChange={e => setAddFormData({...addFormData, name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-on-surface-variant">Category</label>
              <select 
                className="w-full bg-surface-container-high rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/40 outline-none font-bold appearance-none cursor-pointer"
                value={addFormData.category}
                onChange={e => setAddFormData({...addFormData, category: e.target.value})}
              >
                <option>Hardware</option>
                <option>Peripheral</option>
                <option>Networking</option>
                <option>Component</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-on-surface-variant">Quantity</label>
              <input 
                type="number" 
                className="w-full bg-surface-container-high rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/40 outline-none font-bold"
                value={addFormData.quantity}
                onChange={e => setAddFormData({...addFormData, quantity: Number(e.target.value)})}
              />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-on-surface-variant">Serial Number</label>
            <input 
              required
              type="text" 
              className="w-full bg-surface-container-high rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/40 outline-none font-bold"
              value={addFormData.serialNumber}
              onChange={e => setAddFormData({...addFormData, serialNumber: e.target.value})}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-black uppercase text-on-surface-variant">Arrival Location</label>
            <select 
              className="w-full bg-surface-container-high rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/40 outline-none font-bold appearance-none cursor-pointer"
              value={addFormData.location}
              onChange={e => setAddFormData({...addFormData, location: e.target.value})}
            >
              {locations.map(loc => (
                <option key={loc.id} value={loc.name}>{loc.name}</option>
              ))}
              <option value="Main Store">Main Store</option>
            </select>
          </div>
          <button type="submit" className="w-full primary-gradient text-on-primary py-4 rounded-xl font-black text-sm uppercase tracking-widest ambient-shadow mt-6 hover:scale-[1.01] transition-all">
            Add to Inventory
          </button>
        </form>
      </Modal>

      {/* Edit Modal */}
      {editingAsset && (
        <Modal 
          isOpen={!!editingAsset} 
          onClose={() => setEditingAsset(null)} 
          title="Edit Asset Details"
        >
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              updateAsset(editingAsset.id, {
                name: formData.get('name') as string,
                serialNumber: formData.get('serial') as string,
                category: formData.get('category') as string,
                location: formData.get('location') as string,
                quantity: parseFloat(formData.get('quantity') as string),
              });
              setEditingAsset(null);
            }} 
            className="space-y-6"
          >
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Asset Name</label>
                <input 
                  defaultValue={editingAsset.name}
                  name="name"
                  required
                  className="w-full px-5 py-4 bg-surface-container-high rounded-2xl text-sm font-bold text-on-surface border-none focus:ring-2 focus:ring-primary/40 outline-none transition-all"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Serial Number</label>
                  <input 
                    defaultValue={editingAsset.serialNumber}
                    name="serial"
                    required
                    className="w-full px-5 py-4 bg-surface-container-high rounded-2xl text-sm font-bold text-on-surface border-none focus:ring-2 focus:ring-primary/40 outline-none transition-all font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Stock Level</label>
                  <input 
                    defaultValue={editingAsset.quantity}
                    name="quantity"
                    type="number"
                    step="0.1"
                    required
                    className="w-full px-5 py-4 bg-surface-container-high rounded-2xl text-sm font-bold text-on-surface border-none focus:ring-2 focus:ring-primary/40 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Category</label>
                  <select 
                    name="category"
                    defaultValue={editingAsset.category}
                    className="w-full px-5 py-4 bg-surface-container-high rounded-2xl text-sm font-bold text-on-surface border-none focus:ring-2 focus:ring-primary/40 outline-none transition-all appearance-none cursor-pointer"
                  >
                    {categories.filter(c => c !== 'All Categories').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    {!categories.includes(editingAsset.category) && <option value={editingAsset.category}>{editingAsset.category}</option>}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Location</label>
                  <input 
                    defaultValue={editingAsset.location}
                    name="location"
                    required
                    className="w-full px-5 py-4 bg-surface-container-high rounded-2xl text-sm font-bold text-on-surface border-none focus:ring-2 focus:ring-primary/40 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="button" 
                onClick={() => setEditingAsset(null)}
                className="flex-1 px-8 py-4 bg-surface-container-high text-on-surface text-xs font-black rounded-2xl hover:bg-surface-container-highest transition-all uppercase tracking-widest"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 px-8 py-4 primary-gradient text-on-primary text-xs font-black rounded-2xl ambient-shadow hover:scale-[1.02] transition-all uppercase tracking-widest"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
