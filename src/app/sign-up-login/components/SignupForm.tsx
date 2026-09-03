'use client';
import React, { useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

export default function SignupForm({ onSwitchToLogin }: SignupFormProps) {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    setLoading(true);
    const result = await register({ name, email, company, password });
    setLoading(false);
    if (result.success) {
      router.push('/capability-profile');
    } else {
      setError(result.error || 'Registration failed. Please try again.');
    }
  };

  const pwStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const pwColors = ['', 'bg-danger', 'bg-warning', 'bg-success'];
  const pwLabels = ['', 'Weak', 'Fair', 'Strong'];

  return (
    <div>
      <h2 className="text-xl font-bold text-foreground mb-1">Create your account</h2>
      <p className="text-sm text-muted-foreground mb-6">Start discovering Kenya&apos;s public tenders — free forever</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your full name"
              required
              className="input-base"
            />
          </div>
          <div className="col-span-2 sm:col-span-1">
            <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Company</label>
            <input
              type="text"
              value={company}
              onChange={e => setCompany(e.target.value)}
              placeholder="Company name"
              className="input-base"
            />
          </div>
        </div>

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
              placeholder="Min. 8 characters"
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
          {password && (
            <div className="mt-1.5 flex items-center gap-2">
              <div className="flex gap-1 flex-1">
                {[1, 2, 3].map(i => (
                  <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= pwStrength ? pwColors[pwStrength] : 'bg-muted'}`} />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">{pwLabels[pwStrength]}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-danger-bg border border-danger/20 rounded-lg text-xs text-danger">
            <AlertCircle size={13} />
            {error}
          </div>
        )}

        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Check size={13} className="text-success mt-0.5 shrink-0" />
          By creating an account you agree to our Terms of Service and Privacy Policy.
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
          {loading ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
          ) : 'Create Free Account'}
        </button>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-5">
        Already have an account?{' '}
        <button onClick={onSwitchToLogin} className="text-primary font-semibold hover:underline">
          Sign in
        </button>
      </p>
    </div>
  );
}
