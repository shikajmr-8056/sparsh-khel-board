import { useState } from "react";
import {
  Nfc,
  Volume2,
  VolumeX,
  RotateCcw,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Cpu,
  Sparkles,
} from "lucide-react";
import { STORY_CARDS, type StoryId, type StoryScene } from "@/lib/sparsh-data";
import { GC9A01DiceDisplay, ILI9341StoryDisplay } from "@/components/Displays";
import { HardwareInternalsModal } from "@/components/HardwareInternalsModal";

type Props = {
  storyId: StoryId | null;
  onPickCard: (id: StoryId) => void;
  // Dice Display props
  rolling: boolean;
  dice: number | null;
  canRoll: boolean;
  onRoll: () => void;
  activePlayerName: string;
  activePlayerColor: string;
  currentSquare: number;
  // Story Display props
  chapterTitle?: string;
  storyTitle?: string;
  narration: string;
  valueOrLesson?: string;
  scene?: StoryScene;
  progressPercent?: number;
  // Audio & Accessibility props
  isSpeaking: boolean;
  muted: boolean;
  onToggleMute: () => void;
  onRepeatNarration: () => void;
  onPrevChapter?: () => void;
  onConfirmSelection?: () => void;
  // Prompt state
  isCardPromptActive: boolean;
};

