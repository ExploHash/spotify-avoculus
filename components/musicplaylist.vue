<template>
  <div class="musicplaylist">
    <a-list v-if="playlist.length > 0" item-layout="horizontal" :data-source="playlist">
      <a-list-item slot="renderItem" slot-scope="song, index" :class="{current: index === playlistIndex}">
        <img height="50px" :src="song.album.images[0].url">
        <div class="songinformation">
          <span>{{ song.name }}</span>
          <span>{{ song.artists[0].name }}</span>
        </div>
        <!-- <span>{{ formatMilliseconds(song.duration_ms) }}</span> -->
      </a-list-item>
    </a-list>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  props:{
  },
  computed: {
    ...mapGetters({playlist: "player/playlist", playlistIndex: "player/playlistIndex"}),
  },
  methods: {
    formatMilliseconds(milliseconds){
      let date = new Date(milliseconds);
      let minutes = date.getMinutes();
      let seconds = date.getSeconds();
      return minutes + ":" + (seconds < 10 ? "0" + String(seconds) : seconds);
  }
  },
}
</script>
<style lang="scss">
  .musicplaylist {
    background-color: white;
    position: relative;
    .ant-list-item{
      overflow: hidden;
      display: block;
      padding-left: 20px;
      padding-right: 20px;
      &.current{
        background-color: lightgray
      }
      img {
        position: relative;
        float: left;
        overflow: hidden;
      }
      .songinformation {
        position: relative;
        float: left;
        overflow: hidden;
        height: 50px;
        margin-left: 1vw;
        display: grid;
        span {
          width: 15vw;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }
</style>
