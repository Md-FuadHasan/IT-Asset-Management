import { useState, useMemo } from 'react';
import { Truck, UserCheck, Search, Calendar, Filter, AlertTriangle, MoreVertical, Edit2, Trash2, Eye, MapPin } from 'lucide-react';
import { useApp } from '../AppContext';
import TopBar from '../components/layout/TopBar';
import Modal from '../components/ui/Modal';
import { fuzzySearch } from '../lib/search';

export default function Distributions() {
  const { distributions, assets, locations, distributeAsset, updateDistribution, deleteDistribution } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDist, setEditingDist] = useState<any>(null);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [tableSearch, setTableSearch] = useState('');
  const [monthFilter, setMonthFilter] = useState('All Months');
  const [yearFilter, setYearFilter] = useState('All Years');
  
  const [formData, setFormData] = useState({
    assetId: '' as string | 'manual',
    assetName: '',
    serialNumberOverride: '',
    quantity: 1,
    assignedTo: '',
    branch: '',
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')
  });

  const [error, setError] = useState<string | null>(null);

  const filteredAssets = useMemo(() => {
    if (!searchTerm) return [];
    // fuzzySearch for asset selection
    return fuzzySearch(assets, searchTerm, ['name', 'serialNumber']).slice(0, 5);
  }, [assets, searchTerm]);

  const filteredDistributions = useMemo(() => {
    const matchedDistributions = distributions.filter(dist => {
      const matchesMonth = monthFilter === 'All Months' || dist.date.includes(`-${monthFilter}-`);
      const matchesYear = yearFilter === 'All Years' || dist.date.includes(yearFilter);
      return matchesMonth && matchesYear;
    });

    // fuzzySearch for table filtering
    return fuzzySearch(matchedDistributions, tableSearch, ['assetName', 'serialNumber', 'assignedTo', 'branch']);
  }, [distributions, tableSearch, monthFilter, yearFilter]);

  const months = ['All Months', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const years = ['All Years', '2023', '2024', '2025', '2026'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (editingDist) {
      updateDistribution(editingDist.id, {
        quantity: formData.quantity,
        assignedTo: formData.assignedTo,
        branch: formData.branch,
        date: formData.date,
        serialNumber: formData.serialNumberOverride
      });
      closeModal();
    } else {
      const result = distributeAsset({
        assetId: formData.assetId,
        assetName: formData.assetName,
        quantity: formData.quantity,
        assignedTo: formData.assignedTo,
        branch: formData.branch,
        date: formData.date,
        serialNumberOverride: formData.serialNumberOverride
      });

      if (result.success) {
        closeModal();
      } else {
        setError(result.message || 'Error processing distribution');
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingDist(null);
    setIsViewOnly(false);
    setFormData({ 
      assetId: '' as string | 'manual', 
      assetName: '', 
      serialNumberOverride: '', 
      quantity: 1, 
      assignedTo: '', 
      branch: '', 
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-')
    });
    setSearchTerm('');
    setError(null);
  };

  const openEdit = (dist: any) => {
    setEditingDist(dist);
    setIsViewOnly(false);
    setFormData({
      assetId: dist.assetId || 'manual',
      assetName: dist.assetName,
      serialNumberOverride: dist.serialNumber,
      quantity: dist.quantity,
      assignedTo: dist.assignedTo,
      branch: dist.branch,
      date: dist.date
    });
    setSearchTerm(dist.assetName);
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const openView = (dist: any) => {
    setEditingDist(dist);
    setIsViewOnly(true);
    setFormData({
      assetId: dist.assetId || 'manual',
      assetName: dist.assetName,
      serialNumberOverride: dist.serialNumber,
      quantity: dist.quantity,
      assignedTo: dist.assignedTo,
      branch: dist.branch,
      date: dist.date
    });
    setSearchTerm(dist.assetName);
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this assignment record?')) {
      deleteDistribution(id);
      setActiveMenuId(null);
    }
  };

  const selectAsset = (asset: any) => {
    setFormData({
      ...formData,
      assetId: asset.id,
      assetName: asset.name,
      serialNumberOverride: asset.serialNumber
    });
    setSearchTerm(asset.name);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <TopBar 
        title="Distribution Hub" 
        subtitle="Fleet Management" 
        action={
          <button 
            onClick={() => setIsModalOpen(true)}
            className="primary-gradient text-on-primary rounded-xl py-3 px-6 flex items-center justify-center gap-2 ambient-shadow hover:scale-[1.02] transition-all font-bold text-sm"
          >
            <UserCheck size={18} fill="currentColor" />
            New Assignment
          </button>
        }
      />
      
      <main className="flex-1 min-h-0 overflow-hidden p-6 flex flex-col gap-4 max-w-7xl mx-auto w-full">
        {/* Table Controls - Aligned properly to the right */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-end mb-2">
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl py-2.5 pl-11 pr-4 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all ambient-shadow"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative min-w-[130px]">
              <select 
                className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/10 text-on-surface text-[10px] font-black py-2.5 pl-5 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ambient-shadow cursor-pointer uppercase tracking-wider"
                value={monthFilter}
                onChange={(e) => setMonthFilter(e.target.value)}
              >
                {months.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <Filter size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
            </div>

            <div className="relative min-w-[120px]">
              <select 
                className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/10 text-on-surface text-[10px] font-black py-2.5 pl-5 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ambient-shadow cursor-pointer uppercase tracking-wider"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              >
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <Filter size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Mobile List View */}
        <div className="md:hidden flex-1 overflow-y-auto space-y-4 pb-10 scrollbar-hide">
          {filteredDistributions.length === 0 ? (
            <div className="py-20 text-center">
              <div className="flex flex-col items-center gap-2 text-on-surface-variant/40 font-bold uppercase tracking-widest text-xs">
                <Filter size={32} className="mb-2 opacity-20" />
                No matching assignments
              </div>
            </div>
          ) : filteredDistributions.map((dist, idx) => (
            <div 
              key={dist.id}
              className="bg-surface-container-low/50 border border-outline-variant/10 rounded-2xl p-5 relative group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <Truck size={20} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-on-surface tracking-tight leading-tight mb-0.5">{dist.assetName}</span>
                    <span className="text-[9px] font-bold text-tertiary tracking-widest uppercase mb-1">SL: {dist.serialNumber}</span>
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-secondary/80">
                      <MapPin size={10} />
                      {dist.branch}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setActiveMenuId(activeMenuId === dist.id ? null : dist.id)}
                  className="p-2 hover:bg-white rounded-lg text-on-surface-variant transition-colors"
                >
                  <MoreVertical size={16} />
                </button>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-outline-variant/5">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-on-surface-variant/40 uppercase tracking-widest mb-1">Recipient</span>
                  <span className="text-[11px] font-bold text-on-surface-variant">{dist.assignedTo}</span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[8px] font-black text-on-surface-variant/40 uppercase tracking-widest mb-1">Shipment Info</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-primary bg-primary/10 px-2 py-0.5 rounded uppercase">{dist.quantity} Units</span>
                    <span className="text-[9px] font-bold text-on-surface-variant/40">{dist.date}</span>
                  </div>
                </div>
              </div>

              {activeMenuId === dist.id && (
                <div className="absolute right-4 top-14 w-44 bg-surface-container-highest rounded-xl shadow-2xl border border-outline-variant/10 p-2 z-[100] text-left">
                  <button onClick={() => openView(dist)} className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-on-surface hover:bg-surface-container rounded-lg transition-colors"><Eye size={14} className="text-primary" /> View Details</button>
                  <button onClick={() => openEdit(dist)} className="w-full flex items-center gap-2 px-3 py-2 text-[10px] font-bold text-on-surface hover:bg-surface-container rounded-lg transition-colors"><Edit2 size={14} className="text-secondary" /> Edit Record</button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop Ledger Table - Matches user Excel image */}
        <div className="hidden md:flex flex-1 min-h-0 bg-surface-container-lowest rounded-2xl overflow-hidden ambient-shadow flex flex-col border border-outline-variant/10">
          <div className="flex-1 overflow-auto scrollbar-thin">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="sticky top-0 z-10 bg-surface-container-lowest">
                <tr className="bg-surface-container-low/80 backdrop-blur-md border-b border-outline-variant/10">
                  <th className="py-3 px-6 text-[9px] font-black text-on-surface-variant uppercase tracking-widest w-16 text-center">SN</th>
                  <th className="py-3 px-6 text-[9px] font-black text-on-surface-variant uppercase tracking-widest">Item Details</th>
                  <th className="py-3 px-6 text-[9px] font-black text-on-surface-variant uppercase tracking-widest w-24 text-center">Dist QTY</th>
                  <th className="py-3 px-6 text-[9px] font-black text-on-surface-variant uppercase tracking-widest w-36 text-center">Date</th>
                  <th className="py-3 px-6 text-[9px] font-black text-on-surface-variant uppercase tracking-widest">Assigned/Send To Branch</th>
                  <th className="py-3 px-6 text-[9px] font-black text-on-surface-variant uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {filteredDistributions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2 text-on-surface-variant/40 font-bold uppercase tracking-widest text-xs">
                        <Filter size={32} className="mb-2 opacity-20" />
                        No matching assignments
                      </div>
                    </td>
                  </tr>
                ) : filteredDistributions.map((dist, idx) => {
                  return (
                    <tr 
                      key={dist.id} 
                      className={`group hover:bg-surface-container-low transition-all ${idx % 2 !== 0 ? 'bg-surface-container-low/5' : ''}`}
                    >
                      <td className="py-4 px-6 font-bold text-on-surface/30 text-[10px] text-center">{idx + 1}</td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-on-surface tracking-tight leading-tight mb-0.5">{dist.assetName}</span>
                          <span className="text-[9px] font-bold text-tertiary tracking-widest uppercase">
                            SL: {dist.serialNumber}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 bg-primary-container text-on-primary-container rounded font-black text-[10px]">
                          {dist.quantity}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-on-surface/80 font-bold text-[10px] text-center">
                        {dist.date}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-on-surface">{dist.branch}</span>
                          <span className="text-[9px] font-bold text-on-surface-variant leading-tight">{dist.assignedTo}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right relative">
                        <button 
                          onClick={() => setActiveMenuId(activeMenuId === dist.id ? null : dist.id)}
                          className="p-2 hover:bg-surface-container rounded-lg text-on-surface-variant transition-colors active:scale-95"
                        >
                          <MoreVertical size={16} />
                        </button>
                        
                        {activeMenuId === dist.id && (
                          <div className="absolute right-12 top-11 w-44 bg-surface-container-highest rounded-xl shadow-2xl border border-outline-variant/10 p-2 z-[100] animate-in fade-in zoom-in duration-200 text-left">
                            <button 
                              onClick={() => openView(dist)}
                              className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-on-surface hover:bg-surface-container rounded-lg transition-colors"
                            >
                              <Eye size={14} className="text-primary" />
                              View Assignment
                            </button>
                            <button 
                              onClick={() => openEdit(dist)}
                              className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-on-surface hover:bg-surface-container rounded-lg transition-colors"
                            >
                              <Edit2 size={14} className="text-secondary" />
                              Edit Record
                            </button>
                            <button 
                              onClick={() => handleDelete(dist.id)}
                              className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-error hover:bg-error/10 rounded-lg transition-colors border-t border-outline-variant/10 mt-1"
                            >
                              <Trash2 size={14} />
                              Remove Log
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* New Assignment Modal */}
        <Modal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          title={isViewOnly ? "Assignment Details" : editingDist ? "Adjust Assignment Record" : "New Asset Assignment"}
        >
          <form onSubmit={handleSubmit} className="space-y-4 p-2">
            {error && (
              <div className="bg-tertiary-container/30 text-tertiary p-3 rounded-lg text-xs font-bold border border-tertiary/20 flex items-center gap-2 mb-2">
                <AlertTriangle size={14} />
                {error}
              </div>
            )}
            
            {/* Search/Select Asset */}
            <div className="space-y-1 relative">
              <label className="text-[10px] font-black uppercase text-on-surface-variant tracking-wider">Search Inventory Item</label>
              <div className="relative">
                <input 
                  type="text" 
                  disabled={isViewOnly}
                  placeholder="Type item name or serial..."
                  className="w-full bg-surface-container-high rounded-xl p-3 pr-10 text-xs outline-none focus:ring-2 focus:ring-primary/40 transition-all font-bold placeholder:font-medium placeholder:opacity-50 disabled:opacity-70 disabled:cursor-not-allowed"
                  value={searchTerm}
                  onFocus={() => !isViewOnly && setIsDropdownOpen(true)}
                  onChange={e => {
                    setSearchTerm(e.target.value);
                    setIsDropdownOpen(true);
                    if (e.target.value === '') setFormData({...formData, assetId: 'manual'});
                    else setFormData({...formData, assetId: 'manual', assetName: e.target.value});
                  }}
                />
                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40" />
              </div>
              
              {!isViewOnly && isDropdownOpen && filteredAssets.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-surface-container-highest rounded-xl shadow-2xl border border-outline-variant/10 overflow-hidden backdrop-blur-xl">
                  {filteredAssets.map(asset => (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => selectAsset(asset)}
                      className="w-full text-left p-3 hover:bg-primary/10 transition-colors flex items-center justify-between group border-b border-outline-variant/5 last:border-0"
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-on-surface">{asset.name}</span>
                        <span className="text-[9px] text-on-surface-variant">SN: {asset.serialNumber}</span>
                      </div>
                      <span className="text-[9px] bg-primary/20 text-primary font-black px-2 py-0.5 rounded uppercase">
                        {asset.quantity} {asset.uom}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-on-surface-variant tracking-wider">Quantity to Deliver</label>
                <input 
                  required
                  disabled={isViewOnly}
                  type="number" 
                  min="1"
                  className="w-full bg-surface-container-high rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-primary/40 font-bold disabled:opacity-70 disabled:cursor-not-allowed"
                  value={formData.quantity}
                  onChange={e => setFormData({...formData, quantity: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-on-surface-variant tracking-wider">Delivery Date</label>
                <input 
                  required
                  disabled={isViewOnly}
                  type="text"
                  className="w-full bg-surface-container-high rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-primary/40 font-bold disabled:opacity-70 disabled:cursor-not-allowed"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-on-surface-variant tracking-wider">Target Branch</label>
                <select 
                  required
                  disabled={isViewOnly}
                  className="w-full bg-surface-container-high rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-primary/40 font-bold appearance-none cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  value={formData.branch}
                  onChange={e => setFormData({...formData, branch: e.target.value})}
                >
                  <option value="">Select Branch</option>
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.name}>{loc.name}</option>
                  ))}
                  <option value="Direct Delivery">Direct Delivery / HO</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-on-surface-variant tracking-wider">Assigned Employee</label>
                <input 
                  required
                  disabled={isViewOnly}
                  type="text" 
                  placeholder="e.g. Deepak Sir"
                  className="w-full bg-surface-container-high rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-primary/40 font-bold disabled:opacity-70 disabled:cursor-not-allowed"
                  value={formData.assignedTo}
                  onChange={e => setFormData({...formData, assignedTo: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1 pt-1">
              <label className="text-[10px] font-black uppercase text-on-surface-variant tracking-wider">Item Details & Serials</label>
              <textarea 
                disabled={isViewOnly}
                placeholder="Details of the items being delivered..."
                className="w-full bg-surface-container-high rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-primary/40 font-medium h-20 resize-none leading-relaxed disabled:opacity-70 disabled:cursor-not-allowed"
                value={formData.serialNumberOverride}
                onChange={e => setFormData({...formData, serialNumberOverride: e.target.value})}
              />
            </div>

            {!isViewOnly && (
              <button 
                type="submit" 
                className="w-full primary-gradient text-on-primary py-4 rounded-xl font-black text-xs uppercase tracking-[0.1em] ambient-shadow mt-4 flex items-center justify-center gap-2 hover:scale-[1.01] transition-all"
              >
                <Truck size={18} />
                {editingDist ? "Update Assignment Record" : "Confirm Delivery & Update Stock"}
              </button>
            )}
            
            {isViewOnly && (
              <button 
                type="button"
                onClick={closeModal}
                className="w-full bg-surface-container-highest text-on-surface-variant py-4 rounded-xl font-black text-xs uppercase tracking-[0.1em] border border-outline-variant/10 mt-4 flex items-center justify-center gap-2 hover:bg-surface-container transition-all"
              >
                Close Details
              </button>
            )}
          </form>
        </Modal>
      </main>
    </div>
  );
}
