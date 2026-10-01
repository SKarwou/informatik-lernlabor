import { useEffect, useId, useMemo, useReducer, useState } from "react";
import type { KeyboardEvent } from "react";
import "./ComputerFlowLab.css";

export type ComputerFlowScenario = "calculate" | "edit";
export type ComputerFlowPart = "input" | "cpu" | "ram" | "ssd" | "display";
export type ComputerFlowRoute = "input-cpu" | "ssd-ram" | "ram-cpu" | "cpu-ram" | "cpu-display" | "ram-ssd";
export type ComputerFlowState = { scenario: ComputerFlowScenario; saveBeforePowerLoss: boolean; step: number };
export type ComputerFlowAction = { type: "next" | "previous" | "reset" } | { type: "scenario"; scenario: ComputerFlowScenario } | { type: "save-choice"; save: boolean };
export type ComputerFlowFrame = {
  id: string; title: string; explanation: string; software: string; operatingSystem: string;
  powered: boolean; appLoaded: boolean; ramText: string | null; expression: string | null;
  result: number | null; savedText: string; screen: string; cpu: string;
  active: readonly ComputerFlowPart[]; route: ComputerFlowRoute | null; transfer: string;
};

const ORIGINAL_TEXT = "Treffen um 14 Uhr.";
const CHANGED_TEXT = "Treffen um 15 Uhr.";
const PARTS: Record<ComputerFlowPart, { name: string; short: string; description: string; distinction: string }> = {
  input: { name: "Tastatur · Eingabe", short: "Eingabe", description: "Ein Tastendruck liefert ein Signal. Das Betriebssystem und das gerade benutzte Programm verarbeiten es. Die Tastatur berechnet nicht selbst die eingegebene Aufgabe.", distinction: "In diesem Modell steht die Tastatur auch für das Auslösen von „Öffnen“ und „Speichern“." },
  cpu: { name: "CPU · Prozessor", short: "CPU", description: "Die CPU führt Programmbefehle aus. Dadurch werden Daten verarbeitet, zum Beispiel zwei Zahlen addiert oder eine Textänderung vorgenommen. Sie führt auch die Befehle des Betriebssystems aus.", distinction: "Die CPU ist kein dauerhafter Ablageort deiner Dokumente. Kleine interne CPU-Speicher sind hier nicht einzeln dargestellt." },
  ram: { name: "RAM · Arbeitsspeicher", short: "RAM", description: "Hier hält der Computer geladene Programmteile und aktuelle Arbeitsdaten bereit. Die CPU kann benötigte Daten lesen und veränderte Werte zurückschreiben.", distinction: "Bei vollständigem Stromverlust ist dieser Arbeitszustand im Modell verloren. Im RAM vorhanden heißt nicht: als Datei gespeichert." },
  ssd: { name: "SSD · Dateispeicher", short: "SSD", description: "Auf der SSD liegen installierte Programmdateien und gespeicherte Dokumente. Beim Öffnen werden benötigte Teile in den RAM geladen. Beim Speichern werden geänderte Dokumentdaten als Datei abgelegt.", distinction: "Fertig gespeicherte Daten bleiben bei unserem gewöhnlichen Stromausfall erhalten. Die Datei wird im Modell nicht von selbst mit jeder Textänderung aktualisiert." },
  display: { name: "Bildschirm · Ausgabe", short: "Bildschirm", description: "Der Bildschirm zeigt das vom Programm vorbereitete Bild, zum Beispiel die Zahl 12 oder einen bearbeiteten Text. Die eigentliche Rechnung übernimmt nicht der Bildschirm.", distinction: "Sichtbar heißt nicht gespeichert! Die Anzeige kann eine Änderung zeigen, während die SSD noch die alte Datei enthält." },
};
const PART_ORDER: readonly ComputerFlowPart[] = ["input", "cpu", "ram", "ssd", "display"];

