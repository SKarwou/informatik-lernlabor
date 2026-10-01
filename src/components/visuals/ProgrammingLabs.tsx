import { useId, useMemo, useState } from "react";
import "./ProgrammingLabs.css";

export type CartTraceFrame = {
  line: number | null;
  index: number | null;
  sum: number | null;
  condition: boolean | null;
  output: number | null;
  explanation: string;
  calculation?: { before: number; price: number; after: number };
};

/** One frame after each executed instruction; frame 0 is the initial state. */
export function buildCartTrace(prices: readonly number[]): CartTraceFrame[] {
  if (prices.length > 6 || !prices.every(price => Number.isInteger(price) && price >= 0 && price <= 9999)) {
    throw new RangeError("Erlaubt sind höchstens sechs Preise als ganze Centbeträge von 0 bis 9999.");
  }
  const frames: CartTraceFrame[] = [];
  let frame: CartTraceFrame = { line: null, index: null, sum: null, condition: null, output: null, explanation: "Noch wurde keine Anweisung ausgeführt. Die Preisliste steht bereits als Eingabe bereit." };
  function append(change: Partial<CartTraceFrame>) {
    frame = { ...frame, calculation: undefined, ...change };
    frames.push(frame);
  }
  frames.push(frame);
  append({ line: 1, sum: 0, explanation: "Die Variable summe erhält den Startwert 0 Cent. Noch wurde kein Preis addiert." });
  append({ line: 2, index: 0, explanation: "Die Variable i erhält den Wert 0. Unsere Liste zählt ihre Positionen ab 0, nicht ab 1." });
  let sum = 0;
  for (let i = 0; i <= prices.length; i++) {
    const valid = i < prices.length;
    append({ line: 3, index: i, condition: valid, explanation: valid
      ? `${i} < ${prices.length} ist wahr. An Position ${i} liegt noch ein Preis. Der Schleifenrumpf darf ausgeführt werden.`
      : `${i} < ${prices.length} ist falsch. Es gibt an Position ${i} keinen weiteren Preis. Der Schleifenrumpf wird übersprungen; weiter geht es bei der Ausgabe.` });
    if (!valid) break;
    const before = sum;
    sum += prices[i];
    append({ line: 4, sum, calculation: { before, price: prices[i], after: sum }, explanation: `Der Preis an Position ${i} wird zur bisherigen Summe addiert. ${before} + ${prices[i]} = ${sum} Cent. Dieser neue Wert ersetzt den alten Wert von summe.` });
    append({ line: 5, index: i + 1, explanation: `i wird um 1 erhöht: ${i} + 1 = ${i + 1}. Danach springt der Ablauf zurück zur Bedingung in Zeile 3. Die Summe bleibt dabei ${sum} Cent.` });
  }
  append({ line: 6, output: sum, explanation: `Das Programm gibt ${sum} Cent aus. Die Schleife ist beendet. Auch ein leerer Warenkorb funktioniert: Dann bleibt die Summe 0.` });
  return frames;
}

type Product = { name: string; cents: number };
const CARTS: { label: string; products: Product[] }[] = [
  { label: "Drei Dinge", products: [{ name: "Brötchen", cents: 120 }, { name: "Saft", cents: 180 }, { name: "Apfel", cents: 70 }] },
  { label: "Nur ein Getränk", products: [{ name: "Getränk", cents: 250 }] },
  { label: "Leerer Korb", products: [] },
];
const LOOP_LINES = ["summe ← 0", "i ← 0", "solange i < anzahl(preise):", "    summe ← summe + preise[i]", "    i ← i + 1", "ausgabe(summe)"];
const euro = (cents: number) => (cents / 100).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";

