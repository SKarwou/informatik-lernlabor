import { useEffect, useId, useMemo, useState } from "react";
import "./ArithmeticLabs.css";

type AdditionColumn = {
  position: number;
  first: number;
  second: number;
  carryIn: number;
  sum: number;
  result: number;
  carryOut: number;
};

export function calculateAdditionSteps(first: number, second: number): AdditionColumn[] {
  if (![first, second].every(value => Number.isInteger(value) && value >= 0 && value <= 15)) {
    throw new RangeError("Die Summanden müssen ganze Zahlen von 0 bis 15 sein.");
  }
  let carry = 0;
  return Array.from({ length: 4 }, (_, position) => {
    const firstBit = (first >> position) & 1;
    const secondBit = (second >> position) & 1;
    const sum = firstBit + secondBit + carry;
    const column = { position, first: firstBit, second: secondBit, carryIn: carry, sum, result: sum % 2, carryOut: Math.floor(sum / 2) };
    carry = column.carryOut;
    return column;
  });
}

function binary(value: number, length: number) {
  return value.toString(2).padStart(length, "0");
}

export function interpretSignedBits(pattern: number) {
  if (!Number.isInteger(pattern) || pattern < 0 || pattern > 255) {
    throw new RangeError("Ein Achtbitmuster muss als ganze Zahl von 0 bis 255 angegeben werden.");
  }
  return pattern >= 128 ? pattern - 256 : pattern;
}

export function calculateByteAddition(first: number, second: number) {
  const signedFirst = interpretSignedBits(first);
  const signedSecond = interpretSignedBits(second);
  const unsignedSum = first + second;
  const signedSum = signedFirst + signedSecond;
  const stored = unsignedSum % 256;
  return {
    signedFirst, signedSecond, unsignedSum, signedSum, stored,
    carryOut: Math.floor(unsignedSum / 256),
    unsignedOverflow: unsignedSum > 255,
    signedOverflow: signedSum < -128 || signedSum > 127,
    signedResult: interpretSignedBits(stored),
  };
}

function sumOfWeights(pattern: number, signed: boolean) {
  const terms = Array.from({ length: 8 }, (_, index) => 7 - index)
    .filter(position => ((pattern >> position) & 1) === 1)
    .map(position => position === 7 && signed ? "−128" : String(2 ** position));
  return terms.length ? terms.join(" + ") : "0 (kein Bit ist 1)";
}

const columnNames = ["Einer", "Zweier", "Vierer", "Achter"];
const positions = [4, 3, 2, 1, 0];

