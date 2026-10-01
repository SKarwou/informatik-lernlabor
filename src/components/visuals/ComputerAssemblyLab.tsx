import { useId, useState } from "react";
import type { KeyboardEvent } from "react";
import "./ComputerAssemblyLab.css";

export type ComputerPartId = "panel" | "cooler" | "ram" | "ssd" | "cpu" | "board";
export type ComputerAssemblyState = Record<ComputerPartId, boolean>;
export type ComputerPoint = { x: number; y: number; z: number };
export type ComputerPartAction = { allowed: boolean; action: "remove" | "insert"; reason: string };

export const COMPUTER_PART_IDS: ComputerPartId[] = ["panel", "cooler", "ram", "ssd", "cpu", "board"];

const PARTS: Record<ComputerPartId, {
  number: number; name: string; short: string; color: string; center: ComputerPoint; tray: ComputerPoint;
  description: string; example: string; power: string;
}> = {
  panel: { number: 1, name: "Gehäuse-Seitenwand", short: "Seitenwand", color: "#426253",
    center: { x: 0, y: 0, z: 112 }, tray: { x: -390, y: 110, z: 125 },
    description: "Das Gehäuse hält und schützt die Bauteile. Die Seitenwand verschließt den Zugang. Entferne sie im Modell, um die innenliegenden Teile sehen zu können.",
    example: "Wie der Einband eines Buches schützt die Wand den Inhalt. Sie rechnet nicht selbst und speichert keine Dateien.",
    power: "Die Seitenwand ist kein Datenspeicher. Im Modell ist der PC immer virtuell stromlos." },
  cooler: { number: 2, name: "Kühler mit Lüfter", short: "Kühler", color: "#536d65",
    center: { x: -35, y: 70, z: 40 }, tray: { x: 225, y: 115, z: 110 },
    description: "Beim Arbeiten entsteht in der CPU Wärme. Der Kühlkörper nimmt sie auf; der Lüfter bewegt Luft an seinen Flächen vorbei. Zusammen transportieren sie Wärme von der CPU weg.",
    example: "Der Kühler sitzt über der CPU. Deshalb wird die CPU hier erst sichtbar und entnehmbar, wenn der Kühler entfernt wurde.",
    power: "Ein ausgeschalteter PC führt keine normale Rechenarbeit aus. Ein echter PC darf nicht ohne passende Kühlung betrieben werden." },
  ram: { number: 3, name: "Arbeitsspeicher (RAM)", short: "RAM", color: "#7ca84f",
    center: { x: 66, y: 65, z: -7 }, tray: { x: 350, y: -10, z: 85 },
    description: "Im RAM liegen Daten und Programme, mit denen der Computer gerade arbeitet. Er ist schnell zugänglich, aber flüchtig: Ohne Strom bleiben seine normalen Arbeitsdaten nicht erhalten.",
    example: "Du bearbeitest einen Text. Die gerade benutzten Daten liegen im Arbeitsspeicher. Eine noch nicht gespeicherte Änderung ist dadurch noch keine dauerhaft abgelegte Datei.",
    power: "Nach vollständigem Abschalten sind die RAM-Arbeitsdaten nicht mehr verfügbar. Standby und Ruhezustand betrachten wir hier nicht." },
  ssd: { number: 4, name: "Dateispeicher (SSD)", short: "SSD", color: "#afbeb4",
    center: { x: 52, y: -111, z: 56 }, tray: { x: 290, y: -205, z: 105 },
    description: "Die SSD speichert Dateien und Programme auch ohne laufende Stromversorgung. Sie nutzt elektronische Speicherbausteine; anders als eine klassische Festplatte benötigt sie keine rotierenden Scheiben.",
    example: "Mit „Speichern“ werden Änderungen als Datei dauerhaft abgelegt, beispielsweise auf einer SSD. Beim nächsten Start kann der Computer sie wieder laden.",
    power: "Bereits gespeicherte Dateien bleiben beim gewöhnlichen Ausschalten erhalten. Ungespeicherte Änderungen werden nicht allein durch die Existenz einer SSD automatisch gesichert." },
  cpu: { number: 5, name: "Prozessor (CPU)", short: "CPU", color: "#b9aa71",
    center: { x: -35, y: 70, z: -13 }, tray: { x: 135, y: 285, z: 145 },
    description: "Die CPU führt Programmbefehle aus: Sie verarbeitet Daten, rechnet, vergleicht Werte und steuert Abläufe. Sie arbeitet mit dem RAM und anderen Bauteilen zusammen.",
    example: "Wenn ein Programm zwei Zahlen addiert oder eine Bedingung prüft, führt die CPU entsprechende Befehle aus. Die CPU ist aber nicht der dauerhafte Ablageort deiner Dokumente.",
    power: "Ohne Strom führt die CPU keine Befehle aus. Gespeicherte Dateien liegen weiterhin auf einem dauerhaften Speicher, nicht als laufender Arbeitszustand in der CPU." },
  board: { number: 6, name: "Hauptplatine (Mainboard)", short: "Mainboard", color: "#315d45",
    center: { x: -20, y: 25, z: -31 }, tray: { x: -245, y: -215, z: 95 },
    description: "Die Hauptplatine verbindet die Bauteile elektrisch. Auf ihr sitzen unter anderem der CPU-Sockel, RAM-Steckplätze und Anschlüsse. Leiterbahnen ermöglichen den Austausch von Signalen.",
    example: "Die Platine ist die gemeinsame Verbindungsfläche. In diesem vereinfachten Modell müssen Kühler, CPU und RAM zuerst entnommen sein, bevor sie herausgenommen werden kann.",
    power: "Die Hauptplatine ist kein Ersatz für den Dateispeicher. Kleine zusätzliche Speicher auf echten Platinen sind in diesem Einstiegsmodell nicht dargestellt." },
};

