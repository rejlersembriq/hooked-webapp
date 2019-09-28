<template>
  <div>
    <v-dialog v-model="dialog" width="800px">
      <v-card>
        <v-card-title class="accent">
          <span class="headline white--text">Add Participant</span>
          <div class="flex-grow-1"></div>
          <v-btn large icon @click.stop color="white">
            <v-icon>mdi-qrcode-scan</v-icon>
          </v-btn>
        </v-card-title>
        <v-form ref="form" lazy-validation>
          <v-container grid-list-sm="grid-list-sm">
            <v-layout row="row" wrap="wrap">
              <v-flex xs12>
                <v-text-field
                  v-model="participant.name"
                  :rules="nameRules"
                  prepend-icon="person"
                  placeholder="Name"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="participant.email"
                  :rules="emailRules"
                  prepend-icon="mail"
                  placeholder="Email"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="participant.phone"
                  :rules="phoneRules"
                  type="tel"
                  prepend-icon="phone"
                  placeholder="Phone"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="participant.org"
                  prepend-icon="business"
                  placeholder="Company"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-model="participant.comment"
                  prepend-icon="notes"
                  placeholder="Notes"
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="cancel">Cancel</v-btn>
            <v-btn text @click="save">Save</v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <v-btn large bottom color="pink" dark fab fixed right @click.end="dialog = true">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<script>
export default {
  name: "AddParticipant",
  data() {
    return {
      dialog: false,
      participant: {},
      nameRules: [v => !!v || "Name is required"],
      phoneRules: [v => !!v || "Phone No. is required"],
      emailRules: [
        v => !!v || "E-mail is required",
        v => /.+@.+\..+/.test(v) || "E-mail must be valid"
      ]
    };
  },
  methods: {
    save() {
      if (this.$refs.form.validate()) {
        this.dialog = false;
        this.reset();
      }
    },
    cancel() {
      this.dialog = false;
      this.reset();
    },
    reset() {
      this.$refs.form.reset();
    }
  }
};
</script>