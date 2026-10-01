import { useId, useState } from "react";
import "./NetworkLogicLabs.css";

export type NetworkNodeId = "pc-a" | "pc-b" | "switch" | "local" | "dns" | "router" | "internet" | "web";
export type NetworkSource = "pc-a" | "pc-b";
export type NetworkTarget = "local" | "web";
export type Point3D = { x: number; y: number; z: number };
export type PacketStep = {
  phase: "Vorbereitung" | "Lokale Anfrage" | "Lokale Antwort" | "DNS-Anfrage" | "DNS-Antwort" | "Web-Anfrage" | "Web-Antwort";
  at: NetworkNodeId;
  from?: NetworkNodeId;
  title: string;
  explanation: string;
  message: string;
};

type NetworkNode = {
  id: NetworkNodeId;
  short: string;
  label: string;
  address: string;
  point: Point3D;
  flat: { x: number; y: number };
};

const NETWORK_NODES: NetworkNode[] = [
  { id: "pc-a", short: "PC 1", label: "Schul-PC 1", address: "10.23.4.22", point: { x: -300, y: 130, z: -100 }, flat: { x: 90, y: 140 } },
  { id: "pc-b", short: "PC 2", label: "Schul-PC 2", address: "10.23.4.24", point: { x: -300, y: -80, z: 100 }, flat: { x: 90, y: 350 } },
  { id: "switch", short: "SW", label: "Switch", address: "Anschlüsse im Schulnetz", point: { x: -100, y: 70, z: 0 }, flat: { x: 260, y: 240 } },
  { id: "local", short: "LAN", label: "Schulserver", address: "10.23.4.60", point: { x: -50, y: -160, z: -140 }, flat: { x: 260, y: 415 } },
  { id: "dns", short: "DNS", label: "DNS-Dienst", address: "10.23.4.53", point: { x: 45, y: -190, z: 110 }, flat: { x: 440, y: 415 } },
  { id: "router", short: "R", label: "Schulrouter", address: "im Schulnetz: 10.23.4.1", point: { x: 70, y: 80, z: -40 }, flat: { x: 440, y: 240 } },
  { id: "internet", short: "NETZ", label: "Weitere Netze", address: "mehrere Router zusammengefasst", point: { x: 220, y: 135, z: 30 }, flat: { x: 620, y: 240 } },
  { id: "web", short: "WEB", label: "Webserver", address: "203.0.113.80 · Beispieladresse", point: { x: 375, y: 135, z: -60 }, flat: { x: 800, y: 240 } },
];

const NETWORK_LINKS: [NetworkNodeId, NetworkNodeId][] = [
  ["pc-a", "switch"], ["pc-b", "switch"], ["switch", "local"], ["switch", "dns"],
  ["switch", "router"], ["router", "internet"], ["internet", "web"],
];

const nodeLabel = (id: NetworkNodeId) => NETWORK_NODES.find((node) => node.id === id)!.label;

/** Orthographic projection of genuine 3D coordinates, with yaw and a fixed elevated camera. */
export function projectNetworkPoint(point: Point3D, angleDegrees: number) {
  if (![point.x, point.y, point.z, angleDegrees].every(Number.isFinite)) {
    throw new RangeError("Koordinaten und Drehwinkel müssen endliche Zahlen sein.");
  }
  const yaw = angleDegrees * Math.PI / 180;
  const elevation = 30 * Math.PI / 180;
  const rotatedX = point.x * Math.cos(yaw) - point.z * Math.sin(yaw);
  const rotatedZ = point.x * Math.sin(yaw) + point.z * Math.cos(yaw);
  return {
    x: 450 + rotatedX * 0.95,
    y: 285 - (point.y * Math.cos(elevation) - rotatedZ * Math.sin(elevation)) * 0.95,
    depth: rotatedZ * Math.cos(elevation) + point.y * Math.sin(elevation),
  };
}

