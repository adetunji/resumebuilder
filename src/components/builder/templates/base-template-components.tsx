
import type React from 'react';
import type { ResumeData } from '@/lib/types';
import { Icons, SectionIcon } from '@/components/icons'; // Updated to use SectionIcon

interface TemplateSectionProps {
  title?: string;
  iconName?: keyof typeof Icons; // Use iconName
  className?: string;
  children: React.ReactNode;
  titleClassName?: string;
  contentClassName?: string;
}

export const TemplateSection: React.FC<TemplateSectionProps> = ({ title, iconName, className, children, titleClassName, contentClassName }) => (
  <section className={`mb-4 ${className || ''}`}>
    {title && (
      <h2 className={`text-xl font-semibold border-b-2 border-secondary pb-1 mb-2 flex items-center gap-2 ${titleClassName || 'text-primary'}`}>
        {iconName && <SectionIcon name={iconName} className="h-5 w-5" />}
        {title}
      </h2>
    )}
    <div className={contentClassName || ''}>{children}</div>
  </section>
);

export const ContactInfo: React.FC<{ personalInfo: ResumeData['personalInfo']; className?: string; itemClassName?: string }> = ({ personalInfo, className, itemClassName }) => (
  <div className={`flex flex-wrap gap-x-3 gap-y-1 text-xs ${className || ''}`}>
    {personalInfo.email && <span className={itemClassName}>{personalInfo.email}</span>}
    {personalInfo.phoneNumber && <span className={itemClassName}>{(personalInfo.email ? '• ' : '') + personalInfo.phoneNumber}</span>}
    {personalInfo.address && <span className={itemClassName}>{(personalInfo.email || personalInfo.phoneNumber ? '• ' : '') + personalInfo.address}</span>}
    {personalInfo.linkedin && <a href={personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className={`text-primary hover:underline ${itemClassName}`}>{(personalInfo.email || personalInfo.phoneNumber || personalInfo.address ? '• ' : '')}LinkedIn</a>}
    {personalInfo.github && <a href={personalInfo.github} target="_blank" rel="noopener noreferrer" className={`text-primary hover:underline ${itemClassName}`}>{(personalInfo.email || personalInfo.phoneNumber || personalInfo.address || personalInfo.linkedin ? '• ' : '')}GitHub</a>}
    {personalInfo.portfolio && <a href={personalInfo.portfolio} target="_blank" rel="noopener noreferrer" className={`text-primary hover:underline ${itemClassName}`}>{(personalInfo.email || personalInfo.phoneNumber || personalInfo.address || personalInfo.linkedin || personalInfo.github ? '• ' : '')}Portfolio</a>}
  </div>
);

export const WorkExperienceItem: React.FC<{ exp: ResumeData['workExperience'][0]; className?: string; dateFormat?: (date: string) => string }> = ({ exp, className, dateFormat }) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Present';
    if (dateStr.toLowerCase() === 'present') return 'Present';
    try {
      if (dateFormat) return dateFormat(dateStr);
      const [year, month] = dateStr.split('-');
      const date = new Date(parseInt(year), parseInt(month) -1);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short'});
    } catch {
      return dateStr; // Fallback to original string if parsing fails
    }
  };

  return (
  <div className={`mb-3 ${className || ''}`}>
    <h3 className="font-semibold text-md">{exp.jobTitle}</h3>
    <div className="flex justify-between text-sm items-baseline">
      <span className="italic">{exp.company}</span>
      <span className="text-xs text-muted-foreground">{exp.location}</span>
    </div>
    <div className="text-xs text-muted-foreground mb-1">
      {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
    </div>
    <ul className="list-disc list-inside text-sm space-y-0.5 pl-1">
      {exp.description.split('\n').map((line, i) => line.trim() && <li key={i}>{line.trim()}</li>)}
    </ul>
  </div>
)};

export const EducationItem: React.FC<{ edu: ResumeData['education'][0]; className?: string; dateFormat?: (date: string) => string }> = ({ edu, className, dateFormat }) => {
  const formatDate = (dateStr: string) => {
     if (!dateStr) return '';
    try {
      if (dateFormat) return dateFormat(dateStr);
      const [year, month] = dateStr.split('-');
      const date = new Date(parseInt(year), parseInt(month) -1);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short'});
    } catch {
      return dateStr;
    }
  };
  return (
  <div className={`mb-2 ${className || ''}`}>
    <h3 className="font-semibold text-md">{edu.degree}</h3>
    <div className="flex justify-between text-sm items-baseline">
      <span className="italic">{edu.institution}</span>
      <span className="text-xs text-muted-foreground">{edu.location}</span>
    </div>
    <div className="text-xs text-muted-foreground">
      {formatDate(edu.graduationDate)}
    </div>
    {edu.details && <p className="text-sm mt-1 text-muted-foreground">{edu.details}</p>}
  </div>
)};

export const SkillsList: React.FC<{ skills: string; className?: string; skillItemClassName?: string }> = ({ skills, className, skillItemClassName }) => (
  <div className={`flex flex-wrap gap-2 ${className || ''}`}>
    {skills.split(/[,;\n]+/).map((skill, i) => skill.trim() && (
      <span key={i} className={`bg-secondary/30 text-secondary-foreground px-2 py-0.5 rounded-md text-xs ${skillItemClassName || ''}`}>
        {skill.trim()}
      </span>
    ))}
  </div>
);

// Helper to render common sections
export const renderCommonSections = (data: ResumeData, templateStyles: Record<string, string> = {}, sectionIconMapping?: Partial<Record<keyof ResumeData, keyof typeof Icons>>) => (
  <>
    {data.summary && (
      <TemplateSection title="Summary" iconName={sectionIconMapping?.summary || "fileText"} className={templateStyles.summarySection} titleClassName={templateStyles.sectionTitle}>
        <p className={`text-sm whitespace-pre-line ${templateStyles.summaryText}`}>{data.summary}</p>
      </TemplateSection>
    )}
    {data.workExperience.length > 0 && (
      <TemplateSection title="Work Experience" iconName={sectionIconMapping?.workExperience || "briefcase"} className={templateStyles.workExperienceSection} titleClassName={templateStyles.sectionTitle}>
        {data.workExperience.map(exp => <WorkExperienceItem key={exp.id} exp={exp} className={templateStyles.workItem}/>)}
      </TemplateSection>
    )}
    {data.education.length > 0 && (
      <TemplateSection title="Education" iconName={sectionIconMapping?.education || "graduationCap"} className={templateStyles.educationSection} titleClassName={templateStyles.sectionTitle}>
        {data.education.map(edu => <EducationItem key={edu.id} edu={edu} className={templateStyles.eduItem}/>)}
      </TemplateSection>
    )}
    {data.skills && !templateStyles.hideSkillsSection && ( // Added hideSkillsSection check
      <TemplateSection title="Skills" iconName={sectionIconMapping?.skills || "lightbulb"} className={templateStyles.skillsSection} titleClassName={templateStyles.sectionTitle}>
        <SkillsList skills={data.skills} className={templateStyles.skillsList} skillItemClassName={templateStyles.skillItem}/>
      </TemplateSection>
    )}
  </>
);
