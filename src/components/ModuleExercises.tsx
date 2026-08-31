"use client";

import { useMemo, useState } from "react";

type LabConfig = {
  intro: string;
  choice: { question: string; options: string[]; correct: number; explanation: string };
  quick: { label: string; question: string; placeholder: string; answers: string[]; hint: string; explanation: string };
  transfer: { title: string; prompt: string; checklist: string[]; sample: string };
  scratch?: { title: string; goal: string; blocks: string[]; challenge: string };
  code?: { title: string; language: string; snippet: string; challenge: string };
};

const labs: Record<string, LabConfig> = {
  zahlensysteme: {
    intro: "Rechne zwischen Zahlensystemen um und prüfe deine Ergebnisse direkt.",
    choice: { question: "Welche Binärzahl entspricht der Dezimalzahl 42?", options: ["101010", "110010", "101100"], correct: 0, explanation: "42 = 32 + 8 + 2. Daher stehen bei 32, 8 und 2 Einsen: 101010₂." },
    quick: { label: "UMRECHNEN", question: "Schreibe 42 als Hexadezimalzahl.", placeholder: "z. B. 2F", answers: ["2a"], hint: "Teile 42 durch 16: Der Quotient ist die erste Stelle, der Rest die zweite.", explanation: "42 = 2 · 16 + 10. Die 10 wird hexadezimal als A geschrieben: 2A₁₆." },
    transfer: { title: "Zweierkomplement auf Papier", prompt: "Stelle −5 als 8-Bit-Zweierkomplement dar. Notiere jeden Rechenschritt und prüfe durch Rückumwandlung.", checklist: ["+5 als 8-Bit-Binärzahl", "alle Bits invertieren", "1 addieren", "Probe durchführen"], sample: "+5 = 00000101 → invertiert: 11111010 → +1: 11111011. Die Darstellung von −5 lautet 11111011." },
    code: { title: "Programmierauftrag", language: "Pseudocode", snippet: "zahl ← Eingabe\nsolange zahl > 0:\n  rest ← zahl mod 2\n  ...", challenge: "Vervollständige einen Algorithmus, der eine Dezimalzahl in eine Binärzahl umwandelt. Achte darauf, dass die Reste in umgekehrter Reihenfolge gelesen werden." },
  },
  "fehler-kompression": {
    intro: "Erkenne Redundanz und wähle passende Verfahren zur sicheren oder platzsparenden Speicherung.",
    choice: { question: "Welches Verfahren ist verlustfrei?", options: ["Farbtiefe reduzieren", "Lauflängencodierung", "Samplingrate halbieren"], correct: 1, explanation: "Bei der Lauflängencodierung lässt sich die ursprüngliche Folge vollständig wiederherstellen." },
    quick: { label: "KOMPRIMIEREN", question: "Codiere WWWBBBBWW als Anzahl+Zeichen.", placeholder: "z. B. 2A3B", answers: ["3w4b2w"], hint: "Zähle gleiche, direkt aufeinanderfolgende Zeichen.", explanation: "Drei W, vier B und zwei W ergeben 3W4B2W." },
    transfer: { title: "Kompressionsvergleich", prompt: "Finde je ein Beispiel, bei dem verlustfreie und verlustbehaftete Kompression sinnvoll ist. Begründe die Wahl mit Datenart, Qualität und Speicherbedarf.", checklist: ["zwei konkrete Dateitypen", "Qualitätsanforderung", "Speicherersparnis", "begründetes Urteil"], sample: "Programmcode muss verlustfrei komprimiert werden, weil jedes Zeichen wichtig ist. Bei einem Foto kann eine geringe Qualitätsminderung zugunsten einer deutlich kleineren Datei vertretbar sein." },
    scratch: { title: "Scratch: Lauflängen-Encoder", goal: "Eine Zeichenfolge untersuchen und gleiche Nachbarn zählen.", blocks: ["frage [Zeichenfolge?] und warte", "setze [Position] auf 1", "wiederhole bis <Position > Länge>", "falls <Zeichen = vorheriges Zeichen> dann ändere [Zähler] um 1", "sonst: füge Zähler und Zeichen an Ergebnis an"], challenge: "Teste dein Programm mit WWWBBBBWW und erhalte 3W4B2W. Zusatz: Was passiert bei nur einem Zeichen?" },
  },
  datenbanken: {
    intro: "Modelliere reale Gegenstände und Beziehungen so, dass Daten eindeutig und widerspruchsfrei bleiben.",
    choice: { question: "Welches Attribut eignet sich am besten als Primärschlüssel für Schüler?", options: ["Vorname", "Geburtsmonat", "eindeutige Schüler-ID"], correct: 2, explanation: "Ein Primärschlüssel muss jeden Datensatz eindeutig identifizieren. Namen und Geburtsmonate können mehrfach vorkommen." },
    quick: { label: "BEGRIFFSCHECK", question: "Wie heißt ein Attribut, das auf den Primärschlüssel einer anderen Tabelle verweist?", placeholder: "Fachbegriff", answers: ["fremdschlüssel", "fremdschluessel"], hint: "Es verbindet zwei Tabellen miteinander.", explanation: "Ein Fremdschlüssel verweist auf einen Primärschlüssel und bildet damit Beziehungen zwischen Tabellen ab." },
    transfer: { title: "Schulbibliothek modellieren", prompt: "Entwirf ein Datenmodell für Bücher, Personen und Ausleihen. Zeichne ein ER- oder UML-Diagramm und überführe es in Tabellen.", checklist: ["mindestens drei Entitätstypen", "Primärschlüssel markieren", "Kardinalitäten eintragen", "Fremdschlüssel ableiten"], sample: "BUCH(BuchID, Titel), PERSON(PersonID, Name), AUSLEIHE(AusleiheID, BuchID→BUCH, PersonID→PERSON, Datum). Eine Person kann viele Ausleihen haben; ein Buch kann nacheinander mehrfach ausgeliehen werden." },
    code: { title: "Tabellenwerkstatt", language: "SQL", snippet: "CREATE TABLE Ausleihe (\n  AusleiheID INTEGER PRIMARY KEY,\n  BuchID INTEGER,\n  PersonID INTEGER\n);", challenge: "Ergänze sinnvolle Fremdschlüssel und überlege, welche Felder niemals leer sein dürfen." },
  },
  sql: {
    intro: "Formuliere Abfragen präzise und lies aus Tabellen genau die gesuchten Informationen heraus.",
    choice: { question: "Welche Abfrage liefert die Namen aller Personen aus dem Informatikkurs?", options: ["SELECT name FROM schueler WHERE kurs = 'INF';", "SELECT kurs WHERE name = 'INF';", "FROM schueler SELECT INF;"], correct: 0, explanation: "SELECT bestimmt die Spalte, FROM die Tabelle und WHERE filtert die Datensätze." },
    quick: { label: "ABFRAGEERGEBNIS", question: "Tabelle Punkte: 8, 12, 12, 15. Wie viele Zeilen liefert WHERE punkte >= 12?", placeholder: "Anzahl", answers: ["3", "drei"], hint: "Zähle auch gleiche Werte als getrennte Datensätze.", explanation: "12, 12 und 15 erfüllen die Bedingung – also drei Zeilen." },
    transfer: { title: "SQL-Detektiv", prompt: "Eine Tabelle AUSLEIHE enthält Person, Buchtitel und Rückgabedatum. Formuliere drei Abfragen: alle offenen Ausleihen, alle Bücher einer Person und die Anzahl aller Ausleihen.", checklist: ["passende SELECT-Spalten", "korrekte WHERE-Bedingung", "mindestens eine Aggregatfunktion", "Abfragen mit Semikolon"], sample: "Beispiel: SELECT Buchtitel FROM Ausleihe WHERE Rueckgabedatum IS NULL; Für die Anzahl: SELECT COUNT(*) FROM Ausleihe;" },
    code: { title: "SQL-Spielplatz", language: "SQL", snippet: "SELECT name, punkte\nFROM schueler\nWHERE kurs = 'INF'\nORDER BY punkte DESC;", challenge: "Erkläre jede Zeile. Ändere die Abfrage anschließend so, dass nur Ergebnisse ab 10 Punkten alphabetisch erscheinen." },
  },
  programmierung: {
    intro: "Verfolge Variablen, Bedingungen und Schleifen, bevor du selbst einen Algorithmus baust.",
    choice: { question: "Welchen Wert hat summe nach der Schleife? summe=0; für i von 1 bis 4: summe=summe+i", options: ["4", "10", "16"], correct: 1, explanation: "Die Schleife addiert 1 + 2 + 3 + 4. Das ergibt 10." },
    quick: { label: "LOGIKCHECK", question: "x=7. Ist (x > 5 UND x < 10) wahr oder falsch?", placeholder: "wahr / falsch", answers: ["wahr", "true"], hint: "Beide Teilbedingungen müssen erfüllt sein.", explanation: "7 ist größer als 5 und kleiner als 10. Die UND-Verknüpfung ist wahr." },
    transfer: { title: "Testfälle entwerfen", prompt: "Entwirf einen Algorithmus, der eine Punktzahl von 0 bis 15 in eine Rückmeldung umwandelt. Notiere mindestens fünf Testfälle einschließlich ungültiger Eingaben.", checklist: ["Eingabe und Ausgabe", "Verzweigungen ohne Lücken", "Randwerte 0 und 15", "ungültige Werte testen"], sample: "Testfälle könnten −1 → Fehler, 0 → noch üben, 5 → bestanden, 14 → sehr gut und 16 → Fehler sein. Wichtig sind Randwerte an jeder Grenze." },
    scratch: { title: "Scratch: Zahlenraten", goal: "Variablen, Schleife und verzweigte Bedingungen kombinieren.", blocks: ["setze [geheim] auf Zufallszahl von 1 bis 100", "wiederhole bis <antwort = geheim>", "frage [Dein Tipp?] und warte", "falls <antwort < geheim> sage [größer]", "sonst falls <antwort > geheim> sage [kleiner]"], challenge: "Ergänze eine Variable Versuche und gib am Ende eine passende Rückmeldung zur Anzahl der Tipps." },
  },
  oop: {
    intro: "Unterscheide Bauplan und konkrete Instanz und modelliere Verantwortlichkeiten sauber.",
    choice: { question: "Was ist in der OOP ein Objekt?", options: ["Der allgemeine Bauplan", "Eine konkrete Instanz einer Klasse", "Nur eine einzelne Variable"], correct: 1, explanation: "Die Klasse ist der Bauplan; ein Objekt ist eine konkrete Instanz mit eigenen Attributwerten." },
    quick: { label: "ZUORDNEN", question: "Hund bello = new Hund(); – Wie heißt Hund, wie heißt bello? Antworte: Klasse,Objekt", placeholder: "Klasse,Objekt", answers: ["hund,bello"], hint: "Links vom Variablennamen steht der Datentyp beziehungsweise die Klasse.", explanation: "Hund ist die Klasse. bello ist die Referenz auf das erzeugte Objekt." },
    transfer: { title: "UML-Klassenkarten", prompt: "Modelliere ein Schulverwaltungssystem mit Person, Schüler und Lehrkraft. Nutze Attribute, Methoden, Datenkapselung und eine sinnvolle Vererbung.", checklist: ["drei Klassen", "private Attribute", "Methoden mit Signaturen", "Vererbungsbeziehung", "mindestens eine Assoziation"], sample: "Person kann Name und Geburtsdatum kapseln. Schüler und Lehrkraft erben von Person. Schüler besitzt beispielsweise getKurs(), Lehrkraft unterrichtet eine Liste von Kursen." },
    code: { title: "Code lesen", language: "Java", snippet: "class Konto {\n  private double stand;\n  public void einzahlen(double betrag) {\n    if (betrag > 0) stand += betrag;\n  }\n}", challenge: "Erkläre, wie hier Datenkapselung umgesetzt ist. Ergänze eine Methode getStand() und einen Testfall für eine negative Einzahlung." },
  },
  netzwerke: {
    intro: "Begleite ein Datenpaket von der Webadresse bis zum Zielserver.",
    choice: { question: "Welche Aufgabe übernimmt DNS?", options: ["Webseiten gestalten", "Namen in IP-Adressen auflösen", "Dateien verschlüsseln"], correct: 1, explanation: "DNS übersetzt einen lesbaren Domainnamen in eine IP-Adresse, unter der der Server erreichbar ist." },
    quick: { label: "PAKETREISE", question: "Ordne mit Kommas: Webserver, DNS, Browser", placeholder: "erste Station, zweite Station, dritte Station", answers: ["browser,dns,webserver"], hint: "Wer stellt die Anfrage? Wer liefert die Adresse? Wer liefert schließlich die Seite?", explanation: "Der Browser fragt zunächst DNS nach der IP-Adresse und kontaktiert danach den Webserver." },
    transfer: { title: "Routingplan zeichnen", prompt: "Zeichne zwei lokale Netze mit je einem Switch und mindestens zwei Endgeräten. Verbinde sie über Router und markiere einen möglichen Weg für ein Datenpaket.", checklist: ["Endgeräte und Verteiler", "lokale und globale Adressen", "Router zwischen den Netzen", "Paketweg mit Pfeilen", "möglicher Ausfallweg"], sample: "Ein Paket läuft vom Endgerät zum Switch, zum lokalen Router, über weitere Router zum Zielnetz und dort über den Switch zum Webserver. Router entscheiden abschnittsweise über den nächsten Knoten." },
    scratch: { title: "Scratch: Paket-Simulator", goal: "Nachrichten zwischen Browser, DNS, Router und Webserver sichtbar machen.", blocks: ["vier Figuren benennen", "sende [DNS-Anfrage] an alle", "wenn ich [DNS-Antwort] empfange: merke IP", "gleite zum Router und sende [HTTP-Anfrage]", "Webserver sendet [Seite] zurück"], challenge: "Ergänze Paketverlust: Mit Wahrscheinlichkeit 20 % muss die Anfrage erneut gesendet werden." },
  },
  schaltnetze: {
    intro: "Berechne logische Ausgänge und setze Gatter zu einem Addierer zusammen.",
    choice: { question: "Welchen Ausgang liefert XOR für A=1 und B=0?", options: ["0", "1", "nicht definiert"], correct: 1, explanation: "XOR ist genau dann 1, wenn die beiden Eingänge verschieden sind." },
    quick: { label: "HALBADDIERER", question: "Ein Halbaddierer berechnet 1 + 1. Gib Summe und Übertrag als zwei Bits an.", placeholder: "z. B. 01", answers: ["10"], hint: "Die Summe ist XOR, der Übertrag ist AND. Schreibe Übertrag vor Summe.", explanation: "XOR(1,1)=0 und AND(1,1)=1. Als Binärergebnis entsteht 10." },
    transfer: { title: "Wahrheitstabelle", prompt: "Erstelle die vollständige Wahrheitstabelle für einen Volladdierer mit A, B und Carry-In. Markiere Summe und Carry-Out.", checklist: ["acht Eingangskombinationen", "Summe korrekt", "Übertrag korrekt", "Muster erläutern"], sample: "Bei genau einer oder drei Einsen ist die Summe 1. Carry-Out ist 1, sobald mindestens zwei der drei Eingänge 1 sind." },
    scratch: { title: "Scratch: Logikgatter", goal: "Ein Sprite reagiert wie ein XOR-Gatter auf zwei Schalter.", blocks: ["Variablen A und B anlegen", "wenn Taste A: setze A auf 1−A", "wenn Taste B: setze B auf 1−B", "falls <<A=1 und B=0> oder <A=0 und B=1>>", "dann sage [Ausgang 1], sonst [Ausgang 0]"], challenge: "Baue daraus zusätzlich AND und kombiniere beide Ergebnisse zu einem Halbaddierer." },
  },
  "klassische-kryptografie": {
    intro: "Verschlüssele selbst, entdecke Muster und begründe, wann ein Verfahren sicher ist.",
    choice: { question: "Warum ist Vigenère schwerer anzugreifen als Caesar?", options: ["Es verwendet mehrere Verschiebealphabete", "Es braucht keinen Schlüssel", "Es verändert nur Leerzeichen"], correct: 0, explanation: "Durch das wiederholte Schlüsselwort entstehen unterschiedliche Verschiebungen – also eine polyalphabetische Substitution." },
    quick: { label: "VIGENÈRE", question: "Verschlüssele HALLO mit dem Schlüssel KEY (A=0).", placeholder: "Geheimtext", answers: ["rejvs"], hint: "Wiederhole den Schlüssel als KEYKE und addiere die Buchstabenpositionen modulo 26.", explanation: "H+K=R, A+E=E, L+Y=J, L+K=V, O+E=S. Der Geheimtext lautet REJVS." },
    transfer: { title: "Sicherheitsvergleich", prompt: "Vergleiche Caesar, Vigenère und One-Time-Pad hinsichtlich Schlüsselraum, Wiederholungen, Schlüsseltausch und theoretischer Sicherheit.", checklist: ["alle drei Verfahren", "Angriffsmöglichkeit", "Schlüsselanforderung", "begründetes Fazit"], sample: "Caesar besitzt nur wenige Schlüssel. Vigenère verschleiert Häufigkeiten besser, wiederholt aber den Schlüssel. Ein korrekt genutztes One-Time-Pad ist informationstheoretisch sicher, benötigt jedoch einen zufälligen Schlüssel in Nachrichtenlänge, der nur einmal verwendet wird." },
    scratch: { title: "Scratch: Caesar-Maschine", goal: "Buchstaben über eine Alphabet-Liste verschieben.", blocks: ["Liste [Alphabet] mit A bis Z füllen", "frage [Text?] und warte", "frage [Verschiebung?] und warte", "für jeden Buchstaben: finde Position", "neue Position ← (Position + Verschiebung) modulo 26"], challenge: "Erweitere auf Vigenère: Die Verschiebung wird jetzt durch den jeweils nächsten Buchstaben des Schlüsselworts bestimmt." },
  },
  "moderne-kryptografie": {
    intro: "Ordne öffentliche und private Schlüssel richtig zu und analysiere sichere Kommunikation.",
    choice: { question: "Alice möchte Bob vertraulich schreiben. Mit welchem Schlüssel verschlüsselt sie?", options: ["mit Alices privatem Schlüssel", "mit Bobs öffentlichem Schlüssel", "mit Bobs privatem Schlüssel"], correct: 1, explanation: "Nur Bob besitzt den passenden privaten Schlüssel und kann die Nachricht entschlüsseln." },
    quick: { label: "SIGNATUR", question: "Welchen Schlüssel nutzt Bob, um eine digitale Signatur zu erzeugen?", placeholder: "öffentlicher oder privater Schlüssel", answers: ["privater schlüssel", "privater schluessel", "privat"], hint: "Die Signatur soll nur von Bob erzeugt, aber von allen geprüft werden können.", explanation: "Bob signiert mit seinem privaten Schlüssel. Geprüft wird die Signatur mit seinem öffentlichen Schlüssel." },
    transfer: { title: "HTTPS-Rollenspiel", prompt: "Erkläre in sechs Schritten, wie Browser, Serverzertifikat, asymmetrische und symmetrische Verschlüsselung bei einer HTTPS-Verbindung zusammenspielen.", checklist: ["Zertifikat prüfen", "Server identifizieren", "Sitzungsschlüssel vereinbaren", "symmetrisch übertragen", "Angriffsszenario nennen"], sample: "Das Zertifikat bindet den öffentlichen Schlüssel an den Servernamen. Nach der Prüfung wird sicher ein gemeinsamer Sitzungsschlüssel vereinbart; die eigentlichen Daten werden anschließend schnell symmetrisch verschlüsselt übertragen." },
    code: { title: "Protokollkarten", language: "Ablauf", snippet: "1. Browser → Server: Hallo\n2. Server → Browser: Zertifikat\n3. Browser: Zertifikat prüfen\n4. ...", challenge: "Vervollständige den Ablauf und markiere, wo Vertrauen, Authentizität und Vertraulichkeit entstehen." },
  },
  datenschutz: {
    intro: "Bewerte Datennutzung nicht nur technisch, sondern auch rechtlich, gesellschaftlich und persönlich.",
    choice: { question: "Welche Angabe ist eindeutig personenbezogen?", options: ["durchschnittliche Temperatur einer Stadt", "Schüler-ID zusammen mit Leistungsdaten", "Anzahl freier Fahrräder ohne Standortbezug"], correct: 1, explanation: "Die Schüler-ID ermöglicht die Zuordnung der Leistungsdaten zu einer bestimmten Person." },
    quick: { label: "SCHUTZZIEL", question: "Wie heißt das Schutzziel: Daten dürfen nicht unbemerkt verändert werden?", placeholder: "Fachbegriff", answers: ["integrität", "integritaet"], hint: "Neben Vertraulichkeit und Verfügbarkeit gehört es zu den drei klassischen Schutzzielen.", explanation: "Integrität bedeutet, dass Daten korrekt und vor unbemerkter Veränderung geschützt sind." },
    transfer: { title: "Urteilslabor: Lern-App", prompt: "Eine Lern-App sammelt Namen, Klickwege, Standort und Noten, um Empfehlungen zu geben. Verfasse ein begründetes Urteil aus Sicht von Schülern, Schule und Anbieter.", checklist: ["Zweck und Erforderlichkeit", "Datenminimierung", "Transparenz und Einwilligung", "Sicherheitsmaßnahmen", "drei Perspektiven", "begründete Entscheidung"], sample: "Für Empfehlungen sind Standortdaten wahrscheinlich nicht erforderlich. Die App sollte nur zweckgebundene Daten erheben, verständlich informieren, sichere Löschfristen bieten und eine datensparsame Alternative ermöglichen." },
    code: { title: "Privacy by Design", language: "Konzept", snippet: "Datenfeld | Zweck | Speicherdauer | Zugriff\nName      | ?     | ?            | ?\nStandort  | ?     | ?            | ?", challenge: "Fülle die Tabelle aus, streiche unnötige Daten und ergänze mindestens vier technische oder organisatorische Schutzmaßnahmen." },
  },
};

