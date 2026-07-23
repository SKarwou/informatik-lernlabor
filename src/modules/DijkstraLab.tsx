import { useEffect, useMemo, useState } from "react";

type NodeId = "A" | "B" | "C" | "D" | "E" | "F";

type GraphNode = {
  id: NodeId;
  name: string;
  x: number;
  y: number;
};

type Edge = {
  from: NodeId;
  to: NodeId;
  weight: number;
};

type DijkstraStep = {
  current: NodeId | null;
  visited: NodeId[];
  distances: Record<NodeId, number>;
  previous: Partial<Record<NodeId, NodeId>>;
  message: string;
};

const NODE_IDS: NodeId[] = ["A", "B", "C", "D", "E", "F"];

const NODES: GraphNode[] = [
  { id: "A", name: "Schule", x: 80, y: 80 },
  { id: "B", name: "Bibliothek", x: 270, y: 50 },
  { id: "C", name: "Park", x: 480, y: 95 },
  { id: "D", name: "Bahnhof", x: 135, y: 255 },
  { id: "E", name: "Sporthalle", x: 340, y: 235 },
  { id: "F", name: "Museum", x: 535, y: 280 },
];

const EDGES: Edge[] = [
  { from: "A", to: "B", weight: 4 },
  { from: "A", to: "D", weight: 2 },
  { from: "B", to: "C", weight: 3 },
  { from: "B", to: "D", weight: 5 },
  { from: "B", to: "E", weight: 1 },
  { from: "C", to: "E", weight: 4 },
  { from: "C", to: "F", weight: 2 },
  { from: "D", to: "E", weight: 6 },
  { from: "E", to: "F", weight: 3 },
];

function createEmptyDistances(): Record<NodeId, number> {
  return {
    A: Number.POSITIVE_INFINITY,
    B: Number.POSITIVE_INFINITY,
    C: Number.POSITIVE_INFINITY,
    D: Number.POSITIVE_INFINITY,
    E: Number.POSITIVE_INFINITY,
    F: Number.POSITIVE_INFINITY,
  };
}

function formatDistance(distance: number) {
  if (distance === Number.POSITIVE_INFINITY) {
    return "∞";
  }

  return String(distance);
}

function getNeighbors(node: NodeId) {
  return EDGES.flatMap((edge) => {
    if (edge.from === node) {
      return [
        {
          node: edge.to,
          weight: edge.weight,
        },
      ];
    }

    if (edge.to === node) {
      return [
        {
          node: edge.from,
          weight: edge.weight,
        },
      ];
    }

    return [];
  });
}

