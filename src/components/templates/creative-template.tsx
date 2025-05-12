
import type React from 'react';
import type { ResumeData } from '@/lib/types';
import { TemplateSection, ContactInfo, WorkExperienceItem, EducationItem, SkillsList } from './base-template-components';
import Image from 'next/image';

interface CreativeTemplateProps {
  data: ResumeData;
}

const CreativeTemplate: React.FC<CreativeTemplateProps> = ({ data }) => {
  const templateStyles = {
    container: "flex gap-0", // No gap for seamless look
    sidebar: "w-1/3 bg-accent text-accent-foreground p-6", // Creative accent
    mainContent: "w-2/3 p-6 bg-white", // White main area for contrast
    profileImage: "rounded-full mx-auto mb-6 border-4 border-accent-foreground/50 shadow-lg",
    name: "text-3xl font-bold mb-1 text-center",
    jobTitle: "text-lg text-accent-foreground/80 mb-4 text-center",
    contactInfoContainer: "space-y-1 text-sm border-t border-accent-foreground/30 pt-4 mt-4",
    contactItem: "flex items-center gap-2",
    sectionTitleSidebar: "text-accent-foreground border-accent-foreground/50 text-lg font-semibold mt-6",
    sectionTitleMain: "text-primary border-primary font-semibold",
    skillItem: "bg-accent-foreground/20 text-accent-foreground px-2 py-1 rounded",
  };

  return (
    <div className={`bg-background shadow-lg rounded-md font-sans text-gray-800 flex ${templateStyles.container}`}>
      {/* Sidebar */}
      <aside className={templateStyles.sidebar}>
        <Image 
            src="https://picsum.photos/seed/creative-profile/150/150"
            alt="Profile Picture"
            data-ai-hint="abstract creative"
            width={120}
            height={120}
            className={templateStyles.profileImage}
        />
        <h1 className={templateStyles.name}>{data.personalInfo.fullName || "Your Name"}</h1>
        <p className={templateStyles.jobTitle}>{data.personalInfo.jobTitle || "Your Job Title"}</p>
        
        <div className={templateStyles.contactInfoContainer}>
            {data.personalInfo.email && <div className={templateStyles.contactItem}><Icons.user className="h-4 w-4"/><span>{data.personalInfo.email}</span></div>}
            {data.personalInfo.phoneNumber && <div className={templateStyles.contactItem}><Icons.briefcase className="h-4 w-4"/><span>{data.personalInfo.phoneNumber}</span></div>}
            {/* Add more contact items with icons */}
        </div>
        
        {data.skills && (
            <TemplateSection title="Expertise" className="mt-6" titleClassName={templateStyles.sectionTitleSidebar} contentClassName="mt-2">
              <SkillsList skills={data.skills} skillItemClassName={templateStyles.skillItem} />
            </TemplateSection>
        )}
      </aside>

      {/* Main Content */}
      <main className={templateStyles.mainContent}>
        {data.summary && (
          <TemplateSection title="About Me" titleClassName={templateStyles.sectionTitleMain}>
            <p className="text-sm whitespace-pre-line">{data.summary}</p>
          </TemplateSection>
        )}
        {data.workExperience.length > 0 && (
          <TemplateSection title="Experience" titleClassName={templateStyles.sectionTitleMain}>
            {data.workExperience.map(exp => <WorkExperienceItem key={exp.id} exp={exp} />)}
          </TemplateSection>
        )}
        {data.education.length > 0 && (
          <TemplateSection title="Education" titleClassName={templateStyles.sectionTitleMain}>
            {data.education.map(edu => <EducationItem key={edu.id} edu={edu} />)}
          </TemplateSection>
        )}
      </main>
    </div>
  );
};

export default CreativeTemplate;
