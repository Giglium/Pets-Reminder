// Import Vue
import Vue from 'vue'

// Import Framework7
import Framework7 from 'framework7/framework7.esm.bundle'

// Import F7 Vue Plugin
import Framework7Vue from 'framework7-vue/framework7-vue.esm.bundle.js'

// Import F7 Style
import 'framework7/css/framework7.bundle.min.css'

// Import F7 iOS Icons
import 'framework7-icons/css/framework7-icons.css'

// Import Material Icons
import 'material-design-icons/iconfont/material-icons.css'

// Import Fontawesome Theme Styles
import '@fortawesome/fontawesome-free/css/all.min.css'

// Import fastClick
import FastClick from 'fastclick'

// Import App Custom Styles
import './assets/sass/style.scss'

// Import App Component
import app from './main.vue'

// Import Application Controller
import applicationFacades from './assets/js/applicationFacades'

// Different F7-Vue plugin initialization with f7 v3.0
Framework7.use(Framework7Vue)

// Bind all the application events
applicationFacades.bindEvents()

// Get the current i18n object
const i18n = applicationFacades.getI18n()

// Init Vue App
export default new Vue({
  // Root Element
  el: '#app',
  i18n,
  render: (c) => c('app'),
  components: {
    app
  },
  mounted () {
    window.addEventListener('load', () => {
      // run after everything is in-place
      FastClick.attach(document.body)
    })
  }
})
