import { registerPlugin } from '@capacitor/core';

interface SharedDataPlugin {
    saveData(options: { title: string; artist: string; imageUrl: string; isPlaying: boolean }): Promise<void>;
}

const SharedData = registerPlugin<SharedDataPlugin>('SharedDataPlugin');

export class PlayerService {
    private audio: HTMLAudioElement;
    private eventSource: EventSource | null = null;
    private onMetadataChange: ((metadata: any) => void) | null = null;

    constructor() {
        this.audio = new Audio();
        this.audio.autoplay = true;

        // Enable background audio playback support if possible via MediaSession
        if ('mediaSession' in navigator) {
            this.audio.addEventListener('play', () => {
                navigator.mediaSession.playbackState = 'playing';
            });
            this.audio.addEventListener('pause', () => {
                navigator.mediaSession.playbackState = 'paused';
            });
        }
    }

    private currentImageUrl: string | null = null;
    private currentStationName: string = "Radio";

    async play(stationSlugs: string, imageUrl?: string, stationName?: string) {
        this.currentImageUrl = imageUrl || null;
        this.currentStationName = stationName || "Radio";

        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }

        // Direct stream URL
        const streamUrl = `https://stream.zeno.fm/${stationSlugs}`;
        this.audio.src = streamUrl;
        this.audio.play().catch(e => console.error("Playback failed:", e));

        this.subscribeMetadata(stationSlugs);
        this.updateWidget(this.currentStationName, "Live", true);
    }

    stop() {
        this.audio.pause();
        this.audio.src = '';
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }
        this.updateWidget("Indian Radio", "Tap to Play", false);
    }

    toggle() {
        if (this.audio.paused) {
            this.audio.play();
            this.updateWidget(this.currentStationName, "Live", true);
        } else {
            this.audio.pause();
            this.updateWidget(this.currentStationName, "Paused", false);
        }
    }

    isPlaying(): boolean {
        return !this.audio.paused;
    }

    setMetadataCallback(callback: (metadata: any) => void) {
        this.onMetadataChange = callback;
    }

    setVolume(volume: number) {
        this.audio.volume = Math.max(0, Math.min(1, volume));
    }

    getAudioElement(): HTMLAudioElement {
        return this.audio;
    }

    setLoadingCallback(callback: (isLoading: boolean) => void) {
        this.audio.addEventListener('waiting', () => callback(true));
        this.audio.addEventListener('playing', () => callback(false));
        this.audio.addEventListener('pause', () => callback(false));
    }

    private subscribeMetadata(stationSlugs: string) {
        const sseUrl = `https://api.zeno.fm/mounts/metadata/subscribe/${stationSlugs}`;

        try {
            this.eventSource = new EventSource(sseUrl);

            this.eventSource.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    if (this.onMetadataChange) {
                        this.onMetadataChange(data);
                    }
                    this.updateMediaSession(data);

                    // Update Widget with metadata
                    if (data.streamTitle) {
                        this.updateWidget(data.streamTitle, data.artist || this.currentStationName, !this.audio.paused);
                    }
                } catch (e) {
                    console.error("Error parsing metadata", e);
                }
            };

            this.eventSource.onerror = (err) => {
                console.warn("SSE Error", err);
            };
        } catch (e) {
            console.error("Failed to setup SSE", e);
        }
    }

    private updateMediaSession(data: any) {
        if ('mediaSession' in navigator && data.streamTitle) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: data.streamTitle || 'Unknown Title',
                artist: data.artist || 'Unknown Artist',
                album: data.album || 'Radio Stream',
                artwork: this.currentImageUrl ? [
                    { src: this.currentImageUrl, sizes: '512x512', type: 'image/png' }
                ] : []
            });
        }
    }

    private async updateWidget(title: string, artist: string, isPlaying: boolean) {
        try {
            await SharedData.saveData({
                title: title,
                artist: artist,
                imageUrl: this.currentImageUrl || "",
                isPlaying: isPlaying
            });
        } catch (e) {
            console.warn("Widget update failed (probably web env)", e);
        }
    }
}

export const player = new PlayerService();
