// First, add Howler.js to your HTML head:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.3/howler.min.js"></script>

// Add this at the top of your file, after the playlist declaration
const SC_CLIENT_ID = 'YOUR_SOUNDCLOUD_CLIENT_ID'; // You'll need to get this from SoundCloud

class AudioPlayer {
    constructor() {
        this.audio = new Audio();
        this.isPlaying = false;
        this.isYouTube = false;
        this.ytPlayer = null;
        
        // Load YouTube IFrame API
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.playBtn = document.getElementById('play-btn');
        this.volumeSlider = document.getElementById('volume');
        this.fileInput = document.getElementById('audio-upload');
        this.trackImage = document.getElementById('current-track-image');
        this.trackName = document.getElementById('current-track-name');
        this.trackArtist = document.getElementById('current-track-artist');
        this.progressBar = document.getElementById('progress');
        this.currentTime = document.getElementById('current-time');
        this.duration = document.getElementById('duration');
        this.progressContainer = document.querySelector('.progress-bar');
        
        this.linkInput = document.createElement('input');
        this.linkInput.type = 'text';
        this.linkInput.placeholder = 'Enganxa un link de YouTube...';
        this.linkInput.className = 'link-input';
        
        // Insert link input after file input
        this.fileInput.parentNode.appendChild(this.linkInput);
        
        // Add hidden YouTube container
        this.ytContainer = document.createElement('div');
        this.ytContainer.id = 'yt-player';
        this.ytContainer.style.display = 'none';
        document.body.appendChild(this.ytContainer);
    }

    bindEvents() {
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.volumeSlider.addEventListener('input', (e) => this.updateVolume(e.target.value));
        this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        this.linkInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleYouTubeLink(e.target.value);
            }
        });
        
        // Only bind audio events for local files
        this.audio.addEventListener('play', () => !this.isYouTube && this.updatePlayState(true));
        this.audio.addEventListener('pause', () => !this.isYouTube && this.updatePlayState(false));
        this.audio.addEventListener('ended', () => !this.isYouTube && this.updatePlayState(false));
        this.audio.addEventListener('timeupdate', () => !this.isYouTube && this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => !this.isYouTube && this.updateDuration());
        
        this.progressContainer.addEventListener('click', (e) => this.seek(e));
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Update track info
        this.trackName.textContent = file.name.replace(/\.[^/.]+$/, "");
        this.trackArtist.textContent = 'Local File';

        // Create object URL for the audio file
        const audioUrl = URL.createObjectURL(file);
        this.audio.src = audioUrl;
        
        // Auto-play the uploaded file
        this.audio.play();
    }

    async handleYouTubeLink(url) {
        try {
            const videoId = this.extractVideoID(url);
            if (!videoId) {
                throw new Error('Invalid YouTube URL');
            }

            // Get video info
            const response = await fetch(`https://noembed.com/embed?url=${url}`);
            const data = await response.json();

            // Update track info
            this.trackName.textContent = data.title;
            this.trackArtist.textContent = data.author_name;
            this.trackImage.src = `https://img.youtube.com/vi/${videoId}/0.jpg`;

            // Switch to YouTube mode
            this.isYouTube = true;
            this.audio.pause();

            // Create or update YouTube player
            if (this.ytPlayer) {
                this.ytPlayer.loadVideoById(videoId);
            } else {
                this.createYouTubePlayer(videoId);
            }

            this.linkInput.value = '';
        } catch (error) {
            console.error('Error handling YouTube link:', error);
            alert('Could not load YouTube video. Please try another link.');
        }
    }

    createYouTubePlayer(videoId) {
        if (window.YT && window.YT.Player) {
            this.ytPlayer = new YT.Player('yt-player', {
                height: '0',
                width: '0',
                videoId: videoId,
                playerVars: {
                    'playsinline': 1,
                    'controls': 0
                },
                events: {
                    'onStateChange': (event) => this.onYouTubeStateChange(event),
                    'onReady': () => {
                        this.ytPlayer.playVideo();
                        this.updateVolume(this.volumeSlider.value);
                    }
                }
            });
        }
    }

    onYouTubeStateChange(event) {
        switch(event.data) {
            case YT.PlayerState.PLAYING:
                this.updatePlayState(true);
                this.startYouTubeProgress();
                break;
            case YT.PlayerState.PAUSED:
            case YT.PlayerState.ENDED:
                this.updatePlayState(false);
                if (this.progressInterval) {
                    clearInterval(this.progressInterval);
                }
                break;
        }
    }

    startYouTubeProgress() {
        if (this.progressInterval) clearInterval(this.progressInterval);
        this.progressInterval = setInterval(() => {
            if (this.isYouTube && this.ytPlayer) {
                const duration = this.ytPlayer.getDuration();
                const currentTime = this.ytPlayer.getCurrentTime();
                const progress = (currentTime / duration) * 100;
                
                this.progressBar.style.width = `${progress}%`;
                this.currentTime.textContent = this.formatTime(currentTime);
            }
        }, 1000);
    }

    extractVideoID(url) {
        const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[7].length === 11) ? match[7] : null;
    }

    togglePlay() {
        if (this.isYouTube && this.ytPlayer) {
            if (this.isPlaying) {
                this.ytPlayer.pauseVideo();
            } else {
                this.ytPlayer.playVideo();
            }
        } else if (this.audio.src) {
            if (this.isPlaying) {
                this.audio.pause();
            } else {
                this.audio.play();
            }
        }
    }

    updatePlayState(isPlaying) {
        this.isPlaying = isPlaying;
        this.playBtn.innerHTML = isPlaying ? 
            '<i class="fas fa-pause"></i>' : 
            '<i class="fas fa-play"></i>';
    }

    updateVolume(value) {
        this.audio.volume = value / 100;
    }

    updateProgress() {
        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        this.progressBar.style.width = `${progress}%`;
        this.currentTime.textContent = this.formatTime(this.audio.currentTime);
    }

    updateDuration() {
        this.duration.textContent = this.formatTime(this.audio.duration);
    }

    seek(event) {
        const rect = this.progressContainer.getBoundingClientRect();
        const pos = (event.clientX - rect.left) / rect.width;
        this.audio.currentTime = pos * this.audio.duration;
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

// Initialize the player when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    window.audioPlayer = new AudioPlayer();
});
