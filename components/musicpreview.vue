<template>
  <div class="musicpreview">
    <div @click.self="link && $router.push(link)" :style="{backgroundImage: `url(${imageurls[0]}), url(${imageurls[1]}), url(${imageurls[2]}), url(${imageurls[3]})`}" :class="'image' + imageurls.length">
      <div class="controls">
        <a-icon @click="plusSongs" width="50%" type="plus-circle" theme="filled" :style="{fontSize: '35px'}"/>
        <a-icon @click="playSongs" width="50%" type="play-circle" theme="filled" :style="{fontSize: '35px'}"/>
      </div>
    </div>
    <span>{{ name }}</span>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from "vuex";

export default {
  props:{
    name: String,
    imageurls: Array,
    link: String,
    indexPart: Object
  },
  computed: {
    ...mapGetters(["songs"])
  },
  methods: {
    ...mapActions({syncState: "player/syncState"}),
    ...mapMutations({addSongs: "player/addSongs", replaceSongs: "player/replaceSongs"}),
    findSongIds(indexPart){
      console.log(indexPart);
      console.log(indexPart.constructor.name);
      if(indexPart.constructor.name === "Object"){
        return Object.entries(indexPart).map(([key, value]) => this.findSongIds(value)).flat();
      }else if(indexPart.constructor.name === "Array"){
        return indexPart;
      }
    },
    async plusSongs(){
      console.log("LOL");
      let songIds = this.findSongIds(this.indexPart);
      let songs = this.songs.filter(song => songIds.includes(song.id));
      console.log("ADSAS", songs);
      this.addSongs(songs);
      await this.syncState();
      console.log("BLAK", songIds);
    },
    async playSongs(){
      let songIds = this.findSongIds(this.indexPart);
      let songs = this.songs.filter(song => songIds.includes(song.id));
      this.replaceSongs(songs);
      await this.syncState();
      console.log("BLAK", songIds);
    }
  }
}
</script>
<style lang="scss">
.musicpreview {
  width: 10vw;
  margin: 10px;
  text-align: center;
  .image4 {
    background-position: top left, top right, bottom left, bottom right;
    background-size: 50% 50%;
  }

  .image3 {
    background-position: top left, top right, 0 2.5vw;
    background-size: 50% 50%, 50% 50%, 100% 100%;
  }

  .image2 {
    background-position: 0% 5vw, 0 -2.5vw;
    background-size: cover, cover;
  }
  .image1 {
    background-size: cover;
  }
  span {
    padding-top: 10px;
    display: inline-block;
    text-transform: capitalize;
  }

  > div{
    position: relative;
    background-repeat: no-repeat;
    background-position: top left, top right, bottom left, bottom right;
    background-size: 50% 50%;
    display: block;
    width: 10vw;
    height: 10vw;
    border-radius: 5%;
    margin-bottom: 10px;
    .controls {
      position: absolute;
      bottom: 10px;
      right: 10px;
      i {
        cursor: pointer;
        color: var(--light);
      }
    }
  }
}
</style>
