export type LessonTable = { headers: string[]; rows: string[][]; caption?: string };
export type LessonSection = {
  id: string;
  title: string;
  paragraphs: string[];
  table?: LessonTable;
  steps?: string[];
  example?: { title: string; prompt: string; steps: string[]; result: string };
  remember?: string;
};
export type GuidedTask = {
  id: string;
  level: "Einstieg" | "Üben" | "Vertiefen";
  title: string;
  prompt: string;
  hints: string[];
};
export type BeginnerCourse = {
  slug: string;
  title: string;
  intro: string;
  prerequisites: string;
  goals: string[];
  sections: LessonSection[];
  tasks: GuidedTask[];
  glossary: { term: string; meaning: string }[];
};
export type SolutionEntry = { id: string; title: string; paragraphs: string[]; code?: string };
export type SolutionPayload = { version: 1; title: string; entries: SolutionEntry[] };