export function ControlUnit({
  storyId,
  onPickCard,
  rolling,
  dice,
  canRoll,
  onRoll,
  activePlayerName,
  activePlayerColor,
  currentSquare,
  chapterTitle,
  storyTitle,
  narration,
  valueOrLesson,
  scene,
  progressPercent,
  isSpeaking,
  muted,
  onToggleMute,
  onRepeatNarration,
  onPrevChapter,
  onConfirmSelection,
  isCardPromptActive,
}: Props) {
  const [cardsOpen, setCardsOpen] = useState(false);
  const [internalsOpen, setInternalsOpen] = useState(false);

  const activeCard = STORY_CARDS.find((c) => c.id === storyId) ?? STORY_CARDS[0];

  return (
    <section
      aria-label="Physical Electronics Control Module"
      className="relative flex flex-col gap-4 rounded-3xl mdf-chassis p-4 shadow-2xl"
    >
      {/* Module Title Header with Technical View Toggle */}
      <div className="flex items-center justify-between border-b border-amber-900/60 pb-2">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          <span className="font-mono text-[0.65rem] font-bold tracking-widest text-amber-200">
            CONTROL UNIT · ESP32 I/O
          </span>
        </div>

        {/* Unobtrusive "VIEW INTERNALS" Switch */}
        <button
          type="button"
          onClick={() => setInternalsOpen(true)}
          className="flex items-center gap-1 rounded-lg border border-cyan-500/40 bg-cyan-950/40 px-2 py-1 text-[0.6rem] font-mono font-semibold text-cyan-300 transition-colors hover:bg-cyan-900/60"
          title="Inspect internal ESP32 wiring & peripheral schematics"
        >
          <Cpu className="size-3" />
          <span>VIEW INTERNALS</span>
        </button>
      </div>

      {/* 1. TOP AREA: RFID STORY CARD SCANNER & PHYSICAL SLOTS */}
      <div className="rounded-2xl border border-amber-800/40 bg-[#221207] p-3 text-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
        <div className="flex items-center justify-between text-[0.65rem] font-mono text-amber-400">
          <span className="flex items-center gap-1">
            <Nfc className="size-3.5" /> RC522 RFID SCANNER
          </span>
          <span className="text-[0.6rem] text-amber-200/70">13.56 MHz</span>
        </div>

        {/* Circular RFID Tap Zone */}
        <div className="my-3 flex flex-col items-center">
          <button
            type="button"
            onClick={() => setCardsOpen((o) => !o)}
            aria-expanded={cardsOpen}
            aria-label="Tap RFID story card zone to change story"
            className={`group relative flex size-24 items-center justify-center rounded-full border-2 border-amber-500/70 bg-gradient-to-b from-[#451a03] via-[#2d1203] to-[#1a0a02] text-amber-200 shadow-[0_4px_12px_rgba(0,0,0,0.7),inset_0_2px_3px_rgba(255,255,255,0.2)] transition-all hover:scale-105 active:scale-95 ${
              isCardPromptActive ? "rfid-ring" : ""
            }`}
          >
            {/* Concentric RFID Antenna Coil Rings */}
            <div className="pointer-events-none absolute inset-2 rounded-full border border-amber-400/30" />
            <div className="pointer-events-none absolute inset-4 rounded-full border border-amber-400/40" />
            <div className="pointer-events-none absolute inset-6 rounded-full border border-amber-400/50" />

            <div className="relative z-10 flex flex-col items-center">
              <Nfc className="size-7 text-amber-400 group-hover:text-amber-300" />
              <span className="mt-1 text-[0.55rem] font-black tracking-widest text-amber-200">
                TAP CARD HERE
              </span>
            </div>
          </button>
          <span className="mt-1 text-[0.6rem] text-amber-200/70">
            {cardsOpen ? "Select a physical story card below" : "Click to scan RFID story cards"}
          </span>
        </div>

        {/* Inserted Physical Card Dock Display */}
        {storyId && (
          <div className="flex items-center justify-between rounded-xl border border-amber-600/40 bg-gradient-to-r from-amber-950/80 to-amber-900/60 px-3 py-1.5 shadow-[inset_0_1px_2px_rgba(0,0,0,0.5)]">
            <div className="flex items-center gap-2 text-left">
              <span className="size-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
              <div>
                <div className="text-xs font-bold text-amber-200">
                  {activeCard.label} RFID Card
                </div>
                <div className="text-[0.6rem] text-amber-300/70">
                  {activeCard.subtitle}
                </div>
              </div>
            </div>
            <span className="rounded bg-amber-700/60 px-1.5 py-0.5 text-[0.55rem] font-bold text-white">
              DOCKED
            </span>
          </div>
        )}

        {/* Expandable 4 Physical Story Cards within module */}
        {cardsOpen && (
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-amber-900/50 pt-3">
            {STORY_CARDS.map((card) => {
              const isSelected = storyId === card.id;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => {
                    onPickCard(card.id);
                    setCardsOpen(false);
                  }}
                  className={`flex flex-col items-start rounded-xl border p-2 text-left transition-all ${
                    isSelected
                      ? "border-amber-400 bg-amber-700/80 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                      : "border-amber-900/60 bg-[#190c05] hover:border-amber-500/60 hover:bg-[#281308]"
                  }`}
                >
                  <div className="flex w-full items-center justify-between">
                    <span className="text-xs font-bold text-amber-200">
                      {card.label}
                    </span>
                    {isSelected && (
                      <span className="text-[0.6rem] font-bold text-emerald-300">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <span className="mt-1 text-[0.55rem] text-amber-300/60 leading-tight">
                    {card.subtitle}
                  </span>
                  {!card.available && (
                    <span className="mt-1 rounded bg-amber-950/80 px-1 py-0.5 text-[0.5rem] font-mono text-amber-400">
                      Coming Soon
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. DICE SUBSYSTEM: GC9A01 ROUND TFT & LARGE ARCADE ROLL BUTTON SIDE-BY-SIDE */}
      <div className="rounded-2xl border border-amber-900/60 bg-[#221207] p-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
        <div className="mb-2 flex items-center justify-between text-[0.6rem] font-mono tracking-widest text-amber-400">
          <span>GC9A01 TFT DISPLAY</span>
          <span>ARCADE ROLL TRIGGER</span>
        </div>
        <div className="flex flex-wrap items-center justify-around gap-4">
          {/* GC9A01 1.28-inch Round TFT Dice Display */}
          <GC9A01DiceDisplay
            rolling={rolling}
            dice={dice}
            activePlayerName={activePlayerName}
            activePlayerColor={activePlayerColor}
            currentSquare={currentSquare}
          />

          {/* Large Physical Arcade Push Button directly next to Dice Display */}
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={onRoll}
              disabled={!canRoll || rolling}
              aria-label="Roll dice physical arcade button"
              className={`group relative flex size-32 sm:size-36 items-center justify-center rounded-full arcade-btn disabled:opacity-50 ${
                rolling ? "arcade-btn-active opacity-90" : ""
              }`}
            >
              {/* Beveled Outer Collar Ring */}
              <div className="pointer-events-none absolute inset-1.5 rounded-full border-2 border-red-300/40" />

              {/* Central Dome Text */}
              <div className="flex flex-col items-center text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                <Sparkles className="size-6 text-amber-200 group-hover:rotate-12 transition-transform" />
                <span className="mt-0.5 font-display text-lg sm:text-xl font-black tracking-widest">
                  ROLL
                </span>
                <span className="text-[0.6rem] sm:text-[0.65rem] font-bold tracking-[0.25em] text-amber-100">
                  DICE
                </span>
              </div>
            </button>
            <span className="mt-1.5 text-[0.6rem] font-mono font-bold tracking-widest text-amber-200/70">
              PUSH TO ROLL
            </span>
          </div>
        </div>
      </div>

      {/* 3. ILI9341 2.4-inch Rectangular Story TFT Display */}
      <ILI9341StoryDisplay
        chapter={chapterTitle}
        title={storyTitle}
        narration={narration}
        valueOrLesson={valueOrLesson}
        scene={scene}
        progressPercent={progressPercent}
      />

      {/* 4. FOUR TACTILE NAVIGATION ACCESSIBILITY BUTTONS */}
      <div className="rounded-2xl border border-amber-900/60 bg-[#221207] p-3">
        <div className="mb-2 text-center text-[0.6rem] font-mono tracking-widest text-amber-400">
          TACTILE ACCESSIBILITY CONTROLS
        </div>
        <div className="grid grid-cols-4 gap-2">
          {/* UP Button: Repeat Narration */}
          <button
            type="button"
            onClick={onRepeatNarration}
            className="flex flex-col items-center justify-center rounded-xl p-2 nav-btn active:nav-btn-active text-amber-200"
            title="Repeat voice narration"
          >
            <ArrowUp className="size-4 text-amber-400" />
            <span className="mt-1 text-[0.55rem] font-bold">UP</span>
            <span className="text-[0.5rem] text-amber-200/60">Repeat</span>
          </button>

          {/* DOWN Button: Volume / Mute Toggle */}
          <button
            type="button"
            onClick={onToggleMute}
            className="flex flex-col items-center justify-center rounded-xl p-2 nav-btn active:nav-btn-active text-amber-200"
            title="Toggle speaker mute"
          >
            {muted ? (
              <VolumeX className="size-4 text-red-400" />
            ) : (
              <ArrowDown className="size-4 text-amber-400" />
            )}
            <span className="mt-1 text-[0.55rem] font-bold">DOWN</span>
            <span className="text-[0.5rem] text-amber-200/60">{muted ? "Unmute" : "Sound"}</span>
          </button>

          {/* LEFT Button: Previous Chapter */}
          <button
            type="button"
            onClick={onPrevChapter}
            className="flex flex-col items-center justify-center rounded-xl p-2 nav-btn active:nav-btn-active text-amber-200"
            title="Previous story chapter"
          >
            <ArrowLeft className="size-4 text-amber-400" />
            <span className="mt-1 text-[0.55rem] font-bold">LEFT</span>
            <span className="text-[0.5rem] text-amber-200/60">Prev</span>
          </button>

          {/* RIGHT Button: Confirm Selection */}
          <button
            type="button"
            onClick={onConfirmSelection}
            className="flex flex-col items-center justify-center rounded-xl p-2 nav-btn active:nav-btn-active text-amber-200"
            title="Confirm selection"
          >
            <ArrowRight className="size-4 text-amber-400" />
            <span className="mt-1 text-[0.55rem] font-bold">RIGHT</span>
            <span className="text-[0.5rem] text-amber-200/60">Select</span>
          </button>
        </div>
      </div>

      {/* 5. CIRCULAR SPEAKER GRILLE WITH AUDIO WAVEFORM ANIMATION */}
      <div className="flex items-center justify-between rounded-2xl border border-amber-900/60 bg-[#221207] p-3 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
        <div className="flex items-center gap-3">
          {/* Realistic Drilled CNC Speaker Grille (Concentric Hole Matrix) */}
          <div className="relative flex size-14 items-center justify-center rounded-full bg-[#150a04] p-1.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9),0_1px_1px_rgba(255,255,255,0.1)]">
            <div className="grid grid-cols-4 gap-1">
              {Array.from({ length: 16 }).map((_, i) => (
                <span key={i} className="size-1.5 speaker-hole" />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1 text-xs font-bold text-amber-200">
              <Volume2 className="size-4 text-amber-400" />
              <span>3W ACOUSTIC SPEAKER</span>
            </div>
            <p className="text-[0.6rem] text-amber-200/70">
              DFPlayer Mini · Voice Synthesis
            </p>
          </div>
        </div>

        {/* Animated Soundwave Equalizer */}
        <div className="flex items-center gap-1 pr-2">
          {isSpeaking && !muted ? (
            <div className="flex items-end gap-1 h-6">
              <span className="w-1 bg-amber-400 rounded-full wave-bar" />
              <span className="w-1 bg-amber-400 rounded-full wave-bar" />
              <span className="w-1 bg-amber-400 rounded-full wave-bar" />
              <span className="w-1 bg-amber-400 rounded-full wave-bar" />
              <span className="w-1 bg-amber-400 rounded-full wave-bar" />
            </div>
          ) : (
            <span className="text-[0.6rem] font-mono text-amber-200/50">
              {muted ? "MUTED" : "IDLE"}
            </span>
          )}
        </div>
      </div>

      {/* Internal Hardware Modal */}
      <HardwareInternalsModal
        isOpen={internalsOpen}
        onClose={() => setInternalsOpen(false)}
      />
    </section>
  );
}
