import { useMemo } from "react";
import { type StoryScene } from "@/lib/sparsh-data";

type DiceDisplayProps = {
  rolling: boolean;
  dice: number | null;
  activePlayerName: string;
  activePlayerColor: string;
  currentSquare: number;
  targetSquare?: number | null;
  statusText?: string;
};

// Dice Face Pips Renderer
function DicePips({ value }: { value: number }) {
  const pips = useMemo(() => {
    switch (value) {
      case 1:
        return [{ cx: 50, cy: 50 }];
      case 2:
        return [{ cx: 30, cy: 30 }, { cx: 70, cy: 70 }];
      case 3:
        return [{ cx: 30, cy: 30 }, { cx: 50, cy: 50 }, { cx: 70, cy: 70 }];
      case 4:
        return [
          { cx: 30, cy: 30 }, { cx: 70, cy: 30 },
          { cx: 30, cy: 70 }, { cx: 70, cy: 70 },
        ];
      case 5:
        return [
          { cx: 30, cy: 30 }, { cx: 70, cy: 30 },
          { cx: 50, cy: 50 },
          { cx: 30, cy: 70 }, { cx: 70, cy: 70 },
        ];
      case 6:
        return [
          { cx: 30, cy: 25 }, { cx: 70, cy: 25 },
          { cx: 30, cy: 50 }, { cx: 70, cy: 50 },
          { cx: 30, cy: 75 }, { cx: 70, cy: 75 },
        ];
      default:
        return [];
    }
  }, [value]);

  return (
    <svg viewBox="0 0 100 100" className="size-16 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
      <rect
        x="8"
        y="8"
        width="84"
        height="84"
        rx="16"
        fill="#fef3c7"
        stroke="#d97706"
        strokeWidth="4"
      />
      {pips.map((pip, idx) => (
        <circle
          key={idx}
          cx={pip.cx}
          cy={pip.cy}
          r="7.5"
          fill="#dc2626"
          className="drop-shadow-sm"
        />
      ))}
    </svg>
  );
}

/**
 * 1.28-inch GC9A01 Round TFT Display Simulation
 * Realistic circular LCD recessed into wooden module with dark CNC bezel
 */
export function GC9A01DiceDisplay({
  rolling,
  dice,
  activePlayerName,
  activePlayerColor,
  currentSquare,
  statusText,
}: DiceDisplayProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Physical Bezel & Screws */}
      <div className="relative flex size-44 items-center justify-center rounded-full bg-gradient-to-b from-[#2d3748] via-[#1a202c] to-[#0f172a] p-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.7),inset_0_2px_3px_rgba(255,255,255,0.2)]">
        {/* CNC Mounting Screws at 4 quadrants */}
        <span className="absolute top-1 size-1.5 rounded-full bg-neutral-600 shadow-[inset_0_0.5px_1px_black]" />
        <span className="absolute bottom-1 size-1.5 rounded-full bg-neutral-600 shadow-[inset_0_0.5px_1px_black]" />
        <span className="absolute left-1 size-1.5 rounded-full bg-neutral-600 shadow-[inset_0_0.5px_1px_black]" />
        <span className="absolute right-1 size-1.5 rounded-full bg-neutral-600 shadow-[inset_0_0.5px_1px_black]" />

        {/* Circular Display Glass (GC9A01 240x240 RGB) */}
        <div className="relative flex size-full flex-col items-center justify-center overflow-hidden rounded-full bg-[#050b14] p-3 text-center shadow-[inset_0_4px_8px_rgba(0,0,0,0.95)]">
          {/* Subtle LCD Scanlines & Glare */}
          <div className="pointer-events-none absolute inset-0 scanlines opacity-30" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent" />

          {/* Display Header */}
          <div className="relative z-10 text-[0.6rem] font-bold tracking-widest text-amber-400">
            GC9A01 · DICE
          </div>

          {/* Dynamic Content */}
          <div className="relative z-10 my-1 flex items-center justify-center">
            {rolling ? (
              <div className="dice-spin flex flex-col items-center justify-center">
                <DicePips value={((Math.floor(Date.now() / 150) % 6) + 1)} />
              </div>
            ) : dice !== null ? (
              <div className="flex flex-col items-center">
                <DicePips value={dice} />
                <span className="mt-0.5 text-xs font-black tracking-widest text-emerald-400">
                  ROLLED {dice}
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="flex size-14 items-center justify-center rounded-2xl border-2 border-dashed border-amber-500/40 bg-amber-500/10 text-xl font-bold text-amber-300">
                  ?
                </div>
                <span className="mt-1 text-[0.65rem] font-medium text-amber-200/80">
                  PRESS ROLL
                </span>
              </div>
            )}
          </div>

          {/* Player & Square Status Bar */}
          <div className="relative z-10 flex flex-col items-center">
            <span
              className="text-[0.65rem] font-bold uppercase tracking-wider"
              style={{ color: activePlayerColor }}
            >
              {activePlayerName}
            </span>
            <span className="text-[0.6rem] font-mono text-cyan-300">
              {statusText || `SQ ${String(currentSquare).padStart(3, "0")}`}
            </span>
          </div>
        </div>
      </div>
      <span className="mt-1 text-[0.6rem] font-mono uppercase tracking-widest text-amber-200/60">
        1.28&quot; Round TFT
      </span>
    </div>
  );
}

