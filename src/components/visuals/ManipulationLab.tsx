import { useId, useReducer, useState } from "react";
import type { DragEvent } from "react";
import { EXTRA_MANIPULATION_CONFIGS, MANIPULATION_GUIDES } from "./ManipulationRounds";
import "./ManipulationLab.css";

export type ManipulationCard = { id: string; text: string; explanation: string };
type ManipulationBase = {
  slug: string; title: string; context: string; instruction: string; hint: string;
  takeaway: string; cards: readonly ManipulationCard[];
};
export type ReorderManipulationConfig = ManipulationBase & {
  mode: "reorder"; initialOrder: readonly string[]; correctOrder: readonly string[];
};
export type ClassifyManipulationConfig = ManipulationBase & {
  mode: "classify"; categories: readonly { id: string; label: string; description: string }[];
  answers: Readonly<Record<string, string>>;
};
export type ManipulationConfig = ReorderManipulationConfig | ClassifyManipulationConfig;

// These are new, public teaching examples. They contain no answers from the
// separately protected paper exercises and never read their solution payloads.
export const MANIPULATION_CONFIGS: Readonly<Record<string, ManipulationConfig>> = {
  zahlensysteme: {
    slug: "zahlensysteme", mode: "reorder", title: "Vier Binärzahlen auf dem Zahlenstrahl",
    context: "Ein Zähler zeigt vier verschiedene Messwerte als Bitmuster an. Alle Muster sind vorzeichenlose 4-Bit-Zahlen: Es gibt hier kein negatives Vorzeichen.",
    instruction: "Ordne die vier Werte aufsteigend: oben der kleinste, unten der größte Wert. Denke zunächst selbst nach, verschiebe dann die Karten und prüfe deine Reihenfolge.",
    hint: "Von links nach rechts haben die Stellen die Werte 8, 4, 2 und 1. Addiere nur die Stellen mit einer 1. Alternativ vergleichst du zwei Muster von links bis zur ersten unterschiedlichen Stelle.",
    takeaway: "Eine führende 0 ändert den Zahlenwert nicht. Bei gleich langen vorzeichenlosen Binärzahlen entscheidet die erste unterschiedliche Stelle von links.",
    cards: [
      { id: "b2", text: "0010₂", explanation: "Nur die 2er-Stelle ist eingeschaltet: 0·8 + 0·4 + 1·2 + 0·1 = 2." },
      { id: "b5", text: "0101₂", explanation: "Die 4er- und die 1er-Stelle sind eingeschaltet: 4 + 1 = 5." },
      { id: "b9", text: "1001₂", explanation: "Die 8er- und die 1er-Stelle sind eingeschaltet: 8 + 1 = 9." },
      { id: "b12", text: "1100₂", explanation: "Die 8er- und die 4er-Stelle sind eingeschaltet: 8 + 4 = 12." },
    ], initialOrder: ["b9", "b2", "b12", "b5"], correctOrder: ["b2", "b5", "b9", "b12"],
  },
  "fehler-kompression": {
    slug: "fehler-kompression", mode: "classify", title: "Gerade oder ungerade Parität?",
    context: "Ein Übertragungsmodell betrachtet jeweils ein vollständiges 4-Bit-Wort einschließlich eines möglichen Prüfbits. Zähle in jedem Wort die Einsen. Wir prüfen hier nur die Parität, nicht die Fehlerfreiheit einer Nachricht.",
    instruction: "Lege jedes vollständige Bitwort in die passende Gruppe. Bei gerader Parität muss die Gesamtzahl der Einsen gerade sein.",
    hint: "Gerade Anzahlen sind 0, 2 und 4; ungerade Anzahlen sind 1 und 3. Die Positionen der Einsen spielen für diese Prüfung keine Rolle.",
    takeaway: "Eine passende Parität beweist keine fehlerfreie Übertragung: Eine gerade Anzahl gekippter Bits kann unentdeckt bleiben. Ein gekipptes Bit ändert dagegen die Parität.",
    categories: [
      { id: "even", label: "Gerade Anzahl Einsen", description: "Das vollständige Wort hat 0, 2 oder 4 Einsen." },
      { id: "odd", label: "Ungerade Anzahl Einsen", description: "Das vollständige Wort hat 1 oder 3 Einsen." },
    ],
    cards: [
      { id: "p1", text: "0101", explanation: "Zwei Einsen: 2 ist gerade." },
      { id: "p2", text: "1000", explanation: "Eine Eins: 1 ist ungerade." },
      { id: "p3", text: "1111", explanation: "Vier Einsen: 4 ist gerade." },
      { id: "p4", text: "0111", explanation: "Drei Einsen: 3 ist ungerade." },
    ], answers: { p1: "even", p2: "odd", p3: "even", p4: "odd" },
  },
  datenbanken: {
    slug: "datenbanken", mode: "classify", title: "Welche Aufgabe hat diese Spalte?",
    context: "Unser kleines Hörbuchmodell hat zwei Tabellen: AUTOR(autor_id, name) und WERK(werk_id, autor_id, titel). AUTOR.autor_id und WERK.werk_id sind die festgelegten Primärschlüssel. Jedes Werk verweist über WERK.autor_id auf genau einen Autor. Mehrere Werke dürfen denselben Autor haben; Gemeinschaftswerke lassen wir im Modell weg.",
    instruction: "Ordne jede vollständig bezeichnete Spalte ihrer Rolle in genau dieser Tabelle zu. Gleiche Spaltennamen bedeuten nicht automatisch die gleiche Rolle.",
    hint: "Frage zuerst: Identifiziert die Spalte eine Zeile ihrer eigenen Tabelle? Oder verweist sie auf eine Zeile einer anderen Tabelle? Name und Titel sind hier weder Schlüssel noch eindeutig vorgeschrieben.",
    takeaway: "AUTOR.autor_id identifiziert einen Autor. WERK.autor_id stellt den Bezug zu ihm her und darf mehrfach vorkommen. Die Tabellenangabe vor dem Punkt verhindert Verwechslungen.",
    categories: [
      { id: "pk", label: "Primärschlüssel", description: "Identifiziert die Zeile der eigenen Tabelle." },
      { id: "fk", label: "Fremdschlüssel", description: "Verweist hier auf einen Autor in AUTOR." },
      { id: "value", label: "Beschreibende Spalte", description: "Ist in diesem Modell kein Schlüssel." },
    ],
    cards: [
      { id: "d1", text: "WERK.titel", explanation: "Der Titel beschreibt das Werk. Zwei Werke könnten denselben Titel tragen." },
      { id: "d2", text: "AUTOR.autor_id", explanation: "Der festgelegte Primärschlüssel identifiziert eine Zeile in AUTOR eindeutig." },
      { id: "d3", text: "WERK.autor_id", explanation: "Der Fremdschlüssel verweist auf AUTOR.autor_id. Bei mehreren Werken eines Autors wiederholt sich sein Wert." },
      { id: "d4", text: "AUTOR.name", explanation: "Der Name beschreibt den Autor. Verschiedene Personen können denselben Namen haben." },
      { id: "d5", text: "WERK.werk_id", explanation: "Der festgelegte Primärschlüssel identifiziert eine Zeile in WERK eindeutig." },
    ], answers: { d1: "value", d2: "pk", d3: "fk", d4: "value", d5: "pk" },
  },
  sql: {
    slug: "sql", mode: "reorder", title: "Schreibe eine lesbare SQL-Abfrage",
    context: "Die Tabelle SNACK enthält die Spalten name und preis_cent. Gesucht sind die Namen und Preise aller Snacks unter 250 Cent, nach Preis aufsteigend und bei gleichem Preis nach Name sortiert. Es geht um die geschriebene Reihenfolge der SQL-Klauseln, nicht um die interne Verarbeitung.",
    instruction: "Baue mit allen vier Karten genau eine Abfrage. Ganz oben steht die erste geschriebene Zeile. Der Strichpunkt auf der letzten Karte beendet die Abfrage.",
    hint: "Geschrieben beginnt die Abfrage mit SELECT. Danach folgen die Datenquelle, die Bedingung für einzelne Zeilen und zuletzt die Sortierregel. Das ist nicht die logische Verarbeitungsreihenfolge FROM → WHERE → SELECT → ORDER BY dieses einfachen Beispiels.",
    takeaway: "SELECT benennt die ausgegebenen Spalten; FROM die Tabelle; WHERE filtert Zeilen; ORDER BY sortiert das Ergebnis. Die geschriebene Reihenfolge ist nicht der Ablaufplan des Datenbanksystems.",
    cards: [
      { id: "q1", text: "SELECT name, preis_cent", explanation: "Zuerst steht schriftlich SELECT mit den gewünschten Ausgabespalten." },
      { id: "q2", text: "FROM SNACK", explanation: "FROM benennt die Datenquelle SNACK." },
      { id: "q3", text: "WHERE preis_cent < 250", explanation: "WHERE lässt nur Zeilen mit einem Preis unter 250 Cent zu. Genau 250 Cent erfüllt die Bedingung nicht." },
      { id: "q4", text: "ORDER BY preis_cent ASC, name ASC;", explanation: "ORDER BY sortiert zuerst nach dem Preis, bei Gleichstand nach dem Namen. ASC bedeutet aufsteigend." },
    ], initialOrder: ["q3", "q1", "q4", "q2"], correctOrder: ["q1", "q2", "q3", "q4"],
  },
  programmierung: {
    slug: "programmierung", mode: "reorder", title: "Vom Getränkebon zur Anzeige",
    context: "Ein vereinfachtes Programm rechnet einen Betrag in Cent aus: drei Getränke zu je 120 Cent, danach einmal 50 Cent Rabatt auf die gesamte Bestellung. Jede Größe muss einen Wert haben, bevor eine spätere Zeile ihn benutzt. Die Karten sind Pseudocode, keine bestimmte Programmiersprache.",
    instruction: "Ordne alle Schritte so, dass keine Größe vor ihrer Festlegung verwendet wird und am Ende der rabattierte Betrag erscheint. Die Anzeige gehört ganz ans Ende.",
    hint: "Zuerst brauchst du anzahl. Daraus entsteht zwischenbetrag. Erst daraus kannst du zahlbetrag berechnen und anschließend anzeigen. Rechne zur Kontrolle 3 · 120 − 50.",
    takeaway: "Die Reihenfolge ist wegen der Datenabhängigkeiten wichtig: anzahl → zwischenbetrag → zahlbetrag → Ausgabe. Das Ergebnis sind 310 Cent, also 3,10 Euro.",
    cards: [
      { id: "v1", text: "Setze anzahl auf 3.", explanation: "Die Anzahl wird festgelegt, bevor die nächste Zeile sie verwendet." },
      { id: "v2", text: "Setze zwischenbetrag auf anzahl · 120.", explanation: "Mit anzahl = 3 ergibt sich zwischenbetrag = 360 Cent." },
      { id: "v3", text: "Setze zahlbetrag auf zwischenbetrag − 50.", explanation: "Der einmalige Rabatt wird vom ganzen Zwischenbetrag abgezogen: 360 − 50 = 310 Cent." },
      { id: "v4", text: "Zeige zahlbetrag in Cent an.", explanation: "Erst jetzt existiert der endgültige Betrag. Angezeigt wird 310." },
    ], initialOrder: ["v3", "v1", "v4", "v2"], correctOrder: ["v1", "v2", "v3", "v4"],
  },
  sortieren: {
    slug: "sortieren", mode: "reorder", title: "Ein vollständiger Bubble-Sort-Durchlauf",
    context: "Unsere Liste startet mit [8, 5, 3, 1]. Ein Bubble-Sort-Durchlauf vergleicht benachbarte Werte von links nach rechts: zuerst Plätze 1/2, dann 2/3, dann 3/4. Getauscht wird genau dann, wenn der linke Wert größer ist.",
    instruction: "Ordne die vier Momentaufnahmen zeitlich: Start, Zustand nach dem ersten, nach dem zweiten und nach dem dritten Vergleich. Es geht nur um einen Durchlauf, nicht um die vollständige Sortierung.",
    hint: "Die 8 ist anfangs größer als ihr rechter Nachbar und wandert bei jedem dieser drei Vergleiche um genau einen Platz nach rechts. Andere Paare werden in diesem Durchlauf nicht zusätzlich verglichen.",
    takeaway: "Nach diesem Durchlauf steht die größte Zahl 8 ganz rechts. [5, 3, 1, 8] ist trotzdem noch nicht vollständig sortiert; dafür sind weitere Durchläufe nötig.",
    cards: [
      { id: "s1", text: "[8, 5, 3, 1]", explanation: "Das ist die vorgegebene Startliste; noch wurde kein Paar verglichen." },
      { id: "s2", text: "[5, 8, 3, 1]", explanation: "Vergleich der Plätze 1/2: 8 > 5, daher werden 8 und 5 getauscht." },
      { id: "s3", text: "[5, 3, 8, 1]", explanation: "Vergleich der Plätze 2/3: 8 > 3, daher werden 8 und 3 getauscht." },
      { id: "s4", text: "[5, 3, 1, 8]", explanation: "Vergleich der Plätze 3/4: 8 > 1, daher werden 8 und 1 getauscht. Ein Durchlauf ist beendet." },
    ], initialOrder: ["s3", "s1", "s4", "s2"], correctOrder: ["s1", "s2", "s3", "s4"],
  },
  oop: {
    slug: "oop", mode: "classify", title: "Bauplan, Objekt oder Aktion?",
    context: "Im Modell gibt es die Klasse LeihRad mit dem Attribut kilometer und der Methode fahre(strecke). Die Variablen radA und radB verweisen auf zwei verschiedene Objekte dieser Klasse. Die Methode erhöht den Kilometerstand des jeweils angesprochenen Objekts.",
    instruction: "Unterscheide Beschreibungen des Bauplans, Beschreibungen konkreter Objekte und Aufrufe einer Methode. Die Karten beschreiben genau diese Rollen, nicht drei verschiedene Programmiersprachen.",
    hint: "Eine Klasse beschreibt, was alle ihre Objekte besitzen und können. Ein Objekt ist ein konkretes Exemplar mit eigenen Werten. Bei radA.fahre(2) steht links vom Punkt, welches Objekt die Aktion ausführt.",
    takeaway: "Zwei Objekte können zur gleichen Klasse gehören und trotzdem verschiedene Kilometerstände haben. Ein Methodenaufruf auf radA verändert in diesem Modell nicht automatisch radB.",
    categories: [
      { id: "class", label: "Klasse / Bauplan", description: "Legt Attribute und Methoden für Exemplare fest." },
      { id: "object", label: "Konkretes Objekt", description: "Ein bestimmtes Exemplar mit eigenen Werten." },
      { id: "call", label: "Methodenaufruf", description: "Fordert ein bestimmtes Objekt zu einer Aktion auf." },
    ],
    cards: [
      { id: "o1", text: "Die Klasse LeihRad legt kilometer und fahre(strecke) fest.", explanation: "Die Klasse ist der gemeinsame Bauplan, noch kein bestimmtes Fahrrad." },
      { id: "o2", text: "Das Objekt hinter radA hat kilometer = 12.", explanation: "Beschrieben wird ein einzelnes Objekt mit einem konkreten Attributwert." },
      { id: "o3", text: "radB.fahre(4)", explanation: "Der Aufruf fordert genau das Objekt hinter radB auf, seine Methode mit dem Argument 4 auszuführen." },
      { id: "o4", text: "Das andere Objekt hinter radB hat kilometer = 7.", explanation: "radB verweist laut Modell auf ein eigenes Objekt, nicht auf dasselbe Objekt wie radA." },
      { id: "o5", text: "radA.fahre(2)", explanation: "Die Methode wird am Objekt hinter radA mit dem Argument 2 aufgerufen." },
    ], answers: { o1: "class", o2: "object", o3: "call", o4: "object", o5: "call" },
  },
  netzwerke: {
    slug: "netzwerke", mode: "reorder", title: "Eine Website zum ersten Mal öffnen",
    context: "Vereinfachtes Modell: Der Browser kennt die IP-Adresse noch nicht. Es gibt keinen DNS-Cache, keine bestehende Verbindung und keine vorab gesendeten Anwendungsdaten. Für diesen Aufruf wird HTTPS mit HTTP/1.1 über TCP und TLS verwendet. Andere Varianten, etwa HTTP/3, sind nicht gemeint.",
    instruction: "Ordne die sechs Stationen zeitlich. DNS liefert die Zuordnung des Namens zur IP-Adresse. Erst nach dem sicheren Verbindungsaufbau fordert der Browser hier die Seite an.",
    hint: "Zuerst muss der Browser erfahren, wohin er sich verbinden soll. Danach folgen TCP-Verbindung, TLS-Handshake und schließlich HTTP-Anfrage und HTTP-Antwort über die gesicherte Verbindung.",
    takeaway: "DNS, TCP, TLS und HTTP haben verschiedene Aufgaben. DNS liefert hier eine Adresse, TCP die Verbindung, TLS schützt die Übertragung, und HTTP beschreibt Anfrage und Antwort. Das Modell ist keine Beschreibung aller möglichen Browseroptimierungen.",
    cards: [
      { id: "n1", text: "Der Browser lässt den Domainnamen per DNS auflösen.", explanation: "Ohne bekannten Adresseintrag wird zunächst die Namensauflösung angestoßen." },
      { id: "n2", text: "Die DNS-Antwort liefert die passende IP-Adresse.", explanation: "Jetzt kennt der Browser die Adresse für den vorgesehenen Verbindungsaufbau. DNS liefert nicht den Inhalt der Website." },
      { id: "n3", text: "Eine TCP-Verbindung zum Webserver wird aufgebaut.", explanation: "In diesem ausdrücklich gewählten HTTP/1.1-Modell baut TCP zunächst die Transportverbindung auf." },
      { id: "n4", text: "Der TLS-Handshake wird erfolgreich abgeschlossen.", explanation: "Beim Handshake werden unter anderem die Serverauthentifizierung geprüft und Schlüssel für geschützte Anwendungsdaten vereinbart." },
      { id: "n5", text: "Der Browser sendet die HTTP-Anfrage für die Seite geschützt über TLS.", explanation: "In diesem Modell ohne vorab gesendete Anwendungsdaten folgt die Seitenanfrage auf den abgeschlossenen TLS-Handshake." },
      { id: "n6", text: "Der Webserver sendet die HTTP-Antwort geschützt über TLS zurück.", explanation: "Die Antwort folgt auf die Anfrage und enthält hier die angeforderte Seite." },
    ], initialOrder: ["n5", "n2", "n4", "n1", "n6", "n3"], correctOrder: ["n1", "n2", "n3", "n4", "n5", "n6"],
  },
  schaltnetze: {
    slug: "schaltnetze", mode: "classify", title: "Welche Leitung führt eine 1?",
    context: "Jede Karte benennt genau ein Ausgangssignal. AND bedeutet UND, OR bedeutet ODER und XOR bedeutet exklusives ODER. Beim Halbaddierer sind das Summenbit S und der Übertrag C zwei verschiedene Ausgänge.",
    instruction: "Lege jede Karte zum Wert ihres ausdrücklich genannten Ausgangs. Beim Halbaddierer musst du deshalb genau lesen: Wird nach S oder nach C gefragt?",
    hint: "AND liefert nur bei zwei Einsen eine 1. OR liefert bei mindestens einer Eins eine 1. XOR liefert bei genau einer Eins eine 1. NOT kehrt sein einziges Eingangsbit um. Beim Halbaddierer gilt S = A XOR B und C = A AND B.",
    takeaway: "Der Halbaddierer berechnet für A = 1 und B = 1 das zweistellige Binärergebnis CS = 10₂. Das Summenbit ist 0; der Übertrag ist 1. Das sind nicht zwei widersprüchliche Antworten.",
    categories: [
      { id: "zero", label: "Ausgang = 0", description: "Das auf der Karte genannte Signal hat den Wert 0." },
      { id: "one", label: "Ausgang = 1", description: "Das auf der Karte genannte Signal hat den Wert 1." },
    ],
    cards: [
      { id: "g1", text: "AND: A = 1, B = 0", explanation: "Nicht beide Eingänge sind 1. AND liefert 0." },
      { id: "g2", text: "OR: A = 1, B = 0", explanation: "Mindestens ein Eingang ist 1. OR liefert 1." },
      { id: "g3", text: "NOT: Eingang A = 0", explanation: "NOT kehrt 0 zu 1 um." },
      { id: "g4", text: "XOR: A = 1, B = 1", explanation: "Zwei Einsen sind nicht genau eine Eins. XOR liefert 0." },
      { id: "g5", text: "Halbaddierer: Summenbit S bei A = 1, B = 1", explanation: "S = A XOR B = 0; dieses Bit steht im Ergebnis 10₂ rechts." },
      { id: "g6", text: "Halbaddierer: Übertrag C bei A = 1, B = 1", explanation: "C = A AND B = 1; dieses Bit steht im Ergebnis 10₂ links." },
    ], answers: { g1: "zero", g2: "one", g3: "one", g4: "zero", g5: "zero", g6: "one" },
  },
  "klassische-kryptografie": {
    slug: "klassische-kryptografie", mode: "classify", title: "Prüfe eine Caesar-Geheimschrift",
    context: "Unser Alphabet besteht genau aus A bis Z, ohne Umlaute oder Leerzeichen. Verschlüsselt wird mit Caesar um +3: drei Buchstaben im Alphabet vorwärts; nach Z geht es mit A weiter. Die Pfeile zeigen Klartext → Geheimtext.",
    instruction: "Ordne die behaupteten Buchstabenpaare zu: Passt der rechte Buchstabe wirklich zur Verschiebung +3 oder nicht? Es geht um Verschlüsseln, nicht um Entschlüsseln.",
    hint: "Zähle drei Schritte, nicht den Startbuchstaben: A → B ist der erste Schritt. Am Alphabetende geht es zum Anfang zurück. Eine Caesar-Verschiebung benutzt für jeden Buchstaben dieselbe Schrittzahl.",
    takeaway: "Für +3 werden X, Y und Z zu A, B und C. Caesar ist ein Lernmodell, aber kein sicherer Schutz für heutige vertrauliche Nachrichten.",
    categories: [
      { id: "yes", label: "Passt zu Caesar +3", description: "Der Geheimtext liegt genau drei Schritte vorwärts." },
      { id: "no", label: "Passt nicht zu Caesar +3", description: "Die angegebene Verschiebung ist eine andere." },
    ],
    cards: [
      { id: "c1", text: "A → D", explanation: "A → B → C → D sind drei Schritte: passt." },
      { id: "c2", text: "X → A", explanation: "X → Y → Z → A sind drei Schritte mit Umlauf: passt." },
      { id: "c3", text: "C → G", explanation: "C → G sind vier Schritte. Bei +3 müsste C → F stehen." },
      { id: "c4", text: "H → J", explanation: "H → J sind zwei Schritte. Bei +3 müsste H → K stehen." },
      { id: "c5", text: "Z → C", explanation: "Z → A → B → C sind drei Schritte mit Umlauf: passt." },
      { id: "c6", text: "Y → C", explanation: "Y → C sind vier Schritte. Bei +3 müsste Y → B stehen." },
    ], answers: { c1: "yes", c2: "yes", c3: "no", c4: "no", c5: "yes", c6: "no" },
  },
  "moderne-kryptografie": {
    slug: "moderne-kryptografie", mode: "reorder", title: "Eine digitale Signatur überprüfen",
    context: "Mira verschickt einen fertigen Projektbericht. Das Signaturverfahren ist korrekt eingesetzt; ihr privater Schlüssel ist geheim geblieben. Noah hat Miras echten öffentlichen Prüfschlüssel bereits auf vertrauenswürdigem Weg erhalten. Wir betrachten einen erfolgreichen Ablauf mit unverändertem Bericht.",
    instruction: "Ordne den Ablauf von der Erzeugung einer Signatur bis zum Prüfergebnis. Dokument und Signatur werden gemeinsam übertragen. Die Signatur verschlüsselt den Bericht nicht.",
    hint: "Zuerst muss die Signatur existieren. Dann können Bericht und Signatur versendet werden. Noah kann erst nach dem Empfang prüfen und erst nach dieser Prüfung ein Ergebnis feststellen.",
    takeaway: "Eine erfolgreiche Prüfung belegt unter diesen Voraussetzungen die Übereinstimmung von Dokument, Signatur und öffentlichem Schlüssel. Sie schützt Integrität und unterstützt die Prüfung der Herkunft, aber schafft keine Vertraulichkeit des Berichts.",
    cards: [
      { id: "k1", text: "Mira erzeugt mit ihrem privaten Signaturschlüssel eine Signatur zum fertigen Bericht.", explanation: "Die Signatur hängt vom Dokument und vom privaten Signaturschlüssel ab. Der private Schlüssel wird dabei nicht mitgeschickt." },
      { id: "k2", text: "Mira sendet den Bericht zusammen mit der Signatur an Noah.", explanation: "Für die anschließende Prüfung braucht Noah das Dokument und die zugehörige Signatur." },
      { id: "k3", text: "Noah prüft die empfangene Signatur zum Bericht mit Miras vertrauenswürdigem öffentlichen Schlüssel.", explanation: "Zum Prüfen benutzt Noah den öffentlichen Schlüssel, nicht Miras privaten Schlüssel. Der echte Schlüssel wurde laut Voraussetzung bereits abgesichert." },
      { id: "k4", text: "Die Prüfung meldet: gültig für dieses Dokument und diesen öffentlichen Schlüssel.", explanation: "Das ist das Ergebnis des angenommenen erfolgreichen Ablaufs. Eine Änderung am Dokument würde bei einem sicheren Verfahren mit überwältigender Wahrscheinlichkeit zur ungültigen Prüfung führen." },
    ], initialOrder: ["k3", "k1", "k4", "k2"], correctOrder: ["k1", "k2", "k3", "k4"],
  },
  datenschutz: {
    slug: "datenschutz", mode: "classify", title: "Was muss diese Umfrage wirklich wissen?",
    context: "Für ein Schulfest soll ausschließlich gezählt werden, welches Spiel die Teilnehmenden wünschen. Es gibt keine Gewinne, Rückfragen, Altersgruppen-Auswertung oder Identitätsprüfung. Die Abstimmung soll ohne Namen und Kontaktdaten auskommen. Wir bewerten nur, welche Angaben für diesen festgelegten Zweck erforderlich sind.",
    instruction: "Ordne die vorgeschlagenen Formularfelder zu. Frage nicht, ob eine Angabe interessant sein könnte, sondern ob sie für das bloße Zählen der Spielwünsche nötig ist.",
    hint: "Um die Wünsche zu zählen, muss das Programm die gewählte Spieloption kennen. Überlege bei jeder weiteren Angabe, welchen notwendigen Beitrag sie zu genau diesem Ergebnis leistet.",
    takeaway: "Datenminimierung beginnt beim Zweck. Für dieses Modell genügt die Spielwahl; private Zusatzangaben sind dafür nicht erforderlich. Eine echte anonyme Website muss zusätzlich technische Daten wie Protokolle und Kennungen berücksichtigen.",
    categories: [
      { id: "needed", label: "Für diesen Zweck nötig", description: "Wird zum Zählen der gewählten Spiele gebraucht." },
      { id: "extra", label: "Für diesen Zweck nicht nötig", description: "Trägt nichts Notwendiges zur festgelegten Zählung bei." },
    ],
    cards: [
      { id: "t1", text: "Ausgewähltes Spiel", explanation: "Ohne diese Angabe lässt sich nicht zählen, welches Spiel gewünscht wird." },
      { id: "t2", text: "Private Wohnadresse", explanation: "Eine postalische Anschrift wird für das bloße Zählen von Spielwünschen nicht gebraucht." },
      { id: "t3", text: "Handynummer", explanation: "Es sind keine Rückfragen oder Benachrichtigungen vorgesehen; die Nummer ist für den festgelegten Zweck nicht erforderlich." },
      { id: "t4", text: "Genaues Geburtsdatum", explanation: "Eine Altersauswertung ist ausdrücklich nicht Teil des Zwecks. Das genaue Geburtsdatum wird daher nicht gebraucht." },
    ], answers: { t1: "needed", t2: "extra", t3: "extra", t4: "extra" },
  },
};

