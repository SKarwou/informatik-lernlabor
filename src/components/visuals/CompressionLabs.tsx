import { useId, useState } from "react";
import "./CompressionLabs.css";

export type Bit = 0 | 1;
const SENT_DATA: readonly Bit[] = [1, 0, 1, 1, 0, 0, 1, 0];
export const countOnes = (bits: readonly Bit[]) => bits.reduce<number>((sum, bit) => sum + bit, 0);
export const evenParityBit = (bits: readonly Bit[]): Bit => (countOnes(bits) % 2) as Bit;
export const hasEvenParity = (bits: readonly Bit[]) => countOnes(bits) % 2 === 0;
const PARITY_BIT = evenParityBit(SENT_DATA);
const SENT_BLOCK: readonly Bit[] = [...SENT_DATA, PARITY_BIT];
const flip = (bit: Bit): Bit => bit === 0 ? 1 : 0;

/** An explanatory model. Mount only inside the existing chapter gate. */
export function ParityLab() {
  const id = useId();
  const [received, setReceived] = useState<Bit[]>(() => [...SENT_BLOCK]);
  const receivedOnes = countOnes(received);
  const rulePasses = hasEvenParity(received);
  const changed = received.reduce<number>((sum, bit, index) => sum + Number(bit !== SENT_BLOCK[index]), 0);

  function preset(positions: number[]) {
    setReceived(SENT_BLOCK.map((bit, index) => positions.includes(index) ? flip(bit) : bit));
  }

  return <section className="complab" aria-labelledby={`${id}-title`}>
    <header className="complab-header">
      <span className="complab-kicker">MIT BITS EXPERIMENTIEREN</span>
      <h3 id={`${id}-title`}>Findet das Kontrollbit deinen Fehler?</h3>
      <p>Der Sender ergänzt einmal ein Kontrollbit. Danach veränderst du nur die empfangene Nachricht. Ein Klick kippt ein Bit von 0 auf 1 oder zurück.</p>
    </header>

    <div className="complab-panel">
      <h4>1 · Der Sender hält sich an eine Regel</h4>
      <p>Die acht Nutzbits enthalten <strong>4 Einsen</strong>. Vier ist gerade. Deshalb hängt der Sender rechts eine <strong>0 als Paritätsbit</strong> an.</p>
      <div className="complab-scroll" role="region" aria-label="Gesendeter Block: acht Nutzbits und ein Paritätsbit" tabIndex={0}>
        <div className="complab-bitrow">
          {SENT_BLOCK.map((bit, index) => <div className={`complab-bitcell ${index === 8 ? "complab-controlbit" : ""}`} key={index}>
            <span className="complab-position">{index + 1}</span>
            <span className={`complab-bit complab-bit-${bit}`}>{bit}</span>
            <small>{index === 8 ? "Prüfbit" : "Nutzbit"}</small>
          </div>)}
        </div>
      </div>
      <p className="complab-caption">Gesendet: <code>10110010 | 0</code> · Der Strich trennt hier nur Nutzdaten und Kontrollbit; er wird nicht übertragen.</p>
    </div>

    <div className="complab-panel">
      <h4>2 · Verändere die Übertragung</h4>
      <p id={`${id}-instructions`}>Klicke auf empfangene Bits. Auch das Paritätsbit darf kippen. Markierte Stellen unterscheiden sich vom gesendeten Block.</p>
      <div className="complab-controls" role="group" aria-label="Voreingestellte Übertragungsfehler">
        <button type="button" className="complab-button" onClick={() => preset([2])}>1 Fehler: Stelle 3</button>
        <button type="button" className="complab-button" onClick={() => preset([2, 4])}>2 Fehler: Stellen 3 und 5</button>
        <button type="button" className="complab-button" onClick={() => preset([])}>Übertragung zurücksetzen</button>
      </div>
      <div className="complab-scroll" role="region" aria-label="Empfangene Bits verändern" tabIndex={0}>
        <div className="complab-bitrow" aria-describedby={`${id}-instructions`}>
          {received.map((bit, index) => {
            const differs = bit !== SENT_BLOCK[index];
            return <div className={`complab-bitcell ${index === 8 ? "complab-controlbit" : ""}`} key={index}>
              <span className="complab-position">{index + 1}</span>
              <button type="button" className={`complab-bit complab-bit-${bit} ${differs ? "complab-bit-changed" : ""}`}
                aria-label={`${index === 8 ? "Paritätsbit" : "Nutzbit"}, Stelle ${index + 1}: ${bit}. ${differs ? "Geändert." : "Unverändert."} Zum Kippen aktivieren.`}
                aria-pressed={bit === 1}
                onClick={() => setReceived(current => current.map((value, position) => position === index ? flip(value) : value))}>
                {bit}
              </button>
              <small>{differs ? "gekippt" : index === 8 ? "Prüfbit" : "unveränd."}</small>
            </div>;
          })}
        </div>
      </div>
    </div>

    <div className={`complab-result ${rulePasses ? "complab-result-neutral" : "complab-result-warning"}`} role="status" aria-live="polite" aria-atomic="true">
      <span className="complab-kicker">3 · DER EMPFÄNGER ZÄHLT ALLE EINSEN</span>
      <strong>{receivedOnes} {receivedOnes === 1 ? "Eins" : "Einsen"} → {rulePasses ? "gerade" : "ungerade"}</strong>
      <p>{rulePasses ? "Prüfung unauffällig: Die Paritätsregel ist erfüllt. Das beweist nicht, dass die Nachricht unverändert ist." : "Fehler erkannt: Die vereinbarte gerade Parität ist verletzt. Welches Bit falsch ist, verrät diese Prüfung nicht."}</p>
      <p className="complab-observation"><strong>Unsere Laborbeobachtung:</strong> {changed === 0 ? "Du hast noch keine Stelle verändert." : `${changed} ${changed === 1 ? "Stelle weicht" : "Stellen weichen"} vom Original ab.`} {changed > 0 && rulePasses ? "Trotzdem bleibt die Prüfung unauffällig!" : ""} Den Originalvergleich sehen wir nur hier im Labor; der Empfänger kennt den ursprünglichen Block nicht.</p>
    </div>

    <details className="complab-example">
      <summary>Rechenbeispiel: Warum zwei Fehler unentdeckt bleiben</summary>
      <ol>
        <li>Gesendet wird <code>101100100</code> mit vier Einsen.</li>
        <li>Stelle 3 kippt von 1 auf 0: <code>100100100</code>. Es bleiben drei Einsen. Die Prüfung erkennt einen Fehler.</li>
        <li>Zusätzlich kippt Stelle 5 von 0 auf 1: <code>100110100</code>. Jetzt sind es wieder vier Einsen.</li>
        <li>Die Parität stimmt wieder, obwohl zwei Stellen falsch sind.</li>
      </ol>
    </details>
    <p className="complab-remember"><strong>Merksatz:</strong> Parität erkennt eine ungerade Anzahl gekippter Stellen im Block. Eine gerade Anzahl bleibt unentdeckt. Erkennen ist nicht dasselbe wie Korrigieren.</p>
    <p className="complab-caption">Vereinfachtes Modell: Bits kippen; keine Bits fehlen oder werden vertauscht. Zweimal dieselbe Stelle kippen macht sie wieder unverändert.</p>
  </section>;
}

