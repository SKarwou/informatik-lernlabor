// Kurze Unterrichtscodes und Kapiteltexte bleiben außerhalb des öffentlichen Repositorys.
import fs from 'node:fs';
import path from 'node:path';
import {randomBytes,randomInt,pbkdf2Sync,createCipheriv} from 'node:crypto';
const dir=process.argv[2];
const root=path.resolve(import.meta.dirname,'..');
if(!dir || !path.isAbsolute(dir) || path.resolve(dir).startsWith(root+path.sep) || path.resolve(dir)===root) throw Error('Privaten Lehrkraftordner außerhalb des Projekts angeben.');
const titles={
  zahlensysteme:'1.1 Bits Bytes und Zahlensysteme','fehler-kompression':'1.2 Fehlererkennung und Kompression',
  datenbanken:'1.3 Datenbanken',sql:'1.4 SQL',programmierung:'2.1 Strukturierte Programmierung',
  sortieren:'2.2 Arrays und Sortierverfahren',oop:'2.3 Objektorientierung',netzwerke:'3.1 Rechnernetze',
  schaltnetze:'3.2 Schaltnetze','klassische-kryptografie':'4.1 Klassische Kryptografie',
  'moderne-kryptografie':'4.2 Moderne Kryptografie',datenschutz:'4.3 Datenschutz',
  'projekt-1':'Projekt 1','projekt-2':'Projekt 2'
};
const file=path.join(dir,'access-codes.json');
const codes=fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):{};
const words=['mango','tiger','wolke','insel','kakao','lampe','birke','adler','honig','zebra','panda','falke','palme','nadel','segel','apfel','sonne','perle'];
fs.mkdirSync(path.join(root,'public/access'),{recursive:true});
for(const [scope,title] of Object.entries(titles)){
  const payload=fs.readFileSync(path.join(dir,'access',scope+'.json'));
  const parsed=JSON.parse(payload);
  if(parsed.version!==1 || !['chapter','project'].includes(parsed.kind)) throw Error('Falsches Inhaltsformat '+scope);
  if(!codes[scope]) {
    do { codes[scope]=words[randomInt(words.length)]+randomInt(100,1000); } while(Object.entries(codes).some(([key,value])=>key!==scope&&value===codes[scope]));
  }
  const salt=randomBytes(16),iv=randomBytes(12);
  const key=pbkdf2Sync(codes[scope].trim().toLowerCase(),salt,600000,32,'sha256');
  const cipher=createCipheriv('aes-256-gcm',key,iv);
  cipher.setAAD(Buffer.from('access/'+scope));
  const ciphertext=Buffer.concat([cipher.update(payload),cipher.final(),cipher.getAuthTag()]);
  fs.writeFileSync(path.join(root,'public/access',scope+'.json'),JSON.stringify({format:'AES-GCM-PBKDF2-v1',iterations:600000,salt:salt.toString('base64'),iv:iv.toString('base64'),ciphertext:ciphertext.toString('base64')}));
}
fs.writeFileSync(file,JSON.stringify(codes,null,2),{mode:0o600});
const guide='# Freigabecodes nur für die Lehrkraft\n\nDiese Datei nicht auf GitHub veröffentlichen. Die Codes öffnen Kapitel bzw. Projekte, nicht die Musterlösungen.\n\n| Bereich | Freigabecode |\n|---|---|\n'+Object.entries(titles).map(([id,title])=>'| '+title+' | '+codes[id]+' |').join('\n')+'\n\n## Freigabe im Unterricht\n\nDas erste Kapitel benötigt ebenfalls einen Startcode. Gib nach einem kurzen Diagnosecheck, einer Heftprobe und der mündlichen Erklärung des Minimalziels den nächsten Code individuell oder für die Lerngruppe aus. Es gibt keine automatische Lernstandsprüfung und keine Speicherung personenbezogener Lernfortschritte. Stärkere Lernende bearbeiten zunächst die Vertiefungsaufgaben oder erhalten gezielt den nächsten Code.\n\nDie zwei Projekte öffnen unabhängig voneinander. Groß- und Kleinschreibung sind egal. Neuladen oder „wieder sperren“ schließt die Inhalte. Die vorhandenen längeren Lösungscodes bleiben separat.\n\nKurze geteilte Codes sind eine Unterrichtssperre und kein zuverlässiger Prüfungsschutz. Die Inhalte sind verschlüsselt, aber kurze Codes können erraten und weitergegeben werden. Alte öffentliche Versionen bleiben möglicherweise in GitHub-Historie und Downloads erhalten.\n';
fs.writeFileSync(path.join(dir,'Freigabecodes-NUR-LEHRKRAFT.md'),guide,{mode:0o600});
console.log('14 Zugänge verschlüsselt. Codes ausschließlich privat gespeichert.');
