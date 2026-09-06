# Sparsh Khel Board

Build ONLY an interactive board-game simulation of SPARSH KHEL — no landing page, 

no marketing copy, no separate screens. The whole app is one persistent 

screen: a game board next to a control unit, modeled directly on a physical CAD 

prototype.

LAYOUT — mirror the physical unit

Two panels side by side (stack vertically on mobile):

LEFT — Board panel (~65% width)

- 10x10 grid, numbered 1-100 in standard boustrophedon Snakes & Ladders order.

- Render ladders as a raised "3D relief" — two parallel rails with rungs, using 

  gradients/shadows for an embossed, tactile look (the real board has these 

  physically embossed for touch). Render snakes as smooth curved tubes the same 

  way.

- 4 small player-token slots near square 1, matching 4 peg-holes on the physical 

  board.

- ADD (missing from the CAD, but needed to function): a small colored indicator 

  light above each of the 4 token slots that lights up to show whose turn it is.

RIGHT — Control unit panel (~35% width), top to bottom exactly mirroring the CAD:

1. Circular RFID "tap" zone at the top. Tapping it cycles/opens a compact 

   horizontal selector of 4 story cards (Ramayana, Mahabharata, Panchatantra, 

   Freedom Fighters) docked right there — not a separate page.

2. "SPEAKER" panel — rectangular readout showing the current narration text as 

   it plays (use the Web Speech API for text-to-speech), with a mute icon.

3. Large circular ROLL button (the biggest control, matching the CAD) — press to 

   roll the dice, animate the result.

4. ADD (missing from the CAD, but the spec calls for an "LED display — dice 

   number + text" and the control unit has no screen for it): a small OLED-style 

   readout near the roll button showing the current dice number and current 

   square number.

5. "TAP CARD HERE" panel — rectangular zone with instruction text that gently 

   pulses/glows until a story card has been selected.

6. U / D / L / R button row at the bottom — wire these as an accessible control 

   cluster (their function isn't obvious from the CAD alone, so this is a 

   proposal — flag it for the team to confirm): 

     U = repeat last narration · D = toggle volume/mute · 

     L = previous story card · R = confirm/select story card.

   Label each with a small icon + text since shape alone won't convey function.

GAMEPLAY

- 1-4 local players, turn-based, one device passed around.

- If no story card is selected within a few seconds, the "TAP CARD HERE" zone 

  pulses to prompt a tap; otherwise default to Ramayana.

- Roll button moves the active player's token with a step-by-step animation 

  across the board.

- Landing on a snake or ladder: narration text appears in the SPEAKER panel + is 

  spoken aloud + a brief toast shows the story moment (snake = a short setback 

  with a gentle lesson, never punitive; ladder = a value being celebrated — 

  courage, kindness, perseverance).

- Landing on an already-visited square shows a short "Discovery Fact" instead of 

  repeating the chapter.

- Reaching square 100 triggers an in-place celebration (confetti/toast) and a 

  "Play Again" button that resets the board — still the same screen, no win page.

ACCESSIBILITY (core to the product, not optional)

- Text-to-speech toggle, high-contrast toggle, font-size slider, volume slider.

- Every control keyboard-operable with visible focus states.

- Dice rolls, square numbers, and narration all announced via aria-live regions, 

  not just shown visually.

- No tap target smaller than ~48px.

CONTENT TO SEED

Fully write out the Ramayana theme: narration for at least 8-10 key squares, 

including 3-4 snake "lesson" moments, 2-3 ladder "value" moments, and 2 Discovery 

Facts. The other 3 story cards can show a "Coming soon" toast if tapped.

STYLE

Warm, culturally-rooted palette (terracotta/saffron, deep maroon, gold, cream). 

Board should feel like real game-board material (subtle wood/paper texture); 

control-unit buttons should look tactile — rounded, beveled, soft shadows — 

echoing the CAD's circular buttons rather than flat generic UI buttons.

TECH

React + TypeScript, Web Speech API for narration, all state client-side, no 

backend needed for this demo.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/906f6d92-4f80-4045-ac23-54ef536327b8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
