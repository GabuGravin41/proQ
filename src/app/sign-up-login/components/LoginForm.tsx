'use client';
import React, { useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

export default function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      router.push('/');
    } else {
      setError(result.error ?? 'Login failed');
    }
  };

  const fillDemo = (role: 'free' | 'pro' | 'admin') => {
    const creds = {
      free: { email: 'wanjiku.mwangi@techbiz.co.ke', password: 'TenderIQ@Free2026' },
      pro: { email: 'kipchoge.ruto@buildright.co.ke', password: 'TenderIQ@Pro2026' },
      admin: { email: 'admin@tenderiq.co.ke', password: 'TenderIQ@Admin2026' },
    };
    setEmail(creds[role].email);
    setPassword(creds[role].password);
    setError('');
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-1">Welcome back</h2>
      <p className="text-sm text-muted-foreground mb-6">Sign in to your TenderIQ account</p>

      {/* Demo credentials */}
      <div className="mb-5 p-3 bg-muted rounded-xl">
        <p className="text-xs font-semibold text-muted-foreground mb-2">Demo accounts:</p>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => fillDemo('free')} className="px-2.5 py-1 rounded-lg bg-card border border-border text-xs font-medium hover:bg-secondary transition-all">Free User</button>
          <button onClick={() => fillDemo('pro')} className="px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/20 text-xs font-medium text-accent hover:bg-accent/20 transition-all">Pro Subscriber</button>
          <button onClick={() => fillDemo('admin')} className="px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20 text-xs font-medium text-primary hover:bg-primary/20 transition-all">Admin</button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@company.co.ke"
            required
            className="input-base"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="input-base pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-danger-bg border border-danger/20 rounded-lg text-xs text-danger">
            <AlertCircle size={13} />
            {error}
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
          {loading ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
          ) : 'Sign In'}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-5">
        No account?{' '}
        <button onClick={onSwitchToSignup} className="text-primary font-semibold hover:underline">
          Create one free
        </button>
      </p>
    </div>
  );
}
