"use client";

import React, { useState, useEffect } from 'react';
import type { ResumeData, TemplateId } from '@/lib/types';
import { ResumeEditor } from '@/components/builder/resume-editor';
import { ResumePreview } from '@/components/builder/resume-preview';
import { TemplateSelector } from '@/components/builder/template-selector';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useToast } from "@/hooks/use-toast";
import { GlobalHeader } from '@/components/global-header';
import { saveResume, getResume } from '@/lib/resumeService';
import { templates } from '@/components/builder/templates';
import { initialResumeData } from '@/lib/initialData';

export default function ResumeCraftPage() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [selectedTemplateId, setSelectedTemplateId] = useState<TemplateId>('modern');
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // For demo purposes, using a fixed userId. In a real app, this would come from authentication
  const userId = 'demo-user';

  useEffect(() => {
    setIsClient(true);
    loadResumeData();
  }, []);

  const loadResumeData = async () => {
    try {
      const result = await getResume(userId);
      if (result.success && result.data) {
        setResumeData(result.data.resumeData);
        // Ensure the template ID is a valid TemplateId
        const templateId = result.data.templateId as TemplateId;
        if (Object.keys(templates).includes(templateId)) {
          setSelectedTemplateId(templateId);
        } else {
          console.warn('Invalid template ID from database, using default');
          setSelectedTemplateId('modern');
        }
      } else {
        // If no resume found, use initial data
        console.log('No saved resume found, using initial data');
      }
    } catch (error) {
      console.error('Error loading resume:', error);
      toast({
        title: "Error Loading Resume",
        description: "Could not load your saved resume. Using initial data instead.",
        variant: "destructive",
      });
    }
  };

  const handleSaveData = async () => {
    if (!isClient) return;
    
    setIsSaving(true);
    try {
      const result = await saveResume(userId, resumeData, selectedTemplateId);
      if (result.success) {
        toast({
          title: "Progress Saved!",
          description: "Your resume data has been saved to the cloud.",
        });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error saving resume:', error);
      toast({
        title: "Error Saving Resume",
        description: "Could not save your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownload = async () => {
    if (!isClient || isDownloading) return;

    setIsDownloading(true);
    toast({
      title: "Generating PDF...",
      description: "Your resume is being prepared for download. Please wait.",
    });

    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData,
          templateId: selectedTemplateId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fileName = `${(resumeData.personalInfo.fullName || 'resume').replace(/\s+/g, '_')}_${selectedTemplateId}.pdf`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

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
          <Button 
            onClick={handleSaveData} 
            variant="outline" 
            size="sm" 
            className="hidden sm:inline-flex"
            disabled={isSaving}
          >
            {isSaving ? (
              <Icons.loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Icons.save className="mr-2 h-4 w-4" />
            )}
            {isSaving ? "Saving..." : "Save Progress"}
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
