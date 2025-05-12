
import type React from 'react';
import type { ResumeData } from '@/lib/types';
import { ContactInfo, renderCommonSections } from './base-template-components';

interface ClassicTemplateProps {
  data: ResumeData;
}

const ClassicTemplate: React.FC<ClassicTemplateProps> = ({ data }) => {
  const templateStyles = {
    header: "text-center py-4 border-b-2 border-gray-400", // Darker border
    name: "text-4xl font-serif font-bold text-gray-800", // Specific text color
    jobTitle: "text-xl text-gray-600 font-serif", // Specific text color
    contactInfo: "mt-1 justify-center text-gray-700", // Specific text color
    sectionTitle: "text-gray-700 font-serif border-gray-500 uppercase text-lg tracking-wide", // Different title style
  };
  
  return (
    <div className="p-2 bg-white shadow-md rounded-md font-serif text-gray-700"> {/* Specific colors and font */}
      {/* Header Section */}
      <header className={templateStyles.header}>
        <h1 className={templateStyles.name}>{data.personalInfo.fullName || "Your Name"}</h1>
        <p className={templateStyles.jobTitle}>{data.personalInfo.jobTitle || "Your Job Title"}</p>
        <ContactInfo personalInfo={data.personalInfo} className={templateStyles.contactInfo} />
      </header>

      {/* Main Content */}
      <div className="px-2 py-4 md:px-6 md:py-4">
        {renderCommonSections(data, templateStyles)}
      </div>
    </div>
  );
};

export default ClassicTemplate;
