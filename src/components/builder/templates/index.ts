
import type React from 'react';
import type { ResumeData, TemplateId } from '@/lib/types';

import ModernTemplate from './modern-template';
import ClassicTemplate from './classic-template';
import CreativeTemplate from './creative-template';
import TechnicalTemplate from './technical-template';
import MinimalistTemplate from './minimalist-template';

export const templates: Record<TemplateId, React.FC<{ data: ResumeData }>> = {
  modern: ModernTemplate,
  classic: ClassicTemplate,
  creative: CreativeTemplate,
  technical: TechnicalTemplate,
  minimalist: MinimalistTemplate,
};
