import { lazy, Suspense, useEffect, useId, useState } from "react";
import { ComputerAssemblyLab } from "./ComputerAssemblyLab";
import "./NetworkDiscoveryHub.css";
const ComputerFlowLab=lazy(()=>import("./ComputerFlowLab"));
const NetworkSandboxLab=lazy(()=>import("./NetworkSandboxLab"));
const WebRequestLab=lazy(()=>import("./WebRequestLab"));
const stations=[
  {title:"Computer auseinandernehmen",short:"Bauteile im räumlichen Modell entdecken",goal:"Was steckt im Gehäuse – und wozu ist jedes Teil da?"},
  {title:"Daten im Computer verfolgen",short:"Eingeben, verarbeiten, speichern",goal:"Wie arbeiten Programm, CPU, RAM und SSD zusammen?"},
  {title:"Ein kleines Netz untersuchen",short:"Kabel schalten und Pakete verfolgen",goal:"Wann genügt ein Switch, wann braucht es einen Router?"},
  {title:"Eine Webseite abrufen",short:"DNS und Webdienst getrennt testen",goal:"Warum kann eine richtige Adresse noch keine Webseite garantieren?"},
];
export default function NetworkDiscoveryHub(){
  const [active,setActive]=useState(0),id=useId();
  useEffect(()=>{if(window.location.hash==="#entdeckerwerkstatt") requestAnimationFrame(()=>document.getElementById("entdeckerwerkstatt")?.scrollIntoView());},[]);
  return <section id="entdeckerwerkstatt" className="network-discovery" aria-labelledby={id+"-title"}>
    <header><span className="network-discovery-kicker">ERST ANKLICKEN · DANN ERKLÄREN</span><h2 id={id+"-title"}>Vom Computer zum Netzwerk</h2><p>Hier darfst du ausprobieren, bevor die Fachbegriffe kommen. Wähle eine der vier Stationen. Jede zeigt nur einen überschaubaren Ausschnitt. Deine bisherigen Texte, Heftaufgaben und FILIUS-Aufträge stehen unverändert weiter unten.</p></header>
    <div className="network-discovery-picker" role="group" aria-label="Entdeckerstation wählen">{stations.map((s,i)=><button key={s.title} aria-pressed={active===i} aria-controls={id+"-panel"} onClick={()=>setActive(i)}><span>0{i+1}</span><strong>{s.title}</strong><small>{s.short}</small></button>)}</div>
    <p className="network-discovery-note">Beim Wechsel startet die gewählte Station neu. Keine Ergebnisse werden gespeichert. Die Modelle verändern weder deinen Rechner noch das Schulnetz.</p>
    <div id={id+"-panel"} className="network-discovery-panel"><p className="network-discovery-goal"><strong>Das findest du heraus:</strong> {stations[active].goal}</p><Suspense fallback={<p role="status">Die Station wird geladen …</p>}>{active===0?<ComputerAssemblyLab/>:active===1?<ComputerFlowLab/>:active===2?<NetworkSandboxLab/>:<WebRequestLab/>}</Suspense></div>
    <details className="network-discovery-filius"><summary>Danach in FILIUS: So findest du dich zurecht</summary><p>Die Modelle oben bereiten das eigenständige Bauen vor. In FILIUS wechselst du zwischen zwei wichtigen Arbeitsansichten:</p><div><article><h3>Entwerfen</h3><p>Geräte platzieren, mit Kabeln verbinden und IP-Adressen samt Netzmaske festlegen. Prüfe dabei auch die Adressen der Router-Schnittstellen.</p></article><article><h3>Ausprobieren</h3><p>Im Aktionsmodus Programme installieren und starten. Teste zunächst die Erreichbarkeit per IP; beobachte anschließend DNS-Anfragen und den Webseitenabruf getrennt.</p></article></div><p>Der Dokumentationsmodus hilft beim Beschriften. In der Datenaustauschansicht kannst du Nachrichten genauer untersuchen. Die genaue Oberfläche hängt von deiner FILIUS-Version ab. Nutze dann den ausführlichen, bisherigen Projektauftrag weiter unten.</p><p className="network-discovery-source">Grundlage für diese kurze Orientierung: Daniel Garmann, <a href="https://www.lernsoftware-filius.de/downloads/Einfuehrung_Filius_2015.pdf" target="_blank" rel="noreferrer">Netzwerke mit FILIUS (2015)</a>, S. 3–8 und 11–17. Eigene Grafiken und Modelle, keine übernommenen PDF-Abbildungen. Die Klick-Idee ist angeregt durch <a href="https://tieferlernen.de/informatik/#computer" target="_blank" rel="noreferrer">Tiefer Lernen: Im Inneren des Computers</a>.</p></details>
  </section>;
}
