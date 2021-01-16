<template>
  <div class="musicplaylist">
    <a-list v-if="playlist.length > 0" item-layout="horizontal" :data-source="playlist">
      <a-list-item slot="renderItem" slot-scope="song">
        <span>{{ song.track_number }}. {{ song.name }}</span>
        <span>{{ new Date(song.duration_ms).getMinutes() + ":" + new Date(song.duration_ms).getSeconds() }}</span>
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
    ...mapGetters({playlist: "player/playlist"}),
  },
  methods: {
  },
}
</script>
<style lang="scss">
</style>
