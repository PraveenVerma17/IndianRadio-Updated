import { useState } from 'react';
import Dashboard from './components/Dashboard';
import Player from './components/Player';
import MiniPlayer from './components/MiniPlayer';
import { usePlayer } from './context/PlayerContext';

function App() {
    const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'player'>('dashboard');
    const { currentStation } = usePlayer();

    const navigateTo = (screen: 'dashboard' | 'player') => {
        setCurrentScreen(screen);
    };

    return (
        <div id="app">
            <div
                id="dashboard"
                className={`screen ${currentScreen === 'dashboard' ? 'active' : 'hidden'}`}
            >
                <Dashboard onStationSelect={() => navigateTo('player')} />
            </div>

            <div
                id="player"
                className={`screen ${currentScreen === 'player' ? 'active' : 'hidden'}`}
            >
                <Player onBack={() => navigateTo('dashboard')} />
            </div>

            {currentStation && currentScreen === 'dashboard' && (
                <MiniPlayer onExpand={() => navigateTo('player')} />
            )}
        </div>
    );
}

export default App;
