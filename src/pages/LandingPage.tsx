import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Layout, Users, Zap, ArrowRight, User, Lock, Mail, CheckCircle } from 'lucide-react';
import { useApp } from '../AppContext';

export default function LandingPage() {
  const { signIn, signUp } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isLogin) {
      const success = signIn(formData.username || formData.email, formData.password);
      if (!success) setError('Invalid credentials');
    } else {
      if (!formData.name || !formData.email || !formData.password || !formData.username) {
        setError('Please fill in all fields');
        return;
      }
      signUp({
        name: formData.name,
        email: formData.email,
        username: formData.username,
        password: formData.password
      });
    }
  };

  const features = [
    { icon: Layout, title: 'Centralized Assets', desc: 'Real-time visibility into all hardware nodes.' },
    { icon: Users, title: 'Fleet Control', desc: 'Secure assignment and tracking of equipment.' },
    { icon: Zap, title: 'Audit Ready', desc: 'Comprehensive ledger and location-based reporting.' }
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col md:flex-row overflow-hidden">
      {/* Hero Section */}
      <div className="flex-1 relative overflow-hidden bg-slate-900 p-8 md:p-16 flex flex-col justify-between">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(59,130,246,0.15),transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,rgba(99,102,241,0.15),transparent_50%)]" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
        </div>

        <div className="z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-12 h-12 primary-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-black/40">
              <Shield className="text-on-primary" size={24} />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-white tracking-tighter leading-none">PRECISION</span>
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] leading-none mt-1">Audit Control</span>
            </div>
          </div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] mb-8"
          >
            Digital Asset <br />
            <span className="text-blue-500">Intelligence.</span>
          </motion.h1>

          <p className="text-slate-400 text-lg max-w-md mb-12 leading-relaxed font-medium">
            The next-generation enterprise resource manager for mission-critical hardware fleets and logistics security.
          </p>

          <div className="grid grid-cols-1 gap-6">
            {features.map((f, i) => (
              <motion.div 
                key={f.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + (i * 0.1) }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <f.icon className="text-blue-400" size={20} />
                </div>
                <div>
                  <h3 className="text-slate-100 font-bold text-sm mb-1">{f.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed max-w-[200px]">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="z-10 mt-12 text-[10px] font-bold text-slate-600 uppercase tracking-widest flex items-center gap-4">
          <span>Enterprise Secure</span>
          <div className="w-1 h-1 rounded-full bg-slate-700" />
          <span>v2.8.4-Stable</span>
        </div>
      </div>

      {/* Auth Section */}
      <div className="w-full md:w-[480px] bg-white p-8 md:p-16 flex flex-col justify-center relative">
        <div className="max-w-sm mx-auto w-full">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-slate-400 text-sm font-medium">
              {isLogin ? 'Enter your credentials to access the console.' : 'Join the precision network and manage your fleet.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode='wait'>
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="text" 
                        required
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:font-medium"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="email" 
                        required
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:font-medium"
                        placeholder="john@precision.io"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">
                {isLogin ? 'Username / Email' : 'Username'}
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:font-medium"
                  placeholder={isLogin ? "admin or email" : "johndoe"}
                  value={formData.username}
                  onChange={e => setFormData({...formData, username: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="password" 
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder:font-medium"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 rounded-xl bg-red-50 text-red-600 text-[11px] font-bold border border-red-100 text-center"
              >
                {error}
              </motion.div>
            )}

            <button 
              type="submit"
              className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center justify-center gap-3 active:scale-[0.98] group"
            >
              {isLogin ? 'Initialize System' : 'Create Registry'}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              {isLogin ? "Don't have access?" : "Already registered?"}
              <button 
                onClick={() => { setIsLogin(!isLogin); setError(null); }}
                className="text-blue-600 ml-2 hover:underline"
              >
                {isLogin ? 'Request Registry' : 'Login instead'}
              </button>
            </p>
          </div>

          <div className="mt-12">
            <div className="flex items-center gap-2 text-[9px] font-black text-slate-300 uppercase tracking-widest justify-center">
              <CheckCircle size={10} />
              Verified Enterprise Infrastructure
            </div>
            <p className="text-[9px] text-slate-400 text-center mt-4">
              By accessing this system you agree to the Precision Protocol and audit guidelines for internal IT resource management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
