import { EventEmitter } from "node:events";
import { TimerConfig, TimerState } from "./timer.type.js";
import { defaultTimer } from "./timer.config.js";

export class TimerEngine extends EventEmitter {
  private config: TimerConfig;
  private state: TimerState;
  constructor(config: TimerConfig = defaultTimer) {
    super();

    this.config = { ...config }
  }
  // convert minutes to milliseconds
  private toMilliseconds(min: number): number {
    return min * 60 * 1000;
  }
}