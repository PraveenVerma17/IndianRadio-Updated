import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { PlayerProvider } from './context/PlayerContext'
import './style.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <PlayerProvider>
            <App />
        </PlayerProvider>
    </StrictMode>,
)
