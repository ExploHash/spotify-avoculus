<template>
  <main>
    <musicpreview v-for="artist in filteredArtists" :indexPart="$route.query.genre ? index[$route.query.genre][artist.id] : []" :link="'/albums?artist=' + artist.id" :name="artist.name" :imageurls="grabArtistImage(artist)" class="item" v-bind:key="artist.id"/>
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
    grabArtistImage({images}){
      if(images.length > 0){
        return [images[0].url];
      }
      return [];
    }
  },
  computed: {
    ...mapGetters(["genres", "artists", "index"]),
    filteredArtists(){
      if(this.$route.query.genre){
        return this.artists.filter(({id}) => Object.keys(this.index[this.$route.query.genre]).includes(id));
      }else{
        return this.artists;
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
