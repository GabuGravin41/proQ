'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Bell, Menu, X, User, LogOut, Settings, Bookmark, TrendingUp, Archive, ChevronDown, Shield } from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { toast } from 'sonner';

export default function TopbarActions() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, isSubscriber, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    toast?.success('Signed out successfully');
  };

  const navLinks = [
    { label: 'Tender Search', href: '/' },
    { label: 'Pricing', href: '/pricing' },
    ...(isAuthenticated ? [
      { label: 'My Matches', href: '/my-matches' },
      { label: 'Saved', href: '/bookmarks' },
      { label: 'Archive', href: '/archive' },
    ] : []),
  ];

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
                <div className="absolute right-0 top-full mt-1 w-52 bg-card border border-border rounded-xl shadow-modal z-50 py-1 animate-scale-in">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-xs font-semibold text-foreground truncate">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <Link href="/my-matches" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors">
                    <TrendingUp size={14} className="text-muted-foreground" /> My Matches
                  </Link>
                  <Link href="/capability-profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors">
                    <User size={14} className="text-muted-foreground" /> Capability Profile
                  </Link>
                  <Link href="/bookmarks" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors">
                    <Bookmark size={14} className="text-muted-foreground" /> Saved Tenders
                  </Link>
                  <Link href="/archive" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors">
                    <Archive size={14} className="text-muted-foreground" /> Archive
                  </Link>
                  <Link href="/notification-preferences" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors">
                    <Bell size={14} className="text-muted-foreground" /> Notifications
                  </Link>
                  <Link href="/account-settings" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-muted transition-colors">
                    <Settings size={14} className="text-muted-foreground" /> Account Settings
                  </Link>
                  {user?.role === 'admin' && (
                    <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2.5 px-3 py-2 text-sm text-primary font-semibold hover:bg-primary/10 transition-colors">
                      <Shield size={14} className="text-primary" /> Admin Control Hub
                    </Link>
                  )}
                  <div className="border-t border-border mt-1">
                    <button onClick={handleLogout} className="flex items-center gap-2.5 px-3 py-2 text-sm text-danger hover:bg-danger-bg transition-colors w-full">
                      <LogOut size={14} /> Sign Out
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

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute top-0 right-0 h-full w-72 bg-card border-l border-border shadow-modal animate-slide-up flex flex-col p-6 gap-2">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-lg text-primary">TenderIQ</span>
              <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-md hover:bg-muted">
                <X size={18} />
              </button>
            </div>

            {isAuthenticated && (
              <div className="flex items-center gap-3 p-3 bg-muted rounded-xl mb-2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {user?.name?.charAt(0) ?? 'U'}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                  <p className="text-xs text-muted-foreground">{isSubscriber ? 'Pro Subscriber' : 'Free Account'}</p>
                </div>
              </div>
            )}

            {navLinks?.map(link => (
              <Link
                key={link?.href}
                href={link?.href}
                onClick={() => setMobileOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-all"
              >
                {link?.label}
              </Link>
            ))}

            {isAuthenticated && (
              <>
                <Link href="/capability-profile" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-all">Capability Profile</Link>
                <Link href="/notification-preferences" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-all">Notifications</Link>
                <Link href="/account-settings" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-all">Account Settings</Link>
              </>
            )}

            <div className="mt-auto">
              {isAuthenticated ? (
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="btn-secondary w-full justify-center text-danger border-danger/20">
                  <LogOut size={14} /> Sign Out
                </button>
              ) : (
                <Link href="/sign-up-login" onClick={() => setMobileOpen(false)} className="btn-primary w-full justify-center">
                  Sign In / Start Free
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
