import { useId, useState } from "react";
import "./SecurityLabs.css";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export function vigenereRows(text: string, key: string) {
  if (!/^[A-Z]+$/.test(text) || !/^[A-Z]+$/.test(key)) return [];
  return [...text].map((letter, i) => {
    const keyLetter = key[i % key.length], plain = alphabet.indexOf(letter), shift = alphabet.indexOf(keyLetter);
    return {letter, keyLetter, plain, shift, sum:plain + shift, result:(plain + shift) % 26, cipher:alphabet[(plain + shift) % 26]};
  });
}

export function CipherWheelLab() {
  const id = useId();
  const [mode, setMode] = useState<"caesar" | "vigenere">("caesar");
  const [position, setPosition] = useState(0);
  const text = "SONNE", key = mode === "caesar" ? "D" : "TAG";
  const rows = vigenereRows(text, key), row = rows[position];
  return <section className="seclab" aria-labelledby={id}>
    <span className="seclab-kicker">BUCHSTABEN ALS ZAHLEN · SCHRITT FÜR SCHRITT</span>
    <h3 id={id}>Was passiert beim Verschieben des Alphabets?</h3>
    <p>Eine geheime Nachricht auf Papier ist ein guter Einstieg: Der Computer verarbeitet keine „geheimnisvollen“ Buchstaben, sondern Zahlen. Wir vereinbaren A = 0, B = 1, …, Z = 25. Nach 25 beginnt die Zählung wieder bei 0.</p>
    <p className="seclab-predict"><strong>Erst vermuten:</strong> SONNE enthält zweimal N. Werden daraus immer zwei gleiche Geheimtextbuchstaben? Vergleiche beide Verfahren.</p>
    <div className="seclab-buttons" aria-label="Verfahren auswählen"><button type="button" aria-pressed={mode === "caesar"} onClick={() => {setMode("caesar"); setPosition(0);}}>1. Caesar: immer +3</button><button type="button" aria-pressed={mode === "vigenere"} onClick={() => {setMode("vigenere"); setPosition(0);}}>2. Vigenère: Schlüssel TAG</button></div>
    <div className="seclab-letters" aria-label="Buchstaben der Nachricht auswählen">{rows.map((r, i) => <button type="button" key={i} aria-pressed={i === position} aria-label={`Stelle ${i + 1}: ${r.letter}, Schlüssel ${r.keyLetter}`} onClick={() => setPosition(i)}><small>Stelle {i + 1}</small><strong>{r.letter}</strong><span>+ {r.keyLetter}</span><b>↓ {r.cipher}</b></button>)}</div>
    <svg className="seclab-ring" viewBox="0 0 340 300" role="img" aria-label={`Zahlenkreis: ${row.letter} ist ${row.plain}; ${row.shift} Schritte weiter ergeben ${row.cipher}, also ${row.result}.`}>
      <circle cx="170" cy="143" r="103" fill="#f0f4e8" stroke="#bdccb7" />
      {[...alphabet].map((letter, i) => {const a = (i / 26) * 2 * Math.PI - Math.PI / 2, x = 170 + Math.cos(a) * 115, y = 143 + Math.sin(a) * 115; return <g key={letter}><circle cx={x} cy={y} r="12" fill={i === row.result ? "#183e32" : i === row.plain ? "#c9f27f" : "#fffefa"} stroke={i === row.result || i === row.plain ? "#183e32" : "#d8d8d0"}/><text x={x} y={y + 4} textAnchor="middle" fontSize="13" fill={i === row.result ? "#fffefa" : "#183e32"}>{letter}</text></g>;})}
      <text x="170" y="119" textAnchor="middle" fill="#183e32" fontSize="17">{row.letter} + {row.keyLetter}</text>
      <text x="170" y="151" textAnchor="middle" fill="#183e32" fontSize="24" fontWeight="bold">{row.plain} + {row.shift} = {row.sum}</text>
      <text x="170" y="181" textAnchor="middle" fill="#183e32" fontSize="17">Rest {row.result} → {row.cipher}</text>
      <text x="170" y="286" textAnchor="middle" fill="#183e32" fontSize="12">Hell: Start · Dunkel: Ziel · A folgt auf Z</text>
    </svg>
    <div className="seclab-result" role="status"><strong>Stelle {position + 1}: {row.letter} wird {row.cipher}.</strong><ol><li>Klartextwert {row.plain} und Schlüsselwert {row.shift} addieren: {row.sum}.</li><li>{row.sum >= 26 ? `Der Wert ist mindestens 26: ${row.sum} − 26 = ${row.result}.` : `Der Wert liegt unter 26. Er bleibt ${row.result}.`} „modulo 26“ meint genau diesen Rest.</li><li>Zur Probe rückwärts: ({row.result} − {row.shift} + 26) mod 26 = {row.plain} → {row.letter}.</li></ol></div>
    <div className="seclab-buttons"><button type="button" disabled={position === 0} onClick={() => setPosition(position - 1)}>← Voriger Buchstabe</button><button type="button" disabled={position === rows.length - 1} onClick={() => setPosition(position + 1)}>Nächster Buchstabe →</button><button type="button" onClick={() => {setMode("caesar");setPosition(0);}}>Zurücksetzen</button></div>
    <p>Ergebnis: <strong className="seclab-mono">{rows.map(r => r.cipher).join("")}</strong>. {mode === "caesar" ? "Die beiden N werden beide Q: derselbe Buchstabe, dieselbe Verschiebung." : "Das erste N wird T (+6), das zweite N wird G (+19). Das Schlüsselwort wiederholt sich als TAGTA."}</p>
    <p className="seclab-note">Das sind historische Lernverfahren, keine sichere Verschlüsselung für heutige Nachrichten. Auch ein wiederholtes Vigenère-Schlüsselwort kann Muster verraten. Ein One-Time-Pad hat andere, strenge Voraussetzungen: wirklich zufällig, geheim, nachrichtenlang und nur einmal benutzt.</p>
  </section>;
}

