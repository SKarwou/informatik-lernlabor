import { BitLampLab, DecimalConversionLab, PlaceValueLab } from "./BitAndPlaceLabs";
import { BinaryAdditionLab, SignedBitsLab } from "./ArithmeticLabs";
import { DecimalPlaceLab, HexColorLab } from "./EverydayNumberLabs";
import { ParityLab, RunLengthLab } from "./CompressionLabs";
import { ColorSpaceLab } from "./ColorSpaceLab";
import { RelationalLinkLab, SqlStepLab } from "./DatabaseLabs";
import { SqlIslandWorkshop } from "./SqlIslandWorkshop";

// Only rendered by BeginnerCourseView after the existing ChapterGate has opened.
// These are new teaching examples, not answers taken from the protected task bank.
const visuals = {
  zahlensysteme: {
    bit: { component: BitLampLab, label: "Bits als Lampen" },
    dezimal: { component: DecimalPlaceLab, label: "Dezimale Stellenwerte" },
    "binaer-lesen": { component: PlaceValueLab, label: "Binäre Stellenwerte" },
    "binaer-schreiben": { component: DecimalConversionLab, label: "Dezimal in Binär umwandeln" },
    hexadezimal: { component: HexColorLab, label: "Hexadezimal und Bildschirmfarben" },
    addition: { component: BinaryAdditionLab, label: "Schriftliche Binäraddition" },
    bitbreite: { component: ColorSpaceLab, label: "RGB-Farben im drehbaren 3D-Würfel" },
    "zweierkomplement-lesen": { component: SignedBitsLab, label: "Dieselben Bits, zwei Bedeutungen" },
  },
  "fehler-kompression": {
    paritaet: { component: ParityLab, label: "Bitfehler bei einer Übertragung" },
    rle: { component: RunLengthLab, label: "Pixel als Lauflängen speichern" },
  },
  datenbanken: {
    "db-modell": { component: RelationalLinkLab, label: "Schlüssel verbinden Tabellen" },
  },
  sql: {
    "sql-kombinieren": { component: SqlStepLab, label: "SQL-Abfragen sichtbar ausführen" },
    "sql-werkstatt": { component: SqlIslandWorkshop, label: "SQL Island: das Originalspiel" },
  },
} as const;

export function getLessonVisuals(slug: string): { section: string; label: string }[] {
  if (!(slug in visuals)) return [];
  return Object.entries(visuals[slug as keyof typeof visuals]).map(([section, entry]) => ({ section, label: entry.label }));
}

export default function LessonVisual({ slug, section }: { slug: string; section: string }) {
  if (!(slug in visuals)) return null;
  const entries = visuals[slug as keyof typeof visuals];
  const entry = Object.entries(entries).find(([key]) => key === section)?.[1];
  if (!entry) return null;
  const Component = entry.component;
  return <div id={`schaubild-${section}`} className="lessonVisual" style={{ scrollMarginTop: 24 }}><Component /></div>;
}
