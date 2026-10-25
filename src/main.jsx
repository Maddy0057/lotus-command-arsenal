import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ExamVarsProvider } from './context/ExamVarsContext'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ExamVarsProvider>
      <App />
    </ExamVarsProvider>
  </React.StrictMode>,
)