/** A teaching sequence, not a routing algorithm or an actual network request. */
export function createPacketJourney(source: NetworkSource, target: NetworkTarget): PacketStep[] {
  if ((source !== "pc-a" && source !== "pc-b") || (target !== "local" && target !== "web")) {
    throw new RangeError("Unbekannter Start oder unbekanntes Ziel im Schulnetzmodell.");
  }
  const sender = nodeLabel(source);
  const senderAddress = source === "pc-a" ? "10.23.4.22" : "10.23.4.24";
  if (target === "local") {
    return [
      { phase: "Vorbereitung", at: source, title: "Ein bekanntes Ziel im selben Netz", message: "Datei vom Schulserver anfordern",
        explanation: `${sender} (${senderAddress}) kennt die Zieladresse 10.23.4.60 schon. Mit der Maske 255.255.255.0 gehört bei beiden 10.23.4 zum Netzanteil. Das Ziel ist lokal. DNS ist in diesem Beispiel nicht nötig.` },
      { phase: "Lokale Anfrage", from: source, at: "switch", title: "Der Switch verteilt im lokalen Netz", message: "Anfrage an 10.23.4.60",
        explanation: "Der Switch bekommt einen Ethernet-Rahmen, der das IP-Paket enthält. Im Modell kennt er bereits den Anschluss des Schulservers. Er leitet anhand von Geräteadressen (MAC-Adressen) weiter; er sucht hier keinen Weg durch das Internet." },
      { phase: "Lokale Anfrage", from: "switch", at: "local", title: "Der Schulserver erhält die Anfrage", message: "Die angeforderte Datei wird gesucht",
        explanation: "Der lokale Server verarbeitet die Anfrage. Der Schulrouter war nicht beteiligt, weil das Ziel im selben lokalen Netz liegt. Der Server erstellt jetzt eine eigene Antwortnachricht." },
      { phase: "Lokale Antwort", from: "local", at: "switch", title: "Die Antwort geht zurück zum Switch", message: `Dateidaten für ${senderAddress}`,
        explanation: `Jetzt ist der Schulserver der Absender und ${sender} das Ziel. Der Switch leitet den Rahmen an den Anschluss dieses PCs weiter.` },
      { phase: "Lokale Antwort", from: "switch", at: source, title: "Die Datei ist angekommen", message: "Lokale Anfrage und Antwort abgeschlossen",
        explanation: "Der PC kann die empfangenen Dateidaten nutzen. Hin- und Rückweg blieben im Schulnetz. Ein lokaler Abruf über einen Namen könnte zusätzlich DNS brauchen; hier war die IP-Adresse bereits bekannt." },
    ];
  }
  return [
    { phase: "Vorbereitung", at: source, title: "Ein Name ist noch keine IP-Adresse", message: "lernseite.example öffnen",
      explanation: `${sender} kennt in diesem Modell den Namen lernseite.example, aber noch nicht dessen IP-Adresse. Wir nehmen an: Im PC liegt kein passender gespeicherter DNS-Eintrag vor. Daher fragt er zuerst den eingestellten DNS-Dienst.` },
    { phase: "DNS-Anfrage", from: source, at: "switch", title: "Zuerst wird die DNS-Frage verschickt", message: "Welche IPv4-Adresse gehört zu lernseite.example?",
      explanation: "Diese Nachricht fragt nur nach einer Adresse, nicht nach einer Webseite. Ihr Ziel ist unser lokaler DNS-Dienst 10.23.4.53. Sie gelangt zunächst zum Switch." },
    { phase: "DNS-Anfrage", from: "switch", at: "dns", title: "Der DNS-Dienst kennt die Zuordnung", message: "Gesucht: die Adresse zu lernseite.example",
      explanation: "Der DNS-Dienst ist hier im Schulnetz und hat einen gültigen Eintrag gespeichert. Er kann direkt antworten. Sonst müsste ein DNS-Resolver gegebenenfalls weitere DNS-Server befragen; diese zusätzliche Suche zeigen wir nicht." },
    { phase: "DNS-Antwort", from: "dns", at: "switch", title: "DNS liefert eine Adresse, keine Webseite", message: "lernseite.example → 203.0.113.80",
      explanation: "Die Antwort nennt die Beispiel-IP-Adresse des Webservers. Sie wird über den Switch zurückgeschickt. Der DNS-Dienst wird dadurch nicht zum Zwischenhalt für den späteren Webseiteninhalt." },
    { phase: "DNS-Antwort", from: "switch", at: source, title: "Der PC kennt jetzt das eigentliche Ziel", message: "Zieladresse für den Webabruf: 203.0.113.80",
      explanation: "Die Namensauflösung ist beendet. Erst jetzt beginnt eine neue Kommunikation mit dem Webserver. DNS-Anfrage und Web-Anfrage sind also verschiedene Nachrichten an verschiedene Dienste." },
    { phase: "Vorbereitung", at: source, title: "Ein anderes Zielnetz braucht einen Router", message: "Neue Anfrage an den Webserver vorbereiten",
      explanation: `Bei Maske 255.255.255.0 liegt 203.0.113.80 nicht im Netz von ${senderAddress}. Deshalb sendet der PC den Rahmen an sein Standardgateway, den Schulrouter. Die IP-Zieladresse des Webabrufs bleibt die des Webservers.` },
    { phase: "Web-Anfrage", from: source, at: "switch", title: "Der Switch bringt die Anfrage zum Router", message: "Web-Anfrage mit Ziel 203.0.113.80",
      explanation: "Auch auf dem Weg nach draußen benutzt der PC zunächst das lokale Netz. Der Switch wählt den Anschluss des Schulrouters. Er ersetzt den Router nicht." },
    { phase: "Web-Anfrage", from: "switch", at: "router", title: "Der Router verbindet die Netze", message: "Nächsten Abschnitt zum Zielnetz bestimmen",
      explanation: "Der Router schaut in seine Routingtabelle und wählt einen passenden nächsten Abschnitt. Er entscheidet nach Netzadressen und Routingregeln, nicht danach, welche Linie in dieser Zeichnung am kürzesten aussieht." },
    { phase: "Web-Anfrage", from: "router", at: "internet", title: "Im Internet folgen weitere Router", message: "Die Anfrage reist durch weitere Netze",
      explanation: "Dieses eine Symbol fasst mehrere Netze und Router zusammen. Jeder Router entscheidet über den nächsten Abschnitt. Der PC musste nicht vorher eine vollständige Liste aller Router in das Paket schreiben." },
    { phase: "Web-Anfrage", from: "internet", at: "web", title: "Der Webserver bearbeitet die Anfrage", message: "Der angefragte Webseiteninhalt wird bereitgestellt",
      explanation: "Die Anfrage erreicht den Server zur zuvor ermittelten IP-Adresse. Jetzt entsteht eine Web-Antwort mit den angeforderten Daten. Eine echte Webseite wird häufig in vielen Paketen übertragen." },
    { phase: "Web-Antwort", from: "web", at: "internet", title: "Die Antwort reist durch das Internet", message: `Webseitendaten für ${sender}`,
      explanation: "Wir verwenden für die Antwort denselben Weg in umgekehrter Richtung. Das ist eine Vereinfachung: Im echten Internet muss der Rückweg nicht mit dem Hinweg übereinstimmen." },
    { phase: "Web-Antwort", from: "internet", at: "router", title: "Zurück am Schulrouter", message: "Die Antwort gelangt wieder ins Schulnetz",
      explanation: "Der Schulrouter vermittelt zurück in das lokale Netz. Details wie die Übersetzung privater Adressen (NAT) blenden wir in dieser Übersicht aus." },
    { phase: "Web-Antwort", from: "router", at: "switch", title: "Der Switch stellt lokal zu", message: `Weiter zum Anschluss von ${sender}`,
      explanation: "Die Antwort wird im lokalen Netz zum richtigen PC geleitet. Der DNS-Dienst wird für diese Zustellung nicht erneut durchlaufen." },
    { phase: "Web-Antwort", from: "switch", at: source, title: "Der Browser kann die Daten anzeigen", message: "Namensauflösung und Webabruf abgeschlossen",
      explanation: "Merke die Aufgabenteilung: DNS lieferte die Adresse. Switches verteilten lokal. Router vermittelten zwischen Netzen. Den Webseiteninhalt lieferte der Webserver." },
  ];
}

