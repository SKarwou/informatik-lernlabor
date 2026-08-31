"use client";

import { useMemo, useState } from "react";

const initial = [6, 3, 8, 4, 2];

type SortState = { values: number[]; left: number; right: number; pass: number; swaps: number; comparisons: number; done: boolean; message: string };

const startState = (): SortState => ({ values: initial, left: 0, right: 1, pass: 1, swaps: 0, comparisons: 0, done: false, message: "Vergleiche die ersten beiden Nachbarn." });

export default function BubbleSortLab() {
  const [state, setState] = useState<SortState>(startState);
  const [answer, setAnswer] = useState<"swap" | "keep" | null>(null);
  const [feedback, setFeedback] = useState("");

  const needsSwap = state.values[state.left] > state.values[state.right];
  const progress = useMemo(() => Math.min(100, Math.round(((state.comparisons) / 10) * 100)), [state.comparisons]);

  function decide(choice: "swap" | "keep") {
    if (state.done) return;
    setAnswer(choice);
    if ((choice === "swap") !== needsSwap) {
      setFeedback(needsSwap ? "Noch nicht: Links steht die größere Zahl – beide müssen tauschen." : "Noch nicht: Die beiden Zahlen stehen bereits in der richtigen Reihenfolge.");
      return;
    }

    const values = [...state.values];
    let swaps = state.swaps;
    if (needsSwap) {
      [values[state.left], values[state.right]] = [values[state.right], values[state.left]];
      swaps += 1;
    }
    const comparisons = state.comparisons + 1;
    const endOfPass = state.right >= values.length - state.pass;
    const nextPass = endOfPass ? state.pass + 1 : state.pass;
    const done = nextPass >= values.length;
    const left = endOfPass ? 0 : state.left + 1;
    const right = endOfPass ? 1 : state.right + 1;

    setFeedback(needsSwap ? "Richtig – getauscht! Die größere Zahl wandert nach rechts." : "Richtig – kein Tausch nötig.");
    setState({ values, left, right, pass: nextPass, swaps, comparisons, done, message: done ? "Geschafft: Die Liste ist vollständig sortiert." : endOfPass ? `Durchlauf ${state.pass} ist fertig. Starte wieder links.` : "Vergleiche das nächste Nachbarpaar." });
    setAnswer(null);
  }

  function reset() { setState(startState()); setAnswer(null); setFeedback(""); }

  return (
    <section className="sortLab">
      <div className="labHeading"><div><div className="eyebrow">INTERAKTIVE VERSTÄNDNISAUFGABE</div><h2>Führe Bubblesort selbst aus</h2></div><button className="resetButton" onClick={reset}>↻ Neu starten</button></div>
      <p>Entscheide bei jedem Nachbarpaar: Müssen die Zahlen getauscht werden oder bleiben sie stehen?</p>

      <div className="labBoard">
        <div className="labTopline"><span>Durchlauf {Math.min(state.pass, 4)} von 4</span><span>{state.comparisons} Vergleiche · {state.swaps} Vertauschungen</span></div>
        <div className="numberRow" aria-label={`Zahlenfolge: ${state.values.join(", ")}`}>
          {state.values.map((value, index) => {
            const comparing = !state.done && (index === state.left || index === state.right);
            const sorted = index >= state.values.length - state.pass + (state.done ? 0 : 1);
            return <div className={`numberTile ${comparing ? "comparing" : ""} ${sorted || state.done ? "sorted" : ""}`} key={`${index}-${value}`}><strong>{value}</strong><small>{index + 1}</small></div>;
          })}
        </div>
        <div className="progressTrack"><span style={{ width: `${progress}%` }} /></div>
        <div className="instruction"><span>i</span><div><small>WAS PASSIERT GERADE?</small><strong>{state.message}</strong></div></div>

        {!state.done ? (
          <div className="decisionArea">
            <p>Muss <strong>{state.values[state.left]}</strong> mit <strong>{state.values[state.right]}</strong> tauschen?</p>
            <div><button className={answer === "swap" ? "chosen" : ""} onClick={() => decide("swap")}>Ja, tauschen ↔</button><button className={answer === "keep" ? "chosen" : ""} onClick={() => decide("keep")}>Nein, weiter →</button></div>
          </div>
        ) : <div className="successBox"><span>✓</span><div><strong>Sauber sortiert!</strong><p>Du hast {state.comparisons} Vergleiche und {state.swaps} Vertauschungen gebraucht.</p></div></div>}
        {feedback && <div className={`feedback ${feedback.startsWith("Richtig") ? "correct" : "retry"}`} aria-live="polite">{feedback}</div>}
      </div>

      <div className="principleGrid">
        <article><div className="eyebrow">DAS PRINZIP</div><h3>Große Werte steigen auf</h3><p>Wie Luftblasen im Wasser wandert in jedem Durchlauf die größte noch unsortierte Zahl nach rechts.</p></article>
        <article className="codeCard"><div><span>Pseudocode</span><span>algorithmus.txt</span></div><pre>{`wiederhole n − 1 Durchläufe:\n  vergleiche zwei Nachbarn\n  falls links > rechts:\n    vertausche beide Werte`}</pre></article>
      </div>

      <article className="scratchWorkshop sortScratch">
        <div className="scratchTop"><div className="scratchLogo">SCRATCH</div><div><div className="eyebrow">PROGRAMMIERWERKSTATT</div><h2>Bubblesort in Scratch</h2></div><a href="https://scratch.mit.edu/projects/editor/" target="_blank" rel="noreferrer">Scratch öffnen ↗</a></div>
        <p>Übertrage das beobachtete Verfahren in ein eigenes Scratch-Programm. Nutze eine Liste namens <strong>Zahlen</strong> und zwei Schleifen.</p>
        <div className="scratchBlocks">
          <div className="scratchBlock block0"><span>1</span>lösche alles aus [Zahlen] und füge fünf Zufallszahlen hinzu</div>
          <div className="scratchBlock block1"><span>2</span>wiederhole (Länge von Zahlen − 1) mal</div>
          <div className="scratchBlock block2"><span>3</span>setze [i] auf 1 und vergleiche Element i mit Element i+1</div>
          <div className="scratchBlock block3"><span>4</span>falls links &gt; rechts: speichere, ersetze und vertausche beide Werte</div>
        </div>
        <div className="scratchChallenge"><strong>⭐ Erweiterung</strong><p>Zähle Vergleiche und Vertauschungen. Lasse die Figur nach jedem vollständigen Durchlauf sagen, welches Element jetzt sicher sortiert ist.</p></div>
      </article>
    </section>
  );
}
