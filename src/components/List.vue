<template>
  <div class="pa-3">
    <v-btn class="mr-2" @click.stop="getParticipants" :loading="loading">Show All</v-btn>

    <v-container v-if="participants.length > 0" class="mb-12">
      <v-data-iterator
        :page="iterator.page"
        :items="participants"
        :items-per-page.sync="iterator.itemsPerPage"
        no-data-text="No data loaded"
        :loading="loading"
        hide-default-footer
      >
        <template v-slot:default="props">
          <v-row class="flex-column align-center flex-sm-row">
            <v-col v-for="(participant, i) in props.items" :key="i" cols="12" lg="6" md="6">
              <Participant :headline="participant.name" v-model="participants[i]" />
            </v-col>
          </v-row>
        </template>

        <template v-slot:footer>
          <v-row class="mt-2" align="center" justify="center">
            <span class="grey--text">Items per page</span>
            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-btn dark text color="primary" class="ml-2" v-on="on">
                  {{ iterator.itemsPerPage }}
                  <v-icon>mdi-chevron-down</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(number, index) in iterator.itemsPerPageOptions"
                  :key="index"
                  @click="updateItemsPerPage(number)"
                >
                  <v-list-item-title>{{ number }}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

            <div class="flex-grow-1"></div>

            <span class="mr-4 grey--text">Page {{ iterator.page }} of {{ numberOfPages }}</span>
            <v-btn small fab dark class="secondary mr-1" @click="formerPage">
              <v-icon>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn small fab dark class="secondary ml-1" @click="nextPage">
              <v-icon>mdi-chevron-right</v-icon>
            </v-btn>
          </v-row>
        </template>
      </v-data-iterator>
    </v-container>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout">
      {{ this.snackbar.message }}
      <v-btn color="white" text @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import Participant from "./Participant.vue";

export default {
  name: "List",
  components: {
    Participant
  },

  data() {
    return {
      participants: [],
      loading: false,
      iterator: {
        search: "",
        itemsPerPageOptions: [5, 10, 15, 30, 50],
        filter: {},
        sortDesc: false,
        page: 1,
        itemsPerPage: 10,
        sortBy: "name"
      },
      snackbar: {
        show: false,
        timeout: 0,
        message: "",
        color: ""
      }
    };
  },

  methods: {
    getParticipants() {
      this.loading = true;
      this.$http
        .get(this.$store.state.properties.ApiUrl + "/participants", {
          headers: { "Content-Type": "application/json" }
        })
        .then(
          response => {
            this.cardVisible = true;

            this.participants = response.body;

            this.loading = false;
          },
          () => {
            this.participants = {};

            this.snackbar.show = true;
            this.snackbar.timeout = 5000;
            this.snackbar.message = "Error getting participants";
            this.snackbar.color = "error";

            this.loading = false;
          }
        );
    },

    nextPage() {
      if (this.iterator.page + 1 <= this.numberOfPages) this.iterator.page += 1;
    },

    formerPage() {
      if (this.iterator.page - 1 >= 1) this.iterator.page -= 1;
    },

    updateItemsPerPage(number) {
      this.iterator.itemsPerPage = number;
    }
  },

  computed: {
    numberOfPages() {
      return Math.ceil(this.participants.length / this.iterator.itemsPerPage);
    }
  }
};
</script>