/** A worked teaching example, mounted inside the existing chapter gate. */
export function LoopTraceLab() {
  const id = useId();
  const [cartIndex, setCartIndex] = useState(0);
  const [step, setStep] = useState(0);
  const products = CARTS[cartIndex].products;
  const trace = useMemo(() => buildCartTrace(products.map(product => product.cents)), [products]);
  const frame = trace[step];
  const nextLine = trace[step + 1]?.line;
  const done = step === trace.length - 1;

  return <section className="proglab" aria-labelledby={`${id}-title`}>
    <header className="proglab-header">
      <span className="proglab-kicker">EIN PROGRAMM MIT DEN AUGEN AUSFÜHREN</span>
      <h3 id={`${id}-title`}>Wie rechnet dein Einkaufskorb?</h3>
      <p>Die Kasse erhält eine Liste mit Preisen. Eine Schleife addiert sie nacheinander. Du bist der Computer: Mit jedem Klick führst du genau eine Anweisung aus oder prüfst die Schleifenbedingung.</p>
    </header>
    <div className="proglab-prediction"><strong>Erst vermuten:</strong> Was ändert sich beim nächsten Schritt – die Summe, die Position oder nur die Entscheidung?</div>
    <div className="proglab-controls" role="group" aria-label="Warenkorb auswählen">
      {CARTS.map((cart, index) => <button type="button" key={cart.label} className="proglab-button" aria-pressed={cartIndex === index} onClick={() => { setCartIndex(index); setStep(0); }}>{cart.label}</button>)}
    </div>

    <div className="proglab-input">
      <h4>Die Eingabe: unsere Preisliste</h4>
      <p>Wir rechnen mit <strong>ganzen Centbeträgen</strong>. Ein Euro sind 100 Cent. <code>preise[i]</code> bedeutet: „der Preis an der Position i“. Die erste Position heißt hier <strong>0</strong>.</p>
      <div className="proglab-products">
        {products.length === 0 ? <p className="proglab-empty">Die Liste ist leer: <code>[]</code>. Sie hat 0 Einträge.</p> : products.map((product, index) => <div key={index} className={`proglab-product ${frame.index === index ? "proglab-product-current" : ""}`}>
          <span className="proglab-position">Position {index}</span>
          <strong>{product.name}</strong>
          <span>{product.cents} Cent <small>({euro(product.cents)})</small></span>
          <span className="proglab-pointer">{frame.index === index ? "↑ i zeigt hierhin" : "\u00a0"}</span>
        </div>)}
      </div>
      {frame.index !== null && frame.index >= products.length && <p className="proglab-boundary">i = {frame.index} liegt hinter dem letzten Eintrag. Dort wird kein Preis gelesen: Die Bedingung schützt vor einem ungültigen Zugriff.</p>}
    </div>

    <div className="proglab-trace-grid">
      <div className="proglab-program">
        <h4>Unser Programm als Pseudocode</h4>
        <p className="proglab-small">Die markierte Zeile wurde gerade ausgeführt. Pseudocode beschreibt die Idee und ist noch kein direkt ausführbares Java-Programm.</p>
        <ol className="proglab-code" aria-label="Pseudocode mit sechs Zeilen">
          {LOOP_LINES.map((line, index) => <li key={line} className={frame.line === index + 1 ? "proglab-active-line" : ""} aria-current={frame.line === index + 1 ? "step" : undefined}>
            <span aria-hidden="true">{index + 1}</span><code>{line}</code><span className="proglab-sr-only">{frame.line === index + 1 ? " – zuletzt ausgeführt" : ""}</span>
          </li>)}
        </ol>
        <p className="proglab-small"><code>←</code> heißt „speichere den rechts berechneten Wert links“. Die eingerückten Zeilen 4 und 5 bilden den wiederholten Schleifenrumpf.</p>
      </div>
      <div className="proglab-memory">
        <h4>Was sich das Programm merkt</h4>
        <dl>
          <div><dt><code>summe</code></dt><dd>{frame.sum === null ? <span>noch nicht gesetzt</span> : <><strong>{frame.sum}</strong><span>Cent bisher</span></>}</dd></div>
          <div><dt><code>i</code></dt><dd>{frame.index === null ? <span>noch nicht gesetzt</span> : <><strong>{frame.index}</strong><span>aktuelle Listenposition</span></>}</dd></div>
          <div><dt>Letzte Bedingungsprüfung</dt><dd>{frame.condition === null ? "noch nicht geprüft" : frame.condition ? "wahr: Schleife betreten" : "falsch: Schleife verlassen"}</dd></div>
        </dl>
      </div>
    </div>

    <div className="proglab-controls" role="group" aria-label="Programm schrittweise ausführen">
      <button type="button" className="proglab-button" disabled={step === 0} onClick={() => setStep(value => Math.max(0, value - 1))}>← Schritt zurück</button>
      <button type="button" className="proglab-button proglab-primary" disabled={done} onClick={() => setStep(value => Math.min(trace.length - 1, value + 1))}>{step === 0 ? "Mit Zeile 1 starten →" : "Nächster Schritt →"}</button>
      <button type="button" className="proglab-button" disabled={step === 0} onClick={() => setStep(0)}>Ablauf zurücksetzen</button>
    </div>
    <div className="proglab-step" role="status" aria-live="polite" aria-atomic="true">
      <strong>{step === 0 ? "Vor dem Start" : `Schritt ${step} von ${trace.length - 1} · Zeile ${frame.line}`}</strong>
      <p>{frame.explanation}</p>
      {frame.calculation && <p className="proglab-calculation">{frame.calculation.before} + {frame.calculation.price} = <strong>{frame.calculation.after} Cent</strong></p>}
      <span>{done ? "Fertig. Du kannst zurückgehen und die Werte vergleichen." : `Als Nächstes: Zeile ${nextLine}.`}</span>
    </div>
    {frame.output !== null && <div className="proglab-receipt"><span>Ausgabe des Programms</span><strong>{frame.output} Cent = {euro(frame.output)}</strong><p>{products.length === 0 ? "Kein Preis wurde addiert. Der Startwert 0 ist deshalb bereits das richtige Ergebnis." : `${products.map(product => product.cents).join(" + ")} = ${frame.output} Cent. Jeder Preis wurde genau einmal berücksichtigt.`}</p></div>}
    <details className="proglab-example"><summary>Vorgerechnet: der Korb mit drei Dingen</summary><ol>
      <li>Start: <code>summe = 0</code>, <code>i = 0</code>.</li>
      <li>Position 0: 0 + 120 = 120 Cent. Danach wird i zu 1.</li>
      <li>Position 1: 120 + 180 = 300 Cent. Danach wird i zu 2.</li>
      <li>Position 2: 300 + 70 = 370 Cent. Danach wird i zu 3.</li>
      <li>3 &lt; 3 ist falsch. Ausgegeben werden 370 Cent, also 3,70 €.</li>
    </ol></details>
    <p className="proglab-remember"><strong>Merksatz:</strong> Eine Schleife macht einen kleinen Schritt mehrfach. Variable, Bedingung und Veränderung der Position haben dabei verschiedene Aufgaben.</p>
    <p className="proglab-small">„Schritt zurück“ ist eine Lernhilfe: Das Labor zeigt einen früheren Zustand. Das abgebildete Programm selbst enthält keinen Rückwärtsbefehl. Die Preise sind frei gewählte Unterrichtsbeispiele.</p>
  </section>;
}

