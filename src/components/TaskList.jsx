import { useState } from 'react'

const FILTERS = ['all', 'active', 'done']

export default function TaskList({ tasks, setTasks, activeId, setActiveId }) {
  const [title, setTitle] = useState('')
  const [estimate, setEstimate] = useState(1)
  const [filter, setFilter] = useState('all')

  function addTask(e) {
    e.preventDefault()
    const clean = title.trim()
    if (!clean) return
    const task = {
      id: crypto.randomUUID(),
      title: clean,
      estimate: Number(estimate) || 1,
      sessions: 0,
      done: false,
    }
    setTasks(prev => [task, ...prev])
    if (!activeId) setActiveId(task.id)
    setTitle('')
    setEstimate(1)
  }

  function toggleDone(id) {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, done: !t.done } : t)))
    if (id === activeId) setActiveId(null)
  }

  function remove(id) {
    setTasks(prev => prev.filter(t => t.id !== id))
    if (id === activeId) setActiveId(null)
  }

  function clearDone() {
    setTasks(prev => prev.filter(t => !t.done))
  }

  const visible = tasks.filter(t =>
    filter === 'all' ? true : filter === 'active' ? !t.done : t.done
  )
  const doneCount = tasks.filter(t => t.done).length

  return (
    <section className="card tasks" aria-label="Tasks">
      <form className="add-form" onSubmit={addTask}>
        <label className="sr-only" htmlFor="task-title">Task</label>
        <input
          id="task-title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="What do you want to work on?"
          maxLength={80}
        />
        <label className="sr-only" htmlFor="task-est">Estimated sessions</label>
        <input
          id="task-est"
          type="number"
          min="1"
          max="12"
          value={estimate}
          onChange={e => setEstimate(e.target.value)}
          title="Estimated focus sessions"
        />
        <button className="btn primary" type="submit" disabled={!title.trim()}>Add</button>
      </form>

      <div className="filters">
        {FILTERS.map(f => (
          <button
            key={f}
            className={filter === f ? 'chip active' : 'chip'}
            onClick={() => setFilter(f)}
          >
            {f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
        {doneCount > 0 && (
          <button className="link" onClick={clearDone}>Clear done ({doneCount})</button>
        )}
      </div>

      {visible.length === 0 ? (
        <p className="empty">
          {tasks.length === 0 ? 'No tasks yet. Add your first one above.' : 'Nothing here.'}
        </p>
      ) : (
        <ul className="task-list">
          {visible.map(t => (
            <li
              key={t.id}
              className={`task ${t.done ? 'done' : ''} ${t.id === activeId ? 'active' : ''}`}
            >
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => toggleDone(t.id)}
                aria-label={`Mark "${t.title}" as ${t.done ? 'not done' : 'done'}`}
              />
              <button
                className="task-title"
                onClick={() => !t.done && setActiveId(t.id)}
                disabled={t.done}
                title={t.done ? '' : 'Focus on this task'}
              >
                {t.title}
              </button>
              <span className="sessions" title="Sessions done / estimated">
                {t.sessions}/{t.estimate}
              </span>
              <button className="icon" onClick={() => remove(t.id)} aria-label={`Delete "${t.title}"`}>
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
