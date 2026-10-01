/** Pure, deterministic decision model. No timers, DOM, randomness or stored progress. */
export type SortAlgorithm = "bubble" | "insertion" | "selection";
export type SortItem = { id: string; value: number };
export type SortChoice = "swap" | "keep" | "move-left" | "insert-here" | "choose-left" | "choose-right" | "place-min";
export type SortStep = {
  items: SortItem[];
  algorithm: SortAlgorithm;
  phase: "compare" | "place" | "done";
  left: number;
  right: number;
  sorted: number[];
  active: number[];
  comparisons: number;
  /** Actually executed swaps, not individual assignments or key insertions. */
  moves: number;
  /** 1-based pass; 0 for lists with fewer than two items. */
  round: number;
  message: string;
};

const algorithms: readonly SortAlgorithm[] = ["bubble", "insertion", "selection"];
const choices: readonly SortChoice[] = ["swap", "keep", "move-left", "insert-here", "choose-left", "choose-right", "place-min"];
const choiceLabels: Record<SortChoice, string> = {
  swap: "die Nachbarn tauschen",
  keep: "die Nachbarn so lassen",
  "move-left": "das aktive Element einen Platz nach links tauschen",
  "insert-here": "das aktive Element hier stehen lassen",
  "choose-left": "den bisherigen Minimum-Kandidaten behalten",
  "choose-right": "den neu geprüften Wert als Minimum-Kandidaten wählen",
  "place-min": "das gefundene Minimum an den Rundenanfang setzen",
};
const indices = (start: number, end: number) => Array.from({ length: Math.max(0, end - start) }, (_, index) => start + index);
const label = (value: number) => String(value).replace(".", ",");

function validAlgorithm(algorithm: SortAlgorithm): void {
  if (!algorithms.includes(algorithm)) throw new RangeError("Unbekanntes Sortierverfahren.");
}

function sameIndices(actual: number[], expected: number[]): boolean {
  return actual.length === expected.length && actual.every((value, index) => value === expected[index]);
}

/** Reject malformed externally constructed states rather than silently corrupting a run. */
function validateState(state: SortStep): void {
  if (!state || typeof state !== "object") throw new TypeError("Ein gültiger Sortierstand wird benötigt.");
  validAlgorithm(state.algorithm);
  if (!Array.isArray(state.items)) throw new TypeError("Die Elemente müssen als Liste vorliegen.");
  const ids = new Set<string>();
  for (const item of state.items) {
    if (!item || typeof item.id !== "string" || !item.id || ids.has(item.id) || typeof item.value !== "number" || !Number.isFinite(item.value)) {
      throw new RangeError("Jedes Element braucht eine eindeutige Kennung und einen endlichen Zahlenwert.");
    }
    ids.add(item.id);
  }
  if (![state.comparisons, state.moves, state.round].every(value => Number.isSafeInteger(value) && value >= 0)) {
    throw new RangeError("Runde und Zähler müssen nichtnegative ganze Zahlen sein.");
  }
  if (!Array.isArray(state.sorted) || !Array.isArray(state.active) || typeof state.message !== "string") {
    throw new TypeError("Markierungen und Erklärung des Sortierstands fehlen.");
  }
  const n = state.items.length;
  if (state.phase === "done") {
    if (state.left !== -1 || state.right !== -1 || !sameIndices(state.active, []) || !sameIndices(state.sorted, indices(0, n))
      || state.round !== Math.max(0, n - 1) || state.items.some((item, index) => index > 0 && state.items[index - 1].value > item.value)) {
      throw new RangeError("Der fertige Sortierstand ist widersprüchlich.");
    }
    return;
  }
  if (n < 2 || state.round < 1 || state.round >= n
    || !Number.isInteger(state.left) || !Number.isInteger(state.right)
    || state.left < 0 || state.left >= n || state.right < 0 || state.right >= n) {
    throw new RangeError("Die markierten Positionen passen nicht zur Sortierrunde.");
  }
  let expectedSorted: number[];
  if (state.phase === "place") {
    if (state.algorithm !== "selection" || state.right !== state.round - 1 || state.left < state.right) {
      throw new RangeError("Nur Selection Sort besitzt diesen Platzierungsschritt.");
    }
    expectedSorted = indices(0, state.round - 1);
  } else if (state.phase === "compare") {
    if (state.algorithm === "bubble") {
      if (state.right !== state.left + 1 || state.right > n - state.round) throw new RangeError("Bubble Sort vergleicht die nächsten Nachbarn der Runde.");
      expectedSorted = indices(n - state.round + 1, n);
    } else if (state.algorithm === "insertion") {
      if (state.right !== state.left + 1 || state.right > state.round) throw new RangeError("Insertion Sort vergleicht das aktive Element mit seinem linken Nachbarn.");
      expectedSorted = indices(0, state.right);
    } else {
      if (state.left < state.round - 1 || state.right <= state.left) throw new RangeError("Selection Sort vergleicht den bisherigen Kandidaten mit der nächsten Suchposition.");
      expectedSorted = indices(0, state.round - 1);
    }
  } else {
    throw new RangeError("Unbekannte Sortierphase.");
  }
  if (!sameIndices(state.sorted, expectedSorted) || !sameIndices(state.active, [...new Set([state.left, state.right])])) {
    throw new RangeError("Die Markierungen passen nicht zur Sortierphase.");
  }
}

