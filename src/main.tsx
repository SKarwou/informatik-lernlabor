import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
import "./learning.css";
import { ProtectedProvider } from "./components/ProtectedContent";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ProtectedProvider><App /></ProtectedProvider>
  </StrictMode>,
);