/** Illustrated Scene SVG for ILI9341 Display */
function SceneArt({ scene }: { scene: StoryScene }) {
  switch (scene.svgType) {
    case "hanuman":
      return (
        <svg viewBox="0 0 120 60" className="size-full">
          <defs>
            <linearGradient id="oceanGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#082f49" />
            </linearGradient>
          </defs>
          <rect width="120" height="60" fill="url(#oceanGrad)" />
          {/* Waves */}
          <path d="M0 45 Q 30 38, 60 45 T 120 45 L 120 60 L 0 60 Z" fill="#0369a1" />
          <path d="M0 50 Q 20 45, 40 50 T 80 50 T 120 50 L 120 60 L 0 60 Z" fill="#075985" />
          {/* Leaping Hanuman Silhouette */}
          <circle cx="65" cy="22" r="6" fill="#f59e0b" />
          <path d="M60 25 L50 32 L40 28" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <path d="M65 28 L78 20" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M68 25 Q 75 12, 85 10" stroke="#fbbf24" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          {/* Sun/Aura */}
          <circle cx="100" cy="15" r="10" fill="#fef08a" opacity="0.8" />
        </svg>
      );
    case "sugriva":
      return (
        <svg viewBox="0 0 120 60" className="size-full">
          <rect width="120" height="60" fill="#14532d" />
          {/* Forest trees */}
          <polygon points="15,45 30,15 45,45" fill="#166534" />
          <polygon points="75,45 90,12 105,45" fill="#166534" />
          {/* Sacred Fire */}
          <polygon points="55,48 60,32 65,48" fill="#f97316" />
          <polygon points="57,48 60,38 63,48" fill="#fde047" />
          {/* Clasping hands silhouette */}
          <line x1="42" y1="36" x2="54" y2="40" stroke="#fef08a" strokeWidth="4" strokeLinecap="round" />
          <line x1="78" y1="36" x2="66" y2="40" stroke="#fef08a" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case "deer":
      return (
        <svg viewBox="0 0 120 60" className="size-full">
          <rect width="120" height="60" fill="#78350f" />
          {/* Golden Deer Silhouette */}
          <ellipse cx="60" cy="38" rx="14" ry="9" fill="#fbbf24" />
          <circle cx="74" cy="28" r="6" fill="#fbbf24" />
          <line x1="74" y1="23" x2="78" y2="15" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
          <line x1="76" y1="24" x2="83" y2="18" stroke="#fef08a" strokeWidth="2" strokeLinecap="round" />
          {/* Legs */}
          <line x1="52" y1="44" x2="50" y2="56" stroke="#fbbf24" strokeWidth="2.5" />
          <line x1="68" y1="44" x2="70" y2="56" stroke="#fbbf24" strokeWidth="2.5" />
          {/* Sparkles */}
          <circle cx="35" cy="20" r="2" fill="#fff" />
          <circle cx="85" cy="35" r="1.5" fill="#fff" />
        </svg>
      );
    case "jatayu":
      return (
        <svg viewBox="0 0 120 60" className="size-full">
          <rect width="120" height="60" fill="#1e1b4b" />
          {/* Clouds */}
          <ellipse cx="30" cy="45" rx="25" ry="10" fill="#312e81" />
          <ellipse cx="90" cy="48" rx="20" ry="8" fill="#312e81" />
          {/* Soaring Eagle */}
          <path d="M 60 25 Q 35 10, 20 22 Q 45 28, 60 30 Q 75 28, 100 22 Q 85 10, 60 25 Z" fill="#38bdf8" />
          <circle cx="60" cy="22" r="4" fill="#0284c7" />
        </svg>
      );
    case "bridge":
      return (
        <svg viewBox="0 0 120 60" className="size-full">
          <rect width="120" height="60" fill="#0c4a6e" />
          {/* Rama Setu Bridge Stones */}
          <rect x="10" y="32" width="16" height="12" rx="3" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
          <rect x="28" y="30" width="18" height="14" rx="3" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
          <rect x="48" y="31" width="16" height="13" rx="3" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
          <rect x="66" y="29" width="20" height="15" rx="3" fill="#cbd5e1" stroke="#64748b" strokeWidth="1.5" />
          <rect x="88" y="32" width="18" height="12" rx="3" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
          {/* Small Squirrel */}
          <ellipse cx="56" cy="26" rx="4" ry="3" fill="#f59e0b" />
        </svg>
      );
    case "shabari":
      return (
        <svg viewBox="0 0 120 60" className="size-full">
          <rect width="120" height="60" fill="#365314" />
          {/* Bowl of Berries */}
          <path d="M 40 38 Q 60 55, 80 38 Z" fill="#78350f" stroke="#a16207" strokeWidth="2" />
          <circle cx="50" cy="35" r="4" fill="#dc2626" />
          <circle cx="58" cy="33" r="4" fill="#e11d48" />
          <circle cx="66" cy="36" r="4" fill="#be123c" />
          <circle cx="60" cy="39" r="3.5" fill="#ef4444" />
        </svg>
      );
    case "ayodhya":
      return (
        <svg viewBox="0 0 120 60" className="size-full">
          <rect width="120" height="60" fill="#78350f" />
          {/* Palace Domes & Flags of Ayodhya */}
          <path d="M 20 55 L 20 30 Q 35 15, 50 30 L 50 55 Z" fill="#d97706" />
          <path d="M 50 55 L 50 24 Q 70 8, 90 24 L 90 55 Z" fill="#b45309" />
          <path d="M 90 55 L 90 32 Q 100 18, 110 32 L 110 55 Z" fill="#92400e" />
          {/* Saffron Flag atop palace */}
          <line x1="70" y1="8" x2="70" y2="2" stroke="#fef08a" strokeWidth="1.5" />
          <polygon points="70,2 78,5 70,8" fill="#ea580c" />
          {/* Golden Sun */}
          <circle cx="25" cy="14" r="8" fill="#fde047" opacity="0.85" />
        </svg>
      );
    case "ocean":
      return (
        <svg viewBox="0 0 120 60" className="size-full">
          <rect width="120" height="60" fill="#0369a1" />
          <path d="M 0 35 Q 30 25, 60 35 T 120 35 L 120 60 L 0 60 Z" fill="#0284c7" />
          <path d="M 0 45 Q 25 38, 50 45 T 100 45 T 120 45 L 120 60 L 0 60 Z" fill="#0c4a6e" />
          <circle cx="95" cy="20" r="10" fill="#fef08a" opacity="0.75" />
        </svg>
      );
    case "sanjeevani":
      return (
        <svg viewBox="0 0 120 60" className="size-full">
          <rect width="120" height="60" fill="#064e3b" />
          {/* Mountain Dronagiri */}
          <polygon points="20,60 60,18 100,60" fill="#065f46" />
          <polygon points="45,60 70,12 95,60" fill="#047857" />
          {/* Glowing Sanjeevani Herbs */}
          <circle cx="55" cy="30" r="2.5" fill="#a7f3d0" className="animate-pulse" />
          <circle cx="70" cy="22" r="3" fill="#6ee7b7" className="animate-pulse" />
          <circle cx="78" cy="35" r="2" fill="#a7f3d0" className="animate-pulse" />
          {/* Golden Aura */}
          <circle cx="68" cy="25" r="14" fill="#34d399" opacity="0.25" />
        </svg>
      );
    case "victory":
      return (
        <svg viewBox="0 0 120 60" className="size-full">
          <rect width="120" height="60" fill="#451a03" />
          {/* Diyas / Lamps of Ayodhya */}
          <path d="M 25 42 Q 35 52, 45 42 Z" fill="#d97706" />
          <ellipse cx="35" cy="36" rx="3" ry="5" fill="#fef08a" />
          <path d="M 50 42 Q 60 52, 70 42 Z" fill="#d97706" />
          <ellipse cx="60" cy="34" rx="4" ry="7" fill="#fef08a" />
          <path d="M 75 42 Q 85 52, 95 42 Z" fill="#d97706" />
          <ellipse cx="85" cy="36" rx="3" ry="5" fill="#fef08a" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 120 60" className="size-full">
          <rect width="120" height="60" fill="#1e293b" />
          <circle cx="60" cy="30" r="18" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
          <text x="60" y="34" textAnchor="middle" fill="#fef3c7" fontSize="10" fontWeight="bold">
            SPARSH KHEL
          </text>
        </svg>
      );
  }
}

type StoryDisplayProps = {
  chapter?: string | undefined;
  title?: string | undefined;
  narration?: string | undefined;
  valueOrLesson?: string | undefined;
  scene?: StoryScene | undefined;
  progressPercent?: number | undefined;
};

/**
 * 2.4-inch ILI9341 Rectangular TFT Display Simulation
 * Mounted in realistic wooden enclosure with high-contrast screen for deaf/hard-of-hearing visual storytelling
 */
export function ILI9341StoryDisplay({
  chapter = "RAMAYANA STORY",
  title = "Welcome to Sparsh Khel",
  narration = "Tap the RFID Story Card zone or press ROLL DICE to begin your journey through sacred values.",
  valueOrLesson = "Inclusive Multi-Sensory Play",
  scene = { svgType: "default", primaryColor: "#f59e0b" },
  progressPercent = 10,
}: StoryDisplayProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Rectangular TFT Bezel */}
      <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#2d3748] via-[#1a202c] to-[#0f172a] p-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.7),inset_0_2px_3px_rgba(255,255,255,0.2)]">
        {/* Corner mounting screws */}
        <span className="absolute left-1.5 top-1.5 size-1.5 rounded-full bg-neutral-600 shadow-[inset_0_0.5px_1px_black]" />
        <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-neutral-600 shadow-[inset_0_0.5px_1px_black]" />
        <span className="absolute bottom-1.5 left-1.5 size-1.5 rounded-full bg-neutral-600 shadow-[inset_0_0.5px_1px_black]" />
        <span className="absolute bottom-1.5 right-1.5 size-1.5 rounded-full bg-neutral-600 shadow-[inset_0_0.5px_1px_black]" />

        {/* LCD Screen Glass (ILI9341 240x320) */}
        <div className="relative flex flex-col overflow-hidden rounded-xl bg-[#070e1b] shadow-[inset_0_3px_8px_rgba(0,0,0,0.95)]">
          {/* LCD Scanlines & Glare overlay */}
          <div className="pointer-events-none absolute inset-0 scanlines opacity-25" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />

          {/* Top Status Bar */}
          <div className="relative z-10 flex items-center justify-between border-b border-cyan-900/60 bg-slate-900/90 px-2.5 py-1 text-[0.65rem]">
            <span className="font-mono font-bold tracking-widest text-cyan-400">
              ILI9341 · TFT 2.4&quot;
            </span>
            <span className="rounded bg-amber-500/20 px-1.5 py-0.5 font-semibold text-amber-300">
              {chapter}
            </span>
          </div>

          {/* Illustrated Scene Thumbnail */}
          <div className="relative z-10 h-20 w-full overflow-hidden border-b border-slate-800 bg-slate-950">
            <SceneArt scene={scene} />
            <div className="absolute bottom-1 right-2 rounded bg-black/70 px-1.5 py-0.5 text-[0.55rem] font-medium text-amber-200">
              Visual Scene
            </div>
          </div>

          {/* Story Title & Text */}
          <div className="relative z-10 flex flex-col gap-1.5 p-3 text-left">
            <h3 className="font-serif text-sm font-bold text-amber-300">
              {title}
            </h3>
            <p className="min-h-16 text-xs leading-relaxed text-slate-200">
              {narration}
            </p>

            {/* Moral / Value Badge */}
            <div className="mt-1 flex items-center justify-between rounded-lg bg-amber-950/40 p-1.5 border border-amber-700/40">
              <span className="text-[0.65rem] font-bold tracking-wide text-amber-400">
                ⭐ {valueOrLesson}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mt-1 flex items-center gap-2">
              <span className="text-[0.55rem] font-mono text-slate-400">PROGRESS</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(5, progressPercent))}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <span className="mt-1 text-[0.6rem] font-mono uppercase tracking-widest text-amber-200/60">
        2.4&quot; Story TFT (Deaf-Friendly)
      </span>
    </div>
  );
}
