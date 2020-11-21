<template>
</template>

<script>
export default {
  data() {
    return {
      library: []
    };
  },
  async mounted() {
    window.onSpotifyWebPlaybackSDKReady = async () => {
      let player = new Spotify.Player({
        name: "nassim",
        getOAuthToken: (callback) => {callback(this.$cookies.get("accessToken"))},
        volume: 0.5
      });
      
      await player.connect();
    }
  }
};
</script>

<style></style>