export function createComputerAssemblyState(): ComputerAssemblyState {
  return { panel: true, cooler: true, ram: true, ssd: true, cpu: true, board: true };
}

function checkAssemblyInput(state: ComputerAssemblyState, part: ComputerPartId) {
  if (!COMPUTER_PART_IDS.includes(part) || !isComputerAssemblyStateValid(state)) {
    throw new RangeError("Unbekanntes Bauteil oder ungültiger Modellzustand.");
  }
}

export function isComputerAssemblyStateValid(state: ComputerAssemblyState): boolean {
  if (!state || !COMPUTER_PART_IDS.every((id) => typeof state[id] === "boolean")) return false;
  if (state.panel && COMPUTER_PART_IDS.some((id) => id !== "panel" && !state[id])) return false;
  if (state.cooler && (!state.cpu || !state.board)) return false;
  if ((state.cpu || state.ram) && !state.board) return false;
  return true;
}

export function getComputerPartAction(state: ComputerAssemblyState, part: ComputerPartId): ComputerPartAction {
  checkAssemblyInput(state, part);
  const action = state[part] ? "remove" : "insert";
  const blocked = (reason: string): ComputerPartAction => ({ allowed: false, action, reason });
  if (part === "panel") {
    if (!state.panel && COMPUTER_PART_IDS.some((id) => id !== "panel" && !state[id])) {
      return blocked("Setze zuerst alle inneren Teile wieder ein. Danach lässt sich die Seitenwand schließen.");
    }
    return { allowed: true, action, reason: state.panel ? "Öffne die Seitenwand, um in den PC hineinzusehen." : "Alle inneren Teile sind eingesetzt. Du kannst das Gehäuse schließen." };
  }
  if (state.panel) return blocked("Öffne zuerst die Gehäuse-Seitenwand.");
  if (action === "remove") {
    if (part === "cpu" && state.cooler) return blocked("Die CPU liegt unter dem Kühler. Entferne zuerst den Kühler.");
    if (part === "board" && (state.cooler || state.ram || state.cpu)) {
      return blocked("Entnimm zuerst Kühler, RAM und CPU. Sie sitzen im Modell auf der Hauptplatine.");
    }
  } else {
    if (["cooler", "ram", "cpu"].includes(part) && !state.board) return blocked("Setze zuerst die Hauptplatine wieder ein.");
    if (part === "cooler" && !state.cpu) return blocked("Setze zuerst die CPU ein. Auf sie gehört der Kühler.");
    if (part === "cpu" && state.cooler) return blocked("Der Kühler verdeckt den CPU-Sockel. Entferne ihn zuerst.");
  }
  return { allowed: true, action, reason: action === "remove" ? "Dieses Bauteil ist im Modell zugänglich." : "Dieses Bauteil kann wieder an seinen Platz." };
}

