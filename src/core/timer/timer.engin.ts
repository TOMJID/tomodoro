import { EventEmitter } from "node:events";
import { TimerConfig, TimerPhase, TimerState, TimerStatus } from "./timer.type.js";
import { defaultTimer } from "./timer.config.js";
import notifier from "node-notifier";
import playSound from "play-sound";
import { fileURLToPath } from "node:url";

const skipSoundPath = fileURLToPath(
  new URL("../../assets/sound/skip.mp3", import.meta.url),
);
const sessionSoundPath = fileURLToPath(
  new URL("../../assets/sound/session.mp3", import.meta.url),
);
const doneSoundPath = fileURLToPath(
  new URL("../../assets/sound/done.mp3", import.meta.url),
);
const pauseSoundPath = fileURLToPath(
  new URL("../../assets/sound/pause.mp3", import.meta.url),
);

export class TimerEngine extends EventEmitter {
  private config: TimerConfig;
  private state: TimerState;
  private deadline = 0
  private interval: ReturnType<typeof setInterval> | undefined
  private player = playSound({});

  constructor(config: TimerConfig = defaultTimer) {
    super();

    this.validateConfig(config);
    this.config = { ...config }

    const durationMs = this.toMilliseconds(
      this.config.workMin,
    );

    this.state = {
      phase: 'work',
      status: 'idle',
      durationMs,
      remainingMs: durationMs,
      completedWorkSessions: 0,
      sessionProgress: 0,
      skippedPhases: 0,
    };
  }

  // sound player with play-sound package
  private playSound(soundPath: string): void {
    this.player.play(soundPath, (err) => {
      if (err) {
        console.error('Error playing sound:', err);
      }
    });
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

  // gets the title of a timer phase for notification
  private getPhaseTitle(phase: TimerPhase = this.state.phase): string {
    switch (phase) {
      case 'work':
        return 'Work Session';
      case 'short-break':
        return 'Short Break';
      case 'long-break':
        return 'Long Break';
    }
  }

  private getNextPhaseAfterCurrent(): TimerPhase | undefined {
    if (this.state.phase === 'work') {
      const projectedProgress = Math.min(
        this.config.session,
        this.state.sessionProgress + 1,
      );

      if (
        projectedProgress >= this.config.session ||
        projectedProgress % 4 === 0
      ) {
        return 'long-break';
      }

      return 'short-break';
    }

    if (this.state.sessionProgress < this.config.session) {
      return 'work';
    }

    return undefined;
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

    if (
      values.some(
        (value) =>
          !Number.isFinite(value) ||
          !Number.isInteger(value) ||
          value <= 0,
      )
    ) {
      throw new Error(
        'All timer values must be positive integers.',
      );
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
    const nextPhase = this.getNextPhaseAfterCurrent()

    this.notify(
      `${this.getPhaseTitle(completedPhase)} complete`,
      nextPhase
        ? `${this.getPhaseTitle(nextPhase)} starts now.`
        : 'The timer is complete.',
    );

    this.playSound(doneSoundPath);

    this.emit('phase-complete', this.getState())

    // naturally finished work counts as completed work.
    if (completedPhase === 'work') {
      this.state.completedWorkSessions += 1
      this.state.sessionProgress = Math.min(
        this.config.session,
        this.state.sessionProgress + 1,
      )

      this.emit('session-complete', this.getState())
      this.playSound(sessionSoundPath);

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

    this.notify(this.getPhaseTitle(), 'Timer complete!')
    this.playSound(sessionSoundPath);

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
      throw new Error('Only a running timer can be paused.');
    }

    this.state.remainingMs = this.getRemainingTime();
    this.clearTick();
    this.state.status = 'paused';

    this.playSound(pauseSoundPath);
    this.UpdateState();
  }

  // resumes the timer
  resume(): void {
    if (this.state.status !== 'paused') {
      throw new Error('Only a paused timer can be resumed.');
    }

    this.state.status = 'running';
    this.deadline = Date.now() + this.state.remainingMs;

    this.UpdateState();
    this.scheduleTick();
  }
  // skips the timer 
  skip(): void {
    const skippedPhase = this.state.phase
    const nextPhase = this.getNextPhaseAfterCurrent()

    this.notify(
      `${this.getPhaseTitle(skippedPhase)} skipped`,
      nextPhase
        ? `${this.getPhaseTitle(nextPhase)} starts now.`
        : 'The timer is complete.',
    )
    this.clearTick()

    this.playSound(skipSoundPath);
    this.state.skippedPhases += 1

    if (this.state.phase === 'work') {
      this.state.sessionProgress = Math.min(
        this.config.session,
        this.state.sessionProgress + 1,
      )

      this.transitionTo(this.getBreakAfterWork())
      return
    }

    if (this.state.sessionProgress >= this.config.session) {
      this.finishTimer()
      return
    }

    this.transitionTo('work')
  }

  // cancels the timer
  cancel(): void {
    this.clearTick()
    this.state.status = 'cancelled'
    this.state.remainingMs = 0

    this.emit('cancelled', this.getState())
    this.UpdateState()
  }

} 