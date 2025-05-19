
"use client";

import { useState, useEffect } from 'react';
import type { ResumeData, TemplateId } from '@/lib/types';
import { ResumeEditor } from '@/components/resume-editor';
import { ResumePreview } from '@/components/resume-preview';
import { TemplateSelector } from '@/components/template-selector';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useToast } from "@/hooks/use-toast";

const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: 'John Doe',
    jobTitle: 'Software Engineer',
    email: 'john.doe@example.com',
    phoneNumber: '555-123-4567',
    address: '123 Main St, Anytown, USA',
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    portfolio: 'https://johndoe.dev',
  },
  summary: 'Highly motivated and results-oriented software engineer with 5+ years of experience in developing and deploying web applications. Proficient in JavaScript, React, and Node.js. Passionate about creating innovative solutions and collaborating with cross-functional teams.',
  workExperience: [
    {
      id: 'we1',
      jobTitle: 'Senior Software Engineer',
      company: 'Tech Solutions Inc.',
      location: 'San Francisco, CA',
      startDate: '2021-06',
      endDate: 'Present',
      description: '- Led the development of a new e-commerce platform, resulting in a 20% increase in sales.\n- Mentored junior engineers and conducted code reviews.\n- Collaborated with product managers to define project requirements.',
    },
  ],
  education: [
    {
      id: 'edu1',
      degree: 'B.S. in Computer Science',
      institution: 'University of Example',
      location: 'Example City, USA',
      graduationDate: '2019-05',
      details: 'GPA: 3.8, Magna Cum Laude',
    },
  ],
  skills: 'JavaScript, React, Node.js, Python, SQL, AWS, Docker, Agile Methodologies',
};


export default function ResumeCraftPage() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [selectedTemplateId, setSelectedTemplateId] = useState<TemplateId>('modern');
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const savedData = localStorage.getItem('resumeCraftData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setResumeData(parsedData.resumeData || initialResumeData);
        setSelectedTemplateId(parsedData.selectedTemplateId || 'modern');
      } catch (error) {
        console.error("Failed to parse saved data from localStorage", error);
        localStorage.removeItem('resumeCraftData');
      }
    }
  }, []);

  const handleSaveData = () => {
    if (!isClient) return;
    localStorage.setItem('resumeCraftData', JSON.stringify({ resumeData, selectedTemplateId }));
    toast({
      title: "Progress Saved!",
      description: "Your resume data has been saved locally in your browser.",
    });
  };

  const handleDownload = () => {
    if (!isClient) return;
    toast({
      title: "Preparing PDF...",
      description: "Your resume will be prepared for download. Please use your browser's print dialog to 'Save as PDF'.",
    });
    
    // This uses the browser's print functionality which typically includes a "Save as PDF" option.
    setTimeout(() => { // Delay to allow toast to show
        window.print();
    }, 500);
  };

  if (!isClient) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-background text-foreground">
        <Icons.fileText className="h-16 w-16 animate-pulse text-primary" />
        <p className="mt-4 text-lg">Loading ResumeCraft AI...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background to-muted/30 overflow-hidden print:bg-white print:h-auto">
      <style jsx global>{`
        @media print {
          body {
            margin: 0 !important;
            padding: 0 !important;
          }
          body * {
            visibility: hidden !important;
          }
          .printable-resume-area, .printable-resume-area * {
            visibility: visible !important;
          }
          .printable-resume-area {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100vw !important; 
            height: 100vh !important;
            margin: 0 !important;
            padding: 1cm !important; /* Print margin */
            box-sizing: border-box !important;
            border: none !important;
            box-shadow: none !important;
            transform: scale(1) !important;
            overflow: visible !important;
            background-color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          header, footer, .editor-column { /* Hide non-printable parts */
            display: none !important;
          }
          .preview-column { /* Ensure preview column wrapper doesn't interfere */
             width: 100% !important;
             max-width: 100% !important;
             height: auto !important;
             overflow: visible !important;
             padding: 0 !important;
             margin: 0 !important;
          }
        }
      `}</style>
      <header className="p-3 md:p-4 border-b border-border/50 shadow-sm bg-card/70 backdrop-blur-md sticky top-0 z-20">
        <div className="container mx-auto flex items-center justify-between max-w-full px-2 sm:px-4">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-8 w-8 text-primary">
              <rect width="256" height="256" fill="none"/>
              <path d="M208,96H48a8,8,0,0,0-8,8V208a8,8,0,0,0,8,8H208a8,8,0,0,0,8-8V104A8,8,0,0,0,208,96ZM184,40H72A16,16,0,0,0,56,56v8h8V56a8,8,0,0,1,8-8H184a8,8,0,0,1,8,8v8h8V56A16,16,0,0,0,184,40Z" fill="currentColor"/>
            </svg>
            <h1 className="text-xl md:text-2xl font-bold text-primary">ResumeCraft <span className="text-accent">AI</span></h1>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <TemplateSelector selectedTemplate={selectedTemplateId} onTemplateChange={setSelectedTemplateId} />
            <Button onClick={handleSaveData} variant="outline" size="sm" className="hidden sm:inline-flex">
              <Icons.save className="mr-2 h-4 w-4" /> Save Progress
            </Button>
            <Button onClick={handleDownload} variant="default" size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <Icons.download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden">
        <div className="editor-column h-full overflow-y-auto p-0 md:p-2 bg-background/30 md:bg-transparent">
          <ResumeEditor resumeData={resumeData} setResumeData={setResumeData} />
        </div>
        <div className="preview-column h-full overflow-y-auto p-0 md:p-2 bg-muted/30 md:bg-transparent">
          <ResumePreview resumeData={resumeData} selectedTemplateId={selectedTemplateId} />
        </div>
      </main>
       <footer className="p-2 border-t border-border/50 text-center text-xs text-muted-foreground bg-card/70 backdrop-blur-md">
        ResumeCraft AI &copy; {new Date().getFullYear()} - Build your future, one resume at a time.
      </footer>
    </div>
  );
}
