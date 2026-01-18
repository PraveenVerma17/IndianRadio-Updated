import { useState } from 'react';
import { stations } from '../data/stations';
import { usePlayer } from '../context/PlayerContext';
import StationIcon from './StationIcon';

interface DashboardProps {
    onStationSelect: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onStationSelect }) => {
    const { playStation, isLoading, currentStation, isPlaying } = usePlayer();
    const [searchQuery, setSearchQuery] = useState('');

    const featuredStations = stations.slice(0, 3);

    const filteredStations = stations.filter(station => {
        const query = searchQuery.toLowerCase();
        // Filter Logic
        // For now assume 'All' filter acts as no filter on buttons, just search text
        // You can add genre filter buttons later if needed
        return station.name.toLowerCase().includes(query) ||
            (station.description && station.description.toLowerCase().includes(query)) ||
            (station.genre && station.genre.toLowerCase().includes(query));
    });

    const handleStationClick = (station: any) => {
        playStation(station);
        onStationSelect();
    }

    return (
        <>
            <div className="section-header">
                <h2>Featured</h2>
            </div>
            <div id="featured-carousel" className="featured-carousel">
                {featuredStations.map(station => (
                    <div
                        key={station.id}
                        className="featured-card"
                        style={{ backgroundImage: station.imageUrl ? `url('${station.imageUrl}')` : undefined }}
                        onClick={() => handleStationClick(station)}
                    >
                        {!station.imageUrl && (
                            <div className="featured-card-gradient-fallback">
                                <span className="featured-card-fallback-text">{station.name.substring(0, 2).toUpperCase()}</span>
                            </div>
                        )}
                        <div className="featured-overlay">
                            <div className="featured-badge">Live</div>
                            <div className="featured-info">
                                <h3>{station.name}</h3>
                                <p>{station.description || 'Trending Now'}</p>
                            </div>
                            <button className="featured-play-btn">
                                {isPlaying && currentStation?.id === station.id && isLoading ? (
                                    <div className="loading-spinner" style={{ width: '24px', height: '24px', borderWidth: '3px', borderTopColor: 'var(--accent-primary)', borderColor: 'rgba(139, 92, 246, 0.2)' }}></div>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <path d={isPlaying && currentStation?.id === station.id ? "M6 19h4V5H6v14zm8-14v14h4V5h-4z" : "M8 5v14l11-7z"} />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="search-container">
                <div className="search-input-wrapper">
                    <svg className="search-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        type="text"
                        id="search-input"
                        className="search-input"
                        placeholder="Search stations, genres..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="section-header">
                <h2>All Stations</h2>
            </div>
            <div id="station-list" className="station-list compact">
                {filteredStations.length === 0 ? (
                    <div style={{ textAlign: 'center', width: '100%', padding: '2rem', color: 'var(--text-secondary)' }}>No stations found</div>
                ) : (
                    filteredStations.map(station => (
                        <div key={station.id} className="station-card" onClick={() => handleStationClick(station)}>
                            <div className="station-icon-wrapper">
                                <StationIcon station={station} />
                                <div className="play-overlay" style={{ opacity: (isPlaying && currentStation?.id === station.id) ? 1 : undefined }}>
                                    {isPlaying && currentStation?.id === station.id && isLoading ? (
                                        <div className="loading-spinner" style={{ width: '24px', height: '24px', borderWidth: '3px', borderTopColor: 'white', borderColor: 'rgba(255, 255, 255, 0.3)' }}></div>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                            <path d={isPlaying && currentStation?.id === station.id ? "M6 19h4V5H6v14zm8-14v14h4V5h-4z" : "M8 5v14l11-7z"} />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            <div className="station-info">
                                <h3>{station.name}</h3>
                                <p className="station-subtitle">{station.description || 'Live Radio'}</p>
                                {station.genre && <span className="station-genre-tag">{station.genre}</span>}
                            </div>
                            <div className="station-action-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polygon points="10 8 16 12 10 16 10 8"></polygon>
                                </svg>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </>
    );
};

export default Dashboard;
