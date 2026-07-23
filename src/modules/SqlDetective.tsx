import { useMemo, useState } from "react";

type Student = {
  id: number;
  name: string;
  klasse: string;
  fach: string;
  punkte: number;
};

type SortDirection = "ASC" | "DESC";

type QuerySettings = {
  klasse: string;
  fach: string;
  mindestpunkte: number;
  sortierung: SortDirection;
};

type Mission = {
  title: string;
  description: string;
  settings: QuerySettings;
};

const STUDENTS: Student[] = [
  {
    id: 1,
    name: "Amira",
    klasse: "11a",
    fach: "Informatik",
    punkte: 14,
  },
  {
    id: 2,
    name: "Ben",
    klasse: "11a",
    fach: "Physik",
    punkte: 9,
  },
  {
    id: 3,
    name: "Clara",
    klasse: "11b",
    fach: "Informatik",
    punkte: 12,
  },
  {
    id: 4,
    name: "David",
    klasse: "11b",
    fach: "Chemie",
    punkte: 11,
  },
  {
    id: 5,
    name: "Elif",
    klasse: "11c",
    fach: "Informatik",
    punkte: 15,
  },
  {
    id: 6,
    name: "Finn",
    klasse: "11c",
    fach: "Physik",
    punkte: 13,
  },
  {
    id: 7,
    name: "Greta",
    klasse: "11a",
    fach: "Chemie",
    punkte: 8,
  },
  {
    id: 8,
    name: "Hannes",
    klasse: "11b",
    fach: "Physik",
    punkte: 7,
  },
  {
    id: 9,
    name: "Ida",
    klasse: "11c",
    fach: "Chemie",
    punkte: 13,
  },
  {
    id: 10,
    name: "Jonas",
    klasse: "11a",
    fach: "Informatik",
    punkte: 10,
  },
  {
    id: 11,
    name: "Kira",
    klasse: "11b",
    fach: "Informatik",
    punkte: 6,
  },
  {
    id: 12,
    name: "Luca",
    klasse: "11c",
    fach: "Physik",
    punkte: 11,
  },
];

const DEFAULT_SETTINGS: QuerySettings = {
  klasse: "Alle",
  fach: "Alle",
  mindestpunkte: 0,
  sortierung: "DESC",
};

const MISSIONS: Mission[] = [
  {
    title: "Die Informatik-Spitze",
    description:
      "Finde alle Schülerinnen und Schüler im Fach Informatik mit mindestens 12 Punkten. Sortiere absteigend.",
    settings: {
      klasse: "Alle",
      fach: "Informatik",
      mindestpunkte: 12,
      sortierung: "DESC",
    },
  },
  {
    title: "Klasse 11b untersuchen",
    description:
      "Zeige alle Datensätze der Klasse 11b und sortiere sie nach der höchsten Punktzahl.",
    settings: {
      klasse: "11b",
      fach: "Alle",
      mindestpunkte: 0,
      sortierung: "DESC",
    },
  },
  {
    title: "Chemie-Fundstücke",
    description:
      "Finde alle Chemie-Ergebnisse mit mindestens 10 Punkten. Beginne mit dem kleinsten Ergebnis.",
    settings: {
      klasse: "Alle",
      fach: "Chemie",
      mindestpunkte: 10,
      sortierung: "ASC",
    },
  },
];

function createSql(settings: QuerySettings) {
  const conditions: string[] = [];

  if (settings.klasse !== "Alle") {
    conditions.push(
      `klasse = '${settings.klasse}'`,
    );
  }

  if (settings.fach !== "Alle") {
    conditions.push(
      `fach = '${settings.fach}'`,
    );
  }

  if (settings.mindestpunkte > 0) {
    conditions.push(
      `punkte >= ${settings.mindestpunkte}`,
    );
  }

  const wherePart =
    conditions.length > 0
      ? `\nWHERE ${conditions.join("\n  AND ")}`
      : "";

  return (
    "SELECT name, klasse, fach, punkte\n" +
    "FROM schueler" +
    wherePart +
    `\nORDER BY punkte ${settings.sortierung};`
  );
}

