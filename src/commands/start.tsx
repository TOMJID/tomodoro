import { Command, Flags } from '@oclif/core'
import { defaultTimer } from '../core/timer/timer.config.js'
import { TimerEngine } from '../core/timer/timer.engin.js'
import { render } from 'ink'
import { Timer } from '../ui/Timer.js'

export default class Start extends Command {

  // command flags
  static override examples = [
    '<%= config.bin %> start , starts the timer with default settings',
    '<%= config.bin %> start --work 50 , starts the timer with a work duration of 50 minutes',
    '<%= config.bin %> start --work 50 --long-break 15 , starts the timer with a work duration of 50 minutes and a long break of 15 minutes',
    '<%= config.bin %> start --work 50 --short-break 10 , starts the timer with a work duration of 50 minutes and a short break of 10 minutes',
    '<%= config.bin %> start --work 50 --long-break 15 --short-break 10 , starts the timer with a work duration of 50 minutes, a long break of 15 minutes, and a short break of 10 minutes',
    '<%= config.bin %> start --session 4 , starts the timer with 4 sessions',
  ]

  // command flags
  static override flags = {
    work: Flags.integer({
      description: 'work duration in minutes',
      default: defaultTimer.workMin,
      min: 1,
    }),
    'short-break': Flags.integer({
      description: 'short break duration in minutes',
      default: defaultTimer.shortBreakMin,
      min: 1,
    }),
    'long-break': Flags.integer({
      description: 'long break duration in minutes',
      default: defaultTimer.longBreakMin,
      min: 1,
    }),
    session: Flags.integer({
      description: 'number of work/break cycles before a long break',
      default: defaultTimer.session,
      min: 1,
    }),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(Start)

    // creating timer config from user input
    const timerConfig = {
      workMin: flags.work,
      shortBreakMin: flags['short-break'],
      longBreakMin: flags['long-break'],
      session: flags.session,
    }

    // validating user input
    if (timerConfig.workMin <= 0 || timerConfig.shortBreakMin <= 0 || timerConfig.longBreakMin <= 0 || timerConfig.session <= 0) {
      this.error('All timer durations and session count must be greater than 0.')
      return
    }

    // creating timer engine instance
    const timerEngine = new TimerEngine(timerConfig)

    const instance = render(
      <Timer
        timerConfig={timerConfig}
        engine={timerEngine}
      />,
      {
        interactive: true,
        incrementalRendering: false,
        alternateScreen: true,
      },
    )
    await instance.waitUntilExit()
  }
}
