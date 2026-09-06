import {
  ArrowLeft,
  ArrowRight,
  Check,
  Nfc,
  Repeat2,
  Volume2,
  VolumeX,
} from "lucide-react";
import { STORY_CARDS, type StoryId } from "@/lib/sparsh-data";

type Props = {
  storyId: StoryId | null;
  cardsOpen: boolean;
  highlightIndex: number;
  onToggleCards: () => void;
  onPickCard: (index: number) => void;
  narration: string;
  muted: boolean;
  onToggleMute: () => void;
  onRoll: () => void;
  rolling: boolean;
  canRoll: boolean;
  dice: number | null;
  square: number;
  prompt: boolean;
  onRepeat: () => void;
  onPrevCard: () => void;
  onConfirmCard: () => void;
};

const btn =
  "min-h-12 min-w-12 rounded-2xl px-3 py-2 text-xs font-semibold text-cream tactile tactile-press flex flex-col items-center justify-center gap-1";

export function ControlUnit(p: Props) {
  return (
    <section
      aria-label="Control unit"
      className="flex flex-col gap-4 rounded-3xl border-4 border-[color-mix(in_oklab,var(--maroon)_70%,black)] p-4 panel-surface relief"
    >
      {/* 1. RFID tap zone */}
      <div className="flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={p.onToggleCards}
          aria-expanded={p.cardsOpen}
          className="flex size-24 flex-col items-center justify-center gap-1 rounded-full border-2 border-gold/60 bg-[radial-gradient(circle_at_35%_30%,color-mix(in_oklab,var(--saffron)_85%,white),var(--terracotta))] text-cream tactile tactile-press"
        >
          <Nfc className="size-7" aria-hidden="true" />
          <span className="text-[0.6rem] font-bold tracking-widest">RFID</span>
        </button>
        <p className="text-[0.7rem] uppercase tracking-[0.2em] text-cream/70">Tap to choose story</p>

        {p.cardsOpen && (
          <div
            role="radiogroup"
            aria-label="Story cards"
            className="flex w-full gap-2 overflow-x-auto rounded-2xl bg-[oklch(0_0_0_/_18%)] p-2"
          >
            {STORY_CARDS.map((card, i) => {
              const selected = p.storyId === card.id;
              return (
                <button
                  key={card.id}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => p.onPickCard(i)}
                  className={`min-h-12 min-w-24 flex-1 rounded-xl px-2 py-2 text-xs font-semibold tactile tactile-press ${
                    selected
                      ? "bg-gold text-[color:var(--maroon)]"
                      : "bg-[oklch(1_0_0_/_12%)] text-cream"
                  } ${p.highlightIndex === i && !selected ? "ring-2 ring-gold" : ""}`}
                >
                  {card.label}
                  {!card.available && (
                    <span className="mt-1 block text-[0.6rem] font-normal opacity-70">soon</span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Speaker panel */}
      <div className="rounded-2xl border border-cream/20 bg-[oklch(0_0_0_/_22%)] p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[0.65rem] font-bold tracking-[0.3em] text-cream/70">SPEAKER</span>
          <button
            type="button"
            onClick={p.onToggleMute}
            aria-pressed={p.muted}
            aria-label={p.muted ? "Unmute narration" : "Mute narration"}
            className="flex size-12 items-center justify-center rounded-full bg-[oklch(1_0_0_/_12%)] text-cream tactile tactile-press"
          >
            {p.muted ? (
              <VolumeX className="size-5" aria-hidden="true" />
            ) : (
              <Volume2 className="size-5" aria-hidden="true" />
            )}
          </button>
        </div>
        <div
          className="min-h-24 rounded-xl bg-[repeating-linear-gradient(0deg,oklch(0_0_0_/_28%)_0px,oklch(0_0_0_/_28%)_2px,transparent_2px,transparent_5px)] p-3 text-sm leading-relaxed text-cream"
          aria-live="polite"
        >
          {p.narration || "Narration will appear here."}
        </div>
      </div>

      {/* 3 + 4. Roll button and OLED readout */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={p.onRoll}
          disabled={!p.canRoll}
          className={`flex size-32 shrink-0 flex-col items-center justify-center rounded-full border-4 border-gold/70 bg-[radial-gradient(circle_at_35%_28%,color-mix(in_oklab,var(--saffron)_92%,white_10%),color-mix(in_oklab,var(--terracotta)_85%,black_15%))] text-cream tactile tactile-press disabled:opacity-50 ${
            p.rolling ? "dice-rolling" : ""
          }`}
        >
          <span className="text-3xl font-bold">{p.dice ?? "–"}</span>
          <span className="text-xs font-bold tracking-[0.25em]">ROLL</span>
        </button>

        <div className="flex-1 rounded-xl border border-[oklch(0.7_0.15_150_/_45%)] bg-[oklch(0.14_0.02_180)] p-3 font-mono text-[color:oklch(0.85_0.17_160)]">
          <div className="text-[0.6rem] tracking-[0.25em] opacity-70">LED DISPLAY</div>
          <div className="text-xl leading-tight">DICE {p.dice ?? "-"}</div>
          <div className="text-xl leading-tight">SQ {String(p.square).padStart(3, "0")}</div>
        </div>
      </div>

      {/* 5. Tap card here */}
      <div
        className={`rounded-2xl border-2 border-dashed border-gold/60 bg-[oklch(1_0_0_/_8%)] p-4 text-center ${
          p.prompt ? "prompt-pulse" : ""
        }`}
      >
        <p className="text-sm font-bold tracking-[0.2em] text-cream">TAP CARD HERE</p>
        <p className="mt-1 text-xs text-cream/70">
          {p.storyId
            ? `${STORY_CARDS.find((c) => c.id === p.storyId)?.label} loaded`
            : "Place a story card on the RFID zone to begin"}
        </p>
      </div>

      {/* 6. U / D / L / R cluster */}
      <div>
        <p className="mb-2 text-[0.65rem] tracking-[0.2em] text-cream/60">
          CONTROL CLUSTER (proposed mapping — confirm with team)
        </p>
        <div className="grid grid-cols-4 gap-2">
          <button
            type="button"
            onClick={p.onRepeat}
            className={`${btn} bg-[oklch(1_0_0_/_12%)]`}
          >
            <Repeat2 className="size-5" aria-hidden="true" />
            <span>U · Repeat</span>
          </button>
          <button
            type="button"
            onClick={p.onToggleMute}
            className={`${btn} bg-[oklch(1_0_0_/_12%)]`}
          >
            {p.muted ? (
              <VolumeX className="size-5" aria-hidden="true" />
            ) : (
              <Volume2 className="size-5" aria-hidden="true" />
            )}
            <span>D · Sound</span>
          </button>
          <button
            type="button"
            onClick={p.onPrevCard}
            className={`${btn} bg-[oklch(1_0_0_/_12%)]`}
          >
            <ArrowLeft className="size-5" aria-hidden="true" />
            <span>L · Prev</span>
          </button>
          <button
            type="button"
            onClick={p.onConfirmCard}
            className={`${btn} bg-[oklch(1_0_0_/_12%)]`}
          >
            <Check className="size-5" aria-hidden="true" />
            <span>R · Select</span>
          </button>
        </div>
      </div>
    </section>
  );
}
