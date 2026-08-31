import Link from "next/link";
import { areas, topics } from "./topics";

export default function Home() {
  return (
    <main>
      <nav className="nav shell" aria-label="Hauptnavigation">
        <Link className="brand" href="/" aria-label="Informatik-Lernlabor Startseite">
          <span className="brandMark">&lt;/&gt;</span>
          <span>Informatik-Lernlabor</span>
        </Link>
        <div className="navLinks"><Link href="/bildungsplan">Zweijahresplan</Link><Link href="/projekte">Projektphasen</Link></div>
      </nav>

      <header className="hero shell">
        <div className="eyebrow">BILDUNGSPLAN BADEN-WÜRTTEMBERG · KLASSEN 11/12</div>
        <h1>Der ganze Stoff.<br /><em>Ein Lernlabor.</em></h1>
        <p className="heroCopy">Zwei Schuljahre Informatik in einem Lernpfad – mit ausführlichen Erklärungen, Schaubildern, Rechen- und Heftaufgaben, Scratch, BlueJ und direktem Feedback.</p>
        <div className="heroActions">
          <a className="primaryButton" href="#themen">Themen entdecken <span>↓</span></a>
          <Link className="textButton" href="/bildungsplan">Zweijahresplan öffnen →</Link>
        </div>
        <div className="stats" aria-label="Umfang des Lernlabors">
          <div><strong>63</strong><span>Kompetenzen</span></div>
          <div><strong>12</strong><span>Lernmodule</span></div>
          <div><strong>72</strong><span>Doppelstunden</span></div>
        </div>
      </header>

      <section className="gatewaySection shell" aria-label="Kursplanung und Projekte">
        <Link href="/bildungsplan" className="gatewayCard curriculumGateway">
          <div><span className="eyebrow">VOLLSTÄNDIGKEIT GEPRÜFT</span><h2>Bildungsplan-Check & Zweijahresplan</h2><p>Alle 63 Teilkompetenzen mit Lernort, Übungsform und einer realistischen Verteilung auf 72 Doppelstunden.</p></div><span className="gatewayArrow">↗</span>
        </Link>
        <Link href="/projekte" className="gatewayCard projectGateway">
          <div><span className="eyebrow">SCRATCH + BLUEJ</span><h2>Zwei vollständige Projektphasen</h2><p>Der sichere Schul-Messenger und eine objektorientierte Medienverwaltung – mit Meilensteinen und Bewertung.</p></div><span className="gatewayArrow">↗</span>
        </Link>
      </section>

      <section className="pathSection" id="themen">
        <div className="shell">
          <div className="sectionIntro">
            <div><span className="sectionNumber">01</span><span className="eyebrow">DEIN LERNPFAD</span></div>
            <h2>Alle Themen auf einen Blick</h2>
            <p>Die Module folgen den vier inhaltsbezogenen Kompetenzbereichen. Jedes enthält einen ausführlichen Grundlagentext, Schaubild, Beispiel, Heftaufgaben und Programmierpraxis.</p>
          </div>

          {areas.map((area) => {
            const areaTopics = topics.filter((topic) => topic.area === area.title);
            return (
              <section className={`areaBlock ${area.color}`} key={area.title}>
                <div className="areaHeading">
                  <span>{area.number}</span>
                  <h3>{area.title}</h3>
                  <small>{areaTopics.length} Module</small>
                </div>
                <div className="topicGrid">
                  {areaTopics.map((topic) => (
                    <Link className="topicCard" href={`/module/${topic.slug}`} key={topic.slug}>
                      <div className="cardTop"><span>{topic.number}</span><b>KOMPLETT</b></div>
                      <h4>{topic.title}</h4>
                      <p>{topic.short}</p>
                      <div className="cardFooter"><span>{topic.skills.length} Lernziele · mit Heftteil</span><span className="arrow">↗</span></div>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </section>

      <section className="howSection shell">
        <div className="sectionIntro compact">
          <div><span className="sectionNumber">02</span><span className="eyebrow">SO LERNST DU</span></div>
          <h2>Vom ersten Begriff zum eigenen Programm</h2>
        </div>
        <div className="steps">
          <article><span>01</span><h3>Verstehen</h3><p>Ausführliche Erklärungen, Begriffsboxen, Merksätze und Schaubilder beginnen ohne vorausgesetztes Fachwissen.</p></article>
          <article><span>02</span><h3>Üben</h3><p>Vorgerechnete Beispiele, Papier- und Heftaufgaben sowie interaktive Stationen sichern jeden Lernschritt.</p></article>
          <article><span>03</span><h3>Entwickeln</h3><p>Scratch, BlueJ und zwei Projektphasen verbinden die Themen zu eigenen, getesteten Informatikprodukten.</p></article>
        </div>
      </section>

      <footer><div className="shell"><div className="brand"><span className="brandMark">&lt;/&gt;</span><span>Informatik-Lernlabor</span></div><p>Verstehen durch Ausprobieren · Wahlfach Oberstufe · KCG</p><a href="#top">Nach oben ↑</a></div></footer>
    </main>
  );
}