export type ManipulationArrangement = { order: string[]; assignments: Record<string, string | null> };
export type ManipulationCheck = { complete: boolean; correct: boolean; correctCount: number; total: number; message: string };
export type ManipulationState = ManipulationArrangement & {
  selectedId: string | null; history: ManipulationArrangement[]; feedback: ManipulationCheck | null;
  hintOpen: boolean; solutionOpen: boolean; announcement: string;
};
export type ManipulationAction =
  | { type: "select"; cardId: string }
  | { type: "move"; cardId: string; toIndex: number }
  | { type: "assign"; cardId: string; categoryId: string | null }
  | { type: "undo" } | { type: "reset" } | { type: "check" } | { type: "hint" } | { type: "solution" };

export function createManipulationState(config: ManipulationConfig): ManipulationState {
  return {
    order: config.mode === "reorder" ? [...config.initialOrder] : config.cards.map(card => card.id),
    assignments: Object.fromEntries(config.cards.map(card => [card.id, null])), selectedId: null,
    history: [], feedback: null, hintOpen: false, solutionOpen: false,
    announcement: "Noch keine Karte ausgewählt. Wähle zuerst eine Karte oder ziehe sie mit der Maus.",
  };
}

export function checkManipulation(config: ManipulationConfig, arrangement: ManipulationArrangement): ManipulationCheck {
  const total = config.cards.length;
  if (config.mode === "reorder") {
    const complete = arrangement.order.length === total && new Set(arrangement.order).size === total && config.cards.every(card => arrangement.order.includes(card.id));
    const correctCount = complete ? config.correctOrder.filter((cardId, index) => arrangement.order[index] === cardId).length : 0;
    const correct = complete && correctCount === total;
    return { complete, correct, correctCount, total, message: correct
      ? "Die ganze Reihenfolge stimmt. Erkläre jetzt mit eigenen Worten, warum jeder Schritt oder Wert an dieser Stelle steht."
      : complete ? `Noch nicht vollständig richtig: ${correctCount} von ${total} Karten stehen an ihrer richtigen Position. Prüfe die Regel und versuche es erneut.`
      : "Die Reihenfolge ist unvollständig oder enthält unbekannte beziehungsweise doppelte Karten. Setze die Zusatzübung zurück." };
  }
  const validCategories = new Set(config.categories.map(category => category.id));
  const assigned = config.cards.filter(card => validCategories.has(arrangement.assignments[card.id] ?? "")).length;
  const correctCount = config.cards.filter(card => arrangement.assignments[card.id] === config.answers[card.id]).length;
  const complete = assigned === total;
  const correct = complete && correctCount === total;
  return { complete, correct, correctCount, total, message: correct
    ? "Alle Karten sind richtig zugeordnet. Begründe jetzt eine Zuordnung, bei der du zunächst unsicher warst."
    : !complete ? `Noch nicht vollständig: ${total - assigned} von ${total} Karten sind noch keiner gültigen Gruppe zugeordnet. ${correctCount} Karten sind bisher richtig eingeordnet; das ist noch keine vollständig richtige Lösung.`
    : `Noch nicht vollständig richtig: ${correctCount} von ${total} Karten passen zu ihrer Gruppe. Lies die Kategorien genau und ordne neu zu.` };
}