function createDijkstraSteps(
  start: NodeId,
  target: NodeId,
): DijkstraStep[] {
  const distances = createEmptyDistances();
  const previous: Partial<Record<NodeId, NodeId>> = {};
  const visited: NodeId[] = [];

  distances[start] = 0;

  const steps: DijkstraStep[] = [
    {
      current: start,
      visited: [],
      distances: { ...distances },
      previous: {},
      message:
        `Wir beginnen bei Knoten ${start}. Seine Entfernung beträgt 0. ` +
        "Alle anderen Entfernungen sind zunächst unbekannt.",
    },
  ];

  while (visited.length < NODE_IDS.length) {
    const unvisitedNodes = NODE_IDS.filter(
      (node) => !visited.includes(node),
    );

    const current = unvisitedNodes.reduce<NodeId | null>(
      (smallest, node) => {
        if (smallest === null) {
          return node;
        }

        if (distances[node] < distances[smallest]) {
          return node;
        }

        return smallest;
      },
      null,
    );

    if (
      current === null ||
      distances[current] === Number.POSITIVE_INFINITY
    ) {
      break;
    }

    steps.push({
      current,
      visited: [...visited],
      distances: { ...distances },
      previous: { ...previous },
      message:
        `Knoten ${current} besitzt mit ${distances[current]} ` +
        "die kleinste vorläufige Entfernung und wird untersucht.",
    });

    visited.push(current);

    if (current === target) {
      steps.push({
        current,
        visited: [...visited],
        distances: { ...distances },
        previous: { ...previous },
        message:
          `Das Ziel ${target} wurde erreicht. Die kürzeste Entfernung ` +
          `beträgt ${distances[target]}.`,
      });

      break;
    }

    const neighbors = getNeighbors(current);

    for (const neighbor of neighbors) {
      if (visited.includes(neighbor.node)) {
        continue;
      }

      const alternativeDistance =
        distances[current] + neighbor.weight;

      const oldDistance = distances[neighbor.node];

      if (alternativeDistance < oldDistance) {
        distances[neighbor.node] = alternativeDistance;
        previous[neighbor.node] = current;

        steps.push({
          current,
          visited: [...visited],
          distances: { ...distances },
          previous: { ...previous },
          message:
            `Über ${current} erreichen wir ${neighbor.node} mit ` +
            `${distances[current]} + ${neighbor.weight} = ` +
            `${alternativeDistance}. Das ist kürzer als ` +
            `${formatDistance(oldDistance)}.`,
        });
      } else {
        steps.push({
          current,
          visited: [...visited],
          distances: { ...distances },
          previous: { ...previous },
          message:
            `Der Weg über ${current} nach ${neighbor.node} hätte ` +
            `die Länge ${alternativeDistance}. Der bereits bekannte ` +
            `Weg mit ${formatDistance(oldDistance)} ist nicht länger.`,
        });
      }
    }
  }

  return steps;
}

function createPath(
  start: NodeId,
  target: NodeId,
  previous: Partial<Record<NodeId, NodeId>>,
) {
  const path: NodeId[] = [];
  let current: NodeId | undefined = target;

  while (current !== undefined) {
    path.unshift(current);

    if (current === start) {
      return path;
    }

    current = previous[current];
  }

  return [];
}

function isPartOfPath(edge: Edge, path: NodeId[]) {
  return path.some((node, index) => {
    const nextNode = path[index + 1];

    if (nextNode === undefined) {
      return false;
    }

    return (
      (edge.from === node && edge.to === nextNode) ||
      (edge.to === node && edge.from === nextNode)
    );
  });
}

