import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export interface SuggestKeywordPlacementInput {
  resume: string;
  jobDescription: string;
  missingKeywords: string[];
}

export interface SuggestKeywordPlacementOutput {
  suggestions: Array<{
    keyword: string;
    suggestion: string;
  }>;
}

export async function suggestKeywordPlacement(input: SuggestKeywordPlacementInput): Promise<SuggestKeywordPlacementOutput> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `You are an expert resume writer and ATS (Applicant Tracking System) specialist. Your task is to suggest natural, contextually appropriate placements for missing keywords in a resume.

Resume:
${input.resume}

Job Description:
${input.jobDescription}

Missing Keywords to Place:
${input.missingKeywords.join(", ")}

For each missing keyword, provide a specific, natural-sounding suggestion for how to incorporate it into the resume. Each suggestion should:
1. Be a complete sentence or phrase that could be added to the resume
2. Maintain a professional tone
3. Be contextually relevant to the job description
4. Sound natural and not forced
5. Be specific and actionable

Format your response as a JSON array of objects, where each object has:
- "keyword": the missing keyword
- "suggestion": your specific suggestion for incorporating it

Example format:
[
  {
    "keyword": "project management",
    "suggestion": "Led cross-functional teams in agile project management, delivering 3 major initiatives on time and under budget."
  }
]

Only respond with the JSON array, no other text.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON response
    const suggestions = JSON.parse(text) as SuggestKeywordPlacementOutput["suggestions"];
    
    return { suggestions };
  } catch (error) {
    console.error("Error generating keyword placement suggestions:", error);
    throw new Error("Failed to generate keyword placement suggestions. Please try again.");
  }
} 