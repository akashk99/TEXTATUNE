## Configuration

1. Inside the `server` folder, create a `.env` file with the following enviormental variables:

```
TWILIO_SID=                 [Twilio SID]
TWILIO_AUTH_TOKEN=          [Twilio Auth Token]
SPOTIFY_CLIENT_ID=          [Spotify Client ID]
SPOTIFY_CLIENT_SECRET=      [Spotify Client Secret]
TOKEN_SECRET=               [Secret used to signing and verifing JWTs]
STRIPESK=                   [Stripe Secret Key]
MONGODB=                    [MongoDB Password]
```

2. In order the run the code locally, here are the steps:

  * Execute `cd public`
  * Execute `npm run serve`
  * Open a new terminal 
  * Execute `ngrok http 8080 -subdomain=auxy411client`
  * Open another terminal 
  * Nagivate into the server folder via `cd server`
  * Execute `npm install`
  * Execute `node index.js`
  * Open another terminal 
  * Execute `ngrok http 3000 -subdomain=auxy411`

3. Navigate to `https://auxy411client.ngrok.io` to view the webapp.