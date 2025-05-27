
"use client";

import type { TemplateId, TemplateOption } from "@/lib/types";
import { TEMPLATE_OPTIONS } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icons } from "@/components/icons";

interface TemplateSelectorProps {
  selectedTemplate: TemplateId;
  onTemplateChange: (templateId: TemplateId) => void;
}

export function TemplateSelector({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <Icons.templates className="h-5 w-5 text-muted-foreground" />
      <Select value={selectedTemplate} onValueChange={(value) => onTemplateChange(value as TemplateId)}>
        <SelectTrigger className="w-[180px] bg-card hover:bg-muted transition-colors">
          <SelectValue placeholder="Select Template" />
        </SelectTrigger>
        <SelectContent>
          {TEMPLATE_OPTIONS.map((template) => (
            <SelectItem key={template.id} value={template.id}>
              {template.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
