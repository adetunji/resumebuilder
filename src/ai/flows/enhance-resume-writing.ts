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
  async (input): Promise<EnhanceResumeWorkExperienceOutput> => {
    const result = await prompt(input); // result is GenerateResponse<EnhanceResumeWorkExperienceOutputSchema>
    const outputData = result.output;

    if (outputData) {
      // Ensure the expected field is present; Zod validation should catch this,
      // but an explicit check adds clarity if Zod somehow passes an incomplete object.
      if (typeof outputData.enhancedWorkExperience === 'string') {
        return outputData; // Success path
      }
    }

    // Handle cases where output is undefined or malformed
    const primaryCandidate = result.candidates?.[0];
    let specificError = 'AI failed to generate a valid enhancement. The output was empty or not in the expected format.';

    if (primaryCandidate) {
      if (primaryCandidate.finishReason === 'SAFETY') {
        specificError = `AI could not process the request due to safety reasons: ${primaryCandidate.finishMessage || 'Content policy violation.'}`;
      } else if (primaryCandidate.finishReason === 'MAX_TOKENS') {
        specificError = 'AI could not complete the enhancement because the maximum output length was reached.';
      } else if (primaryCandidate.finishReason === 'RECITATION') {
        specificError = `AI response was blocked due to recitation policy: ${primaryCandidate.finishMessage || 'Recitation policy violation.'}`;
      } else if (primaryCandidate.finishReason && primaryCandidate.finishReason !== 'STOP' && primaryCandidate.finishReason !== 'OTHER') {
        specificError = `AI stopped generating for reason: ${primaryCandidate.finishReason}. ${primaryCandidate.finishMessage || ''}`.trim();
      } else if (primaryCandidate.finishReason === 'OTHER') {
         specificError = 'AI encountered an unspecified model error.';
      }
    }
    
    console.error(`[${enhanceResumeWorkExperienceFlow.name}]: Error - ${specificError}`, { input, fullResult: result });
    throw new Error(specificError);
  }
);

