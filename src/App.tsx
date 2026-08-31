import { useEffect } from "react";
import Home from "./Home";
import CurriculumPage from "./CurriculumPage";
import ProjectsPage from "./ProjectsPage";
import ModulePage from "./ModulePage";

function getPage() {
  return new URLSearchParams(window.location.search).get("page") || "home";
}

export default function App() {
  const page = getPage();

  useEffect(() => {
    const title = page === "bildungsplan"
      ? "Bildungsplan-Check · Informatik-Lernlabor"
      : page === "projekte"
        ? "Projektphasen · Informatik-Lernlabor"
        : page.startsWith("module/")
          ? "Lernkapitel · Informatik-Lernlabor"
          : "Informatik-Lernlabor Klasse 11/12";
    document.title = title;

    if (window.location.hash) {
      window.requestAnimationFrame(() => {
        document.querySelector(window.location.hash)?.scrollIntoView();
      });
    }
  }, [page]);

  if (page === "bildungsplan") return <CurriculumPage />;
  if (page === "projekte") return <ProjectsPage />;
  if (page.startsWith("module/")) return <ModulePage slug={page.slice("module/".length)} />;
  return <Home />;
}
