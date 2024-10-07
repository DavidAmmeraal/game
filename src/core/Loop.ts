type LoopCycle = {
  frameCount: number;
  startTime: number;
  sinceStart: number;
};

type LoopCycles = [new: LoopCycle, old: LoopCycle];

const LoopCyclesKeys = {
  NEW: 0,
  OLD: 1,
} as const;

type LoopCyclesKey = (typeof LoopCyclesKeys)[keyof typeof LoopCyclesKeys];

type LoopState = Readonly<{
  fps: number;
}>;

export class Loop {
  private fpsInterval: number;
  private before: number;
  private resetInterval: number;
  private resetState: LoopCyclesKey = LoopCyclesKeys.NEW;
  private cycles: LoopCycles;
  private current: number | undefined;
  private callback?: (frame: number) => void;

  private _fps: number = 0;

  constructor(private targetFps: number) {
    this.fpsInterval = 1000 / targetFps;
    this.before = window.performance.now();
    this.cycles = [
      {
        frameCount: 0, // Frames since the start of the cycle
        startTime: this.before, // The starting timestamp
        sinceStart: 0,
      },
      {
        frameCount: 0,
        startTime: this.before,
        sinceStart: 0,
      },
    ];
    this.resetInterval = 5;
    this.resetState = 0;
    this.start.bind(this);
    this.stop.bind(this);
    this.next.bind(this);
  }

  start() {
    this.next(0);
  }

  stop() {
    if (this.current) window.cancelAnimationFrame(this.current);
  }

  setCallback(callback: (frame: number) => void) {
    this.callback = callback;
  }

  get state(): LoopState {
    return {
      fps: this._fps,
    };
  }

  private next(now: number) {
    this.current = window.requestAnimationFrame(this.next.bind(this));

    // How long ago since last loop?
    const elapsed = now - this.before;
    let activeCycle: LoopCycle;
    let targetResetInterval: number;

    if (elapsed > this.fpsInterval) {
      this.before = now - (elapsed % this.fpsInterval);

      // Increment the vals for both the active and the alternate FPS calculations
      for (const calc of this.cycles) {
        calc.frameCount++;
        calc.sinceStart = now - calc.startTime;
      }

      // Choose the correct FPS calculation, then update the exposed fps value
      activeCycle = this.cycles[this.resetState];
      this._fps =
        Math.round(
          (1000 / (activeCycle.sinceStart / activeCycle.frameCount)) * 100
        ) / 100;

      // If our frame counts are equal....
      targetResetInterval =
        this.cycles[0].frameCount === this.cycles[1].frameCount
          ? this.resetInterval * this.targetFps // Wait our interval
          : this.resetInterval * 2 * this.targetFps; // Wait double our interval

      // If the active calculation goes over our specified interval,
      // reset it to 0 and flag our alternate calculation to be active
      // for the next series of animations.
      if (activeCycle.frameCount > targetResetInterval) {
        this.cycles[this.resetState] = {
          frameCount: 0,
          startTime: now,
          sinceStart: 0,
        };

        this.resetState =
          this.resetState === LoopCyclesKeys.NEW
            ? LoopCyclesKeys.OLD
            : LoopCyclesKeys.NEW;
      }

      this.callback?.(now);
    }
  }
}
