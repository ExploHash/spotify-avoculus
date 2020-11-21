<template>
  <button @click="test">Authorize</button>
</template>

<script>
let spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
export default {
  methods: {
    test(){
      console.log("Werkt dit?");
      var scopes = "user-library-read user-modify-playback-state streaming user-read-email user-read-private";
      window.location.href = 'https://accounts.spotify.com/authorize' +
      '?response_type=code' +
      `&client_id=${spotifyClientId}` +
      (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
      '&redirect_uri=' + encodeURIComponent("http://localhost:3000/api/spotifywebhook");
    }
  }
}
</script>

<style>

</style>