function remember(state: ManipulationState): ManipulationArrangement[] {
  return [...state.history.slice(-99), { order: [...state.order], assignments: { ...state.assignments } }];
}

export function manipulationReducer(config: ManipulationConfig, state: ManipulationState, action: ManipulationAction): ManipulationState {
  if (action.type === "reset") return { ...createManipulationState(config), announcement: "Zusatzübung zurückgesetzt. Alle Karten stehen wieder am Anfang." };
  if (action.type === "undo") {
    const previous = state.history.at(-1);
    return previous ? { ...state, order: [...previous.order], assignments: { ...previous.assignments }, history: state.history.slice(0, -1), feedback: null, selectedId: null, announcement: "Die letzte Verschiebung wurde rückgängig gemacht. Wähle bei Bedarf erneut eine Karte." } : state;
  }
  if (action.type === "check") return { ...state, feedback: checkManipulation(config, state) };
  if (action.type === "hint") return { ...state, hintOpen: !state.hintOpen };
  if (action.type === "solution") return { ...state, solutionOpen: !state.solutionOpen };
  const card = config.cards.find(item => item.id === action.cardId);
  if (!card) return state;
  if (action.type === "select") return { ...state, selectedId: card.id, announcement: `Ausgewählt: ${card.text}. Wähle jetzt einen Zielplatz oder eine Gruppe.` };
  if (action.type === "move") {
    if (config.mode !== "reorder" || !Number.isInteger(action.toIndex) || action.toIndex < 0 || action.toIndex >= state.order.length) return state;
    const fromIndex = state.order.indexOf(card.id);
    if (fromIndex < 0 || fromIndex === action.toIndex) return state;
    const order = [...state.order];
    order.splice(fromIndex, 1);
    order.splice(action.toIndex, 0, card.id);
    return { ...state, order, history: remember(state), feedback: null, selectedId: card.id, announcement: `${card.text} steht jetzt auf Platz ${action.toIndex + 1}. Noch nicht geprüft.` };
  }
  if (config.mode !== "classify" || (action.categoryId !== null && !config.categories.some(category => category.id === action.categoryId))) return state;
  if (state.assignments[card.id] === action.categoryId) return state;
  const label = config.categories.find(category => category.id === action.categoryId)?.label ?? "Noch nicht zugeordnet";
  return { ...state, assignments: { ...state.assignments, [card.id]: action.categoryId }, history: remember(state), feedback: null, selectedId: card.id, announcement: `${card.text} liegt jetzt in „${label}“. Noch nicht geprüft.` };
}

