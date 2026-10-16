type Point = [number, number];

// Pfeilspitzen in der Mitte jeder Etappe. Ohne sie sieht man zwar die Linie,
// aber nicht, in welcher Richtung die Reise verlief – bei Rundreisen ist die
// Reihenfolge sonst nur mühsam aus den Nummern zu erschließen.
//
// `bow` verschiebt die Spitze quer zur Etappe. Das braucht es dort, wo Hin- und
// Rückweg dieselbe Strecke nehmen und die Linie deshalb als Bogen gezeichnet
// wird: Die Spitze muss dann auf dem Bogen sitzen, nicht auf der Sehne.
export function RouteArrows({
  points,
  size = 7,
  bow = [],
}: {
  points: Point[];
  size?: number;
  bow?: number[];
}) {
  return (
    <>
      {points.slice(0, -1).map(([x1, y1], i) => {
        const [x2, y2] = points[i + 1];
        const length = Math.hypot(x2 - x1, y2 - y1);
        // Auf sehr kurzen Etappen hätte die Spitze keinen Platz und würde die
        // beiden Marker nur verdecken.
        if (length < size * 4.5) return null;

        const offset = bow[i] ?? 0;
        // Quer zur Etappe verschieben (halber Bogen = Scheitel der Kurve)
        const nx = (-(y2 - y1) / length) * offset * 0.5;
        const ny = ((x2 - x1) / length) * offset * 0.5;
        const angle = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI;

        return (
          <polygon
            key={i}
            points={`${size},0 ${-size * 0.5},${size * 0.66} ${-size * 0.5},${-size * 0.66}`}
            transform={`translate(${((x1 + x2) / 2 + nx).toFixed(1)} ${((y1 + y2) / 2 + ny).toFixed(1)}) rotate(${angle.toFixed(1)})`}
            className="fill-accent-hover stroke-bg"
            strokeWidth={1.2}
            strokeLinejoin="round"
          />
        );
      })}
    </>
  );
}

// Pfadsegment als flacher Bogen. Wo Hin- und Rückweg dieselbe Strecke nehmen,
// lägen sonst zwei Linien exakt übereinander und die Route sähe aus wie eine
// Sackgasse. `d` ist der Ausschlag quer zur Strecke – dasselbe Vorzeichen wie
// bei `bow` in RouteArrows, damit Pfeil und Bogen zusammenpassen.
export function bowSegment(
  [x1, y1]: Point,
  [x2, y2]: Point,
  d: number,
): string {
  const length = Math.hypot(x2 - x1, y2 - y1) || 1;
  const cx = (x1 + x2) / 2 + (-(y2 - y1) / length) * d;
  const cy = (y1 + y2) / 2 + ((x2 - x1) / length) * d;
  return `Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`;
}