/** Fresh teaching snapshots; no real files, keystrokes or hardware are accessed. */
export function createComputerFlowTrace(scenario: ComputerFlowScenario, saveBeforePowerLoss = false): ComputerFlowFrame[] {
  if ((scenario !== "calculate" && scenario !== "edit") || typeof saveBeforePowerLoss !== "boolean") throw new RangeError("Unbekanntes Szenario oder ungültige Speicherentscheidung.");
  const calculating = scenario === "calculate";
  const app = calculating ? "Rechner" : "Textprogramm";
  const frames: ComputerFlowFrame[] = [];
  let current: ComputerFlowFrame = {
    id: "ready", title: "Der Computer ist bereit; die Anwendung noch nicht geöffnet",
    explanation: `Das Betriebssystem läuft bereits. Die Programmdatei „${app}“ liegt auf der SSD. Sie wird durch ihr bloßes Vorhandensein noch nicht ausgeführt.`,
    software: `${app}: noch nicht geöffnet.`, operatingSystem: "Läuft bereits und wartet auf deine Eingabe.",
    powered: true, appLoaded: false, ramText: null, expression: null, result: null, savedText: ORIGINAL_TEXT,
    screen: "Desktop", cpu: "Führt unter anderem Betriebssystembefehle aus.", active: ["ssd"], route: null, transfer: "Noch kein hervorgehobener Datenweg.",
  };
  frames.push(current);
  const add = (id: string, title: string, explanation: string, patch: Partial<ComputerFlowFrame>) => {
    current = { ...current, id, title, explanation, active: [], route: null, transfer: "Kein einzelner Datenweg hervorgehoben.", ...patch };
    frames.push(current);
  };
  add("open-request", `Du wählst „${app} öffnen“`, "Die Tastatur liefert die Eingabe. Über das Betriebssystem wird daraus der Auftrag, diese Anwendung zu starten. Ein Klick mit der Maus könnte denselben Auftrag auslösen.", {
    route: "input-cpu", active: ["input", "cpu"], transfer: `Eingabe: ${app} öffnen`, operatingSystem: "Verarbeitet den Startauftrag und organisiert das Laden.", cpu: "Verarbeitet den Startauftrag mithilfe des Betriebssystems.",
  });
  add("load", "Benötigte Programmteile werden in den RAM geladen", calculating
    ? "Das Betriebssystem organisiert das Laden von der SSD in den RAM. Die ursprüngliche Programmdatei bleibt dabei auf der SSD: Laden bedeutet hier kopieren, nicht wegnehmen."
    : "Das Betriebssystem lädt benötigte Teile des Textprogramms und die Datei notiz.txt in den RAM. Auf der SSD bleibt die gespeicherte Fassung „Treffen um 14 Uhr.“ erhalten.", {
    route: "ssd-ram", active: ["ssd", "ram"], transfer: calculating ? "Programmteile laden" : "Programmteile + notiz.txt laden", appLoaded: true,
    ramText: calculating ? null : ORIGINAL_TEXT, software: `${app}: benötigte Programmteile sind im RAM.`, operatingSystem: "Veranlasst den Lesevorgang vom Dateispeicher.",
  });
  add("execute", "Die CPU führt geladene Programmbefehle aus", "Ein Programm besteht aus Anweisungen. Die CPU liest benötigte Befehle und Daten und führt sie aus. Das Betriebssystem unterstützt die Anwendung dabei, zum Beispiel beim Zugriff auf Geräte.", {
    route: "ram-cpu", active: ["ram", "cpu"], transfer: "Benötigte Befehle und Daten", software: `${app}: wird ausgeführt.`, operatingSystem: "Stellt der Anwendung Dienste für Ein- und Ausgabe bereit.", cpu: `Führt Befehle des Programms „${app}“ aus.`,
  });
  add("show-window", "Das Programm wird auf dem Bildschirm sichtbar", "Programm und Betriebssystem bereiten die Ausgabe vor. Die Bildschirmtechnik zeigt sie an. Der Pfeil fasst diesen Ausgabeweg zusammen; eine Grafikeinheit ist nicht einzeln eingezeichnet.", {
    route: "cpu-display", active: ["cpu", "display"], transfer: "Vorbereitete Bildschirmausgabe", screen: calculating ? "Rechner bereit" : ORIGINAL_TEXT,
  });
  if (calculating) {
    add("type", "Du gibst 7 + 5 ein und bestätigst", "Die Tastatur meldet Eingaben. Rechnerprogramm und Betriebssystem lassen sie von der CPU verarbeiten. In diesem Schritt betrachten wir die Eingabe als einen zusammengefassten Auftrag.", {
      route: "input-cpu", active: ["input", "cpu"], transfer: "Eingabe: 7 + 5, bestätigen", cpu: "Verarbeitet die Eingabe für das Rechnerprogramm.", operatingSystem: "Leitet die Eingabe an die aktive Anwendung weiter.",
    });
    add("remember-input", "Das Programm hält die Eingabe im RAM bereit", "Die Arbeitsdaten lauten jetzt 7 + 5. Eine andere Eingabe würde andere Daten liefern; die Rechenanweisungen des Programms wären weiterhin dieselben.", {
      route: "cpu-ram", active: ["cpu", "ram"], transfer: "Eingabe als Arbeitsdaten", expression: "7 + 5", cpu: "Legt die Eingabedaten im Arbeitsspeicher ab.", software: "Rechner: Eingabe als Zahlen und Rechenauftrag verarbeiten.",
    });
    add("read-operands", "Die CPU liest die benötigten Werte", "Die Werte 7 und 5 werden für den Additionsbefehl bereitgestellt. In einem echten Prozessor gibt es dafür zusätzlich sehr kleine interne Speicher; wir zeichnen diese nicht einzeln.", {
      route: "ram-cpu", active: ["ram", "cpu"], transfer: "Werte 7 und 5", cpu: "Die Werte für den Additionsbefehl sind bereit.",
    });
    add("calculate", "Die CPU berechnet: 7 + 5 = 12", "Der Additionsbefehl des Rechnerprogramms wird ausgeführt. Das Ergebnis lautet 12. RAM und SSD führen diese Addition nicht selbst aus.", {
      active: ["cpu"], transfer: "Hier wird gerechnet, nicht übertragen.", cpu: "Addition ausgeführt: 7 + 5 = 12.", software: "Rechner: Ergebnis der Addition ist 12.",
    });
    add("remember-result", "Das Ergebnis wird als Arbeitswert abgelegt", "In unserem Modell wird das Ergebnis 12 in den RAM geschrieben. Es ist dadurch verfügbar, aber noch keine gespeicherte Dokumentdatei auf der SSD.", {
      route: "cpu-ram", active: ["cpu", "ram"], transfer: "Ergebnis 12", result: 12, cpu: "Schreibt das Ergebnis in den Arbeitsspeicher.",
    });
    add("show-result", "Der Bildschirm zeigt 12", "Das Rechnerprogramm veranlasst die Ausgabe. Der Bildschirm zeigt den Wert; er hat ihn nicht berechnet. Die SSD war zum Laden des Programms nötig, nicht als Rechenwerk für 7 + 5.", {
      route: "cpu-display", active: ["cpu", "display"], transfer: "Ausgabe: 12", screen: "12", cpu: "Veranlasst mit dem Betriebssystem die Ausgabe.", operatingSystem: "Unterstützt die Ausgabe auf dem Bildschirm.",
    });
  } else {
    add("edit-input", "Du änderst die Uhrzeit von 14 auf 15 Uhr", "Die Tastatur meldet deine Änderung. Das Textprogramm lässt die CPU die aktuelle Arbeitsfassung bearbeiten. Alle Änderungen in diesem Labor sind vorgegeben; du tippst hier keine echten Dokumente ein.", {
      route: "input-cpu", active: ["input", "cpu"], transfer: "Eingabe: 14 durch 15 ersetzen", cpu: "Verarbeitet die Textänderung.", operatingSystem: "Leitet die Eingabe an das Textprogramm weiter.",
    });
    add("edit-ram", "Im RAM liegt jetzt die geänderte Arbeitsfassung", "Die aktuelle Fassung lautet „Treffen um 15 Uhr.“. Die Datei auf der SSD lautet weiterhin „Treffen um 14 Uhr.“. Arbeitsspeicher und gespeicherte Datei können also unterschiedliche Fassungen enthalten.", {
      route: "cpu-ram", active: ["cpu", "ram"], transfer: "Geänderte Arbeitsfassung", ramText: CHANGED_TEXT, cpu: "Ändert die Arbeitsdaten des Textprogramms.", software: "Textprogramm: Änderung vorhanden, noch nicht gespeichert.",
    });
    add("show-edit", "Du siehst den neuen Text – er ist noch nicht gespeichert", "Auf dem Bildschirm steht jetzt 15 Uhr. Sichtbarkeit ist kein Speicherbeleg: Vergleiche unten die RAM-Fassung mit notiz.txt auf der SSD.", {
      route: "cpu-display", active: ["cpu", "display"], transfer: "Geänderten Text anzeigen", screen: CHANGED_TEXT, cpu: "Veranlasst die aktualisierte Anzeige.",
    });
    if (saveBeforePowerLoss) {
      add("save-request", "Du löst ausdrücklich „Speichern“ aus", "Die Eingabe erreicht das Textprogramm. Es beauftragt über das Betriebssystem das Schreiben der Arbeitsfassung. Der Auftrag allein ist noch nicht die abgeschlossene Speicherung.", {
        route: "input-cpu", active: ["input", "cpu"], transfer: "Eingabe: Speichern", operatingSystem: "Nimmt den Schreibauftrag des Textprogramms an.", cpu: "Verarbeitet den Speicherauftrag.",
      });
      add("save-complete", "Die geänderte Datei ist fertig auf der SSD gespeichert", "Die Dokumentdaten werden aus dem Arbeitsbereich auf die SSD geschrieben. Wir betrachten hier den abgeschlossenen Schreibvorgang: notiz.txt enthält nun „Treffen um 15 Uhr.“. Die Arbeitsfassung bleibt zugleich im RAM.", {
        route: "ram-ssd", active: ["ram", "ssd"], transfer: "Arbeitsfassung als Datei speichern", savedText: CHANGED_TEXT, software: "Textprogramm: aktuelle Fassung gespeichert.", operatingSystem: "Der Schreibvorgang ist vollständig abgeschlossen.",
      });
    }
    add("power-loss", "Modell-Stromausfall: Was bleibt übrig?", saveBeforePowerLoss
      ? "Die CPU arbeitet nicht mehr, der Bildschirm wird dunkel und der RAM-Arbeitszustand geht verloren. Auf der SSD bleibt die bereits fertig gespeicherte Fassung mit 15 Uhr erhalten."
      : "Die CPU arbeitet nicht mehr, der Bildschirm wird dunkel und der RAM-Arbeitszustand geht verloren. Die nicht gespeicherte Änderung auf 15 Uhr ist weg. Auf der SSD bleibt die frühere Datei mit 14 Uhr erhalten.", {
      powered: false, appLoaded: false, ramText: null, expression: null, result: null, screen: "Ausgeschaltet", cpu: "Aus – führt keine Befehle aus.",
      software: "Keine Anwendung wird ausgeführt.", operatingSystem: "Wird ohne Strom nicht ausgeführt.", active: ["ssd"], transfer: "Kein Datenverkehr. Nur die gespeicherte Datei bleibt erhalten.",
    });
    add("restart", "Der Computer wird neu gestartet", "Wir fassen den Startvorgang zu einem Lernschritt zusammen. Das Betriebssystem wird wieder geladen und ausgeführt. Der frühere RAM-Inhalt kommt dadurch nicht zurück; das Textprogramm ist noch geschlossen.", {
      powered: true, route: "ssd-ram", active: ["ssd", "ram"], transfer: "Betriebssystem neu laden", screen: "Desktop", cpu: "Führt wieder Betriebssystembefehle aus.", operatingSystem: "Neu gestartet und bereit.", software: "Textprogramm: noch nicht wieder geöffnet.",
    });
    add("reopen-request", "Du öffnest notiz.txt erneut", "Über deine Eingabe erhält das Betriebssystem den Auftrag, das Textprogramm und die gespeicherte Datei erneut zu öffnen. Es kann nur den noch vorhandenen Dateistand laden.", {
      route: "input-cpu", active: ["input", "cpu"], transfer: "Eingabe: notiz.txt öffnen", operatingSystem: "Organisiert das erneute Öffnen.",
    });
    add("reload", "Die gespeicherte Fassung wird neu in den RAM geladen", `Auf der SSD steht „${current.savedText}“. Genau diese Fassung wird geladen, nicht eine zuvor verlorene Änderung.`, {
      route: "ssd-ram", active: ["ssd", "ram"], transfer: "Programmteile + gespeicherte Datei", appLoaded: true, ramText: current.savedText, software: "Textprogramm: benötigte Teile sind wieder geladen.", operatingSystem: "Lädt die vorhandene Datei vom Dateispeicher.",
    });
    add("rerun", "Die CPU verarbeitet die geladene Datei", "Die CPU führt die Befehle des Textprogramms mit den erneut geladenen Daten aus. Ein Neustart kann keine nicht gespeicherte Änderung aus dem Nichts rekonstruieren.", {
      route: "ram-cpu", active: ["ram", "cpu"], transfer: "Geladene Befehle und Dateidaten", cpu: "Führt das Textprogramm mit der gespeicherten Fassung aus.", software: "Textprogramm: gespeicherte Fassung wieder geöffnet.",
    });
    add("show-restored", "Jetzt siehst du, welche Fassung geblieben ist", saveBeforePowerLoss
      ? "Es erscheint wieder „Treffen um 15 Uhr.“. Nicht der RAM hat den Stromausfall überstanden: Die neue Fassung war vorher fertig auf der SSD gespeichert und wurde neu geladen."
      : "Es erscheint „Treffen um 14 Uhr.“. Die SSD hatte nur diese alte Fassung gespeichert. Das zwischenzeitlich sichtbare „15 Uhr“ war nicht gesichert.", {
      route: "cpu-display", active: ["cpu", "display"], transfer: "Wieder geöffnete Datei anzeigen", screen: current.savedText, operatingSystem: "Unterstützt wieder die Bildschirmausgabe.",
    });
  }
  return frames;
}

