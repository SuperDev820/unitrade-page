import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import Vuelidate from 'vuelidate'
import VueMask from 'v-mask'
import * as VueGoogleMaps from 'vue2-google-maps'
import VueSweetalert2 from 'vue-sweetalert2'
import VueApexCharts from 'vue-apexcharts'
import router from './router/index'
import store from './store'
import vco from "v-click-outside"
import "@/design/index.scss";
import Sparkline from 'vue-sparklines';
import { apolloProvider } from './graphql/apollo'
import TruncateVue from 'truncate-vue';
// import VueToastr2 from 'vue-toastr-2'
// import 'vue-toastr-2/dist/vue-toastr-2.min.css'

// window.toastr = require('toastr')

// Vue.use(VueToastr2)

Vue.use(BootstrapVue);
Vue.use(TruncateVue)

Vue.config.productionTip = false

Vue.use(Vuelidate);
Vue.use(VueMask)
Vue.use(VueSweetalert2)
Vue.use(require('vue-chartist'))
Vue.use(vco)
Vue.use(Sparkline)
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAbvyBxmMbFhrzP9Z8moyYr6dCr-pzjhBE',
    libraries: 'places',
  },
  installComponents: true
})
Vue.component('apexchart', VueApexCharts)

new Vue({
  router,
  store,
  apolloProvider,
  render: h => h(App),
}).$mount('#app')
