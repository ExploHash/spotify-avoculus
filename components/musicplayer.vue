<template>
  <div class="musicplayer">
    <img v-if="playlist.length > 0" height="50px" :src="currentTrack.album.images[0].url">
    <div v-if="playlist.length > 0" class="songinformation">
      <span>{{ currentTrack.name }}</span>
      <span>{{ currentTrack.artists[0].name }}</span>
    </div>
    <div class="controls">
      <a-button @click="previous" type="primary" shape="circle" icon="step-backward" />
      <a-button @click="toggle" type="primary" shape="circle" :icon="!paused ? 'pause' : 'caret-right'" />
      <a-button @click="next" type="primary" shape="circle" icon="step-forward" />
    </div>
    <div class="slider">
      <span>{{ positionFormatted }}</span>
      <a-slider v-model="position" :min="0" :max="currentTrack.duration_ms" id="test" />
      <span v-if="playlist.length > 0">{{ lengthFormatted }}</span>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  props:{
  },
  computed: {
    ...mapGetters({playlist: "player/playlist", paused: "player/paused", currentTrack: "player/currentTrack", positionFormatted: "player/positionFormatted", lengthFormatted: "player/lengthFormatted"}),
    position: {
      get() {return this.$store.state.player.position},
      async set(value) {await this.$store.dispatch("player/seek", value)}
    }
  },
  methods: {
    ...mapActions({next: "player/next", previous: "player/previous", toggle: "player/toggle"}),
  },
  async mounted() {
    window.onSpotifyWebPlaybackSDKReady = async () => {
      await this.$store.dispatch("player/initialize");
    }
  }
}
</script>
<style lang="scss">
  .musicplayer {
    position: relative;
    height: 100%;
    overflow: hidden;
    img {
      position: relative;
      float: left;
      overflow: hidden;
    }
    .songinformation {
      position: relative;
      float: left;
      overflow: hidden;
      top: 50%;
      transform: translateY(-50%);
      width: 10%;
      margin-left: 1vw;
      display: grid;
    }
    .controls {
      position: relative;
      float: left;
      overflow: hidden;
      height: 100%;
      > * {
        position: relative;
        margin-top: 25%;
        transform: translateY(-50%);
      }
    }
    .slider {
      position: relative;
      margin: 0;
      margin-left: 2vw;
      float: left;
      height: 100%;
      display: block;
      > * {
        top: 50%;
        position: relative;
        transform: translateY(-50%);
        float: left;
      }
      .ant-slider {
        left: 0px;
        width: 60vw;
        margin: 0px;
        margin-left: 1vw;
        margin-right: 1vw;
      }
    }
  }
</style>
