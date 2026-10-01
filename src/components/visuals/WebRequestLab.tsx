import { useId, useState } from "react";
import "./WebRequestLab.css";

export type WebModel = { byName: boolean; network: boolean; dns: boolean; web: boolean };
export type WebStep = { title: string; text: string; node: "browser" | "dns" | "router" | "server"; path?: "dns" | "to-router" | "to-server" | "reply"; result?: "success" | "failure" };
export function webRequestSteps(model: WebModel): WebStep[] {
  const steps: WebStep[] = [{ node:"browser", title:"1 · Ziel lesen", text:model.byName ? "Der Browser soll http://labor.schule.test öffnen. Zuerst braucht er die IP-Adresse zum Namen labor.schule.test." : "Der Browser soll http://192.168.20.80 öffnen. Die Ziel-IP steht schon fest. Eine DNS-Anfrage ist dafür hier nicht nötig." }];
  if (!model.network) return [...steps,{node:"browser",title:"Verbindung unterbrochen",text:"Im Modell ist die Verbindung vom Client zum Netz unterbrochen. Der Client erreicht weder DNS noch den Webserver. Schalte die Verbindung wieder ein und starte einen neuen Versuch.",result:"failure"}];
  if (model.byName) {
    steps.push({node:"dns",path:"dns",title:"2 · Adresse erfragen",text:"Der Client fragt den DNS-Dienst nach labor.schule.test. DNS sucht die zugehörige IP-Adresse; es liefert noch keinen Webseiteninhalt."});
    if (!model.dns) return [...steps,{node:"dns",title:"Keine DNS-Antwort",text:"Der DNS-Dienst antwortet im Modell nicht. Weil kein Name zwischengespeichert ist, bleibt die IP unbekannt. Der Webserver kann trotzdem laufen. Probiere anschließend den Aufruf per IP.",result:"failure"}];
    steps.push({node:"dns",path:"dns",title:"DNS antwortet",text:"Die Antwort lautet 192.168.20.80. Der Client kennt jetzt die Zieladresse. Der weitere Webseitenabruf läuft nicht durch den DNS-Dienst."});
  }
  steps.push({node:"router",path:"to-router",title:"Zum anderen Netz",text:"Die Zieladresse gehört zu einem anderen /24-Netz als der Client. Der Client sendet über sein Gateway. Der Router leitet zum Zielnetz weiter; er sucht nicht die Bedeutung des Domainnamens heraus."});
  steps.push({node:"server",path:"to-server",title:"Webdienst anfragen",text:"An der Zieladresse fragt der Browser den Webdienst nach der Startseite. Eine erreichbare IP allein genügt nicht: Dort muss auch der passende Dienst antworten."});
  if (!model.web) return [...steps,{node:"server",title:"Webdienst gestoppt",text:"Die Adresse stimmt, die Verbindung funktioniert, aber der Webdienst ist ausgeschaltet. DNS kann diesen Fehler nicht beheben. Schalte den Webdienst ein und probiere erneut.",result:"failure"}];
  return [...steps,{node:"browser",path:"reply",title:"Webseite anzeigen",text:"Der Webserver liefert den Seiteninhalt zurück. Der Browser stellt ihn dar. Adresse ermitteln und Inhalt abrufen sind zwei unterschiedliche Aufgaben.",result:"success"}];
}
const roles = {
  browser:{name:"Client / Browser",text:"Der Browser ist ein Programm auf dem Client. Er fordert Inhalte an und stellt die Antwort dar. Unser Client gehört zu 192.168.10.0/24."},
  dns:{name:"DNS-Dienst",text:"DNS ordnet im Modell genau den Namen labor.schule.test der IP 192.168.20.80 zu. Der DNS-Dienst kennt nicht automatisch den Inhalt der Seite und ist kein Umweg für den Webseitenabruf."},
  router:{name:"Router / Gateway",text:"Der Router verbindet die Netze 192.168.10.0/24 und 192.168.20.0/24. Seine Schnittstelle im Clientnetz dient dem Client als Gateway. Routing und Namensauflösung sind verschiedene Aufgaben."},
  server:{name:"Server / Webdienst",text:"Ein Server ist hier ein Rechner, auf dem ein Webdienst läuft. Der Rechner kann erreichbar sein, obwohl dieser Dienst gestoppt ist. Deshalb beweist ein erfolgreicher Ping noch keine funktionierende Webseite."},
};
const positions = { browser:[115,190], dns:[345,65], router:[345,240], server:[580,240] } as const;

