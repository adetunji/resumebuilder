'use server';
/**
 * @fileOverview An AI agent that suggests where to place missing keywords in a resume.
 *
 * - suggestKeywordPlacement - A function that suggests where to place keywords in a resume.
 * - SuggestKeywordPlacementInput - The input type for the suggestKeywordPlacement function.
 * - SuggestKeywordPlacementOutput - The return type for the suggestKeywordPlacement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestKeywordPlacementInputSchema = z.object({
  resume: z.string().describe('The text content of the resume.'),
  jobDescription: z.string().describe('The text content of the job description.'),
  missingKeywords: z.array(z.string()).describe('The keywords missing from the resume but present in the job description.'),
});
export type SuggestKeywordPlacementInput = z.infer<typeof SuggestKeywordPlacementInputSchema>;

// Strict schema for individual suggestions in the final output
const StrictSuggestionSchema = z.object({
  keyword: z.string().min(1).describe('The missing keyword.'),
  placementSuggestion: z.string().min(1).describe('A suggestion on where to place the keyword in the resume.'),
});

// Strict output schema for the flow
const SuggestKeywordPlacementOutputSchema = z.object({
  suggestions: z.array(StrictSuggestionSchema).describe('Suggestions for each missing keyword on where to place it in the resume.'),
});
export type SuggestKeywordPlacementOutput = z.infer<typeof SuggestKeywordPlacementOutputSchema>;


// Lenient schema for individual suggestions directly from the prompt
const LenientSuggestionSchema = z.object({
  keyword: z.string().optional(),
  placementSuggestion: z.string().optional(),
}).passthrough(); // Allows other fields and handles cases where fields might be missing

// Lenient output schema for the prompt's direct output
const LenientPromptOutputSchema = z.object({
  suggestions: z.array(LenientSuggestionSchema).optional(), // The suggestions array itself could be missing
}).passthrough();


export async function suggestKeywordPlacement(input: SuggestKeywordPlacementInput): Promise<SuggestKeywordPlacementOutput> {
  return suggestKeywordPlacementFlow(input);
}

const suggestKeywordPlacementPrompt = ai.definePrompt({
  name: 'suggestKeywordPlacementPrompt',
  input: {schema: SuggestKeywordPlacementInputSchema},
  output: {schema: LenientPromptOutputSchema}, // Use the lenient schema for prompt's direct output
  prompt: `You are an expert resume writer specializing in Applicant Tracking System (ATS) optimization.

  Given a resume, a job description, and a list of keywords missing from the resume, you will suggest where to place each keyword in the resume to improve its chances of getting past ATS.

  Resume:
  {{resume}}

  Job Description:
  {{jobDescription}}

  Missing Keywords:
  {{#each missingKeywords}}- {{{this}}}
  {{/each}}

  For each missing keyword, provide a specific and actionable suggestion on where to place it in the resume. Be as specific as possible, referencing sections or types of experience described in the resume.
  Ensure that the suggestions are tailored to the specific resume and job description provided.

  Format your response as a JSON object with a "suggestions" array. Each object in the array should have "keyword" and "placementSuggestion" fields. If you cannot provide a valid suggestion for a keyword, you may omit it from the array. Do not include objects with missing or empty 'keyword' or 'placementSuggestion' fields.
  `,
});

const suggestKeywordPlacementFlow = ai.defineFlow(
  {
    name: 'suggestKeywordPlacementFlow',
    inputSchema: SuggestKeywordPlacementInputSchema,
    outputSchema: SuggestKeywordPlacementOutputSchema, // Flow guarantees this strict schema
  },
  async (input: SuggestKeywordPlacementInput): Promise<SuggestKeywordPlacementOutput> => {
    const {output: lenientOutput} = await suggestKeywordPlacementPrompt(input);

    const validSuggestions: Array<{ keyword: string; placementSuggestion: string }> = [];

    if (lenientOutput && Array.isArray(lenientOutput.suggestions)) {
      for (const suggestion of lenientOutput.suggestions) {
        // Validate each suggestion: keyword and placementSuggestion must be non-empty strings
        if (suggestion &&
            typeof suggestion.keyword === 'string' && suggestion.keyword.trim() !== '' &&
            typeof suggestion.placementSuggestion === 'string' && suggestion.placementSuggestion.trim() !== '') {
          validSuggestions.push({
            keyword: suggestion.keyword,
            placementSuggestion: suggestion.placementSuggestion,
          });
        }
      }
    }
    // This return will be validated by Genkit against SuggestKeywordPlacementOutputSchema
    return { suggestions: validSuggestions };
  }
);