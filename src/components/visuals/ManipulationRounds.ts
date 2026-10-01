import type { ManipulationConfig } from "./ManipulationLab";

export type ManipulationGuide = {
  why: string;
  demoTitle: string;
  demoSteps: readonly string[];
  strategy: readonly string[];
  misconception: string;
};

// Original supplementary examples only; no protected paper-task data is used.
// The import above is erased by TypeScript, so the data module has no runtime
// dependency on the component which consumes it.
export const EXTRA_MANIPULATION_CONFIGS: Readonly<Record<string, ManipulationConfig>> = {
  "zahlensysteme-runde2": {
    slug: "zahlensysteme-runde2", mode: "reorder", title: "Bit oder Byte: Was ist mehr?",
    context: "Fünf kleine Datenmengen haben unterschiedliche Größen. Ein Byte besteht aus genau 8 Bit. Die Zahl vor der Einheit allein reicht zum Vergleichen nicht aus: 1 Byte ist größer als 4 Bit.",
    instruction: "Ordne die Datenmengen aufsteigend: oben die kleinste, unten die größte. Rechne dafür jede Angabe in Bit um. Keine zwei Karten bezeichnen dieselbe Datenmenge.",
    hint: "Eine Byte-Angabe wandelst du mit mal 8 in Bit um. Eine Bit-Angabe bleibt unverändert. Sortiere erst, wenn du für jede Karte die Größe in derselben Einheit kennst.",
    takeaway: "Beim Vergleichen brauchst du dieselbe Einheit. 1 Byte = 8 Bit; 2 Byte = 16 Bit; 3 Byte = 24 Bit. Bit und Byte sind nicht zwei Schreibweisen für dieselbe Größe.",
    cards: [
      { id: "size4bit", text: "4 Bit", explanation: "Die Größe steht bereits in Bit: 4 Bit." },
      { id: "size1byte", text: "1 Byte", explanation: "1 · 8 = 8 Bit. Diese Karte kommt nach 4 Bit, aber vor 12 Bit." },
      { id: "size12bit", text: "12 Bit", explanation: "Die Größe bleibt 12 Bit. Das ist mehr als 1 Byte und weniger als 2 Byte." },
      { id: "size2byte", text: "2 Byte", explanation: "2 · 8 = 16 Bit. Diese Karte kommt nach 12 Bit." },
      { id: "size3byte", text: "3 Byte", explanation: "3 · 8 = 24 Bit. Das ist die größte Datenmenge dieser fünf Karten." },
    ],
    initialOrder: ["size12bit", "size3byte", "size1byte", "size4bit", "size2byte"],
    correctOrder: ["size4bit", "size1byte", "size12bit", "size2byte", "size3byte"],
  },
  "fehler-kompression-runde2": {
    slug: "fehler-kompression-runde2", mode: "reorder", title: "Eine Pixelzeile in Lauflängen zerlegen",
    context: "Die vollständige Pixelzeile lautet RRRBBBGGRR: R steht für Rot, B für Blau und G für Grün. Wir lesen von links nach rechts. Unser einfaches RLE-Modell schreibt für jede zusammenhängende Farbgruppe „Anzahl × Farbe“. Eine neue Gruppe beginnt bei jedem Farbwechsel.",
    instruction: "Ordne die vier Lauflängen so, dass beim Ausschreiben genau RRRBBBGGRR entsteht. Jede Karte beschreibt eine zusammenhängende Gruppe, nicht alle Vorkommen einer Farbe in der ganzen Zeile.",
    hint: "Beginne ganz links und zähle bis zum ersten Farbwechsel. Fahre dort mit der nächsten Gruppe fort. Die roten Pixel am Ende gehören nicht zur roten Gruppe am Anfang.",
    takeaway: "RRR | BBB | GG | RR wird zu 3 × R, 3 × B, 2 × G, 2 × R. RLE erhält die Reihenfolge und ist in diesem Modell verlustfrei. Ob tatsächlich Speicher gespart wird, hängt auch von der Speicherung der Anzahlen und Farben ab.",
    cards: [
      { id: "run3r", text: "3 × R", explanation: "Die Zeile beginnt mit genau drei roten Pixeln: RRR." },
      { id: "run3b", text: "3 × B", explanation: "Nach den ersten roten Pixeln folgen genau drei blaue Pixel: BBB." },
      { id: "run2g", text: "2 × G", explanation: "Auf die blaue Gruppe folgen genau zwei grüne Pixel: GG." },
      { id: "run2r", text: "2 × R", explanation: "Die letzten beiden Pixel sind rot. Sie bilden eine neue Gruppe, weil dazwischen andere Farben standen." },
    ],
    initialOrder: ["run2g", "run3r", "run2r", "run3b"],
    correctOrder: ["run3r", "run3b", "run2g", "run2r"],
  },
  "datenbanken-runde2": {
    slug: "datenbanken-runde2", mode: "classify", title: "Ein Kurs, viele Anmeldungen",
    context: "Unser Modell hat KURS(kurs_id, name) und ANMELDUNG(anmeldung_id, kurs_id). Es gibt die Kurse K4 „Musik“ und K5 „Foto“. Jede Anmeldung gehört verpflichtend zu genau einem vorhandenen Kurs. Ein Kurs darf beliebig viele Anmeldungen haben, auch noch gar keine. Das ist hier mit einer 1:n-Beziehung gemeint.",
    instruction: "Prüfe jede Karte als eigenen Vorschlag: Erfüllt sie die genannten Beziehungsregeln oder verletzt sie mindestens eine davon? Die Vorschläge sind unabhängig voneinander. Eine Anmeldung ist nicht dasselbe wie eine Person.",
    hint: "Prüfe in beide Richtungen: Wie viele Kurse darf eine einzige Anmeldung nennen? Wie viele Anmeldungen darf derselbe Kurs sammeln? „Genau einer“ und „beliebig viele, auch null“ sind unterschiedliche Regeln.",
    takeaway: "Mehrere Anmeldungen dürfen denselben Kurs-Fremdschlüssel enthalten. Eine einzelne Anmeldung verweist aber auf genau einen Kurs. Eine Person könnte sich bei Bedarf mit zwei getrennten Anmeldungen für zwei Kurse anmelden; Personen werden hier nicht eigens modelliert.",
    categories: [
      { id: "fits", label: "Passt zu diesem 1:n-Modell", description: "Jede Anmeldung hat genau einen Kurs; ein Kurs darf mehrere oder keine Anmeldungen haben." },
      { id: "violates", label: "Verletzt eine Modellregel", description: "Eine einzelne Anmeldung hätte mehrere Kurse oder gar keinen Kurs." },
    ],
    cards: [
      { id: "rel-many", text: "A31 und A32 sind zwei Anmeldungen. Beide gehören jeweils nur zum Kurs K4.", explanation: "Zwei verschiedene Anmeldungen dürfen denselben Kurs nennen. Genau das erlaubt die n-Seite der Beziehung." },
      { id: "rel-empty", text: "Kurs K5 ist angelegt und hat aktuell noch keine Anmeldung.", explanation: "Das ist ausdrücklich erlaubt: Ein Kurs darf in diesem Modell auch null Anmeldungen haben." },
      { id: "rel-two", text: "Die einzige Anmeldung A33 soll gleichzeitig zu K4 und zu K5 gehören.", explanation: "Eine einzelne Anmeldung darf laut Modell genau einen Kurs nennen. Für zwei Kurse wären zwei getrennte Anmeldungen nötig." },
      { id: "rel-none", text: "A34 wird als Anmeldung gespeichert, ohne irgendeinen Kurs anzugeben.", explanation: "Die Kurszuordnung ist für jede Anmeldung verpflichtend. Anders als ein Kurs ohne Anmeldungen ist eine Anmeldung ohne Kurs hier nicht zulässig." },
    ], answers: { "rel-many": "fits", "rel-empty": "fits", "rel-two": "violates", "rel-none": "violates" },
  },
  "sql-runde2": {
    slug: "sql-runde2", mode: "classify", title: "Welche Zeilen lässt WHERE durch?",
    context: "Die sechs Karten sind die vollständige Tabelle SCHREIBMATERIAL mit den Spalten artikel_id, name, preis_cent und bestand. Jede Karte zeigt alle Werte einer Zeile. Gesucht ist: SELECT * FROM SCHREIBMATERIAL WHERE preis_cent <= 120 AND bestand > 0; Es gibt keine weiteren Zeilen und keine fehlenden Werte.",
    instruction: "Ordne jede Tabellenzeile zu: Erscheint sie im Ergebnis oder nicht? Eine Zeile muss beide Bedingungen erfüllen: höchstens 120 Cent teuer und mindestens einmal vorhanden. Die Reihenfolge innerhalb einer Gruppe wird nicht bewertet.",
    hint: "Prüfe den Preis und den Bestand getrennt. Bei AND müssen beide Prüfungen wahr sein. Ein Preis von genau 120 Cent ist erlaubt; ein Bestand von 0 ist es nicht.",
    takeaway: "WHERE wählt ganze Zeilen aus. AND verlangt, dass beide Bedingungen in derselben Zeile stimmen. Die Ausgangstabelle wird durch SELECT nicht verändert. Ohne ORDER BY ist keine bestimmte Ergebnisreihenfolge zugesichert.",
    categories: [
      { id: "included", label: "Kommt ins Ergebnis", description: "preis_cent <= 120 UND bestand > 0 sind beide wahr." },
      { id: "excluded", label: "Kommt nicht ins Ergebnis", description: "Mindestens eine der beiden Bedingungen ist falsch." },
    ],
    cards: [
      { id: "row-a31", text: "A31 | Bleistift | preis_cent: 80 | bestand: 6", explanation: "80 <= 120 ist wahr und 6 > 0 ist wahr. Beide Bedingungen sind erfüllt." },
      { id: "row-a32", text: "A32 | Marker | preis_cent: 140 | bestand: 4", explanation: "140 <= 120 ist falsch. Der positive Bestand genügt bei AND nicht: Die Zeile fällt heraus." },
      { id: "row-a33", text: "A33 | Radierer | preis_cent: 60 | bestand: 0", explanation: "Der Preis passt, aber 0 > 0 ist falsch. Der Artikel ist nicht verfügbar und fällt heraus." },
      { id: "row-a34", text: "A34 | Lineal | preis_cent: 120 | bestand: 2", explanation: "Genau 120 Cent ist wegen <= erlaubt. 2 > 0 ist ebenfalls wahr: Die Zeile kommt ins Ergebnis." },
      { id: "row-a35", text: "A35 | Heft | preis_cent: 120 | bestand: 0", explanation: "Der Grenzpreis 120 ist erlaubt, der Bestand 0 nicht. Daher kommt diese Zeile nicht ins Ergebnis." },
      { id: "row-a36", text: "A36 | Klebestift | preis_cent: 110 | bestand: 1", explanation: "110 <= 120 und 1 > 0 sind beide wahr. Auch genau ein vorhandenes Exemplar genügt." },
    ], answers: { "row-a31": "included", "row-a32": "excluded", "row-a33": "excluded", "row-a34": "included", "row-a35": "excluded", "row-a36": "included" },
  },
  "programmierung-runde2": {
    slug: "programmierung-runde2", mode: "classify", title: "Zahl, Text oder Wahrheitswert?",
    context: "Wir unterscheiden drei Java-Typen: int für ganze Zahlen in seinem Wertebereich, String für Text und boolean für die Wahrheitswerte true und false. Doppelte Anführungszeichen kennzeichnen hier Text. Alle Zahlen in dieser Übung passen in int. Andere Java-Typen betrachten wir nicht.",
    instruction: "Ordne jeden geschriebenen Java-Wert einem der drei Typen zu. Achte besonders auf die Anführungszeichen: Eine Ziffernfolge kann auch ein Text sein. Du brauchst dafür kein laufendes Java-Programm.",
    hint: "Prüfe zuerst, ob doppelte Anführungszeichen vorhanden sind. Falls nicht: Steht dort true oder false? Erst danach betrachtest du eine Zahl mit möglichem Minuszeichen.",
    takeaway: "27 und \"27\" sind verschiedene Arten von Werten. Die Zahl kann direkt an einer ganzzahligen Rechnung teilnehmen; der Text ist eine Zeichenfolge. boolean beschreibt wahr oder falsch, nicht eine beliebige Zahl.",
    categories: [
      { id: "integer", label: "int · ganze Zahl", description: "Eine ganze Zahl ohne Anführungszeichen; ein Minuszeichen ist möglich." },
      { id: "text", label: "String · Text", description: "Hier erkennbar an den doppelten Anführungszeichen." },
      { id: "boolean", label: "boolean · Wahrheitswert", description: "true oder false, ohne Anführungszeichen." },
    ],
    cards: [
      { id: "type-number", text: "27", explanation: "27 ist hier eine ganze Zahl ohne Anführungszeichen und passt in int." },
      { id: "type-negative", text: "-4", explanation: "Auch eine negative ganze Zahl passt in int. Ein Minuszeichen macht daraus keinen Text." },
      { id: "type-digits", text: "\"27\"", explanation: "Die doppelten Anführungszeichen machen diese Ziffernfolge zu einem String, also Text." },
      { id: "type-word", text: "\"Pause\"", explanation: "Das Wort in doppelten Anführungszeichen ist ein String." },
      { id: "type-true", text: "true", explanation: "true ist ohne Anführungszeichen ein Wahrheitswert des Typs boolean." },
    ], answers: { "type-number": "integer", "type-negative": "integer", "type-digits": "text", "type-word": "text", "type-true": "boolean" },
  },
  "netzwerke-runde2": {
    slug: "netzwerke-runde2", mode: "classify", title: "Wer übernimmt welche Aufgabe im Computer?",
    context: "Auch ein vernetzter Computer braucht Bauteile mit verschiedenen Aufgaben. Unser vereinfachtes Modell unterscheidet CPU, RAM und SSD: Die CPU führt Programmbefehle aus; RAM hält gerade benötigte Arbeitsdaten; eine SSD speichert Dateien auch ohne Strom. Weitere Bauteile und CPU-interne Speicher lassen wir hier weg.",
    instruction: "Ordne jede beschriebene Hauptaufgabe dem passenden Bauteil zu. Es geht um die Aufgabe des Bauteils im Modell, nicht darum, dass eine ganze Anwendung nur ein einziges Bauteil benötigen würde.",
    hint: "Frage: Wird gerade gerechnet oder ein Befehl ausgeführt? Werden Daten für das laufende Programm vorübergehend bereitgehalten? Oder soll eine gespeicherte Datei auch nach dem Ausschalten erhalten bleiben?",
    takeaway: "CPU, RAM und SSD arbeiten zusammen, sind aber nicht austauschbar. Mehr SSD-Platz bedeutet nicht automatisch mehr Arbeitsspeicher. Änderungen, die nur im RAM liegen und nicht gespeichert wurden, sind bei einem vollständigen Stromverlust nicht zuverlässig erhalten.",
    categories: [
      { id: "cpu", label: "CPU · Prozessor", description: "Führt Programmbefehle aus und verarbeitet Daten." },
      { id: "ram", label: "RAM · Arbeitsspeicher", description: "Hält gerade benötigte Arbeitsdaten; verliert seinen Inhalt ohne Strom." },
      { id: "ssd", label: "SSD · Dateispeicher", description: "Bewahrt gespeicherte Dateien auch ohne Strom auf." },
    ],
    cards: [
      { id: "hw-add", text: "Den Programmbefehl ausführen, zwei Zahlen zu addieren.", explanation: "Im Modell übernimmt die CPU das Ausführen der Rechenanweisung." },
      { id: "hw-compare", text: "Den Programmbefehl ausführen, zwei Werte miteinander zu vergleichen.", explanation: "Auch ein Vergleich ist Datenverarbeitung beim Ausführen eines Programms und gehört hier zur CPU." },
      { id: "hw-edit", text: "Die noch nicht gespeicherten Änderungen eines geöffneten Textdokuments vorübergehend bereithalten.", explanation: "Im vereinfachten Modell liegen die aktuellen Arbeitsdaten im RAM. Die SSD-Datei wird erst beim Speichern aktualisiert." },
      { id: "hw-active", text: "Daten des gerade laufenden Programms als Arbeitsspeicher bereitstellen.", explanation: "RAM ist der Arbeitsspeicher für aktuell benötigte Programme und Daten. CPU-interne Zwischenspeicher sind hier ausgeblendet." },
      { id: "hw-photo", text: "Eine ausdrücklich gespeicherte Fotodatei nach vollständigem Ausschalten weiter aufbewahren.", explanation: "Eine SSD ist nichtflüchtiger Speicher: Ihre gespeicherten Daten bleiben ohne Strom erhalten." },
      { id: "hw-install", text: "Die installierten Programmdateien bis zum nächsten Einschalten aufbewahren.", explanation: "Die Programmdateien liegen hier dauerhaft auf der SSD. Beim Starten werden benötigte Teile für die Verarbeitung geladen." },
    ], answers: { "hw-add": "cpu", "hw-compare": "cpu", "hw-edit": "ram", "hw-active": "ram", "hw-photo": "ssd", "hw-install": "ssd" },
  },
};

