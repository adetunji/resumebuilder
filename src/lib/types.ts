export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phoneNumber: string;
  address: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface WorkExperienceEntry {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface EducationEntry {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationDate: string;
  details?: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  workExperience: WorkExperienceEntry[];
  education: EducationEntry[];
  skills: string; // Store as a single string, can be comma-separated or newline-separated
}

export type TemplateId = 'modern' | 'classic' | 'creative' | 'technical' | 'minimalist';

export interface TemplateOption {
  id: TemplateId;
  name: string;
  previewImage: string; // URL for a preview image
}

export const TEMPLATE_OPTIONS: TemplateOption[] = [
  { id: 'modern', name: 'Modern', previewImage: 'https://picsum.photos/seed/modern/200/280' },
  { id: 'classic', name: 'Classic', previewImage: 'https://picsum.photos/seed/classic/200/280' },
  { id: 'creative', name: 'Creative', previewImage: 'https://picsum.photos/seed/creative/200/280' },
  { id: 'technical', name: 'Technical', previewImage: 'https://picsum.photos/seed/technical/200/280' },
  { id: 'minimalist', name: 'Minimalist', previewImage: 'https://picsum.photos/seed/minimalist/200/280' },
];
