import { 
  Shield, ChevronRight, Save, Box, Truck, Filter, Download, 
  MoreVertical, User as UserIcon, Settings as SettingsIcon, 
  Lock, Key, Eye, Edit3, Trash2, Check, Smartphone, Globe, Plus, X
} from 'lucide-react';
import { useMemo, useState } from 'react';
import TopBar from '../components/layout/TopBar';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../AppContext';
import { SecurityRole } from '../types';
import { fuzzySearch } from '../lib/search';

type Tab = 'rbac' | 'users' | 'security' | 'general';

export default function Settings() {
  const { securityRoles, permissions, addSecurityRole, updateSecurityRole, users, updateUser, deleteUser } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('rbac');
  const [selectedRoleId, setSelectedRoleId] = useState<string>(securityRoles[0]?.id || '1');
  const [isAddRoleModalOpen, setIsAddRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');

  // User management states
  const [userSearch, setUserSearch] = useState('');
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState<string | null>(null);

  const searchedUsers = useMemo(() => {
    return fuzzySearch(users, userSearch, ['name', 'email', 'role']);
  }, [users, userSearch]);

  const selectedRole = useMemo(() => {
    return securityRoles.find(r => r.id === selectedRoleId) || securityRoles[0];
  }, [selectedRoleId, securityRoles]);

  const togglePermission = (permId: string) => {
    if (!selectedRole) return;
    const currentPerms = selectedRole.permissions;
    const newPerms = currentPerms.includes(permId)
      ? currentPerms.filter(id => id !== permId)
      : [...currentPerms, permId];
    
    updateSecurityRole(selectedRole.id, { permissions: newPerms });
  };

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName) return;
    addSecurityRole({
      name: newRoleName,
      description: newRoleDesc,
      isStandard: false,
      permissions: ['v-cat'] // Default permission
    });
    setNewRoleName('');
    setNewRoleDesc('');
    setIsAddRoleModalOpen(false);
  };

  const handleAssignRole = (userId: string, roleName: string) => {
    updateUser(userId, { role: roleName });
    setIsRoleMenuOpen(null);
  };

  const tabs = [
    { id: 'rbac', label: 'RBAC Access', icon: Shield },
    { id: 'users', label: 'User Directory', icon: UserIcon },
    { id: 'security', label: 'Security Policy', icon: Lock },
    { id: 'general', label: 'System Config', icon: SettingsIcon },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-surface relative">
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
      
      <TopBar 
        title="Command Center" 
        subtitle="Infrastructure governance & identity management." 
      />
      
      <main className="flex-1 min-h-0 flex flex-col p-6 max-w-[1600px] mx-auto w-full z-10 overflow-hidden">
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-8 bg-surface-container-low p-1.5 rounded-2xl w-full sm:w-fit ambient-shadow border border-outline-variant/10 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center gap-2.5 px-4 sm:px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-on-surface-variant/40 hover:text-on-surface hover:bg-surface-container-highest/50'
                }`}
              >
                <Icon size={14} strokeWidth={3} />
                <span className="hidden xs:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-thin rounded-3xl">
          <AnimatePresence mode="wait">
            {activeTab === 'rbac' && (
              <motion.div 
                key="rbac"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-12 gap-6 pb-12"
              >
                {/* Role List Side */}
                <div className="col-span-12 lg:col-span-4 space-y-6">
                  <div className="bento-card">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-[10px] font-black tracking-[0.25em] uppercase text-on-surface-variant/40">Select Identity Role</h3>
                      <button 
                        onClick={() => setIsAddRoleModalOpen(true)}
                        className="p-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors shadow-sm"
                      >
                        <Plus size={16} strokeWidth={3} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                      {securityRoles.map((role) => (
                        <button
                          key={role.id}
                          onClick={() => setSelectedRoleId(role.id)}
                          className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all border-2 group ${
                            selectedRoleId === role.id 
                              ? 'bg-white border-primary text-primary shadow-lg shadow-primary/5' 
                              : 'bg-surface-container-low/50 border-transparent text-on-surface-variant/60 hover:bg-surface-container-low hover:border-outline-variant/20'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                              selectedRoleId === role.id ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105' : 'bg-surface-container text-on-surface-variant/40'
                            }`}>
                              <Shield size={20} strokeWidth={2.5} />
                            </div>
                            <div className="text-left overflow-hidden">
                              <span className="text-sm font-black tracking-tight block truncate">{role.name}</span>
                              <span className="text-[10px] font-bold text-on-surface-variant/40 truncate block max-w-[120px] sm:max-w-[150px]">{role.description}</span>
                            </div>
                          </div>
                          <ChevronRight size={18} className={`flex-shrink-0 transition-all duration-300 ${selectedRoleId === role.id ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bento-card">
                    <h3 className="text-[10px] font-black tracking-[0.25em] uppercase text-on-surface-variant/40 mb-6">Role Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-5 bg-surface-container-low rounded-2xl border border-outline-variant/5">
                        <p className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-widest mb-1">Seats Used</p>
                        <p className="text-2xl font-black font-display tracking-tight">1.2k</p>
                      </div>
                      <div className="p-5 bg-surface-container-low rounded-2xl border border-outline-variant/5">
                        <p className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-widest mb-1">Coverage</p>
                        <p className="text-2xl font-black font-display tracking-tight text-emerald-500">98%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Permissions Grid */}
                <div className="col-span-12 lg:col-span-8">
                  <div className="bento-card h-full flex flex-col">
                    <div className="flex items-center justify-between mb-10 pb-6 border-b border-outline-variant/10">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h2 className="text-2xl font-black text-on-surface tracking-tighter font-display uppercase">{selectedRole?.name} Policy</h2>
                          {selectedRole?.isStandard && (
                            <div className="px-3 py-1 bg-primary/10 text-primary text-[9px] font-black rounded-full uppercase tracking-widest border border-primary/20">Standard System Role</div>
                          )}
                        </div>
                        <p className="text-xs text-on-surface-variant/60 font-bold uppercase tracking-widest italic">{selectedRole?.description || 'No description provided'}</p>
                      </div>
                      <div className="flex gap-3">
                         <button className="flex items-center gap-3 px-6 py-3 bg-primary text-white text-[11px] font-black rounded-2xl hover:bg-primary-dim transition-all shadow-lg shadow-primary/20 active:scale-95">
                          <Check size={16} strokeWidth={3} />
                          Publish Changes
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 space-y-10 overflow-y-auto pr-4 scrollbar-thin">
                      {['inventory', 'logistics', 'system'].map((cat) => {
                        const catPermissions = permissions.filter(p => p.category === cat);
                        if (catPermissions.length === 0) return null;

                        return (
                          <section key={cat}>
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                                {cat === 'inventory' ? <Box size={16} /> : cat === 'logistics' ? <Truck size={16} /> : <SettingsIcon size={16} />}
                              </div>
                              <h4 className="text-[10px] font-black text-on-surface-variant tracking-[0.2em] uppercase">{cat} Operations</h4>
                            </div>
                            
                            <div className="bg-surface-container-low/30 rounded-2xl border border-outline-variant/10 overflow-hidden">
                              <table className="w-full text-left">
                                <thead className="bg-surface-container-low/50 text-[9px] font-black uppercase tracking-widest text-on-surface-variant/40 border-b border-outline-variant/5">
                                  <tr>
                                    <th className="px-6 py-3 w-12">
                                      <div className="flex items-center justify-center">
                                        <div className="w-4 h-4 rounded border-2 border-outline-variant/30 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                                          <X size={10} className="text-white opacity-0" />
                                        </div>
                                      </div>
                                    </th>
                                    <th className="px-6 py-3">Permission Entity</th>
                                    <th className="px-6 py-3">Authorization Scope</th>
                                    <th className="px-6 py-3 text-right">Access Level</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-outline-variant/5">
                                  {catPermissions.map((perm) => {
                                    const isActive = selectedRole?.permissions.includes(perm.id);
                                    return (
                                      <tr 
                                        key={perm.id} 
                                        onClick={() => togglePermission(perm.id)}
                                        className="group hover:bg-white/80 transition-all cursor-pointer"
                                      >
                                        <td className="px-6 py-4">
                                          <div className="flex items-center justify-center">
                                            <div className={`w-5 h-5 rounded-lg border-2 transition-all duration-300 flex items-center justify-center ${
                                              isActive 
                                                ? 'bg-primary border-primary shadow-sm shadow-primary/20' 
                                                : 'bg-white border-outline-variant/30 group-hover:border-primary/50'
                                            }`}>
                                              {isActive && <Check size={12} className="text-white" strokeWidth={4} />}
                                            </div>
                                          </div>
                                        </td>
                                        <td className="px-6 py-4">
                                          <span className="text-xs font-black text-on-surface tracking-tight">{perm.label}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                          <span className="text-[10px] text-on-surface-variant/60 font-bold uppercase tracking-wider">{perm.desc}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest ${isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-tertiary-container/30 text-tertiary'}`}>
                                            {isActive ? 'Authorized' : 'Restricted'}
                                          </span>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </section>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div 
                key="users"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bento-card overflow-hidden !p-0"
              >
                <div className="p-4 sm:p-8 border-b border-outline-variant/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-on-surface font-display tracking-tighter uppercase">Global Identity Directory</h3>
                    <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-widest mt-1">Authorized personnel across all operational nodes</p>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:flex-none">
                      <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40" size={14} />
                      <input 
                        type="text" 
                        placeholder="SEARCH IDENTITIES..."
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="bg-surface-container-low border border-outline-variant/10 rounded-xl pl-10 pr-4 py-2.5 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-72"
                      />
                    </div>
                    <button className="p-3 bg-white border border-outline-variant/10 rounded-xl text-on-surface-variant hover:text-primary transition-all shadow-sm">
                      <Download size={18} />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto scrollbar-thin">
                  <table className="w-full text-left min-w-[900px]">
                    <thead>
                      <tr className="bg-surface-container-low/30 text-[9px] font-black uppercase tracking-[0.2em] text-on-surface-variant border-b border-outline-variant/10">
                        <th className="px-6 sm:px-10 py-5">Identity</th>
                        <th className="px-6 sm:px-10 py-5">Security Role</th>
                        <th className="px-6 sm:px-10 py-5">Connectivity</th>
                        <th className="px-6 sm:px-10 py-5 text-right w-32">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/10">
                      {searchedUsers.map((user) => (
                        <tr key={user.id} className="group hover:bg-surface-container-low/20 transition-all h-24">
                          <td className="px-6 sm:px-10 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-surface-container overflow-hidden ring-4 ring-white shadow-lg flex-shrink-0">
                                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                              <div>
                                <h4 className="text-sm font-black text-on-surface tracking-tight">{user.name}</h4>
                                <p className="text-[10px] font-bold text-on-surface-variant/40 uppercase tracking-wider">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 sm:px-10 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-5 h-5 rounded-full border border-primary/20 flex items-center justify-center text-primary/40">
                                <Shield size={10} strokeWidth={3} />
                              </div>
                              <span className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.1em]">{user.role}</span>
                            </div>
                          </td>
                          <td className="px-6 sm:px-10 py-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-outline-variant'}`} />
                              <div className="flex flex-col">
                                <span className={`text-[10px] font-black uppercase tracking-widest ${user.status === 'Active' ? 'text-emerald-600' : 'text-on-surface-variant/40'}`}>
                                  {user.status}
                                </span>
                                <span className="text-[9px] font-bold text-on-surface-variant/30 uppercase tracking-tighter">
                                  Last Pulsed: {user.lastAccess}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 sm:px-10 py-4 relative">
                            <div className="flex justify-end pr-2">
                              <button 
                                onClick={() => setIsRoleMenuOpen(isRoleMenuOpen === user.id ? null : user.id)}
                                className="w-10 h-10 flex items-center justify-center hover:bg-white rounded-full text-on-surface-variant uppercase shadow-sm border border-outline-variant/10 active:scale-95 transition-all"
                              >
                                <MoreVertical size={18} />
                              </button>
                            </div>

                            {/* Dropdown Menu */}
                            <AnimatePresence>
                              {isRoleMenuOpen === user.id && (
                                <>
                                  <div className="fixed inset-0 z-10" onClick={() => setIsRoleMenuOpen(null)} />
                                  <motion.div 
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    className="absolute right-0 sm:right-10 top-20 w-40 sm:w-44 bg-white rounded-xl shadow-2xl border border-outline-variant/10 z-20 py-2 overflow-hidden"
                                  >
                                    <div className="px-3 py-1.5 border-b border-outline-variant/5 mb-1 text-left">
                                      <p className="text-[8px] font-black text-on-surface-variant/40 uppercase tracking-widest">Assign Role</p>
                                    </div>
                                    <div className="max-h-56 overflow-y-auto scrollbar-thin">
                                      {securityRoles.map((role) => (
                                        <button
                                          key={role.id}
                                          onClick={() => handleAssignRole(user.id, role.name)}
                                          className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-surface-container-low transition-colors ${user.role === role.name ? 'text-primary' : 'text-on-surface-variant'}`}
                                        >
                                          <Shield size={12} className={user.role === role.name ? 'text-primary' : 'text-on-surface-variant/30'} />
                                          <div className="flex flex-col">
                                            <span className="text-[9px] font-black uppercase tracking-widest leading-none">{role.name}</span>
                                            {user.role === role.name && (
                                              <span className="text-[7px] font-bold uppercase tracking-tighter mt-0.5 opacity-60">Selected</span>
                                            )}
                                          </div>
                                        </button>
                                      ))}
                                      {user.id !== 'admin-id' && (
                                        <button
                                          onClick={() => {
                                            if (window.confirm(`Are you sure you want to de-provision ${user.name}?`)) {
                                              deleteUser(user.id);
                                              setIsRoleMenuOpen(null);
                                            }
                                          }}
                                          className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-red-50 text-red-600 transition-colors border-t border-outline-variant/5 mt-1"
                                        >
                                          <Trash2 size={12} />
                                          <span className="text-[9px] font-black uppercase tracking-widest leading-none">De-provision</span>
                                        </button>
                                      )}
                                    </div>
                                  </motion.div>
                                </>
                              )}
                            </AnimatePresence>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {(activeTab === 'security' || activeTab === 'general') && (
              <motion.div 
                key="security"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {[
                  { title: 'Global 2FA', icon: Smartphone, desc: 'Enforce multi-factor auth for all hubs', status: 'Active', color: 'bg-emerald-500' },
                  { title: 'Geo-Fencing', icon: Globe, desc: 'Restrict access by regional IP ranges', status: 'Normal', color: 'bg-primary' },
                  { title: 'API Access', icon: Key, desc: 'Managing external integration tokens', status: 'Encrypted', color: 'bg-secondary' },
                ].map((item) => (
                  <div key={item.title} className="bento-card flex flex-col justify-between group cursor-pointer border-transparent hover:border-primary/20 transition-all">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-on-surface-variant mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <item.icon size={24} />
                      </div>
                      <h4 className="text-lg font-black text-on-surface font-display tracking-tight uppercase mb-2">{item.title}</h4>
                      <p className="text-[11px] font-bold text-on-surface-variant/60 leading-relaxed uppercase tracking-widest">{item.desc}</p>
                    </div>
                    <div className="mt-8 flex items-center justify-between">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full ${item.color}/10 ${item.color.replace('bg-', 'text-')} uppercase tracking-[0.2em] border border-current opacity-60`}>
                        {item.status}
                      </span>
                      <ChevronRight size={20} className="text-on-surface-variant/20 -translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                    </div>
                  </div>
                ))}
                
                <div className="lg:col-span-2 bento-card bg-primary shadow-2xl shadow-primary/20 flex flex-col md:flex-row items-center gap-8 text-white relative overflow-hidden">
                  <Shield size={200} className="absolute -right-20 -bottom-20 opacity-10 rotate-12" />
                  <div className="flex-1 relative z-10">
                    <h3 className="text-3xl font-black font-display tracking-tight uppercase mb-4">Security Baseline 2.0</h3>
                    <p className="text-sm font-bold opacity-80 mb-8 max-w-md leading-relaxed">
                      Your current security posture is rated as <span className="text-emerald-400">OPTIMAL</span>. 
                      All identity nodes are verified and encrypted under the master governance policy.
                    </p>
                    <button className="px-8 py-3 bg-white text-primary text-[10px] font-extrabold uppercase tracking-[0.2em] rounded-2xl hover:bg-opacity-90 transition-all">
                      Audit Security Logs
                    </button>
                  </div>
                  <div className="w-full md:w-64 relative z-10 space-y-4">
                    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Uptime</p>
                      <p className="text-xl font-black">99.99%</p>
                    </div>
                    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10">
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Threats Prevented</p>
                      <p className="text-xl font-black">12.4k</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Add Role Modal */}
        <AnimatePresence>
          {isAddRoleModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAddRoleModalOpen(false)}
                className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl z-10 relative"
              >
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <Plus size={20} />
                      </div>
                      <h3 className="text-xl font-black font-display tracking-tight uppercase">Provision Identity</h3>
                    </div>
                    <button onClick={() => setIsAddRoleModalOpen(false)} className="text-on-surface-variant/40 hover:text-on-surface transition-colors">
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleAddRole} className="space-y-6">
                    <div>
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block mb-2 px-1">Role Identifier</label>
                      <input 
                        required
                        value={newRoleName}
                        onChange={(e) => setNewRoleName(e.target.value)}
                        placeholder="e.g. ACCOUNTANT"
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl px-5 py-3 text-sm font-black tracking-tight placeholder:text-on-surface-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block mb-2 px-1">Functional Description</label>
                      <textarea 
                        value={newRoleDesc}
                        onChange={(e) => setNewRoleDesc(e.target.value)}
                        placeholder="Define authority scope..."
                        rows={3}
                        className="w-full bg-surface-container-low border border-outline-variant/20 rounded-2xl px-5 py-3 text-sm font-bold tracking-tight placeholder:text-on-surface-variant/20 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="w-full py-4 bg-primary text-white text-xs font-black rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary-dim transition-all active:scale-95"
                    >
                      INITIALIZE IDENTITY
                    </button>
                  </form>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