export default function WebRequestLab() {
  const id=useId();
  const [model,setModel]=useState<WebModel>({byName:true,network:true,dns:true,web:true});
  const [step,setStep]=useState(-1);
  const [selected,setSelected]=useState<keyof typeof roles>("browser");
  const steps=webRequestSteps(model), current=steps[step];
  function change(key:keyof WebModel,value:boolean){setModel({...model,[key]:value});setStep(-1);}
  function advance(){const next=Math.min(step+1,steps.length-1);setStep(next);setSelected(steps[next].node);}
  return <section className="webrequest-lab" aria-labelledby={id+"-title"}>
    <span className="webrequest-kicker">ADRESSE IST NICHT INHALT</span><h3 id={id+"-title"}>Warum geht die Webseite nicht?</h3>
    <p>Du hast ein funktionierendes kleines Netz eingerichtet. Jetzt untersuchst du die Dienste: Was ändert sich, wenn DNS oder der Webdienst ausfällt? Klicke zuerst einen Baustein an. Starte danach den Abruf und gehe Nachricht für Nachricht weiter.</p>
    <div className="webrequest-settings"><label>Ziel im Browser<select value={model.byName?"name":"ip"} onChange={e=>change("byName",e.target.value==="name")}><option value="name">Name: labor.schule.test</option><option value="ip">IP: 192.168.20.80</option></select></label>
      <div className="webrequest-switches"><label><input type="checkbox" checked={model.network} onChange={e=>change("network",e.target.checked)}/> Client mit dem Netz verbunden</label><label><input type="checkbox" checked={model.dns} onChange={e=>change("dns",e.target.checked)}/> DNS-Dienst eingeschaltet</label><label><input type="checkbox" checked={model.web} onChange={e=>change("web",e.target.checked)}/> Webdienst eingeschaltet</label></div>
    </div>
    <figure className="webrequest-figure"><svg viewBox="0 0 700 330" role="img" aria-labelledby={id+"-diagram"}>
      <title id={id+"-diagram"}>Zwei getrennte Abläufe: DNS-Austausch mit dem Namensdienst und Seitenabruf über den Router zum Webserver. Die Grafik zeigt logische Wege, keine vollständige Verkabelung.</title>
      <path d="M115 150 Q140 65 270 65" className={current?.path==="dns"?"webrequest-path active":"webrequest-path"}/><text x="125" y="60">Name ↔ IP</text>
      <path d="M180 210 L270 240" className={current?.path==="to-router"||current?.path==="reply"?"webrequest-path active":"webrequest-path"}/>
      <path d="M420 240 L505 240" className={current?.path==="to-server"||current?.path==="reply"?"webrequest-path active":"webrequest-path"}/><text x="204" y="296">Anfrage →</text><text x="447" y="296">← Antwort</text>
      {(Object.keys(roles) as (keyof typeof roles)[]).map(key=>{const [x,y]=positions[key];return <g key={key} className={`webrequest-node ${current?.node===key?"current":""} ${selected===key?"selected":""}`} onClick={()=>setSelected(key)}><rect x={x-75} y={y-34} width="150" height="68" rx="13"/><text x={x} y={y-4} textAnchor="middle">{key==="browser"?"Browser":key==="dns"?"DNS":key==="router"?"Router":"Webserver"}</text><text className="webrequest-sub" x={x} y={y+19} textAnchor="middle">{key==="server"?"192.168.20.80":key==="dns"?(model.dns?"Dienst an":"Dienst aus"):key==="router"?"zwischen den Netzen":"192.168.10.10"}</text></g>})}
      {current && <circle key={step} className="webrequest-pulse" cx={positions[current.node][0]} cy={positions[current.node][1]-45} r="8"/>}
    </svg><figcaption>Logische Übersicht: Der DNS-Austausch wird getrennt gezeigt. Seine Netzübertragung, Switches und Router-Schnittstellen sind hier ausgeblendet. Die Kabel siehst du in der Netzwerkwerkstatt.</figcaption></figure>
    <div className="webrequest-role-buttons" role="group" aria-label="Netzwerkrolle erklären">{(Object.keys(roles) as (keyof typeof roles)[]).map(key=><button key={key} aria-pressed={selected===key} onClick={()=>setSelected(key)}>{roles[key].name}</button>)}</div>
    <aside className="webrequest-role" aria-live="polite"><strong>{roles[selected].name}</strong><p>{roles[selected].text}</p></aside>
    <div className="webrequest-controls"><button onClick={advance} disabled={step===steps.length-1}>{step<0?"Abruf starten":"Nächste Nachricht →"}</button><button onClick={()=>setStep(Math.max(-1,step-1))} disabled={step<0}>← Zurück</button><button onClick={()=>setStep(-1)}>Versuch neu starten</button></div>
    <div className={`webrequest-step ${current?.result||""}`} role="status">{current?<><span>Schritt {step+1} von {steps.length}</span><h4>{current.title}</h4><p>{current.text}</p>{current.result==="success"&&<div className="webrequest-page"><span>Antwort im Modellbrowser</span><strong>Willkommen im Schullabor!</strong><p>Dieser Inhalt kommt vom Webdienst, nicht vom DNS.</p></div>}</>:<p>Bereit. Sage zuerst voraus, ob die gewählten Einstellungen funktionieren. Jede Änderung oben setzt den Versuch zurück.</p>}</div>
    <details><summary>Drei kleine Experimente · mit Beobachtungshilfe</summary><ol><li>Schalte nur DNS aus. Teste den Namen und danach die IP. Warum kann die IP noch funktionieren?</li><li>Schalte DNS wieder ein, aber den Webdienst aus. Teste beide Zielarten. Was ist jetzt anders?</li><li>Schalte alles ein. Gehe jeden Schritt durch und sage jeweils: „Wird gerade eine Adresse gesucht, eine Nachricht weitergeleitet oder Inhalt geliefert?“</li></ol><p><strong>Prüfhilfe:</strong> Ohne DNS scheitert hier nur der frische Namensaufruf. Ohne Webdienst scheitern beide. Ohne Netzverbindung erreicht der Client keinen der Dienste.</p></details>
    <p className="webrequest-limit">Vereinfachtes, rein lokales Modell: kein DNS-Cache, keine Firewall, feste gültige IP-Konfiguration, keine Darstellung von ARP, TCP-Aufbau, TLS oder mehreren DNS-Servern. Die .test-Adresse existiert nur im Modell; es werden keine echten Webseiten oder Rechner kontaktiert.</p>
  </section>;
}