/** Returns a new state, never mutates the previous one; blocked moves are harmless. */
export function toggleComputerPart(state: ComputerAssemblyState, part: ComputerPartId): ComputerAssemblyState {
  const decision = getComputerPartAction(state, part);
  return decision.allowed ? { ...state, [part]: !state[part] } : { ...state };
}

export function projectComputerPoint(point: ComputerPoint, angleDegrees: number) {
  if (![point.x, point.y, point.z, angleDegrees].every(Number.isFinite)) throw new RangeError("Die Modellkoordinaten müssen endlich sein.");
  const yaw = angleDegrees * Math.PI / 180;
  const elevation = 20 * Math.PI / 180;
  const x = point.x * Math.cos(yaw) + point.z * Math.sin(yaw);
  const z = -point.x * Math.sin(yaw) + point.z * Math.cos(yaw);
  return { x: 640 + x, y: 360 - point.y * Math.cos(elevation) + z * Math.sin(elevation),
    depth: z * Math.cos(elevation) + point.y * Math.sin(elevation) };
}

/** Removed pieces travel in actual 3D, from their fitted locations into the exploded layout. */
export function getComputerPartOffset(part: ComputerPartId, installed: boolean, explosion: number): ComputerPoint {
  if (!COMPUTER_PART_IDS.includes(part) || typeof installed !== "boolean" || !Number.isFinite(explosion) || explosion < 0 || explosion > 100) {
    throw new RangeError("Bauteil unbekannt oder Explosionsabstand außerhalb von 0 bis 100.");
  }
  if (installed) return { x: 0, y: 0, z: 0 };
  const factor = 0.9 + explosion * 0.0025;
  const { center, tray } = PARTS[part];
  return { x: (tray.x - center.x) * factor, y: (tray.y - center.y) * factor, z: (tray.z - center.z) * factor };
}

type Face = { points: ComputerPoint[]; fill: string; stroke?: string };
type Mesh = { key: string; center: ComputerPoint; faces: Face[]; part?: ComputerPartId; label?: string };

function shade(hex: string, factor: number) {
  const channels = [1, 3, 5].map((start) => Math.max(0, Math.min(255, Math.round(parseInt(hex.slice(start, start + 2), 16) * factor))));
  return `rgb(${channels.join(",")})`;
}

function cuboid(center: ComputerPoint, size: ComputerPoint, color: string): Face[] {
  const x0 = center.x - size.x / 2, x1 = center.x + size.x / 2;
  const y0 = center.y - size.y / 2, y1 = center.y + size.y / 2;
  const z0 = center.z - size.z / 2, z1 = center.z + size.z / 2;
  const point = (x: number, y: number, z: number) => ({ x, y, z });
  return [
    { points: [point(x0,y0,z0),point(x1,y0,z0),point(x1,y1,z0),point(x0,y1,z0)], fill: shade(color,.68) },
    { points: [point(x0,y0,z1),point(x1,y0,z1),point(x1,y1,z1),point(x0,y1,z1)], fill: color },
    { points: [point(x0,y0,z0),point(x0,y0,z1),point(x0,y1,z1),point(x0,y1,z0)], fill: shade(color,.78) },
    { points: [point(x1,y0,z0),point(x1,y0,z1),point(x1,y1,z1),point(x1,y1,z0)], fill: shade(color,.86) },
    { points: [point(x0,y1,z0),point(x1,y1,z0),point(x1,y1,z1),point(x0,y1,z1)], fill: shade(color,1.15) },
    { points: [point(x0,y0,z0),point(x1,y0,z0),point(x1,y0,z1),point(x0,y0,z1)], fill: shade(color,.6) },
  ];
}

function disk(center: ComputerPoint, radius: number, color: string, segments = 32): Face {
  return { fill: color, points: Array.from({ length: segments }, (_, i) => {
    const angle = i * 2 * Math.PI / segments;
    return { x: center.x + radius * Math.cos(angle), y: center.y + radius * Math.sin(angle), z: center.z };
  }) };
}

