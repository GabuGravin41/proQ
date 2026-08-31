'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import {
  Bell, ChevronDown, User, Bookmark, Archive, LogOut,
  TrendingUp, Settings, Shield, Menu, X, Search, DollarSign,
  Briefcase, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

export default function TopbarActions() {
  const { user, isAuthenticated, isSubscriber, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    toast?.success('Signed out successfully');
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        {isAuthenticated && (
          <Link
            href="/notification-preferences"
            className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150"
            aria-label="Notifications"
          >
            <Bell size={18} />
            {isSubscriber && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent border-2 border-card" />
            )}
          </Link>
        )}

        {isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-all duration-150"
            >
              <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                {user?.name?.charAt(0) ?? 'U'}
              </div>
              <span className="max-w-[100px] truncate">{user?.name?.split(' ')?.[0]}</span>
              {isSubscriber && (
                <span className="px-1.5 py-0.5 rounded text-xs font-bold bg-accent/10 text-accent">Pro</span>
              )}
              <ChevronDown size={13} className="text-muted-foreground" />
            </button>

            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-56 bg-card border border-border rounded-xl shadow-modal z-50 py-1.5 animate-scale-in">
                  <div className="px-3.5 py-2.5 border-b border-border mb-1">
                    <p className="text-xs font-bold text-foreground truncate">{user?.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  
                  <Link href="/my-matches" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium hover:bg-muted transition-colors">
                    <TrendingUp size={15} className="text-primary" /> My Matches
                  </Link>
                  <Link href="/capability-profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium hover:bg-muted transition-colors">
                    <User size={15} className="text-muted-foreground" /> Bidding Preferences
                  </Link>
                  <Link href="/bookmarks" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium hover:bg-muted transition-colors">
                    <Bookmark size={15} className="text-muted-foreground" /> Saved Tenders
                  </Link>
                  <Link href="/archive" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium hover:bg-muted transition-colors">
                    <Archive size={15} className="text-muted-foreground" /> Archive
                  </Link>
                  <Link href="/notification-preferences" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium hover:bg-muted transition-colors">
                    <Bell size={15} className="text-muted-foreground" /> Notifications
                  </Link>
                  <Link href="/account-settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium hover:bg-muted transition-colors">
                    <Settings size={15} className="text-muted-foreground" /> Account Settings
                  </Link>
                  {user?.role === 'admin' && (
                    <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-primary font-bold hover:bg-primary/10 transition-colors">
                      <Shield size={15} className="text-primary" /> Admin Control Hub
                    </Link>
                  )}
                  <div className="border-t border-border mt-1.5 pt-1">
                    <button onClick={handleLogout} className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-danger hover:bg-danger-bg transition-colors w-full font-medium">
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <>
            <Link
              href="/sign-up-login?tab=login"
              className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-all duration-150"
            >
              Sign In
            </Link>
            <Link href="/sign-up-login?tab=signup" className="btn-primary text-xs px-3.5 py-1.5 shadow-sm">
              Start Free
            </Link>
          </>
        )}

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted transition-all duration-150"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* Mobile Drawer with 100% Feature & Icon Parity */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 right-0 h-full w-80 bg-card border-l border-border shadow-modal animate-slide-up flex flex-col p-5 gap-3 overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <span className="font-extrabold text-xl text-foreground">
                pro<span className="text-primary">Q</span> <span className="text-xs font-semibold text-accent ml-1 px-1.5 py-0.5 bg-accent/10 rounded">Kenya</span>
              </span>
              <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-md hover:bg-muted">
                <X size={18} />
              </button>
            </div>

            {/* User Profile Card */}
            {isAuthenticated ? (
              <div className="p-3 bg-muted/60 border border-border rounded-xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                  {user?.name?.charAt(0) ?? 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-foreground truncate">{user?.name}</p>
                    {isSubscriber && (
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-accent text-accent-foreground">Pro</span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl">
                <p className="text-xs font-bold text-foreground">Welcome to proQ</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Kenya&apos;s Public Procurement Intelligence</p>
              </div>
            )}

            {/* Navigation Section */}
            <div className="space-y-1 py-1">
              <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Discovery & Pricing
              </div>
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium hover:bg-muted text-foreground transition-all"
              >
                <Search size={15} className="text-primary" /> Tender Search
              </Link>
              <Link
                href="/landing"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium hover:bg-muted text-foreground transition-all"
              >
                <Sparkles size={15} className="text-accent" /> Platform Overview
              </Link>
              <Link
                href="/pricing"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium hover:bg-muted text-foreground transition-all"
              >
                <DollarSign size={15} className="text-emerald-600" /> Pricing & Plans
              </Link>
            </div>

            {/* Authenticated Workspace Items */}
            {isAuthenticated && (
              <div className="space-y-1 py-1 border-t border-border">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Workspace & Preferences
                </div>
                <Link
                  href="/my-matches"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium hover:bg-muted text-foreground transition-all"
                >
                  <TrendingUp size={15} className="text-primary" /> My Matches
                </Link>
                <Link
                  href="/capability-profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium hover:bg-muted text-foreground transition-all"
                >
                  <User size={15} className="text-muted-foreground" /> Bidding Preferences
                </Link>
                <Link
                  href="/bookmarks"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium hover:bg-muted text-foreground transition-all"
                >
                  <Bookmark size={15} className="text-muted-foreground" /> Saved Tenders
                </Link>
                <Link
                  href="/archive"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium hover:bg-muted text-foreground transition-all"
                >
                  <Archive size={15} className="text-muted-foreground" /> Archive
                </Link>
                <Link
                  href="/notification-preferences"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium hover:bg-muted text-foreground transition-all"
                >
                  <Bell size={15} className="text-muted-foreground" /> Notifications
                </Link>
                <Link
                  href="/account-settings"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium hover:bg-muted text-foreground transition-all"
                >
                  <Settings size={15} className="text-muted-foreground" /> Account Settings
                </Link>
                {user?.role === 'admin' && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold text-primary bg-primary/5 hover:bg-primary/10 transition-all"
                  >
                    <Shield size={15} className="text-primary" /> Admin Control Hub
                  </Link>
                )}
              </div>
            )}

            {/* Footer Action */}
            <div className="mt-auto pt-3 border-t border-border">
              {isAuthenticated ? (
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="btn-secondary w-full justify-center text-xs text-danger border-danger/20 hover:bg-danger-bg font-semibold py-2.5"
                >
                  <LogOut size={14} /> Sign Out
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/sign-up-login?tab=signup"
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary w-full justify-center text-xs py-2.5"
                  >
                    Start Free
                  </Link>
                  <Link
                    href="/sign-up-login?tab=login"
                    onClick={() => setMobileOpen(false)}
                    className="btn-secondary w-full justify-center text-xs py-2.5"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
