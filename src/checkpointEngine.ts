export type CheckpointAnswer = string | string[];
type QuestionBase = { id: string; title: string; prompt: string; skill: string; hint: string; explanation: string; code?: string };
export type CheckpointQuestion = QuestionBase & (
  { type: 'single' | 'multiple'; options: { id: string; text: string }[]; correctOptionIds: string[] }
  | { type: 'short'; acceptedAnswers: string[]; inputHint: string; normalization: 'number' | 'binary' | 'text' }
);
export type CheckpointConfig = {
  version: 1; scope: string; passCount: number; practiceMinutes: number;
  variants: { id: string; questions: CheckpointQuestion[] }[];
  practice: CheckpointQuestion[];
  nextChapter?: { scope: string; title: string; number: string; code: string };
};
export type CheckpointProgress = {
  version: 1; stage: 'ready' | 'testing' | 'practice' | 'passed'; attempt: number;
  answers: Record<string, CheckpointAnswer>; practiceUntil: number | null;
};
export const freshProgress = (): CheckpointProgress => ({ version: 1, stage: 'ready', attempt: 0, answers: {}, practiceUntil: null });
export function questionsFor(config: CheckpointConfig, attempt: number) {
  return config.variants[attempt % config.variants.length].questions;
}
function normalize(value: string, rule: 'number' | 'binary' | 'text'): string | null {
  const clean = value.trim().replaceAll('−', '-');
  if (rule === 'binary') {
    const bits = clean.replace(/\s+/g, '');
    return /^[01]+$/.test(bits) ? bits : null;
  }
  if (rule === 'number') {
    const decimal = clean.replace(',', '.');
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(decimal)) return null;
    const number = Number(decimal);
    return Number.isFinite(number) ? String(number) : null;
  }
  return clean.toLocaleLowerCase('de-DE').replace(/\s+/g, ' ');
}
export function isAnswered(question: CheckpointQuestion, answer?: CheckpointAnswer) {
  if (question.type === 'short') return typeof answer === 'string' && answer.trim().length > 0;
  return Array.isArray(answer) && answer.length > 0;
}
export function isCorrect(question: CheckpointQuestion, answer?: CheckpointAnswer) {
  if (!isAnswered(question, answer)) return false;
  if (question.type === 'short') {
    const actual = normalize(answer as string, question.normalization);
    return actual !== null && question.acceptedAnswers.some(expected => normalize(expected, question.normalization) === actual);
  }
  if (!Array.isArray(answer) || new Set(answer).size !== answer.length) return false;
  const actual = [...answer].sort();
  const expected = [...question.correctOptionIds].sort();
  return actual.length === expected.length && actual.every((id, i) => id === expected[i]);
}
export function grade(questions: CheckpointQuestion[], answers: Record<string, CheckpointAnswer>) {
  const items = questions.map(question => ({ question, correct: isCorrect(question, answers[question.id]) }));
  return { score: items.filter(item => item.correct).length, complete: questions.every(question => isAnswered(question, answers[question.id])), items };
}
export function submitAttempt(config: CheckpointConfig, progress: CheckpointProgress, now: number): CheckpointProgress {
  if (progress.stage !== 'testing') return progress;
  const result = grade(questionsFor(config, progress.attempt), progress.answers);
  if (!result.complete) return progress;
  return result.score >= config.passCount
    ? { ...progress, stage: 'passed', practiceUntil: null }
    : { ...progress, stage: 'practice', practiceUntil: now + config.practiceMinutes * 60_000 };
}
export function canRetry(progress: CheckpointProgress, now: number) {
  return progress.stage === 'practice' && progress.practiceUntil !== null && now >= progress.practiceUntil;
}
export function retryAttempt(progress: CheckpointProgress, now: number): CheckpointProgress {
  return canRetry(progress, now)
    ? { ...freshProgress(), stage: 'testing', attempt: progress.attempt + 1 }
    : progress;
}
export function progressKey(config: CheckpointConfig) {
  // A content change starts a new check. Codes are never written to browser storage.
  const data = JSON.stringify({ variants: config.variants, passCount: config.passCount, practiceMinutes: config.practiceMinutes });
  let hash = 2166136261;
  for (const char of data) hash = Math.imul(hash ^ char.charCodeAt(0), 16777619);
  return `lernlabor-abschlusscheck-v1:${config.scope}:${(hash >>> 0).toString(16)}`;
}
export function restoreProgress(config: CheckpointConfig, raw: string | null): CheckpointProgress {
  if (!raw) return freshProgress();
  try {
    const value = JSON.parse(raw) as CheckpointProgress;
    if (value.version !== 1 || !['ready', 'testing', 'practice', 'passed'].includes(value.stage)
      || !Number.isSafeInteger(value.attempt) || value.attempt < 0 || !value.answers || typeof value.answers !== 'object' || Array.isArray(value.answers)) return freshProgress();
    const questions = questionsFor(config, value.attempt);
    const answers: Record<string, CheckpointAnswer> = {};
    for (const question of questions) {
      const answer = value.answers[question.id];
      if (question.type === 'short') {
        if (typeof answer === 'string' && answer.length <= 300) answers[question.id] = answer;
      } else if (Array.isArray(answer) && answer.every(id => typeof id === 'string' && question.options.some(option => option.id === id))
        && new Set(answer).size === answer.length && (question.type === 'multiple' || answer.length <= 1)) answers[question.id] = answer;
    }
    const restored = { ...value, answers };
    const result = grade(questions, answers);
    if (value.stage === 'passed' && (!result.complete || result.score < config.passCount)) return freshProgress();
    if (value.stage === 'practice' && (!result.complete || result.score >= config.passCount
      || typeof value.practiceUntil !== 'number' || !Number.isFinite(value.practiceUntil) || value.practiceUntil <= 0)) return freshProgress();
    return { ...restored, practiceUntil: value.stage === 'practice' ? value.practiceUntil : null };
  } catch { return freshProgress(); }
}
