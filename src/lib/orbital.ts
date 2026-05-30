export type SectionId = "skills" | "education" | "about" | "contact";

export const SECTION_LABELS: Record<SectionId, string> = {
  skills: "Skills",
  education: "Education",
  about: "About Me",
  contact: "Contact Info",
};

export const NAV_ITEMS: { id: SectionId; angleDeg: number }[] = [
  { id: "skills", angleDeg: -90 },
  { id: "education", angleDeg: 0 },
  { id: "about", angleDeg: 90 },
  { id: "contact", angleDeg: 180 },
];

/** Polar to SVG coords; y grows downward; angle 0 = right, -90 = top */
export function polarToSvg(
  cx: number,
  cy: number,
  r: number,
  angleDeg: number,
): { x: number; y: number } {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

/** Arc path on circle from startDeg to endDeg (degrees, same system as polarToSvg) */
export function describeArc(
  cx: number,
  cy: number,
  r: number,
  startDeg: number,
  endDeg: number,
): string {
  const start = polarToSvg(cx, cy, r, startDeg);
  const end = polarToSvg(cx, cy, r, endDeg);
  const diff = endDeg - startDeg;
  const large = Math.abs(diff) > 180 ? 1 : 0;
  const sweep = diff > 0 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} ${sweep} ${end.x} ${end.y}`;
}
