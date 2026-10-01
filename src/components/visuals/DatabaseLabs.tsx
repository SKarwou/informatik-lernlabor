import { useId, useMemo, useState } from "react";
import "./DatabaseLabs.css";

export type DemoBorrower = { person_id: string; name: string; gruppe: string };
export type DemoLoan = { ausleihe_id: string; person_id: string; geraet: string };
export type BorrowerJoinMode = "inner" | "left";
export type BorrowerJoinRow = { person_id: string; name: string; ausleihe_id: string | null; geraet: string | null };

export const DATABASE_BORROWERS: readonly DemoBorrower[] = [
  { person_id: "P41", name: "Mina", gruppe: "11A" },
  { person_id: "P42", name: "Noah", gruppe: "11A" },
  { person_id: "P43", name: "Noah", gruppe: "11B" },
  { person_id: "P44", name: "Elif", gruppe: "11B" },
];
export const DATABASE_LOANS: readonly DemoLoan[] = [
  { ausleihe_id: "L71", person_id: "P41", geraet: "Tablet T3" },
  { ausleihe_id: "L72", person_id: "P42", geraet: "Stativ S1" },
  { ausleihe_id: "L73", person_id: "P42", geraet: "Kamera K2" },
  { ausleihe_id: "L74", person_id: "P43", geraet: "Mikrofon M1" },
];

export function traceBorrowerLoans(personId: string, borrowers: readonly DemoBorrower[] = DATABASE_BORROWERS, loans: readonly DemoLoan[] = DATABASE_LOANS) {
  const borrower = borrowers.find(person => person.person_id === personId) ?? null;
  return { borrower, loans: borrower ? loans.filter(loan => loan.person_id === borrower.person_id) : [] };
}

export function buildBorrowerJoin(mode: BorrowerJoinMode, borrowers: readonly DemoBorrower[] = DATABASE_BORROWERS, loans: readonly DemoLoan[] = DATABASE_LOANS): BorrowerJoinRow[] {
  return borrowers.flatMap<BorrowerJoinRow>(person => {
    const matches = loans.filter(loan => loan.person_id === person.person_id);
    if (matches.length === 0) {
      return mode === "left" ? [{ person_id: person.person_id, name: person.name, ausleihe_id: null, geraet: null }] : [];
    }
    return matches.map(loan => ({ person_id: person.person_id, name: person.name, ausleihe_id: loan.ausleihe_id, geraet: loan.geraet }));
  });
}

