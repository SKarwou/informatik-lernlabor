// Nur lokal mit dem privaten Lehrkraftordner ausführen. Keine Passwörter im Repository.
// Aufruf: node scripts/encrypt-content.mjs /absoluter/pfad/zum/privaten/ordner
import fs from 'node:fs';
import path from 'node:path';
import { randomBytes, pbkdf2Sync, createCipheriv } from 'node:crypto';
const privateDir = process.argv[2];
if (!privateDir || !path.isAbsolute(privateDir)) throw Error('Bitte einen absoluten Pfad zum privaten Lehrkraftordner angeben.');
const root = path.resolve(import.meta.dirname, '..');
if (path.resolve(privateDir) === root || path.resolve(privateDir).startsWith(root + path.sep)) throw Error('Der private Ordner muss außerhalb des öffentlichen Projekts liegen.');
const passwordPath = path.join(privateDir, 'passwords.json');
const passwords = fs.existsSync(passwordPath) ? JSON.parse(fs.readFileSync(passwordPath, 'utf8')) : {};
const titles = {
  zahlensysteme:'01.1 Zahlensysteme', 'fehler-kompression':'01.2 Fehlererkennung & Kompression',
  datenbanken:'01.3 Datenbanken', sql:'01.4 SQL', programmierung:'02.1 Strukturierte Programmierung',
  sortieren:'02.2 Arrays & Sortieren', oop:'02.3 Objektorientierung', netzwerke:'03.1 Rechnernetze',
  schaltnetze:'03.2 Schaltnetze', 'klassische-kryptografie':'04.1 Klassische Kryptografie',
  'moderne-kryptografie':'04.2 Moderne Kryptografie', datenschutz:'04.3 Datenschutz',
  werkzeuge:'Erste Schritte: BlueJ, JavaScript & Scratch', 'projekt-1':'Projekt 1 Lösungen', 'projekt-2':'Projekt 2 Lösungen', bildungsplan:'Bildungsplan & Zweijahresplan (Lehrkraft)'
};
const output = path.join(root,'public/protected');
fs.mkdirSync(output,{recursive:true});
for (const [scope,title] of Object.entries(titles)) {
  const source = path.join(privateDir,scope+'.json');
  if(!fs.existsSync(source)) throw Error('Privater Inhalt fehlt: '+scope);
  const plaintext = fs.readFileSync(source);
  const parsed = JSON.parse(plaintext);
  if (parsed.version !== 1 || (!Array.isArray(parsed.entries) && !parsed.html)) throw Error('Ungültiger Inhalt: '+scope);
  if (parsed.entries && new Set(parsed.entries.map(entry=>entry.id)).size !== parsed.entries.length) throw Error('Doppelte Lösungs-ID in '+scope);
  if(!passwords[scope]) {
    const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const length = scope==='bildungsplan' ? 20 : 16;
    let code='';
    while(code.length < length){ for(const byte of randomBytes(length)){ if(byte < Math.floor(256/alphabet.length)*alphabet.length && code.length<length) code+=alphabet[byte%alphabet.length]; } }
    passwords[scope] = code.match(/.{1,4}/g).join('-');
  }
  const salt=randomBytes(16), iv=randomBytes(12);
  const key=pbkdf2Sync(passwords[scope],salt,600000,32,'sha256');
  const cipher=createCipheriv('aes-256-gcm',key,iv);
  cipher.setAAD(Buffer.from(scope));
  const ciphertext=Buffer.concat([cipher.update(plaintext),cipher.final(),cipher.getAuthTag()]);
  fs.writeFileSync(path.join(output,scope+'.json'),JSON.stringify({format:'AES-GCM-PBKDF2-v1',iterations:600000,salt:salt.toString('base64'),iv:iv.toString('base64'),ciphertext:ciphertext.toString('base64')}));
}
fs.writeFileSync(passwordPath,JSON.stringify(passwords,null,2),{mode:0o600});
let guide='# Informatik-Lernlabor · vertrauliche Codes für die Lehrkraft\n\nStand: 19. September 2026. Diese Datei nicht auf GitHub oder auf die Website hochladen.\n\n';
guide+='Jedes Kapitel und beide Projekte besitzen einen kurzen Freigabecode. Danach sind Theorie, vorgerechnete Beispiele und Hinweise zugänglich. Die hier aufgeführten zusätzlichen Lösungscodes öffnen nur die Musterlösungen. Der Bildungsplan hat ein getrenntes Lehrkraft-Passwort.\n\n';
guide+='| Bereich | Code |\n| --- | --- |\n'+Object.entries(titles).map(([scope,title])=>'| '+title+' | `'+passwords[scope]+'` |').join('\n');
guide+='\n\n## Benutzung\n\n1. Kapitel zunächst mit dem kurzen Freigabecode öffnen; die freie Werkzeugeinführung benötigt diesen nicht.\n2. Bei „Lösungscode“ den passenden zusätzlichen Code eingeben.\n3. Musterlösungen einzeln aufklappen. „Lösungen wieder sperren“ schließt sie. Beim Neuladen wird ebenfalls gesperrt.\n4. Nur gerade benötigte Codes an die Klasse weitergeben. Den Bildungsplan-Code ausschließlich selbst verwenden.\n\nDie Pakete sind mit AES-256-GCM verschlüsselt; die Schlüssel werden aus den Codes mit PBKDF2-SHA-256 (600.000 Durchläufe) abgeleitet. Passwörter und entschlüsselte Inhalte werden nicht dauerhaft im Browser gespeichert. Kurze Freigabecodes können erraten oder weitergegeben werden. Bereits früher veröffentlichte Inhalte können weiterhin in alten GitHub-Versionen oder Kopien existieren. Dieser Unterrichtsschutz ist kein Prüfungssystem.\n\n## Inhalte später ändern\n\nÖffentliche Texte stehen etwa in src/Home.tsx und src/ToolsPage.tsx. Geschützte Kapiteltexte befinden sich im privaten Unterordner access, Lösungen und Bildungsplan in den übrigen privaten JSON-Dateien. Nach Textänderungen im öffentlichen Projekt scripts/encrypt-access.mjs bzw. scripts/encrypt-content.mjs mit dem absoluten Pfad dieses privaten Ordners ausführen. Nur die aktualisierten verschlüsselten Dateien aus public/access bzw. public/protected veröffentlichen. Die Dateien access-codes.json und passwords.json enthalten die getrennten Codes; bei Änderungen erneut verschlüsseln. Die GitHub-Automatik benötigt keine Passwörter. Private Originale niemals ins öffentliche Repository hochladen.\n';
fs.writeFileSync(path.join(privateDir,'Passwoerter-NUR-LEHRKRAFT.md'),guide,{mode:0o600});
console.log(Object.keys(titles).length+' geschützte Bereiche erzeugt. Vertrauliche Codes ausschließlich im privaten Lehrkraftordner.');
