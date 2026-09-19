import { useEffect } from "react";
import Home from "./Home";
import CurriculumPage from "./CurriculumPage";
import ProjectsPage from "./ProjectsPage";
import ModulePage from "./ModulePage";
import ToolsPage from "./ToolsPage";

function getPage() {
  return new URLSearchParams(window.location.search).get("page") || "home";
}

export default function App() {
  const page = getPage();

  useEffect(() => {
    const title = page === "bildungsplan"
      ? "Bildungsplan-Check · Informatik-Lernlabor"
      : page === "werkzeuge" ? "Erste Schritte · BlueJ & JavaScript · Informatik-Lernlabor"
      : page === "projekte"
        ? "Projektphasen · Informatik-Lernlabor"
        : page.startsWith("module/")
          ? "Lernkapitel · Informatik-Lernlabor"
          : "Informatik-Lernlabor Klasse 11/12";
    document.title = title;

    if (window.location.hash) {
      window.requestAnimationFrame(() => {
        const rawAnchor = window.location.hash.slice(1);
        let anchor = rawAnchor;
        try { anchor = decodeURIComponent(rawAnchor); } catch { /* Ungültige URL-Escapes als Text behandeln. */ }
        document.getElementById(anchor)?.scrollIntoView();
      });
    }
  }, [page]);

  if (page === "bildungsplan") return <CurriculumPage />;
  if (page === "projekte") return <ProjectsPage />;
  if (page === "werkzeuge") return <ToolsPage />;
  if (page.startsWith("module/")) return <ModulePage slug={page.slice("module/".length)} />;
  return <Home />;
}
