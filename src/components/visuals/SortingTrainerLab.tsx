import { useEffect, useId, useMemo, useState } from "react";
import { applySortChoice, createSortState } from "./sortingTrainerModel";
import type { SortAlgorithm, SortChoice, SortStep } from "./sortingTrainerModel";
import "./SortingTrainerLab.css";

const algorithms: { key: SortAlgorithm; name: string; short: string; everyday: string; steps: string[]; warning: string; question: string }[] = [
  { key:"bubble", name:"Bubble Sort", short:"Nachbarn vergleichen", everyday:"Stell dir eine Reihe von Büchern vor, die nach ihrer Höhe geordnet werden soll. Du prüfst immer zwei direkte Nachbarn. Das größere Buch rückt nach rechts – bis am Ende der Runde das größte noch ungeordnete Buch ganz rechts steht.", steps:["Die zwei umrandeten Karten sind dran. Vergleiche ihre Zahlen: Ist die linke größer als die rechte?", "Entscheide: Tauschen oder stehen lassen. Bei gleichen Zahlen wird nicht getauscht. Erst deine richtige Entscheidung bewegt die Karten.", "Schau dir das Ergebnis an. Mit „Nächster Schritt“ gehst du zum nächsten Paar. Nach einer Runde beginnt die Suche wieder links; der fertige rechte Teil bleibt liegen."], warning:"Nach einer Runde ist noch nicht unbedingt die ganze Liste sortiert. Sicher an seinem endgültigen Platz ist zunächst nur das größte noch ungeordnete Element rechts.", question:"Warum wird der rechte, bereits fertige Teil in der nächsten Runde nicht noch einmal verglichen?" },
  { key:"insertion", name:"Insertion Sort", short:"Eine Karte einsortieren", everyday:"So ähnlich ordnest du Spielkarten in deiner Hand: Links liegen schon geordnete Karten. Eine neue Karte wird so weit nach links bewegt, bis sie an die passende Stelle gehört.", steps:["Die Karte mit „einsortieren“ wird mit ihrem linken Nachbarn verglichen. Der linke Teil war vor dem Einsortieren bereits geordnet.", "Ist die einzusortierende Karte kleiner? Schiebe sie einen Platz nach links. Ist sie gleich groß oder größer, lass sie hier stehen.", "Jeder Links-Schritt tauscht hier zwei Nachbarn. Am linken Rand ist die Karte automatisch angekommen. Danach wird die nächste Karte aus dem rechten Teil einsortiert."], warning:"Dieser Trainer nutzt die Nachbartauschvariante: Wir zählen echte Tausche. Die Schlüsselvariante in der Heftaufgabe speichert einen Wert zwischen und zählt Verschiebungen/Einsetzungen anders. Ein geordneter Präfix ist noch nicht unbedingt endgültig: Eine spätere kleinere Karte kann sich davor einfügen.", question:"Was passiert beim Einsortieren einer neuen Karte, die kleiner ist als alle Karten im bereits geordneten Teil?" },
  { key:"selection", name:"Selection Sort", short:"Das Minimum suchen", everyday:"Du möchtest Sportergebnisse vom kleinsten zum größten Wert aufschreiben. Du suchst zuerst den kleinsten verbliebenen Wert und setzt ihn nach vorn. Dann suchst du im übrigen Teil erneut.", steps:["Vergleiche „Minimum bisher“ mit „Suchwert“. Die Karten müssen keine Nachbarn sein. Wähle den kleineren Wert; bei Gleichstand behältst du das bisherige Minimum.", "Während der Suche bewegen sich die Karten nicht. Nur die Markierung des bisher kleinsten Werts kann wechseln.", "Erst nach der vollständigen Suche drückst du „Minimum nach vorn setzen“. Es tauscht mit der ersten noch ungeordneten Karte. Steht es dort schon, ist kein Tausch nötig."], warning:"Selection Sort tauscht nicht schon bei jedem kleineren Fund. Erst wird der gesamte noch ungeordnete Bereich durchsucht, dann wird das gefundene Minimum nach vorn gesetzt.", question:"Warum darf Selection Sort nicht einfach den ersten kleineren Wert auswählen und die Suche sofort beenden?" },
];
const examples = [
  {name:"Zum Einstieg · vier Karten", values:[4,2,3,1]},
  {name:"Fast geordnet · fünf Karten", values:[1,2,4,3,5]},
  {name:"Doppelte Werte · fünf Karten", values:[3,1,3,2,2]},
  {name:"Rückwärts · sechs Karten", values:[6,5,4,3,2,1]},
];
type Review = { before:SortStep; explanation:string };

