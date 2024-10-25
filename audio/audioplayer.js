// First, add Howler.js to your HTML head:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js"></script>

// Add this at the top of your file, after the playlist declaration
const SC_CLIENT_ID = 'YOUR_SOUNDCLOUD_CLIENT_ID'; // You'll need to get this from SoundCloud

class AudioPlayer {
    constructor() {
        this.currentTrack = 0;
        this.isPlaying = false;
        this.sound = null;
        this.playlist = []; // Add this line to initialize empty playlist
        
        this.initializeElements();
        this.bindEvents();
        this.initializeYouTubeImport();
    }

    initializeYouTubeImport() {
        const importBtn = document.getElementById('import-video');
        const urlInput = document.getElementById('video-url');
        const popup = document.getElementById('youtube-popup');
        const closeBtn = document.getElementById('close-popup');
        const importTrackBtn = document.getElementById('import-track-btn');

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
            if (!url) return;

            const videoId = this.getYouTubeVideoId(url);
            if (!videoId) {
                alert('Please enter a valid YouTube URL');
                return;
            }

            try {
                // Get video info from YouTube API
                const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
                const data = await response.json();

                // Create hidden iframe for audio
                const audioElement = document.createElement('div');
                audioElement.style.display = 'none';
                audioElement.innerHTML = `
                    <iframe 
                        width="0" 
                        height="0" 
                        src="https://youtube.com/embed/${videoId}?autoplay=1&controls=0&showinfo=0&autohide=1" 
                        allow="autoplay">
                    </iframe>
                `;
                document.body.appendChild(audioElement);

                // Add to playlist
                this.playlist.push({
                    title: data.title,
                    artist: data.author_name,
                    element: audioElement,
                    cover: `https://img.youtube.com/vi/${videoId}/0.jpg`
                });

                urlInput.value = '';
                popup.style.display = 'none';

                if (this.playlist.length === 1) {
                    this.loadTrack(0);
                }
            } catch (error) {
                console.error('Error importing track:', error);
                alert('Error importing track. Please try again.');
            }
        });
    }

    getYouTubeVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    initializeElements() {
        this.playBtn = document.getElementById('play-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.volumeSlider = document.getElementById('volume');
        this.progressBar = document.getElementById('progress');
        this.currentTimeSpan = document.getElementById('current-time');
        this.durationSpan = document.getElementById('duration');
        this.trackImage = document.getElementById('current-track-image');
        this.trackName = document.getElementById('current-track-name');
        this.trackArtist = document.getElementById('current-track-artist');
    }

    bindEvents() {
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.prevTrack());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        this.volumeSlider.addEventListener('input', (e) => this.updateVolume(e.target.value));
    }

    loadTrack(index) {
        if (!this.playlist.length) return;
        
        if (this.sound) {
            this.sound.unload();
        }

        const track = this.playlist[index];
        this.trackName.textContent = track.title;
        this.trackArtist.textContent = track.artist;
        this.trackImage.src = track.cover;

        // Create new Howl instance with the track
        this.sound = new Howl({
            src: [track.file],
            html5: true,
            format: ['mp3'],
            volume: this.volumeSlider.value / 100,
            autoplay: false, // Don't autoplay when loaded
            onload: () => {
                console.log('Track loaded successfully');
                // Update duration once loaded
                this.durationSpan.textContent = this.formatTime(this.sound.duration());
            },
            onplay: () => {
                console.log('Track started playing');
                this.isPlaying = true;
                this.playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                this.updateProgress();
            },
            onpause: () => {
                console.log('Track paused');
                this.isPlaying = false;
                this.playBtn.innerHTML = '<i class="fas fa-play"></i>';
            },
            onend: () => {
                console.log('Track ended');
                this.nextTrack();
            },
            onloaderror: (id, error) => {
                console.error('Error loading track:', error);
                alert('Error loading track. Please try another URL.');
            },
            onplayerror: (id, error) => {
                console.error('Error playing track:', error);
                alert('Error playing track. Please try another URL.');
            }
        });
    }

    togglePlay() {
        if (!this.sound) {
            // If no track is loaded and we have tracks in playlist, load the first one
            if (this.playlist.length > 0) {
                this.loadTrack(0);
                this.sound.once('load', () => {
                    this.sound.play();
                });
            }
            return;
        }
        
        if (this.isPlaying) {
            console.log('Pausing track');
            this.sound.pause();
        } else {
            console.log('Playing track');
            this.sound.play();
        }
    }

    nextTrack() {
        this.currentTrack = (this.currentTrack + 1) % this.playlist.length;
        this.loadTrack(this.currentTrack);
        if (this.isPlaying) this.sound.play();
    }

    prevTrack() {
        this.currentTrack = (this.currentTrack - 1 + this.playlist.length) % this.playlist.length;
        this.loadTrack(this.currentTrack);
        if (this.isPlaying) this.sound.play();
    }

    updateVolume(value) {
        if (this.sound) {
            this.sound.volume(value / 100);
        }
    }

    updateProgress() {
        if (!this.sound || !this.isPlaying) return;

        const seek = this.sound.seek();
        const duration = this.sound.duration();
        const progress = (seek / duration) * 100;
        
        this.progressBar.style.width = `${progress}%`;
        this.currentTimeSpan.textContent = this.formatTime(seek);
        this.durationSpan.textContent = this.formatTime(duration);

        requestAnimationFrame(() => this.updateProgress());
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
}

// Initialize the player when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    const player = new AudioPlayer();
});