export function createComputerFlowState(): ComputerFlowState { return { scenario: "calculate", saveBeforePowerLoss: false, step: 0 }; }

/** Navigation changes the teaching snapshot, never a real computer's state. */
export function computerFlowReducer(state: ComputerFlowState, action: ComputerFlowAction): ComputerFlowState {
  const length = createComputerFlowTrace(state.scenario, state.saveBeforePowerLoss).length;
  if (!Number.isInteger(state.step) || state.step < 0 || state.step >= length) throw new RangeError("Ungültiger Lernschritt.");
  if (action.type === "scenario") {
    createComputerFlowTrace(action.scenario, state.saveBeforePowerLoss);
    return { ...state, scenario: action.scenario, step: 0 };
  }
  if (action.type === "save-choice") {
    if (typeof action.save !== "boolean") throw new RangeError("Die Speicherentscheidung muss eindeutig sein.");
    return { ...state, saveBeforePowerLoss: action.save, step: 0 };
  }
  if (action.type === "reset") return { ...state, step: 0 };
  if (action.type === "next") return { ...state, step: Math.min(length - 1, state.step + 1) };
  if (action.type === "previous") return { ...state, step: Math.max(0, state.step - 1) };
  return state;
}

const PLACES: Record<ComputerFlowPart, { x: number; y: number; w: number; h: number }> = {
  input: { x: 100, y: 335, w: 162, h: 83 }, cpu: { x: 373, y: 232, w: 136, h: 113 },
  ram: { x: 672, y: 122, w: 168, h: 85 }, ssd: { x: 672, y: 335, w: 168, h: 86 }, display: { x: 100, y: 116, w: 162, h: 101 },
};
const ROUTES: Record<ComputerFlowRoute, string> = {
  "input-cpu": "M 190 330 L 294 263", "ssd-ram": "M 763 335 H779 V122 H769", "ram-ssd": "M 763 137 H790 V335 H769",
  "ram-cpu": "M 575 147 L 453 205", "cpu-ram": "M 453 218 L 575 161", "cpu-display": "M 292 205 L 191 148",
};

