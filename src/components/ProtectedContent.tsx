import { createContext, useContext, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import type { SolutionPayload } from "../learningTypes";

type Payload = SolutionPayload & { html?: string };
type Access = { payloads: Record<string, Payload>; unlock: (scope: string, password: string) => Promise<void>; lock: (scope: string) => void };
const AccessContext = createContext<Access | null>(null);
const bytes = (base64: string) => Uint8Array.from(atob(base64), (char) => char.charCodeAt(0));

export function ProtectedProvider({ children }: { children: ReactNode }) {
  const [payloads, setPayloads] = useState<Record<string, Payload>>({});
  const generations = useRef<Record<string, number>>({});
  async function unlock(scope: string, password: string) {
    const generation = generations.current[scope] || 0;
    if (!window.crypto?.subtle) throw new Error("Bitte öffne die Website über ihre https-Adresse in einem aktuellen Browser.");
    let response: Response;
    try {
      response = await fetch(`${import.meta.env.BASE_URL}protected/${encodeURIComponent(scope)}.json`, { cache: "no-store" });
    } catch {
      throw new Error("Die Datei konnte nicht geladen werden. Prüfe deine Internetverbindung und versuche es erneut.");
    }
    if (!response.ok) throw new Error("Der geschützte Inhalt ist gerade nicht erreichbar. Bitte versuche es später erneut.");
    const envelope = await response.json();
    if (envelope.format !== "AES-GCM-PBKDF2-v1" || envelope.iterations !== 600000) throw new Error("Die Datei hat ein unbekanntes Format. Bitte informiere deine Lehrkraft.");
    const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
    const key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt: bytes(envelope.salt), iterations: envelope.iterations, hash: "SHA-256" }, keyMaterial, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
    let decoded: ArrayBuffer;
    try {
      decoded = await crypto.subtle.decrypt({ name: "AES-GCM", iv: bytes(envelope.iv), additionalData: new TextEncoder().encode(scope) }, key, bytes(envelope.ciphertext));
    } catch {
      throw new Error("Der Code passt nicht zu diesem Kapitel. Prüfe Groß- und Kleinschreibung und Bindestriche.");
    }
    const payload = JSON.parse(new TextDecoder().decode(decoded)) as Payload;
    if (payload.version !== 1 || (!Array.isArray(payload.entries) && typeof payload.html !== "string")) throw new Error("Der Inhalt konnte nicht gelesen werden.");
    if (generation === (generations.current[scope] || 0)) setPayloads((current) => ({ ...current, [scope]: payload }));
  }
  function lock(scope: string) {
    generations.current[scope] = (generations.current[scope] || 0) + 1;
    setPayloads((current) => { const next = { ...current }; delete next[scope]; return next; });
  }
  return <AccessContext.Provider value={{ payloads, unlock, lock }}>{children}</AccessContext.Provider>;
}

export function useProtected(scope: string) {
  const context = useContext(AccessContext);
  if (!context) throw new Error("ProtectedProvider fehlt.");
  return { payload: context.payloads[scope], unlock: (password: string) => context.unlock(scope, password), lock: () => context.lock(scope) };
}

export function UnlockForm({ scope, teacher = false }: { scope: string; teacher?: boolean }) {
  const { unlock } = useProtected(scope);
  const id = useId();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError("");
    try { await unlock(password.trim()); setPassword(""); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Das Öffnen hat nicht geklappt."); }
    finally { setBusy(false); }
  }
  return <form className="unlockForm" onSubmit={submit}>
    <label htmlFor={id}>{teacher ? "Lehrkraft-Passwort" : "Lösungscode für dieses Kapitel"}</label>
    <div className="unlockRow"><input id={id} type="password" autoComplete="off" autoCapitalize="none" spellCheck={false} value={password} onChange={(event) => setPassword(event.target.value)} required disabled={busy} aria-describedby={error ? `${id}-error` : undefined} /><button className="primaryButton" disabled={busy || !password.trim()} type="submit">{busy ? "Wird geöffnet …" : "Freischalten"}</button></div>
    {error && <p className="unlockError" id={`${id}-error`} role="alert">{error}</p>}
  </form>;
}

export function ChapterAccess({ scope }: { scope: string }) {
  const { payload, lock } = useProtected(scope);
  return <aside className={`chapterAccess ${payload ? "isUnlocked" : ""}`} id={scope.startsWith("projekt-") ? "loesungscode-" + scope : "loesungscode"}>
    <div><span className="eyebrow">{payload ? "FREIGESCHALTET" : "MIT LÖSUNGSCODE"}</span><h2 role="status">{payload ? "Die Musterlösungen sind geöffnet." : "Erst selbst versuchen. Dann vergleichen."}</h2><p>Im geöffneten Kapitel kannst du Beispiele und Hinweise direkt nutzen. Den zusätzlichen Code für die Musterlösungen erhältst du von deiner Lehrkraft. Er gilt für dieses Kapitel bis zum Neuladen der Seite.</p></div>
    {payload ? <button className="secondaryButton" onClick={lock}>Lösungen wieder sperren</button> : <UnlockForm scope={scope} />}
  </aside>;
}

export function Solution({ scope, id, title = "Musterlösung" }: { scope: string; id: string; title?: string }) {
  const { payload } = useProtected(scope);
  const details = useRef<HTMLDetailsElement>(null);
  const hadAccess = useRef(false);
  useEffect(() => {
    if (!payload && hadAccess.current && details.current) details.current.open = false;
    if (payload && !hadAccess.current && details.current?.open) details.current.querySelector("summary")?.focus();
    hadAccess.current = Boolean(payload);
  }, [payload]);
  const entry = payload?.entries?.find((item) => item.id === id);
  return <details className="protectedSolution" ref={details}>
    <summary>{payload ? "✓" : "🔒"} {title}{payload ? " anzeigen" : " · mit Code"}</summary>
    <div className="solutionContent">
      {!payload ? <><p>Der zusätzliche Lösungscode öffnet die Musterlösungen auf dieser Seite. Der kurze Freigabecode für das Kapitel genügt dafür nicht.</p><UnlockForm scope={scope} /></> : entry ? <><h4>{entry.title}</h4>{entry.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}{entry.code && <pre><code>{entry.code}</code></pre>}</> : <p>Für diese Aufgabe fehlt noch die Zuordnung. Bitte informiere deine Lehrkraft.</p>}
    </div>
  </details>;
}