export function RelationalLinkLab() {
  const id = useId();
  const [selectedPerson, setSelectedPerson] = useState<string | null>(null);
  const [joinMode, setJoinMode] = useState<BorrowerJoinMode>("inner");
  const trace = selectedPerson ? traceBorrowerLoans(selectedPerson) : null;
  const result = useMemo(() => buildBorrowerJoin(joinMode).filter(row => row.person_id === selectedPerson), [joinMode, selectedPerson]);
  const selectedName = trace?.borrower?.name;

  return <section className="dblab" aria-labelledby={`${id}-title`}>
    <header className="dblab-header">
      <span className="dblab-kicker">Klicken und verstehen · Beziehungen</span>
      <h3 id={`${id}-title`}>Welcher Noah hat die Kamera?</h3>
      <p>Die Medienausleihe eurer Schule speichert Personen und Ausleihen getrennt. Zwei Personen heißen Noah. Eine eindeutige Kennung verhindert, dass ihre Ausleihen verwechselt werden.</p>
    </header>
    <p className="dblab-prediction"><strong>Erst vermuten:</strong> Welche Ausleihen gehören zu Noah mit der Kennung P42? Suche zunächst selbst nach dieser Kennung. Klicke dann in der Personentabelle auf P42. Probiere anschließend P43 und Elif.</p>

    <div className="dblab-key-guide">
      <p><strong>Primärschlüssel (PK):</strong> identifiziert genau eine Zeile der eigenen Tabelle. In PERSON ist das <code>person_id</code>, in AUSLEIHE <code>ausleihe_id</code>.</p>
      <p><strong>Fremdschlüssel (FK):</strong> verweist auf einen vorhandenen Primärschlüssel einer anderen Tabelle. <code>AUSLEIHE.person_id</code> verweist hier auf <code>PERSON.person_id</code>.</p>
    </div>

    <div className="dblab-relation-tables">
      <div className="dblab-table-scroll" tabIndex={0} role="region" aria-label="Personentabelle mit auswählbaren Personen">
        <table className="dblab-table">
          <caption>PERSON · klicke auf eine Kennung</caption>
          <thead><tr><th scope="col">person_id <small>PK · eindeutig</small></th><th scope="col">name</th><th scope="col">gruppe</th></tr></thead>
          <tbody>{DATABASE_BORROWERS.map(person => <tr key={person.person_id} className={selectedPerson === person.person_id ? "dblab-selected-row" : ""}>
            <td><button type="button" className="dblab-key-button" aria-pressed={selectedPerson === person.person_id} aria-label={`${person.person_id}: ${person.name}, Gruppe ${person.gruppe}, Ausleihen verfolgen`} onClick={() => setSelectedPerson(person.person_id)}>{person.person_id}</button></td><td>{person.name}</td><td>{person.gruppe}</td>
          </tr>)}</tbody>
        </table>
      </div>
      <div className="dblab-table-scroll" tabIndex={0} role="region" aria-label="Ausleihtabelle, passende Fremdschlüssel werden markiert">
        <table className="dblab-table">
          <caption>AUSLEIHE · suche denselben Fremdschlüssel</caption>
          <thead><tr><th scope="col">ausleihe_id <small>PK</small></th><th scope="col">person_id <small>FK auf PERSON</small></th><th scope="col">geraet</th></tr></thead>
          <tbody>{DATABASE_LOANS.map(loan => <tr key={loan.ausleihe_id} className={loan.person_id === selectedPerson ? "dblab-match-row" : ""}>
            <td><code>{loan.ausleihe_id}</code></td><td><strong>{loan.person_id}</strong>{selectedPerson && <small className="dblab-row-verdict">{loan.person_id === selectedPerson ? "✓ passt" : "anderer Bezug"}</small>}</td><td>{loan.geraet}</td>
          </tr>)}</tbody>
        </table>
      </div>
    </div>
    <p className="dblab-note">Vereinfachtes, fiktives Beispiel mit vier aktuellen Ausleihen. Die Gerätebezeichnung dient hier als kurze Beschreibung; eine vollständige Geräteverwaltung könnte eine weitere Tabelle verwenden.</p>

    <div className="dblab-explanation" role="status" aria-live="polite" aria-atomic="true">
      {!trace?.borrower ? <p>Wähle eine Person. Danach siehst du, welche Zeilen durch gleiche Schlüsselwerte zusammengehören.</p> : <>
        <h4>{selectedName} · {selectedPerson}</h4>
        <p className="dblab-key-connection"><span>PERSON.person_id<br /><strong>{selectedPerson}</strong></span><span className="dblab-equals">=</span><span>AUSLEIHE.person_id<br /><strong>{selectedPerson}</strong></span></p>
        {trace.loans.length > 0
          ? <p><strong>{trace.loans.length} passende {trace.loans.length === 1 ? "Ausleihe" : "Ausleihen"}:</strong> {trace.loans.map(loan => `${loan.ausleihe_id} (${loan.geraet})`).join(", ")}. Entscheidend ist der gleiche Schlüsselwert, nicht der Name oder die Position einer Zeile.</p>
          : <p><strong>Keine passende Ausleihe.</strong> Elif ist als Person gespeichert, hat in dieser Tabelle aber kein ausgeliehenes Gerät. Das ist ein gültiger Zustand und kein falscher Fremdschlüssel.</p>}
        {selectedName === "Noah" && <p>Der andere Noah hat eine andere Kennung. Ein Name allein wäre hier kein geeigneter Primärschlüssel.</p>}
      </>}
    </div>

    <div className="dblab-join-section">
      <h4>Was erscheint in einer verbundenen Ergebnistabelle?</h4>
      <p>Eine Verbindung heißt auch <strong>JOIN</strong>. Jede passende Ausleihe bildet mit ihrer Person eine Ergebniszeile. Wähle, was mit einer Person ohne Ausleihe geschehen soll.</p>
      <fieldset className="dblab-choice-field">
        <legend>Regel für das Verbinden</legend>
        <div className="dblab-choice-buttons">
          <button type="button" aria-pressed={joinMode === "inner"} onClick={() => setJoinMode("inner")}>Nur passende Paare <small>INNER JOIN</small></button>
          <button type="button" aria-pressed={joinMode === "left"} onClick={() => setJoinMode("left")}>Person auch ohne Ausleihe behalten <small>LEFT JOIN · PERSON links</small></button>
        </div>
      </fieldset>
      <div className="dblab-join-result" aria-live="polite" aria-atomic="true">
        {!selectedPerson ? <p className="dblab-empty">Wähle oben zuerst eine Person, um ihr Verbindungsergebnis zu sehen.</p> : <>
          <div className="dblab-table-scroll" tabIndex={0} role="region" aria-label="Verbindungsergebnis der ausgewählten Person">
            <table className="dblab-table">
              <caption>Ergebnis nur für {selectedName} ({selectedPerson}) · {result.length} {result.length === 1 ? "Zeile" : "Zeilen"}</caption>
              <thead><tr><th scope="col">person_id</th><th scope="col">name</th><th scope="col">ausleihe_id</th><th scope="col">geraet</th></tr></thead>
              <tbody>{result.map(row => <tr key={`${row.person_id}-${row.ausleihe_id ?? "unmatched"}`}><td>{row.person_id}</td><td>{row.name}</td><td>{row.ausleihe_id ?? <span className="dblab-null">NULL</span>}</td><td>{row.geraet ?? <span className="dblab-null">NULL</span>}</td></tr>)}</tbody>
            </table>
            {result.length === 0 && <p className="dblab-empty">Keine Ergebniszeile: Es gibt kein passendes Paar.</p>}
          </div>
          {trace && trace.loans.length === 0 && <p className="dblab-memory">{joinMode === "inner" ? "Beim INNER JOIN erscheint Elif nicht im Ergebnis. Ihr Datensatz bleibt trotzdem unverändert in PERSON erhalten. Probiere jetzt LEFT JOIN." : "Beim LEFT JOIN bleibt die Person erhalten. NULL in den Ausleihespalten bedeutet hier: Es wurde keine passende Ausleihzeile gefunden. NULL ist weder die Zahl 0 noch ein ausgeliehenes Gerät."}</p>}
          {trace && trace.loans.length > 0 && <p className="dblab-memory">{trace.loans.length > 1 ? "Eine Person, mehrere Ausleihen: Ihr Primärschlüssel steht in PERSON genau einmal, darf als Fremdschlüssel in AUSLEIHE aber mehrfach vorkommen. Im JOIN wiederholen sich die Personenangaben für jedes passende Paar." : "Hier finden beide Regeln dasselbe passende Paar. Der Unterschied zwischen INNER JOIN und LEFT JOIN wird bei Elif sichtbar."}</p>}
        </>}
      </div>
    </div>
    <button type="button" className="dblab-reset" onClick={() => { setSelectedPerson(null); setJoinMode("inner"); }}>Auswahl zurücksetzen</button>
  </section>;
}

