import { useEffect, useRef, useState } from 'react'

const MODES = {
  focus: { label: 'Focus', minutes: 25 },
  short: { label: 'Short break', minutes: 5 },
  long: { label: 'Long break', minutes: 15 },
}

function format(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0')
  const s = String(seconds % 60).padStart(2, '0')
  return `${m}:${s}`
}

export default function Timer({ activeTask, onFocusComplete }) {
  const [mode, setMode] = useState('focus')
  const [secondsLeft, setSecondsLeft] = useState(MODES.focus.minutes * 60)
  const [running, setRunning] = useState(false)
  const endTimeRef = useRef(null)
  // Always call the latest callback, even from inside the interval below.
  const onCompleteRef = useRef(onFocusComplete)
  useEffect(() => { onCompleteRef.current = onFocusComplete })

  const total = MODES[mode].minutes * 60
  const progress = 1 - secondsLeft / total

  // Use a target end time instead of counting ticks, so the timer stays accurate
  // even when the browser slows down timers in background tabs.
  useEffect(() => {
    if (!running) return
    endTimeRef.current = Date.now() + secondsLeft * 1000
    const id = setInterval(() => {
      const left = Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000))
      setSecondsLeft(left)
      if (left === 0) {
        clearInterval(id)
        setRunning(false)
        setSecondsLeft(MODES[mode].minutes * 60) // ready for the next round
        if (mode === 'focus') onCompleteRef.current()
      }
    }, 250)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  useEffect(() => {
    document.title = running ? `${format(secondsLeft)} · ${MODES[mode].label}` : 'Focus Board'
  }, [secondsLeft, running, mode])

  function switchMode(next) {
    setRunning(false)
    setMode(next)
    setSecondsLeft(MODES[next].minutes * 60)
  }

  function reset() {
    setRunning(false)
    setSecondsLeft(total)
  }

  const radius = 90
  const circumference = 2 * Math.PI * radius

  return (
    <section className="card timer" aria-label="Focus timer">
      <div className="mode-tabs" role="tablist">
        {Object.entries(MODES).map(([key, m]) => (
          <button
            key={key}
            role="tab"
            aria-selected={mode === key}
            className={mode === key ? 'tab active' : 'tab'}
            onClick={() => switchMode(key)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="dial">
        <svg viewBox="0 0 200 200" aria-hidden="true">
          <circle cx="100" cy="100" r={radius} className="dial-track" />
          <circle
            cx="100"
            cy="100"
            r={radius}
            className="dial-progress"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
          />
        </svg>
        <div className="time" aria-live="polite">{format(secondsLeft)}</div>
      </div>

      <p className="working-on">
        {mode === 'focus'
          ? activeTask
            ? <>Working on: <strong>{activeTask.title}</strong></>
            : 'Pick a task below to focus on'
          : 'Take a breather.'}
      </p>

      <div className="controls">
        <button className="btn primary" onClick={() => setRunning(r => !r)}>
          {running ? 'Pause' : secondsLeft === total ? 'Start' : 'Resume'}
        </button>
        <button className="btn ghost" onClick={reset} disabled={secondsLeft === total && !running}>
          Reset
        </button>
      </div>
    </section>
  )
}
