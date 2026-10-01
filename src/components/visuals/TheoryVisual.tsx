import { LoopTraceLab, ObjectBlueprintLab } from "./ProgrammingLabs";
import { NetworkJourneyLab, LogicGateLab } from "./NetworkLogicLabs";
import { CipherWheelLab, TlsJourneyLab, DataTraceLab } from "./SecurityLabs";

// Additive teaching models; ModuleTheory is already inside the chapter gate.
// Nothing here changes original exercises, their hints or their solution gates.
const theoryVisuals = {
  programmierung: { index:0, component:LoopTraceLab },
  oop: { index:0, component:ObjectBlueprintLab },
  netzwerke: { index:1, component:NetworkJourneyLab },
  schaltnetze: { index:1, component:LogicGateLab },
  "klassische-kryptografie": { index:0, component:CipherWheelLab },
  "moderne-kryptografie": { index:1, component:TlsJourneyLab },
  datenschutz: { index:1, component:DataTraceLab },
} as const;

export default function TheoryVisual({slug, sectionIndex}: {slug:string; sectionIndex:number}) {
  if (!(slug in theoryVisuals)) return null;
  const entry = theoryVisuals[slug as keyof typeof theoryVisuals];
  if (sectionIndex !== entry.index) return null;
  const Component = entry.component;
  return <div className="lessonVisual" id={`schaubild-${slug}`} style={{scrollMarginTop:24}}><Component /></div>;
}