export type SqlDevice = { geraet_id: string; name: string; bereich: string; frist_tage: number };
export type SqlColumn = keyof SqlDevice;
export type SqlFilter = "all" | "audio" | "video" | "long" | "videoLong" | "audioOrLong" | "none";
export type SqlSort = "name" | "daysAsc" | "daysDesc";
export type SqlProjection = "nameDays" | "identity" | "all";
export type SqlLabConfig = { filter: SqlFilter; sort: SqlSort; projection: SqlProjection };

export const SQL_DEVICES: readonly SqlDevice[] = [
  { geraet_id: "G11", name: "Kamera", bereich: "Video", frist_tage: 3 },
  { geraet_id: "G12", name: "Mikrofon", bereich: "Audio", frist_tage: 7 },
  { geraet_id: "G13", name: "Stativ", bereich: "Video", frist_tage: 7 },
  { geraet_id: "G14", name: "Tablet", bereich: "Digital", frist_tage: 5 },
  { geraet_id: "G15", name: "Kopfhörer", bereich: "Audio", frist_tage: 3 },
  { geraet_id: "G16", name: "Beamer", bereich: "Digital", frist_tage: 2 },
];

const allColumns: readonly SqlColumn[] = ["geraet_id", "name", "bereich", "frist_tage"];
const projections: Record<SqlProjection, readonly SqlColumn[]> = {
  nameDays: ["name", "frist_tage"], identity: ["geraet_id", "name", "bereich"], all: allColumns,
};
const whereClauses: Record<SqlFilter, string> = {
  all: "", audio: "bereich = 'Audio'", video: "bereich = 'Video'", long: "frist_tage >= 5",
  videoLong: "bereich = 'Video' AND frist_tage >= 5", audioOrLong: "bereich = 'Audio' OR frist_tage >= 5", none: "frist_tage > 14",
};
const orderClauses: Record<SqlSort, string> = {
  name: "name ASC, geraet_id ASC", daysAsc: "frist_tage ASC, geraet_id ASC", daysDesc: "frist_tage DESC, geraet_id ASC",
};

