const app = require('express')();
const bodyParser = require('body-parser')
const axios = require('axios')
const qs = require('querystring')
const cookieParser = require('cookie-parser');

app.use(bodyParser.json());
app.use(cookieParser());

const spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
const spotifySecretKey = process.env.SPOTIFY_SECRET_KEY;

app.get('/spotifywebhook', async (req, res) => {
  let key = spotifyClientId + ":" + spotifySecretKey;

  let response = await axios.post(
    "https://accounts.spotify.com/api/token",
    qs.stringify({
      grant_type: "authorization_code",
      code: req.query.code,
      redirect_uri: "http://localhost:3000/api/spotifywebhook"
    }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(key).toString("base64")
      }
    });

    //Set cookie
    res.cookie("accessToken", response.data.access_token, {maxAge: 1E9});
    res.redirect("/");
})

module.exports = app