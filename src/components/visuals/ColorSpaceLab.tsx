import { useId, useState } from "react";
import "./ColorSpaceLab.css";

export type ColorPoint = readonly [number, number, number];
export function colorHex(rgb: ColorPoint) {
  return "#" + rgb.map(n => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0")).join("").toUpperCase();
}

// Orthographic projection of an actual three-dimensional RGB coordinate model.
export function projectColorPoint(point: ColorPoint, yaw: number, pitch: number) {
  const [x, y, z] = point.map(n => (n / 255 - .5) * 180);
  const a = yaw * Math.PI / 180, b = pitch * Math.PI / 180;
  const rx = x * Math.cos(a) + z * Math.sin(a);
  const rz = -x * Math.sin(a) + z * Math.cos(a);
  return { x: 220 + rx, y: 195 - (y * Math.cos(b) - rz * Math.sin(b)), depth: y * Math.sin(b) + rz * Math.cos(b) };
}

const corners: { name: string; rgb: ColorPoint }[] = [
  { name: "Schwarz", rgb: [0, 0, 0] }, { name: "Rot", rgb: [255, 0, 0] },
  { name: "Grün", rgb: [0, 255, 0] }, { name: "Blau", rgb: [0, 0, 255] },
  { name: "Gelb", rgb: [255, 255, 0] }, { name: "Magenta", rgb: [255, 0, 255] },
  { name: "Cyan", rgb: [0, 255, 255] }, { name: "Weiß", rgb: [255, 255, 255] },
];

export function ColorSpaceLab() {
  const id = useId();
  const [rgb, setRgb] = useState<ColorPoint>([255, 128, 0]);
  const [yaw, setYaw] = useState(32);
  const [pitch, setPitch] = useState(22);
  const [flat, setFlat] = useState(false);
  const project = (p: ColorPoint) => projectColorPoint(p, yaw, pitch);
  const selected = project(rgb), origin = project([0, 0, 0]);
  const legs: ColorPoint[] = [[0, 0, 0], [rgb[0], 0, 0], [rgb[0], rgb[1], 0], rgb];
  const hex = colorHex(rgb);
  return <section className="rgbspace" aria-labelledby={id}>
    <span className="rgbspace-kicker">3D-MODELL · DREHEN UND VERÄNDERN</span>
    <h3 id={id}>Jede Bildschirmfarbe hat einen Platz im Würfel</h3>
    <p>Stell dir drei Regler als drei Richtungen vor: Rot nach rechts, Grün nach oben und Blau in die Tiefe. Ein Punkt im Würfel steht für genau eine Kombination. So wird aus drei Zahlen eine Farbe – zum Beispiel beim Bearbeiten eines Fotos.</p>
    <p className="rgbspace-predict"><strong>Erst vermuten:</strong> Wo liegen Schwarz und Weiß? Was passiert, wenn du nur den Blau-Anteil deiner Farbe erhöhst?</p>
    <div className="rgbspace-buttons"><button type="button" aria-pressed={!flat} onClick={() => setFlat(false)}>Räumliches Modell</button><button type="button" aria-pressed={flat} onClick={() => setFlat(true)}>Einfache Balkenansicht</button></div>
    <div className="rgbspace-layout">
      <div>
        {!flat ? <svg viewBox="0 0 440 400" role="img" aria-label={`Drehbarer RGB-Würfel. Ausgewählter Punkt: Rot ${rgb[0]}, Grün ${rgb[1]}, Blau ${rgb[2]}. Die gleichen Werte stehen an den Reglern.`}>
          <rect width="440" height="400" rx="14" fill="#edf2e8" />
          {corners.flatMap((c, i) => corners.slice(i + 1).filter(d => c.rgb.filter((n, k) => n !== d.rgb[k]).length === 1).map(d => {
            const a = project(c.rgb), b = project(d.rgb);
            return <line key={`${c.name}-${d.name}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#7d8e80" strokeWidth="1.5" />;
          }))}
          <polyline points={legs.map(p => {const q = project(p); return `${q.x},${q.y}`;}).join(" ")} fill="none" stroke="#183e32" strokeWidth="3" strokeDasharray="5 4" />
          {corners.map(c => ({...c, p: project(c.rgb)})).sort((a, b) => a.p.depth - b.p.depth).map(c => <g key={c.name}>
            <circle cx={c.p.x} cy={c.p.y} r="8" fill={colorHex(c.rgb)} stroke="#183e32" strokeWidth="1.5" />
          </g>)}
          {([{rgb:[255, 0, 0], name:"R"}, {rgb:[0, 255, 0], name:"G"}, {rgb:[0, 0, 255], name:"B"}] as const).map(c => { const p = project(c.rgb); return <text key={c.name} x={p.x + (p.x > origin.x ? 15 : -18)} y={p.y - 12} fill="#183e32" fontSize="17" fontWeight="bold">{c.name}</text>; })}
          <circle cx={selected.x} cy={selected.y} r="13" fill={hex} stroke="#fffefa" strokeWidth="5" />
          <circle cx={selected.x} cy={selected.y} r="16" fill="none" stroke="#183e32" strokeWidth="2" />
        </svg> : <div className="rgbspace-bars" role="img" aria-label={`Rot ${rgb[0]}, Grün ${rgb[1]}, Blau ${rgb[2]} von jeweils 255`}>
          {["Rot", "Grün", "Blau"].map((name, i) => <div key={name}><strong>{name}: {rgb[i]} / 255</strong><div className="rgbspace-track"><span style={{width:`${rgb[i] / 255 * 100}%`, background:["#b64242", "#26794e", "#3269a8"][i]}} /></div></div>)}
        </div>}
        {!flat && <p className="rgbspace-legend">R = Rot · G = Grün · B = Blau. Der Ring markiert deine Farbe; die gestrichelte Linie zeigt ihre drei Anteile.</p>}
        {!flat && <div className="rgbspace-view">
          <label htmlFor={`${id}-yaw`}>Modell drehen: {yaw}°<input id={`${id}-yaw`} type="range" min="-180" max="180" value={yaw} onChange={e => setYaw(Number(e.target.value))}/></label>
          <label htmlFor={`${id}-pitch`}>Von oben schauen: {pitch}°<input id={`${id}-pitch`} type="range" min="-45" max="60" value={pitch} onChange={e => setPitch(Number(e.target.value))}/></label>
        </div>}
      </div>
      <div className="rgbspace-controls">
        <div className="rgbspace-preview" style={{background:hex}} aria-hidden="true" />
        <output className="rgbspace-code" aria-label="Farbcode">{hex}</output>
        {["Rot", "Grün", "Blau"].map((name, i) => <label key={name} htmlFor={`${id}-color-${i}`}><span>{name}: <strong>{rgb[i]}</strong></span><input id={`${id}-color-${i}`} type="range" min="0" max="255" step="1" value={rgb[i]} onChange={e => setRgb(rgb.map((n, j) => j === i ? Number(e.target.value) : n) as unknown as ColorPoint)} /></label>)}
      </div>
    </div>
    <div className="rgbspace-buttons" aria-label="Würfelecken auswählen">{corners.map(c => <button key={c.name} type="button" aria-pressed={rgb.every((n, i) => n === c.rgb[i])} onClick={() => setRgb(c.rgb)}><span className="rgbspace-dot" style={{background:colorHex(c.rgb)}} aria-hidden="true"/>{c.name}</button>)}</div>
    <p className="rgbspace-result" role="status">Dein Punkt: <strong>({rgb.join(" | ")})</strong>. {rgb.every(n => n === 0) ? "Alle drei Lichtanteile sind aus: Schwarz." : rgb.every(n => n === 255) ? "Alle drei Lichtanteile sind maximal: Weiß." : rgb[0] === rgb[1] && rgb[1] === rgb[2] ? "Gleiche Anteile liegen auf der Diagonale zwischen Schwarz und Weiß: ein Grauton." : "Veränderst du einen Farbregler, verschiebst du den Punkt parallel zur passenden Würfelkante."} Drehen verändert nur deinen Blick, nicht die Farbe.</p>
    <details><summary>Warum passen über 16 Millionen Farben in diesen Würfel?</summary><p>Jeder Kanal hat 256 ganzzahlige Werte: 0 bis 255. Zu jedem Rotwert passen 256 Grünwerte und zu jedem solchen Paar 256 Blauwerte. Deshalb: <strong>256 × 256 × 256 = 16 777 216</strong> Kombinationen. Gespeichert werden 8 + 8 + 8 = 24 Bits pro Pixel ohne Transparenz.</p><p>Der Würfel zeigt den RGB-Zahlenraum vereinfacht. Gleich große Abstände bedeuten nicht automatisch gleich große wahrgenommene Farbunterschiede. Hier wird Licht gemischt, nicht Wasserfarbe.</p></details>
    <button className="rgbspace-reset" type="button" onClick={() => {setRgb([255, 128, 0]); setYaw(32); setPitch(22); setFlat(false);}}>Modell zurücksetzen</button>
  </section>;
}
