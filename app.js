
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const session = require('express-session');
require('dotenv').config();
const cors = require('cors');

const app = express();

//spotify api credentials
const client_id = process.env.ID;
const client_secret = process.env.SECRET;
const redirect_uri = process.env.REDIRECT;

//middleware 
app.use(session({
  secret: process.env.SKRT,
  resave: false,
  saveUninitialized: true,
}),
  cors({
    origin: ['https://spotify-project-nine-opal.vercel.app/','http://localhost:5173'],//allows for cross origin requests
    credentials: true,
  })
);
//instantiating spotify api object
const spotifyApi = new SpotifyWebApi({
  clientId:  client_id,
  clientSecret: client_secret,
  redirectUri: redirect_uri,
});

//scopes for api, dont need all of them
const scopes = [
  'ugc-image-upload',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'streaming',
  'app-remote-control',
  'user-read-email',
  'user-read-private',
  'playlist-read-collaborative',
  'playlist-modify-public',
  'playlist-read-private',
  'playlist-modify-private',
  'user-library-modify',
  'user-library-read',
  'user-top-read',
  'user-read-playback-position',
  'user-read-recently-played',
  'user-follow-read',
  'user-follow-modify'
];

function formatDuration(durationMs) {
  const totalSeconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${minutes}:${formattedSeconds}`;
}

app.get('/', (req, res) => {
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

app.get('/data',async (req, res) => {
  const period = req.query.period || 'medium_term'//time period for api request

  const artistdata =  await spotifyApi.getMyTopArtists({time_range:period});
  const trackdata = await spotifyApi.getMyTopTracks({time_range:period});

  let topArtists = artistdata.body.items;
  let topTracks = trackdata.body.items;
  
  let tracks = [];
  let artists = [];
  let genres = [];

  //Getting all genres from top artists
  for(let i=0;i<topArtists.length;i++){
    genres.push(...topArtists[i].genres)
  }
  // Get top 10 artists and tracks
  for(let i=0;i<10;i++){
    const duration = formatDuration(topTracks[i].duration_ms);

    artists.push({name: topArtists[i].name,url:topArtists[i].external_urls.spotify});
    tracks.push({name: topTracks[i].name,artist: topTracks[i].artists[0].name,duration: duration,url:topTracks[i].external_urls.spotify});
  }

  // Count occurrences of each genre
  const genreCounts = genres.reduce((counts, genre) => {
    counts[genre] = (counts[genre] || 0) + 1;
    return counts;
  }, {});

  // Convert genreCounts object to array of objects
  const genreArray = Object.entries(genreCounts).map(([genre, count]) => ({ genre, count }));
  // Sort genres by count in descending order
  const sortedGenres = genreArray.sort((a, b) => b.count - a.count);
  // Get top 10 genres
  const topGenres = sortedGenres.slice(0, 10).map((genre) => genre.genre);

  res.send({artists:artists,tracks:tracks,genres:topGenres});
});

app.get('/callback', async (req, res) => {
  const error = req.query.error;
  const code = req.query.code;

  if (error) {
    console.error('Callback Error:', error);
    res.send(`Callback Error: ${error}`);
    return;
  }

  if(req.session.access_token != null || req.session.access_token != undefined){
    return;
  }

  spotifyApi.authorizationCodeGrant(code)
    .then(data => {
      const access_token = data.body['access_token'];
      const refresh_token = data.body['refresh_token'];
      const expires_in = data.body['expires_in'];
      
      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

      req.session.access_token = access_token;

      // console.log(`Sucessfully retreived access token ${access_token}. Expires in ${expires_in} s.`);

      // Set a timeout to refresh the access token before it expires
      setTimeout(() => {
        spotifyApi.refreshAccessToken().then(
          function(data) {
            console.log('The access token has been refreshed!');

            // Save the access token so that it's used in future calls
            spotifyApi.setAccessToken(data.body['access_token']);
          },
          function(err) {
            console.log('Could not refresh access token', err);
          }
        );
      }, (expires_in - 60) * 1000); 

      res.redirect('http://localhost:5173/data')
    })
    .catch(error => {
      console.error('Error getting Tokens:', error);
      res.send(`Error getting Tokens: ${error}`);
    });
});

app.listen(process.env.PORT || 3000, () =>
  console.log('HTTP Server is up.')
);