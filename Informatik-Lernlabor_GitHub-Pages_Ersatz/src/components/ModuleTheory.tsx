type DiagramNode = { title: string; text: string };

type ModuleTheoryConfig = {
  readingTime: string;
  sections: { title: string; paragraphs: string[] }[];
  terms: { term: string; definition: string }[];
  merksatz: string;
  diagram: { title: string; caption: string; nodes: DiagramNode[] };
  example: { title: string; task: string; steps: string[]; result: string };
  paperTasks: { type: string; title: string; prompt: string }[];
  toolTask?: { tool: "Scratch" | "BlueJ"; title: string; intro: string; steps: string[]; extension: string };
};

const theories: Record<string, ModuleTheoryConfig> = {
  zahlensysteme: {
    readingTime: "ca. 12 Minuten",
    sections: [
      {
        title: "Warum Computer anders zählen",
        paragraphs: [
          `Menschen verwenden im Alltag meist das Dezimalsystem mit zehn Ziffern. Computer bestehen dagegen aus elektronischen Schaltungen, die zwei gut unterscheidbare Zustände besitzen: Strom an oder aus. Diese Zustände werden als 1 und 0 dargestellt. Deshalb arbeiten Computer im Binärsystem. Der Wert einer Stelle hängt – genau wie im Dezimalsystem – von ihrer Position ab. Während dort Einer, Zehner und Hunderter vorkommen, stehen Binärstellen für 1, 2, 4, 8, 16 und so weiter. Eine Binärzahl ist daher keine geheimnisvolle Zeichenfolge, sondern nur eine andere Schreibweise für einen Zahlenwert.`,
          `Das Hexadezimalsystem fasst jeweils vier Binärstellen zu einer Stelle zusammen. Es besitzt sechzehn Ziffern: 0 bis 9 sowie A bis F für die Werte 10 bis 15. Dadurch wird etwa 1111 1010₂ kurz zu FA₁₆. Diese Schreibweise begegnet dir bei Farben, Speicheradressen und Maschinencode. Zum Umrechnen hilft immer die Stellenwerttafel. Statt Regeln auswendig zu lernen, zerlegst du eine Zahl in passende Potenzen der Basis. Genau diese Methode funktioniert in jedem Stellenwertsystem.`
        ]
      },
      {
        title: "Rechnen und negative Zahlen darstellen",
        paragraphs: [
          `Binärzahlen werden stellenweise addiert. Dabei gilt 1 + 1 = 10₂: Die 0 wird notiert und die 1 als Übertrag in die nächste Stelle übernommen. Bei einer festen Bitbreite kann ein Ergebnis zu groß werden. Dann entsteht ein Überlauf, weil links kein weiteres Bit gespeichert werden kann. Die Bitbreite gehört deshalb immer zur Aufgabenstellung. Acht Bits können ohne Vorzeichen die Werte 0 bis 255 darstellen, denn es gibt 2⁸ verschiedene Bitmuster.`,
          `Für negative ganze Zahlen wird meist das Zweierkomplement verwendet. Bei acht Bits steht das linke Bit für das Vorzeichen: 0 bedeutet nichtnegativ, 1 bedeutet negativ. Um −x zu bilden, schreibst du zunächst +x mit der vorgegebenen Bitzahl, vertauschst alle Nullen und Einsen und addierst anschließend 1. Der Vorteil ist technisch wichtig: Addition und Subtraktion können mit derselben Schaltung ausgeführt werden. Der Wertebereich einer 8-Bit-Zweierkomplementzahl reicht von −128 bis +127 und ist daher nicht symmetrisch.`
        ]
      }
    ],
    terms: [
      { term: "Bit", definition: "Kleinste Informationseinheit mit dem Wert 0 oder 1." },
      { term: "Basis", definition: "Anzahl der Ziffern eines Zahlensystems; binär 2, dezimal 10, hexadezimal 16." },
      { term: "Überlauf", definition: "Ein Ergebnis liegt außerhalb des mit der Bitbreite darstellbaren Bereichs." },
      { term: "Zweierkomplement", definition: "Übliche Darstellung vorzeichenbehafteter ganzer Zahlen." }
    ],
    merksatz: "Eine Bitfolge hat erst zusammen mit Bitbreite und Interpretation eine eindeutige Bedeutung.",
    diagram: {
      title: "Vom Dezimalwert zum Binärmuster",
      caption: "Bei jeder Division wird ein Rest erzeugt. Die Reste werden anschließend von unten nach oben gelesen.",
      nodes: [
        { title: "1 · Durch 2 teilen", text: "42 : 2 = 21, Rest 0" },
        { title: "2 · Wiederholen", text: "21 : 2 = 10, Rest 1 …" },
        { title: "3 · Reste umdrehen", text: "0,1,0,1,0,1 → rückwärts" },
        { title: "4 · Ergebnis prüfen", text: "101010₂ = 32 + 8 + 2 = 42" }
      ]
    },
    example: {
      title: "Vorgerechnet: −18 als 8-Bit-Zahl",
      task: "Stelle −18 im 8-Bit-Zweierkomplement dar und kontrolliere das Ergebnis.",
      steps: [
        "+18 zerlegen: 18 = 16 + 2, also 00010010₂.",
        "Alle Bits vertauschen: 11101101₂.",
        "Eins addieren: 11101101 + 1 = 11101110₂.",
        "Kontrolle: invertieren → 00010001, +1 → 00010010 = 18; das Vorzeichen ist negativ."
      ],
      result: "−18 wird mit acht Bits als 11101110₂ gespeichert."
    },
    paperTasks: [
      { type: "Basis", title: "Stellenwerttafel", prompt: "Wandle 73₁₀, 156₁₀ und 255₁₀ in Binärzahlen um. Führe jeweils eine Rückprobe durch." },
      { type: "Basis", title: "Hexadezimal", prompt: "Wandle 10110110₂ und 111010111₂ in Hexadezimal- und anschließend in Dezimalzahlen um." },
      { type: "Rechnen", title: "Binär addieren", prompt: "Berechne schriftlich 00110111₂ + 01001101₂. Markiere jeden Übertrag." },
      { type: "Rechnen", title: "Zweierkomplement", prompt: "Stelle −1, −37, −64 und −128 mit acht Bits dar. Prüfe zwei Ergebnisse durch Addition mit der Gegenzahl." },
      { type: "Verstehen", title: "Wertebereich", prompt: "Begründe, warum acht Bits ohne Vorzeichen bis 255, mit Zweierkomplement aber nur bis +127 reichen." },
      { type: "Fehlersuche", title: "Überlauf", prompt: "Untersuche 01111111 + 00000001 sowie 10000000 − 00000001. Erkläre die überraschenden Ergebnisse." },
      { type: "Transfer", title: "Farbcode", prompt: "Zerlege #3ACF80 in drei Farbwerte und gib jeden Wert dezimal und binär an." },
      { type: "Erklären", title: "Lernpartner-Aufgabe", prompt: "Schreibe eine Anleitung in sechs Sätzen, mit der jemand ohne Vorwissen eine Dezimalzahl binär darstellen kann." }
    ],
    toolTask: {
      tool: "BlueJ",
      title: "Zahlensystem-Konverter",
      intro: "Programmiere eine Klasse ZahlKonverter, die Dezimalzahlen schrittweise in Binärdarstellungen überführt.",
      steps: ["Methode dezimalNachBinaer(int zahl) planen", "Division, Rest und Schleife verwenden", "für 0, 1, 42, 255 und einen ungültigen Wert testen", "Zwischenschritte in der Konsole ausgeben"],
      extension: "Ergänze eine Methode, die prüft, ob eine Zahl in den 8-Bit-Zweierkomplementbereich passt."
    }
  },
  "fehler-kompression": {
    readingTime: "ca. 13 Minuten",
    sections: [
      {
        title: "Redundanz macht Daten robuster",
        paragraphs: [
          `Bei der Übertragung oder Speicherung können Bits verändert werden. Ein Kratzer, eine gestörte Funkverbindung oder ein defekter Speicherbereich genügt. Wenn jede Information nur einmal vorkommt, bleibt ein solcher Fehler möglicherweise unbemerkt. Redundanz bedeutet, zusätzliche Information hinzuzufügen. Ein einfaches Beispiel ist ein Paritätsbit: Zu einer Gruppe von Bits wird ein weiteres Bit ergänzt, sodass die Anzahl der Einsen gerade oder ungerade ist. Ändert sich genau ein Bit, stimmt diese Eigenschaft nicht mehr und der Fehler wird erkannt.`,
          `Fehlererkennung und Fehlerkorrektur sind nicht dasselbe. Eine Prüfsumme kann anzeigen, dass Daten vermutlich verändert wurden, verrät aber nicht immer, an welcher Stelle der Fehler liegt. Für eine Korrektur ist mehr Redundanz nötig. Bei einer einfachen Wiederholung jedes Bits lässt sich durch Mehrheitsentscheidung korrigieren, allerdings wächst die Datenmenge stark. In echten Systemen werden ausgefeiltere Codes eingesetzt. Entscheidend ist immer der Zielkonflikt zwischen zusätzlichem Speicher, Rechenaufwand und gewünschter Zuverlässigkeit.`
        ]
      },
      {
        title: "Kompression entfernt gezielt Redundanz",
        paragraphs: [
          `Kompression verfolgt zunächst das Gegenprinzip: Wiederholungen und unwichtige Details sollen weniger Platz benötigen. Bei der Lauflängencodierung werden gleiche, aufeinanderfolgende Zeichen als Anzahl und Zeichen gespeichert. Aus WWWBBBBWW wird 3W4B2W. Das ist verlustfrei, weil die ursprüngliche Folge exakt wiederhergestellt werden kann. Bei stark wechselnden Daten kann die Codierung sogar länger werden. Deshalb muss ein Verfahren zur Datenart passen und vor seinem Einsatz an typischen Beispielen geprüft werden.`,
          `Verlustbehaftete Kompression verwirft Informationen, die für den Zweck weniger wichtig erscheinen. Ein Bild kann mit geringerer Auflösung oder Farbtiefe gespeichert, ein Tonsignal mit geringerer Abtastrate erfasst werden. Das Original lässt sich danach nicht vollständig zurückholen. Bei einem Urlaubsfoto ist das oft vertretbar, bei Programmcode, Messdaten oder einer Röntgenaufnahme möglicherweise nicht. Gute Entscheidungen berücksichtigen Datenart, Qualitätsanforderung, Speicherplatz, Übertragungszeit und die Folgen eines Verlusts.`
        ]
      }
    ],
    terms: [
      { term: "Redundanz", definition: "Zusätzliche oder wiederholte Information, die nicht unmittelbar zum Inhalt gehört." },
      { term: "Prüfsumme", definition: "Aus Daten berechneter Kontrollwert zum Erkennen von Veränderungen." },
      { term: "verlustfrei", definition: "Das Original kann vollständig rekonstruiert werden." },
      { term: "verlustbehaftet", definition: "Teile der ursprünglichen Information werden dauerhaft entfernt." }
    ],
    merksatz: "Fehlerschutz fügt kontrolliert Redundanz hinzu; Kompression entfernt entbehrliche Redundanz oder Details.",
    diagram: {
      title: "Sichere Übertragung mit Prüfsumme",
      caption: "Sender und Empfänger berechnen unabhängig denselben Kontrollwert.",
      nodes: [
        { title: "1 · Daten", text: "Die Nachricht liegt als Bitfolge vor." },
        { title: "2 · Kontrollwert", text: "Der Sender berechnet eine Prüfsumme." },
        { title: "3 · Übertragung", text: "Daten und Prüfsumme werden gesendet." },
        { title: "4 · Vergleich", text: "Neue Prüfsumme gleich? Annehmen, sonst verwerfen." }
      ]
    },
    example: {
      title: "Vorgerechnet: Gerade Parität",
      task: "Ergänze 1011001 um ein Bit für gerade Parität und prüfe einen Übertragungsfehler.",
      steps: [
        "In 1011001 kommen vier Einsen vor.",
        "Vier ist bereits gerade, daher wird das Paritätsbit 0 angehängt: 10110010.",
        "Bei der Übertragung kippt das dritte Bit: 10010010.",
        "Die empfangene Folge enthält nur noch drei Einsen. Die gerade Parität ist verletzt."
      ],
      result: "Der Fehler wird erkannt, seine genaue Position lässt sich mit nur einem Paritätsbit aber nicht bestimmen."
    },
    paperTasks: [
      { type: "Rechnen", title: "Paritätsbits", prompt: "Ergänze 1101001, 0001110 und 1111111 jeweils für gerade und ungerade Parität." },
      { type: "Rechnen", title: "Prüfsumme", prompt: "Bilde für die Dezimalwerte 18, 27, 35 und 41 die Quersummen-Prüfsumme modulo 10. Verändere einen Wert und prüfe erneut." },
      { type: "Codieren", title: "Lauflängen", prompt: "Codiere AAAABBCCCCCCDAA und eine selbst entworfene 8×8-Pixelzeile. Berechne die Zeichenersparnis." },
      { type: "Decodieren", title: "Rückweg", prompt: "Decodiere 4R2B1R5B und erkläre, welche Vereinbarung nötig ist, wenn Ziffern selbst Nutzdaten sein können." },
      { type: "Vergleichen", title: "Dateitypen", prompt: "Ordne Text, Quellcode, Foto, Podcast, Messreihe und Logo begründet verlustfreier oder verlustbehafteter Kompression zu." },
      { type: "Rechnen", title: "Farbtiefe", prompt: "Berechne die unkomprimierte Größe eines 800×600-Bildes mit 24 Bit je Pixel in Byte und MiB. Wiederhole mit 8 Bit." },
      { type: "Bewerten", title: "Qualität oder Größe", prompt: "Beurteile die Reduktion einer Audio-Abtastrate für Sprachnachricht, Musikarchiv und medizinische Aufnahme." },
      { type: "Erfinden", title: "Eigener Code", prompt: "Entwirf ein einfaches Fehlerkorrekturverfahren für vier Nutzbits. Zeige an zwei Beispielen, welche Fehler es erkennt oder korrigiert." }
    ],
    toolTask: {
      tool: "Scratch",
      title: "Pixelbild-Kompressor",
      intro: "Lege ein kleines Schwarz-Weiß-Bild als Liste aus 0 und 1 an und erzeuge automatisch eine Lauflängencodierung.",
      steps: ["Liste mit mindestens 32 Pixelwerten anlegen", "aktuelles Zeichen und Zähler verwalten", "bei einem Wechsel Anzahl und Zeichen ausgeben", "Original und Ergebnislänge vergleichen"],
      extension: "Baue auch einen Decoder und prüfe automatisch, ob Original und rekonstruiertes Bild gleich sind."
    }
  },
  datenbanken: {
    readingTime: "ca. 14 Minuten",
    sections: [
      {
        title: "Von einer Alltagssituation zum Datenmodell",
        paragraphs: [
          `Eine Datenbank speichert zusammengehörige Daten so, dass sie gezielt gesucht, verändert und miteinander verknüpft werden können. Das Datenbanksystem umfasst die eigentliche Datenbasis, ein Datenbankmanagementsystem und geeignete Benutzungsoberflächen. Das Managementsystem sorgt unter anderem dafür, dass mehrere Personen kontrolliert zugreifen, Regeln eingehalten und Änderungen dauerhaft gespeichert werden. Eine Tabellenkalkulation kann zwar ebenfalls Daten ordnen, bietet für große, gemeinsam genutzte und stark verknüpfte Datenbestände aber weniger Schutz und Struktur.`,
          `Vor dem Anlegen von Tabellen wird die Wirklichkeit modelliert. Entitätstypen sind Arten von Gegenständen oder Personen, etwa BUCH oder PERSON. Attribute beschreiben sie, etwa Titel oder Name. Beziehungen verbinden Entitäten: Eine Person leiht ein Buch aus. Kardinalitäten geben an, wie viele Objekte beteiligt sein dürfen. In einem ER- oder UML-Diagramm werden diese Zusammenhänge sichtbar, bevor technische Einzelheiten festgelegt sind. Ein gutes Modell bildet genau die Informationen ab, die für den vorgesehenen Zweck benötigt werden.`
        ]
      },
      {
        title: "Schlüssel, Beziehungen und Normalisierung",
        paragraphs: [
          `Im relationalen Modell werden Daten in Tabellen gespeichert. Eine Zeile heißt Datensatz oder Tupel, eine Spalte Attribut. Ein Primärschlüssel identifiziert jeden Datensatz eindeutig und darf nicht doppelt oder leer sein. Ein Fremdschlüssel enthält den Primärschlüssel einer anderen Tabelle. Dadurch kann eine Ausleihe auf genau die Person und das Buch verweisen, ohne deren Namen und Titel immer wieder zu kopieren. Die Daten bleiben dadurch konsistenter und Änderungen müssen nur an einer Stelle erfolgen.`,
          `Normalisierung zerlegt ungeeignete Tabellen schrittweise. In der ersten Normalform enthält jedes Feld nur einen atomaren Wert. In der zweiten Normalform hängen Nichtschlüsselattribute vollständig vom gesamten zusammengesetzten Schlüssel ab. In der dritten Normalform hängen sie nicht über andere Nichtschlüsselattribute indirekt vom Schlüssel ab. Für die Schule hilft eine praktische Frage: Beschreibt jedes Attribut wirklich genau das Objekt, dessen Schlüssel in dieser Tabelle steht? Wenn nicht, gehört es wahrscheinlich in eine andere Tabelle.`
        ]
      }
    ],
    terms: [
      { term: "DBMS", definition: "Software zum Speichern, Suchen, Ändern und Schützen einer Datenbank." },
      { term: "Primärschlüssel", definition: "Attribut oder Attributkombination, die einen Datensatz eindeutig bestimmt." },
      { term: "Fremdschlüssel", definition: "Verweis auf den Primärschlüssel einer anderen Tabelle." },
      { term: "3. Normalform", definition: "Tabellenform, in der Nichtschlüsselattribute nur vom Schlüssel abhängen." }
    ],
    merksatz: "Jede Tabelle beschreibt eine Art von Sache; Beziehungen entstehen durch passende Schlüssel.",
    diagram: {
      title: "Vom Problem zur Datenbank",
      caption: "Modellieren geschieht vor dem technischen Anlegen der Tabellen.",
      nodes: [
        { title: "1 · Anforderungen", text: "Welche Fragen soll die Datenbank beantworten?" },
        { title: "2 · Modell", text: "Entitäten, Attribute, Beziehungen und Kardinalitäten" },
        { title: "3 · Tabellen", text: "Primär- und Fremdschlüssel festlegen" },
        { title: "4 · Prüfen", text: "Normalisieren, Beispieldaten einfügen, Testfragen stellen" }
      ]
    },
    example: {
      title: "Vorgemacht: Schulbibliothek zerlegen",
      task: "Die Liste enthält PersonName, Klasse, BuchTitel, Autor und Ausleihdatum. Überführe sie in ein relationales Modell.",
      steps: [
        "PERSON(PersonID, Name, Klasse) speichert jede Person genau einmal.",
        "BUCH(BuchID, Titel, Autor) speichert jedes Buch genau einmal.",
        "AUSLEIHE(AusleiheID, PersonID, BuchID, Datum) bildet die Beziehung ab.",
        "PersonID und BuchID sind in AUSLEIHE Fremdschlüssel; wiederholte Namen und Titel entfallen."
      ],
      result: "Das Modell vermeidet unnötige Wiederholungen und lässt mehrere Ausleihen pro Person und Buch zu."
    },
    paperTasks: [
      { type: "Modellieren", title: "Schulkiosk", prompt: "Zeichne ein ER-Modell für Produkte, Bestellungen und Kunden. Ergänze Attribute, Schlüssel und Kardinalitäten." },
      { type: "Verstehen", title: "Komponenten", prompt: "Erkläre Datenbank, DBMS und Oberfläche am Beispiel einer Musik-App. Grenze die drei Begriffe voneinander ab." },
      { type: "Schlüssel", title: "Eindeutig?", prompt: "Bewerte Name, E-Mail, Geburtsdatum, ISBN und künstliche ID als mögliche Primärschlüssel. Nenne Risiken." },
      { type: "Überführen", title: "Vom ER-Modell", prompt: "Überführe eine 1:n- und eine n:m-Beziehung in Tabellen. Markiere alle Fremdschlüssel." },
      { type: "Normalisieren", title: "Bestellliste", prompt: "Zerlege Bestellung(BestellNr, Kunde, Adresse, Produkt1, Produkt2, Preis) bis zur dritten Normalform." },
      { type: "Fehlersuche", title: "Anomalien", prompt: "Zeige je ein Beispiel für Einfüge-, Änderungs- und Löschanomalie in einer unnormalisierten Tabelle." },
      { type: "Testen", title: "Beispieldaten", prompt: "Erstelle zu deinem Modell mindestens zwölf Datensätze und prüfe drei typische Nutzerfragen per Hand." },
      { type: "Bewerten", title: "Datensparsamkeit", prompt: "Prüfe, welche Felder eine Schulbibliothek wirklich benötigt. Begründe jedes gestrichene personenbezogene Attribut." }
    ],
    toolTask: {
      tool: "BlueJ",
      title: "Modell als Java-Objekte",
      intro: "Übertrage einen Ausschnitt des Bibliotheksmodells in die Klassen Buch, Person und Ausleihe.",
      steps: ["UML-Klassendiagramm zeichnen", "private Attribute und Konstruktoren anlegen", "Beziehungen über Referenzen modellieren", "drei Objekte erzeugen und im Objektinspektor prüfen"],
      extension: "Vergleiche anschließend objektorientiertes und relationales Modell: Wo liegen Beziehungen jeweils?"
    }
  },
  sql: {
    readingTime: "ca. 13 Minuten",
    sections: [
      {
        title: "Mit SQL genaue Fragen stellen",
        paragraphs: [
          `SQL ist eine Sprache zur Arbeit mit relationalen Datenbanken. Eine SELECT-Abfrage beschreibt, welche Daten das Datenbankmanagementsystem liefern soll. SELECT wählt die sichtbaren Spalten aus und heißt deshalb Projektion. FROM nennt die Tabelle. WHERE filtert Zeilen nach einer Bedingung und heißt Selektion. Die Reihenfolge der Schlüsselwörter bleibt gleich, auch wenn eine Frage komplizierter wird. Das erleichtert das Lesen: Zuerst klärst du, welche Spalten erscheinen, dann woher die Daten kommen und schließlich welche Zeilen die Bedingung erfüllen.`,
          `Bedingungen können mit AND, OR und NOT verbunden werden. Dabei ist Vorsicht nötig, weil AND stärker bindet als OR. Klammern machen die beabsichtigte Logik eindeutig. Zeichenketten stehen meist in einfachen Anführungszeichen, Zahlen nicht. Ein fehlender Wert wird mit IS NULL geprüft und nicht mit = NULL. Mit ORDER BY lässt sich das Ergebnis sortieren. Aggregatfunktionen wie COUNT, SUM oder AVG fassen mehrere Zeilen zu Kennzahlen zusammen.`
        ]
      },
      {
        title: "Informationen aus mehreren Tabellen",
        paragraphs: [
          `Normalisierte Daten liegen verteilt in mehreren Tabellen. Für eine Liste aus Personennamen und ausgeliehenen Buchtiteln müssen PERSON, AUSLEIHE und BUCH verbunden werden. Der Verbund erfolgt über zusammengehörige Schlüsselwerte: AUSLEIHE.PersonID = PERSON.PersonID und AUSLEIHE.BuchID = BUCH.BuchID. Im Bildungsplan kann dieser Tabellenverbund über Bedingungen in WHERE formuliert werden. Dabei sollten Spalten mit Tabellennamen qualifiziert werden, wenn derselbe Name mehrfach vorkommt.`,
          `Eine Abfrage sollte zuerst mit wenigen bekannten Beispieldaten geprüft werden. Überlege vor der Ausführung, wie viele Zeilen ungefähr entstehen und welche Werte vorkommen müssen. Ein fehlender Verbund führt zu einem kartesischen Produkt: Jede Zeile der einen Tabelle wird mit jeder Zeile der anderen kombiniert. Ein zu strenger Filter liefert dagegen gar keine Zeilen. SQL-Lernen bedeutet deshalb nicht nur Syntax, sondern auch das genaue Übersetzen einer Sachfrage in Projektion, Selektion und Verbund.`
        ]
      }
    ],
    terms: [
      { term: "Projektion", definition: "Auswahl der Spalten, die im Ergebnis erscheinen." },
      { term: "Selektion", definition: "Auswahl der Zeilen anhand einer Bedingung." },
      { term: "Verbund", definition: "Verknüpfung passender Datensätze aus mehreren Tabellen." },
      { term: "NULL", definition: "Kennzeichnet einen fehlenden oder unbekannten Wert." }
    ],
    merksatz: "Formuliere erst die Frage in Alltagssprache und zerlege sie dann in SELECT, FROM und WHERE.",
    diagram: {
      title: "Eine SELECT-Abfrage lesen",
      caption: "Die Datenbank verarbeitet die Bestandteile als gemeinsamen Auftrag.",
      nodes: [
        { title: "1 · SELECT", text: "Welche Spalten sollen sichtbar sein?" },
        { title: "2 · FROM", text: "In welchen Tabellen liegen die Daten?" },
        { title: "3 · WHERE", text: "Welche Zeilen und Schlüssel passen?" },
        { title: "4 · Ergebnis", text: "Zeilen kontrollieren und Sachfrage beantworten" }
      ]
    },
    example: {
      title: "Vorgerechnet: Offene Ausleihen",
      task: "Gib Namen und Buchtitel aller noch nicht zurückgegebenen Bücher aus.",
      steps: [
        "Gesuchte Spalten: PERSON.Name und BUCH.Titel.",
        "Benötigte Tabellen: PERSON, AUSLEIHE und BUCH.",
        "Verbund: passende PersonID und BuchID gleichsetzen.",
        "Filter: AUSLEIHE.Rueckgabe IS NULL ergänzen."
      ],
      result: "SELECT PERSON.Name, BUCH.Titel FROM PERSON, AUSLEIHE, BUCH WHERE PERSON.PersonID=AUSLEIHE.PersonID AND BUCH.BuchID=AUSLEIHE.BuchID AND AUSLEIHE.Rueckgabe IS NULL;"
    },
    paperTasks: [
      { type: "Lesen", title: "Abfrage erklären", prompt: "Erkläre Wort für Wort: SELECT Titel FROM Buch WHERE Jahr >= 2020 ORDER BY Titel;" },
      { type: "Schreiben", title: "Projektion", prompt: "Formuliere vier Abfragen auf BUCH(BuchID, Titel, Autor, Jahr), zunächst ohne WHERE." },
      { type: "Schreiben", title: "Selektion", prompt: "Finde Bücher nach Autor, Jahresbereich und Titelanfang. Nutze AND, OR sowie Klammern." },
      { type: "Ergebnis", title: "Per Hand ausführen", prompt: "Lege eine Tabelle mit acht Büchern an und bestimme die Ergebniszeilen von fünf vorgegebenen eigenen Abfragen." },
      { type: "Fehlersuche", title: "SQL-Klinik", prompt: "Korrigiere: SELECT FROM Buch Titel WHERE Jahr => '2020'. Begründe jede Änderung." },
      { type: "Verbund", title: "Drei Tabellen", prompt: "Formuliere den Verbund für PERSON, AUSLEIHE und BUCH und markiere jede Schlüsselbedingung farbig." },
      { type: "Verstehen", title: "Kartesisches Produkt", prompt: "Zwei Tabellen besitzen 4 und 7 Zeilen. Wie viele Kombinationen entstehen ohne Verbundbedingung? Erkläre das Problem." },
      { type: "Transfer", title: "Eigene Fragestellungen", prompt: "Entwickle sechs Fragen an deine Datenbank: zwei einfache, zwei mit Filter und zwei mit Tabellenverbund. Notiere Erwartungsergebnisse." }
    ],
    toolTask: {
      tool: "BlueJ",
      title: "SQL-Ergebnis als Objektliste",
      intro: "Simuliere eine kleine Tabelle als Array von Buch-Objekten und filtere sie mit einer Java-Schleife.",
      steps: ["Klasse Buch mit Titel und Jahr anlegen", "Array mit mindestens sechs Büchern füllen", "Methode sucheAbJahr(int grenze) schreiben", "Ausgabe mit einer passenden SQL-Abfrage vergleichen"],
      extension: "Erkläre im Heft, welche Arbeit bei SQL das DBMS statt deines Java-Programms übernimmt."
    }
  },
  programmierung: {
    readingTime: "ca. 16 Minuten",
    sections: [
      {
        title: "Algorithmen werden zu Programmen",
        paragraphs: [
          `Ein Algorithmus ist eine eindeutige, endliche Handlungsvorschrift zur Lösung einer Klasse von Problemen. In einer textuellen Programmiersprache wird er so genau formuliert, dass der Computer jeden Schritt ausführen kann. Die Grundbausteine sind Anweisung, Bedingung, Verzweigung und Schleife. Variablen speichern veränderliche Werte. Ihr Bezeichner ist der Name, der Datentyp legt mögliche Werte und Operationen fest. Deklaration, Initialisierung und Zuweisung sind verschiedene Vorgänge und sollten sprachlich sauber unterschieden werden.`,
          `Ganzzahlen, Gleitkommazahlen und Wahrheitswerte besitzen begrenzte Wertebereiche. Bei einer Typumwandlung können Informationen verloren gehen, etwa wenn 3,9 zu 3 wird. Zeichenketten lassen sich verbinden und untersuchen, sind aber keine Zahlen. Bedingungen kombinieren Vergleiche mit UND, ODER und NICHT. Ein sinnvoller Algorithmus behandelt nicht nur den Normalfall, sondern auch Randwerte und ungültige Eingaben. Zufallszahlen eignen sich für Simulationen und Spiele, müssen für Tests aber kontrollierbar eingesetzt werden.`
        ]
      },
      {
        title: "Unterprogramme, Ein- und Ausgabe und Fehlersuche",
        paragraphs: [
          `Unterprogramme zerlegen ein großes Problem in überschaubare Teile. Parameter transportieren Eingaben in eine Methode, ein Rückgabewert liefert ein Ergebnis zurück. Vor der Implementierung wird festgelegt, was die Methode erwartet und garantiert. Daraus entstehen Testfälle. Benutzerangaben und Dateiinhalte sind Eingaben, Bildschirm- und Dateiausgaben sind Ausgaben. Bibliotheken stellen dafür fertige Funktionen bereit. Ihre Dokumentation erklärt Methodennamen, Parameter, Rückgaben und mögliche Fehler.`,
          `Ein Syntaxfehler verletzt die Schreibregeln und wird meist vom Compiler gemeldet. Ein Laufzeitfehler tritt während der Ausführung auf, etwa beim Zugriff auf eine ungültige Position. Ein semantischer beziehungsweise logischer Fehler liefert ein falsches Ergebnis, obwohl das Programm läuft. Hilfreich sind Schreibtischtests, Protokollausgaben, schrittweise Ausführung und Debugger. In Struktogrammen oder Pseudocode kann der Ablauf zunächst sprachunabhängig geplant werden. Danach wird implementiert, getestet, verbessert und verständlich kommentiert.`
        ]
      }
    ],
    terms: [
      { term: "Variable", definition: "Benannter Speicherplatz mit Datentyp und aktuellem Wert." },
      { term: "Parameter", definition: "Eingabewert, den ein Unterprogramm beim Aufruf erhält." },
      { term: "Rückgabewert", definition: "Ergebnis, das ein Unterprogramm an die aufrufende Stelle liefert." },
      { term: "Semantikfehler", definition: "Das Programm läuft, löst die Aufgabe aber inhaltlich falsch." }
    ],
    merksatz: "Erst Eingaben, Ausgaben und Testfälle festlegen – dann den Algorithmus planen und programmieren.",
    diagram: {
      title: "Programmentwicklung als Kreislauf",
      caption: "Ein Test kann jederzeit zu einer Verbesserung der Anforderungen oder des Algorithmus führen.",
      nodes: [
        { title: "1 · Verstehen", text: "Problem, Eingaben, Ausgaben und Sonderfälle" },
        { title: "2 · Planen", text: "Pseudocode, Struktogramm, Methoden und Tests" },
        { title: "3 · Implementieren", text: "Code schreiben und Bibliotheken nutzen" },
        { title: "4 · Testen", text: "Soll/Ist vergleichen, Fehler suchen, überarbeiten" }
      ]
    },
    example: {
      title: "Vorgemacht: Maximum aus drei Zahlen",
      task: "Plane eine Methode maximum(a, b, c), die auch bei gleichen und negativen Werten funktioniert.",
      steps: [
        "Vorbedingung: a, b und c sind ganze Zahlen; Nachbedingung: der größte Wert wird zurückgegeben.",
        "Setze max zunächst auf a. Wenn b > max, setze max auf b. Wenn c > max, setze max auf c.",
        "Gib max zurück. Gleiche Werte benötigen keine Sonderbehandlung.",
        "Teste (2,7,4), (5,5,1), (−2,−8,−3) und Randwerte des Datentyps."
      ],
      result: "Durch schrittweises Aktualisieren bleibt max nach jedem Vergleich der größte bisher betrachtete Wert."
    },
    paperTasks: [
      { type: "Begriffe", title: "Variablen-Protokoll", prompt: "Erkläre Deklaration, Initialisierung und Zuweisung und gib jeweils eine Java-Zeile als Beispiel an." },
      { type: "Logik", title: "Wahrheitstabelle", prompt: "Erstelle die Wahrheitstabelle für (A UND NICHT B) ODER C und formuliere zwei passende Alltagssituationen." },
      { type: "Schreibtischtest", title: "Schleife verfolgen", prompt: "Protokolliere i und summe für eine Schleife von 1 bis 8. Erkläre das Ergebnis mit einer Formel." },
      { type: "Planen", title: "Struktogramm", prompt: "Zeichne ein Nassi-Shneiderman-Diagramm für eine Fahrkartenberechnung mit Alter und Ermäßigung." },
      { type: "Methoden", title: "Verträge", prompt: "Formuliere Vorbedingung, Nachbedingung und sechs Testfälle für istSchaltjahr(int jahr)." },
      { type: "Typen", title: "Umwandlungen", prompt: "Untersuche int a=(int)3.9 und double b=7/2. Erkläre Ergebnis und verbessere den zweiten Ausdruck." },
      { type: "Fehlersuche", title: "Fehlerarten", prompt: "Erfinde je ein kurzes Beispiel für Syntax-, Laufzeit- und Logikfehler. Beschreibe eine passende Suchstrategie." },
      { type: "Dateien", title: "Datenfluss", prompt: "Plane ein Programm, das Temperaturen aus einer Datei liest, Mittelwert und Maximum berechnet und einen Bericht schreibt." },
      { type: "Dokumentation", title: "Bibliothek lesen", prompt: "Wähle eine Standardmethode für Zeichenketten. Notiere Signatur, Parameter, Rückgabe und drei Testaufrufe." },
      { type: "Transfer", title: "Algorithmus verbessern", prompt: "Entwirf Pseudocode für ein Zahlenratespiel und ergänze Eingabeprüfung, Versuchszähler sowie nachvollziehbare Ausgaben." }
    ],
    toolTask: {
      tool: "BlueJ",
      title: "Konsolenprogramm mit Tests",
      intro: "Setze einen kleinen Notenrechner in Java um und beobachte ihn schrittweise im Debugger.",
      steps: ["Anforderungen und fünf Randwerttests notieren", "Methode rueckmeldung(int punkte) implementieren", "ungültige Werte behandeln", "Breakpoint setzen und Variablenwerte protokollieren", "JavaDoc-Kommentar ergänzen"],
      extension: "Lies Punktzahlen aus einer Textdatei und schreibe die Rückmeldungen in eine neue Datei."
    }
  },
  sortieren: {
    readingTime: "ca. 15 Minuten",
    sections: [
      {
        title: "Arrays speichern viele gleichartige Werte",
        paragraphs: [
          `Ein Array fasst mehrere Werte desselben Datentyps unter einem Namen zusammen. Jeder Speicherplatz besitzt einen Index. In vielen Programmiersprachen beginnt die Zählung bei 0, sodass ein Array der Länge n die Indizes 0 bis n−1 besitzt. Der direkte Zugriff auf eine Position ist schnell, ein falscher Index verursacht jedoch einen Laufzeitfehler. Typische Algorithmen durchlaufen das Array mit einer Schleife, füllen Werte ein, bilden eine Summe oder suchen ein Maximum. Eine Schleifeninvariante beschreibt, was nach jedem Durchlauf bereits sicher gilt.`,
          `Zum Sortieren werden Elemente verglichen und vertauscht oder verschoben. Bubblesort betrachtet benachbarte Paare. Stehen sie in falscher Reihenfolge, werden sie getauscht. Nach einem vollständigen Durchlauf ist das größte noch unsortierte Element ganz rechts angekommen. Selectionsort sucht jeweils das kleinste Element im unsortierten Teil und setzt es nach vorne. Insertionsort nimmt das nächste Element und fügt es an der richtigen Stelle in den bereits sortierten linken Bereich ein.`
        ]
      },
      {
        title: "Sortierverfahren verstehen und beurteilen",
        paragraphs: [
          `Die drei Verfahren liefern dasselbe Ziel, arbeiten aber unterschiedlich. Bubblesort ist anschaulich und leicht zu beobachten, führt jedoch oft viele Vertauschungen aus. Selectionsort benötigt pro Position eine Suche, tauscht dafür vergleichsweise selten. Insertionsort ist besonders günstig, wenn die Daten bereits fast sortiert sind. Für die Bewertung zählt nicht nur die Laufzeit, sondern auch Speicherbedarf, Stabilität und die Beschaffenheit der Eingabe. In der Oberstufe steht zunächst das sichere manuelle Durchführen und Erklären im Vordergrund.`,
          `Bei n Elementen sind bei diesen einfachen Verfahren im ungünstigen Fall ungefähr n² Vergleiche nötig. Verdoppelt sich n, kann sich die Arbeit etwa vervierfachen. Das wird in einer Zähltabelle sichtbar, ohne dass du formale Komplexitätstheorie benötigst. Eine Implementierung muss außerdem korrekt begrenzen: Beim Vergleich von feld[i] mit feld[i+1] darf i nie den letzten Index erreichen. Tests mit leerem Array, einem Element, gleichen Werten und bereits sortierten Daten decken typische Fehler auf.`
        ]
      }
    ],
    terms: [
      { term: "Index", definition: "Positionsnummer eines Elements; meist beginnt sie bei 0." },
      { term: "Durchlauf", definition: "Ein vollständiges Bearbeiten eines vorgesehenen Arraybereichs." },
      { term: "stabil", definition: "Gleiche Schlüsselwerte behalten nach dem Sortieren ihre ursprüngliche Reihenfolge." },
      { term: "Invariante", definition: "Aussage, die vor oder nach jedem Schleifendurchlauf wahr bleibt." }
    ],
    merksatz: "Bei Bubblesort steht nach jedem vollständigen Durchlauf mindestens ein weiteres größtes Element endgültig rechts.",
    diagram: {
      title: "Ein Bubblesort-Durchlauf",
      caption: "Das aktuell größere Element wandert durch Nachbarvergleiche nach rechts.",
      nodes: [
        { title: "Start", text: "[5, 2, 4, 1]" },
        { title: "5 und 2", text: "tauschen → [2, 5, 4, 1]" },
        { title: "5 und 4", text: "tauschen → [2, 4, 5, 1]" },
        { title: "5 und 1", text: "tauschen → [2, 4, 1, 5] · 5 ist fertig" }
      ]
    },
    example: {
      title: "Vorgerechnet: Maximumsuche",
      task: "Bestimme in [−4, 7, 3, 7, 1] das Maximum und notiere den Variablenwert nach jedem Vergleich.",
      steps: [
        "Initialisiere max mit dem ersten Wert: max = −4.",
        "Vergleiche 7: größer, also max = 7.",
        "3 ist nicht größer; max bleibt 7. Auch der zweite Wert 7 ändert max nicht.",
        "1 ist nicht größer. Nach dem letzten Element ist max weiterhin 7."
      ],
      result: "Das Maximum ist 7. Der Algorithmus funktioniert auch bei ausschließlich negativen Werten."
    },
    paperTasks: [
      { type: "Array", title: "Indextraining", prompt: "Zeichne ein Array der Länge 8 mit Indexzeile. Trage Werte ein und beantworte zehn selbst formulierte Zugriffsfragen." },
      { type: "Schreibtischtest", title: "Summe und Maximum", prompt: "Protokolliere i, summe und max beim Durchlauf durch [4,−2,9,1,9,0]." },
      { type: "Sortieren", title: "Bubblesort", prompt: "Sortiere [8,3,6,2,7] vollständig. Notiere nach jedem Vergleich das Array und markiere fertige Bereiche." },
      { type: "Sortieren", title: "Selectionsort", prompt: "Sortiere dieselbe Folge mit Selectionsort. Markiere Suche, Minimum und Tausch je Runde." },
      { type: "Sortieren", title: "Insertionsort", prompt: "Sortiere [2,5,7,3,6] mit Insertionsort und erkläre, warum diese Eingabe günstig ist." },
      { type: "Vergleichen", title: "Aufwand zählen", prompt: "Zähle Vergleiche und Vertauschungen der drei Verfahren für [5,4,3,2,1] und [1,2,3,5,4]." },
      { type: "Fehlersuche", title: "Grenzen", prompt: "Erkläre, warum eine Schleife mit i < feld.length beim Zugriff feld[i+1] fehlschlägt. Korrigiere sie." },
      { type: "Testen", title: "Sonderfälle", prompt: "Entwirf Testarrays für leer, ein Element, Duplikate, sortiert und rückwärts sortiert. Notiere erwartete Ergebnisse." },
      { type: "Erklären", title: "Verfahrenskarten", prompt: "Schreibe für jedes Sortierverfahren eine Karte mit Idee, einem Durchlauf, Vorteil und Nachteil." }
    ],
    toolTask: {
      tool: "BlueJ",
      title: "Drei Sortierer im Vergleich",
      intro: "Implementiere Bubblesort vollständig und bereite Selection- und Insertionsort als Erweiterungen vor.",
      steps: ["Methode tausche(int[] a, int i, int j) anlegen", "Bubblesort mit zwei Schleifen implementieren", "Vergleiche und Tausche zählen", "mindestens fünf Sonderfälle testen", "Ablauf im Debugger schrittweise beobachten"],
      extension: "Implementiere ein zweites Verfahren und vergleiche die Zähler bei fast sortierten und umgekehrt sortierten Arrays."
    }
  },
  oop: {
    readingTime: "ca. 16 Minuten",
    sections: [
      {
        title: "Klassen sind Baupläne, Objekte konkrete Exemplare",
        paragraphs: [
          `Objektorientierte Programmierung ordnet ein Programm nach zusammenarbeitenden Objekten. Eine Klasse beschreibt gemeinsame Attribute und Methoden. Ein konkretes Objekt besitzt eigene Attributwerte. Ein Konstruktor erzeugt und initialisiert ein Objekt. Primitive Variablen speichern einen Wert unmittelbar, Referenzvariablen verweisen dagegen auf ein Objekt. Zwei Referenzen können deshalb auf dasselbe Objekt zeigen; eine Änderung ist dann über beide Referenzen sichtbar. Diese Unterscheidung ist für das Verständnis von Methodenaufrufen und unerwarteten Seiteneffekten zentral.`,
          `Methoden beschreiben Verhalten. Ihre Signatur enthält Name und Parameterliste; je nach Sprache gehört der Rückgabetyp nicht zur Signatur im engeren Sinn. Methoden können Parameter und einen Rückgabewert besitzen oder ohne beides arbeiten. Ein sinnvoller Klassenentwurf verteilt Verantwortlichkeiten: Ein Konto sollte seinen eigenen Stand verändern, statt dass fremder Code direkt in den Wert schreibt. Attribute werden deshalb meist private deklariert und nur über kontrollierte Methoden zugänglich gemacht.`
        ]
      },
      {
        title: "Kapselung, Beziehungen und grafische Oberfläche",
        paragraphs: [
          `Zugriffsmodifikatoren wie public, private und protected regeln die Sichtbarkeit. Kapselung oder Geheimnisprinzip bedeutet, dass eine Klasse ihre innere Darstellung verbirgt und eine verlässliche öffentliche Schnittstelle anbietet. Getter und Setter sind nicht automatisch gut: Eine Änderungsmethode soll Regeln prüfen und nur gültige Zustände erlauben. Assoziationen modellieren, dass Objekte zusammenarbeiten oder einander kennen. Vererbung beschreibt eine echte Ist-ein-Beziehung, etwa Schüler ist eine Person. Gemeinsamkeiten liegen in der Oberklasse, Besonderheiten in Unterklassen.`,
          `UML-Klassendiagramme zeigen Klassenname, Attribute, Methoden, Sichtbarkeit und Beziehungen. Sie dienen zuerst dem Denken und Kommunizieren, nicht der Dekoration. Nach der Modellierung werden Klassen implementiert und mit Objekten getestet. Ein interaktives Programm ergänzt eine grafische Oberfläche mit Buttons, Eingabefeldern und Ausgaben. Die Oberfläche soll Fachlogik aufrufen, aber nicht alle Regeln selbst enthalten. So kann dieselbe Logik unabhängig von der Bedienoberfläche getestet und später wiederverwendet werden.`
        ]
      }
    ],
    terms: [
      { term: "Klasse", definition: "Bauplan für Objekte mit gemeinsamen Attributen und Methoden." },
      { term: "Referenz", definition: "Verweis auf ein Objekt statt unmittelbar gespeicherter primitiver Wert." },
      { term: "Kapselung", definition: "Schutz der inneren Darstellung durch eine kontrollierte Schnittstelle." },
      { term: "Vererbung", definition: "Beziehung, bei der eine Unterklasse Merkmale einer Oberklasse übernimmt." }
    ],
    merksatz: "Ein Objekt ist für seinen gültigen Zustand selbst verantwortlich; fremder Code nutzt seine öffentliche Schnittstelle.",
    diagram: {
      title: "Vom UML-Modell zum GUI-Programm",
      caption: "Die Bedienoberfläche nutzt die Fachklassen, ohne deren innere Daten direkt zu verändern.",
      nodes: [
        { title: "1 · Modell", text: "Klassen, Attribute, Methoden und Beziehungen" },
        { title: "2 · Implementierung", text: "Konstruktoren, Kapselung und Vererbung" },
        { title: "3 · Objekttest", text: "Normal-, Rand- und Fehlerfälle prüfen" },
        { title: "4 · Oberfläche", text: "Eingabe → Methodenaufruf → verständliche Ausgabe" }
      ]
    },
    example: {
      title: "Vorgemacht: Ein sicheres Konto",
      task: "Entwirf eine Klasse Konto, deren Stand nicht ungültig verändert werden kann.",
      steps: [
        "Attribut private double stand verhindert direkten Zugriff von außen.",
        "Der Konstruktor nimmt einen erlaubten Startwert entgegen und prüft ihn.",
        "einzahlen(double betrag) akzeptiert nur positive Beträge.",
        "getStand() liefert den Stand; es gibt keinen beliebigen setStand-Wert."
      ],
      result: "Die Klasse garantiert ihre Regeln selbst. Das ist stärker als nur ein privates Attribut mit unkontrolliertem Setter."
    },
    paperTasks: [
      { type: "Begriffe", title: "Klasse oder Objekt", prompt: "Ordne Bauplan, Instanz, Attributwert, Methode, Konstruktor und Referenz an einem Fahrrad-Beispiel zu." },
      { type: "UML", title: "Medienverwaltung", prompt: "Zeichne Klassen für Medium, Buch und Film mit Sichtbarkeit, Typen, Signaturen und Vererbung." },
      { type: "Referenzen", title: "Objektspuren", prompt: "Zeichne Speicherbilder für Person a=new Person(); Person b=a; und erkläre Änderungen über b." },
      { type: "Kapselung", title: "Gültiger Zustand", prompt: "Entwirf eine Klasse Temperatur mit sinnvollen Regeln. Begründe jede öffentliche Methode." },
      { type: "Signaturen", title: "Methodenkarten", prompt: "Formuliere je zwei Methoden mit/ohne Parameter und mit/ohne Rückgabe. Kennzeichne die Signaturen." },
      { type: "Vererbung", title: "Ist-ein-Test", prompt: "Bewerte Motor–Auto, Hund–Tier, Kurs–Schüler und EBook–Buch als Vererbung oder Assoziation." },
      { type: "Code lesen", title: "Zugriffsmodifikatoren", prompt: "Erkläre public, private und protected an einem kleinen Klassenbeispiel und nenne je einen sinnvollen Einsatz." },
      { type: "GUI", title: "Oberfläche planen", prompt: "Skizziere eine Oberfläche für einen Bibliothekskatalog. Ordne jedem Button einen Methodenaufruf zu." },
      { type: "Dokumentieren", title: "JavaDoc", prompt: "Schreibe Dokumentation mit Zweck, Parametern, Rückgabe und Fehlerfällen für drei Methoden deines Modells." },
      { type: "Testen", title: "Objekttests", prompt: "Entwirf zehn Testfälle für Konto einschließlich Nullwert, negativer Einzahlung und zwei Referenzen auf dasselbe Objekt." }
    ],
    toolTask: {
      tool: "BlueJ",
      title: "Klassenmodell mit Oberfläche",
      intro: "Implementiere Person, Schueler und Lehrkraft und bediene die Objekte zunächst im BlueJ-Objektinspektor.",
      steps: ["UML-Diagramm mit Vererbung und Assoziation", "Konstruktoren und private Attribute", "Methoden mit überprüften Parametern", "Objekte und gemeinsame Referenzen testen", "einfache GUI mit Eingabe, Button und Ausgabe ergänzen"],
      extension: "Trenne Oberflächenklasse und Fachklassen vollständig und begründe diese Aufgabenteilung."
    }
  },
  netzwerke: {
    readingTime: "ca. 14 Minuten",
    sections: [
      {
        title: "Komponenten und eindeutige Adressen",
        paragraphs: [
          `Ein lokales Rechnernetz verbindet Endgeräte in einem begrenzten Bereich. Endgeräte erzeugen oder nutzen Daten, Verbindungen übertragen sie und Verteiler wie Switches leiten sie innerhalb des Netzes weiter. Ein Router verbindet unterschiedliche Netze. Damit ein Paket sein Ziel erreicht, benötigen Absender und Empfänger eindeutige Adressen. Eine IP-Adresse erfüllt im Rechnernetz eine ähnliche Aufgabe wie Telefonnummer oder Postanschrift in anderen Kommunikationssystemen. Sie bezeichnet nicht einfach eine Person, sondern eine Netzwerkschnittstelle in einem bestimmten Zusammenhang.`,
          `Menschen merken sich Namen leichter als Zahlen. Das Domain Name System löst einen Domainnamen schrittweise in eine IP-Adresse auf. Ein DNS-Server ist mit einem Telefonbuch vergleichbar, doch das System ist weltweit verteilt und hierarchisch organisiert. Hat der Browser die Adresse erhalten, kann er den Webserver kontaktieren. DNS liefert also nicht die Webseite selbst. Diese Trennung wird in einer Simulation deutlich, wenn DNS- und Webserver als verschiedene Stationen eingerichtet werden.`
        ]
      },
      {
        title: "Lokale Netze, Subnetzmasken und Routing",
        paragraphs: [
          `Eine Subnetzmaske trennt bei einer IPv4-Adresse den Netzanteil vom Geräteanteil. Geräte vergleichen den Netzanteil ihrer eigenen Adresse mit dem Ziel. Liegt das Ziel lokal, kann direkt innerhalb des Netzes zugestellt werden. Liegt es in einem anderen Netz, geht das Paket an einen Router. Das Prinzip ähnelt Vorwahl und Rufnummer: Die Vorwahl benennt einen Bereich, der restliche Teil ein Ziel darin. Für einfache Aufgaben werden Adresse und Maske bitweise betrachtet.`,
          `Beim Routing entscheidet jeder Router nur über den nächsten geeigneten Abschnitt. Das Paket trägt Ziel- und Absenderadresse, aber nicht zwingend den gesamten Weg. Routingtabellen enthalten bekannte Netze und nächste Stationen. Fällt eine Verbindung aus, kann ein anderer Weg möglich sein. Eine Simulation erlaubt, Pakete zu beobachten, DNS-Anfragen nachzuvollziehen, eigene Webseiten zu verlinken und fehlerhafte Adressen systematisch zu untersuchen. Wichtig ist, zwischen Modell und realem Internet zu unterscheiden: Die Simulation vereinfacht bewusst.`
        ]
      }
    ],
    terms: [
      { term: "Switch", definition: "Verteilt Daten innerhalb eines lokalen Netzes an passende Anschlüsse." },
      { term: "Router", definition: "Verbindet Netze und wählt den nächsten Weg für ein Paket." },
      { term: "DNS", definition: "Verteiltes System zur Auflösung von Namen in IP-Adressen." },
      { term: "Subnetzmaske", definition: "Kennzeichnet, welcher Teil einer IP-Adresse das Netz beschreibt." }
    ],
    merksatz: "DNS findet die Adresse; Router transportieren Pakete schrittweise zwischen Netzen zum Ziel.",
    diagram: {
      title: "Der Weg zu einer Webseite",
      caption: "Die Namensauflösung geschieht vor dem Abruf der eigentlichen Webinhalte.",
      nodes: [
        { title: "1 · Browser", text: "fragt nach lernlabor.de" },
        { title: "2 · DNS", text: "antwortet mit der IP-Adresse" },
        { title: "3 · Router", text: "leiten die Anfrage zwischen Netzen weiter" },
        { title: "4 · Webserver", text: "sendet die angeforderte Seite zurück" }
      ]
    },
    example: {
      title: "Vorgerechnet: lokal oder entfernt?",
      task: "Host 192.168.4.25 und Ziel 192.168.4.90 nutzen die Maske 255.255.255.0.",
      steps: [
        "Bei 255.255.255.0 gehören die ersten drei Zahlenblöcke zum Netzanteil.",
        "Host-Netzanteil: 192.168.4; Ziel-Netzanteil: ebenfalls 192.168.4.",
        "Die Geräte befinden sich nach diesem Schema im gleichen lokalen Netz.",
        "Ein Ziel 192.168.5.90 hätte einen anderen Netzanteil und würde an den Router gesendet."
      ],
      result: "192.168.4.90 ist lokal erreichbar; für 192.168.5.90 wird Routing benötigt."
    },
    paperTasks: [
      { type: "Skizze", title: "Schulnetz", prompt: "Zeichne vier Endgeräte, zwei Switches, einen Router, DNS- und Webserver. Beschrifte jede Rolle." },
      { type: "Erklären", title: "Adressvergleich", prompt: "Vergleiche IP-Adresse, Telefonnummer, E-Mail-Adresse und Postanschrift: Was wird jeweils eindeutig bezeichnet?" },
      { type: "Ablauf", title: "DNS-Karten", prompt: "Schreibe Browser, DNS, Router und Webserver auf Karten und ordne Anfrage- und Antwortnachrichten mit Pfeilen." },
      { type: "Rechnen", title: "Netzanteil", prompt: "Entscheide für sechs Adresspaare mit 255.255.255.0, ob sie lokal sind. Begründe über den Netzanteil." },
      { type: "Binär", title: "Maske verstehen", prompt: "Schreibe 255.255.255.0 binär und markiere Netz- und Gerätebits. Wie viele Gerätebitmuster existieren?" },
      { type: "Routing", title: "Tabelle lesen", prompt: "Entwirf ein Netz mit drei Routern und notiere für jeden zwei Ziele und die jeweilige nächste Station." },
      { type: "Fehlersuche", title: "Webseite nicht erreichbar", prompt: "Erstelle eine Prüfreihenfolge für Kabel, IP-Adresse, Maske, DNS, Router und Webserver." },
      { type: "Bewerten", title: "Modellgrenzen", prompt: "Nenne fünf Vereinfachungen einer Netzwerksimulation und erkläre, welche Schlüsse trotzdem möglich sind." }
    ],
    toolTask: {
      tool: "Scratch",
      title: "Interaktive Paketreise",
      intro: "Lass ein Paket-Sprite zwischen Browser, DNS, Router und Webserver wandern und zeige die jeweilige Nachricht an.",
      steps: ["vier Stationen als Figuren anlegen", "Ereignisse DNS-Anfrage und DNS-Antwort verwenden", "IP-Adresse in einer Variable speichern", "Hin- und Rückweg animieren", "einen falschen DNS-Eintrag testbar machen"],
      extension: "Ergänze zwei mögliche Routerwege und wähle bei einem simulierten Verbindungsausfall automatisch den anderen."
    }
  },
  schaltnetze: {
    readingTime: "ca. 13 Minuten",
    sections: [
      {
        title: "Logische Gatter verarbeiten Bits",
        paragraphs: [
          `Digitale Schaltungen verarbeiten Zustände, die als 0 und 1 beschrieben werden. Ein logisches Gatter bildet eine einfache Wahrheitstabelle ab. AND liefert nur dann 1, wenn beide Eingänge 1 sind. OR liefert 1, wenn mindestens ein Eingang 1 ist. XOR liefert 1, wenn die Eingänge verschieden sind. NOT kehrt einen Eingang um. Aus mehreren Gattern entsteht ein Schaltnetz, dessen Ausgänge nur von den aktuellen Eingängen abhängen. Jede mögliche Eingangskombination muss in der Wahrheitstabelle genau einmal vorkommen.`,
          `Bei zwei Eingängen gibt es 2² = 4 Kombinationen, bei drei Eingängen 2³ = 8. Um eine Schaltung zu untersuchen, berechnest du zuerst Zwischensignale und danach den Ausgang. Umgekehrt kann aus einer Anforderung oder Wahrheitstabelle eine Schaltung entworfen werden. Dabei sind unterschiedliche Schaltungen funktional gleich, wenn ihre Wahrheitstabellen übereinstimmen. Die Tabelle ist deshalb ein zuverlässiges Werkzeug zum Testen und Vergleichen.`
        ]
      },
      {
        title: "Vom Halbaddierer zum Mehrbitaddierer",
        paragraphs: [
          `Ein Halbaddierer addiert zwei Bits. Die Summe entsteht durch XOR, der Übertrag durch AND. Für 1 + 1 ergibt XOR die Summe 0 und AND den Übertrag 1, also insgesamt 10₂. Beim Addieren mehrstelliger Binärzahlen muss zusätzlich ein eingehender Übertrag berücksichtigt werden. Ein Volladdierer besitzt daher drei Eingänge A, B und Carry-In sowie die Ausgänge Summe und Carry-Out. Er kann aus zwei Halbaddierern und einem OR-Gatter aufgebaut werden.`,
          `Mehrere Volladdierer lassen sich zu einem Mehrbitaddierer verbinden. Der Übertrag einer Stelle wird zum Carry-In der nächsten Stelle. Dadurch wandert ein Übertrag schrittweise von rechts nach links; dieses einfache Modell heißt Ripple-Carry. In einer Simulation kann jede Leitung beobachtet werden. Du solltest nicht nur eine fertige Schaltung bedienen, sondern Wahrheitstabellen herleiten, Teilbausteine testen und begründen, warum die Gesamtanordnung jede Binäraddition korrekt ausführt.`
        ]
      }
    ],
    terms: [
      { term: "Gatter", definition: "Baustein, der eine logische Funktion auf Eingangssignale anwendet." },
      { term: "Wahrheitstabelle", definition: "Tabelle aller Eingangskombinationen und zugehörigen Ausgänge." },
      { term: "Übertrag", definition: "Bit, das bei einer Addition an die nächste Stelle weitergegeben wird." },
      { term: "Volladdierer", definition: "Addiert zwei Bits und einen eingehenden Übertrag." }
    ],
    merksatz: "Halbaddierer: Summe = A XOR B, Übertrag = A AND B.",
    diagram: {
      title: "Bausteine eines Volladdierers",
      caption: "Zwei Teiladditionen verarbeiten A, B und den eingehenden Übertrag.",
      nodes: [
        { title: "1 · Eingänge", text: "A, B und Carry-In" },
        { title: "2 · Halbaddierer 1", text: "A + B → Zwischensumme und Übertrag 1" },
        { title: "3 · Halbaddierer 2", text: "Zwischensumme + Carry-In" },
        { title: "4 · Ausgänge", text: "Summe; Carry-Out = Übertrag 1 OR Übertrag 2" }
      ]
    },
    example: {
      title: "Vorgerechnet: Volladdierer für 1 + 0 + 1",
      task: "Bestimme Summe und Carry-Out für A=1, B=0 und Carry-In=1.",
      steps: [
        "Erster Halbaddierer: 1 XOR 0 = 1, 1 AND 0 = 0.",
        "Zweiter Halbaddierer: Zwischensumme 1 XOR Carry-In 1 = 0.",
        "Zweiter Übertrag: 1 AND 1 = 1.",
        "Carry-Out: 0 OR 1 = 1. Mit Summe 0 entsteht das Ergebnis 10₂."
      ],
      result: "Der Volladdierer berechnet 1 + 0 + 1 = 10₂ korrekt."
    },
    paperTasks: [
      { type: "Tabelle", title: "Grundgatter", prompt: "Erstelle Wahrheitstabellen für AND, OR, XOR und NOT und formuliere jede Funktion in einem Satz." },
      { type: "Berechnen", title: "Schaltnetz", prompt: "Berechne Y=(A AND NOT B) OR C für alle acht Eingangskombinationen." },
      { type: "Entwerfen", title: "Mehrheit", prompt: "Entwirf eine Schaltung, deren Ausgang bei mindestens zwei von drei Einsen 1 wird. Beginne mit der Wahrheitstabelle." },
      { type: "Halbaddierer", title: "Alle Fälle", prompt: "Leite die Wahrheitstabelle des Halbaddierers her und begründe XOR und AND ohne Auswendiglernen." },
      { type: "Volladdierer", title: "Acht Zeilen", prompt: "Fülle die vollständige Wahrheitstabelle mit A, B, Carry-In, Summe und Carry-Out." },
      { type: "Rechnen", title: "Binäraddition", prompt: "Berechne 1011₂ + 0110₂ schriftlich und ordne jeden Übertrag einem Volladdierer zu." },
      { type: "Skizze", title: "Vier Bit", prompt: "Zeichne vier verbundene Volladdierer. Markiere Datenrichtung und alle Carry-Leitungen." },
      { type: "Testen", title: "Bausteintest", prompt: "Erstelle einen Testplan: erst Gatter, dann Halbaddierer, Volladdierer und schließlich Mehrbitaddierer." }
    ],
    toolTask: {
      tool: "Scratch",
      title: "Gatter-Simulator",
      intro: "Programmiere zwei anklickbare Schalter A und B und zeige die Ausgänge von AND, OR und XOR gleichzeitig an.",
      steps: ["A und B zwischen 0 und 1 umschalten", "für jedes Gatter eine eigene Ausgabefigur", "nach jeder Änderung alle Ausgänge neu berechnen", "vier Eingangskombinationen automatisch testen"],
      extension: "Ergänze Carry-In und baue daraus eine interaktive Volladdierer-Anzeige."
    }
  },
  "klassische-kryptografie": {
    readingTime: "ca. 15 Minuten",
    sections: [
      {
        title: "Von Caesar zu Vigenère",
        paragraphs: [
          `Bei einer monoalphabetischen Substitution wird jeder Klartextbuchstabe immer durch denselben Geheimtextbuchstaben ersetzt. Caesar verschiebt das Alphabet um einen festen Wert. Dadurch bleiben Häufigkeitsmuster erhalten und der kleine Schlüsselraum kann vollständig ausprobiert werden. Vigenère verwendet dagegen ein wiederholtes Schlüsselwort. Jeder Schlüsselbuchstabe bestimmt eine andere Verschiebung. Derselbe Klartextbuchstabe kann daher an verschiedenen Positionen unterschiedlich verschlüsselt werden; das Verfahren ist polyalphabetisch.`,
          `Zum Rechnen werden Buchstaben meist den Zahlen A=0 bis Z=25 zugeordnet. Für die Verschlüsselung werden Klartext- und Schlüsselwert addiert und der Rest modulo 26 genommen. Bei der Entschlüsselung wird der Schlüsselwert subtrahiert. Das Schlüsselwort wird so oft wiederholt, bis es die Nachrichtenlänge erreicht. Leerzeichen und Sonderzeichen müssen nach einer vorher festgelegten Regel behandelt werden. Eine nachvollziehbare Tabelle verhindert viele Flüchtigkeitsfehler.`
        ]
      },
      {
        title: "Angriffe, One-Time-Pad und Kerckhoffs",
        paragraphs: [
          `Wiederholt sich ein Vigenère-Schlüssel, entstehen periodische Muster. Gleiche Textstücke können Abstände verraten, die Vielfache der Schlüssellänge sind. Teilt man den Geheimtext nach vermuteten Schlüsselpositionen auf, verhält sich jede Teilfolge wie eine Caesar-Verschlüsselung und kann mit Häufigkeiten untersucht werden. Ein Verfahren muss deshalb nicht nur kompliziert aussehen, sondern bekannten Angriffen standhalten. Sicherheitsurteile benötigen ein Angreifermodell und begründete Annahmen.`,
          `Beim One-Time-Pad ist der Schlüssel wirklich zufällig, genauso lang wie die Nachricht, geheim und wird genau einmal verwendet. Unter diesen Bedingungen ist jeder mögliche Klartext zu einem Geheimtext mit passendem Schlüssel vereinbar; das Verfahren ist informationstheoretisch sicher. Praktisch ist die sichere Schlüsselverteilung schwierig. Nach dem Kerckhoffs-Prinzip darf die Sicherheit eines Verfahrens nicht von einem geheimen Algorithmus abhängen. Nur der Schlüssel muss geheim bleiben, damit Fachleute das Verfahren öffentlich prüfen können.`
        ]
      }
    ],
    terms: [
      { term: "monoalphabetisch", definition: "Ein Klartextzeichen wird stets gleich ersetzt." },
      { term: "polyalphabetisch", definition: "Die Ersetzung hängt von der Position oder einem Schlüsselzeichen ab." },
      { term: "Kryptoanalyse", definition: "Untersuchung eines Verfahrens mit dem Ziel, geheime Inhalte oder Schlüssel zu gewinnen." },
      { term: "One-Time-Pad", definition: "Verfahren mit zufälligem, nachrichtenlangem und einmaligem Schlüssel." }
    ],
    merksatz: "Ein One-Time-Pad ist nur dann absolut sicher, wenn der Schlüssel zufällig, geheim, nachrichtenlang und einmalig ist.",
    diagram: {
      title: "Vigenère verschlüsseln",
      caption: "Alle Rechnungen erfolgen modulo 26; nach Z beginnt das Alphabet wieder bei A.",
      nodes: [
        { title: "1 · Vorbereiten", text: "Klartext bereinigen, Schlüssel wiederholen" },
        { title: "2 · Zahlen", text: "A=0, B=1, …, Z=25" },
        { title: "3 · Addieren", text: "Klartextwert + Schlüsselwert mod 26" },
        { title: "4 · Rückübersetzen", text: "Zahl wird Geheimtextbuchstabe" }
      ]
    },
    example: {
      title: "Vorgerechnet: HALLO mit KEY",
      task: "Verschlüssele HALLO mit Vigenère und A=0.",
      steps: [
        "Schlüssel wiederholen: K E Y K E.",
        "H(7)+K(10)=17→R; A(0)+E(4)=4→E.",
        "L(11)+Y(24)=35 mod 26=9→J; L+K=21→V.",
        "O(14)+E(4)=18→S."
      ],
      result: "Der Geheimtext lautet REJVS. Eine Entschlüsselungsprobe führt wieder zu HALLO."
    },
    paperTasks: [
      { type: "Rechnen", title: "Vigenère", prompt: "Verschlüssele INFORMATIK mit CODE. Nutze eine Tabelle und führe die Entschlüsselungsprobe durch." },
      { type: "Rechnen", title: "Entschlüsseln", prompt: "Entschlüssele RIYRMZYMJ mit dem Schlüssel LERNEN bei A=0. Als Kontrolle entsteht ein sinnvolles deutsches Wort." },
      { type: "Vergleichen", title: "Mono oder poly", prompt: "Vergleiche Caesar und Vigenère anhand gleicher Klartextbuchstaben, Schlüsselraum und Häufigkeiten." },
      { type: "Angriff", title: "Schlüssellänge", prompt: "Markiere Wiederholungen in einem vorgegebenen längeren Geheimtext und untersuche die Abstände auf gemeinsame Teiler." },
      { type: "Häufigkeit", title: "Teilfolgen", prompt: "Zerlege einen Geheimtext bei vermuteter Schlüssellänge 3 in drei Teilfolgen und skizziere die weitere Analyse." },
      { type: "OTP", title: "Bedingungen prüfen", prompt: "Bewerte vier Schlüssel: Wörterbuchwort, Würfelzufall, kürzer wiederholt, zufällig und nachrichtenlang." },
      { type: "Begründen", title: "Absolute Sicherheit", prompt: "Zeige an einem Zwei-Buchstaben-Geheimtext, dass verschiedene Schlüssel zu verschiedenen möglichen Klartexten führen." },
      { type: "Prinzip", title: "Kerckhoffs", prompt: "Verfasse eine begründete Antwort auf: Warum macht veröffentlichter Programmcode ein gutes Verfahren nicht automatisch unsicher?" },
      { type: "Transfer", title: "Schlüssellogistik", prompt: "Plane, wie zwei Personen ein One-Time-Pad sicher austauschen, aufbewahren und nach Nutzung vernichten könnten. Nenne Risiken." }
    ],
    toolTask: {
      tool: "Scratch",
      title: "Vigenère-Maschine",
      intro: "Erweitere einen Caesar-Encoder so, dass jedes Zeichen mit dem nächsten Buchstaben eines Schlüsselworts verschoben wird.",
      steps: ["Alphabet als Liste anlegen", "Text- und Schlüsselposition getrennt zählen", "Schlüssel zyklisch wiederholen", "Addition modulo 26 umsetzen", "mit einem Tabellenbeispiel testen"],
      extension: "Füge einen Entschlüsselungsmodus und eine Häufigkeitsanzeige für Geheimtextbuchstaben hinzu."
    }
  },
  "moderne-kryptografie": {
    readingTime: "ca. 15 Minuten",
    sections: [
      {
        title: "Zwei Grundideen moderner Verschlüsselung",
        paragraphs: [
          `Bei symmetrischer Verschlüsselung verwenden Sender und Empfänger denselben geheimen Schlüssel. Sie ist schnell und eignet sich für große Datenmengen, doch der gemeinsame Schlüssel muss vorher sicher ausgetauscht werden. Bei asymmetrischer Verschlüsselung besitzt jede Person ein Schlüsselpaar. Der öffentliche Schlüssel darf verteilt werden, der private bleibt geheim. Was mit dem öffentlichen Schlüssel eines Empfängers verschlüsselt wurde, kann nur mit seinem privaten Schlüssel entschlüsselt werden. Das erleichtert den Schlüsseltausch, ist aber rechenaufwendiger.`,
          `Digitale Signaturen verfolgen ein anderes Ziel als Verschlüsselung. Eine Person signiert mit ihrem privaten Schlüssel; andere prüfen mit dem öffentlichen. So lassen sich Urheberschaft und Unverändertheit kontrollieren. Vertraulichkeit entsteht dadurch allein nicht. Moderne Protokolle kombinieren Verfahren: Asymmetrische Methoden helfen bei Authentisierung und sicherer Vereinbarung, anschließend schützt ein schneller symmetrischer Sitzungsschlüssel die eigentlichen Daten. Ein Schaubild muss daher immer deutlich zwischen Verschlüsseln, Entschlüsseln, Signieren und Prüfen unterscheiden.`
        ]
      },
      {
        title: "Vertrauen durch Zertifikate und PKI",
        paragraphs: [
          `Ein öffentlicher Schlüssel ist nur hilfreich, wenn bekannt ist, wem er gehört. Sonst könnte ein Angreifer seinen eigenen Schlüssel unterschieben. Ein digitales Zertifikat bindet einen öffentlichen Schlüssel an einen Namen und wird von einer vertrauenswürdigen Zertifizierungsstelle signiert. Browser besitzen eine Liste anerkannter Stellen und prüfen Signatur, Domainname und Gültigkeitszeitraum. Eine Public-Key-Infrastruktur umfasst diese Rollen, Regeln, Zertifikate und Verfahren zum Widerruf.`,
          `Bei HTTPS wird das Serverzertifikat geprüft und ein geschützter Sitzungsschlüssel vereinbart. Danach werden Webdaten symmetrisch übertragen. Das Schloss-Symbol bedeutet, dass die Verbindung zum im Zertifikat bestätigten Ziel verschlüsselt ist; es garantiert nicht, dass alle Inhalte einer Webseite wahr oder harmlos sind. Sicherheitsbewertungen berücksichtigen gestohlene private Schlüssel, fehlerhafte Zertifikate, kompromittierte Geräte und menschliche Fehlentscheidungen. Kein einzelnes Verfahren löst alle Sicherheitsprobleme.`
        ]
      }
    ],
    terms: [
      { term: "symmetrisch", definition: "Ver- und Entschlüsselung nutzen denselben geheimen Schlüssel." },
      { term: "asymmetrisch", definition: "Es gibt ein zusammengehöriges öffentliches und privates Schlüsselpaar." },
      { term: "Zertifikat", definition: "Digital signierte Bindung zwischen Identität und öffentlichem Schlüssel." },
      { term: "PKI", definition: "Infrastruktur für Ausgabe, Prüfung und Widerruf digitaler Zertifikate." }
    ],
    merksatz: "Verschlüsselung schützt Vertraulichkeit; eine Signatur belegt Absender und Unverändertheit.",
    diagram: {
      title: "Vereinfachter HTTPS-Ablauf",
      caption: "Asymmetrisches Vertrauen und symmetrische Geschwindigkeit werden kombiniert.",
      nodes: [
        { title: "1 · Kontakt", text: "Browser fragt den Webserver an" },
        { title: "2 · Zertifikat", text: "Server sendet Namen und öffentlichen Schlüssel" },
        { title: "3 · Prüfung", text: "Browser prüft Signatur, Domain und Gültigkeit" },
        { title: "4 · Sitzung", text: "Schlüssel vereinbaren, Daten symmetrisch schützen" }
      ]
    },
    example: {
      title: "Vorgemacht: Vertrauliche Nachricht an Bob",
      task: "Ordne die Schlüssel für Vertraulichkeit und Signatur richtig zu.",
      steps: [
        "Alice beschafft Bobs authentischen öffentlichen Schlüssel.",
        "Sie verschlüsselt für Bob mit Bobs öffentlichem Schlüssel; nur Bobs privater Schlüssel entschlüsselt.",
        "Für eine Signatur verwendet Alice ihren eigenen privaten Schlüssel.",
        "Bob prüft die Signatur mit Alices authentischem öffentlichen Schlüssel."
      ],
      result: "Verschlüsselung richtet sich nach dem Empfänger; die Signatur nach dem Absender."
    },
    paperTasks: [
      { type: "Zuordnen", title: "Schlüsselrollen", prompt: "Löse sechs Szenarien zu Verschlüsseln, Entschlüsseln, Signieren und Prüfen. Begründe jeweils Person und Schlüsselart." },
      { type: "Vergleichen", title: "Symmetrisch/asymmetrisch", prompt: "Erstelle eine Tabelle zu Geschwindigkeit, Schlüsselverteilung, Anzahl benötigter Schlüssel und Einsatzgebieten." },
      { type: "Rechnen", title: "Schlüsselanzahl", prompt: "Wie viele gemeinsame Schlüssel brauchen 5, 10 und 30 Personen bei paarweiser symmetrischer Kommunikation? Vergleiche mit Schlüsselpaaren." },
      { type: "Ablauf", title: "HTTPS-Karten", prompt: "Ordne Browser, Zertifikat, Zertifizierungsstelle, öffentlicher Schlüssel und Sitzungsschlüssel in einem Flussdiagramm." },
      { type: "Prüfen", title: "Zertifikat", prompt: "Notiere eine Checkliste aus Domain, Aussteller, Gültigkeit, Signaturkette und Widerruf. Erkläre jeden Punkt." },
      { type: "Angriff", title: "Schlüssel unterschieben", prompt: "Skizziere einen Man-in-the-Middle-Angriff ohne Zertifikatsprüfung und zeige, wo die PKI ihn erschwert." },
      { type: "Bewerten", title: "Schloss-Symbol", prompt: "Beurteile drei Aussagen zum Browser-Schloss und formuliere eine präzise Erklärung für jüngere Schüler." },
      { type: "Transfer", title: "Messenger", prompt: "Beschreibe, welche Schlüssel ein Messenger verwalten muss. Trenne Geräteschlüssel, Sitzungsschlüssel und Identitätsprüfung." },
      { type: "Risiken", title: "Was wenn?", prompt: "Untersuche Folgen eines gestohlenen privaten Schlüssels und nenne technische sowie organisatorische Reaktionen." }
    ],
    toolTask: {
      tool: "BlueJ",
      title: "Schlüsselprotokoll als Simulation",
      intro: "Simuliere mit einfachen Zeichenketten und Rollen den Ablauf eines hybriden Verfahrens – ausdrücklich ohne echte Kryptografie zu behaupten.",
      steps: ["Klassen Teilnehmer, Schluessel und Nachricht modellieren", "öffentliche und private Schlüsselrollen sichtbar machen", "Protokollschritte in Reihenfolge ausgeben", "einen falschen öffentlichen Schlüssel als Testfall einbauen"],
      extension: "Ergänze Zertifikat, Prüfstelle und Ablaufabbruch bei einer fehlgeschlagenen Identitätsprüfung."
    }
  },
  datenschutz: {
    readingTime: "ca. 15 Minuten",
    sections: [
      {
        title: "Datenschutz und Datensicherheit unterscheiden",
        paragraphs: [
          `Datensicherheit schützt Daten und Systeme vor Verlust, Manipulation und unbefugtem Zugriff. Häufig werden die Schutzziele Vertraulichkeit, Integrität und Verfügbarkeit betrachtet. Maßnahmen sind beispielsweise starke Anmeldung, Verschlüsselung, Rechtevergabe, Backups, Updates und Protokollierung. Datenschutz richtet den Blick auf personenbezogene Daten und die Rechte der betroffenen Menschen. Eine technisch sehr sichere Datensammlung kann trotzdem datenschutzwidrig oder gesellschaftlich problematisch sein, wenn unnötige Daten ohne nachvollziehbaren Zweck erhoben werden.`,
          `Personenbezogene Daten lassen sich direkt oder indirekt einer Person zuordnen. Auch Kennnummern, Standortverläufe oder Kombinationen scheinbar harmloser Angaben können einen Bezug herstellen. Grundsätze wie Zweckbindung, Datenminimierung, Transparenz und begrenzte Speicherdauer helfen bei der Bewertung. Privacy by Design bedeutet, Datenschutz bereits beim Entwurf eines Systems mitzudenken. Privacy by Default verlangt datensparsame Voreinstellungen, ohne dass Nutzende zuerst versteckte Optionen ändern müssen.`
        ]
      },
      {
        title: "Massendaten begründet bewerten",
        paragraphs: [
          `Digitale Dienste sammeln große Mengen an Klicks, Käufen, Bewegungen und Kommunikationsdaten. Durch Zusammenführung entstehen Profile und Vorhersagen. Das kann medizinische Forschung, Verkehrsplanung oder personalisiertes Lernen unterstützen, aber auch Überwachung, Diskriminierung und Manipulation ermöglichen. Eine Bewertung nennt daher zuerst Akteure, Datenarten, Zweck, technische Verarbeitung und mögliche Betroffene. Danach werden Nutzen, Risiken, Machtverhältnisse und Alternativen aus mehreren Perspektiven untersucht.`,
          `Ein gutes Urteil ist mehr als eine persönliche Meinung. Es verwendet Kriterien, wägt Zielkonflikte ab und endet mit einer begründeten Entscheidung. Wichtig sind auch unbeabsichtigte Folgen: Trainingsdaten können Vorurteile enthalten, Sicherheitslücken können später entstehen und freiwillige Einwilligung kann bei Abhängigkeit fragwürdig sein. Technische Maßnahmen allein genügen nicht; organisatorische Regeln, klare Zuständigkeiten, Löschkonzepte und verständliche Kommunikation gehören ebenso zu einem verantwortlichen Informatiksystem.`
        ]
      }
    ],
    terms: [
      { term: "Vertraulichkeit", definition: "Nur berechtigte Personen können Daten lesen." },
      { term: "Integrität", definition: "Daten bleiben korrekt und werden nicht unbemerkt verändert." },
      { term: "Datenminimierung", definition: "Es werden nur für den Zweck erforderliche Daten verarbeitet." },
      { term: "Privacy by Design", definition: "Datenschutz wird bereits beim Systementwurf eingebaut." }
    ],
    merksatz: "Sicher gespeichert bedeutet noch nicht zulässig erhoben – Datenschutz fragt zusätzlich nach Zweck, Erforderlichkeit und Rechten.",
    diagram: {
      title: "Ein Datenszenario bewerten",
      caption: "Die Reihenfolge trennt Sachanalyse und begründetes Werturteil.",
      nodes: [
        { title: "1 · Beschreiben", text: "Akteure, Daten, Technik und Zweck klären" },
        { title: "2 · Prüfen", text: "Erforderlichkeit, Sicherheit, Transparenz, Rechte" },
        { title: "3 · Perspektiven", text: "Nutzen und Risiken für verschiedene Gruppen" },
        { title: "4 · Urteilen", text: "Kriterien gewichten, Alternative nennen, entscheiden" }
      ]
    },
    example: {
      title: "Vorgemacht: Lern-App mit Standortdaten",
      task: "Eine App nutzt Name, Aufgabenverlauf, Noten und dauerhaften Standort für Lernempfehlungen.",
      steps: [
        "Zweck: passende Übungen empfehlen. Aufgabenverlauf kann dafür hilfreich sein.",
        "Der dauerhafte Standort ist für diesen Zweck nicht erkennbar erforderlich und sollte entfallen.",
        "Noten benötigen besonderen Schutz, klare Zugriffsrechte und begrenzte Speicherung.",
        "Eine datensparsame Alternative nutzt ein Pseudonym und lokale Auswertung ohne Standort."
      ],
      result: "Die App ist nur vertretbar, wenn unnötige Daten gestrichen, Zwecke transparent und Schutz sowie Wahlmöglichkeiten gesichert werden."
    },
    paperTasks: [
      { type: "Unterscheiden", title: "Schutz oder Recht", prompt: "Ordne zwölf Maßnahmen Datenschutz, Datensicherheit oder beiden Bereichen zu und begründe Grenzfälle." },
      { type: "Schutzziele", title: "CIA-Dreieck", prompt: "Nenne für Schulnoten je zwei Gefahren und Schutzmaßnahmen zu Vertraulichkeit, Integrität und Verfügbarkeit." },
      { type: "Dateninventar", title: "Ein Schultag", prompt: "Liste digitale Datenspuren eines Schultags auf und kennzeichne direkt, indirekt und besonders sensibel." },
      { type: "Minimieren", title: "Formular prüfen", prompt: "Entwirf ein Anmeldeformular für eine AG. Streiche alles nicht Erforderliche und begründe jedes verbleibende Feld." },
      { type: "Sicherheit", title: "Maßnahmenpaket", prompt: "Plane für eine Lernplattform Anmeldung, Rechte, Verschlüsselung, Backup, Updates und Vorfallreaktion." },
      { type: "Perspektiven", title: "Smart City", prompt: "Analysiere Kameradaten aus Sicht von Stadt, Bevölkerung, Polizei und zufällig erfassten Personen." },
      { type: "Urteil", title: "Massendaten", prompt: "Verfasse ein strukturiertes Urteil zur automatischen Auswertung aller Schülerklicks. Nutze mindestens fünf Kriterien." },
      { type: "Design", title: "Privacy by Design", prompt: "Skizziere eine datensparsame Architektur für eine Umfrage mit Pseudonymisierung und Löschfrist." },
      { type: "Transfer", title: "Folgenabschätzung", prompt: "Erstelle eine Risikomatrix mit Eintrittswahrscheinlichkeit und Schadenshöhe für ein selbst gewähltes Datensystem." }
    ],
    toolTask: {
      tool: "Scratch",
      title: "Datenspuren-Spiel",
      intro: "Entwickle eine Geschichte, in der Entscheidungen unterschiedliche Datenspuren erzeugen und ein Transparenzbericht sie sichtbar macht.",
      steps: ["mindestens vier Entscheidungssituationen", "Liste aller erhobenen Daten führen", "Zweck und Speicherdauer anzeigen", "am Ende unnötige Felder markieren", "eine datensparsame Route ermöglichen"],
      extension: "Ergänze drei Rollen mit unterschiedlichen Zugriffsrechten und zeige einen verweigerten Zugriff verständlich an."
    }
  }
};

