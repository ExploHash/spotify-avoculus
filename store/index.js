import { json } from "body-parser";

const axios = require("axios");
const {default: PQueue} = require('p-queue');

const lastFmApiKey = process.env.LAST_FM_API_KEY

const songsBatchSize = 50;
const artistsBatchSize = 50;

const hardlimit = 100;

export const state = () => ({
  index: {},
  genres: {},
  songs: [],
  albums: [],
  loading: false,
  login: false,
  artists: [],
  loadingData: {}
})

export const mutations = {
  setKey(state, data){
    for(let [key, value] of Object.entries(data))
      state[key] = value;
  },
  setLoading(state, data){
    let {name, add, ...otherData} = data
    if(data.add) state.loadingData[name].start += add
    //Make a copy
    let loadingDataCopy = {...state.loadingData};
    loadingDataCopy[name] = {...loadingDataCopy[name], ...otherData};
    state.loadingData = loadingDataCopy;
  },
  removeLoading(state, name){
    //Make a copy
    let loadingDataCopy = {...state.loadingData};
    delete loadingDataCopy[name];
    state.loadingData = loadingDataCopy;
  }
}

export const getters = {
  index: (state) => {
    return state.index;
  },
  loading: (state) => {
    return state.loading;
  },
  login: (state) => {
    return state.login;
  },
  artists: (state) => {
    return state.artists;
  },
  albums: (state) => {
    return state.albums;
  },
  genres: (state) => {
    return state.genres;
  },
  songs: (state) => {
    return state.songs;
  },
  loadingData: (state) => {
    return state.loadingData;
  },
}

