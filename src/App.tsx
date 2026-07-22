import { useEffect, useMemo, useRef, useState } from "react";

type AlgorithmId = "bubble" | "selection" | "insertion";

type SortStep = {
  values: number[];
  compared: number[];
  sorted: number[];
  comparisons: number;
  swaps: number;
  message: string;
  codeLine: number;
};

type Algorithm = {
  id: AlgorithmId;
  shortName: string;
  name: string;
  description: string;
  principle: string;
  complexity: string;
  code: string[];
};

const START_VALUES = [62, 35, 82, 48, 28, 68, 44, 78, 37, 57];

const ALGORITHMS: Algorithm[] = [
  {
    id: "bubble",
    shortName: "Bubble",
    name: "Bubblesort",
    description: "Nachbarn vergleichen und die größere Zahl nach rechts schieben.",
    principle: "Die größte noch unsortierte Zahl wandert in jedem Durchlauf nach rechts.",
    complexity: "O(n²)",
    code: [
      "wiederhole n − 1 Durchläufe:",
      "  vergleiche zwei Nachbarn",
      "  falls links > rechts:",
      "    vertausche beide Werte",
      "  markiere das größte Element",
    ],
  },
  {
    id: "selection",
    shortName: "Selection",
    name: "Selectionsort",
    description: "Das kleinste Element suchen und nach vorne setzen.",
    principle: "In jedem Durchlauf wird das Minimum des unsortierten Bereichs gewählt.",
    complexity: "O(n²)",
    code: [
      "für jede freie Position i:",
      "  setze minimum = i",
      "  durchsuche den Rest",
      "  falls Wert < minimum: merke ihn",
      "  tausche minimum nach Position i",
    ],
  },
  {
    id: "insertion",
    shortName: "Insertion",
    name: "Insertionsort",
    description: "Jeden Wert an der richtigen Stelle einsortieren.",
    principle: "Der sortierte Bereich links wächst Element für Element.",
    complexity: "O(n²)",
    code: [
      "beginne beim zweiten Element:",
      "  vergleiche mit dem linken Nachbarn",
      "  solange links > rechts:",
      "    verschiebe den Wert nach links",
      "  erweitere den sortierten Bereich",
    ],
  },
];

const QUIZ_QUESTIONS = [
  {
    question: "Welche Aussage beschreibt Bubblesort am besten?",
    answers: [
      "Es vergleicht benachbarte Werte.",
      "Es halbiert die Liste bei jedem Schritt.",
      "Es benötigt immer einen Suchbaum.",
    ],
    correct: 0,
    explanation: "Richtig: Bubblesort vergleicht Nachbarn und vertauscht sie bei Bedarf.",
  },
  {
    question: "Welche Laufzeit haben die drei Verfahren im schlechtesten Fall?",
    answers: ["O(log n)", "O(n)", "O(n²)"],
    correct: 2,
    explanation: "Richtig: Im schlechtesten Fall werden ungefähr n² Vergleiche benötigt.",
  },
  {
    question: "Welches Verfahren sucht gezielt das kleinste verbleibende Element?",
    answers: ["Selectionsort", "Bubblesort", "Binäre Suche"],
    correct: 0,
    explanation: "Richtig: Selectionsort wählt pro Runde das Minimum des Restbereichs.",
  },
];

function snapshot(
  values: number[],
  compared: number[],
  sorted: number[],
  comparisons: number,
  swaps: number,
  message: string,
  codeLine: number,
): SortStep {
  return {
    values: [...values],
    compared: [...compared],
    sorted: [...sorted],
    comparisons,
    swaps,
    message,
    codeLine,
  };
}

