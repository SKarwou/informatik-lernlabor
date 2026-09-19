# Informatik-Lernlabor Klasse 11/12

Lernlabor für das Informatik-Wahlfach mit zwölf Kapiteln, interaktiven Übungen, Heftaufgaben und zwei getrennten Projektphasen. Der konkrete Bildungsplan ist abhängig vom Schulversuchsstatus; der geschützte Lehrkraftbereich dokumentiert den Abgleich und noch zu sichernde Inhalte.

## Veröffentlichung auf GitHub Pages

Der bestehende GitHub-Actions-Workflow baut Änderungen auf `main` automatisch und veröffentlicht die Ausgabe. Lokal erzeugt `npm run build` den Ordner `docs`. Dieser Ausgabeordner ist nicht der richtige Ort für Textänderungen.

## Freigaben im Unterricht

- Zwölf Kapitel und beide Projekte besitzen jeweils einen kurzen Freigabecode.
- Erst danach erscheinen Theorie, vorgerechnete Beispiele, Hinweise und Aufgaben.
- Musterlösungen benötigen zusätzlich den getrennten, längeren Lösungscode.
- Der Bildungsplan bleibt hinter einem eigenen Lehrkraft-Passwort.
- Die Werkzeugeinführung in BlueJ, JavaScript und Scratch bleibt frei erreichbar.
- Es gibt keine Schülerkonten, Leistungsaufzeichnung oder automatische Versetzung zum nächsten Kapitel. Die Lehrkraft entscheidet, wann sie einen Code ausgibt.

Kapitelinhalte liegen verschlüsselt in `public/access`, Lösungen und Lehrerplanung in `public/protected`. Entschlüsselte Inhalte bleiben nur im Arbeitsspeicher der geöffneten Seite; Neuladen oder erneutes Sperren schließt sie.

## Inhalte bearbeiten

Öffentliche Texte können weiterhin direkt in GitHub bearbeitet werden, beispielsweise `src/Home.tsx` und `src/ToolsPage.tsx`. `src/components` enthält die Darstellung der Lernbausteine, nicht mehr deren vollständige geschützte Texte.

Die privaten Originaltexte und beide Codelisten müssen **außerhalb dieses öffentlichen Repositorys** aufbewahrt werden. Kapiteltexte stehen im privaten Unterordner `access`, Lösungen und Lehrerplanung in den übrigen privaten JSON-Dateien. Nach einer Änderung werden nur die verschlüsselten Ergebnisse veröffentlicht:

```sh
node scripts/encrypt-access.mjs /absoluter/pfad/zum/privaten/ordner
node scripts/encrypt-content.mjs /absoluter/pfad/zum/privaten/ordner
```

Die GitHub-Automatik benötigt keine Passwörter. Geänderte private Texte lassen sich deshalb nicht einfach als Klartext in diesem öffentlichen Repository pflegen. Keine privaten Originale oder Codelisten auf GitHub hochladen, auch nicht in einen vermeintlich versteckten Ordner.

## Grenzen des Schutzes

Die Verschlüsselung verwendet AES-256-GCM und PBKDF2-SHA-256. Die kurzen Freigabecodes sind absichtlich leicht einzugeben und können weitergegeben oder erraten werden. Bereits veröffentlichte Kapiteltexte können in alten Repository-Versionen oder heruntergeladenen Kopien fortbestehen. Die Freigaben strukturieren Unterricht, sind aber kein sicheres Prüfungssystem.

Ein eventuell noch vorhandener alter Ordner `Informatik-Lernlabor_GitHub-Pages_Ersatz` und frühere Quelltextdateien gehören nicht zur aktuellen Fassung. Das neue Updatepaket enthält sie nicht; beim bloßen Hochladen werden alte Dateien in GitHub nicht automatisch entfernt.
