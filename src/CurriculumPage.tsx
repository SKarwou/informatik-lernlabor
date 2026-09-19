import Link from "next/link";
import { UnlockForm, useProtected } from "./components/ProtectedContent";

export default function CurriculumPage() {
  const { payload, lock } = useProtected("bildungsplan");
  if (payload?.html) return <><div className="teacherLockBar shell"><span>Bildungsplan · Lehrkraftbereich geöffnet</span><button onClick={lock}>Bereich wieder sperren</button></div><div dangerouslySetInnerHTML={{ __html: payload.html }} /></>;
  return <main><nav className="nav shell"><Link className="brand" href="/"><span className="brandMark">&lt;/&gt;</span><span>Informatik-Lernlabor</span></Link><Link href="/">← Zur Startseite</Link></nav><section className="lockedCurriculum shell"><span className="lockIcon" aria-hidden="true">🔒</span><div className="eyebrow">BEREICH FÜR DIE LEHRKRAFT</div><h1>Bildungsplan & Zweijahresplan</h1><p>Unterrichtsplanung, Zeitbudget und Hinweise zur Bildungsplanabdeckung öffnen sich mit dem Lehrkraft-Passwort. Die Kapitel besitzen eigene Freigabecodes.</p><UnlockForm scope="bildungsplan" teacher /><Link className="textButton" href="/#themen">Zu den Lernkapiteln →</Link></section></main>;
}
