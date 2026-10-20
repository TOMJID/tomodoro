import { EventEmitter } from "node:events";
import { TimerConfig, TimerPhase, TimerState, TimerStatus } from "./timer.type.js";
import { defaultTimer } from "./timer.config.js";
import notifier from "node-notifier";

export class TimerEngine extends EventEmitter {
  private config: TimerConfig;
  private state: TimerState;
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
    switch (this.state.status) {
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

  // clears the tick interval and sets it to undefined
  private clearTick(): void {
    this.clearInterval()
  }

  // updates the remaining time and emits a tick event every second
  private scheduleTick(): void {
    this.clearTick()

    this.interval = setInterval(() => {
      if (this.state.status !== 'running') {
        return
      }

      this.state.remainingMs = this.getRemainingTime()
      this.emit('tick', this.getState())

      if (this.state.remainingMs <= 0) {
        this.completePhase()
      }
    }, 1000)
  }

  // handles the completion of a phase 
  private completePhase(): void {
    this.clearTick()
    this.state.remainingMs = 0

    const completedPhase = this.state.phase

    this.notify(this.getPhaseTitle(), `${this.getPhaseMessage()} Phase complete.`)

    this.emit('phase-complete', this.getState())

    // naturally finished work counts as completed work.
    if (completedPhase === 'work') {
      this.state.completedWorkSessions += 1
      this.state.sessionProgress = Math.min(
        this.config.session,
        this.state.sessionProgress + 1,
      )

      this.emit('session-complete', this.getState())

      // Include a break after the final work session.
      this.transitionTo(this.getBreakAfterWork())
      return
    }

    // The final break has finished.
    if (this.state.sessionProgress >= this.config.session) {
      this.finishTimer()
      return
    }

    this.transitionTo('work')
  }

  // determines whether short or long break after a work session
  private getBreakAfterWork(): TimerPhase {
    if (
      this.state.sessionProgress >= this.config.session ||
      (
        this.state.sessionProgress > 0 &&
        this.state.sessionProgress % 4 === 0
      )
    ) {
      return 'long-break'
    }

    return 'short-break'
  }

  // transitions to the next phase and sets
  private transitionTo(phase: TimerPhase): void {
    this.clearTick()

    const durationMinutes = this.getDurationMinutes(phase)
    const durationMs = this.toMilliseconds(durationMinutes)

    this.state = {
      ...this.state,
      phase,
      status: 'running',
      durationMs,
      remainingMs: durationMs,
    }

    this.deadline = Date.now() + durationMs

    this.UpdateState()
    this.scheduleTick()
  }

  // get's the duration in minutes
  private getDurationMinutes(phase: TimerPhase): number {
    switch (phase) {
      case 'work':
        return this.config.workMin

      case 'short-break':
        return this.config.shortBreakMin

      case 'long-break':
        return this.config.longBreakMin
    }
  }

  // handles the completion of the entire timer
  private finishTimer(): void {
    this.clearTick()

    this.state.status = 'completed'
    this.state.remainingMs = 0

    this.notify(this.getPhaseTitle(), `${this.getPhaseMessage()}.`)

    this.emit('timer-complete', this.getState())
    this.UpdateState()
  }

  // starts the timer
  start(): void {
    if (this.state.status !== 'idle') {
      throw new Error('Timer can only start from the idle state.')
    }

    this.state.status = 'running'
    this.deadline = Date.now() + this.state.remainingMs

    this.UpdateState()
    this.scheduleTick()
  }

  // pauses the timer
  pause(): void {
    if (this.state.status !== 'running') {
      throw new Error('Only a running timer can be paused.')
    }

    this.state.remainingMs = this.getRemainingTime()
    this.clearTick()
    this.state.status = 'paused'

    this.notify(this.getPhaseTitle(), `${this.getPhaseMessage()}.`)

    this.UpdateState()
  }
} 