const normalize = (value: string) => value.toLowerCase().trim().replace(/\s+/g, " ").replace(/\s*,\s*/g, ",").replace(/;$/, "");

export default function ModuleExercises({ slug }: { slug: string }) {
  const config = labs[slug];
  const [choice, setChoice] = useState<number | null>(null);
  const [quick, setQuick] = useState("");
  const [quickChecked, setQuickChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [notes, setNotes] = useState("");
  const [showSample, setShowSample] = useState(false);
  const [transferDone, setTransferDone] = useState(false);

  const quickCorrect = useMemo(() => config.quick.answers.map(normalize).includes(normalize(quick)), [config, quick]);
  const completed = (choice === config.choice.correct ? 1 : 0) + (quickChecked && quickCorrect ? 1 : 0) + (transferDone ? 1 : 0);

  return (
    <section className="exerciseLab">
      <div className="exerciseHeader">
        <div><div className="eyebrow">INTERAKTIVES ÜBUNGSLABOR</div><h2>Verstehen. Anwenden. Erklären.</h2><p>{config.intro}</p></div>
        <div className="scoreRing"><strong>{completed}/3</strong><span>Stationen</span></div>
      </div>

      <article className="exerciseStation">
        <div className="stationLabel"><span>01</span><div><small>VERSTÄNDNISCHECK</small><strong>Entscheide dich</strong></div></div>
        <h3>{config.choice.question}</h3>
        <div className="choiceGrid">
          {config.choice.options.map((option, index) => (
            <button className={choice === index ? (index === config.choice.correct ? "correctChoice" : "wrongChoice") : ""} onClick={() => setChoice(index)} key={option}><span>{String.fromCharCode(65 + index)}</span>{option}</button>
          ))}
        </div>
        {choice !== null && <div className={`stationFeedback ${choice === config.choice.correct ? "correct" : "retry"}`}>{choice === config.choice.correct ? "✓ Richtig. " + config.choice.explanation : "Noch nicht. Prüfe die Begriffe und versuche es erneut."}</div>}
      </article>

      <article className="exerciseStation">
        <div className="stationLabel"><span>02</span><div><small>{config.quick.label}</small><strong>Selbst lösen</strong></div></div>
        <h3>{config.quick.question}</h3>
        <div className="quickAnswer"><input aria-label="Deine Antwort" value={quick} onChange={(event) => { setQuick(event.target.value); setQuickChecked(false); }} placeholder={config.quick.placeholder} onKeyDown={(event) => { if (event.key === "Enter") setQuickChecked(true); }} /><button onClick={() => setQuickChecked(true)} disabled={!quick.trim()}>Prüfen →</button></div>
        <button className="hintButton" onClick={() => setShowHint(!showHint)}>{showHint ? "Hinweis ausblenden" : "Hinweis anzeigen"}</button>
        {showHint && <p className="hintText">💡 {config.quick.hint}</p>}
        {quickChecked && <div className={`stationFeedback ${quickCorrect ? "correct" : "retry"}`}>{quickCorrect ? "✓ " + config.quick.explanation : "Das passt noch nicht. Nutze den Hinweis und prüfe Schreibweise sowie Rechenweg."}</div>}
      </article>

      <article className="exerciseStation transferStation">
        <div className="stationLabel"><span>03</span><div><small>TRANSFER & DOKUMENTATION</small><strong>{config.transfer.title}</strong></div></div>
        <h3>{config.transfer.prompt}</h3>
        <div className="transferLayout">
          <div><label htmlFor={`notes-${slug}`}>Deine Notizen oder Lösungsskizze</label><textarea id={`notes-${slug}`} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Hier kannst du deine Gedanken festhalten. Eine ausführliche Lösung darfst du auch auf Papier oder in einem Dokument erstellen." /></div>
          <div className="checklist"><strong>Darauf kommt es an:</strong>{config.transfer.checklist.map((item) => <span key={item}>□ {item}</span>)}</div>
        </div>
        <div className="transferActions"><button onClick={() => setTransferDone(!transferDone)} className={transferDone ? "doneButton" : ""}>{transferDone ? "✓ Als bearbeitet markiert" : "Als bearbeitet markieren"}</button><button className="sampleButton" onClick={() => setShowSample(!showSample)}>{showSample ? "Beispiellösung schließen" : "Beispiellösung ansehen"}</button></div>
        {showSample && <div className="sampleAnswer"><strong>Beispiel / Erwartungshorizont</strong><p>{config.transfer.sample}</p></div>}
      </article>

      {config.scratch && <ScratchWorkshop {...config.scratch} />}
      {config.code && <CodeWorkshop {...config.code} />}
    </section>
  );
}

function ScratchWorkshop({ title, goal, blocks, challenge }: NonNullable<LabConfig["scratch"]>) {
  return <article className="scratchWorkshop"><div className="scratchTop"><div className="scratchLogo">SCRATCH</div><div><div className="eyebrow">PROGRAMMIERWERKSTATT</div><h2>{title}</h2></div><a href="https://scratch.mit.edu/projects/editor/" target="_blank" rel="noreferrer">Scratch öffnen ↗</a></div><p>{goal}</p><div className="scratchBlocks">{blocks.map((block, index) => <div className={`scratchBlock block${index % 4}`} key={block}><span>{index + 1}</span>{block}</div>)}</div><div className="scratchChallenge"><strong>⭐ Erweiterung</strong><p>{challenge}</p></div></article>;
}

function CodeWorkshop({ title, language, snippet, challenge }: NonNullable<LabConfig["code"]>) {
  return <article className="codeWorkshop"><div className="codeWorkshopTop"><div><div className="eyebrow">CODE- & MODELLWERKSTATT</div><h2>{title}</h2></div><span>{language}</span></div><pre>{snippet}</pre><p><strong>Auftrag:</strong> {challenge}</p></article>;
}
