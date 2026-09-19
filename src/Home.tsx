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
        <div className="navLinks"><Link href="/werkzeuge">Erste Schritte</Link><Link href="/projekte">Projektphasen</Link><Link href="/bildungsplan">🔒 Lehrkraft</Link></div>
      </nav>

      <header className="hero shell">
        <div className="eyebrow">BILDUNGSPLAN BADEN-WÜRTTEMBERG · KLASSEN 11/12</div>
        <h1>Wahlfach Informatik.<br /><em>Ein Lernlabor.</em></h1>
        <p className="heroCopy">Informatik in einem Lernpfad – mit ausführlichen Erklärungen, Schaubildern, Rechen- und Heftaufgaben, Scratch, BlueJ und direktem Feedback.</p>
        <div className="heroActions">
          <a className="primaryButton" href="#themen">Themen entdecken <span>↓</span></a>
          <Link className="textButton" href="/module/zahlensysteme">Ohne Vorwissen starten →</Link>
        </div>
        <div className="stats" aria-label="Umfang des Lernlabors">
          <div><strong>2</strong><span>Schuljahre</span></div>
          <div><strong>12</strong><span>Lernmodule</span></div>
          <div><strong>72</strong><span>Doppelstunden</span></div>
        </div>
      </header>

      <section className="gatewaySection shell" aria-label="Kursplanung und Projekte">
        <Link href="/bildungsplan" className="gatewayCard curriculumGateway">
          <div><span className="eyebrow">🔒 FÜR DIE LEHRKRAFT</span><h2>Bildungsplan & Zweijahresplan</h2><p>Unterrichtsplanung und Zuordnung der Kompetenzen · mit Passwort.</p></div><span className="gatewayArrow">↗</span>
        </Link>
        <Link href="/projekte" className="gatewayCard projectGateway">
          <div><span className="eyebrow">🔒 JE EIN EIGENER PROJEKTCODE</span><h2>Zwei getrennte Projektphasen</h2><p>Die Aufgabenbeschreibungen öffnen sich erst, wenn deine Lehrkraft das jeweilige Projekt freigibt.</p></div><span className="gatewayArrow">↗</span>
        </Link>
      </section>

      <section className="newLearning shell"><div><span className="eyebrow">NEU · DATEN & CODIERUNG VON ANFANG AN</span><h2>Erst verstehen. Dann selbst lösen.</h2><p>Vier neu aufgebaute Kapitel führen dich von Bits und Bytes bis zu deiner ersten SQL-Abfrage. Mit vorgemachten Beispielen, kleinen Einstiegsaufgaben, zwei Hinweisen pro Aufgabe und Musterlösungen mit zusätzlichem Lösungscode.</p></div><div><Link className="primaryButton" href="/module/zahlensysteme">Mit Daten & Codierung starten →</Link><Link className="textButton" href="/werkzeuge">BlueJ, JavaScript und Scratch kennenlernen →</Link></div></section>

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
                      <div className="cardTop"><span>{topic.number}</span><b>🔒 MIT CODE</b></div>
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
