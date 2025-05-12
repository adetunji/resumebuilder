'use server';

/**
 * @fileOverview An AI agent for enhancing resume writing, specifically the work experience section.
 *
 * - enhanceResumeWorkExperience - A function that enhances the wording in the resume's work experience section.
 * - EnhanceResumeWorkExperienceInput - The input type for the enhanceResumeWorkExperience function.
 * - EnhanceResumeWorkExperienceOutput - The return type for the enhanceResumeWorkExperience function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceResumeWorkExperienceInputSchema = z.object({
  workExperience: z
    .string()
    .describe('The work experience section of the resume to be enhanced.'),
});
export type EnhanceResumeWorkExperienceInput = z.infer<
  typeof EnhanceResumeWorkExperienceInputSchema
>;

const EnhanceResumeWorkExperienceOutputSchema = z.object({
  enhancedWorkExperience: z
    .string()
    .describe('The enhanced work experience section of the resume.'),
});
export type EnhanceResumeWorkExperienceOutput = z.infer<
  typeof EnhanceResumeWorkExperienceOutputSchema
>;

export async function enhanceResumeWorkExperience(
  input: EnhanceResumeWorkExperienceInput
): Promise<EnhanceResumeWorkExperienceOutput> {
  return enhanceResumeWorkExperienceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enhanceResumeWorkExperiencePrompt',
  input: {schema: EnhanceResumeWorkExperienceInputSchema},
  output: {schema: EnhanceResumeWorkExperienceOutputSchema},
  prompt: `You are an expert resume writer. Refine the wording in the work experience section of the resume below to be clear, concise, and impactful. Focus on highlighting accomplishments and quantifiable results wherever possible.\n\nWork Experience:\n{{{workExperience}}}`,
});

const enhanceResumeWorkExperienceFlow = ai.defineFlow(
  {
    name: 'enhanceResumeWorkExperienceFlow',
    inputSchema: EnhanceResumeWorkExperienceInputSchema,
    outputSchema: EnhanceResumeWorkExperienceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