function step(
  items: SortItem[], algorithm: SortAlgorithm, phase: SortStep["phase"], left: number, right: number,
  round: number, comparisons: number, moves: number,
): SortStep {
  const n = items.length;
  let sorted: number[];
  let message: string;
  if (phase === "done") {
    sorted = indices(0, n);
    message = n === 0 ? "Die leere Liste ist bereits sortiert. Es gibt nichts zu vergleichen."
      : n === 1 ? "Ein einzelnes Element ist bereits sortiert. Es braucht keinen Vergleich."
      : "Fertig: Die Werte stehen aufsteigend. Gleiche Werte dürfen nebeneinander stehen.";
  } else if (algorithm === "bubble") {
    sorted = indices(n - round + 1, n);
    message = `Runde ${round}: Vergleiche die Nachbarn ${label(items[left].value)} und ${label(items[right].value)}. Steht der größere Wert links?`;
  } else if (algorithm === "insertion") {
    // The held item is at right. Only positions strictly before it are currently
    // a contiguous sorted prefix. This is not a permanently finalized range.
    sorted = indices(0, right);
    message = `Nachbartauschvariante, Runde ${round}: Das aktive Element ${label(items[right].value)} prüft seinen linken Nachbarn ${label(items[left].value)}. Muss es noch weiter nach links?`;
  } else {
    sorted = indices(0, round - 1);
    message = phase === "place"
      ? `Die Suche dieser Runde ist fertig. Setze das Minimum ${label(items[left].value)} auf Platz ${right + 1}. Ist es schon dort, bleibt es stehen.`
      : `Runde ${round}: Bisheriger Minimum-Kandidat ${label(items[left].value)}, nächster Suchwert ${label(items[right].value)}. Welcher Kandidat bleibt? Bei Gleichstand der bisherige.`;
  }
  return {
    items, algorithm, phase, left, right, sorted,
    active: phase === "done" ? [] : [...new Set([left, right])],
    comparisons, moves, round, message,
  };
}

/** Empty/single lists start done. Finite negative values and decimals are valid. */
export function createSortState(values: number[], algorithm: SortAlgorithm): SortStep {
  validAlgorithm(algorithm);
  if (!Array.isArray(values)) throw new TypeError("Bitte eine Liste von Zahlen übergeben.");
  for (const value of values) {
    if (typeof value !== "number" || !Number.isFinite(value)) throw new RangeError("Die Liste darf nur endliche Zahlen enthalten.");
  }
  const items = values.map((value, index) => ({ id: `item-${index}`, value }));
  return values.length < 2
    ? step(items, algorithm, "done", -1, -1, 0, 0, 0)
    : step(items, algorithm, "compare", 0, 1, 1, 0, 0);
}

/** There is no next decision in done; callers should test phase first. */
export function expectedSortChoice(state: SortStep): SortChoice {
  validateState(state);
  if (state.phase === "done") throw new RangeError("Die Liste ist fertig sortiert; es gibt keine nächste Entscheidung.");
  if (state.phase === "place") return "place-min";
  const left = state.items[state.left].value, right = state.items[state.right].value;
  if (state.algorithm === "bubble") return left > right ? "swap" : "keep";
  if (state.algorithm === "insertion") return right < left ? "move-left" : "insert-here";
  return left <= right ? "choose-left" : "choose-right";
}

function compareReason(state: SortStep): string {
  const left = state.items[state.left].value, right = state.items[state.right].value;
  if (state.algorithm === "bubble") {
    return left > right
      ? `${label(left)} ist größer als ${label(right)}. Für aufsteigende Reihenfolge müssen diese Nachbarn tauschen.`
      : left === right
        ? `Beide Werte sind ${label(left)}. Sie bleiben in ihrer bisherigen Reihenfolge; ein Tausch ist nicht nötig.`
        : `${label(left)} ist kleiner als ${label(right)}. Diese Nachbarn stehen bereits richtig herum.`;
  }
  if (state.algorithm === "insertion") {
    return right < left
      ? `Das aktive Element ${label(right)} ist kleiner als sein linker Nachbar ${label(left)}. Es tauscht deshalb einen Platz nach links.`
      : right === left
        ? `Beide Werte sind ${label(right)}. Das aktive Element bleibt rechts vom gleichen Wert. So bleibt ihre bisherige Reihenfolge erhalten.`
        : `Der linke Nachbar ${label(left)} ist kleiner als das aktive Element ${label(right)}. Weil der Präfix links davon sortiert ist, kann das aktive Element hier bleiben.`;
  }
  return left <= right
    ? left === right
      ? `Beide Kandidaten haben den Wert ${label(left)}. Bei Gleichstand behalten wir den bisher gefundenen Kandidaten.`
      : `Der bisherige Kandidat ${label(left)} ist kleiner als ${label(right)}. Er bleibt das kleinste bisher geprüfte Element dieser Runde.`
    : `${label(right)} ist kleiner als der bisherige Kandidat ${label(left)}. Merke dir die neue Position; getauscht wird erst nach der vollständigen Suche.`;
}

