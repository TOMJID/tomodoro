import { Box, useInput } from "ink"
import { TimerEngine } from "../core/timer/timer.engin.js"
import { TimerConfig } from "../core/timer/timer.type.js"
import { exit } from "process"
import Gradient from "ink-gradient"
import BigText from "ink-big-text"

interface TimerProps {
  timerConfig: TimerConfig
  engine: TimerEngine
}

const Timer = ({ timerConfig, engine }: TimerProps) => {
  // keyboard controls
  useInput((input, key) => {
    const normalizedInput = input.toLowerCase()
    try {

      if (normalizedInput === "p" || normalizedInput === " ") {
        if (engine.status === "running") {
          engine.pause()
        } else {
          engine.start()
        }
      } else if (normalizedInput === "s") {
        if (engine.status === "running" || engine.status === "paused") {
          engine.stop()
        } {
          engine.skip()
        }

      } else if (normalizedInput === "q" || key.escape) {
        if (state.status !== 'completed' && state.status !== 'cancelled') {
          engine.cancel()
        }
        exit()
      }
    } catch (error) {
      console.error("Error occurred while handling input:", error)
    }
  })

  return (
    <Box
      flexDirection="column"
      paddingY={0}
    >
      {/* title */}
      <Box flexDirection="column" alignItems="center">
        < Gradient name="rainbow">
          <BigText text="Tomodoro" font="block" />
        </Gradient>
      </Box>

      {/* timer */}
      <Box flexDirection="column" alignItems="center">
        <Gradient name="cristal">
          <BigText
            text={formatTime(state.remainingMs)}
            font="simple"
          />
        </Gradient>
      </Box>

    </Box>
  )
}