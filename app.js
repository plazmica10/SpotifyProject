
const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');
const session = require('express-session');
require('dotenv').config();

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
}));
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
//redirect to spotify login page
app.get('/', (req, res) => {
  res.redirect(spotifyApi.createAuthorizeURL(scopes));
});

app.get('/callback', async (req, res) => {
  const error = req.query.error;
  const code = req.query.code;
  const state = req.query.state;

  if (error) {
    console.error('Callback Error:', error);
    res.send(`Callback Error: ${error}`);
    return;
  }
  if(req.session.access_token != null || req.session.access_token != undefined){
    return;
  }
//async functions so we have to chain them with .then
  spotifyApi.authorizationCodeGrant(code)
    .then(data => {
      const access_token = data.body['access_token'];
      const refresh_token = data.body['refresh_token'];
      const expires_in = data.body['expires_in'];
      
      spotifyApi.setAccessToken(access_token);
      spotifyApi.setRefreshToken(refresh_token);

      req.session.access_token = access_token;

      console.log(`Sucessfully retreived access token. Expires in ${expires_in} s.`);
      res.send('Success! You can close this window now.');

      return spotifyApi.getMyTopArtists();
    })
    .then(function(data){
      let topArtists = data.body.items;
      const pairs = [];
      for(let i=0;i<10;i++){
        pairs.push([topArtists[i].name,topArtists[i].external_urls.spotify]);
      }
      req.session.pairs = pairs;
      // console.log(pairs);

      return spotifyApi.getMyTopTracks();
    })
    .then(function(data){
      let topTracks = data.body.items;
      const tracks = [];
      for(let i=0;i<10;i++){
        tracks.push([topTracks[i].name],topTracks[i].artists[0].name,topTracks[i].duration_ms,topTracks[i].external_urls.spotify);
      }
      req.session.tracks = tracks;
      console.log(tracks);
      console.log(req.session.pairs)
    })
    .catch(error => {
      console.error('Error getting Tokens:', error);
      res.send(`Error getting Tokens: ${error}`);
    });
});

app.listen(3000, () =>
  console.log('HTTP Server is up.')
);