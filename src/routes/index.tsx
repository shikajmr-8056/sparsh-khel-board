import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { GameBoard } from "@/components/GameBoard";
import { ControlUnit } from "@/components/ControlUnit";
import {
  DISCOVERY_FACTS,
  LADDERS,
  PLAYER_NAMES,
  PLAYER_COLORS,
  SNAKES,
  STORY_CARDS,
  RAMAYANA_MOMENTS,
  momentFor,
  type StoryId,
  type StoryScene,
} from "@/lib/sparsh-data";
import { Volume2, VolumeX, Eye, Sparkles, RefreshCw, Users, Type } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SPARSH KHEL — Physical Inclusive Storytelling Board Game Prototype" },
      {
        name: "description",
        content:
          "Digital twin simulation of the SPARSH KHEL physical prototype: 10x10 tactile board with embossed Braille dots, dual TFT displays, ESP32 electronics module, and multisensory Ramayana storytelling.",
      },
      { property: "og:title", content: "SPARSH KHEL — Physical Inclusive Board Game" },
      {
        property: "og:description",
        content:
          "Realistic digital prototype of SPARSH KHEL with raised tactile Braille, GC9A01 dice TFT, ILI9341 story TFT, and RFID storytelling.",
      },
    ],
  }),
  component: SparshKhelApp,
});

const START_POSITIONS = [1, 1, 1, 1];

