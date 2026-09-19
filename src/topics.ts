export type Topic = {
  slug: string;
  area: string;
  number: string;
  title: string;
  short: string;
  skills: string[];
  task: string;
  active?: boolean;
};

export const areas = [
  { number: "01", title: "Daten & Codierung", color: "mint" },
  { number: "02", title: "Algorithmen", color: "blue" },
  { number: "03", title: "Rechner & Netze", color: "amber" },
  { number: "04", title: "Gesellschaft & Sicherheit", color: "rose" },
];

export const topics: Topic[] = [
  {
    slug: "zahlensysteme",
    area: "Daten & Codierung",
    number: "01.1",
    title: "Bits, Bytes & Zahlensysteme",
    short: "Mit zwei Zeichen beginnen: Zahlen Schritt für Schritt verstehen, umrechnen und erst später negative Werte darstellen.",
    skills: ["Hexadezimal-, Binär- und Dezimalsystem", "Addition und Subtraktion", "Zweierkomplement interpretieren"],
    task: "Rechenlabor: Zahlen umwandeln, Binärzahlen addieren und Überläufe erkennen.",
  },
  {
    slug: "fehler-kompression",
    area: "Daten & Codierung",
    number: "01.2",
    title: "Fehlererkennung & Kompression",
    short: "Von vertauschten Bits und langen Zeichenfolgen zu Fehlerschutz, Prüfsummen und kleineren Dateien.",
    skills: ["Fehlererkennung und -korrektur", "Prüfsummen", "verlustfrei vs. verlustbehaftet", "Lauflängencodierung"],
    task: "Pixelrätsel: Schwarz-Weiß-Bilder per Lauflängencodierung komprimieren.",
  },
  {
    slug: "datenbanken",
    area: "Daten & Codierung",
    number: "01.3",
    title: "Datenbanken & Modellierung",
    short: "Eine Schulbibliothek ordnen: erst Zeilen und Spalten, dann Schlüssel, Beziehungen und gute Tabellenmodelle.",
    skills: ["Datenbanksystem und DBMS", "ER- und UML-Modelle", "Primär- und Fremdschlüssel", "3. Normalform"],
    task: "Modellierwerkstatt: Eine Schulbibliothek in Tabellen überführen.",
  },
  {
    slug: "sql",
    area: "Daten & Codierung",
    number: "01.4",
    title: "SQL-Abfragen",
    short: "Mit einer kleinen Tabelle anfangen und die erste Abfrage gemeinsam lesen – bis zum Verbinden mehrerer Tabellen.",
    skills: ["SELECT und Projektion", "WHERE und Selektion", "Tabellenverbund", "Abfragen lesen und schreiben"],
    task: "SQL-Detektiv: Mit passenden Abfragen einen Fall lösen.",
  },
  {
    slug: "programmierung",
    area: "Algorithmen",
    number: "02.1",
    title: "Strukturierte Programmierung",
    short: "Probleme mit Variablen, Bedingungen, Schleifen und Unterprogrammen lösen.",
    skills: ["Datentypen und Variablen", "UND, ODER, NICHT", "Schleifen und Verzweigungen", "Parameter und Rückgabewerte", "Testfälle und Fehlersuche"],
    task: "Codewerkstatt: Abläufe vorhersagen, Fehler markieren und Bausteine ordnen.",
  },
  {
    slug: "sortieren",
    area: "Algorithmen",
    number: "02.2",
    title: "Arrays & Sortierverfahren",
    short: "Arrays bearbeiten und Bubble-, Selection- und Insertionsort vergleichen.",
    skills: ["Arrays füllen und auswerten", "Maximum und Summe", "Bubblesort", "Selectionsort", "Insertionsort"],
    task: "Sortierlabor: Einen Bubblesort-Durchlauf selbst Schritt für Schritt ausführen.",
    active: true,
  },
  {
    slug: "oop",
    area: "Algorithmen",
    number: "02.3",
    title: "Objektorientierte Programmierung",
    short: "Klassen und Objekte modellieren, kapseln und miteinander verknüpfen.",
    skills: ["Klassen, Attribute und Methoden", "Referenzen", "Datenkapselung", "Assoziation und Vererbung", "grafische Oberfläche"],
    task: "Klassenkarten: Attribute, Methoden und Beziehungen korrekt zuordnen.",
  },
  {
    slug: "netzwerke",
    area: "Rechner & Netze",
    number: "03.1",
    title: "Rechnernetze, DNS & Routing",
    short: "Verstehen, wie Daten adressiert, Namen aufgelöst und Pakete geroutet werden.",
    skills: ["lokale Netze und Komponenten", "IP-Adressierung", "DNS", "lokal und global", "Routing"],
    task: "Paketreise: Netzwerkstationen in die richtige Reihenfolge bringen.",
  },
  {
    slug: "schaltnetze",
    area: "Rechner & Netze",
    number: "03.2",
    title: "Schaltnetze & Addierer",
    short: "Aus logischen Gattern Rechenwerke aufbauen und Wahrheitstabellen lesen.",
    skills: ["AND, OR, XOR und NOT", "Wahrheitstabellen", "Halbaddierer", "Volladdierer", "Mehrbitaddierer"],
    task: "Logiklabor: Aus Eingängen Ausgänge berechnen und Schaltungen ergänzen.",
  },
  {
    slug: "klassische-kryptografie",
    area: "Gesellschaft & Sicherheit",
    number: "04.1",
    title: "Vigenère & One-Time-Pad",
    short: "Klassische Verschlüsselung anwenden, angreifen und ihre Sicherheit beurteilen.",
    skills: ["Vigenère-Verfahren", "mono- und polyalphabetisch", "Kryptoanalyse", "One-Time-Pad", "Kerckhoffs-Prinzip"],
    task: "Kryptolabor: Nachrichten ver- und entschlüsseln, Schlüssellängen entdecken.",
  },
  {
    slug: "moderne-kryptografie",
    area: "Gesellschaft & Sicherheit",
    number: "04.2",
    title: "Moderne Kryptografie & PKI",
    short: "Öffentliche und private Schlüssel sowie sichere Kommunikation verstehen.",
    skills: ["symmetrisch vs. asymmetrisch", "Schlüsseltausch", "Public-Key-Infrastruktur", "HTTPS und Messenger"],
    task: "Schlüsselspiel: Rollen und Schlüssel bei einer sicheren Nachricht zuordnen.",
  },
  {
    slug: "datenschutz",
    area: "Gesellschaft & Sicherheit",
    number: "04.3",
    title: "Datenschutz & Informationsgesellschaft",
    short: "Datenspuren erkennen und digitale Szenarien aus mehreren Perspektiven bewerten.",
    skills: ["Datensicherheit und Datenschutz", "personenbezogene Daten", "Massendatenerhebung", "begründetes Bewerten"],
    task: "Urteilslabor: Maßnahmen sortieren und ein Datenszenario argumentativ bewerten.",
  },
];

export const getTopic = (slug: string) => topics.find((topic) => topic.slug === slug);
