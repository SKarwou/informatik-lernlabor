import { useEffect, useId, useState } from "react";
import "./BitAndPlaceLabs.css";

const PLACE_VALUES = [128, 64, 32, 16, 8, 4, 2, 1] as const;
const PRESETS = [37, 90, 166, 218] as const;

function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  return reducedMotion;
}

/** Only starts through a button; pauses on leaving the tab and before printing. */
function usePlayback(lastStep: number) {
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [delay, setDelay] = useState(1600);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!running) return;
    if (reducedMotion || step >= lastStep) {
      setRunning(false);
      return;
    }
    const timer = window.setTimeout(() => setStep(step + 1), delay);
    return () => window.clearTimeout(timer);
  }, [running, reducedMotion, step, lastStep, delay]);

  useEffect(() => {
    const pause = () => setRunning(false);
    const onVisibilityChange = () => { if (document.hidden) pause(); };
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("beforeprint", pause);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("beforeprint", pause);
    };
  }, []);

  const seek = (nextStep: number) => {
    setRunning(false);
    setStep(Math.max(0, Math.min(lastStep, nextStep)));
  };
  const toggle = () => {
    if (running) { setRunning(false); return; }
    if (reducedMotion || lastStep === 0) return;
    if (step >= lastStep) setStep(0);
    setRunning(true);
  };

  return { step, running, delay, setDelay, reducedMotion, seek, toggle, lastStep };
}

type Playback = ReturnType<typeof usePlayback>;

function PlaybackControls({ playback, disabled = false }: { playback: Playback; disabled?: boolean }) {
  const id = useId();
  return <div className="vlab-playback">
    <div className="vlab-controls" role="group" aria-label="Ablauf steuern">
      <button className="vlab-button" type="button" disabled={disabled || playback.step === 0}
        onClick={() => playback.seek(playback.step - 1)}>← Zurück</button>
      <button className="vlab-button vlab-button-primary" type="button"
        disabled={disabled || playback.reducedMotion} aria-pressed={playback.running}
        onClick={playback.toggle}>
        {playback.running ? "Pause" : playback.step === playback.lastStep ? "Neu abspielen" : "Start"}
      </button>
      <button className="vlab-button" type="button" disabled={disabled || playback.step >= playback.lastStep}
        onClick={() => playback.seek(playback.step + 1)}>Weiter →</button>
      <button className="vlab-button" type="button" disabled={disabled}
        onClick={() => playback.seek(0)}>Zurücksetzen</button>
      <label className="vlab-speed" htmlFor={`${id}-speed`}>Zeittakt
        <select className="vlab-select" id={`${id}-speed`} value={playback.delay}
          disabled={disabled || playback.reducedMotion}
          onChange={(event) => playback.setDelay(Number(event.target.value))}>
          <option value={2500}>Langsam · 2,5 s</option>
          <option value={1600}>Ruhig · 1,6 s</option>
          <option value={1000}>Zügig · 1 s</option>
        </select>
      </label>
    </div>
    <p className="vlab-note" aria-live="polite">
      {playback.reducedMotion
        ? "Dein Gerät bevorzugt weniger Bewegung. Nutze deshalb Zurück und Weiter für einzelne Schritte."
        : playback.running
          ? "Der Ablauf läuft. Du kannst jederzeit pausieren oder einen einzelnen Schritt wählen."
          : "Du bestimmst das Tempo: einzeln mit Weiter oder automatisch mit Start."}
    </p>
  </div>;
}

function bitPattern(value: number, width = 8) {
  return value.toString(2).padStart(width, "0");
}