/** Wrong choices keep the exact same state object and do not alter any counter. */
export function applySortChoice(state: SortStep, choice: SortChoice): { correct: boolean; state: SortStep; explanation: string } {
  validateState(state);
  if (state.phase === "done") {
    return { correct: false, state, explanation: "Die Liste ist bereits fertig sortiert. Starte eine neue Runde, wenn du weiterüben möchtest." };
  }
  const expected = expectedSortChoice(state);
  if (!choices.includes(choice) || choice !== expected) {
    const reason = state.phase === "place"
      ? `Alle Werte im Suchbereich wurden geprüft. Das gefundene Minimum ${label(state.items[state.left].value)} gehört jetzt auf Platz ${state.right + 1}; es folgt kein weiterer Vergleich.`
      : compareReason(state);
    return { correct: false, state, explanation: `Noch nicht: ${reason} Wähle: ${choiceLabels[expected]}. Der Sortierstand und die Zähler bleiben unverändert.` };
  }
  const items = state.items.map(item => ({ ...item }));
  const n = items.length;
  let comparisons = state.comparisons, moves = state.moves;
  const finish = () => step(items, state.algorithm, "done", -1, -1, n - 1, comparisons, moves);
  const swap = (a: number, b: number) => { [items[a], items[b]] = [items[b], items[a]]; moves += 1; };
  if (state.algorithm === "selection" && state.phase === "place") {
    const minimum = label(items[state.left].value), formerFront = label(items[state.right].value);
    const noSwap = state.left === state.right;
    if (!noSwap) swap(state.left, state.right);
    const next = state.round === n - 1 ? finish()
      : step(items, "selection", "compare", state.round, state.round + 1, state.round + 1, comparisons, moves);
    return {
      correct: true, state: next,
      explanation: noSwap
        ? `Das Minimum ${minimum} steht bereits auf Platz ${state.right + 1}. Die Platzierung ist bestätigt, aber es zählt kein Tausch. Dieser Platz ist jetzt endgültig festgelegt.`
        : `Das Minimum ${minimum} tauscht mit ${formerFront} auf Platz ${state.right + 1}. Das zählt als eine Tauschaktion. Dieser Platz ist jetzt endgültig festgelegt.`,
    };
  }
  comparisons += 1;
  const explanation = compareReason(state);
  if (state.algorithm === "bubble") {
    if (choice === "swap") swap(state.left, state.right);
    if (state.right < n - state.round) {
      return { correct: true, state: step(items, "bubble", "compare", state.left + 1, state.right + 1, state.round, comparisons, moves), explanation };
    }
    const next = state.round === n - 1 ? finish()
      : step(items, "bubble", "compare", 0, 1, state.round + 1, comparisons, moves);
    return { correct: true, state: next, explanation: `${explanation} Die Runde ist fertig: Platz ${n - state.round + 1} ist endgültig festgelegt.` };
  }
  if (state.algorithm === "insertion") {
    if (choice === "move-left") {
      swap(state.left, state.right);
      if (state.left > 0) {
        return { correct: true, state: step(items, "insertion", "compare", state.left - 1, state.left, state.round, comparisons, moves), explanation };
      }
    }
    const next = state.round === n - 1 ? finish()
      : step(items, "insertion", "compare", state.round, state.round + 1, state.round + 1, comparisons, moves);
    return {
      correct: true, state: next,
      explanation: `${explanation} ${choice === "move-left" ? "Ganz links gibt es keinen weiteren Nachbarn." : "Die Einfügerunde ist damit beendet."} Die ersten ${state.round + 1} Elemente sind jetzt untereinander sortiert, aber noch nicht unbedingt an ihren endgültigen Plätzen.`,
    };
  }
  const minimumIndex = choice === "choose-right" ? state.right : state.left;
  const next = state.right === n - 1
    ? step(items, "selection", "place", minimumIndex, state.round - 1, state.round, comparisons, moves)
    : step(items, "selection", "compare", minimumIndex, state.right + 1, state.round, comparisons, moves);
  return { correct: true, state: next, explanation };
}
