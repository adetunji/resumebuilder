"use client";

import React, { useState, type FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { suggestKeywordPlacement, type SuggestKeywordPlacementInput, type SuggestKeywordPlacementOutput } from "@/ai/flows/suggest-keyword-placement";
import { Loader2, Download, FileText, Briefcase, Tags, Lightbulb, Search, AlertTriangle, CheckCircle, FilePenLine, Target } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

type KeywordSuggestion = SuggestKeywordPlacementOutput["suggestions"][0];

interface AnalysisResult {
  matchedKeywords: string[];
  missingKeywords: string[];
  aiSuggestions: KeywordSuggestion[];
  matchScore: number;
}

const STOP_WORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been", "being", "to", "of", "and", "in", "for", "on", "with", "as", "by", "at", "this", "that", "these", "those", "i", "you", "he", "she", "it", "we", "they", "me", "him", "her", "us", "them", "my", "your", "his", "its", "our", "their", "mine", "yours", "hers", "ours", "theirs", "myself", "yourself", "himself", "herself", "itself", "ourselves", "themselves", "am", "has", "have", "had", "do", "does", "did", "will", "would", "should", "can", "could", "may", "might", "must", "from", "up", "down", "out", "over", "under", "again", "further", "then", "once", "here", "there", "when", "where", "why", "how", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor", "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "just", "don", "shouldve", "now", "d", "ll", "m", "o", "re", "ve", "y", "ain", "aren", "couldn", "didn", "doesn", "hadn", "hasn", "haven", "isn", "ma", "mightn", "mustn", "needn", "shan", "shouldn", "wasn", "weren", "won", "wouldn", "etc", "e.g.", "i.e."
]);

