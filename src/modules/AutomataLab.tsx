import { useEffect, useMemo, useState } from "react";

type StateId = "q0" | "q1" | "q2";
type BinarySymbol = "0" | "1";

type StateInformation = {
  id: StateId;
  title: string;
  description: string;
  accepting: boolean;
};

const STATES: StateInformation[] = [
  {
    id: "q0",
    title: "Startzustand",
    description:
      "Das Wort endet bisher nicht auf 0 oder 01.",
    accepting: false,
  },
  {
    id: "q1",
    title: "Letztes Zeichen: 0",
    description:
      "Das zuletzt gelesene Zeichen war eine 0.",
    accepting: false,
  },
  {
    id: "q2",
    title: "Endung 01 erkannt",
    description:
      "Die letzten beiden Zeichen sind 01.",
    accepting: true,
  },
];

const TRANSITIONS: Record<
  StateId,
  Record<BinarySymbol, StateId>
> = {
  q0: {
    "0": "q1",
    "1": "q0",
  },
  q1: {
    "0": "q1",
    "1": "q2",
  },
  q2: {
    "0": "q1",
    "1": "q0",
  },
};

const EXAMPLE_WORDS = [
  "01",
  "1101",
  "1010",
  "0001",
  "111",
];

function readWord(
  word: string,
  numberOfCharacters: number,
) {
  let state: StateId = "q0";

  const processedWord = word.slice(
    0,
    numberOfCharacters,
  );

  for (const character of processedWord) {
    state =
      TRANSITIONS[state][
        character as BinarySymbol
      ];
  }

  return state;
}

function getStateInformation(state: StateId) {
  return (
    STATES.find((item) => item.id === state) ??
    STATES[0]
  );
}

