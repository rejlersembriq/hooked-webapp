<template>
  <v-card>
    <v-card-title class="accent">
      <span class="headline white--text">{{ headline }}</span>
      <div class="flex-grow-1"></div>
      <v-btn icon @click.stop="editable = !editable" color="white">
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
          <v-flex xs12>
            <v-text-field
              v-model="participantInternal.comment"
              prepend-icon="notes"
              placeholder="Notes"
              :readonly="!editable"
            ></v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-if="editable" text color="primary" @click.end="cancel">Cancel</v-btn>
        <v-btn v-if="editable" text @click.end="save">Save</v-btn>
      </v-card-actions>
    </v-form>
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
    headline: String,
    participant: Object
  },

  data() {
    return {
      participantInternal: {},
      editable: false,
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
    this.participantInternal = this.copyObj(this.participant);
  },

  methods: {
    save() {
      if (this.$refs.form.validate()) {
        if (this.participant.id) {
          this.putParticipant();
        } else {
          this.postParticipant();
        }
      }
    },

    postParticipant() {
      this.$http
        .post(
          this.$store.state.properties.ApiUrl + "/participant",
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
              "Participant " + this.participant.name + " saved.";
            this.snackbar.color = "success";

            this.dialog = false;
            this.editable = false;
            this.participantInternal = result.body;

            this.$emit("update-participant", this.participantInternal);
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
          this.$store.state.properties.ApiUrl +
            "/participant/" +
            this.participant.id,
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
              "Participant " + this.participant.name + " saved.";
            this.snackbar.color = "success";

            this.dialog = false;
            this.editable = false;
            this.participantInternal = result.body;

            this.$emit("update-participant", this.participantInternal);
          },
          () => {
            this.snackbar.show = true;
            this.snackbar.timeout = 5000;
            this.snackbar.message = "Error when saving participant.";
            this.snackbar.color = "error";
          }
        );
    },

    cancel() {
      this.editable = false;
      this.participantInternal = this.copyObj(this.participant);

      this.$emit("update-participant", this.participantInternal);
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
    },

    copyObj(from) {
      let copyStr = JSON.stringify(from);
      return JSON.parse(copyStr);
    }
  }
};
</script>
