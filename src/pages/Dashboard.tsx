import { useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { 
  Wallet, AlertTriangle, Truck, MoreHorizontal, ChevronRight, 
  Package, MapPin, Activity, ArrowUpRight, ArrowDownRight,
  Monitor, Cpu, Network, Laptop, Smartphone
} from 'lucide-react';
import { StatCard } from '../components/ui/StatCard';
import { motion } from 'motion/react';
import { useApp } from '../AppContext';
import TopBar from '../components/layout/TopBar';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const { assets, distributions, ledger, locations } = useApp();

  // Dynamic Data Calculations
  const totalInvestment = useMemo(() => {
    return ledger.reduce((acc, curr) => {
      const val = parseFloat(curr.totalCost);
      return acc + (isNaN(val) ? 0 : val);
    }, 0);
  }, [ledger]);

  const lowStockItems = useMemo(() => {
    return assets.filter(a => a.quantity < 10);
  }, [assets]);

  const categoryDistribution = useMemo(() => {
    const categories = assets.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.quantity;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [assets]);

  const branchActivity = useMemo(() => {
    const activity = distributions.reduce((acc, curr) => {
      acc[curr.branch] = (acc[curr.branch] || 0) + curr.quantity;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(activity)
      .map(([name, volume]) => ({ name, volume }))
      .sort((a, b) => b.volume - a.volume)
      .slice(0, 5);
  }, [distributions]);

  // Mock activity trend (last 6 months)
  const activityTrend = [
    { month: 'Oct', volume: 45 },
    { month: 'Nov', volume: 52 },
    { month: 'Dec', volume: 38 },
    { month: 'Jan', volume: 65 },
    { month: 'Feb', volume: 48 },
    { month: 'Mar', volume: 72 },
  ];

  const COLORS = ['#005db5', '#496277', '#bb1b1b', '#0052a0', '#3b5469'];

  const categoryIconMap: Record<string, any> = {
    'Servers & Storage': Cpu,
    'Networking Gear': Network,
    'End-User Devices': Laptop,
    'Peripherals': Monitor,
    'Mobile Devices': Smartphone,
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-surface relative">
      <div className="absolute inset-0 grid-pattern opacity-50 pointer-events-none" />
      
      <TopBar 
        title="Executive Intelligence" 
        subtitle="Global asset lifecycle & supply chain telemetry." 
      />
      
      <main className="flex-1 min-h-0 overflow-y-auto p-6 scrollbar-thin z-10">
        <div className="max-w-[1600px] mx-auto space-y-6 pb-12">
          
          {/* Header Stats Bento */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <StatCard 
              label="Total Investment" 
              value={totalInvestment >= 1000000 
                ? `$${(totalInvestment / 1000000).toFixed(2)}M` 
                : `$${(totalInvestment / 1000).toFixed(1)}k`} 
              trend="+4.2%" 
              subtitle="Q3 Hardware Spend"
              icon={Wallet} 
              variant="primary"
            />
            <StatCard 
              label="Inventory Volume" 
              value={assets.reduce((acc, curr) => acc + curr.quantity, 0).toLocaleString()} 
              subtitle="Active Units Across Hubs" 
              icon={Package} 
              variant="neutral"
            />
            <StatCard 
              label="Distribution Velocity" 
              value={distributions.length} 
              trend="+12%" 
              subtitle="Units in Active Transit" 
              icon={Truck} 
              variant="secondary"
            />
            <StatCard 
              label="Critical Alerts" 
              value={lowStockItems.length} 
              subtitle="Items Below Threshold" 
              icon={AlertTriangle} 
              variant="error"
            />
          </section>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Primary Analysis - Category Distribution */}
            <div className="lg:col-span-2 bento-card flex flex-col gap-8 min-h-[450px]">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-black text-on-surface tracking-tighter font-display uppercase">Portfolio Composition</h3>
                  <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest mt-1">Asset distribution by technology vertical</p>
                </div>
                <div className="flex gap-2">
                  <div className="bg-surface-container rounded-lg p-1.5 flex gap-1">
                    <button className="px-3 py-1 bg-surface-container-lowest rounded-md text-[10px] font-black uppercase text-primary ambient-shadow">Units</button>
                    <button className="px-3 py-1 text-[10px] font-black uppercase text-on-surface-variant/40 hover:text-on-surface transition-colors">Value</button>
                  </div>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
                <div className="md:col-span-2 h-[280px] w-full relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1a1a1a', 
                          border: 'none', 
                          borderRadius: '12px',
                          color: '#fff',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                        }}
                        itemStyle={{ color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-widest">Global</span>
                    <span className="text-3xl font-black font-display tracking-tighter">{assets.reduce((acc, curr) => acc + curr.quantity, 0)}</span>
                  </div>
                </div>

                <div className="md:col-span-3 space-y-4">
                  {categoryDistribution.slice(0, 5).map((item, idx) => {
                    const Icon = categoryIconMap[item.name] || Monitor;
                    return (
                      <div key={item.name} className="flex items-center gap-4 group cursor-pointer">
                        <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary transition-colors duration-300">
                          <Icon size={18} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-end mb-1">
                            <span className="text-xs font-black text-on-surface tracking-tight truncate">{item.name}</span>
                            <span className="text-[11px] font-black text-on-surface-variant font-mono">
                              {((item.value / assets.reduce((acc, curr) => acc + curr.quantity, 0)) * 100).toFixed(1)}%
                            </span>
                          </div>
                          <div className="h-1 bg-surface-container rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(item.value / assets.reduce((acc, curr) => acc + curr.quantity, 0)) * 100}%` }}
                              className="h-full bg-primary"
                              transition={{ duration: 1.5, ease: 'circOut', delay: idx * 0.1 }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Performance Sidebar */}
            <div className="flex flex-col gap-6">
              {/* Distribution Volume Chart */}
              <div className="bento-card flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-black text-on-surface-variant/60 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Activity size={14} className="text-secondary" />
                    Fleet Velocity
                  </h4>
                  <div className="h-[120px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activityTrend}>
                        <defs>
                          <linearGradient id="colorVol" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#496277" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#496277" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <Area 
                          type="monotone" 
                          dataKey="volume" 
                          stroke="#496277" 
                          strokeWidth={3}
                          fillOpacity={1} 
                          fill="url(#colorVol)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="pt-4 border-t border-outline-variant/10 flex justify-between items-end">
                  <div>
                    <span className="text-2xl font-black font-display tracking-tighter">72.4k</span>
                    <p className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-widest">Projected Transits</p>
                  </div>
                  <div className="flex items-center text-emerald-500 font-black text-[10px] bg-emerald-500/10 px-2 py-1 rounded-md">
                    <ArrowUpRight size={10} className="mr-1" />
                    +18%
                  </div>
                </div>
              </div>

              {/* Branch Activity Ranking */}
              <div className="bento-card flex-1">
                <h4 className="text-xs font-black text-on-surface-variant/60 uppercase tracking-widest mb-6">Top Distribution Hubs</h4>
                <div className="space-y-4">
                  {branchActivity.map((branch, idx) => (
                    <div key={branch.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-black text-on-surface-variant/20 font-display">0{idx + 1}</span>
                        <span className="text-xs font-black text-on-surface tracking-tight">{branch.name}</span>
                      </div>
                      <span className="text-[11px] font-black text-secondary font-mono bg-secondary/10 px-2 py-0.5 rounded">
                        {branch.volume}
                      </span>
                    </div>
                  ))}
                  {branchActivity.length === 0 && (
                    <div className="py-8 text-center text-on-surface-variant text-[10px] font-bold uppercase opacity-30">No distribution data</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section - Recent Activity & Critical Stock */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Recent Distributions */}
            <div className="bento-card overflow-hidden !p-0">
              <div className="p-6 border-b border-outline-variant/5 flex justify-between items-center bg-surface-container-lowest/50 backdrop-blur-sm">
                <div>
                  <h3 className="text-lg font-black text-on-surface tracking-tighter font-display uppercase">Recent Distributions</h3>
                  <p className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-widest">Latest asset assignments in transit</p>
                </div>
                <button 
                  onClick={() => navigate('/hub')}
                  className="p-2 hover:bg-surface-container rounded-xl transition-colors text-primary"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              <div className="sm:hidden divide-y divide-outline-variant/5">
                {distributions.slice(0, 4).map((dist) => (
                  <div key={dist.id} className="p-5 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-black text-on-surface tracking-tight leading-none">{dist.assetName}</span>
                        <span className="text-[9px] font-bold text-on-surface-variant/40 uppercase mt-1">#{dist.id}</span>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[7px] font-black text-slate-500 border border-slate-300">IN</div>
                          <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md border border-slate-200 whitespace-nowrap">Transit</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="flex flex-col">
                        <span className="text-[8px] font-black text-on-surface-variant/40 uppercase tracking-widest mb-0.5">Recipient</span>
                        <span className="text-[11px] font-bold text-on-surface-variant/60">{dist.assignedTo}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[8px] font-black text-on-surface-variant/40 uppercase tracking-widest mb-0.5 text-right">Location</span>
                        <div className="flex items-center gap-1 text-[11px] font-black text-secondary">
                          <MapPin size={10} className="opacity-50" />
                          {dist.branch}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="hidden sm:block overflow-x-auto scrollbar-hide">
                <table className="w-full text-left min-w-[500px]">
                  <thead className="bg-surface-container-low text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60">
                    <tr>
                      <th className="px-6 py-3">Asset</th>
                      <th className="px-6 py-3">Recipient</th>
                      <th className="px-6 py-3">Location</th>
                      <th className="px-6 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/5">
                    {distributions.slice(0, 4).map((dist) => (
                      <tr key={dist.id} className="hover:bg-surface-container-low transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-black text-on-surface tracking-tight truncate max-w-[150px]">{dist.assetName}</span>
                            <span className="text-[9px] font-bold text-on-surface-variant/40 uppercase">#{dist.id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-bold text-on-surface-variant">{dist.assignedTo}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-xs font-black text-secondary">
                            <MapPin size={10} className="opacity-50" />
                            {dist.branch}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[7px] font-black text-slate-500 border border-slate-300">IN</div>
                            <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md border border-slate-200 whitespace-nowrap">Transit</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {distributions.length === 0 && (
                      <tr><td colSpan={4} className="py-20 text-center text-xs font-bold text-on-surface-variant opacity-20 uppercase tracking-widest">No Recent Log History</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Low Stock Alerts */}
            <div className="bento-card flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-black text-on-surface tracking-tighter font-display uppercase">Sourcing Alerts</h3>
                <span className="bg-tertiary-container/30 text-tertiary text-[9px] font-black px-3 py-1.5 rounded-full border border-tertiary/20 uppercase tracking-widest">Inventory Threshold reached</span>
              </div>
              
              <div className="flex-1 space-y-3">
                {lowStockItems.slice(0, 4).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-surface-container-low/50 rounded-2xl border border-outline-variant/10 group hover:border-tertiary/30 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center text-tertiary">
                        <Package size={18} />
                      </div>
                      <div>
                        <h5 className="text-xs font-black text-on-surface tracking-tight">{item.name}</h5>
                        <p className="text-[9px] font-bold text-on-surface-variant/40 uppercase tracking-wider">{item.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-tertiary font-display leading-none">{item.quantity}</span>
                      <p className="text-[8px] font-black text-on-surface-variant/40 uppercase tracking-widest">Units Left</p>
                    </div>
                  </div>
                ))}
                {lowStockItems.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-on-surface-variant/20 py-12">
                    <Activity size={48} className="mb-4 opacity-10" />
                    <span className="text-[10px] font-black uppercase tracking-widest">All Stocks Operational</span>
                  </div>
                )}
              </div>
              
              <button 
                onClick={() => navigate('/inventory')}
                className="w-full py-4 rounded-2xl border border-outline-variant/10 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-surface-container hover:border-primary/20 hover:text-primary"
              >
                View Full Inventory Ledger
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
