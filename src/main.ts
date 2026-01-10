import './style.css'
import { stations } from './data/stations'
import type { Station } from './data/stations'
import { player } from './services/player'

// DOM Elements
const dashboard = document.getElementById('dashboard')!;
const playerScreen = document.getElementById('player')!;
const stationListEl = document.getElementById('station-list')!;
const featuredCarousel = document.getElementById('featured-carousel')!;
const backBtn = document.getElementById('back-btn')!;
const playPauseBtn = document.getElementById('play-pause-btn')!;
const albumArt = document.getElementById('album-art')!;
const playerTrackTitle = document.getElementById('player-track-title')!;
const playerTrackArtist = document.getElementById('player-track-artist')!;
const airplayBtn = document.getElementById('airplay-btn')!;
const playIcon = document.getElementById('play-icon')!;
const pauseIcon = document.getElementById('pause-icon')!;
const spinner = document.getElementById('spinner')!;

const miniPlayer = document.getElementById('mini-player')!;
const miniIcon = document.getElementById('mini-icon')!;
const miniStationName = document.getElementById('mini-station-name')!;
const miniStatus = document.getElementById('mini-status')!;
const miniPlayBtn = document.getElementById('mini-play-btn')!;
// const miniProgress = document.getElementById('mini-progress')!;

let currentStation: Station | null = null;
let isPlaying = false;

// Favorites System (TODO: Complete implementation)
/*
function getFavorites(): string[] {
  const stored = localStorage.getItem(FAVORITES_KEY);
  return stored ? JSON.parse(stored) : [];
}
*/

// Favorites System (TODO: Wire up heart button)
/*
function toggleFavorite(stationId: string) {
  const favorites = getFavorites();
  const index = favorites.indexOf(stationId);

  if (index > -1) {
    favorites.splice(index, 1);
  } else {
    favorites.push(stationId);
  }

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  renderStations(currentFilter, searchQuery);
}

function isFavorite(stationId: string): boolean {
  return getFavorites().includes(stationId);
}
*/

// AirPlay Button
airplayBtn.addEventListener('click', () => {
  const audioElement = player.getAudioElement();
  if (audioElement && 'webkitShowPlaybackTargetPicker' in audioElement) {
    (audioElement as any).webkitShowPlaybackTargetPicker();
  } else {
    console.log('AirPlay not supported in this browser');
  }
});

// Search Input
const searchInput = document.getElementById('search-input') as HTMLInputElement;

// Initialize Dashboard
function renderStations(filter: string = 'All', searchQuery: string = '') {
  // Clear lists
  stationListEl.innerHTML = '';
  // Only clear featured if we are doing a full re-render, but here we might want to keep it static.
  // Ideally, search shouldn't affect featured, or maybe it should? 
  // For now, let's keep featured static and only filter the "All Stations" list.
  if (featuredCarousel.children.length === 0) {
    renderFeatured();
  }

  // Filter Logic
  const query = searchQuery.toLowerCase();
  const filteredStations = stations.filter(station => {
    const matchesFilter = filter === 'All' ||
      station.description?.includes(filter) ||
      station.name.includes(filter);

    const matchesSearch = station.name.toLowerCase().includes(query) ||
      (station.description && station.description.toLowerCase().includes(query)) ||
      (station.genre && station.genre.toLowerCase().includes(query));

    return matchesFilter && matchesSearch;
  });

  if (filteredStations.length === 0) {
    stationListEl.innerHTML = `<div style="text-align:center; width:100%; padding: 2rem; color: var(--text-secondary);">No stations found</div>`;
    return;
  }

  filteredStations.forEach(station => {
    const row = document.createElement('div');
    row.className = 'station-card';
    row.innerHTML = `
      <div class="station-icon-wrapper">
        <div class="station-icon" style="background-image: url('${station.imageUrl || ''}'); background-size: cover; background-position: center;">
          ${!station.imageUrl ? station.name.substring(0, 2).toUpperCase() : ''}
        </div>
        <div class="play-overlay">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
             <path d="M8 5v14l11-7z"/>
           </svg>
        </div>
      </div>
      <div class="station-info">
        <h3>${station.name}</h3>
        <p class="station-subtitle">${station.description || 'Live Radio'}</p>
        ${station.genre ? `<span class="station-genre-tag">${station.genre}</span>` : ''}
      </div>
      <div class="station-action-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polygon points="10 8 16 12 10 16 10 8"></polygon>
        </svg>
      </div>
    `;
    row.addEventListener('click', () => openPlayer(station));
    stationListEl.appendChild(row);
  });
}

