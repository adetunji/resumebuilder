"use client";

import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/icons';

export function GlobalNav() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex items-center gap-2">
      <Sheet>
        <SheetTrigger asChild>
          <button 
            className="p-2 hover:bg-muted rounded-md transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6 text-primary" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px] p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <SheetTitle className="text-lg font-semibold text-primary">ResumeCraft AI</SheetTitle>
            </div>
            <nav className="flex-1 p-2">
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => handleNavigation('/')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                  >
                    <Icons.fileText className="h-4 w-4" />
                    Resume Builder
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleNavigation('/optimizer')}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                  >
                    <Icons.wand className="h-4 w-4" />
                    Resume Optimizer
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-8 w-8 text-primary">
        <rect width="256" height="256" fill="none"/>
        <path d="M208,96H48a8,8,0,0,0-8,8V208a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8V104A8,8,0,0,0,208,96ZM184,40H72A16,16,0,0,0,56,56v8h8V56a8,8,0,0,1,8-8H184a8,8,0,0,1,8,8v8h8V56A16,16,0,0,0,184,40Z" fill="currentColor"/>
      </svg>
      <h1 className="text-xl md:text-2xl font-bold text-primary">ResumeCraft <span className="text-accent">AI</span></h1>
    </div>
  );
} 