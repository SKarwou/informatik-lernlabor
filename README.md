# Informatik-Lernlabor Klasse 11

Eine interaktive Lernanwendung zu Sortieralgorithmen für den Informatikunterricht am KCG.

## Enthaltene Funktionen

- Bubblesort, Selectionsort und Insertionsort
- automatische Wiedergabe und Einzelschritte
- animierte Zahlenbalken
- Zähler für Vergleiche und Vertauschungen
- Erklärungen und Pseudocode
- Lerncheck mit direkter Rückmeldung
- responsive Darstellung für Computer, Tablet und Smartphone

## Webseite veröffentlichen

Die fertig gebaute Webseite liegt im Ordner `docs`. In GitHub unter **Settings → Pages** bei **Source** den Eintrag **Deploy from a branch** auswählen. Anschließend den Branch **main** und den Ordner **/docs** auswählen und speichern.

Nach wenigen Minuten ist die Seite normalerweise unter folgender Adresse erreichbar:

`https://skarwou.github.io/informatik-lernlabor/`

## Lokal bearbeiten

Voraussetzung ist eine aktuelle Node.js-Version.

```bash
npm install
npm run dev
```

Nach Änderungen wird die fertige GitHub-Pages-Version mit folgendem Befehl neu erzeugt:

```bash
npm run build
```

Der Quellcode befindet sich im Ordner `src`.
