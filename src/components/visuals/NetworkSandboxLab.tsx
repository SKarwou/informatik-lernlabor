import { useEffect, useId, useState } from "react";
import type { KeyboardEvent } from "react";
import "./NetworkSandboxLab.css";

export type SandboxNodeId = "pc-a" | "pc-b" | "switch" | "router" | "web";
export type SandboxTarget = "pc-b" | "web";
export type SandboxLinkId = "a-switch" | "b-switch" | "switch-router" | "router-web";
export type SandboxCables = Record<SandboxLinkId, boolean>;
export type SandboxNode = {
  id: SandboxNodeId; label: string; ip: string | null; gateway: string | null;
  addresses: readonly string[]; x: number; y: number; role: string; example: string;
};

export const NETWORK_SANDBOX_NODES: readonly SandboxNode[] = [
  { id: "pc-a", label: "PC A", ip: "192.168.10.11", gateway: "192.168.10.1", addresses: ["192.168.10.11/24"], x: 115, y: 145,
    role: "PC A startet jeden Versuch. Er vergleicht die Zieladresse mit seinem eigenen Netz. Ein lokales Ziel erreicht er im LAN; ein anderes Netz erreicht er über sein Standardgateway 192.168.10.1.",
    example: "Das Standardgateway ist die Router-Schnittstelle im eigenen Netz. Es ist nicht die IP-Adresse des entfernten Servers." },
  { id: "pc-b", label: "PC B", ip: "192.168.10.22", gateway: "192.168.10.1", addresses: ["192.168.10.22/24"], x: 115, y: 350,
    role: "PC B gehört zum selben /24-Netz wie PC A. Er kann in diesem Modell eine ICMP-Echo-Anfrage beantworten. Dafür braucht der Weg zwischen den beiden PCs den Router nicht.",
    example: "Das Kabel vom Switch zum Router darf für A → B sogar getrennt sein. Die beiden benötigten PC-Kabel müssen aber verbunden sein." },
  { id: "switch", label: "Switch", ip: null, gateway: null, addresses: [], x: 340, y: 245,
    role: "Der Switch verbindet die Geräte im lokalen Ethernet-Netz. Er leitet Rahmen anhand von MAC-Adressen zum passenden Anschluss weiter. Diese Adressen und seine bekannte Zuordnungstabelle sind im Modell ausgeblendet.",
    example: "Zum Weiterleiten zwischen diesen Anschlüssen benötigt unser Switch keine eigene IP-Adresse. Er ersetzt keinen Router zwischen verschiedenen IP-Netzen." },
  { id: "router", label: "Router", ip: null, gateway: null, addresses: ["Port 1: 192.168.10.1/24", "Port 2: 192.168.20.1/24"], x: 570, y: 245,
    role: "Der Router hat eine Schnittstelle in jedem Netz. Er schaut auf die IP-Zieladresse und leitet zwischen den beiden direkt angeschlossenen Netzen weiter. Beide Routen sind hier bereits richtig eingerichtet.",
    example: "PC A benutzt Port 1 als Gateway. Der Server benutzt auf dem Rückweg Port 2. Ohne NAT bleiben die IP-Adressen von Absender und Empfänger unterwegs dieselben." },
  { id: "web", label: "Server", ip: "192.168.20.80", gateway: "192.168.20.1", addresses: ["192.168.20.80/24"], x: 795, y: 245,
    role: "Dieser Rechner könnte einen Webdienst anbieten. Hier testen wir aber nur, ob seine ICMP-Echo-Antwort zurückkommt. Ein erfolgreicher Ping ruft keine Webseite ab und prüft keinen Webdienst.",
    example: "Für die Antwort an PC A im anderen Netz schickt der Server den Rahmen an sein eigenes Gateway 192.168.20.1. Ein HTTP-Aufruf wäre eine zusätzliche, andere Kommunikation." },
];
export const NETWORK_SANDBOX_LINKS: readonly { id: SandboxLinkId; from: SandboxNodeId; to: SandboxNodeId; label: string; number: number }[] = [
  { id: "a-switch", from: "pc-a", to: "switch", label: "PC A ↔ Switch", number: 1 },
  { id: "b-switch", from: "pc-b", to: "switch", label: "PC B ↔ Switch", number: 2 },
  { id: "switch-router", from: "switch", to: "router", label: "Switch ↔ Router / Port 1", number: 3 },
  { id: "router-web", from: "router", to: "web", label: "Router / Port 2 ↔ Server", number: 4 },
];

