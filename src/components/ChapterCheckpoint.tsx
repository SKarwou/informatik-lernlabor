import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react';
import Link from '../Link';
import { isTeacherPreview } from '../teacherPreview';
import { canRetry, freshProgress, grade, isAnswered, isCorrect, progressKey, questionsFor, restoreProgress, retryAttempt, submitAttempt,
  type CheckpointAnswer, type CheckpointConfig, type CheckpointProgress, type CheckpointQuestion } from '../checkpointEngine';
import './ChapterCheckpoint.css';

function readProgress(config: CheckpointConfig, key: string) {
  try { return restoreProgress(config, localStorage.getItem(key)); } catch { return freshProgress(); }
}
function AnswerField({ question, answer, onChange, id }: { question: CheckpointQuestion; answer?: CheckpointAnswer; onChange: (answer: CheckpointAnswer) => void; id: string }) {
  if (question.type === 'short') return <div className="checkpointInput">
    <label htmlFor={id}>Deine Antwort</label><input id={id} type="text" maxLength={300} autoComplete="off" spellCheck={false}
      value={typeof answer === 'string' ? answer : ''} onChange={event => onChange(event.target.value)} aria-describedby={`${id}-format`} />
    <small id={`${id}-format`}>{question.inputHint}</small>
  </div>;
  const chosen = Array.isArray(answer) ? answer : [];
  return <div className="checkpointOptions">
    <p>{question.type === 'single' ? 'Wähle genau eine Antwort.' : 'Mehrere Antworten können stimmen. Wähle alle richtigen.'}</p>
    {question.options.map(option => <label key={option.id}>
      <input type={question.type === 'single' ? 'radio' : 'checkbox'} name={id} checked={chosen.includes(option.id)}
        onChange={event => onChange(question.type === 'single' ? [option.id] : event.target.checked ? [...chosen, option.id] : chosen.filter(item => item !== option.id))} />
      <span>{option.text}</span>
    </label>)}
  </div>;
}
function PracticeQuestion({ question, number }: { question: CheckpointQuestion; number: number }) {
  const id = useId();
  const [answer, setAnswer] = useState<CheckpointAnswer>('');
  const [checked, setChecked] = useState(false);
  const correct = checked && isCorrect(question, answer);
  return <article className="checkpointPracticeQuestion">
    <h4>Übung {number}: {question.title}</h4><p>{question.prompt}</p>{question.code && <pre><code>{question.code}</code></pre>}
    <details><summary>Hinweis zum Lösungsweg</summary><p>{question.hint}</p></details>
    <AnswerField question={question} answer={answer} id={id} onChange={value => { setAnswer(value); setChecked(false); }} />
    <button type="button" className="secondaryButton" disabled={!isAnswered(question, answer)} onClick={() => setChecked(true)}>Übungsantwort prüfen</button>
    <div aria-live="polite">{checked && <div className={`checkpointFeedback ${correct ? 'isCorrect' : ''}`}><strong>{correct ? 'Richtig!' : 'Prüfe deinen Rechen- oder Entscheidungsweg.'}</strong><p>{question.explanation}</p></div>}</div>
  </article>;
}
export default function ChapterCheckpoint({ config }: { config: CheckpointConfig }) {
  const id = useId();
  const key = useMemo(() => progressKey(config), [config]);
  const [progress, setProgress] = useState<CheckpointProgress>(() => readProgress(config, key));
  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousStage = useRef(progress.stage);
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [now, setNow] = useState(Date.now);
  const [copied, setCopied] = useState(false);
  const [formError, setFormError] = useState('');
  const questions = questionsFor(config, progress.attempt);
  const result = grade(questions, progress.answers);
  const answered = questions.filter(question => isAnswered(question, progress.answers[question.id])).length;
  const remaining = Math.max(0, Math.ceil(((progress.practiceUntil || now) - now) / 1000));
  const time = `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, '0')}`;
  const needsPractice = [...new Set(result.items.filter(item => !item.correct).map(item => item.question.skill))];
  const exercises = [...config.practice].sort((a, b) => Number(needsPractice.includes(b.skill)) - Number(needsPractice.includes(a.skill)));
  useEffect(() => {
    if (previousStage.current === progress.stage) return;
    previousStage.current = progress.stage;
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.scrollIntoView({ block: 'start' });
  }, [progress.stage]);
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(progress)); setStorageAvailable(true); } catch { setStorageAvailable(false); }
  }, [key, progress]);
  useEffect(() => {
    const refresh = (event: StorageEvent) => { if (event.key === key) setProgress(readProgress(config, key)); };
    window.addEventListener('storage', refresh);
    return () => window.removeEventListener('storage', refresh);
  }, [config, key]);
  useEffect(() => {
    if (progress.stage !== 'practice') return;
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    const update = () => setNow(Date.now());
    document.addEventListener('visibilitychange', update);
    return () => { window.clearInterval(timer); document.removeEventListener('visibilitychange', update); };
  }, [progress.stage, progress.practiceUntil]);
  function submit(event: FormEvent) {
    event.preventDefault();
    if (!result.complete) { setFormError('Bitte bearbeite zuerst alle zehn Aufgaben.'); return; }
    setFormError(''); setNow(Date.now());
    setProgress(current => submitAttempt(config, current, Date.now()));
  }
  async function copyCode() {
    if (!config.nextChapter) return;
    try { await navigator.clipboard.writeText(config.nextChapter.code); setCopied(true); }
    catch { setCopied(false); }
  }
  return <section className="chapterCheckpoint" id="abschlusscheck" aria-labelledby={`${id}-title`}>
    <span className="eyebrow">DEIN KAPITELABSCHLUSS</span><h2 ref={headingRef} tabIndex={-1} id={`${id}-title`}>Zehn Aufgaben. Dein nächster Schritt.</h2>
    <p>Bearbeite alle zehn Aufgaben selbstständig. Rechne bei Bedarf im Heft und trage dein Ergebnis ein. Mit mindestens <strong>{config.passCount} von 10 richtigen Aufgaben</strong> hast du bestanden. Bei Mehrfachauswahl zählt eine Aufgabe, wenn du genau alle richtigen Antworten auswählst.</p>
    <p>Falls du noch unter {config.passCount} Punkten liegst, bekommst du Rückmeldungen und <strong>{config.practiceMinutes} Minuten Übungszeit</strong>. Danach kannst du eine andere Testvariante bearbeiten.</p>
    <p className="checkpointStorage">Dein Teststand und die Übungszeit werden nur in diesem Browser auf diesem Gerät gespeichert. {config.nextChapter ? 'Notiere den erreichten Kapitelcode für die nächste Stunde.' : 'Dies ist der Abschlusscheck zum letzten Lernkapitel.'}</p>
    {isTeacherPreview && progress.stage !== 'ready' && <button className="secondaryButton checkpointPreview" type="button" onClick={() => { setProgress(freshProgress()); setCopied(false); setFormError(''); }}>Nur lokale Vorschau: Abschlusscheck zurücksetzen</button>}
    {!storageAvailable && <p role="status" className="checkpointNotice">Dieser Browser kann den Teststand gerade nicht speichern. Lass die Seite während der Übungszeit geöffnet und notiere einen erreichten Code.</p>}
    {progress.stage === 'ready' && <div className="checkpointStart"><p>Plane ausreichend Zeit ein. Die Auswertung erscheint, wenn du alle zehn Aufgaben abgegeben hast.</p><button className="primaryButton" type="button" onClick={() => setProgress({ ...freshProgress(), stage: 'testing' })}>Abschlusscheck starten</button></div>}
    {progress.stage === 'testing' && <form onSubmit={submit}>
      <div className="checkpointProgress" role="status">Versuch {progress.attempt + 1} · {answered} von 10 Aufgaben bearbeitet</div>
      {questions.map((question, i) => <fieldset className="checkpointQuestion" key={question.id}>
        <legend>Aufgabe {i + 1}: {question.title}</legend><p>{question.prompt}</p>{question.code && <pre><code>{question.code}</code></pre>}
        <AnswerField question={question} answer={progress.answers[question.id]} id={`${id}-${question.id}`} onChange={answer => setProgress(current => ({ ...current, answers: { ...current.answers, [question.id]: answer } }))} />
      </fieldset>)}
      {formError && <p role="alert">{formError}</p>}
      <button className="primaryButton" type="submit" disabled={!result.complete}>Alle zehn Antworten abgeben</button>
    </form>}
    {(progress.stage === 'practice' || progress.stage === 'passed') && <>
      <div className={`checkpointResult ${progress.stage === 'passed' ? 'hasPassed' : ''}`} role="status"><h3>{result.score} von 10 Punkten</h3><p>{progress.stage === 'passed' ? 'Bestanden – du kannst weiterlernen.' : 'Du hast einen ersten Stand. Jetzt arbeitest du an den Stellen, die noch unsicher sind.'}</p></div>
      {progress.stage === 'passed' && <div className="checkpointReward">
        {config.nextChapter ? <><h3>Dein Code für {config.nextChapter.number} · {config.nextChapter.title}</h3><output aria-label={`Kapitelcode für ${config.nextChapter.title}`}>{config.nextChapter.code}</output><p>Schreibe diesen Code jetzt ins Heft. Beim nächsten Kapitel und in der nächsten Stunde gibst du ihn selbst ein. Die Lösungscodes erhältst du weiterhin von deiner Lehrkraft.</p><button type="button" className="secondaryButton" onClick={copyCode}>{copied ? 'Code kopiert' : 'Code kopieren'}</button><Link className="textButton" href={`/module/${config.nextChapter.scope}`}>Zum nächsten Kapitel →</Link></>
          : <><h3>Du hast das letzte Lernkapitel abgeschlossen.</h3><p>Besprich deinen nächsten Arbeitsauftrag mit der Lehrkraft. Die Projektphasen haben weiterhin eigene Freigaben.</p><Link href="/projekte" className="textButton">Zu den Projektphasen →</Link></>}
      </div>}
      <details className="checkpointReview"><summary>Deine zehn Antworten nachvollziehen</summary><ol>{result.items.map(item => <li key={item.question.id}><strong>{item.correct ? '✓' : '↻'} {item.question.title}</strong><p>{item.question.explanation}</p></li>)}</ol></details>
    </>}
    {progress.stage === 'practice' && <div className="checkpointPractice">
      <h3>Deine Übungsphase</h3><p>Wiederhole besonders: <strong>{needsPractice.join(' · ')}</strong>. Löse die Übungen, nutze bei Bedarf einen Hinweis und verbessere deinen Weg mithilfe der Rückmeldung.</p>
      <div className="checkpointTimer"><strong>{remaining ? 'Noch Übungszeit: ' : 'Die Übungszeit ist vorbei.'}</strong>{remaining > 0 && <span role="timer" aria-label="Verbleibende Übungszeit">{time}</span>}</div>
      {exercises.map((question, i) => <PracticeQuestion key={`${progress.attempt}-${question.id}`} question={question} number={i + 1} />)}
      <button className="primaryButton" type="button" disabled={!canRetry(progress, now)} onClick={() => { setFormError(''); setProgress(current => retryAttempt(current, Date.now())); }}>Neue Testvariante starten</button>
      {isTeacherPreview && <button className="secondaryButton checkpointPreview" type="button" onClick={() => setProgress(current => ({ ...current, practiceUntil: Date.now() - 1 }))}>Nur lokale Vorschau: Übungszeit überspringen</button>}
    </div>}
  </section>;
}
