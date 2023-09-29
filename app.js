
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const cors = require('cors');

const app = express();

//spotify api credentials
const client_id = process.env.ID;
const client_secret = process.env.SECRET;
const redirect_uri = 'http://localhost:3000/callback';

//middleware 
app.use(session({
  secret: process.env.SKRT,
  resave: false,
  saveUninitialized: true,
}), 
  cookieParser(),
  cors({
    origin: 'http://localhost:5173',
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

app.get('/topartists',async (req, res) => {
  const period = req.query.period || 'medium_term'
  const cacheBuster = new Date().getTime(); // Add a cache-busting parameter
  const data = await spotifyApi.getMyTopArtists({time_range:period});
  let topArtists = data.body.items;
  let artists = [];
  for(let i=0;i<10;i++){
    artists.push({name: topArtists[i].name,url:topArtists[i].external_urls.spotify});
  }
  // console.log(artists);
  res.send(artists);
});

app.get('/toptracks',async (req, res) => {
  const period = req.query.period || 'medium_term'
  const data = await spotifyApi.getMyTopTracks({time_range:period});
  let topTracks = data.body.items;
  let tracks = [];
  for(let i=0;i<10;i++){
    const duration = formatDuration(topTracks[i].duration_ms);
    tracks.push({name: topTracks[i].name,artist: topTracks[i].artists[0].name,duration: duration,url:topTracks[i].external_urls.spotify});
  }
  // console.log(tracks);
  res.send(tracks)
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

      console.log(`Sucessfully retreived access token ${access_token}. Expires in ${expires_in} s.`);
      res.send('Success! Redirecting...');
    })
    .catch(error => {
      console.error('Error getting Tokens:', error);
      res.send(`Error getting Tokens: ${error}`);
    });
});

app.listen(3000, () =>
  console.log('HTTP Server is up.')
);