export function BinaryAdditionLab() {
  const id = useId();
  const [first, setFirst] = useState(6);
  const [second, setSecond] = useState(7);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false,
  );
  const columns = useMemo(() => calculateAdditionSteps(first, second), [first, second]);
  const total = first + second;
  const done = step === 5;
  const activePosition = step >= 1 && step <= 4 ? step - 1 : done ? 4 : -1;
  const current = step >= 1 && step <= 4 ? columns[step - 1] : null;

  useEffect(() => {
    if (!playing || reducedMotion || step >= 5) return;
    const timer = window.setTimeout(() => {
      setStep(step + 1);
      if (step + 1 === 5) setPlaying(false);
    }, 2200);
    return () => window.clearTimeout(timer);
  }, [playing, reducedMotion, step]);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => {
      setReducedMotion(preference.matches);
      if (preference.matches) setPlaying(false);
    };
    syncPreference();
    preference.addEventListener("change", syncPreference);
    return () => preference.removeEventListener("change", syncPreference);
  }, []);

  useEffect(() => {
    const pauseWhenHidden = () => { if (document.hidden) setPlaying(false); };
    const pauseBeforePrint = () => setPlaying(false);
    document.addEventListener("visibilitychange", pauseWhenHidden);
    window.addEventListener("beforeprint", pauseBeforePrint);
    return () => {
      document.removeEventListener("visibilitychange", pauseWhenHidden);
      window.removeEventListener("beforeprint", pauseBeforePrint);
    };
  }, []);

  function changeNumber(which: "first" | "second", value: string) {
    setPlaying(false);
    setStep(0);
    if (which === "first") setFirst(Number(value));
    else setSecond(Number(value));
  }

  function moveStep(direction: -1 | 1) {
    setPlaying(false);
    setStep(previous => Math.max(0, Math.min(5, previous + direction)));
  }

  function cellClass(position: number) {
    return ["arithlab-cell", position === 4 ? "arithlab-extra" : "", position === activePosition ? "arithlab-active" : ""].filter(Boolean).join(" ");
  }

  return (
    <section className="arithlab" aria-labelledby={`${id}-title`}>
      <header className="arithlab-header">
        <span className="arithlab-kicker">Ausprobieren · Binär addieren</span>
        <h3 id={`${id}-title`}>Eine Spalte nach der anderen</h3>
        <p>Wie beim schriftlichen Rechnen beginnst du rechts. Pro Stelle passen nur die Ziffern 0 und 1. Zwei Einheiten werden deshalb zu einem Übertrag in die nächste linke Spalte.</p>
      </header>

      <div className="arithlab-inputs">
        <label htmlFor={`${id}-first`}>Erste Zahl (dezimal)
          <select id={`${id}-first`} value={first} onChange={event => changeNumber("first", event.target.value)}>
            {Array.from({ length: 16 }, (_, value) => <option key={value} value={value}>{value}</option>)}
          </select>
          <span className="arithlab-input-bits">{binary(first, 4)}<sub>2</sub></span>
        </label>
        <span className="arithlab-operator" aria-hidden="true">+</span>
        <label htmlFor={`${id}-second`}>Zweite Zahl (dezimal)
          <select id={`${id}-second`} value={second} onChange={event => changeNumber("second", event.target.value)}>
            {Array.from({ length: 16 }, (_, value) => <option key={value} value={value}>{value}</option>)}
          </select>
          <span className="arithlab-input-bits">{binary(second, 4)}<sub>2</sub></span>
        </label>
      </div>

      <p className="arithlab-direction"><strong>Rechenrichtung: von rechts nach links.</strong> Die umrandete Spalte gehört zum angezeigten Schritt. „?“ bedeutet: noch nicht berechnet.</p>
      <div className="arithlab-table-scroll" role="region" aria-label="Schriftliches Additionsschema, bei Bedarf horizontal verschiebbar" tabIndex={0}>
        <table className="arithlab-addition">
          <caption>Vier gespeicherte Bits und eine zusätzliche Ergebnisstelle</caption>
          <thead>
            <tr><th scope="col">Stellenwert</th>{positions.map(position => <th scope="col" className={cellClass(position)} key={position}>{2 ** position}<small>{position === 4 ? "zusätzlich" : columnNames[position]}</small></th>)}</tr>
          </thead>
          <tbody>
            <tr className="arithlab-carry-row"><th scope="row">Übertrag hinein</th>{positions.map(position => <td className={cellClass(position)} key={position}>{position === 0 ? 0 : step >= position ? columns[position - 1].carryOut : "?"}</td>)}</tr>
            <tr><th scope="row">Erste Zahl</th>{positions.map(position => <td className={cellClass(position)} key={position}>{position === 4 ? "—" : columns[position].first}</td>)}</tr>
            <tr><th scope="row">+ Zweite Zahl</th>{positions.map(position => <td className={cellClass(position)} key={position}>{position === 4 ? "—" : columns[position].second}</td>)}</tr>
            <tr className="arithlab-sum-row"><th scope="row">Spaltensumme<small>als Dezimalzahl</small></th>{positions.map(position => <td className={cellClass(position)} key={position}>{position === 4 ? "—" : step > position ? columns[position].sum : "?"}</td>)}</tr>
            <tr className="arithlab-result-row"><th scope="row">Ergebnisbit</th>{positions.map(position => <td className={cellClass(position)} key={position}>{position === 4 ? done ? columns[3].carryOut : "?" : step > position ? columns[position].result : "?"}</td>)}</tr>
            <tr className="arithlab-carry-row"><th scope="row">Übertrag hinaus<small>in die nächste linke Spalte</small></th>{positions.map(position => <td className={cellClass(position)} key={position}>{position === 4 ? "—" : step > position ? columns[position].carryOut : "?"}</td>)}</tr>
          </tbody>
        </table>
      </div>
      <p className="arithlab-note">„Hinaus“ steht unter der Spalte, in der der Übertrag entsteht. Derselbe Wert erscheint eine Spalte weiter links bei „hinein“. Ganz rechts ist der eingehende Übertrag immer 0.</p>

      <div className="arithlab-controls" role="group" aria-label="Additionsschritte steuern">
        <button type="button" onClick={() => moveStep(-1)} disabled={step === 0}>Zurück</button>
        <button type="button" className="arithlab-primary" onClick={() => moveStep(1)} disabled={done}>Weiter</button>
        <button type="button" onClick={() => { if (!reducedMotion) setPlaying(previous => !previous); }} disabled={done || reducedMotion} aria-pressed={playing} aria-describedby={reducedMotion ? `${id}-motion-hint` : undefined}>{playing ? "Pause" : "Automatisch abspielen"}</button>
        <button type="button" onClick={() => { setPlaying(false); setStep(0); }}>Schritte zurücksetzen</button>
      </div>
      {reducedMotion && <p className="arithlab-note" id={`${id}-motion-hint`}>Dein Gerät bevorzugt reduzierte Bewegung. Automatisches Abspielen ist ausgeschaltet; mit „Weiter“ und „Zurück“ steuerst du jeden Schritt selbst.</p>}

      <div className="arithlab-explanation" role="status" aria-live={playing ? "off" : "polite"} aria-atomic="true">
        <strong className="arithlab-step">Schritt {step} von 5</strong>
        {step === 0 && <p>Bereit für {first} + {second}. Klicke auf „Weiter“, um zuerst die Einer ganz rechts zu berechnen. Es startet nichts von selbst.</p>}
        {current && <>
          <h4>{columnNames[current.position]}stelle · Stellenwert {2 ** current.position}</h4>
          <p className="arithlab-equation">{current.first} + {current.second} + {current.carryIn} = {current.sum}</p>
          <p>Erstes Bit + zweites Bit + <strong>eingehender Übertrag {current.carryIn}</strong> ergeben die Spaltensumme <strong>{current.sum} (dezimal)</strong>.</p>
          <p>{current.sum} = 2 × {current.carryOut} + {current.result}. Also schreibst du <strong>{current.result} als Ergebnisbit</strong> in diese Spalte und gibst <strong>{current.carryOut} als Übertrag</strong> an die nächste linke Spalte weiter.</p>
        </>}
        {done && <>
          <h4>Die zusätzliche Sechzehnerstelle</h4>
          <p>Aus der Achterstelle kommt der Übertrag {columns[3].carryOut}. Er wird zum fünften Ergebnisbit. Es gibt dort keine weiteren Summanden.</p>
          <p className="arithlab-equation">{binary(total, 5)}<sub>2</sub> = {total}<sub>10</sub></p>
          {total > 15
            ? <p><strong>Überlauf im vorzeichenlosen 4-Bit-Modell:</strong> {total} ist größer als 15. Bleiben nur die vier rechten Bits {binary(total % 16, 4)}, steht dort {total % 16}. Die zusätzliche linke 1 hat den Wert 16 und darf für das vollständige Ergebnis nicht verloren gehen.</p>
            : <p><strong>Kein Überlauf im vorzeichenlosen 4-Bit-Modell:</strong> {total} passt in den Bereich 0 bis 15. Die zusätzliche Stelle ist 0; die vier rechten Bits {binary(total, 4)} reichen aus.</p>}
        </>}
      </div>
      <details className="arithlab-rule">
        <summary>Warum nur 0 oder 1 im Ergebnis?</summary>
        <p>Eine Spaltensumme kann hier 0, 1, 2 oder 3 sein. Das Ergebnisbit ist der Rest beim Teilen durch 2. Der Übertrag sagt, ob ein Zweierpaket zur nächsten Stelle wandert.</p>
        <ul>
          <li>Summe 0: Ergebnisbit 0, Übertrag 0.</li>
          <li>Summe 1: Ergebnisbit 1, Übertrag 0.</li>
          <li>Summe 2 = 10<sub>2</sub>: Ergebnisbit 0, Übertrag 1.</li>
          <li>Summe 3 = 11<sub>2</sub>: Ergebnisbit 1, Übertrag 1.</li>
        </ul>
      </details>
    </section>
  );
}

