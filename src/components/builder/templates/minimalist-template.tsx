
import type React from 'react';
import type { ResumeData } from '@/lib/types';
import { ContactInfo, renderCommonSections } from './base-template-components';

interface MinimalistTemplateProps {
  data: ResumeData;
}

const MinimalistTemplate: React.FC<MinimalistTemplateProps> = ({ data }) => {
  const templateStyles = {
    name: "text-3xl font-light text-gray-800",
    jobTitle: "text-lg text-gray-500 font-light",
    contactInfo: "text-xs mt-2 mb-6 text-gray-600 justify-start",
    sectionTitle: "text-gray-700 font-normal text-md mb-2 uppercase tracking-wider border-none pt-2", // No border, slightly more space
    contentClassName: "pl-0", // No indent for content
    workItem: "mb-3",
    eduItem: "mb-2",
    summarySection: "mb-4",
    skillsList: "mt-1",
    skillItem: "bg-gray-200 text-gray-700", // Muted skill item color
  };
  
  return (
    <div className="p-6 bg-white rounded-md font-sans text-gray-700"> {/* Base white background */}
      {/* Header Section */}
      <header className="mb-6">
        <h1 className={templateStyles.name}>{data.personalInfo.fullName || "Your Name"}</h1>
        <p className={templateStyles.jobTitle}>{data.personalInfo.jobTitle || "Your Job Title"}</p>
        <ContactInfo personalInfo={data.personalInfo} className={templateStyles.contactInfo} />
      </header>

      {/* Main Content */}
      <div className="space-y-4"> {/* Slightly reduced space */}
        {renderCommonSections(data, templateStyles)}
      </div>
    </div>
  );
};

export default MinimalistTemplate;