const dragType = "application/x-informatik-manipulation";

function ManipulationExercise({ config }: { config: ManipulationConfig }) {
  const id = useId();
  const [state, dispatch] = useReducer((current: ManipulationState, action: ManipulationAction) => manipulationReducer(config, current, action), config, createManipulationState);
  const [dragTarget, setDragTarget] = useState<string | null>(null);
  const [demoStep, setDemoStep] = useState(0);
  const guide = MANIPULATION_GUIDES[config.slug];
  const selected = config.cards.find(card => card.id === state.selectedId);
  const cardById = (cardId: string) => config.cards.find(card => card.id === cardId)!;

  function startDrag(event: DragEvent, cardId: string) {
    event.dataTransfer.setData(dragType, JSON.stringify({ lab: id, cardId }));
    event.dataTransfer.effectAllowed = "move";
    dispatch({ type: "select", cardId });
  }
  function dragOver(event: DragEvent, target: string) {
    if (!event.dataTransfer.types.includes(dragType)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setDragTarget(target);
  }
  function receiveDrop(event: DragEvent, destination: number | string | null) {
    event.preventDefault();
    setDragTarget(null);
    try {
      const item = JSON.parse(event.dataTransfer.getData(dragType)) as { lab?: unknown; cardId?: unknown };
      if (item.lab !== id || typeof item.cardId !== "string") return;
      if (typeof destination === "number") dispatch({ type: "move", cardId: item.cardId, toIndex: destination });
      else dispatch({ type: "assign", cardId: item.cardId, categoryId: destination });
    } catch { /* Ignore unrelated or malformed drag data; never execute it. */ }
  }
  function cardButton(card: ManipulationCard) {
    return <button type="button" className="maniplab-card-button" aria-pressed={state.selectedId === card.id} onClick={() => dispatch({ type: "select", cardId: card.id })}>
      <span className="maniplab-card-grip" aria-hidden="true">⠿</span><span className="maniplab-card-text">{card.text}</span>
      <span className="maniplab-card-selection">{state.selectedId === card.id ? "✓ Ausgewählt" : "Karte auswählen"}</span>
    </button>;
  }
  function classifyGroup(categoryId: string | null, label: string, description: string) {
    const cards = config.cards.filter(card => state.assignments[card.id] === categoryId);
    const target = categoryId ?? "unassigned";
    return <section className="maniplab-group" data-drop-active={dragTarget === target} aria-label={label}
      onDragOver={event => dragOver(event, target)} onDragLeave={() => setDragTarget(null)} onDrop={event => receiveDrop(event, categoryId)}>
      <header><h4>{label}</h4><span className="maniplab-count">{cards.length} {cards.length === 1 ? "Karte" : "Karten"}</span></header>
      <p className="maniplab-group-description">{description}</p>
      <button type="button" className="maniplab-target" disabled={!selected || state.assignments[selected.id] === categoryId} onClick={() => selected && dispatch({ type: "assign", cardId: selected.id, categoryId })} aria-label={`Ausgewählte Karte in Gruppe „${label}“ legen`}>
        Ausgewählte Karte hier ablegen ↓
      </button>
      <ul className="maniplab-group-cards">{cards.map(card => <li key={card.id} className="maniplab-card" data-selected={state.selectedId === card.id} draggable onDragStart={event => startDrag(event, card.id)} onDragEnd={() => setDragTarget(null)}>{cardButton(card)}</li>)}</ul>
      {cards.length === 0 && <p className="maniplab-empty">Hier liegt noch keine Karte.</p>}
    </section>;
  }

  return <section className="maniplab" aria-labelledby={`${id}-title`} aria-describedby={`${id}-instructions`}>
    <header className="maniplab-header"><span className="maniplab-kicker">Erst verstehen · dann selbst ausprobieren</span><h3 id={`${id}-title`}>{config.title}</h3>
      {guide && <p className="maniplab-why"><strong>Wozu brauche ich das?</strong> {guide.why}</p>}
      <p>{config.context}</p>
    </header>
    {guide && <details className="maniplab-demo" open>
      <summary>1 · Gemeinsam durchdenken: ein kleines Beispiel</summary>
      <p>Dieses Beispiel benutzt andere Daten als deine Aufgabe. Klicke dich durch den Denkweg; an deinen Übungskarten ändert sich dabei nichts.</p>
      <h4>{guide.demoTitle}</h4>
      <ol className="maniplab-demo-steps">{guide.demoSteps.slice(0,demoStep+1).map((step,index)=><li key={index} data-current={index===demoStep}><span className="maniplab-demo-number" aria-hidden="true">{index+1}</span><p>{step}</p></li>)}</ol>
      <p className="maniplab-demo-status" role="status" aria-live="polite" aria-atomic="true">Denkschritt {demoStep+1} von {guide.demoSteps.length}: {guide.demoSteps[demoStep]}</p>
      <div className="maniplab-demo-actions"><button type="button" disabled={demoStep===0} onClick={()=>setDemoStep(step=>Math.max(0,step-1))}>Vorheriger Denkschritt</button><button type="button" disabled={demoStep===guide.demoSteps.length-1} onClick={()=>setDemoStep(step=>Math.min(guide.demoSteps.length-1,step+1))}>Nächster Denkschritt →</button><button type="button" onClick={()=>setDemoStep(0)}>Beispiel neu starten</button></div>
      {demoStep===guide.demoSteps.length-1 && <p className="maniplab-demo-done"><strong>Jetzt du:</strong> Erkläre den letzten Schritt kurz mit eigenen Worten. Übertrage anschließend die Idee auf die anderen Karten unten.</p>}
    </details>}
    {guide && <div className="maniplab-strategy"><h4>2 · So gehst du bei deiner Aufgabe vor</h4><ol>{guide.strategy.map((step,index)=><li key={index}>{step}</li>)}</ol><p><strong>Achtung, leicht zu verwechseln:</strong> {guide.misconception}</p></div>}
    <p className="maniplab-task"><strong>Dein Auftrag:</strong> {config.instruction}</p>
    <div className="maniplab-instructions" id={`${id}-instructions`}>
      <strong>3 · Jetzt die Karten bewegen</strong>
      <ol><li><strong>Auswählen:</strong> Tippe oder klicke auf eine Karte. „✓ Ausgewählt“ zeigt dir, welche Karte gemeint ist.</li><li><strong>Ziel wählen:</strong> {config.mode === "reorder" ? "Drücke am gewünschten Platz „Hier einsetzen“. Die Karte wird dort eingefügt; die anderen rücken entsprechend weiter. Mit ↑ Hoch / ↓ Runter verschiebst du eine Karte genau einen Platz." : "Drücke in der passenden Gruppe „Ausgewählte Karte hier ablegen“. Du kannst eine Karte jederzeit in eine andere Gruppe oder zurück zu „Noch nicht zugeordnet“ legen."}</li><li><strong>Kontrollieren:</strong> Wenn alle Karten liegen, drücke „Anordnung prüfen“. Eine falsche Anordnung ist ein Lernschritt: Nutze den Hinweis, verändere deine Idee und prüfe erneut.</li></ol>
      <p><strong>Alternativen:</strong> Mit der Maus kannst du Karten auch direkt ziehen und am Ziel loslassen. Mit der Tastatur wechselst du per Tab zwischen Schaltflächen und bestätigst mit Enter oder Leertaste. „Letzten Zug zurück“ nimmt eine Verschiebung zurück; „Neu beginnen“ setzt nur diese Kartenaufgabe zurück.</p>
    </div>
    <div className="maniplab-selection" role="status" aria-live="polite" aria-atomic="true"><strong>{selected ? `Auswahl: ${selected.text}` : "Keine Karte ausgewählt"}</strong><span>{state.announcement}</span></div>

    {config.mode === "reorder" ? <ol className="maniplab-order" aria-label="Deine Reihenfolge, von oben nach unten">{state.order.map((cardId, index) => {
      const card = cardById(cardId);
      return <li key={cardId} className="maniplab-order-row" data-drop-active={dragTarget === String(index)} onDragOver={event => dragOver(event, String(index))} onDragLeave={() => setDragTarget(null)} onDrop={event => receiveDrop(event, index)}>
        <span className="maniplab-position" aria-label={`Platz ${index + 1}`}>{index + 1}</span>
        <div className="maniplab-card" data-selected={state.selectedId === card.id} draggable onDragStart={event => startDrag(event, card.id)} onDragEnd={() => setDragTarget(null)}>{cardButton(card)}</div>
        <div className="maniplab-move-buttons"><button type="button" disabled={index === 0} aria-label={`${card.text}: einen Platz nach oben`} onClick={() => dispatch({ type: "move", cardId, toIndex: index - 1 })}>↑ <span>Hoch</span></button><button type="button" disabled={index === state.order.length - 1} aria-label={`${card.text}: einen Platz nach unten`} onClick={() => dispatch({ type: "move", cardId, toIndex: index + 1 })}>↓ <span>Runter</span></button></div>
        <button type="button" className="maniplab-place" disabled={!selected || selected.id === cardId} aria-label={`Ausgewählte Karte auf Platz ${index + 1} einsetzen`} onClick={() => selected && dispatch({ type: "move", cardId: selected.id, toIndex: index })}>Hier einsetzen</button>
      </li>;
    })}</ol> : <div className="maniplab-classify">
      {classifyGroup(null, "Noch nicht zugeordnet", "Wähle eine Karte. Nach dem Auswählen kannst du sie in jede Zielgruppe legen.")}
      <div className="maniplab-category-grid">{config.categories.map(category => <div key={category.id}>{classifyGroup(category.id, category.label, category.description)}</div>)}</div>
    </div>}

    <div className="maniplab-actions"><button type="button" className="maniplab-primary" onClick={() => dispatch({ type: "check" })}>Anordnung prüfen</button><button type="button" disabled={state.history.length === 0} onClick={() => dispatch({ type: "undo" })}>Letzten Zug zurück</button><button type="button" onClick={() => { dispatch({ type: "reset" }); setDragTarget(null); }}>Neu beginnen</button><button type="button" aria-expanded={state.hintOpen} aria-controls={`${id}-hint`} onClick={() => dispatch({ type: "hint" })}>{state.hintOpen ? "Hinweis schließen" : "Hinweis öffnen"}</button></div>
    <div className="maniplab-feedback" data-correct={state.feedback?.correct ?? false} role="status" aria-live="polite" aria-atomic="true">{state.feedback ? <><strong>{state.feedback.correct ? "✓ Vollständig richtig" : "↻ Weiterdenken"}</strong><p>{state.feedback.message}</p></> : <p>Noch nicht geprüft. Verschiebe die Karten und entscheide selbst, wann du deine Anordnung prüfen möchtest.</p>}</div>
    <div id={`${id}-hint`} hidden={!state.hintOpen} className="maniplab-hint"><strong>Ein Denkhinweis</strong><p>{config.hint}</p></div>
    <div className="maniplab-supplement"><p>Diese Rückmeldung gehört nur zur neuen Zusatzübung. Die bisherigen Heftaufgaben und ihre geschützten Lösungen bleiben unverändert. Deine Anordnung bleibt nur vorübergehend in dieser Ansicht. Es werden keine Namen, Versuche oder Ergebnisse dauerhaft gespeichert oder versendet.</p>
      <button type="button" aria-expanded={state.solutionOpen} aria-controls={`${id}-solution`} onClick={() => dispatch({ type: "solution" })}>{state.solutionOpen ? "Erklärung schließen" : "Lösung dieser Zusatzübung mit Erklärung ansehen"}</button>
    </div>
    <div id={`${id}-solution`} hidden={!state.solutionOpen} className="maniplab-solution"><h4>Zum Vergleichen: nur dieses neue Beispiel</h4>
      {config.mode === "reorder" ? <ol>{config.correctOrder.map(cardId => { const card = cardById(cardId); return <li key={cardId}><strong>{card.text}</strong><p>{card.explanation}</p></li>; })}</ol>
        : <ul>{config.cards.map(card => <li key={card.id}><strong>{card.text} → {config.categories.find(category => category.id === config.answers[card.id])?.label}</strong><p>{card.explanation}</p></li>)}</ul>}
      <p className="maniplab-takeaway"><strong>Merke:</strong> {config.takeaway}</p><p>Die Erklärung verschiebt deine Karten nicht. Schließe sie und stelle die Anordnung anschließend selbst her.</p>
    </div>
  </section>;
}

export function ManipulationLab({ slug }: { slug: string }) {
  const id = useId();
  const [activeRound, setActiveRound] = useState(0);
  const config = Object.prototype.hasOwnProperty.call(MANIPULATION_CONFIGS, slug) ? MANIPULATION_CONFIGS[slug] : undefined;
  if (!config) return null;
  const extra = EXTRA_MANIPULATION_CONFIGS[`${slug}-runde2`];
  const rounds = extra ? [config,extra] : [config];
  return <div className="maniplab-series">
    {rounds.length>1 && <div className="maniplab-round-picker"><h3>Deine Schiebe-Werkstatt · zwei Runden</h3><p>Starte mit Runde 1 oder wähle gezielt Runde 2. Jede Runde hat ein eigenes vorgemachtes Beispiel. Deine Karten bleiben beim Wechsel erhalten, solange dieses Kapitel geöffnet bleibt. Nach dem Sperren oder Neuladen beginnst du neu.</p><div role="group" aria-label="Übungsrunde wählen">{rounds.map((round,index)=><button type="button" key={round.slug} aria-pressed={activeRound===index} aria-controls={`${id}-round-${index}`} onClick={()=>setActiveRound(index)}><span>Runde {index+1}</span>{round.title}</button>)}</div></div>}
    {rounds.map((round,index)=><div className="maniplab-round" id={`${id}-round-${index}`} key={round.slug} hidden={activeRound!==index}><ManipulationExercise config={round} /></div>)}
  </div>;
}

export default ManipulationLab;
