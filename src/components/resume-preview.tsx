"use client";

import type { ResumeData, TemplateId } from "@/lib/types";
import { templates } from "./templates";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "./icons";
import { useEffect, useState, memo } from "react";

interface ResumePreviewProps {
  resumeData: ResumeData;
  selectedTemplateId: TemplateId;
}

export const ResumePreview = memo(function ResumePreview({ resumeData, selectedTemplateId }: ResumePreviewProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const SelectedTemplateComponent = templates[selectedTemplateId];

  if (!mounted) {
    return (
      <Card className="h-full shadow-lg rounded-lg border-none bg-card/80 backdrop-blur-sm flex items-center justify-center">
        <CardContent className="p-6 text-center">
          <Icons.fileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Loading Preview...</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="h-full shadow-xl rounded-lg border-none bg-card/80 backdrop-blur-sm overflow-hidden">
      <CardHeader className="sticky top-0 bg-card/80 backdrop-blur-sm z-10 border-b" style={{'--header-height': '4rem'} as React.CSSProperties}>
         <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
           <Icons.fileText className="h-6 w-6"/>
           Live Preview
         </CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-y-auto h-[calc(100%-var(--header-height,4rem))]">
        <div className="aspect-[8.5/11] w-full max-w-2xl mx-auto my-4 bg-white shadow-2xl text-black scale-[0.95] origin-top printable-resume-area">
          {SelectedTemplateComponent ? (
            <SelectedTemplateComponent data={resumeData} />
          ) : (
            <div className="p-8 text-center text-destructive">Template not found. Please select a valid template.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

ResumePreview.displayName = 'ResumePreview';
