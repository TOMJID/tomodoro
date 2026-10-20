import { EventEmitter } from "node:events";

export class TimerEngine extends EventEmitter {
  // convert minutes to milliseconds
  private toMilliseconds(min: number): number {
    return min * 60 * 1000;
  }
}