function NetworkDiagram({ step, angle, flat, id }: { step: PacketStep; angle: number; flat: boolean; id: string }) {
  const projected = NETWORK_NODES.map((node) => ({ ...node, projected: flat
    ? { ...node.flat, depth: 0 } : projectNetworkPoint(node.point, angle) }));
  const points = Object.fromEntries(projected.map((node) => [node.id, node.projected])) as Record<NetworkNodeId, { x: number; y: number; depth: number }>;
  const floor = [
    { x: -325, y: -155, z: -140 }, { x: 385, y: -155, z: -140 },
    { x: 385, y: -155, z: 140 }, { x: -325, y: -155, z: 140 },
  ].map((point) => { const p = projectNetworkPoint(point, angle); return `${p.x},${p.y}`; }).join(" ");
  // End before the target symbol so the directional arrow remains visible.
  const transfer = step.from ? (() => {
    const start = points[step.from!];
    const end = points[step.at];
    const distance = Math.hypot(end.x - start.x, end.y - start.y);
    const inset = Math.min(43, distance / 3);
    return { start, x: end.x - (end.x - start.x) / distance * inset,
      y: end.y - (end.y - start.y) / distance * inset };
  })() : null;
  return <svg className="netlab-svg" viewBox="0 0 900 600" role="img" aria-labelledby={`${id}-diagram-title ${id}-diagram-desc`}>
    <title id={`${id}-diagram-title`}>{`${flat ? "Zweidimensionaler" : "Drehbarer dreidimensionaler"} Plan des vereinfachten Schulnetzes`}</title>
    <desc id={`${id}-diagram-desc`}>Zwei PCs, ein Schulserver und ein DNS-Dienst sind mit dem Switch verbunden.
      Der Switch führt zum Schulrouter, dieser über weitere Netze zum Webserver.
      Aktuell: {step.title}. Nachricht bei {nodeLabel(step.at)}.
      Derselbe Ablauf steht unter der Grafik als Text bereit.</desc>
    <defs><marker id={`${id}-arrow`} markerWidth="9" markerHeight="9" refX="7" refY="4.5" orient="auto" markerUnits="userSpaceOnUse">
      <path d="M 0 0 L 8 4.5 L 0 9 Z" className="netlab-arrow" />
    </marker></defs>
    {!flat && <polygon points={floor} className="netlab-floor" />}
    {NETWORK_LINKS.map(([from, to]) => <line key={`${from}-${to}`} x1={points[from].x} y1={points[from].y}
      x2={points[to].x} y2={points[to].y} className="netlab-link" />)}
    {transfer && <line x1={transfer.start.x} y1={transfer.start.y} x2={transfer.x} y2={transfer.y}
      className="netlab-active-link" markerEnd={`url(#${id}-arrow)`} />}
    {projected.sort((a, b) => b.projected.depth - a.projected.depth).map((node) => <g key={node.id}
      transform={`translate(${node.projected.x} ${node.projected.y})`}>
      {node.id === step.at && <circle r="37" className="netlab-current-halo" />}
      <rect x="-30" y="-24" width="60" height="48" rx={node.id === "internet" ? "24" : "10"}
        className={node.id === step.at ? "netlab-node netlab-node-current" : "netlab-node"} />
      <text className="netlab-node-short" textAnchor="middle" y="5">{node.short}</text>
      <text className="netlab-node-label" textAnchor="middle" y="49">{node.label}</text>
    </g>)}
    <text x="26" y="575" className="netlab-figure-note">{flat ? "2D-Übersicht" : "Räumliche Modellansicht"} · Grüne Markierung: aktuelle Station</text>
  </svg>;
}