export const MANIPULATION_GUIDES: Readonly<Record<string, ManipulationGuide>> = {
  zahlensysteme: {
    why: "Ein Sensor oder ein kleiner Zähler liefert Bitmuster. Wenn du ihre Werte lesen kannst, verstehst du, welches Messergebnis größer ist.",
    demoTitle: "Vorgemacht: 0011₂ und 0110₂ vergleichen",
    demoSteps: [
      "Schreibe über vier Stellen die Gewichte 8, 4, 2 und 1. Jede 1 schaltet ihr Gewicht ein; jede 0 lässt es weg.",
      "Bei 0011₂ sind 2 und 1 eingeschaltet: 2 + 1 = 3.",
      "Bei 0110₂ sind 4 und 2 eingeschaltet: 4 + 2 = 6.",
      "Weil 3 kleiner als 6 ist, kommt 0011₂ vor 0110₂. Verglichen werden die Zahlenwerte, nicht die Anzahl der geschriebenen Zeichen.",
    ],
    strategy: ["Notiere die vier Stellenwerte über jeder Karte.", "Addiere für jede Karte nur die Gewichte der Einsen.", "Ordne die errechneten Werte aufsteigend und prüfe zuletzt jedes Nachbarpaar."],
    misconception: "0011₂ ist nicht die Dezimalzahl elf. Die kleine 2 sagt: Jede Stelle gehört zum Zweiersystem.",
  },
  "fehler-kompression": {
    why: "Bei einer Übertragung kann ein Bit kippen. Eine einfache Zusatzregel hilft, bestimmte Veränderungen zu bemerken.",
    demoTitle: "Vorgemacht: Einsen in 1010 und 1101 zählen",
    demoSteps: [
      "Markiere in 1010 nur die Einsen. Die Nullen zählen nicht zur Anzahl der Einsen.",
      "1010 enthält zwei Einsen. Zwei ist gerade; das Wort gehört zur geraden Parität.",
      "1101 enthält drei Einsen. Drei ist ungerade; das Wort gehört zur ungeraden Parität.",
      "Damit ist nur die Parität bestimmt. Ohne weitere Information weißt du noch nicht, ob ein Wort unterwegs verändert wurde.",
    ],
    strategy: ["Zähle die Einsen jeder Karte einmal von links nach rechts.", "Entscheide, ob diese Anzahl gerade oder ungerade ist.", "Lege die Karte in die entsprechende Gruppe und zähle zur Kontrolle erneut."],
    misconception: "Gerade Parität bedeutet nicht automatisch „fehlerfrei“. Zwei gekippte Bits können die Parität unverändert lassen.",
  },
  datenbanken: {
    why: "In einer Ausleihe müssen Geräte eindeutig erkennbar bleiben, auch wenn mehrere Geräte gleich heißen oder im selben Raum stehen.",
    demoTitle: "Vorgemacht: Räume und Geräte verknüpfen",
    demoSteps: [
      "Das Beispiel verwendet RAUM(raum_id, name) und GERAET(geraet_id, raum_id, bezeichnung). raum_id in RAUM und geraet_id in GERAET sind als Primärschlüssel festgelegt.",
      "RAUM.raum_id identifiziert genau einen Raum in seiner eigenen Tabelle. Deshalb ist diese Spalte dort ein Primärschlüssel.",
      "GERAET.raum_id verweist auf diesen Raum. Mehrere Geräte dürfen im selben Raum sein; deshalb kann derselbe Fremdschlüssel mehrfach vorkommen.",
      "GERAET.bezeichnung beschreibt ein Gerät, zum Beispiel „Tablet“. Diese Angabe ist hier kein Schlüssel, weil mehrere Geräte dieselbe Bezeichnung haben dürfen.",
    ],
    strategy: ["Lies zuerst den Tabellennamen vor dem Punkt.", "Frage: eigene Zeile identifizieren, auf eine andere Tabelle verweisen oder nur beschreiben?", "Vergleiche deine Entscheidung mit den ausdrücklich festgelegten Schlüsseln im Aufgabentext."],
    misconception: "Zwei Spalten mit demselben Namen müssen nicht dieselbe Rolle haben. Entscheidend ist, in welcher Tabelle sie stehen.",
  },
  sql: {
    why: "Statt eine lange Preisliste von Hand durchzusuchen, kannst du eine Datenbank gezielt nach passenden Einträgen fragen.",
    demoTitle: "Vorgemacht: eine Abfrage für Getränke schreiben",
    demoSteps: [
      "Unser anderes Beispiel hat GETRAENK(name, preis_cent). Wir möchten nur Namen ausgeben: Die erste geschriebene Zeile lautet SELECT name.",
      "Die Quelle ist die Tabelle GETRAENK. Ergänze als zweite Zeile FROM GETRAENK.",
      "Gesucht sind Getränke unter 100 Cent. Ergänze WHERE preis_cent < 100.",
      "Die Namen sollen alphabetisch erscheinen. Zum Schluss folgt ORDER BY name ASC; Die geschriebenen Klauseln stehen damit in der Reihenfolge SELECT, FROM, WHERE, ORDER BY.",
    ],
    strategy: ["Markiere, welche Spalten ausgegeben werden sollen und aus welcher Tabelle sie stammen.", "Suche dann die Bedingung für Zeilen und die Regel zum Sortieren.", "Ordne die geschriebenen Klauseln: SELECT, FROM, WHERE, ORDER BY."],
    misconception: "Die geschriebene SQL-Reihenfolge ist nicht die logische Verarbeitung. Bei diesem einfachen Abfragetyp wird zuerst die Datenquelle betrachtet und erst später die Ausgabe gebildet.",
  },
  programmierung: {
    why: "Ein Kassenprogramm darf keinen Betrag anzeigen, bevor es ihn berechnet hat. Genau solche Abhängigkeiten bestimmen die Reihenfolge eines Programms.",
    demoTitle: "Vorgemacht: zwei Hefte und ein kleiner Rabatt",
    demoSteps: [
      "Lege zuerst anzahl = 2 fest. Vorher hätte eine Rechnung mit anzahl noch keinen vorgegebenen Wert.",
      "Ein Heft kostet 90 Cent. Berechne zwischenbetrag = anzahl · 90 = 180 Cent.",
      "Ziehe einmal 20 Cent Rabatt ab: zahlbetrag = zwischenbetrag − 20 = 160 Cent.",
      "Gib erst jetzt zahlbetrag aus. Der fertige Betrag beträgt 160 Cent, also 1,60 Euro.",
    ],
    strategy: ["Suche den Schritt, der ohne andere Größen starten kann.", "Verbinde jede neu berechnete Größe mit dem Schritt, der sie anschließend braucht.", "Rechne den Ablauf einmal mit und stelle die endgültige Ausgabe an das Ende."],
    misconception: "Der Computer ergänzt fehlende Zwischenschritte nicht selbst. Eine Größe muss einen passenden Wert erhalten, bevor eine spätere Zeile ihn verwendet.",
  },
  sortieren: {
    why: "Beim Sortieren einer Rangliste müssen Werte systematisch ihre Plätze wechseln. Bubble Sort macht diese Nachbarvergleiche besonders gut sichtbar.",
    demoTitle: "Vorgemacht: ein Durchlauf mit [6, 4, 2]",
    demoSteps: [
      "Starte bei [6, 4, 2]. Verglichen werden zunächst nur die ersten beiden Nachbarn 6 und 4.",
      "Weil 6 > 4 gilt, tausche diese beiden Werte. Der neue Zustand lautet [4, 6, 2].",
      "Rücke ein Paar nach rechts. Vergleiche jetzt 6 und 2; wegen 6 > 2 entsteht [4, 2, 6].",
      "Der erste Durchlauf ist fertig und die größte Zahl steht rechts. 4 und 2 sind aber noch nicht sortiert; dafür ist ein weiterer Durchlauf nötig.",
    ],
    strategy: ["Lege die vorgegebene Startliste nach oben.", "Führe genau den jeweils nächsten Nachbarvergleich von links nach rechts aus.", "Suche nach jedem Vergleich die passende Momentaufnahme; stoppe am Ende dieses einen Durchlaufs."],
    misconception: "Nach einem Durchlauf ist nicht unbedingt die ganze Liste sortiert. Die größte Zahl des betrachteten Bereichs ist dann an seinem rechten Ende angekommen.",
  },
  oop: {
    why: "Ein Spiel kann viele Figuren nach demselben Bauplan erzeugen. Trotzdem braucht jede Figur ihren eigenen Namen, Standort oder Punktestand.",
    demoTitle: "Vorgemacht: zwei Spielfiguren",
    demoSteps: [
      "Die Klasse Spielfigur legt das Attribut punkte und die Methode sammle(anzahl) fest. Das ist der gemeinsame Bauplan.",
      "Das Objekt hinter figurRot hat 5 Punkte; das andere Objekt hinter figurBlau hat 9 Punkte. Das sind zwei konkrete Exemplare mit eigenen Werten.",
      "Der Aufruf figurRot.sammle(3) fordert die rote Figur zur Aktion auf. In diesem Modell steigt ihr Wert von 5 auf 8.",
      "Die blaue Figur bleibt bei 9 Punkten. Derselbe Bauplan bedeutet nicht, dass beide Objekte denselben Zustand teilen.",
    ],
    strategy: ["Frage bei jeder Karte, ob sie einen allgemeinen Bauplan oder ein bestimmtes Exemplar beschreibt.", "Suche bei einer Aktion nach dem angesprochenen Objekt und dem Methodennamen.", "Ordne erst dann zu: Klasse, Objektbeschreibung oder Methodenaufruf."],
    misconception: "radA ist im Modell eine Variable, die auf ein Objekt verweist. Ein Methodenaufruf auf radA ist weder eine neue Klasse noch automatisch eine Aktion auf radB.",
  },
  netzwerke: {
    why: "Ein Klick auf einen Link startet mehrere verschiedene Aufgaben. Wenn du sie trennst, kannst du auch Verbindungsprobleme besser beschreiben.",
    demoTitle: "Vorgemacht: eine fiktive Bibliotheksseite aufrufen",
    demoSteps: [
      "Für bibliothek.example ist noch keine Adresse bekannt. Im Beispiel fragt der Browser die Namensauflösung an und erhält per DNS eine passende IP-Adresse. .example ist hier nur ein Beispieldomainname.",
      "Für diesen frischen HTTPS-Aufruf mit HTTP/1.1 wird erst TCP aufgebaut und dann der TLS-Handshake abgeschlossen. Es gibt keine bestehende Verbindung und keine frühen Anwendungsdaten.",
      "Der Browser fragt über die geschützte Verbindung per HTTP nach /oeffnungszeiten. DNS liefert diese Öffnungszeiten nicht; es hatte nur beim Finden der Adresse geholfen.",
      "Der Server sendet die HTTP-Antwort über TLS zurück. Erst jetzt kommen die angeforderten Seiteninhalte beim Browser an.",
    ],
    strategy: ["Ordne zuerst Namensfrage und zugehörige Adressantwort.", "Stelle den hier vorgesehenen Verbindungs- und Schutzaufbau vor die Seitenanfrage.", "Lass auf die HTTP-Anfrage erst dann die zugehörige HTTP-Antwort folgen."],
    misconception: "DNS überträgt nicht die Website. Und diese Modellreihenfolge gilt nicht unverändert für jeden echten Browseraufruf, etwa mit Cache oder HTTP/3.",
  },
  schaltnetze: {
    why: "Ein Taschenrechner setzt einfache logische Bausteine zu Rechenschaltungen zusammen. Dafür muss klar sein, welcher einzelne Ausgang gerade betrachtet wird.",
    demoTitle: "Vorgemacht: zwei verschiedene Ausgänge",
    demoSteps: [
      "Betrachte zuerst ein AND-Gatter mit A = 1 und B = 1. Die Regel lautet: Nur zwei Einsen liefern eine Eins.",
      "Beide Eingänge sind 1, also ist dieser AND-Ausgang 1.",
      "Betrachte als anderes Beispiel einen Halbaddierer mit A = 0 und B = 1. Es gilt 0 + 1 = 01₂: Summenbit S = 1 und Übertrag C = 0.",
      "Für eine Karte zum Summenbit würdest du deshalb 1 wählen; für eine Karte zum Übertrag 0. Lies immer, welcher Ausgang gefragt ist.",
    ],
    strategy: ["Lies Gatterart und Eingangswerte beziehungsweise den ausdrücklich genannten Ausgang.", "Wende die passende Regel genau auf diese Eingänge an.", "Ordne nur den gefragten Ausgangswert zu, nicht den Wert eines anderen Ausgangs."],
    misconception: "Beim Halbaddierer sind S und C zwei getrennte Bits. Die gesamte Zahl darfst du nicht mit einem einzelnen Ausgangsbit verwechseln.",
  },
  "klassische-kryptografie": {
    why: "Eine Geheimschrift folgt einer genauen Regel. Beim Prüfen einzelner Buchstaben merkst du schnell, ob du die Richtung und den Umlauf verstanden hast.",
    demoTitle: "Vorgemacht: ein anderes Caesar-Beispiel mit +2",
    demoSteps: [
      "Nur für dieses Beispiel gilt +2 im Alphabet A bis Z. Starte bei M und gehe zweimal vorwärts: M → N → O.",
      "Das Paar M → O passt deshalb zu +2. Der Startbuchstabe selbst zählt nicht als erster Schritt.",
      "Probiere den Umlauf bei Z: Z → A → B. Also wird Z bei +2 zu B.",
      "In deiner eigentlichen Kartenübung gilt +3 statt +2. Verwende dort drei Schritte und übernimm nicht einfach die Ergebnisse dieses Beispiels.",
    ],
    strategy: ["Lies die vorgegebene Verschiebung und die Richtung Klartext → Geheimtext.", "Gehe vom linken Buchstaben aus die geforderte Zahl von Schritten, gegebenenfalls über Z hinaus.", "Vergleiche deinen Zielbuchstaben mit dem rechten Buchstaben der Karte."],
    misconception: "Verschlüsseln um +3 geht vorwärts, Entschlüsseln derselben Caesar-Regel rückwärts. Beides ist nicht dieselbe Bewegung.",
  },
  "moderne-kryptografie": {
    why: "Bei einer digitalen Nachricht ist nicht nur wichtig, wer sie lesen darf. Manchmal willst du auch prüfen, ob sie unverändert zum erwarteten Schlüssel passt.",
    demoTitle: "Vorgemacht: eine signierte Treffpunkt-Nachricht",
    demoSteps: [
      "Jule hat die fertige Nachricht „Treffen um 14 Uhr“. Ein Signaturverfahren erzeugt dazu mit ihrem privaten Signaturschlüssel eine digitale Signatur.",
      "Jule verschickt Nachricht und Signatur. Der private Schlüssel bleibt geheim und wird nicht mitgeschickt.",
      "Emir hat Jules echten öffentlichen Prüfschlüssel bereits verlässlich erhalten. Damit prüft er die Signatur genau zur empfangenen Nachricht.",
      "Bei unveränderter Nachricht und gültiger Signatur gelingt die Prüfung. Das bedeutet nicht, dass die offen versendete Nachricht dadurch geheim geworden ist.",
    ],
    strategy: ["Suche zuerst, wer mit welchem Schlüssel die Signatur erzeugt.", "Stelle das gemeinsame Senden und Empfangen vor die Prüfung.", "Ordne das Prüfergebnis hinter die Prüfung und unterscheide Herkunft/Unverändertheit von Geheimhaltung."],
    misconception: "Eine Signatur ist keine Verschlüsselung mit vertauschten Schlüsseln. Zum Prüfen braucht man den passenden öffentlichen Schlüssel und muss wissen, wem dieser Schlüssel wirklich gehört.",
  },
  datenschutz: {
    why: "Ein Formular muss nicht alles fragen, was technisch möglich wäre. Ein klarer Zweck hilft, unnötige persönliche Angaben zu vermeiden.",
    demoTitle: "Vorgemacht: die Mensa zählt Essenswünsche",
    demoSteps: [
      "Der festgelegte Zweck lautet nur: zählen, wie viele Portionen Gericht A und wie viele Gericht B gewünscht werden. Es gibt weder Bezahlung noch individuelle Ausgabe oder Rückfragen in diesem Beispiel.",
      "Die gewählte Speise wird für diese Zählung benötigt. Ohne sie ist unklar, zu welchem Gericht eine Stimme gehört.",
      "Die Lieblingsfarbe einer Person hilft bei dieser Zählung nicht. Sie wäre eine zusätzliche Angabe ohne nötigen Beitrag zum Zweck.",
      "Die Vorlage braucht daher keine Lieblingsfarbe. Ob eine echte digitale Umfrage anonym ist, hängt außerdem von technischen Kennungen und Protokollen ab.",
    ],
    strategy: ["Formuliere den ausdrücklich genannten Zweck in einem eigenen Satz.", "Frage bei jedem Feld, ob das Ergebnis ohne diese Angabe noch bestimmt werden kann.", "Trenne erforderliche Angaben von bloß interessanten Zusatzinformationen."],
    misconception: "„Könnte interessant sein“ ist nicht dasselbe wie „für diesen Zweck erforderlich“. Wenige sichtbare Formularfelder garantieren außerdem noch keine Anonymität.",
  },
  "zahlensysteme-runde2": {
    why: "Speichergrößen und Übertragungsmengen werden nicht immer in derselben Einheit angegeben. Vor dem Vergleichen musst du die Einheiten angleichen.",
    demoTitle: "Vorgemacht: 20 Bit mit 4 Byte vergleichen",
    demoSteps: [
      "Lege als gemeinsame Einheit Bit fest. Die Angabe 20 Bit bleibt deshalb unverändert.",
      "Ein Byte enthält 8 Bit. Für 4 Byte rechnest du 4 · 8 = 32 Bit.",
      "Vergleiche jetzt 20 Bit mit 32 Bit. Weil 20 < 32 ist, kommt 20 Bit vor 4 Byte.",
      "Die nackten Zahlen 20 und 4 hätten dich in die falsche Richtung geführt. Erst nach dem Umrechnen sind die Zahlen direkt vergleichbar.",
    ],
    strategy: ["Schreibe jede Kartenangabe in Bit auf; Byte-Werte multiplizierst du mit 8.", "Prüfe, ob du versehentlich eine Bit-Angabe nochmals umgerechnet hast.", "Sortiere die umgerechneten Werte vom kleinsten zum größten."],
    misconception: "Eine größere Zahl vor der Einheit bedeutet nicht automatisch mehr Daten. 20 Bit sind weniger als 4 Byte.",
  },
  "fehler-kompression-runde2": {
    why: "Einfarbige Bereiche in einem einfachen Bild lassen sich als Wiederholungen beschreiben. So musst du nicht jede Farbe einzeln ausschreiben.",
    demoTitle: "Vorgemacht: die andere Pixelzeile SSWWS",
    demoSteps: [
      "Im Beispiel bedeutet S Schwarz und W Weiß. Lies SSWWS von links: Die ersten beiden Zeichen sind gleich, danach wechselt die Farbe. Notiere 2 × S.",
      "Es folgen zwei weiße Pixel. Notiere als nächste Gruppe 2 × W.",
      "Am Ende steht ein einzelnes schwarzes Pixel. Notiere 1 × S; es gehört nicht mehr zur ersten schwarzen Gruppe.",
      "Schreibe 2 × S, 2 × W, 1 × S probeweise wieder aus: SS + WW + S = SSWWS. Genau die Originalzeile entsteht.",
    ],
    strategy: ["Lies die vollständige Originalzeile von links und markiere jeden Farbwechsel.", "Zähle die Länge jeder zusammenhängenden Gruppe und suche die passende Karte.", "Schreibe deine angeordneten Lauflängen zur Kontrolle wieder vollständig aus."],
    misconception: "RLE zählt nicht alle gleichfarbigen Pixel zusammen. Durch eine andere Farbe getrennte Gruppen bleiben getrennt.",
  },
  "datenbanken-runde2": {
    why: "Ein Verein kann viele Eintrittskarten für ein Konzert verkaufen. Beziehungen müssen trotzdem klar sagen, worauf jede einzelne Karte verweist.",
    demoTitle: "Vorgemacht: Veranstaltung und Eintrittskarten",
    demoSteps: [
      "Das andere Modell lautet VERANSTALTUNG → EINTRITTSKARTE: Jede Karte gilt verpflichtend für genau eine Veranstaltung. Eine Veranstaltung darf null oder viele verkaufte Karten haben.",
      "Die Karten E7 und E8 gelten beide nur für das Konzert V2. Das ist erlaubt: Mehrere Karten verweisen auf dieselbe Veranstaltung.",
      "Das neu angelegte Konzert V3 hat noch keine verkaufte Karte. Das ist ebenfalls erlaubt, weil die Mindestzahl auf dieser Seite null beträgt.",
      "Eine einzige Karte E9 zugleich V2 und V3 zuzuordnen, würde dieses Modell verletzen. Dafür wären zwei Karten oder ein anderes Modell nötig.",
    ],
    strategy: ["Lies die Regel aus Sicht genau einer Anmeldung: Zu wie vielen Kursen muss sie gehören?", "Lies dieselbe Beziehung aus Sicht eines Kurses: Wie viele Anmeldungen sind erlaubt?", "Prüfe jeden Vorschlag unabhängig gegen beide Regeln, einschließlich der erlaubten Mindestzahlen."],
    misconception: "Das n in 1:n legt allein keine Mindestzahl fest. Hier erlaubt der Text ausdrücklich einen Kurs ohne Anmeldungen, aber keine Anmeldung ohne Kurs.",
  },
  "sql-runde2": {
    why: "Ein günstiger Artikel hilft dir nicht, wenn er ausverkauft ist. Mit AND kannst du mehrere notwendige Bedingungen gleichzeitig verlangen.",
    demoTitle: "Vorgemacht: eine andere kleine Artikelliste filtern",
    demoSteps: [
      "Die vollständige Beispielliste hat drei Zeilen: D1 Farbpapier, 50 Cent, Bestand 2; D2 Ordner, 150 Cent, Bestand 2; D3 Umschlag, 50 Cent, Bestand 0.",
      "Nur im Beispiel lautet die Bedingung preis_cent <= 100 AND bestand > 0. D1 besteht beide Prüfungen: 50 <= 100 und 2 > 0. Die Zeile bleibt.",
      "D2 scheitert am Preis, obwohl der Bestand positiv ist. D3 scheitert am Bestand, obwohl der Preis passt. Beide Zeilen fallen heraus.",
      "Das Ergebnis enthält deshalb nur D1. In deiner Übung sind andere Zeilen und die Preisgrenze 120 angegeben; wende die Regel dort neu an.",
    ],
    strategy: ["Prüfe für jede Zeile zuerst die Preisgrenze und merke dir wahr oder falsch.", "Prüfe unabhängig davon, ob der Bestand echt größer als 0 ist.", "Lege nur Zeilen mit zweimal wahr ins Ergebnis; kontrolliere besonders die Grenzwerte."],
    misconception: "AND bedeutet nicht „mindestens eine Bedingung reicht“. Außerdem ist <= inklusive Gleichheit, während > 0 den Wert 0 ausschließt.",
  },
  "programmierung-runde2": {
    why: "Ein Programm muss unterscheiden, ob es mit einer Zahl rechnen, einen Text anzeigen oder eine Ja/Nein-Entscheidung speichern soll.",
    demoTitle: "Vorgemacht: 9, \"09\" und false",
    demoSteps: [
      "Der Wert 9 hat keine Anführungszeichen und ist eine ganze Zahl. In unserer Auswahl passt er zum Java-Typ int.",
      "Der Wert \"09\" steht in doppelten Anführungszeichen. Das ist Text vom Typ String; die führende Null gehört zur geschriebenen Zeichenfolge.",
      "false steht ohne Anführungszeichen da und bedeutet falsch. Es ist ein Wert des Typs boolean.",
      "Prüfe also zuerst die Schreibweise, nicht nur das Aussehen der Zeichen. Eine aus Ziffern bestehende Zeichenfolge kann trotzdem Text sein.",
    ],
    strategy: ["Prüfe zuerst, ob doppelte Anführungszeichen die Zeichen umschließen.", "Prüfe bei Werten ohne Anführungszeichen auf true oder false.", "Ordne die übrigen hier verwendeten ganzen Zahlen int zu; ein Minuszeichen ändert daran nichts."],
    misconception: "Eine Telefonnummer oder eine Zahl in Anführungszeichen ist nicht automatisch ein Rechenwert. „Sieht nach Zahl aus“ und „hat einen Zahlentyp“ sind verschiedene Aussagen.",
  },
  "netzwerke-runde2": {
    why: "Wenn ein Computer zu wenig Speicher meldet, ist wichtig, welcher Speicher gemeint ist. Dateiplatz und Arbeitsspeicher erfüllen verschiedene Aufgaben.",
    demoTitle: "Vorgemacht: eine gespeicherte Tonaufnahme bearbeiten",
    demoSteps: [
      "Die Datei interview.wav ist ausdrücklich auf der SSD gespeichert. Dort bleibt sie auch nach vollständigem Ausschalten erhalten.",
      "Beim Öffnen stellt das Programm benötigte Audiodaten im RAM zur Bearbeitung bereit. RAM ist hier der vorübergehende Arbeitsbereich.",
      "Soll ein Zahlenwert der Aufnahme verändert werden, führt die CPU die dafür vorgesehenen Programmbefehle aus. Sie ist nicht der dauerhafte Ablageort der Datei.",
      "Erst ausdrückliches Speichern übernimmt die bearbeitete Fassung wieder in eine Datei. Das ist ein vereinfachtes Modell ohne automatische Sicherungen, Auslagerung und CPU-interne Zwischenspeicher.",
    ],
    strategy: ["Frage zuerst, ob die Karte eine Verarbeitung oder das Bereithalten von Daten beschreibt.", "Unterscheide beim Bereithalten: nur während der Arbeit oder auch ohne Strom?", "Ordne die Hauptaufgabe zu: CPU verarbeitet, RAM hält Arbeitsdaten, SSD bewahrt Dateien auf."],
    misconception: "Mehr freier Platz auf der SSD ist nicht dasselbe wie mehr RAM. Auch eine schnelle CPU ersetzt keinen dauerhaften Dateispeicher.",
  },
};
