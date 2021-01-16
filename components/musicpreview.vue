<template>
  <div class="musicpreview">
    <div @click="link && $router.push(link)" :style="{backgroundImage: `url(${imageurls[0]}), url(${imageurls[1]}), url(${imageurls[2]}), url(${imageurls[3]})`}" :class="'image' + imageurls.length">
      <div class="controls">
        <a-icon width="50%" type="play-circle" theme="filled" :style="{fontSize: '40px'}"/>
      </div>
    </div>
    <span>{{ name }}</span>
  </div>
</template>

<script>
export default {
  props:{
    name: String,
    imageurls: Array,
    link: String,
  }
}
</script>
<style lang="scss">
.musicpreview {
  width: 10vw;
  margin: 10px;
  text-align: center;
  div {
    position: relative;
    background-repeat: no-repeat;
    background-position: top left, top right, bottom left, bottom right;
    background-size: 50% 50%;
    display: block;
    width: 10vw;
    height: 10vw;
    border-radius: 5%;
    margin-bottom: 10px;
  }

  .image4 {
    background-position: top left, top right, bottom left, bottom right;
    background-size: 50% 50%;
  }

  .image3 {
    background-position: top left, top right, 0 2.5vw;
    background-size: 50% 50%, 50% 50%, 100% 100%;
  }

  .image2 {
    background-position: 0% 5vw, 0 -2.5vw;
    background-size: cover, cover;
  }
  .image1 {
    background-size: cover;
  }
  span {
    padding-top: 10px;
    display: inline-block;
    text-transform: capitalize;
  }
}
</style>