export function NetworkJourneyLab() {
  const id = useId().replaceAll(":", "");
  const [source, setSource] = useState<NetworkSource>("pc-a");
  const [target, setTarget] = useState<NetworkTarget>("local");
  const [index, setIndex] = useState(0);
  const [angle, setAngle] = useState(-12);
  const [flat, setFlat] = useState(false);
  const journey = createPacketJourney(source, target);
  const step = journey[index];

  return <section className="netlogic-lab netlab" aria-labelledby={`${id}-title`}>
    <p className="netlogic-kicker">ANKLICKEN & VERSTEHEN · NETZWERKE</p>
    <h3 className="netlogic-title" id={`${id}-title`}>Wohin geht meine Nachricht?</h3>
    <p className="netlogic-intro">Eine Datei vom Schulserver und eine Webseite von außerhalb: Beides beginnt am selben PC,
      aber nicht jede Nachricht nimmt denselben Weg. Wähle Start und Ziel. Mit „Weiter“ begleitest du die Nachricht Station für Station.</p>
    <div className="netlogic-control-grid netlogic-screen-controls">
      <fieldset className="netlogic-fieldset"><legend className="netlogic-label">1 · Startgerät</legend>
        <div className="netlogic-button-row">{(["pc-a", "pc-b"] as const).map((choice) => <button className="netlogic-button"
          type="button" key={choice} aria-pressed={source === choice} onClick={() => { setSource(choice); setIndex(0); }}>
          {nodeLabel(choice)}</button>)}</div>
      </fieldset>
      <fieldset className="netlogic-fieldset"><legend className="netlogic-label">2 · Ziel</legend>
        <div className="netlogic-button-row">
          <button className="netlogic-button" type="button" aria-pressed={target === "local"}
            onClick={() => { setTarget("local"); setIndex(0); }}>Schulserver · lokal</button>
          <button className="netlogic-button" type="button" aria-pressed={target === "web"}
            onClick={() => { setTarget("web"); setIndex(0); }}>Webserver · anderes Netz</button>
        </div>
      </fieldset>
    </div>
    <div className="netlogic-model-note"><strong>Vereinfachtes Modell, kein echter Versand.</strong> Alle Schulgeräte verwenden hier
      die Maske 255.255.255.0. Der DNS-Dienst liegt bewusst im Schulnetz. Verbindungen sind vorhanden und Anschlüsse bekannt.
      Wir zeigen wichtige Stationen, keine vollständige Protokollsimulation.</div>
    <div className="netlab-view-controls netlogic-screen-controls">
      <div className="netlogic-button-row" role="group" aria-label="Darstellung des Netzplans">
        <button className="netlogic-button" type="button" aria-pressed={!flat} onClick={() => setFlat(false)}>3D-Modell</button>
        <button className="netlogic-button" type="button" aria-pressed={flat} onClick={() => setFlat(true)}>2D-Übersicht</button>
      </div>
      <label className="netlab-angle-label" htmlFor={`${id}-angle`}>Blickwinkel: {angle}°
        <input className="netlab-angle" id={`${id}-angle`} type="range" min="-25" max="25" step="1"
          value={angle} disabled={flat} aria-valuetext={`${angle} Grad`} onChange={(event) => setAngle(Number(event.target.value))} />
      </label>
    </div>
    <p className="netlogic-note">Du kannst das Modell mit dem Regler drehen; die Verbindungen bleiben gleich.
      Die räumliche Nähe bestimmt <strong>nicht</strong> den Paketweg. Auf kleinen Bildschirmen ist die Grafik seitlich verschiebbar.</p>
    <div className="netlab-diagram-scroll" role="region" tabIndex={0} aria-label="Verschiebbarer Netzwerkplan; Textalternative unter dem aktuellen Schritt">
      <NetworkDiagram step={step} angle={angle} flat={flat} id={id} />
    </div>
    <div className="netlogic-button-row netlogic-step-controls netlogic-screen-controls" role="group" aria-label="Nachrichtenweg schrittweise durchgehen">
      <button className="netlogic-button" type="button" disabled={index === 0} onClick={() => setIndex(index - 1)}>← Zurück</button>
      <button className="netlogic-button netlogic-button-primary" type="button" disabled={index === journey.length - 1}
        onClick={() => setIndex(index + 1)}>Weiter →</button>
      <button className="netlogic-button" type="button" onClick={() => setIndex(0)}>Von vorn</button>
      <span className="netlogic-progress">Schritt {index + 1} von {journey.length}</span>
    </div>
    <div className="netlogic-result" role="status" aria-live="polite" aria-atomic="true">
      <p className="netlogic-phase">{step.phase} · bei {nodeLabel(step.at)}</p>
      <h4 className="netlogic-result-title">{step.title}</h4>
      <p className="netlogic-message"><strong>Nachricht:</strong> {step.message}</p>
      <p className="netlogic-result-copy">{step.explanation}</p>
      {index === journey.length - 1 && <p className="netlogic-result-copy"><strong>Fertig!</strong> Vergleiche nun mit dem anderen Ziel.</p>}
    </div>
    <details className="netlogic-details">
      <summary className="netlogic-summary">Alle Stationen als Text lesen oder gezielt auswählen</summary>
      <ol className="netlab-text-path">{journey.map((entry, i) => <li className="netlab-text-step" key={i}>
        <button className="netlab-jump" type="button" aria-current={i === index ? "step" : undefined} onClick={() => setIndex(i)}>
          <span className="netlab-step-number">{i + 1}</span>
          <span><strong>{entry.phase}</strong><br />{entry.from ? `${nodeLabel(entry.from)} → ` : ""}{nodeLabel(entry.at)}: {entry.title}</span>
        </button>
      </li>)}</ol>
    </details>
    <dl className="netlab-roles">
      <div className="netlab-role"><dt className="netlab-role-title">SW · Switch</dt><dd className="netlab-role-copy">Verteilt Rahmen im lokalen Netz an passende Anschlüsse. Er ist nicht der Wegweiser zwischen verschiedenen IP-Netzen.</dd></div>
      <div className="netlab-role"><dt className="netlab-role-title">R · Router</dt><dd className="netlab-role-copy">Verbindet Netze. Seine Routingtabelle bestimmt einen nächsten Abschnitt für ein IP-Paket.</dd></div>
      <div className="netlab-role"><dt className="netlab-role-title">DNS · Namensdienst</dt><dd className="netlab-role-copy">Liefert hier zum Namen eine IP-Adresse. Die eigentlichen Dateidaten kommen vom Schul- oder Webserver.</dd></div>
    </dl>
    <details className="netlogic-details">
      <summary className="netlogic-summary">Adressen und Modellgrenzen</summary>
      <ul className="netlogic-detail-list">{NETWORK_NODES.map((node) => <li key={node.id}><strong>{node.label}:</strong> {node.address}</li>)}</ul>
      <p className="netlogic-detail-copy">Die Domain lernseite.example und die externe IP-Adresse sind Beispiele, keine besuchten Ziele.
        Die Höhe im 3D-Bild stellt keine Etage, Protokollschicht oder Leitungsgeschwindigkeit dar.
        ARP, NAT, TCP-Verbindungsaufbau, TLS, Paketverluste und mehrere Datenpakete bleiben ausgeblendet.
        DNS kann auch außerhalb des Schulnetzes liegen; dann braucht schon die DNS-Anfrage Routing.</p>
      <p className="netlogic-sources">Fachlicher Hintergrund: <a href="https://www.rfc-editor.org/rfc/rfc1034.html">DNS (RFC 1034)</a>,{" "}
        <a href="https://www.rfc-editor.org/rfc/rfc1122.html">Host-Routing (RFC 1122)</a>,{" "}
        <a href="https://www.rfc-editor.org/rfc/rfc5737.html">Beispiel-IP-Adressen (RFC 5737)</a>.</p>
    </details>
    <p className="netlogic-think"><strong>Vorhersage:</strong> Muss eine Antwort vom Webserver noch einmal durch den DNS-Dienst?
      Begründe zuerst und prüfe dann den Rückweg.</p>
  </section>;
}

