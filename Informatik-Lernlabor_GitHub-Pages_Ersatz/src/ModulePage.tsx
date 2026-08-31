import Link from "next/link";
import { getTopic } from "./topics";
import BubbleSortLab from "./components/BubbleSortLab";
import ModuleExercises from "./components/ModuleExercises";
import ModuleTheory from "./components/ModuleTheory";

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
          <div className="statusPill"><span className="liveDot" />Übungslabor verfügbar</div>
        </div>
      </header>

      <section className="moduleBody shell">
        <aside className="learningGoals">
          <div className="eyebrow">DAS KANNST DU DANACH</div>
          <ol>{topic.skills.map((skill) => <li key={skill}>{skill}</li>)}</ol>
        </aside>
        <div className="moduleContent">
          <ModuleTheory slug={topic.slug} />
          <div className="interactiveDivider"><span>JETZT SELBST AUSPROBIEREN</span></div>
          {topic.slug === "sortieren" ? <BubbleSortLab /> : <ModuleExercises slug={topic.slug} />}
        </div>
      </section>

      <footer><div className="shell"><div className="brand"><span className="brandMark">&lt;/&gt;</span><span>Informatik-Lernlabor</span></div><Link href="/#themen">Alle Themen ansehen →</Link></div></footer>
    </main>
  );
}
