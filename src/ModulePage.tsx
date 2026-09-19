import Link from "next/link";
import { getTopic } from "./topics";
import BubbleSortLab from "./components/BubbleSortLab";
import ModuleExercises from "./components/ModuleExercises";
import ModuleTheory from "./components/ModuleTheory";
import BeginnerCourseView from "./components/BeginnerCourseView";
import { ChapterAccess } from "./components/ProtectedContent";
import ChapterGate from "./components/ChapterGate";
import PracticeView from "./components/PracticeView";

export default function ModulePage({ slug }: { slug: string }) {
  const topic = getTopic(slug);
  if (!topic) {
    return <main className="shell"><h1>Kapitel nicht gefunden</h1><Link href="/">Zur Startseite</Link></main>;
  }

  return (
    <main>
      <nav className="nav shell">
        <Link className="brand" href="/"><span className="brandMark">&lt;/&gt;</span><span>Informatik-Lernlabor</span></Link>
        <Link className="backLink" href="/#themen">← Alle Themen</Link>
      </nav>

      <header className="moduleHero shell">
        <div className="moduleIndex">{topic.number}</div>
        <div>
          <div className="eyebrow">{topic.area} · WAHLFACH OBERSTUFE</div>
          <h1>{topic.title}</h1>
          <p>{topic.short}</p>
          <div className="statusPill">🔒 Mit Kapitelcode</div>
        </div>
      </header>

      <section className="moduleBody shell">
        <aside className="learningGoals">
          <div className="eyebrow">DAS KANNST DU DANACH</div>
          <ol>{topic.skills.map((skill) => <li key={skill}>{skill}</li>)}</ol>
          <div className="sideLinks"><a href="#loesungscode">🔒 Lösungscode eingeben</a><Link href="/werkzeuge">Erste Schritte mit BlueJ & JavaScript</Link></div>
        </aside>
        <div className="moduleContent">
          <ChapterGate key={slug} scope={slug} title={`Kapitel ${topic.number}`}>{payload => <>
          <ChapterAccess scope={topic.slug} />
          {payload.course ? <BeginnerCourseView course={payload.course} /> : payload.theory && payload.beginner ? <ModuleTheory slug={topic.slug} config={payload.theory} beginner={payload.beginner} /> : null}
          {payload.course && <aside className="toolStartNotice"><h3>Programmieren kommt Schritt für Schritt.</h3><p>Für die Heftaufgaben oben brauchst du keine Programmierkenntnisse. Die Werkstatt unten ist eine zusätzliche Anwendung. Beginne vor deinem ersten Programm mit der bebilderten Einführung.</p><Link href="/werkzeuge">BlueJ, Java und JavaScript kennenlernen →</Link></aside>}
          <div className="interactiveDivider"><span>JETZT SELBST AUSPROBIEREN</span></div>
          {topic.slug === "sortieren" && payload.bubble ? <BubbleSortLab config={payload.bubble} /> : payload.lab ? <ModuleExercises slug={topic.slug} config={payload.lab} /> : null}
          {payload.practice && <PracticeView tasks={payload.practice} scope={topic.slug} />}
          </>}</ChapterGate>
        </div>
      </section>

      <footer><div className="shell"><div className="brand"><span className="brandMark">&lt;/&gt;</span><span>Informatik-Lernlabor</span></div><Link href="/#themen">Alle Themen ansehen →</Link></div></footer>
    </main>
  );
}
