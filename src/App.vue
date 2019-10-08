<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app mini-variant>
      <v-list dense>
        <v-list-item to="/">
          <v-list-item-action>
            <v-icon>mdi-account-plus</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>First</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="List">
          <v-list-item-action>
            <v-icon>mdi-account-multiple</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Second</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item to="Winner">
          <v-list-item-action>
            <v-icon>mdi-podium-gold</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>Third</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app class="primary" dark="dark">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="hidden-sm-and-down">
        <span>Hooked</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div class="flex-grow-1"></div>
      <img src="./assets/rejlers.svg" class="hidden-md-and-down" style="height: 22px" />
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>

    <AddParticipant />
  </v-app>
</template>

<script>
import AddParticipant from "./components/AddParticipant.vue";

export default {
  name: "Hooked",
  components: {
    AddParticipant
  },
  data: () => ({
    drawer: null
  })
};
</script>
