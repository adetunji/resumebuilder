
"use server";

import { enhanceResumeSummary, type EnhanceResumeSummaryInput } from "@/ai/flows/enhance-resume-summary";
import { enhanceResumeWorkExperience, type EnhanceResumeWorkExperienceInput } from "@/ai/flows/enhance-resume-writing";
import { enhanceResumeSkills, type EnhanceResumeSkillsInput } from "@/ai/flows/enhance-resume-skills";

export async function enhanceSummaryAction(input: EnhanceResumeSummaryInput) {
  try {
    const result = await enhanceResumeSummary(input);
    return { success: true, data: result.enhancedSummary };
  } catch (error) {
    console.error("Error enhancing summary:", error);
    return { success: false, error: "Failed to enhance summary. Please try again." };
  }
}

export async function enhanceWorkExperienceAction(input: EnhanceResumeWorkExperienceInput) {
  try {
    const result = await enhanceResumeWorkExperience(input);
    return { success: true, data: result.enhancedWorkExperience };
  } catch (error) {
    console.error("Error enhancing work experience:", error);
    return { success: false, error: "Failed to enhance work experience. Please try again." };
  }
}

export async function enhanceSkillsAction(input: EnhanceResumeSkillsInput) {
  try {
    const result = await enhanceResumeSkills(input);
    return { success: true, data: result.enhancedSkillsSection };
  } catch (error) {
    console.error("Error enhancing skills:", error);
    return { success: false, error: "Failed to enhance skills. Please try again." };
  }
}
