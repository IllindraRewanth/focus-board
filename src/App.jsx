import Timer from './components/Timer.jsx'
import TaskList from './components/TaskList.jsx'
import { useLocalStorage } from './hooks/useLocalStorage.js'

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export default function App() {
  const [tasks, setTasks] = useLocalStorage('fb.tasks', [])
  const [activeId, setActiveId] = useLocalStorage('fb.activeId', null)
  const [history, setHistory] = useLocalStorage('fb.history', {})

  const activeTask = tasks.find(t => t.id === activeId && !t.done) || null
  const todaySessions = history[todayKey()] || 0

  function handleFocusComplete() {
    setHistory(prev => ({ ...prev, [todayKey()]: (prev[todayKey()] || 0) + 1 }))
    if (activeTask) {
      setTasks(prev =>
        prev.map(t => (t.id === activeTask.id ? { ...t, sessions: t.sessions + 1 } : t))
      )
    }
  }

  return (
    <main className="app">
      <header className="top">
        <h1>Focus Board</h1>
        <p className="stat">
          <strong>{todaySessions}</strong> focus session{todaySessions === 1 ? '' : 's'} today
          {' · '}
          <strong>{todaySessions * 25}</strong> min
        </p>
      </header>

      <Timer activeTask={activeTask} onFocusComplete={handleFocusComplete} />
      <TaskList
        tasks={tasks}
        setTasks={setTasks}
        activeId={activeTask ? activeId : null}
        setActiveId={setActiveId}
      />

      <footer className="foot">Your tasks are saved in this browser only.</footer>
    </main>
  )
}
