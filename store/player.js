const axios = require("axios");

export const state = () => ({
  playlist: [],
  paused: false,
  position: 0,
  positionInterval: 0,
  playlistIndex: 0,
  deviceId: false,
})


export const mutations = {
  setKey(state, data){
    for(let [key, value] of Object.entries(data))
      state[key] = value;
  },
  addSongs(state, songs){
    console.log("NL", songs);
    state.playlist.push(...songs);
  },
  replaceSongs(state, songs){
    state.position = 0;
    state.playlistIndex = 0;
    state.playlist = songs;
  },
  updatePosition(state){
    if(!state.paused){
      state.position += 50;
    }else{
      clearInterval(state.positionInterval);
    }
  }
}

export const getters = {
  playlist: (state) => {
    return state.playlist;
  },
  playlistIndex: (state) => {
    return state.playlistIndex;
  },
  currentTrack: (state) => {
    return state.playlist[state.playlistIndex] || {};
  },
  paused: (state) => {
    return state.paused;
  },
  position: (state) => {
    return state.position;
  },
  positionFormatted: (state) => {
    return formatMilliseconds(state.position);
  },
  lengthFormatted: (state) => {
    return formatMilliseconds(state.playlist[state.playlistIndex].duration_ms);
  }
}

export const actions = {
  async initialize({dispatch, commit}){
    let spotifyPlayer = new Spotify.Player({
      name: "Avoculus",
      volume: 1,
      getOAuthToken: (callback) => {callback(this.$cookies.get("accessToken"))}
    });
    spotifyPlayer.addListener('ready', async ({device_id}) => {
      commit("setKey", {deviceId: device_id});
    });

    spotifyPlayer.addListener('player_state_changed', async (event) => {
      console.log(event);
      dispatch("playerChangedEvent", event);
    });
    
    
    await spotifyPlayer.connect();

    commit("setKey", {spotifyPlayer});
  },
  async playerChangedEvent({state, commit}, {
    paused, position,
    track_window: {current_track}
  }){
    commit("setKey", {
      paused, position,
      playlistIndex: state.playlist.findIndex((song => current_track.id === song.id || current_track.linked_from.id === song.id))
    })

    if(!paused){
      clearInterval(state.positionInterval);
      commit("setKey", {
        positionInterval: setInterval(() => commit("updatePosition"), 50)
      });
    }
  },
  async syncState({state}){
    await this.$axios.$put(
      "https://api.spotify.com/v1/me/player/play?device_id=" + state.deviceId,
      {
        uris: state.playlist.map(({id}) => "spotify:track:" + id),
        offset: {
          position: state.playlistIndex,
        },
        position_ms: state.position
      },
      {
        headers: { Authorization: "Bearer " + this.$cookies.get("accessToken")}
      }
    );
  },
  async toggle({state}){
    await state.spotifyPlayer.togglePlay();
  },
  async next({state}){
    await state.spotifyPlayer.nextTrack();
  },
  async previous({state}){
    await state.spotifyPlayer.previousTrack();
  },
  async seek({state}, value){
    await state.spotifyPlayer.seek(value);
  }
}

function formatMilliseconds(milliseconds){
  let date = new Date(milliseconds);
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();
  return minutes + ":" + (seconds < 10 ? "0" + String(seconds) : seconds);
}