import { LucideIcon, TrendingUp } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: string;
  icon: LucideIcon;
  variant?: 'primary' | 'error' | 'secondary' | 'neutral';
}

export function StatCard({ label, value, subtitle, trend, icon: Icon, variant = 'neutral' }: StatCardProps) {
  const variantStyles = {
    primary: 'bg-primary/10 text-primary',
    error: 'bg-tertiary/10 text-tertiary',
    secondary: 'bg-secondary/10 text-secondary',
    neutral: 'bg-surface-container text-on-surface-variant'
  };

  return (
    <div className="bento-card relative overflow-hidden flex flex-col justify-between min-h-[160px] group transition-all">
      <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[80px] opacity-10 ${variant === 'primary' ? 'bg-primary' : variant === 'error' ? 'bg-tertiary' : 'bg-secondary'}`} />
      
      <div className="flex justify-between items-start z-10">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-500 ${variantStyles[variant]}`}>
          <Icon size={24} />
        </div>
        {variant === 'error' && (
          <span className="bg-red-50 text-red-600 text-[9px] font-black px-3 py-1.5 rounded-full tracking-[0.15em] uppercase flex items-center gap-2 border border-red-100 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-red-600" />
            Alert
          </span>
        )}
      </div>

      <div className="mt-4 z-10 flex flex-col">
        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{label}</div>
        <div className="flex flex-wrap items-end gap-3 min-h-[40px]">
          <div className="text-4xl font-black text-slate-900 tracking-tighter font-display leading-[0.9]">
            {value}
          </div>
          <div className="flex flex-col gap-1 pb-0.5">
            {trend && (
              <div className="flex items-center text-blue-600 text-[10px] font-black tracking-widest bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100 w-fit">
                <TrendingUp size={10} className="mr-1" strokeWidth={3} />
                {trend}
              </div>
            )}
            {subtitle && (
              <div className="text-slate-400 text-[9px] font-bold uppercase tracking-widest leading-none max-w-[100px]">
                {subtitle}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
