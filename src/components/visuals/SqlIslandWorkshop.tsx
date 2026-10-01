import { useId, useState } from "react";
import "./SqlIslandWorkshop.css";

export const SQL_ISLAND_URL = "https://sql-island.informatik.uni-kl.de/";

/** The original game stays on its publisher's server and is never preloaded. */
export function SqlIslandWorkshop() {
  const id = useId();
  const [checked, setChecked] = useState([false, false, false]);
  return <section className="island-workshop" aria-labelledby={id}>
    <div className="island-workshop-heading">
      <svg viewBox="0 0 150 130" role="img" aria-label="Eine kleine Insel mit Fahne als Symbol für die SQL-Mission">
        <path d="M8 95 Q35 83 64 93 T143 94 M8 108 Q37 96 73 106 T143 105" fill="none" stroke="#83b7a5" strokeWidth="5" strokeLinecap="round" />
        <path d="M21 84 Q42 44 72 67 Q105 37 132 86 Q87 103 21 84" fill="#e7d8a7" stroke="#183e32" strokeWidth="3" />
        <path d="M79 73 V16 M79 17 H121 L107 31 L121 44 H79" fill="#c9f27f" stroke="#183e32" strokeWidth="3" strokeLinejoin="round" />
        <path d="M44 71 Q47 44 39 34 M39 34 Q25 22 17 34 M39 34 Q48 17 60 28 M39 34 Q25 39 24 49" fill="none" stroke="#183e32" strokeWidth="4" strokeLinecap="round" />
      </svg>
      <div><span className="island-kicker">EXTRA-MISSION · DAS ORIGINALSPIEL</span><h3 id={id}>SQL Island: Deine Abfrage bringt dich weiter</h3><p>Hier wird SQL zum Abenteuer: Du erkundest eine Insel, indem du Fragen an ihre Daten stellst. Statt Befehle nur auswendig zu lernen, überlegst du bei jedem Schritt: Welche Tabelle, welche Zeilen, welche Spalten helfen mir?</p></div>
    </div>
    <p className="island-prerequisite"><strong>Vor dem Start:</strong> Du solltest eine einfache Abfrage mit SELECT, FROM und WHERE lesen können. Falls das noch schwerfällt, gehe zuerst zum <a href="#sql-where">Abschnitt über WHERE</a> oder zum <a href="#schaubild-sql-kombinieren">SQL-Schaubild</a>. Weitere Befehle erklärt das Spiel im Verlauf.</p>
    <div className="island-actions">
      <a className="island-primary" href={SQL_ISLAND_URL} target="_blank" rel="noopener noreferrer">SQL Island in neuem Tab starten ↗</a>
    </div>
    <p className="island-external-note"><strong>Externes Angebot:</strong> Erst beim Öffnen verbindet sich dein Browser mit der Website von SQL Island. Kapitel- und Lösungscodes werden nicht an das Spiel übergeben. Verwende im Spiel keine echten Namen oder persönlichen Daten. Dein Lernlabor sammelt keine Spielergebnisse und schaltet durch das Spiel kein Kapitel frei.</p>
    <p className="island-external-note"><strong>Später weiterspielen:</strong> Sichere deinen Spielstand bei Bedarf im Menü des Originalspiels unter „Spiel speichern / laden“, bevor du den Spiel-Tab schließt. Das Lernlabor übernimmt deinen Spielstand nicht.</p>
    <details className="island-missions" open>
      <summary>Deine drei Begleitaufträge zur Spielphase</summary>
      <p>Das sind zusätzliche Spielaufträge. Deine bisherigen Papieraufgaben bleiben vollständig bestehen. Die Häkchen sind nur eine Merkhilfe für diese geöffnete Seite, keine Bewertung.</p>
      <ol>
        <li><label><input type="checkbox" checked={checked[0]} onChange={e => setChecked(checked.map((v, i) => i === 0 ? e.target.checked : v))}/><span><strong>Erst lesen, dann abfragen.</strong> Suche zu einer Frage die passende Tabelle. Erkläre deiner Partnerin oder deinem Partner, wofür eine ihrer Spalten steht.</span></label></li>
        <li><label><input type="checkbox" checked={checked[1]} onChange={e => setChecked(checked.map((v, i) => i === 1 ? e.target.checked : v))}/><span><strong>Den Weg festhalten.</strong> Notiere drei selbst formulierte Abfragen mit einer kurzen Erklärung: Was erwartest du? Was kam tatsächlich zurück? Was hast du verbessert?</span></label></li>
        <li><label><input type="checkbox" checked={checked[2]} onChange={e => setChecked(checked.map((v, i) => i === 2 ? e.target.checked : v))}/><span><strong>Nicht nur gewinnen, sondern verstehen.</strong> Wähle eine erfolgreiche SELECT-Abfrage mit WHERE-Bedingung. Erkläre, was sich ohne ihre WHERE-Bedingung ändern würde. Besprecht einen Fehler, aus dem ihr etwas gelernt habt.</span></label></li>
      </ol>
      <p className="island-progress" role="status">{checked.filter(Boolean).length} von 3 Begleitaufträgen für dich abgehakt.</p>
    </details>
    <details className="island-tips"><summary>Wenn du festhängst: drei kleine Hilfen</summary><ol><li>Lies die Frage noch einmal. Suche nach dem gewünschten Ergebnis, bevor du SQL schreibst.</li><li>Prüfe die Schreibweise von Tabellen- und Spaltennamen im Spiel. Textwerte brauchen einfache Anführungszeichen.</li><li>Teste eine einfachere Abfrage. Ändere danach nur einen Teil und vergleiche beide Ergebnisse.</li></ol><p>Das sind Hinweise zur Strategie, keine Komplettlösung des Spiels. Besprich Abfragen gemeinsam, statt nur fertige Befehle zu kopieren.</p></details>
    <p className="island-credit">Originalspiel: <a href={SQL_ISLAND_URL} target="_blank" rel="noopener noreferrer">SQL Island</a> von Johannes Schildgen, entwickelt an der RPTU in Kaiserslautern; Spielgrafiken von Isabell Ruth. Das Spiel und seine Grafiken bleiben beim Originalanbieter. Diese Website ergänzt lediglich den Zugang und eigene Unterrichtsimpulse.</p>
  </section>;
}
