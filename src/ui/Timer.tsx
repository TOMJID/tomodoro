import { Box, Text, useInput } from "ink"
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

// create a progress bar string based on the progress percentage and width
function makeProgressBar(progress: number, width: number): string {
  const safeProgress = Math.max(0, Math.min(1, progress))
  const partialBlocks = ["", "▏", "▎", "▍", "▌", "▋", "▊", "▉"]
  const exactBlocks = safeProgress * width
  let filled = Math.floor(exactBlocks)
  const partialIndex = Math.round((exactBlocks - filled) * 8)

  if (partialIndex === 8) {
    filled += 1
  }

  const partial = partialIndex === 8 ? "" : partialBlocks[partialIndex]
  const empty = width - filled - (partial === "" ? 0 : 1)

  return "█".repeat(filled) + partial + "░".repeat(Math.max(0, empty))
}

export const Timer = ({ timerConfig, engine }: TimerProps) => {
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

  // Keep the display synchronized with the engine's deadline between ticks.
  useEffect(() => {
    if (state.status !== "running") {
      return
    }

    const animation = setInterval(() => {
      setState(engine.getState())
    }, 100)

    return () => clearInterval(animation)
  }, [engine, state.status])

  // calculate progress for timer and session
  const timerProgress =
    state.durationMs > 0
      ? Math.max(0, Math.min(1, 1 - state.remainingMs / state.durationMs))
      : 0
  const cycleProgress =
    timerConfig.session > 0
      ? Math.max(
        0,
        Math.min(1, state.sessionProgress / timerConfig.session),
      )
      : 0
  const currentSession = Math.min(
    timerConfig.session,
    state.sessionProgress + (state.phase === "work" ? 1 : 0),
  )
  const streak = state.completedWorkSessions
  const barWidth = 30
  const timerBar = makeProgressBar(timerProgress, barWidth)

  // keyboard controls
  useInput((input, key) => {
    const normalizedInput = input.toLowerCase()
    const currentState = engine.getState()

    try {
      if (normalizedInput === "p" || normalizedInput === " ") {
        switch (currentState.status) {
          case "idle":
            engine.start()
            break
          case "running":
            engine.pause()
            break
          case "paused":
            engine.resume()
            break
        }
      } else if (normalizedInput === "s") {
        if (
          currentState.status === "running" ||
          currentState.status === "paused"
        ) {
          engine.skip()
        }

      } else if (normalizedInput === "q" || key.escape) {
        if (
          currentState.status !== "completed" &&
          currentState.status !== "cancelled"
        ) {
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
      padding={2}
      borderStyle="double"
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

      {/* progress bar */}
      <Box
        flexDirection="column"
        gap={0}

      >
        <Box justifyContent="flex-start" marginBottom={0}>
          <Text>Progress </Text>
          <Text>
            ({Math.round(Math.max(0, Math.min(1, timerProgress)) * 100)}%)
          </Text>
        </Box>

        <Text >
          [{timerBar}]
        </Text>

        <Box
          justifyContent="space-between"
          marginBottom={0}
        >
          <Text>
            SESSION PROGRESS (
            {String(state.sessionProgress).padStart(2, '0')}/
            {String(timerConfig.session).padStart(2, '0')})
          </Text>
        </Box>

        <Text >
          [{makeProgressBar(cycleProgress, barWidth)}]
        </Text>
      </Box>

      {/* status and stats */}
      <Box
        flexDirection="row"
        justifyContent="space-around"
        borderStyle='single'
        borderColor='gray'
      >
        <Box flexDirection="column" alignItems="center">
          <Text bold>{state.completedWorkSessions}</Text>
          <Text dimColor>DONE</Text>
        </Box>

        <Box flexDirection="column" alignItems="center">
          <Text bold>
            {currentSession}/{timerConfig.session}
          </Text>
          <Text dimColor>SESSION</Text>
        </Box>

        <Box flexDirection="column" alignItems="center">
          <Text bold>{streak}</Text>
          <Text dimColor>STREAK</Text>
        </Box>

        <Box flexDirection="column" alignItems="center">
          <Text bold>{state.skippedPhases}</Text>
          <Text dimColor>SKIPS</Text>
        </Box>
      </Box>

      {/* KEYBOARD SHORTCUTS */}
      <Box
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        borderStyle='single'
        padding={1}
        marginTop={1}
      >
        <Text dimColor>
          SPACE: Play/Pause | S: Skip | Q: Quit
        </Text>

      </Box>
    </Box>
  )
}