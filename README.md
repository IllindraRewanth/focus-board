# Focus Board

A small focus app built with React and Vite. You add tasks, pick one, and run a 25-minute focus timer (Pomodoro technique). Finished sessions are counted against each task and toward a daily total. Everything is saved in the browser, so nothing is lost on refresh.

**Live demo:** _add your Vercel link here_

## Features

- Focus / short break / long break timer with a progress ring
- Task list with add, complete, delete, filter (all / active / done) and "clear done"
- Each task has an estimated number of sessions; completed sessions are tracked (e.g. `1/3`)
- Daily counter of focus sessions and minutes
- Timer stays accurate in background tabs (it uses an end time, not tick counting)
- The browser tab title shows the countdown while the timer runs
- Data saved with `localStorage`
- Keyboard accessible, screen-reader labels, light and dark mode

## Run it locally

```bash
npm install
npm run dev
```

## Project structure

```
src/
  App.jsx                  app state: tasks, active task, daily history
  components/Timer.jsx     timer modes, countdown, progress ring
  components/TaskList.jsx  add / complete / filter / delete tasks
  hooks/useLocalStorage.js state that is saved to localStorage
  index.css                styles (light + dark)
```

## How AI was used

This project was built with Claude (Anthropic) as the coding assistant.

### Prompts used

1. "Work on the FlyRank internship assignments site and complete the required assignments."
2. "make it urself", which asked the AI to choose the app idea and build it.

_Add any other prompts you use while changing the app below._

### How AI assisted

- Picked the app idea and planned the structure (App → Timer + TaskList, plus a custom `useLocalStorage` hook).
- Generated the components, the styles and the data-saving logic.
- Built and tested the app with an automated browser test that added tasks, ran a full 25-minute session with a simulated clock and checked the counters.

### Issues found when reviewing the AI-generated code

These problems turned up in the first version and were fixed before the app was finished:

1. **Stale callback in the timer.** The interval called `onFocusComplete` from the render where the timer started. If you switched tasks mid-session, the finished session went to the old task. Fixed by keeping the latest callback in a `useRef`.
2. **Double-counting after a session ended.** When the timer reached `00:00`, the button showed "Resume". Clicking it ended a 0-second session at once and counted a second session. Fixed by resetting the timer to the full length when a session finishes.

### My manual improvements

_Fill this in with changes you made yourself, with a before/after for each. Ideas:_

- _Let the user change the focus length (for example 25 / 50 minutes)._
- _Play a sound or show a browser notification when a session ends._
- _Add a way to edit a task's title._
- _Change the colors or layout to your own style._
