import type { BeginnerCourse } from "../learningTypes";
import { Solution } from "./ProtectedContent";

export default function BeginnerCourseView({ course }: { course: BeginnerCourse }) {
  return <div className="beginnerCourse">
    <header className="courseStart"><span className="eyebrow">DEIN EINSTIEG · OHNE VORKENNTNISSE</span><h2>{course.title}</h2><p>{course.intro}</p><p className="prerequisite"><strong>Das brauchst du:</strong> {course.prerequisites}</p><ol className="learningRoute"><li>Lesen & verstehen</li><li>Beispiele nachvollziehen</li><li>Mit Hinweisen üben</li><li>Lösungen vergleichen</li></ol></header>
    <nav className="lessonContents" aria-label="Lernschritte in diesem Kapitel"><h3>In kleinen Schritten</h3><ol>{course.sections.map((section) => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ol><a className="textButton" href="#heftaufgaben">Direkt zu den gestuften Aufgaben ↓</a></nav>
    {course.sections.map((section, index) => <section className="lessonSection" id={section.id} key={section.id}>
      <div className="lessonNumber">SCHRITT {String(index + 1).padStart(2, "0")}</div><h2>{section.title}</h2>
      {section.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
      {section.table && <div className="lessonTableWrap" role="region" aria-label={section.table.caption || section.title} tabIndex={0}><table className="lessonTable">{section.table.caption && <caption>{section.table.caption}</caption>}<thead><tr>{section.table.headers.map((header, i) => <th key={i} scope="col">{header}</th>)}</tr></thead><tbody>{section.table.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody></table></div>}
      {section.steps && <ol className="lessonFlow">{section.steps.map((step, i) => <li key={i}><span>{i + 1}</span><p>{step}</p></li>)}</ol>}
      {section.example && <article className="workedExample"><div className="exampleTop"><span>WIR MACHEN ES GEMEINSAM</span></div><h3>{section.example.title}</h3><p>{section.example.prompt}</p><ol>{section.example.steps.map((step, i) => <li key={i}>{step}</li>)}</ol><p className="exampleResult"><strong>Ergebnis:</strong> {section.example.result}</p></article>}
      {section.remember && <aside className="rememberBox"><span>MERKSATZ</span><p>{section.remember}</p></aside>}
    </section>)}
    <section className="termBox"><div><span className="eyebrow">ZUM NACHSCHLAGEN</span><h2>Dein kleines Wörterbuch</h2></div><dl>{course.glossary.map((entry) => <div key={entry.term}><dt>{entry.term}</dt><dd>{entry.meaning}</dd></div>)}</dl></section>
    <section className="guidedTasks" id="heftaufgaben"><span className="eyebrow">PAPIER, STIFT UND DEIN EIGENER WEG</span><h2>Vom ersten Versuch zur Vertiefung</h2><p>Beginne mit „Einstieg“. Schreibe deine Antworten und Rechenwege ins Heft. Öffne bei Bedarf erst Hinweis 1, dann Hinweis 2. Vergleiche die Musterlösung nach deinem eigenen Versuch.</p>
      {(["Einstieg", "Üben", "Vertiefen"] as const).map((level, index) => <section className={`taskLevel level${index}`} key={level}><h3><span>{index + 1}</span> {level}</h3><p>{["Kleine Schritte: Nutze die Beispiele und die Tabellen oben.", "Verbinde mehrere Schritte. Notiere auch deine Begründung.", "Übertrage dein Wissen. Hier darfst du länger nachdenken und Lösungswege vergleichen."][index]}</p>{course.tasks.filter((task) => task.level === level).map((task) => <article className="guidedTask" key={task.id} id={`aufgabe-${task.id}`}><div className="taskId">{task.id}</div><h4>{task.title}</h4><p>{task.prompt}</p><div className="taskHints">{task.hints.map((hint, i) => <details key={i}><summary>Hinweis {i + 1}</summary><p>{hint}</p></details>)}</div><Solution scope={course.slug} id={task.id} /></article>)}</section>)}
    </section>
    <aside className="courseFinish"><h3>Kannst du es schon erklären?</h3><p>Erkläre einer anderen Person ohne die Texte zu lesen:</p><ul>{course.goals.map((goal) => <li key={goal}>{goal}</li>)}</ul><p>Wenn dir ein Punkt schwerfällt, kehre zu dem passenden Lernschritt zurück. Das ist ein sinnvoller Teil des Lernens.</p></aside>
  </div>;
}
