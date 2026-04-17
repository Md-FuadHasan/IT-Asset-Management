import { useState, useRef, useEffect } from 'react';
import { 
  Plus, MoreVertical, Building, Search, 
  Filter as FilterIcon, Edit2, Trash2, X, Check, MapPin
} from 'lucide-react';
import { useApp } from '../AppContext';
import TopBar from '../components/layout/TopBar';
import Modal from '../components/ui/Modal';
import { Location } from '../types';
import { fuzzySearch } from '../lib/search';

export default function Locations() {
  const { locations, addLocation, updateLocation, deleteLocation } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLoc, setEditingLoc] = useState<Location | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  const [formData, setFormData] = useState({
    name: '',
    cityRegion: '',
    assignedAssets: 0,
    primaryContact: {
      name: 'Elena Vance',
      role: 'Manager',
      avatarInitials: 'EV'
    },
    status: 'Operational' as 'Operational' | 'Audit Required'
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLoc) {
      updateLocation(editingLoc.id, formData);
    } else {
      addLocation(formData);
    }
    closeModal();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLoc(null);
    setFormData({ 
      name: '', 
      cityRegion: '', 
      assignedAssets: 0, 
      primaryContact: { name: 'Elena Vance', role: 'Manager', avatarInitials: 'EV' }, 
      status: 'Operational' 
    });
  };

  const openEdit = (loc: Location) => {
    setEditingLoc(loc);
    setFormData({
      name: loc.name,
      cityRegion: loc.cityRegion,
      assignedAssets: loc.assignedAssets,
      primaryContact: loc.primaryContact,
      status: loc.status
    });
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this location? This action cannot be undone.')) {
      deleteLocation(id);
      setActiveMenuId(null);
    }
  };

  const filteredLocations = locations.filter(loc => {
    return statusFilter === 'All Statuses' || loc.status === statusFilter;
  });

  const searchedLocations = fuzzySearch(filteredLocations, searchTerm, ['name', 'cityRegion']);

  const statuses = ['All Statuses', 'Operational', 'Audit Required'];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <TopBar 
        title="Location Management" 
        subtitle={`Global nodes • ${searchedLocations.length} active facilities`}
        action={
          <button 
            onClick={() => setIsModalOpen(true)}
            className="primary-gradient text-on-primary px-6 py-3 rounded-xl font-bold ambient-shadow flex items-center gap-2 hover:scale-[1.02] transition-all text-sm"
          >
            <Plus size={18} />
            Add Location
          </button>
        }
      />
      
      <main className="flex-1 min-h-0 overflow-y-auto p-6 flex flex-col gap-4 max-w-7xl mx-auto w-full scrollbar-thin">
        {/* Utility Bar - Consistent Design */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-end mb-2">
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search locations..." 
              className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl py-2.5 pl-11 pr-4 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all ambient-shadow"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
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
              <FilterIcon size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Local Stat Mini Grid */}
        <div className="flex-shrink-0 grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Nodes', value: locations.length.toString(), color: 'text-primary' },
            { label: 'Active Depts', value: '156', color: 'text-secondary' },
            { label: 'Global Assets', value: (locations.reduce((acc, l) => acc + l.assignedAssets, 0)).toLocaleString(), color: 'text-tertiary' },
            { label: 'Avg Uptime', value: '99.9%', color: 'text-emerald-500' },
          ].map((stat) => (
            <div key={stat.label} className="bg-surface-container-lowest p-5 rounded-xl ambient-shadow border border-outline-variant/10 flex items-center justify-between group">
              <div>
                <p className="text-[8px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <p className={`text-2xl font-black tracking-tighter ${stat.color}`}>{stat.value}</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant/20 group-hover:text-primary/40 transition-colors">
                <MapPin size={20} />
              </div>
            </div>
          ))}
        </div>

        {/* Locations Table */}
        <div className="flex-1 min-h-[400px] bg-surface-container-lowest rounded-2xl overflow-hidden ambient-shadow flex flex-col border border-outline-variant/10">
          <div className="flex-1 overflow-auto scrollbar-thin">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="sticky top-0 z-20 bg-surface-container-lowest">
                <tr className="bg-surface-container-low/80 backdrop-blur-md border-b border-outline-variant/10">
                  <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.15em]">Facility & ID</th>
                  <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.15em]">Region / Node</th>
                  <th className="px-6 py-3 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.15em] text-center">Asset Load</th>
                  <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.15em]">Primary Tech</th>
                  <th className="px-6 py-4 text-[10px] font-black text-on-surface-variant uppercase tracking-[0.15em]">Service Status</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black text-on-surface-variant uppercase tracking-[0.15em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {searchedLocations.length > 0 ? (
                  searchedLocations.map((loc, idx) => (
                    <tr key={loc.id} className={`group hover:bg-surface-container-low transition-colors ${idx % 2 !== 0 ? 'bg-surface-container-low/5' : ''}`}>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="font-black text-on-surface text-sm uppercase tracking-tight">{loc.name}</span>
                          <span className="text-[9px] text-primary font-black tracking-widest">{loc.id}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-on-surface-variant">
                          <Building size={14} className="opacity-40" />
                          <span className="text-xs font-bold">{loc.cityRegion}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-secondary-container/30 text-secondary border border-secondary/10">
                          {loc.assignedAssets.toLocaleString()} Units
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/5 flex items-center justify-center text-primary font-black text-[10px] shadow-sm">
                            {loc.primaryContact.avatarInitials}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-on-surface leading-tight">{loc.primaryContact.name}</span>
                            <span className="text-[9px] text-on-surface-variant font-black uppercase tracking-tighter">{loc.primaryContact.role}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${
                          loc.status === 'Operational' 
                            ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/10' 
                            : 'bg-orange-500/10 text-orange-600 border border-orange-500/10'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${loc.status === 'Operational' ? 'bg-emerald-500' : 'bg-orange-500'} shadow-sm animate-pulse`} />
                          <span className="text-[10px] font-black uppercase tracking-wider">{loc.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right relative">
                        <button 
                          onClick={() => setActiveMenuId(activeMenuId === loc.id ? null : loc.id)}
                          className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors active:scale-95"
                        >
                          <MoreVertical size={16} />
                        </button>
                        
                        {activeMenuId === loc.id && (
                          <div 
                            ref={menuRef}
                            className="absolute right-12 top-11 w-44 bg-surface-container-highest rounded-xl shadow-2xl border border-outline-variant/10 p-2 z-[100] animate-in fade-in zoom-in duration-200"
                          >
                            <button 
                              onClick={() => openEdit(loc)}
                              className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-on-surface hover:bg-surface-container rounded-lg transition-colors"
                            >
                              <Edit2 size={14} className="text-primary" />
                              Edit Details
                            </button>
                            <button 
                              onClick={() => handleDelete(loc.id)}
                              className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-error hover:bg-error/10 rounded-lg transition-colors border-t border-outline-variant/10 mt-1"
                            >
                              <Trash2 size={14} />
                              Decommission
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-30">
                        <Building size={48} />
                        <p className="text-sm font-black uppercase tracking-widest">No matching locations found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>


        {/* Modal */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          title={editingLoc ? "Update Facility Specs" : "Register Global Node"}
        >
          <form onSubmit={handleSubmit} className="space-y-5 p-2">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                <Building size={12} />
                Facility Name
              </label>
              <input 
                required
                type="text" 
                placeholder="e.g. London Logistics Hub"
                className="w-full bg-surface-container border border-outline-variant/10 rounded-xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/40 transition-all ambient-shadow"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant flex items-center gap-2">
                <MapPin size={12} />
                Regional Zone
              </label>
              <input 
                required
                type="text" 
                placeholder="e.g. EU - West 2"
                className="w-full bg-surface-container border border-outline-variant/10 rounded-xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/40 transition-all ambient-shadow"
                value={formData.cityRegion}
                onChange={e => setFormData({...formData, cityRegion: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Asset Loadout</label>
                <input 
                  type="number" 
                  className="w-full bg-surface-container border border-outline-variant/10 rounded-xl p-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/40 transition-all ambient-shadow"
                  value={formData.assignedAssets}
                  onChange={e => setFormData({...formData, assignedAssets: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Status</label>
                <select 
                  className="w-full bg-surface-container border border-outline-variant/10 rounded-xl p-4 text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-primary/40 transition-all ambient-shadow appearance-none"
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value as any})}
                >
                  <option value="Operational">Operational</option>
                  <option value="Audit Required">Audit Required</option>
                </select>
              </div>
            </div>
            <button type="submit" className="w-full primary-gradient text-on-primary py-5 rounded-xl font-black text-xs uppercase tracking-[0.2em] ambient-shadow-lg shadow-primary/20 mt-8 transition-transform active:scale-[0.98] hover:scale-[1.01]">
              {editingLoc ? "Commit Changes" : "Activate Node"}
            </button>
          </form>
        </Modal>
      </main>
    </div>
  );
}
