var SpotifyWebApi = require('spotify-web-api-node');
var applescript   = require('spotify-node-applescript');

var spotifyApi = new SpotifyWebApi({
  clientId     : process.env.SPOTIFY_KEY,
  clientSecret : process.env.SPOTIFY_SECRET,
  redirectUri  : process.env.SPOTIFY_REDIRECT_URI
});

module.exports = {
  play: function() {
    return new Promise(function(resolve, reject) {
      applescript.play(function() {
        return resolve(true)
      })
    });
  },
  skip: function() {
    return new Promise(function(resolve, reject) {
      applescript.next(function() {
        return resolve(true)
      })
    });
  },
  pause: function() {
    return new Promise(function(resolve, reject) {
      applescript.pause(function() {
        return resolve(true)
      })
    });
  },
  getCurrentTrack: function() {
    return new Promise(function(resolve, reject) {
      applescript.getTrack(function(err, track) {
        if (!err) {
          return resolve(track)
        }
      })
    });
  },
  playTrack: function(track) {
    applescript.playTrackInContext(`spotify:track:${track.id}`,
      `spotify:user:${process.env.SPOTIFY_USERNAME}:playlist:${process.env.SPOTIFY_PLAYLIST_ID}`,
      function(){
        // track is playing
        return true
      }
    );
  },
  clearPlaylist: function() {
    console.log('clearing playlist')
    return new Promise(function(resolve, reject) {
      spotifyApi.refreshAccessToken().then(function(data) {
        spotifyApi.setAccessToken(data.body['access_token']);
        if (data.body['refresh_token']) {
          spotifyApi.setRefreshToken(data.body['refresh_token']);
        }
        console.log('here we are')
        spotifyApi.getPlaylist(process.env.SPOTIFY_USERNAME, process.env.SPOTIFY_PLAYLIST_ID).then(function(playlist) {
          let tracksToRemove = []
          let options = { snapshot_id: playlist.body.snapshot_id }
          playlist.body.tracks.items.forEach((item, index) => {
            let trackToRemove = { uri: item.track.uri }
            trackToRemove.push(trackToRemove)

            if (index + 1 === items.length) {
              spotifyApi.removeTracksFromPlaylist(process.env.SPOTIFY_USERNAME, process.env.SPOTIFY_PLAYLIST_ID, tracksToRemove, options).then(function(data) {
                console.log('Tracks removed from playlist!');
                return resolve(data)
              }, function(err) {
                console.log('Something went wrong!', err);
                return reject(err)
              });
            }
          })
        })
      })
    });
  }
}