export function BitLampLab() {
  const id = useId();
  const [lampCount, setLampCount] = useState(1);
  const possibilities = 2 ** lampCount;
  const playback = usePlayback(possibilities - 1);
  const pattern = bitPattern(playback.step, lampCount);

  return <section className="vlab-bitplace bitlab-lamps" aria-labelledby={`${id}-title`}>
    <p className="vlab-kicker">AUSPROBIEREN · ZWEI ZUSTÄNDE</p>
    <h3 className="vlab-title" id={`${id}-title`}>Eine Lampe, zwei Möglichkeiten</h3>
    <p className="vlab-description">Eine Lampe ist hier ein Modell für ein Bit: <strong>aus = 0</strong>, <strong>an = 1</strong>.
      Klicke eine Lampe an. Füge dann weitere Lampen hinzu und beobachte, wie viele verschiedene Muster möglich werden.</p>

    <fieldset className="vlab-fieldset vlab-screen-controls">
      <legend className="vlab-label">Wie viele Lampen möchtest du untersuchen?</legend>
      <div className="vlab-controls">
        {[1, 2, 3, 4].map((count) => <button type="button" className="vlab-button" key={count}
          aria-pressed={lampCount === count} onClick={() => { playback.seek(0); setLampCount(count); }}>
          {count} {count === 1 ? "Lampe" : "Lampen"}
        </button>)}
      </div>
    </fieldset>

    <div className="bitlab-lamp-row" role="group" aria-label="Lampen von links nach rechts">
      {Array.from(pattern).map((bit, index) => <button type="button"
        className={`bitlab-lamp${bit === "1" ? " bitlab-lamp-on" : ""}`} key={index}
        aria-label={`Lampe ${index + 1}: ${bit === "1" ? "an, Bit 1" : "aus, Bit 0"}. Umschalten.`}
        aria-pressed={bit === "1"}
        onClick={() => playback.seek(playback.step ^ (1 << (lampCount - index - 1)))}>
        <span className="bitlab-lamp-label">Lampe {index + 1}</span>
        <span className="bitlab-light" aria-hidden="true">{bit}</span>
        <strong className="bitlab-lamp-state">{bit === "1" ? "AN" : "AUS"}</strong>
      </button>)}
    </div>

    <div className="vlab-result" aria-live={playback.running ? "off" : "polite"} aria-atomic="true">
      <p className="vlab-result-line">Aktuelles Muster: <strong className="vlab-binary">{pattern}</strong></p>
      <p className="vlab-result-detail">{lampCount} {lampCount === 1 ? "Bit hat" : "Bits haben"}{" "}
        <strong>{Array(lampCount).fill("2").join(" · ")} = {possibilities} verschiedene Muster</strong>.</p>
      <p className="vlab-result-detail">In unserer Zählfolge ist dies Muster {playback.step + 1} von {possibilities}.
        Auch „alle aus“ zählt als ein Muster.</p>
    </div>

    <PlaybackControls playback={playback} />
    <p className="vlab-explanation">Jede zusätzliche Lampe verdoppelt die Möglichkeiten: Für jedes bisherige Muster
      kann die neue Lampe aus <em>oder</em> an sein. Die Zählfolge zeigt alle Muster und hält am Ende an.</p>
    <p className="vlab-question"><strong>Erst überlegen:</strong> Wie verändert sich die Zahl der Möglichkeiten,
      wenn aus einer Lampe zwei werden? Prüfe deine Vermutung oben.</p>
    <p className="vlab-print-note">Druckansicht: {lampCount} Lampen, aktuelles Muster {pattern}, {possibilities} mögliche Muster.</p>
  </section>;
}

export function PlaceValueLab() {
  const id = useId();
  const [value, setValue] = useState(90);
  const pattern = bitPattern(value);
  const summands = PLACE_VALUES.filter((weight) => (value & weight) !== 0);

  return <section className="vlab-bitplace bitlab-places" aria-labelledby={`${id}-title`}>
    <p className="vlab-kicker">SEHEN UND VERSTEHEN · STELLENWERTE</p>
    <h3 className="vlab-title" id={`${id}-title`}>Welche Eins zählt wie viel?</h3>
    <p className="vlab-description">Wir lesen diese acht Bits als <strong>vorzeichenlose Zahl</strong>, also ohne Minuszeichen.
      Über jedem Bit steht sein Stellenwert. Eine 1 nimmt diesen Wert mit in die Summe; eine 0 trägt nichts bei.</p>
    <div className="vlab-controls vlab-screen-controls" role="group" aria-label="Eigenständige Beispielzahlen auswählen">
      <span className="vlab-label">Beispiel laden:</span>
      {PRESETS.map((preset) => <button className="vlab-button" type="button" key={preset}
        aria-pressed={value === preset} onClick={() => setValue(preset)}>{preset}</button>)}
      <button className="vlab-button" type="button" onClick={() => setValue(0)}>Alle Bits auf 0</button>
    </div>
    <p className="vlab-note">Klicke auf ein Bit, um es umzuschalten. Die Summe darunter ändert sich sofort.</p>
    <p className="vlab-mobile-note">Die Tafel läuft von links nach rechts. Bei wenig Platz kannst du sie seitlich verschieben.</p>
    <div className="vlab-scroll" role="region" tabIndex={0} aria-label="Acht Bits mit Stellenwerten, horizontal verschiebbar">
      <div className="bitlab-place-row" role="group" aria-label="Stellenwerte von 128 bis 1">
        {PLACE_VALUES.map((weight, index) => {
          const on = pattern[index] === "1";
          return <div className={`bitlab-place${on ? " bitlab-place-on" : ""}`} key={weight}>
            <span className="bitlab-weight">{weight}</span>
            <button type="button" className="bitlab-bit" aria-pressed={on}
              aria-label={`Stellenwert ${weight}: Bit ${on ? "1" : "0"}. Umschalten.`}
              onClick={() => setValue((previous) => previous ^ weight)}>{on ? "1" : "0"}</button>
            <span className="bitlab-contribution">+{on ? weight : 0}</span>
          </div>;
        })}
      </div>
    </div>
    <div className="vlab-result" aria-live="polite" aria-atomic="true">
      <p className="vlab-result-line"><strong className="vlab-binary">{pattern}<sub>2</sub></strong>
        <span className="vlab-equals"> = </span><strong>{value}<sub>10</sub></strong></p>
      <p className="vlab-result-detail"><strong>Nur die Einsen zählen mit:</strong><br />
        {summands.length > 0 ? summands.join(" + ") : "Kein Stellenwert ist eingeschaltet: 0"} = {value}</p>
    </div>
    <details className="vlab-details">
      <summary className="vlab-summary">Jede einzelne Stelle als Rechnung anzeigen</summary>
      <p className="vlab-formula">{PLACE_VALUES.map((weight, index) => `${pattern[index]} · ${weight}`).join(" + ")} = {value}</p>
    </details>
    <p className="vlab-explanation">Rechts beginnt die Tafel bei 1. Nach links verdoppelt sich der Stellenwert: 1, 2, 4, 8, …
      Die kleine 2 am Bitmuster bedeutet „Binärsystem“, die kleine 10 „Dezimalsystem“. Es ist derselbe Zahlenwert in zwei Schreibweisen.</p>
    <p className="vlab-question"><strong>Erst vorhersagen:</strong> Wie ändert sich der Wert, wenn du nur das Bit über dem Stellenwert 32 umschaltest?
      Begründe, wann 32 dazukommt und wann 32 wegfällt.</p>
    <p className="vlab-print-note">Druckansicht: Die Bit-Tafel und die Rechnung zeigen den zuletzt eingestellten Wert.</p>
  </section>;
}

