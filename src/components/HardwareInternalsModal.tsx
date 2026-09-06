import { Cpu, Radio, Disc3, Tv, Volume2, Gamepad2, BatteryCharging, Lightbulb, X } from "lucide-react";
import { HARDWARE_INTERNALS } from "@/lib/sparsh-data";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function HardwareInternalsModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Hardware Architecture & Electronics Internals"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-md"
    >
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border-2 border-amber-500/60 bg-[#0d131f] p-5 text-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
              <Cpu className="size-6" />
            </div>
            <div>
              <h2 className="font-mono text-lg font-bold tracking-wider text-amber-400">
                SPARSH KHEL · HARDWARE EMBEDDED ARCHITECTURE
              </h2>
              <p className="text-xs text-slate-400">
                Digital Twin Electronics Blueprint — ESP32 Dual-Core Master Controller &amp; Peripheral Buses
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-9 items-center justify-center rounded-full bg-slate-800 text-slate-300 transition-colors hover:bg-slate-700 hover:text-white"
            aria-label="Close internals view"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Central Architecture Schematic */}
        <div className="my-5 rounded-2xl border border-cyan-500/30 bg-[#070b12] p-4">
          <div className="text-center font-mono text-xs font-semibold tracking-widest text-cyan-400">
            SYSTEM INTERFACE TOPOLOGY
          </div>

          {/* Central ESP32 Hub */}
          <div className="my-4 flex flex-col items-center">
            <div className="flex w-72 flex-col items-center rounded-2xl border-2 border-cyan-400 bg-cyan-950/60 p-3 text-center shadow-[0_0_20px_rgba(6,182,212,0.3)]">
              <span className="font-mono text-xs font-bold tracking-widest text-cyan-300">
                {HARDWARE_INTERNALS.mcu.name}
              </span>
              <span className="text-[0.65rem] text-cyan-100">
                Dual 240MHz Xtensa LX6 · FreeRTOS
              </span>
              <span className="mt-1 rounded bg-cyan-800/60 px-2 py-0.5 text-[0.6rem] font-mono text-cyan-200">
                Master Logic &amp; Bus Sync
              </span>
            </div>
          </div>

          {/* Bus Connectors Grid */}
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {/* SPI Bus Group */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Disc3 className="size-4" />
                <span className="font-mono text-xs font-bold">SPI BUS (Dual TFT + RFID)</span>
              </div>
              <p className="mt-1 text-[0.65rem] text-slate-400">
                Shared HSPI/VSPI bus with separate Chip Select lines:
              </p>
              <ul className="mt-2 space-y-1 text-xs text-slate-300">
                <li className="flex items-start gap-1">
                  <span className="text-amber-400 font-bold">•</span>
                  <span><strong>{HARDWARE_INTERNALS.diceDisplay.name}:</strong> 240x240 Round TFT (CS15, DC2)</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-amber-400 font-bold">•</span>
                  <span><strong>{HARDWARE_INTERNALS.storyDisplay.name}:</strong> 240x320 Story TFT (CS5, DC4)</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-amber-400 font-bold">•</span>
                  <span><strong>{HARDWARE_INTERNALS.rfid.name}:</strong> 13.56MHz SPI Tag Reader (CS21)</span>
                </li>
              </ul>
            </div>

            {/* Audio Bus Group */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <div className="flex items-center gap-2 text-emerald-400">
                <Volume2 className="size-4" />
                <span className="font-mono text-xs font-bold">UART &amp; ACOUSTIC AUDIO</span>
              </div>
              <p className="mt-1 text-[0.65rem] text-slate-400">
                Hardware MP3 decoding with FAT32 flash storage:
              </p>
              <ul className="mt-2 space-y-1 text-xs text-slate-300">
                <li className="flex items-start gap-1">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>{HARDWARE_INTERNALS.audio.name}:</strong> Serial UART (TX17, RX16)</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>{HARDWARE_INTERNALS.speaker.name}:</strong> 3W 4Ω Speaker Driver</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>Voice narration in English + Indian Regional Languages</span>
                </li>
              </ul>
            </div>

            {/* GPIO & Controls Group */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
              <div className="flex items-center gap-2 text-rose-400">
                <Gamepad2 className="size-4" />
                <span className="font-mono text-xs font-bold">TACTILE I/O &amp; TURN LEDS</span>
              </div>
              <p className="mt-1 text-[0.65rem] text-slate-400">
                Interrupt-driven debounced buttons and status indicators:
              </p>
              <ul className="mt-2 space-y-1 text-xs text-slate-300">
                <li className="flex items-start gap-1">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>Arcade Roll Button:</strong> Heavy-duty tactile push (GPIO 34)</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>4x Nav Cluster:</strong> UP, DOWN, LEFT, RIGHT buttons</span>
                </li>
                <li className="flex items-start gap-1">
                  <span className="text-rose-400 font-bold">•</span>
                  <span><strong>4x Player LEDs:</strong> Active turn glow PWM (GPIOs 12, 13, 14, 27)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Detailed Hardware Spec Cards */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
            <Radio className="size-4 text-amber-400" />
            <div className="mt-1 font-mono text-xs font-bold text-amber-300">RC522 RFID</div>
            <p className="mt-1 text-[0.65rem] text-slate-400 leading-relaxed">
              Detects physical story cards (Ramayana, Mahabharata, etc.) embedded with passive high-frequency RFID tags.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
            <Tv className="size-4 text-cyan-400" />
            <div className="mt-1 font-mono text-xs font-bold text-cyan-300">Dual SPI TFTs</div>
            <p className="mt-1 text-[0.65rem] text-slate-400 leading-relaxed">
              Independent framebuffers rendered asynchronously. GC9A01 handles dice graphics while ILI9341 presents story scenes.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
            <Lightbulb className="size-4 text-yellow-400" />
            <div className="mt-1 font-mono text-xs font-bold text-yellow-300">Turn Indicator LEDs</div>
            <p className="mt-1 text-[0.65rem] text-slate-400 leading-relaxed">
              Recessed 5mm diffuse dome LEDs above peg slots indicate active turn for low-vision and deaf accessibility.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-3">
            <BatteryCharging className="size-4 text-emerald-400" />
            <div className="mt-1 font-mono text-xs font-bold text-emerald-300">Power &amp; Battery</div>
            <p className="mt-1 text-[0.65rem] text-slate-400 leading-relaxed">
              3.7V 2600mAh 18650 Li-ion battery with TP4056 USB-C charging module, auto shutoff, and low-dropout 3.3V LDO.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3 text-[0.7rem] text-slate-400">
          <span>SPARSH KHEL IoT Prototype Specification · Hackathon Ready</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-amber-600 px-4 py-1.5 font-bold text-white transition-colors hover:bg-amber-500"
          >
            Back to Game Board
          </button>
        </div>
      </div>
    </div>
  );
}
