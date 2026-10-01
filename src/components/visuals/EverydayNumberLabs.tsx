import { useId, useState } from "react";
import "./EverydayNumberLabs.css";

const HEX = "0123456789ABCDEF";
const channels = ["Rot", "Grün", "Blau"] as const;

export function DecimalPlaceLab() {
  const id = useId();
  const [value, setValue] = useState(406);
  const [active, setActive] = useState(0);
  const digits = [Math.floor(value / 100), Math.floor(value / 10) % 10, value % 10];
  const weights = [100, 10, 1];
  const names = ["Hunderter", "Zehner", "Einer"];
  return <section className="everylab" aria-labelledby={id}>
    <span className="everylab-kicker">SCHAUBILD ZUM ANKLICKEN</span>
    <h3 id={id}>Dieselbe Ziffer, ein anderer Platz</h3>
    <p>Wähle eine Zahl und klicke auf ihre Stellen. Die Ziffer sagt, wie viele Päckchen du hast. Der Platz sagt, wie groß ein Päckchen ist.</p>
    <div className="everylab-presets" aria-label="Beispielzahlen">
      {[406, 333, 70].map(n => <button key={n} type="button" aria-pressed={value === n} onClick={() => setValue(n)}>{n}</button>)}
    </div>
    <div className="everylab-decimal">
      {digits.map((digit, index) => <button key={index} type="button" aria-pressed={active === index} onClick={() => setActive(index)} aria-label={`${names[index]}: ${digit} mal ${weights[index]} ergibt ${digit * weights[index]}`}>
        <span>{names[index]}</span><strong>{digit}</strong><span>× {weights[index]}</span>
        <div className="everylab-packets" aria-hidden="true">{Array.from({ length: digit }, (_, i) => <span key={i}>{weights[index]}</span>)}{digit === 0 && <em>Kein Päckchen</em>}</div>
      </button>)}
    </div>
    <p className="everylab-result" role="status">{digits[active]} {names[active]}: {digits[active]} × {weights[active]} = <strong>{digits[active] * weights[active]}</strong></p>
    <p className="everylab-equation">{digits.map((digit, index) => `${digit} × ${weights[index]}`).join(" + ")} = <strong>{value}</strong></p>
    <p className="everylab-note">{value === 70 ? "Hier steht 070 in der Tafel. Die führende Null kannst du weglassen. Die Null rechts nicht: Aus 70 würde sonst 7." : value === 406 ? "Die Null in der Mitte hält den Zehnerplatz frei. Ohne sie würde aus 406 die Zahl 46." : "Alle drei Ziffern sind 3. Trotzdem tragen sie 300, 30 und 3 zur Zahl bei."}</p>
  </section>;
}

export function HexColorLab() {
  const id = useId();
  const [values, setValues] = useState([36, 106, 176]);
  const [active, setActive] = useState(1);
  const selected = values[active];
  const high = Math.floor(selected / 16);
  const low = selected % 16;
  const code = "#" + values.map(value => value.toString(16).padStart(2, "0").toUpperCase()).join("");
  return <section className="everylab" aria-labelledby={id}>
    <span className="everylab-kicker">VOM BYTE ZUR BILDSCHIRMFARBE</span>
    <h3 id={id}>Eine Farbe besteht hier aus drei Zahlen</h3>
    <p>Bewege die Regler. Rot, Grün und Blau haben jeweils einen Wert von 0 bis 255. Diese drei Lichtanteile ergeben gemeinsam die angezeigte Farbe.</p>
    <div className="everylab-colormixer">
      <div className="everylab-swatches">
        <div className="everylab-swatch" style={{ backgroundColor: code }} role="img" aria-label={`Mischfarbe ${code}: Rot ${values[0]}, Grün ${values[1]}, Blau ${values[2]}`} />
        <output className="everylab-colorcode" aria-label="Hexadezimaler Farbcode">{code}</output>
        <span>3 Bytes = 24 Bits</span>
      </div>
      <div className="everylab-sliders">{channels.map((channel, index) => <label key={channel} htmlFor={`${id}-${index}`}>
        <span><strong>{channel}</strong><output>{values[index]}₁₀ = {values[index].toString(16).padStart(2, "0").toUpperCase()}₁₆</output></span>
        <input id={`${id}-${index}`} type="range" min="0" max="255" step="1" value={values[index]} onChange={event => { setActive(index); setValues(previous => previous.map((value, i) => i === index ? Number(event.target.value) : value)); }} />
      </label>)}</div>
    </div>
    <div className="everylab-presets" aria-label="Farben ausprobieren">
      <button type="button" onClick={() => setValues([0, 0, 0])}>Alle aus: Schwarz</button>
      <button type="button" onClick={() => setValues([255, 255, 255])}>Alle voll: Weiß</button>
      <button type="button" onClick={() => setValues([36, 106, 176])}>Beispielfarbe</button>
    </div>
    <h4>Eine der drei Zahlen genauer anschauen</h4>
    <div className="everylab-presets" aria-label="Kanal für den Rechenweg">{channels.map((channel, index) => <button key={channel} type="button" aria-pressed={active === index} onClick={() => setActive(index)}>{channel}</button>)}</div>
    <div className="everylab-hexgroups" aria-label={`${channels[active]}: ${selected} dezimal, ${HEX[high]}${HEX[low]} hexadezimal`}>
      {[high, low].map((part, index) => <div key={index}>
        <span>{index === 0 ? "Linke Vierergruppe" : "Rechte Vierergruppe"}</span>
        <div className="everylab-fourbits" aria-label={part.toString(2).padStart(4, "0")}>
          {part.toString(2).padStart(4, "0").split("").map((bit, i) => <span key={i} data-on={bit === "1"}><small>{[8, 4, 2, 1][i]}</small><strong>{bit}</strong></span>)}
        </div>
        <p>{part}₁₀ = <strong>{HEX[part]}₁₆</strong></p>
      </div>)}
    </div>
    <div className="everylab-calculation" aria-live="polite">
      <h4>Vorgerechnet für {channels[active]}: {selected}₁₀</h4>
      <ol>
        <li>Teile durch 16: {selected} : 16 = {high} Rest {low}.</li>
        <li>Übersetze beide Werte in Hex-Ziffern: {high} wird {HEX[high]}, {low} wird {HEX[low]}.</li>
        <li>Schreibe beide Ziffern nebeneinander: <strong>{HEX[high]}{HEX[low]}₁₆</strong>. Rückprobe: {high} × 16 + {low} = {selected}.</li>
        <li>Jede Hex-Ziffer liefert vier Bits: {high.toString(2).padStart(4, "0")} {low.toString(2).padStart(4, "0")}₂.</li>
      </ol>
    </div>
    <p className="everylab-note">Das ist ein vereinfachtes RGB-Modell ohne Transparenz. Gemeint ist die Mischung von Licht am Bildschirm, nicht von Wasserfarben. A, B, C, D, E und F stehen für 10, 11, 12, 13, 14 und 15.</p>
  </section>;
}