const arithmeticCases = [
  { title: "127 + 1", first: 127, second: 1, lesson: "Kein äußerer Übertrag, aber Vorzeichenüberlauf: Zwei positive Zahlen ergeben in der gespeicherten Zweierkomplement-Deutung eine negative Zahl." },
  { title: "−1 + 1", first: 255, second: 1, lesson: "Ein äußerer Übertrag bedeutet nicht automatisch Vorzeichenüberlauf. Im Zweierkomplement ist −1 + 1 = 0 korrekt darstellbar." },
  { title: "−128 + (−1)", first: 128, second: 255, lesson: "Hier treten beide Überläufe auf. Vorzeichenlos ist die Summe zu groß; im Zweierkomplement ist die mathematische Summe kleiner als −128." },
];

function NumberLine({ value, signed }: { value: number; signed: boolean }) {
  const minimum = signed ? -128 : 0;
  const maximum = signed ? 127 : 255;
  const percent = ((value - minimum) / (maximum - minimum)) * 100;
  return <figure className="arithlab-numberline">
    <figcaption>{signed ? "Mit Vorzeichen" : "Ohne Vorzeichen"}: Bereich {minimum} bis {maximum}</figcaption>
    <div className="arithlab-line" role="img" aria-label={`Zahlenstrahl von ${minimum} bis ${maximum}. Aktueller Wert: ${value}.`}>
      <span className="arithlab-line-zero" style={{ left: signed ? `${128 / 255 * 100}%` : "0%" }} />
      <span className="arithlab-line-marker" style={{ left: `${percent}%` }} />
    </div>
    <div className="arithlab-line-labels" aria-hidden="true"><span>{minimum}</span>{signed && <span className="arithlab-zero-label">0</span>}<span>{maximum}</span></div>
    <p>Markierung bei <strong>{value}</strong></p>
  </figure>;
}

