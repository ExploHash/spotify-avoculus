export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'spotifyapp',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      {
        src: 'https://sdk.scdn.co/spotify-player.js'
      }
    ],
  },
  env: {
    LAST_FM_API_KEY: process.env.LAST_FM_API_KEY,
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  },
  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
    'ant-design-vue/dist/antd.css'
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '@/plugins/antd-ui'
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: ['@nuxtjs/axios', 'cookie-universal-nuxt'],

  serverMiddleware: [{ path: '/api', handler: '~/api/api.js' },],

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    extend (config, { isDev, isClient }) {
      config.node = {
        fs: 'empty',
        net: 'empty'
      }
    }
  }
}