function renderFeatured() {
  featuredCarousel.innerHTML = '';
  // 1. Render Featured (Top 2 stations for demo)
  const featuredStations = stations.slice(0, 3);

  featuredStations.forEach(station => {
    const card = document.createElement('div');
    card.className = 'featured-card';

    // Handle missing image with fallback
    if (station.imageUrl) {
      card.style.backgroundImage = `url('${station.imageUrl}')`;
    } else {
      card.innerHTML = `
            <div class="featured-card-gradient-fallback">
                <span class="featured-card-fallback-text">${station.name.substring(0, 2).toUpperCase()}</span>
            </div>
        `;
    }

    // Add overlay content
    const content = document.createElement('div');
    content.className = 'featured-overlay';
    content.innerHTML = `
        <div class="featured-badge">Live</div>
        <div class="featured-info">
            <h3>${station.name}</h3>
            <p>${station.description || 'Trending Now'}</p>
        </div>
        <button class="featured-play-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
    `;
    card.appendChild(content);

    card.addEventListener('click', () => openPlayer(station));
    featuredCarousel.appendChild(card);
  });
}

// Search Listener
searchInput.addEventListener('input', (e) => {
  const query = (e.target as HTMLInputElement).value;
  renderStations('All', query);
});

// Navigation
function navigateTo(screen: 'dashboard' | 'player') {
  if (screen === 'dashboard') {
    playerScreen.classList.remove('active');
    playerScreen.classList.add('hidden');
    dashboard.classList.remove('hidden');
    dashboard.classList.add('active');
    // Show mini player if playing
    if (currentStation) {
      miniPlayer.classList.remove('hidden');
    }
  } else {
    dashboard.classList.remove('active');
    dashboard.classList.add('hidden');
    playerScreen.classList.remove('hidden');
    playerScreen.classList.add('active');
    // Hide mini player in full player
    miniPlayer.classList.add('hidden');
  }
}

// Player Logic
function openPlayer(station: Station) {
  currentStation = station;

  // Update Player UI
  playerTrackTitle.textContent = station.name;
  playerTrackArtist.textContent = station.description || 'Live Radio';

  // Update Mini Player
  miniStationName.textContent = station.name;
  miniStatus.textContent = 'Connecting...';
  if (station.imageUrl) {
    miniIcon.style.backgroundImage = `url('${station.imageUrl}')`;
  } else {
    miniIcon.style.backgroundImage = '';
    miniIcon.textContent = station.name[0];
  }

  // Start playing
  player.play(station.slug, station.imageUrl);
  isPlaying = true;
  updatePlayButton();

  if (station.imageUrl) {
    albumArt.style.backgroundImage = `url('${station.imageUrl}')`;
    albumArt.style.backgroundSize = 'cover';
    albumArt.style.backgroundPosition = 'center';
    albumArt.textContent = '';
  } else {
    albumArt.style.backgroundImage = '';
    albumArt.textContent = '🎵';
  }
  albumArt.classList.add('playing');

  navigateTo('player');

  // Setup metadata listener
  player.setMetadataCallback((metadata) => {
    if (metadata.streamTitle) {
      // Update track title with metadata
      playerTrackTitle.textContent = metadata.streamTitle;
      // Keep artist as station info
      playerTrackArtist.textContent = `${station.name} • ${station.description || 'Live Radio'}`;
    }
  });
}

function togglePlay() {
  if (!currentStation) return;

  player.toggle();
  isPlaying = player.isPlaying();
  updatePlayButton();

  if (isPlaying) {
    albumArt.classList.add('playing');
  } else {
    albumArt.classList.remove('playing');
  }
}

function updatePlayButton() {
  if (spinner.style.display === 'inline-block') return;

  if (isPlaying) {
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'inline';
    // Sync Mini Player
    miniPlayBtn.textContent = '⏸';
    miniStatus.textContent = 'Playing';
  } else {
    playIcon.style.display = 'inline';
    pauseIcon.style.display = 'none';
    // Sync Mini Player
    miniPlayBtn.textContent = '▶';
    miniStatus.textContent = 'Paused';
  }
}

// Loading Spinner Logic
player.setLoadingCallback((isLoading) => {
  if (isLoading) {
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'none';
    spinner.style.display = 'inline-block';

    // Sync Mini Player
    miniPlayBtn.textContent = '...';
    miniStatus.textContent = 'Loading...';
  } else {
    spinner.style.display = 'none';
    updatePlayButton();
  }
});

// Swipe Gesture (Left to Right to go Back)
let touchStartX = 0;
playerScreen.addEventListener('touchstart', e => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

playerScreen.addEventListener('touchend', e => {
  const touchEndX = e.changedTouches[0].screenX;
  if (touchEndX - touchStartX > 80) { // Threshold for swipe
    navigateTo('dashboard');
  }
}, { passive: true });

// Event Listeners
miniPlayBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  togglePlay();
});

document.querySelector('.mini-content')?.addEventListener('click', () => {
  navigateTo('player');
});

backBtn.addEventListener('click', () => {
  // Optional: Stop playing when going back? User might want bg audio.
  // For now, let's keep playing but show dashboard. 
  // If user wants to stop, they use pause button.
  navigateTo('dashboard');
});

playPauseBtn.addEventListener('click', togglePlay);

// Init
console.log('App Initializing...');
try {
  renderStations();
  console.log('Stations rendered.');
} catch (e) {
  console.error('Error rendering stations:', e);
}