export type LogicBit = 0 | 1;
export type LogicGate = "AND" | "OR" | "XOR" | "NOT";
type LogicMode = LogicGate | "HALF";

function requireBit(bit: LogicBit) {
  if (bit !== 0 && bit !== 1) throw new RangeError("Ein logischer Eingang muss 0 oder 1 sein.");
}

export function evaluateLogicGate(gate: LogicGate, a: LogicBit, b: LogicBit = 0): LogicBit {
  requireBit(a);
  requireBit(b);
  switch (gate) {
    case "AND": return a === 1 && b === 1 ? 1 : 0;
    case "OR": return a === 1 || b === 1 ? 1 : 0;
    case "XOR": return a !== b ? 1 : 0;
    case "NOT": return a === 0 ? 1 : 0;
    default: throw new RangeError("Unbekanntes logisches Gatter.");
  }
}

export function calculateHalfAdder(a: LogicBit, b: LogicBit) {
  const sum = evaluateLogicGate("XOR", a, b);
  const carry = evaluateLogicGate("AND", a, b);
  return { sum, carry, total: a + b, binary: `${carry}${sum}` };
}

const GATE_COPY: Record<LogicMode, { title: string; text: string }> = {
  AND: { title: "AND · beide müssen 1 sein", text: "Der Ausgang Y wird nur 1, wenn A und B beide 1 sind. Beispiel: Eine Freigabe benötigt zwei gleichzeitig erfüllte Bedingungen." },
  OR: { title: "OR · mindestens eine 1 genügt", text: "Y ist 1, wenn A oder B oder beide 1 sind. Das informatische ODER schließt den Fall „beide“ ausdrücklich ein." },
  XOR: { title: "XOR · genau eine 1", text: "Y ist 1, wenn A und B verschieden sind. Sind beide 0 oder beide 1, ergibt XOR den Ausgang 0." },
  NOT: { title: "NOT · den Zustand umkehren", text: "NOT hat nur einen Eingang. Aus A = 0 wird Y = 1, aus A = 1 wird Y = 0. Ein zweiter Eingang wird hier nicht gebraucht." },
  HALF: { title: "Halbaddierer · zwei Bits addieren", text: "Jetzt arbeiten zwei Gatter zusammen: XOR liefert das Summenbit S, AND den Übertrag C. Die beiden Ausgänge gehören zu verschiedenen Stellenwerten." },
};