export function matchesSqlFilter(device: SqlDevice, filter: SqlFilter): boolean {
  switch (filter) {
    case "all": return true;
    case "audio": return device.bereich === "Audio";
    case "video": return device.bereich === "Video";
    case "long": return device.frist_tage >= 5;
    case "videoLong": return device.bereich === "Video" && device.frist_tage >= 5;
    case "audioOrLong": return device.bereich === "Audio" || device.frist_tage >= 5;
    case "none": return device.frist_tage > 14;
  }
}

export function calculateSqlStages(config: SqlLabConfig, source: readonly SqlDevice[] = SQL_DEVICES) {
  const columns = projections[config.projection];
  const filtered = source.filter(device => matchesSqlFilter(device, config.filter));
  const orderedDevices = [...filtered].sort((a, b) => {
    const primary = config.sort === "name" ? a.name.localeCompare(b.name, "de") : (a.frist_tage - b.frist_tage) * (config.sort === "daysDesc" ? -1 : 1);
    return primary || a.geraet_id.localeCompare(b.geraet_id);
  });
  const project = (device: SqlDevice) => columns.map(column => device[column]);
  return {
    columns, source: [...source], filtered,
    selected: filtered.map(project), ordered: orderedDevices.map(project),
    resultDeviceIds: orderedDevices.map(device => device.geraet_id),
    sql: `SELECT ${config.projection === "all" ? "*" : columns.join(", ")}\nFROM GERAET${whereClauses[config.filter] ? `\nWHERE ${whereClauses[config.filter]}` : ""}\nORDER BY ${orderClauses[config.sort]};`,
  };
}

const defaultSqlConfig: SqlLabConfig = { projection: "nameDays", filter: "audio", sort: "daysAsc" };
const sqlStepNames = ["Vorhersage", "FROM: Tabelle", "WHERE: Zeilen", "SELECT: Spalten", "ORDER BY: Reihenfolge"];

