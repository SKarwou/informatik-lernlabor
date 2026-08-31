import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Bildungsplan-Check & Zweijahresplan · Informatik-Lernlabor",
  description: "Vollständiger Abgleich aller 63 Teilkompetenzen und ein Unterrichtsplan für zwei Jahre Informatik-Wahlfach.",
  openGraph: { title: "Bildungsplan-Check · Informatik-Lernlabor", description: "Alle 63 Teilkompetenzen sichtbar abgedeckt.", images: [] },
  twitter: { title: "Bildungsplan-Check · Informatik-Lernlabor", description: "Alle 63 Teilkompetenzen sichtbar abgedeckt.", images: [] }
};

const planYearOne = [
  ["2", "Ankommen & Diagnose", "Arbeitsweisen, Vorwissen, erste Algorithmen, Heftführung"],
  ["5", "Zahlensysteme", "Binär, Hexadezimal, Rechnen, Zweierkomplement"],
  ["4", "Fehler & Kompression", "Redundanz, Prüfsumme, RLE, verlustbehaftete Verfahren"],
  ["9", "Strukturierte Programmierung", "Grundbausteine, Typen, Methoden, I/O, Tests, Debugger"],
  ["6", "Arrays & Sortieren", "Arrayalgorithmen, drei Sortierverfahren, Implementierung"],
  ["8", "Projektphase Scratch", "Datenreise: planen, programmieren, testen, präsentieren"],
  ["2", "Sichern & Prüfen", "Lernprodukt, Kompetenzgespräch, Lücken schließen"]
];

const planYearTwo = [
  ["8", "Datenbanken & SQL", "Modellierung, Schlüssel, 3NF, DBMS, Abfragen und Verbund"],
  ["7", "Objektorientierung", "Klassen, Referenzen, Kapselung, Vererbung, UML, GUI"],
  ["6", "Netze & Schaltnetze", "DNS, Routing, lokale Netze, Gatter und Addierer"],
  ["7", "Kryptografie & Datenschutz", "Vigenère, OTP, PKI, HTTPS, Massendaten"],
  ["7", "Projektphase BlueJ", "SmartLibrary: OOP, Arrays, Sortieren, Dateien, GUI"],
  ["1", "Abschluss", "Gesamtrückblick und individuelle Kompetenzbilanz"]
];

const coverage = [
  ["Daten & Codierung", "1–7", "Zahlensysteme; Fehlererkennung und -korrektur; Prüfsummen; Reduktion; Lauflängencodierung; verlustfrei/verlustbehaftet", "01.1 Zahlensysteme · 01.2 Fehler & Kompression", "Lesetext, vollständige Rechnungen, Heftaufgaben, interaktive Kontrollen, Scratch/BlueJ"],
  ["Daten & Codierung", "8–13", "Datenbanksystem, relationales Modell, Schlüssel, ER/UML, dritte Normalform, Arbeit mit DBMS", "01.3 Datenbanken", "Modellierung auf Papier, Beispieldaten, Normalisierung, Java-Objektmodell"],
  ["Daten & Codierung", "14", "SQL-Projektion, Selektion und Tabellenverbund über WHERE", "01.4 SQL", "Abfragen lesen, schreiben, per Hand ausführen und im DBMS prüfen"],
  ["Algorithmen", "1–15", "Grundbausteine, Logik, Variablen, Datentypen, Casts, Strings, Zufall, Methoden, Fehler, Modelle, Bibliotheken, Eingabe und Dateien", "02.1 Strukturierte Programmierung", "Grundlagentext, Schreibtischtests, Struktogramme, BlueJ, Debugger und Datei-Auftrag"],
  ["Algorithmen", "16–19", "Arrays, grundlegende Arrayalgorithmen, Bubble/Selection/Insertion und Laufzeitbeobachtung", "02.2 Arrays & Sortierverfahren", "drei Verfahren händisch, interaktives Sortierlabor, Implementierung und Debugger"],
  ["Algorithmen", "20–30", "Klassen, Referenzen, Methoden, Sichtbarkeit, Kapselung, Konstruktoren, Vererbung, UML, Kommentare, Dokumentation und GUI", "02.3 OOP · Projektphase BlueJ", "UML, Objekttests, Java-Fachklassen, Dokumentation und grafische Oberfläche"],
  ["Rechner & Netze", "1–6", "LAN-Komponenten, Adressierung, DNS, Netzwerksimulation, lokal/global und Routing", "03.1 Rechnernetze", "Schaubilder, Adressaufgaben, Scratch-Simulation und Simulationsauftrag"],
  ["Rechner & Netze", "7–8", "Gatter und Wahrheitstabellen; Halb-, Voll- und Mehrbitaddierer", "03.2 Schaltnetze", "Wahrheitstabellen, Rechnungen, Schaltungsskizzen und interaktiver Gatterbau"],
  ["Gesellschaft & Sicherheit", "1–6", "Vigenère, mono/polyalphabetisch, Angriff, One-Time-Pad, Kerckhoffs und Anwendungen", "04.1 Klassische Kryptografie", "Verschlüsselungsrechnungen, Angriffsskizze, Sicherheitsvergleich, Scratch-Encoder"],
  ["Gesellschaft & Sicherheit", "7–9", "asymmetrische Idee, Vergleich mit symmetrischen Verfahren und PKI", "04.2 Moderne Kryptografie", "Schlüsselrollen, HTTPS-Flussbild, Zertifikatsprüfung und Protokollsimulation"],
  ["Gesellschaft & Sicherheit", "10–11", "Maßnahmen für Datenschutz/Datensicherheit und Bewertung massenhafter Datenverarbeitung", "04.3 Datenschutz", "Schutzziele, Datensparsamkeit, Risikomatrix und kriteriengeleitetes Urteil"]
];