function partFaces(part: ComputerPartId): Face[] {
  const { center, color } = PARTS[part];
  const faces: Face[] = [];
  if (part === "panel") {
    faces.push(...cuboid(center, { x: 244, y: 336, z: 8 }, color));
    for (let i = 0; i < 9; i++) faces.push(...cuboid({ x: 0, y: -54 + i * 11, z: 117 }, { x: 120, y: 4, z: 1 }, "#223f31"));
    for (const x of [-109, 109]) for (const y of [-153,153]) faces.push(disk({ x, y, z: 117.5 }, 3.2, "#b5c6b4", 12));
    faces.push(...cuboid({ x: 84, y: 91, z: 119 }, { x: 14, y: 39, z: 5 }, "#a6b69f"));
  } else if (part === "board") {
    faces.push(...cuboid(center, { x: 186, y: 230, z: 7 }, color));
    faces.push(...cuboid({ x: -35, y: 70, z: -25 }, { x: 66, y: 64, z: 4 }, "#b5aa71"));
    faces.push(...cuboid({ x: 66, y: 65, z: -24 }, { x: 19, y: 152, z: 7 }, "#263f31"));
    faces.push(...cuboid({ x: -19, y: -20, z: -23 }, { x: 45, y: 37, z: 8 }, "#223c31"));
    for (let i = 0; i < 4; i++) faces.push(...cuboid({ x: -59 + i * 31, y: -65, z: -22 }, { x: 22, y: 9, z: 8 }, "#829b73"));
    for (let i = 0; i < 5; i++) faces.push(...cuboid({ x: -93, y: -49 + i * 30, z: -20 }, { x: 20, y: 18, z: 11 }, "#aab6ac"));
    for (const x of [-102,61]) for (const y of [-77,127]) faces.push(disk({ x, y, z: -26 }, 3, "#c5d49d", 12));
  } else if (part === "cpu") {
    faces.push(...cuboid(center, { x: 57, y: 54, z: 6 }, "#8c995d"));
    faces.push(...cuboid({ ...center, z: center.z + 4 }, { x: 43, y: 40, z: 3 }, "#d3d7cc"));
    for (let i = 0; i < 7; i++) {
      faces.push(...cuboid({ x: center.x - 22 + i * 7, y: center.y - 25, z: center.z + 3 }, { x: 3, y: 3, z: 1 }, "#c3ae60"));
    }
  } else if (part === "ram") {
    faces.push(...cuboid(center, { x: 17, y: 146, z: 7 }, color));
    for (let i = 0; i < 6; i++) faces.push(...cuboid({ x: 66, y: 12 + i * 21, z: -2 }, { x: 12, y: 15, z: 4 }, "#243b2d"));
    faces.push(...cuboid({ x: 66, y: -5, z: -2 }, { x: 17, y: 7, z: 2 }, "#c9b466"));
  } else if (part === "ssd") {
    faces.push(...cuboid(center, { x: 88, y: 63, z: 13 }, color));
    faces.push(...cuboid({ ...center, z: center.z + 8 }, { x: 65, y: 38, z: 1 }, "#e2e9d8"));
    faces.push(...cuboid({ x: center.x, y: center.y - 34, z: center.z - 1 }, { x: 39, y: 6, z: 5 }, "#887b45"));
  } else {
    faces.push(...cuboid({ x: -35, y: 70, z: 15 }, { x: 83, y: 82, z: 44 }, "#84978d"));
    for (let i = 0; i < 8; i++) faces.push(...cuboid({ x: -70 + i * 10, y: 70, z: 38 }, { x: 3, y: 81, z: 8 }, "#bdc8bd"));
    faces.push(...cuboid({ x: -35, y: 70, z: 47 }, { x: 86, y: 86, z: 10 }, "#2f4a3d"));
    faces.push(disk({ x: -35, y: 70, z: 53 }, 37, "#142e22"));
    faces.push(disk({ x: -35, y: 70, z: 53.6 }, 33, "#9cae93"));
    for (let i = 0; i < 7; i++) {
      const theta = i * 2 * Math.PI / 7;
      faces.push({ fill: "#2a4b36", points: [[7,0],[30,8],[27,19],[11,13]].map(([x,y]) => ({
        x: -35 + x * Math.cos(theta) - y * Math.sin(theta), y: 70 + x * Math.sin(theta) + y * Math.cos(theta), z: 54,
      })) });
    }
    faces.push(disk({ x: -35, y: 70, z: 55 }, 9, "#c9f27f", 20));
  }
  return faces;
}

