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
              :value="value.name"
              @input="updateName"
              :rules="nameRules"
              prepend-icon="person"
              placeholder="Name"
              required
              :readonly="!editable"
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              :value="value.email"
              @input="updateEmail"
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
              :value="value.phone"
              @input="updatePhone"
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
              :value="value.org"
              @input="updateOrg"
              prepend-icon="business"
              placeholder="Company"
              :readonly="!editable"
            ></v-text-field>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              :value="value.comment"
              @input="updateComment"
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
    value: Object
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
    this.participantInternal = { ...this.value };
  },

  methods: {
    updateName(str) {
      this.updateValue("name", str);
    },

    updateEmail(str) {
      this.updateValue("email", str);
    },

    updatePhone(str) {
      this.updateValue("phone", str);
    },

    updateOrg(str) {
      this.updateValue("org", str);
    },

    updateComment(str) {
      this.updateValue("comment", str);
    },

    updateValue(key, value) {
      this.$emit("input", { ...this.value, [key]: value });
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
          this.$store.state.properties.ApiUrl + "/participant",
          JSON.stringify(this.value),
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
            this.$emit("input", { ...this.value, ...result.body });
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
          this.$store.state.properties.ApiUrl + "/participant/" + this.value.id,
          JSON.stringify(this.value),
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
            this.$emit("input", { ...this.value, ...result.body });
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

      this.$emit("input", { ...this.value, ...this.participantInternal });
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