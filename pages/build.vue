<template>
  <main>
    <div v-for="(loading, name) in loadingData" v-bind:key="name">
      <p>{{ loading.start}} / {{ loading.end }} {{ loading.message }} </p>
      <a-progress :percent="loading.start / loading.end * 100" size="small" />
    </div>
  </main>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["loadingData"])
  },
  async mounted() {
    await this.$store.dispatch("buildIndex");
  }
};
</script>

<style></style>
