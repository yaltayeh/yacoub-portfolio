// The decorative night sky behind page heroes: nebula light, a few stars,
// particle pairs that trade opacity (a qubit in two states), and slow waves.
// Pure CSS animation; everything stops under prefers-reduced-motion.

type Point = [inlineStart: string, top: string, size: number];

const stars: Point[] = [
  ["22%", "64px", 2],
  ["58%", "140px", 1.5],
  ["95%", "230px", 2],
  ["35%", "330px", 1.5],
  ["8%", "190px", 1.5],
  ["62%", "470px", 2],
  ["70%", "40px", 2],
  ["48%", "560px", 1.5],
];

const pairs: Point[] = [
  ["78%", "30px", 4],
  ["88%", "150px", 3],
  ["64%", "96px", 2],
  ["92%", "300px", 3],
  ["72%", "400px", 2],
  ["46%", "22px", 2],
];

export function SkyBackground({ waves = false, compact = false }: { waves?: boolean; compact?: boolean }) {
  return (
    <div aria-hidden="true" className={`sky${compact ? " sky--compact" : ""}`}>
      <div className="sky__nebula sky__nebula--core" />
      {compact ? null : <div className="sky__nebula sky__nebula--dust" />}
      {stars.slice(0, compact ? 3 : stars.length).map(([x, y, s], i) => (
        <span key={`s${i}`} className="sky__star" style={{ insetInlineStart: x, top: y, width: s, height: s }} />
      ))}
      {pairs.slice(0, compact ? 2 : pairs.length).map(([x, y, s], i) => (
        <span key={`p${i}`}>
          <span className="sky__dot sky__dot--a" style={{ insetInlineStart: x, top: y, width: s, height: s }} />
          <span
            className="sky__dot sky__dot--b"
            style={{ insetInlineStart: `calc(${x} + 3%)`, top: `calc(${y} + 8px)`, width: s, height: s }}
          />
        </span>
      ))}
      {waves ? (
        <div className="sky__waves">
          <svg className="sky__wave sky__wave--1" width="3200" height="120" viewBox="0 0 3200 120" fill="none">
            <path
              d="M0 70 Q160 30 320 70 T640 70 T960 70 T1280 70 T1600 70 T1920 70 T2240 70 T2560 70 T2880 70 T3200 70"
              stroke="var(--accent)"
              strokeOpacity="0.16"
            />
          </svg>
          <svg className="sky__wave sky__wave--2" width="3200" height="120" viewBox="0 0 3200 120" fill="none">
            <path
              d="M0 76 Q120 50 240 76 T480 76 T720 76 T960 76 T1200 76 T1440 76 T1680 76 T1920 76 T2160 76 T2400 76 T2640 76 T2880 76 T3120 76 T3360 76"
              stroke="var(--ink)"
              strokeOpacity="0.07"
            />
          </svg>
        </div>
      ) : null}
    </div>
  );
}
