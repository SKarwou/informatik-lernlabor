import { useEffect, useId, useMemo, useState } from 'react';
import Link from '../Link';
import type { StudyGuide } from '../studyTypes';
import { Solution } from './ProtectedContent';
import StructureTraceLab from './visuals/StructureTraceLab';
import './SelfStudyGuide.css';

const prerequisiteLinks: Record<string, { label: string; href: string }> = {
  'fehler-kompression': { label: 'Bits und Bytes auffrischen', href: '/module/zahlensysteme#bit' },
  sql: { label: 'Primär- und Fremdschlüssel auffrischen', href: '/module/datenbanken#db-person' },
  programmierung: { label: 'BlueJ-Oberfläche und erstes Programm kennenlernen', href: '/werkzeuge#bluej' },
  sortieren: { label: 'Variablen und Schleifen auffrischen', href: '/module/programmierung#theorie-programmierung-1' },
  oop: { label: 'Parameter und Rückgabe auffrischen', href: '/module/programmierung#beispiele-extra' },
  schaltnetze: { label: 'Binäraddition auffrischen', href: '/module/zahlensysteme#addition' },
  'moderne-kryptografie': { label: 'Schlüssel und Verschlüsselung auffrischen', href: '/module/klassische-kryptografie#lernstart' },
};
export function StudyStart({ guide, scope }: { guide: StudyGuide; scope: string }) {
  const revisit = guide.prerequisites.revisit || prerequisiteLinks[scope];
  return <section className="studyStart studyBlock" id="lernstart">
    <span className="eyebrow">VERSTEHEN STATT AUSWENDIG LERNEN</span>
    <h2>Warum lernen wir das?</h2><p className="studyWhy">{guide.why}</p>
    <div className="studyPrerequisite"><strong>Bevor du startest</strong><p>{guide.prerequisites.text}</p>{revisit && <Link href={revisit.href}>{revisit.label} →</Link>}</div>
    <h3>Dein Ziel für dieses Kapitel</h3><ul>{guide.goals.map(goal => <li key={goal}>{goal}</li>)}</ul>
    <details className="studyRoute"><summary>Dein Lernweg – auch wenn du noch unsicher bist</summary><ol>{guide.route.map(step => <li key={step.title}><strong>{step.title}</strong><p>{step.text}</p></li>)}</ol><p>Bearbeite nicht alles auf einmal. Halte nach einem Abschnitt an: Kannst du die Idee mit einem eigenen Beispiel erklären? Wenn nicht, nutze einen Hinweis und frage gezielt nach.</p></details>
    <details className="studyRoute" id="arbeitsweise"><summary>Gut organisiert: Dateien, Teamarbeit und fremder Code</summary><p>Die Lehrkraft zeigt euch zuerst die freigegebenen Speicherorte im Schulnetz. Unterscheidet euren eigenen Ordner vom Austauschordner. Speichert eine kleine Testdatei mit verständlichem Namen, öffnet sie erneut und prüft gemeinsam, wer sie lesen darf. Falls ihr druckt, kontrolliert vorher den ausgewählten Drucker. Veröffentlicht keine persönlichen Daten.</p><p>In Partnerarbeit: Legt fest, wer welchen Teil bearbeitet und welches Ergebnis der andere Teil erwartet. Sammelt vor dem Programmieren zwei Testfälle. Wechselt die Rollen regelmäßig: Eine Person bedient, die andere sagt das erwartete Ergebnis voraus. Jede Person muss den gemeinsamen Lösungsweg selbst erklären können.</p><p>Wenn ihr einen fremden Codebaustein nutzt, lest seine Erklärung und prüft, ob ihr ihn verwenden dürft. Notiert Quelle und angegebene Lizenz; übernehmt vorgeschriebene Hinweise. Fragt bei unklaren Nutzungsrechten nach. Ein Text im Internet ist nicht automatisch frei nutzbar. Testet den übernommenen Baustein mit kleinen eigenen Eingaben, bevor ihr ihn in euer Programm einbaut.</p></details>
    <nav className="studyJump" aria-label="Selbstlern-Hilfen"><a href="#beispiele-extra">Vorgemachte Beispiele ↓</a><a href="#selbstlern-schaubild">Ablauf zum Anklicken ↓</a><a href="#kurzcheck">Verständnis prüfen ↓</a><a href="#zusatztraining">Leichte Startaufgaben ↓</a></nav>
  </section>;
}

