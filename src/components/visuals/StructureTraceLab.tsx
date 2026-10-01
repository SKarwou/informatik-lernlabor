import { useState } from 'react';
type Block = 'start' | 'check' | 'add' | 'decrease' | 'output';
export function structureTrace(count: number) {
  if (!Number.isInteger(count) || count < 0 || count > 5) throw new Error('Für das Lernmodell sind 0 bis 5 Tickets erlaubt.');
  let rest = count, summe = 0;
  const frames: { block: Block; rest: number; summe: number; text: string }[] = [];
  const add = (block: Block, text: string) => frames.push({block,rest,summe,text});
  add('start', `Wir setzen rest auf ${count} und summe auf 0. Jedes Ticket kostet im Beispiel 2 €.`);
  while (rest > 0) {
    add('check', `${rest} > 0 ist wahr. Beide eingerückten Anweisungen gehören zur Wiederholung.`);
    summe += 2; add('add', `Ein Ticket kommt dazu: Die Summe ist jetzt ${summe} €. rest ist noch ${rest}.`);
    rest -= 1; add('decrease', `Erst diese Anweisung verringert rest auf ${rest}. Danach wird die Bedingung wieder geprüft.`);
  }
  add('check', '0 > 0 ist falsch. Der gesamte Schleifenrumpf wird übersprungen; wir gehen zur Ausgabe.');
  add('output', `Die Ausgabe lautet ${summe} €. Die Schleife endet, weil rest in jedem Durchlauf kleiner wird.`);
  return frames;
}
export default function StructureTraceLab() {
  const [count, setCount] = useState(3), [index, setIndex] = useState(0);
  const frames = structureTrace(count), frame = frames[index];
  const active = (block: Block) => frame.block === block ? ' isCurrent' : '';
  return <section className="studyBlock structureLab" id="struktogramm-labor">
    <span className="eyebrow">EIN ECHTES STRUKTOGRAMM LESEN</span><h2>Welche Anweisung ist jetzt dran?</h2>
    <p>Ein Nassi-Shneiderman-Diagramm besteht aus ineinander geschachtelten Blöcken. Lies von oben nach unten. Der linke Rand der Schleife umfasst ihren Rumpf: Beide eingerückten Anweisungen werden wiederholt. Es gibt hier keine Ablaufpfeile.</p>
    <label>Ticketanzahl <select value={count} onChange={event => { setCount(Number(event.target.value)); setIndex(0); }}>{[0,1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}</select></label>
    <figure className="structureFigure"><div className="structureDiagram" aria-label="Struktogramm für einen Ticketpreis">
      <div className={`structureInstruction${active('start')}`}>rest ← {count}; summe ← 0</div>
      <div className="structureLoop"><div className={`structureCondition${active('check')}`}>SOLANGE rest &gt; 0</div><div className="structureBody"><div className={`structureInstruction${active('add')}`}>summe ← summe + 2</div><div className={`structureInstruction${active('decrease')}`}>rest ← rest − 1</div></div></div>
      <div className={`structureInstruction${active('output')}`}>AUSGABE summe</div>
    </div><figcaption>← bedeutet Zuweisung, keine Gleichung. „SOLANGE“ prüft vor dem ersten und vor jedem weiteren Durchlauf.</figcaption></figure>
    <div className="structureValues"><span>rest: <strong>{frame.rest}</strong></span><span>summe: <strong>{frame.summe} €</strong></span></div>
    <p role="status">Schritt {index+1} von {frames.length}: {frame.text}</p>
    <div className="studyControls"><button type="button" disabled={!index} onClick={()=>setIndex(i=>i-1)}>← Struktogramm zurück</button><button type="button" disabled={index===frames.length-1} onClick={()=>setIndex(i=>i+1)}>Struktogramm weiter →</button><button type="button" onClick={()=>setIndex(0)}>Struktogramm neu starten</button></div>
    <p><strong>Deine Denkprobe:</strong> Was passiert bei null Tickets? Was passiert, wenn „rest ← rest − 1“ fehlt? Begründe zuerst; vergleiche dann mit deiner Lehrkraft. Das Diagramm ist eine Planungshilfe, noch kein Java-Quelltext. Der Zurück-Knopf gehört nur zur Lernansicht.</p>
  </section>;
}
