export type TimerPhase = 'work' | 'short-break' | 'long-break'

export type TimerStatus =
  | 'idle'
  | 'running'
  | 'paused'
  | 'completed'
  | 'cancelled'

export interface TimerState {
  phase: TimerPhase
  status: TimerStatus
  durationMs: number
  remainingMs: number
  completedWorkSessions: number
  sessionProgress: number
  skippedPhases: number
}

export interface TimerEvents {
  stateChange: TimerState
  tick: TimerState
  phaseComplete: TimerState
  sessionComplete: TimerState
  timerComplete: TimerState
  cancelled: TimerState
}

export interface TimerConfig {
  workMin: number
  shortBreakMin: number
  longBreakMin: number
  session: number
}