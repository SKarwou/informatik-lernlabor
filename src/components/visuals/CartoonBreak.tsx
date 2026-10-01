import "./CartoonBreak.css";

const cartoons = {
  zahlensysteme: {
    file:"infobit-binary.png",
    alt:"Ein Roboter betrachtet leuchtende und ausgeschaltete Lampen. Eine weitere ausgeschaltete Lampe schläft gemütlich auf einem Kissen.",
    joke:"„Ich bin nicht faul. Ich stelle gerade eine Null dar.“",
    question:"Ist eine 0 in einer Binärzahl überflüssig? Was unterscheidet 10₂ von 1₂?",
    explanation:"Eine 0 ist ein gültiger Bitwert, kein fehlendes Bit. Bei 10₂ bleibt die 1 auf der 2er-Stelle: Der Wert ist 2. Bei 1₂ steht sie auf der 1er-Stelle: Der Wert ist 1. Die Lampen sind nur eine Metapher; echte Bits werden nicht durch schlafende Glühbirnen gespeichert.",
  },
  "fehler-kompression": {
    file:"infobit-compression.png",
    alt:"Ein freundlicher Roboter wickelt ein sehr langes Band gleichfarbiger grüner Pixel auf eine winzige Spule.",
    joke:"„Die Pixel wollten alle einzeln anreisen. Ich habe eine Gruppenbuchung gemacht.“",
    question:"Wie kann man viele direkt aufeinanderfolgende gleiche Pixel kürzer beschreiben, ohne ihre Anzahl zu verlieren?",
    explanation:"Bei der Lauflängencodierung speichert man für eine Folge gleicher Pixel ihre Anzahl und den Farbwert statt jeden Farbwert einzeln. Die vereinbarte Darstellung muss eindeutig lesbar sein, damit sich die ursprüngliche Folge vollständig wiederherstellen lässt. Lange Wiederholungen können so Speicher sparen; bei häufigen Farbwechseln kann die Darstellung sogar länger werden. Die Spule ist nur eine Metapher: Physisches Aufwickeln allein komprimiert keine digitalen Daten.",
  },
  datenbanken: {
    file:"infobit-database.png",
    alt:"Ein Roboter-Bibliothekar sucht mit einer großen Lupe in geordneten Karteikästen. Ein Buch schaut seitlich hervor.",
    joke:"„Zwei Bücher heißen gleich? Gut, dass ich nicht nur nach dem Namen gehe!“",
    question:"Warum ist ein Buchtitel oft kein geeigneter Primärschlüssel?",
    explanation:"Verschiedene Bücher können denselben Titel haben. Ein festgelegter eindeutiger Schlüssel unterscheidet die Datensätze trotzdem. Ein Fremdschlüssel verweist auf einen passenden Datensatz einer anderen Tabelle. Die Karteikästen veranschaulichen Ordnung; eine Datenbank ist nicht einfach ein fotografierter Karteikasten.",
  },
  sql: {
    file:"infobit-sql.png",
    alt:"Ein Roboter hält ein großes Sieb über einer Ablage. Buchkarten mit grünem Kreis gelangen hinein; Karten mit orangefarbenem Dreieck bleiben außerhalb.",
    joke:"„Mein Sieb ist wählerisch: Nur wer die WHERE-Bedingung erfüllt, kommt auf die Ergebnisliste.“",
    question:"Löscht eine SELECT-Abfrage mit WHERE die Datensätze, die nicht zur Bedingung passen?",
    explanation:"Nein. WHERE filtert bei dieser SELECT-Abfrage die Zeilen des Ergebnisses: Nur Datensätze, für die die Bedingung wahr ist, erscheinen darin. Die gespeicherten Datensätze bleiben unverändert. Welche Spalten gezeigt werden, legt die Auswahl hinter SELECT fest; eine gewünschte Reihenfolge legt ORDER BY fest. Das Sieb ist eine Metapher für die Bedingungsprüfung, kein mechanisches Bauteil einer Datenbank.",
  },
  programmierung: {
    file:"infobit-bug.png",
    alt:"Ein Laptop als Detektiv untersucht mit einer Lupe einen kleinen Käfer auf einer Codezeile.",
    joke:"„Bug gefunden! Er hat sechs Beine. Der Fehler im Programm leider nicht.“",
    explanation:"Ein Bug ist ein Fehler im Programm. Debugging heißt: systematisch herausfinden, wo das tatsächliche Verhalten von deiner Erwartung abweicht. Eine Lupe für den Code sind zum Beispiel Testfälle und die schrittweise Ausführung.",
  },
  sortieren: {
    file:"infobit-sort.png",
    alt:"Ein kleiner Roboter steht neben nach Größe geordneten Bausteinen; ein orangefarbener Baustein läuft ungeduldig heran.",
    joke:"„Bitte hinten anstellen! Hier wird nach Größe sortiert – nicht nach Ungeduld.“",
    explanation:"Ein Sortierverfahren braucht ein klares Vergleichskriterium. Bei Zahlen kann das der Wert sein, bei Dateien zum Beispiel der Name oder die Größe. Zuerst legen wir Vergleichskriterium und Sortierrichtung fest. Bei gleichen Werten brauchen wir gegebenenfalls eine zusätzliche Regel; ein stabiles Sortierverfahren erhält ihre ursprüngliche Reihenfolge.",
  },
  oop: {
    file:"infobit-objects.png",
    alt:"Ein größerer Roboter betrachtet einen Bauplan und zwei ähnliche kleine Roboter: einen mit Schal, einen mit Mütze.",
    joke:"„Gleicher Bauplan. Eigener Stil. Ich bin ein Objekt, kein Gruppenzwang!“",
    question:"Müssen zwei Objekte derselben Klasse dieselben Attributwerte haben?",
    explanation:"Nein. Die Klasse legt gemeinsame Eigenschaften und Methoden fest. Jedes Objekt besitzt seinen eigenen Zustand: Zwei Roboterobjekte könnten verschiedene Namen oder Kleidungswerte haben. Das Ändern eines Objekts verändert ein anderes unabhängiges Objekt nicht automatisch. Zwei Referenzen auf dasselbe Objekt sind dagegen keine zwei unabhängigen Objekte.",
  },
  netzwerke: {
    file:"infobit-network.png",
    alt:"Ein vermenschlichtes Datenpaket mit Briefumschlag steht ratlos vor einem Router mit mehreren Wegweisern.",
    joke:"„Bin ich schon im Internet? – Ja. Aber frag den Router nach dem nächsten Weg.“",
    question:"Kennt jedes Datenpaket den vollständigen Weg bis zum Ziel?",
    explanation:"Ein IP-Paket trägt unter anderem eine Zieladresse. Router treffen anhand ihrer Weiterleitungsinformationen die Entscheidung über den nächsten Wegabschnitt. Das Paket denkt und fragt natürlich nicht selbst. Mehrere Pakete können unterschiedliche Wege nehmen; die Cartoonfigur ist nur eine anschauliche Metapher.",
  },
  schaltnetze: {
    file:"infobit-logic.png",
    alt:"Zwei kleine Roboter bedienen getrennte Druckknöpfe und betrachten gemeinsam eine leuchtende Glühbirne.",
    joke:"„Beim UND geht mir erst ein Licht auf, wenn ihr beide mitmacht.“",
    question:"A ist 1, B ist 0: Was liefern UND und ODER jeweils?",
    explanation:"UND liefert nur dann 1, wenn beide Eingänge 1 sind; hier also 0. ODER braucht mindestens einen Eingang mit Wert 1; hier ist das Ergebnis 1. Das Bild ist eine humorvolle Szene, kein verdrahteter Schaltplan. Die genaue Regel bestimmt das gewählte Gatter.",
  },
  "klassische-kryptografie": {
    file:"infobit-crypto.png",
    alt:"Ein kleiner Roboter hält einen winzigen Schlüssel vor eine riesige verschlossene Truhe.",
    joke:"„Meine Geheimschrift ist absolut sicher. Außer jemand probiert die anderen 25 Schlüssel.“",
    question:"Weshalb schützt eine Caesar-Verschiebung keine heutigen Geheimnisse?",
    explanation:"Bei einem Alphabet aus 26 Buchstaben gibt es nur 26 mögliche Verschiebungen einschließlich 0. Alle lassen sich schnell ausprobieren. Die 25 anderen Möglichkeiten im Witz sind die Alternativen zur gerade verwendeten Verschiebung. Die Größe der Truhe sagt nichts über die Sicherheit des Verfahrens aus.",
  },
  "moderne-kryptografie": {
    file:"infobit-publickey.png",
    alt:"Ein Roboter hält einen kleinen Schlüssel neben einem Briefkasten. Oben steckt ein Umschlag im Einwurfschlitz; die separate Entnahmetür darunter ist abgeschlossen.",
    joke:"„Einwerfen dürfen alle. Meinen Schlüssel gibt es trotzdem nicht im Gruppenchat.“",
    question:"Welcher Schlüssel darf beim asymmetrischen Verschlüsseln öffentlich sein – und welcher muss geheim bleiben?",
    explanation:"Mit dem öffentlichen Schlüssel des Empfängers kann eine Nachricht für ihn verschlüsselt werden. Zum Entschlüsseln wird sein zugehöriger privater Schlüssel benötigt; den hält er geheim. Der frei zugängliche Einwurf und die verschlossene Entnahmetür veranschaulichen diese unterschiedlichen Möglichkeiten. Echte digitale Schlüssel sind mathematische Größen, keine Metallteile. Die Metapher beschreibt Verschlüsselung für Vertraulichkeit, nicht das Erstellen oder Prüfen einer digitalen Signatur; auch die Echtheit eines öffentlichen Schlüssels muss geprüft werden.",
  },
  datenschutz: {
    file:"infobit-privacy.png",
    alt:"Ein nachdenklicher Roboter präsentiert am Formularkiosk einen überlangen Fragebogen mit leeren Feldern. Daneben liegen eine Pizzascheibe, ein Schuh und ein Lineal.",
    joke:"„Eine Pizza, bitte. – Gern! Erst noch die Schuhgröße Ihrer Pizza.“",
    question:"Welche Angaben braucht eine reine Zählung gewünschter Pizzasorten – und welche im Bild ganz sicher nicht?",
    explanation:"Für die reine Zählung genügen die gewünschte Sorte und die Anzahl. Schuhgröße oder Körpermaße tragen zu diesem Zweck nichts bei. Bei einem anderen Zweck, etwa einer tatsächlichen Lieferung, können zusätzliche Angaben nötig sein; man prüft das jeweils neu. Datensparsamkeit beginnt also schon beim Entwurf des Formulars. Verschlüsselung schützt Inhalte, macht unnötig erhobene Angaben aber nicht plötzlich erforderlich. Der überlange Fragebogen übertreibt diese Denkfalle bewusst.",
  },
} as const;

export default function CartoonBreak({slug}: {slug:string}) {
  if (!(slug in cartoons)) return null;
  const item=cartoons[slug as keyof typeof cartoons];
  return <aside className="cartoon-break" aria-label="Kleine Informatik-Pause">
    <img src={`${import.meta.env.BASE_URL}illustrations/${item.file}`} alt={item.alt} loading="lazy" decoding="async" width="1536" height="1024" />
    <div><span className="cartoon-kicker">INFORMATIK DARF AUCH SPASS MACHEN</span><p className="cartoon-joke">{item.joke}</p>{"question" in item && <p className="cartoon-question"><strong>Kurz weiterdenken:</strong> {item.question}</p>}<details><summary>Was steckt fachlich dahinter?</summary><p>{item.explanation}</p></details><small>Eigenes KI-generiertes Cartoonmotiv zur Auflockerung – kein exaktes Fachdiagramm.</small></div>
  </aside>;
}