function caseMeshes(): Mesh[] {
  const box = (key: string, center: ComputerPoint, size: ComputerPoint, color: string): Mesh => ({ key, center, faces: cuboid(center,size,color) });
  const psu = box("psu", { x: 0, y: -133, z: -9 }, { x: 150, y: 58, z: 92 }, "#617068");
  for (let i = 0; i < 7; i++) psu.faces.push(...cuboid({ x: -42 + i * 14, y: -133, z: 38 }, { x: 5, y: 26, z: 1 }, "#253c2d"));
  return [
    box("case-back", { x: 0, y: 0, z: -47 }, { x: 244, y: 344, z: 8 }, "#99aa9b"),
    box("case-bottom", { x: 0, y: -171, z: 32 }, { x: 250, y: 10, z: 166 }, "#426052"),
    box("case-top", { x: 0, y: 171, z: 32 }, { x: 250, y: 10, z: 166 }, "#748b77"),
    box("case-left", { x: -121, y: 0, z: 32 }, { x: 8, y: 344, z: 166 }, "#5c7460"),
    box("case-right", { x: 121, y: 0, z: 32 }, { x: 8, y: 344, z: 166 }, "#5c7460"),
    box("foot-left", { x: -83, y: -181, z: 36 }, { x: 46, y: 12, z: 96 }, "#263f31"),
    box("foot-right", { x: 83, y: -181, z: 36 }, { x: 46, y: 12, z: 96 }, "#263f31"),
    { ...psu, label: "Netzteil · bleibt geschlossen" },
  ];
}

const BASE_MESHES = caseMeshes();
const PART_MESHES: Mesh[] = COMPUTER_PART_IDS.map((part) => ({ key: part, part, center: PARTS[part].center, faces: partFaces(part) }));

