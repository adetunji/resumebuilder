// src/ai/flows/enhance-resume-summary.ts
'use server';
/**
 * @fileOverview An AI agent to enhance a resume's summary/objective.
 *
 * - enhanceResumeSummary - A function that enhances the resume summary.
 * - EnhanceResumeSummaryInput - The input type for the enhanceResumeSummary function.
 * - EnhanceResumeSummaryOutput - The return type for the enhanceResumeSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceResumeSummaryInputSchema = z.object({
  summary: z.string().describe('The current summary/objective of the resume.'),
  jobDescription: z.string().describe('The job description for the desired role.'),
  skills: z.string().describe('A comma-separated list of skills.'),
  experience: z.string().describe('A brief description of the candidate\'s experience.'),
});
export type EnhanceResumeSummaryInput = z.infer<typeof EnhanceResumeSummaryInputSchema>;

const EnhanceResumeSummaryOutputSchema = z.object({
  enhancedSummary: z.string().describe('The enhanced summary/objective for the resume.'),
});
export type EnhanceResumeSummaryOutput = z.infer<typeof EnhanceResumeSummaryOutputSchema>;

export async function enhanceResumeSummary(input: EnhanceResumeSummaryInput): Promise<EnhanceResumeSummaryOutput> {
  return enhanceResumeSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enhanceResumeSummaryPrompt',
  input: {schema: EnhanceResumeSummaryInputSchema},
  output: {schema: EnhanceResumeSummaryOutputSchema},
  prompt: `You are an expert resume writer specializing in crafting compelling summaries/objectives.

  Given the following information, enhance the resume's summary/objective to grab the reader's attention and highlight key qualifications.

  Current Summary/Objective: {{{summary}}}
  Job Description: {{{jobDescription}}}
  Skills: {{{skills}}}
  Experience: {{{experience}}}

  Enhanced Summary/Objective:
  `,
});

const enhanceResumeSummaryFlow = ai.defineFlow(
  {
    name: 'enhanceResumeSummaryFlow',
    inputSchema: EnhanceResumeSummaryInputSchema,
    outputSchema: EnhanceResumeSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