export function createSandboxCables(): SandboxCables {
  return { "a-switch": true, "b-switch": true, "switch-router": true, "router-web": true };
}
const getNode = (id: SandboxNodeId) => NETWORK_SANDBOX_NODES.find(node => node.id === id)!;
const getLink = (id: SandboxLinkId) => NETWORK_SANDBOX_LINKS.find(link => link.id === id)!;

export type SandboxRouteEvaluation = {
  target: SandboxTarget; sourceIp: string; targetIp: string; sameSubnet: boolean;
  requestPath: SandboxNodeId[]; replyPath: SandboxNodeId[]; usedLinks: SandboxLinkId[];
  reachable: boolean; firstBrokenLink: SandboxLinkId | null; reachedBeforeFailure: SandboxNodeId;
};

/** Fixed, documented topology; evaluates cable connectivity, never a real network. */
export function evaluateSandboxRoute(target: SandboxTarget, cables: SandboxCables): SandboxRouteEvaluation {
  if ((target !== "pc-b" && target !== "web") || !cables || !NETWORK_SANDBOX_LINKS.every(link => typeof cables[link.id] === "boolean")) {
    throw new RangeError("Unbekanntes Ziel oder unvollständiger Kabelzustand im Netzwerkmodell.");
  }
  const requestPath: SandboxNodeId[] = target === "pc-b" ? ["pc-a", "switch", "pc-b"] : ["pc-a", "switch", "router", "web"];
  const usedLinks: SandboxLinkId[] = target === "pc-b" ? ["a-switch", "b-switch"] : ["a-switch", "switch-router", "router-web"];
  const failedIndex = usedLinks.findIndex(link => !cables[link]);
  return {
    target, sourceIp: "192.168.10.11", targetIp: getNode(target).ip!, sameSubnet: target === "pc-b",
    requestPath, replyPath: [...requestPath].reverse(), usedLinks,
    reachable: failedIndex === -1, firstBrokenLink: failedIndex === -1 ? null : usedLinks[failedIndex],
    reachedBeforeFailure: failedIndex === -1 ? target : requestPath[failedIndex],
  };
}

export type SandboxPacketStep = {
  phase: "prepare" | "request" | "reply-created" | "reply" | "success" | "failure";
  at: SandboxNodeId; from?: SandboxNodeId; linkId?: SandboxLinkId; blockedLinkId?: SandboxLinkId;
  sourceIp: string; destinationIp: string; title: string; explanation: string;
};

