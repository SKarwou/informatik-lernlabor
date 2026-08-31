import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Projektphasen · Informatik-Lernlabor",
  description: "Zwei vollständige Programmierprojekte mit Scratch und BlueJ für das Wahlfach Informatik in der Oberstufe.",
  openGraph: { title: "Projektphasen · Informatik-Lernlabor", description: "Zwei vollständige Programmierprojekte mit Scratch und BlueJ.", images: [] },
  twitter: { title: "Projektphasen · Informatik-Lernlabor", description: "Zwei vollständige Programmierprojekte mit Scratch und BlueJ.", images: [] }
};

const scratchMilestones = [
  ["01", "Problem & Rollen", "Messenger, DNS, Router und Empfänger als Rollen skizzieren; Anforderungen und drei Testnachrichten festhalten."],
  ["02", "Prototyp", "Figuren, Ereignisse, Variablen und Nachrichtenfluss in Scratch aufbauen; ein Paket sichtbar zustellen."],
  ["03", "Codierung", "Text oder Zeichenfolge mit einem selbst gewählten einfachen Verfahren codieren und wieder decodieren."],
  ["04", "Sicherheit", "Vigenère-Modus oder Schlüsselübergabe ergänzen; vertrauliche und öffentliche Daten sichtbar unterscheiden."],
  ["05", "Netz & Fehler", "DNS-Auflösung, mindestens zwei Routerstationen sowie Paketverlust oder falsche Adresse simulieren."],
  ["06", "Testphase", "Zehn Testfälle ausführen, Fehlerprotokoll führen und mindestens drei Verbesserungen umsetzen."],
  ["07", "Erklärung", "Schaubild, Bedienhinweise, Merksätze und eine zweiminütige geführte Demonstration erstellen."],
  ["08", "Präsentation", "Projektmesse, gegenseitige Tests, Reflexion zu Modellgrenzen und Sicherheit."]
];

const bluejMilestones = [
  ["01", "Anforderungen & UML", "Nutzerrollen, Muss-Funktionen und Testfälle festlegen; UML-Klassendiagramm mit Beziehungen entwerfen."],
  ["02", "Fachklassen", "Medium, Buch, Person und Ausleihe mit privaten Attributen, Konstruktoren und geprüften Methoden umsetzen."],
  ["03", "Daten verwalten", "Objekte in Array oder Liste speichern; Einfügen, Suchen, Maximum/Statistik und Entfernen implementieren."],
  ["04", "Sortieren", "Mindestens ein elementares Sortierverfahren selbst implementieren und über Titel oder Jahr anwenden."],
  ["05", "Dateien & Tests", "Daten laden und speichern; Normal-, Rand- und Fehlerfälle dokumentiert prüfen; Debugger einsetzen."],
  ["06", "Oberfläche", "Einfache GUI mit Eingabe, Buttons und Ausgabe an die getesteten Fachklassen anbinden."],
  ["07", "Abgabe", "Quellcode kommentieren, Dokumentation erstellen, Anwendung vorführen und Designentscheidungen verteidigen."]
];