function createBubbleSteps(input: number[]): SortStep[] {
  const values = [...input];
  const steps: SortStep[] = [snapshot(values, [], [], 0, 0, "Die Ausgangsliste ist noch unsortiert.", 0)];
  let comparisons = 0;
  let swaps = 0;

  for (let end = values.length - 1; end > 0; end -= 1) {
    let changed = false;
    for (let index = 0; index < end; index += 1) {
      comparisons += 1;
      steps.push(snapshot(values, [index, index + 1], range(end + 1, values.length), comparisons, swaps, `${values[index]} und ${values[index + 1]} werden verglichen.`, 1));
      if (values[index] > values[index + 1]) {
        [values[index], values[index + 1]] = [values[index + 1], values[index]];
        swaps += 1;
        changed = true;
        steps.push(snapshot(values, [index, index + 1], range(end + 1, values.length), comparisons, swaps, "Die Werte standen falsch herum und wurden vertauscht.", 3));
      }
    }
    steps.push(snapshot(values, [], range(end, values.length), comparisons, swaps, `${values[end]} steht jetzt sicher an der richtigen Position.`, 4));
    if (!changed) break;
  }

  steps.push(snapshot(values, [], range(0, values.length), comparisons, swaps, "Fertig! Die Liste ist vollständig sortiert.", 4));
  return steps;
}

function createSelectionSteps(input: number[]): SortStep[] {
  const values = [...input];
  const steps: SortStep[] = [snapshot(values, [], [], 0, 0, "Die Ausgangsliste ist noch unsortiert.", 0)];
  let comparisons = 0;
  let swaps = 0;

  for (let index = 0; index < values.length - 1; index += 1) {
    let minimum = index;
    steps.push(snapshot(values, [minimum], range(0, index), comparisons, swaps, `${values[minimum]} ist zunächst das kleinste gefundene Element.`, 1));
    for (let search = index + 1; search < values.length; search += 1) {
      comparisons += 1;
      steps.push(snapshot(values, [minimum, search], range(0, index), comparisons, swaps, `${values[search]} wird mit dem bisherigen Minimum ${values[minimum]} verglichen.`, 2));
      if (values[search] < values[minimum]) {
        minimum = search;
        steps.push(snapshot(values, [minimum], range(0, index), comparisons, swaps, `${values[minimum]} ist das neue Minimum.`, 3));
      }
    }
    if (minimum !== index) {
      [values[index], values[minimum]] = [values[minimum], values[index]];
      swaps += 1;
      steps.push(snapshot(values, [index, minimum], range(0, index), comparisons, swaps, `Das Minimum wird an Position ${index + 1} gesetzt.`, 4));
    }
    steps.push(snapshot(values, [], range(0, index + 1), comparisons, swaps, `Position ${index + 1} ist nun sortiert.`, 4));
  }

  steps.push(snapshot(values, [], range(0, values.length), comparisons, swaps, "Fertig! Die Liste ist vollständig sortiert.", 4));
  return steps;
}

function createInsertionSteps(input: number[]): SortStep[] {
  const values = [...input];
  const steps: SortStep[] = [snapshot(values, [], [0], 0, 0, "Das erste Element bildet den sortierten Bereich.", 0)];
  let comparisons = 0;
  let swaps = 0;

  for (let index = 1; index < values.length; index += 1) {
    let current = index;
    steps.push(snapshot(values, [current], range(0, index), comparisons, swaps, `${values[current]} soll in den linken Bereich einsortiert werden.`, 0));
    while (current > 0) {
      comparisons += 1;
      steps.push(snapshot(values, [current - 1, current], range(0, index + 1), comparisons, swaps, `${values[current]} wird mit ${values[current - 1]} links davon verglichen.`, 1));
      if (values[current - 1] <= values[current]) break;
      [values[current - 1], values[current]] = [values[current], values[current - 1]];
      swaps += 1;
      current -= 1;
      steps.push(snapshot(values, [current, current + 1], range(0, index + 1), comparisons, swaps, "Der Wert rückt eine Position nach links.", 3));
    }
    steps.push(snapshot(values, [], range(0, index + 1), comparisons, swaps, `Die ersten ${index + 1} Werte sind jetzt sortiert.`, 4));
  }

  steps.push(snapshot(values, [], range(0, values.length), comparisons, swaps, "Fertig! Die Liste ist vollständig sortiert.", 4));
  return steps;
}

function range(start: number, end: number) {
  return Array.from({ length: Math.max(0, end - start) }, (_, index) => start + index);
}

