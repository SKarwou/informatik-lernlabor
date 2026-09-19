import { Solution } from "./ProtectedContent";
export type PracticeTask = {
  id: string; title: string; intro: string;
  requirements: string[]; steps: string[]; hints: string[]; deliverables: string[];
  addressTable?: {headers:string[];rows:string[][]};
  htmlExample?: string; ciphertext?: string; starterCode?: string;
  sources?: {title:string;url:string}[];
};
export default function PracticeView({ tasks, scope }: { tasks: PracticeTask[]; scope: string }) {
  return <>{tasks.map(task => <section className="lessonSection" id={task.id} key={task.id}>
    <span className="eyebrow">ANGELEITETE PRAXIS · {task.id}</span><h2>{task.title}</h2><p>{task.intro}</p>
    <h3>Das brauchst du</h3><ul>{task.requirements.map(p => <li key={p}>{p}</li>)}</ul>
    {task.addressTable && <div className="lessonTableWrap" role="region" aria-label="Netzwerkadressen" tabIndex={0}><table className="lessonTable"><thead><tr>{task.addressTable.headers.map(h => <th key={h}>{h}</th>)}</tr></thead><tbody>{task.addressTable.rows.map((r,i) => <tr key={i}>{r.map((v,j) => <td key={j}>{v}</td>)}</tr>)}</tbody></table></div>}
    {task.ciphertext && <><h3>Geheimtext zum Untersuchen</h3><p style={{overflowWrap:"anywhere",fontFamily:"monospace"}}>{task.ciphertext}</p></>}
    {task.starterCode && <details><summary>Vorbereiteter Programmrahmen</summary><pre style={{overflowX:"auto"}}><code>{task.starterCode}</code></pre></details>}
    {task.htmlExample && <details><summary>Kleines HTML Beispiel</summary><pre style={{overflowX:"auto"}}><code>{task.htmlExample}</code></pre></details>}
    <h3>Schritt für Schritt</h3><ol className="explainList">{task.steps.map(p => <li key={p}>{p}</li>)}</ol>
    {task.hints.map((hint,i) => <details key={i}><summary>Hinweis {i+1}</summary><p>{hint}</p></details>)}
    <h3>Dein Nachweis</h3>{task.deliverables.map(p => <p key={p}>{p}</p>)}
    <Solution scope={scope} id={task.id} title="Kontrollweg zur Praxisaufgabe" />
    {task.sources && <p className="sourceNote">Zum Nachschlagen: {task.sources.map((source,i) => <span key={source.url}>{i>0?" · ":""}<a href={source.url} target="_blank" rel="noreferrer">{source.title}</a></span>)}</p>}
  </section>)}</>;
}
