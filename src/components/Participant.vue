<template>
  <v-card>
    <v-card-title class="accent">
      <span class="headline white--text">{{ this.headline }}</span>
      <div class="flex-grow-1"></div>
      <v-btn icon @click.stop="editable = !editable" :disabled="editable" color="white">
        <v-icon>mdi-lead-pencil</v-icon>
      </v-btn>
    </v-card-title>
    <v-form ref="form" lazy-validation>
      <v-container grid-list-sm="grid-list-sm">
        <v-layout row="row" wrap="wrap">
          <v-flex xs12>
            <v-text-field
              v-model="participantInternal.name"
              :rules="nameRules"
              prepend-icon="person"
              placeholder="Name"
              required
              :readonly="!editable"
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              v-model="participantInternal.email"
              :rules="emailRules"
              prepend-icon="mail"
              append-icon="mdi-content-copy"
              @click:append="copy(value.email)"
              placeholder="Email"
              required
              :readonly="!editable"
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              v-model="participantInternal.phone"
              :rules="phoneRules"
              type="tel"
              prepend-icon="phone"
              append-icon="mdi-content-copy"
              @click:append="copy(value.phone)"
              placeholder="Phone"
              required
              :readonly="!editable"
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              v-model="participantInternal.org"
              prepend-icon="business"
              placeholder="Company"
              :readonly="!editable"
            ></v-text-field>
          </v-flex>
          <v-flex xs1>
            <v-icon>mdi-pound</v-icon>
          </v-flex>
          <v-flex xs11>
            <v-btn icon @click.stop="decrementScore" class="mr-2">
              <v-icon dark>mdi-minus</v-icon>
            </v-btn>
            {{ this.value.score }}
            <v-btn icon @click.stop="incrementScore" class="ml-2">
              <v-icon dark>mdi-plus</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              v-model="participantInternal.comment"
              prepend-icon="notes"
              placeholder="Notes"
              :readonly="!editable"
            ></v-text-field>
          </v-flex>
          <v-flex class="my-n4" flex-row xs12>
            <v-flex class="grey--text caption">Last updated: {{ this.participantInternal.updated }}</v-flex>
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions>
        <v-btn v-if="editable" text tile color="primary" @click.end="scan = !scan">
          <v-icon left>mdi-qrcode-scan</v-icon>Scan
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn v-if="editable" text color="primary" @click.end="cancel">Cancel</v-btn>
        <v-btn v-if="editable" text @click.end="save">Save</v-btn>
      </v-card-actions>
    </v-form>

    <QrScanner
      v-on:update-participant="participantInternal = $event"
      v-on:close-scanner="scan = false"
      :showScanner="scan"
    />

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="snackbar.timeout">
      {{ this.snackbar.message }}
      <v-btn color="white" text @click="snackbar.show = false">Close</v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
import QrScanner from "./QrScanner.vue";

export default {
  name: "Participant",
  components: {
    QrScanner
  },
  props: {
    headline: String,
    value: Object
  },

  data() {
    return {
      participantInternal: {},
      editable: false,
      scan: false,
      snackbar: {
        show: false,
        timeout: 0,
        message: "",
        color: ""
      },
      nameRules: [v => !!v || "Name is required"],
      phoneRules: [v => !!v || "Phone No. is required"],
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ]
    };
  },

  created() {
    this.participantInternal = { ...this.value };
  },

  watch: {
    value: function() {
      this.participantInternal = { ...this.value };
    }
  },

  methods: {
    updateParticipant(participant) {
      this.$emit("input", { ...this.value, ...participant });
    },

    save() {
      if (this.$refs.form.validate()) {
        if (this.value.id) {
          this.putParticipant();
        } else {
          this.postParticipant();
        }
      }
    },

    postParticipant() {
      this.$http
        .post(
          this.$store.getters.apiUrl + "/participant",
          JSON.stringify(this.participantInternal),
          {
            headers: { "Content-Type": "application/json" }
          }
        )
        .then(
          result => {
            this.snackbar.show = true;
            this.snackbar.timeout = 5000;
            this.snackbar.message =
              "Participant " + result.body.name + " saved.";
            this.snackbar.color = "success";

            this.editable = false;

            this.participantInternal = { ...result.body };
            this.updateParticipant(result.body);
          },
          () => {
            this.snackbar.show = true;
            this.snackbar.timeout = 5000;
            this.snackbar.message = "Error when saving participant.";
            this.snackbar.color = "error";
          }
        );
    },

    putParticipant() {
      this.$http
        .put(
          this.$store.getters.apiUrl +
            "/participant/" +
            this.participantInternal.id,
          JSON.stringify(this.participantInternal),
          {
            headers: { "Content-Type": "application/json" }
          }
        )
        .then(
          result => {
            this.snackbar.show = true;
            this.snackbar.timeout = 5000;
            this.snackbar.message =
              "Participant " + result.body.name + " saved.";
            this.snackbar.color = "success";

            this.editable = false;

            this.participantInternal = { ...result.body };
            this.updateParticipant(result.body);
          },
          () => {
            this.snackbar.show = true;
            this.snackbar.timeout = 5000;
            this.snackbar.message = "Error when saving participant.";
            this.snackbar.color = "error";
          }
        );
    },

    incrementScore() {
      this.putScore(this.value.score + 1);
    },

    decrementScore() {
      if (this.value.score > 0) {
        this.putScore(this.value.score - 1);
      }
    },

    putScore(score) {
      this.$http
        .put(
          this.$store.getters.apiUrl +
            "/participant/" +
            this.participantInternal.id,
          JSON.stringify({ score: score }),
          {
            headers: { "Content-Type": "application/json" }
          }
        )
        .then(
          result => {
            this.snackbar.show = true;
            this.snackbar.timeout = 5000;
            this.snackbar.message =
              "Score set to " + result.body.score + " for " + result.body.name;
            this.snackbar.color = "success";

            this.participantInternal = { ...result.body };
            this.updateParticipant(result.body);
          },
          () => {
            this.snackbar.show = true;
            this.snackbar.timeout = 5000;
            this.snackbar.message = "Error when updating score.";
            this.snackbar.color = "error";
          }
        );
    },

    cancel() {
      this.editable = false;

      this.participantInternal = { ...this.value };
    },

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
