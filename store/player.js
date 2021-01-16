const axios = require("axios");

export const state = () => ({
  playlist: [],
  paused: false,
  position: 0,
  positionInterval: 0,
  playlistIndex: 0
})

export const mutations = {
  setKey(state, data){
    for(let [key, value] of Object.entries(data))
      state[key] = value;
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
      getOAuthToken: (callback) => {callback(this.$cookies.get("accessToken"))}
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
    track_window: {current_track, next_tracks, previous_tracks}
  }){
    commit("setKey", {
      paused, position,
      playlist: [...previous_tracks, current_track, ...next_tracks],
      playlistIndex: previous_tracks.length
    })

    if(!paused){
      clearInterval(state.positionInterval);
      commit("setKey", {
        positionInterval: setInterval(() => commit("updatePosition"), 50)
      });
    }
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