function createSteps(algorithm: AlgorithmId, values: number[]) {
  if (algorithm === "selection") return createSelectionSteps(values);
  if (algorithm === "insertion") return createInsertionSteps(values);
  return createBubbleSteps(values);
}

function shuffleValues() {
  return Array.from({ length: 10 }, () => Math.floor(Math.random() * 71) + 20);
}

export default function Home() {
  const [algorithmId, setAlgorithmId] = useState<AlgorithmId>("bubble");
  const [values, setValues] = useState(START_VALUES);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const labRef = useRef<HTMLElement>(null);

  const algorithm = ALGORITHMS.find((item) => item.id === algorithmId) ?? ALGORITHMS[0];
  const steps = useMemo(() => createSteps(algorithmId, values), [algorithmId, values]);
  const step = steps[Math.min(stepIndex, steps.length - 1)];
  const progress = steps.length > 1 ? (stepIndex / (steps.length - 1)) * 100 : 0;

  useEffect(() => {
    if (!isPlaying) return;
    if (stepIndex >= steps.length - 1) return;
    const timer = window.setTimeout(() => {
      const nextStep = stepIndex + 1;
      setStepIndex(nextStep);
      if (nextStep >= steps.length - 1) setIsPlaying(false);
    }, 620);
    return () => window.clearTimeout(timer);
  }, [isPlaying, stepIndex, steps.length]);

  function selectAlgorithm(id: AlgorithmId) {
    setAlgorithmId(id);
    setStepIndex(0);
    setIsPlaying(false);
  }

  function moveStep(direction: number) {
    setIsPlaying(false);
    setStepIndex((current) => Math.max(0, Math.min(steps.length - 1, current + direction)));
  }

  function randomize() {
    setValues(shuffleValues());
    setStepIndex(0);
    setIsPlaying(false);
  }

  function restart() {
    setStepIndex(0);
    setIsPlaying(false);
  }

  function togglePlayback() {
    if (stepIndex >= steps.length - 1) {
      setStepIndex(0);
      setIsPlaying(true);
      return;
    }
    setIsPlaying((playing) => !playing);
  }

  function startLab() {
    labRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Informatik-Lernlabor Startseite">
          <span className="brand-mark" aria-hidden="true">&lt;/&gt;</span>
          <span>Informatik-Lernlabor</span>
        </a>
        <span className="class-label">Klasse 11 <i /> KCG</span>
        <a className="header-link" href="#lerncheck">Lerncheck</a>
      </header>

      <section className="hero" id="top">
        <div className="circuit circuit-left" aria-hidden="true" />
        <div className="hero-copy">
          <span className="eyebrow"><span>01</span> Algorithmen &amp; Datenstrukturen</span>
          <h1>Algorithmen<br />sichtbar verstehen</h1>
          <p>Sortierverfahren Schritt für Schritt nachvollziehen, vergleichen und wirklich verstehen.</p>
          <button className="primary-cta" onClick={startLab}>
            Sortierlabor starten <span aria-hidden="true">→</span>
          </button>
          <div className="curriculum-note">
            <span aria-hidden="true">✓</span>
            Passend zum Bildungsplan Baden-Württemberg
          </div>
        </div>

        <div className="hero-demo" aria-label="Vorschau einer Sortierung">
          <div className="demo-heading">
            <div>
              <span className="demo-kicker">Live-Vorschau</span>
              <h2>{algorithm.name}</h2>
            </div>
            <span className="complexity-chip">{algorithm.complexity}</span>
          </div>
          <div className="mini-chart" aria-hidden="true">
            {step.values.map((value, index) => (
              <span
                key={`${index}-${value}`}
                className={step.compared.includes(index) ? "active" : step.sorted.includes(index) ? "sorted" : ""}
                style={{ height: `${Math.max(24, value)}%` }}
              />
            ))}
          </div>
          <div className="demo-stats">
            <div><strong>{step.comparisons}</strong><span>Vergleiche</span></div>
            <div><strong>{step.swaps}</strong><span>Vertauschungen</span></div>
            <div><strong>{Math.round(progress)}%</strong><span>Fortschritt</span></div>
          </div>
          <div className="mini-progress"><span style={{ width: `${progress}%` }} /></div>
          <div className="hero-controls">
            <button onClick={() => moveStep(-1)} disabled={stepIndex === 0} aria-label="Einen Schritt zurück">‹</button>
            <button className="play" onClick={togglePlayback}>
              {isPlaying ? "Pause" : stepIndex === steps.length - 1 ? "Fertig" : "Abspielen"}
            </button>
            <button onClick={() => moveStep(1)} disabled={stepIndex === steps.length - 1} aria-label="Einen Schritt weiter">›</button>
          </div>
        </div>
      </section>

      <section className="lab-section" ref={labRef} id="sortierlabor">
        <div className="section-heading">
          <div>
            <span className="section-number">01 · SORTIERLABOR</span>
            <h2>Wie sortiert ein Computer?</h2>
            <p>Wähle ein Verfahren und beobachte jeden einzelnen Arbeitsschritt.</p>
          </div>
          <button className="secondary-button" onClick={randomize}><span aria-hidden="true">↻</span> Neue Zahlen</button>
        </div>

        <div className="algorithm-tabs" role="tablist" aria-label="Sortierverfahren auswählen">
          {ALGORITHMS.map((item, index) => (
            <button
              key={item.id}
              role="tab"
              aria-selected={algorithmId === item.id}
              className={algorithmId === item.id ? "selected" : ""}
              onClick={() => selectAlgorithm(item.id)}
            >
              <span>0{index + 1}</span>
              <strong>{item.name}</strong>
              <small>{item.description}</small>
            </button>
          ))}
        </div>

        <div className="lab-grid">
          <article className="visualizer-card">
            <div className="card-topline">
              <div>
                <span className="status-dot" />
                <strong>Schritt {stepIndex + 1} von {steps.length}</strong>
              </div>
              <span className="complexity-chip">Worst Case {algorithm.complexity}</span>
            </div>

            <div className="bars" aria-label={`Aktuelle Zahlenfolge: ${step.values.join(", ")}`}>
              {step.values.map((value, index) => {
                const state = step.compared.includes(index) ? "comparing" : step.sorted.includes(index) ? "sorted" : "";
                return (
                  <div className="bar-column" key={index}>
                    <span className={`bar ${state}`} style={{ height: `${Math.max(58, value * 2.25)}px` }}>
                      <strong>{value}</strong>
                    </span>
                    <small>{index + 1}</small>
                  </div>
                );
              })}
            </div>

            <div className="legend" aria-label="Farblegende">
              <span><i className="legend-normal" /> unsortiert</span>
              <span><i className="legend-active" /> wird verglichen</span>
              <span><i className="legend-sorted" /> sortiert</span>
            </div>

            <div className="explanation-box" aria-live="polite">
              <span className="explanation-icon" aria-hidden="true">i</span>
              <div><small>Was passiert gerade?</small><strong>{step.message}</strong></div>
            </div>

            <div className="progress-track" aria-label={`Fortschritt ${Math.round(progress)} Prozent`}>
              <span style={{ width: `${progress}%` }} />
            </div>

            <div className="main-controls">
              <button onClick={restart} disabled={stepIndex === 0} aria-label="Sortierung zurücksetzen">↺ <span>Start</span></button>
              <button onClick={() => moveStep(-1)} disabled={stepIndex === 0}>← <span>Zurück</span></button>
              <button className="main-play" onClick={togglePlayback}>
                <span aria-hidden="true">{isPlaying ? "Ⅱ" : "▶"}</span>
                {isPlaying ? "Pause" : stepIndex === steps.length - 1 ? "Neu starten" : "Abspielen"}
              </button>
              <button onClick={() => moveStep(1)} disabled={stepIndex === steps.length - 1}><span>Weiter</span> →</button>
            </div>
          </article>

          <aside className="learning-panel">
            <div className="metrics-grid">
              <div><span className="metric-icon blue">⌕</span><strong>{step.comparisons}</strong><small>Vergleiche</small></div>
              <div><span className="metric-icon cyan">⇄</span><strong>{step.swaps}</strong><small>Vertauschungen</small></div>
            </div>

            <article className="principle-card">
              <span className="panel-label">DAS PRINZIP</span>
              <h3>{algorithm.name}</h3>
              <p>{algorithm.principle}</p>
            </article>

            <article className="code-card">
              <div className="code-heading"><span>Pseudocode</span><span>algorithmus.txt</span></div>
              <ol>
                {algorithm.code.map((line, index) => (
                  <li key={line} className={step.codeLine === index ? "current" : ""}><code>{line}</code></li>
                ))}
              </ol>
            </article>

            <div className="learning-tip">
              <span aria-hidden="true">💡</span>
              <p><strong>Beobachtung:</strong> Ändere die Zahlen und vergleiche, welches Verfahren wie viele Vertauschungen benötigt.</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="quiz-section" id="lerncheck">
        <div className="quiz-intro">
          <span className="section-number">02 · LERNCHECK</span>
          <h2>Schon verstanden?</h2>
          <p>Drei kurze Fragen zeigen dir, ob die wichtigsten Ideen sitzen. Du erhältst sofort eine Rückmeldung.</p>
          <div className="score-card">
            <span>Dein Zwischenstand</span>
            <strong>{QUIZ_QUESTIONS.filter((question, index) => quizAnswers[index] === question.correct).length}<small> / 3</small></strong>
          </div>
        </div>
        <div className="quiz-list">
          {QUIZ_QUESTIONS.map((question, questionIndex) => {
            const selected = quizAnswers[questionIndex];
            const answered = selected !== undefined;
            return (
              <article className="question-card" key={question.question}>
                <span className="question-count">0{questionIndex + 1}</span>
                <h3>{question.question}</h3>
                <div className="answer-list">
                  {question.answers.map((answer, answerIndex) => {
                    const isCorrect = answered && answerIndex === question.correct;
                    const isWrong = answered && selected === answerIndex && answerIndex !== question.correct;
                    return (
                      <button
                        key={answer}
                        className={isCorrect ? "correct" : isWrong ? "wrong" : ""}
                        onClick={() => setQuizAnswers((current) => ({ ...current, [questionIndex]: answerIndex }))}
                      >
                        <span>{String.fromCharCode(65 + answerIndex)}</span>{answer}
                        {isCorrect && <b aria-label="richtig">✓</b>}
                        {isWrong && <b aria-label="falsch">×</b>}
                      </button>
                    );
                  })}
                </div>
                {answered && <p className={selected === question.correct ? "feedback positive" : "feedback"} aria-live="polite">
                  {selected === question.correct ? question.explanation : "Noch nicht ganz. Schau dir das Prinzip im Sortierlabor noch einmal an."}
                </p>}
              </article>
            );
          })}
        </div>
      </section>

      <section className="upcoming-section">
        <div className="section-heading compact">
          <div><span className="section-number">DAS LERNLABOR WÄCHST</span><h2>Als Nächstes</h2></div>
          <span className="roadmap-label">Roadmap · Klasse 11</span>
        </div>
        <div className="module-grid">
          <article><span className="module-icon">◇</span><div><small>MODUL 02</small><h3>Dijkstra-Navigator</h3><p>Kürzeste Wege in Graphen finden und verstehen.</p></div><b>Bald</b></article>
          <article><span className="module-icon cyan">▱</span><div><small>MODUL 03</small><h3>SQL-Detektiv</h3><p>Datenbanken abfragen, filtern und kombinieren.</p></div><b>Bald</b></article>
          <article><span className="module-icon violet">◎</span><div><small>MODUL 04</small><h3>Automatenlabor</h3><p>Zustände, Übergänge und formale Sprachen entdecken.</p></div><b>Bald</b></article>
        </div>
      </section>

      <footer>
        <div className="brand footer-brand"><span className="brand-mark">&lt;/&gt;</span><span>Informatik-Lernlabor</span></div>
        <p>Verstehen durch Ausprobieren · Klasse 11 · KCG</p>
        <a href="#top">Nach oben ↑</a>
      </footer>
    </main>
  );
}