function runQuery(settings: QuerySettings) {
  return STUDENTS.filter((student) => {
    const correctClass =
      settings.klasse === "Alle" ||
      student.klasse === settings.klasse;

    const correctSubject =
      settings.fach === "Alle" ||
      student.fach === settings.fach;

    const enoughPoints =
      student.punkte >= settings.mindestpunkte;

    return (
      correctClass &&
      correctSubject &&
      enoughPoints
    );
  }).sort((first, second) => {
    if (settings.sortierung === "ASC") {
      return first.punkte - second.punkte;
    }

    return second.punkte - first.punkte;
  });
}

function settingsAreEqual(
  first: QuerySettings,
  second: QuerySettings,
) {
  return (
    first.klasse === second.klasse &&
    first.fach === second.fach &&
    first.mindestpunkte ===
      second.mindestpunkte &&
    first.sortierung === second.sortierung
  );
}

export default function SqlDetective() {
  const [draft, setDraft] =
    useState<QuerySettings>(DEFAULT_SETTINGS);

  const [executed, setExecuted] =
    useState<QuerySettings>(DEFAULT_SETTINGS);

  const [hasRun, setHasRun] = useState(false);
  const [activeMission, setActiveMission] =
    useState<number | null>(null);

  const [quizAnswer, setQuizAnswer] =
    useState<number | null>(null);

  const sqlCode = useMemo(
    () => createSql(draft),
    [draft],
  );

  const results = useMemo(
    () => runQuery(executed),
    [executed],
  );

  const missionSolved =
    activeMission !== null &&
    hasRun &&
    settingsAreEqual(
      executed,
      MISSIONS[activeMission].settings,
    );

  function executeQuery() {
    setExecuted({ ...draft });
    setHasRun(true);
  }

  function selectMission(index: number) {
    setActiveMission(index);
    setDraft({
      ...MISSIONS[index].settings,
    });
    setHasRun(false);
  }

  function resetQuery() {
    setDraft({ ...DEFAULT_SETTINGS });
    setExecuted({ ...DEFAULT_SETTINGS });
    setActiveMission(null);
    setHasRun(false);
  }

  return (
    <div className="sql-page" id="top">
      <style>{`
        .sql-page {
          --sql-blue: #175de8;
          --sql-dark: #0b234f;
          --sql-cyan: #12aabd;
          --sql-green: #159866;
          --sql-border: #d8e4f3;
          --sql-soft: #f3f8fc;
          min-height: calc(100vh - 90px);
          color: var(--sql-dark);
          background: #ffffff;
        }

        .sql-page * {
          box-sizing: border-box;
        }

        .sql-hero {
          position: relative;
          overflow: hidden;
          padding: 85px max(
            24px,
            calc((100vw - 1240px) / 2)
          ) 75px;
          background:
            radial-gradient(
              circle at 84% 20%,
              rgba(18, 170, 189, 0.2),
              transparent 27%
            ),
            linear-gradient(
              135deg,
              #f7fbff,
              #eefbfc
            );
          border-bottom:
            1px solid var(--sql-border);
        }

        .sql-hero::after {
          content: "SELECT";
          position: absolute;
          right: 6%;
          bottom: -40px;
          color: rgba(23, 93, 232, 0.055);
          font-family: monospace;
          font-size: clamp(6rem, 15vw, 13rem);
          font-weight: 900;
          letter-spacing: -0.08em;
          pointer-events: none;
        }

        .sql-eyebrow,
        .sql-label {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: var(--sql-blue);
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .sql-eyebrow span {
          display: grid;
          place-items: center;
          width: 36px;
          height: 36px;
          color: white;
          background: var(--sql-blue);
          border-radius: 10px;
        }

        .sql-hero h1 {
          position: relative;
          z-index: 1;
          max-width: 820px;
          margin: 25px 0 20px;
          font-size: clamp(
            2.8rem,
            6vw,
            5.2rem
          );
          line-height: 0.98;
          letter-spacing: -0.055em;
        }

        .sql-hero > p {
          position: relative;
          z-index: 1;
          max-width: 720px;
          margin: 0;
          color: #40587c;
          font-size: 1.15rem;
          line-height: 1.75;
        }

        .sql-goals {
          position: relative;
          z-index: 1;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .sql-goals span {
          padding: 10px 15px;
          color: #28466f;
          background:
            rgba(255, 255, 255, 0.88);
          border:
            1px solid var(--sql-border);
          border-radius: 999px;
          font-size: 0.88rem;
          font-weight: 700;
        }

        .sql-content {
          width: min(
            1240px,
            calc(100% - 48px)
          );
          margin: 0 auto;
          padding: 70px 0 90px;
        }

        .sql-intro-grid {
          display: grid;
          grid-template-columns:
            1.2fr 0.8fr;
          gap: 24px;
          margin-bottom: 70px;
        }

        .sql-info-card,
        .sql-command-card,
        .sql-builder,
        .sql-code-card,
        .sql-result-card,
        .sql-mission,
        .sql-quiz {
          border:
            1px solid var(--sql-border);
          border-radius: 24px;
          box-shadow:
            0 18px 50px
            rgba(18, 55, 105, 0.08);
        }

        .sql-info-card,
        .sql-command-card {
          padding: 30px;
        }

        .sql-info-card h2,
        .sql-section-heading h2,
        .sql-quiz h2 {
          margin: 12px 0 15px;
          font-size: clamp(
            1.7rem,
            3vw,
            2.4rem
          );
          letter-spacing: -0.035em;
        }

        .sql-info-card p,
        .sql-command-card p,
        .sql-section-heading p,
        .sql-quiz > p {
          margin: 0;
          color: #526682;
          line-height: 1.7;
        }

        .sql-command-card {
          color: white;
          background: var(--sql-dark);
          border-color: var(--sql-dark);
        }

        .sql-command-card > strong {
          color: #71dfec;
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .sql-command-card p {
          margin-top: 12px;
          color: #d7e5f8;
        }

        .sql-keywords {
          display: grid;
          grid-template-columns:
            repeat(2, 1fr);
          gap: 10px;
          margin-top: 20px;
        }

        .sql-keywords div {
          padding: 12px;
          color: #d7e5f8;
          background:
            rgba(255, 255, 255, 0.07);
          border-radius: 11px;
        }

        .sql-keywords code {
          display: block;
          margin-bottom: 4px;
          color: #79e5ef;
          font-weight: 900;
        }

        .sql-section-heading {
          margin-bottom: 25px;
        }

        .sql-lab-grid {
          display: grid;
          grid-template-columns:
            minmax(280px, 0.72fr)
            minmax(0, 1.28fr);
          gap: 24px;
          align-items: start;
        }

        .sql-left-column {
          display: grid;
          gap: 18px;
        }

        .sql-builder {
          padding: 24px;
          background: #ffffff;
        }

        .sql-builder h3,
        .sql-code-card h3,
        .sql-result-header h3 {
          margin: 0;
          font-size: 1.08rem;
        }

        .sql-fields {
          display: grid;
          gap: 15px;
          margin-top: 22px;
        }

        .sql-fields label {
          display: grid;
          gap: 7px;
          color: #5c6e89;
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .sql-fields select,
        .sql-fields input {
          width: 100%;
          padding: 12px 13px;
          color: var(--sql-dark);
          background: var(--sql-soft);
          border:
            1px solid #cad8ea;
          border-radius: 11px;
          font: inherit;
          font-weight: 700;
        }

        .sql-range-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sql-range-heading strong {
          color: var(--sql-blue);
          font-size: 1.1rem;
        }

        .sql-builder-actions {
          display: grid;
          grid-template-columns:
            1fr 1.5fr;
          gap: 10px;
          margin-top: 22px;
        }

        .sql-builder-actions button {
          padding: 13px;
          border-radius: 11px;
          font: inherit;
          font-weight: 800;
          cursor: pointer;
        }

        .sql-reset {
          color: #385274;
          background: white;
          border:
            1px solid #cad8ea;
        }

        .sql-run {
          color: white;
          background: var(--sql-blue);
          border:
            1px solid var(--sql-blue);
        }

        .sql-code-card {
          overflow: hidden;
          color: #d9e7fb;
          background: #081b3c;
          border-color: #081b3c;
        }

        .sql-code-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 17px 20px;
          background: #0d2754;
          border-bottom:
            1px solid rgba(
              255,
              255,
              255,
              0.08
            );
        }

        .sql-code-header span {
          color: #7ddce9;
          font-family: monospace;
          font-size: 0.8rem;
        }

        .sql-code-card pre {
          min-height: 185px;
          margin: 0;
          padding: 22px;
          overflow-x: auto;
          color: #e4edfc;
          font-family:
            "SFMono-Regular",
            Consolas,
            monospace;
          font-size: 0.93rem;
          line-height: 1.75;
          white-space: pre-wrap;
        }

        .sql-result-card {
          overflow: hidden;
          background: #ffffff;
        }

        .sql-result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          padding: 20px 22px;
          border-bottom:
            1px solid var(--sql-border);
        }

        .sql-result-count {
          padding: 7px 11px;
          color: var(--sql-green);
          background: #e7f8f0;
          border-radius: 999px;
          font-size: 0.8rem;
          font-weight: 800;
        }

        .sql-table-wrapper {
          overflow-x: auto;
        }

        .sql-table {
          width: 100%;
          border-collapse: collapse;
        }

        .sql-table th,
        .sql-table td {
          padding: 15px 17px;
          text-align: left;
          border-bottom:
            1px solid #e7edf6;
        }

        .sql-table th {
          color: #61738d;
          background: #f6f9fd;
          font-size: 0.75rem;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .sql-table tbody tr:hover {
          background: #f8fbff;
        }

        .sql-table td:last-child {
          color: var(--sql-blue);
          font-weight: 900;
        }

        .sql-empty {
          padding: 50px 25px;
          color: #62748d;
          text-align: center;
        }

        .sql-missions-section {
          margin-top: 70px;
        }

        .sql-missions-grid {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 16px;
          margin-top: 25px;
        }

        .sql-mission {
          padding: 23px;
          background: white;
          cursor: pointer;
          transition: 0.2s;
        }

        .sql-mission:hover {
          border-color: var(--sql-blue);
          transform: translateY(-3px);
        }

        .sql-mission.active {
          background: #edf4ff;
          border-color: #92b3f8;
        }

        .sql-mission small {
          color: var(--sql-blue);
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .sql-mission h3 {
          margin: 10px 0;
        }

        .sql-mission p {
          margin: 0;
          color: #5b6e89;
          line-height: 1.55;
        }

        .sql-mission-status {
          display: block;
          margin-top: 18px;
          color: var(--sql-green);
          font-weight: 800;
        }

        .sql-quiz {
          margin-top: 70px;
          padding: 34px;
          background: #f8fbff;
        }

        .sql-answers {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 12px;
          margin-top: 24px;
        }

        .sql-answers button {
          padding: 16px;
          color: #29466f;
          background: white;
          border:
            1px solid #cad8eb;
          border-radius: 14px;
          font: inherit;
          font-weight: 800;
          cursor: pointer;
        }

        .sql-answers button.correct {
          color: #087a49;
          background: #e7f8f0;
          border-color: #62c89c;
        }

        .sql-answers button.wrong {
          color: #b13b42;
          background: #fff0f1;
          border-color: #ee9fa4;
        }

        .sql-feedback {
          margin: 18px 0 0;
          padding: 15px 18px;
          color: #304c73;
          background: white;
          border-radius: 12px;
          line-height: 1.6;
        }

        @media (max-width: 900px) {
          .sql-intro-grid,
          .sql-lab-grid {
            grid-template-columns: 1fr;
          }

          .sql-missions-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 620px) {
          .sql-content {
            width: calc(100% - 28px);
            padding-top: 48px;
          }

          .sql-hero {
            padding-top: 55px;
          }

          .sql-answers {
            grid-template-columns: 1fr;
          }

          .sql-builder-actions {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section className="sql-hero">
        <span className="sql-eyebrow">
          <span>03</span>
          Datenbanken und SQL
        </span>

        <h1>
          Daten durchsuchen
          <br />
          wie ein Detektiv
        </h1>

        <p>
          Mit SQL können große Datenbanken gezielt
          durchsucht, gefiltert und sortiert werden.
          Stelle deine eigene Abfrage zusammen und
          untersuche die Datensätze der Schuldatenbank.
        </p>

        <div
          className="sql-goals"
          aria-label="Lernziele"
        >
          <span>✓ Tabellen verstehen</span>
          <span>✓ Datensätze filtern</span>
          <span>✓ SQL-Abfragen formulieren</span>
        </div>
      </section>

      <div className="sql-content">
        <section className="sql-intro-grid">
          <article className="sql-info-card">
            <span className="sql-label">
              Grundwissen
            </span>

            <h2>Was ist eine Datenbank?</h2>

            <p>
              Eine Datenbank speichert Informationen
              geordnet in <strong>Tabellen</strong>. Jede
              Zeile ist ein Datensatz. Die Spalten
              beschreiben Eigenschaften wie Name,
              Klasse, Fach und Punktzahl.
            </p>
          </article>

          <article className="sql-command-card">
            <strong>Vier wichtige Befehle</strong>

            <p>
              Eine SQL-Abfrage besteht häufig aus diesen
              Bausteinen:
            </p>

            <div className="sql-keywords">
              <div>
                <code>SELECT</code>
                Spalten auswählen
              </div>

              <div>
                <code>FROM</code>
                Tabelle angeben
              </div>

              <div>
                <code>WHERE</code>
                Zeilen filtern
              </div>

              <div>
                <code>ORDER BY</code>
                Ergebnis sortieren
              </div>
            </div>
          </article>
        </section>

        <section>
          <div className="sql-section-heading">
            <span className="sql-label">
              Interaktive Abfrage
            </span>

            <h2>Baue deinen SQL-Befehl</h2>

            <p>
              Verändere die Filter und beobachte, wie
              daraus automatisch ein SQL-Befehl entsteht.
              Mit „Abfrage ausführen“ wird die Datenbank
              durchsucht.
            </p>
          </div>

          <div className="sql-lab-grid">
            <div className="sql-left-column">
              <article className="sql-builder">
                <h3>Abfrage-Baukasten</h3>

                <div className="sql-fields">
                  <label>
                    Klasse
                    <select
                      value={draft.klasse}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          klasse:
                            event.target.value,
                        }))
                      }
                    >
                      <option>Alle</option>
                      <option>11a</option>
                      <option>11b</option>
                      <option>11c</option>
                    </select>
                  </label>

                  <label>
                    Fach
                    <select
                      value={draft.fach}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          fach:
                            event.target.value,
                        }))
                      }
                    >
                      <option>Alle</option>
                      <option>Informatik</option>
                      <option>Physik</option>
                      <option>Chemie</option>
                    </select>
                  </label>

                  <label>
                    <span className="sql-range-heading">
                      Mindestpunktzahl
                      <strong>
                        {draft.mindestpunkte}
                      </strong>
                    </span>

                    <input
                      type="range"
                      min="0"
                      max="15"
                      value={
                        draft.mindestpunkte
                      }
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          mindestpunkte:
                            Number(
                              event.target.value,
                            ),
                        }))
                      }
                    />
                  </label>

                  <label>
                    Sortierung
                    <select
                      value={draft.sortierung}
                      onChange={(event) =>
                        setDraft((current) => ({
                          ...current,
                          sortierung:
                            event.target
                              .value as SortDirection,
                        }))
                      }
                    >
                      <option value="DESC">
                        Höchste zuerst
                      </option>

                      <option value="ASC">
                        Niedrigste zuerst
                      </option>
                    </select>
                  </label>
                </div>

                <div className="sql-builder-actions">
                  <button
                    className="sql-reset"
                    onClick={resetQuery}
                  >
                    ↺ Zurücksetzen
                  </button>

                  <button
                    className="sql-run"
                    onClick={executeQuery}
                  >
                    ▶ Abfrage ausführen
                  </button>
                </div>
              </article>

              <article className="sql-code-card">
                <div className="sql-code-header">
                  <h3>SQL-Code</h3>
                  <span>abfrage.sql</span>
                </div>

                <pre>
                  <code>{sqlCode}</code>
                </pre>
              </article>
            </div>

            <article className="sql-result-card">
              <div className="sql-result-header">
                <h3>Abfrageergebnis</h3>

                <span className="sql-result-count">
                  {results.length} Datensätze
                </span>
              </div>

              {results.length > 0 ? (
                <div className="sql-table-wrapper">
                  <table className="sql-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Klasse</th>
                        <th>Fach</th>
                        <th>Punkte</th>
                      </tr>
                    </thead>

                    <tbody>
                      {results.map((student) => (
                        <tr key={student.id}>
                          <td>{student.name}</td>
                          <td>{student.klasse}</td>
                          <td>{student.fach}</td>
                          <td>{student.punkte}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="sql-empty">
                  Keine passenden Datensätze gefunden.
                  Verändere deine Filter.
                </div>
              )}
            </article>
          </div>
        </section>

        <section className="sql-missions-section">
          <div className="sql-section-heading">
            <span className="sql-label">
              Ermittlungsaufträge
            </span>

            <h2>Löse drei Datenbankfälle</h2>

            <p>
              Wähle einen Auftrag aus. Die benötigten
              Einstellungen werden vorbereitet. Führe
              anschließend die Abfrage aus.
            </p>
          </div>

          <div className="sql-missions-grid">
            {MISSIONS.map((mission, index) => (
              <article
                key={mission.title}
                className={
                  activeMission === index
                    ? "sql-mission active"
                    : "sql-mission"
                }
                role="button"
                tabIndex={0}
                onClick={() =>
                  selectMission(index)
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" ||
                    event.key === " "
                  ) {
                    selectMission(index);
                  }
                }}
              >
                <small>
                  Auftrag 0{index + 1}
                </small>

                <h3>{mission.title}</h3>

                <p>{mission.description}</p>

                {activeMission === index && (
                  <span className="sql-mission-status">
                    {missionSolved
                      ? "✓ Auftrag gelöst"
                      : "Abfrage ausführen →"}
                  </span>
                )}
              </article>
            ))}
          </div>
        </section>

        <section className="sql-quiz">
          <span className="sql-label">
            Lerncheck
          </span>

          <h2>
            Welcher SQL-Teil filtert Datensätze?
          </h2>

          <p>
            Wähle die richtige Antwort. Du erhältst
            sofort eine Rückmeldung.
          </p>

          <div className="sql-answers">
            {["SELECT", "WHERE", "ORDER BY"].map(
              (answer, index) => {
                let answerClass = "";

                if (
                  quizAnswer !== null &&
                  index === 1
                ) {
                  answerClass = "correct";
                } else if (
                  quizAnswer === index &&
                  index !== 1
                ) {
                  answerClass = "wrong";
                }

                return (
                  <button
                    key={answer}
                    className={answerClass}
                    onClick={() =>
                      setQuizAnswer(index)
                    }
                  >
                    {String.fromCharCode(
                      65 + index,
                    )}
                    {" · "}
                    {answer}
                  </button>
                );
              },
            )}
          </div>

          {quizAnswer !== null && (
            <p
              className="sql-feedback"
              aria-live="polite"
            >
              {quizAnswer === 1
                ? "Richtig! Mit WHERE werden nur die Datensätze ausgewählt, die eine bestimmte Bedingung erfüllen."
                : "Noch nicht ganz. SELECT bestimmt die Spalten und ORDER BY sortiert das Ergebnis."}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}