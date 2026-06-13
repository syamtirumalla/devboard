import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../api'

const COLUMNS = ['todo', 'in_progress', 'done']
const LABELS = { todo: 'To Do', in_progress: 'In Progress', done: 'Done' }
const COLORS = {
  todo: 'rgba(239,68,68,0.15)',
  in_progress: 'rgba(251,191,36,0.15)',
  done: 'rgba(34,197,94,0.15)'
}
const DOT_COLORS = {
  todo: '#ef4444',
  in_progress: '#fbbf24',
  done: '#22c55e'
}

export default function Kanban() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const res = await API.get(`/tasks/${projectId}/tasks`)
      setTasks(res.data)
    } catch {
      navigate('/dashboard')
    }
  }

  const createTask = async () => {
    if (!newTask) return
    await API.post(`/tasks/${projectId}/tasks?title=${newTask}`)
    setNewTask('')
    fetchTasks()
  }

  const moveTask = async (task, newStatus) => {
    await API.put(`/tasks/${projectId}/tasks/${task.id}?title=${task.title}&status=${newStatus}`)
    fetchTasks()
  }

  const deleteTask = async (taskId) => {
    await API.delete(`/tasks/${projectId}/tasks/${taskId}`)
    fetchTasks()
  }

  const tasksByStatus = (status) => tasks.filter(t => t.status === status)

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      {/* Navbar */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '16px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}>📋</div>
          <span style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700' }}>DevBoard</span>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '10px',
            color: 'rgba(255,255,255,0.7)',
            padding: '8px 18px',
            fontSize: '14px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >← Back</button>
      </div>

      <div style={{ padding: '32px' }}>
        {/* Add Task */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px',
          padding: '20px 24px',
          marginBottom: '28px',
          display: 'flex',
          gap: '12px',
          maxWidth: '600px'
        }}>
          <input
            placeholder="Add a new task..."
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && createTask()}
            style={{
              flex: 1,
              padding: '10px 14px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '10px',
              color: '#ffffff',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <button
            onClick={createTask}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              border: 'none',
              borderRadius: '10px',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >Add Task</button>
        </div>

        {/* Kanban Columns */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {COLUMNS.map(col => (
            <div key={col} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '20px',
              padding: '20px'
            }}>
              {/* Column Header */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: DOT_COLORS[col]
                }}/>
                <span style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '13px',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>{LABELS[col]}</span>
                <span style={{
                  marginLeft: 'auto',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.5)',
                  borderRadius: '20px',
                  padding: '2px 8px',
                  fontSize: '12px'
                }}>{tasksByStatus(col).length}</span>
              </div>

              {/* Tasks */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {tasksByStatus(col).map(task => (
                  <div key={task.id} style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '14px',
                    padding: '14px 16px'
                  }}>
                    <p style={{
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: '500',
                      margin: '0 0 12px',
                      lineHeight: '1.4'
                    }}>{task.title}</p>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {COLUMNS.filter(c => c !== col).map(c => (
                        <button
                          key={c}
                          onClick={() => moveTask(task, c)}
                          style={{
                            fontSize: '11px',
                            padding: '4px 10px',
                            background: 'rgba(102,126,234,0.15)',
                            border: '1px solid rgba(102,126,234,0.3)',
                            borderRadius: '20px',
                            color: '#a5b4fc',
                            cursor: 'pointer',
                            fontWeight: '500'
                          }}
                        >→ {LABELS[c]}</button>
                      ))}
                      <button
                        onClick={() => deleteTask(task.id)}
                        style={{
                          fontSize: '11px',
                          padding: '4px 10px',
                          background: 'rgba(239,68,68,0.1)',
                          border: '1px solid rgba(239,68,68,0.2)',
                          borderRadius: '20px',
                          color: '#fca5a5',
                          cursor: 'pointer',
                          fontWeight: '500'
                        }}
                      >Delete</button>
                    </div>
                  </div>
                ))}
                {tasksByStatus(col).length === 0 && (
                  <div style={{
                    textAlign: 'center',
                    padding: '30px 0',
                    color: 'rgba(255,255,255,0.2)',
                    fontSize: '13px'
                  }}>No tasks</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}