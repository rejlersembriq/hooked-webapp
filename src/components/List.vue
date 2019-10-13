<template>
  <div class="pa-3">
    <v-container class="mb-12">
      <v-data-iterator
        :page="iterator.page"
        :search="iterator.search"
        :sort-by="iterator.sortBy.toLowerCase()"
        :sort-desc="iterator.sortDesc"
        :items="participants"
        :items-per-page.sync="iterator.itemsPerPage"
        no-data-text="No data loaded"
        :loading="loading"
        hide-default-footer
      >
        <template v-slot:header>
          <v-row class="secondary">
            <v-col cols="12" md="6">
              <v-row class="align-center flex-nowrap mr-1">
                <v-btn dark icon class="mx-1" @click.stop="getParticipants" :loading="loading">
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
                <v-text-field
                  dark
                  v-model="iterator.search"
                  clearable
                  flat
                  solo
                  hide-details
                  prepend-inner-icon="search"
                  label="Search"
                  @keydown.enter.stop="blur"
                ></v-text-field>
              </v-row>
            </v-col>
            <v-col cols="12" md="6">
              <v-row class="align-center flex-nowrap mr-1">
                <v-btn dark icon class="mx-1" @click.stop="toggleSort">
                  <v-icon v-if="!iterator.sortDesc">mdi-arrow-up</v-icon>
                  <v-icon v-if="iterator.sortDesc">mdi-arrow-down</v-icon>
                </v-btn>
                <v-select
                  dark
                  v-model="iterator.sortBy"
                  flat
                  solo
                  hide-details
                  :items="iterator.keys"
                  prepend-inner-icon="search"
                  label="Sort by"
                ></v-select>
              </v-row>
            </v-col>
          </v-row>
        </template>

        <template v-slot:default="props">
          <v-row class="flex-column align-center flex-sm-row">
            <v-col v-for="(participant, i) in props.items" :key="i" cols="12" lg="6" md="6">
              <Participant
                :headline="participant.name"
                v-model="participants[participants.indexOf(participant)]"
              />
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
        sortBy: "",
        keys: ["Name", "Email", "Phone", "Company", "Score"]
      },
      snackbar: {
        show: false,
        timeout: 0,
        message: "",
        color: ""
      }
    };
  },

  created() {
    if (this.$store.getters.properties) {
      this.getParticipants();
    } else {
      this.$store.watch(
        () => this.$store.getters.properties,
        () => {
          this.getParticipants();
        }
      );
    }
  },

  methods: {
    getParticipants() {
      this.loading = true;
      this.$http
        .get(this.$store.getters.apiUrl + "/participants", {
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

    toggleSort() {
      this.iterator.sortDesc = !this.iterator.sortDesc;
    },

    nextPage() {
      if (this.iterator.page + 1 <= this.numberOfPages) this.iterator.page += 1;
    },

    formerPage() {
      if (this.iterator.page - 1 >= 1) this.iterator.page -= 1;
    },

    updateItemsPerPage(number) {
      this.iterator.itemsPerPage = number;
    },

    blur() {
      document.activeElement.blur();
    }
  },

  computed: {
    numberOfPages() {
      return Math.ceil(this.participants.length / this.iterator.itemsPerPage);
    }
  }
};
</script>