function FlowDiagram({ frame, selected, id, onPart, reducedMotion }: { frame: ComputerFlowFrame; selected: ComputerFlowPart; id: string; onPart: (part: ComputerFlowPart) => void; reducedMotion: boolean }) {
  const key = (event: KeyboardEvent<SVGGElement>, part: ComputerFlowPart) => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onPart(part); }
  };
  return <svg className="flowpc-svg" viewBox="0 0 800 452" role="group" aria-labelledby={`${id}-diagram-title`} aria-describedby={`${id}-diagram-description`}>
    <title id={`${id}-diagram-title`}>Wie Eingabe, CPU, RAM, SSD und Bildschirm zusammenarbeiten</title>
    <desc id={`${id}-diagram-description`}>Beschriftetes, vereinfachtes Hardwaremodell. Die Bauteile sind anklickbar. Dieselben Erklärungen erreichst du über die Bauteil-Schaltflächen unterhalb der Grafik. Aktueller Datenweg: {frame.transfer}</desc>
    <defs><marker id={`${id}-arrow`} markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="userSpaceOnUse"><path d="M1 1 L11 6 L1 11 Z" fill="#286545" /></marker></defs>
    <path d="M35 400 L305 133 L759 59 L771 392 L285 431 Z" className="flowpc-floor" aria-hidden="true" />
    <text x="29" y="31" className="flowpc-svg-kicker">HARDWARE · KÖRPERLICHE BAUTEILE</text>
    <g aria-hidden="true">{["input-cpu", "ssd-ram", "ram-cpu", "cpu-display"].map(route => <path key={route} d={ROUTES[route as ComputerFlowRoute]} className="flowpc-route-base" />)}
      {frame.route && <path key={frame.id} d={ROUTES[frame.route]} className={`flowpc-route-active${reducedMotion ? "" : " flowpc-route-motion"}`} markerEnd={`url(#${id}-arrow)`} />}
    </g>
    {PART_ORDER.map(part => {
      const point = PLACES[part], active = frame.active.includes(part), entry = PARTS[part];
      return <g key={part} className="flowpc-part" role="button" tabIndex={0} aria-label={`${entry.name}: Erklärung öffnen`} aria-pressed={selected === part} aria-controls={`${id}-part-explanation`} onClick={() => onPart(part)} onKeyDown={event => key(event, part)} transform={`translate(${point.x} ${point.y})`}>
        <title>{`${entry.name} · Erklärung öffnen`}</title>
        <path d={`M ${-point.w / 2} ${-point.h / 2} l 9 -9 h ${point.w} v ${point.h} l -9 9 Z`} className="flowpc-part-side" />
        <rect x={-point.w / 2} y={-point.h / 2} width={point.w} height={point.h} rx="9" className="flowpc-part-face" data-active={active} data-selected={selected === part} />
        {part === "input" && <g aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <rect key={i} x={-61 + (i % 5) * 25} y={-20 + Math.floor(i / 5) * 17} width="18" height="10" rx="2" className="flowpc-key" />)}<path d="M-40 20 H40" className="flowpc-icon-line" /></g>}
        {part === "cpu" && <g aria-hidden="true"><rect x="-28" y="-34" width="56" height="57" rx="4" className="flowpc-chip" /><text x="0" y="1" textAnchor="middle" className="flowpc-symbol">CPU</text>{[-20,0,20].map(x => <path key={x} d={`M${x} -42 v8 M${x} 23 v8`} className="flowpc-icon-line" />)}</g>}
        {part === "ram" && <g aria-hidden="true">{[-52,-13,26].map(x => <rect key={x} x={x} y="-21" width="28" height="30" rx="2" className="flowpc-chip" />)}<path d="M-58 23 H57" className="flowpc-icon-line" /></g>}
        {part === "ssd" && <g aria-hidden="true"><rect x="-54" y="-24" width="108" height="40" rx="4" className="flowpc-chip" /><text x="0" y="3" textAnchor="middle" className="flowpc-symbol">Dateien</text><circle cx="53" cy="28" r="3" fill="#386948" /></g>}
        {part === "display" && <g aria-hidden="true"><rect x="-66" y="-34" width="132" height="58" rx="4" className="flowpc-screen" data-off={!frame.powered} /><text x="0" y="1" textAnchor="middle" className="flowpc-screen-text">{!frame.powered ? "aus" : frame.screen === "12" ? "12" : frame.screen.includes("15 Uhr") ? "15 Uhr" : frame.screen.includes("14 Uhr") ? "14 Uhr" : frame.screen === "Desktop" ? "Desktop" : "Rechner"}</text><path d="M0 25 V39 M-23 39 H23" className="flowpc-icon-line" /></g>}
        <text x="0" y={point.h / 2 + 29} textAnchor="middle" className="flowpc-part-label">{part === "input" ? "Tastatur / Eingabe" : part === "ram" ? "RAM / Arbeitsspeicher" : part === "ssd" ? "SSD / Dateispeicher" : part === "display" ? "Bildschirm / Ausgabe" : "CPU / Prozessor"}</text>
        {active && <text x="0" y={point.h / 2 + 48} textAnchor="middle" className="flowpc-active-label">{frame.powered ? "IM AKTUELLEN SCHRITT" : "DATEI BLEIBT ERHALTEN"}</text>}
      </g>;
    })}
  </svg>;
}

function useFlowReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(query.matches);
    change(); query.addEventListener("change", change);
    return () => query.removeEventListener("change", change);
  }, []);
  return reduced;
}

export default function ComputerFlowLab() {
  const id = useId().replaceAll(":", "");
  const [state, dispatch] = useReducer(computerFlowReducer, undefined, createComputerFlowState);
  const [selected, setSelected] = useState<ComputerFlowPart>("cpu");
  const [playing, setPlaying] = useState(false);
  const reducedMotion = useFlowReducedMotion();
  const trace = useMemo(() => createComputerFlowTrace(state.scenario, state.saveBeforePowerLoss), [state.scenario, state.saveBeforePowerLoss]);
  const frame = trace[state.step], last = state.step === trace.length - 1;
  useEffect(() => {
    if (!playing) return;
    if (last || reducedMotion) { setPlaying(false); return; }
    const timer = window.setTimeout(() => dispatch({ type: "next" }), 6500);
    return () => window.clearTimeout(timer);
  }, [playing, last, reducedMotion, state.step]);
  const navigate = (action: ComputerFlowAction) => { setPlaying(false); dispatch(action); };
  const selectPart = (part: ComputerFlowPart) => { setPlaying(false); setSelected(part); };
  const differentVersions = frame.ramText !== null && frame.ramText !== frame.savedText;
  const entry = PARTS[selected];
  return <section className="flowpc" aria-labelledby={`${id}-title`}>
    <span className="flowpc-kicker">VOM BAUTEIL ZUM ABLAUF · SELBST ERKUNDEN</span>
    <h3 id={`${id}-title`}>Wie arbeiten Hardware und Software zusammen?</h3>
    <p className="flowpc-intro">Du kennst jetzt die Bauteile. Aber wie entsteht aus einem Tastendruck eine Rechnung oder eine gespeicherte Datei? Folge einem Auftrag durch den Computer. Jeder Klick zeigt einen überschaubaren Lernschritt.</p>
    <ol className="flowpc-start"><li><strong>Wähle eine Szene.</strong> Beginne mit der Rechnung.</li><li><strong>Vermute den nächsten Weg.</strong> Nutze dann „Nächster Schritt“.</li><li><strong>Vergleiche die Speicher.</strong> Klicke Bauteile an, wenn du ihre Aufgabe nachlesen möchtest.</li></ol>
    <div className="flowpc-scenarios" role="group" aria-label="Alltagsszene auswählen">
      <button type="button" aria-pressed={state.scenario === "calculate"} onClick={() => navigate({ type: "scenario", scenario: "calculate" })}>1 · Programm öffnen und 7 + 5 rechnen</button>
      <button type="button" aria-pressed={state.scenario === "edit"} onClick={() => navigate({ type: "scenario", scenario: "edit" })}>2 · Text ändern, speichern und Stromausfall</button>
    </div>
    {state.scenario === "edit" && <fieldset className="flowpc-save-choice"><legend>Was soll vor dem Stromausfall passieren?</legend>
      <label><input type="radio" name={`${id}-save`} checked={!state.saveBeforePowerLoss} onChange={() => navigate({ type: "save-choice", save: false })} />Nicht speichern</label>
      <label><input type="radio" name={`${id}-save`} checked={state.saveBeforePowerLoss} onChange={() => navigate({ type: "save-choice", save: true })} />Speichern vollständig abschließen</label>
      <p>Ein Wechsel startet diese Szene von vorne. Vermute: Steht nach dem Neustart 14 Uhr oder 15 Uhr in der Datei?</p>
    </fieldset>}
    <div className="flowpc-software"><div><span>SOFTWARE · ANWENDUNG</span><strong>{state.scenario === "calculate" ? "Rechnerprogramm" : "Textprogramm"}</strong><p>{frame.software}</p></div><div><span>SOFTWARE · BETRIEBSSYSTEM</span><strong>Organisiert die Zusammenarbeit</strong><p>{frame.operatingSystem}</p></div></div>
    <p className="flowpc-note">Software sind Anweisungen und Programme, keine zusätzlichen Kästen im PC. Auch das Betriebssystem ist Software; seine Befehle führt die CPU aus.</p>
    <div className="flowpc-explore">
      <div className="flowpc-diagram-scroll" role="region" tabIndex={0} aria-label="Hardware-Schaubild; bei Bedarf seitlich verschiebbar"><FlowDiagram frame={frame} selected={selected} id={id} onPart={selectPart} reducedMotion={reducedMotion} /></div>
      <div className="flowpc-now" role="status" aria-live="polite" aria-atomic="true"><span className="flowpc-kicker">{state.step === 0 ? "VOR DEM START" : `SCHRITT ${state.step} VON ${trace.length - 1}`}</span><h4>{frame.title}</h4><p>{frame.explanation}</p><div className="flowpc-transfer"><strong>{frame.route ? "Hervorgehobener Datenweg" : "Gerade wichtig"}</strong><span>{frame.transfer}</span></div></div>
    </div>
    <div className="flowpc-controls" role="group" aria-label="Ablauf steuern"><button type="button" disabled={state.step === 0} onClick={() => navigate({ type: "previous" })}>← Schritt zurück</button><button type="button" className="flowpc-primary" disabled={last} onClick={() => navigate({ type: "next" })}>{trace[state.step + 1]?.id === "power-loss" ? "Modell-Stromausfall auslösen →" : trace[state.step + 1]?.id === "restart" ? "Modell-PC neu starten →" : state.step === 0 ? "Mit Schritt 1 beginnen →" : "Nächster Schritt →"}</button><button type="button" disabled={!playing && (last || reducedMotion)} aria-pressed={playing} onClick={() => setPlaying(value => !value)}>{playing ? "Abspielen pausieren" : "Bis zum Ende abspielen"}</button><button type="button" onClick={() => navigate({ type: "reset" })}>Szene neu starten</button></div>
    <p className="flowpc-note">{reducedMotion ? "Reduzierte Bewegung ist eingeschaltet: keine Pfeilanimation und kein automatisches Abspielen. Nutze die einzelnen Schritte." : "Nichts startet von selbst. Abspielen wechselt alle 6,5 Sekunden einen Schritt und stoppt am Ende. Ein Bauteilklick pausiert die Wiedergabe."} „Schritt zurück“ zeigt einen früheren Modellzustand; ein echter Stromausfall lässt sich damit nicht rückgängig machen.</p>
    <div className="flowpc-state-grid">
      <article className="flowpc-state"><h4>RAM · jetzt im Arbeitsbereich</h4><p>{!frame.powered ? "Stromlos: vorheriger Arbeitszustand verloren." : <>{frame.appLoaded ? `${state.scenario === "calculate" ? "Rechner" : "Textprogramm"} geladen.` : "Betriebssystem geladen; Anwendung noch nicht geöffnet."}{frame.ramText !== null && <><br /><strong>{frame.ramText}</strong></>}{frame.expression !== null && <><br />Eingabe: <strong>{frame.expression}</strong></>}{frame.result !== null && <><br />Ergebnis: <strong>{frame.result}</strong></>}</>}</p><span>Flüchtig: wird im Stromausfall nicht erhalten.</span></article>
      <article className="flowpc-state"><h4>SSD · gespeicherte Dateien</h4><p>Betriebssystem und Programmdateien bleiben abgelegt.{state.scenario === "edit" && <><br /><code>notiz.txt</code>: <strong>{frame.savedText}</strong></>}{state.scenario === "calculate" && <><br />Das Rechenergebnis wird hier nicht als Datei gespeichert.</>}</p><span>Nichtflüchtig: bleibt im Modell ohne Strom erhalten.</span></article>
      <article className="flowpc-state"><h4>Bildschirm · sichtbar</h4><p className="flowpc-output" data-off={!frame.powered}>{frame.screen}</p><span>Anzeige ist keine Bestätigung, dass eine Datei gespeichert wurde.</span></article>
    </div>
    {differentVersions && <p className="flowpc-warning"><strong>Zwei verschiedene Fassungen!</strong> Im RAM steht 15 Uhr, auf der SSD noch 14 Uhr. Erst ein abgeschlossener Speichervorgang sichert die Änderung im Dateispeicher.</p>}
    <p className="flowpc-cpu-state"><strong>CPU im aktuellen Schritt:</strong> {frame.cpu}</p>
    <div className="flowpc-part-buttons" role="group" aria-label="Bauteil genauer kennenlernen">{PART_ORDER.map(part => <button key={part} type="button" aria-pressed={selected === part} aria-controls={`${id}-part-explanation`} onClick={() => selectPart(part)}>{PARTS[part].name}</button>)}</div>
    <article className="flowpc-explanation" id={`${id}-part-explanation`} aria-live="polite" aria-atomic="true"><h4>{entry.name}</h4><p>{entry.description}</p><p><strong>Nicht verwechseln:</strong> {entry.distinction}</p></article>
    <details className="flowpc-model-note"><summary>Welche Vereinfachungen macht dieses Modell?</summary><p>Die Schritte sind Lernabschnitte, keine einzelnen CPU-Takte. Pfeile zeigen wichtige Datenwege, nicht den genauen Verlauf elektrischer Leitungen. Daten von SSD zu RAM werden von Speichertechnik und Betriebssystem organisiert; die CPU steuert den Ablauf durch Befehle mit. Controller, interne CPU-Speicher und Grafikeinheit sind nicht einzeln gezeigt.</p><p>Der Computer ist am Anfang bereits gestartet. Es gibt hier keine automatische Sicherung, Cloud, Auslagerung, Standby oder Ruhezustand. Vor dem Stromausfall ist ein gewählter Speichervorgang vollständig beendet. Störungen während des Schreibens und Hardwaredefekte gehören nicht zu diesem Modell. Das ist eine Simulation, keine Aufforderung, echte Geräte vom Strom zu trennen.</p></details>
    <p className="flowpc-remember"><strong>Merksatz:</strong> Software legt Anweisungen fest. Die CPU führt sie aus, RAM hält aktuelle Arbeitsdaten bereit, SSD bewahrt gespeicherte Dateien auf, und der Bildschirm zeigt eine Ausgabe.</p>
    <p className="flowpc-question"><strong>Erkläre es jemandem:</strong> {state.scenario === "calculate" ? "Warum können Rechnerprogramm und Betriebssystem keine Arbeit verrichten, wenn die Hardware ausgeschaltet ist? Was unterscheidet den Wert 12 im RAM von seiner Anzeige?" : "Warum kann ein Text auf dem Bildschirm schon geändert sein, obwohl nach dem Neustart die alte Fassung erscheint? Vergleiche beide Speicher-Varianten."}</p>
    <p className="flowpc-note">Zusätzliches Erklärlabor. Die bisherigen Papieraufgaben und ihre Lösungssperren werden dadurch nicht verändert. Es werden keine Eingaben oder Ergebnisse gespeichert oder versendet.</p>
  </section>;
}