const tlsStages = [
  {title:"Kontakt und erste Schlüssel", text:"Für lernportal.example tauschen Browser und Server Beiträge zur Schlüsselvereinbarung aus. Daraus entstehen erste Schlüssel, die den weiteren Verbindungsaufbau schützen. Die Identität ist noch nicht geprüft."},
  {title:"Identität nachweisen", text:"Bereits geschützt sendet der Server sein Zertifikat und einen signierten Besitznachweis für den zugehörigen privaten Schlüssel. Der private Schlüssel selbst bleibt geheim."},
  {title:"Nachweis prüfen", text:"Der Browser prüft unter anderem: Passt der Domainname? Ist das Zertifikat zeitlich gültig? Führt die Signaturkette zu einer vertrauten Stelle? Stimmt der Besitznachweis?"},
  {title:"Schlüssel für die Webdaten", text:"Nach erfolgreicher Prüfung wird der Aufbau abgeschlossen. Beide Seiten leiten passende Schlüssel für die Webdaten ab. Es wird kein fertiger geheimer Sitzungsschlüssel ungeschützt verschickt."},
  {title:"Daten geschützt übertragen", text:"Die Webdaten werden symmetrisch verschlüsselt und gegen unbemerkte Veränderung geschützt. Jemand im WLAN kann ihren Inhalt so nicht einfach mitlesen."},
];

