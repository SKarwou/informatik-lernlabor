import Link from "next/link";
import { Solution } from "./ProtectedContent";
type DiagramNode = { title: string; text: string };

export type ModuleTheoryConfig = {
  readingTime: string;
  sections: { title: string; paragraphs: string[] }[];
  terms: { term: string; definition: string }[];
  merksatz: string;
  diagram: { title: string; caption: string; nodes: DiagramNode[] };
  example: { title: string; task: string; steps: string[]; result: string };
  paperTasks: { type: string; title: string; prompt: string }[];
  toolTask?: { tool: "Scratch" | "BlueJ"; title: string; intro: string; steps: string[]; extension: string };
};

export default function ModuleTheory({ slug, config, beginner }: { slug: string; config: ModuleTheoryConfig; beginner: { plain: string; picture: string; miniTask: string } }) {

  return (
    <>
      <article className="theoryChapter">
        <div className="chapterKicker"><span>GRUNDLAGEN</span><span>{config.readingTime} Lesezeit</span></div>
        <h2>Schritt für Schritt verstehen</h2>
        <p className="chapterLead">Du brauchst für dieses Kapitel kein Vorwissen. Lies zuerst den einfachen Einstieg und danach den ausführlichen Text. Unbekannte Begriffe findest du weiter unten in der Begriffsbox.</p>

        <section className="beginnerBox" aria-labelledby={`beginner-${slug}`}>
          <div className="beginnerLabel">GANZ EINFACH GESAGT</div>
          <h3 id={`beginner-${slug}`}>{beginner.plain}</h3>
          <div className="beginnerColumns">
            <p><strong>Bild im Kopf:</strong> {beginner.picture}</p>
            <p><strong>60-Sekunden-Start:</strong> {beginner.miniTask}</p>
          </div>
          <Solution scope={slug} id="mini" title="Lösung zum 60-Sekunden-Start" />
        </section>

        {config.sections.map((section) => (
          <section className="theorySection" key={section.title}>
            <h3>{section.title}</h3>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>
        ))}

        <section className="termBox" aria-labelledby={`terms-${slug}`}>
          <div><span className="eyebrow">BEGRIFFE SICHERN</span><h3 id={`terms-${slug}`}>Das solltest du erklären können</h3></div>
          <dl>{config.terms.map(({ term, definition }) => <div key={term}><dt>{term}</dt><dd>{definition}</dd></div>)}</dl>
        </section>

        <aside className="rememberBox"><span>MERKSATZ</span><p>{config.merksatz}</p></aside>
      </article>

      <figure className="flowFigure">
        <div className="eyebrow">SCHAUBILD</div>
        <h2>{config.diagram.title}</h2>
        <ol className="flowDiagram">
          {config.diagram.nodes.map((node, index) => <li key={node.title}><div><strong>{node.title}</strong><span>{node.text}</span></div>{index < config.diagram.nodes.length - 1 && <b aria-hidden="true">→</b>}</li>)}
        </ol>
        <figcaption>{config.diagram.caption}</figcaption>
      </figure>

      <article className="workedExample">
        <div className="exampleTop"><span>BEISPIEL</span><span>vollständig vorgerechnet</span></div>
        <h2>{config.example.title}</h2>
        <p className="exampleTask"><strong>Aufgabe:</strong> {config.example.task}</p>
        <ol>{config.example.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        <p className="exampleResult"><strong>Ergebnis:</strong> {config.example.result}</p>
      </article>

      <section className="paperSection">
        <div className="paperHeading"><div><div className="eyebrow">PAPIER & HEFT</div><h2>Übungsblatt zum Kapitel</h2></div><span>{config.paperTasks.length} Arbeitsaufträge</span></div>
        <p className="paperIntro">Bearbeite die Aufgaben mit vollständigem Rechenweg oder einer nachvollziehbaren Begründung. Vergleiche anschließend zu zweit und verbessert unklare Stellen gemeinsam.</p>
        <ol className="paperGrid">{config.paperTasks.map((task, index) => <li key={task.title}><span>{task.type} · Aufgabe {index + 1}</span><h3>{task.title}</h3><p>{task.prompt}</p><Solution scope={slug} id={`paper-${index + 1}`} /></li>)}</ol>
      </section>

      {config.toolTask && <article className={`toolAssignment ${config.toolTask.tool.toLowerCase()}`}>
        <div className="toolBadge">{config.toolTask.tool}</div>
        <div className="toolAssignmentBody">
          <div className="eyebrow">PROGRAMMIERAUFTRAG</div>
          <h2>{config.toolTask.title}</h2>
          <p>{config.toolTask.intro}</p>
          <div className="toolStartNotice"><p>Zum ersten Mal mit {config.toolTask.tool}? Lerne zuerst Oberfläche und Bedienung kennen.</p><Link href={`/werkzeuge#${config.toolTask.tool === "BlueJ" ? "bluej" : "scratch"}`}>Schritt-für-Schritt-Einführung öffnen →</Link></div>
          <ol>{config.toolTask.steps.map((step) => <li key={step}>{step}</li>)}</ol>
          <div className="toolExtension"><strong>Erweiterung:</strong> {config.toolTask.extension}</div>
          <Solution scope={slug} id="tool" title="Musterweg zum Programmierauftrag" />
        </div>
      </article>}
    </>
  );
}
