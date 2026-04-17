export function Chip({ label, status }: { label: string; status?: string }) {
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold uppercase tracking-wider">
      {status && <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500'}`} />}
      {label}
    </span>
  );
}