function Wire({ d, bit }: { d: string; bit: LogicBit }) {
  return <path d={d} className={bit === 1 ? "logiclab-wire logiclab-wire-on" : "logiclab-wire"} />;
}

function LogicDiagram({ mode, a, b, id }: { mode: LogicMode; a: LogicBit; b: LogicBit; id: string }) {
  const half = calculateHalfAdder(a, b);
  const result = mode === "HALF" ? half.sum : evaluateLogicGate(mode, a, b);
  return <svg className="logiclab-svg" viewBox={mode === "HALF" ? "0 0 680 385" : "0 0 680 260"}
    role="img" aria-labelledby={`${id}-logic-title ${id}-logic-desc`}>
    <title id={`${id}-logic-title`}>{mode === "HALF" ? "Halbaddierer aus XOR und AND" : `${mode}-Gatter mit aktuellen Eingangswerten`}</title>
    <desc id={`${id}-logic-desc`}>{mode === "HALF"
      ? `A ist ${a}, B ist ${b}. XOR berechnet das Summenbit S gleich ${half.sum}. AND berechnet den Übertrag C gleich ${half.carry}.`
      : `${mode}: Eingang A ist ${a}${mode === "NOT" ? "" : `, Eingang B ist ${b}`}. Ausgang Y ist ${result}.`}
      Dunkelgrün und durchgezogen bedeutet 1, grau und gestrichelt bedeutet 0. Die Werte stehen auch als Text an den Leitungen.</desc>
    {mode === "HALF" ? <>
      <Wire d="M 75 105 H 300" bit={a} />
      <Wire d="M 160 105 V 265 H 300" bit={a} />
      <Wire d="M 75 285 H 225 V 125 H 300" bit={b} />
      <Wire d="M 225 285 V 305 H 300" bit={b} />
      <circle cx="160" cy="105" r="5" className="logiclab-junction" />
      <circle cx="225" cy="285" r="5" className="logiclab-junction" />
      <Wire d="M 400 105 H 560" bit={half.sum} />
      <Wire d="M 400 285 H 560" bit={half.carry} />
      <rect x="300" y="65" width="100" height="85" rx="8" className="logiclab-gate" />
      <rect x="300" y="245" width="100" height="85" rx="8" className="logiclab-gate" />
      <text x="350" y="113" textAnchor="middle" className="logiclab-gate-name">XOR</text>
      <text x="350" y="293" textAnchor="middle" className="logiclab-gate-name">AND</text>
      <text x="28" y="77" className="logiclab-signal-label">A = {a}</text>
      <text x="28" y="320" className="logiclab-signal-label">B = {b}</text>
      <text x="270" y="94" textAnchor="end" className="logiclab-wire-value">{a}</text>
      <text x="270" y="148" textAnchor="end" className="logiclab-wire-value">{b}</text>
      <text x="270" y="253" textAnchor="end" className="logiclab-wire-value">{a}</text>
      <text x="270" y="327" textAnchor="end" className="logiclab-wire-value">{b}</text>
      <text x="452" y="90" className="logiclab-signal-label">S = {half.sum}</text>
      <text x="452" y="137" className="logiclab-output-label">Summenbit · Einer</text>
      <text x="452" y="270" className="logiclab-signal-label">C = {half.carry}</text>
      <text x="452" y="317" className="logiclab-output-label">Übertrag · Zweier</text>
      <circle cx="60" cy="105" r="15" className={a === 1 ? "logiclab-terminal logiclab-terminal-on" : "logiclab-terminal"} />
      <circle cx="60" cy="285" r="15" className={b === 1 ? "logiclab-terminal logiclab-terminal-on" : "logiclab-terminal"} />
      <circle cx="575" cy="105" r="15" className={half.sum === 1 ? "logiclab-terminal logiclab-terminal-on" : "logiclab-terminal"} />
      <circle cx="575" cy="285" r="15" className={half.carry === 1 ? "logiclab-terminal logiclab-terminal-on" : "logiclab-terminal"} />
    </> : <>
      <Wire d={mode === "NOT" ? "M 90 130 H 280" : "M 90 80 H 210 V 110 H 280"} bit={a} />
      {mode !== "NOT" && <Wire d="M 90 185 H 210 V 150 H 280" bit={b} />}
      <Wire d="M 400 130 H 575" bit={result} />
      <rect x="280" y="80" width="120" height="100" rx="9" className="logiclab-gate" />
      <text x="340" y="139" textAnchor="middle" className="logiclab-gate-name">{mode}</text>
      <text x="40" y={mode === "NOT" ? "103" : "53"} className="logiclab-signal-label">A = {a}</text>
      {mode !== "NOT" && <text x="40" y="224" className="logiclab-signal-label">B = {b}</text>}
      <text x="477" y="103" className="logiclab-signal-label">Y = {result}</text>
      <text x="458" y="170" className="logiclab-output-label">Ausgang</text>
      <circle cx="75" cy={mode === "NOT" ? "130" : "80"} r="15" className={a === 1 ? "logiclab-terminal logiclab-terminal-on" : "logiclab-terminal"} />
      {mode !== "NOT" && <circle cx="75" cy="185" r="15" className={b === 1 ? "logiclab-terminal logiclab-terminal-on" : "logiclab-terminal"} />}
      <circle cx="590" cy="130" r="15" className={result === 1 ? "logiclab-terminal logiclab-terminal-on" : "logiclab-terminal"} />
    </>}
  </svg>;
}