export function TlsJourneyLab() {
  const id = useId();
  const [stage, setStage] = useState(0);
  const [valid, setValid] = useState(true);
  const blocked = !valid && stage === 2;
  return <section className="seclab" aria-labelledby={id}>
    <span className="seclab-kicker">ANIMATION ZUM WEITERSCHALTEN · SICHERE VERBINDUNG</span>
    <h3 id={id}>Was macht dein Browser bei HTTPS?</h3>
    <p>Du meldest dich in einem Lernportal an. Deine Anmeldedaten sollen unterwegs nicht mitgelesen werden. Dafür braucht der Browser zwei verschiedene Dinge: einen geprüften Verbindungspartner und eine geschützte Übertragung.</p>
    <p className="seclab-predict"><strong>Erst vermuten:</strong> Ein fremder Server bietet dir seinen öffentlichen Schlüssel an. Genügt das schon, um ihm dein Passwort zu schicken?</p>
    <label className="seclab-check"><input type="checkbox" checked={!valid} onChange={e => {setValid(!e.target.checked);setStage(0);}}/>Fehlerfall ausprobieren: Zertifikat gehört zu einer anderen Domain</label>
    <div className="seclab-transfer" aria-label="Beteiligte an der Verbindung">
      <div className={stage === 0 || stage === 2 ? "active" : ""}><span aria-hidden="true">▣</span><strong>Browser</strong><small>Prüft den Server</small></div>
      <div className="seclab-packet" data-blocked={blocked}><span aria-hidden="true">{blocked ? "✕" : stage === 0 ? "→" : stage < 3 ? "←" : "↔"}</span><strong>{blocked ? "Stopp" : stage < 3 ? "Verbindungsaufbau" : stage === 3 ? "Schlüsselableitung" : "Geschützte Webdaten"}</strong></div>
      <div className={stage === 1 ? "active" : ""}><span aria-hidden="true">▤</span><strong>Webserver</strong><small>Privater Schlüssel bleibt hier</small></div>
    </div>
    <ol className="seclab-stage-list">{tlsStages.map((s, i) => <li key={s.title} aria-current={stage === i ? "step" : undefined} data-done={i < stage}><span>{i + 1}</span>{s.title}</li>)}</ol>
    <div className="seclab-result" role="status"><strong>Schritt {stage + 1}: {blocked ? "Domain stimmt nicht – Verbindung stoppen" : tlsStages[stage].title}</strong><p>{blocked ? "Ein Zertifikat für fremd.example weist nicht die Identität von lernportal.example nach. In diesem Lernmodell stoppt der Browser. Gib keine Anmeldedaten ein und lasse die Ursache prüfen. Die Prüfung darf nicht einfach übersprungen werden." : tlsStages[stage].text}</p></div>
    <div className="seclab-buttons"><button type="button" disabled={stage === 0} onClick={() => setStage(stage - 1)}>← Zurück</button><button type="button" disabled={stage === 4 || blocked} onClick={() => setStage(stage + 1)}>Nächster Schritt →</button><button type="button" onClick={() => {setStage(0);setValid(true);}}>Neu starten</button></div>
    <details><summary>Verschlüsselung und Signatur sind nicht dasselbe</summary><p><strong>Verschlüsselung:</strong> schützt, wer den Inhalt lesen kann. <strong>Signatur:</strong> hilft nachzuweisen, zu welchem privaten Schlüssel die Daten gehören und ob sie verändert wurden. Eine Signatur macht eine Nachricht allein nicht geheim.</p><p>Öffentliche Schlüssel dürfen bekannt sein, müssen aber dem richtigen Gegenüber zugeordnet werden. Private Schlüssel bleiben geheim. Zertifikate und die Prüfung der Zertifikatskette helfen bei dieser Zuordnung.</p></details>
    <p className="seclab-note">Vereinfachter, zertifikatsbasierter TLS-1.3-Ablauf ohne Wiederaufnahme einer Sitzung. Die Schritte sind didaktisch getrennt; im echten Protokoll werden manche Angaben gemeinsam ausgetauscht. HTTPS garantiert nicht, dass eine Website ehrliche Inhalte anbietet, und schützt keine bereits kompromittierten Endgeräte. <a href="https://www.rfc-editor.org/rfc/rfc8446.html" target="_blank" rel="noreferrer">Technischer Hintergrund: TLS 1.3</a>.</p>
  </section>;
}