function ChoiceCheck({ question, options, retry }: { question: string; options: StudyGuide['checks'][number]['options']; retry?: string }) {
  const [selected, setSelected] = useState<number | null>(null);
  const id = useId();
  // Stable rotation: the correct choice is not always the first one, and
  // an answer never moves underneath the learner while they are reading.
  const ordered = useMemo(() => {
    const offset = [...question].reduce((sum, char) => sum + char.charCodeAt(0), 0) % options.length;
    return [...options.slice(offset), ...options.slice(0, offset)];
  }, [question, options]);
  const answer = selected === null ? null : ordered[selected];
  return <div className="studyCheck">
    <p id={id} className="studyQuestion">{question}</p>
    <div className="studyOptions" role="group" aria-labelledby={id}>{ordered.map((option, i) => <button type="button" key={option.text} aria-pressed={selected === i} onClick={() => setSelected(i)}><span aria-hidden="true">{String.fromCharCode(65 + i)}</span>{option.text}</button>)}</div>
    <div aria-live="polite" aria-atomic="true">{answer && <div className={`studyFeedback ${answer.correct ? 'isCorrect' : 'tryAgain'}`}><strong>{answer.correct ? '✓ Richtig begründet:' : '↻ Schau noch einmal genau hin:'}</strong><p>{answer.feedback}</p>{!answer.correct && retry && <p><strong>Deine Hilfe:</strong> {retry}</p>}</div>}</div>
    {answer && <button type="button" className="studySmallButton" onClick={() => setSelected(null)}>Antwort zurücksetzen</button>}
  </div>;
}

