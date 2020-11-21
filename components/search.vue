<template>
  <div class="certain-category-search-wrapper" style="width: 250px">
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
        <a-select-opt-group v-for="(results, type) in dataSource" :key="type.title">
          <span slot="label">
            {{ type }}
          </span>
          <a-select-option v-for="result in results" :key="result" :value="result">
            {{ result }}
          </a-select-option>
        </a-select-opt-group>
      </template>
    </a-auto-complete>
  </div>
</template>
<script>
const dataSource = {
  'Genres': ["Rock", "Blues", "Classical"],
  'Artists': ["bla", "bla", "bla"],
  'Albums': ["bla", "bla", "bla"],
  'Songs': ["bla", "bla", "bla"]
};
import { mapGetters } from "vuex";

export default {
  data(){
    return {
      searchterm: ""
    }
  },
  computed: {
    ...mapGetters(["index"]),
    dataSource(){
      let obj = {Genres: [], Artists: [], Albums: [], Songs: []};

      Object.entries(this.index).forEach(([genre, {artists}]) => {
        if(genre.toLowerCase().includes(this.searchterm.toLowerCase())) obj.Genres.push(genre);
        Object.entries(artists).forEach(([artistName, {albums}]) => {
          if(artistName.toLowerCase().includes(this.searchterm.toLowerCase())) obj.Artists.push(artistName);
          Object.entries(albums).forEach(([albumName, {songs}]) => {
            if(albumName.toLowerCase().includes(this.searchterm.toLowerCase())) obj.Albums.push(albumName);
            songs.forEach(({name}) => {
              
            })
          });
        });
      })
    }
  }
};
</script>
<style>
.certain-category-search-dropdown .ant-select-dropdown-menu-item-group-title {
  color: #666;
  font-weight: bold;
}

.certain-category-search-dropdown .ant-select-dropdown-menu-item-group {
  border-bottom: 1px solid #f6f6f6;
}

.certain-category-search-dropdown .ant-select-dropdown-menu-item {
  padding-left: 16px;
}

.certain-category-search-dropdown .ant-select-dropdown-menu-item.show-all {
  text-align: center;
  cursor: default;
}

.certain-category-search-dropdown .ant-select-dropdown-menu {
  max-height: 300px;
}
</style>

<style scoped>
.certain-category-search-wrapper
  >>> .certain-category-search.ant-select-auto-complete
  .ant-input-affix-wrapper
  .ant-input-suffix {
  right: 12px;
}
.certain-category-search-wrapper >>> .certain-search-item-count {
  position: absolute;
  color: #999;
  right: 16px;
}
.certain-category-search-wrapper
  >>> .certain-category-search.ant-select-focused
  .certain-category-icon {
  color: #108ee9;
}
.certain-category-search-wrapper >>> .certain-category-icon {
  color: #6e6e6e;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  font-size: 16px;
}
</style>