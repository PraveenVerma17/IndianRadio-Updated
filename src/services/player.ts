export class PlayerService {
    private audio: HTMLAudioElement;
    private eventSource: EventSource | null = null;
    private onMetadataChange: ((metadata: any) => void) | null = null;

    constructor() {
        this.audio = new Audio();
        this.audio.autoplay = true;

        // Enable background audio playback support if possible via MediaSession (web standard, works in Capacitor)
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

    play(stationSlugs: string, imageUrl?: string) {
        this.currentImageUrl = imageUrl || null;
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }

        // Direct stream URL - browsers handle redirects
        const streamUrl = `https://stream.zeno.fm/${stationSlugs}`;
        this.audio.src = streamUrl;
        this.audio.play().catch(e => console.error("Playback failed:", e));

        this.subscribeMetadata(stationSlugs);
    }

    stop() {
        this.audio.pause();
        this.audio.src = '';
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }
    }

    toggle() {
        if (this.audio.paused) {
            this.audio.play();
        } else {
            this.audio.pause();
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
                } catch (e) {
                    console.error("Error parsing metadata", e);
                }
            };

            this.eventSource.onerror = (err) => {
                console.warn("SSE Error", err);
                // Optional: Reconnect logic could go here
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
}

export const player = new PlayerService();
