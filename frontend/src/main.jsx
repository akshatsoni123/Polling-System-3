import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { PollProvider } from './context/PollContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <PollProvider>
        <App />
      </PollProvider>
    </BrowserRouter>
  </StrictMode>,
)
