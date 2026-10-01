import { useId } from 'react';
import { useReducedMotion } from 'motion/react';

const SUPER = { x: 300, y: 72 };
const INSTITUTES = [
  { x: 160, y: 205, label: 'INSTITUTE A' },
  { x: 440, y: 205, label: 'INSTITUTE B' },
];
const STUDENT_Y = 335;
const STUDENTS = [
  [85, 160, 235],
  [365, 440, 515],
];

const curve = (a, b) => {
  const midY = (a.y + b.y) / 2;
  return `M${a.x},${a.y} C${a.x},${midY} ${b.x},${midY} ${b.x},${b.y}`;
};

/** The LMS access model: Super Admin → institutes → students, plus direct assignment. */
export default function RbacVisual() {
  const reduced = useReducedMotion();
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');

  const edges = [];
  INSTITUTES.forEach((inst, i) => {
    edges.push({ d: curve({ x: SUPER.x, y: SUPER.y + 24 }, { x: inst.x, y: inst.y - 22 }) });
    STUDENTS[i].forEach((sx) => edges.push({ d: curve({ x: inst.x, y: inst.y + 22 }, { x: sx, y: STUDENT_Y - 18 }) }));
  });
  const direct = `M${SUPER.x + 85},${SUPER.y} C560,${SUPER.y} 560,200 515,${STUDENT_Y - 18}`;

  return (
    <div className="dot-grid flex h-full w-full items-center justify-center px-[6%] py-6">
      <svg
        viewBox="0 0 600 420"
        className="h-full max-h-full w-full"
        role="img"
        aria-label="Access model: the Super Admin assigns tests to institutes or directly to students; each institute admin assigns tests to its own students."
      >
        <text x="576" y="34" textAnchor="end" className="fill-muted font-mono" fontSize="11" letterSpacing="2">
          ROLE MAP · TEST ASSIGNMENT
        </text>

        {edges.map((edge, i) => (
          <g key={i}>
            <path id={`${uid}-e${i}`} d={edge.d} fill="none" className="stroke-line" strokeWidth="1.5" />
            <path d={edge.d} fill="none" className="dash-flow stroke-accent" strokeWidth="1.5" strokeOpacity="0.55" />
          </g>
        ))}
        <path id={`${uid}-direct`} d={direct} fill="none" className="dash-flow stroke-accent" strokeWidth="1.5" />
        <text x="472" y="128" className="fill-accent-ink font-mono" fontSize="10" letterSpacing="1.5">
          DIRECT ASSIGN
        </text>

        {!reduced &&
          [0, 2, 4, 5, 7].map((edgeIndex, i) => (
            <circle key={edgeIndex} r="4" className="fill-accent">
              <animateMotion dur="2.8s" repeatCount="indefinite" begin={`${i * 0.55}s`}>
                <mpath href={`#${uid}-e${edgeIndex}`} />
              </animateMotion>
            </circle>
          ))}
        {!reduced && (
          <circle r="4" className="fill-accent">
            <animateMotion dur="3.4s" repeatCount="indefinite" begin="1s">
              <mpath href={`#${uid}-direct`} />
            </animateMotion>
          </circle>
        )}

        <g>
          <rect x={SUPER.x - 85} y={SUPER.y - 24} width="170" height="48" rx="24" className="fill-accent" />
          <text x={SUPER.x} y={SUPER.y + 4} textAnchor="middle" className="fill-on-accent font-mono" fontSize="12" fontWeight="500" letterSpacing="2">
            SUPER ADMIN
          </text>
        </g>

        {INSTITUTES.map((inst) => (
          <g key={inst.label}>
            <rect x={inst.x - 78} y={inst.y - 22} width="156" height="44" rx="22" className="fill-surface stroke-fg" strokeOpacity="0.35" />
            <text x={inst.x} y={inst.y + 4} textAnchor="middle" className="fill-fg font-mono" fontSize="11" letterSpacing="2">
              {inst.label}
            </text>
          </g>
        ))}

        {STUDENTS.flat().map((sx) => (
          <g key={sx}>
            <circle cx={sx} cy={STUDENT_Y} r="18" className="fill-surface-2 stroke-fg" strokeOpacity="0.3" />
            <circle cx={sx} cy={STUDENT_Y - 5} r="4.5" className="fill-muted" />
            <path d={`M${sx - 8},${STUDENT_Y + 10} a8,7 0 0 1 16,0`} className="fill-muted" />
          </g>
        ))}
        <text x="300" y="388" textAnchor="middle" className="fill-muted font-mono" fontSize="10" letterSpacing="2">
          STUDENTS · MOCK & PRACTICE TESTS
        </text>
      </svg>
    </div>
  );
}
