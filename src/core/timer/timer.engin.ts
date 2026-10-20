import { EventEmitter } from "node:events";
import { TimerConfig, TimerState } from "./timer.type.js";
import { defaultTimer } from "./timer.config.js";

export class TimerEngine extends EventEmitter {
  private config: TimerConfig;
  private state: TimerState;
  private deadline = 0

  constructor(config: TimerConfig = defaultTimer) {
    super();

    this.validateConfig(config);
    this.config = { ...config }
  }
  // convert minutes to milliseconds
  private toMilliseconds(min: number): number {
    return min * 60 * 1000;
  }

  //for validating user input
  private validateConfig(config: TimerConfig): void {
    const values = [
      config.workMin,
      config.shortBreakMin,
      config.longBreakMin,
      config.session,
    ];

    // Check if any value is less than or equal to 0
    if (values.some((value) => value <= 0)) {
      throw new Error("All timer values must be greater than 0.");
    }

    // Check if any value is negative
    if (values.some((value) => value < 0)) {
      throw new Error("All timer values must be positive numbers.");
    }
  }

  // get's the current state of the timer and remaining time in milliseconds
  getState(): TimerState {
    return {
      ...this.state,
      remainingMs: this.getRemainingTime(),
    };
  }

  // get's remaining time in milliseconds
  getRemainingTime(): number {
    if (this.state.status !== 'running') {
      return this.state.remainingMs
    }

    return Math.max(0, this.deadline - Date.now())
  }

  // state changer
  private UpdateState(): void {
    this.emit('state-change', this.getState())
  }
} 