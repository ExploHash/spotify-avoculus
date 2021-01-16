<template>
  <div style="100px">
    <a-auto-complete
      class="certain-category-search"
      dropdown-class-name="certain-category-search-dropdown"
      :dropdown-match-select-width="false"
      :dropdown-style="{ width: '300px' }"
      size="small"
      placeholder="input here"
      option-label-prop="value"
    >
      <a-input v-model="searchterm">
        <a-icon slot="suffix" type="search" class="certain-category-icon" />
      </a-input>
      <template slot="dataSource">
        <a-select-opt-group v-for="(results, type) in autocomplete" :value="type" :key="type">
          <span slot="label">
            {{ type }}
          </span>
          <a-select-option v-for="result in results.slice(0,5)" :key="result" :value="result">
            {{ result }}
          </a-select-option>
        </a-select-opt-group>
      </template>
    </a-auto-complete>
  </div>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  data(){
    return {
      searchterm: ""
    }
  },
  computed: {
    ...mapGetters(["songs", "albums", "artists"]),
    autocomplete(){
      let searchArrays = ["songs", "albums", "artists"];
      return  searchArrays.reduce((autocomplete, type) => {
        autocomplete[type] = this[type].filter(({name}) => name.toLowerCase().includes(this.searchterm.toLowerCase())).map(({name}) => name);
        if(autocomplete[type].length === 0) autocomplete[type] = ["No results"]; //Ant design doesnt understand divs in components apparently
        return autocomplete;
      }, {})
    }
  }
};
</script>
<style>
  .certain-category-search-wrapper{
    margin: 0px;
  }
</style>