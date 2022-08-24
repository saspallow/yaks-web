import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import axios from 'axios'
import VueAxios from 'vue-axios'

// import { ethers } from "ethers";
import ethers from "./plugins/ethers.js";

Vue.use(VueAxios, axios)
Vue.use(Buefy)
Vue.use(ethers);

Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");