/** A successful request creates a separate reply; a broken cable stops the run. */
export function createSandboxPacketSteps(target: SandboxTarget, cables: SandboxCables): SandboxPacketStep[] {
  const route = evaluateSandboxRoute(target, cables);
  const requestAddresses = { sourceIp: route.sourceIp, destinationIp: route.targetIp };
  const replyAddresses = { sourceIp: route.targetIp, destinationIp: route.sourceIp };
  const steps: SandboxPacketStep[] = [{
    phase: "prepare", at: "pc-a", ...requestAddresses,
    title: route.sameSubnet ? "1 · PC A erkennt ein Ziel im selben Netz" : "1 · PC A braucht sein Standardgateway",
    explanation: route.sameSubnet
      ? "192.168.10.11 und 192.168.10.22 gehören mit /24 zum selben Netz 192.168.10.0. PC A adressiert den Ethernet-Rahmen an PC B. Ein Router ist für diesen Weg nicht erforderlich."
      : "Bei /24 unterscheiden sich 192.168.10 und 192.168.20: Der Server liegt in einem anderen Netz. PC A adressiert den lokalen Rahmen deshalb an sein Gateway 192.168.10.1. Die IP-Zieladresse im enthaltenen Paket bleibt 192.168.20.80.",
  }];
  for (let i = 0; i < route.usedLinks.length; i++) {
    const linkId = route.usedLinks[i];
    const from = route.requestPath[i];
    const at = route.requestPath[i + 1];
    if (!cables[linkId]) {
      steps.push({ phase: "failure", at: from, blockedLinkId: linkId, ...requestAddresses,
        title: `Stopp · Kabel ${getLink(linkId).number} ist unterbrochen`,
        explanation: `Zwischen ${getLink(linkId).label} kommt das Paket nicht weiter. In diesem Modell fehlt damit der Weg zum Ziel; es entsteht keine Echo-Antwort. Verbinde dieses Kabel und starte einen neuen Versuch. Das Modell zeigt die Ursache direkt – ein echtes ping meldet nicht unbedingt so genau, welches Kabel betroffen ist.`,
      });
      return steps;
    }
    const explanation = at === "switch"
      ? `Der Switch empfängt einen Ethernet-Rahmen mit der Echo-Anfrage. Seine bekannte MAC-Tabelle weist ${route.sameSubnet ? "zum Anschluss von PC B" : "zum Anschluss des Routers"}. Er leitet lokal weiter und ändert die IP-Zieladresse nicht.`
      : at === "router"
        ? "Der Router nimmt den Rahmen an Port 1 entgegen. Die IP-Zieladresse 192.168.20.80 gehört zum direkt angeschlossenen Netz 192.168.20.0/24. Der Router sendet das Paket in einem neuen Rahmen über Port 2 weiter."
        : `${getNode(at).label} erhält die ICMP-Echo-Anfrage an ${route.targetIp}. Eine Echo-Anfrage ist eine Erreichbarkeitsprüfung, keine Anfrage nach einer Webseite.`;
    steps.push({ phase: "request", at, from, linkId, ...requestAddresses,
      title: `Echo-Anfrage · ${getNode(from).label} → ${getNode(at).label}`, explanation });
  }
  steps.push({ phase: "reply-created", at: target, ...replyAddresses,
    title: `${getNode(target).label} erzeugt eine eigene Echo-Antwort`,
    explanation: route.sameSubnet
      ? "Jetzt ist PC B der Absender und PC A das Ziel. PC B adressiert den lokalen Rahmen direkt an PC A. Die IP-Adressen von Quelle und Ziel sind gegenüber der Anfrage vertauscht."
      : "Jetzt ist 192.168.20.80 der Absender und 192.168.10.11 das Ziel. Weil PC A in einem anderen Netz liegt, adressiert der Server seinen Rahmen an sein Gateway 192.168.20.1, also Router-Port 2.",
  });
  const returnLinks = [...route.usedLinks].reverse();
  for (let i = 0; i < returnLinks.length; i++) {
    const from = route.replyPath[i];
    const at = route.replyPath[i + 1];
    steps.push({ phase: "reply", from, at, linkId: returnLinks[i], ...replyAddresses,
      title: `Echo-Antwort · ${getNode(from).label} → ${getNode(at).label}`,
      explanation: at === "router"
        ? "Die Antwort erreicht Router-Port 2. Der Router erkennt 192.168.10.0/24 als Zielnetz und leitet über Port 1 zurück. Die IP-Zieladresse der Antwort bleibt PC A: 192.168.10.11."
        : at === "switch"
          ? "Der Switch leitet den zurückkommenden Ethernet-Rahmen zum Anschluss von PC A. Dafür benutzt er seine MAC-Tabelle, nicht eine Entscheidung zwischen verschiedenen IP-Netzen."
          : "PC A hat die passende Echo-Antwort erhalten. In unserem Modell waren Hinweg, antwortender Zielrechner und Rückweg funktionsfähig.",
    });
  }
  steps.push({ phase: "success", at: "pc-a", ...replyAddresses,
    title: "Erfolgreich · Echo-Antwort bei PC A angekommen",
    explanation: route.sameSubnet
      ? "Anfrage und Antwort blieben im Netz 192.168.10.0/24. Der Switch wurde benötigt, der Router nicht. Probiere nun, Kabel 3 oder 4 zu trennen: Der Weg zu PC B bleibt trotzdem nutzbar."
      : "Die Kommunikation mit dem Server benötigte beide Router-Schnittstellen. Das zeigt die Erreichbarkeit per ICMP-Echo – nicht, ob ein Webdienst läuft. Probiere anschließend PC B als Ziel, während die Router-Verbindung unterbrochen ist.",
  });
  return steps;
}

const phaseLabel: Record<SandboxPacketStep["phase"], string> = {
  prepare: "Vorbereitung", request: "Hinweg · Echo Request", "reply-created": "Antwort entsteht",
  reply: "Rückweg · Echo Reply", success: "Erreichbarkeit bestätigt", failure: "Verbindung unterbrochen",
};