function optionsFor(state:SortStep): {choice:SortChoice; label:string; detail:string}[] {
  if(state.phase==="done") return [];
  if(state.phase==="place") return [{choice:"place-min", label:"Minimum nach vorn setzen", detail:"Suche abgeschlossen: an den ersten noch ungeordneten Platz."}];
  const left=state.items[state.left].value, right=state.items[state.right].value;
  if(state.algorithm==="bubble") return [
    {choice:"swap",label:"↔ Tauschen",detail:`Die linke ${left} soll nach rechts, die rechte ${right} nach links.`},
    {choice:"keep",label:"→ So stehen lassen",detail:"Links ist bereits kleiner oder gleich rechts."},
  ];
  if(state.algorithm==="insertion") return [
    {choice:"move-left",label:`← ${right} nach links schieben`,detail:`Mit dem linken Nachbarn ${left} tauschen.`},
    {choice:"insert-here",label:`✓ ${right} hier stehen lassen`,detail:"Links steht kein größerer Wert. Diese Karte ist einsortiert."},
  ];
  return [
    {choice:"choose-left",label:`Bisherige ${left} behalten`,detail:"Das bisherige Minimum ist kleiner oder gleich dem Suchwert."},
    {choice:"choose-right",label:`Suchwert ${right} übernehmen`,detail:"Der Suchwert ist kleiner und wird das neue Minimum."},
  ];
}

