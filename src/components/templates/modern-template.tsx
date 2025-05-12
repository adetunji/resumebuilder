
import type React from 'react';
import type { ResumeData } from '@/lib/types';
import { ContactInfo, renderCommonSections } from './base-template-components';

interface ModernTemplateProps {
  data: ResumeData;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ data }) => {
  const templateStyles = {
    header: "bg-primary text-primary-foreground p-6 rounded-t-md",
    name: "text-3xl font-bold",
    jobTitle: "text-lg text-primary-foreground/80 font-medium",
    contactInfo: "mt-2 text-primary-foreground/90",
    sectionTitle: "text-primary border-primary font-semibold", // Keep this for section titles in main content
    summarySection: "mt-6",
    // Add more specific style classes as needed
  };

  return (
    <div className="p-0 bg-white shadow-md rounded-md font-sans text-gray-800"> {/* Changed to white background, specific text color */}
      {/* Header Section */}
      <header className={templateStyles.header}>
        <h1 className={templateStyles.name}>{data.personalInfo.fullName || "Your Name"}</h1>
        <p className={templateStyles.jobTitle}>{data.personalInfo.jobTitle || "Your Job Title"}</p>
        <ContactInfo personalInfo={data.personalInfo} className={templateStyles.contactInfo} itemClassName="text-primary-foreground/90" />
      </header>

      {/* Main Content */}
      <div className="p-6">
        {renderCommonSections(data, templateStyles)}
      </div>
    </div>
  );
};

export default ModernTemplate;
