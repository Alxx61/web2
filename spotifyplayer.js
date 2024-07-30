window.onSpotifyWebPlaybackSDKReady = () => {
    const token = 'BQCqCUXw2lKaSKr770-t4_mx94pw8EBVdbOaf-nDvjWVviJyXhfA4UulNF_spQvthdsqF9BKREE1mz87SaSM9gTvoRnVPulosOVly8EfGVEbv-NE7-wiHshMrdPylDmHhgaOm5FD6rYPwdGet8LlYC0jJhWVtfYFsiAURY_41EseRPuuqu5X3PtqTjEZl7I8BS2NHbzjtdSyQQHfo4Qa';
    const player = new Spotify.Player({
      name: 'Web Playback SDK Player',
      getOAuthToken: cb => { cb(token); },
      volume: 0.5
    });

    // Player is ready
    player.addListener('ready', ({ device_id }) => {
      console.log('Ready with Device ID', device_id);
    });

    // Player is not ready
    player.addListener('not_ready', ({ device_id }) => {
      console.log('Device ID has gone offline', device_id);
    });

    // Player state changed
    player.addListener('player_state_changed', state => {
      if (!state) {
        console.error('User is not playing music through the Web Playback SDK');
        return;
      }

      let current_track = state.track_window.current_track;
      document.getElementById('album-cover').src = current_track.album.images[0].url;
      document.getElementById('song-title').textContent = current_track.name;
      document.getElementById('artist-name').textContent = current_track.artists.map(artist => artist.name).join(', ');

      // Change play/pause button icon based on state
      const playPauseButton = document.getElementById('play-pause');
      if (state.paused) {
        playPauseButton.textContent = '▶️';
      } else {
        playPauseButton.textContent = '⏸️';
      }
    });

    // Toggle play/pause
    document.getElementById('play-pause').onclick = function() {
      player.togglePlay();
    };

    // Next track
    document.getElementById('next').onclick = function() {
      player.nextTrack();
    };

    // Previous track
    document.getElementById('prev').onclick = function() {
      player.previousTrack();
    };

    player.connect();
  };