export default function SortingTrainerLab(){
  const id=useId();
  const [algorithm,setAlgorithm]=useState<SortAlgorithm>("bubble");
  const [example,setExample]=useState(0);
  const [state,setState]=useState(()=>createSortState(examples[0].values,"bubble"));
  const [history,setHistory]=useState<SortStep[]>([]);
  const [review,setReview]=useState<Review|null>(null);
  const [retry,setRetry]=useState("");
  const [hint,setHint]=useState(false);
  const originalItems=useMemo(()=>createSortState(examples[example].values,algorithm).items,[example,algorithm]);
  const info=algorithms.find(a=>a.key===algorithm)!;
  const focus=review?.before??state;
  const focusIds=focus.active.map(index=>focus.items[index]?.id);
  const options=optionsFor(state);
  const done=state.phase==="done";
  const scale=Math.max(...state.items.map(item=>Math.abs(item.value)),1);
  // Keep each visual card mounted in a stable DOM position, including equal values.
  // CSS animates its horizontal position; the full current order is also given as text.
  const stableCards=[...state.items].sort((a,b)=>a.id.localeCompare(b.id));
  useEffect(()=>{if(window.location.hash==="#sortiertraining") requestAnimationFrame(()=>document.getElementById("sortiertraining")?.scrollIntoView());},[]);

  function restart(nextAlgorithm=algorithm,nextExample=example){
    setAlgorithm(nextAlgorithm);setExample(nextExample);setState(createSortState(examples[nextExample].values,nextAlgorithm));
    setHistory([]);setReview(null);setRetry("");setHint(false);
  }
  function decide(choice:SortChoice){
    if(review||done) return;
    const result=applySortChoice(state,choice);
    if(!result.correct){setRetry(result.explanation);return;}
    setHistory(previous=>[...previous,state]);setReview({before:state,explanation:result.explanation});
    setState(result.state);setRetry("");setHint(false);
  }
  function undo(){
    const previous=history.at(-1);if(!previous)return;
    setState(previous);setHistory(history.slice(0,-1));setReview(null);setRetry("");setHint(false);
  }
  const currentPrompt=done?"Alle Karten sind sortiert.":state.phase==="place"?"Die Suche ist fertig. Jetzt das Minimum platzieren.":algorithm==="bubble"?"Müssen diese beiden Nachbarn tauschen?":algorithm==="insertion"?"Muss die einzusortierende Karte weiter nach links?":"Welchen Wert merkst du dir als Minimum?";
  const focusLeft=focus.items[focus.left]?.id,focusRight=focus.items[focus.right]?.id;
  const helper=algorithm==="bubble"?"Vergleiche den linken mit dem rechten Wert. Nur wenn links größer ist, tauschst du.":algorithm==="insertion"?"Vergleiche die einzusortierende Karte mit ihrem linken Nachbarn. Nur wenn sie kleiner ist, wandert sie nach links.":"Merke dir den kleineren der zwei Werte. Bei Gleichstand behältst du das bisherige Minimum. Die anderen Karten müssen trotzdem geprüft werden.";

  return <section className="sort-trainer" id="sortiertraining" aria-labelledby={id+"-title"}>
    <header className="sort-trainer-heading"><span>DU ENTSCHEIDEST · DIE KARTEN BEWEGEN SICH</span><h2 id={id+"-title"}>Sortieren mit Köpfchen</h2><p>Hier läuft kein Film von allein. Du entscheidest jeden Schritt selbst und siehst danach die Karten wandern. Starte mit Bubble Sort. Die beiden anderen Verfahren kannst du anschließend vergleichen.</p></header>
    <div className="sort-trainer-tabs" role="group" aria-label="Sortierverfahren wählen">{algorithms.map(a=><button key={a.key} aria-pressed={algorithm===a.key} aria-controls={id+"-practice"} onClick={()=>restart(a.key)}><strong>{a.name}</strong><small>{a.short}</small></button>)}</div>
    <div className="sort-trainer-intro"><h3>{info.name}: Wozu ist das gut?</h3><p>{info.everyday}</p><details><summary>So übst du Schritt für Schritt</summary><ol>{info.steps.map(text=><li key={text}>{text}</li>)}</ol></details></div>
    <div className="sort-trainer-settings"><label htmlFor={id+"-example"}>Deine Zahlenreihe<select id={id+"-example"} value={example} onChange={event=>restart(algorithm,Number(event.target.value))}>{examples.map((e,index)=><option key={e.name} value={index}>{e.name}</option>)}</select></label><button onClick={()=>restart()}>↺ Diese Runde neu starten</button><p>Verfahren oder Zahlenreihe wechseln startet eine neue Runde. Die alten Heftaufgaben weiter unten bleiben unverändert.</p></div>
    <div className="sort-trainer-practice" id={id+"-practice"}>
      <div className="sort-trainer-stats"><span>{done?"Fertig":`Runde ${focus.round}`}</span><span>{state.comparisons} {state.comparisons===1?"Vergleich":"Vergleiche"}</span><span>{state.moves} {state.moves===1?"Tausch":"Tausche"}</span></div>
      <div className="sort-trainer-direction"><span>← kleinere Werte</span><span>größere Werte →</span></div>
      <div className="sort-trainer-scroller" role="region" aria-label="Bewegliche Zahlenkarten, bei Bedarf seitlich verschiebbar" tabIndex={0}>
        <div className="sort-trainer-board" style={{minWidth:Math.max(280,state.items.length*62)}} role="img" aria-label={`Aktuelle Reihenfolge von links nach rechts: ${state.items.map(item=>item.value).join(", ")}. ${review?review.explanation:state.message}`}>
          <div aria-hidden="true" className="sort-trainer-slots">{state.items.map((_,index)=><span key={index} style={{left:`${index*100/state.items.length}%`,width:`${100/state.items.length}%`}}>Platz {index+1}</span>)}</div>
          {stableCards.map(item=>{
            const index=state.items.findIndex(x=>x.id===item.id),active=!done&&focusIds.includes(item.id),sorted=state.sorted.includes(index);
            const previousIndex=review?.before.items.findIndex(x=>x.id===item.id)??index;
            const movement=previousIndex<index?"is-moving-right":previousIndex>index?"is-moving-left":"";
            let tag="";
            if(active&&algorithm==="selection")tag=focus.phase==="place"?(item.id===focusLeft?"Minimum":"Zielplatz"):(item.id===focusLeft?"Minimum bisher":"Suchwert");
            else if(active&&algorithm==="insertion")tag=item.id===focusRight?"einsortieren":"Nachbar links";
            else if(active)tag=item.id===focusLeft?"links":"rechts";
            if(review&&tag)tag=focus.phase==="place"?"gerade platziert":"gerade geprüft";
            const cardLetter=String.fromCharCode(65+originalItems.findIndex(original=>original.id===item.id));
            return <div key={item.id} aria-hidden="true" className={`sort-trainer-card ${active?"is-active":""} ${sorted?"is-sorted":""} ${movement}`} style={{left:`${index*100/state.items.length}%`,width:`${100/state.items.length}%`}}><span className="sort-trainer-card-tag">{tag||((done||sorted)?algorithm==="insertion"&&!done?"geordnet":"fertig":"")}</span><div className="sort-trainer-card-body"><strong>{item.value}</strong><span className="sort-trainer-bar" style={{height:24+Math.abs(item.value)/scale*58}}/><small>Karte {cardLetter}</small></div></div>;
          })}
        </div>
      </div>
      <p className="sort-trainer-order"><strong>Deine Reihenfolge:</strong> {state.items.map(item=>item.value).join(" · ")}</p>
      <p className="sort-trainer-legend">Umrandung = gerade betrachtete Karten. Grün = {algorithm==="insertion"?"zusammenhängender, bereits geordneter linker Teil; nicht unbedingt der endgültige Platz":"endgültiger Platz"}. Die Buchstaben unterscheiden auch Karten mit gleichem Wert.</p>
      <div className="sort-trainer-question" aria-live="polite" aria-atomic="true">{review?<><span>RICHTIG ENTSCHIEDEN</span><h3>{done?"Geschafft – die Reihe ist sortiert!":"Schau, was dein Schritt bewirkt hat."}</h3><p>{review.explanation}</p></>:<><span>{done?"ZIEL ERREICHT":"DEIN NÄCHSTER SCHRITT"}</span><h3>{currentPrompt}</h3><p>{state.message}</p></>}</div>
      {!done&&!review&&<div className="sort-trainer-choices">{options.map(option=><button key={option.choice} onClick={()=>decide(option.choice)}><strong>{option.label}</strong><small>{option.detail}</small></button>)}</div>}
      {retry&&<p className="sort-trainer-retry" role="status"><strong>Noch einmal überlegen:</strong> {retry} Die Karten bleiben liegen; probiere es erneut.</p>}
      <div className="sort-trainer-controls">{review&&!done&&<button className="sort-trainer-next" onClick={()=>{setReview(null);setRetry("");}}>Nächster Schritt →</button>}<button disabled={history.length===0} onClick={undo}>← Letzte Entscheidung zurück</button>{!done&&!review&&<button aria-expanded={hint} onClick={()=>setHint(!hint)}>Denkhilfe {hint?"schließen":"öffnen"}</button>}</div>
      {hint&&!review&&!done&&<p className="sort-trainer-hint">{state.phase==="place"?"Die Suche ist vollständig. Der kleinste Wert wird an den ersten noch ungeordneten Platz gesetzt. Es kann sein, dass er schon dort steht.":helper}</p>}
      {done&&<div className="sort-trainer-finish"><strong>Du hast die Reihe selbst sortiert.</strong><p>Dieses Verfahren hat hier {state.comparisons} {state.comparisons===1?"Vergleich":"Vergleiche"} und {state.moves} {state.moves===1?"echten Tausch":"echte Tausche"} ausgeführt. Eine falsche Antwort verändert weder die Liste noch diese Zähler. Probiere dieselbe Zahlenreihe mit einem anderen Verfahren und vergleiche.</p><button onClick={()=>restart()}>Mit derselben Reihe noch einmal üben</button></div>}
      <p className="sort-trainer-count-note">Gezählt werden die ausgeführten Wertvergleiche und echten Tausche, keine Punkte oder Noten. Nach einer richtigen Entscheidung wartet die Übung auf „Nächster Schritt“. Bei reduzierter Bewegung werden die Karten direkt an ihrem neuen Platz gezeigt.</p>
    </div>
    <aside className="sort-trainer-caution"><strong>Achtung, leicht zu verwechseln</strong><p>{info.warning}</p></aside>
    <div className="sort-trainer-transfer"><strong>Erkläre es jemandem neben dir:</strong><p>{info.question}</p><small>Die Übung ergänzt das bestehende Sortierlabor und die Papieraufgaben. Es werden keine Namen oder Ergebnisse übertragen. Beim Verlassen oder Neuladen beginnst du neu.</small></div>
  </section>;
}