export const profilePeople = [
  {id:"A", age:16, route:"U4", hobby:"Musik"}, {id:"B", age:16, route:"U4", hobby:"Basketball"},
  {id:"C", age:16, route:"U9", hobby:"Musik"}, {id:"D", age:16, route:"U9", hobby:"Basketball"},
  {id:"E", age:17, route:"U4", hobby:"Musik"}, {id:"F", age:17, route:"U4", hobby:"Basketball"},
  {id:"G", age:17, route:"U9", hobby:"Musik"}, {id:"H", age:17, route:"U9", hobby:"Basketball"},
] as const;
export function matchingProfiles(filters: readonly boolean[]) {
  return profilePeople.filter(p => (!filters[0] || p.age === 16) && (!filters[1] || p.route === "U4") && (!filters[2] || p.hobby === "Musik"));
}

export function DataTraceLab() {
  const id = useId();
  const [filters, setFilters] = useState([false, false, false]);
  const matches = matchingProfiles(filters);
  const labels = ["Alter: 16 Jahre", "Schulweg: Linie U4", "Hobby: Musik"];
  return <section className="seclab" aria-labelledby={id}>
    <span className="seclab-kicker">DATENSPUREN SICHTBAR MACHEN</span>
    <h3 id={id}>Kein Name – und trotzdem erkennbar?</h3>
    <p>Ein Beitrag in einem sozialen Netzwerk nennt keinen Namen, verrät aber einzelne Eigenschaften. Hier siehst du acht <strong>frei erfundene</strong> Profile. Schalte Merkmale dazu und beobachte, wie viele Personen noch zu allen bekannten Angaben passen.</p>
    <p className="seclab-predict"><strong>Erst vermuten:</strong> Jede einzelne Angabe passt zu vier Personen. Wie viele bleiben übrig, wenn du zwei oder drei Angaben kombinierst?</p>
    <div className="seclab-filters">{labels.map((label, i) => <label className="seclab-check" key={label}><input type="checkbox" checked={filters[i]} onChange={e => setFilters(filters.map((v, j) => i === j ? e.target.checked : v))}/>{label}</label>)}</div>
    <div className="seclab-profiles">{profilePeople.map(p => {const match = matches.some(m => m.id === p.id); return <div key={p.id} data-match={match}><span className="seclab-avatar" aria-hidden="true">●</span><strong>Person {p.id}</strong><span>{p.age} Jahre · {p.route}</span><span>{p.hobby}</span><small>{match ? "✓ passt zu den Angaben" : "passt nicht zu allen Angaben"}</small></div>;})}</div>
    <p className="seclab-result" role="status"><strong>{matches.length === 1 ? "1 von 8 Profilen passt noch." : `${matches.length} von 8 Profilen passen noch.`}</strong> {matches.length === 1 ? "In dieser kleinen Gruppe passt nur Person A zu der Kombination. Kein einzelnes Merkmal hätte dafür ausgereicht." : "Je mehr passende Informationen du verknüpfst, desto kleiner kann die Gruppe werden."}</p>
    <details><summary>Was heißt das für Apps und deinen Alltag?</summary><p>Eine Kennnummer statt eines Namens verhindert nicht automatisch, dass Daten einer Person zugeordnet werden können. Eine Verbindung zu weiteren Informationen kann die Zuordnung erleichtern. Verschlüsselung schützt den Zugriff – sie begrenzt nicht von selbst, welche Informationen überhaupt gesammelt werden.</p><p><strong>Zum Diskutieren:</strong> Eine Fahrplan-App soll die nächste Verbindung anzeigen. Braucht sie dauerhaft deinen Namen, dein Hobby und deinen gesamten Standortverlauf? Welche Funktion würde auch mit weniger Angaben funktionieren?</p><p>Die acht Profile sind bewusst übersichtlich konstruiert. In einer echten Stadt sind die Verteilungen anders; aus diesem Beispiel lässt sich keine reale Erkennungswahrscheinlichkeit ableiten. Eindeutigkeit in einer Tabelle ist auch noch kein sicherer Beweis für die Identität eines Menschen.</p></details>
    <button className="seclab-reset" type="button" onClick={() => setFilters([false, false, false])}>Alle Merkmale zurücksetzen</button>
  </section>;
}