const beginnerStarts: Record<string, { plain: string; picture: string; miniTask: string }> = {
  zahlensysteme: {
    plain: "Eine Zahl bleibt gleich, auch wenn wir sie mit anderen Zeichen schreiben. 10 im Dezimalsystem und 1010 im Binärsystem meinen denselben Wert.",
    picture: "Stell dir verschiedene Sprachen für Zahlen vor: Der Wert ist die Bedeutung, das Zahlensystem ist nur die Sprache.",
    miniTask: "Lege zehn Stifte hin. Bilde daraus Gruppen zu 8 und 2. Genau das zeigt die Binärzahl 1010."
  },
  "fehler-kompression": {
    plain: "Fehlerschutz fügt Kontrollinformationen hinzu. Kompression versucht dagegen, dieselben Daten mit weniger Zeichen zu speichern.",
    picture: "Ein Paritätsbit ist wie eine Kontrollzahl auf einem Paket; Lauflängencodierung ist wie die kurze Notiz 'fünfmal Blau' statt 'Blau, Blau, Blau, Blau, Blau'.",
    miniTask: "Schreibe AAAAABBB zuerst vollständig und dann als 5A3B. Welche Schreibweise ist kürzer?"
  },
  datenbanken: {
    plain: "Eine Datenbank ist eine geordnete Sammlung zusammengehöriger Daten. Tabellen trennen verschiedene Arten von Dingen, Schlüssel verbinden sie wieder.",
    picture: "Wie in einer gut sortierten Schulverwaltung gibt es getrennte Listen für Personen, Bücher und Ausleihen - aber mit eindeutigen Nummern als Verbindung.",
    miniTask: "Notiere zwei Bücher mit Buchnummer und zwei Personen mit Personennummer. Verbinde eine Person über die Nummer mit einem Buch."
  },
  sql: {
    plain: "SQL ist eine Fragesprache für Tabellen. Du sagst, welche Spalten du sehen möchtest, aus welcher Tabelle sie kommen und welche Zeilen passen.",
    picture: "SELECT ist der Wunschzettel, FROM nennt das Regal und WHERE ist der Filter.",
    miniTask: "Ergänze mündlich: Zeige mir den Titel aus der Tabelle Buch, aber nur für Bücher ab dem Jahr 2020."
  },
  programmierung: {
    plain: "Ein Programm ist eine sehr genaue Folge von Anweisungen. Variablen merken Werte, Bedingungen entscheiden und Schleifen wiederholen Schritte.",
    picture: "Ein Kochrezept ist ein guter Vergleich: Zutaten sind Daten, Arbeitsschritte sind Anweisungen und 'solange der Teig klebt' ist eine Schleife.",
    miniTask: "Beschreibe Zähneputzen in fünf eindeutigen Anweisungen. Finde anschließend eine Stelle für eine Wiederholung."
  },
  sortieren: {
    plain: "Sortieren bedeutet, Werte in eine gewünschte Reihenfolge zu bringen. Ein Verfahren legt genau fest, welche Werte wann verglichen und verschoben werden.",
    picture: "Bubblesort arbeitet wie eine Reihe von Nachbarkontrollen: Stehen zwei Zahlen falsch herum, tauschen sie ihre Plätze.",
    miniTask: "Sortiere die Karten 4, 2 und 3 nur durch Vergleiche benachbarter Karten und notiere jeden Tausch."
  },
  oop: {
    plain: "Eine Klasse ist ein Bauplan. Ein Objekt ist ein konkretes Exemplar, das nach diesem Bauplan erzeugt wurde.",
    picture: "Die Klasse Fahrrad beschreibt gemeinsame Merkmale; dein rotes Fahrrad mit seiner Rahmennummer ist ein einzelnes Objekt.",
    miniTask: "Nenne für die Klasse Hund zwei Attribute, zwei Methoden und ein konkretes Objekt."
  },
  netzwerke: {
    plain: "In einem Netzwerk senden Geräte Daten in kleinen Paketen. Adressen nennen das Ziel, DNS findet zu einem Namen die passende Adresse und Router wählen den nächsten Weg.",
    picture: "DNS ähnelt einem Telefonbuch, die IP-Adresse einer Telefonnummer und Router den Wegweisern zwischen Orten.",
    miniTask: "Zeichne Laptop, Router und Webserver. Verbinde sie mit Pfeilen und schreibe an jeden Pfeil, was dort weitergegeben wird."
  },
  schaltnetze: {
    plain: "Logische Gatter erhalten Nullen und Einsen als Eingaben und berechnen daraus eine neue Null oder Eins.",
    picture: "Ein AND-Gatter ist wie eine Maschine mit zwei Schaltern: Die Lampe leuchtet nur, wenn beide Schalter eingeschaltet sind.",
    miniTask: "Probiere für zwei Schalter alle vier Kombinationen aus und notiere, wann AND und wann OR eine 1 liefern."
  },
  "klassische-kryptografie": {
    plain: "Beim Verschlüsseln wird ein lesbarer Klartext mithilfe eines Schlüssels in einen Geheimtext umgewandelt. Mit dem passenden Schlüssel wird er wieder lesbar.",
    picture: "Vigenère benutzt nicht immer dieselbe Verschiebung, sondern wechselt sie entsprechend den Buchstaben des Schlüsselworts.",
    miniTask: "Ordne A=0, B=1 und C=2 zu. Rechne A+2, B+2 und C+2 und übersetze die Ergebnisse zurück."
  },
  "moderne-kryptografie": {
    plain: "Symmetrisch bedeutet: Beide Seiten teilen einen geheimen Schlüssel. Asymmetrisch bedeutet: Es gibt einen öffentlichen und einen privaten Schlüssel.",
    picture: "Der öffentliche Schlüssel ähnelt einem offenen Vorhängeschloss: Jeder darf etwas einschließen, aber nur der private Schlüssel öffnet es.",
    miniTask: "Alice will Bob geheim schreiben. Entscheide: Wessen öffentlicher Schlüssel wird zum Verschlüsseln gebraucht?"
  },
  datenschutz: {
    plain: "Datenschutz fragt, ob personenbezogene Daten überhaupt und für einen passenden Zweck verarbeitet werden dürfen. Datensicherheit schützt vorhandene Daten vor Schäden und unbefugtem Zugriff.",
    picture: "Ein guter Tresor macht eine unnötige Datensammlung sicherer, aber nicht automatisch sinnvoll oder erlaubt.",
    miniTask: "Prüfe Name, Lieblingsfarbe und Standort für eine Lern-App: Welche Angabe ist für Übungsempfehlungen wirklich notwendig?"
  }
};

