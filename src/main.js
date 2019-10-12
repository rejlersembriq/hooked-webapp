import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import vuetify from './plugins/vuetify'
import VueResource from 'vue-resource'
import Vuex from 'vuex'
import VueQrcodeReader from 'vue-qrcode-reader'

Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(Vuex);
Vue.use(VueQrcodeReader);

Vue.config.productionTip = false

const routes = [
  { name: 'front', path: '/', component: () => import('./components/Front.vue') },
  { name: 'list', path: '/List/', component: () => import('./components/List.vue') },
  { name: 'winner', path: '/Winner/', component: () => import('./components/Winner.vue') },
  { name: '404', path: '*', component: () => import('./components/Error404.vue') },
];

const router = new VueRouter({ routes });

const store = new Vuex.Store({
  state: {
    properties: null,
  },
  getters: {
    properties: state => state.properties,
    apiUrl: state => state.properties.ApiUrl,
  },
  mutations: {
    setProperties(state, properties) {
      state.properties = properties;
    }
  }
})

new Vue({
  router,
  vuetify,
  store,
  created() {
    this.$http.get("properties.json").then(response => {
      this.$store.commit("setProperties", response.body);
    }, () => { });
  },
  render: h => h(App)
}).$mount('#app')
