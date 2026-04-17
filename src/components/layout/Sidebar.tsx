import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MapPin, Package, Share2, Settings, HelpCircle, BookOpen, LogOut, Shield, Receipt, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../../AppContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
  { icon: Receipt, label: 'Ledger', to: '/ledger' },
  { icon: Package, label: 'Inventory', to: '/inventory' },
  { icon: Share2, label: 'Hub', to: '/hub' },
  { icon: MapPin, label: 'Locations', to: '/locations' },
  { icon: Settings, label: 'Settings', to: '/settings' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { currentUser, signOut } = useApp();

  return (
    <>
      <nav className={`
        fixed inset-y-0 left-0 z-[60] w-64 bg-surface-container-low border-r border-outline-variant/10 py-6 transition-transform duration-300 flex flex-col
        md:translate-x-0
        ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="px-6 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 primary-gradient rounded-lg flex items-center justify-center text-on-primary">
              <Shield size={20} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-xl font-black text-on-surface tracking-tighter leading-tight">Precision Architect</h1>
              <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Enterprise Asset Mgt</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="md:hidden p-2 text-on-surface-variant/40 hover:text-on-surface transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-1 pr-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => onClose()}
              className={({ isActive }) => `
                flex items-center gap-4 px-6 py-3 text-sm font-semibold uppercase tracking-widest transition-all duration-300 relative
                ${isActive 
                  ? 'bg-surface-container-lowest text-primary rounded-r-full shadow-sm' 
                  : 'text-on-surface/60 hover:bg-surface-container-high hover:text-on-surface rounded-r-full'}
              `}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div 
                      layoutId="sidebarActive"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full"
                    />
                  )}
                  <item.icon size={20} className={isActive ? 'fill-primary/20' : ''} />
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-1">
          <a href="#" className="flex items-center gap-4 px-6 py-3 text-on-surface/60 hover:text-primary transition-colors text-sm font-semibold uppercase tracking-widest">
            <HelpCircle size={20} />
            Support
          </a>
          <a href="#" className="flex items-center gap-4 px-6 py-3 text-on-surface/60 hover:text-primary transition-colors text-sm font-semibold uppercase tracking-widest">
            <BookOpen size={20} />
            Documentation
          </a>
          
          <div className="px-6 py-4 mt-2 flex items-center gap-3 border-t border-outline-variant/15">
            <img 
              alt={currentUser?.name} 
              className="w-10 h-10 rounded-full object-cover shadow-sm bg-surface-container border border-outline-variant/10" 
              src={currentUser?.avatarUrl} 
            />
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold text-on-surface truncate">{currentUser?.name}</span>
              <span className="text-[10px] text-on-surface/60 font-semibold uppercase tracking-wider">{currentUser?.role}</span>
            </div>
            <button 
              onClick={() => signOut()}
              className="ml-auto text-on-surface/40 hover:text-primary transition-colors p-1"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
