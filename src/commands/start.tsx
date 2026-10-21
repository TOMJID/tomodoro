import { Command, Flags } from '@oclif/core'
import { defaultTimer } from '../core/timer/timer.config.js'
import { TimerEngine } from '../core/timer/timer.engin.js'
import { render } from 'ink'
import { Timer } from '../ui/Timer.js'

export default class Start extends Command {

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
    Session: Flags.integer({
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
      session: flags.Session,
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
      />
    )
    await instance.waitUntilExit()
  }
}