export function createConversionSteps(value: number) {
  if (!Number.isInteger(value) || value < 0 || value > 255) {
    throw new RangeError("Für acht vorzeichenlose Bits ist eine ganze Zahl von 0 bis 255 erforderlich.");
  }
  let remainder = value;
  return PLACE_VALUES.map((weight) => {
    const before = remainder;
    const fits = before >= weight;
    if (fits) remainder -= weight;
    return { weight, before, fits, bit: fits ? "1" : "0", after: remainder };
  });
}

export function DecimalConversionLab() {
  const id = useId();
  const [draft, setDraft] = useState("90");
  const parsed = /^\d{1,3}$/.test(draft.trim()) ? Number(draft.trim()) : NaN;
  const valid = Number.isInteger(parsed) && parsed >= 0 && parsed <= 255;
  const playback = usePlayback(valid ? 8 : 0);
  const steps = createConversionSteps(valid ? parsed : 0);
  const current = playback.step > 0 ? steps[playback.step - 1] : null;
  const finished = valid && playback.step === 8;
  const visiblePattern = steps.map((entry, index) => index < playback.step ? entry.bit : "?").join("");
  const setNumber = (next: string) => { playback.seek(0); setDraft(next); };

  return <section className="vlab-bitplace bitlab-conversion" aria-labelledby={`${id}-title`}>
    <p className="vlab-kicker">GEMEINSAM RECHNEN · DEZIMAL → BINÄR</p>
    <h3 className="vlab-title" id={`${id}-title`}>Passt der Stellenwert noch in den Rest?</h3>
    <p className="vlab-description">Wir wandeln eine ganze Zahl von 0 bis 255 in acht Bits um.
      Beginne links bei 128. Frage bei jeder Stelle: <strong>Ist der Rest mindestens so groß wie der Stellenwert?</strong>{" "}
      Bei Ja schreibe 1 und ziehe den Stellenwert ab. Bei Nein schreibe 0 und behalte den Rest.</p>

    <div className="vlab-input-row vlab-screen-controls">
      <label className="vlab-number-label" htmlFor={`${id}-number`}>Deine Dezimalzahl (0–255)
        <input className="vlab-number-input" id={`${id}-number`} type="text" inputMode="numeric"
          value={draft} onChange={(event) => setNumber(event.target.value)} aria-invalid={!valid}
          aria-describedby={`${id}-input-help${valid ? "" : ` ${id}-input-error`}`} autoComplete="off" />
      </label>
      <div className="vlab-controls" role="group" aria-label="Beispielzahl für die Umwandlung wählen">
        {PRESETS.slice(0, 3).map((preset) => <button className="vlab-button" type="button" key={preset}
          aria-pressed={valid && parsed === preset} onClick={() => setNumber(String(preset))}>Beispiel {preset}</button>)}
      </div>
    </div>
    <p className="vlab-note" id={`${id}-input-help`}>Eine neue Eingabe setzt den Rechenweg zurück. Keine Kommazahlen oder Vorzeichen.</p>
    {!valid && <p className="vlab-error" id={`${id}-input-error`} role="status">
      Bitte gib eine ganze Zahl von 0 bis 255 ein. Mit acht vorzeichenlosen Bits liegen nur diese Werte im Bereich.
    </p>}

    {valid && <>
      <div className="vlab-result" aria-live={playback.running ? "off" : "polite"} aria-atomic="true">
        <p className="vlab-step-label">{playback.step === 0 ? "Start · Noch keine Stelle entschieden" : `Schritt ${playback.step} von 8`}</p>
        {current ? <>
          <p className="vlab-result-line">{current.before} ≥ {current.weight}?
            <strong> {current.fits ? "Ja → Bit 1" : "Nein → Bit 0"}</strong></p>
          <p className="vlab-result-detail">{current.fits
            ? `Der Stellenwert passt hinein. Neuer Rest: ${current.before} − ${current.weight} = ${current.after}.`
            : `Der Stellenwert ist zu groß. Nichts abziehen: ${current.before} − 0 = ${current.after}. Der Rest bleibt ${current.after}.`}</p>
        </> : <>
          <p className="vlab-result-line">Startrest: <strong>{parsed}</strong></p>
          <p className="vlab-result-detail">Zuerst prüfen wir den Stellenwert 128. Überlege vor dem ersten Schritt: Passt 128 in {parsed}?</p>
        </>}
        <p className="vlab-result-detail">Bisherige Bits: <strong className="vlab-binary">{visiblePattern}</strong>
          {!finished && <span> · ? = noch offen</span>}</p>
        {finished && <p className="vlab-result-detail"><strong>Fertig:</strong> {parsed}<sub>10</sub> = {bitPattern(parsed)}<sub>2</sub>.
          Der Rest ist 0. {parsed === 0 ? "Kein Stellenwert wurde genommen: Auch die Zahl 0 erhält hier acht Nullen." : parsed < 128 ? "Die führenden Nullen halten unsere vereinbarte Länge von acht Bits ein." : "Das Ergebnis hat genau die vereinbarten acht Bits."}</p>}
      </div>
      <PlaybackControls playback={playback} />
      <div className="vlab-scroll" role="region" tabIndex={0} aria-label="Rechenweg, bei Bedarf horizontal verschiebbar">
        <table className="bitlab-conversion-table">
          <caption className="bitlab-caption">So entsteht die Binärzahl für {parsed} · Lesen von oben nach unten</caption>
          <thead className="bitlab-table-head"><tr>
            <th className="bitlab-table-cell" scope="col">Stellenwert</th>
            <th className="bitlab-table-cell" scope="col">Rest vorher</th>
            <th className="bitlab-table-cell" scope="col">Passt hinein?</th>
            <th className="bitlab-table-cell" scope="col">Bit</th>
            <th className="bitlab-table-cell" scope="col">Rest danach</th>
          </tr></thead>
          <tbody>{steps.map((entry, index) => {
            const shown = index < playback.step;
            return <tr className={index === playback.step - 1 ? "bitlab-current-row" : "bitlab-step-row"}
              key={entry.weight} aria-current={index === playback.step - 1 ? "step" : undefined}>
              <th className="bitlab-table-cell" scope="row">{entry.weight}</th>
              <td className="bitlab-table-cell">{shown ? entry.before : "—"}</td>
              <td className="bitlab-table-cell">{shown ? entry.fits ? "Ja" : "Nein" : "noch offen"}</td>
              <td className="bitlab-table-cell bitlab-table-bit">{shown ? entry.bit : "?"}</td>
              <td className="bitlab-table-cell">{shown ? entry.after : "—"}</td>
            </tr>;
          })}</tbody>
        </table>
      </div>
      {finished && <p className="vlab-check"><strong>Rückprobe:</strong> {steps.filter((entry) => entry.fits).map((entry) => entry.weight).join(" + ") || "0"} = {parsed}.
        Die Summe der eingeschalteten Stellenwerte ergibt wieder deine Ausgangszahl.</p>}
    </>}
    <p className="vlab-question"><strong>Mitdenken:</strong> Auch wenn der Rest früh 0 wird, gehen wir bis zur Einerstelle weiter.
      Welche Bits müssen dann noch folgen – und warum?</p>
    <p className="vlab-print-note">Druckansicht: Der Rechenweg zeigt den aktuellen Bearbeitungsstand. Für eine vollständige Beispielrechnung zuerst alle acht Schritte anzeigen.</p>
  </section>;
}
