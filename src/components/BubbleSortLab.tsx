"use client";
import Link from "next/link";
import { Solution } from "./ProtectedContent";

import { useMemo, useState } from "react";

export type BubbleConfig = { initial: number[]; title: string; intro: string; principleTitle: string; principle: string; pseudocode: string; workshop: { title:string; goal:string; blocks:string[]; extension:string } };

type SortState = { values: number[]; left: number; right: number; pass: number; swaps: number; comparisons: number; done: boolean; message: string };

export default function BubbleSortLab({ config }: { config: BubbleConfig }) {
  const startState = (): SortState => ({ values: [...config.initial], left: 0, right: 1, pass: 1, swaps: 0, comparisons: 0, done: false, message: "Vergleiche die ersten beiden Nachbarn." });
  const [state, setState] = useState<SortState>(startState);
  const [answer, setAnswer] = useState<"swap" | "keep" | null>(null);
  const [feedback, setFeedback] = useState("");

  const needsSwap = state.values[state.left] > state.values[state.right];
  const progress = useMemo(() => Math.min(100, Math.round(state.comparisons / (config.initial.length * (config.initial.length-1) / 2) * 100)), [state.comparisons, config.initial.length]);

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
      <div className="labHeading"><div><div className="eyebrow">INTERAKTIVE VERSTÄNDNISAUFGABE</div><h2>{config.title}</h2></div><button className="resetButton" onClick={reset}>↻ Neu starten</button></div>
      <p>{config.intro}</p>

      <div className="labBoard">
        <div className="labTopline"><span>Durchlauf {Math.min(state.pass, config.initial.length-1)} von {config.initial.length-1}</span><span>{state.comparisons} Vergleiche · {state.swaps} Vertauschungen</span></div>
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

      <Solution scope="sortieren" id="transfer" title="Vollständiger Kontrollweg des Sortierlabors" />

      <div className="principleGrid">
        <article><div className="eyebrow">DAS PRINZIP</div><h3>{config.principleTitle}</h3><p>{config.principle}</p></article>
        <article className="codeCard"><div><span>Pseudocode</span><span>algorithmus.txt</span></div><pre>{config.pseudocode}</pre></article>
      </div>

      <article className="scratchWorkshop sortScratch">
        <div className="scratchTop"><div className="scratchLogo">SCRATCH</div><div><div className="eyebrow">PROGRAMMIERWERKSTATT</div><h2>{config.workshop.title}</h2></div><a href="https://scratch.mit.edu/projects/editor/" target="_blank" rel="noreferrer">Scratch öffnen ↗</a></div>
        <p>{config.workshop.goal}</p>
        <p><Link className="textButton" href="/werkzeuge#scratch">Neu in Scratch? Hier beginnt die Einführung →</Link></p>
        <div className="scratchBlocks">
          {config.workshop.blocks.map((block,i)=><div className={`scratchBlock block${i%4}`} key={i}><span>{i+1}</span>{block}</div>)}
        </div>
        <div className="scratchChallenge"><strong>⭐ Erweiterung</strong><p>{config.workshop.extension}</p></div>
        <Solution scope="sortieren" id="workshop" title="Musterweg für Scratch" />
      </article>
    </section>
  );
}
