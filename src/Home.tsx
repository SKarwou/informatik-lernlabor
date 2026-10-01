import Link from "next/link";
import { areas, topics } from "./topics";
import "./Home.css";

export default function Home() {
  return (
    <main className="homePage" id="top">
      <nav className="nav shell" aria-label="Hauptnavigation">
        <Link className="brand" href="/" aria-label="Informatik-Lernlabor Startseite">
          <span className="brandMark">&lt;/&gt;</span>
          <span>Informatik-Lernlabor</span>
        </Link>
        <div className="navLinks"><a href="#themen">Die Themen ↓</a><Link href="/module/zahlensysteme">Zum ersten Kapitel →</Link></div>
      </nav>

      <header className="hero homeHero shell">
        <div className="homeHeroText">
          <div className="eyebrow">ENTDECKEN · VERSTEHEN · AUSPROBIEREN</div>
          <h1>Wahlfach<br />Informatik.<br /><em>Ein Lernlabor.</em></h1>
          <p className="heroCopy">Was passiert eigentlich im Computer? Finde es heraus – mit verständlichen Beispielen, Experimenten zum Anklicken und Aufgaben zum Selberdenken.</p>
          <div className="heroActions">
            <a className="primaryButton" href="#themen">Themen entdecken <span aria-hidden="true">↓</span></a>
            <Link className="textButton" href="/module/zahlensysteme">Mit dem ersten Kapitel starten →</Link>
          </div>
        </div>
        <figure className="homeCartoon">
          <img src={`${import.meta.env.BASE_URL}illustrations/startseite-cartoon-2026-10-01.png`} width="1254" height="1254" alt="Ein freundlicher Laptop hält eine Null und eine Eins hoch. Hinter seinem Bildschirm schaut ein kleiner, neugieriger Computer-Bug hervor." fetchPriority="high" />
          <figcaption>„Keine Panik. Wir fangen mit 0 und 1 an.“</figcaption>
        </figure>
      </header>

      <section className="homeStart shell" aria-labelledby="home-start-title"><div><span className="eyebrow">DEIN EINSTIEG · DATEN & CODIERUNG</span><h2 id="home-start-title">Ein Bit nach dem anderen.</h2><p>Du musst noch kein Computerprofi sein. Starte mit Nullen und Einsen – kleine Beispiele und Hinweise helfen dir Schritt für Schritt weiter.</p></div><Link className="textButton" href="/module/zahlensysteme">Zum Einstieg →</Link></section>

      <section className="pathSection" id="themen">
        <div className="shell">
          <div className="sectionIntro">
            <div><span className="sectionNumber">01</span><span className="eyebrow">DEIN LERNPFAD</span></div>
            <h2>Alle Themen auf einen Blick</h2>
            <p>Entdecke, wie Computer Daten darstellen, Probleme lösen und miteinander kommunizieren. In jedem Kapitel findest du Erklärungen, interaktive Beispiele und Aufgaben für dein Heft.</p>
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
                      <div className="cardTop"><span>{topic.number}</span><b> MIT CODE</b></div>
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

      <section className="homeContinue shell" id="projekte-und-programmieren" aria-labelledby="home-continue-title">
        <div className="homeContinueHeading">
          <span className="eyebrow">WENN DU BEREIT BIST</span>
          <h2 id="home-continue-title">Deine Ideen werden praktisch.</h2>
          <p>Hier geht es zu den Projektphasen und zu den Werkzeugen für deine eigenen Programme.</p>
        </div>
        <div className="homeContinueGrid">
          <Link href="/projekte" className="homeActionCard homeProjectCard"><span className="eyebrow">ZUSAMMEN ETWAS ENTWICKELN</span><h3>Die Projektphasen</h3><p>Verbinde dein Wissen zu einem eigenen Ergebnis. Jede Projektbeschreibung öffnet sich mit dem passenden Freigabecode deiner Lehrkraft.</p><span className="homeCardLink">Zu den Projekten <span aria-hidden="true">↗</span></span></Link>
          <Link href="/werkzeuge" className="homeActionCard homeToolsCard"><span className="eyebrow">VOM AUSPROBIEREN ZUM EIGENEN CODE</span><h3>Programmieren: los geht’s</h3><p>Lerne BlueJ und Java, Scratch oder JavaScript kennen. Die Einführung zeigt dir die Oberfläche und begleitet dich bei deinen ersten Schritten.</p><span className="homeCardLink">Werkzeuge kennenlernen <span aria-hidden="true">↗</span></span></Link>
        </div>
        <aside className="homeTeacher" aria-label="Für Lehrkräfte"><span aria-hidden="true">🔒</span><p><strong>Für Lehrkräfte</strong><br />Bildungsplanbezug und Unterrichtsplanung im geschützten Bereich.</p><Link href="/bildungsplan">Lehrkraftbereich öffnen →</Link></aside>
      </section>

      <footer><div className="shell"><div className="brand"><span className="brandMark">&lt;/&gt;</span><span>Informatik-Lernlabor</span></div><p>Verstehen durch Ausprobieren · Wahlfach Oberstufe · KCG</p><a href="#top">Nach oben ↑</a></div></footer>
    </main>
  );
}
