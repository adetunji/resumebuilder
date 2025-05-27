
import type React from 'react';
import type { ResumeData } from '@/lib/types';
import { TemplateSection, ContactInfo, renderCommonSections, SkillsList } from './base-template-components';

interface TechnicalTemplateProps {
  data: ResumeData;
}

const TechnicalTemplate: React.FC<TechnicalTemplateProps> = ({ data }) => {
  const templateStyles = {
    name: "text-2xl font-mono font-bold tracking-wider text-gray-800",
    jobTitle: "text-md font-mono text-gray-600",
    contactInfo: "font-mono text-xs justify-start mt-1 mb-4 text-gray-700",
    sectionTitle: "text-primary font-mono border-primary uppercase tracking-wider text-lg font-semibold",
    skillsSection: "mb-4", // Skills section specific styling
    skillsList: "mt-1",
    hideSkillsSection: "true", // Custom flag to hide skills from common rendering
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-md font-mono text-sm text-gray-700">
      {/* Header Section */}
      <header className="mb-4">
        <h1 className={templateStyles.name}>{data.personalInfo.fullName || "YOUR_NAME"}</h1>
        <p className={templateStyles.jobTitle}>{data.personalInfo.jobTitle || "YOUR_JOB_TITLE"}</p>
        <ContactInfo personalInfo={data.personalInfo} className={templateStyles.contactInfo} />
      </header>
      
      {/* Skills First for Technical Resumes */}
      {data.skills && (
        <TemplateSection title="Technical Proficiencies" iconName="lightbulb" className={templateStyles.skillsSection} titleClassName={templateStyles.sectionTitle}>
          <SkillsList skills={data.skills} className={templateStyles.skillsList}/>
        </TemplateSection>
      )}

      {/* Main Content */}
      <div className="space-y-3">
        {renderCommonSections(data, templateStyles, { summary: 'fileText', workExperience: 'briefcase', education: 'graduationCap' })}
      </div>
    </div>
  );
};

export default TechnicalTemplate;
