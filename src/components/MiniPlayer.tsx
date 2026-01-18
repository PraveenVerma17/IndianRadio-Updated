import { usePlayer } from '../context/PlayerContext';

interface MiniPlayerProps {
    onExpand: () => void;
}

const MiniPlayer: React.FC<MiniPlayerProps> = ({ onExpand }) => {
    const { currentStation, isPlaying, togglePlay, isLoading } = usePlayer();

    if (!currentStation) return null;

    return (
        <div id="mini-player" className="mini-player">
            <div className="mini-progress-bar">
                <div id="mini-progress" className="mini-progress" style={{ width: '0%' }}></div>
            </div>
            <div className="mini-content" onClick={onExpand}>
                <div
                    id="mini-icon"
                    className="mini-icon"
                    style={currentStation.imageUrl ? {
                        backgroundImage: `url('${currentStation.imageUrl}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    } : {}}
                >
                    {!currentStation.imageUrl && currentStation.name[0]}
                </div>
                <div className="mini-text">
                    <h4 id="mini-station-name">{currentStation.name}</h4>
                    <p id="mini-status">{isLoading ? 'Loading...' : (isPlaying ? 'Playing' : 'Paused')}</p>
                </div>
                <div className="mini-controls">
                    <button
                        id="mini-play-btn"
                        className="btn mini-play-btn"
                        onClick={(e) => {
                            e.stopPropagation();
                            togglePlay();
                        }}
                    >
                        {isLoading ? (
                            <div className="loading-spinner" style={{ width: '16px', height: '16px', borderWidth: '2px', borderTopColor: 'black', borderColor: 'rgba(0,0,0,0.2)' }}></div>
                        ) : (
                            isPlaying ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            )
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MiniPlayer;