function useReducedMotion() {
  const [reduced, setReduced] = useState(() => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update(); query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return reduced;
}

function activateSvg(event: KeyboardEvent<SVGGElement>, action: () => void) {
  if (event.key === "Enter" || event.key === " ") { event.preventDefault(); action(); }
}

export default function NetworkSandboxLab() {
  const id = useId().replaceAll(":", "");
  const [target, setTarget] = useState<SandboxTarget>("pc-b");
  const [cables, setCables] = useState<SandboxCables>(createSandboxCables);
  const [selectedNode, setSelectedNode] = useState<SandboxNodeId>("pc-a");
  const [steps, setSteps] = useState<SandboxPacketStep[] | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [notice, setNotice] = useState("Alle vier Kabel sind verbunden. Wähle ein Ziel und überlege zuerst, ob der Router benötigt wird.");
  const reducedMotion = useReducedMotion();
  const current = steps?.[stepIndex] ?? null;
  const last = !!steps && stepIndex === steps.length - 1;
  const selected = getNode(selectedNode);
  const packetAt = getNode(current?.at ?? "pc-a");
  const reply = current?.phase === "reply" || current?.phase === "reply-created" || current?.phase === "success";

  useEffect(() => { if (reducedMotion) setPlaying(false); }, [reducedMotion]);
  useEffect(() => {
    if (!playing || reducedMotion || !steps) return;
    if (stepIndex >= steps.length - 1) { setPlaying(false); return; }
    const timer = window.setTimeout(() => setStepIndex(index => Math.min(index + 1, steps.length - 1)), 4000);
    return () => window.clearTimeout(timer);
  }, [playing, reducedMotion, steps, stepIndex]);
  useEffect(() => {
    const pause = () => setPlaying(false);
    const onVisibility = () => { if (document.hidden) pause(); };
    window.addEventListener("beforeprint", pause); document.addEventListener("visibilitychange", onVisibility);
    return () => { window.removeEventListener("beforeprint", pause); document.removeEventListener("visibilitychange", onVisibility); };
  }, []);

  function clearJourney() { setSteps(null); setStepIndex(0); setPlaying(false); }
  function chooseTarget(value: SandboxTarget) {
    setTarget(value); clearJourney(); setNotice(`Neues Ziel: ${getNode(value).label}. Die Kabelzustände bleiben erhalten. Starte einen neuen Versuch.`);
  }
  function toggleCable(linkId: SandboxLinkId) {
    const enabled = !cables[linkId];
    setCables(previous => ({ ...previous, [linkId]: enabled })); clearJourney();
    setNotice(`Kabel ${getLink(linkId).number} ${enabled ? "verbunden" : "getrennt"}: ${getLink(linkId).label}. Der bisherige Versuch wurde beendet. Prüfe den neuen Aufbau mit „Echo-Anfrage senden“.`);
  }
  function send() { setSteps(createSandboxPacketSteps(target, cables)); setStepIndex(0); setPlaying(false); setNotice("Versuch vorbereitet. Lies den ersten Schritt. Mit „Weiter“ schickst du das Paket zum nächsten Halt."); }
  function insertFault() {
    const broken: SandboxLinkId = target === "pc-b" ? "b-switch" : "router-web";
    setCables({ ...createSandboxCables(), [broken]: false }); clearJourney();
    setNotice("Ein Kabel ist jetzt getrennt; alle anderen sind verbunden. Sage den Stopp voraus, sende die Echo-Anfrage und repariere danach den Aufbau.");
  }
  function reset() { setTarget("pc-b"); setCables(createSandboxCables()); setSelectedNode("pc-a"); clearJourney(); setNotice("Neustart: Ziel PC B, alle Kabel verbunden. Es wurde noch keine Anfrage gesendet."); }

  return <section className="netsandbox" aria-labelledby={`${id}-title`}>
    <header><span className="netsandbox-kicker">Dein Netzwerklabor · ausprobieren und reparieren</span><h3 id={`${id}-title`}>Kommt mein Paket auch wieder zurück?</h3><p className="netsandbox-intro">Verbinde zwei kleine Netze und beobachte eine <strong>Echo-Anfrage mit Antwort</strong> – ähnlich einem einzelnen <code>ping</code>. Du entscheidest, welche Kabel verbunden sind. Das ist eine Simulation im Browser: Es werden keine echten Geräte oder IP-Adressen kontaktiert.</p></header>
    <div className="netsandbox-start"><h4>So startest du ohne Vorwissen</h4><ol><li><strong>Ziel wählen:</strong> PC B im selben Netz oder den Server im anderen Netz. Vermute zuerst: Wird der Router gebraucht?</li><li><strong>Senden und beobachten:</strong> Drücke „Echo-Anfrage senden“, dann „Weiter“. Die Punkte zeigen zuerst den Hinweg und danach eine neu erzeugte Antwort.</li><li><strong>Verändern und erklären:</strong> Trenne ein Kabel oder baue den vorbereiteten Fehler ein. Sende erneut, finde den Stopp und verbinde das Kabel wieder.</li></ol></div>

    <fieldset className="netsandbox-targets netsandbox-screen"><legend>1 · Wohin soll PC A senden?</legend><div className="netsandbox-button-row">
      <button type="button" aria-pressed={target === "pc-b"} onClick={() => chooseTarget("pc-b")}>PC B · im eigenen Netz <small>192.168.10.22</small></button>
      <button type="button" aria-pressed={target === "web"} onClick={() => chooseTarget("web")}>Server · im anderen Netz <small>192.168.20.80</small></button>
    </div><p className="netsandbox-note">Der Kabelzustand bleibt beim Zielwechsel erhalten. So kannst du denselben Fehler mit beiden Zielen vergleichen.</p></fieldset>

    <div className="netsandbox-diagram-scroll" tabIndex={0} role="region" aria-label="Netzplan; auf kleinen Bildschirmen seitlich verschiebbar">
      <svg className="netsandbox-diagram" viewBox="0 0 910 485" role="group" aria-labelledby={`${id}-map-title ${id}-map-description`}>
        <title id={`${id}-map-title`}>Zwei /24-Netze mit Switch und Router</title><desc id={`${id}-map-description`}>PC A und PC B sind mit dem Switch im Netz 192.168.10.0/24 verbunden. Der Router verbindet dieses Netz mit dem Servernetz 192.168.20.0/24. Die Geräte sind anklickbar; dieselbe Auswahl ist unter der Grafik als Schaltflächen vorhanden. Vier Kabel können unter der Grafik umgeschaltet werden.</desc>
        <rect className="netsandbox-lan" x="20" y="30" width="430" height="430" rx="15" /><rect className="netsandbox-server-net" x="685" y="30" width="205" height="430" rx="15" />
        <text className="netsandbox-net-title" x="42" y="60">LAN · 192.168.10.0/24</text><text className="netsandbox-net-subtitle" x="42" y="82">PC A und PC B teilen denselben Netzanteil.</text>
        <text className="netsandbox-net-title" x="702" y="60">Servernetz</text><text className="netsandbox-net-subtitle" x="702" y="82">192.168.20.0/24</text>
        {NETWORK_SANDBOX_LINKS.map(link => {
          const from = getNode(link.from); const to = getNode(link.to);
          const x = (from.x + to.x) / 2; const y = (from.y + to.y) / 2 - 35;
          return <g key={link.id}><line className={`netsandbox-wire ${cables[link.id] ? "" : "netsandbox-wire-off"} ${current?.linkId === link.id ? "netsandbox-wire-active" : ""} ${current?.blockedLinkId === link.id ? "netsandbox-wire-blocked" : ""}`} x1={from.x} y1={from.y - 35} x2={to.x} y2={to.y - 35} />
            <circle className={`netsandbox-wire-badge ${cables[link.id] ? "" : "netsandbox-wire-badge-off"}`} cx={x} cy={y} r="14" /><text className="netsandbox-wire-number" x={x} y={y + 5} textAnchor="middle">{cables[link.id] ? link.number : "×"}</text>
            {!cables[link.id] && <text className="netsandbox-broken-label" x={x} y={y - 22} textAnchor="middle">Kabel {link.number} getrennt</text>}</g>;
        })}
        {NETWORK_SANDBOX_NODES.map(node => <g key={node.id} className="netsandbox-device" role="button" tabIndex={0} aria-label={`${node.label}: Funktion und Adressen erklären`} aria-pressed={selectedNode === node.id} onClick={() => setSelectedNode(node.id)} onKeyDown={event => activateSvg(event, () => setSelectedNode(node.id))}>
          <rect className={`netsandbox-device-box ${selectedNode === node.id ? "netsandbox-device-selected" : ""} ${current?.at === node.id ? "netsandbox-device-current" : ""}`} x={node.x - 51} y={node.y - 28} width="102" height="66" rx="9" />
          {node.id === "switch" ? <g className="netsandbox-device-symbol"><rect x={node.x - 27} y={node.y - 15} width="54" height="21" rx="3" />{[0, 1, 2, 3].map(i => <rect key={i} x={node.x - 21 + i * 12} y={node.y - 8} width="7" height="6" />)}</g>
            : node.id === "router" ? <g className="netsandbox-device-symbol"><path d={`M ${node.x - 25} ${node.y - 8} H ${node.x + 25} M ${node.x + 16} ${node.y - 16} L ${node.x + 25} ${node.y - 8} L ${node.x + 16} ${node.y} M ${node.x + 25} ${node.y + 4} H ${node.x - 25} M ${node.x - 16} ${node.y - 4} L ${node.x - 25} ${node.y + 4} L ${node.x - 16} ${node.y + 12}`} /></g>
              : <g className="netsandbox-device-symbol"><rect x={node.x - 22} y={node.y - 16} width="44" height="26" rx="2" /><path d={`M ${node.x} ${node.y + 10} V ${node.y + 17} M ${node.x - 14} ${node.y + 17} H ${node.x + 14}`} /></g>}
          <text className="netsandbox-device-label" x={node.x} y={node.y + 62} textAnchor="middle">{node.label}</text>
          {node.addresses.map((address, index) => <text key={address} className="netsandbox-address" x={node.x} y={node.y + 83 + index * 19} textAnchor="middle">{address}</text>)}
          {node.id === "switch" && <text className="netsandbox-address" x={node.x} y={node.y + 83} textAnchor="middle">MAC-basiert im LAN</text>}
          {node.id === "web" && <text className="netsandbox-map-note" x={node.x} y={node.y + 105} textAnchor="middle">Hier: nur Echo-Test</text>}
        </g>)}
        {current && <g className={`netsandbox-packet ${reply ? "netsandbox-packet-reply" : ""}`} style={{ transform: `translate(${packetAt.x}px, ${packetAt.y - 35}px)` }} aria-hidden="true"><circle r="10" /><text textAnchor="middle" y="4">{reply ? "A" : "F"}</text></g>}
        <text className="netsandbox-map-note" x="472" y="398">Router: zwei Schnittstellen,</text><text className="netsandbox-map-note" x="472" y="418">je eine pro angeschlossenem Netz.</text>
      </svg>
    </div>
    <p className="netsandbox-note">Grafik lesen: durchgezogene Linie = verbunden; gestrichelte Linie mit × = getrennt. <strong>F</strong> am wandernden Punkt = Frage / Echo-Anfrage; <strong>A</strong> = Antwort. Geräte anklicken erklärt ihre Aufgabe. Die Grafik lässt sich am Handy seitlich verschieben.</p>

    <div className="netsandbox-device-buttons netsandbox-screen" role="group" aria-label="Gerät auswählen, Alternative zu den Geräten in der Grafik">{NETWORK_SANDBOX_NODES.map(node => <button type="button" key={node.id} aria-pressed={selectedNode === node.id} onClick={() => setSelectedNode(node.id)}>{node.label} erklären</button>)}</div>
    <div className="netsandbox-explain" aria-live="polite"><h4>{selected.label} · Aufgabe und Adressen</h4><p>{selected.role}</p><p className="netsandbox-remember">{selected.example}</p>{selected.addresses.length > 0 && <p><strong>Adresse{selected.addresses.length > 1 ? "n" : ""}:</strong> {selected.addresses.join(" · ")}</p>}{selected.gateway && <p><strong>Standardgateway:</strong> {selected.gateway}</p>}</div>

    <details className="netsandbox-details"><summary>Warum gehören diese Adressen zu zwei Netzen?</summary><p>Alle Geräte verwenden <strong>/24</strong>, also die Maske <strong>255.255.255.0</strong>. In genau diesem Fall bilden die ersten drei Zahlenblöcke den Netzanteil: <code>192.168.10</code> ist hier ein anderes Netz als <code>192.168.20</code>. Bei anderen Masken darfst du nicht einfach immer drei Zahlenblöcke vergleichen.</p><div className="netsandbox-table-scroll" tabIndex={0} role="region" aria-label="Vollständiger Adressplan"><table><caption>Adressplan · alle Masken 255.255.255.0 (/24)</caption><thead><tr><th scope="col">Gerät / Schnittstelle</th><th scope="col">IP-Adresse</th><th scope="col">Standardgateway</th></tr></thead><tbody><tr><td>PC A</td><td>192.168.10.11</td><td>192.168.10.1</td></tr><tr><td>PC B</td><td>192.168.10.22</td><td>192.168.10.1</td></tr><tr><td>Router · Port 1</td><td>192.168.10.1</td><td>Hier nicht nötig: beide Netze direkt angeschlossen</td></tr><tr><td>Router · Port 2</td><td>192.168.20.1</td><td>Hier nicht nötig: beide Netze direkt angeschlossen</td></tr><tr><td>Server</td><td>192.168.20.80</td><td>192.168.20.1</td></tr><tr><td>Switch</td><td>Keine für die gezeigte Weiterleitung</td><td>Keines für die gezeigte Weiterleitung</td></tr></tbody></table></div></details>

    <fieldset className="netsandbox-cables netsandbox-screen"><legend>2 · Kabel verbinden oder trennen</legend><p className="netsandbox-note">Mit jedem Klick änderst du genau ein Kabel. Ein laufender Versuch wird dabei beendet; sende anschließend neu.</p><div className="netsandbox-cable-grid">{NETWORK_SANDBOX_LINKS.map(link => <button type="button" key={link.id} aria-pressed={cables[link.id]} onClick={() => toggleCable(link.id)} aria-label={`Kabel ${link.number}, ${link.label}: ${cables[link.id] ? "verbunden; trennen" : "getrennt; verbinden"}`}><span className="netsandbox-cable-number">{link.number}</span><span><strong>{link.label}</strong><small>{cables[link.id] ? "✓ Verbunden · klicken zum Trennen" : "× Getrennt · klicken zum Verbinden"}</small></span></button>)}</div><div className="netsandbox-button-row"><button type="button" onClick={insertFault}>Einen Kabelfehler einbauen</button><button type="button" onClick={reset}>Ganzes Labor zurücksetzen</button></div></fieldset>
    <p className="netsandbox-notice" role="status" aria-live="polite" aria-atomic="true">{notice}</p>

    <div className="netsandbox-send netsandbox-screen"><h4>3 · Anfrage und Antwort verfolgen</h4><p><strong>Deine Vermutung:</strong> Erreicht PC A gerade {getNode(target).label}? Welche Geräte muss das Paket auf dem Hinweg besuchen? Sprich deine Vermutung aus, bevor du sendest.</p><div className="netsandbox-button-row"><button type="button" className="netsandbox-primary" onClick={send}>Echo-Anfrage senden</button><button type="button" disabled={!steps || stepIndex === 0} onClick={() => { setPlaying(false); setStepIndex(index => Math.max(0, index - 1)); }}>← Zurück</button><button type="button" disabled={!steps || last} onClick={() => { setPlaying(false); setStepIndex(index => Math.min((steps?.length ?? 1) - 1, index + 1)); }}>Weiter →</button><button type="button" disabled={!steps || last || reducedMotion} onClick={() => setPlaying(value => !value)}>{playing ? "Pause" : "Langsam abspielen"}</button></div><p className="netsandbox-note">Kein automatischer Start. „Langsam abspielen“ wechselt alle vier Sekunden; „Zurück“ zeigt einen früheren Modellzustand und sendet kein echtes Paket rückwärts. {reducedMotion ? "Dein Gerät bevorzugt weniger Bewegung: Automatisches Abspielen ist ausgeschaltet. Nutze die Einzelschritte." : "Du kannst jederzeit pausieren und jeden Schritt in Ruhe lesen."}</p></div>

    <div className={`netsandbox-step ${current?.phase === "failure" ? "netsandbox-step-failed" : ""}`} aria-live={playing ? "off" : "polite"} aria-atomic="true">
      {current ? <><p className="netsandbox-step-phase">Schritt {stepIndex + 1} von {steps!.length} · {phaseLabel[current.phase]}</p><h4>{current.title}</h4><p>{current.explanation}</p><div className="netsandbox-packet-addresses"><span><small>IP-Absender</small><strong>{current.sourceIp}</strong></span><span aria-hidden="true">→</span><span><small>IP-Ziel</small><strong>{current.destinationIp}</strong></span></div><p className="netsandbox-note">Aktueller Halt: <strong>{getNode(current.at).label}</strong>. {current.phase === "failure" ? "Keine Echo-Antwort angekommen." : current.phase === "success" ? "Hin- und Rückweg abgeschlossen." : "Eine erfolgreiche Zustellung ist erst mit der zurückgekehrten Antwort bestätigt."}</p></>
        : <><h4>Dein Netz ist bereit zum Untersuchen</h4><p>Noch läuft kein Versuch. Wähle oben das Ziel und drücke „Echo-Anfrage senden“. Ein farbiger Punkt allein ist noch keine Erfolgsmeldung: Erst eine zurückgekommene Echo-Antwort bestätigt den Versuch.</p></>}
    </div>
    {steps && <details className="netsandbox-details"><summary>Bereits besuchte Schritte als Text lesen</summary><ol className="netsandbox-history">{steps.slice(0, stepIndex + 1).map((step, index) => <li key={index} aria-current={index === stepIndex ? "step" : undefined}><strong>{step.title}</strong><span>{getNode(step.at).label} · {phaseLabel[step.phase]}</span></li>)}</ol></details>}

    <div className="netsandbox-challenges"><h4>Zwei kleine Forschungsaufträge</h4><ol><li><strong>Das LAN braucht keinen Router:</strong> Trenne Kabel 3. Wähle zuerst PC B, dann den Server. Sende jeweils neu und vergleiche. Formuliere: „Der Switch reicht für …, der Router wird gebraucht für …“</li><li><strong>Ein Fehler betrifft nicht alle Ziele:</strong> Verbinde alles wieder. Trenne nur Kabel 2 zu PC B und prüfe beide Ziele. Warum kann der Server erreichbar bleiben? Stelle danach den funktionierenden Aufbau wieder her.</li></ol></div>
    <details className="netsandbox-details"><summary>Später selbst nachbauen: Zusatzauftrag für Filius</summary><p>Das sind neue Transferaufträge zu diesem Modell, keine Änderungen an deinen bisherigen Heftaufgaben. Nutze Filius mit deiner Lehrkraft und übertrage den obigen Adressplan.</p><ol><li>Baue PC A und PC B an einem Switch auf und trage ihre Adressen mit der Maske 255.255.255.0 ein. Prüfe den lokalen Weg zunächst ohne Router.</li><li>Ergänze einen Router mit zwei Schnittstellen und den Server im zweiten Netz. Übertrage beide Routeradressen und die passenden Standardgateways der Endgeräte.</li><li>Prüfe ausgehend von PC A nacheinander die Erreichbarkeit von 192.168.10.22 und 192.168.20.80. Vergleiche die sichtbaren Kommunikationswege mit diesem Modell.</li><li>Wiederhole einen Kabelversuch, dokumentiere deine Vorhersage, die Beobachtung und die Reparatur. Ein Webdienst mit Browserabruf wäre eine anschließende eigene Erweiterung – ein erfolgreicher Ping allein ist noch kein Webabruf.</li></ol><p className="netsandbox-note">Die genaue Oberfläche kann je nach Filius-Version abweichen. Offizieller Einstieg: <a href="https://www.lernsoftware-filius.de/" target="_blank" rel="noreferrer">Filius · Lernanwendung zu Rechnernetzen</a>.</p></details>
    <details className="netsandbox-details"><summary>Was dieses Modell absichtlich vereinfacht</summary><ul><li>Es benutzt feste IPv4-Adressen, korrekte /24-Masken und Gateways. Die Netze sind direkt am Router angeschlossen; zusätzliche Internet-Router, NAT und dynamische Routen fehlen.</li><li>Alle Geräte sind eingeschaltet. MAC-Adressen, ARP-Anfragen und das Lernen der Switch-Tabelle gelten bereits als bekannt. Auf den Leitungen werden tatsächlich Rahmen mit IP-Paketen übertragen; die Zeichnung zeigt nur den vereinfachten Weg.</li><li>Beide Endgeräte beantworten ICMP-Echo. In echten Netzen können Filter oder Einstellungen Echo-Antworten verhindern. Ein fehlender Ping beweist daher nicht automatisch einen Kabeldefekt.</li><li>Der Kabelzustand bleibt während eines Versuchs gleich. Eine Änderung startet keinen heimlich veränderten Rückweg, sondern beendet die Anzeige. Das Modell verwendet denselben Weg zurück; größere Netze können andere Rückwege haben.</li><li>DNS ist nicht nötig, weil du direkt eine IP-Adresse auswählst. DNS wäre eine zusätzliche Namensauflösung. TCP, HTTP, TLS, Zeitmessung, Paketverluste und genaue Protokollfehler werden hier nicht simuliert.</li></ul><p className="netsandbox-note">Fachliche Grundlage für Echo-Anfrage und Echo-Antwort: <a href="https://www.rfc-editor.org/rfc/rfc792" target="_blank" rel="noreferrer">IETF RFC 792 · ICMP</a>. Das Labor sendet weder Anfragen noch Messergebnisse an diese oder andere Adressen.</p></details>
  </section>;
}
