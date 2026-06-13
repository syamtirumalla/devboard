import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'

export default function Dashboard() {
  const [projects, setProjects] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await API.get('/projects/')
      setProjects(res.data)
    } catch (err) {
      navigate('/login')
    }
  }

  const createProject = async () => {
    if (!title) return
    await API.post(`/projects/?title=${title}&description=${description}`)
    setTitle('')
    setDescription('')
    fetchProjects()
  }

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      fontFamily: "'Segoe UI', sans-serif",
      padding: '0'
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
          onClick={logout}
          style={{
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '10px',
            color: '#fca5a5',
            padding: '8px 18px',
            fontSize: '14px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >Sign out</button>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            color: '#ffffff',
            fontSize: '32px',
            fontWeight: '700',
            margin: '0 0 8px',
            letterSpacing: '-0.5px'
          }}>My Projects</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0, fontSize: '15px' }}>
            {projects.length} project{projects.length !== 1 ? 's' : ''} total
          </p>
        </div>

        {/* Create Project Card */}
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '28px',
          marginBottom: '32px'
        }}>
          <h2 style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '15px',
            fontWeight: '600',
            margin: '0 0 16px',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }}>New Project</h2>
          <div style={{ display: 'flex', gap: '12px' }}>
            <input
              placeholder="Project name"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createProject()}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <input
              placeholder="Description (optional)"
              value={description}
              onChange={e => setDescription(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && createProject()}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button
              onClick={createProject}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                border: 'none',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >+ Create</button>
          </div>
        </div>

        {/* Projects Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {projects.map((project, i) => (
            <div
              key={project.id}
              onClick={() => navigate(`/kanban/${project.id}`)}
              style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '20px',
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.borderColor = 'rgba(102,126,234,0.5)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                background: `linear-gradient(135deg, ${['#667eea, #764ba2', '#f093fb, #f5576c', '#4facfe, #00f2fe', '#43e97b, #38f9d7'][i % 4]})`,
                borderRadius: '12px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}>🗂️</div>
              <h3 style={{
                color: '#ffffff',
                fontSize: '16px',
                fontWeight: '600',
                margin: '0 0 6px',
              }}>{project.title}</h3>
              <p style={{
                color: 'rgba(255,255,255,0.4)',
                fontSize: '13px',
                margin: '0 0 16px'
              }}>{project.description || 'No description'}</p>
              <div style={{
                color: 'rgba(102,126,234,0.8)',
                fontSize: '13px',
                fontWeight: '500'
              }}>Open board →</div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '16px' }}>No projects yet. Create one above!</p>
          </div>
        )}
      </div>
    </div>
  )
}