export default function DijkstraLab() {
  const [start, setStart] = useState<NodeId>("A");
  const [target, setTarget] = useState<NodeId>("F");
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(
    null,
  );

  const steps = useMemo(
    () => createDijkstraSteps(start, target),
    [start, target],
  );

  const step =
    steps[Math.min(stepIndex, steps.length - 1)];

  const isFinished =
    stepIndex === steps.length - 1;

  const progress =
    steps.length > 1
      ? (stepIndex / (steps.length - 1)) * 100
      : 0;

  const path = isFinished
    ? createPath(start, target, step.previous)
    : [];

  useEffect(() => {
    setStepIndex(0);
    setIsPlaying(false);
    setQuizAnswer(null);
  }, [start, target]);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    if (stepIndex >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setStepIndex((current) =>
        Math.min(current + 1, steps.length - 1),
      );
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [isPlaying, stepIndex, steps.length]);

  function restart() {
    setStepIndex(0);
    setIsPlaying(false);
  }

  function togglePlayback() {
    if (isFinished) {
      setStepIndex(0);
      setIsPlaying(true);
      return;
    }

    setIsPlaying((playing) => !playing);
  }

  return (
    <div className="dijkstra-page" id="top">
      <style>{`
        .dijkstra-page {
          --blue: #175de8;
          --dark: #0b234f;
          --cyan: #13b9d6;
          --green: #18a66a;
          --border: #d9e4f4;
          --soft: #f3f7fc;
          min-height: calc(100vh - 90px);
          color: var(--dark);
          background: #ffffff;
        }

        .dijkstra-page * {
          box-sizing: border-box;
        }

        .dijkstra-hero {
          position: relative;
          overflow: hidden;
          padding: 85px max(24px, calc((100vw - 1240px) / 2)) 75px;
          background:
            radial-gradient(
              circle at 85% 20%,
              rgba(19, 185, 214, 0.2),
              transparent 25%
            ),
            linear-gradient(
              135deg,
              #f8fbff 0%,
              #edf4ff 100%
            );
          border-bottom: 1px solid var(--border);
        }

        .dijkstra-hero::after {
          content: "";
          position: absolute;
          right: -100px;
          bottom: -240px;
          width: 420px;
          height: 420px;
          border: 2px solid rgba(23, 93, 232, 0.12);
          border-radius: 50%;
        }

        .dijkstra-eyebrow,
        .dijkstra-label {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: var(--blue);
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .dijkstra-eyebrow span {
          display: grid;
          place-items: center;
          width: 35px;
          height: 35px;
          color: white;
          background: var(--blue);
          border-radius: 10px;
        }

        .dijkstra-hero h1 {
          max-width: 850px;
          margin: 25px 0 20px;
          font-size: clamp(2.8rem, 6vw, 5.2rem);
          line-height: 0.98;
          letter-spacing: -0.055em;
        }

        .dijkstra-hero > p {
          max-width: 720px;
          margin: 0;
          color: #40587c;
          font-size: 1.15rem;
          line-height: 1.75;
        }

        .dijkstra-goals {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .dijkstra-goals span {
          padding: 10px 15px;
          color: #28466f;
          background: rgba(255, 255, 255, 0.85);
          border: 1px solid var(--border);
          border-radius: 999px;
          font-size: 0.88rem;
          font-weight: 700;
        }

        .dijkstra-content {
          width: min(1240px, calc(100% - 48px));
          margin: 0 auto;
          padding: 70px 0 90px;
        }

        .dijkstra-intro {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 24px;
          margin-bottom: 70px;
        }

        .dijkstra-info,
        .dijkstra-principle,
        .dijkstra-graph-card,
        .dijkstra-distance-card,
        .dijkstra-quiz {
          border: 1px solid var(--border);
          border-radius: 24px;
          box-shadow:
            0 18px 50px rgba(18, 55, 105, 0.08);
        }

        .dijkstra-info,
        .dijkstra-principle {
          padding: 30px;
        }

        .dijkstra-info h2,
        .dijkstra-lab-heading h2,
        .dijkstra-quiz h2 {
          margin: 12px 0 15px;
          font-size: clamp(1.7rem, 3vw, 2.4rem);
          letter-spacing: -0.035em;
        }

        .dijkstra-info p,
        .dijkstra-principle p,
        .dijkstra-lab-heading p,
        .dijkstra-quiz > p {
          margin: 0;
          color: #526682;
          line-height: 1.7;
        }

        .dijkstra-principle {
          color: white;
          background: var(--dark);
          border-color: var(--dark);
        }

        .dijkstra-principle strong {
          color: #74dff0;
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .dijkstra-principle p {
          margin-top: 12px;
          color: #d7e5f8;
        }

        .dijkstra-principle ol {
          margin: 20px 0 0;
          padding-left: 22px;
          line-height: 1.9;
        }

        .dijkstra-lab-heading {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 25px;
          margin-bottom: 25px;
        }

        .dijkstra-selectors {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .dijkstra-selectors label {
          display: grid;
          gap: 6px;
          color: #5c6e89;
          font-size: 0.74rem;
          font-weight: 800;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .dijkstra-selectors select {
          min-width: 150px;
          padding: 11px 14px;
          color: var(--dark);
          background: white;
          border: 1px solid #cbd9ec;
          border-radius: 11px;
          font: inherit;
          font-weight: 700;
        }

        .dijkstra-lab-grid {
          display: grid;
          grid-template-columns:
            minmax(0, 1.45fr)
            minmax(300px, 0.75fr);
          gap: 24px;
        }

        .dijkstra-graph-card {
          overflow: hidden;
          background: #fbfdff;
        }

        .dijkstra-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 20px 24px;
          background: white;
          border-bottom: 1px solid var(--border);
        }

        .dijkstra-card-header strong {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .dijkstra-status {
          width: 10px;
          height: 10px;
          background: var(--green);
          border-radius: 50%;
          box-shadow:
            0 0 0 5px rgba(24, 166, 106, 0.12);
        }

        .dijkstra-card-header > span {
          color: #60718d;
          font-size: 0.88rem;
          font-weight: 700;
        }

        .dijkstra-graph {
          display: block;
          width: 100%;
          min-height: 390px;
          padding: 18px;
        }

        .dijkstra-edge {
          stroke: #bccbe0;
          stroke-width: 5;
          stroke-linecap: round;
          transition: 0.3s;
        }

        .dijkstra-edge.path {
          stroke: var(--green);
          stroke-width: 8;
        }

        .dijkstra-weight {
          fill: white;
          stroke: #cedbed;
          stroke-width: 2;
        }

        .dijkstra-weight-text {
          fill: #3c5374;
          font-size: 15px;
          font-weight: 800;
          text-anchor: middle;
          dominant-baseline: middle;
        }

        .dijkstra-node circle {
          fill: white;
          stroke: var(--blue);
          stroke-width: 4;
          transition: 0.3s;
        }

        .dijkstra-node text {
          fill: var(--dark);
          font-size: 20px;
          font-weight: 900;
          text-anchor: middle;
          dominant-baseline: middle;
        }

        .dijkstra-node.visited circle {
          fill: #d9f7ea;
          stroke: var(--green);
        }

        .dijkstra-node.current circle {
          fill: #dce8ff;
          stroke: var(--blue);
          stroke-width: 7;
        }

        .dijkstra-node.path circle {
          fill: var(--green);
          stroke: #087b4a;
        }

        .dijkstra-node.path text {
          fill: white;
        }

        .dijkstra-node .node-name {
          fill: #687c98;
          font-size: 12px;
          font-weight: 700;
        }

        .dijkstra-message {
          display: flex;
          gap: 15px;
          margin: 0 24px 24px;
          padding: 18px;
          color: #29466f;
          background: #edf4ff;
          border-left: 4px solid var(--blue);
          border-radius: 12px;
          line-height: 1.55;
        }

        .dijkstra-message span {
          display: grid;
          flex: 0 0 auto;
          place-items: center;
          width: 29px;
          height: 29px;
          color: white;
          background: var(--blue);
          border-radius: 50%;
          font-weight: 900;
        }

        .dijkstra-progress {
          height: 7px;
          margin: 0 24px;
          overflow: hidden;
          background: #e4ecf7;
          border-radius: 999px;
        }

        .dijkstra-progress span {
          display: block;
          height: 100%;
          background:
            linear-gradient(
              90deg,
              var(--blue),
              var(--cyan)
            );
          border-radius: inherit;
          transition: width 0.35s;
        }

        .dijkstra-controls {
          display: grid;
          grid-template-columns:
            1fr 1fr 1.3fr 1fr;
          gap: 10px;
          padding: 20px 24px 24px;
        }

        .dijkstra-controls button {
          padding: 12px 10px;
          color: #2a456d;
          background: white;
          border: 1px solid #cbd9ec;
          border-radius: 11px;
          font: inherit;
          font-weight: 800;
          cursor: pointer;
        }

        .dijkstra-controls button:hover:not(:disabled) {
          border-color: var(--blue);
          transform: translateY(-1px);
        }

        .dijkstra-controls button:disabled {
          cursor: not-allowed;
          opacity: 0.42;
        }

        .dijkstra-controls .play-button {
          color: white;
          background: var(--blue);
          border-color: var(--blue);
        }

        .dijkstra-sidebar {
          display: grid;
          gap: 18px;
          align-content: start;
        }

        .dijkstra-distance-card {
          overflow: hidden;
          background: white;
        }

        .dijkstra-distance-card h3 {
          margin: 0;
          padding: 20px 22px;
          font-size: 1.05rem;
          border-bottom: 1px solid var(--border);
        }

        .dijkstra-distances {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          padding: 18px;
        }

        .distance-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          color: #4b607f;
          background: var(--soft);
          border: 1px solid transparent;
          border-radius: 11px;
        }

        .distance-item.current {
          color: var(--blue);
          background: #eaf1ff;
          border-color: #a9c3ff;
        }

        .distance-item.visited {
          color: #0c7c4c;
          background: #e9f8f1;
        }

        .distance-item strong {
          font-size: 1.15rem;
        }

        .dijkstra-result {
          padding: 22px;
          color: white;
          background:
            linear-gradient(
              135deg,
              #0b234f,
              #153d7a
            );
          border-radius: 24px;
          box-shadow:
            0 18px 50px rgba(18, 55, 105, 0.15);
        }

        .dijkstra-result small {
          color: #8de4f2;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .dijkstra-result strong {
          display: block;
          margin: 9px 0;
          font-size: 1.6rem;
        }

        .dijkstra-result p {
          margin: 0;
          color: #d7e5f9;
          line-height: 1.55;
        }

        .dijkstra-quiz {
          margin-top: 70px;
          padding: 34px;
          background: #f8fbff;
        }

        .dijkstra-answers {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          margin-top: 24px;
        }

        .dijkstra-answers button {
          padding: 16px;
          color: #29466f;
          background: white;
          border: 1px solid #cad8eb;
          border-radius: 14px;
          font: inherit;
          font-weight: 800;
          cursor: pointer;
        }

        .dijkstra-answers button.correct {
          color: #087a49;
          background: #e7f8f0;
          border-color: #62c89c;
        }

        .dijkstra-answers button.wrong {
          color: #b13b42;
          background: #fff0f1;
          border-color: #ee9fa4;
        }

        .dijkstra-feedback {
          margin: 18px 0 0;
          padding: 15px 18px;
          color: #304c73;
          background: white;
          border-radius: 12px;
          line-height: 1.6;
        }

        @media (max-width: 900px) {
          .dijkstra-intro,
          .dijkstra-lab-grid {
            grid-template-columns: 1fr;
          }

          .dijkstra-lab-heading {
            align-items: start;
            flex-direction: column;
          }
        }

        @media (max-width: 620px) {
          .dijkstra-content {
            width: calc(100% - 28px);
            padding-top: 48px;
          }

          .dijkstra-hero {
            padding-top: 55px;
          }

          .dijkstra-graph {
            min-height: 300px;
            padding: 4px;
          }

          .dijkstra-controls {
            grid-template-columns: repeat(2, 1fr);
          }

          .dijkstra-answers {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section className="dijkstra-hero">
        <span className="dijkstra-eyebrow">
          <span>02</span>
          Graphen und Algorithmen
        </span>

        <h1>
          Den kürzesten Weg
          <br />
          sichtbar finden
        </h1>

        <p>
          Wie findet ein Navigationssystem den schnellsten Weg?
          Der Dijkstra-Algorithmus untersucht verschiedene Wege
          und merkt sich schrittweise die jeweils kürzeste
          bekannte Entfernung.
        </p>

        <div
          className="dijkstra-goals"
          aria-label="Lernziele"
        >
          <span>✓ Graphen verstehen</span>
          <span>✓ Kantengewichte auswerten</span>
          <span>✓ Dijkstra anwenden</span>
        </div>
      </section>

      <div className="dijkstra-content">
        <section className="dijkstra-intro">
          <article className="dijkstra-info">
            <span className="dijkstra-label">
              Grundwissen
            </span>

            <h2>Was ist ein Graph?</h2>

            <p>
              Ein Graph besteht aus <strong>Knoten</strong> und{" "}
              <strong>Kanten</strong>. Die Knoten können zum
              Beispiel Orte darstellen. Die Kanten verbinden
              diese Orte. Die Zahl an einer Kante gibt hier die
              Länge des Weges an.
            </p>
          </article>

          <article className="dijkstra-principle">
            <strong>Die Grundidee</strong>

            <p>
              Untersuche immer den noch nicht besuchten Knoten
              mit der kleinsten bekannten Entfernung.
            </p>

            <ol>
              <li>Startentfernung auf 0 setzen</li>
              <li>Kleinsten offenen Knoten wählen</li>
              <li>Entfernungen zu Nachbarn verbessern</li>
              <li>Knoten als besucht markieren</li>
            </ol>
          </article>
        </section>

        <section>
          <div className="dijkstra-lab-heading">
            <div>
              <span className="dijkstra-label">
                Interaktive Übung
              </span>

              <h2>Finde den kürzesten Weg</h2>

              <p>
                Wähle Start und Ziel. Gehe danach Schritt für
                Schritt vor oder lasse die Suche automatisch
                ablaufen.
              </p>
            </div>

            <div className="dijkstra-selectors">
              <label>
                Start
                <select
                  value={start}
                  onChange={(event) =>
                    setStart(
                      event.target.value as NodeId,
                    )
                  }
                >
                  {NODES.map((node) => (
                    <option
                      key={node.id}
                      value={node.id}
                      disabled={node.id === target}
                    >
                      {node.id} · {node.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Ziel
                <select
                  value={target}
                  onChange={(event) =>
                    setTarget(
                      event.target.value as NodeId,
                    )
                  }
                >
                  {NODES.map((node) => (
                    <option
                      key={node.id}
                      value={node.id}
                      disabled={node.id === start}
                    >
                      {node.id} · {node.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="dijkstra-lab-grid">
            <article className="dijkstra-graph-card">
              <div className="dijkstra-card-header">
                <strong>
                  <span className="dijkstra-status" />
                  Schritt {stepIndex + 1} von{" "}
                  {steps.length}
                </strong>

                <span>
                  Start {start} → Ziel {target}
                </span>
              </div>

              <svg
                className="dijkstra-graph"
                viewBox="0 0 620 350"
                role="img"
                aria-label="Graph für die Dijkstra-Übung"
              >
                {EDGES.map((edge) => {
                  const from = NODES.find(
                    (node) => node.id === edge.from,
                  )!;

                  const to = NODES.find(
                    (node) => node.id === edge.to,
                  )!;

                  const middleX =
                    (from.x + to.x) / 2;

                  const middleY =
                    (from.y + to.y) / 2;

                  const pathEdge =
                    isPartOfPath(edge, path);

                  return (
                    <g
                      key={`${edge.from}-${edge.to}`}
                    >
                      <line
                        className={
                          pathEdge
                            ? "dijkstra-edge path"
                            : "dijkstra-edge"
                        }
                        x1={from.x}
                        y1={from.y}
                        x2={to.x}
                        y2={to.y}
                      />

                      <circle
                        className="dijkstra-weight"
                        cx={middleX}
                        cy={middleY}
                        r="16"
                      />

                      <text
                        className="dijkstra-weight-text"
                        x={middleX}
                        y={middleY + 1}
                      >
                        {edge.weight}
                      </text>
                    </g>
                  );
                })}

                {NODES.map((node) => {
                  const classes = [
                    "dijkstra-node",
                    step.visited.includes(node.id)
                      ? "visited"
                      : "",
                    step.current === node.id
                      ? "current"
                      : "",
                    path.includes(node.id)
                      ? "path"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <g
                      key={node.id}
                      className={classes}
                      transform={
                        `translate(${node.x} ${node.y})`
                      }
                    >
                      <circle r="29" />

                      <text y="1">
                        {node.id}
                      </text>

                      <text
                        className="node-name"
                        y="48"
                      >
                        {node.name}
                      </text>
                    </g>
                  );
                })}
              </svg>

              <div
                className="dijkstra-message"
                aria-live="polite"
              >
                <span>i</span>
                <div>{step.message}</div>
              </div>

              <div
                className="dijkstra-progress"
                aria-label={
                  `Fortschritt ${Math.round(progress)} Prozent`
                }
              >
                <span
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>

              <div className="dijkstra-controls">
                <button
                  onClick={restart}
                  disabled={stepIndex === 0}
                >
                  ↺ Start
                </button>

                <button
                  onClick={() => {
                    setIsPlaying(false);

                    setStepIndex((current) =>
                      Math.max(0, current - 1),
                    );
                  }}
                  disabled={stepIndex === 0}
                >
                  ← Zurück
                </button>

                <button
                  className="play-button"
                  onClick={togglePlayback}
                >
                  {isPlaying
                    ? "Ⅱ Pause"
                    : isFinished
                      ? "▶ Neu starten"
                      : "▶ Abspielen"}
                </button>

                <button
                  onClick={() => {
                    setIsPlaying(false);

                    setStepIndex((current) =>
                      Math.min(
                        steps.length - 1,
                        current + 1,
                      ),
                    );
                  }}
                  disabled={isFinished}
                >
                  Weiter →
                </button>
              </div>
            </article>

            <aside className="dijkstra-sidebar">
              <section className="dijkstra-distance-card">
                <h3>Vorläufige Entfernungen</h3>

                <div className="dijkstra-distances">
                  {NODE_IDS.map((node) => {
                    const classes = [
                      "distance-item",
                      step.current === node
                        ? "current"
                        : "",
                      step.visited.includes(node)
                        ? "visited"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ");

                    return (
                      <div
                        className={classes}
                        key={node}
                      >
                        <span>Knoten {node}</span>

                        <strong>
                          {formatDistance(
                            step.distances[node],
                          )}
                        </strong>
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="dijkstra-result">
                <small>
                  {isFinished
                    ? "Ergebnis"
                    : "Noch in Arbeit"}
                </small>

                <strong>
                  {isFinished && path.length > 0
                    ? path.join(" → ")
                    : "Schrittweise suchen"}
                </strong>

                <p>
                  {isFinished
                    ? `Die kürzeste Entfernung beträgt ${formatDistance(
                        step.distances[target],
                      )}.`
                    : "Grüne Knoten wurden bereits endgültig untersucht. Der blaue Knoten ist gerade an der Reihe."}
                </p>
              </section>
            </aside>
          </div>
        </section>

        <section className="dijkstra-quiz">
          <span className="dijkstra-label">
            Lerncheck
          </span>

          <h2>
            Warum wählt Dijkstra immer den kleinsten
            offenen Wert?
          </h2>

          <p>
            Wähle die passende Begründung. Du erhältst
            sofort eine Rückmeldung.
          </p>

          <div className="dijkstra-answers">
            {[
              "Damit möglichst viele Knoten gleichzeitig besucht werden.",
              "Weil dieser Weg durch nichtnegative Kantengewichte später nicht mehr kürzer werden kann.",
              "Weil der Algorithmus immer alphabetisch vorgeht.",
            ].map((answer, index) => {
              let answerClass = "";

              if (
                quizAnswer !== null &&
                index === 1
              ) {
                answerClass = "correct";
              } else if (
                quizAnswer === index &&
                index !== 1
              ) {
                answerClass = "wrong";
              }

              return (
                <button
                  key={answer}
                  className={answerClass}
                  onClick={() =>
                    setQuizAnswer(index)
                  }
                >
                  {String.fromCharCode(
                    65 + index,
                  )}
                  {" · "}
                  {answer}
                </button>
              );
            })}
          </div>

          {quizAnswer !== null && (
            <p
              className="dijkstra-feedback"
              aria-live="polite"
            >
              {quizAnswer === 1
                ? "Richtig! Bei nichtnegativen Kantengewichten kann kein späterer Umweg die bereits kleinste offene Entfernung noch verbessern."
                : "Noch nicht ganz. Entscheidend ist, dass Dijkstra nur mit nichtnegativen Kantengewichten arbeitet."}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}