export type CounterReference = "a" | "b" | "c";
export type CounterModel = { counts: readonly [number, number]; aliasEnabled: boolean };
export type CounterChange = { model: CounterModel; objectIndex: 0 | 1; before: number; after: number; changed: boolean };
export function createCounterModel(): CounterModel { return { counts: [0, 0], aliasEnabled: false }; }

export function counterTarget(model: CounterModel, reference: CounterReference): 0 | 1 {
  if (reference === "a") return 0;
  if (reference === "b") return 1;
  if (reference === "c" && model.aliasEnabled) return 0;
  throw new RangeError("Diese Referenz ist im Modell nicht vorhanden.");
}

/** Pure model update. Stable object numbers model identity; c aliases object 1. */
export function changeCounter(model: CounterModel, reference: CounterReference, amount: 1 | -1): CounterChange {
  if (!model.counts.every(value => Number.isSafeInteger(value) && value >= 0) || (amount !== 1 && amount !== -1)) {
    throw new RangeError("Zählerstände müssen nichtnegative sichere Ganzzahlen sein; erlaubt ist ein Schritt von +1 oder −1.");
  }
  const objectIndex = counterTarget(model, reference);
  const before = model.counts[objectIndex];
  const requested = before + amount;
  const valid = Number.isSafeInteger(requested) && requested >= 0;
  const after = valid ? requested : before;
  const counts: [number, number] = [...model.counts];
  counts[objectIndex] = after;
  return { model: { ...model, counts }, objectIndex, before, after, changed: before !== after };
}