export function SignedBitsLab() {
  const id = useId();
  const [pattern, setPattern] = useState(130);
  const [selectedCase, setSelectedCase] = useState(0);
  const signed = interpretSignedBits(pattern);
  const example = arithmeticCases[selectedCase];
  const { unsignedSum, signedFirst, signedSecond, signedSum, stored, carryOut, signedOverflow, signedResult } = calculateByteAddition(example.first, example.second);

  return (
    <section className="arithlab" aria-labelledby={`${id}-title`}>
      <header className="arithlab-header">
        <span className="arithlab-kicker">Ausprobieren · Ein Muster, zwei Bedeutungen</span>
        <h3 id={`${id}-title`}>Was bedeutet das linke Bit?</h3>
        <p>Ein Bitmuster sagt nicht von allein, ob es eine negative Zahl meint. Die vereinbarte Deutung entscheidet: Ohne Vorzeichen zählt das linke Bit <strong>+128</strong>, im 8-Bit-Zweierkomplement <strong>−128</strong>. Die anderen Stellen bleiben gleich.</p>
      </header>

      <fieldset className="arithlab-bit-field">
        <legend>Acht Bits zum Anklicken: 0 wird 1, 1 wird 0</legend>
        <div className="arithlab-bits-scroll" role="region" aria-label="Acht Bit-Schalter, bei Bedarf horizontal verschiebbar" tabIndex={0}>
          <div className="arithlab-bit-buttons">
            {Array.from({ length: 8 }, (_, index) => {
              const position = 7 - index;
              const bit = (pattern >> position) & 1;
              return <div className={`arithlab-bit-column ${position === 7 ? "arithlab-sign-column" : ""}`} key={position}>
                <span className="arithlab-bit-label">Bit {position}</span>
                <button type="button" className="arithlab-bit" aria-pressed={bit === 1} aria-label={`Bit ${position}, Wert ${bit}, Stellenwert ${position === 7 ? "ohne Vorzeichen plus 128, im Zweierkomplement minus 128" : 2 ** position}. Umschalten.`} onClick={() => setPattern(previous => previous ^ (1 << position))}>{bit}</button>
                <span className="arithlab-weight">{position === 7 ? "+128" : 2 ** position}</span>
                <span className="arithlab-weight arithlab-signed-weight">{position === 7 ? "−128" : 2 ** position}</span>
              </div>;
            })}
          </div>
        </div>
        <p className="arithlab-note">Stellenwerte unter den Schaltern: oben ohne Vorzeichen, unten im Zweierkomplement. Bit 7 ist ganz links; Bit 0 ganz rechts.</p>
      </fieldset>

      <div className="arithlab-presets" role="group" aria-label="Bitmuster auswählen">
        <span>Interessante Muster:</span>
        {[0, 127, 128, 255].map(value => <button type="button" key={value} aria-pressed={pattern === value} onClick={() => setPattern(value)}>{binary(value, 8)}</button>)}
      </div>

      <div className="arithlab-interpretations" aria-live="polite" aria-atomic="true">
        <article className="arithlab-interpretation">
          <h4>Ohne Vorzeichen</h4>
          <p className="arithlab-large-number">{pattern}<span>dezimal</span></p>
          <p className="arithlab-weight-sum">{sumOfWeights(pattern, false)} = <strong>{pattern}</strong></p>
          <NumberLine value={pattern} signed={false} />
        </article>
        <article className="arithlab-interpretation arithlab-interpretation-signed">
          <h4>Mit Vorzeichen: Zweierkomplement</h4>
          <p className="arithlab-large-number">{signed}<span>dezimal</span></p>
          <p className="arithlab-weight-sum">{sumOfWeights(pattern, true)} = <strong>{signed}</strong></p>
          <NumberLine value={signed} signed />
        </article>
      </div>
      <p className="arithlab-memory"><strong>Dasselbe Muster {binary(pattern, 8)}.</strong> Nur die Stellenwertregel ändert sich. {pattern >= 128 ? `Hier ist das linke Bit 1: ${pattern} − 256 = ${signed}.` : "Hier ist das linke Bit 0. Deshalb sind beide Zahlenwerte gleich."} Im Zweierkomplement ist das linke Bit also keine zusätzliche Minusmarke vor den übrigen sieben Bits, sondern hat den Stellenwert −128.</p>

      <div className="arithlab-case-section">
        <h4>Übertrag und Überlauf sind zwei verschiedene Fragen</h4>
        <p>Die Hardware addiert die Bits gleich. Ob das mathematische Ergebnis in acht Bits passt, hängt vom Zahlenbereich ab. Wähle einen dieser unabhängigen Rechenfälle:</p>
        <div className="arithlab-cases" role="group" aria-label="Rechenfall auswählen, Beschriftung im Zweierkomplement">
          {arithmeticCases.map((item, index) => <button type="button" key={item.title} aria-pressed={selectedCase === index} onClick={() => setSelectedCase(index)}>{item.title}</button>)}
        </div>
        <div className="arithlab-case-content" aria-live="polite" aria-atomic="true">
          <p className="arithlab-note">Die Fallnamen oben verwenden die Zweierkomplement-Deutung.</p>
          <div className="arithlab-binary-sum">
            <span>{binary(example.first, 8)}<sub>2</sub></span><span>+</span><span>{binary(example.second, 8)}<sub>2</sub></span><span>=</span>
            <span><b className="arithlab-outside-bit">{carryOut}</b><b className="arithlab-stored-bits">{binary(stored, 8)}</b><sub>2</sub></span>
          </div>
          <p className="arithlab-note">Links abgesetzt: äußerer Übertrag <strong>{carryOut}</strong>. Rechts zusammen: acht gespeicherte Bits <strong>{binary(stored, 8)}</strong>.</p>
          <div className="arithlab-case-comparison">
            <article>
              <h5>Vorzeichenlos: 0 bis 255</h5>
              <p className="arithlab-equation">{example.first} + {example.second} = {unsignedSum}</p>
              <p><strong>{carryOut ? "Überlauf." : "Kein Überlauf."}</strong> {carryOut ? `${unsignedSum} liegt außerhalb des Bereichs. Die acht gespeicherten Bits werden als ${stored} gelesen; die zusätzliche 256 fehlt.` : `${unsignedSum} passt in den Bereich. Die acht gespeicherten Bits werden korrekt als ${stored} gelesen.`}</p>
            </article>
            <article>
              <h5>Zweierkomplement: −128 bis 127</h5>
              <p className="arithlab-equation">{signedFirst} + {signedSecond < 0 ? `(${signedSecond})` : signedSecond} = {signedSum}</p>
              <p><strong>{signedOverflow ? "Vorzeichenüberlauf." : "Kein Vorzeichenüberlauf."}</strong> {signedOverflow ? `${signedSum} passt nicht in den Bereich. Das gespeicherte Muster wird als ${signedResult} gelesen, nicht als die mathematische Summe.` : `${signedSum} passt in den Bereich. Das gespeicherte Muster wird korrekt als ${signedResult} gelesen.`}</p>
            </article>
          </div>
          <p className="arithlab-memory"><strong>Darauf kommt es an:</strong> {example.lesson}</p>
        </div>
        <button type="button" className="arithlab-inspect-button" onClick={() => setPattern(stored)}>Ergebnismuster oben im Bitfeld untersuchen</button>
        <p className="arithlab-note">Das setzt die acht Bit-Schalter auf {binary(stored, 8)}. Die Auswahl des Rechenfalls bleibt gleich.</p>
      </div>
    </section>
  );
}