export default function ModuleTheory({ slug }: { slug: string }) {
  const config = theories[slug];
  const beginner = beginnerStarts[slug];

  return (
    <>
      <article className="theoryChapter">
        <div className="chapterKicker"><span>GRUNDLAGEN</span><span>{config.readingTime} Lesezeit</span></div>
        <h2>Schritt für Schritt verstehen</h2>
        <p className="chapterLead">Du brauchst für dieses Kapitel kein Vorwissen. Lies zuerst den einfachen Einstieg und danach den ausführlichen Text. Unbekannte Begriffe findest du weiter unten in der Begriffsbox.</p>

        <section className="beginnerBox" aria-labelledby={`beginner-${slug}`}>
          <div className="beginnerLabel">GANZ EINFACH GESAGT</div>
          <h3 id={`beginner-${slug}`}>{beginner.plain}</h3>
          <div className="beginnerColumns">
            <p><strong>Bild im Kopf:</strong> {beginner.picture}</p>
            <p><strong>60-Sekunden-Start:</strong> {beginner.miniTask}</p>
          </div>
        </section>

        {config.sections.map((section) => (
          <section className="theorySection" key={section.title}>
            <h3>{section.title}</h3>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>
        ))}

        <section className="termBox" aria-labelledby={`terms-${slug}`}>
          <div><span className="eyebrow">BEGRIFFE SICHERN</span><h3 id={`terms-${slug}`}>Das solltest du erklären können</h3></div>
          <dl>{config.terms.map(({ term, definition }) => <div key={term}><dt>{term}</dt><dd>{definition}</dd></div>)}</dl>
        </section>

        <aside className="rememberBox"><span>MERKSATZ</span><p>{config.merksatz}</p></aside>
      </article>

      <figure className="flowFigure">
        <div className="eyebrow">SCHAUBILD</div>
        <h2>{config.diagram.title}</h2>
        <ol className="flowDiagram">
          {config.diagram.nodes.map((node, index) => <li key={node.title}><div><strong>{node.title}</strong><span>{node.text}</span></div>{index < config.diagram.nodes.length - 1 && <b aria-hidden="true">→</b>}</li>)}
        </ol>
        <figcaption>{config.diagram.caption}</figcaption>
      </figure>

      <article className="workedExample">
        <div className="exampleTop"><span>BEISPIEL</span><span>vollständig vorgerechnet</span></div>
        <h2>{config.example.title}</h2>
        <p className="exampleTask"><strong>Aufgabe:</strong> {config.example.task}</p>
        <ol>{config.example.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        <p className="exampleResult"><strong>Ergebnis:</strong> {config.example.result}</p>
      </article>

      <section className="paperSection">
        <div className="paperHeading"><div><div className="eyebrow">PAPIER & HEFT</div><h2>Übungsblatt zum Kapitel</h2></div><span>{config.paperTasks.length} Arbeitsaufträge</span></div>
        <p className="paperIntro">Bearbeite die Aufgaben mit vollständigem Rechenweg oder einer nachvollziehbaren Begründung. Vergleiche anschließend zu zweit und verbessert unklare Stellen gemeinsam.</p>
        <ol className="paperGrid">{config.paperTasks.map((task) => <li key={task.title}><span>{task.type}</span><h3>{task.title}</h3><p>{task.prompt}</p></li>)}</ol>
      </section>

      {config.toolTask && <article className={`toolAssignment ${config.toolTask.tool.toLowerCase()}`}>
        <div className="toolBadge">{config.toolTask.tool}</div>
        <div className="toolAssignmentBody">
          <div className="eyebrow">PROGRAMMIERAUFTRAG</div>
          <h2>{config.toolTask.title}</h2>
          <p>{config.toolTask.intro}</p>
          <ol>{config.toolTask.steps.map((step) => <li key={step}>{step}</li>)}</ol>
          <div className="toolExtension"><strong>Erweiterung:</strong> {config.toolTask.extension}</div>
        </div>
      </article>}
    </>
  );
}
