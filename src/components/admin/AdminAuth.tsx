import React, { useState } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import { Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured()) return toast.error('Supabase is not configured yet. Add your keys to .env');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Logged in successfully');
    }
  };

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory p-6">
        <div className="bg-white p-8 rounded-sm shadow-sm max-w-md w-full text-center border border-charcoal/10">
          <Lock className="w-12 h-12 text-gold mx-auto mb-4" />
          <h2 className="text-xl font-serif mb-2">CMS Not Configured</h2>
          <p className="text-sm text-charcoal/70 mb-6">
            You need to add your Supabase URL and Anon Key to the <code>.env</code> file to access the Admin Dashboard.
          </p>
          <p className="text-xs text-charcoal/50">Run the SQL schema provided in your project root to set up the database.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ivory p-6 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-charcoal/5 rounded-full blur-[100px] pointer-events-none" />
      
      <form onSubmit={handleLogin} className="bg-white/80 backdrop-blur-xl p-10 rounded-2xl shadow-2xl max-w-sm w-full border border-charcoal/10 relative z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-gold/20 blur-[50px] rounded-full pointer-events-none" />
        
        <div className="text-center mb-10 relative z-10">
          <h1 className="font-serif text-3xl mb-2 text-charcoal">Admin Portal</h1>
          <p className="text-xs text-gold uppercase tracking-widest font-semibold">The Loft by NM</p>
        </div>
        
        <div className="space-y-5 relative z-10">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-charcoal/50 mb-1.5 block">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              className="w-full text-sm p-3.5 bg-charcoal/5 border border-charcoal/10 text-charcoal rounded-lg focus:border-gold focus:ring-1 focus:ring-gold outline-hidden transition-all placeholder:text-charcoal/20"
              required
              placeholder="admin@theloft.lk"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-charcoal/50 mb-1.5 block">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              className="w-full text-sm p-3.5 bg-charcoal/5 border border-charcoal/10 text-charcoal rounded-lg focus:border-gold focus:ring-1 focus:ring-gold outline-hidden transition-all placeholder:text-charcoal/20"
              required
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-gold to-[#D4AF37] text-black py-4 rounded-lg text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] mt-4">
            Enter Dashboard
          </button>
        </div>
      </form>
    </div>
  );
}
