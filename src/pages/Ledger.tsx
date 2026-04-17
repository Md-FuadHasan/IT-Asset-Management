import { useState } from 'react';
import { Search, Download, Filter, Plus, ShoppingCart, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../AppContext';
import TopBar from '../components/layout/TopBar';
import Modal from '../components/ui/Modal';
import { fuzzySearch } from '../lib/search';

export default function Ledger() {
  const { ledger, addLedgerEntry } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemTypeFilter, setItemTypeFilter] = useState('All');
  
  const [formData, setFormData] = useState({
    supplierName: '',
    purchaseDate: new Date().toLocaleDateString('en-GB'),
    itemType: 'Hardware',
    qty: 1,
    totalCost: '$1,000.00',
    intakeStatus: 'Pending Delivery' as any
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLedgerEntry(formData);
    setIsModalOpen(false);
    setFormData({ 
      supplierName: '', 
      purchaseDate: new Date().toLocaleDateString('en-GB'), 
      itemType: 'Hardware', 
      qty: 1, 
      totalCost: '$1,000.00', 
      intakeStatus: 'Pending Delivery' 
    });
  };

  const filteredLedger = ledger.filter(entry => {
    return itemTypeFilter === 'All' || entry.itemType === itemTypeFilter;
  });

  const searchedLedger = fuzzySearch(filteredLedger, searchTerm, ['supplierName', 'itemType']);

  const handleExport = () => {
    const headers = ['Supplier Name', 'Date', 'Item Type', 'Qty', 'Total Cost', 'Status'];
    const rows = searchedLedger.map(entry => [
      entry.supplierName,
      entry.purchaseDate,
      entry.itemType,
      entry.qty,
      entry.totalCost,
      entry.intakeStatus
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `procurement_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const itemTypes = ['All', ...new Set(ledger.map(e => e.itemType))];

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <TopBar 
        title="Procurement Ledger" 
        subtitle="History of IT equipment purchases and intake status." 
        action={
          <button 
            onClick={() => setIsModalOpen(true)}
            className="primary-gradient text-on-primary rounded-xl py-3 px-6 text-sm font-black flex items-center justify-center gap-2 ambient-shadow hover:scale-[1.02] transition-all"
          >
            <ShoppingCart size={18} fill="currentColor" />
            Log Purchase
          </button>
        }
      />
      
      <main className="flex-1 min-h-0 overflow-hidden p-6 flex flex-col gap-4 max-w-7xl mx-auto w-full">
        {/* Filters - Consistent Right-Aligned Design */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-end mb-2">
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/40 group-focus-within:text-primary transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search by supplier or item..." 
              className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl py-2.5 pl-11 pr-4 text-xs font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all ambient-shadow"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative min-w-[140px]">
              <select 
                value={itemTypeFilter}
                onChange={(e) => setItemTypeFilter(e.target.value)}
                className="w-full appearance-none bg-surface-container-lowest border border-outline-variant/10 text-on-surface text-[10px] font-black py-2.5 pl-5 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ambient-shadow cursor-pointer uppercase tracking-wider"
              >
                {itemTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <Filter size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
            </div>
            
            <button 
              onClick={handleExport}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-surface-container-lowest border border-outline-variant/10 text-on-surface rounded-xl text-[10px] font-black hover:bg-surface-container-high transition-all ambient-shadow uppercase tracking-wider whitespace-nowrap"
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="flex-1 min-h-0 bg-surface-container-lowest rounded-2xl ambient-shadow overflow-hidden border border-outline-variant/10 flex flex-col">
          <div className="flex-1 overflow-auto scrollbar-thin">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="sticky top-0 z-10 bg-surface-container-lowest">
                <tr className="bg-surface-container-low/80 backdrop-blur-md border-b border-outline-variant/10">
                  <th className="py-3 px-6 text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Supplier Name</th>
                  <th className="py-3 px-6 text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Date</th>
                  <th className="py-3 px-6 text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Item Type</th>
                  <th className="py-3 px-6 text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant text-right">Qty</th>
                  <th className="py-3 px-6 text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant text-right">Total Cost</th>
                  <th className="py-3 px-6 text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant">Intake Status</th>
                  <th className="py-3 px-6 text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {searchedLedger.map((entry, idx) => (
                  <tr 
                    key={entry.id} 
                    className={`group transition-colors hover:bg-surface-container-low/50 ${idx % 2 !== 0 ? 'bg-surface-container-low/5' : ''}`}
                  >
                    <td className="py-4 px-6 font-black text-on-surface text-sm">{entry.supplierName}</td>
                    <td className="py-4 px-6 text-on-surface-variant font-bold text-xs tracking-tight">{entry.purchaseDate}</td>
                    <td className="py-4 px-6">
                      <span className="bg-secondary-container/50 text-on-secondary-container px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
                        {entry.itemType}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-black text-on-surface/80 text-xs">{entry.qty}</td>
                    <td className="py-4 px-6 text-right font-black text-on-surface text-xs">{entry.totalCost}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full shadow-sm ${
                          entry.intakeStatus === 'Pending Delivery' ? 'bg-secondary' : 
                          entry.intakeStatus === 'RMA Processing' ? 'bg-tertiary' : 'bg-emerald-500'
                        }`} />
                        <span className="text-on-surface-variant font-black tracking-tight uppercase text-[9px]">{entry.intakeStatus}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="text-on-surface-variant/60 hover:text-primary transition-all">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex-shrink-0 bg-surface-container-low/50 py-3 px-6 flex items-center justify-between text-[10px] text-on-surface-variant font-black tracking-tight uppercase border-t border-outline-variant/10">
            <div>Showing 1 to {searchedLedger.length} of {ledger.length} entries</div>
            <div className="flex gap-2">
              <button className="p-1 hover:text-primary transition-colors disabled:opacity-30" disabled>
                <ChevronLeft size={18} />
              </button>
              <button className="p-1 hover:text-primary transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Procurement Entry">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-on-surface-variant">Supplier Name</label>
              <input 
                required
                type="text" 
                className="w-full bg-surface-container-high rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                value={formData.supplierName}
                onChange={e => setFormData({...formData, supplierName: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-on-surface-variant">Quantity</label>
                <input 
                  type="number" 
                  className="w-full bg-surface-container-high rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                  value={formData.qty}
                  onChange={e => setFormData({...formData, qty: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black uppercase text-on-surface-variant">Total Cost</label>
                <input 
                  type="text" 
                  className="w-full bg-surface-container-high rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                  value={formData.totalCost}
                  onChange={e => setFormData({...formData, totalCost: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black uppercase text-on-surface-variant">Item Description</label>
              <input 
                required
                type="text" 
                className="w-full bg-surface-container-high rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                value={formData.itemType}
                onChange={e => setFormData({...formData, itemType: e.target.value})}
              />
            </div>
            <button type="submit" className="w-full primary-gradient text-on-primary py-4 rounded-xl font-black text-sm ambient-shadow mt-6">
              Log Entry
            </button>
          </form>
        </Modal>
      </main>
    </div>
  );
}
