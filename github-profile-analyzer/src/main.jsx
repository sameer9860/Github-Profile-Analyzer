import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './App.css'

{
  const key = 'gpa-theme'
  const stored = localStorage.getItem(key)
  if (stored === 'light' || stored === 'dark') {
    document.documentElement.dataset.theme = stored
  } else {
    document.documentElement.dataset.theme = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches
      ? 'dark'
      : 'light'
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
