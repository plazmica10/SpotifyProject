# SpotifyProject
A simple app built with Spotify Web API, Express, React and Node. It lets users dive into their music history, exploring their top tracks, favorite artists and genres over various time periods helping them rediscover old favorites.

## Running the App locally

The app runs on [Node.js](https://nodejs.org/en). Clone the repository and install dependencies running:

    $ npm install
    
### Using your own credentials

You will need to register your app and get your own credentials in [your Spotify for Developers Dashboard](https://developer.spotify.com/dashboard).

Once you have created your app, load the `client_id`, `redirect_uri` and `client_secret` from a `.env` file.

In order to run the app, run its `app.js` file:

    $ node app.js

To run front-end head to the `front` folder and run:

    $ npm install
    $ npm run dev
    
Then, open `http://localhost:5173` in a browser.