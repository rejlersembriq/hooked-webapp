import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
  },
  theme: {
    themes: {
      light: {
        primary: "#1a155a",
        secondary: "#2a2929",
        accent: "#ff5a1f",
      },
      dark: {
        primary: "#1a155a",
        secondary: "#2a2929",
        accent: "#ff5a1f",
      },
    },
  },
});
