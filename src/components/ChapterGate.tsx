import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import type { BeginnerCourse } from "../learningTypes";
import type { LabConfig } from "./ModuleExercises";
import type { ModuleTheoryConfig } from "./ModuleTheory";
import { useProtected } from "./ProtectedContent";
import type { PracticeTask } from "./PracticeView";
import type { BubbleConfig } from "./BubbleSortLab";
export type ChapterPayload = { version: 1; kind: "chapter" | "project"; title: string; course?: BeginnerCourse; theory?: ModuleTheoryConfig; beginner?: { plain: string; picture: string; miniTask: string }; lab?: LabConfig; html?: string; practice?: PracticeTask[]; bubble?: BubbleConfig };
const bytes = (value: string) => Uint8Array.from(atob(value), c => c.charCodeAt(0));
export default function ChapterGate({ scope, title, project = false, children }: { scope: string; title: string; project?: boolean; children: (payload: ChapterPayload) => ReactNode }) {
  const [payload, setPayload] = useState<ChapterPayload | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const solutionAccess = useProtected(scope);
  const id = useId();
  const contentRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!payload) return;
    requestAnimationFrame(() => {
      let anchor = window.location.hash.slice(1);
      try { anchor = decodeURIComponent(anchor); } catch { /* Unveränderten Anker verwenden. */ }
      const target = anchor ? document.getElementById(anchor) : null;
      if (target && contentRef.current?.contains(target)) target.scrollIntoView();
    });
  }, [payload]);
  async function submit(event: FormEvent) {
    event.preventDefault(); if (busy) return;
    setBusy(true); setError("");
    try {
      if (!globalThis.crypto?.subtle) throw Error("Öffne die Website bitte über https in einem aktuellen Browser.");
      let response: Response;
      try { response = await fetch(`${import.meta.env.BASE_URL}access/${encodeURIComponent(scope)}.json`, { cache: "no-store" }); }
      catch { throw Error("Die Datei konnte nicht geladen werden. Prüfe deine Internetverbindung."); }
      if (!response.ok) throw Error("Der Inhalt ist gerade nicht erreichbar. Bitte informiere deine Lehrkraft.");
      const envelope = await response.json();
      if (envelope.format !== "AES-GCM-PBKDF2-v1" || envelope.iterations !== 600000) throw Error("Unbekanntes Dateiformat. Bitte informiere deine Lehrkraft.");
      const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(code.trim().toLowerCase()), "PBKDF2", false, ["deriveKey"]);
      const key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt: bytes(envelope.salt), iterations: envelope.iterations, hash: "SHA-256" }, material, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
      let decoded: ArrayBuffer;
      try { decoded = await crypto.subtle.decrypt({ name: "AES-GCM", iv: bytes(envelope.iv), additionalData: new TextEncoder().encode("access/" + scope) }, key, bytes(envelope.ciphertext)); }
      catch { throw Error("Dieser Freigabecode passt hier nicht. Frage deine Lehrkraft nach dem Code für diesen Bereich."); }
      const result = JSON.parse(new TextDecoder().decode(decoded));
      if (result.version !== 1 || result.kind !== (project ? "project" : "chapter")) throw Error("Der Inhalt konnte nicht gelesen werden.");
      setPayload(result); setCode("");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Das Öffnen hat nicht geklappt."); }
    finally { setBusy(false); }
  }
  function lock() { setPayload(null); setCode(""); setError(""); solutionAccess.lock(); }
  if (payload) return <div ref={contentRef}><div className="chapterOpenBar" role="status"><span>✓ {title} ist freigegeben</span><button className="secondaryButton" onClick={lock}>{project ? "Projekt" : "Kapitel"} wieder sperren</button></div>{children(payload)}</div>;
  return <section className="chapterGate" aria-labelledby={id + "-title"}>
    <span className="eyebrow">🔒 {project ? "PROJEKTFREIGABE" : "KAPITELFREIGABE"}</span><h2 id={id + "-title"}>{title} wartet auf deine Freigabe</h2>
    <p>{project ? "Die Projektbeschreibung bleibt bis zur Freigabe verborgen. Jedes Projekt hat seinen eigenen Code." : "Deine Lehrkraft gibt dir den Code, wenn du für dieses Kapitel bereit bist. Die Bearbeitung allein schaltet kein weiteres Kapitel frei."}</p>
    <form className="unlockForm" onSubmit={submit}><label htmlFor={id}>{project ? "Projektcode" : "Kapitelcode"}</label><div className="unlockRow"><input id={id} type="password" autoComplete="off" autoCapitalize="none" spellCheck={false} value={code} onChange={event => setCode(event.target.value)} disabled={busy} required aria-describedby={error ? id + "-error" : undefined} /><button className="primaryButton" disabled={busy || !code.trim()}>{busy ? "Wird geöffnet …" : "Inhalt öffnen"}</button></div>{error && <p id={id + "-error"} role="alert" className="unlockError">{error}</p>}</form>
    <p className="sourceNote">Groß- und Kleinschreibung sind beim Freigabecode egal. Nach dem Neuladen wird der Inhalt wieder gesperrt. Für Musterlösungen gilt ein zusätzlicher Lösungscode.</p>
  </section>;
}