function Model({ state, selected, angle, explosion, id, onPart }: {
  state: ComputerAssemblyState; selected: ComputerPartId; angle: number; explosion: number; id: string;
  onPart: (part: ComputerPartId) => void;
}) {
  const meshes = [...BASE_MESHES, ...PART_MESHES]
    .filter((mesh) => !mesh.part || mesh.part === "panel" || (!state.panel && (mesh.part !== "cpu" || !state.cooler)))
    .map((mesh) => {
      const offset = mesh.part ? getComputerPartOffset(mesh.part, state[mesh.part], explosion) : { x: 0, y: 0, z: 0 };
      const origin = projectComputerPoint({ x: 0, y: 0, z: 0 }, angle);
      const projectedOffset = projectComputerPoint(offset, angle);
      const movedCenter = { x: mesh.center.x + offset.x, y: mesh.center.y + offset.y, z: mesh.center.z + offset.z };
      const faces = mesh.faces.map((face) => {
        const points = face.points.map((point) => projectComputerPoint(point,angle));
        return { ...face, points2D: points.map((point) => `${point.x},${point.y}`).join(" "),
          depth: points.reduce((sum,point) => sum + point.depth,0) / points.length };
      }).sort((a,b) => a.depth-b.depth);
      return { ...mesh, faces, center2D: projectComputerPoint(mesh.center,angle),
        depth: projectComputerPoint(movedCenter,angle).depth,
        dx: projectedOffset.x-origin.x, dy: projectedOffset.y-origin.y };
    }).sort((a,b) => a.depth-b.depth);

  const keyboard = (event: KeyboardEvent<SVGGElement>, part: ComputerPartId) => {
    if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onPart(part); }
  };
  return <svg className="pclab-svg" viewBox="0 0 1280 840" role="group" aria-labelledby={`${id}-svg-title ${id}-svg-description`}>
    <title id={`${id}-svg-title`}>Zerlegbares dreidimensionales Modell eines Desktop-PCs</title>
    <desc id={`${id}-svg-description`}>Das Gehäuse steht in der Mitte. Entnommene Teile liegen mit Abstand daneben.
      Alle Modellaktionen sind auch mit den großen Bauteil-Schaltflächen unterhalb der Grafik möglich.
      {COMPUTER_PART_IDS.map((part) => `${PARTS[part].name}: ${state[part] ? "eingesetzt" : "entnommen"}`).join(". ")}</desc>
    <defs><radialGradient id={`${id}-ground`}><stop offset="0" stopColor="#becbb0" stopOpacity=".36" />
      <stop offset="1" stopColor="#becbb0" stopOpacity="0" /></radialGradient></defs>
    <ellipse cx="651" cy="557" rx="254" ry="76" fill={`url(#${id}-ground)`} aria-hidden="true" />
    {!state.panel && meshes.filter((mesh) => mesh.part && !state[mesh.part]).map((mesh) => <line key={`guide-${mesh.key}`}
      x1={mesh.center2D.x} y1={mesh.center2D.y} x2={mesh.center2D.x+mesh.dx} y2={mesh.center2D.y+mesh.dy}
      className="pclab-explosion-guide" aria-hidden="true" />)}
    {meshes.map((mesh) => {
      const part = mesh.part;
      const decision = part ? getComputerPartAction(state,part) : null;
      const label = part ? `${PARTS[part].name}: ${state[part] ? "eingesetzt" : "entnommen"}. ${decision?.allowed
        ? state[part] ? "Zum Entnehmen anklicken." : "Zum Einsetzen anklicken." : decision?.reason}` : mesh.label;
      return <g key={mesh.key} className={`pclab-mesh${part ? " pclab-part" : ""}${part === selected ? " pclab-part-selected" : ""}`}
        style={{ transform: `translate(${mesh.dx}px, ${mesh.dy}px)` }} role={part ? "button" : undefined}
        tabIndex={part ? 0 : undefined} aria-label={part ? label : undefined}
        aria-disabled={decision && !decision.allowed ? true : undefined}
        onClick={part ? () => onPart(part) : undefined} onKeyDown={part ? (event) => keyboard(event,part) : undefined}>
        {label && <title>{label}</title>}
        {mesh.faces.map((face,i) => <polygon key={i} points={face.points2D} fill={face.fill} className="pclab-face" />)}
        {part && <>
          <circle cx={mesh.center2D.x} cy={mesh.center2D.y} r={part === "ram" ? 23 : 19} className="pclab-part-marker" />
          <text x={mesh.center2D.x} y={mesh.center2D.y+6} textAnchor="middle" className="pclab-part-number">{PARTS[part].number}</text>
          {(!state[part] || part === selected) && <text x={mesh.center2D.x} y={mesh.center2D.y + (part === "panel" ? 125 : part === "board" ? 108 : part === "ram" ? 97 : 75)}
            className="pclab-part-label" textAnchor="middle">{PARTS[part].short}</text>}
        </>}
      </g>;
    })}
    {state.panel && <g className="pclab-opening-guide" aria-hidden="true">
      <text x="89" y="230" className="pclab-guide-kicker">DEIN ERSTER SCHRITT</text>
      <text x="89" y="267" className="pclab-guide-title">Die Seitenwand öffnen.</text>
      <text x="89" y="298" className="pclab-guide-copy">Klicke auf die 1 oder auf den Button unten.</text>
      <path d="M 95 321 H 358 L 493 358" className="pclab-guide-line" />
    </g>}
  </svg>;
}

