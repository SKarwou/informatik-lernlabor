import Link from "next/link";
import ChapterGate from "./components/ChapterGate";
import { ChapterAccess, Solution } from "./components/ProtectedContent";

export default function ProjectsPage() {
  return <main>
    <nav className="nav shell"><Link className="brand" href="/"><span className="brandMark">&lt;/&gt;</span><span>Informatik-Lernlabor</span></Link><Link href="/#themen">← Zu den Kapiteln</Link></nav>
    <header className="subpageHero shell"><div className="eyebrow">ZWEI GETRENNTE PROJEKTPHASEN</div><h1>Euer eigenes<br /><em>Informatikprojekt.</em></h1><p>Jedes Projekt öffnet sich erst mit seinem eigenen Freigabecode. Du erhältst ihn von deiner Lehrkraft, wenn die Grundlagen erarbeitet sind.</p></header>
    <div className="shell"><p className="toolStartNotice">Die Bedienung der Werkzeuge kannst du vorab kennenlernen: <Link href="/werkzeuge">BlueJ, JavaScript und Scratch</Link>.</p>
      {[{scope:"projekt-1",title:"Projekt 1",id:"scratch",solution:"project-scratch"},{scope:"projekt-2",title:"Projekt 2",id:"bluej",solution:"project-bluej"}].map(project => <section className="projectGateSection" id={project.id} key={project.scope}><ChapterGate scope={project.scope} title={project.title} project>{payload => <><div className="projectUnlocked" dangerouslySetInnerHTML={{__html:payload.html || ""}} /><ChapterAccess scope={project.scope} /><Solution scope={project.scope} id={project.solution} title="Möglicher Projektweg" /></>}</ChapterGate></section>)}
    </div>
    <footer><div className="shell"><Link href="/#themen">Zurück zu den Kapiteln →</Link></div></footer>
  </main>;
}