export const actions = {
  async initData({dispatch, state, commit}){
    if(await dispatch("accessTokenValid")){
      commit("setKey", {loading: true});
      console.log("valid");
      //get latest artists and songs
      await dispatch("buildSpotifyData");
      let indexData = localStorage.getItem("index");
      if(!indexData){
        await dispatch("buildIndex");
        localStorage.setItem("index", JSON.stringify(state.index));
      }else{
        commit("setKey", {index: JSON.parse(indexData)});
      }
      commit("setKey", {loading: false});
    }else{
      commit("setKey", {login: true});
      
    }
  },
  async accessTokenValid(){
    try{
      await this.$axios.$get(
        "https://api.spotify.com/v1/me/",
        {
          headers: { Authorization: "Bearer " + this.$cookies.get("accessToken")}
        }
      );
    }catch(err){
      return false;
    }
    return true;
  },
  async buildSpotifyData({commit, dispatch}){
    let songs = await dispatch("getSongs");
    let albums = getUniqueAlbums(songs);
    let uniqueArtists = getUniqueArtists(songs);
    let artists = await dispatch("getArtists", uniqueArtists);
    
    commit("setKey", {
      songs,
      artists,
      albums
    });
  },
  async buildIndex({state: {songs}, commit, dispatch}){
    let uniqueArtists = getUniqueArtists(songs);
    //Grab all artists info
    let artistsGenreMapping = await dispatch("getArtistsGenres", uniqueArtists);
    //Grab genre info
    let uniqueGenres = getUniqueGenres(artistsGenreMapping);
    let genreInfoMapping = await dispatch("getGenreInfoMapping", uniqueGenres);

    //build index    
    let index = songs.reduce((index, {id: songId, artists, album: {id: albumId, total_tracks}}) => {
      if((total_tracks === 1)) albumId = 0;
      artists.forEach(artist => {
        let genres = artistsGenreMapping[artist.name].filter(genre => genreInfoMapping[genre].reach > 1000);
        genres.forEach(genre => {
          if(!index[genre]) index[genre] = {}
          if(!index[genre][artist.id]) index[genre][artist.id] = {}
          if(!index[genre][artist.id][albumId]) index[genre][artist.id][albumId] = []
          index[genre][artist.id][albumId].push(songId);
        })
      })
      return index;
    }, {});

    commit("setKey", {
      genres: uniqueGenres,
      index
    });
  },
  async getGenreInfoMapping({commit, dispatch}, genres){
    commit("setLoading", {name: "tagInfo", message: "Grabbing genre info...", start: 0, end: genres.length});
    const queue = new PQueue({concurrency: 5, interval: 1000, intervalCap: 20});
    let mapping = {};
    await queue.addAll(genres.map(genre => {
      return async() => {
        let {tag} = await dispatch("getTagInfo", genre);
        mapping[genre] = tag;
        commit("setLoading", {name: "tagInfo", add: 1});
      }
    }));
    commit("removeLoading", "tagInfo");
    return mapping;
  },
  async getArtistTags({}, artistName){
    let response = await this.$axios.$get(
      `https://ws.audioscrobbler.com/2.0/?method=artist.gettoptags&artist=${encodeURIComponent(artistName)}&api_key=${lastFmApiKey}&format=json`,
    );

    return response;
  },
  async getTagInfo({commit}, tag){
    let response = await this.$axios.$get(
      `https://ws.audioscrobbler.com/2.0/?method=tag.getinfo&tag=${encodeURIComponent(tag)}&api_key=${lastFmApiKey}&format=json`,
    );
 
    return response;
  },
  async getSongs({commit, dispatch}){
    commit("setLoading", {name: "songs", message: "Grabbing song data...", start: 0, end: songsBatchSize});
    //Make first call to get total and such
    let {total, items: songs} = await dispatch("getSongBatch");
    commit("setLoading", {name: "songs", end: total, start: songsBatchSize});
    
    let promises = [];

    for (let offset = songsBatchSize; offset < (hardlimit || total); offset += songsBatchSize) {
      promises.push(dispatch("getSongBatch", {total, offset}));
    }

    let responses = await Promise.all(promises);
    commit("removeLoading", "songs");
    
    return [...songs, ...responses.reduce((acc, {items}) => [...acc, ...items], [])];
  },
  async getSongBatch({commit}, {total = songsBatchSize, offset = 0} = {}){
    let response = await this.$axios.$get(
      "https://api.spotify.com/v1/me/tracks?limit=50&offset=" + offset,
      {
        headers: { Authorization: "Bearer " + this.$cookies.get("accessToken")}
      }
    );
    commit("setLoading", {name: "songs", add: total - offset < songsBatchSize ? total - offset : songsBatchSize});

    return {...response, items: response.items.map((item) => item.track)};
  },
  async getArtistBatch({commit, state}, artistIds){
    let response = await this.$axios.$get(
      "https://api.spotify.com/v1/artists?limit=50&ids=" + artistIds.join(","),
      {
        headers: { Authorization: "Bearer " + this.$cookies.get("accessToken")}
      }
    );
    commit("setLoading", {name: "artists", add: artistIds.length});
    return {...response, items: response.artists};
  },
  async getArtistsGenres({commit, dispatch}, artists){
    var mapping = {};
    commit("setLoading", {name: "artistsGenres", message: "Grabbing artists genres...", start: 0, end: artists.length});
    
    const queue = new PQueue({concurrency: 5, interval: 1000, intervalCap: 20});
    await queue.addAll(artists.map(({name}) => {
      return async () => {
        let {toptags: {tag: tags = []} = []} = await dispatch("getArtistTags", name);
        
        mapping[name] = tags.slice(0, 3).flatMap(({name, count}) => {
          return count > 70 ? [name] : [];
        }, []);
      commit("setLoading", {name: "artistsGenres", add: 1});
      }
    }))
    commit("removeLoading", "artistsGenres");

    return mapping;
  },
  async getArtists({commit, dispatch}, artists){
    commit("setLoading", {name: "artists", message: "Grabbing artists...", start: 0, end: artists.length});
    let promises = [];

    for (let index = 0; index < artists.length; index += artistsBatchSize) {
      promises.push(dispatch("getArtistBatch", artists.slice(index, index + artistsBatchSize).map(({id}) => id)));
    }
    let responses = await Promise.all(promises);

    commit("removeLoading", "artists");

    return responses.reduce((acc, {items}) => {
      return [...acc, ...items]
    }, []);
  }
}

function getUniqueAlbums(songs){
  return songs.reduce((acc, {album}) => {
    return !acc.some((item) => item.id === album.id) ? [...acc, album] : acc;
  }, []);
}

function getUniqueArtists(songs){
  return songs.reduce((acc, {artists}) => {
    return [...acc, ...artists];
  }, []).reduce((acc, artist) => {
    !acc.some((item) => item.id === artist.id) && acc.push(artist);
    return acc
  }, []);
}

function getUniqueGenres(artistsGenreMapping){
  return Object.values(artistsGenreMapping).flat().reduce((acc, genre) => {
    !acc.includes(genre) && acc.push(genre);
    return acc
  }, []);
}