export function LogicGateLab() {
  const id = useId().replaceAll(":", "");
  const [mode, setMode] = useState<LogicMode>("AND");
  const [a, setA] = useState<LogicBit>(0);
  const [b, setB] = useState<LogicBit>(1);
  const half = calculateHalfAdder(a, b);
  const output = mode === "HALF" ? half.sum : evaluateLogicGate(mode, a, b);
  const rows: { a: LogicBit; b: LogicBit }[] = mode === "NOT"
    ? [{ a: 0, b: 0 }, { a: 1, b: 0 }]
    : [{ a: 0, b: 0 }, { a: 0, b: 1 }, { a: 1, b: 0 }, { a: 1, b: 1 }];

  return <section className="netlogic-lab logiclab" aria-labelledby={`${id}-title`}>
    <p className="netlogic-kicker">SCHALTER, LEITUNGEN, ERGEBNIS · LOGIK</p>
    <h3 className="netlogic-title" id={`${id}-title`}>Was machen die Gatter mit meinen Bits?</h3>
    <p className="netlogic-intro">Ein Eingang ist hier entweder 0 oder 1. Ein Gatter wendet darauf eine feste Regel an.
      Stelle die Eingänge ein und verfolge ihre Werte bis zum Ausgang. Es geht um logische Zustände, nicht um eine maßstabgetreue elektrische Schaltung.</p>
    <fieldset className="netlogic-fieldset netlogic-screen-controls"><legend className="netlogic-label">Baustein auswählen</legend>
      <div className="netlogic-button-row">{(["AND", "OR", "XOR", "NOT", "HALF"] as const).map((choice) => <button type="button"
        className="netlogic-button" key={choice} aria-pressed={mode === choice} onClick={() => setMode(choice)}>
        {choice === "HALF" ? "Halbaddierer" : choice}</button>)}</div>
    </fieldset>
    <h4 className="logiclab-mode-title">{GATE_COPY[mode].title}</h4>
    <p className="netlogic-intro">{GATE_COPY[mode].text}</p>
    <div className="logiclab-inputs netlogic-screen-controls" role="group" aria-label="Eingänge umschalten">
      <button className="logiclab-input-toggle" type="button" aria-pressed={a === 1} aria-label={`Eingang A ist ${a}. Umschalten.`}
        onClick={() => setA(a === 0 ? 1 : 0)}><span>Eingang A</span><strong>{a}</strong><span>umschalten</span></button>
      {mode !== "NOT" && <button className="logiclab-input-toggle" type="button" aria-pressed={b === 1} aria-label={`Eingang B ist ${b}. Umschalten.`}
        onClick={() => setB(b === 0 ? 1 : 0)}><span>Eingang B</span><strong>{b}</strong><span>umschalten</span></button>}
    </div>
    <p className="netlogic-note">Durchgezogen und dunkelgrün = 1; gestrichelt und grau = 0. Die Zahlen zeigen den Zustand zusätzlich an.
      {mode === "HALF" && " Nur ein Punkt verbindet sich kreuzende Leitungen. Eine Kreuzung ohne Punkt ist keine Verbindung."}</p>
    <div className="logiclab-diagram-scroll" role="region" tabIndex={0} aria-label="Schaltbild, bei Bedarf seitlich verschiebbar">
      <LogicDiagram mode={mode} a={a} b={b} id={id} />
    </div>
    <div className="netlogic-result" role="status" aria-live="polite" aria-atomic="true">
      {mode === "HALF" ? <>
        <h4 className="netlogic-result-title">{a} + {b} = {half.total} im Dezimalsystem</h4>
        <p className="netlogic-result-copy">Summenbit: <strong>S = {a} XOR {b} = {half.sum}</strong>.<br />
          Übertrag: <strong>C = {a} AND {b} = {half.carry}</strong>.</p>
        <p className="logiclab-calculation"><strong>{half.binary}<sub>2</sub></strong> = {half.carry} · 2 + {half.sum} · 1 = <strong>{half.total}<sub>10</sub></strong></p>
        <p className="netlogic-result-copy">Wir schreiben <strong>C vor S</strong>: C steht an der Zweierstelle, S an der Einerstelle.
          {half.carry === 1 ? " Bei 1 + 1 sind zwei Einer zusammen ein Zweier: S wird 0, C wird 1. Es geht nichts verloren."
            : " Der Übertrag bleibt 0, solange noch keine zwei Einer zusammenkommen."}</p>
      </> : <>
        <h4 className="netlogic-result-title">{mode === "NOT" ? `NOT ${a}` : `${a} ${mode} ${b}`} = {output}</h4>
        <p className="netlogic-result-copy">{mode === "AND" ? a === 1 && b === 1 ? "Beide Eingänge sind 1. Deshalb ist auch Y = 1." : "Mindestens ein Eingang ist 0. Deshalb ist Y = 0."
          : mode === "OR" ? a === 1 || b === 1 ? "Mindestens ein Eingang ist 1. Das genügt für Y = 1; auch zwei Einsen sind erlaubt." : "Kein Eingang ist 1. Deshalb ist Y = 0."
            : mode === "XOR" ? a !== b ? "Die beiden Eingänge sind verschieden. Genau eine 1 führt zu Y = 1." : "Die beiden Eingänge sind gleich. Deshalb ist Y = 0."
              : `NOT kehrt den Eingang A = ${a} um. Deshalb ist Y = ${output}.`}</p>
      </>}
    </div>
    <div className="logiclab-table-scroll" role="region" tabIndex={0} aria-label="Wahrheitstabelle mit auswählbaren Eingaben">
      <table className="logiclab-table"><caption className="logiclab-caption">Alle möglichen Eingaben · Die markierte Zeile ist gerade eingestellt.</caption>
        <thead><tr><th scope="col">A</th>{mode !== "NOT" && <th scope="col">B</th>}
          {mode === "HALF" ? <><th scope="col">S</th><th scope="col">C</th><th scope="col">CS<sub>2</sub></th></> : <th scope="col">Y</th>}
          <th scope="col">Auswahl</th></tr></thead>
        <tbody>{rows.map((row) => {
          const active = row.a === a && (mode === "NOT" || row.b === b);
          const rowHalf = calculateHalfAdder(row.a, row.b);
          return <tr key={`${row.a}${row.b}`} className={active ? "logiclab-table-active" : undefined}>
            <td>{row.a}</td>{mode !== "NOT" && <td>{row.b}</td>}
            {mode === "HALF" ? <><td>{rowHalf.sum}</td><td>{rowHalf.carry}</td><td>{rowHalf.binary}</td></>
              : <td>{evaluateLogicGate(mode, row.a, row.b)}</td>}
            <td><button className="logiclab-row-button" type="button" aria-pressed={active}
              aria-label={`A gleich ${row.a}${mode === "NOT" ? "" : `, B gleich ${row.b}`} einstellen`}
              onClick={() => { setA(row.a); setB(row.b); }}>{active ? "● Aktuell" : "Einstellen"}</button></td>
          </tr>;
        })}</tbody>
      </table>
    </div>
    <p className="netlogic-think"><strong>Vorhersage:</strong> Stelle A und B auf 1. Vergleiche OR und XOR.
      Warum muss ein Halbaddierer für sein Summenbit XOR und nicht OR verwenden?</p>
    <p className="netlogic-model-note"><strong>Modellgrenze:</strong> Das Bild zeigt ideale logische Zustände.
      Elektrische Spannungen und Verzögerungen sind nicht dargestellt. Der Halbaddierer hat keinen Eingang für einen vorherigen Übertrag.
      Dafür braucht man den Volladdierer im nächsten Lernschritt.</p>
  </section>;
}
