import { LADDERS, PLAYER_COLORS, PLAYER_NAMES, SNAKES, cellPosition } from "@/lib/sparsh-data";

type Props = {
  positions: number[];
  playerCount: number;
  activePlayer: number;
  visited: Set<number>;
};

const CELL = 10; // percent

function center(square: number) {
  const { row, col } = cellPosition(square);
  return { x: col * CELL + CELL / 2, y: row * CELL + CELL / 2 };
}

function Ladder({ from, to }: { from: number; to: number }) {
  const a = center(from);
  const b = center(to);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const rungs = Math.max(3, Math.round(len / 6));

  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: `${a.x}%`,
        top: `${a.y}%`,
        width: `${len}%`,
        height: "5.2%",
        transform: `translate(0, -50%) rotate(${angle}deg)`,
        transformOrigin: "0 50%",
      }}
      aria-hidden="true"
    >
      <div className="relative size-full">
        {[0, 1].map((rail) => (
          <div
            key={rail}
            className="absolute left-0 w-full rounded-full relief"
            style={{
              top: rail === 0 ? "6%" : "72%",
              height: "22%",
              backgroundImage:
                "linear-gradient(180deg, color-mix(in oklab, var(--gold) 82%, white), color-mix(in oklab, var(--terracotta) 70%, black 8%))",
            }}
          />
        ))}
        {Array.from({ length: rungs }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-[2px]"
            style={{
              left: `${((i + 0.5) / rungs) * 100}%`,
              top: "16%",
              width: "2.5%",
              height: "66%",
              backgroundImage:
                "linear-gradient(180deg, color-mix(in oklab, var(--gold) 92%, white), color-mix(in oklab, var(--terracotta) 78%, black))",
              boxShadow: "0 2px 3px oklch(0.25 0.06 30 / 45%)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function Snake({ from, to, index }: { from: number; to: number; index: number }) {
  const a = center(from);
  const b = center(to);
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const bow = index % 2 === 0 ? 14 : -14;
  const path = `M ${a.x} ${a.y} Q ${mx + bow} ${my} ${b.x} ${b.y}`;
  const gid = `snake-grad-${from}`;
  return (
    <svg
      className="pointer-events-none absolute inset-0 size-full"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="color-mix(in oklab, var(--maroon) 55%, white 20%)" />
          <stop offset="50%" stopColor="var(--terracotta)" />
          <stop offset="100%" stopColor="var(--maroon)" />
        </linearGradient>
      </defs>
      <path
        d={path}
        fill="none"
        stroke="oklch(0.25 0.05 30 / 35%)"
        strokeWidth="4.4"
        strokeLinecap="round"
      />
      <path
        d={path}
        fill="none"
        stroke={`url(#${gid})`}
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <path
        d={path}
        fill="none"
        stroke="oklch(1 0 0 / 40%)"
        strokeWidth="0.9"
        strokeLinecap="round"
        strokeDasharray="1.6 3.2"
      />
      <circle cx={a.x} cy={a.y} r="2.6" fill="var(--maroon)" />
      <circle cx={a.x - 0.9} cy={a.y - 0.9} r="0.55" fill="var(--gold)" />
      <circle cx={a.x + 0.9} cy={a.y - 0.9} r="0.55" fill="var(--gold)" />
    </svg>
  );
}

export function GameBoard({ positions, playerCount, activePlayer, visited }: Props) {
  const squares = Array.from({ length: 100 }, (_, i) => i + 1);

  return (
    <section
      aria-label="Game board"
      className="rounded-3xl border-4 border-[color-mix(in_oklab,var(--maroon)_70%,black)] p-3 sm:p-5 board-surface relief"
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border-2 border-[color-mix(in_oklab,var(--terracotta)_60%,black_10%)]">
        <div className="grid size-full grid-cols-10 grid-rows-10">
          {squares.map((n) => {
            const { row, col } = cellPosition(n);
            const dark = (row + col) % 2 === 1;
            return (
              <div
                key={n}
                className="relative flex items-start justify-start border border-[oklch(0.55_0.07_45_/_25%)] p-[2px]"
                style={{
                  gridRow: row + 1,
                  gridColumn: col + 1,
                  backgroundColor: dark ? "var(--board-alt)" : "var(--board)",
                }}
              >
                <span className="text-[0.55rem] font-semibold leading-none text-muted-foreground sm:text-[0.7rem]">
                  {n}
                </span>
                {visited.has(n) && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-1 right-1 size-1.5 rounded-full bg-gold"
                  />
                )}
              </div>
            );
          })}
        </div>

        {Object.entries(LADDERS).map(([from, to]) => (
          <Ladder key={`l${from}`} from={Number(from)} to={to} />
        ))}
        {Object.entries(SNAKES).map(([from, to], i) => (
          <Snake key={`s${from}`} from={Number(from)} to={to} index={i} />
        ))}

        {positions.slice(0, playerCount).map((pos, i) => {
          const c = center(Math.max(1, pos));
          const offset = [
            [-2, -2],
            [2, -2],
            [-2, 2],
            [2, 2],
          ][i];
          return (
            <div
              key={i}
              className="pointer-events-none absolute size-[5.5%] rounded-full border-2 border-[oklch(1_0_0_/_65%)] transition-all duration-300 ease-out"
              style={{
                left: `${c.x + offset[0]}%`,
                top: `${c.y + offset[1]}%`,
                transform: "translate(-50%, -50%)",
                backgroundColor: PLAYER_COLORS[i],
                boxShadow:
                  i === activePlayer
                    ? "0 0 0 3px color-mix(in oklab, var(--gold) 75%, transparent), 0 4px 8px oklch(0.2 0.05 30 / 55%)"
                    : "0 3px 6px oklch(0.2 0.05 30 / 45%)",
              }}
              aria-hidden="true"
            />
          );
        })}
      </div>

      {/* Peg-hole token slots with turn indicator lights */}
      <div className="mt-4 flex flex-wrap items-end justify-center gap-4 sm:gap-6">
        {Array.from({ length: 4 }).map((_, i) => {
          const inPlay = i < playerCount;
          const isActive = inPlay && i === activePlayer;
          return (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <span
                className={`size-3 rounded-full border border-[oklch(0.25_0.05_30_/_45%)] ${isActive ? "turn-glow" : ""}`}
                style={{
                  backgroundColor: isActive ? PLAYER_COLORS[i] : "oklch(0.6 0.01 60 / 35%)",
                  boxShadow: isActive
                    ? `0 0 10px 2px ${PLAYER_COLORS[i]}`
                    : "inset 0 1px 2px oklch(0.2 0.05 30 / 45%)",
                }}
                aria-hidden="true"
              />
              <span
                className="flex size-11 items-center justify-center rounded-full"
                style={{
                  backgroundColor: "color-mix(in oklab, var(--board-alt) 90%, black 10%)",
                  boxShadow: "inset 0 3px 6px oklch(0.2 0.05 30 / 55%)",
                }}
              >
                {inPlay && (
                  <span
                    className="size-6 rounded-full border-2 border-[oklch(1_0_0_/_60%)]"
                    style={{ backgroundColor: PLAYER_COLORS[i] }}
                  />
                )}
              </span>
              <span className="text-[0.65rem] font-medium text-muted-foreground">
                {inPlay ? `${PLAYER_NAMES[i]}${isActive ? " — turn" : ""}` : "empty"}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
