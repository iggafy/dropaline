
import React, { useState } from 'react';
import { supabase } from '../services/supabase';
import { Mail, Lock, User, ArrowRight, Loader } from 'lucide-react';

export const AuthView: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [handle, setHandle] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              handle,
              name,
            },
          },
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#f5f5f7]">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-xl border border-[#d1d1d6]">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#1d1d1f]">DropaLine</h1>
          <p className="text-sm text-[#86868b] mt-2">The physical internet for writers.</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <>
              <div className="relative">
                <User size={16} className="absolute left-3 top-3 text-[#86868b]" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#f5f5f7] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                  required={!isLogin}
                />
              </div>
              <div className="relative">
                <span className="absolute left-3 top-3 text-[#86868b] text-xs font-bold">@</span>
                <input
                  type="text"
                  placeholder="Handle (e.g. poet_doe)"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  className="w-full pl-8 pr-4 py-2.5 bg-[#f5f5f7] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                  required={!isLogin}
                />
              </div>
            </>
          )}

          <div className="relative">
            <Mail size={16} className="absolute left-3 top-3 text-[#86868b]" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#f5f5f7] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
              required
            />
          </div>

          <div className="relative">
            <Lock size={16} className="absolute left-3 top-3 text-[#86868b]" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#f5f5f7] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-bold hover:bg-black/80 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader size={16} className="animate-spin" /> : (
                <>
                 {isLogin ? 'Sign In' : 'Join the Network'} <ArrowRight size={16} />
                </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-[#0066cc] hover:underline font-medium"
          >
            {isLogin ? "New here? Create an account" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
};
