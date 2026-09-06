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
  SNAKES,
  STORY_CARDS,
  momentFor,
  type StoryId,
} from "@/lib/sparsh-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sparsh Khel — Tactile Story Board Game" },
      {
        name: "description",
        content:
          "Play Sparsh Khel: an accessible tactile snakes-and-ladders board with spoken Ramayana story moments, embossed ladders and a physical-style control unit.",
      },
      { property: "og:title", content: "Sparsh Khel — Tactile Story Board Game" },
      {
        property: "og:description",
        content:
          "An accessible board-game simulation with spoken story narration, embossed ladders and a tactile control unit.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SparshKhel,
});

const START_POSITIONS = [1, 1, 1, 1];

function SparshKhel() {
  const [playerCount, setPlayerCount] = useState(2);
  const [positions, setPositions] = useState<number[]>([...START_POSITIONS]);
  const [activePlayer, setActivePlayer] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(new Set([1]));
  const [dice, setDice] = useState<number | null>(null);
  const [rolling, setRolling] = useState(false);
  const [narration, setNarration] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [storyId, setStoryId] = useState<StoryId | null>(null);
  const [cardsOpen, setCardsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [prompt, setPrompt] = useState(false);
  const [won, setWon] = useState<number | null>(null);
  const [factIndex, setFactIndex] = useState(0);

  // Accessibility settings
  const [speechOn, setSpeechOn] = useState(true);
  const [muted, setMuted] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  const [volume, setVolume] = useState(0.9);

  const lastNarrationRef = useRef("");

  useEffect(() => {
    document.documentElement.style.setProperty("--ui-scale", String(fontScale));
  }, [fontScale]);

  const speak = useCallback(
    (text: string) => {
      lastNarrationRef.current = text;
      if (!speechOn || muted || typeof window === "undefined" || !window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.volume = volume;
      utter.rate = 0.95;
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

  // Prompt for a card, then default to Ramayana.
  useEffect(() => {
    if (storyId) {
      setPrompt(false);
      return;
    }
    const t1 = setTimeout(() => setPrompt(true), 3000);
    const t2 = setTimeout(() => {
      setStoryId("ramayana");
      setPrompt(false);
      toast("No card tapped — starting the Ramayana story");
      narrate("No card was tapped, so we begin with the Ramayana.");
    }, 12000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [storyId, narrate]);

  const pickCard = useCallback(
    (index: number) => {
      const card = STORY_CARDS[index];
      if (!card) return;
      setHighlightIndex(index);
      if (!card.available) {
        toast(`${card.label} — coming soon`);
        setAnnouncement(`${card.label} is coming soon.`);
        return;
      }
      setStoryId(card.id);
      setCardsOpen(false);
      setPrompt(false);
      toast.success(`${card.label} card loaded`);
      narrate(`${card.label} selected. Press the big roll button to begin.`);
    },
    [narrate],
  );

  const finishTurn = useCallback(
    (player: number, landed: number) => {
      const moment = momentFor(landed);
      const alreadyVisited = visited.has(landed);
      let final = landed;

      if (moment) {
        final = moment.kind === "snake" ? SNAKES[landed]! : LADDERS[landed]!;
        narrate(`${moment.title}. ${moment.text}`);
        toast(moment.kind === "ladder" ? `✨ ${moment.title}` : `🐍 ${moment.title}`, {
          description: moment.text,
        });
      } else if (alreadyVisited) {
        const fact = DISCOVERY_FACTS[factIndex % DISCOVERY_FACTS.length]!;
        setFactIndex((f) => f + 1);
        narrate(fact);
        toast("Discovery Fact", { description: fact });
      } else {
        narrate(`${PLAYER_NAMES[player]} is on square ${landed}.`);
      }

      setVisited((v) => new Set(v).add(landed).add(final));
      setPositions((prev) => {
        const next = [...prev];
        next[player] = final;
        return next;
      });

      if (final === 100) {
        setWon(player);
        narrate(`${PLAYER_NAMES[player]} has reached one hundred. Well played!`);
        toast.success(`🎉 ${PLAYER_NAMES[player]} wins!`);
        return;
      }
      setActivePlayer((a) => (a + 1) % playerCount);
    },
    [visited, factIndex, narrate, playerCount],
  );

  const roll = useCallback(() => {
    if (rolling || won !== null) return;
    if (!storyId) {
      setPrompt(true);
      toast("Tap a story card first");
    }
    setRolling(true);
    const value = 1 + Math.floor(Math.random() * 6);
    const player = activePlayer;

    setTimeout(() => {
      setRolling(false);
      setDice(value);
      const start = positions[player] ?? 1;
      const target = Math.min(100, start + value);
      setAnnouncement(`${PLAYER_NAMES[player]} rolled ${value}. Moving to square ${target}.`);

      let step = start;
      const stepper = setInterval(() => {
        step += 1;
        setPositions((prev) => {
          const next = [...prev];
          next[player] = step;
          return next;
        });
        if (step >= target) {
          clearInterval(stepper);
          setTimeout(() => finishTurn(player, target), 250);
        }
      }, 220);
    }, 700);
  }, [rolling, won, storyId, activePlayer, positions, finishTurn]);

  const reset = () => {
    window.speechSynthesis?.cancel();
    setPositions([...START_POSITIONS]);
    setActivePlayer(0);
    setVisited(new Set([1]));
    setDice(null);
    setWon(null);
    setNarration("");
    setAnnouncement("New game started.");
  };

  const currentSquare = positions[activePlayer] ?? 1;

  const confetti = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        color: ["var(--gold)", "var(--saffron)", "var(--terracotta)", "var(--player-2)"][i % 4],
      })),
    [],
  );

  return (
    <div className={highContrast ? "hc" : undefined}>
      <main className="min-h-dvh px-3 py-4 sm:px-6">
        <Toaster position="top-center" />

        <div aria-live="polite" className="sr-only">
          {announcement}
        </div>

        <header className="mx-auto mb-4 flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <h1 className="font-display text-2xl font-bold tracking-wide text-[color:var(--maroon)]">
            SPARSH KHEL
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <label className="flex min-h-12 items-center gap-2">
              Players
              <select
                value={playerCount}
                onChange={(e) => {
                  setPlayerCount(Number(e.target.value));
                  setActivePlayer(0);
                }}
                className="min-h-12 rounded-lg border border-border bg-card px-2"
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex min-h-12 items-center gap-2">
              <input
                type="checkbox"
                className="size-5"
                checked={speechOn}
                onChange={(e) => setSpeechOn(e.target.checked)}
              />
              Speech
            </label>
            <label className="flex min-h-12 items-center gap-2">
              <input
                type="checkbox"
                className="size-5"
                checked={highContrast}
                onChange={(e) => setHighContrast(e.target.checked)}
              />
              High contrast
            </label>
            <label className="flex min-h-12 items-center gap-2">
              Text size
              <input
                type="range"
                min={0.85}
                max={1.5}
                step={0.05}
                value={fontScale}
                onChange={(e) => setFontScale(Number(e.target.value))}
              />
            </label>
            <label className="flex min-h-12 items-center gap-2">
              Volume
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
              />
            </label>
          </div>
        </header>

        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[65fr_35fr]">
          <GameBoard
            positions={positions}
            playerCount={playerCount}
            activePlayer={activePlayer}
            visited={visited}
          />

          <div className="flex flex-col gap-4">
            <ControlUnit
              storyId={storyId}
              cardsOpen={cardsOpen}
              highlightIndex={highlightIndex}
              onToggleCards={() => setCardsOpen((o) => !o)}
              onPickCard={pickCard}
              narration={narration}
              muted={muted}
              onToggleMute={() => {
                setMuted((m) => {
                  if (!m) window.speechSynthesis?.cancel();
                  return !m;
                });
              }}
              onRoll={roll}
              rolling={rolling}
              canRoll={won === null}
              dice={dice}
              square={currentSquare}
              prompt={prompt && !storyId}
              onRepeat={() => speak(lastNarrationRef.current || "Nothing has been narrated yet.")}
              onPrevCard={() => {
                setCardsOpen(true);
                setHighlightIndex((i) => (i + STORY_CARDS.length - 1) % STORY_CARDS.length);
              }}
              onConfirmCard={() => pickCard(highlightIndex)}
            />

            {won !== null && (
              <div className="relative overflow-hidden rounded-2xl border-2 border-gold bg-card p-4 text-center">
                <p className="font-display text-lg font-bold">{PLAYER_NAMES[won]} wins! 🎉</p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-3 min-h-12 rounded-xl bg-primary px-6 font-semibold text-primary-foreground tactile tactile-press"
                >
                  Play Again
                </button>
                <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                  {confetti.map((c, i) => (
                    <span
                      key={i}
                      className="absolute top-0 size-2 rounded-[2px] confetti-piece"
                      style={{
                        left: `${c.left}%`,
                        backgroundColor: c.color,
                        animationDelay: `${c.delay}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
