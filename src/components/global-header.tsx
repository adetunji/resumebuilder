"use client";

import { GlobalNav } from "./global-nav";

interface GlobalHeaderProps {
  children?: React.ReactNode;
}

export function GlobalHeader({ children }: GlobalHeaderProps) {
  return (
    <header className="p-3 md:p-4 border-b border-border/50 shadow-sm bg-card/70 backdrop-blur-md sticky top-0 z-20">
      <div className="container mx-auto flex items-center justify-between max-w-full px-2 sm:px-4">
        <GlobalNav />
        {children}
      </div>
    </header>
  );
} 