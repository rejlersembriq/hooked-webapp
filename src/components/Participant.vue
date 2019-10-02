<template>
  <v-card>
    <v-card-title class="accent">
      <span class="headline white--text">{{ participant.name }}</span>
      <div class="flex-grow-1"></div>
      <v-btn icon @click.stop color="white">
        <v-icon>mdi-lead-pencil</v-icon>
      </v-btn>
    </v-card-title>
    <v-list>
      <v-list-item>
        <v-list-item-action>
          <v-icon>mdi-email</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ participant.email }}</v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon @click.stop="copy(participant.email)" class="mr-2">
            <v-icon>mdi-content-copy</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
      <v-divider inset="inset"></v-divider>
      <v-list-item>
        <v-list-item-action>
          <v-icon>mdi-phone</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ participant.phone }}</v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-btn icon @click.stop="copy(participant.phone)" class="mr-2">
            <v-icon>mdi-content-copy</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
      <v-divider inset="inset"></v-divider>
      <v-list-item>
        <v-list-item-action>
          <v-icon>mdi-office-building</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ participant.org }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-action>
          <v-icon>mdi-pound</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>
            <v-btn icon @click.stop class="mr-2">
              <v-icon dark>mdi-minus</v-icon>
            </v-btn>
            {{ participant.score }}
            <v-btn icon @click.stop class="ml-2">
              <v-icon dark>mdi-plus</v-icon>
            </v-btn>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout">
      {{ this.snackbar.message }}
      <v-btn color="white" text @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
export default {
  name: "Participant",
  props: {
    participant: Object
  },

  data() {
    return {
      snackbar: {
        show: false,
        timeout: 0,
        message: "",
        color: ""
      }
    };
  },

  methods: {
    copy(str) {
      // Create new element
      var el = document.createElement("textarea");
      // Set value (string to be copied)
      el.value = str;
      // Set non-editable to avoid focus and move outside of view
      el.setAttribute("readonly", "");
      el.style = { position: "absolute", left: "-9999px" };
      document.body.appendChild(el);
      // Select text inside element
      el.select();
      // Copy text to clipboard
      document.execCommand("copy");
      // Remove temporary element
      document.body.removeChild(el);

      this.snackbar.show = true;
      this.snackbar.color = "primary";
      this.snackbar.timeout = 3000;
      this.snackbar.message = "Copied to clipboard";
    }
  }
};
</script>
