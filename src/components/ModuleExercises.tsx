"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Solution } from "./ProtectedContent";

export type LabConfig = {
  intro: string;
  choice: { question: string; options: string[]; correct: number };
  quick: { label: string; question: string; placeholder: string; answerHashes: string[]; hint: string };
  transfer: { title: string; prompt: string; checklist: string[] };
  scratch?: { title: string; goal: string; blocks: string[]; challenge: string };
  code?: { title: string; language: string; snippet: string; challenge: string };
};

const normalize = (value: string) => value.toLowerCase().trim().replace(/\s+/g, " ").replace(/\s*,\s*/g, ",").replace(/;$/, "");

export default function ModuleExercises({ slug, config }: { slug: string; config: LabConfig }) {
  const [choice, setChoice] = useState<number | null>(null);
  const [quick, setQuick] = useState("");
  const [quickStatus, setQuickStatus] = useState<"correct" | "retry" | "checking" | "unavailable" | null>(null);
  const checkVersion = useRef(0);
  const [showHint, setShowHint] = useState(false);
  const [notes, setNotes] = useState("");
  const [transferDone, setTransferDone] = useState(false);

  const completed = (choice === config.choice.correct ? 1 : 0) + (quickStatus === "correct" ? 1 : 0) + (transferDone ? 1 : 0);
  async function checkAnswer() {
    if (!quick.trim()) return;
    const version = ++checkVersion.current;
    setQuickStatus("checking");
    try {
      const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(slug + "|" + normalize(quick)));
      const hash = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
      if (version === checkVersion.current) setQuickStatus(config.quick.answerHashes.includes(hash) ? "correct" : "retry");
    } catch { if (version === checkVersion.current) setQuickStatus("unavailable"); }
  }

  return (
    <section className="exerciseLab">
      <div className="exerciseHeader">
        <div><div className="eyebrow">INTERAKTIVES ÜBUNGSLABOR</div><h2>Verstehen. Anwenden. Erklären.</h2><p>{config.intro}</p></div>
        <div className="scoreRing"><strong>{completed}/3</strong><span>Stationen</span></div>
      </div>

      <article className="exerciseStation">
        <div className="stationLabel"><span>01</span><div><small>VERSTÄNDNISCHECK</small><strong>Entscheide dich</strong></div></div>
        <h3>{config.choice.question}</h3>
        <div className="choiceGrid">
          {config.choice.options.map((option, index) => (
            <button className={choice === index ? (index === config.choice.correct ? "correctChoice" : "wrongChoice") : ""} onClick={() => setChoice(index)} key={option}><span>{String.fromCharCode(65 + index)}</span>{option}</button>
          ))}
        </div>
        {choice !== null && <div role="status" className={`stationFeedback ${choice === config.choice.correct ? "correct" : "retry"}`}>{choice === config.choice.correct ? "✓ Richtig. Erkläre auch, warum deine Auswahl passt." : "Noch nicht. Prüfe die Begriffe und versuche es erneut."}</div>}
        <Solution scope={slug} id="lab-choice" title="Erklärung zur Auswahl" />
      </article>

      <article className="exerciseStation">
        <div className="stationLabel"><span>02</span><div><small>{config.quick.label}</small><strong>Selbst lösen</strong></div></div>
        <h3>{config.quick.question}</h3>
        <div className="quickAnswer"><input aria-label="Deine Antwort" value={quick} onChange={(event) => { setQuick(event.target.value); checkVersion.current++; setQuickStatus(null); }} placeholder={config.quick.placeholder} onKeyDown={(event) => { if (event.key === "Enter") void checkAnswer(); }} /><button onClick={() => void checkAnswer()} disabled={!quick.trim() || quickStatus === "checking"}>{quickStatus === "checking" ? "Prüfe …" : "Prüfen →"}</button></div>
        <button className="hintButton" onClick={() => setShowHint(!showHint)}>{showHint ? "Hinweis ausblenden" : "Hinweis anzeigen"}</button>
        {showHint && <p className="hintText">💡 {config.quick.hint}</p>}
        {quickStatus && quickStatus !== "checking" && <div role="status" className={`stationFeedback ${quickStatus === "correct" ? "correct" : "retry"}`}>{quickStatus === "correct" ? "✓ Deine Antwort stimmt. Notiere jetzt deinen Lösungsweg." : quickStatus === "unavailable" ? "Die Prüfung ist in diesem Browser gerade nicht verfügbar. Öffne die Website über https oder vergleiche mit der freigeschalteten Musterlösung." : "Das passt noch nicht. Nutze den Hinweis und prüfe Schreibweise sowie Rechenweg."}</div>}
        <Solution scope={slug} id="lab-quick" />
      </article>

      <article className="exerciseStation transferStation">
        <div className="stationLabel"><span>03</span><div><small>TRANSFER & DOKUMENTATION</small><strong>{config.transfer.title}</strong></div></div>
        <h3>{config.transfer.prompt}</h3>
        <div className="transferLayout">
          <div><label htmlFor={`notes-${slug}`}>Deine Notizen oder Lösungsskizze</label><textarea id={`notes-${slug}`} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Hier kannst du deine Gedanken festhalten. Eine ausführliche Lösung darfst du auch auf Papier oder in einem Dokument erstellen." /></div>
          <div className="checklist"><strong>Darauf kommt es an:</strong>{config.transfer.checklist.map((item) => <span key={item}>□ {item}</span>)}</div>
        </div>
        <p className="sourceNote">Deine Notizen bleiben nur auf dieser geöffneten Seite. Übertrage sie vor dem Neuladen in dein Heft.</p>
        <div className="transferActions"><button onClick={() => setTransferDone(!transferDone)} className={transferDone ? "doneButton" : ""}>{transferDone ? "✓ Als bearbeitet markiert" : "Als bearbeitet markieren"}</button></div>
        <Solution scope={slug} id="transfer" title="Beispiellösung / Erwartungshorizont" />
      </article>

      {(config.scratch || config.code) && <div className="toolStartNotice"><p>Noch nie programmiert? Beginne mit der Einführung zu Oberflächen, Eingaben und deinem ersten Programm. Pseudocode beschreibt nur eine Idee und wird nicht direkt ausgeführt.</p><Link href="/werkzeuge">Erste Schritte mit den Werkzeugen →</Link></div>}
      {config.scratch && <ScratchWorkshop {...config.scratch} />}
      {config.code && <CodeWorkshop {...config.code} />}
      {(config.scratch || config.code) && <Solution scope={slug} id="workshop" title="Lösung zum Werkstattauftrag" />}
    </section>
  );
}

function ScratchWorkshop({ title, goal, blocks, challenge }: NonNullable<LabConfig["scratch"]>) {
  return <article className="scratchWorkshop"><div className="scratchTop"><div className="scratchLogo">SCRATCH</div><div><div className="eyebrow">PROGRAMMIERWERKSTATT</div><h2>{title}</h2></div><a href="https://scratch.mit.edu/projects/editor/" target="_blank" rel="noreferrer">Scratch öffnen ↗</a></div><p>{goal}</p><div className="scratchBlocks">{blocks.map((block, index) => <div className={`scratchBlock block${index % 4}`} key={block}><span>{index + 1}</span>{block}</div>)}</div><div className="scratchChallenge"><strong>⭐ Erweiterung</strong><p>{challenge}</p></div></article>;
}

function CodeWorkshop({ title, language, snippet, challenge }: NonNullable<LabConfig["code"]>) {
  return <article className="codeWorkshop"><div className="codeWorkshopTop"><div><div className="eyebrow">CODE- & MODELLWERKSTATT</div><h2>{title}</h2></div><span>{language}</span></div><pre>{snippet}</pre><p><strong>Auftrag:</strong> {challenge}</p></article>;
}
