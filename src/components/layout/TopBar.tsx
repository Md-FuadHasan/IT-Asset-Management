import { ReactNode } from 'react';
import { Menu } from 'lucide-react';

export default function TopBar({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  const openMenu = () => {
    window.dispatchEvent(new CustomEvent('open-mobile-menu'));
  };

  return (
    <header className="flex items-center justify-between px-6 md:px-10 py-6 md:py-8 glass-panel sticky top-0 z-40 border-b border-outline-variant/5">
      <div className="flex items-center gap-4">
        <button 
          onClick={openMenu}
          className="md:hidden p-2 bg-white border border-outline-variant/10 rounded-xl text-on-surface-variant shadow-sm active:scale-90 transition-all"
        >
          <Menu size={20} />
        </button>
        <div className="flex flex-col">
          {subtitle && (
            <p className="text-[9px] md:text-[11px] font-black text-primary uppercase tracking-[0.2em] mb-1">
              {subtitle}
            </p>
          )}
          <h1 className="text-2xl md:text-4xl font-black text-on-surface tracking-tighter">
            {title}
          </h1>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {action}
      </div>
    </header>
  );
}
