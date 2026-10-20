import { EventEmitter } from "node:events";
import { TimerConfig, TimerState, TimerStatus } from "./timer.type.js";
import { defaultTimer } from "./timer.config.js";
import notifier from "node-notifier";

export class TimerEngine extends EventEmitter {
  private config: TimerConfig;
  private state: TimerState;
  private status: TimerStatus;
  private deadline = 0
  private interval: ReturnType<typeof setInterval> | undefined

  constructor(config: TimerConfig = defaultTimer) {
    super();

    this.validateConfig(config);
    this.config = { ...config }
  }

  //desktop notification with node-notifier
  private notify(title: string, message: string): void {
    notifier.notify({
      title,
      message,
      sound: true,
      wait: false,
    });
  }

  // get's the title of the current phase for notification
  private getPhaseTitle(): string {
    switch (this.state.phase) {
      case 'work':
        return 'Work Session';
      case 'short-break':
        return 'Short Break';
      case 'long-break':
        return 'Long Break';
    }
  }

  // get's the message of the current status for notification
  private getPhaseMessage(): string {
    switch (this.status) {
      case 'running':
        return 'Time to focus on your work!';
      case 'paused':
        return 'timer is paused.';
      case 'completed':
        return 'Take a break and recharge.';
      case 'cancelled':
        return 'Timer has been cancelled.';
      default:
        return '';
    }
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

  // clears the interval if it exists
  private clearInterval(): void {
    if (this.interval !== undefined) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }
} 