export default function ProjectsPage() {
  return <main>
    <nav className="nav shell" aria-label="Hauptnavigation">
      <Link className="brand" href="/"><span className="brandMark">&lt;/&gt;</span><span>Informatik-Lernlabor</span></Link>
      <div className="navLinks"><Link href="/bildungsplan">Bildungsplan-Check</Link><Link href="/#themen">Kapitel</Link></div>
    </nav>

    <header className="subpageHero shell">
      <div className="eyebrow">ZWEI SCHULJAHRE · ZWEI PRODUKTE</div>
      <h1>Projektphasen mit <em>echtem Ergebnis.</em></h1>
      <p>Beide Projekte verbinden mehrere Bildungsplanbereiche. Sie sind so zugeschnitten, dass Teams selbstständig entwickeln, testen, dokumentieren und ihre Entscheidungen erklären.</p>
      <div className="heroActions"><a className="primaryButton" href="#scratch">Mit Scratch starten <span>↓</span></a><a className="textButton" href="#bluej">BlueJ-Projekt ansehen →</a></div>
    </header>

    <section className="projectPhase scratchPhase" id="scratch">
      <div className="shell">
        <div className="phaseHeader">
          <div><span className="phaseNumber">PROJEKT 01</span><div className="toolBadge">Scratch</div></div>
          <div><div className="eyebrow">JAHR 1 · 8 DOPPELSTUNDEN · TEAMS À 2–3</div><h2>Datenreise: Der sichere Schul-Messenger</h2><p>Die Teams entwickeln eine anklickbare Simulation, in der eine Nachricht codiert, über DNS und Router zugestellt, optional verschlüsselt und am Ziel wieder lesbar gemacht wird.</p></div>
        </div>

        <div className="projectBriefGrid">
          <article><span className="eyebrow">AUSGANGSLAGE</span><h3>Der Auftrag</h3><p>Jüngere Schülerinnen und Schüler sollen verstehen, was zwischen dem Klick auf „Senden“ und dem Anzeigen einer Nachricht geschieht. Euer Scratch-Projekt macht die unsichtbaren Schritte sichtbar und lässt typische Fehler gezielt ausprobieren.</p></article>
          <article><span className="eyebrow">MUSS-KRITERIEN</span><h3>Das muss funktionieren</h3><ul><li>mindestens vier klar benannte Stationen</li><li>Nachrichten und Ereignisse steuern den Ablauf</li><li>Liste oder Zeichenkette wird verarbeitet</li><li>Codieren und Decodieren ergeben wieder das Original</li><li>mindestens ein Fehlerfall mit verständlicher Meldung</li><li>Startseite, Bedienhinweis und Ergebnisanzeige</li></ul></article>
          <article><span className="eyebrow">BILDUNGSPLAN</span><h3>Diese Bereiche greifen ineinander</h3><ul><li>Variablen, Bedingungen, Schleifen und Unterprogramme</li><li>Codierung und verlustfreie Verarbeitung</li><li>DNS, Adressierung und Routing</li><li>Vigenère, Schlüsselidee und Sicherheitsbewertung</li><li>Modellieren, testen, dokumentieren und präsentieren</li></ul></article>
        </div>

        <div className="milestoneSection"><div className="eyebrow">ARBEITSPLAN</div><h3>Acht Meilensteine mit prüfbarem Ergebnis</h3><ol className="milestoneList">{scratchMilestones.map(([number, title, text]) => <li key={number}><span>{number}</span><div><strong>{title}</strong><p>{text}</p></div></li>)}</ol></div>

        <div className="projectColumns">
          <article className="projectCard"><h3>Abzugeben</h3><ul><li>lauffähige Scratch-Datei oder freigegebener Projektlink</li><li>eine Seite Ablaufdiagramm</li><li>Testtabelle mit Eingabe, Erwartung, Ergebnis und Verbesserung</li><li>kurze Bedienungsanleitung</li><li>Einzelreflexion: eigener Beitrag, größter Fehler, wichtigste Erkenntnis</li></ul></article>
          <article className="projectCard"><h3>Wahl-Erweiterungen</h3><ul><li>zwei alternative Routerwege</li><li>Vigenère mit frei wählbarem Schlüssel</li><li>Prüfsumme und beschädigtes Paket</li><li>mehrsprachige Erklärung</li><li>Punktesystem für korrekt gelöste Netzwerkfehler</li></ul></article>
          <article className="projectCard accent"><h3>Abnahme-Test</h3><p>Ein fremdes Team erhält nur die Bedienungsanleitung. Es muss eine Nachricht senden, einen Fehler provozieren und erklären können, welche Station welche Aufgabe übernimmt.</p></article>
        </div>
      </div>
    </section>

    <section className="projectPhase bluejPhase" id="bluej">
      <div className="shell">
        <div className="phaseHeader">
          <div><span className="phaseNumber">PROJEKT 02</span><div className="toolBadge bluejBadge">BlueJ</div></div>
          <div><div className="eyebrow">JAHR 2 · 7 DOPPELSTUNDEN · TEAMS À 2</div><h2>SmartLibrary: Medien verwalten und ausleihen</h2><p>Die Teams entwickeln eine kleine Java-Anwendung für eine Schulbibliothek. Das Projekt verbindet objektorientierte Modellierung, Arrays oder Listen, Sortierverfahren, Dateien, Tests und eine einfache grafische Oberfläche.</p></div>
        </div>

        <div className="projectBriefGrid">
          <article><span className="eyebrow">AUSGANGSLAGE</span><h3>Der Auftrag</h3><p>Eine Schulbibliothek möchte Medien erfassen, durchsuchen, sortieren, ausleihen und zurücknehmen. Eure Anwendung soll auch bei fehlerhaften Eingaben einen gültigen Zustand behalten und nach einem Neustart gespeicherte Daten wieder laden.</p></article>
          <article><span className="eyebrow">MUSS-KRITERIEN</span><h3>Das muss funktionieren</h3><ul><li>mindestens vier sinnvoll verknüpfte Klassen</li><li>private Attribute und kontrollierte Methoden</li><li>Konstruktoren, Parameter und Rückgabewerte</li><li>Suche sowie selbst implementierte Sortierung</li><li>Datei lesen und schreiben</li><li>grafische Oberfläche mit Eingabe, Buttons, Ausgabe</li></ul></article>
          <article><span className="eyebrow">BILDUNGSPLAN</span><h3>Diese Bereiche greifen ineinander</h3><ul><li>UML, Assoziation, Vererbung und Kapselung</li><li>Referenztypen, Arrays, Methoden und GUI</li><li>Sortieren, Testfälle, Debugger und Logging</li><li>Dateien und Dokumentation von Bibliotheken</li><li>Bezug zu relationalem Datenmodell und Datenschutz</li></ul></article>
        </div>

        <div className="milestoneSection"><div className="eyebrow">ARBEITSPLAN</div><h3>Sieben Meilensteine vom UML-Modell zur Abgabe</h3><ol className="milestoneList">{bluejMilestones.map(([number, title, text]) => <li key={number}><span>{number}</span><div><strong>{title}</strong><p>{text}</p></div></li>)}</ol></div>

        <div className="projectColumns">
          <article className="projectCard"><h3>Verbindliche Tests</h3><ul><li>leerer Bestand und nicht gefundene Suche</li><li>doppelte Kennung</li><li>Ausleihe eines bereits ausgeliehenen Mediums</li><li>leere oder beschädigte Datei</li><li>Sortierung mit gleichen Titeln</li><li>zwei Referenzen auf dasselbe Objekt</li></ul></article>
          <article className="projectCard"><h3>Abzugeben</h3><ul><li>BlueJ-Projekt mit kommentiertem Quellcode</li><li>aktuelles UML-Klassendiagramm</li><li>Anforderungs- und Testtabelle</li><li>Benutzungs- und Entwicklerdokumentation</li><li>fünfminütige Präsentation mit Live-Test</li></ul></article>
          <article className="projectCard accent"><h3>Architektur-Regel</h3><p>Die Oberfläche darf keine Attribute direkt verändern. Sie ruft Methoden der Fachklassen auf. So bleiben Regeln testbar und die Daten auch bei falschen Eingaben konsistent.</p></article>
        </div>
      </div>
    </section>

    <section className="assessmentSection shell">
      <div className="sectionIntro compact"><div><span className="sectionNumber">03</span><span className="eyebrow">TRANSPARENT BEWERTEN</span></div><h2>Gemeinsames Bewertungsraster</h2></div>
      <div className="rubricGrid">
        <article><strong>30 %</strong><h3>Funktion & Korrektheit</h3><p>Muss-Kriterien, sinnvolle Ergebnisse, robuste Fehlerbehandlung</p></article>
        <article><strong>25 %</strong><h3>Informatik-Konzept</h3><p>passendes Modell, Algorithmen, Datenstrukturen und begründete Entscheidungen</p></article>
        <article><strong>20 %</strong><h3>Test & Qualität</h3><p>Randfälle, Fehlerprotokoll, Lesbarkeit, Kommentare und Überarbeitung</p></article>
        <article><strong>15 %</strong><h3>Dokumentation</h3><p>Diagramme, Bedienung, Quellen, Grenzen des Modells</p></article>
        <article><strong>10 %</strong><h3>Präsentation & Team</h3><p>verständliche Vorführung, Aufgabenteilung und individuelle Reflexion</p></article>
      </div>
      <div className="teacherNote"><strong>Hinweis zur Einzelbewertung:</strong> Jede Schülerin und jeder Schüler erklärt in einem kurzen Abnahmegespräch einen selbst bearbeiteten Programmteil und einen Testfall. So bleibt die individuelle Leistung trotz Teamarbeit sichtbar.</div>
    </section>

    <footer><div className="shell"><div className="brand"><span className="brandMark">&lt;/&gt;</span><span>Informatik-Lernlabor</span></div><Link href="/bildungsplan">Zum Zweijahresplan →</Link></div></footer>
  </main>;
}
