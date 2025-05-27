"use client";

import React, { useState, useEffect } from 'react';
import type { ResumeData, TemplateId } from '@/lib/types';
import { ResumeEditor } from '@/components/resume-editor';
import { ResumePreview } from '@/components/resume-preview';
import { TemplateSelector } from '@/components/template-selector';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useToast } from "@/hooks/use-toast";
// Removed static import: import { pdf } from '@react-pdf/renderer';
import ResumePdfDocument from '@/components/resume-pdf-document';
import { GlobalHeader } from '@/components/global-header';

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
  const [isDownloading, setIsDownloading] = useState(false);

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

  const handleDownload = async () => {
    if (!isClient || isDownloading) return;

    setIsDownloading(true);
    toast({
      title: "Generating PDF...",
      description: "Your resume is being prepared for download. Please wait.",
    });

    try {
      // Dynamically import the pdf function from @react-pdf/renderer
      const { pdf: reactPdfRendererPdfFunction } = await import('@react-pdf/renderer');
      
      const doc = <ResumePdfDocument data={resumeData} />;
      const pdfInstance = reactPdfRendererPdfFunction(doc);

      if (!pdfInstance) {
        console.error("Error: react-pdf's pdf() function returned undefined. This can happen if there's an issue with the document structure or data passed to ResumePdfDocument.", { resumeData });
        toast({
            title: "PDF Generation Error",
            description: "Failed to initialize PDF renderer. The document structure might be invalid or contain incompatible data.",
            variant: "destructive",
        });
        setIsDownloading(false);
        return;
      }
      
      const blob = await pdfInstance.toBlob(); 
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      const fileName = `${(resumeData.personalInfo.fullName || 'resume').replace(/\s+/g, '_')}_${selectedTemplateId}.pdf`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      toast({
        title: "Download Started!",
        description: `Your PDF (${fileName}) should be downloading.`,
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      toast({
        title: "PDF Generation Failed",
        description: `Could not generate the PDF. Please try again. Error: ${errorMessage}`,
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
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
      <GlobalHeader>
        <div className="flex items-center gap-2 md:gap-4">
          <TemplateSelector selectedTemplate={selectedTemplateId} onTemplateChange={setSelectedTemplateId} />
          <Button onClick={handleSaveData} variant="outline" size="sm" className="hidden sm:inline-flex">
            <Icons.save className="mr-2 h-4 w-4" /> Save Progress
          </Button>
          <Button 
            onClick={handleDownload} 
            variant="default" 
            size="sm" 
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            disabled={isDownloading}
          >
            {isDownloading ? <Icons.loader className="mr-2 h-4 w-4 animate-spin" /> : <Icons.download className="mr-2 h-4 w-4" />}
            {isDownloading ? "Downloading..." : "Download PDF"}
          </Button>
        </div>
      </GlobalHeader>

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