export function ComputerAssemblyLab() {
  const id = useId().replaceAll(":", "");
  const [state, setState] = useState<ComputerAssemblyState>(createComputerAssemblyState);
  const [selected, setSelected] = useState<ComputerPartId>("panel");
  const [angle, setAngle] = useState(-20);
  const [explosion, setExplosion] = useState(40);
  const [textView, setTextView] = useState(false);
  const [message, setMessage] = useState("Beginne mit der Gehäuse-Seitenwand. Alle anderen Teile liegen dahinter.");
  const [computerOn, setComputerOn] = useState(true);
  const removedCount = COMPUTER_PART_IDS.filter((part) => !state[part]).length;
  const chosen = PARTS[selected];

  const act = (part: ComputerPartId) => {
    setSelected(part);
    const decision = getComputerPartAction(state,part);
    if (!decision.allowed) { setMessage(decision.reason); return; }
    setState(toggleComputerPart(state,part));
    setMessage(`${PARTS[part].name} ${state[part] ? "entnommen" : "wieder eingesetzt"}.${part === "panel" && state.panel
      ? " Jetzt kannst du die inneren Bauteile entdecken." : part === "cooler" && state.cooler ? " Darunter wird jetzt die CPU sichtbar." : ""}`);
  };
  const assemble = () => {
    setState(createComputerAssemblyState());
    setSelected("panel");
    setMessage("Alle Teile wurden im Modell wieder eingesetzt und die Seitenwand geschlossen. Du kannst erneut beginnen.");
  };
  const reset = () => { assemble(); setAngle(-20); setExplosion(40); setComputerOn(true); };

  return <section className="pclab" aria-labelledby={`${id}-title`}>
    <p className="pclab-kicker">ANFASSEN IM MODELL · HARDWARE VERSTEHEN</p>
    <h3 className="pclab-title" id={`${id}-title`}>Was steckt in einem PC?</h3>
    <p className="pclab-intro">Öffne das Gehäuse, nimm Bauteile heraus und setze sie wieder ein.
      Die Teile bewegen sich wirklich an andere Stellen im räumlichen Modell. Drehe die Ansicht, um ihre Form und ihren Einbauort zu erkennen.</p>
    <div className="pclab-safety"><strong>Nur ein Lernmodell – keine Reparaturanleitung.</strong> Der Modell-PC ist virtuell stromlos.
      Reale Geräte nur unter fachkundiger Aufsicht bearbeiten. <strong>Ein echtes Netzteil niemals öffnen:</strong> Im Inneren können auch nach dem Trennen vom Stromnetz gefährliche Spannungen bestehen.
      Schrauben, Kabel, Schutz vor statischer Entladung und Wärmeleitpaste werden hier nicht als Arbeitsschritte dargestellt.</div>
    <div className="pclab-controls pclab-screen-only">
      <div className="pclab-button-row" role="group" aria-label="Ansicht wählen">
        <button className="pclab-button" type="button" aria-pressed={!textView} onClick={() => setTextView(false)}>3D-PC</button>
        <button className="pclab-button" type="button" aria-pressed={textView} onClick={() => setTextView(true)}>Textansicht ohne 3D</button>
      </div>
      <div className="pclab-sliders">
        <label className="pclab-slider-label" htmlFor={`${id}-angle`}>PC drehen <span>{angle}°</span>
          <input id={`${id}-angle`} className="pclab-range" type="range" min="-28" max="28" step="1" value={angle}
            aria-valuetext={`${angle} Grad`} disabled={textView} onChange={(event) => setAngle(Number(event.target.value))} /></label>
        <label className="pclab-slider-label" htmlFor={`${id}-explode`}>Explosionsabstand <span>{explosion}%</span>
          <input id={`${id}-explode`} className="pclab-range" type="range" min="0" max="100" step="1" value={explosion}
            aria-valuetext={`${explosion} Prozent Abstand der entnommenen Teile`} disabled={removedCount === 0 || textView}
            onChange={(event) => setExplosion(Number(event.target.value))} /></label>
      </div>
    </div>
    <p className="pclab-note">Der Explosionsregler verändert den Abstand der <strong>entnommenen</strong> Teile.
      Er baut keine Teile aus. Du kannst die Nummern im Bild oder die großen Bauteil-Buttons verwenden.
      Bei wenig Platz lässt sich das 3D-Bild seitlich verschieben; die Textansicht bietet dieselben Funktionen ohne Grafik.</p>
    {!textView ? <div className="pclab-model-scroll" role="region" tabIndex={0} aria-label="Verschiebbares PC-Modell">
      <Model state={state} selected={selected} angle={angle} explosion={explosion} id={id} onPart={act} />
    </div> : <div className="pclab-text-view">
      <h4 className="pclab-subtitle">Das Modell als Text</h4>
      <ol className="pclab-text-list">{COMPUTER_PART_IDS.map((part) => <li key={part}>
        <strong>{PARTS[part].name}: {state[part] ? "eingesetzt" : "entnommen"}.</strong>{" "}{getComputerPartAction(state,part).reason}
      </li>)}</ol>
      <p className="pclab-note">Das Netzteil bleibt geschlossen im Gehäuse. Nutze die Bauteil-Buttons direkt darunter zum Zerlegen oder Einsetzen.</p>
    </div>}
    {!textView && <p className="pclab-note">{state.panel ? "Ein geschlossenes Gehäuse schützt die Bauteile." : "Schematisches Lernmodell · gestrichelte Linien zeigen die ursprünglichen Plätze."}</p>}
    <div className="pclab-toolbar pclab-screen-only">
      <span className="pclab-count">{removedCount} von 6 Teilen entnommen</span>
      <div className="pclab-button-row">
        <button className="pclab-button" type="button" disabled={removedCount === 0} onClick={assemble}>Alles wieder einsetzen</button>
        <button className="pclab-button" type="button" onClick={reset}>Zurücksetzen</button>
      </div>
    </div>
    <p className="pclab-feedback" role="status" aria-live="polite" aria-atomic="true">{message}</p>
    <div className="pclab-part-list">{COMPUTER_PART_IDS.map((part) => {
      const entry = PARTS[part], decision = getComputerPartAction(state,part);
      return <article className={`pclab-part-card${selected === part ? " pclab-card-selected" : ""}`} key={part}>
        <div className="pclab-card-head"><span className="pclab-number">{entry.number}</span><div>
          <h4 className="pclab-card-title">{entry.name}</h4><span className="pclab-part-state">{state[part] ? "Eingesetzt" : "Entnommen"}</span>
        </div></div>
        <div className="pclab-button-row pclab-screen-only">
          <button className="pclab-button pclab-action" type="button" disabled={!decision.allowed} onClick={() => act(part)}
            aria-label={`${entry.name} ${state[part] ? "entnehmen" : "wieder einsetzen"}`}>{state[part] ? "Entnehmen" : "Einsetzen"}</button>
          <button className="pclab-button pclab-explain" type="button" aria-pressed={selected === part}
            aria-controls={`${id}-explanation`} onClick={() => setSelected(part)}>Erklärung</button>
        </div>
        <p className="pclab-card-note">{decision.reason}</p>
      </article>;
    })}</div>
    <div className="pclab-explanation" id={`${id}-explanation`} aria-live="polite" aria-atomic="true">
      <p className="pclab-kicker">BAUTEIL {chosen.number} · {state[selected] ? "IM PC" : "ENTNOMMEN"}</p>
      <h4 className="pclab-subtitle">{chosen.name}</h4>
      <p className="pclab-copy">{chosen.description}</p>
      <p className="pclab-copy"><strong>Einfaches Beispiel:</strong> {chosen.example}</p>
      <p className="pclab-copy"><strong>Beim Ausschalten:</strong> {chosen.power}</p>
    </div>
    <section className="pclab-memory" aria-labelledby={`${id}-memory-title`}>
      <h4 className="pclab-subtitle" id={`${id}-memory-title`}>RAM oder SSD: Was bleibt nach dem Ausschalten?</h4>
      <p className="pclab-copy">Eine eigene kleine Alltagsszene, unabhängig vom zerlegten Modell: Ein gespeichertes Foto liegt auf der SSD.
        Eine neue, noch nicht gespeicherte Textänderung befindet sich nur im Arbeitsspeicher.</p>
      <div className="pclab-button-row pclab-screen-only" role="group" aria-label="Stromzustand in der Datenszene">
        <button className="pclab-button" type="button" aria-pressed={computerOn} onClick={() => setComputerOn(true)}>Szene: Computer an</button>
        <button className="pclab-button" type="button" aria-pressed={!computerOn} onClick={() => setComputerOn(false)}>Szene: vollständig aus</button>
      </div>
      <div className="pclab-memory-grid" role="status" aria-live="polite" aria-atomic="true">
        <div className={`pclab-memory-item${computerOn ? "" : " pclab-memory-empty"}`}>
          <strong>RAM · flüchtiger Arbeitsspeicher</strong>
          <span>{computerOn ? "Die neue Textänderung ist gerade verfügbar." : "Die nicht gespeicherte Textänderung ist nicht mehr verfügbar."}</span>
        </div>
        <div className="pclab-memory-item"><strong>SSD · dauerhafter Dateispeicher</strong>
          <span>{computerOn ? "Das gespeicherte Foto ist als Datei abgelegt." : "Das gespeicherte Foto bleibt als Datei erhalten."}</span></div>
      </div>
      <p className="pclab-note">Vereinfachte Szene ohne automatisches Speichern, Standby oder Ruhezustand.
        „Computer an“ setzt die Szene neu auf; verlorene Änderungen werden dadurch in Wirklichkeit nicht zurückgeholt.</p>
    </section>
    <p className="pclab-question"><strong>Erkläre mit eigenen Worten:</strong> Warum sind „Die CPU rechnet“, „Der RAM hält Arbeitsdaten bereit“
      und „Die SSD speichert meine Datei“ drei unterschiedliche Aufgaben?</p>
  </section>;
}
