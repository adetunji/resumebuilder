"use client";

import OptimizerForm from "@/components/optimizer/optimizer-form";
import { GlobalHeader } from "@/components/global-header";

export default function OptimizerPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-muted/30">
      <GlobalHeader />
      <main className="flex-1">
        <OptimizerForm />
      </main>
      <footer className="p-2 border-t border-border/50 text-center text-xs text-muted-foreground bg-card/70 backdrop-blur-md">
        ResumeCraft AI &copy; {new Date().getFullYear()} - Build your future, one resume at a time.
      </footer>
    </div>
  );
} 