import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      <p className="mt-4 text-sm font-medium text-muted-foreground animate-pulse">Loading Tender Details...</p>
    </div>
  );
}