export type Run = { bit: Bit; start: number; length: number };
const PATTERNS: { label: string; bits: readonly Bit[] }[] = [
  { label: "Zwei große Flächen", bits: [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1] },
  { label: "Immer abwechselnd", bits: [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1] },
  { label: "Alles schwarz", bits: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
];

export function encodeRuns(pixels: readonly Bit[]): Run[] {
  const runs: Run[] = [];
  pixels.forEach((bit, position) => {
    const previous = runs[runs.length - 1];
    if (previous && previous.bit === bit) previous.length++;
    else runs.push({ bit, start: position, length: 1 });
  });
  return runs;
}

/** A 12-pixel toy format, deliberately not a real image-file format. */
export function RunLengthLab() {
  const id = useId();
  const [pixels, setPixels] = useState<Bit[]>(() => [...PATTERNS[0].bits]);
  const [step, setStep] = useState(0);
  const runs = encodeRuns(pixels);
  const completed = runs.slice(0, step);
  const currentRun = step > 0 ? runs[step - 1] : null;
  const finished = step === runs.length;
  const processedPixels = completed.reduce((sum, run) => sum + run.length, 0);
  const storedBits = runs.length * 5;
  const saving = 12 - storedBits;
  const restored = completed.flatMap(run => Array.from<unknown, Bit>({ length: run.length }, () => run.bit));

  function choosePattern(bits: readonly Bit[]) {
    setPixels([...bits]);
    setStep(0);
  }

  return <section className="complab" aria-labelledby={`${id}-title`}>
    <header className="complab-header">
      <span className="complab-kicker">PIXEL ZÄHLEN STATT EINZELN SPEICHERN</span>
      <h3 id={`${id}-title`}>Macht Lauflängencodierung das Bild kleiner?</h3>
      <p>Ein Lauf ist eine zusammenhängende Folge gleicher Pixel. Hier bedeutet <strong>0 = weiß</strong> und <strong>1 = schwarz</strong>. Klicke Pixel an oder wähle ein Muster. Gehe dann Lauf für Lauf weiter.</p>
    </header>

    <div className="complab-controls" role="group" aria-label="Pixelmuster auswählen">
      {PATTERNS.map(pattern => <button type="button" className="complab-button" key={pattern.label} onClick={() => choosePattern(pattern.bits)}>{pattern.label}</button>)}
    </div>

    <div className="complab-panel">
      <h4>1 · Dein Original: eine Zeile mit 12 Pixeln</h4>
      <p id={`${id}-pixel-help`}>Jeder Klick wechselt die Farbe und setzt die Schritte zurück. Die Nummern unter den markierten Pixeln zeigen ihren Lauf – zusätzlich zur farbigen Umrandung.</p>
      <div className="complab-scroll" role="region" aria-label="Zwölf Pixel bearbeiten, bei Bedarf seitlich scrollen" tabIndex={0}>
        <div className="complab-pixels" aria-describedby={`${id}-pixel-help`}>
          {pixels.map((bit, index) => {
            const group = runs.findIndex(run => index >= run.start && index < run.start + run.length);
            const visible = group < step;
            return <div className={`complab-pixelcell ${visible ? `complab-group-${group % 3}` : ""} ${visible && group === step - 1 ? "complab-current" : ""}`} key={index}>
              <span className="complab-position">{index + 1}</span>
              <button type="button" className={`complab-pixel complab-bit-${bit}`}
                aria-pressed={bit === 1} aria-label={`Pixel ${index + 1}: ${bit === 1 ? "schwarz, 1" : "weiß, 0"}. Farbe wechseln.`}
                onClick={() => { setPixels(values => values.map((value, position) => position === index ? flip(value) : value)); setStep(0); }}>
                {bit}
              </button>
              <small>{visible ? `L${group + 1}` : "–"}</small>
            </div>;
          })}
        </div>
      </div>
      <p className="complab-caption">Originalfolge: <code>{pixels.join("")}</code> · genau 12 Bits in diesem Modell.</p>
    </div>

    <div className="complab-model">
      <h4>Unsere Speichervereinbarung</h4>
      <p><strong>Hier vereinbaren wir ein anderes kleines Modell:</strong> Es geht um eine Schwarz-Weiß-Pixelzeile, nicht um das Textformat „Anzahl:Zeichen“ oder das spätere Modell mit zwei Bytes je Paar.</p>
      <p>Jedes Laufpaar speichert <strong>zuerst die Farbe mit 1 Bit</strong> und <strong>dann die Länge mit 4 Bits</strong>. Ein Paar kostet also <strong>1 + 4 = 5 Bits</strong>.</p>
      <p>Die Länge liegt hier zwischen 1 und 12 und passt in vier Bits. Beispiel: sechs weiße Pixel werden zum Paar <strong>(weiß, 6)</strong> und zur Bitgruppe <code>0 | 0110</code>.</p>
      <p className="complab-caption">Rechenmodell mit dicht gepackten Bits, ohne Dateikopf und Auffüllung auf ganze Bytes. Breite, Höhe und Lesereihenfolge sind schon vereinbart. Die Trennstriche werden nicht gespeichert. Reale Bilddateien haben zusätzliche Regeln und Verwaltungsdaten.</p>
    </div>

    <div className="complab-controls complab-step-controls" role="group" aria-label="Läufe schrittweise codieren">
      <button type="button" className="complab-button" disabled={step === 0} onClick={() => setStep(value => Math.max(0, value - 1))}>← Zurück</button>
      <button type="button" className="complab-button complab-button-primary" disabled={finished} onClick={() => setStep(value => Math.min(runs.length, value + 1))}>Nächsten Lauf lesen →</button>
      <button type="button" className="complab-button" disabled={step === 0} onClick={() => setStep(0)}>Schritte zurücksetzen</button>
    </div>

    <div className="complab-step-status" role="status" aria-live="polite" aria-atomic="true">
      <strong>{step === 0 ? "Start: Noch kein Lauf gelesen." : `Schritt ${step} von ${runs.length}`}</strong>
      <p>{currentRun ? `Lauf ${step}: ${currentRun.length} ${currentRun.bit === 1 ? "schwarze" : "weiße"} ${currentRun.length === 1 ? "Stelle" : "Stellen"}, von Pixel ${currentRun.start + 1} bis ${currentRun.start + currentRun.length}. ${finished ? "Die gesamte Zeile ist codiert." : "Beim nächsten Farbwechsel beginnt ein neuer Lauf."}` : "Beginne ganz links. Zähle gleiche Nachbarn bis zum ersten Farbwechsel oder zum Zeilenende."}</p>
    </div>

    <div className="complab-panel">
      <h4>2 · Die bisher ausgegebenen Laufpaare</h4>
      {completed.length === 0 ? <p>Noch keine Paare. Klicke auf „Nächsten Lauf lesen“.</p> : <ol className="complab-runlist">
        {completed.map((run, index) => <li className={`complab-runcard complab-group-${index % 3}`} key={index}>
          <span>Lauf {index + 1}</span>
          <strong>({run.bit === 1 ? "schwarz" : "weiß"}, {run.length})</strong>
          <code>{run.bit} | {run.length.toString(2).padStart(4, "0")}</code>
          <small>Farbe · Länge = 5 Bits</small>
        </li>)}
      </ol>}
      <p><strong>Rückweg zur Kontrolle:</strong> {completed.length > 0 ? <><code>{restored.join("")}</code> – {processedPixels} von 12 Pixeln wiederhergestellt{finished ? "; genau dieselbe Folge wie im Original." : ". Der Rest folgt mit den nächsten Läufen."}</> : "Jedes Paar wieder in seine einzelnen Pixel auflösen."}</p>
    </div>

    <div className="complab-result complab-result-neutral">
      <span className="complab-kicker">3 · ERST AM ENDE DIE GANZE ZEILE VERGLEICHEN</span>
      {finished ? <>
        <div className="complab-size-comparison"><div><span>Original</span><strong>12 Bits</strong><small>12 Pixel · 1 Bit</small></div><div><span>Lauflängencodiert</span><strong>{storedBits} Bits</strong><small>{runs.length} {runs.length === 1 ? "Lauf" : "Läufe"} · 5 Bits</small></div></div>
        <p><strong>{saving > 0 ? `${saving} Bits gespart` : saving < 0 ? `${-saving} Bits zusätzlich benötigt` : "Gleich groß"}.</strong> {saving > 0 ? `Ersparnis: (${12} − ${storedBits}) / 12 · 100 % ≈ ${(saving / 12 * 100).toLocaleString("de-DE", { maximumFractionDigits: 1 })} %.` : saving < 0 ? "Hier wird die Darstellung größer statt kleiner: Die Angaben zu Farbe und Länge kosten mehr Platz als die einzelnen Pixel." : "Hier bringt das Verfahren keine Ersparnis."}</p>
      </> : <p>Bisher: <strong>{step} {step === 1 ? "Paar" : "Paare"} · 5 = {step * 5} Bits</strong> für erst {processedPixels} von 12 Pixeln. Lies alle Läufe, bevor du die vollständigen Datenmengen vergleichst.</p>}
    </div>

    <details className="complab-example">
      <summary>Vorgerechnet: Zwei Flächen oder zwölf kurze Läufe?</summary>
      <ol>
        <li><code>000000111111</code> hat zwei Läufe: (weiß, 6) und (schwarz, 6).</li>
        <li>Original: 12 · 1 = 12 Bits. Laufpaare: 2 · 5 = 10 Bits. Ersparnis: 2 Bits, also ungefähr 16,7 %.</li>
        <li><code>010101010101</code> hat zwölf Läufe der Länge eins. Die Paare benötigen 12 · 5 = 60 Bits.</li>
        <li>Das sind 48 Bits mehr als im Original. Trotzdem ist die Codierung verlustfrei: Beide Folgen lassen sich exakt wiederherstellen.</li>
      </ol>
    </details>
    <p className="complab-remember"><strong>Merksatz:</strong> Verlustfrei bedeutet „exakt wiederherstellbar“, nicht „immer kleiner“. Viele kurze Läufe können die Darstellung vergrößern.</p>
  </section>;
}