function SparshKhelApp() {
  // Gameplay State
  const [playerCount, setPlayerCount] = useState(2);
  const [positions, setPositions] = useState<number[]>([...START_POSITIONS]);
  const [activePlayer, setActivePlayer] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(new Set([1]));
  const [dice, setDice] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const [won, setWon] = useState<number | null>(null);
  const [factIndex, setFactIndex] = useState(0);

  // Story & Display State
  const [storyId, setStoryId] = useState<StoryId | null>("ramayana");
  const [currentChapter, setCurrentChapter] = useState("PROLOGUE");
  const [storyTitle, setStoryTitle] = useState("Sacred Journey of Ayodhya");
  const [narration, setNarration] = useState(
    "Welcome to SPARSH KHEL. Tap the RFID Story Card zone or press ROLL DICE to start your journey.",
  );
  const [valueOrLesson, setValueOrLesson] = useState("Virtue: Truth & Righteousness");
  const [scene, setScene] = useState<StoryScene>({ svgType: "default", primaryColor: "#f59e0b" });
  const [cardPrompt, setCardPrompt] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  // Accessibility Settings
  const [speechOn, setSpeechOn] = useState(true);
  const [muted, setMuted] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [volume, setVolume] = useState(0.9);

  const lastNarrationRef = useRef("");

  useEffect(() => {
    document.documentElement.style.setProperty("--ui-scale", String(fontScale));
  }, [fontScale]);

  // Web Speech API Synthesis
  const speak = useCallback(
    (text: string) => {
      lastNarrationRef.current = text;
      if (!speechOn || muted || typeof window === "undefined" || !window.speechSynthesis) return;

      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.volume = volume;
      utter.rate = 0.92; // Clear accessible pace
      utter.onstart = () => setIsSpeaking(true);
      utter.onend = () => setIsSpeaking(false);
      utter.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utter);
    },
    [speechOn, muted, volume],
  );

  const narrate = useCallback(
    (text: string) => {
      setNarration(text);
      setAnnouncement(text);
      speak(text);
    },
    [speak],
  );

  // Pick RFID Story Card
  const pickCard = useCallback(
    (id: StoryId) => {
      const card = STORY_CARDS.find((c) => c.id === id);
      if (!card) return;

      if (!card.available) {
        toast(`${card.label} Card — Coming Soon!`, {
          description: "RFID pack is currently in production.",
        });
        setAnnouncement(`${card.label} is coming soon.`);
        return;
      }

      setStoryId(id);
      setCardPrompt(false);
      toast.success(`${card.label} RFID Card Docked`, {
        description: card.subtitle,
      });
      narrate(`${card.label} card loaded into RFID reader. Press the large red button to roll the dice.`);
    },
    [narrate],
  );

  // Turn Finish: Check Snakes, Ladders, and 100-Square Storyline Moments
  const finishTurn = useCallback(
    (player: number, landed: number) => {
      const moment = momentFor(landed);
      let final = landed;

      if (landed in LADDERS) {
        final = LADDERS[landed]!;
        const destMoment = momentFor(final);
        setCurrentChapter(moment?.chapter ?? "LADDER OF VIRTUE");
        setStoryTitle(moment?.title ?? "Virtue Elevated");
        setValueOrLesson(moment?.valueOrLesson ?? "Virtue: Rising to Greater Heights");
        setScene(moment?.scene ?? { svgType: "default", primaryColor: "#10b981" });
        narrate(`${moment?.title ?? "Ladder"}. ${moment?.text ?? ""}`);
        toast(`🪜 ${moment?.title ?? "Climbing Ladder"}`, {
          description: `Climbed from square ${landed} up to ${final}! ${destMoment ? `Arrived at: ${destMoment.title}` : ""}`,
        });
      } else if (landed in SNAKES) {
        final = SNAKES[landed]!;
        const destMoment = momentFor(final);
        setCurrentChapter(moment?.chapter ?? "GENTLE LESSON");
        setStoryTitle(moment?.title ?? "Gentle Reflection");
        setValueOrLesson(moment?.valueOrLesson ?? "Lesson: Humility and Growth");
        setScene(moment?.scene ?? { svgType: "default", primaryColor: "#ef4444" });
        narrate(`${moment?.title ?? "Gentle lesson"}. ${moment?.text ?? ""}`);
        toast(`🐍 ${moment?.title ?? "Gentle Lesson"}`, {
          description: `Slid gently down from square ${landed} to ${final}. ${destMoment ? `Reflecting on: ${destMoment.title}` : ""}`,
        });
      } else if (moment) {
        setCurrentChapter(moment.chapter);
        setStoryTitle(moment.title);
        setValueOrLesson(moment.valueOrLesson);
        setScene(moment.scene);
        narrate(`Square ${landed}: ${moment.title}. ${moment.text}`);
        toast(`📜 ${moment.title}`, {
          description: moment.text,
        });
      }

      setVisited((v) => new Set(v).add(landed).add(final));
      setPositions((prev) => {
        const next = [...prev];
        next[player] = final;
        return next;
      });

      // Victory Condition: Reaching Square 100
      if (final >= 100) {
        setWon(player);
        const victoryMoment = momentFor(100);
        if (victoryMoment) {
          setCurrentChapter(victoryMoment.chapter);
          setStoryTitle(victoryMoment.title);
          setValueOrLesson(victoryMoment.valueOrLesson);
          setScene(victoryMoment.scene);
        }
        narrate(`${PLAYER_NAMES[player] ?? "Player"} has reached square one hundred! Ramrajya coronation in Ayodhya!`);
        toast.success(`🎉 ${PLAYER_NAMES[player] ?? "Player"} Wins!`);
        return;
      }

      // Next Player's turn
      setActivePlayer((a) => (a + 1) % playerCount);
    },
    [visited, narrate, playerCount],
  );

  // Roll Dice Action with real-time story preview during movement
  const rollDice = useCallback(() => {
    if (rolling || won !== null) return;

    if (!storyId) {
      setCardPrompt(true);
      toast("Please scan an RFID story card first");
      return;
    }

    setRolling(true);
    const value = 1 + Math.floor(Math.random() * 6);
    const player = activePlayer;
    const pName = PLAYER_NAMES[player] ?? `Player ${player + 1}`;

    // Simulate GC9A01 round TFT rolling animation
    setTimeout(() => {
      setRolling(false);
      setDice(value);
      const start = positions[player] ?? 1;
      const target = Math.min(100, start + value);
      setAnnouncement(`${pName} rolled ${value}. Moving to square ${target}.`);

      // Step-by-step tactile hop animation across grid updating story
      let step = start;
      const stepper = setInterval(() => {
        step += 1;
        setPositions((prev) => {
          const next = [...prev];
          next[player] = step;
          return next;
        });

        // Dynamically update story chapter and scene as token advances!
        const stepMoment = momentFor(step);
        if (stepMoment) {
          setCurrentChapter(stepMoment.chapter);
          setStoryTitle(stepMoment.title);
          setScene(stepMoment.scene);
        }

        if (step >= target) {
          clearInterval(stepper);
          setTimeout(() => finishTurn(player, target), 300);
        }
      }, 220);
    }, 750);
  }, [rolling, won, storyId, activePlayer, positions, finishTurn]);

  // Reset Game
  const resetGame = () => {
    window.speechSynthesis?.cancel();
    setPositions([...START_POSITIONS]);
    setActivePlayer(0);
    setVisited(new Set([1]));
    setDice(null);
    setWon(null);
    setCurrentChapter("PROLOGUE");
    setStoryTitle("Sacred Journey of Ayodhya");
    setValueOrLesson("Virtue: Truth & Righteousness");
    setScene({ svgType: "default", primaryColor: "#f59e0b" });
    setNarration("New game started. Welcome to SPARSH KHEL prototype.");
    setAnnouncement("Game reset. Player 1 ready to roll.");
  };

  // Inspect square when user clicks on board cell
  const handleSelectSquare = (sq: number) => {
    const moment = momentFor(sq);
    if (moment) {
      setCurrentChapter(moment.chapter);
      setStoryTitle(moment.title);
      setValueOrLesson(moment.valueOrLesson);
      setScene(moment.scene);
      narrate(`Square ${sq}: ${moment.title}. ${moment.text}`);
    } else {
      narrate(`Square ${sq}. Tactile Braille and embossed numerals present.`);
    }
  };

  // Previous Chapter Nav button
  const handlePrevChapter = () => {
    const idx = RAMAYANA_MOMENTS.findIndex((m) => m.title === storyTitle);
    const prevIdx = idx > 0 ? idx - 1 : RAMAYANA_MOMENTS.length - 1;
    const moment = RAMAYANA_MOMENTS[prevIdx];
    if (moment) {
      setCurrentChapter(moment.chapter);
      setStoryTitle(moment.title);
      setValueOrLesson(moment.valueOrLesson);
      setScene(moment.scene);
      narrate(`Previous chapter: ${moment.title}. ${moment.text}`);
    }
  };

  const currentSquare = positions[activePlayer] ?? 1;
  const progressPercent = Math.round((currentSquare / 100) * 100);

  return (
    <div className={`min-h-screen ${highContrast ? "hc" : ""}`}>
      {/* Toast Notifications */}
      <Toaster position="top-center" />

      {/* Screen Reader Live Region */}
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>

      <main className="mx-auto flex max-w-[1550px] flex-col gap-3 p-2 sm:p-4 lg:p-6">
        {/* Recessed Control Console Header */}
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-900/50 bg-[#221208]/90 px-4 py-2.5 shadow-md backdrop-blur-sm">
          {/* Logo & Prototype Branding */}
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-black font-black shadow-inner">
              <Sparkles className="size-5" />
            </div>
            <div>
              <h1 className="font-display text-lg font-black tracking-wider text-amber-200">
                SPARSH KHEL
              </h1>
              <p className="text-[0.6rem] font-mono tracking-widest text-amber-300/60">
                INCLUSIVE MULTI-SENSORY BOARD GAME · DIGITAL TWIN PROTOTYPE
              </p>
            </div>
          </div>

          {/* Quick Hardware & Accessibility Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs text-amber-200">
            {/* Player Count */}
            <div className="flex items-center gap-1.5 rounded-lg border border-amber-800/40 bg-[#160b04] px-2 py-1">
              <Users className="size-3.5 text-amber-400" />
              <label htmlFor="playerCountSelect" className="text-[0.65rem] font-medium">Players:</label>
              <select
                id="playerCountSelect"
                value={playerCount}
                onChange={(e) => {
                  setPlayerCount(Number(e.target.value));
                  setActivePlayer(0);
                }}
                className="rounded bg-amber-950 px-1.5 py-0.5 text-xs font-bold text-amber-300 focus:outline-none"
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n}P
                  </option>
                ))}
              </select>
            </div>

            {/* Speech Toggle */}
            <button
              type="button"
              onClick={() => setSpeechOn((s) => !s)}
              className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-[0.65rem] font-semibold transition-colors ${
                speechOn
                  ? "border-emerald-600/60 bg-emerald-950/40 text-emerald-300"
                  : "border-amber-900/60 bg-[#160b04] text-amber-200/60"
              }`}
              title="Toggle Web Speech TTS"
            >
              <Volume2 className="size-3" />
              <span>Voice: {speechOn ? "ON" : "OFF"}</span>
            </button>

            {/* High Contrast Mode */}
            <button
              type="button"
              onClick={() => setHighContrast((h) => !h)}
              className={`flex items-center gap-1 rounded-lg border px-2 py-1 text-[0.65rem] font-semibold transition-colors ${
                highContrast
                  ? "border-amber-400 bg-amber-500 text-black font-bold"
                  : "border-amber-900/60 bg-[#160b04] text-amber-200"
              }`}
              title="Toggle high-contrast display mode"
            >
              <Eye className="size-3" />
              <span>High Contrast</span>
            </button>

            {/* Font Sizing */}
            <div className="hidden sm:flex items-center gap-1 rounded-lg border border-amber-800/40 bg-[#160b04] px-2 py-1">
              <Type className="size-3 text-amber-400" />
              <input
                type="range"
                min="0.85"
                max="1.3"
                step="0.05"
                value={fontScale}
                onChange={(e) => setFontScale(Number(e.target.value))}
                className="w-14 accent-amber-500"
                title="Adjust text scale"
                aria-label="Text size scale"
              />
            </div>

            {/* Reset Button */}
            <button
              type="button"
              onClick={resetGame}
              className="flex items-center gap-1 rounded-lg border border-amber-800/40 bg-[#160b04] px-2.5 py-1 text-[0.65rem] font-semibold text-amber-300 transition-colors hover:bg-amber-900/50"
              title="Restart game simulation"
            >
              <RefreshCw className="size-3" />
              <span>Reset</span>
            </button>
          </div>
        </header>

        {/* UNIFIED PHYSICAL CHASSIS (Board ~65-70% on Left, Electronics ~30-35% on Right) */}
        <div className="relative grid gap-5 lg:grid-cols-[68fr_32fr] items-start">
          {/* Left Large 10x10 Tactile Game Board */}
          <div className="w-full">
            <GameBoard
              positions={positions}
              playerCount={playerCount}
              activePlayer={activePlayer}
              visited={visited}
              onSelectSquare={handleSelectSquare}
              wonPlayer={won}
              onResetGame={resetGame}
            />
          </div>

          {/* Right Electronics & Control Module */}
          <div className="w-full">
            <ControlUnit
              storyId={storyId}
              onPickCard={pickCard}
              rolling={rolling}
              dice={dice}
              canRoll={won === null}
              onRoll={rollDice}
              activePlayerName={PLAYER_NAMES[activePlayer] ?? "Player 1"}
              activePlayerColor={PLAYER_COLORS[activePlayer] ?? "#ef4444"}
              currentSquare={currentSquare}
              chapterTitle={currentChapter}
              storyTitle={storyTitle}
              narration={narration}
              valueOrLesson={valueOrLesson}
              scene={scene}
              progressPercent={progressPercent}
              isSpeaking={isSpeaking}
              muted={muted}
              onToggleMute={() => {
                setMuted((m) => {
                  if (!m) window.speechSynthesis?.cancel();
                  return !m;
                });
              }}
              onRepeatNarration={() => speak(lastNarrationRef.current || narration)}
              onPrevChapter={handlePrevChapter}
              onConfirmSelection={() => {
                if (storyId) {
                  narrate(`${storyTitle}. ${narration}`);
                }
              }}
              isCardPromptActive={cardPrompt}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
