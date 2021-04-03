<template>
  <main>
    <musicpreview v-for="genre in Object.keys(index).sort((a,b) => b.toLowerCase().localeCompare(a.toLowerCase()) * -1)" :indexPart="index[genre]" :name="genre" :imageurls="grabArtistImageByGenre(genre)" :link="'/artists?genre=' + genre" class="item" v-bind:key="genre"/>
  </main>
</template>

<script>
import { mapGetters } from "vuex";
import Musicpreview from '../components/musicpreview.vue';

export default {
  data() {
    return {
    };
  },
  methods: {
    grabArtistImageByGenre(genre){
      let genreMapping = this.index[genre];
      if(!genreMapping) return "";
      let artistIds = Object.keys(genreMapping);

      let artists = this.artists.filter(({id, images}) => artistIds.includes(id) && images.length > 0);
      if(artists.length >= 1){
        return artists.slice(0,4).map(({images}) => images[0].url);
      }
      return [];
    }
  },
  computed: {
    ...mapGetters(["artists", "index"]),
  },
  async mounted() {
    // await this.$store.dispatch("loadStore");
  }
};
</script>

<style lang="sass">
main 
  display: flex
  flex-wrap: wrap
  justify-content: space-evenly
</style>
