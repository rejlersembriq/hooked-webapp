import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueQrcodeReader from 'vue-qrcode-reader';

Vue.use(VueQrcodeReader);

Vue.config.productionTip = false

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
