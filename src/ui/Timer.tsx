import { Box, useInput } from "ink"
import { useEffect, useState } from "react"
import { TimerEngine } from "../core/timer/timer.engin.js"
import { TimerConfig } from "../core/timer/timer.type.js"
import { exit } from "process"
import Gradient from "ink-gradient"
import BigText from "ink-big-text"

interface TimerProps {
  timerConfig: TimerConfig
  engine: TimerEngine
}

// format remaining time in mm:ss format
const formatTime = (remainingMs: number): string => {
  const totalSeconds = Math.ceil(remainingMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`
}


export const Timer = ({ engine }: TimerProps) => {
  const [state, setState] = useState(() => engine.getState())

  // loading the engine
  useEffect(() => {
    const updateState = () => setState(engine.getState())

    engine.on("state-change", updateState)
    engine.on("tick", updateState)

    return () => {
      engine.off("state-change", updateState)
      engine.off("tick", updateState)
    }
  }, [engine])

  // keyboard controls
  useInput((input, key) => {
    const normalizedInput = input.toLowerCase()
    try {

      if (normalizedInput === "p" || normalizedInput === " ") {
        if (state.status === "running") {
          engine.pause()
        } else if (state.status === "paused") {
          engine.resume()
        } else {
          engine.start()
        }
      } else if (normalizedInput === "s") {
        if (state.status === "running" || state.status === "paused") {
          engine.cancel()
        } else if (state.status === "idle") {
          engine.skip()
        }

      } else if (normalizedInput === "q" || key.escape) {
        if (state.status !== "completed" && state.status !== "cancelled") {
          engine.cancel()
        }
        exit()
      }
    } catch (error) {
      console.error("Error occurred while handling input:", error)
    }
  })

  const font = [
    "3d", "block", "chrome", "grid", "huge", "tiny", "shade", "slick", "pallet", "simple", "simpleBlock", "simple3d"
  ] as const
  return (
    <Box
      flexDirection="column"
      paddingY={0}
    >
      {/* title */}
      <Box flexDirection="column" alignItems="center">
        < Gradient name="morning">
          <BigText text="Tomodoro" font="chrome" />
        </Gradient>
      </Box>

      {/* timer */}
      <Box flexDirection="column" alignItems="center">
        <Gradient name="cristal">
          <BigText
            text={formatTime(state.remainingMs)} font='chrome'
          />
        </Gradient>
      </Box>

    </Box>
  )
}