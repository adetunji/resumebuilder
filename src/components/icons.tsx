import {
  User,
  Briefcase,
  GraduationCap,
  Lightbulb,
  FileText,
  Download,
  Wand2,
  Trash2,
  PlusCircle,
  type LucideProps,
  type LucideIcon,
  Settings2,
  Palette,
  LayoutGrid,
  Save
} from 'lucide-react';

export type Icon = LucideIcon;

export const Icons = {
  user: User,
  briefcase: Briefcase,
  graduationCap: GraduationCap,
  lightbulb: Lightbulb,
  fileText: FileText,
  download: Download,
  wand: Wand2,
  trash: Trash2,
  add: PlusCircle,
  settings: Settings2,
  palette: Palette,
  templates: LayoutGrid,
  save: Save,
};

interface SectionIconProps extends LucideProps {
  name: keyof typeof Icons;
}

export const SectionIcon: React.FC<SectionIconProps> = ({ name, ...props }) => {
  const IconComponent = Icons[name];
  if (!IconComponent) {
    return null; // Or a default icon
  }
  return <IconComponent {...props} />;
};
