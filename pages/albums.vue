<template>
  <main>
    <musicpreview v-for="album in filteredAlbums" :name="album.name" :imageurls="grabAlbumImage(album)" class="item" v-bind:key="album.id" v-on:click.native="albumClicked(album.name, album.id)"/>
    <a-modal dialogClass="nobuttondialog" :closable="false" v-model="albumSelected" title="Album">
      <a-list item-layout="horizontal" :data-source="albumSongs">
        <a-list-item slot="renderItem" slot-scope="song">
            <span>{{ song.track_number }}. {{ song.name }}</span>
            <span>{{ new Date(song.duration_ms).getMinutes() + ":" + new Date(song.duration_ms).getSeconds() }}</span>
        </a-list-item>
      </a-list>
    </a-modal>
  </main>
</template>

<script>
import { mapGetters } from "vuex";
import Musicpreview from '../components/musicpreview.vue';

export default {
  data() {
    return {
      selectedAlbumId: false,
      albumSelected: false
    };
  },
  methods: {
    albumClicked(name, id){
      this.selectedAlbumId = id;
      this.albumSelected = true;
    },
    grabAlbumImage({images}){
      if(images.length > 0){
        return [images[0].url];
      }
      return []
    }
  },
  computed: {
    ...mapGetters(["songs", "albums", "index", "artists"]),
    filteredAlbums(){
      if(this.$route.query.artist){
        return this.albums.filter(({artists}) => {
          return artists.some(({id}) => id === this.$route.query.artist);
        });
      }else{
        return this.albums;
      }
    },
    albumSongs(){
      if(this.selectedAlbumId){
        return this.songs.filter(({album}) => {
          return album.id === this.selectedAlbumId;
        }).sort((a,b) => a.track_number - b.track_number);
      }
    }
  },
  async mounted() {
    
  }
};
</script>

<style lang="sass">
main 
  display: flex
  flex-wrap: wrap
  justify-content: space-evenly
</style>
