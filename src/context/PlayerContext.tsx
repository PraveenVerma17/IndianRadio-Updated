import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { player } from '../services/player';
import type { Station } from '../data/stations';

interface PlayerContextType {
    currentStation: Station | null;
    isPlaying: boolean;
    isLoading: boolean;
    metadata: any;
    playStation: (station: Station) => void;
    togglePlay: () => void;
    playIcon: string;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
    const [currentStation, setCurrentStation] = useState<Station | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [metadata, setMetadata] = useState<any>({});

    useEffect(() => {
        // Sync initial state
        setIsPlaying(player.isPlaying());

        // Setup listeners
        player.setLoadingCallback((loading) => {
            setIsLoading(loading);
        });

        player.setMetadataCallback((data) => {
            setMetadata(data);
        });

        // We might want to poll or setup a listener for play state changes if they happen outside React
        // But since we control it via this context mostly, it should be fine.
        // However, audio ending or pausing by system needs listening.
        const audio = player.getAudioElement();
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);

        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);

        return () => {
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
        }
    }, []);

    const playStation = (station: Station) => {
        if (currentStation?.id === station.id && isPlaying) {
            // If same station is playing, maybe just open player? Or do nothing?
            // Let's assume re-clicking plays it again or ensures it's active
            return;
        }

        setCurrentStation(station);
        setMetadata({}); // Reset metadata
        player.play(station.slug, station.imageUrl);
        setIsPlaying(true);
    };

    const togglePlay = () => {
        if (!currentStation) return;
        player.toggle();
        setIsPlaying(player.isPlaying());
    };

    const playIcon = isLoading ? '...' : (isPlaying ? '⏸' : '▶');

    return (
        <PlayerContext.Provider value={{
            currentStation,
            isPlaying,
            isLoading,
            metadata,
            playStation,
            togglePlay,
            playIcon
        }}>
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => {
    const context = useContext(PlayerContext);
    if (context === undefined) {
        throw new Error('usePlayer must be used within a PlayerProvider');
    }
    return context;
};