export default function CurriculumPage() {
  return <main>
    <nav className="nav shell" aria-label="Hauptnavigation">
      <Link className="brand" href="/"><span className="brandMark">&lt;/&gt;</span><span>Informatik-Lernlabor</span></Link>
      <div className="navLinks"><Link href="/projekte">Projektphasen</Link><Link href="/#themen">Kapitel</Link></div>
    </nav>

    <header className="subpageHero shell curriculumHero">
      <div className="eyebrow">GRÜNDLICH GEPRÜFT · STAND AUGUST 2026</div>
      <h1>Der Bildungsplan ist <em>vollständig abgedeckt.</em></h1>
      <p>Alle 63 inhaltsbezogenen Teilkompetenzen des baden-württembergischen Schulversuchs „Informatik – Wahlfach in der Oberstufe“ sind einem Kapitel, einer Übungsform und einer überprüfbaren Schülerleistung zugeordnet.</p>
      <div className="auditStats"><div><strong>63</strong><span>Teilkompetenzen</span></div><div><strong>72</strong><span>Doppelstunden</span></div><div><strong>12</strong><span>Kapitel</span></div><div><strong>2</strong><span>Projektphasen</span></div></div>
      <p className="sourceNote">Grundlage: offizieller <a href="https://www.bildungsplaene-bw.de/BP2016BW_ALLG_GYM_INFWFO" target="_blank" rel="noreferrer">Bildungsplan Baden-Württemberg ↗</a>. Die Zeiteinteilung rechnet mit ungefähr 36 Unterrichtswochen pro Schuljahr und zwei Unterrichtsstunden pro Woche.</p>
    </header>

    <section className="scheduleSection">
      <div className="shell">
        <div className="sectionIntro"><div><span className="sectionNumber">01</span><span className="eyebrow">ZWEIJAHRESPLAN</span></div><h2>72 Doppelstunden mit Übungszeit</h2><p>Die Verteilung enthält bewusst Wiederholung, Papierarbeit, Programmierung und Projektzeit. Sie ist kein enges Lesepensum, sondern ein Vorschlag für ungefähr 144 Unterrichtsstunden à 45 Minuten.</p></div>
        <div className="yearGrid">
          <article><div className="yearTop"><span>JAHR 1</span><strong>36 Doppelstunden</strong></div><h3>Grundlagen und strukturierte Programme</h3><ol>{planYearOne.map(([blocks, title, detail]) => <li key={title}><b>{blocks}</b><div><strong>{title}</strong><span>{detail}</span></div></li>)}</ol></article>
          <article><div className="yearTop"><span>JAHR 2</span><strong>36 Doppelstunden</strong></div><h3>Systeme, OOP und verantwortliche Nutzung</h3><ol>{planYearTwo.map(([blocks, title, detail]) => <li key={title}><b>{blocks}</b><div><strong>{title}</strong><span>{detail}</span></div></li>)}</ol></article>
        </div>
        <div className="lessonRhythm"><strong>Empfohlener Rhythmus einer Doppelstunde:</strong><span>10 Min Rückblick</span><i>→</i><span>20 Min Erklärung</span><i>→</i><span>35 Min angeleitet üben</span><i>→</i><span>20 Min selbstständig anwenden</span><i>→</i><span>5 Min Merksatz & Ausblick</span></div>
      </div>
    </section>

    <section className="coverageSection shell">
      <div className="sectionIntro"><div><span className="sectionNumber">02</span><span className="eyebrow">INHALTSKONTROLLE</span></div><h2>Jede Kompetenz hat einen Lernort</h2><p>Die Nummern entsprechen den Teilkompetenzen innerhalb des jeweiligen offiziellen Inhaltsbereichs. Zusammen ergeben 14 + 30 + 8 + 11 genau 63.</p></div>
      <div className="coverageTableWrap"><table className="coverageTable"><thead><tr><th>Bereich</th><th>Nr.</th><th>Offizieller Kompetenzkern</th><th>Kapitel / Projekt</th><th>Nachweis im Lernlabor</th></tr></thead><tbody>{coverage.map((row) => <tr key={`${row[0]}-${row[1]}`}>{row.map((cell, index) => <td key={index}>{cell}</td>)}</tr>)}</tbody></table></div>
      <div className="coverageLegend"><span><b>14</b>Daten & Codierung</span><span><b>30</b>Algorithmen</span><span><b>8</b>Rechner & Netze</span><span><b>11</b>Gesellschaft & Sicherheit</span><strong>= 63 vollständig zugeordnet</strong></div>
    </section>

    <section className="processSection">
      <div className="shell">
        <div className="sectionIntro"><div><span className="sectionNumber">03</span><span className="eyebrow">PROZESSKOMPETENZEN</span></div><h2>Nicht nur Stoff abhaken</h2><p>Verstehen zeigt sich erst im Tun. Die vier prozessbezogenen Kompetenzbereiche werden deshalb in jedem größeren Lernabschnitt mehrfach sichtbar gemacht.</p></div>
        <div className="processGrid">
          <article><span>2.1</span><h3>Strukturieren & Vernetzen</h3><p>Begriffsnetze, Datenmodelle, Zerlegung in Teilprobleme, Schnittstellen, UML und Projektmeilensteine.</p><strong>Nachweis: Modell oder Plan mit begründeten Beziehungen</strong></article>
          <article><span>2.2</span><h3>Modellieren & Implementieren</h3><p>Anforderungen, Testfälle, geeignete Modelle, Code, Bibliotheken, Debugger und Vergleich mit der Realität.</p><strong>Nachweis: funktionierendes und getestetes Programm</strong></article>
          <article><span>2.3</span><h3>Kommunizieren & Kooperieren</h3><p>Fachsprache, Diagramme, Codekommentare, Dokumentation, Teamrollen, Datenschutz und sichere Kommunikation.</p><strong>Nachweis: Erklärung, Dokumentation und Teamreflexion</strong></article>
          <article><span>2.4</span><h3>Analysieren & Bewerten</h3><p>Black-/White-Box-Sicht, Lösungsvergleich, Modellgrenzen, Optimierung, Folgen und ethische Kriterien.</p><strong>Nachweis: kriteriengeleitetes Urteil oder Verbesserungsbericht</strong></article>
        </div>
      </div>
    </section>

    <section className="understandingSection shell">
      <div className="sectionIntro compact"><div><span className="sectionNumber">04</span><span className="eyebrow">VERSTEHEN SICHERN</span></div><h2>Fünf Begegnungen mit jedem Kerninhalt</h2></div>
      <div className="understandingFlow">
        <article><span>1</span><h3>Lesen</h3><p>ausführlicher Einstieg ohne vorausgesetzte Fachsprache</p></article>
        <article><span>2</span><h3>Sehen</h3><p>Schaubild, Skizze oder Ablaufdiagramm</p></article>
        <article><span>3</span><h3>Nachvollziehen</h3><p>vollständig gelöstes Beispiel mit Begründung</p></article>
        <article><span>4</span><h3>Selbst bearbeiten</h3><p>Heft-, Rechen-, Modell- und interaktive Aufgaben</p></article>
        <article><span>5</span><h3>Anwenden</h3><p>Scratch, BlueJ, Simulation oder Projektprodukt</p></article>
      </div>
      <div className="auditConclusion"><div><span>ERGEBNIS DER PRÜFUNG</span><h3>Inhaltlich vollständig – mit realistischem Lernweg.</h3></div><p>Alle offiziellen Inhalte sind bearbeitbar. Die zusätzliche Projekt- und Wiederholungszeit sorgt dafür, dass Kompetenzen nicht nur gelesen, sondern erklärt, schriftlich geübt, programmiert, getestet und übertragen werden. Für eine konkrete Lerngruppe sollten Diagnoseergebnisse und Schulveranstaltungen weiterhin zu kleinen Verschiebungen führen.</p><Link className="primaryButton" href="/projekte">Projektphasen öffnen <span>→</span></Link></div>
    </section>

    <footer><div className="shell"><div className="brand"><span className="brandMark">&lt;/&gt;</span><span>Informatik-Lernlabor</span></div><Link href="/#themen">Zu allen Kapiteln →</Link></div></footer>
  </main>;
}