function extractKeywords(text: string): string[] {
  if (!text) return [];
  const words = text
    .toLowerCase()
    .replace(/(\r\n|\n|\r)/gm, " ") // Normalize line breaks
    // Allow '.', '#', '+' within words, handle specific hyphen/apostrophe cases
    .replace(/[^\w\s'.#+-]|('_)|(_')|(\s-\s)|(-\s)|(\s-)/g, " ") 
    .split(/\s+/)
    .map(word => word.replace(/^['"-]+|['"-]+$/g, "").trim()) // Trim leading/trailing quotes/hyphens
    // Filter: length >= 2, not a stop word, not a pure number, not a simple float
    .filter(word => word.length >= 2 && !STOP_WORDS.has(word) && isNaN(Number(word)) && !/^\d+$/.test(word) && !/^-?\d*\.?\d+$/.test(word) );
  return Array.from(new Set(words.filter(Boolean)));
}

const HighlightedContent = React.memo(({ text, keywordsToHighlight, highlightLogic }: { text: string, keywordsToHighlight: string[], highlightLogic: (keyword: string) => string }) => {
  if (!text || !keywordsToHighlight || keywordsToHighlight.length === 0) {
    return <>{text}</>;
  }
  const uniqueLowercaseKeywords = Array.from(new Set(keywordsToHighlight.map(k => k.toLowerCase())));
  
  if (uniqueLowercaseKeywords.length === 0) return <>{text}</>;

  const regexParts = uniqueLowercaseKeywords.map(keyword => 
    keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') // Escape regex special characters
  );
  const regex = new RegExp(`\\b(${regexParts.join('|')})\\b`, 'gi');
  
  const parts = text.split(regex);
  
  return (
    <>
      {parts.map((part, index) => {
        const lowerPart = part.toLowerCase();
        if (uniqueLowercaseKeywords.includes(lowerPart)) {
          const highlightClass = highlightLogic(part); 
          return <mark key={index} className={`px-1 py-0.5 rounded ${highlightClass}`}>{part}</mark>;
        }
        return <React.Fragment key={index}>{part}</React.Fragment>;
      })}
    </>
  );
});
HighlightedContent.displayName = 'HighlightedContent';


export default function OptimizerForm() {
  const [resumeText, setResumeText] = useState<string>("");
  const [editableResumeText, setEditableResumeText] = useState<string>("");
  const [jobDescriptionText, setJobDescriptionText] = useState<string>("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (analysisResult) {
        setEditableResumeText(resumeText);
    }
  }, [analysisResult, resumeText]);


  const handleAnalyze = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!resumeText.trim()) {
      setError("Resume content cannot be empty.");
      toast({ title: "Input Error", description: "Resume content cannot be empty.", variant: "destructive" });
      return;
    }
    if (!jobDescriptionText.trim()) {
      setError("Job description content cannot be empty.");
      toast({ title: "Input Error", description: "Job description content cannot be empty.", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      const baseResumeForAnalysis = editableResumeText || resumeText;
      const currentResumeKeywords = extractKeywords(baseResumeForAnalysis);
      const jobKeywords = extractKeywords(jobDescriptionText);

      const matchedKeywords = jobKeywords.filter(k => currentResumeKeywords.includes(k.toLowerCase())); 
      const missingKeywords = jobKeywords.filter(k => !currentResumeKeywords.includes(k.toLowerCase()));
      
      const matchScore = jobKeywords.length > 0 ? (matchedKeywords.length / jobKeywords.length) * 100 : 0;

      let aiSuggestions: KeywordSuggestion[] = [];

      if (missingKeywords.length > 0) {
        const input: SuggestKeywordPlacementInput = {
          resume: baseResumeForAnalysis,
          jobDescription: jobDescriptionText,
          missingKeywords: missingKeywords,
        };
        const output = await suggestKeywordPlacement(input);
        aiSuggestions = output.suggestions;
      }
      
      setAnalysisResult({
        matchedKeywords,
        missingKeywords,
        aiSuggestions,
        matchScore,
      });
      if (!editableResumeText && resumeText) { 
        setEditableResumeText(resumeText);
      }
      toast({ title: "Analysis Complete", description: "Resume analysis finished successfully.", variant: "default" });

    } catch (err) {
      console.error("Analysis error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during analysis.";
      setError(errorMessage);
      toast({ title: "Analysis Failed", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!editableResumeText) {
      toast({ title: "Error", description: "No resume content to download.", variant: "destructive" });
      return;
    }
    const blob = new Blob([editableResumeText], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "optimized_resume.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Success", description: "Resume downloaded as optimized_resume.txt" });
  };
  

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-primary">ATS Resume Optimizer</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Enhance your resume with targeted keywords and AI-powered suggestions.
        </p>
      </header>

      <form onSubmit={handleAnalyze} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <FileText className="text-accent" /> Your Resume
              </CardTitle>
              <CardDescription>Paste your current resume content below. This will be the base for analysis.</CardDescription>
            </CardHeader>
            <CardContent>
              <Label htmlFor="resumeText" className="sr-only">Resume Content</Label>
              <Textarea
                id="resumeText"
                value={resumeText}
                onChange={(e) => {
                    setResumeText(e.target.value);
                    if (!analysisResult || editableResumeText === resumeText.slice(0, - (e.target.value.length - resumeText.length))) {
                        setEditableResumeText(e.target.value);
                    }
                }}
                placeholder="Paste your resume text here..."
                rows={15}
                className="resize-none border-input focus:border-accent focus:ring-accent rounded-md"
                disabled={isLoading}
              />
            </CardContent>
          </Card>

          <Card className="shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Briefcase className="text-accent" /> Job Description
              </CardTitle>
              <CardDescription>Paste the job description you're applying for.</CardDescription>
            </CardHeader>
            <CardContent>
              <Label htmlFor="jobDescriptionText" className="sr-only">Job Description Content</Label>
              <Textarea
                id="jobDescriptionText"
                value={jobDescriptionText}
                onChange={(e) => setJobDescriptionText(e.target.value)}
                placeholder="Paste the job description text here..."
                rows={15}
                className="resize-none border-input focus:border-accent focus:ring-accent rounded-md"
                disabled={isLoading}
              />
            </CardContent>
          </Card>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6 shadow-md rounded-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-center">
          <Button
            type="submit"
            disabled={isLoading || !resumeText.trim() || !jobDescriptionText.trim()}
            className="px-8 py-3 text-lg bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg shadow-md transition-transform transform hover:scale-105"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing...
              </>
            ) : (
              <>
                <Search className="mr-2 h-5 w-5" /> Analyze Resume
              </>
            )}
          </Button>
        </div>
      </form>

      {analysisResult && (
        <section id="analysis-results" className="mt-12 space-y-8">
          <Card className="shadow-xl rounded-xl">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                    <FilePenLine className="text-accent" /> Edit & Optimize Your Resume
                </CardTitle>
                <CardDescription>Refine your resume using the analysis below. Click "Analyze Resume" again to re-evaluate your changes.</CardDescription>
            </CardHeader>
            <CardContent>
                <Label htmlFor="editableResumeText" className="font-semibold mb-2 block">Editable Resume:</Label>
                <Textarea
                    id="editableResumeText"
                    value={editableResumeText}
                    onChange={(e) => setEditableResumeText(e.target.value)}
                    rows={20}
                    className="resize-none border-input focus:border-accent focus:ring-accent rounded-md mb-4"
                    placeholder="Your resume text will appear here for editing after the first analysis."
                />
                <CardDescription className="mb-2 text-sm">Preview with keyword highlights (matched are green, missing are orange):</CardDescription>
                 <ScrollArea className="h-72 w-full rounded-md border p-4 bg-muted/50">
                    <div className="text-sm text-foreground whitespace-pre-wrap">
                        <HighlightedContent 
                            text={editableResumeText} 
                            keywordsToHighlight={[...new Set([...analysisResult.matchedKeywords, ...analysisResult.missingKeywords])]} 
                            highlightLogic={(keyword) => { 
                                const lowerKeyword = keyword.toLowerCase();
                                if (analysisResult.matchedKeywords.some(mk => mk.toLowerCase() === lowerKeyword)) {
                                    return "bg-green-500/30 text-green-900 dark:text-green-200";
                                }
                                return "bg-orange-500/30 text-orange-900 dark:text-orange-200";
                            }}
                        />
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter>
                <Button onClick={handleDownload} variant="outline" className="border-accent text-accent hover:bg-accent/10 hover:text-accent rounded-md">
                    <Download className="mr-2 h-4 w-4" /> Download Updated Resume
                </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-lg rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Target className="text-accent h-6 w-6" /> Keyword Match Score
              </CardTitle>
              <CardDescription>Percentage of job description keywords found in your current resume.</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-5xl font-bold text-primary mb-3">{analysisResult.matchScore.toFixed(0)}%</p>
              <Progress value={analysisResult.matchScore} className="w-full h-4 rounded-full shadow-inner" />
              {analysisResult.matchScore < 70 && (
                <p className="text-sm text-orange-600 dark:text-orange-400 mt-3">
                  Aim for a score of 70% or higher for better ATS compatibility. Consider incorporating more missing keywords.
                </p>
              )}
              {analysisResult.matchScore >= 70 && analysisResult.matchScore < 90 && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-3">
                  Good job! This score indicates good ATS compatibility. You can still aim higher!
                </p>
              )}
              {analysisResult.matchScore >= 90 && (
                 <p className="text-sm text-green-700 dark:text-green-300 font-semibold mt-3">
                  Excellent! Your resume is highly aligned with the job description keywords.
                </p>
              )}
            </CardContent>
          </Card>
          
          <Separator className="my-10" />

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Tags className="text-accent" /> Keyword Analysis
                </CardTitle>
                <CardDescription>Keywords from the job description and their status in your (editable) resume.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-lg mb-2 flex items-center gap-1"><CheckCircle className="text-green-600 dark:text-green-400 h-5 w-5" />Matched Keywords ({analysisResult.matchedKeywords.length})</h4>
                  {analysisResult.matchedKeywords.length > 0 ? (
                    <ScrollArea className="h-40 rounded-md border p-3 bg-muted/30">
                        <div className="flex flex-wrap gap-2">
                        {analysisResult.matchedKeywords.map(keyword => (
                            <Badge key={keyword} variant="secondary" className="bg-green-100 dark:bg-green-800/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-600 text-sm px-3 py-1 rounded-md">{keyword}</Badge>
                        ))}
                        </div>
                    </ScrollArea>
                  ) : (
                    <p className="text-muted-foreground italic p-3 border rounded-md bg-muted/30">No keywords currently matched. Add keywords from the "Missing" list.</p>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2 flex items-center gap-1"><AlertTriangle className="text-orange-600 dark:text-orange-400 h-5 w-5" />Missing Keywords ({analysisResult.missingKeywords.length})</h4>
                   {analysisResult.missingKeywords.length > 0 ? (
                    <ScrollArea className="h-40 rounded-md border p-3 bg-muted/30">
                        <div className="flex flex-wrap gap-2">
                        {analysisResult.missingKeywords.map(keyword => (
                            <Badge key={keyword} variant="outline" className="border-orange-400 dark:border-orange-600 text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-800/30 text-sm px-3 py-1 rounded-md">{keyword}</Badge>
                        ))}
                        </div>
                    </ScrollArea>
                   ) : (
                    <p className="text-muted-foreground italic p-3 border rounded-md bg-muted/30">Great! All identified keywords from the job description appear to be in your resume.</p>
                   )}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Lightbulb className="text-accent" /> AI Keyword Suggestions
                </CardTitle>
                 <CardDescription>
                  {analysisResult.aiSuggestions.length > 0 
                    ? "AI suggestions for incorporating missing keywords naturally."
                    : "No missing keywords to provide suggestions for, or AI could not generate suggestions."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analysisResult.aiSuggestions.length > 0 ? (
                  <ScrollArea className="h-[23.5rem] rounded-md"> 
                    <div className="space-y-4">
                      {analysisResult.aiSuggestions.map((suggestion, index) => (
                        <Card key={index} className="bg-muted/50 p-4 rounded-lg shadow-sm border">
                           <div className="font-semibold text-md text-primary mb-1">
                            For keyword: <Badge variant="default" className="bg-accent text-accent-foreground text-sm px-2 py-0.5 rounded-md">{suggestion.keyword}</Badge>
                          </div>
                          <p className="text-sm text-foreground">{suggestion.placementSuggestion}</p>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="text-muted-foreground italic text-center py-10 p-3 border rounded-md bg-muted/30 h-[23.5rem] flex items-center justify-center">
                    <p>
                    {analysisResult.missingKeywords.length === 0 ? "Excellent! No missing keywords found." : "No AI suggestions available for the current set of missing keywords."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </div>
  );
}

