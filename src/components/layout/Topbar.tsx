import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import TopbarActions from './TopbarActions';

const publicNavLinks = [
  { label: 'Overview', href: '/landing' },
  { label: 'Tender Search', href: '/' },
  { label: 'Pricing', href: '/pricing' },
];

export default function Topbar() {
  return (
    <header className="sticky top-0 z-40 w-full bg-card border-b border-border shadow-card">
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 2xl:px-16 h-16 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <AppLogo size={36} />
          <span className="font-extrabold text-2xl tracking-tight text-primary">
            TenQ
          </span>
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-accent text-accent-foreground ml-1">
            Kenya
          </span>
        </Link>

        {/* Center nav */}
        <nav className="hidden md:flex items-center gap-1">
          {publicNavLinks.map((link) => (
            <Link
              key={`nav-${link.href}`}
              href={link.href}
              className="px-3 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all duration-150"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <TopbarActions />
      </div>
    </header>
  );
}
