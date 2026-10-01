// This flag is false in every production build, including a build with a custom mode.
// The private local server supplies content; no codes or plaintext payloads are bundled.
export const isTeacherPreview = import.meta.env.DEV
  && import.meta.env.MODE === "teacher-preview"
  && ["127.0.0.1", "localhost", "[::1]"].includes(window.location.hostname);

export async function readTeacherPreview<T>(kind: "access" | "protected", scope: string, signal?: AbortSignal): Promise<T> {
  if (!isTeacherPreview) throw new Error("Die Lehrkraftvorschau ist hier nicht aktiv.");
  const response = await fetch(`/__teacher-preview/${kind}/${encodeURIComponent(scope)}`, {
    headers: { "X-Lernlabor-Preview": "local" }, cache: "no-store", signal,
  });
  if (!response.ok) throw new Error("Die lokale Vorschau ist nicht erreichbar. Bitte den privaten Vorschau-Server starten.");
  return response.json() as Promise<T>;
}
