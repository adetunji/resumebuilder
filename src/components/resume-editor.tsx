
"use client";

import type React from 'react';
import { useState, type ChangeEvent } from 'react';
import type { ResumeData, WorkExperienceEntry, EducationEntry } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons, SectionIcon } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";
import { enhanceSummaryAction, enhanceWorkExperienceAction, enhanceSkillsAction } from "@/app/actions";

interface ResumeEditorProps {
  resumeData: ResumeData;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeData>>;
}

export function ResumeEditor({ resumeData, setResumeData }: ResumeEditorProps) {
  const { toast } = useToast();
  const [aiLoading, setAiLoading] = useState({
    summary: false,
    workExperience: '', // Stores ID of work experience being enhanced
    skills: false,
  });

  const handleInputChange = (section: keyof ResumeData, field: string, value: string) => {
    setResumeData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as object),
        [field]: value,
      },
    }));
  };

  const handleGenericChange = (section: keyof ResumeData, value: string) => {
    setResumeData(prev => ({ ...prev, [section]: value }));
  };
  
  // Work Experience handlers
  const handleWorkExperienceChange = (index: number, field: keyof WorkExperienceEntry, value: string) => {
    const updatedWorkExperience = [...resumeData.workExperience];
    updatedWorkExperience[index] = { ...updatedWorkExperience[index], [field]: value };
    setResumeData(prev => ({ ...prev, workExperience: updatedWorkExperience }));
  };

  const addWorkExperience = () => {
    setResumeData(prev => ({
      ...prev,
      workExperience: [
        ...prev.workExperience,
        { id: Date.now().toString(), jobTitle: '', company: '', location: '', startDate: '', endDate: '', description: '' },
      ],
    }));
  };

  const removeWorkExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter(exp => exp.id !== id),
    }));
  };

  // Education handlers
  const handleEducationChange = (index: number, field: keyof EducationEntry, value: string) => {
    const updatedEducation = [...resumeData.education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    setResumeData(prev => ({ ...prev, education: updatedEducation }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { id: Date.now().toString(), degree: '', institution: '', location: '', graduationDate: '', details: '' },
      ],
    }));
  };

  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id),
    }));
  };

  // AI Enhancement Handlers
  const handleEnhanceSummary = async () => {
    setAiLoading(prev => ({ ...prev, summary: true }));
    const result = await enhanceSummaryAction({
      summary: resumeData.summary,
      jobDescription: '', // Consider adding a field for job description later
      skills: resumeData.skills,
      experience: resumeData.workExperience.map(exp => exp.description).join('\n'),
    });
    if (result.success && result.data) {
      setResumeData(prev => ({ ...prev, summary: result.data }));
      toast({ title: "Summary Enhanced", description: "AI successfully enhanced your summary." });
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
    setAiLoading(prev => ({ ...prev, summary: false }));
  };

  const handleEnhanceWorkExperience = async (experienceId: string, currentDescription: string) => {
    setAiLoading(prev => ({ ...prev, workExperience: experienceId }));
    const result = await enhanceWorkExperienceAction({ workExperience: currentDescription });
    if (result.success && result.data) {
      const updatedWorkExperience = resumeData.workExperience.map(exp =>
        exp.id === experienceId ? { ...exp, description: result.data } : exp
      );
      setResumeData(prev => ({ ...prev, workExperience: updatedWorkExperience }));
      toast({ title: "Work Experience Enhanced", description: "AI successfully enhanced this experience." });
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
    setAiLoading(prev => ({ ...prev, workExperience: '' }));
  };
  
  const handleEnhanceSkills = async () => {
    setAiLoading(prev => ({ ...prev, skills: true }));
    const result = await enhanceSkillsAction({ 
      skillsSection: resumeData.skills,
      jobDescription: '' // Placeholder for job description
    });
    if (result.success && result.data) {
      setResumeData(prev => ({ ...prev, skills: result.data }));
      toast({ title: "Skills Enhanced", description: "AI successfully enhanced your skills section." });
    } else {
      toast({ title: "Error", description: result.error, variant: "destructive" });
    }
    setAiLoading(prev => ({ ...prev, skills: false }));
  };


  const SectionWrapper: React.FC<{ title: string; iconName: keyof typeof Icons; children: React.ReactNode }> = ({ title, iconName, children }) => (
    <AccordionItem value={title.toLowerCase().replace(/\s+/g, '-')}>
      <AccordionTrigger className="text-lg font-semibold hover:no-underline text-secondary-foreground hover:text-primary transition-colors">
        <div className="flex items-center gap-3">
          <SectionIcon name={iconName} className="h-5 w-5 text-primary" />
          {title}
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-2 pb-4 px-1">
        {children}
      </AccordionContent>
    </AccordionItem>
  );

  return (
    <Card className="h-full overflow-y-auto shadow-lg rounded-lg border-none bg-card/80 backdrop-blur-sm">
      <CardHeader className="sticky top-0 bg-card/80 backdrop-blur-sm z-10 border-b">
        <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
          <Icons.settings className="h-6 w-6"/>
          Resume Editor
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6 space-y-6">
        <Accordion type="multiple" defaultValue={['personal-info']} className="w-full">
          <SectionWrapper title="Personal Information" iconName="user">
            <div className="space-y-4">
              <div><Label htmlFor="fullName">Full Name</Label><Input id="fullName" value={resumeData.personalInfo.fullName} onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)} /></div>
              <div><Label htmlFor="jobTitle">Job Title / Desired Role</Label><Input id="jobTitle" value={resumeData.personalInfo.jobTitle} onChange={(e) => handleInputChange('personalInfo', 'jobTitle', e.target.value)} /></div>
              <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={resumeData.personalInfo.email} onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)} /></div>
              <div><Label htmlFor="phoneNumber">Phone Number</Label><Input id="phoneNumber" value={resumeData.personalInfo.phoneNumber} onChange={(e) => handleInputChange('personalInfo', 'phoneNumber', e.target.value)} /></div>
              <div><Label htmlFor="address">Address</Label><Input id="address" value={resumeData.personalInfo.address} onChange={(e) => handleInputChange('personalInfo', 'address', e.target.value)} /></div>
              <div><Label htmlFor="linkedin">LinkedIn Profile URL</Label><Input id="linkedin" value={resumeData.personalInfo.linkedin ?? ''} onChange={(e) => handleInputChange('personalInfo', 'linkedin', e.target.value)} /></div>
              <div><Label htmlFor="github">GitHub Profile URL</Label><Input id="github" value={resumeData.personalInfo.github ?? ''} onChange={(e) => handleInputChange('personalInfo', 'github', e.target.value)} /></div>
              <div><Label htmlFor="portfolio">Portfolio URL</Label><Input id="portfolio" value={resumeData.personalInfo.portfolio ?? ''} onChange={(e) => handleInputChange('personalInfo', 'portfolio', e.target.value)} /></div>
            </div>
          </SectionWrapper>

          <SectionWrapper title="Summary / Objective" iconName="fileText">
            <div className="space-y-2">
              <Label htmlFor="summary">Summary</Label>
              <Textarea id="summary" value={resumeData.summary} onChange={(e) => handleGenericChange('summary', e.target.value)} rows={5} />
              <Button onClick={handleEnhanceSummary} disabled={aiLoading.summary} size="sm" variant="outline">
                <Icons.wand className="mr-2 h-4 w-4" /> {aiLoading.summary ? "Enhancing..." : "Enhance with AI"}
              </Button>
            </div>
          </SectionWrapper>

          <SectionWrapper title="Work Experience" iconName="briefcase">
            {resumeData.workExperience.map((exp, index) => (
              <Card key={exp.id} className="mb-4 bg-background/50">
                <CardContent className="p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div><Label htmlFor={`jobTitle-${exp.id}`}>Job Title</Label><Input id={`jobTitle-${exp.id}`} value={exp.jobTitle} onChange={e => handleWorkExperienceChange(index, 'jobTitle', e.target.value)} /></div>
                    <div><Label htmlFor={`company-${exp.id}`}>Company</Label><Input id={`company-${exp.id}`} value={exp.company} onChange={e => handleWorkExperienceChange(index, 'company', e.target.value)} /></div>
                    <div><Label htmlFor={`location-${exp.id}`}>Location</Label><Input id={`location-${exp.id}`} value={exp.location} onChange={e => handleWorkExperienceChange(index, 'location', e.target.value)} /></div>
                    <div className="grid grid-cols-2 gap-2">
                        <div><Label htmlFor={`startDate-${exp.id}`}>Start Date</Label><Input id={`startDate-${exp.id}`} type="month" value={exp.startDate} onChange={e => handleWorkExperienceChange(index, 'startDate', e.target.value)} /></div>
                        <div><Label htmlFor={`endDate-${exp.id}`}>End Date</Label><Input id={`endDate-${exp.id}`} type="text" value={exp.endDate} onChange={e => handleWorkExperienceChange(index, 'endDate', e.target.value)} placeholder="YYYY-MM or Present"/></div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor={`description-${exp.id}`}>Description (Achievements/Responsibilities)</Label>
                    <Textarea id={`description-${exp.id}`} value={exp.description} onChange={e => handleWorkExperienceChange(index, 'description', e.target.value)} rows={4} placeholder="Use bullet points, starting with action verbs."/>
                  </div>
                  <div className="flex justify-between items-center">
                    <Button onClick={() => handleEnhanceWorkExperience(exp.id, exp.description)} disabled={aiLoading.workExperience === exp.id} size="sm" variant="outline">
                      <Icons.wand className="mr-2 h-4 w-4" /> {aiLoading.workExperience === exp.id ? "Enhancing..." : "Enhance This Entry"}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => removeWorkExperience(exp.id)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive">
                      <Icons.trash className="mr-1 h-4 w-4" /> Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button onClick={addWorkExperience} variant="outline" className="w-full">
              <Icons.add className="mr-2 h-4 w-4" /> Add Work Experience
            </Button>
          </SectionWrapper>

          <SectionWrapper title="Education" iconName="graduationCap">
            {resumeData.education.map((edu, index) => (
              <Card key={edu.id} className="mb-4 bg-background/50">
                <CardContent className="p-4 space-y-3">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div><Label htmlFor={`degree-${edu.id}`}>Degree / Certificate</Label><Input id={`degree-${edu.id}`} value={edu.degree} onChange={e => handleEducationChange(index, 'degree', e.target.value)} /></div>
                    <div><Label htmlFor={`institution-${edu.id}`}>Institution</Label><Input id={`institution-${edu.id}`} value={edu.institution} onChange={e => handleEducationChange(index, 'institution', e.target.value)} /></div>
                    <div><Label htmlFor={`location-${edu.id}`}>Location</Label><Input id={`location-${edu.id}`} value={edu.location} onChange={e => handleEducationChange(index, 'location', e.target.value)} /></div>
                    <div><Label htmlFor={`gradDate-${edu.id}`}>Graduation Date</Label><Input id={`gradDate-${edu.id}`} type="text" value={edu.graduationDate} onChange={e => handleEducationChange(index, 'graduationDate', e.target.value)} placeholder="YYYY-MM or Expected YYYY-MM" /></div>
                  </div>
                  <div>
                    <Label htmlFor={`details-${edu.id}`}>Details (Optional, e.g., GPA, Honors, Relevant Coursework)</Label>
                    <Textarea id={`details-${edu.id}`} value={edu.details || ''} onChange={e => handleEducationChange(index, 'details', e.target.value)} rows={2} />
                  </div>
                  <div className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => removeEducation(edu.id)} className="text-destructive hover:text-destructive-foreground hover:bg-destructive">
                      <Icons.trash className="mr-1 h-4 w-4" /> Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button onClick={addEducation} variant="outline" className="w-full">
              <Icons.add className="mr-2 h-4 w-4" /> Add Education
            </Button>
          </SectionWrapper>

          <SectionWrapper title="Skills" iconName="lightbulb">
            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Textarea id="skills" value={resumeData.skills} onChange={(e) => handleGenericChange('skills', e.target.value)} rows={4} placeholder="Enter skills, comma-separated or one per line (e.g., JavaScript, Python, Project Management)"/>
              <Button onClick={handleEnhanceSkills} disabled={aiLoading.skills} size="sm" variant="outline">
                <Icons.wand className="mr-2 h-4 w-4" /> {aiLoading.skills ? "Enhancing..." : "Enhance with AI"}
              </Button>
            </div>
          </SectionWrapper>
        </Accordion>
      </CardContent>
    </Card>
  );
}
