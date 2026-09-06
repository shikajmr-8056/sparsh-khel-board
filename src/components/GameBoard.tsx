import { useState, useMemo } from "react";
import {
  LADDERS,
  PLAYER_COLORS,
  PLAYER_NAMES,
  SNAKES,
  SNAKE_COLORS,
  cellPosition,
  getBrailleDotsForNumber,
  momentFor,
} from "@/lib/sparsh-data";

type Props = {
  positions: number[];
  playerCount: number;
  activePlayer: number;
  visited: Set<number>;
  onSelectSquare?: (square: number) => void;
  wonPlayer?: number | null;
  onResetGame?: () => void;
};

const CELL = 10; // percent per cell in 10x10

function center(square: number) {
  const { row, col } = cellPosition(square);
  return { x: col * CELL + CELL / 2, y: row * CELL + CELL / 2 };
}

/** 3D Embossed Braille Dot Matrix Component */
function BrailleCell({ dots }: { dots: [boolean, boolean, boolean, boolean, boolean, boolean] }) {
  // dots: [dot1, dot2, dot3, dot4, dot5, dot6]
  // In 2 columns x 3 rows:
  // Col 0: dot 0 (top), dot 1 (mid), dot 2 (bot)
  // Col 1: dot 3 (top), dot 4 (mid), dot 5 (bot)
  return (
    <div className="grid grid-cols-2 gap-x-[2px] gap-y-[2px]">
      <span className={`size-[3px] sm:size-[4px] rounded-full ${dots[0] ? "braille-dot-active" : "braille-dot opacity-30"}`} />
      <span className={`size-[3px] sm:size-[4px] rounded-full ${dots[3] ? "braille-dot-active" : "braille-dot opacity-30"}`} />
      <span className={`size-[3px] sm:size-[4px] rounded-full ${dots[1] ? "braille-dot-active" : "braille-dot opacity-30"}`} />
      <span className={`size-[3px] sm:size-[4px] rounded-full ${dots[4] ? "braille-dot-active" : "braille-dot opacity-30"}`} />
      <span className={`size-[3px] sm:size-[4px] rounded-full ${dots[2] ? "braille-dot-active" : "braille-dot opacity-30"}`} />
      <span className={`size-[3px] sm:size-[4px] rounded-full ${dots[5] ? "braille-dot-active" : "braille-dot opacity-30"}`} />
    </div>
  );
}