function TracePlayer({ visual }: { visual: StudyGuide['visual'] }) {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const scenario = visual.scenarios[scenarioIndex];
  const frame = scenario.frames[index];
  const last = index === scenario.frames.length - 1;
  useEffect(() => {
    const pause = () => setPlaying(false);
    const visibility = () => { if (document.hidden) pause(); };
    window.addEventListener('beforeprint', pause);
    document.addEventListener('visibilitychange', visibility);
    return () => {
      window.removeEventListener('beforeprint', pause);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);
  useEffect(() => {
    if (!playing) return;
    if (last) { setPlaying(false); return; }
    const timer = window.setTimeout(() => setIndex(i => i + 1), 3000);
    return () => window.clearTimeout(timer);
  }, [playing, index, last]);
  const changeScenario = (i: number) => { setPlaying(false); setScenarioIndex(i); setIndex(0); };
  return <section className="studyTrace studyBlock" id="selbstlern-schaubild">
    <span className="eyebrow">DU STEUERST DEN ABLAUF</span><h2>{visual.title}</h2><p>{visual.intro}</p>
    <p>Wähle einen Fall. Vermute zuerst das Ergebnis. Mit „Nächster Schritt“ verfolgst du, was sich verändert. Die markierten Felder zeigen, worauf es gerade ankommt.</p>
    <div className="studyScenarios" role="group" aria-label="Beispielfall wählen">{visual.scenarios.map((item, i) => <button type="button" key={item.label} aria-pressed={i === scenarioIndex} onClick={() => changeScenario(i)}>{item.label}</button>)}</div>
    <ChoiceCheck key={scenarioIndex} question={scenario.question} options={scenario.options} />
    <div className="studyTraceBoard">
      <div className="studyTraceCount">Schritt {index + 1} / {scenario.frames.length}<span>{last ? 'Ziel erreicht' : 'Beobachten & begründen'}</span></div>
      <ol className="studyCells" aria-label="Aktueller Zustand">{frame.cells.map((cell, i) => <li key={cell.label} className={`studyCell ${cell.state || 'neutral'}`}><span className="studyCellLabel">{cell.label}</span><strong key={cell.value}>{cell.value}</strong><small>{cell.state === 'active' ? '◉ Im Fokus' : cell.state === 'done' ? '✓ Festgehalten' : `Feld ${i + 1}`}</small></li>)}</ol>
      <div className="studyTraceCaption" aria-live={playing ? 'off' : 'polite'} aria-atomic="true"><h3>{frame.title}</h3><p>{frame.text}</p></div>
      <div className="studyControls"><button type="button" disabled={index === 0} onClick={() => { setPlaying(false); setIndex(i => i - 1); }}>← Zurück</button><button type="button" disabled={last} onClick={() => { setPlaying(false); setIndex(i => i + 1); }}>Nächster Schritt →</button><button type="button" onClick={() => { if (playing) setPlaying(false); else { if (last) setIndex(0); setPlaying(true); } }}>{playing ? 'Pause' : 'Langsam abspielen'}</button><button type="button" onClick={() => { setPlaying(false); setIndex(0); }}>Von vorn</button></div>
    </div>
    <p className="studyModelLimit"><strong>Was dieses Modell zeigt – und was nicht:</strong> {visual.limitation}</p>
    <details className="studyTranscript"><summary>Alle Schritte dieses Falls als Lesefassung</summary><ol>{scenario.frames.map((item, i) => <li key={i}><strong>{item.title}</strong><p>{item.text}</p><p>{item.cells.map(cell => `${cell.label}: ${cell.value}`).join(' · ')}</p></li>)}</ol></details>
  </section>;
}

export function StudyWorkshop({ guide, scope }: { guide: StudyGuide; scope: string }) {
  return <div className="studyWorkshop">
    <section className="studyBlock" id="beispiele-extra"><span className="eyebrow">ICH ZEIGE ES DIR · DANN BIST DU DRAN</span><h2>Schritt für Schritt zum Aha-Moment</h2><p>Lies nicht sofort bis zum Ergebnis. Decke die nächsten Schritte ab und versuche, sie selbst vorauszusagen. Diese Lernbeispiele sind frei sichtbar; Lösungen zu deinen eigenen Aufgaben bleiben separat geschützt.</p>
      {guide.examples.map(example => <article className="studyExample" key={example.title}><h3>{example.title}</h3><p><strong>Unsere Frage:</strong> {example.question}</p><ol>{example.steps.map((step, i) => <li key={i}><strong>{step.title}</strong><p>{step.text}</p>{step.code && <pre tabIndex={0}><code>{step.code}</code></pre>}</li>)}</ol><p className="studyResult"><strong>Das nehmen wir mit:</strong> {example.result}</p></article>)}
    </section>
    {scope === 'programmierung' && <StructureTraceLab />}
    <TracePlayer visual={guide.visual} />
    <section className="studyBlock studyPitfalls"><span className="eyebrow">TYPISCHE STOLPERSTELLEN</span><h2>Fast richtig ist noch nicht ganz verstanden</h2>{guide.pitfalls.map(pitfall => <details key={pitfall.mistaken}><summary>„{pitfall.mistaken}“ – stimmt das?</summary><p>{pitfall.correction}</p></details>)}</section>
    <section className="studyBlock" id="kurzcheck"><span className="eyebrow">KURZ STOPPEN · SELBST PRÜFEN</span><h2>Hast du die Idee verstanden?</h2><p>Jeweils eine Antwort passt. Begründe sie zuerst in einem Satz. Du bekommst Rückmeldung zu jeder Wahl und darfst deine Antwort ändern. Dies ist keine benotete Prüfung und speichert keine Ergebnisse.</p>{guide.checks.map((check, i) => <article key={check.id} id={check.id}><h3>Check {i + 1}</h3><ChoiceCheck question={check.question} options={check.options} retry={check.retry} /></article>)}</section>
    <section className="studyBlock" id="zusatztraining"><span className="eyebrow">ZUSÄTZLICHE BRÜCKEN ZU DEN HEFTAUFGABEN</span><h2>Erst sicher werden, dann weiterdenken</h2><p>Diese Aufgaben ergänzen das bisherige Übungsblatt. Beginne mit „Start“. Notiere deinen Versuch im Heft; öffne einen Hinweis erst dann, wenn du nicht weiterkommst. Die Lehrkraft wählt aus, welche weiteren Aufgaben du heute bearbeitest.</p>{guide.tasks.map(task => <article className="studyTask" key={task.id} id={task.id}><span className="eyebrow">{task.level}</span><h3>{task.title}</h3><p>{task.prompt}</p><div className="taskHints">{task.hints.map((hint, i) => <details key={i}><summary>Hinweis {i + 1}</summary><p>{hint}</p></details>)}</div><Solution scope={scope} id={task.id} /></article>)}</section>
  </div>;
}

export function StudyFinish({ guide }: { guide: StudyGuide }) {
  const [checked, setChecked] = useState<string[]>([]);
  return <section className="studyBlock studyFinish" id="weiterlernen"><span className="eyebrow">DEIN NACHWEIS · NICHT NUR EIN HÄKCHEN</span><h2>Bereit für den nächsten Schritt?</h2><p>Prüfe diese Punkte mit einem neuen Beispiel ohne Vorlage. Ein Häkchen ist nur deine persönliche Orientierung; die nächste Freigabe kommt weiterhin von deiner Lehrkraft.</p><div>{guide.readiness.map(item => <label key={item}><input type="checkbox" checked={checked.includes(item)} onChange={event => setChecked(current => event.target.checked ? [...current, item] : current.filter(x => x !== item))} /><span>{item}</span></label>)}</div><p aria-live="polite">{checked.length} von {guide.readiness.length} Punkten selbst eingeschätzt. Die Auswahl wird nicht gespeichert.</p><p><strong>Wenn noch etwas fehlt:</strong> Schreibe „Bis hier verstehe ich … / An dieser Stelle hänge ich …“ und zeige deinen Versuch. Nutze den passenden Lernschritt erneut oder bitte um eine kurze Erklärung.</p><a href="#lernstart">↑ Zurück zum Lernstart</a></section>;
}