export function ObjectBlueprintLab() {
  const id = useId();
  const [model, setModel] = useState<CounterModel>(createCounterModel);
  const [lastObject, setLastObject] = useState<0 | 1 | null>(null);
  const [message, setMessage] = useState("Zwei Objekte wurden erzeugt. Beide beginnen bei 0, besitzen aber einen eigenen Zählerstand.");

  function act(reference: CounterReference, amount: 1 | -1) {
    const result = changeCounter(model, reference, amount);
    setModel(result.model);
    setLastObject(result.objectIndex);
    const call = `${reference}.${amount === 1 ? "plusEins" : "minusEins"}()`;
    setMessage(result.changed
      ? `${call} erreicht Objekt ${result.objectIndex + 1}: ${result.before} ${amount === 1 ? "+" : "−"} 1 = ${result.after}. Objekt ${result.objectIndex === 0 ? 2 : 1} bleibt bei ${model.counts[result.objectIndex === 0 ? 1 : 0]}.${model.aliasEnabled && result.objectIndex === 0 ? " a und c zeigen weiterhin auf dasselbe Objekt. Über beide Namen liest du jetzt denselben neuen Stand." : ""}`
      : result.before === 0 ? `${call} erreicht Objekt ${result.objectIndex + 1}. Ein negativer Stand ist nicht erlaubt. Die Methode lässt den Stand bei 0; kein Objekt wird verändert.`
      : `${call}: Die Zahl wäre für dieses Modell zu groß. Der Stand bleibt unverändert.`);
  }

  return <section className="proglab" aria-labelledby={`${id}-title`}>
    <header className="proglab-header">
      <span className="proglab-kicker">BAUPLAN · EXEMPLARE · VERWEISE</span>
      <h3 id={`${id}-title`}>Ein Bauplan, zwei eigene Zähler</h3>
      <p>Bei einem Schulfest zählen zwei Teams ihren Einlass. Beide verwenden denselben Typ Klickzähler. Trotzdem muss jedes Gerät seinen eigenen Stand behalten. So ähnlich arbeiten Objekte im Programm.</p>
    </header>
    <div className="proglab-prediction"><strong>Erst vermuten:</strong> Wenn du nur Zähler a erhöhst – was geschieht mit Zähler b?</div>

    <div className="proglab-blueprint">
      <span className="proglab-kicker">KLASSE = BESCHREIBUNG DES TYPS</span>
      <h4>KlickZaehler</h4>
      <div><strong>Attribut</strong><p><code>stand</code> · eine nichtnegative ganze Zahl</p></div>
      <div><strong>Beim Erzeugen</strong><p>Der Konstruktor setzt den Stand jedes neuen Objekts auf 0.</p></div>
      <div><strong>Methoden = erlaubte Aufrufe</strong><ul><li><code>plusEins()</code> erhöht den Stand.</li><li><code>minusEins()</code> verringert ihn, aber nicht unter 0.</li><li><code>getStand()</code> liefert den aktuellen Stand, ohne ihn zu ändern.</li></ul></div>
      <p className="proglab-small">Das ist eine vereinfachte Klassenkarte, kein vollständiges UML-Diagramm und noch kein Java-Quellcode. Die Klasse beschreibt das Attribut; den jeweiligen Wert besitzen die Objekte.</p>
    </div>
    <div className="proglab-create-arrow"><span aria-hidden="true">↓</span><p>Zweimal ein neues Exemplar erzeugen:<br /><code>a = new KlickZaehler()</code><br /><code>b = new KlickZaehler()</code></p><span aria-hidden="true">↓</span></div>

    <div className="proglab-objects">
      {(["a", "b"] as const).map((reference, index) => <article key={reference} className={`proglab-object ${lastObject === index ? "proglab-object-active" : ""}`} aria-labelledby={`${id}-object-${index}`}>
        <div className="proglab-reference"><code>{reference}</code><span aria-hidden="true">→</span><span>verweist auf Objekt {index + 1}</span></div>
        <h4 id={`${id}-object-${index}`}>Objekt {index + 1} · KlickZaehler</h4>
        <span>Eigener Attributwert</span>
        <div className="proglab-count"><code>stand =</code><strong>{model.counts[index]}</strong></div>
        <p className="proglab-small">{lastObject === index ? "Dieses Objekt wurde zuletzt angesprochen." : index === 0 ? "Zum Beispiel beim Eingang zur Sporthalle." : "Zum Beispiel beim Eingang zur Aula."}</p>
        <div className="proglab-object-buttons"><button type="button" className="proglab-button" onClick={() => act(reference, 1)} aria-label={`Objekt ${index + 1} über ${reference} um eins erhöhen`}><code>{reference}.plusEins()</code></button><button type="button" className="proglab-button" onClick={() => act(reference, -1)} aria-label={`Objekt ${index + 1} über ${reference} um eins verringern`}><code>{reference}.minusEins()</code></button></div>
      </article>)}
    </div>

    <div className="proglab-step" role="status" aria-live="polite" aria-atomic="true"><strong>Was der Aufruf bewirkt</strong><p>{message}</p></div>
    <p className="proglab-small"><strong>Schutzregel ausprobieren:</strong> Rufe bei Stand 0 <code>minusEins()</code> auf. Die Methode verhindert einen ungültigen Wert. Das ist die Idee der Kapselung: Außen wird ein erlaubter Aufruf genutzt, nicht beliebig am Attribut geschrieben.</p>

    <div className="proglab-alias-section">
      <h4>Ein Schritt weiter: zwei Namen für dasselbe Objekt</h4>
      <label className="proglab-toggle" htmlFor={`${id}-alias`}><input type="checkbox" id={`${id}-alias`} checked={model.aliasEnabled} onChange={event => {
        const enabled = event.target.checked;
        setModel(current => ({ ...current, aliasEnabled: enabled }));
        setLastObject(null);
        setMessage(enabled ? "c = a legt einen zusätzlichen Verweis auf Objekt 1 an. Es gibt jetzt drei Referenzen, aber weiterhin nur zwei Objekte. Es wurde kein Objekt kopiert." : "Der zusätzliche Verweis c ist aus unserem Bild entfernt. Beide Objekte und ihre bisherigen Werte bleiben erhalten.");
      }} /><span>Zusätzlichen Verweis <code>c = a</code> zeigen</span></label>
      {model.aliasEnabled && <div className="proglab-alias">
        <p className="proglab-prediction"><strong>Vorhersage:</strong> Was zeigt a, nachdem du über c erhöhst?</p>
        <div className="proglab-alias-route"><code>a</code><span>und</span><code>c</code><span aria-hidden="true">→</span><strong>dasselbe Objekt 1</strong></div>
        <p><code>a.getStand()</code> = <strong>{model.counts[0]}</strong><br /><code>c.getStand()</code> = <strong>{model.counts[0]}</strong></p>
        <button type="button" className="proglab-button proglab-primary" onClick={() => act("c", 1)}>Über c erhöhen: <code>c.plusEins()</code></button>
        <p className="proglab-small"><code>c = a</code> kopiert den Verweis, nicht das Objekt. Der Name c hat deshalb keinen eigenen Zählerstand. Objekt 2 bleibt unabhängig.</p>
      </div>}
    </div>
    <div className="proglab-controls"><button type="button" className="proglab-button" onClick={() => { setModel(createCounterModel()); setLastObject(null); setMessage("Das Lernmodell beginnt neu: zwei getrennte Objekte mit Stand 0 und die Referenzen a und b."); }}>Modell zurücksetzen</button></div>
    <details className="proglab-example"><summary>Vorgemacht: Aufrufe zuordnen</summary><ol>
      <li>Beginne mit zwei neuen Objekten: Stand von Objekt 1 = 0, Stand von Objekt 2 = 0.</li>
      <li><code>a.plusEins()</code>: Objekt 1 hat jetzt 1, Objekt 2 weiterhin 0.</li>
      <li>Nochmal <code>a.plusEins()</code>, dann <code>b.plusEins()</code>: Die Stände sind 2 und 1.</li>
      <li>Nach <code>c = a</code> erreicht <code>c.plusEins()</code> ebenfalls Objekt 1. Die Stände werden 3 und 1 – es gibt kein drittes Objekt.</li>
    </ol></details>
    <p className="proglab-remember"><strong>Merksatz:</strong> Eine Klasse beschreibt Gemeinsamkeiten. Verschiedene Objekte haben eigene Werte. Verschiedene Namen können aber auch auf ein und dasselbe Objekt verweisen.</p>
  </section>;
}
