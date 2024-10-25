// First, add Howler.js to your HTML head:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js"></script>

// Add this at the top of your file, after the playlist declaration
const SC_CLIENT_ID = 'YOUR_SOUNDCLOUD_CLIENT_ID'; // You'll need to get this from SoundCloud

class AudioPlayer {
    constructor() {
        this.currentTrack = null;
        this.isPlaying = false;
        this.player = null;
        
        // Load YouTube IFrame API first
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = 'https://www.youtube.com/iframe_api';
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        // Initialize after DOM is fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            this.initialize();
        }
    }

    initialize() {
        this.initializeElements();
        this.bindEvents();
        this.initializeYouTubeImport();
    }

    initializeElements() {
        // Check if elements exist before assigning
        this.playBtn = document.getElementById('play-btn');
        this.volumeSlider = document.getElementById('volume');
        this.trackImage = document.getElementById('current-track-image');
        this.trackName = document.getElementById('current-track-name');
        this.trackArtist = document.getElementById('current-track-artist');

        if (!this.playBtn || !this.volumeSlider || !this.trackImage || 
            !this.trackName || !this.trackArtist) {
            console.error('Required elements not found in the DOM');
            return;
        }
    }

    bindEvents() {
        if (this.playBtn) {
            this.playBtn.addEventListener('click', () => this.togglePlay());
        }
        if (this.volumeSlider) {
            this.volumeSlider.addEventListener('input', (e) => this.updateVolume(e.target.value));
        }
    }

    initializeYouTubeImport() {
        const importBtn = document.getElementById('import-video');
        const urlInput = document.getElementById('video-url');
        const popup = document.getElementById('youtube-popup');
        const closeBtn = document.getElementById('close-popup');
        const importTrackBtn = document.getElementById('import-track-btn');

        if (!importBtn || !urlInput || !popup || !closeBtn || !importTrackBtn) {
            console.error('YouTube import elements not found');
            return;
        }

        importTrackBtn.addEventListener('click', () => {
            popup.style.display = 'flex';
        });

        closeBtn.addEventListener('click', () => {
            popup.style.display = 'none';
            urlInput.value = '';
        });

        popup.addEventListener('click', (e) => {
            if (e.target === popup) {
                popup.style.display = 'none';
                urlInput.value = '';
            }
        });

        importBtn.addEventListener('click', async () => {
            const url = urlInput.value.trim();
            if (!url) {
                alert('Please enter a YouTube URL');
                return;
            }

            const videoId = this.getYouTubeVideoId(url);
            if (!videoId) {
                alert('Please enter a valid YouTube URL');
                return;
            }

            try {
                importBtn.disabled = true;
                const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
                if (!response.ok) throw new Error('Failed to fetch video info');
                
                const data = await response.json();

                if (!this.player) {
                    this.createYouTubePlayer(videoId);
                } else {
                    this.player.loadVideoById(videoId);
                }

                this.trackName.textContent = data.title || 'Unknown Title';
                this.trackArtist.textContent = data.author_name || 'Unknown Artist';
                this.trackImage.src = `https://img.youtube.com/vi/${videoId}/0.jpg`;
                this.currentTrack = videoId;

                urlInput.value = '';
                popup.style.display = 'none';
            } catch (error) {
                console.error('Error importing track:', error);
                alert('Error importing track. Please try again.');
            } finally {
                importBtn.disabled = false;
            }
        });
    }

    createYouTubePlayer(videoId) {
        // Remove existing player if it exists
        const existingPlayer = document.getElementById('youtube-player');
        if (existingPlayer) {
            existingPlayer.remove();
        }

        const playerDiv = document.createElement('div');
        playerDiv.id = 'youtube-player';
        playerDiv.style.display = 'none';
        document.body.appendChild(playerDiv);

        try {
            this.player = new YT.Player('youtube-player', {
                height: '0',
                width: '0',
                videoId: videoId,
                playerVars: {
                    autoplay: 1,
                    controls: 0,
                    disablekb: 1,
                    enablejsapi: 1,
                    modestbranding: 1,
                    playsinline: 1,
                    rel: 0
                },
                events: {
                    onReady: (event) => {
                        event.target.setVolume(this.volumeSlider.value);
                        this.updatePlayerState();
                    },
                    onStateChange: (event) => {
                        this.updatePlayerState();
                    },
                    onError: (event) => {
                        console.error('YouTube player error:', event.data);
                        alert('Error playing video. Please try another URL.');
                    }
                }
            });
        } catch (error) {
            console.error('Error creating YouTube player:', error);
            alert('Error creating player. Please refresh the page and try again.');
        }
    }

    updatePlayerState() {
        if (!this.player) return;

        try {
            const state = this.player.getPlayerState();
            this.isPlaying = state === YT.PlayerState.PLAYING;
            if (this.playBtn) {
                this.playBtn.innerHTML = this.isPlaying ? 
                    '<i class="fas fa-pause"></i>' : 
                    '<i class="fas fa-play"></i>';
            }
        } catch (error) {
            console.error('Error updating player state:', error);
        }
    }

    togglePlay() {
        if (!this.player) return;

        try {
            if (this.isPlaying) {
                this.player.pauseVideo();
            } else {
                this.player.playVideo();
            }
        } catch (error) {
            console.error('Error toggling play state:', error);
            alert('Error controlling playback. Please refresh the page.');
        }
    }

    updateVolume(value) {
        if (!this.player) return;

        try {
            this.player.setVolume(value);
        } catch (error) {
            console.error('Error updating volume:', error);
        }
    }

    getYouTubeVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }
}

// Initialize the player when the YouTube API is ready
window.onYouTubeIframeAPIReady = () => {
    window.audioPlayer = new AudioPlayer();
};