export function SqlStepLab() {
  const id = useId();
  const [config, setConfig] = useState<SqlLabConfig>(defaultSqlConfig);
  const [step, setStep] = useState(0);
  const [prediction, setPrediction] = useState("");
  const stages = useMemo(() => calculateSqlStages(config), [config]);
  const resultColumns = step >= 3 ? stages.columns : allColumns;
  const visibleRows = step === 1 ? stages.source.map(row => allColumns.map(column => row[column]))
    : step === 2 ? stages.filtered.map(row => allColumns.map(column => row[column]))
      : step === 3 ? stages.selected : stages.ordered;

  function chooseConfig(next: SqlLabConfig) { setConfig(next); setStep(0); setPrediction(""); }
  function reset() { chooseConfig(defaultSqlConfig); }
  const explanations = [
    "Sieh dir die Ausgangstabelle und die Abfrage an. Welche Zeilen erfüllen die Bedingung? Welche Spalten sollen am Ende sichtbar sein? Starte danach mit Weiter.",
    `FROM GERAET bestimmt die Ausgangstabelle. Im Modell stehen zunächst alle ${stages.source.length} Zeilen und alle vier Spalten bereit.`,
    config.filter === "all" ? "Diese Abfrage hat kein WHERE. Deshalb bleiben alle Zeilen erhalten."
      : `WHERE prüft jede Zeile: ${whereClauses[config.filter]}. ${stages.filtered.length} von ${stages.source.length} Zeilen passen. Die anderen werden nur aus dem Ergebnis ausgeschlossen, nicht aus der Datenbank gelöscht.`,
    `SELECT zeigt jetzt ${stages.columns.join(", ")}. Die Zahl der passenden Zeilen bleibt ${stages.filtered.length}; nur die sichtbaren Spalten ändern sich.`,
    config.sort === "name" ? "ORDER BY ordnet die Namen aufsteigend. Für diese Namen ergibt das alphabetische Reihenfolge. Die Kennung dient als zweiter Sortierschlüssel, falls Namen gleich sind."
      : `ORDER BY ordnet zuerst nach frist_tage ${config.sort === "daysAsc" ? "aufsteigend: kurze Fristen zuerst" : "absteigend: lange Fristen zuerst"}. Bei gleicher Frist entscheidet geraet_id aufsteigend. Es kommt keine Zeile dazu und keine geht verloren.`,
  ];

  return <section className="dblab" aria-labelledby={`${id}-title`}>
    <header className="dblab-header">
      <span className="dblab-kicker">Klicken und verstehen · SQL</span>
      <h3 id={`${id}-title`}>Aus einer Tabelle wird eine Antwort</h3>
      <p>Ihr sucht ein Gerät für einen Schul-Podcast. Welche Audiogeräte gibt es, und welches müsst ihr zuerst zurückgeben? Mit SQL beschreibst du, welche Daten du sehen möchtest.</p>
    </header>
    <p className="dblab-note">Fiktive Ausgangstabelle GERAET: Jede Zeile beschreibt hier einen Gerätetyp. <code>frist_tage</code> ist die erlaubte Ausleihdauer, nicht die bisher vergangene Zeit.</p>
    <div className="dblab-table-scroll" tabIndex={0} role="region" aria-label="Vollständige SQL-Ausgangstabelle mit sechs Geräten">
      <table className="dblab-table dblab-source-table">
        <caption>GERAET · diese Daten bleiben unverändert</caption>
        <thead><tr>{allColumns.map(column => <th scope="col" key={column} className={step >= 3 && stages.columns.includes(column) ? "dblab-selected-column" : ""}>{column}</th>)}{step >= 2 && <th scope="col">WHERE-Prüfung</th>}</tr></thead>
        <tbody>{SQL_DEVICES.map(device => {
          const matches = matchesSqlFilter(device, config.filter);
          return <tr key={device.geraet_id} className={step >= 2 ? matches ? "dblab-match-row" : "dblab-excluded-row" : ""}>
            {allColumns.map(column => <td key={column}>{device[column]}</td>)}
            {step >= 2 && <td className="dblab-row-verdict">{matches ? "✓ bleibt" : "− nicht im Ergebnis"}</td>}
          </tr>;
        })}</tbody>
      </table>
    </div>

    <fieldset className="dblab-choice-field dblab-presets">
      <legend>Beispiel auswählen oder darunter selbst zusammenstellen</legend>
      <div className="dblab-choice-buttons">
        <button type="button" onClick={() => chooseConfig(defaultSqlConfig)}>Audio · kurze Frist zuerst</button>
        <button type="button" onClick={() => chooseConfig({ projection: "all", filter: "videoLong", sort: "name" })}>Video · mindestens 5 Tage</button>
        <button type="button" onClick={() => chooseConfig({ projection: "all", filter: "none", sort: "name" })}>Mehr als 14 Tage</button>
      </div>
    </fieldset>
    <div className="dblab-query-controls">
      <label htmlFor={`${id}-projection`}>SELECT · welche Spalten?
        <select id={`${id}-projection`} value={config.projection} onChange={event => chooseConfig({ ...config, projection: event.target.value as SqlProjection })}>
          <option value="nameDays">Name und Frist</option><option value="identity">Kennung, Name und Bereich</option><option value="all">Alle Spalten (*)</option>
        </select>
      </label>
      <label htmlFor={`${id}-filter`}>WHERE · welche Zeilen?
        <select id={`${id}-filter`} value={config.filter} onChange={event => chooseConfig({ ...config, filter: event.target.value as SqlFilter })}>
          <option value="all">Alle · kein WHERE</option><option value="audio">Bereich Audio</option><option value="video">Bereich Video</option><option value="long">Frist mindestens 5 Tage</option><option value="videoLong">Video UND mindestens 5 Tage</option><option value="audioOrLong">Audio ODER mindestens 5 Tage</option><option value="none">Frist mehr als 14 Tage</option>
        </select>
      </label>
      <label htmlFor={`${id}-sort`}>ORDER BY · welche Reihenfolge?
        <select id={`${id}-sort`} value={config.sort} onChange={event => chooseConfig({ ...config, sort: event.target.value as SqlSort })}>
          <option value="name">Name aufsteigend (ASC)</option><option value="daysAsc">Frist aufsteigend (ASC)</option><option value="daysDesc">Frist absteigend (DESC)</option>
        </select>
      </label>
    </div>
    <pre className="dblab-sql-code" aria-label="SQL-Abfrage aus deiner Auswahl"><code>{stages.sql.split("\n").map((line, index) => {
      const active = step === 1 && line.startsWith("FROM") || step === 2 && line.startsWith("WHERE") || step === 3 && line.startsWith("SELECT") || step === 4 && line.startsWith("ORDER BY");
      return <span key={index} className={active ? "dblab-active-code" : ""}>{line}{"\n"}</span>;
    })}</code></pre>
    <p className="dblab-note">SQL schreibt SELECT zuerst. Zum Verstehen gehen wir die logischen Schritte unten durch. Eine echte Datenbank darf intern einen anderen Ausführungsplan verwenden. Dieses Labor führt nur die auswählbaren Beispiele aus, keinen frei eingegebenen SQL-Code.</p>

    <label className="dblab-prediction-input" htmlFor={`${id}-prediction`}><strong>Erst vermuten:</strong> Wie viele Ergebniszeilen erwartest du?
      <select id={`${id}-prediction`} value={prediction} disabled={step >= 2} onChange={event => setPrediction(event.target.value)}>
        <option value="">Freiwillige Vorhersage</option>{Array.from({ length: 7 }, (_, value) => <option key={value} value={value}>{value} {value === 1 ? "Zeile" : "Zeilen"}</option>)}
      </select>
    </label>
    <ol className="dblab-steps" aria-label="Logische Schritte der Abfrage">
      {sqlStepNames.map((name, index) => <li key={name} aria-current={step === index ? "step" : undefined} className={step === index ? "dblab-current-step" : ""}><span>{index}</span>{name}</li>)}
    </ol>
    <div className="dblab-step-controls" role="group" aria-label="SQL-Schritte steuern">
      <button type="button" onClick={() => setStep(previous => Math.max(0, previous - 1))} disabled={step === 0}>Zurück</button>
      <button type="button" className="dblab-primary" onClick={() => setStep(previous => Math.min(4, previous + 1))} disabled={step === 4}>Weiter</button>
      <button type="button" onClick={() => { setStep(0); setPrediction(""); }}>Abfrage erneut durchgehen</button>
      <button type="button" onClick={reset}>Alles zurücksetzen</button>
    </div>
    <div className="dblab-explanation" role="status" aria-live="polite" aria-atomic="true">
      <h4>Schritt {step} von 4 · {sqlStepNames[step]}</h4>
      <p>{explanations[step]}</p>
      {step >= 2 && prediction !== "" && <p><strong>{Number(prediction) === stages.filtered.length ? "Deine Vorhersage passt." : "Vergleiche noch einmal mit deiner Vorhersage."}</strong> Du hast {prediction} {Number(prediction) === 1 ? "Zeile" : "Zeilen"} erwartet; die Bedingung lässt {stages.filtered.length} {stages.filtered.length === 1 ? "Zeile" : "Zeilen"} durch. Das ist eine Verständnishilfe, keine Bewertung.</p>}
    </div>

    {step > 0 && <div className="dblab-table-scroll dblab-sql-result" tabIndex={0} role="region" aria-label={step === 4 ? "Fertiges SQL-Ergebnis" : "SQL-Zwischenergebnis"}>
      <table className="dblab-table">
        <caption>{step === 4 ? "Fertiges Ergebnis" : "Zwischenstand"} · {visibleRows.length} {visibleRows.length === 1 ? "Zeile" : "Zeilen"}</caption>
        <thead><tr>{resultColumns.map(column => <th scope="col" key={column}>{column}</th>)}</tr></thead>
        <tbody>{visibleRows.map((row, rowIndex) => <tr key={`${step}-${rowIndex}`}>{row.map((value, columnIndex) => <td key={resultColumns[columnIndex]}>{value}</td>)}</tr>)}</tbody>
      </table>
      {visibleRows.length === 0 && <p className="dblab-empty">Die Spalten sind da, aber keine Zeile erfüllt die Bedingung. Ein leeres Ergebnis ist kein SQL-Fehler und keine Zeile voller NULL-Werte.</p>}
    </div>}
    {step > 0 && <p className="dblab-note">Bis zum Sortierschritt behält dieses Modell die angezeigte Reihenfolge der Ausgangstabelle. SQL garantiert ohne ORDER BY keine Reihenfolge. Die Namenssortierung kann in echten Datenbanken von den Spracheinstellungen abhängen.</p>}
    <p className="dblab-memory"><strong>Drei unterschiedliche Entscheidungen:</strong> WHERE wählt Zeilen, SELECT wählt Spalten, ORDER BY ordnet das Ergebnis. Die Ausgangstabelle wird durch diese Abfrage nicht verändert.</p>
  </section>;
}