export default function AutomataLab() {
  const [word, setWord] = useState("1101");
  const [position, setPosition] = useState(0);
  const [isPlaying, setIsPlaying] =
    useState(false);

  const [quizAnswer, setQuizAnswer] =
    useState<number | null>(null);

  const currentState = useMemo(
    () => readWord(word, position),
    [word, position],
  );

  const stateInformation =
    getStateInformation(currentState);

  const isFinished =
    word.length > 0 &&
    position === word.length;

  const isAccepted =
    isFinished && currentState === "q2";

  const currentSymbol =
    position < word.length
      ? (word[position] as BinarySymbol)
      : null;

  const nextState =
    currentSymbol !== null
      ? TRANSITIONS[currentState][currentSymbol]
      : null;

  const progress =
    word.length > 0
      ? (position / word.length) * 100
      : 0;

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    if (position >= word.length) {
      setIsPlaying(false);
      return;
    }

    const timer = window.setTimeout(() => {
      setPosition((current) =>
        Math.min(current + 1, word.length),
      );
    }, 1000);

    return () =>
      window.clearTimeout(timer);
  }, [isPlaying, position, word.length]);

  function changeWord(value: string) {
    const cleanedWord = value
      .replace(/[^01]/g, "")
      .slice(0, 14);

    setWord(cleanedWord);
    setPosition(0);
    setIsPlaying(false);
    setQuizAnswer(null);
  }

  function selectExample(example: string) {
    setWord(example);
    setPosition(0);
    setIsPlaying(false);
    setQuizAnswer(null);
  }

  function restart() {
    setPosition(0);
    setIsPlaying(false);
  }

  function togglePlayback() {
    if (word.length === 0) {
      return;
    }

    if (isFinished) {
      setPosition(0);
      setIsPlaying(true);
      return;
    }

    setIsPlaying((playing) => !playing);
  }

  return (
    <div className="automata-page" id="top">
      <style>{`
        .automata-page {
          --automata-blue: #175de8;
          --automata-purple: #7554e8;
          --automata-dark: #0b234f;
          --automata-green: #159866;
          --automata-red: #cf4c58;
          --automata-border: #dedcf2;
          --automata-soft: #f6f4ff;
          min-height: calc(100vh - 90px);
          color: var(--automata-dark);
          background: #ffffff;
        }

        .automata-page * {
          box-sizing: border-box;
        }

        .automata-hero {
          position: relative;
          overflow: hidden;
          padding: 85px max(
            24px,
            calc((100vw - 1240px) / 2)
          ) 75px;
          background:
            radial-gradient(
              circle at 84% 20%,
              rgba(117, 84, 232, 0.2),
              transparent 27%
            ),
            linear-gradient(
              135deg,
              #faf9ff,
              #f0edff
            );
          border-bottom:
            1px solid var(--automata-border);
        }

        .automata-hero::after {
          content: "";
          position: absolute;
          right: 7%;
          bottom: -125px;
          width: 300px;
          height: 300px;
          border:
            32px double
            rgba(117, 84, 232, 0.07);
          border-radius: 50%;
          pointer-events: none;
        }

        .automata-eyebrow,
        .automata-label {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: var(--automata-purple);
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .automata-eyebrow span {
          display: grid;
          place-items: center;
          width: 36px;
          height: 36px;
          color: white;
          background: var(--automata-purple);
          border-radius: 50%;
        }

        .automata-hero h1 {
          position: relative;
          z-index: 1;
          max-width: 850px;
          margin: 25px 0 20px;
          font-size: clamp(
            2.8rem,
            6vw,
            5.2rem
          );
          line-height: 0.98;
          letter-spacing: -0.055em;
        }

        .automata-hero > p {
          position: relative;
          z-index: 1;
          max-width: 730px;
          margin: 0;
          color: #4e5d7c;
          font-size: 1.15rem;
          line-height: 1.75;
        }

        .automata-goals {
          position: relative;
          z-index: 1;
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 30px;
        }

        .automata-goals span {
          padding: 10px 15px;
          color: #3e3a73;
          background:
            rgba(255, 255, 255, 0.88);
          border:
            1px solid var(--automata-border);
          border-radius: 999px;
          font-size: 0.88rem;
          font-weight: 700;
        }

        .automata-content {
          width: min(
            1240px,
            calc(100% - 48px)
          );
          margin: 0 auto;
          padding: 70px 0 90px;
        }

        .automata-intro {
          display: grid;
          grid-template-columns:
            1.2fr 0.8fr;
          gap: 24px;
          margin-bottom: 70px;
        }

        .automata-info,
        .automata-rule,
        .automata-machine,
        .automata-transition-card,
        .automata-table-card,
        .automata-quiz {
          border:
            1px solid var(--automata-border);
          border-radius: 24px;
          box-shadow:
            0 18px 50px
            rgba(39, 34, 100, 0.08);
        }

        .automata-info,
        .automata-rule {
          padding: 30px;
        }

        .automata-info h2,
        .automata-heading h2,
        .automata-quiz h2 {
          margin: 12px 0 15px;
          font-size: clamp(
            1.7rem,
            3vw,
            2.4rem
          );
          letter-spacing: -0.035em;
        }

        .automata-info p,
        .automata-rule p,
        .automata-heading p,
        .automata-quiz > p {
          margin: 0;
          color: #566783;
          line-height: 1.7;
        }

        .automata-rule {
          color: white;
          background:
            linear-gradient(
              135deg,
              #21194f,
              #392878
            );
          border-color: #2c2160;
        }

        .automata-rule strong {
          color: #c8b9ff;
          font-size: 0.8rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .automata-rule p {
          margin-top: 12px;
          color: #e1dcfa;
        }

        .automata-rule ul {
          margin: 20px 0 0;
          padding-left: 22px;
          line-height: 1.9;
        }

        .automata-heading {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 25px;
          margin-bottom: 25px;
        }

        .automata-word-input {
          display: grid;
          gap: 7px;
          min-width: 250px;
          color: #5d6e88;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .automata-word-input input {
          width: 100%;
          padding: 12px 14px;
          color: var(--automata-dark);
          background: white;
          border:
            1px solid #cbc7e9;
          border-radius: 11px;
          font-family: monospace;
          font-size: 1.05rem;
          font-weight: 900;
          letter-spacing: 0.12em;
        }

        .automata-lab-grid {
          display: grid;
          grid-template-columns:
            minmax(0, 1.4fr)
            minmax(300px, 0.75fr);
          gap: 24px;
          align-items: start;
        }

        .automata-machine {
          overflow: hidden;
          background: #fcfbff;
        }

        .automata-card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 20px 24px;
          background: white;
          border-bottom:
            1px solid var(--automata-border);
        }

        .automata-card-header strong {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .automata-status-dot {
          width: 10px;
          height: 10px;
          background: var(--automata-purple);
          border-radius: 50%;
          box-shadow:
            0 0 0 5px
            rgba(117, 84, 232, 0.13);
        }

        .automata-card-header span {
          color: #687690;
          font-size: 0.88rem;
          font-weight: 700;
        }

        .automata-word {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 9px;
          min-height: 82px;
          padding: 24px;
          background: #f4f1ff;
          border-bottom:
            1px solid var(--automata-border);
        }

        .automata-character {
          display: grid;
          place-items: center;
          width: 43px;
          height: 43px;
          color: #53627b;
          background: white;
          border:
            2px solid #cbc7e9;
          border-radius: 11px;
          font-family: monospace;
          font-size: 1.2rem;
          font-weight: 900;
          transition: 0.25s;
        }

        .automata-character.processed {
          color: white;
          background: var(--automata-purple);
          border-color:
            var(--automata-purple);
        }

        .automata-character.current {
          color: var(--automata-purple);
          border-color:
            var(--automata-purple);
          box-shadow:
            0 0 0 5px
            rgba(117, 84, 232, 0.12);
          transform: translateY(-3px);
        }

        .automata-empty-word {
          color: #738199;
          font-size: 0.9rem;
        }

        .automata-states {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 16px;
          padding: 30px 24px;
        }

        .automata-state {
          position: relative;
          min-height: 180px;
          padding: 22px 17px;
          text-align: center;
          background: white;
          border:
            2px solid #d9d5ef;
          border-radius: 20px;
          transition: 0.3s;
        }

        .automata-state.active {
          border-color:
            var(--automata-purple);
          box-shadow:
            0 14px 35px
            rgba(117, 84, 232, 0.18);
          transform: translateY(-5px);
        }

        .automata-state.accepting {
          border-style: double;
          border-width: 5px;
        }

        .automata-state.active.accepting {
          border-color:
            var(--automata-green);
          box-shadow:
            0 14px 35px
            rgba(21, 152, 102, 0.18);
        }

        .automata-state-id {
          display: grid;
          place-items: center;
          width: 58px;
          height: 58px;
          margin: 0 auto 13px;
          color: var(--automata-purple);
          background: #eeeaff;
          border-radius: 50%;
          font-family: monospace;
          font-size: 1.25rem;
          font-weight: 900;
        }

        .automata-state.active
        .automata-state-id {
          color: white;
          background:
            var(--automata-purple);
        }

        .automata-state.active.accepting
        .automata-state-id {
          background:
            var(--automata-green);
        }

        .automata-state h3 {
          margin: 0 0 8px;
          font-size: 0.98rem;
        }

        .automata-state p {
          margin: 0;
          color: #65748d;
          font-size: 0.82rem;
          line-height: 1.5;
        }

        .automata-accept-label {
          display: inline-block;
          margin-top: 10px;
          padding: 5px 9px;
          color: var(--automata-green);
          background: #e5f7ef;
          border-radius: 999px;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
        }

        .automata-message {
          display: flex;
          gap: 15px;
          margin: 0 24px 24px;
          padding: 18px;
          color: #3e4171;
          background: #eeebff;
          border-left:
            4px solid
            var(--automata-purple);
          border-radius: 12px;
          line-height: 1.55;
        }

        .automata-message span {
          display: grid;
          flex: 0 0 auto;
          place-items: center;
          width: 29px;
          height: 29px;
          color: white;
          background:
            var(--automata-purple);
          border-radius: 50%;
          font-weight: 900;
        }

        .automata-progress {
          height: 7px;
          margin: 0 24px;
          overflow: hidden;
          background: #e5e2f3;
          border-radius: 999px;
        }

        .automata-progress span {
          display: block;
          height: 100%;
          background:
            linear-gradient(
              90deg,
              var(--automata-purple),
              #ad7bec
            );
          border-radius: inherit;
          transition: width 0.35s;
        }

        .automata-controls {
          display: grid;
          grid-template-columns:
            1fr 1fr 1.3fr 1fr;
          gap: 10px;
          padding: 20px 24px 24px;
        }

        .automata-controls button {
          padding: 12px 10px;
          color: #3d4771;
          background: white;
          border:
            1px solid #cbc7e9;
          border-radius: 11px;
          font: inherit;
          font-weight: 800;
          cursor: pointer;
        }

        .automata-controls
        button:hover:not(:disabled) {
          border-color:
            var(--automata-purple);
          transform: translateY(-1px);
        }

        .automata-controls button:disabled {
          cursor: not-allowed;
          opacity: 0.42;
        }

        .automata-controls
        .automata-play {
          color: white;
          background:
            var(--automata-purple);
          border-color:
            var(--automata-purple);
        }

        .automata-sidebar {
          display: grid;
          gap: 18px;
          align-content: start;
        }

        .automata-transition-card,
        .automata-table-card {
          overflow: hidden;
          background: white;
        }

        .automata-transition-card h3,
        .automata-table-card h3 {
          margin: 0;
          padding: 20px 22px;
          font-size: 1.05rem;
          border-bottom:
            1px solid var(--automata-border);
        }

        .automata-transition-content {
          padding: 22px;
        }

        .automata-transition-formula {
          display: grid;
          grid-template-columns:
            1fr auto 1fr auto 1fr;
          align-items: center;
          gap: 8px;
          text-align: center;
        }

        .automata-transition-formula strong {
          padding: 12px 8px;
          color: var(--automata-purple);
          background: #f0edff;
          border-radius: 10px;
          font-family: monospace;
          font-size: 1.05rem;
        }

        .automata-transition-formula span {
          color: #77839a;
          font-weight: 900;
        }

        .automata-transition-content p {
          margin: 17px 0 0;
          color: #63728b;
          line-height: 1.6;
        }

        .automata-transition-table {
          width: 100%;
          border-collapse: collapse;
        }

        .automata-transition-table th,
        .automata-transition-table td {
          padding: 13px;
          text-align: center;
          border-bottom:
            1px solid #ebe9f5;
        }

        .automata-transition-table th {
          color: #69768e;
          background: #f7f5ff;
          font-size: 0.75rem;
          text-transform: uppercase;
        }

        .automata-transition-table
        tr.active {
          color: var(--automata-purple);
          background: #efecff;
          font-weight: 900;
        }

        .automata-result {
          padding: 23px;
          color: white;
          background:
            linear-gradient(
              135deg,
              #21194f,
              #493696
            );
          border-radius: 24px;
          box-shadow:
            0 18px 50px
            rgba(39, 34, 100, 0.16);
        }

        .automata-result.accepted {
          background:
            linear-gradient(
              135deg,
              #0d6849,
              #159866
            );
        }

        .automata-result.rejected {
          background:
            linear-gradient(
              135deg,
              #8c303a,
              #cf4c58
            );
        }

        .automata-result small {
          color: #d4c9ff;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .automata-result.accepted small,
        .automata-result.rejected small {
          color:
            rgba(255, 255, 255, 0.8);
        }

        .automata-result strong {
          display: block;
          margin: 9px 0;
          font-size: 1.55rem;
        }

        .automata-result p {
          margin: 0;
          color:
            rgba(255, 255, 255, 0.84);
          line-height: 1.55;
        }

        .automata-examples {
          margin-top: 70px;
        }

        .automata-example-list {
          display: flex;
          flex-wrap: wrap;
          gap: 11px;
          margin-top: 22px;
        }

        .automata-example-list button {
          padding: 12px 18px;
          color: var(--automata-purple);
          background: white;
          border:
            1px solid #cfc9ec;
          border-radius: 12px;
          font-family: monospace;
          font-size: 1rem;
          font-weight: 900;
          cursor: pointer;
        }

        .automata-example-list
        button:hover {
          color: white;
          background:
            var(--automata-purple);
        }

        .automata-quiz {
          margin-top: 70px;
          padding: 34px;
          background: #faf9ff;
        }

        .automata-answers {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 12px;
          margin-top: 24px;
        }

        .automata-answers button {
          padding: 16px;
          color: #40466c;
          background: white;
          border:
            1px solid #cbc7e9;
          border-radius: 14px;
          font: inherit;
          font-weight: 800;
          cursor: pointer;
        }

        .automata-answers button.correct {
          color: #087a49;
          background: #e7f8f0;
          border-color: #62c89c;
        }

        .automata-answers button.wrong {
          color: #b13b42;
          background: #fff0f1;
          border-color: #ee9fa4;
        }

        .automata-feedback {
          margin: 18px 0 0;
          padding: 15px 18px;
          color: #41466d;
          background: white;
          border-radius: 12px;
          line-height: 1.6;
        }

        @media (max-width: 950px) {
          .automata-intro,
          .automata-lab-grid {
            grid-template-columns: 1fr;
          }

          .automata-heading {
            align-items: start;
            flex-direction: column;
          }
        }

        @media (max-width: 650px) {
          .automata-content {
            width: calc(100% - 28px);
            padding-top: 48px;
          }

          .automata-hero {
            padding-top: 55px;
          }

          .automata-states {
            grid-template-columns: 1fr;
          }

          .automata-controls {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .automata-answers {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section className="automata-hero">
        <span className="automata-eyebrow">
          <span>04</span>
          Automaten und formale Sprachen
        </span>

        <h1>
          Zustände wechseln
          <br />
          und Wörter erkennen
        </h1>

        <p>
          Ein endlicher Automat liest ein Wort Zeichen
          für Zeichen. Abhängig vom gelesenen Zeichen
          wechselt er seinen Zustand. Am Ende entscheidet
          der erreichte Zustand, ob das Wort akzeptiert
          wird.
        </p>

        <div
          className="automata-goals"
          aria-label="Lernziele"
        >
          <span>✓ Zustände unterscheiden</span>
          <span>✓ Übergänge nachvollziehen</span>
          <span>✓ Wörter überprüfen</span>
        </div>
      </section>

      <div className="automata-content">
        <section className="automata-intro">
          <article className="automata-info">
            <span className="automata-label">
              Grundwissen
            </span>

            <h2>
              Was ist ein endlicher Automat?
            </h2>

            <p>
              Ein endlicher Automat besitzt eine feste
              Anzahl von <strong>Zuständen</strong>. Er
              beginnt im Startzustand und liest ein
              Eingabewort von links nach rechts. Für jedes
              Zeichen gibt die Übergangsfunktion den
              nächsten Zustand an.
            </p>
          </article>

          <article className="automata-rule">
            <strong>Die Sprache des Automaten</strong>

            <p>
              Unser Automat akzeptiert genau die
              Binärwörter, die auf <strong>01</strong>{" "}
              enden.
            </p>

            <ul>
              <li>Alphabet: 0 und 1</li>
              <li>Startzustand: q0</li>
              <li>Akzeptierender Zustand: q2</li>
              <li>Beispiele: 01, 101, 1101</li>
            </ul>
          </article>
        </section>

        <section>
          <div className="automata-heading">
            <div>
              <span className="automata-label">
                Interaktive Übung
              </span>

              <h2>Teste ein Binärwort</h2>

              <p>
                Gib ein Wort aus Nullen und Einsen ein.
                Beobachte anschließend jeden einzelnen
                Zustandswechsel.
              </p>
            </div>

            <label className="automata-word-input">
              Eingabewort
              <input
                value={word}
                placeholder="z. B. 1101"
                inputMode="numeric"
                onChange={(event) =>
                  changeWord(event.target.value)
                }
              />
            </label>
          </div>

          <div className="automata-lab-grid">
            <article className="automata-machine">
              <div className="automata-card-header">
                <strong>
                  <span className="automata-status-dot" />
                  Zeichen {position} von{" "}
                  {word.length}
                </strong>

                <span>
                  Aktueller Zustand: {currentState}
                </span>
              </div>

              <div
                className="automata-word"
                aria-label={`Eingabewort ${word}`}
              >
                {word.length > 0 ? (
                  word.split("").map(
                    (character, index) => {
                      let characterClass =
                        "automata-character";

                      if (index < position) {
                        characterClass +=
                          " processed";
                      } else if (
                        index === position
                      ) {
                        characterClass +=
                          " current";
                      }

                      return (
                        <span
                          key={`${character}-${index}`}
                          className={characterClass}
                        >
                          {character}
                        </span>
                      );
                    },
                  )
                ) : (
                  <span className="automata-empty-word">
                    Gib oben ein Wort aus 0 und 1 ein.
                  </span>
                )}
              </div>

              <div className="automata-states">
                {STATES.map((state) => {
                  const stateClasses = [
                    "automata-state",
                    currentState === state.id
                      ? "active"
                      : "",
                    state.accepting
                      ? "accepting"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <article
                      className={stateClasses}
                      key={state.id}
                    >
                      <span className="automata-state-id">
                        {state.id}
                      </span>

                      <h3>{state.title}</h3>

                      <p>{state.description}</p>

                      {state.accepting && (
                        <span className="automata-accept-label">
                          akzeptierend
                        </span>
                      )}
                    </article>
                  );
                })}
              </div>

              <div
                className="automata-message"
                aria-live="polite"
              >
                <span>i</span>

                <div>
                  {currentSymbol !== null &&
                  nextState !== null
                    ? `Im Zustand ${currentState} wird das Zeichen ${currentSymbol} gelesen. Der Automat wechselt danach zu ${nextState}.`
                    : isFinished
                      ? `Das gesamte Wort wurde gelesen. Der Automat befindet sich im Zustand ${currentState}.`
                      : "Gib ein Wort ein, um die Überprüfung zu starten."}
                </div>
              </div>

              <div
                className="automata-progress"
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

              <div className="automata-controls">
                <button
                  onClick={restart}
                  disabled={position === 0}
                >
                  ↺ Start
                </button>

                <button
                  onClick={() => {
                    setIsPlaying(false);

                    setPosition((current) =>
                      Math.max(0, current - 1),
                    );
                  }}
                  disabled={position === 0}
                >
                  ← Zurück
                </button>

                <button
                  className="automata-play"
                  onClick={togglePlayback}
                  disabled={word.length === 0}
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

                    setPosition((current) =>
                      Math.min(
                        word.length,
                        current + 1,
                      ),
                    );
                  }}
                  disabled={
                    word.length === 0 ||
                    isFinished
                  }
                >
                  Weiter →
                </button>
              </div>
            </article>

            <aside className="automata-sidebar">
              <section className="automata-transition-card">
                <h3>Nächster Übergang</h3>

                <div className="automata-transition-content">
                  {currentSymbol !== null &&
                  nextState !== null ? (
                    <>
                      <div className="automata-transition-formula">
                        <strong>
                          {currentState}
                        </strong>

                        <span>+</span>

                        <strong>
                          {currentSymbol}
                        </strong>

                        <span>→</span>

                        <strong>
                          {nextState}
                        </strong>
                      </div>

                      <p>
                        Der Automat liest eine{" "}
                        {currentSymbol} und wechselt
                        dadurch von {currentState} nach{" "}
                        {nextState}.
                      </p>
                    </>
                  ) : (
                    <p>
                      Es ist aktuell kein weiteres
                      Zeichen zu lesen.
                    </p>
                  )}
                </div>
              </section>

              <section className="automata-table-card">
                <h3>Übergangstabelle</h3>

                <table className="automata-transition-table">
                  <thead>
                    <tr>
                      <th>Zustand</th>
                      <th>bei 0</th>
                      <th>bei 1</th>
                    </tr>
                  </thead>

                  <tbody>
                    {STATES.map((state) => (
                      <tr
                        key={state.id}
                        className={
                          state.id === currentState
                            ? "active"
                            : ""
                        }
                      >
                        <td>
                          {state.id}
                          {state.accepting
                            ? " ✓"
                            : ""}
                        </td>

                        <td>
                          {
                            TRANSITIONS[state.id][
                              "0"
                            ]
                          }
                        </td>

                        <td>
                          {
                            TRANSITIONS[state.id][
                              "1"
                            ]
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <section
                className={[
                  "automata-result",
                  isFinished
                    ? isAccepted
                      ? "accepted"
                      : "rejected"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <small>
                  {isFinished
                    ? "Ergebnis"
                    : "Überprüfung läuft"}
                </small>

                <strong>
                  {isFinished
                    ? isAccepted
                      ? "Wort akzeptiert ✓"
                      : "Wort abgelehnt ×"
                    : stateInformation.title}
                </strong>

                <p>
                  {isFinished
                    ? isAccepted
                      ? `Das Wort ${word} endet auf 01 und befindet sich deshalb im akzeptierenden Zustand q2.`
                      : `Das Wort ${word} endet nicht auf 01. Der erreichte Zustand ${currentState} ist nicht akzeptierend.`
                    : stateInformation.description}
                </p>
              </section>
            </aside>
          </div>
        </section>

        <section className="automata-examples">
          <div className="automata-heading">
            <div>
              <span className="automata-label">
                Beispiele
              </span>

              <h2>Probiere weitere Wörter aus</h2>

              <p>
                Einige Wörter werden akzeptiert, andere
                abgelehnt. Überlege zuerst selbst und
                überprüfe anschließend deine Vermutung.
              </p>
            </div>
          </div>

          <div className="automata-example-list">
            {EXAMPLE_WORDS.map((example) => (
              <button
                key={example}
                onClick={() =>
                  selectExample(example)
                }
              >
                {example}
              </button>
            ))}
          </div>
        </section>

        <section className="automata-quiz">
          <span className="automata-label">
            Lerncheck
          </span>

          <h2>
            Welches Wort akzeptiert der Automat?
          </h2>

          <p>
            Denke daran: Der Automat akzeptiert genau
            die Wörter, die auf 01 enden.
          </p>

          <div className="automata-answers">
            {["1010", "1101", "1111"].map(
              (answer, index) => {
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
              },
            )}
          </div>

          {quizAnswer !== null && (
            <p
              className="automata-feedback"
              aria-live="polite"
            >
              {quizAnswer === 1
                ? "Richtig! 1101 endet auf 01. Der Automat erreicht deshalb den akzeptierenden Zustand q2."
                : "Noch nicht ganz. Untersuche besonders die letzten beiden Zeichen des Wortes."}
            </p>
          )}
        </section>
      </div>
    </div>
  );
}