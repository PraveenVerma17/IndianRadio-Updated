import { useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { player } from '../services/player';

interface PlayerProps {
    onBack: () => void;
}

const Player: React.FC<PlayerProps> = ({ onBack }) => {
    const { currentStation, togglePlay, isPlaying, isLoading, metadata } = usePlayer();

    // Swipe to back logic
    const touchStartX = useRef(0);
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.changedTouches[0].screenX;
    };
    const handleTouchEnd = (e: React.TouchEvent) => {
        const touchEndX = e.changedTouches[0].screenX;
        if (touchEndX - touchStartX.current > 80) {
            onBack();
        }
    }

    const title = metadata.streamTitle || currentStation?.name || 'Radio';
    const artist = currentStation ? (metadata.streamTitle ? `${currentStation.name} • ${currentStation.description || 'Live'}` : (currentStation.description || 'Live Radio')) : '';

    const handleAirplay = () => {
        const audioElement = player.getAudioElement();
        if (audioElement && 'webkitShowPlaybackTargetPicker' in audioElement) {
            (audioElement as any).webkitShowPlaybackTargetPicker();
        } else {
            console.log('AirPlay not supported in this browser');
            alert('AirPlay is not supported on this device/browser.');
        }
    }

    return (
        <div
            className="player-container" // You might want to ensure this takes full height/width in CSS if .screen doesn't cover it fully, but styles.css handles .screen
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className="hero-art-container">
                <div
                    id="album-art"
                    className={`hero-art ${isPlaying ? 'playing' : ''}`}
                    style={currentStation?.imageUrl ? {
                        backgroundImage: `url('${currentStation.imageUrl}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    } : {}}
                >
                    <span className="live-badge">🔴 LIVE</span>
                    {!currentStation?.imageUrl && '🎵'}
                </div>
            </div>

            <div className="player-info">
                <div className="track-details">
                    <h1 id="player-track-title">{title}</h1>
                    <p id="player-track-artist">{artist}</p>
                </div>
            </div>

            <div className="playback-controls">
                <button id="back-btn" className="control-btn" onClick={onBack}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    id="play-pause-btn"
                    className="control-btn play-btn-large"
                    onClick={togglePlay}
                >
                    {isLoading ? (
                        <div className="loading-spinner" style={{ borderColor: 'rgba(0,0,0,0.2)', borderTopColor: 'black' }}></div>
                    ) : (
                        isPlaying ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        )
                    )}
                </button>
            </div>

            <button id="airplay-btn" className="airplay-btn" onClick={handleAirplay}>
                📡 AirPlay & Bluetooth
            </button>
        </div>
    );
};

export default Player;
