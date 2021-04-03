<template>
  <a-layout>
    <a-layout-header class="header">
      <nav>
        <!-- <div class="logo">Avoculus</div> -->
        <a-menu :selectedKeys="selectedItem" theme="dark" mode="horizontal">
          <a-menu-item @click="$router.push('/')" key="index">Genres</a-menu-item>
          <a-menu-item @click="$router.push('/artists')" key="artists">Artists</a-menu-item>
          <a-menu-item @click="$router.push('/albums')" key="albums">Albums</a-menu-item>
        </a-menu>
    </nav>
    </a-layout-header>
    <a-layout>
      <a-modal dialogClass="nobuttondialog" :closable="false" v-model="loading" title="Building">
        <div v-for="(loading, name) in loadingData" v-bind:key="name">
          <p>{{ loading.start}} / {{ loading.end }} {{ loading.message }} </p>
          <a-progress :percent="Math.round(loading.start / loading.end * 100)" size="small" />
        </div>
      </a-modal>
      <a-modal dialogClass="nobuttondialog" :closable="false" v-model="login" title="Please login">
        <button @click="loginWithSpotify">Login with spotify</button>
      </a-modal>
      <a-layout-content><nuxt/></a-layout-content>
      <a-layout-sider width="25%">
        <musicplaylist/>
      </a-layout-sider>
    </a-layout>
    <a-layout-footer>
      <musicplayer/>
    </a-layout-footer>
    <script src="https://sdk.scdn.co/spotify-player.js"></script>
  </a-layout>
</template>
<script>
import { mapGetters } from "vuex";
import musicplayer from '../components/musicplayer.vue';
import Musicplaylist from '../components/musicplaylist.vue';
let spotifyClientId = process.env.SPOTIFY_CLIENT_ID;

export default {
  components: { musicplayer, Musicplaylist },
  data(){
    return {
      selectedItem: [],
    } 
  },
  watch:{
    $route (to, from){
      this.selectedItem = [to.name];
    }
  }, 
  computed: {
    ...mapGetters(["loading", "loadingData", "login"])
  },
  mounted(){
    this.selectedItem = [this.$router.currentRoute.name];
  },
  methods: {
    loginWithSpotify(){
      console.log("Werkt dit?");
      var scopes = "user-library-read user-modify-playback-state streaming user-read-email user-read-private";
      window.location.href = 'https://accounts.spotify.com/authorize' +
      '?response_type=code' +
      `&client_id=${spotifyClientId}` +
      (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
      '&redirect_uri=' + encodeURIComponent("http://localhost:3000/api/spotifywebhook");
    }
  },
  async fetch() {
    await this.$store.dispatch("initData");
  },
  fetchOnServer: false
}
</script>

<style>

html {
  scroll-behavior: smooth;
}
body {
  font-size: 16px;
  word-spacing: 1px;
  color: black;
  box-sizing: border-box;
}

:root {
  --dark: #212121;
  --dark-lighter: #323232;
  --accent: #0d7377;
  --light: #14ffec;
}

* {
 box-sizing: border-box;
}
/* main {
  padding: 70px 15%;
  padding-bottom: 70px;
} */

.ant-menu{
  background-color: var(--dark);
}

.ant-menu-item{
  margin-right: 20px;
}

.ant-layout-header{
  position: relative;
  background: white;
  padding: 0px;
  height: auto;
}
.ant-layout-footer{
  padding: 10px;
}

.ant-layout{
  height: 100vh;
}
.ant-layout-content {
  background-color: whitesmoke;
  padding: 5em;
}

header {
  position: fixed;
  background-color: white;
  width: 100%;
  z-index: 99;
  height: auto;
}

footer{
  position: relative;
  width: 100%;
  height: 70px;
  bottom: 0px;
  box-shadow: 1px 0px 5px 0px rgba(0,0,0,0.75);
}

aside {
  overflow: auto;
}

.logo {
  font-size: 35px;
  line-height: 45px;
  font-family: arial;
  width: 130px;
  float: left;
  height: 45px;
  margin-right: 40px;
  background-size: auto 45px;
  margin-left: 25px;
  font-weight: 700;
  color: brown;
}
.nobuttondialog .ant-btn {
  display: none;
}
</style>
