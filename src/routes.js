import Home from './assets/vue/pages/home.vue'

import Sidebar from './assets/vue/pages/sidebar.vue'
import Themes from './assets/vue/pages/themes.vue'

import NewAnimal from './assets/vue/pages/new-animal.vue'
import InfoAnimal from './assets/vue/pages/info-animal.vue'
import TermsAndConditions from './assets/vue/pages/terms-and-conditions.vue'
import Credits from './assets/vue/pages/credits.vue'
import Tutorial from './assets/vue/pages/tutorial.vue'

export default [
  {
    path: '/',
    component: Home
  },
  {
    path: '/new/',
    component: NewAnimal
  },
  {
    path: '/info-animal/animal/:animalId/',
    component: InfoAnimal,
    tabs: [
      // First (default) tab
      {
        path: '/',
        id: 'tab-1'
      },
      // Second tab
      {
        path: '/tab-2/',
        id: 'tab-2'
      },
      // Third tab
      {
        path: '/tab-3/',
        id: 'tab-3'
      },
      // Fourth tab
      {
        path: '/tab-4/',
        id: 'tab-4'
      }
    ]
  },
  {
    path: '/sidebar/',
    component: Sidebar
  },
  {
    path: '/themes/',
    component: Themes
  },
  {
    path: '/terms-and-conditions/',
    component: TermsAndConditions
  },
  {
    path: '/credits/',
    component: Credits
  },
  {
    path: '/tutorial/',
    component: Tutorial
  }
]
