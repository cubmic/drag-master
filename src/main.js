import Vue from 'vue'
import App from './App.vue'

import { drag } from './directives/drag.js'
Vue.directive('drag', drag)
import { drop } from './directives/drop.js'
Vue.directive('drop', drop)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