/** Physical 3D Wooden Ladder with Raised Rails, Rungs and Cast Shadow */
function WoodenLadder({
  from,
  to,
  isHighlighted,
  onClick,
}: {
  from: number;
  to: number;
  isHighlighted: boolean;
  onClick: () => void;
}) {
  const a = center(from);
  const b = center(to);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
  const rungs = Math.max(3, Math.round(len / 6.5));

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
      aria-label={`Ladder from square ${from} to ${to}`}
      className={`absolute cursor-pointer transition-all duration-300 ${
        isHighlighted ? "z-30 scale-105 filter drop-shadow-[0_0_10px_#f59e0b]" : "z-10"
      }`}
      style={{
        left: `${a.x}%`,
        top: `${a.y}%`,
        width: `${len}%`,
        height: "6%",
        transform: `translate(0, -50%) rotate(${angle}deg)`,
        transformOrigin: "0 50%",
      }}
    >
      {/* Drop Shadow onto board surface */}
      <div
        className="pointer-events-none absolute inset-0 size-full opacity-60"
        style={{
          transform: "translate(2px, 3px)",
          filter: "blur(2px)",
          background: "rgba(30, 15, 5, 0.5)",
        }}
      />

      {/* 3D Wooden Ladder Body */}
      <div className="relative size-full">
        {/* Left and Right Side Rails */}
        {[0, 1].map((rail) => (
          <div
            key={rail}
            className="absolute left-0 w-full rounded-sm"
            style={{
              top: rail === 0 ? "8%" : "72%",
              height: "20%",
              background: "linear-gradient(180deg, #d97706 0%, #92400e 60%, #451a03 100%)",
              boxShadow: "0 1px 2px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4)",
            }}
          />
        ))}

        {/* Horizontal Wooden Rungs */}
        {Array.from({ length: rungs }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-[1px]"
            style={{
              left: `${((i + 0.5) / rungs) * 100}%`,
              top: "12%",
              width: "3%",
              height: "76%",
              background: "linear-gradient(90deg, #f59e0b 0%, #b45309 60%, #78350f 100%)",
              boxShadow: "0 1.5px 3px rgba(0, 0, 0, 0.5), inset 0 0.5px 0.5px rgba(255, 255, 255, 0.6)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/** Physical 3D Sculpted Snake with Curvature, Scale Textures, Head, and Drop Shadow */
function SculptedSnake({
  from,
  to,
  index,
  isHighlighted,
  onClick,
}: {
  from: number;
  to: number;
  index: number;
  isHighlighted: boolean;
  onClick: () => void;
}) {
  const a = center(from);
  const b = center(to);
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const bow = index % 2 === 0 ? 15 : -15;
  const path = `M ${a.x} ${a.y} Q ${mx + bow} ${my} ${b.x} ${b.y}`;
  const color = SNAKE_COLORS[index % SNAKE_COLORS.length] ?? SNAKE_COLORS[0]!;

  return (
    <svg
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick()}
      aria-label={`Snake from square ${from} to ${to}`}
      className={`absolute inset-0 size-full cursor-pointer transition-all duration-300 ${
        isHighlighted ? "z-30 filter drop-shadow-[0_0_12px_#ef4444]" : "z-20"
      }`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`snake-${from}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={color.accent} />
          <stop offset="50%" stopColor={color.main} />
          <stop offset="100%" stopColor={color.pattern} />
        </linearGradient>
        <filter id={`shadow-${from}`} x="-10%" y="-10%" width="130%" height="130%">
          <feDropShadow dx="0.8" dy="1.4" stdDeviation="0.8" floodColor="#1a0c02" floodOpacity="0.6" />
        </filter>
      </defs>

      {/* Snake Drop Shadow */}
      <path
        d={path}
        fill="none"
        stroke="rgba(20, 10, 5, 0.45)"
        strokeWidth="4.8"
        strokeLinecap="round"
        transform="translate(0.8, 1.2)"
      />

      {/* 3D Snake Outer Border */}
      <path
        d={path}
        fill="none"
        stroke={color.pattern}
        strokeWidth="4.2"
        strokeLinecap="round"
      />

      {/* Snake Body with Gradient */}
      <path
        d={path}
        fill="none"
        stroke={`url(#snake-${from})`}
        strokeWidth="3.2"
        strokeLinecap="round"
      />

      {/* Snake Dorsal Scale Ridge Highlight */}
      <path
        d={path}
        fill="none"
        stroke="rgba(255, 255, 255, 0.45)"
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeDasharray="1.5 2.5"
      />

      {/* Snake Head (at starting/biting square) */}
      <circle cx={a.x} cy={a.y} r="2.8" fill={color.pattern} />
      <circle cx={a.x} cy={a.y} r="2.4" fill={color.main} />
      {/* Snake Eyes */}
      <circle cx={a.x - 0.9} cy={a.y - 0.8} r="0.6" fill="#fef08a" />
      <circle cx={a.x + 0.9} cy={a.y - 0.8} r="0.6" fill="#fef08a" />
      <circle cx={a.x - 0.9} cy={a.y - 0.8} r="0.3" fill="#000000" />
      <circle cx={a.x + 0.9} cy={a.y - 0.8} r="0.3" fill="#000000" />

      {/* Tail Tip (at destination square) */}
      <circle cx={b.x} cy={b.y} r="1.2" fill={color.pattern} />
    </svg>
  );
}

export function GameBoard({
  positions,
  playerCount,
  activePlayer,
  visited,
  onSelectSquare,
  wonPlayer,
  onResetGame,
}: Props) {
  const [highlightedEntity, setHighlightedEntity] = useState<string | null>(null);

  const squares = useMemo(() => Array.from({ length: 100 }, (_, i) => i + 1), []);

  const confettiPieces = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.9,
        bg: ["#f59e0b", "#ef4444", "#10b981", "#3b82f6", "#e11d48"][i % 5],
      })),
    [],
  );

  return (
    <section
      aria-label="Physical Sparsh Khel Wooden Board"
      className="relative flex flex-col rounded-3xl mdf-chassis p-3 sm:p-5"
    >
      {/* Wooden Beveled Perimeter Frame with Inset Brass Screws */}
      <div className="relative aspect-square w-full rounded-2xl board-wood-frame p-2 bg-[#2d180c]">
        {/* Board Surface Inset */}
        <div className="relative size-full overflow-hidden rounded-xl board-surface shadow-[inset_0_3px_8px_rgba(0,0,0,0.5)]">
          {/* 10x10 Tactile Grid */}
          <div className="grid size-full grid-cols-10 grid-rows-10">
            {squares.map((num) => {
              const { row, col } = cellPosition(num);
              const isDark = (row + col) % 2 === 1;
              const brailleDigits = getBrailleDotsForNumber(num);
              const hasLadder = num in LADDERS;
              const hasSnake = num in SNAKES;
              const moment = momentFor(num);
              const isStart = num === 1;
              const isFinish = num === 100;

              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => onSelectSquare?.(num)}
                  aria-label={`Square ${num}${hasLadder ? ", ladder start" : ""}${hasSnake ? ", snake start" : ""}${isFinish ? ", finish line" : ""}`}
                  className={`group relative flex flex-col items-center justify-between border border-[#b89f82]/40 p-0.5 sm:p-1 text-left transition-colors duration-150 hover:bg-amber-200/50 ${
                    isDark ? "board-cell-dark" : "board-cell-light"
                  }`}
                  style={{
                    gridRow: row + 1,
                    gridColumn: col + 1,
                  }}
                >
                  {/* Top Bar: Embossed Numeral & Special Icons */}
                  <div className="flex w-full items-center justify-between">
                    <span className="embossed-num text-[0.6rem] sm:text-[0.75rem] font-bold leading-none">
                      {num}
                    </span>

                    {/* Miniature Badges */}
                    {hasLadder && (
                      <span className="text-[0.55rem] sm:text-[0.65rem] leading-none drop-shadow-sm">
                        🪜
                      </span>
                    )}
                    {hasSnake && (
                      <span className="text-[0.55rem] sm:text-[0.65rem] leading-none drop-shadow-sm">
                        🐍
                      </span>
                    )}
                    {isFinish && (
                      <span className="text-[0.55rem] sm:text-[0.65rem] leading-none drop-shadow-sm">
                        👑
                      </span>
                    )}
                    {isStart && (
                      <span className="text-[0.5rem] font-bold text-emerald-800">
                        START
                      </span>
                    )}
                  </div>

                  {/* Center/Bottom: Visible 3D Embossed Braille Dots */}
                  <div
                    aria-hidden="true"
                    className="my-auto flex items-center justify-center gap-1 opacity-90 transition-transform group-hover:scale-110"
                  >
                    {brailleDigits.map((dots, dIdx) => (
                      <BrailleCell key={dIdx} dots={dots} />
                    ))}
                  </div>

                  {/* Visited Indicator or Story Badge */}
                  <div className="flex w-full items-center justify-between text-[0.5rem]">
                    {visited.has(num) ? (
                      <span className="size-1.5 rounded-full bg-amber-600 shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                    ) : (
                      <span />
                    )}
                    {moment && (
                      <span
                        className="size-1.5 rounded-full"
                        style={{ backgroundColor: moment.scene.primaryColor }}
                        title={moment.title}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Render Ladders */}
          {Object.entries(LADDERS).map(([fromStr, to]) => {
            const from = Number(fromStr);
            const id = `l-${from}`;
            return (
              <WoodenLadder
                key={id}
                from={from}
                to={to}
                isHighlighted={highlightedEntity === id}
                onClick={() => {
                  setHighlightedEntity(highlightedEntity === id ? null : id);
                  onSelectSquare?.(from);
                }}
              />
            );
          })}

          {/* Render Snakes */}
          {Object.entries(SNAKES).map(([fromStr, to], idx) => {
            const from = Number(fromStr);
            const id = `s-${from}`;
            return (
              <SculptedSnake
                key={id}
                from={from}
                to={to}
                index={idx}
                isHighlighted={highlightedEntity === id}
                onClick={() => {
                  setHighlightedEntity(highlightedEntity === id ? null : id);
                  onSelectSquare?.(from);
                }}
              />
            );
          })}

          {/* Physical Turned-Wood Player Peg Tokens Moving on Board */}
          {positions.slice(0, playerCount).map((pos, pIdx) => {
            const c = center(Math.max(1, pos));
            const offsets: Array<[number, number]> = [
              [-2, -2],
              [2, -2],
              [-2, 2],
              [2, 2],
            ];
            const offset = offsets[pIdx] ?? [0, 0];
            const isActive = pIdx === activePlayer;

            return (
              <div
                key={pIdx}
                className="pointer-events-none absolute z-40 transition-all duration-300 ease-out"
                style={{
                  left: `${c.x + offset[0]}%`,
                  top: `${c.y + offset[1]}%`,
                  transform: "translate(-50%, -50%)",
                }}
                aria-hidden="true"
              >
                {/* 3D Turned Peg Token with Shadow */}
                <div className="relative flex size-6 sm:size-8 items-center justify-center">
                  {/* Drop Shadow onto board */}
                  <span className="absolute -bottom-1 size-5 rounded-full bg-black/40 blur-[2px]" />

                  {/* Peg Cap */}
                  <div
                    className="relative flex size-full items-center justify-center rounded-full border-2 border-white/70 shadow-[0_4px_8px_rgba(0,0,0,0.6),inset_0_2px_3px_rgba(255,255,255,0.7)]"
                    style={{
                      backgroundColor: PLAYER_COLORS[pIdx],
                      boxShadow: isActive
                        ? `0 0 0 3px #f59e0b, 0 6px 14px rgba(0,0,0,0.6), inset 0 2px 4px rgba(255,255,255,0.7)`
                        : `0 3px 6px rgba(0,0,0,0.5), inset 0 2px 3px rgba(255,255,255,0.6)`,
                    }}
                  >
                    <span className="text-[0.65rem] font-black text-white drop-shadow-sm">
                      P{pIdx + 1}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Victory Overlay Directly On Board (No Separate Page) */}
          {wonPlayer !== null && wonPlayer !== undefined && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/75 p-6 text-center backdrop-blur-sm">
              <div className="relative max-w-sm rounded-3xl border-4 border-amber-400 bg-gradient-to-b from-[#3b2011] to-[#1c0e05] p-6 text-amber-100 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
                <div className="text-4xl">👑 🏆 🎉</div>
                <h2 className="mt-2 font-display text-2xl font-bold text-amber-300">
                  {PLAYER_NAMES[wonPlayer]} Reached 100!
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-amber-200/90">
                  Through trials, wisdom, and perseverance, {PLAYER_NAMES[wonPlayer]} has completed the sacred path to Ayodhya!
                </p>

                <button
                  type="button"
                  onClick={onResetGame}
                  className="mt-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 text-sm font-bold text-black shadow-lg transition-transform hover:scale-105 active:scale-95"
                >
                  PLAY AGAIN
                </button>

                {/* Falling Confetti Pieces */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                  {confettiPieces.map((piece) => (
                    <span
                      key={piece.id}
                      className="confetti-item absolute -top-4 size-2.5 rounded-sm"
                      style={{
                        left: `${piece.left}%`,
                        backgroundColor: piece.bg,
                        animationDelay: `${piece.delay}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Starting Area: 4 Physical Token Sockets with Active Turn LEDs */}
      <div className="mt-4 flex items-center justify-around rounded-2xl border border-amber-900/50 bg-[#241308] p-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
        {Array.from({ length: 4 }).map((_, i) => {
          const inPlay = i < playerCount;
          const isActive = inPlay && i === activePlayer;
          const color = PLAYER_COLORS[i] ?? "#ef4444";
          const pName = PLAYER_NAMES[i] ?? `Player ${i + 1}`;

          return (
            <div key={i} className="flex flex-col items-center gap-1.5">
              {/* Diffuse Turn Indicator LED */}
              <div className="flex items-center justify-center">
                <span
                  className={`size-3.5 rounded-full border border-black/80 transition-all duration-300 ${
                    isActive ? "turn-led-active" : "opacity-35"
                  }`}
                  style={{
                    backgroundColor: isActive ? color : "#4b5563",
                    boxShadow: isActive
                      ? `0 0 12px 3px ${color}, inset 0 1px 2px white`
                      : "inset 0 1px 2px black",
                    // @ts-expect-error custom CSS variable for glow animation
                    "--led-color": color,
                  }}
                  aria-hidden="true"
                />
              </div>

              {/* Recessed Turned Peg Socket */}
              <div className="flex size-11 items-center justify-center rounded-full bg-[#120904] shadow-[inset_0_3px_6px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.1)]">
                {inPlay && (
                  <div
                    className="flex size-7 items-center justify-center rounded-full border-2 border-white/60 shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
                    style={{ backgroundColor: color }}
                  >
                    <span className="text-[0.65rem] font-bold text-white">
                      P{i + 1}
                    </span>
                  </div>
                )}
              </div>

              {/* Player Label */}
              <span className="text-[0.65rem] font-mono font-medium text-amber-200/80">
                {inPlay ? `${pName}${isActive ? " (TURN)" : ""}` : "Empty"}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
