<template>
  <a-layout>
    <a-layout-header class="header">
      <nav>
        <!-- <div class="logo">Avoculus</div> -->
        <a-menu theme="dark" mode="horizontal">
          <a-menu-item @click="$router.push('/')" key="1">Genres</a-menu-item>
          <a-menu-item @click="$router.push('/favourites')" key="2">Artists</a-menu-item>
          <search />
          <a-menu-item @click="$router.push('/favourites')" key="3">Albums</a-menu-item>
          <a-menu-item @click="$router.push('/favourites')" key="4">Songs</a-menu-item>
        </a-menu>
      </nav>
    </a-layout-header>
    <a-layout-content>
      <nuxt />
    </a-layout-content>
    <a-layout-footer>© 2020 <a href="https://nl.linkedin.com/in/jbeaart">Jimmy Beaart</a> - <a href="mailto:dev@hbohub.nl">Feedback & Contact</a></a-layout-footer>
  </a-layout>
</template>

<style>
body {
  font-size: 16px;
  word-spacing: 1px;
  color: var(--light);
  box-sizing: border-box;
}

:root {
  --dark: #212121;
  --dark-lighter: #323232;
  --accent: #0d7377;
  --light: #14ffec;
}


main {
  padding: 70px 15%;
  padding-bottom: 70px;
}

.ant-menu{
  background-color: var(--dark);
}

.ant-layout-header{
  background: white;
  padding: 0px;
  height: auto;
}

.ant-layout {
  min-height: 100vh;
  background-color: var(--dark-lighter);
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
</style>
