export type Cell = number;

export const SNAKES: Record<Cell, Cell> = {
  17: 4,
  34: 12,
  62: 41,
  87: 68,
  95: 76,
};

export const LADDERS: Record<Cell, Cell> = {
  3: 22,
  8: 26,
  28: 47,
  50: 71,
  66: 85,
  80: 99,
};

export type Moment = {
  square: Cell;
  kind: "snake" | "ladder";
  title: string;
  text: string;
};

/** Ramayana theme — fully seeded narration. */
export const RAMAYANA_MOMENTS: Moment[] = [
  {
    square: 3,
    kind: "ladder",
    title: "Devotion — Hanuman's leap",
    text: "Hanuman remembers his own strength and leaps across the ocean. When you believe in what you can do, the distance grows smaller. Climb up to twenty-two.",
  },
  {
    square: 8,
    kind: "ladder",
    title: "Friendship — Sugriva's promise",
    text: "Rama and Sugriva clasp hands and promise to help each other. A friend shared is a burden halved. Climb up to twenty-six.",
  },
  {
    square: 17,
    kind: "snake",
    title: "A gentle lesson — the golden deer",
    text: "Sita is charmed by a golden deer that is not what it seems. Beautiful things can still be untrue, and it is alright to be fooled once. Slide gently down to four and begin again.",
  },
  {
    square: 28,
    kind: "ladder",
    title: "Courage — Jatayu takes flight",
    text: "The old eagle Jatayu fights to protect Sita, though he knows he is small against the storm. Courage is doing the right thing at your own size. Climb up to forty-seven.",
  },
  {
    square: 34,
    kind: "snake",
    title: "A gentle lesson — Kaikeyi's two boons",
    text: "Kaikeyi asks for two wishes spoken in anger and regrets them the same night. Words said in a hurry take a long time to walk back. Slide gently down to twelve.",
  },
  {
    square: 50,
    kind: "ladder",
    title: "Perseverance — the bridge of stones",
    text: "The vanaras carry stone after stone, and even a squirrel adds grains of sand. Every small effort becomes part of the bridge. Climb up to seventy-one.",
  },
  {
    square: 62,
    kind: "snake",
    title: "A gentle lesson — crossing the line",
    text: "Sita steps past the Lakshmana rekha, the safe line drawn for her. Boundaries are kindness, not punishment. Slide gently down to forty-one and try once more.",
  },
  {
    square: 66,
    kind: "ladder",
    title: "Kindness — Shabari's berries",
    text: "Shabari offers Rama the sweetest berries she has saved for years, and he eats them gladly. A gift is measured by the love inside it. Climb up to eighty-five.",
  },
  {
    square: 80,
    kind: "ladder",
    title: "Loyalty — Lakshmana in the forest",
    text: "Lakshmana leaves a palace to walk beside his brother through fourteen forest years. Standing beside someone is its own kind of strength. Climb up to ninety-nine.",
  },
  {
    square: 87,
    kind: "snake",
    title: "A gentle lesson — Ravana's pride",
    text: "Ravana was learned and mighty, yet he would not listen to anyone. Pride closes the ears first. Slide gently down to sixty-eight.",
  },
  {
    square: 95,
    kind: "snake",
    title: "A gentle lesson — Kumbhakarna's long sleep",
    text: "Kumbhakarna sleeps through the moments that needed him most. Rest is good, but wake up for the things that matter. Slide gently down to seventy-six.",
  },
];

export const DISCOVERY_FACTS: string[] = [
  "Discovery Fact: The Ramayana is told in more than three hundred versions across Asia, from Thailand's Ramakien to Indonesia's Kakawin Ramayana.",
  "Discovery Fact: Snakes and Ladders began in India as Moksha Patam, a game where ladders were virtues and snakes were vices.",
  "Discovery Fact: The squirrel who carried sand for Rama's bridge is said to have earned the three stripes on its back from his fingers.",
  "Discovery Fact: Hanuman is honoured as a patron of learning and of wrestlers, celebrated for humility as much as for strength.",
];

export const STORY_CARDS = [
  { id: "ramayana", label: "Ramayana", available: true },
  { id: "mahabharata", label: "Mahabharata", available: false },
  { id: "panchatantra", label: "Panchatantra", available: false },
  { id: "freedom", label: "Freedom Fighters", available: false },
] as const;

export type StoryId = (typeof STORY_CARDS)[number]["id"];

export const momentFor = (square: Cell): Moment | undefined =>
  RAMAYANA_MOMENTS.find((m) => m.square === square);

export const PLAYER_COLORS = [
  "var(--player-1)",
  "var(--player-2)",
  "var(--player-3)",
  "var(--player-4)",
];

export const PLAYER_NAMES = ["Player 1", "Player 2", "Player 3", "Player 4"];

/** Row/col (0-indexed from top-left) for a square in boustrophedon order. */
export function cellPosition(square: Cell) {
  const index = square - 1;
  const rowFromBottom = Math.floor(index / 10);
  const row = 9 - rowFromBottom;
  const withinRow = index % 10;
  const col = rowFromBottom % 2 === 0 ? withinRow : 9 - withinRow;
  return { row, col };
}
