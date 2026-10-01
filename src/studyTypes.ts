export type StudyCell = { label: string; value: string; state?: 'active' | 'done' | 'neutral' };
export type StudyFrame = { title: string; text: string; cells: StudyCell[] };
export type StudyGuide = {
  why: string;
  prerequisites: { text: string; revisit?: { label: string; href: string } };
  goals: string[];
  route: { title: string; text: string }[];
  examples: { title: string; question: string; steps: { title: string; text: string; code?: string }[]; result: string }[];
  pitfalls: { mistaken: string; correction: string }[];
  visual: { title: string; intro: string; limitation: string; scenarios: { label: string; frames: StudyFrame[]; question: string; options: { text: string; correct: boolean; feedback: string }[] }[] };
  checks: { id: string; question: string; options: { text: string; correct: boolean; feedback: string }[]; retry: string }[];
  tasks: { id: string; level: 'Start' | 'Üben' | 'Transfer'; title: string; prompt: string; hints: string[] }[];
  readiness: string[];
};
