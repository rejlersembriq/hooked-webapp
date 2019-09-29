import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import VueResource from 'vue-resource'
import Vuex from 'vuex'
import VueQrcodeReader from 'vue-qrcode-reader'

Vue.use(VueResource);
Vue.use(Vuex);
Vue.use(VueQrcodeReader);

Vue.config.productionTip = false

const store = new Vuex.Store({
  state: {
    properties: null,
  },
  mutations: {
    setProperties(state, properties) {
      state.properties = properties;
    }
  }
})

new Vue({
  vuetify,
  store,
  created() {
    this.$http.get("properties.json").then(response => {
      this.$store.commit("setProperties", response.body);
    }, () => { });
  },
  render: h => h(App)
}).$mount('#app')
